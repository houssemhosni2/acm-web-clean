export class ExpensesEntity {
  id: number;
  idExpensesType: string;
  expensesAmount: number;
  owner: string;
  teller: string;
  applyDate: Date;
  description: string;
  statut: number;
  balance: number;
  idBranch: number;
  branchDescription: string;
  expensesTypeLibelle: string;
  ownerName: string;
  tellerName: string;
  note: string;
  constructor() {

  }
}
