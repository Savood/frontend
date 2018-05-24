import {ElementRef, Injectable} from '@angular/core';
import {Location} from "../../models/location";
import {} from '@types/googlemaps';
import LatLng = google.maps.LatLng;

@Injectable()
export class JSMapsService {

  map: any;
  geocoder = new google.maps.Geocoder();

  constructor() {

  }

  init(element: ElementRef, location: Location, zoom: number) {
    let latLng = new google.maps.LatLng(location.latitude, location.longitude);

    this.map = new google.maps.Map(element.nativeElement,
      {
        center: latLng,
        zoom: zoom
      });
  }

  async addMarker(location: Location, title: string, draggable: boolean) {
    let latLng = new LatLng(location.latitude, location.longitude);

    return new google.maps.Marker({
      title: title,
      position: latLng,
      map: this.map,
      draggable: draggable,
      optimized: false
    });
  }

  getMarkerPosition(marker: any) {
    let latLng: LatLng = marker.getPosition();
    let location: Location = {latitude: latLng.lat(), longitude: latLng.lng()};
    return location;
  }

  async getAddress(location: Location): Promise<any> {
    let latLng = new LatLng(location.latitude, location.longitude);

    return new Promise<any>(((resolve, reject) => {
      this.geocoder.geocode({location: latLng}, (results, status) => {
        if (status.toString() === 'OK') {
          if (results[0]) {
            console.log(results[0]);
            resolve(results[0]);
          } else {
            console.log("error");
            reject('NO_ADDRESS_FOUND');
          }
        } else {
          console.log("error");
          reject('GEOCODER_ERROR' + status);
        }
      });
    }));

  }

}
