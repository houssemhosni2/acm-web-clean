import { SettingDocumentTypeEntity } from './settingDocumentType.entity';

export class LoanDocumentEntity {
  idDocument: number;
  idDocumentGED: string;
  idCustomer: number;
  settingDocumentTypeDTO: SettingDocumentTypeEntity;
  titre: string;
  description: string;
  auteur: string;
  dateCreation: string;
  loanId: number;
  file: any;
  insertBy: string;
  accountNumberExtern: string;
  customerName: string;
  mandatory: boolean;
  documentIndex: number;
  name: string;
  processLoanDocuments: boolean;
  customerNumber: string;
  customerIdentity: number;
  expensesId: number;
  documentSize: number;
  telephone1: string;
  collectionInstanceId : number;
  reportName: string;
  collectionStepName : string;
  updatedBy : string ;
  workFlowStepId:number;
  itemInstanceId : number;
  itemStepName : string ;
  itemInstanceIds : number[] =[] ;
  category : string  ;
  elementId : number  ;


  constructor() {
  }
}
