import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {MessagesService} from "../../providers";
import {TranslateService} from "@ngx-translate/core";

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

  toUser = {
    _id: '534b8e5aaa5e7afc1b23e69b',
    pic: 'assets/img/speakers/bear.jpg',
    username: 'Venkman',
  };

  user = {
    id: '534b8fb2aa5e7afc1b23e69c',
    pic: 'assets/img/speakers/iguana.jpg',
    username: 'Marty',
  };

  sendMessagePlaceholder: string = "";

  messages: any = [
    {
      from: {
        userId: this.toUser._id,
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
        userId: this.user.id,
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
    public translate: TranslateService) {
    translate.get('SEND_A_MESSAGE').subscribe(
      (trans) => this.sendMessagePlaceholder = trans
    );
    this.chatId = this.navParams.get("chatId");
    this.partner = this.navParams.get("partner");
  }

  sendMessage(){
    this._message.createNewMessage(this.chatId,{content: this.newMessage, time: new Date()});
  }
}
