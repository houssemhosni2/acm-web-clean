import { ProductEntity } from './product.entity';
import { BrancheEntity } from './branche.entity';
import { UserEntity } from './user.entity';
import { AcmStatutsEntity } from './acmstatus.entity';
import { LoanSourceOfFundsEntity } from './loanSourceOfFunds.entity';

export class ReportingEntity {
  productDTOs: ProductEntity[];
  brancheDTOs: BrancheEntity[];
  userDTOs: UserEntity[];
  loanAmountMin: number;
  loanAmountMax: number;
  loanCreateDateMin: string;
  loanCreateDateMax: string;
  loanIssueDateMin: string;
  loanIssueDateMax: string;
  loanStatus: AcmStatutsEntity[];
  customerNumber: string;
  groupNumber: string;
  loanSourceOfFundsDTOs: LoanSourceOfFundsEntity[];
  instalmentDateMin: string;
  instalmentDateMax: string;
  product: boolean;
  branch: boolean;
  loanOfficer: boolean;
  summary: boolean;
  details: boolean;
}
