import { LoanEntity } from './loan.entity';

export class LoanApprovalHistory {
  id: number;
  loanDTO: LoanEntity;
  approvalDate: Date;
  approvalAmount: number;
  approvalDesicion: number;
  approvalDesicionLabel: string;
  approvalNote: string;
  approvalLevel: number;
  approvalLevelLabel: string;
  approvedBy: string;

  constructor() {
  }
}
