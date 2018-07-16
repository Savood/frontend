import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {env} from "../../environment/environment";
import {Offering} from "../../models/offering";
import {OfferingsService, UsersService} from "../../providers";
import {MapsService} from "../../providers/maps/maps";
import {Location} from "../../models/location";
import {SuccessObject} from "../../models/successObject";
import {User} from "../../models/user";
import {TranslateService} from "@ngx-translate/core";
import {SocialSharing} from "@ionic-native/social-sharing";
import {ClipboardService} from "ngx-clipboard";
import {LaunchNavigator} from "@ionic-native/launch-navigator";
import {DomSanitizer} from "@angular/platform-browser";
import {AuthProvider} from "../../providers/auth/auth";

@IonicPage(
  {
    segment: 'savood/:offeringId'
  })
@Component({
  selector: 'page-item-detail',
  templateUrl: 'offering-detail.html'
})
export class OfferingDetailPage {
  @ViewChild('map') mapElement: ElementRef;

  offering: Offering;
  whichtab: string;

  own_offering: boolean;

  image;
  avatar;

  distanceString: string;
  current_location: Location = null;
  browser_local = null;


  delete_offering_title: string = null;
  delete_offering_placeholder: string = null;
  delete_offering_confirm: string = null;
  delete_offering_cancel: string = null;
  delete_offering_wrong_text: string = null;
  delete_offering_successful: string = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _offering: OfferingsService,
              public toastCtrl: ToastController,
              public _maps: MapsService,
              public _clipboard: ClipboardService,
              public platform: Platform,
              private _social: SocialSharing,
              public _user: UsersService,
              private launchNavigator: LaunchNavigator,
              public _translate: TranslateService,
              private _sanitizer: DomSanitizer,
              private alertCtrl: AlertController,
              private _toast: ToastController,
              private _auth: AuthProvider
  ) {
    this.offering = navParams.get('offering');
    this.own_offering = this._auth.isActiveUser(this.offering.creator);

    this.getImageSource(this.offering);
    this.getUserAvatar(this.offering.creator);
    this.browser_local = navParams.get('browser_lang');
    if (!this.browser_local) {
      this.browser_local = this._translate.getBrowserLang();
    }



    this._translate.get([
      'DELETE_OFFERING_TITLE', 'DELETE_OFFERING_SUCCESSFUL', 'DELETE_OFFERING_WRONG_TEXT', 'DELETE_OFFERING_PLACEHOLDER', 'DELETE_OFFERING_CONFIRM', 'DELETE_OFFERING_CANCEL'
    ]).subscribe(data => {
      this.delete_offering_cancel = data.DELETE_OFFERING_CANCEL;
      this.delete_offering_placeholder = data.DELETE_OFFERING_PLACEHOLDER;
      this.delete_offering_title = data.DELETE_OFFERING_TITLE;
      this.delete_offering_confirm = data.DELETE_OFFERING_CONFIRM;
      this.delete_offering_wrong_text = data.DELETE_OFFERING_WRONG_TEXT;
      this.delete_offering_successful = data.DELETE_OFFERING_SUCCESSFUL;
    });

  }

  async ionViewWillEnter() {
    this.whichtab = "info";
    this.current_location = await this._maps.getGPS();
    await this.getDistanceString(this.offering);

  }

  onSegmentChanged() {

  }

  ionViewDidEnter() {
    this.initMap();
  }

  initMap() {
    let offering = this.offering;

    this._maps.initMap(this.mapElement, {
      latitude: offering.location.coordinates[1],
      longitude: offering.location.coordinates[0]
    });
    this._maps.newMarker({
      latitude: offering.location.coordinates[1],
      longitude: offering.location.coordinates[0]
    }, offering.name, false, 'offering').then(
      () => {
      });
  }

  getImageSource(offering: Offering) {
    return this._offering.offeringsIdImageJpegGet(offering._id).subscribe(
      (data) => {
        this.image = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      }
    );
  }

  getUserAvatar(user: User) {
    return this._user.usersIdImageJpegGet(user._id).subscribe(
      (data) => {
        this.avatar = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      }
    );
  }

  sharePage() {
    let route: string[] = this.platform.url().split('/');

    route.splice(0, route.indexOf('savood'));

    let shareUrl: string = 'savood.app.chd.cx/#';

    for (let part of route) {
      shareUrl += '/' + part;
    }

    if (this.platform.is('cordova') &&
      (this.platform.is('ios') || this.platform.is('android'))) {
      this._social.share('', '', '', shareUrl)
    } else {
      this._clipboard.copyFromContent(shareUrl);
      this.toastCtrl.create({
        position: 'top',
        message: shareUrl,
        duration: 3000
      }).present();
    }
  }

  placeSavood() {
    this._offering.placeSavood(this.offering._id).subscribe((data: SuccessObject) => {
      if (data.success)
        console.log("Wuhu");
    }, (err) => {
      console.log(err);
    });
  }

  getDistanceString(item): void {
    let dist = this._maps.getDistance(this.current_location, this._offering.changeOfferingLocationToLocation(item.location));
    this.distanceString = `${dist.amount} ${dist.unit}`;
  }

  openMapsNavigation() {
    if (this.platform.is('cordova')) {
      this.launchNavigator.navigate(this.offering.location.coordinates, {
        app: this.launchNavigator.APP.USER_SELECT
      });
    } else {
      window.open("https://www.google.com/maps/dir/?api=1" +
        "&destination=" + this.offering.location.coordinates[1] + "," this.offering.location.coordinates[0],
        "_blank");
    }
  }

  goToCreator(user: User){
    this.navCtrl.push('SettingsPage', {profileId: user._id, pageTitleKey: 'PROFILE_TITLE'});
  }



  showDeleteOfferingDialog() {
    let item = this.offering;
    let alert = this.alertCtrl.create({
      title: this.delete_offering_title,
      inputs: [
        {
          name: 'text',
          placeholder: this.delete_offering_placeholder,
          type: 'text'
        }
      ],
      buttons: [
        {
          text: this.delete_offering_cancel,
          role: 'cancel'
        },
        {
          text: this.delete_offering_confirm,
          handler: data => {
            let text: string = data.text;
            text = text.toLowerCase().trim();
            let val_text: string = this.delete_offering_placeholder.toLowerCase().trim();
            if (val_text === text) {
              this.deleteOffering(item);
            } else {
              this.revokeDeletionOfOffering();
            }
          }
        }
      ]
    });
    alert.present();
  }

  deleteOffering(item: Offering) {
    this._offering.deleteOfferingById(item._id).subscribe(() => {
      let toast = this._toast.create({
        message: this.delete_offering_successful,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });

  }

  revokeDeletionOfOffering() {

    let toast = this._toast.create({
      message: this.delete_offering_wrong_text,
      duration: 3000,
      position: 'top'
    });
    toast.present();

  }

}
