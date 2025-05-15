import { LoanEntity } from './loan.entity';

export class LoanHistorique {
  idLoanHistorique: number;
  action: string;
  description: string;
  dateUpdate: Date;
  updatedBy: string;
  loanDTO: LoanEntity;
  category: string;
  assignedTo: string;
  constructor() {
  }
}
