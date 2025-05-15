import { LoanDocumentEntity } from './loanDocument.entity';

export class LoansDocumentsEntity {
  /** loan id */
  loanId: number;
  /** account number extern */
  accountNumberExtern: string;
  /** list of document */
  acmDocumentsDTOs: LoanDocumentEntity[];
  constructor() {
  }
}
