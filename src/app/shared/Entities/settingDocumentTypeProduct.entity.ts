import { SettingDocumentTypeEntity } from './settingDocumentType.entity';
export class SettingDocumentTypeProductEntity {

  id: number;
  settingDocumentTypeDTO: SettingDocumentTypeEntity;
  productId: number;
  mandatory: boolean;
  dateDebut: Date;
  dateFin: Date;
  enabled: boolean;
  all: boolean;
  reportName: string;
  updated: boolean;
  constructor() {
  }

}
