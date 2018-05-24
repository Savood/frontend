import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {Settings} from '../../providers';
import {MapsService} from "../../providers/maps/maps";
import {Geolocation} from "@ionic-native/geolocation";

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
  user: any = {
    avatarURL: '',
    firstname: 'Marty',
    lastname: 'McFly',
    email: '123test@email.com',
    phone: '202-555-0191',
    address: {
      street: 'Musterstraße',
      number: '1337',
      zip: '42069',
      city: 'Musterstadt'
    },
    description: 'I save the wrap and the world',
    badges: [true, false, true, true, true, false, false, true, false]
  };

  defaultPickoffLocation: any = {
    street: 'Musterstraße',
    number: '1337',
    zip: '42069',
    city: 'Musterstadt'
  };

  locationMarker: any;

  options: any;

  settingsReady = false;

  form: FormGroup;

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PROFILE'
  };

  locationSettings = {
    page: 'location',
    pageTitleKey: 'SETTINGS_LOCATION'
  };

  notificationsSettings = {
    page: 'notifications',
    pageTitleKey: 'SETTINGS_NOTIFICATIONS'
  };

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
              public settings: Settings,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public translate: TranslateService,
              public _maps: MapsService,
              public geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

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
        this.defaultPickoffLocation = address;
      },
      (error) => {
        alert(error)
      }
    );
  }

  useEnteredLocation() {

  }
}
