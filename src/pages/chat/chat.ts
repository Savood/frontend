import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {MessagesService, UsersService} from "../../providers";
import {TranslateService} from "@ngx-translate/core";
import {env} from "../../environment/environment";
import {User} from "../../models/user";
import {AuthProvider} from "../../providers/auth/auth";
import {DomSanitizer} from "@angular/platform-browser";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  chatId: string;
  partner: any;
  newMessage: string;

  partnerImage;
  userImage;
  messages;

  sendMessagePlaceholder: string = "";

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _message: MessagesService,
    public _auth: AuthProvider,
    public _user: UsersService,
    private _sanitizer: DomSanitizer,
    public translate: TranslateService) {
    translate.get('SEND_A_MESSAGE').subscribe(
      (trans) => this.sendMessagePlaceholder = trans
    );
    this.chatId = this.navParams.get("chatId");
    this.partner = this.navParams.get("partner");
    this.refreshMessages();
    this.getPartnerAvatar(this.partner._id);
    this.getUserAvatar(_auth.getActiveUserId())
  }

  refreshMessages(){
    this._message.getAllMessagesForChat(this.chatId).subscribe(
      (messages) => this.messages = messages
    );
  }

  sendMessage() {
    this._message.createNewMessage(this.chatId, {content: this.newMessage}).subscribe(
      (created) => {
        this.newMessage = '';
        this.refreshMessages();
      }
    );
  }

  viewProfile(id: string) {
    this.navCtrl.push('SettingsPage', {profileId: id, pageTitleKey: 'PROFILE_TITLE', ownProfile: false});
  }

  getPartnerAvatar(userId: string) {
    this._user.usersIdImageJpegGet(userId).subscribe(
      (avatar) => this.partnerImage = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(avatar))
    )
  }

  getUserAvatar(userId: string) {
    this._user.usersIdImageJpegGet(userId).subscribe(
      (avatar) => this.userImage = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(avatar))
    )
  }
}
