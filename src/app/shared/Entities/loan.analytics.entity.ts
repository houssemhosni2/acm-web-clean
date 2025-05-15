export class LoanAnalyticsEntity {
  /** The total. */
  total: number;
  /** The pourcentage. */
  pourcentage: number;

  loanNumberByProduct: number[];
  labelsProducts: string[];

  /** The xaxis categories. */
  xaxisCategories: string[];
  /** The series applied loans. */
  seriesAppliedLoans: number[];
  /** The series approved loans. */
  seriesApprovedLoans: number[];
  /** The series canceled rejected loans. */
  seriesCanceledRejectedLoans: number[];

  currency: string;
  totalCustomers: number;
  totalActivesCustomers: number;
  /** The series amount loans. */
  seriesAmountLoans: number[];
  /** The series total customers. */
  seriesTotalCustomers: number[];
  /** The series total active customers. */
  seriesTotalActiveCustomers: number[];
  constructor() {
  }
}
