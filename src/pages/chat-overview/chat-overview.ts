import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';

import {Item} from '../../models/item';
import {Chat, MessagesService, OfferingsService, UsersService} from '../../providers';
import {TranslateService} from "@ngx-translate/core";
import {Offering} from "../../models/offering";
import {env} from "../../environment/environment";
import {User} from "../../models/user";
import {DomSanitizer} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-chat-overview',
  templateUrl: 'chat-overview.html'
})
export class ChatOverviewPage {
  page: string = 'startOverview';
  pageTitleKey: string = 'MESSAGES_OFFERINGS_TITLE';
  pageTitle: string;
  tab: string = "offerings";

  offerings: Offering[] = [];
  offeringImages: {};
  currentOffering: Offering;
  offeringChats: Chat[] = [];
  chatImages: {};
  chats: Chat[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public _offerings: OfferingsService,
              public _messages: MessagesService,
              public _user: UsersService,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              private _sanitizer: DomSanitizer) {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      enableBackdropDismiss: true
    });
    loading.present();
    this._offerings.getOfferings().subscribe(
      (offerings) => {
        loading.dismiss();
        this.offerings = offerings;
        for(let offering of offerings){
          this.getImageSource(offering);
        }
      },
      () => {
        loading.dismiss();
      }
    );
    this._messages.getAllChats().subscribe(
      (chats) => {
        this.chats = chats;
        for(let chat of chats){
          this.getUserAvatar(chat.partner);
        }
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
    return this._offerings.offeringsIdImageJpegGet(item._id).subscribe(
      (data) => {
        this.offeringImages[item._id] = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      }
    );
  }

  getUserAvatar(user: User) {
    return this._user.usersIdImageJpegGet(user._id).subscribe(
      (data) => {
        this.chatImages[user._id] = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      }
    );
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
