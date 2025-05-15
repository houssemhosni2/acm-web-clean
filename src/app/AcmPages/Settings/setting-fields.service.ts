import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { AcmIhmFieldEntity } from 'src/app/shared/Entities/acmIhmField.entity';
import { AcmIhmFieldGroupe } from 'src/app/shared/Entities/acmihmFieldGroupe.entity';
import { AcmIhmFormEntity } from 'src/app/shared/Entities/acmIhmForm.entity';
import { AcmIhmValidatorEntity } from 'src/app/shared/Entities/acmIhmValidator.entity';
import { HabilitationIhmRouteEntity } from 'src/app/shared/Entities/habilitationIhmRoute.entity';

@Injectable({
    providedIn: 'root'
})
export class SettingFieldService {
    /**
     * constructor
     * @param httpClient HttpClient
     */
    constructor(public httpClient: HttpClient) {
    }
    /**
     * get forms by route
     * @param acmIhmFormEntity AcmIhmFormEntity[]
     */
    getForm(acmIhmFormEntity: AcmIhmFormEntity): Observable<AcmIhmFormEntity[]> {
        return this.httpClient.post<AcmIhmFormEntity[]>(AcmURLConstants.FIND_IHM_FORMS_FOR_ROUTE, acmIhmFormEntity);
    }
    /**
     * get fields
     * @param acmIhmFieldEntity AcmIhmFieldEntity[]
     */
    getFields(acmIhmFieldEntity: AcmIhmFieldEntity): Observable<AcmIhmFieldEntity[]> {
        return this.httpClient.post<AcmIhmFieldEntity[]>(AcmURLConstants.FIND_IHM_FIELD, acmIhmFieldEntity);
    }
    /**
     *
     * get IHM Habilitation
     * @param habilitationIhmRouteEntity HabilitationIhmRouteEntity
     * @returns HabilitationIhmRouteEntity[]
     */
    getIHMHabilitation(habilitationIhmRouteEntity: HabilitationIhmRouteEntity): Observable<HabilitationIhmRouteEntity[]> {
        return this.httpClient.post<HabilitationIhmRouteEntity[]>(AcmURLConstants.FIND_IHM_ROUTE, habilitationIhmRouteEntity);
    }
    /**
     *
     * update field
     * @param acmIhmFieldEntity AcmIhmFieldEntity
     * @returns AcmIhmFieldEntity
     */
    updateField(acmIhmFieldEntity: AcmIhmFieldEntity): Observable<AcmIhmFieldEntity> {
        return this.httpClient.put<AcmIhmFieldEntity>(AcmURLConstants.UPDATE_FIELD, acmIhmFieldEntity);

    }
    /**
     *
     * get ihm validators
     * @param acmIhmValidatorEntity AcmIhmValidatorEntity
     * @returns AcmIhmValidatorEntity[]
     */
    getIhmValidators(acmIhmValidatorEntity: AcmIhmValidatorEntity): Observable<AcmIhmValidatorEntity[]> {
        return this.httpClient.post<AcmIhmValidatorEntity[]>(AcmURLConstants.FIND_IHM_VALIDATOR, acmIhmValidatorEntity);

    }

    /**
     * add Ihm Form
     * @param acmIhmFormEntity AcmIhmFormEntity
     */
    addIhmForm(acmIhmFormEntity: AcmIhmFormEntity): Observable<AcmIhmFormEntity> {
        return this.httpClient.post<AcmIhmFormEntity>(AcmURLConstants.ADD_IHM_FORMS, acmIhmFormEntity);
    }

    /**
     * edit Ihm Form
     * @param acmIhmFormEntity AcmIhmFormEntity
     */
    editIhmForm(acmIhmFormEntity: AcmIhmFormEntity): Observable<AcmIhmFormEntity> {
        return this.httpClient.put<AcmIhmFormEntity>(AcmURLConstants.UPDATE_IHM_FORMS, acmIhmFormEntity);
    }

    /**
     * save All Fields
     * @param acmIhmFieldEntity array of AcmIhmFieldEntity
     */
    saveAllFields(acmIhmFieldEntity: AcmIhmFieldEntity[]): Observable<AcmIhmFieldEntity[]> {
        return this.httpClient.post<AcmIhmFieldEntity[]>(AcmURLConstants.SAVE_ALL_FIELD, acmIhmFieldEntity);
    }
    updateFieldHabilitation(acmIhmFieldGroupe: AcmIhmFieldGroupe): Observable<AcmIhmFieldEntity> {
        return this.httpClient.put<AcmIhmFieldEntity>(AcmURLConstants.UPDATE_FIELD_HABILITATION, acmIhmFieldGroupe);
    }

}
