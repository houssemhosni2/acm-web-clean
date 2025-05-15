import { CustomerEntity } from './customer.entity';
import { ScheduleEntity } from './schedule.entity';

export class LoanIbEntity {
  loanIdIb: string;
  applyAmountTotal: number;
  approvelAmount: number;
  applyDate: Date;
  currencyId: string;
  gracePeriod: number;
  industryCode: string;
  industryCodeDescription: string;
  issueDate: Date;
  initialPaymentDate: Date;
  portfolioId: string;
  productId: number;
  statut: number;
  accountNumberIb: string;
  creationDate: string;
  termPeriodNum: number;
  paymentPeriod: string;
  paymentFreq: string;
  issueFeeAmount: string;
  productCode: string;
  productDescription: string;
  productRate: number;
  loanReasonCode: string;
  loanReasonDescription: string;
  portfolioCode: string;
  portfolioDescription: string;
  currencySymbol: string;
  currencyDecimalPlaces: string;
  customerName: string;
  customerNameNoPipe: string;
  customerType: string;
  owner: string;
  ownerName: string;
  note: string;
  dateLastUpdate: Date;
  contactDateCustomerDecision: Date;
  commentsCustomerDecision: string;
  /* confirm checkbox reject/review/approve : check BE*/
  confirm: boolean;
  normalPayment: string;
  listMissingData: string[];
  customerDTO: CustomerEntity;
  customerAddress: string;
  projectDescription: string;
  loanType: string;
  loanSchedules : ScheduleEntity[];

  /** From Generic Model DTO */
  dateInsertion: Date;
  enabled : Boolean;
  acmVersion : number;
  updatedBy : string;
  insertBy : string;

  constructor() {}
}
