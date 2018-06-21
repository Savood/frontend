import {ElementRef, Injectable} from '@angular/core';
import {Location} from "../../models/location";
import {} from '@types/googlemaps';
import LatLng = google.maps.LatLng;
import Marker = google.maps.Marker;

@Injectable()
export class JSMapsService {

  map: any;
  geocoder = new google.maps.Geocoder();

  constructor() { }

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

    return new Marker({
      title: title,
      position: latLng,
      map: this.map,
      draggable: draggable,
      optimized: false
    });
  }

  getMarkerPosition(marker: Marker): Location {
    let location: Location = {latitude: marker.getPosition().lat(), longitude: marker.getPosition().lng()};
    return location;
  }

  setMarkerPosition(marker: Marker, location: Location){
    let latLng: LatLng = new LatLng(location.latitude, location.longitude);
    marker.setPosition(latLng);
  }

  async getAddress(location: Location): Promise<any> {
    let latLng = new LatLng(location.latitude, location.longitude);

    return new Promise<any>((resolve, reject) => {
      this.geocoder.geocode({location: latLng}, (address, status) => {
        if (status.toString() === 'OK') {
          if (address[0]) {
            let newLocation = {
              street: null,
              number: null,
              zip: null,
              city: null
            };

            for (let component of address[0].address_components) {
              if (component.types[0] == 'street_number') {
                newLocation.number = component.long_name;
              }
              if (component.types[0] == 'route') {
                newLocation.street = component.long_name;
              }
              if (component.types[0] == 'locality') {
                newLocation.city = component.long_name;
              }
              if (component.types[0] == 'postal_code') {
                newLocation.zip = component.long_name;
              }
            }
            resolve(newLocation);
          } else {
            reject('NO_ADDRESS_FOUND');
          }
        } else {
          reject('GEOCODER_ERROR' + status);
        }
      });
    });
  }

  async getLocation(address: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.geocoder.geocode({address: address}, (location, status) => {
        if (status.toString() === 'OK') {
          if (location[0]) {
            let newLocation: Location = {
              latitude: location[0].geometry.location.lat(),
              longitude:location[0].geometry.location.lng()
            };
            resolve(newLocation);
          } else {
            reject('NO_LOCATION_FOUND');
          }
        } else {
          reject('GEOCODER_ERROR' + status);
        }
      });
    });
  }

  addListener(marker: Marker, event: any, desiredFunction: any){
    marker.addListener(event, desiredFunction);
  }
}
