import { LoanEntity } from './loan.entity';

export class LoanNoteHistory {
  loanDTO: LoanEntity;
  actionDate: Date;
  typeNote: string;
  comments: string;
  // converted comments from html to text type
  convertedComments: string;
  // loan approvel history
  approvalAmount: number;
  approvalDesicion: number;
  approvalDesicionLabel: string;
  approvalLevel: number;
  approvalLevelLabel: string;
  approvedBy: string;
  // custmor note
  contactMethod: string;
  statusId: number;
  statusLibelle: string;
  amount: number;
  insertBy: string;

  constructor() {
  }
}
