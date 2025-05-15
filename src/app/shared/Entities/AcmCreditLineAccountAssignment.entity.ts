import { creditLineEntity } from "./AcmCreditLine.entity";
import { CreditLineAccount } from "./acmCreditLineAccount.entity";
import { LoanEntity } from "./loan.entity";

export class AcmCreditLineAccountAssignment {
  id: number;
  creditLine: creditLineEntity;
  creditLineAccount: CreditLineAccount;
  loan: LoanEntity;
  amount: number;
}
