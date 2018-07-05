import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';

import {Item} from '../../models/item';
import {Chat, MessagesService, OfferingsService} from '../../providers';
import {TranslateService} from "@ngx-translate/core";
import {Offering} from "../../models/offering";
import {env} from "../../environment/environment";
import {User} from "../../models/user";

@IonicPage()
@Component({
  selector: 'page-chat-overview',
  templateUrl: 'chat-overview.html'
})
export class ChatOverviewPage {
  currentItems: Item[];

  page: string = 'startOverview';
  pageTitleKey: string = 'MESSAGES_OFFERINGS_TITLE';
  pageTitle: string;
  tab: string = "offerings";

  offerings: Offering[] = [];
  currentOffering: Offering;
  offeringChats: Chat[] = [];
  chats: Chat[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public _offerings: OfferingsService,
              public _messages: MessagesService,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      enableBackdropDismiss: true
    });
    loading.present();
    this._offerings.getOfferings().subscribe(
      (offerings) => {
        loading.dismiss();
        this.offerings = offerings;
      }
    );
    this._messages.getAllChats().subscribe(
      (chats) => {
        this.chats = chats;
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
      this.getChats(this.currentOffering._id);
    }
  }

  getImageSource(item: Offering) {
    return `${env.api_endpoint}/offerings/${item._id}/image.jpeg:`;
  }

  getUserAvatarPath(user: User) {
    return `${env.api_endpoint}/users/${user._id}/image.jpeg:`;
  }

  openChat(chatId: string, partner: any) {
    this.navCtrl.push('ChatPage',
      {
        chatId: chatId,
        partner: partner
      });
  }

  openChatOverview(offering: Offering) {
    this.navCtrl.push('ChatOverviewPage',
      {
        page: "chats",
        pageTitleKey: " ",
        offering: offering,
      }
    );
  }

  getChats(offeringId: string) {
    this._messages.getAllChatsForOffering(offeringId).subscribe(
      (chats) => {
        this.offeringChats = chats;

        if (chats.length == 1) {
          this.translate.get("OPENED_ONLY_CHAT").subscribe((message) => {
            this.toastCtrl.create({
              position: 'top',
              message: message,
              duration: 2000
            }).present();
          });
          this.navCtrl.push('ChatPage',
            {
              chatId: chats[0]._id,
              partner: chats[0].partner
            });
        }
      }
    );
  }
}
