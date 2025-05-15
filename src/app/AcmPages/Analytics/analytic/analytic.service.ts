import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoanAnalyticsEntity } from 'src/app/shared/Entities/loan.analytics.entity';
import { AcmURLConstants } from '../../../shared/acm-url-constants';

@Injectable({
  providedIn: 'root'
})
export class AnalyticService {

  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * methode totalAppliedLoans
   */
  totalAppliedLoans(): Observable<LoanAnalyticsEntity> {
    return this.httpClient.get<LoanAnalyticsEntity>(AcmURLConstants.TOTAL_APPLIED_LOANS);
  }

  /**
   * methode totalApprovedLoans
   */
  totalApprovedLoans(): Observable<LoanAnalyticsEntity> {
    return this.httpClient.get<LoanAnalyticsEntity>(AcmURLConstants.TOTAL_APPROVED_LOANS);
  }

  /**
   * methode totalLoansAmount
   */
  totalLoansAmount(): Observable<LoanAnalyticsEntity> {
    return this.httpClient.get<LoanAnalyticsEntity>(AcmURLConstants.TOTAL_LOANS_AMOUNT);
  }

  /**
   * methode totalCanceledRejectedLoans
   */
  totalCanceledRejectedLoans(): Observable<LoanAnalyticsEntity> {
    return this.httpClient.get<LoanAnalyticsEntity>(AcmURLConstants.TOTAL_CANCELED_REJECTED_LOANS);
  }

  /**
   * methode countLoansByProducts
   */
  countLoansByProducts(): Observable<LoanAnalyticsEntity> {
    return this.httpClient.get<LoanAnalyticsEntity>(AcmURLConstants.COUNT_LOANS_PRODUCTS);
  }

  /**
   * methode loansStatByMonths
   */
  loansStatByMonths(): Observable<LoanAnalyticsEntity> {
    return this.httpClient.get<LoanAnalyticsEntity>(AcmURLConstants.COUNT_LOANS_BY_MONTHS);
  }

  /**
   * methode totalCustomers
   */
  totalCustomers(): Observable<LoanAnalyticsEntity> {
    return this.httpClient.get<LoanAnalyticsEntity>(AcmURLConstants.TOTAL_CUSTOMERS);
  }

  /**
   * methode totalActiveCustomers
   */
  totalActiveCustomers(): Observable<LoanAnalyticsEntity> {
    return this.httpClient.get<LoanAnalyticsEntity>(AcmURLConstants.TOTAL_ACTIVE_CUSTOMERS);
  }

  /**
   * methode loansStatByMonths
   */
  loansAmountStatByMonths(): Observable<LoanAnalyticsEntity> {
    return this.httpClient.get<LoanAnalyticsEntity>(AcmURLConstants.COUNT_LOANS_AMOUNT_BY_MONTHS);
  }

  /**
   * methode customersStatByMonths
   */
  customersStatByMonths(): Observable<LoanAnalyticsEntity> {
    return this.httpClient.get<LoanAnalyticsEntity>(AcmURLConstants.COUNT_CUSTOMERS_BY_MONTHS);
  }

}
