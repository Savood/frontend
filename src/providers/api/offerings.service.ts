/**
 * Savood
 * denn nur lebendiges food tut gut
 *
 * OpenAPI spec version: 1.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

/* tslint:disable:no-unused-variable member-ordering */

import {Inject, Injectable, Optional} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import '../rxjs-operators';

import {Chat} from '../../models/chat';
import {InvalidParameterInput} from '../../models/invalidParameterInput';
import {Offering} from '../../models/offering';

import {BASE_PATH, COLLECTION_FORMATS} from '../variables';
import {Configuration} from '../configuration';
import {CustomHttpUrlEncodingCodec} from '../encoder';


@Injectable()
export class OfferingsService {

  protected basePath = 'https://virtserver.swaggerhub.com/TimMaa/Savood/1.0';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (let consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }


  /**
   * Add a new offering
   *
   * @param body Offering that needs to be added
   */
  public createNewOffering(body: Offering): Observable<Offering> {
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling createNewOffering.');
    }

    let headers = this.defaultHeaders;

    // authentication (bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/json'
    ];
    let httpHeaderAcceptSelected: string = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [
      'application/json'
    ];
    let httpContentTypeSelected: string = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set("Content-Type", httpContentTypeSelected);
    }

    return this.httpClient.post<any>(`${this.basePath}/offerings`,
      body,
      {
        headers: headers,
        withCredentials: this.configuration.withCredentials,
      }
    );
  }

  /**
   * Delete an offering
   *
   * @param id
   */
  public deleteOfferingById(id: string): Observable<{}> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteOfferingById.');
    }

    let headers = this.defaultHeaders;

    // authentication (bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/json'
    ];
    let httpHeaderAcceptSelected: string = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [];

    return this.httpClient.delete<any>(`${this.basePath}/offerings/${encodeURIComponent(String(id))}`,
      {
        headers: headers,
        withCredentials: this.configuration.withCredentials,
      }
    );
  }

  /**
   * Display a user
   *
   * @param id
   */
  public getAllChatsForOffering(id: string): Observable<Array<Chat>> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getAllChatsForOffering.');
    }

    let headers = this.defaultHeaders;

    // authentication (bearer) required
    // TODO: Uncomment when Authorization is working
    // if (this.configuration.apiKeys["Authorization"]) {
    //     headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
    // }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/json'
    ];
    let httpHeaderAcceptSelected: string = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [];

    return this.httpClient.get<any>(`${this.basePath}/offerings/${encodeURIComponent(String(id))}/chats`,
      {
        headers: headers,
        withCredentials: this.configuration.withCredentials,
      }
    );
  }

  /**
   * Display a feed of nearby offerings
   *
   * @param location
   * @param distance Distance in Meters
   */
  public getFeed(location: string, distance: number): Observable<Array<Offering>> {
    if (location === null || location === undefined) {
      throw new Error('Required parameter location was null or undefined when calling getFeed.');
    }
    if (distance === null || distance === undefined) {
      throw new Error('Required parameter distance was null or undefined when calling getFeed.');
    }

    let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
    if (location !== undefined) {
      queryParameters = queryParameters.set('location', <any>location);
    }
    if (distance !== undefined) {
      queryParameters = queryParameters.set('distance', <any>distance);
    }

    let headers = this.defaultHeaders;

    // authentication (bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/json'
    ];
    let httpHeaderAcceptSelected: string = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [];

    return this.httpClient.get<any>(`${this.basePath}/feed`,
      {
        params: queryParameters,
        headers: headers,
        withCredentials: this.configuration.withCredentials,
      }
    );
  }

  /**
   * Display an offering
   *
   * @param id
   */
  public getOfferingById(id: string): Observable<Offering> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getOfferingById.');
    }

    let headers = this.defaultHeaders;

    // authentication (bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/json'
    ];
    let httpHeaderAcceptSelected: string = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [];

    return this.httpClient.get<any>(`${this.basePath}/offerings/${encodeURIComponent(String(id))}`,
      {
        headers: headers,
        withCredentials: this.configuration.withCredentials,
      }
    );
  }

  /**
   * Display a feed of nearby offerings
   *
   * @param filter Filteres offerings by owned or requested
   */
  public getOfferings(filter?: string): Observable<Array<Offering>> {

    let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
    if (filter !== undefined) {
      queryParameters = queryParameters.set('filter', <any>filter);
    }

    let headers = this.defaultHeaders;

    // authentication (bearer) required
    // TODO: Uncomment when Authorization is working
    // if (this.configuration.apiKeys["Authorization"]) {
    //     headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
    // }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/json'
    ];
    let httpHeaderAcceptSelected: string = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [];

    return this.httpClient.get<any>(`${this.basePath}/offerings`,
      {
        params: queryParameters,
        headers: headers,
        withCredentials: this.configuration.withCredentials,
      }
    );
  }

  /**
   * Update an offering
   *
   * @param id
   * @param body New parameters of the offering
   */
  public updateOfferingById(id: string, body: Offering): Observable<{}> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling updateOfferingById.');
    }
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling updateOfferingById.');
    }

    let headers = this.defaultHeaders;

    // authentication (bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/json'
    ];
    let httpHeaderAcceptSelected: string = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [
      'application/json'
    ];
    let httpContentTypeSelected: string = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set("Content-Type", httpContentTypeSelected);
    }

    return this.httpClient.patch<any>(`${this.basePath}/offerings/${encodeURIComponent(String(id))}`,
      body,
      {
        headers: headers,
        withCredentials: this.configuration.withCredentials,
      }
    );
  }

}