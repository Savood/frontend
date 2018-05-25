import {HttpClient} from '@angular/common/http';
import {ElementRef, Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {GoogleMaps} from "@ionic-native/google-maps";
import {JSMapsService} from "./jsMaps";
import {NativeMapsService} from "./nativeMaps";
import {Location} from "../../models/location";

/*
  Generated class for the MapsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapsService {

  map: any;

  constructor(public http: HttpClient,
              public plt: Platform) {
    if (this.plt.is('cordova') &&
      (this.plt.is('ios') || this.plt.is('android'))) {
      this.map = new NativeMapsService(GoogleMaps);
    } else {
      this.map = new JSMapsService();
    }
  }

  /**
   * Creates a new Map in the specified DOM Element centered on the specified location
   * @param mapElement DOM Element in which the map will be
   * @param location Location of the center of the map
   */
  initMap(mapElement: ElementRef, location: Location) {
    let zoom: number = 15;
    this.map.init(mapElement, location, zoom);
  }

  /**
   * Creates a new Marker on the specified Map
   * @param location Location of the Marker
   * @param title Title of the Marker
   * @param draggable Makes the Marker draggable if true
   * @returns Promise<Marker>, where Marker is defined by the used platform
   */
  async newMarker(location: Location, title: string, draggable?: boolean): Promise<any> {
    return this.map.addMarker(location, title, draggable)
  }

  /**
   * Returns the Lat Lng Location of a Marker
   * @param marker Marker which location needs to be returned
   * @returns Location of the Marker
   */
  getMarkerPosition(marker: any): Location {
    return this.map.getMarkerPosition(marker);
  }

  /**
   * Places the Marker at the specified location
   * @param marker Marker which location needs to be returned
   * @param location new Location of the Marker
   */
  setMarkerPosition(marker: any, location: Location){
    this.map.setMarkerPosition(marker, location);
  }

  /**
   * Returns the Address of the specified location
   * @param location Location which needs to be located
   * @returns Promise<address> Address of the location
   */
  async getAddress(location: Location): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this.map.getAddress(location).then(
        (results) => {
          resolve(results);
        },
        (error) => {
          reject(error);
        });
    });
  }

  /**
   * Returns the Location of the specified address
   * @param address Common postal address which needs to be located
   * @returns Promise<Location> Location of the address
   */
  async getLocation(address: string): Promise<Location>{
    return new Promise<any>((resolve, reject) => {
      return this.map.getLocation(address).then(
        (results) => {
          resolve(results);
        },
        (error) => {
          reject(error);
        });
    });
  }

}
