import {Component} from '@angular/core';
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
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'offerings.html'
})
export class OfferingsPage {
  feed: Offering[] = null;
  toggle = false;
  default_distance: number = 4000;

  browser_local = null;
  current_location: Location = null;


  constructor(public navCtrl: NavController,
              public _auth: AuthProvider,
              public _offering: OfferingsService,
              public _user: UsersService,
              private appCtrl: App,
              public _maps: MapsService,
              public _translate: TranslateService) {

    this.browser_local = _translate.getBrowserLang();

    this._auth.getActiveUser().subscribe((data) => {
    }, (err: HttpErrorResponse) => {
      if (err.status == 404) {
        this.appCtrl.getRootNav().push("WelcomePage");
      }
    });
  }

  async ionViewWillEnter() {
    this.current_location = await this._maps.getGPS();

    this._offering.getFeed(this.current_location.latitude, this.current_location.longitude, this.default_distance)
      .subscribe((data: Offering[]) => {
          this.feed = data;
          console.log(data[0].time);
        }, err => {
          console.log("ERROR", err);
        }
      );
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Offering) {
    console.log(item);
    this.navCtrl.push('OfferingDetailPage', {
      offering: item,
      offeringId: item._id,
      browser_lang: this.browser_local
    });
  }

  startCreationModal() {
    this.navCtrl.push('CreateOfferingPage');
  }

  getImageSource(item: Offering) {
    let _id = item._id
    let path = `${env.api_endpoint}/offerings/${_id}/image.jpeg:`;

  }

  placeSavood(feed) {
    if (feed.savooded) {
      //TODO Send to message side
    } else {
      this._offering.placeSavood(feed.id).subscribe((data: SuccessObject) => {
        if (data.success)
          console.log("Wuhu");
      }, (err) => {
        console.log(err);
      });
    }
  }

  getDistanceString(item): string {
    let dist = this._maps.getDistance(this.current_location, this._offering.changeOfferingLocationToLocation(item.location));
    return `${dist.amount} ${dist.unit}`;
  }
}
