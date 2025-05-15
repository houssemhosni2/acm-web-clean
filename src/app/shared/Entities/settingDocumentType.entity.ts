import { StepEntity } from './step.entity';
export class SettingDocumentTypeEntity {

  id: number;
  code: string;
  libelle: string;
  categorie: number;
  categorieLibelle: string;
  uniqueness: boolean;
  mandatory: boolean;
  description: string;
  dateDebut: Date;
  dateFin: Date;
  enabled: boolean;
  collections: StepEntity[];
  reportName: string;
  name : string ;
  file: any;
  idDocumentGED  : string ;
  dateCreation : Date = new Date() ;

  constructor() {
  }
}
