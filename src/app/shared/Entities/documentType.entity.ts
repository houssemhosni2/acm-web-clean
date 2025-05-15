import { SettingDocumentTypeEntity } from './settingDocumentType.entity';

export class DocumentTypeEntity {

  title: string;
  settingDocumentType: SettingDocumentTypeEntity;
  name: string;
  date: string;
  file: any;
  idfile: string;
  idDocument: number;
  idDocumentGED: string;
  description: string;
  flag: number;
  mandatory: boolean;
  documentIndex: number;
  exist: boolean;
  reportName : string;
  updatedBy:string;

  constructor() {
  }
}
