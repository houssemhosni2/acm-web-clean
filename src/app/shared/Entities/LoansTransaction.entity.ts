import { AcmTransaction } from "./AcmTransaction.entity";

export class LoansTransaction {
    loanId: number;
    transactions: AcmTransaction[];
    page: number;
    pageSize: number;
}