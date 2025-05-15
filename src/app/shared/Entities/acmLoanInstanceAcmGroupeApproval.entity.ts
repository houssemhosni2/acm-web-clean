import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
export class AcmLoanInstanceAcmGroupeApprovalEntity {
  id: number;
  loanInstance: LoanProcessEntity;
  groupe: GroupeEntity;
  validation: boolean;
  ownerName:string;
  owner:string;
  groupeName:string;
}
