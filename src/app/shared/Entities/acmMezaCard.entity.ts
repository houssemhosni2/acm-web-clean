import { CustomerEntity } from './customer.entity';

export class AcmMezaCardEntity {

  /** The idMezaCard. */
  idMezaCard: number;

  /** The id document. */
  idDocument: number;

  /** The merchant ID. */
  merchantID: number;

  /** The card type. */
  cardType: string;

  /** The card number. */
  cardNumber: string;

  /** The account. */
  account: string;

  /** The expirty date. */
  expirtyDate: Date;

  /** The activity date. */
  activityDate: Date;

  /** The embossed name. */
  embossedName: string;

  /** The status. */
  status: string;

  /** The branch ID. */
  branchID: number;

  /** The branch ID. */
  branchName: string;

  /** The customer ID. */
  customerDTO: CustomerEntity;

  /** The list status. */
  listStatus: string[];

  /** The acces branch used for find access branch for user. */
  accessBranch: boolean;

}
