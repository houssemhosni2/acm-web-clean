import { ScheduleEntity } from './schedule.entity';

export class TransitionAccountEntity {

  account : string;
  accountNumber: string;
  BalanceForward: string;
  BalanceDate: string;
  BranchName: string;
  // tslint:disable-next-line:indent
  // The statut : Applied=1, Approved=2, Issued=4, Charged off=8, Bad debt = 16, Transferred=32, Cancelled=64.
  Status: string;
  Active: Boolean;
  constructor() {
  }

}
