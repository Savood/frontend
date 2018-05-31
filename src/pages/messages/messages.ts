import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';

import {Item} from '../../models/item';
import {Items} from '../../providers';
import {Chats} from "../../models/chats";
import {TranslateService} from "@ngx-translate/core";
import {Offerings} from "../../models/offerings";

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  currentItems: Item[];

  page: string = 'offerings';
  pageTitleKey: string = 'MESSAGES_OFFERINGS_TITLE';
  pageTitle: string;

  offerings: Offerings = [
    {
      id: "1",
      name: "banana"
    },
    {
      id: "2",
      name: "potato"
    },
    {
      id: "3",
      name: "bier"
    },

  ];
  currentOffering: string;

  chats: Chats = [
    {
      id: "1",
      user1Id: "1",
      user2Id: "2",
      offeringId: [
        "1",
        "2",
        "3"
      ]
    },
    {
      id: "2",
      user1Id: "1",
      user2Id: "3",
      offeringId: [
        "1",
        "2",
        "3"
      ]
    },
    {
      id: "23",
      user1Id: "5",
      user2Id: "1",
      offeringId: [
        "1",
        "2",
      ]
    }
  ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public items: Items,
              public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    });

    if(this.page == "chats"){
      this.currentOffering = this.navParams.get('offering');
    }
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
  openChat(chatId: string) {
    this.navCtrl.push('ChatPage', chatId);
  }

  openChatOverview(offeringId: string) {
    this.navCtrl.push('MessagesPage',
      {
        page: "chats",
        pageTitleKey: "MESSAGES_PERSONAL_TITLE",
        offering: offeringId
      }
    );
  }
}
