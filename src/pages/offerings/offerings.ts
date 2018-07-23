import {Component} from '@angular/core';
import {App, IonicPage, LoadingController, NavController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {Chat, MessagesService, OfferingsService} from "../../providers";
import {UsersService} from "../../providers";
import {HttpErrorResponse} from "@angular/common/http";
import {MapsService} from "../../providers/maps/maps";
import {Location} from "../../models/location";
import {Offering} from "../../models/offering";
import {env} from "../../environment/environment";
import {SuccessObject} from "../../models/successObject";
import {TranslateService} from "@ngx-translate/core";
import {DomSanitizer} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'offerings.html'
})
export class OfferingsPage {
  feed: Offering[] = null;
  toggle = false;
  default_distance: number = env.default_radius;
  browser_local = null;
  current_location: Location = null;

  offeringImages = {};

  offeringsLoadingString: string = null;
  loading: any = null;

  constructor(public navCtrl: NavController,
              private appCtrl: App,
              public _maps: MapsService,
              public _translate: TranslateService,
              public _auth: AuthProvider,
              public _offering: OfferingsService,
              public _user: UsersService,
              public _messages: MessagesService,
              public loadingCtrl: LoadingController,
              private _sanitizer: DomSanitizer) {

    this.browser_local = _translate.getBrowserLang();

    this._translate.get(['OFFERINGS_LOADING']).subscribe((value) => {
      this.offeringsLoadingString = value.OFFERINGS_LOADING;
    });

    this._auth.getActiveUser().subscribe(
      (user) => {
        this.loading = this.loadingCtrl.create({
          content: this.offeringsLoadingString,
          enableBackdropDismiss: true
        });
        this.loading.present();

        this._maps.getGPS().then(
          (location) => {
            this.current_location = location;
            this._offering.getFeed(this.current_location.latitude, this.current_location.longitude, this.default_distance)
              .subscribe((data: Offering[]) => {
                  this.feed = data;
                  for (let offering of data) {
                    this.getImageSource(offering);
                  }
                }, err => {
                  console.log("ERROR", err);
                },
                () => this.loading.dismiss()
              );
          }
        );
      },
      (err: HttpErrorResponse) => {
        if (err.status == 400) {
          this.appCtrl.getRootNav().push("WelcomePage");
        }
      });

  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Offering) {
    this.navCtrl.push('OfferingDetailPage', {
      offering: item,
      offeringId: item._id,
      browser_lang: this.browser_local
    });
  }

  /**
   * Link to Creation Modal
   */
  startCreationModal() {
    this.navCtrl.push('CreateOfferingPage');
  }

  /**
   * Gets source of offering image
   * @param item
   */
  getImageSource(item: Offering) {
    this._offering.offeringsIdImageJpegGet(item._id).subscribe(
      (data) => {
        this.offeringImages[item._id] = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
      }
    );
  }

  /**
   * Place savood on offering
   * @param item
   */
  placeSavood(item: Offering) {
    console.log(item);
    if (item.savooded) {
      this._messages.getAllChatsForOffering(item._id).subscribe(
        (chats: Chat[]) => {
          if (chats.length > 0) {
            this.navCtrl.push('ChatPage',
              {
                chatId: chats[0]._id,
                partner: chats[0].partner
              });
          }
        }
      )
    } else {
      this._offering.placeSavood(item._id).subscribe((data: SuccessObject) => {
        if (data.success) {
          this._messages.getAllChatsForOffering(item._id).subscribe(
            (chats: Chat[]) => {
              if (chats.length > 0) {
                this.navCtrl.push('ChatPage',
                  {
                    chatId: chats[0]._id,
                    partner: chats[0].partner
                  });
              }
            }
          )
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  /**
   * Gets string for distance
   * @param item
   * @returns {string}
   */
  getDistanceString(item): string {
    let dist = this._maps.getDistance(this.current_location, this._offering.changeOfferingLocationToLocation(item.location));
    return `${dist.amount} ${dist.unit}`;
  }

  /**
   * Opens a list to handle own or savooded offerings
   */
  openOfferingList() {
    this.navCtrl.push("OfferinglistPage", {currLocation: this.current_location, browserLang: this.browser_local});
  }
}
