import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AcmURLConstants } from '../../../shared/acm-url-constants';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { Observable } from 'rxjs';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';

@Injectable({
  providedIn: 'root'
})
export class DashbordServices {
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * load Dashboard Loans By Status
   * @param loanEntity loanEntity
   */
  loadDashboardByStatus(loanEntity: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.FIND_LOANS, loanEntity);
  }

  /**
   * load Dashboard Loans By Status and paginations
   * @param loanPaginationEntity LoanPaginationEntity
   */
  loadDashboardByStatusPagination(loanPaginationEntity: LoanPaginationEntity): Observable<LoanPaginationEntity> {
    return this.httpClient.post<LoanPaginationEntity>(AcmURLConstants.FIND_LOANS_PAGINATIONS, loanPaginationEntity);
  }
  /**
   * load unassigned loans and pagination
   * @param loanPaginationEntity LoanPaginationEntity
   * @returns LoanPaginationEntity
   */
  loadUnassignedLoans(loanPaginationEntity: LoanPaginationEntity): Observable<LoanPaginationEntity> {
    return this.httpClient.post<LoanPaginationEntity>(AcmURLConstants.FIND_UNASSIGNED_PAGINATIONS, loanPaginationEntity);
  }
  /**
   * methode count My Loan
   */
  countMyLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_LOANS_MY_TASK);
  }

  /**
   * methode countNewLoans
   */
  countNewLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_LOANS_STATUS_TAB_NEW);
  }

  /**
   * methode countDraftsLoans
   */
  countDraftsLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_LOANS_STATUS_TAB_DRAFTS);
  }

  /**
   * methode countPendingApprovalLoans
   */
  countPendingApprovalLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_LOANS_STATUS_TAB_PENDING_APPROVAL);
  }

  /**
   * methode countApprovedLoans
   */
  countApprovedLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_LOANS_STATUS_TAB_APPROVED);
  }

  /**
   * methode countRejectedLoans
   */
  countRejectedLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_LOANS_STATUS_TAB_REJECTED);
  }

  /**
   * methode countCancelledLoans
   */
  countCancelledLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_LOANS_STATUS_TAB_CANCELLED);
  }

  /**
   * methode countReviewedLoans
   */
  countReviewedLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_LOANS_STATUS_TAB_REVIEW);
  }

  /**
   * methode countUnassignedLoans
   * @returns number
   */
  countUnassignedLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_LOANS_STATUS_TAB_UNASSIGNED);
  }

  /**
   * load Filter list Status Workflow By Status
   * @param loanEntity loanEntity
   */
  loadFilterStatusWorkflow(loanEntity: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.LOAD_FILTER_STATUS_WORKFLOW, loanEntity);

  }

  /**
   * load Filter list Product By Status
   * @param loanEntity loanEntity
   */
  loadFilterProduct(loanEntity: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.LOAD_FILTER_PRODUCT, loanEntity);
  }
  /**
   * load Filter list Product for unassigned loans
   * @param loanEntity loanEntity
   * @returns LoanEntity[]
   */
  loadFilterProductUnassignedLoans(loanEntity: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.LOAD_FILTER_PRODUCT_UNASSIGNED_LOANS, loanEntity);
  }

  /**
   * load Filter list Status for unassigned loans
   * @param loanEntity loanEntity
   * @returns LoanEntity[]
   */
  loadFilterStatusUnassignedLoans(loanEntity: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.LOAD_FILTER_STATUS_UNASSIGNED_LOANS, loanEntity);
  }
  /**
   * load Filter Branch by params
   * @param loanEntity loanEntity
   */
  loadFilterBranch(loanEntity: LoanEntity): Observable<LoanEntity[]> {
      return this.httpClient.post<LoanEntity[]>(AcmURLConstants.LOAD_FILTER_BRANCH, loanEntity);

    }
  /**
   * methode countIssuedLoans
   */
  countIssuedLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_LOANS_STATUS_TAB_ISSUED);
  }
}
