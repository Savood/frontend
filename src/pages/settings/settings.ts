import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {
  AlertController,
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
 * The Settings page is a fairly complicated and well designed page to fulfill two purposes: Settings and Profile
 * For every user who is not you, this page shows the general information about the user
 * For yourself, this page displays you general information, as well as all subsettings pages and a logout button
 * This difference is mostly handled by the ownProfile variable which is set based on the id of profile compared to
 * the id of the currently logged in user
 * The display of the subSettings is handled by Navparams which specify which page to display
 * This makes for a fairly complicated HTML which is documented as well (on a high level)
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

  /**
   * SubSettings objects which ae passed as NavParams and filter the needed elements
   */
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

  translated: any;

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
              private alertCtrl: AlertController,
              private _social: SocialSharing,
              private _translate: TranslateService,
              private _sanitizer: DomSanitizer) {

    this._translate.get([
      'SETTINGS.DELETE.TITLE', 'SETTINGS.DELETE.SUCCESSFUL', 'SETTINGS.DELETE.WRONG_TEXT', 'SETTINGS.DELETE.PLACEHOLDER', 'SETTINGS.DELETE.CONFIRM', 'SETTINGS.DELETE.CANCEL'
    ]).subscribe(
      (data) => {
        console.log(data);
        this.translated = data;
      },
      (err) => console.log(err)
    );
  }

  /**
   * Does all the basic NavParams handling before the Page is entered
   * Checks for ownProfile
   * Loads data based on the page that is currently displayed
   */
  ionViewWillEnter() {
    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;
    this.profile = this.navParams.get('profile') || this.profile;
    this.profileChanged = this.navParams.get('profileChanged') || this.profileChanged;

    if (this.navParams.get('ownProfile') != null) {
      console.log(this.navParams.get('ownProfile'));
      this.ownProfile = this.navParams.get('ownProfile');
    } else {
      this.ownProfile = this._auth.isActiveUser({_id: this.navParams.get('profileId')});
    }

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

  /**
   * The location settings needs an additional handler because the map can only be initialized after the page was entered
   */
  ionViewDidEnter() {
    if (this.navParams.get('page') == 'location') {
      this.initMap();
    }
  }

  /**
   * Initializes the map for choosing a location by using the MapsService
   * Adds a marker to the map which can be used to set the location
   * Centers the Map and Marker on the current user position
   */
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

  /**
   * Method passed to he marker listener to get the position when the marker is moved
   * Writes the position into the address fields
   */
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

  /**
   * Allows to enter a position manually in the Adress field and update the marker accordingly
   * Uses the MapsService to get the Geolocation related to the Address
   */
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

  /**
   * Saves the data of the form which was currently being edited
   * @param form Form which was currently being edited (see HTML for call and passing)
   */
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

  /**
   * Pushes the upload page for images with the header specification
   */
  getHeader() {
    this.navCtrl.push('WebUploadPage', {type: 'header', callback: this.imageChanged, userId: this.profile._id});
  }

  /**
   * Pushes the upload page for images with the avatar specification
   */
  getPicture() {
    this.navCtrl.push('WebUploadPage', {type: 'avatar', callback: this.imageChanged, userId: this.profile._id});
  }

  /**
   * Does the logout and redirects the user to the LoginPage
   */
  logout() {
    this._auth.logout();
    this.app.getRootNav().setRoot(LoginPage, {"LOGGED_OUT": true});
  }

  /**
   * On Click of the Share-Button
   * Saves the Link to the current profile either in the clipboard or
   * Opens the SocialPlugin if the platform is Android or iOS
   * The link is unique to the profile and can be used to access the profile immediatly
   */
  sharePage() {
    let route: string[] = this.platform.url().split('/');

    route.splice(0, route.indexOf('profile'));

    let shareUrl: string = 'savood.app.chd.cx';
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

  /**
   * Loads the Header image
   * @param user User for which to load the Header
   */
  getUserHeader(user: User) {
    this._user.usersIdBackgroundimageJpegGet(user._id, 500, 0).subscribe(
      (data) => {
        this.header = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      }
    );
  }

  /**
   * Loads the avatar image
   * @param user User for which to load the avatar
   */
  getUserAvatar(user: User) {
    this._user.usersIdImageJpegGet(user._id, 500, 0).subscribe(
      (data) => {
        this.avatar = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      }
    );
  }

  /**
   * Checks the type of the badge which the user has and displays the accoding icon
   * @param badge Badge (String) Which to check for type
   * @returns {string} Returns the name of the Ionicon
   */
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

  /**
   * On Click of a badge, displays info about the badge and how it was earned
   * @param badge Badge which to display the info for
   */
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

  /**
   * Deletes the UserAccount
   */
  deleteAccount() {
    let alert = this.alertCtrl.create({
      title: this.translated['SETTINGS.DELETE.TITLE'],
      inputs: [
        {
          name: 'text',
          placeholder: this.translated['SETTINGS.DELETE.PLACEHOLDER'],
          type: 'text'
        }
      ],
      buttons: [
        {
          text: this.translated['SETTINGS.DELETE.CANCEL'],
          role: 'cancel'
        },
        {
          text: this.translated['SETTINGS.DELETE.CONFIRM'],
          handler: data => {
            let text: string = data.text;
            text = text.toLowerCase().trim();
            let val_text: string = this.translated['SETTINGS.DELETE.PLACEHOLDER'].toLowerCase().trim();
            if (val_text === text) {
              this._user.deleteUserById(this.profile._id).subscribe(
                (data) => {
                  this.navCtrl.setRoot('LoginPage');
                }
              )
            } else {
              let toast = this.toastCtrl.create({
                message: this.translated['SETTINGS.DELETE.WRONG_TEXT'],
                duration: 3000,
                position: 'top'
              });
              toast.present();

            }
          }
        }
      ]
    });
    alert.present();
  }
}
