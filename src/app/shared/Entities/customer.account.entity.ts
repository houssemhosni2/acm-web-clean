import { ScheduleEntity } from './schedule.entity';

export class CustomerAccountEntity {
  customerId: string;
  loanId: string;
  account: string;
  cuAccountId: string;
  issueDate: string;
  issueAmount: string;
  portfolioId: string;
  statutId: string;
  acmLoanId: number;
  // tslint:disable-next-line:indent
  // The statut : Applied=1, Approved=2, Issued=4, Charged off=8, Bad debt = 16, Transferred=32, Cancelled=64.
  statut: string;
  accountRating: string;
  balance: string;
  scheduleDTOs: ScheduleEntity[];
  canTopup: boolean;
  topupProduct: boolean;
  refinanceProduct: boolean;
  currencyCode : string;
  accountNumberExtern:string;
  paid: boolean;
  portfolioDescription: string;
  issuedStatut: string;
  
  // Flag in case of PayOut
  calculatePayOutFee: boolean;

  constructor() {
  }

}
