import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';

import {Item} from '../../models/item';
import {Chat, Items, MessagesService, OfferingsService} from '../../providers';
import {TranslateService} from "@ngx-translate/core";
import {Offering} from "../../models/offering";

@IonicPage()
@Component({
  selector: 'page-chat-overview',
  templateUrl: 'chat-overview.html'
})
export class ChatOverviewPage {
  currentItems: Item[];

  page: string = 'offerings';
  pageTitleKey: string = 'MESSAGES_OFFERINGS_TITLE';
  pageTitle: string;

  offerings: Offering[] = [];
  currentOffering: Offering;
  chats: Chat[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public items: Items,
              public _offerings: OfferingsService,
              public _messages: MessagesService,
              public modalCtrl: ModalController) {
    this._offerings.getOfferings().subscribe(
      (offerings) => {
        console.log(offerings);
        this.offerings = offerings;
      }
    );
  }

  ionViewDidLoad() {
    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    });

    if (this.page == "chats") {
      this.currentOffering = this.navParams.get('offering');
    }

    if(this.currentOffering){
      console.log(this.currentOffering);
      this._messages.getAllChatsForOffering(this.currentOffering._id).subscribe(
        (chats) => {
          console.log(chats);
          this.chats = chats;
        }
      );
    }
  }

  openChat(chatId: string, partner: any) {
    this.navCtrl.push('ChatPage', {chatId: chatId, partner: partner});
  }

  openChatOverview(offeringId: string) {
    this.navCtrl.push('ChatOverviewPage',
      {
        page: "chats",
        pageTitleKey: " ",
        offering: offeringId
      }
    );
  }
}
