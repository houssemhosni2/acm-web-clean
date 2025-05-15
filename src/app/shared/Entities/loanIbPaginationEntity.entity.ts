import { LoanIbEntity } from './loanIb.entity';

export class LoanIbPaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: LoanIbEntity;
  sortDirection: number;
  sortField: string;
  resultsIbLoans: LoanIbEntity[];
  totalPages: number;
  totalElements: number;
  constructor() {

  }
}
