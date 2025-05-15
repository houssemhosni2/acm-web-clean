
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingProductGuarantee } from 'src/app/shared/Entities/SettingProductGuarantee';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';

@Injectable({
    providedIn: 'root'
})

export class SettingProductGuaranteeService {

    constructor(private httpClient: HttpClient) {
    }


    getSettingProductGuarantee(settingProductGuarantee: SettingProductGuarantee): Observable<SettingProductGuarantee[]> {
        return this.httpClient.post<SettingProductGuarantee[]>(AcmURLConstants.GET_SETTING_PRODUCT_GUARANTEE, settingProductGuarantee);
    }
    /**
     * create new setting topup
     * @param SettingProductGuarantee SettingProductGuarantee
     * @returns SettingProductGuarantee
     */
    createSettingProductGuarantee(settingProductGuarantee: SettingProductGuarantee): Observable<SettingProductGuarantee> {
        return this.httpClient.post<SettingProductGuarantee>(AcmURLConstants.CREATE_SETTING_PRODUCT_GUARANTE, settingProductGuarantee);
    }
    /**
     * update setting topup
     * @param SettingProductGuarantee SettingProductGuarantee
     * @returns SettingProductGuarantee
     */
    updateSettingProductGuarantee(settingProductGuarantee: SettingProductGuarantee): Observable<SettingProductGuarantee> {
        return this.httpClient.put<SettingProductGuarantee>(AcmURLConstants.UPDATE_SETTING_PRODUCT_GUARANTE, settingProductGuarantee);
    }
}