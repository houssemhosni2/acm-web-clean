import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from '../../../shared/acm-url-constants';
import { HttpClient } from '@angular/common/http';
import { LoanHistorique } from '../../../shared/Entities/loan.historique';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { CustomerContactEntity } from '../../../shared/Entities/CustomerContactEntity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {

  constructor(public httpClient: HttpClient) {
    // Empty
  }

  /**
   * get Loan Historique
   * @param loanHistorique loanHistorique
   */
  getLoanHistorique(loanHistorique: LoanHistorique): Observable<LoanHistorique[]> {
    return this.httpClient.post<LoanHistorique[]>(AcmURLConstants.GET_LOAN_HISTORIQUE, loanHistorique);
  }

  /**
   * reassign loan
   * @param loanDTO loanDTO
   */
  reassignLoan(loanDTO: LoanEntity): Observable<LoanEntity> {
    return this.httpClient.post<LoanEntity>(AcmURLConstants.REASSIGN_LOAN, loanDTO);
  }

  /**
   * Send contact mail
   */
  sendMail(customerContact: CustomerContactEntity): Observable<CustomerContactEntity> {
    return this.httpClient.post<CustomerContactEntity>(AcmURLConstants.SEND_MAIL_CUSTOMER, customerContact);
  }

  /**
   * update assign to customer loan
   * @param loanEntity LoanEntity
   */
  updateAssignCustomer(loanEntity: LoanEntity): Observable<LoanEntity> {
    return this.httpClient.put<LoanEntity>(AcmURLConstants.UPDATE_LOAN_ASSIGN_CUSTOMER, loanEntity);
  }

  /**
   * cancel Loan
   * @param loanEntity LoanEntity
   */
  cancelLoan(loanEntity: LoanEntity): Observable<LoanEntity> {
    return this.httpClient.post<LoanEntity>(AcmURLConstants.CANCEL_LOAN, loanEntity);
  }

  /**
   * Find list user (ALL {@link UserHierarchicalType}) for connected user && if FullList=True add
   * list of user with {@link UserCategory}=MANAGMENT for his branch.
   */
  loadAllUserList(): Observable<UserEntity[]> {
    return this.httpClient.get<UserEntity[]>(AcmURLConstants.LOAD_FULL_USERS_LIST);
  }
}
