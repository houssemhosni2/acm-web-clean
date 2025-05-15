export class GroupeEntity {
  idAcmGroup: number;
  code: string;
  libelle: string;
  description: string;
  enabled: boolean;
  validation:boolean;
  ownerName:string;
  linkedPortfolio:boolean;

  constructor() {

  }
}
