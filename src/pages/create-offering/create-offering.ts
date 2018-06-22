import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MapsService} from "../../providers/maps/maps";

import {Geolocation} from "@ionic-native/geolocation";
import {DatePicker} from "@ionic-native/date-picker";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Camera} from "@ionic-native/camera";
import {TranslateService} from "@ngx-translate/core";

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _maps: MapsService,
              public geolocation: Geolocation,
              public datePicker: DatePicker,
              public camera: Camera,
              public formBuilder: FormBuilder,
              public translate: TranslateService) {
    this.form = formBuilder.group({
      offeringPic: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      bestbefore: [''],
      street: [''],
      number: [''],
      city: ['']
    });

    this.form.valueChanges.subscribe((v) => {
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
    if (this.geolocation) {
      this.geolocation.getCurrentPosition().then(
        (position) => {
          return {latitude: position.coords.latitude, longitude: position.coords.longitude};
        },
        (error) => {
          alert('ERROR: ' + error.message);
          return {latitude: 49.4874592, longitude: 8.4660395};
        }
      ).then(
        (position) => {
          this._maps.initMap(this.mapElement, {latitude: position.latitude, longitude: position.longitude});
          this._maps.newMarker(
            {latitude: position.latitude, longitude: position.longitude}, 'userPos', true).then(
            (marker) => {
              this.locationMarker = marker;
              this._maps.addListener(this.locationMarker,'dragend',() => alert('potato'));
            });
        }
      )
    } else {
      alert('ERROR: Location Service not available');
      this._maps.initMap(this.mapElement, {latitude: 49.4874592, longitude: 8.4660395});
      this._maps.newMarker({latitude: 49.4874592, longitude: 8.4660395}, 'userPos', true).then(
        (marker) => {
          this.locationMarker = marker;
          this._maps.addListener(this.locationMarker,'dragend',() => alert('potato'));
        });
    }
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

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
      }).then((data) => {
        this.form.patchValue({'offeringPic': 'date:image/jpg;base64,' + data});
      }, (err) => {
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

    reader.readAsDataURL(event.target.files[0]);
  }

  createOffering() {
    alert("Create Offering");
    this.navCtrl.pop();
  }
}

