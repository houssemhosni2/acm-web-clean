import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AcmURLConstants } from '../../../shared/acm-url-constants';
import { Observable } from 'rxjs';
import { CustomerPaginationEntity } from '../../../shared/Entities/customer.pagination.entity';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';

@Injectable({
  providedIn: 'root'
})
export class CustomerListService {

  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * getCustomer Pagination
   */
  getCustomersPagination(customerPaginationEntity: CustomerPaginationEntity): Observable<CustomerPaginationEntity> {
    return this.httpClient.post<CustomerPaginationEntity>(AcmURLConstants.GET_CUSTOMERS_PAGINATION, customerPaginationEntity);
  }
  /**
   * getCustomerForLink Pagination
   */
  getCustomerForLinkPagination(customerPaginationEntity: CustomerPaginationEntity): Observable<CustomerPaginationEntity> {
    return this.httpClient.post<CustomerPaginationEntity>(AcmURLConstants.GET_CUSTOMER_FOR_LINK, customerPaginationEntity);
  }

  /**
   * addGuarantors
   */
  addGuarantors(loan: LoanEntity): Observable<LoanEntity> {
    return this.httpClient.post<LoanEntity>(AcmURLConstants.ADD_GUARANTORS, loan);
  }
  /**
   * getLoansByCustomer by given params
   * @param idCustomer the customerID
   */
  getLoansByCustomer(idCustomer): Observable<LoanEntity[]> {
    return this.httpClient.get<LoanEntity[]>(AcmURLConstants.FIND_LOANS_BY_CUSTOMER + idCustomer);
  }
  /**
   * get loan by id
   * @param idLoan number
   * @returns LoanEntity
   */
  getLoanByLoanId(idLoan): Observable<LoanEntity> {
    return this.httpClient.get<LoanEntity>(AcmURLConstants.FIND_LOANS + idLoan);
  }
  /**
   *
   * @param idCustomerExtern idCustomerExtern
   * @returns true / false
   */
  checkMaxActiveAccountByCustomer(idCustomerExtern: number): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.CHECK_MAX_ACTIVE_ACCOUNT_CUSTOMER + idCustomerExtern);
  }

  /**
   * checkLoanIssuedByCustomer (Check if the customer have an issued loan)
   * @param customer customer
   * @returns boolean
   */
  checkLoanIssuedByCustomer(customer: CustomerEntity): Observable<boolean> {
    return this.httpClient.post<boolean>(AcmURLConstants.CHECK_EXIST_LOAN_ISSUE_FOR_CUSTOMER, customer);
  }

      /**
   * saveCUSTOMERIB
   */
      saveCUSTOMERIB(customerEntity: CustomerEntity): Observable<CustomerEntity> {
        return this.httpClient.post<CustomerEntity>(AcmURLConstants.CREATE_CUSTOMER_IB, customerEntity);
      }
}
