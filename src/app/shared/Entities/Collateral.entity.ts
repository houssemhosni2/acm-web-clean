import { CustomerEntity } from './customer.entity';
import { LoanEntity } from './loan.entity';
import { UserDefinedFieldsLinksEntity } from './userDefinedFieldsLinks.entity';

export class CollateralEntity {

    /** id acm collateral */
    idAcmCollateral: number;

    /** The loan. */
    loan: LoanEntity;

    /** The externloan id. */
    externLoanId: number;

    /** The reference. */
    reference: string;

    /** The description. */
    description: string;

    /** The collateral type id extern. */
    collateralTypeIdExtern: number;

    /** collateralTypeDescription */
    collateralTypeDescription: string;

    /** The id account extern. */
    idAccountExtern: number;

    /** The extern customer id. */
    externCustomerId: number;

    /** The customer. */
    customer: CustomerEntity;

    /** The original gross value. */
    originalGrossValue: number;

    /** The gross value. */
    grossValue: number;

    /** The realised value. */
    realisedValue: number;

    /** The fixed cost. */
    fixedCost: number;

    /** The net value. */
    netValue: number;

    /** The value date. */
    valueDate: Date;

    /** The expiry date. */
    expiryDate: Date;

    /** The with holding rate. */
    withHoldingRate: number;

    /** The is deleted. */
    isDeleted: boolean;

    /** The valuer id. */
    valuerId: string;

    /** The valuer name. */
    valuerName: string;

    /** the accountNumber. */
    accountNumber: string;
  action : string;
    /** the UserDefinedFieldsLinksEntity */
    userDefinedFieldsLinksDTOs : UserDefinedFieldsLinksEntity[];
    enabled :boolean;
    constructor() {
    }

}
