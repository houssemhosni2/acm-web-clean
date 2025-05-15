import { AcmBranches } from "./AcmBranches.entity";
import { AcmCurrencySetting } from "./acmCurrencySetting.entity";
import { AcmGlAccount } from "./AcmGlAccount.entity";
import { AdvancedSearchDTO } from "./AdvancedSearchDTO.entity";
import { LoanEntity } from "./loan.entity";

export class AcmJournal {
  id: number;
  description: string;
  valueDate: Date;
  credit: boolean;
  amount: number;
  isPosted: boolean;
  receiptNumber: number;
  acmGlAccount: AcmGlAccount;
  acmLoan: LoanEntity;
  acmCurrencySetting: AcmCurrencySetting;
  acmBranch: AcmBranches;
  dateInsertion: Date;
  enabled: boolean;
  dateLastUpdate: Date;
  acmVersion: number;
  updatedBy: string;
  insertBy: string;

  advancedSearchDTO: AdvancedSearchDTO[];
  drAccount: AcmGlAccount;
  crAccount: AcmGlAccount;
}