import { UDFLinksGroupeFieldsEntity } from './udfLinksGroupeFields.entity';

export class LoansUdfEntity {
  /** loan id */
  loanId: number;
  /** account number extern */
  accountNumberExtern: string;
  /** list of udf */
  acmUdfLinksGroupeFieldDTOs: UDFLinksGroupeFieldsEntity[];
  constructor() {
  }
}
