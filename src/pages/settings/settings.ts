import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {
  App,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  ToastController
} from 'ionic-angular';

import {MapsService} from "../../providers/maps/maps";
import {UsersService} from '../../providers';
import {User} from "../../models/user";
import {AuthProvider} from "../../providers/auth/auth";
import {LoginPage} from "../login/login";
import {SocialSharing} from "@ionic-native/social-sharing";
import {ClipboardService} from "ngx-clipboard";
import {Camera} from "@ionic-native/camera";
import {DomSanitizer} from "@angular/platform-browser";

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage(
  {
    segment: 'profile/:profileId'
  }
)
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  @ViewChild('map') mapElement: ElementRef;

  // Our local settings object
  ownProfile: boolean = false;
  profile: User;
  profileChanged = (newSettings: User) => {
    this.phoneSettings.profile
      = this.nameDescSettings.profile
      = this.profile
      = newSettings;
  };

  imageChanged = () => {
    this.getUserAvatar(this.profile);
    this.getUserHeader(this.profile);
  };

  avatar;
  header;

  locationMarker: any;

  options: any;

  phoneForm: FormGroup;
  locationForm: FormGroup;
  nameDescForm: FormGroup;

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS.TITLE';
  pageTitle: string;

  // emailSettings = {
  //   page: 'email',
  //   pageTitleKey: 'SETTINGS_EMAIL',
  //   profile: this.profile,
  //   profileChanged: this.profileChanged
  // };

  locationSettings = {
    page: 'location',
    pageTitleKey: 'SETTINGS.LOCATION',
    profile: this.profile,
    profileId: '',
    profileChanged: this.profileChanged
  };

  phoneSettings = {
    page: 'phone',
    pageTitleKey: 'SETTINGS.PHONE',
    profile: this.profile,
    profileId: '',
    profileChanged: this.profileChanged
  };

  nameDescSettings = {
    page: 'nameDesc',
    pageTitleKey: 'SETTINGS.NAME_DESC',
    profile: this.profile,
    profileId: '',
    profileChanged: this.profileChanged
  };

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public _clipboard: ClipboardService,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public translate: TranslateService,
              public camera: Camera,
              public _user: UsersService,
              public _maps: MapsService,
              public loadingCtrl: LoadingController,
              public platform: Platform,
              public _auth: AuthProvider,
              private app: App,
              private _social: SocialSharing,
              private _sanitizer: DomSanitizer) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;
    this.profile = this.navParams.get('profile') || this.profile;
    this.profileChanged = this.navParams.get('profileChanged') || this.profileChanged;

    this.ownProfile = this._auth.isActiveUser({_id: this.navParams.get('profileId')});

    if (!this.profile && this.page == "main") {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        enableBackdropDismiss: true
      });
      loading.present();

      this._user.getUserById(this.navParams.get('profileId')).subscribe(
        (profile) => {
          if (this.ownProfile) {
            this.locationSettings.profile
              = this.phoneSettings.profile
              = this.nameDescSettings.profile
              = this.profile
              = profile;

            this.locationSettings.profileId
              = this.phoneSettings.profileId
              = this.nameDescSettings.profileId
              = profile._id;

            this.getUserAvatar(this.profile);
            this.getUserHeader(this.profile);
          } else {
            this.profile = profile;
            this.getUserAvatar(this.profile);
            this.getUserHeader(this.profile);
          }
          loading.dismiss();
        }
      );
    }

    // if (this.navParams.get('page') == 'email') {
    //   this.emailForm = this.formBuilder.group({
    //     email: [this.profile.email]
    //   });
    // }

    if (this.navParams.get('page') == 'phone') {
      this.phoneForm = this.formBuilder.group({
        phone: [this.profile.phone]
      });
    }

    if (this.navParams.get('page') == 'nameDesc') {
      this.nameDescForm = this.formBuilder.group({
        firstname: [this.profile.firstname],
        lastname: [this.profile.lastname],
        description: [this.profile.description],
      });
    }

    if (this.navParams.get('page') == 'location') {
      this.locationForm = this.formBuilder.group({
        street: [this.profile.address ? this.profile.address.street : ''],
        number: [this.profile.address ? this.profile.address.number : ''],
        zip: [this.profile.address ? this.profile.address.zip : ''],
        city: [this.profile.address ? this.profile.address.city : ''],
      });
      this.locationForm.markAsDirty();
    }

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    });
  }

  ionViewDidEnter() {
    if (this.navParams.get('page') == 'location') {
      this.initMap();
    }
  }

  initMap() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      enableBackdropDismiss: true
    });
    loading.present();
    this._maps.getGPS().then(
      (position) => {
        this._maps.initMap(this.mapElement, {latitude: position.latitude, longitude: position.longitude});
        loading.dismiss();
        this._maps.newMarker(
          {latitude: position.latitude, longitude: position.longitude}, null, true).then(
          (marker) => {
            this.locationMarker = marker;
            this.usePointerLocation();
            this._maps.addListener(this.locationMarker, 'dragend', () => this.usePointerLocation());
          });
      }
    )
  }

  usePointerLocation() {
    this._maps.getAddress(this._maps.getMarkerPosition(this.locationMarker)).then(
      (address) => {
        this.locationForm.setValue(address);
        this.profile.address = address;
      },
      (error) => {
        this.translate.get(error).subscribe((res) => {
          alert(res)
        });
      }
    );
  }

  useEnteredLocation() {
    let formattedAddress: string =
      this.profile.address.street + " " +
      this.profile.address.number + ", " +
      this.profile.address.zip + " " +
      this.profile.address.city;

    this._maps.getLocation(formattedAddress).then(
      (location) => {
        this._maps.setMarkerPosition(this.locationMarker, location);
      },
      (error) => {
        this.translate.get(error).subscribe((res) => {
          alert(res)
        });
      }
    );
  }

  saveData(form: FormGroup) {
    let newSettings = {};
    Object.assign(newSettings, this.profile, form.value);
    if (form.dirty) {
      this._user.updateUserById(this.profile._id, form.value).subscribe(
        () => {
          this.profileChanged(newSettings);
          this.navCtrl.pop().then();
          this.translate.get("SAVE_SUCCESSFUL").subscribe((message) => {
            this.toastCtrl.create({
              position: 'top',
              message: message,
              duration: 3000
            }).present();
          });
        },
        () => {
          this.translate.get("SAVE_SERVER_ERROR").subscribe((message) => {
            this.toastCtrl.create({
              position: 'top',
              message: message,
              duration: 3000
            }).present();
          });
        });
    } else {
      this.navCtrl.pop();
      this.translate.get("SAVE_NO_CHANGE").subscribe((message) => {
        this.toastCtrl.create({
          position: 'top',
          message: message,
          duration: 3000
        }).present();
      });
    }
  }

  getPicture() {
    this.navCtrl.push('WebUploadPage', {type: 'avatar', callback: this.imageChanged, userId: this.profile._id});
  }

  logout() {
    this._auth.logout();
    this.app.getRootNav().setRoot(LoginPage, {"LOGGED_OUT": true});
  }

  sharePage() {
    let route: string[] = this.platform.url().split('/');

    route.splice(0, route.indexOf('profile'));

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
        message: "URL kopiert!",
        duration: 5000
      }).present();
    }
  }

  getUserHeader(user: User) {
    return this._user.usersIdBackgroundimageJpegGet(user._id).subscribe(
      (data) => {
        this.header = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
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

  getBadgeType(badge: string) {
    let badgeType: string = badge.split('_')[0];
    switch (badgeType) {
      case 'SAVOOD':
        return 'restaurant';
      case 'MESSAGE':
        return 'mail';
      case 'OFFERING':
        return 'globe';
      default:
        return 'help';
    }
  }

  showBadgeInfo(badge: string) {
    let key: string = 'BADGES.' + badge;
    this.translate.get(key).subscribe(
      (badgeText) => {
        this.toastCtrl.create({
          position: 'top',
          message: badgeText,
          duration: 3000
        }).present();
      }
    )
  }
}
