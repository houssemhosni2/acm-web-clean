import { creditLineEntity } from "./AcmCreditLine.entity";

export class toppedUpHistoryEntity {
  id: number;
  amount: number;
  creditLine: creditLineEntity;
  issueDate: Date;
  dateLastUpdate: Date;
  updatedBy: string;
  enabled: boolean;
}
