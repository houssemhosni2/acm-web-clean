import { creditLineEntity } from "./AcmCreditLine.entity";
import { CreditLineAccount } from "./acmCreditLineAccount.entity";

export class AcmCreditLineAssignmentHistory {
  id: number;
  accountNumber: string;
  fundName: string;
  transactionType: string;
  creditLine: creditLineEntity;
  creditLineAccount: CreditLineAccount;
  enabled: boolean;
  dateInsertion: Date;
  dateLastUpdate: Date;
  acmVersion: number;
  updatedBy: string;
  insertBy: string;
}
