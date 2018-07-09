import {ElementRef, Injectable} from '@angular/core';
import {Location} from "../../models/location";
import {} from '@types/googlemaps';
import LatLng = google.maps.LatLng;
import Marker = google.maps.Marker;
import Circle = google.maps.Circle;

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
          zoom: zoom,
          clickableIcons: false,
          streetViewControl: false,
          mapTypeControl: false,
        });
  }

  async addMarker(location: Location, title: string, draggable: boolean, icon?:object) {
    let latLng = new LatLng(location.latitude, location.longitude);

    return new Marker({
      title: title,
      position: latLng,
      map: this.map,
      draggable: draggable,
      optimized: false,
      icon: icon
    });
  }

  getMarkerPosition(marker: Marker): Location {
    return {latitude: marker.getPosition().lat(), longitude: marker.getPosition().lng()};
  }

  setMarkerPosition(marker: Marker, location: Location){
    marker.setPosition(new LatLng(location.latitude, location.longitude));
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

  /**
   * Creates Circle on the map
   * @param location the location of the circles centre
   * @param radius the radius of the circle
   * @param color the color of the circle
   * @returns
   */
  async createCircle(location:Location, radius:number, color:number[]){
    let latLng = new LatLng(location.latitude, location.longitude);

    let str_color:string = `rgba(${color[0]},${color[1]}, ${color[2]}, 0.15)`;
    let stroke_color:string = `rgba(${color[0]},${color[1]}, ${color[2]}, 0.8)`;

    return new Circle({
      strokeColor: stroke_color,
      strokeWeight: 2,
      fillColor:str_color,
      map: this.map,
      center: latLng,
      radius: radius
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
