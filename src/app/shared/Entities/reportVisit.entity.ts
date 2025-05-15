export class ReportVisitEntity {
  idReportVisit: number;
  plannedVisit: string;
  description: string;
  comment: string;
  insertBy: string;
  idLoan: number;
  visitBy: string;
  dateInsertion: Date;

  constructor() {
  }
}
