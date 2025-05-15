export class ScheduleEntity {
  period: string;
  idLoan : number;
  repaymentDate: string;
  totalRepayment: number;
  loanRepayment: number;
  interestRepayment: string;
  balance: string;
  interestPaid: string;
  principalPaid: string;
  status: string;
  repaidOn: string;
  nbArrearsDays: string;
  statusLabel: string;
  penalityDue: string;	
	/** The penality paid. */
	penalityPaid: string;	
	/** The Amount written off. */
	amountWrittenOff: string;
	/** The Late days. */
	lateDays: string;
  constructor() {
  }
}
