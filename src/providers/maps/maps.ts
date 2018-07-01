import {HttpClient} from '@angular/common/http';
import {ElementRef, Injectable} from '@angular/core';
import {Platform} from "ionic-angular";
import {GoogleMaps} from "@ionic-native/google-maps";
import {JSMapsService} from "./jsMaps";
import {NativeMapsService} from "./nativeMaps";
import {Location} from "../../models/location";
import {Geolocation} from "@ionic-native/geolocation";

/*
  Generated class for the MapsService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapsService {

  map: any;

  constructor(public http: HttpClient,
              public plt: Platform,
              public geolocation: Geolocation) {
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
  async newMarker(location: Location, title: string, draggable?: boolean, icon?:string): Promise<any> {

    let image:{size:any, origin:any , anchor:any, url?:string}= {
      size: new google.maps.Size(30, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(15, 35)
    };

    switch(icon){
      case 'offering':
        image.url= '../../assets/icon/offering_not_savooded_ico.png';
        break;
      case 'me':
        image.url= '../../assets/icon/me.png';
        break;
      case 'savood':
        image.url= '../../assets/icon/offering_savooded_ico.png';
        break;
      default:
        image.url = icon;
    }
    return this.map.addMarker(location, title, draggable, image);
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
  setMarkerPosition(marker: any, location: Location) {
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
  async getLocation(address: string): Promise<Location> {
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

  /**
   * Add listener to a marker
   * @param marker Marker which should have
   * @param event Event which should listened for
   * @param desiredFunction Function which should be run when event happens
   */
  addListener(marker: any, event: any, desiredFunction: any) {
    this.map.addListener(marker, event, desiredFunction);
  }

  /**
   * Get current location of the device
   * @returns {Promise<Location>} Promise of the Location in default frontend Location format
   */
  getGPS(): Promise<Location> {
    return new Promise<any>((resolve, reject) => {
      if (this.geolocation) {
        this.geolocation.getCurrentPosition().then(
          (position) => {
            resolve({latitude: position.coords.latitude, longitude: position.coords.longitude});
          },
          (error) => {
            alert('ERROR: ' + error.message);
            resolve({latitude: 49.4874592, longitude: 8.4660395});
          }
        )
      } else {
        alert('ERROR: Location Service not available');
        resolve({latitude: 49.4874592, longitude: 8.4660395});
      }
    });
  }

  /**
   *  Returns the distanceString between 2 Locations
   *
   * @param start
   * @param end
   * @param threshold for differentiating between meters and kilometers, default: 1000
   * @param round number of numbers behind the comma
   * @returns {number}
   */
  getDistance(start: Location, end: Location, threshold?:number, round?:number): {amount: number, unit: string} {
    if(!threshold){
      threshold = 1000;
    }
    if(!round){
      round = 2;
    }

    let rad = function (x) {
      return x * Math.PI / 180;
    };

    let R: number = 6378137; //Earth Radius
    let dLat = rad(end.latitude - start.latitude);
    let dLong = rad(end.longitude - start.longitude);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(start.latitude)) * Math.cos(rad(end.latitude)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d: number = R * c;

    let d_m:any = d.toFixed(round);
    let d_km:number = d_m/1000;
    let d_km_string:string = d_km.toFixed(round);

    return d < threshold? {amount: Number.parseFloat(d_m), unit: "m"}: {amount: Number.parseFloat(d_km_string), unit: "km"};
  }


  /**
   * Creates Circle on the map
   * @param location the location of the circles centre
   * @param radius the radius of the circle
   * @param color the color of the circle
   * @returns
   */
  async createCircle(location:Location, radius:number, color:string){
    return this.map.createCircle(location,radius,color);
  }
}
