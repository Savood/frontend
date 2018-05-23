import {Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';

import { Settings } from '../../providers';
import {} from '@types/googlemaps';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker, LatLng
} from '@ionic-native/google-maps';

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

  map: GoogleMap;
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
    let location: LatLng = new LatLng(49.474265, 8.534308);

    if(this.plt.is('ios') ||this.plt.is('android')){

      let mapOptions: GoogleMapOptions = {
        camera: {
          target: location,
          zoom: 15,
        }
      };

      this.map = GoogleMaps.create(this.mapElement.nativeElement, mapOptions);

      this.map.addMarker({
        title: 'Ionic',
        icon: 'blue',
        position: location
      });
    }else{
      let map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: location
      });
      let marker = new google.maps.Marker({
        position: location,
        map: map
      });
    }
  }
}
