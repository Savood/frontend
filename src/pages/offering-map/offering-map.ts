import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Offering} from "../../models/offering";
import {OfferingsService} from "../../providers/api/offerings.service";
import {MapsService} from "../../providers/maps/maps";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the OfferingMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offering-map',
  templateUrl: 'offering-map.html',
})
export class OfferingMapPage {
  @ViewChild('map') mapElement: ElementRef;

  feed: Offering[] = null;
  mapLoadingString:string = "";

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public _offering: OfferingsService,
              public _maps: MapsService,
              public _translate: TranslateService) {

    this._translate.get(['MAP_LOADING']).subscribe((value) => {
      this.mapLoadingString = value.MAP_LOADING;
    });
  }


  ionViewDidEnter() {
      this.initMap();
  }

  async initMap() {

    const default_radius = 1000

    let loading = this.loadingCtrl.create({
      content: this.mapLoadingString,
      enableBackdropDismiss: true
    });
    loading.present();
    let position = await this._maps.getGPS();

    this.feed = await this._offering.getFeed(position.latitude,position.longitude, default_radius).toPromise();

    this._maps.initMap(this.mapElement, {latitude: position.latitude, longitude: position.longitude});



    //Set user marker
    let user_marker = await this._maps.newMarker({latitude: position.latitude, longitude: position.longitude}, 'userPos', false,"me");
    this._maps.addListener(user_marker, 'click', ()=>{console.log("Hallo")});

    //Set circle
    let circle = await this._maps.createCircle({latitude: position.latitude, longitude: position.longitude},default_radius,'#6FD800');

    this.feed.forEach(async (item)=>{
      let marker = await this._maps.newMarker({latitude: item.location.coordinates[0],
        longitude: item.location.coordinates[1]},
        item.name, false, item.savooded?"savood":"offering");
      this._maps.addListener(marker, 'click', ()=>{console.log("Hallo");this.clickMarker(item);});
    });
    loading.dismiss();
  }

  goToUser(){
    this.navCtrl.push('SettingsPage');
  }
  clickMarker(item:Offering){
    this.navCtrl.push('OfferingDetailPage', {
      offering: item,
    });
  }
}
