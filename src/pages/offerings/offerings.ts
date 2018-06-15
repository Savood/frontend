import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {OfferingService} from "../../providers/api/offering.service";
import {FeedService} from "../../providers/api/feed.service";

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'offerings.html'
})
export class OfferingsPage {
  cardItems: any[];
  toggle = false;

  constructor(public navCtrl: NavController,public _auth: AuthProvider, public _feed: FeedService, public _offering: OfferingService)
  {

    this._auth.refreshToken().subscribe(data=>console.log(data));
    // this._offering.getOfferingById("1").subscribe((data)=>console.log(data), (err)=>console.log(err));



    this.cardItems = [
      {
        user: {
          avatar: 'assets/img/marty-avatar.png',
          name: 'Marty McFly'
        },
        header: "Spam for everyone",
        date: 'November 5, 1955',
        image: 'assets/img/foods/spam.jpg',
        description: 'Liegt hier so rum und ich kanns nicht mehr gebrauchen. Würde mich freuen wenn ich jemand finde der noch Zeit, Platz und Lust auf meinen Spam hat.',
        cum_like: 5,
        cum_comments: 10,
        cum_savoods:2,
      },
      {
        user: {
          avatar: 'assets/img/sarah-avatar.png.jpeg',
          name: 'Sarah Connor'
        },
        header: "Wassermelone",
        date: 'May 12, 1984',
        image: 'assets/img/foods/wassermelone.jpg',
        description: 'Hatte ich Lust drauf. Dann hatte ich es. Dann wollte ich nicht mehr. Vielleicht ihr',
        cum_like: 5,
        cum_comments: 10,
        cum_savoods:2
      },
      {
        user: {
          avatar: 'assets/img/ian-avatar.png',
          name: 'Dr. Ian Malcolm'
        },
        header: "Kiwi, gut gemästet zum abholen.",
        date: 'June 28, 1990',
        image: 'assets/img/foods/Kiwi.jpg',
        description: 'Hab nen paar zu viel gekauft aber wenn noch wer will, meine Kiwis warten nur auf euch.',
        cum_like: 5,
        cum_comments: 10,
        cum_savoods:2
      }
    ];
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item) {
    this.navCtrl.push('OfferingDetailPage', {
      offering: item
    });
  }

}
