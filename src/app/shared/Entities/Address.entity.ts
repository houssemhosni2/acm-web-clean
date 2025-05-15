import { SupplierEntity } from './Supplier.entity';

export class AddressEntity {
  /** The id. */
  id: number;

  /** The customer id. */
  customerId: number;

  /** The address 1. */
  address1: string;

  /** The address 2. */
  address2: string;

  /** The address 3. */
  address3: string;

  /** The town city. */
  townCity: string;

  /** The county. */
  county: string;

  /** The state. */
  state: string;

  /** The postal code. */
  postalCode: string;

  /** The country. */
  country: string;

  /** The region. */
  region: string;

  /** The address 1 id. */
  address1Id: number;

  /** The address 2 id. */
  address2Id: number;

  /** The address 3 id. */
  address3Id: number;

  /** The town city id. */
  townCityId: number;

  /** The county id. */
  countyId: number;

  /** The state id. */
  stateId: number;

  /** The postal code id. */
  postalCodeId: number;

  /** The country id. */
  countryId: number;

  /** The region id. */
  regionId: number;

  /** The address type id. */
  addressTypeId: number;

  /** The date moved in. */
  dateMovedIn: any;

  /** The date moved out. */
  dateMovedOut: any;

  /** The is primary. */
  isPrimary: boolean;

  /** The lan. */
  lan: string;

  /** The lng. */
  lng: string;

  /** the Action. */
  action: string;

  /** the reason Update. */
  reasonUpdate: string;

  /** delete address (does not exist in DB) */
  delete: boolean;
  forRemove =false ;
  supplier : SupplierEntity ;
}
