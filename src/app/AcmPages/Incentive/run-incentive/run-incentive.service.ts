import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { IncentiveSettingRunEntity } from 'src/app/shared/Entities/incentiveSettingRun.entity';
import {AcmStatutsEntity} from '../../../shared/Entities/acmstatus.entity';
import {IncentiveHistoryEntity} from '../../../shared/Entities/incentiveHistory.entity';

@Injectable({
  providedIn: 'root'
})
export class RunIncentiveService {

  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * find Incentive Settings Run
   */
  findIncentiveSettingsRun(incentiveSettingRunEntity: IncentiveSettingRunEntity): Observable<IncentiveSettingRunEntity[]> {
    return this.httpClient.post<IncentiveSettingRunEntity[]>(AcmURLConstants.FIND_ALL_INCENTIVE_RUN, incentiveSettingRunEntity);
  }

  /**
   * Run Calculate Incentive Repayment
   */
  runCalculateIncentiveRepayment(): Observable<any> {
    return this.httpClient.get<AcmStatutsEntity[]>(AcmURLConstants.INCENTIVE_RUN_REPAYMENT);
  }

  /**
   * generate excel incentive repayment report
   */
  reportingIncentiveRepayment(incentiveHistoryEntity: IncentiveHistoryEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.INCENTIVE_GENERATE_REPORT_REPAYMENT, incentiveHistoryEntity, { responseType: 'blob' as 'json' });
  }

  /**
   * Run Calculate Incentive Operation
   */
  runCalculateIncentiveOperation(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.INCENTIVE_RUN_OPERATION);
  }

  /**
   * generate excel incentive Operation report
   */
  reportingIncentiveOperation(incentiveHistoryEntity: IncentiveHistoryEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.INCENTIVE_GENERATE_REPORT_OPERATION, incentiveHistoryEntity, { responseType: 'blob' as 'json' });
  }

  /**
   * Run Calculate Incentive Registration
   */
  runCalculateIncentiveRegistration(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.INCENTIVE_RUN_REGISTRATION);
  }

  /**
   * generate excel incentive Registration report
   */
  reportingIncentiveRegistration(incentiveHistoryEntity: IncentiveHistoryEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.INCENTIVE_GENERATE_REPORT_REGISTRATION,
      incentiveHistoryEntity, { responseType: 'blob' as 'json' });
  }

  /**
   * incentive Loan Run Year Registration
   */
  incentiveLoanRunYearRegistration(): Observable<AcmStatutsEntity[]> {
    return this.httpClient.get<AcmStatutsEntity[]>(AcmURLConstants.INCENTIVE_LOAD_RUN_YEAR_REGISTRATION);
  }

  /**
   * incentive Loan Run Month Registration
   */
  incentiveLoanRunMonthRegistration(): Observable<AcmStatutsEntity[]> {
    return this.httpClient.get<AcmStatutsEntity[]>(AcmURLConstants.INCENTIVE_LOAD_RUN_MONTH_REGISTRATION);
  }

  /**
   * incentive Loan Run Year Operation
   */
  incentiveLoanRunYearOperation(): Observable<AcmStatutsEntity[]> {
    return this.httpClient.get<AcmStatutsEntity[]>(AcmURLConstants.INCENTIVE_LOAD_RUN_YEAR_OPERATION);
  }

  /**
   * incentive Loan Run Month Registration
   */
  incentiveLoanRunMonthOperation(): Observable<AcmStatutsEntity[]> {
    return this.httpClient.get<AcmStatutsEntity[]>(AcmURLConstants.INCENTIVE_LOAD_RUN_MONTH_OPERATION);
  }

  /**
   * incentive Loan Run Year rRepayment
   */
  incentiveLoanRunYearRepayment(): Observable<AcmStatutsEntity[]> {
    return this.httpClient.get<AcmStatutsEntity[]>(AcmURLConstants.INCENTIVE_LOAD_RUN_YEAR_REPAYMENT);
  }

  /**
   * incentive Loan Run Month rRepayment
   */
  incentiveLoanRunMonthRepayment(): Observable<AcmStatutsEntity[]> {
    return this.httpClient.get<AcmStatutsEntity[]>(AcmURLConstants.INCENTIVE_LOAD_RUN_MONTH_REPAYMENT);
  }
}
