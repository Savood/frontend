import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'offering-detail.html'
})
export class OfferingDetailPage {
  offering: any;
  whichtab: string;

  constructor(public navCtrl: NavController, navParams: NavParams, items: Items) {
    this.offering = navParams.get('offering') || items.defaultItem;
    console.log(this.offering);
  }

  ionViewWillEnter(){
    this.whichtab = "info";
  }
}
