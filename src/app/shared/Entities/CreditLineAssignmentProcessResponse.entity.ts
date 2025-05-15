import { CreditLineAccount } from "./acmCreditLineAccount.entity";

export class CreditLineAssignmentProcessResponse {

  status : string;
  creditLineAccounts : CreditLineAccount[];
  nbrRecords : number;
}
