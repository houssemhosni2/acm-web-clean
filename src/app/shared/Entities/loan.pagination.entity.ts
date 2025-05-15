import { LoanEntity } from './loan.entity';

export class LoanPaginationEntity {
  id?: any;
  pageNumber: number;
  pageSize: number;
  params: LoanEntity;
  sortDirection: number;
  sortField: string;
  resultsLoans: LoanEntity[];
  totalPages: number;
  totalElements: number;
  totalAmount: number;
  constructor() {

  }
}
