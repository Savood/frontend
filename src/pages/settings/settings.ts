import {Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';

import { Settings } from '../../providers';
import {} from '@types/googlemaps';
import { LatLng } from '@ionic-native/google-maps';
import {MapsService} from "../../providers/maps/maps";

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
  @ViewChild('map') mapElement : ElementRef;

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
    badges: [true,false,true,true,true,false,false,true,false]
  };

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
    public plt: Platform) {
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
    if(this.navParams.get('page') == 'location'){
      this.initMap();
    }
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

  initMap(){
    let myMap = this._maps.initMap(this.mapElement, new LatLng(49.4874592, 8.4660395));
    this._maps.newMarker(new LatLng(49.4874592, 8.4660395), 'Hello Markus', myMap);
  }
}
