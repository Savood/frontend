import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {MapsService} from "../../providers/maps/maps";
import {Geolocation} from "@ionic-native/geolocation";
import {ProfileService, Settings} from '../../providers';
import {} from '@types/googlemaps';
import {Profile} from "../../models/profile";

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  @ViewChild('map') mapElement: ElementRef;

  // Our local settings object
  user: Profile;
  userChanged = (newSettings) => {
    this.user = newSettings;
  };

  locationMarker: any;

  options: any;

  settingsReady = false;

  emailForm: FormGroup;
  phoneForm: FormGroup;
  locationForm: FormGroup;

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;

  emailSettings = {
    page: 'email',
    pageTitleKey: 'SETTINGS_EMAIL',
    user: this.user,
    userChanged: this.userChanged
  };

  locationSettings = {
    page: 'location',
    pageTitleKey: 'SETTINGS_LOCATION',
    user: this.user,
    userChanged: this.userChanged
  };

  phoneSettings = {
    page: 'phone',
    pageTitleKey: 'SETTINGS_PHONE',
    user: this.user,
    userChanged: this.userChanged
  };

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public _user: ProfileService,
    public _maps: MapsService,
    public geolocation: Geolocation) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;
    this.user = this.navParams.get('user') || this.user;
    this.userChanged = this.navParams.get('userChanged') || this.userChanged;

    if(this.navParams.get('page') == 'email'){
      this.emailForm = this.formBuilder.group({
        email: [this.user.email]
      });
    }

    if(this.navParams.get('page') == 'phone'){
      this.phoneForm = this.formBuilder.group({
        phone: [this.user.phone]
      });
    }

    if(this.navParams.get('page') == 'location'){
      this.locationForm = this.formBuilder.group({
        street: [this.user.address.street],
        number: [this.user.address.number],
        zip: [this.user.address.zip],
        city: [this.user.address.city],
      });
    }

    this.emailSettings.user
      = this.locationSettings.user
      = this.phoneSettings.user
      = this.user

    if(!this.user && this.page == "main"){
      this._user.getProfileById("7").subscribe(
        (profile) => {
          this.emailSettings.user
            = this.locationSettings.user
            = this.phoneSettings.user
            = this.user
            = profile
        }
      );
    }

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    });

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;
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
    if (this.geolocation) {
      this.geolocation.getCurrentPosition().then(
        (position) => {
          return {latitude: position.coords.latitude, longitude: position.coords.longitude};
        },
        (error) => {
          alert('ERROR: ' + error.message);
          return {latitude: 49.4874592, longitude: 8.4660395};
        }
      ).then(
        (position) => {
          this._maps.initMap(this.mapElement, {latitude: position.latitude, longitude: position.longitude});
          this._maps.newMarker(
            {latitude: position.latitude, longitude: position.longitude}, 'userPos', true).then(
            (marker) => {
              this.locationMarker = marker
            });
        }
      )
    } else {
      alert('ERROR: Location Service not available');
      this._maps.initMap(this.mapElement, {latitude: 49.4874592, longitude: 8.4660395});
      this._maps.newMarker({latitude: 49.4874592, longitude: 8.4660395}, 'userPos', true).then(
        (marker) => {
          this.locationMarker = marker
        });
    }
  }

  usePointerLocation() {
    this._maps.getAddress(this._maps.getMarkerPosition(this.locationMarker)).then(
      (address) => {
        this.locationForm.setValue(address);
        this.user.address = address;
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
      this.user.address.street + " " +
      this.user.address.number + ", " +
      this.user.address.zip + " " +
      this.user.address.city;

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

  saveData(form: FormGroup){
    let newSettings = {};
    Object.assign(newSettings,this.user,form.value);
    if(form.dirty) {
      this._user.updateProfileById(this.user.id,form.value).subscribe(
        () => {
          this.userChanged(newSettings);
          this.navCtrl.pop().then()
        }
      )
    } else {
      this.navCtrl.pop()
    }
  }
}
