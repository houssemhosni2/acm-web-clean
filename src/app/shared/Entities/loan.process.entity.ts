export class LoanProcessEntity {
  id: number;
  code: number;
  libelle: string;
  client : string;
  description: string;
  codeStatutLoan: string;
  statutLoan: string;
  idLoan: number;
  ihmRoot: string;
  ibIhmRoot: string;
  orderEtapeProcess: number;
  actionUser: string;
  enabled: boolean;

  constructor() {

  }
}
