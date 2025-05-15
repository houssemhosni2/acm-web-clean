import { ChargeFeeEntity } from "./ChargeFee.entity";
import { ScheduleEntity } from "./schedule.entity";

export class InformationsPaymentEntity{
  principalDue: number;
  interestDue: number;
  openingBalance: number;
  closingBalance: number;
  accountRating: string;
  balanceDate: string;
  issueAmount: number;
  issueDate: string;
  arrearsInformation: string;
  arrearsAmount: number;
  arrearsDays: number;
  currentInstallmentNumber: number;
  nextDueDate: string;
  penaltyDue: number;
  feesDue: number;
  customerName: string;
  accountID: number;
  sessionDate: string;
	amountToBePaid : number;
  payedAmount : number;
  firstUnpaidPeriod : number;
  penaltyChargeFeesDTO : ChargeFeeEntity;
  oldChargeFeesDTOs : ChargeFeeEntity[];
  payOutChargeFeesDTO: ChargeFeeEntity;
  scheduleDTOs : ScheduleEntity[];
  numberUnpaidInstallments : number;
  maxAmountToBePayed : number;
}
