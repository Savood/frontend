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



export interface Message {
    id?: string;
    fromId?: number;
    toId?: number;
    offeringId?: number;
    content?: string;
    time?: Date;
    important?: boolean;
}
