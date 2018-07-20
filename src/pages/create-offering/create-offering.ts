import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {MapsService} from "../../providers/maps/maps";

import {DatePicker} from "@ionic-native/date-picker";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Camera} from "@ionic-native/camera";
import {TranslateService} from "@ngx-translate/core";
import {Offering, OfferingsService, UsersService} from "../../providers";
import {AuthProvider} from "../../providers/auth/auth";

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

  loading = this.loadCtrl.create({
    content: "Angebot wird erstellt",
    enableBackdropDismiss: true
  });

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _maps: MapsService,
              public datePicker: DatePicker,
              public camera: Camera,
              public toastCtrl: ToastController,
              private loadCtrl: LoadingController,
              public formBuilder: FormBuilder,
              public translate: TranslateService,
              public _offering: OfferingsService,
              public _auth: AuthProvider,
              public _user: UsersService) {

    this.form = formBuilder.group({
      offeringPic: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      bestbefore: [''],
      street: ['', Validators.required],
      number: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required]
    });

    this._user.getUserById(this._auth.getActiveUserId()).subscribe(
      (user) => {
        this.form.controls.street.setValue(user.address ? user.address.street : '');
        this.form.controls.number.setValue(user.address ? user.address.number : '');
        this.form.controls.city.setValue(user.address ? user.address.city : '');
        this.form.controls.zip.setValue(user.address ? user.address.zip : '');
      }
    )

    this.form.valueChanges.subscribe(() => {
      this.valid = this.form.valid;
    });
  }

  /**
   * Run the init Map method on page enter
   */
  ionViewDidEnter() {
    this.initMap();
  }

  /**
   * Returns the currently selected image
   * @returns The currently selected image
   */
  getOfferingImage() {
    // return 'url(' + this.form.controls['offeringPic'].value + ')';
    return this.form.controls['offeringPic'].value;
  }

  /**
   * Initializes the map for choosing a location by using the MapsService
   * Adds a marker to the map which can be used to set the location
   * Centers the Map and Marker on the current user position
   */
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

  // TODO: Maybe fix it because im not sure it works
  /**
   * Removes focus of all input elements when the map is selected so the keyboard does not open
   */
  removeFocus() {
    const active = <HTMLInputElement>document.activeElement;
    active.blur();
  }

  /**
   * On focus of the bestByDate input field, opens the Datepicker so a date can be selected
   */
  openDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => this.form.controls['bestbefore'].setValue(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`),
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  /**
   * Method passed to he marker listener to get the position when the marker is moved
   * Writes the position into the address fields
   */
  usePointerLocation() {
    this._maps.getAddress(this._maps.getMarkerPosition(this.locationMarker)).then(
      (address) => {
        this.form.controls['street'].setValue(address.street);
        this.form.controls['number'].setValue(address.number);
        this.form.controls['city'].setValue(address.city);
        this.form.controls['zip'].setValue(address.zip);
        this.form.markAsDirty();
      },
      (error) => {
        this.translate.get(error).subscribe((res) => {
          alert(res)
        });
      }
    );
  }

  /**
   * Actually uploads the selcted image, run only after the offering is created (so there is an id to upload to)
   * @param offeringId ID of the offering for which the image is
   */
  uploadImage(offeringId: string) {
    this._offering.offeringsIdImageJpegPost(offeringId, this.image).subscribe();
  }

  // TODO: A way to use the camera and actually choose the source from a context menu should be added
  /**
   * Run when the "Choose a pic"-Card is clicked
   * Opens the dialog which allows to choose an image
   */
  getPicture() {
    this.fileInput.nativeElement.click();
  }

  /**
   * On click of the input file field
   * As the input file field is actually hidden, only called from the getPicture method (through faking a click)
   * @param event Upload event of the hidden input field which is called when an image gets chosen
   */
  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({'offeringPic': imageData});
    };
    if (event.target.files[0]) {
      this.image = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /**
   * Finishes the creation process and calls the API to create the offering with all data
   */
  createOffering() {
    this.loading.present();

    let formValues = this.form.getRawValue();
    let newOffering: Offering;

    newOffering = {
      name: formValues.name,
      description: formValues.description,
      creator: {
        _id: this._auth.getActiveUserId()
      },
      bestByDate: formValues.bestbefore,
      address: {
        street: formValues.street,
        number: formValues.number,
        city: formValues.city,
        zip: formValues.zip
      },
      location: {
        type: 'Point',
        coordinates: [
          this._maps.getMarkerPosition(this.locationMarker).longitude,
          this._maps.getMarkerPosition(this.locationMarker).latitude
        ]
      }
    };
    this._offering.createNewOffering(newOffering).subscribe(
      (success) => {
        this.uploadImage(success._id);
        this.toastCtrl.create({
          message: "Angebot erstellt"
        });
        this.loading.dismiss();
      },
      (err) => {
        this.loading.dismiss();
        this.toastCtrl.create({
          message: "Konnte nicht erstellt werden"
        });
      }
    );
    this.navCtrl.pop();
  }
}

