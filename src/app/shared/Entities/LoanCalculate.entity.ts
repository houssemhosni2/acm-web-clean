import { ScheduleEntity } from './schedule.entity';

export class LoanCalculateEntity {
  apr: number;
  effectiveInterestAmount: number;
  initialPaymentDate: Date;
  loanSchedule: ScheduleEntity[];
  maturityDate: Date;
  message: string;
  normalPayment: number;
  statusCode: string;
  effectiveInterestRate: number;
  insurancePremium: number;
  issueAmount: number;
  effectiveInterestRateStandard: number;
  interestRate: number;
  issueFee: number;
  feeAmt1: number;
  acmIssueFee: number;
}
