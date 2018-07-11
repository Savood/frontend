import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {MapsService} from "../../providers/maps/maps";

import {DatePicker} from "@ionic-native/date-picker";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Camera} from "@ionic-native/camera";
import {TranslateService} from "@ngx-translate/core";
import {OfferingsService} from "../../providers";

/**
 * Generated class for the CreateOfferingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-offering',
  templateUrl: 'create-offering.html',
})
export class CreateOfferingPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('fileInput') fileInput;

  valid: boolean;

  locationMarker: any;
  item: any;

  form: FormGroup;
  image: Blob;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _maps: MapsService,
              public datePicker: DatePicker,
              public camera: Camera,
              public toastCtrl: ToastController,
              public formBuilder: FormBuilder,
              public translate: TranslateService,
              public _offering: OfferingsService) {

    this.form = formBuilder.group({
      offeringPic: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      bestbefore: [''],
      street: [''],
      number: [''],
      city: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.valid = this.form.valid;
    });

  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.initMap();
  }

  getOfferingImage() {
    // return 'url(' + this.form.controls['offeringPic'].value + ')';
    return this.form.controls['offeringPic'].value;
  }

  initMap() {
    this._maps.getGPS().then(
      (position) => {
        this._maps.initMap(this.mapElement, {latitude: position.latitude, longitude: position.longitude});
        this._maps.newMarker(
          {latitude: position.latitude, longitude: position.longitude}, 'userPos', true).then(
          (marker) => {
            this.locationMarker = marker;
            this._maps.addListener(this.locationMarker, 'dragend', () => this.usePointerLocation());
          });
      }
    )
  }

  openDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => this.form.controls['bestbefore'].setValue(`${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`),
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  usePointerLocation() {
    this._maps.getAddress(this._maps.getMarkerPosition(this.locationMarker)).then(
      (address) => {
        this.form.controls['street'].setValue(address.street);
        this.form.controls['number'].setValue(address.number);
        this.form.controls['city'].setValue(address.city);
        console.log(address);
      },
      (error) => {
        this.translate.get(error).subscribe((res) => {
          alert(res)
        });
      }
    );
  }


  itemCreate() {
    alert("created");
  }

  uploadImage(offeringId: string){
    this._offering.offeringsIdImageJpegPost(offeringId, this.image).subscribe();
  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
      }).then((data) => {
        this.form.patchValue({'offeringPic': 'date:image/jpg;base64,' + data});
      }, () => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({'offeringPic': imageData});
    };
    this.image = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
  }

  createOffering() {
    //TODO: Fix passing of Offering (getRawValue()) probably wont work
    this._offering.createNewOffering(this.form.getRawValue()).subscribe(
      (success) => {
        this.uploadImage(success._id);
      },
      (err) => {
        this.toastCtrl.create({
          message: "Konnte nicht erstellt werden"
        })
      }
    );
    alert("Create Offering");
    this.navCtrl.pop();
  }
}

