import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {env} from "../../environment/environment";
import {Offering} from "../../models/offering";
import {OfferingsService} from "../../providers/api/offerings.service";
import {MapsService} from "../../providers/maps/maps";
import {Location} from "../../models/location";
import {SuccessObject} from "../../models/successObject";

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'offering-detail.html'
})
export class OfferingDetailPage {
  offering: Offering;
  whichtab: string;

  distanceString: string;

  constructor(public navCtrl: NavController,
              navParams: NavParams,
              public _offering: OfferingsService,
              public _maps: MapsService) {
    this.offering = navParams.get('offering');
  }

  ionViewWillEnter(){
    this.whichtab = "info";
    this.getDistanceString();
  }

  getImageSource(item:Offering){
    return `${env.api_endpoint}/offerings/${item.id}/image.jpeg:`;
  }

  getUserAvatarPath(user){
    return `${env.api_endpoint}/users/${user.id}/image.jpeg:`;
  }

  placeSavood(){
    this._offering.placeSavood(this.offering.id).subscribe((data:SuccessObject)=>{
      if(data.success)
        console.log("Wuhu");
    },(err)=>{
      console.log(err);
    });
  }

  async getDistanceString() {
    let current_location:Location = await this._maps.getGPS();
    console.log("this.offering.location",this.offering.location);
    let dist = this._maps.getDistance(current_location, this._offering.changeOfferingLocationToLocation(this.offering.location));
    this.distanceString = `${dist.amount} ${dist.unit}`;

  }

}
