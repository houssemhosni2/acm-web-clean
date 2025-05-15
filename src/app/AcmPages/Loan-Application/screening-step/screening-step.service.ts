import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AcmURLConstants} from 'src/app/shared/acm-url-constants';
import {ScreeningEntity} from 'src/app/shared/Entities/screening.entity';
import {ThirdPartyHistoriqueEntity} from 'src/app/shared/Entities/thirdPartyHistorique.entity';
import {CustomerLinksRelationshipEntity} from '../../../shared/Entities/CustomerLinksRelationship.entity';
import { AcmKycCheckEntity } from 'src/app/shared/Entities/AcmKycCheck.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { AcmAmlCheckEntity } from 'src/app/shared/Entities/AcmAmlCheck';
import { AcmDoubtfulLoanAnalyticsEntity } from 'src/app/shared/Entities/AcmDoubtfulLoanAnalytics.entity';
import { AcmScoreCheckEntity } from 'src/app/shared/Entities/AcmScoreCheck.entity';


@Injectable({
  providedIn: 'root'
})
export class ScreeningStepService {

  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * thirdParty CheckAml
   * @param screeningEntity ScreeningEntity
   */
  thirdPartyCheckAml(screeningEntity: ScreeningEntity): Observable<ScreeningEntity> {
    return this.httpClient.post<ScreeningEntity>(AcmURLConstants.THIRD_PARTY_CHECK_AML, screeningEntity);
  }

  /**
   * thirdParty CheckIscore
   * @param screeningEntity ScreeningEntity
   */
  thirdPartyCheckIscore(screeningEntity: ScreeningEntity): Observable<ScreeningEntity> {
    return this.httpClient.post<ScreeningEntity>(AcmURLConstants.THIRD_PARTY_CHECK_ISCORE, screeningEntity);
  }

  /**
   * thirdParty Historique
   * @param thirdPartHistorique ThirdPartyHistoriqueEntity
   */
  thirdPartyHistorique(thirdPartHistorique: ThirdPartyHistoriqueEntity): Observable<ThirdPartyHistoriqueEntity[]> {
    return this.httpClient.post<ThirdPartyHistoriqueEntity[]>(AcmURLConstants.THIRD_PARTY_HISTORY_LIST, thirdPartHistorique);
  }

  /**
   * thirdPartyHistorique by category
   * @param thirdPartHistorique ThirdPartyHistoriqueEntity
   */
  thirdPartyHistoriqueScreening(thirdPartHistorique: ThirdPartyHistoriqueEntity): Observable<ThirdPartyHistoriqueEntity[]> {
    return this.httpClient.post<ThirdPartyHistoriqueEntity[]>(AcmURLConstants.THIRD_PARTY_HISTORY_LIST_SCREENING, thirdPartHistorique);
  }

  /**
   * thirdParty DownloadRepport
   * @param thirdPartHistorique ThirdPartyHistoriqueEntity
   */
  thirdPartyDownloadRepport(thirdPartHistorique: ThirdPartyHistoriqueEntity): Observable<ThirdPartyHistoriqueEntity[]> {
    return this.httpClient.post<any>(AcmURLConstants.THIRD_PARTY_DOWNLOAD_REPPORT, thirdPartHistorique, {responseType: 'blob' as 'json'});
  }

  /**
   * third Party Validate
   * @param thirdPartHistorique ThirdPartyHistoriqueEntity
   */
  thirdPartyValidate(thirdPartHistorique: ThirdPartyHistoriqueEntity): Observable<ThirdPartyHistoriqueEntity> {
    return this.httpClient.post<ThirdPartyHistoriqueEntity>(AcmURLConstants.THIRD_PARTY_HISTORY_VALIDATE, thirdPartHistorique);
  }

  /**
   * delete Guarantor for loan
   * @param customerLinksRelationshipEntity CustomerLinksRelationshipEntity
   */
  deleteGuarantor(customerLinksRelationshipEntity: CustomerLinksRelationshipEntity): Observable<any> {
    return this.httpClient.post<ThirdPartyHistoriqueEntity>
    (AcmURLConstants.LINKS_RELATIONSHIP_DELETE_GUARANTOR, customerLinksRelationshipEntity);
  }

  saveCheckKyc(acmKycCheckEntity: AcmKycCheckEntity): Observable<AcmKycCheckEntity> {
    return this.httpClient.post<AcmKycCheckEntity>(AcmURLConstants.SAVE_KYC_CHECK, acmKycCheckEntity);
  }

  findKycCheck(acmKycCheckEntity: AcmKycCheckEntity): Observable<AcmKycCheckEntity> {
    return this.httpClient.post<AcmKycCheckEntity>(AcmURLConstants.FIND_KYC_CHECK, acmKycCheckEntity);
  }

  findScoreCheck(acmScoreCheckEntity: AcmScoreCheckEntity): Observable<AcmScoreCheckEntity> {
    return this.httpClient.post<AcmKycCheckEntity>(AcmURLConstants.FIND_SCORE_CHECK, acmScoreCheckEntity);
  }
  
  saveCheckScore(acmScoreCheckEntity: AcmScoreCheckEntity): Observable<AcmScoreCheckEntity> {
    return this.httpClient.post<AcmKycCheckEntity>(AcmURLConstants.SAVE_SCORE_CHECK, acmScoreCheckEntity);
  }

  checkAmlCustomer(customer: CustomerEntity): Observable<AcmAmlCheckEntity[]> {
    return this.httpClient.post<AcmAmlCheckEntity[]>(AcmURLConstants.CALL_CHECK_CUSTOMER_AML, customer);
  }

  saveCheckAmlCustomer(amlChecks: AcmAmlCheckEntity[]): Observable<AcmAmlCheckEntity[]> {
    return this.httpClient.post<AcmAmlCheckEntity[]>(AcmURLConstants.CALL_SAVE_CHECK_AML, amlChecks);
  }
  findCheckAml(amlCheck: AcmAmlCheckEntity): Observable<AcmAmlCheckEntity[]> {
    return this.httpClient.post<AcmAmlCheckEntity[]>(AcmURLConstants.CALL_FIND_CHECK_AML, amlCheck);
  }
  findDoubtfulLoanTransaction(AcmDoubtfulTransaction: AcmDoubtfulLoanAnalyticsEntity): Observable<AcmDoubtfulLoanAnalyticsEntity[]> {
    return this.httpClient.post<AcmDoubtfulLoanAnalyticsEntity[]>(AcmURLConstants.CALL_FIND_DOUBTFUL_TRANSACTION, AcmDoubtfulTransaction);
  }

  UpdateAmlCheck(amlCheck: AcmAmlCheckEntity): Observable<AcmAmlCheckEntity> {
    return this.httpClient.put<AcmAmlCheckEntity>(AcmURLConstants.UPDATE_AML_CHECK,amlCheck);
  }

}
