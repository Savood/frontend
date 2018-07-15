import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Offering} from "../../models/offering";
import {OfferingsService} from "../../providers/api/offerings.service";
import {DomSanitizer} from "@angular/platform-browser";
import {MapsService} from "../../providers/maps/maps";
import {Location} from "../../models/location";

/**
 * Generated class for the OfferinglistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offeringlist',
  templateUrl: 'offeringlist.html',
})

export class OfferinglistPage {

  page:string = "owned";
  owned_offerings: Offering[] = null ;
  requested_offerings: Offering[] = null ;
  currentLocation: Location = null;

  browserLocal:string = null;

  offeringImages = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _offering: OfferingsService,
              private _sanitizer: DomSanitizer,
              public _maps: MapsService) {

    this.currentLocation = navParams.get('currLocation');
    this.browserLocal = navParams.get('browserLang');
    console.log(this.browserLocal);
  }

  /**
   * Gets source of offering image
   * @param item
   */
  getImageSource(item: Offering) {
    this._offering.offeringsIdImageJpegGet(item._id).subscribe(
      (data) => {
        this.offeringImages[item._id] = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      }
    );
  }


  ionViewDidLoad() {
    this.getMyOfferings();
    this.getMySavoods();
  }


  getMySavoods():void{
    this._offering.getOfferings("requested").subscribe(data=>this.requested_offerings = data, err=>console.error(err));
  }

  getMyOfferings():void{
    this._offering.getOfferings("owned").subscribe(data=>this.owned_offerings = data, err=>console.error(err));
  }

  getImage(offering:Offering):string{
    return this._offering.getImagePath(offering);
  }

  openItem(item: Offering) {
    this.navCtrl.push('OfferingDetailPage', {
      offering: item,
      offeringId: item._id
    });
  }

  getDistanceString(item): string {
    console.log(this.currentLocation);
    let dist = this._maps.getDistance(this.currentLocation, this._offering.changeOfferingLocationToLocation(item.location));
    return `${dist.amount} ${dist.unit}`;
  }
}
