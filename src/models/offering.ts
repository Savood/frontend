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

import { Address } from './address';
import { OfferingLocation } from './offeringLocation';


export interface Offering {
  id?: string;
  name?: string;
  description?: string;
  creatorId?: string;
  bestByDate?: string;
  address?: Address;
  location?: OfferingLocation;
  requestedBy?: number;
  time?: Date;
}
