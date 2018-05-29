import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  currentItems: Item[];

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController) {
    this.currentItems = this.items.query();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our date source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteMessage(message) {
    this.items.delete(message);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openMessage() {
    this.navCtrl.push('MessageDetailPage', {
      message: {
        id: 2,
        fromId: 2,
        toId: 3,
        offeringId: 15,
        content: "Hallo Markus!",
        time: Date,
        important: true,
      }
    });
}
}
