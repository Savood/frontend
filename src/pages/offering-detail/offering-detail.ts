import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers';
import {MapsService} from "../../providers/maps/maps";

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'offering-detail.html'
})
export class OfferingDetailPage {
  @ViewChild('map') mapElement: ElementRef;
  locationMarker: any;

  offering: any;
  whichtab: string;

  constructor(public navCtrl: NavController, navParams: NavParams, items: Items, public _maps: MapsService) {
    this.offering = navParams.get('offering') || items.defaultItem;
  }

  ionViewWillEnter(){
    this.whichtab = "info";
  }

  ionViewDidEnter(){
    if(this.whichtab == 'location') this.initMap();
  }

  initMap() {
    this._maps.getGPS().then(
      (position) => {
        this._maps.initMap(this.mapElement, {latitude: position.latitude, longitude: position.longitude});
        this._maps.newMarker(
          {latitude: position.latitude, longitude: position.longitude}, 'userPos', false).then(
          (marker) => {
            this.locationMarker = marker;
          }
        )
      }
    )
  }
}
