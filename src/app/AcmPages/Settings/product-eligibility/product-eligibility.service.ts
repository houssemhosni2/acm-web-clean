import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingProductEligibilityEntity } from 'src/app/shared/Entities/SettingProductEligibility.entity';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';

@Injectable({
    providedIn: 'root'
})
export class SettingProductEligibilityService {
   /**
    * constructor
    * @param httpClient HttpClient
    */
    constructor(private httpClient: HttpClient) {
    }
    /**
     * get setting topup
     * @param settingProductEligibilityEntity SettingProductEligibilityEntity
     * @returns SettingProductEligibilityEntity[]
     */
    getSettingProductEligibility(settingProductEligibilityEntity: SettingProductEligibilityEntity): Observable<SettingProductEligibilityEntity[]> {
        return this.httpClient.post<SettingProductEligibilityEntity[]>(AcmURLConstants.GET_SETTING_PRODUCT_ELIGIBILITY, settingProductEligibilityEntity);
    }
    /**
     * create new setting topup
     * @param settingProductEligibilityEntity SettingProductEligibilityEntity
     * @returns SettingProductEligibilityEntity
     */
    createSettingProductEligibility(settingProductEligibilityEntity: SettingProductEligibilityEntity): Observable<SettingProductEligibilityEntity> {
        return this.httpClient.post<SettingProductEligibilityEntity>(AcmURLConstants.CREATE_SETTING_PRODUCT_ELIGIBILITY, settingProductEligibilityEntity);
    }
    /**
     * update setting topup
     * @param settingProductEligibilityEntity SettingProductEligibilityEntity
     * @returns SettingProductEligibilityEntity
     */
    updateSettingProductEligibility(settingProductEligibilityEntity: SettingProductEligibilityEntity): Observable<SettingProductEligibilityEntity> {
        return this.httpClient.put<SettingProductEligibilityEntity>(AcmURLConstants.UPDATE_SETTING_PRODUCT_ELIGIBILITY, settingProductEligibilityEntity);
    }
}
