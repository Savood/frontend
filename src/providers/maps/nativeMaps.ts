import {ElementRef, Injectable} from '@angular/core';
import {GoogleMaps, LatLng, Marker} from '@ionic-native/google-maps';
import {Location} from "../../models/location";

@Injectable()
export class NativeMapsService {

  map: any;

  constructor(public googleMaps: GoogleMaps) {

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

  getMarkerPosition(marker: Marker){
    let location: Location = {latitude: marker.getPosition().lat, longitude: marker.getPosition().lng};
    return location;
  }

  async getAddress(location: Location): Promise<any> {
  }


}
