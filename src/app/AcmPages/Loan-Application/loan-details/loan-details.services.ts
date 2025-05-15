import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AcmURLConstants} from '../../../shared/acm-url-constants';
import {Injectable} from '@angular/core';
import {LoanDetailsEntity} from 'src/app/shared/Entities/loan.details.entity';
import {LoanEntity} from 'src/app/shared/Entities/loan.entity';
import {SettingMotifRejetsEntity} from '../../../shared/Entities/settingMotifRejets.entity';
import { ThirdPartyHistoriqueEntity } from 'src/app/shared/Entities/thirdPartyHistorique.entity';

@Injectable({
  providedIn: 'root'
})
export class LoanDetailsServices {
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * load loan details
   * @param loanID loanID
   */
  loanDetails(loanID: string): Observable<LoanDetailsEntity> {
    return this.httpClient.get<LoanDetailsEntity>(AcmURLConstants.LOAN_DETAILS + loanID);
  }

  /**
   * validate loan using workflow schema
   * @param loan the loan
   */
  validate(loan: LoanEntity): Observable<LoanEntity> {
    return this.httpClient.post<LoanEntity>(AcmURLConstants.VALIDATE_LOAN, loan);
  }

  /**
   * validate loan in Ready for Disbursement step
   * @param loan the loan
   */
  validateForDisbursement(loan: LoanEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.VALIDATE_LOAN_READY_DISBURSEMENT, loan);
  }

  /**
   * check if the loan status in abacus is issued
   * @param idLoanExtern id loan Extern
   * @returns true / false
   */
  checkIssuedStatus(idLoanExtern: string): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.CHECK_ISSUED_STATUS + idLoanExtern);
  }

  /**
   * getReason
   * @param settingMotifRejetsEntity the settingMotifRejetsEntity
   */
  getReason(settingMotifRejetsEntity: SettingMotifRejetsEntity): Observable<SettingMotifRejetsEntity[]> {
    return this.httpClient.post<SettingMotifRejetsEntity[]>(AcmURLConstants.GET_MOTIF_REJETS, settingMotifRejetsEntity);
  }

  /**
   * validate list loan using workflow schema
   * @param loan the loan
   */
  validateAll(loans: LoanEntity[]): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.VALIDATE_ALL_LOAN, loans);
  }

  /**
   * reject loan without using workflow schema
   * @param loan the loan
   */
  rejectLoan(loan: LoanEntity): Observable<LoanEntity> {
    return this.httpClient.post<LoanEntity>(AcmURLConstants.REJECT_LOAN, loan);
  }
/**
 * LoanReview
 *
 * @param loan LoanEntity
 * @returns LoanEntity
 */
  LoanReview(loan: LoanEntity): Observable<LoanEntity> {
    return this.httpClient.post<LoanEntity>(AcmURLConstants.LOAN_REVIEWS, loan);
  }
/**
 * get Loan Information From IB
 *
 * @param idIbLoan  number
 * @returns LoanEntity[]
 */
  getLoanInformationFromIB(loan : LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.FIND_LOAN_INFORMATION_FROM_IB, loan);
  }

/**
 * automatic Step
 *
 * @param loan LoanEntity
 * @returns LoanEntity
 */
  automaticStepLoan(loan: LoanEntity): Observable<LoanEntity> {
    return this.httpClient.post<LoanEntity>(AcmURLConstants.AUTOMATIC_STEP_LOAN, loan);
  }


}
