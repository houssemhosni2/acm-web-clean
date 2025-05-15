import { CustomerEntity } from "./customer.entity";
import { LoanEntity } from "./loan.entity";

export class AcmScoreCheckEntity {
    id: number;
    score: number;
    riskLabel: string;
    riskColor: string;
    customerCategory: string;
    customer: CustomerEntity;
    loan: LoanEntity;
    loandId: number;
    customerId: number;
    enabled: boolean;
    dateInsertion: Date;
    dateLastUpdate: Date;
    acmVersion: number;
    updatedBy: string;
    insertBy: string;
}