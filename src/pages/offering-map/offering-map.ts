import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Offering} from "../../models/offering";
import {OfferingsService} from "../../providers";
import {MapsService} from "../../providers/maps/maps";
import {TranslateService} from "@ngx-translate/core";
import {env} from "../../environment/environment";

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


  ionViewDidLoad() {
      this.initMap();
  }

  /**
   * Method to initialise the map
   * @returns {Promise<void>}
   */
  async initMap() {
    const default_radius = env.default_radius;

    let loading = this.loadingCtrl.create({
      content: this.mapLoadingString,
      enableBackdropDismiss: true
    });

    loading.present();

    //getPosition
    let position = await this._maps.getGPS();

    //get offerings
    try {
      this.feed = await this._offering.getFeed(position.latitude, position.longitude, default_radius).toPromise();
    }catch(err){
      console.log(err);
    }
    //init Map
    this._maps.initMap(this.mapElement, {latitude: position.latitude, longitude: position.longitude});

    //Set user marker
    let user_marker = await this._maps.newMarker({latitude: position.latitude, longitude: position.longitude}, 'userPos', false,"me");
    this._maps.addListener(user_marker, 'click', ()=>{console.log("Hallo")});

    //Set circle
    let circle = await this._maps.createCircle({latitude: position.latitude, longitude: position.longitude},default_radius);

    //Show offerings on map
    if(this.feed) {
      this.feed.forEach(async (item) => {
        let marker = await this._maps.newMarker({
            latitude: item.location.coordinates[1],
            longitude: item.location.coordinates[0]
          },
          item.name, false, item.savooded ? "savood" : "offering");
        this._maps.addListener(marker, 'click', () => {
          this.clickMarker(item);
        });
      });
      loading.dismiss();
    }
  }

  /**
   * Navigate to User Page
   */
  goToUser(){
    this.navCtrl.push('SettingsPage');
  }

  /**
   * Handler for mapmarkers
   * @param item
   */
  clickMarker(item:Offering){
    this.navCtrl.push('OfferingDetailPage', {
      offering: item,
    });
  }
}
