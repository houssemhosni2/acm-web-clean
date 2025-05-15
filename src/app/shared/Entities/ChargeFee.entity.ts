export class ChargeFeeEntity {
    id: number;
    cufeeId: number;
    settingFee: number;
    amount: number;
    charged: Boolean;
    idLoanInstance: number;
    idCollectionInstance: number;
    acmLoanId:number;
    idCollection:number;
    label:string;
    code:string;
    value:string;
    paid : boolean;
    paidAmount : number;
    unpaidAmount : number;
    enabled: boolean;
}