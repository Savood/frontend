import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {MessagesService, UsersService} from "../../providers";
import {TranslateService} from "@ngx-translate/core";
import {env} from "../../environment/environment";
import {User} from "../../models/user";
import {AuthProvider} from "../../providers/auth/auth";

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

  toUser = {
    _id: '534b8e5aaa5e7afc1b23e69b',
    pic: 'assets/img/speakers/bear.jpg',
    username: 'Venkman',
  };

  user = {
    _id: '534b8fb2aa5e7afc1b23e69c',
    pic: 'assets/img/speakers/iguana.jpg',
    username: 'Marty',
  };

  sendMessagePlaceholder: string = "";

  messages: any = [
    {
      from: {
        _id: this.toUser._id,
        firstname: "John",
        lastname: "Johnson",
        avatarId: "assets/img/speakers/bear.jpg"
      },
      content: "Hallo 1",
      timestamp: "1985-04-12T23:20:50.52Z"
    },
    {
      content: "Hallo 2",
      from: {
        _id: this.user._id,
        firstname: "Bert",
        lastname: "Likerson",
        avatarId: "assets/img/speakers/iguana.jpg"
      },
      timestamp: "1985-04-12T23:23:50.52Z"
    }
  ];

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _message: MessagesService,
    public _auth: AuthProvider,
    public _user: UsersService,
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
        console.log(created);
        this.refreshMessages();
      }
    );
  }

  viewProfile(id: string) {
    this.navCtrl.push('SettingsPage', {profileId: id, pageTitleKey: 'PROFILE_TITLE'});
  }

  getPartnerAvatar(userId: string) {
    this._user.usersIdImageJpegGet(userId).subscribe(
      (avatar) => this.partnerImage = avatar
    )
  }

  getUserAvatar(userId: string) {
    this._user.usersIdImageJpegGet(userId).subscribe(
      (avatar) => this.userImage = avatar
    )
  }
}
