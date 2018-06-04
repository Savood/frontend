import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MessagesService} from "../../providers";

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

  messages: any = [
    {
      from: {
        userId: "2",
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
        userId: "5",
        firstname: "Bert",
        lastname: "Likerson",
        avatarId: "assets/img/speakers/iguana.jpg"
      },
      timestamp: "1985-04-12T23:23:50.52Z"
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _message: MessagesService) {
    this.chatId = this.navParams.get("chatId");
    this.partner = this.navParams.get("partner");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  sendMessage(){
    // this._message.createNewMessage(this.chatId,this.newMessage);
  }
}
