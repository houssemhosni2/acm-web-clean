import { AddressEntity } from './Address.entity';
import { AssetEntity } from './Asset.entity';
import { ConventionEntity } from './Convention.entity';
import { UserDefinedFieldsLinksEntity } from './userDefinedFieldsLinks.entity';

export class SupplierEntity {
  /** The id supplier. */
  id: number;

  type: number;

  /** The name Supplier */
  name: string;

  /** The activity . */
  activity: number;

  /** The  acronyme. */
  acronyme: string;

  /** The legalCatalog. */
  legalCatalog: number;

  /** The commercialName. */
  commercialName: string;

  /** The email. */
  email: string;

  /** The activityStartDate. */
  activityStartDate: any;

  /** The registerNumber. */
  registerNumber: string;

  telephone: string;

  telephone2: string;

  webSite: number;

  status: string;

  periodicity: number;

  /** the objective */
  objectif: number;

  /** The conventions */
  conventions: ConventionEntity[];

  /** The list address */
  listAddress: AddressEntity[];

  /** The insert by */
  insertBy: string;

  /** The date of insertion */
  dateInsertion: Date;

  /** The activity Name */
  activityName: string;

  /** The assets */
  assets: AssetEntity[];

  /** The status not contracted */
  statusNotContracted: string ;
  /** The status Rejected */
  statusRejected : string  ;

  userDefinedFieldsLinksDTOs: UserDefinedFieldsLinksEntity[];
  /** The identity. */
  identity: string;

  isCustomer: boolean;

  withholdingTax:number;

  /** is Approved. */
  isApproved: boolean;
}
