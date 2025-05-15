import { Injectable } from '@angular/core';
import { ProductEntity } from '../../shared/Entities/product.entity';
import { Observable } from 'rxjs';
import { AcmURLConstants } from '../../shared/acm-url-constants';
import { HttpClient } from '@angular/common/http';
import { BrancheEntity } from '../../shared/Entities/branche.entity';
import { UserEntity } from '../../shared/Entities/user.entity';
import { ReportingEntity } from 'src/app/shared/Entities/reporting.entity';
import { AcmStatutsEntity } from 'src/app/shared/Entities/acmstatus.entity';
import { LoanSourceOfFundsEntity } from 'src/app/shared/Entities/loanSourceOfFunds.entity';
import { ThirdPartyHistoriqueEntity } from 'src/app/shared/Entities/thirdPartyHistorique.entity';
import { ReportSearchHistoryEntity } from '../../shared/Entities/reportSearchHistory.entity';
import { AcmMezaCardEntity } from 'src/app/shared/Entities/acmMezaCard.entity';
import { AcmCoreReportingSetting } from 'src/app/shared/Entities/AcmCoreReportingSetting.entity';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * Get all Product
   */
  getProducts(productEntity: ProductEntity): Observable<ProductEntity[]> {
    return this.httpClient.post<ProductEntity[]>(AcmURLConstants.PRODUCT_DETAILS, productEntity);
  }

  /**
   * Find branches
   */
  findBranche():
    Observable<BrancheEntity[]> {
    return this.httpClient.get<BrancheEntity[]>(AcmURLConstants.BRANCHE_FIND);
  }

  /**
   * Find all portfolio
   */
  findAllPortfolio(userEntity: UserEntity): Observable<UserEntity[]> {
    return this.httpClient.post<UserEntity[]>(AcmURLConstants.FIND_PORTFOLIO, userEntity);
  }

  /**
   * load Filter list Status Workflow
   */
  loadFilterStatusWorkflow(): Observable<any[]> {
    return this.httpClient.get<AcmStatutsEntity[]>(AcmURLConstants.LOAD_STATUS_WORKFLOW);
  }

  /**
   * generate excel file : REPORTING_LOAN_APPLICATION
   * @param reportingEntity reportingEntity
   */
  reportingLoanApplication(reportingEntity: ReportingEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.REPORTING_LOAN_APPLICATION, reportingEntity,
      { responseType: 'blob' as 'json' });
  }

  /**
   * generate excel file : REPORTING_COLLECTION_FOLLOW_UP
   * @param reportingEntity reportingEntity
   */
  reportingExcelCollectionFollowupReport(reportingEntity: ReportingEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.REPORTING_COLLECTION_FOLLOW_UP, reportingEntity,
      { responseType: 'blob' as 'json' });
  }

  /**
   * Get all loan source of funds
   */
  getLoanSourceOfFunds(): Observable<LoanSourceOfFundsEntity[]> {
    return this.httpClient.get<LoanSourceOfFundsEntity[]>(AcmURLConstants.LOAD_SOURCE_OF_FUNDS);
  }

  /**
   * load Filter list Status ABACUS
   */
  loadFilterStatusABACUS(): Observable<any[]> {
    return this.httpClient.get<AcmStatutsEntity[]>(AcmURLConstants.LOAD_STATUS_ABACUS);
  }
  /**
   * generate excel aml report
   */
  reportingAml(thirdPartyHistorique: ThirdPartyHistoriqueEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.REPORTING_AML, thirdPartyHistorique, { responseType: 'blob' as 'json' });
  }

  /**
   * create new filtre
   */
  createFilter(reportSearchHistoryEntity: ReportSearchHistoryEntity): Observable<ReportSearchHistoryEntity> {
    return this.httpClient.post<ReportSearchHistoryEntity>(AcmURLConstants.CREATE_FILTRE, reportSearchHistoryEntity);
  }

  /**
   * create new filter
   */
  findListFilter(reportSearchHistoryEntity: ReportSearchHistoryEntity): Observable<ReportSearchHistoryEntity[]> {
    return this.httpClient.post<ReportSearchHistoryEntity[]>(AcmURLConstants.FIND_FILTRE, reportSearchHistoryEntity);
  }

  /**
   * generate excel file : REPORTING_MEZA_CARD
   * @param acmMezaCardEntity AcmMezaCardEntity
   */
  reportingExcelMezaCard(acmMezaCardEntity: AcmMezaCardEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.REPORTING_MEZA_CARD, acmMezaCardEntity,
      { responseType: 'blob' as 'json' });
  }

  saveReportingSetting(acmCoreReportingSetting: AcmCoreReportingSetting): Observable<AcmCoreReportingSetting> {
    return this.httpClient.post<AcmCoreReportingSetting>(AcmURLConstants.SAVE_REPORTING_SETTING, acmCoreReportingSetting);
  }

  findReportingSetting(acmCoreReportingSetting: AcmCoreReportingSetting): Observable<AcmCoreReportingSetting[]> {
    return this.httpClient.post<AcmCoreReportingSetting[]>(AcmURLConstants.FIND_REPORTING_SETTING, acmCoreReportingSetting);
  }

  generateExcelReport(acmCoreReportingSetting: AcmCoreReportingSetting): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.GENERATE_EXCEL_REPORT, acmCoreReportingSetting,
      { responseType: 'blob' as 'json' });
  }

  generatePdfReport(acmCoreReportingSetting: AcmCoreReportingSetting): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.GENERATE_PDF_REPORT, acmCoreReportingSetting,
      { responseType: 'blob' as 'json' });
  }

  findReportData(acmCoreReportingSetting: AcmCoreReportingSetting): Observable<any> {
    return this.httpClient.post<any[]>(AcmURLConstants.FIND_REPORT_DATA, acmCoreReportingSetting);
  }

}
