import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AcmURLConstants} from '../../../shared/acm-url-constants';
import { AcmExpensesTypeEntity } from 'src/app/shared/Entities/acmExpensesType.entity';
import { ExpensesLimitsEntity } from 'src/app/shared/Entities/expensesLimits.entity';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';

@Injectable({
  providedIn: 'root'
})

export class ExpensesSettingsService {

  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {

  }

  /**
   * get all Expenses Type
   */
  getAllExpensesTypes(): Observable<AcmExpensesTypeEntity[]> {
    return this.httpClient.get<AcmExpensesTypeEntity[]>(AcmURLConstants.FIND_ALL_EXPENSES_TYPES);
  }

  /**
   * Add Expenses Type
   */
  addExpensesTypes(acmExpensesTypeEntity: AcmExpensesTypeEntity): Observable<AcmExpensesTypeEntity> {
    return this.httpClient.post<AcmExpensesTypeEntity>(AcmURLConstants.ADD_EXPENSES_TYPES, acmExpensesTypeEntity);
  }

  /**
   * Update Expenses Type
   */
  updateExpensesTypes(acmExpensesTypeEntity: AcmExpensesTypeEntity): Observable<AcmExpensesTypeEntity> {
    return this.httpClient.post<AcmExpensesTypeEntity>(AcmURLConstants.UPDATE_EXPENSES_TYPES, acmExpensesTypeEntity);
  }

  /**
   * Delete Expenses Type
   */
  deleteExpensesTypes(idExpensesType: number): Observable<AcmExpensesTypeEntity> {
    return this.httpClient.delete<AcmExpensesTypeEntity>(AcmURLConstants.DELETE_EXPENSES_TYPES + idExpensesType);
  }

  /**
   * save Expenses Limits
   * @param expensesLimitsEntitys ExpensesLimitsEntity[]
   */
  saveExpensesLimits(expensesLimitsEntitys: ExpensesLimitsEntity[]): Observable<ExpensesLimitsEntity[]> {
    return this.httpClient.post<ExpensesLimitsEntity[]>(AcmURLConstants.SAVE_EXPENSES_LIMITS, expensesLimitsEntitys);
  }

  findExpensesLimits(expensesLimitsEntity: ExpensesLimitsEntity): Observable<ExpensesLimitsEntity[]> {
    return this.httpClient.post<ExpensesLimitsEntity[]>(AcmURLConstants.FIND_EXPENSES_LIMITS, expensesLimitsEntity);
  }

  /**
   * add Reason
   * @param settingMotifRejetsEntity the settingMotifRejetsEntity
   */
   addReason(settingMotifRejetsEntity: SettingMotifRejetsEntity): Observable<SettingMotifRejetsEntity> {
    return this.httpClient.post<SettingMotifRejetsEntity>(AcmURLConstants.ADD_REASON_EXPENSES, settingMotifRejetsEntity);
  }
  /**
   * update reason
   * @param settingMotifRejetsEntity SettingMotifRejetsEntity
   */
  updateReason(settingMotifRejetsEntity: SettingMotifRejetsEntity): Observable<SettingMotifRejetsEntity> {
    return this.httpClient.put<SettingMotifRejetsEntity>(AcmURLConstants.UPDATE_REASON, settingMotifRejetsEntity);
  }
  /**
   * delete reason
   * @param idMotifRejet number
   */
  deleteReason(idMotifRejet: number): Observable<SettingMotifRejetsEntity> {
    return this.httpClient.delete<SettingMotifRejetsEntity>(AcmURLConstants.DELETE_REASON + idMotifRejet);
  }
  /**
   * get Account Gl by branch Id
   * @param branchId number
   */
  getAccountGl(branchId: number): Observable<string[]> {
    return this.httpClient.get<string[]>(AcmURLConstants.EXPENSES_ACCOUNT_GL + branchId);
  }
  /**
   * refrsh expenses limit
   * @param key string
   */
  refreshExpensesLimits(key: string): Observable<Date> {
    return this.httpClient.post<Date>(AcmURLConstants.REFRESH_EXPENSES_LIMITS, key);
  }
  /**
   * Find Expenses Type by Given param
   */
  findExpensesTypes(expensesTypeEntity: AcmExpensesTypeEntity): Observable<AcmExpensesTypeEntity[]> {
    return this.httpClient.post<AcmExpensesTypeEntity[]>(AcmURLConstants.FIND_ALL_EXPENSES_TYPES, expensesTypeEntity);
  }
}
