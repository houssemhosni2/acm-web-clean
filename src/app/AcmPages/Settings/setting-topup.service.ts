import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { SettingTopupEntity } from 'src/app/shared/Entities/SettingTopup.entity';

@Injectable({
    providedIn: 'root'
})
export class SettingTopupService {
   /**
    * constructor
    * @param httpClient HttpClient
    */
    constructor(private httpClient: HttpClient) {
    }
    /**
     * get setting topup
     * @param settingTopupEntity SettingTopupEntity
     * @returns SettingTopupEntity[]
     */
    getSettingTopup(settingTopupEntity: SettingTopupEntity): Observable<SettingTopupEntity[]> {
        return this.httpClient.post<SettingTopupEntity[]>(AcmURLConstants.GET_SETTING_TOPUP, settingTopupEntity);
    }
    /**
     * create new setting topup
     * @param settingTopupEntity SettingTopupEntity
     * @returns SettingTopupEntity
     */
    createSettingTopup(settingTopupEntity: SettingTopupEntity): Observable<SettingTopupEntity> {
        return this.httpClient.post<SettingTopupEntity>(AcmURLConstants.CREATE_SETTING_TOPUP, settingTopupEntity);
    }
    /**
     * update setting topup
     * @param settingTopupEntity SettingTopupEntity
     * @returns SettingTopupEntity
     */
    updateSettingTopup(settingTopupEntity: SettingTopupEntity): Observable<SettingTopupEntity> {
        return this.httpClient.put<SettingTopupEntity>(AcmURLConstants.UPDATE_SETTING_TOPUP, settingTopupEntity);
    }
}
