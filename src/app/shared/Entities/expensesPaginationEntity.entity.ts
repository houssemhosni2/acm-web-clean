import { ExpensesEntity } from './expenses.entity';

export class ExpensesPaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: ExpensesEntity;
  sortDirection: number;
  sortField: string;
  resultsExpenses: ExpensesEntity[];
  totalPages: number;
  totalElements: number;
  constructor() {

  }
}
