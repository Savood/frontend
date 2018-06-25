import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'offering-detail.html'
})
export class OfferingDetailPage {
  offering: any;
  whichtab: string;

  constructor(public navCtrl: NavController, navParams: NavParams) {
    this.offering = navParams.get('offering');
    console.log(this.offering);
  }

  ionViewWillEnter(){
    this.whichtab = "info";
  }
}
