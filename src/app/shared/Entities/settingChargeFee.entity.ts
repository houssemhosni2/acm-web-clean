export class SettingChargeFeeEntity {
    id: number;
    dateInsertion: Date;
    cufeeId: number;
    label: string;
    value: string;
    code: string;
    percentage: number;
    amount: number;
    insertBy : string;
    enabled: boolean;
    idCollection : number;
    idLoanExtern : number;
    feeType : string;
    feeTypes : string[];
    nextInstallementInterestNumber: number;
    feeIds : number[];
  }