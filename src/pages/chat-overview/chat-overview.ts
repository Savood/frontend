import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';

import {Item} from '../../models/item';
import {Chat, MessagesService, OfferingsService, UsersService} from '../../providers';
import {TranslateService} from "@ngx-translate/core";
import {Offering} from "../../models/offering";
import {env} from "../../environment/environment";
import {User} from "../../models/user";
import {DomSanitizer} from "@angular/platform-browser";
import {AuthProvider} from "../../providers/auth/auth";

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
  offeringImages = {};
  currentOffering: Offering;
  offeringChats: Chat[] = [];
  chatImages = {};
  chats: Chat[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public _offerings: OfferingsService,
              public _messages: MessagesService,
              public _user: UsersService,
              public _auth: AuthProvider,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              private _sanitizer: DomSanitizer) {
  }

  /**
   * As soon as the page is entered, things are loaded:
   * If the page is the main chat overview page the content for the two tabs is loaded
   * Otherwise nothing needs to happen
   */
  ionViewDidEnter(){
    if(this.page === 'startOverview'){

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
  }

  /**
   * After the view fully loaded the title is set and if the page is the chats for a offering page the chats are loaded
   */
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

  /**
   * Gets the image source for every Offering and adds it to an array
   * @param item Item for which the image is needed
   */
  getImageSource(item: Offering) {
    return this._offerings.offeringsIdImageJpegGet(item._id, 50, 0).subscribe(
      (data) => {
        this.offeringImages[item._id] = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      }
    );
  }

  /**
   * Gets the image source for every User with which there is a chat and adds it to an array
   * @param user User of the Image to load
   */
  getUserAvatar(user: User) {
    return this._user.usersIdImageJpegGet(user._id, 50, 0).subscribe(
      (data) => {
        this.chatImages[user._id] = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      }
    );
  }

  /**
   * On click of a chat, push the ChatPage with the correct chat information
   * @param chatId ChatId for which messages need to be loaded
   * @param partner Partner with which the chat is, so it can be instatly displayed
   */
  openChat(chatId: string, partner: any) {
    this.navCtrl.push('ChatPage',
      {
        chatId: chatId,
        partner: partner
      });
  }

  /**
   * On click of an offering, push the ChatOverviewPage with the correct offering information
   * @param offering Offering for which all chats need to be loaded
   */
  openChatOverview(offering: Offering) {
    if(offering.creator._id === this._auth.getActiveUserId()){
      this.navCtrl.push('ChatOverviewPage',
        {
          page: "chats",
          pageTitleKey: " ",
          offering: offering,
        }
      );
    } else {
      this._messages.getAllChatsForOffering(offering._id).subscribe(
        (chats: Chat[]) => {
          if(chats.length > 0){
            this.navCtrl.push('ChatPage',
              {
                chatId: chats[0]._id,
                partner: chats[0].partner
              });
          }
        }
      )
    }
  }

  /**
   * Get all chats which are related to the offering (happens after openChatOverview)
   * @param offeringId OfferingId for which chats will be loaded
   */
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
