import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MapsService} from "../../providers/maps/maps";

import {Geolocation} from "@ionic-native/geolocation";

/**
 * Generated class for the CreateOfferingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-offering',
  templateUrl: 'create-offering.html',
})
export class CreateOfferingPage {
  @ViewChild('map') mapElement: ElementRef;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _maps: MapsService,
              public geolocation: Geolocation
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateOfferingPage');
  }

  ionViewDidEnter() {
    this.initMap();
  }

  initMap() {
    if (this.geolocation) {
      this.geolocation.getCurrentPosition().then(
        (position) => {
          console.log("1");
          return {latitude: position.coords.latitude, longitude: position.coords.longitude};
        },
        (error) => {
          alert('ERROR: ' + error.message);
          return {latitude: 49.4874592, longitude: 8.4660395};
        }
      ).then(
        (position) => {
          console.log("Ja wird es");
          this._maps.initMap(this.mapElement, {latitude: position.latitude, longitude: position.longitude});
          console.log("2");
          this._maps.newMarker(
            {latitude: position.latitude, longitude: position.longitude}, 'userPos', true).then(
            (marker) => {
              this.locationMarker = marker
            });
          console.log("4")
        }
      )
    } else {
      alert('ERROR: Location Service not available');
      this._maps.initMap(this.mapElement, {latitude: 49.4874592, longitude: 8.4660395});
      console.log("3");
      this._maps.newMarker({latitude: 49.4874592, longitude: 8.4660395}, 'userPos', true).then(
        (marker) => {
          this.locationMarker = marker
        });
    }
  }

}
