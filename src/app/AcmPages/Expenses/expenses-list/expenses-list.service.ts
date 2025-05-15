import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcmURLConstants } from '../../../shared/acm-url-constants';
import { ExpensesEntity } from 'src/app/shared/Entities/expenses.entity';
import { ExpensesPaginationEntity } from 'src/app/shared/Entities/expensesPaginationEntity.entity';
import { ExpensesCountEntity } from 'src/app/shared/Entities/expensesCount.entity';

@Injectable({
  providedIn: 'root'
})

export class ExpensesListService {

  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {

  }

  /**
   * get all Expenses Type
   */
  getAllExpenses(): Observable<ExpensesEntity[]> {
    return this.httpClient.get<ExpensesEntity[]>(AcmURLConstants.FIND_ALL_EXPENSES);
  }

  /**
   * Add Expenses
   */
  addExpenses(expensesEntity: ExpensesEntity): Observable<ExpensesEntity> {
    return this.httpClient.post<ExpensesEntity>(AcmURLConstants.ADD_EXPENSES, expensesEntity);
  }
  updateExpenses(expensesEntity: ExpensesEntity): Observable<ExpensesEntity> {
    return this.httpClient.put<ExpensesEntity>(AcmURLConstants.UPDATE_EXPENSES, expensesEntity);
  }

  /**
   * loan all expenses by status paginations
   * @param expensesPaginationEntity ExpensesPaginationEntity
   * @returns list of expenses
   */
  loadExpensesyStatusPagination(expensesPaginationEntity: ExpensesPaginationEntity): Observable<ExpensesPaginationEntity> {
    return this.httpClient.post<ExpensesPaginationEntity>(AcmURLConstants.FIND_ALL_EXPENSES_PAGINATION, expensesPaginationEntity);
  }

  loadExpensesCount(): Observable<ExpensesCountEntity> {
    return this.httpClient.get<ExpensesCountEntity>(AcmURLConstants.EXPENSES_COUNT);
  }

  getExpensesById(idExpenses : number) : Observable<ExpensesEntity>{
    return this.httpClient.get<ExpensesEntity>(AcmURLConstants.EXPENSES_SERVICE + '/expenses/' + idExpenses);
  }
}
