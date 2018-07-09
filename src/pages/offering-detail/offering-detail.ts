import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {env} from "../../environment/environment";
import {Offering} from "../../models/offering";
import {OfferingsService} from "../../providers";
import {MapsService} from "../../providers/maps/maps";
import {Location} from "../../models/location";
import {SuccessObject} from "../../models/successObject";
import {User} from "../../models/user";
import {TranslateService} from "@ngx-translate/core";
import {SocialSharing} from "@ionic-native/social-sharing";
import {ClipboardService} from "ngx-clipboard";

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

  distanceString: string;
  current_location: Location = null;
  browser_local = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _offering: OfferingsService,
              public toastCtrl: ToastController,
              public _maps: MapsService,
              public _clipboard: ClipboardService,
              public platform: Platform,
              private _social: SocialSharing,
              public _translate: TranslateService) {
    this.offering = navParams.get('offering');
    this.browser_local = navParams.get('browser_lang');
    if (!this.browser_local) {
      this.browser_local = this._translate.getBrowserLang();
    }
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
      latitude: offering.location.coordinates[0],
      longitude: offering.location.coordinates[1]
    });
    this._maps.newMarker({
      latitude: offering.location.coordinates[0],
      longitude: offering.location.coordinates[1]
    }, offering.name, false).then(
      () => {
      });
  }

  getImageSource(item: Offering) {
    return `${env.api_endpoint}/offerings/${item._id}/image.jpeg:`;
  }

  getUserAvatarPath(user: User) {
    return `${env.api_endpoint}/users/${user._id}/image.jpeg:`;
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
      window.open("https://www.google.com/maps/dir/?api=1" +
        "&destination=" + this.offering.location.coordinates,
        "_blank");
    } else {
      window.open("https://www.google.com/maps/dir/?api=1" +
        "&destination=" + this.offering.location.coordinates,
        "_blank");
    }
  }
}
