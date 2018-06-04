import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';

import {Item} from '../../models/item';
import {Items, MessagesService, OfferingsService} from '../../providers';
import {Chats} from "../../models/chats";
import {TranslateService} from "@ngx-translate/core";
import {Offerings} from "../../models/offerings";

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

  offerings: Offerings = [];
  currentOffering: string;

  chats: any = [
    {
      id: "1",
      partner: {
        userId: "1",
        firstname: "Benke",
        lastname: "Schneider",
        avatarId: "/assets/img/sarah-avatar.png.jpeg"
      },
      offeringIds: [
        "1",
        "2",
        "3"
      ]
    },
    {
      id: "2",
      partner: {
        userId: "1",
        firstname: "Johann",
        lastname: "Johannson",
        avatarId: "assets/img/marty-avatar.png"
      },
      offeringIds: [
        "1",
        "2",
        "3"
      ]
    },
    {
      id: "23",
      partner: {
        userId: "1",
        firstname: "Dragon",
        lastname: "Rexhepi",
        avatarId: "assets/img/speakers/bear.jpg"
      },
      offeringIds: [
        "1",
        "2",
      ]
    }
  ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public items: Items,
              public _offerings: OfferingsService,
              public _messages: MessagesService,
              public modalCtrl: ModalController) {
    this._offerings.getOfferings().subscribe(
      (offerings) => {
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
      // this._messages.getAllChatsForOffering(this.currentOffering).subscribe(
      //   (chats) => {
      //     this.chats = chats;
      //   }
      // );
    }
  }

  openChat(chatId: string, partner: any) {
    this.navCtrl.push('ChatPage', {chatId: chatId, partner: partner});
  }

  openChatOverview(offeringId: string) {
    this.navCtrl.push('ChatOverviewPage',
      {
        page: "chats",
        pageTitleKey: "MESSAGES_PERSONAL_TITLE",
        offering: offeringId
      }
    );
  }
}
