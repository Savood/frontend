import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'offerings.html'
})
export class OfferingsPage {
  cardItems: any[];
  toggle = false;

  constructor(public navCtrl: NavController)
  {
    this.cardItems = [
      {
        user: {
          avatar: 'assets/img/marty-avatar.png',
          name: 'Marty McFly'
        },
        distance: "100 m",
        header: "Spam for everyone",
        date: 'November 5, 1955',
        image: 'assets/img/foods/spam.jpg',
        description: "Think of cheeseburgers like a Tinder match. They might not all be your soulmate but you’ve gotta find out to be sure. It can get a little messy and that’s just part of the fun. Some are cheesy, others can be a little dry, and the rare few are a disaster. There are so many cheeseburgers out there it can be hard to commit to just one favourite. That being said, when you know, you just know.Everyone has their perfect match. Sometimes it’s just around the corner, other times you have to travel the world in search of it. Wherever your perfect cheeseburger is, it’s out there.",
        cum_like: 5,
        cum_comments: 10,
        cum_savoods:2,
      },
      {
        user: {
          avatar: 'assets/img/sarah-avatar.png.jpeg',
          name: 'Sarah Connor'
        },
        distance: "100 m",
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
        distance: "100 m",
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
