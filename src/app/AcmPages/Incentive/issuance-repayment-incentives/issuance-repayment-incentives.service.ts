import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { IncentiveBranchProdLevelEntity } from 'src/app/shared/Entities/incentiveBranchProdLevel.entity';
import { IncentiveRepaymentEntity } from 'src/app/shared/Entities/incentiveRepayment.entity';
import { IncentiveRepaymentPaginationEntity } from 'src/app/shared/Entities/incentiveRepaymentPagination.entity';
import { IncentiveSettingRunEntity } from 'src/app/shared/Entities/incentiveSettingRun.entity';

@Injectable({
  providedIn: 'root'
})
export class IssuanceRepaymentIncentivesService {

  constructor(public httpClient: HttpClient) { }

  /**
   * get list of IncentiveBranchProdLevelEntity
   * @param incetiveRegistrationEntity IncentiveBranchProdLevelEntity
   */
  getBranchProdLevels(incetiveRegistrationEntity: IncentiveBranchProdLevelEntity): Observable<IncentiveBranchProdLevelEntity[]> {
    return this.httpClient.post<IncentiveBranchProdLevelEntity[]>(AcmURLConstants.FIND_BRANCH_PRODUCTIVITY, incetiveRegistrationEntity);
  }
  /**
   * add new IncentiveBranchProdLevelEntity
   * @param incentiveBranchProdLevelEntity IncentiveBranchProdLevelEntity
   * @returns new IncentiveBranchProdLevelEntity
   */
  createBranchProdLevel(incentiveBranchProdLevelEntity: IncentiveBranchProdLevelEntity):
  Observable<IncentiveBranchProdLevelEntity> {
  return this.httpClient.post<IncentiveBranchProdLevelEntity>(AcmURLConstants.CREATE_BRANCH_PRODUCTIVITY, incentiveBranchProdLevelEntity);
  }
  /**
   * update IncentiveBranchProdLevelEntity
   * @param incentiveRegistrationEntity IncentiveBranchProdLevelEntity
   * @returns IncentiveBranchProdLevelEntity
   */
  updateBranchProdLevel(incentiveBranchProdLevelEntity: IncentiveBranchProdLevelEntity): Observable<IncentiveBranchProdLevelEntity> {
    return this.httpClient.put<IncentiveBranchProdLevelEntity>(AcmURLConstants.UPDATE_BRANCH_PRODUCTIVITY, incentiveBranchProdLevelEntity);
  }
  /**
   * delete IncentiveBranchProdLevelEntity by id
   * @param id id
   */
  deleteBranchProdLevel(id: number): Observable<IncentiveBranchProdLevelEntity> {
    return this.httpClient.delete<IncentiveBranchProdLevelEntity>(AcmURLConstants.DELETE_BRANCH_PRODUCTIVITY + id);
  }
  /**
   * find pagination incentive repayment entity
   * @param incentiveRepaymentPaginationEntity IncentiveRepaymentPaginationEntity
   */
  findPaginationRepayment(incentiveRepaymentPaginationEntity: IncentiveRepaymentPaginationEntity):
   Observable<IncentiveRepaymentPaginationEntity> {
    return this.httpClient.post<IncentiveRepaymentPaginationEntity>(AcmURLConstants.FIND_PAGINATION_INCENTIVE_REPAYMENT,
      incentiveRepaymentPaginationEntity);
  }
  /**
   * Create new IncentiveRepaymentEntity
   * @param incentiveRepaymentEntity IncentiveRepaymentEntity
   */
  createIncentiveRepayment(incentiveRepaymentEntity: IncentiveRepaymentEntity):
  Observable<IncentiveRepaymentEntity> {
  return this.httpClient.post<IncentiveRepaymentEntity>(AcmURLConstants.CREATE_INCENTIVE_REPAYMENT, incentiveRepaymentEntity);
  }
  /**
   * update IncentiveRepaymentEntity
   * @param incentiveRepaymentEntity IncentiveRepaymentEntity
   */
  updateIncentiveRepayment(incentiveRepaymentEntity: IncentiveRepaymentEntity): Observable<IncentiveRepaymentEntity> {
    return this.httpClient.put<IncentiveRepaymentEntity>(AcmURLConstants.UPDATE_INCENTIVE_REPAYMENT, incentiveRepaymentEntity);
  }
  /**
   * delete Incentive Repayment
   * @param id idIncentiveRepayment
   */
  deleteIncentiveRepayment(id: number): Observable<IncentiveRepaymentEntity> {
    return this.httpClient.delete<IncentiveRepaymentEntity>(AcmURLConstants.DELETE_INCENTIVE_REPAYMENT + id);
  }
  /**
   * update status of apply discount rule or apply branch rule for incentive run setting
   * @param incentiveSettingRunEntity IncentiveSettingRunEntity
   */
  updateApplyDiscountOrBranch(incentiveSettingRunEntity: IncentiveSettingRunEntity): Observable<IncentiveSettingRunEntity[]> {
    return this.httpClient.post<IncentiveSettingRunEntity[]>(AcmURLConstants.
      UPDATE_APPLY_DISCOUNT_BRANCH, incentiveSettingRunEntity);
  }
}
