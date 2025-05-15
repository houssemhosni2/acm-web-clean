import { AcmDoubtfulTransactionEntity } from "./AcmDoubtfulTransaction.entity";

export class AcmDoubtfulLoanAnalyticsEntity {
    id  : number;
    customerId: number;
    accumulateAmount: number;
    accountNumber: string;
    percentageAmount: number;
    nbrInstallment: number;
    idAcmLoan: number;
    acmDoubtfulTransactionDTOs: AcmDoubtfulTransactionEntity[];
    doubtfulWorkflowId: number;
    paidAfter: number;
    payout: number;
     constructor( ) {
 
     }
 
 }
 