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

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }               from '@angular/common/http';

import { Observable }                                        from 'rxjs/Observable';
import '../rxjs-operators';

import { InvalidParameterInput } from '../../models/invalidParameterInput';
import { Message } from '../../models/message';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';


@Injectable()
export class MessageService {

    protected basePath = 'https://virtserver.swaggerhub.com/TimMaa/Savood/1.0';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
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
     * Add a new message
     *
     * @param body Message that needs to be added
     */
    public createNewMessage(body: Message): Observable<Message> {
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling createNewMessage.');
        }

        let headers = this.defaultHeaders;

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
        let httpContentTypeSelected:string = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.post<any>(`${this.basePath}/message`,
            body,
            {
                headers: headers,
                withCredentials: this.configuration.withCredentials,
            }
        );
    }

    /**
     * Delete a message
     *
     * @param id
     */
    public deleteMessageById(id: string): Observable<{}> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling deleteMessageById.');
        }

        let headers = this.defaultHeaders;

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

        return this.httpClient.delete<any>(`${this.basePath}/message/${encodeURIComponent(String(id))}`,
            {
                headers: headers,
                withCredentials: this.configuration.withCredentials,
            }
        );
    }

    /**
     * Display a message
     *
     * @param id
     */
    public getMessageById(id: string): Observable<Message> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getMessageById.');
        }

        let headers = this.defaultHeaders;

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

        return this.httpClient.get<any>(`${this.basePath}/message/${encodeURIComponent(String(id))}`,
            {
                headers: headers,
                withCredentials: this.configuration.withCredentials,
            }
        );
    }

    /**
     * Update a message
     *
     * @param id
     * @param body New parameters of the message
     */
    public updateMessageById(id: string, body: Message): Observable<{}> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling updateMessageById.');
        }
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling updateMessageById.');
        }

        let headers = this.defaultHeaders;

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
        let httpContentTypeSelected:string = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.patch<any>(`${this.basePath}/message/${encodeURIComponent(String(id))}`,
            body,
            {
                headers: headers,
                withCredentials: this.configuration.withCredentials,
            }
        );
    }

}
