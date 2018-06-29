import { Component } from '@angular/core';
import {App, IonicPage, NavController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {OfferingsService} from "../../providers/api/offerings.service";
import {UsersService} from "../../providers/api/users.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MapsService} from "../../providers/maps/maps";
import {Location} from "../../models/location";
import {Offering} from "../../models/offering";
import {env} from "../../environment/environment";
import {SuccessObject} from "../../models/successObject";
import {TimeProvider} from "../../providers/time/time";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'offerings.html'
})
export class OfferingsPage {
  feed: Offering[] = null;
  toggle = false;
  default_distance:number = 4000;

  browser_local = null;
  current_location:Location = null;


  constructor(public navCtrl: NavController,
              public _auth: AuthProvider,
              public _offering: OfferingsService,
              public _user: UsersService,
              private appCtrl:App,
              public _maps: MapsService,
              public _time: TimeProvider,
              public _translate: TranslateService)
  {

    this.browser_local = _translate.getBrowserLang();

    this._auth.getActiveUser().subscribe((data)=>{}, (err:HttpErrorResponse)=>{
      if(err.status == 404){
        this.appCtrl.getRootNav().push("WelcomePage");
      }
    });

    this._auth.refreshToken().subscribe(data=>console.log(data));
    // this._offering.getOfferingById("1").subscribe((data)=>console.log(data), (err)=>console.log(err));
  }

  async ionViewWillEnter(){
    this.current_location  = await this._maps.getGPS();

    this._offering.getFeed(this.current_location.latitude, this.current_location.longitude, this.default_distance)
      .subscribe((data:Offering[])=>{
        this.feed = data;
        console.log(data[0].requestedBy);
      }, err=>{
          console.log("ERROR", err);
        }
      );
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item) {
    this.navCtrl.push('OfferingDetailPage', {
      offering: item
    });
  }

  startCreationModal(){
    this.navCtrl.push('CreateOfferingPage');
  }

  getImageSource(item:Offering){
    return `${env.api_endpoint}/offerings/${item.id}/image.jpeg:`;
  }

  placeSavood(feed){
    this._offering.placeSavood(feed.id).subscribe((data:SuccessObject)=>{
      if(data.success)
        console.log("Wuhu");
    },(err)=>{
      console.log(err);
    });
  }

  getAgoString(date:string){
    return this._time.getAgoString(date);
  }

  getDistanceString(item): string {
    let dist = this._maps.getDistance(this.current_location, this._offering.changeOfferingLocationToLocation(item.location));
    return `${dist.amount} ${dist.unit}`;
  }
}
