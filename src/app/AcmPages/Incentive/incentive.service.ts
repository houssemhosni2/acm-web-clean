import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { IncentiveSettingEntity } from 'src/app/shared/Entities/incentiveSetting.entity';
import { IncentiveSettingConstantEntity } from 'src/app/shared/Entities/incentiveSettingConstant.entity';
import { IncentiveSettingRunEntity } from 'src/app/shared/Entities/incentiveSettingRun.entity';
import { ProductCategoryEntity } from 'src/app/shared/Entities/productCategory.entity';

@Injectable({
  providedIn: 'root'
})
export class IncentiveService {

  constructor(public httpClient: HttpClient) { }

  /**
   * get list of incentive constants by categories
   * @param categories list of categories
   * @returns list of constants
   */
  findIncentiveSettingsConstantsByCategories(categories: string[]): Observable<IncentiveSettingConstantEntity[]> {
        return this.httpClient.post<IncentiveSettingConstantEntity[]>(AcmURLConstants.
          FIND_INCENTIVE_SETTING_CONSTANTS_BY_CATEGORIES, categories);
    }
  /**
   * get list of incentive settings : Active Customer / Productivity / Risk
   * @param incentiveSettingEntity IncentiveSettingEntity
   * @returns list of incentiveSettingEntitys
   */
  getIncentiveSettings(incentiveSettingEntity: IncentiveSettingEntity): Observable<IncentiveSettingEntity[]> {
      return this.httpClient.post<IncentiveSettingEntity[]>(AcmURLConstants.FIND_INCENTIVE_SETTING, incentiveSettingEntity);
  }
  /**
   * create new incentiveSettingEntity : Active Customer / Productivity / Risk
   */
  createIncentiveSetting(incentiveSettingEntity: IncentiveSettingEntity):
  Observable<IncentiveSettingEntity> {
  return this.httpClient.post<IncentiveSettingEntity>(AcmURLConstants.CREATE_INCENTIVE_SETTING, incentiveSettingEntity);
  }
  /**
   * update IncentiveSettingEntity
   * @param incentiveSettingEntity IncentiveSettingEntity
   */
  updateIncentiveSetting(incentiveSettingEntity: IncentiveSettingEntity): Observable<IncentiveSettingEntity> {
    return this.httpClient.put<IncentiveSettingEntity>(AcmURLConstants.UPDATE_INCENTIVE_SETTING, incentiveSettingEntity);
  }
  /**
   * delete IncentiveSettingEntity
   * @param idIncentiveSetting number
   */
  deleteIncentiveSetting(idIncentiveSetting: number): Observable<IncentiveSettingEntity> {
    return this.httpClient.delete<IncentiveSettingEntity>(AcmURLConstants.DELETE_INCENTIVE_SETTING + idIncentiveSetting);
  }
  /**
   * getProductCategories
   * @param productCategoryEntity ProductCategoryEntity
   * @returns list of product categories
   */
  getProductCategories(productCategoryEntity: ProductCategoryEntity): Observable<ProductCategoryEntity[]> {
    return this.httpClient.post<ProductCategoryEntity[]>(AcmURLConstants.PRODUCT_CATEGORY, productCategoryEntity);
  }
  /**
   * update status incentive setting Enable Disable
   * @param incentiveRegistrationEntity IncentiveSettingRunEntity
   */
  updateStatusIncentiveSettings(incentiveSettingRunEntity: IncentiveSettingRunEntity): Observable<IncentiveSettingRunEntity[]> {
    return this.httpClient.post<IncentiveSettingRunEntity[]>(AcmURLConstants.
      UPDTATE_STATUS_INCENTIVE_SETTING, incentiveSettingRunEntity);
  }
  /**
   * get IncentiveSettingRunEntity by code
   * @param incentiveSettingRunEntity IncentiveSettingRunEntity
   * @returns IncentiveSettingRunEntity
   */
  getStatusIncentiveSettingsByCode(incentiveSettingRunEntity: IncentiveSettingRunEntity): Observable<IncentiveSettingRunEntity> {
    return this.httpClient.post<IncentiveSettingRunEntity>(AcmURLConstants.FIND_STATUS_INCENTIVE_SETTING, incentiveSettingRunEntity);
  }
  /**
   * update product category
   * @param productCategoryEntity ProductCategoryEntity
   */
   updateProductCategory(productCategoryEntity: ProductCategoryEntity): Observable<ProductCategoryEntity> {
    return this.httpClient.put<ProductCategoryEntity>(AcmURLConstants.UPDATE_PRODUCT_CATEGORY, productCategoryEntity);
  }
}
