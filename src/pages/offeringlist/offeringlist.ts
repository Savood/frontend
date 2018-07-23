import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Offering} from "../../models/offering";
import {OfferingsService} from "../../providers/api/offerings.service";
import {DomSanitizer} from "@angular/platform-browser";
import {MapsService} from "../../providers/maps/maps";
import {Location} from "../../models/location";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the OfferinglistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offeringlist',
  templateUrl: 'offeringlist.html',
})

export class OfferinglistPage {

  page: string = "owned";
  owned_offerings: Offering[] = null;
  requested_offerings: Offering[] = null;
  currentLocation: Location = null;

  browserLocal: string = null;

  offeringImages = {};

  unsavood_title: string = null;
  unsavood_placeholder: string = null;
  unsavood_confirm: string = null;
  unsavood_cancel: string = null;
  unsavood_wrong_text: string = null;
  unsavood_successful: string = null;

  delete_offering_title: string = null;
  delete_offering_placeholder: string = null;
  delete_offering_confirm: string = null;
  delete_offering_cancel: string = null;
  delete_offering_wrong_text: string = null;
  delete_offering_successful: string = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _offering: OfferingsService,
              private _sanitizer: DomSanitizer,
              public _maps: MapsService,
              private alertCtrl: AlertController,
              private _translate: TranslateService,
              private _toast: ToastController) {

    this._translate.get([
      'UNSAVOOD_TITLE', 'UNSAVOOD_SUCCESSFUL', 'UNSAVOOD_WRONG_TEXT', 'UNSAVOOD_PLACEHOLDER', 'UNSAVOOD_CONFIRM', 'UNSAVOOD_CANCEL',
      'DELETE_OFFERING_TITLE', 'DELETE_OFFERING_SUCCESSFUL', 'DELETE_OFFERING_WRONG_TEXT', 'DELETE_OFFERING_PLACEHOLDER', 'DELETE_OFFERING_CONFIRM', 'DELETE_OFFERING_CANCEL'
    ]).subscribe(data => {
      this.unsavood_cancel = data.UNSAVOOD_CANCEL;
      this.unsavood_placeholder = data.UNSAVOOD_PLACEHOLDER;
      this.unsavood_title = data.UNSAVOOD_TITLE;
      this.unsavood_confirm = data.UNSAVOOD_CONFIRM;
      this.unsavood_wrong_text = data.UNSAVOOD_WRONG_TEXT;
      this.unsavood_successful = data.UNSAVOOD_SUCCESSFUL;

      this.delete_offering_cancel = data.DELETE_OFFERING_CANCEL;
      this.delete_offering_placeholder = data.DELETE_OFFERING_PLACEHOLDER;
      this.delete_offering_title = data.DELETE_OFFERING_TITLE;
      this.delete_offering_confirm = data.DELETE_OFFERING_CONFIRM;
      this.delete_offering_wrong_text = data.DELETE_OFFERING_WRONG_TEXT;
      this.delete_offering_successful = data.DELETE_OFFERING_SUCCESSFUL;
    });

    this.currentLocation = navParams.get('currLocation');
    this.browserLocal = navParams.get('browserLang');
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

  ionViewDidLoad() {
    this.getMyOfferings();
    this.getMySavoods();
  }

  /**
   * Returns the offerings which where savooded by the current user
   */
  getMySavoods(): void {
    this._offering.getOfferings("requested").subscribe(
      data => {
        this.requested_offerings = data;
        for (let offering of data) {
          this.getImageSource(offering);
        }
      },
      err => console.error(err)
    );
  }

  /**
   * Returns the offerings created by the current user
   */
  getMyOfferings(): void {
    this._offering.getOfferings("owned").subscribe(
      data => {
        this.owned_offerings = data;
        for (let offering of data) {
          this.getImageSource(offering);
        }
      },
      err => console.error(err));
  }

  /**
   * redirects to the detail page of an offering
   * @param item offering
   */
  openItem(item: Offering) {
    this.navCtrl.push('OfferingDetailPage', {
      offering: item,
      offeringId: item._id
    });
  }

  /**
   * Gets a string to display the distance
   * @param item distance
   * @returns {string} formatted string
   */
  getDistanceString(item): string {
    let dist = this._maps.getDistance(this.currentLocation, this._offering.changeOfferingLocationToLocation(item.location));
    return `${dist.amount} ${dist.unit}`;
  }

  /**
   * Shows dialog to unsavood an offering
   * @param feed
   */
  showUnsavoodDialog(feed) {
    let alert = this.alertCtrl.create({
      title: this.unsavood_title,
      inputs: [
        {
          name: 'text',
          placeholder: this.unsavood_placeholder,
          type: 'text'
        }
      ],
      buttons: [
        {
          text: this.unsavood_cancel,
          role: 'cancel'
        },
        {
          text: this.unsavood_confirm,
          handler: data => {
            let text: string = data.text;
            text = text.toLowerCase().trim();
            let val_text: string = this.unsavood_placeholder.toLowerCase().trim();
            if (val_text === text) {
              this.unsavood();
            } else {
              this.revokeUnsavood();
            }
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Unsavood offering via offering provider
   */
  unsavood() {

    //TODO UNSAVOOD API CALL

    let toast = this._toast.create({
      message: this.unsavood_successful,
      duration: 3000,
      position: 'top'
    });

    toast.present();

  }

  /**
   * Gets called when the dialog to unsavood an offering got dismissed
   */
  revokeUnsavood() {
    let toast = this._toast.create({
      message: this.unsavood_wrong_text,
      duration: 3000,
      position: 'top'
    });
    toast.present();

  }

  /**
   * Opens dialog to delete an offering
   * @param item offering
   */
  showDeleteOfferingDialog(item: Offering) {
    let alert = this.alertCtrl.create({
      title: this.delete_offering_title,
      inputs: [
        {
          name: 'text',
          placeholder: this.delete_offering_placeholder,
          type: 'text'
        }
      ],
      buttons: [
        {
          text: this.delete_offering_cancel,
          role: 'cancel'
        },
        {
          text: this.delete_offering_confirm,
          handler: data => {
            let text: string = data.text;
            text = text.toLowerCase().trim();
            let val_text: string = this.delete_offering_placeholder.toLowerCase().trim();
            if (val_text === text) {
              this.deleteOffering(item);
            } else {
              this.revokeDeletionOfOffering();
            }
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Deletes offering via offering provider
   * @param item
   */
  deleteOffering(item: Offering) {
    this._offering.deleteOfferingById(item._id).subscribe(() => {
      let toast = this._toast.create({
        message: this.delete_offering_successful,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });

  }

  /**
   * Gets called when the dialog to delete an offering got dismissed
   */
  revokeDeletionOfOffering() {

    let toast = this._toast.create({
      message: this.delete_offering_wrong_text,
      duration: 3000,
      position: 'top'
    });
    toast.present();

  }

}
