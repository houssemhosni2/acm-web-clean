export class CustomerDecisionEntity {
  id: number;
  contactDate: Date;
  contactMethod: string;
  comments: string;
  idLoan: number;
  statusId: number;
  statusLibelle: string;
  amount: number;
  insertBy: string;

  constructor() {
  }
}
