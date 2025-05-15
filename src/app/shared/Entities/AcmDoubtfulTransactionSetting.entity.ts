import { GenericWorkFlowObject } from "./GenericWorkFlowObject";

export class AcmDoubtfulTransactionSetting {
    id: number;
    cumultativeAmount: number;
    cumultativeAmountPeriod: number;
    minRiskScore: number;
    maxRiskScore: number;
    maxInstalmentsNumberPaid: number;
    maxInstalmentsAmountPaid: number;
    maxEarlyRepaymentNumber: number;
    maxEarlyRepaymentAmount: number;
    genericWorkFlowObject: GenericWorkFlowObject;
    enabled: boolean;
    dateInsertion: Date;
    dateLastUpdate: Date;
    acmVersion: number;
    updatedBy: string;
    insertBy: string;
}