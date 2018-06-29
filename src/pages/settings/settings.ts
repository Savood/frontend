import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {
  ActionSheetController, App,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  ToastController
} from 'ionic-angular';

import {MapsService} from "../../providers/maps/maps";
import {UsersService} from '../../providers';
import {} from '@types/googlemaps';
import {User} from "../../models/user";
import {AuthProvider} from "../../providers/auth/auth";
import {LoginPage} from "../login/login";

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage(
  {
    segment: 'profile/:profileId',
    defaultHistory: ['tabs']
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
  profileChanged = (newSettings) => {
    this.phoneSettings.profile
      = this.nameDescSettings.profile
      = this.profile
      = newSettings;
  };

  locationMarker: any;

  options: any;

  emailForm: FormGroup;
  phoneForm: FormGroup;
  locationForm: FormGroup;
  nameDescForm: FormGroup;

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;

  // emailSettings = {
  //   page: 'email',
  //   pageTitleKey: 'SETTINGS_EMAIL',
  //   profile: this.profile,
  //   profileChanged: this.profileChanged
  // };

  locationSettings = {
    page: 'location',
    pageTitleKey: 'SETTINGS_LOCATION',
    profile: this.profile,
    profileChanged: this.profileChanged
  };

  phoneSettings = {
    page: 'phone',
    pageTitleKey: 'SETTINGS_PHONE',
    profile: this.profile,
    profileChanged: this.profileChanged
  };

  nameDescSettings = {
    page: 'nameDesc',
    pageTitleKey: 'SETTINGS_NAME_DESC',
    profile: this.profile,
    profileChanged: this.profileChanged
  };

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public translate: TranslateService,
              public _user: UsersService,
              public _maps: MapsService,
              public loadingCtrl: LoadingController,
              public actionSheetCtrl: ActionSheetController,
              public platform: Platform,
              public _auth: AuthProvider,
              private app: App) {
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
          } else {
            this.profile = profile;
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
        street: [this.profile.address.street],
        number: [this.profile.address.number],
        zip: [this.profile.address.zip],
        city: [this.profile.address.city],
      });
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

  ngOnChanges() {
    console.log('Ng All Changes');
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
          {latitude: position.latitude, longitude: position.longitude}, 'userPos', true).then(
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

  changeHeader() {
    console.log("Header click!");
    if (this.platform.is('cordova')) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Upload Picture from',
        buttons: [
          {
            text: 'Gallery',
            handler: () => {
              this.getImage()
            }
          }, {
            text: 'Camera',
            handler: () => {
              this.getCamera()
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    } else {
      this.navCtrl.push('WebUploadPage', {type: 'header'})
    }
  }

  changeAvatar() {
    if (this.platform.is('cordova')) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Upload Picture from',
        buttons: [
          {
            text: 'Gallery',
            handler: () => {
              this.getImage()
            }
          }, {
            text: 'Camera',
            handler: () => {
              this.getCamera()
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();

    } else {
      this.navCtrl.push('WebUploadPage', {type: 'avatar'});
    }
  }

  uploadFile() {
    //   let loader = this.loadingCtrl.create({
    //     content: "Uploading..."
    //   });
    //   loader.present();
    //
    //   this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
    //
    //   this.uploadPic.uploadFile(this.imageURI, this.imageFileName)
    //     .then((data) => {
    //       loader.dismiss();
    //       this.presentToast("Image uploaded successfully");
    //     }, (err) => {
    //       loader.dismiss();
    //       this.presentToast(err);
    //     });
  }

  getImage() {
    this.translate.get("IMG_CHANGE_WEB_ONLY").subscribe((message) => {
      this.toastCtrl.create({
        position: 'top',
        message: message,
        duration: 3000
      }).present();
    });
    //   this.uploadPic.getImage()
    //     .then(
    //       (imageData) => {
    //         let alert = this.alertCtrl.create({
    //           title: 'Picture',
    //           subTitle: imageData,
    //           buttons: ['OK']
    //         });
    //         alert.present()
    //         // this.imageURI = imageData;
    //       },
    //       (err) => {
    //         this.presentToast(err);
    //       }
    //     );
  }

  logout() {
    this._auth.logout();
    this.app.getRootNav().setRoot(LoginPage);
  }

  getCamera() {
    this.translate.get("IMG_CHANGE_WEB_ONLY").subscribe((message) => {
      this.toastCtrl.create({
        position: 'top',
        message: message,
        duration: 3000
      }).present();
    });
    //   this.uploadPic.getCamera()
    //     .then((imageData) => {
    //       let alert = this.alertCtrl.create({
    //         title: 'Picture',
    //         subTitle: imageData,
    //         buttons: ['OK']
    //       });
    //       alert.present()
    //
    //     }, (err) => {
    //       this.presentToast(err);
    //     });
  }
}
