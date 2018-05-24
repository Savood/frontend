import {ElementRef, Injectable} from '@angular/core';
import {Geocoder, GoogleMaps, LatLng, Marker} from '@ionic-native/google-maps';
import {Location} from "../../models/location";

@Injectable()
export class NativeMapsService {

  map: any;

  constructor(public googleMaps: GoogleMaps,) {

  }

  init(element: ElementRef, location: Location, zoom: number) {

    let latLng = new LatLng(location.latitude, location.longitude);

    this.map = this.googleMaps.create(element.nativeElement,
      {
        camera: {
          target: latLng,
          zoom: zoom
        }
      });
  }

  async addMarker(location: Location, title: string, draggable: boolean) {

    let latLng = new LatLng(location.latitude, location.longitude);

    return this.map.addMarker({
      title: title,
      position: latLng,
      draggable: draggable
    }).then(
      (marker) => {
        return marker;
      }
    );
  }

  getMarkerPosition(marker: Marker) {
    let location: Location = {latitude: marker.getPosition().lat, longitude: marker.getPosition().lng};
    return location;
  }

  async getAddress(location: Location): Promise<any> {
    let latLng = new LatLng(location.latitude, location.longitude);

    return new Promise<any>((resolve, reject) => {
      return Geocoder.geocode({position: latLng}).then(
        (address) => {
          let newLocation = {
            street: address[0].thoroughfare,
            number: address[0].subThoroughfare,
            zip: address[0].postalCode,
            city: address[0].locality
          };
          resolve(newLocation);
        },
        (error) => {
          reject(error);
        });
    });
  }
}
