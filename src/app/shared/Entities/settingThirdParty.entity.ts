import { UserDefinedFieldsLinksEntity } from "./userDefinedFieldsLinks.entity";

export class SettingThirdPartyEntity {

  /** The id. */
  id: number;

  /** The first firstName. */
  firstName: string;

  /** The lastName. */
  lastName: string;

  /** The address. */
  addressParty: string;

  /** The email. */
  email: string;

  /** The phone number. */
  phoneNumber: string;

  /** The access branches. */
  accessBranches: string;

  /** The type party. */
  typeParty: string;
  stepName: string;
  branchID: number;
  branchName: string;
  branchDescription: string;
  enabled: boolean;
  dateInsertion: Date;
  action: string; // 'D' ; 'I' ; 'U';

  /** The type. */
  type: string;

  /** The statut. */
  statut: string;

  /** The pays. */
  pays: string;

  /** The ville. */
  ville: string;

  /** The code postal. */
  code_postal: number;

  /** The numero rne. */
  numero_rne: number;

  userDefinedFieldsLinksDTOs: UserDefinedFieldsLinksEntity[];
  listTypes:string[];

  constructor() {

  }
}
