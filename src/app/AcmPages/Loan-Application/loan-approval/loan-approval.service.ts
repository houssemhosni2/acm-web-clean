import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoanEntity} from 'src/app/shared/Entities/loan.entity';
import {Observable} from 'rxjs';
import {AcmURLConstants} from 'src/app/shared/acm-url-constants';
import {ProductEntity} from '../../../shared/Entities/product.entity';
import {LoanCalculateEntity} from '../../../shared/Entities/LoanCalculate.entity';
import { LoanScheduleEntity } from 'src/app/shared/Entities/loanSchedule.entity';
import { AcmLoanInstanceAcmGroupeApprovalEntity } from 'src/app/shared/Entities/acmLoanInstanceAcmGroupeApproval.entity';
import { ThirdPartyHistoriqueEntity } from 'src/app/shared/Entities/thirdPartyHistorique.entity';

@Injectable({
  providedIn: 'root'
})
export class LoanApprovalService {

  constructor(public httpClient: HttpClient) {
  }

  /**
   * Get required document
   * @param LoanDocumentEntity loanDocumentsDTO
   */
  calculateLoanSchedules(loanDTO: LoanEntity): Observable<LoanCalculateEntity> {
    return this.httpClient.post<LoanCalculateEntity>(AcmURLConstants.CALCULATE_LOAN_SCHEDULES, loanDTO);
  }

  /**
   * Get Product details by Id
   * @param productId productId
   */
  getProduct(productId: number): Observable<ProductEntity> {
    return this.httpClient.get<ProductEntity>(AcmURLConstants.PRODUCT_DETAILS + productId);
  }

  /**
   * update
   * @param loanDTO the LoanEntity
   */
  updateAcmLoan(loanDTO: LoanEntity) {
    return this.httpClient.put<LoanEntity>(AcmURLConstants.UPDATE_ACM_LOAN, loanDTO);
  }
  /**
   *
   * @param loanScheduleEntity loanScheduleEntity
   */
  reportingSchedule(loanScheduleEntity: LoanScheduleEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.REPORTING_SCHEDULE, loanScheduleEntity , { responseType: 'blob' as 'json' });
  }
  /**
   * update loan status for Reverser case
   * @param loanDTO the LoanEntity
   */
    updateLoanStatus(loanDTO: LoanEntity) {
      return this.httpClient.put<LoanEntity>(AcmURLConstants.UPDATE_LOAN_STATUS, loanDTO);
    }

  /**
   * Get list validators of Loan Instance
   */
      getListValidatorsLoanInstance(loanInstanceGrpValidators: AcmLoanInstanceAcmGroupeApprovalEntity):
      Observable<AcmLoanInstanceAcmGroupeApprovalEntity[]> {
       return this.httpClient.post<AcmLoanInstanceAcmGroupeApprovalEntity[]>(AcmURLConstants.LIST_VALIDATORS_GROUP_LOAN_INSTANCE,
          loanInstanceGrpValidators);
     }

  /**
   * Get from ThirdParty historique
   */
     getFromHisThirdPartyByLoan(idLoan: number): Observable<ThirdPartyHistoriqueEntity[]> {
      return this.httpClient.get<ThirdPartyHistoriqueEntity[]>(AcmURLConstants.THIRD_PARTY_HISTORY_BY_LOAN + idLoan);

    }


}
