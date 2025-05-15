export class AcmTransaction {
    id: number;
    receiptNumber: number;
    customerType: string;
    transactionType: string;
    amount: number;
    reversed: boolean;
    reversedReceiptNumber: number;
    idAcmChargeFee: number;
    label: string;
    idAcmLoan: number;
    idAcmLoanSchedule: number;
    idAcmCustomer: number;
    enabled: boolean;
    dateInsertion: Date;
}