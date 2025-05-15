import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UserDefinedFieldListValuesEntity } from 'src/app/shared/Entities/userDefinedFieldListValues.entity';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import { UDFLinksGroupeFieldsEntity } from 'src/app/shared/Entities/udfLinksGroupeFields.entity';
import { LoansUdfEntity } from 'src/app/shared/Entities/loansUdf.entity';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { WorkflowStepUdfGroupeEntity } from 'src/app/shared/Entities/WorkflowStepUdfGroupe.entity';

@Injectable({
  providedIn: 'root'
})
export class UdfService {

  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * get udf group
   * @param userDefinedFieldGroup UserDefinedFieldGroupEntity
   */
  getUdfGroup(userDefinedFieldGroup: UserDefinedFieldGroupEntity): Observable<UserDefinedFieldGroupEntity[]> {
    return this.httpClient.post<UserDefinedFieldGroupEntity[]>(AcmURLConstants.FIND_UDF_GROUP, userDefinedFieldGroup);
  }

  /**
   * save udf group
   * @param userDefinedFieldGroup UserDefinedFieldGroupEntity
   */
  saveUdfGroup(userDefinedFieldGroup: UserDefinedFieldGroupEntity): Observable<UserDefinedFieldGroupEntity> {
    return this.httpClient.post<UserDefinedFieldGroupEntity>(AcmURLConstants.SAVE_UDF_GROUP, userDefinedFieldGroup);
  }

  /**
   * get udf feild
   * @param userDefinedFieldGroup UserDefinedFieldsEntity
   */
  getUdfField(userDefinedFieldsEntity: UserDefinedFieldsEntity): Observable<UserDefinedFieldsEntity[]> {
    return this.httpClient.post<UserDefinedFieldsEntity[]>(AcmURLConstants.FIND_UDF_FIELD, userDefinedFieldsEntity);
  }

  /**
   * save udf feild
   * @param userDefinedFieldsEntity UserDefinedFieldsEntity
   */
  saveUdfField(userDefinedFieldsEntity: UserDefinedFieldsEntity): Observable<UserDefinedFieldsEntity> {
    return this.httpClient.post<UserDefinedFieldsEntity>(AcmURLConstants.SAVE_UDF_FIELD, userDefinedFieldsEntity);
  }

  /**
   * get udf group
   * @param userDefinedFieldGroup UserDefinedFieldGroupEntity
   */
  getUdfListValue(userDefinedFieldListValues: UserDefinedFieldListValuesEntity): Observable<UserDefinedFieldListValuesEntity[]> {
    return this.httpClient.post<UserDefinedFieldListValuesEntity[]>(AcmURLConstants.FIND_UDF_LISTE_VALUE, userDefinedFieldListValues);
  }

  /**
   * save udf list value
   * @param userDefinedFieldGroup UserDefinedFieldGroupEntity[]
   */
  savUdfListValue(userDefinedFieldListValues: UserDefinedFieldListValuesEntity[]): Observable<UserDefinedFieldListValuesEntity[]> {
    return this.httpClient.post<UserDefinedFieldListValuesEntity[]>(AcmURLConstants.SAVE_UDF_LISTE_VALUE, userDefinedFieldListValues);
  }

  /**
   * Update Udf Link
   */
  updateUdfLink(userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity):
    Observable<UserDefinedFieldsLinksEntity> {
    return this.httpClient.put<UserDefinedFieldsLinksEntity>(AcmURLConstants.UPDATE_UDF_LINK, userDefinedFieldsLinksEntity);
  }

  /**
   * Create Udf Link
   */
  createUdfLink(userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity):
    Observable<UserDefinedFieldsLinksEntity> {
    return this.httpClient.post<UserDefinedFieldsLinksEntity>(AcmURLConstants.CREATE_UDF_LINK, userDefinedFieldsLinksEntity);

  }

  /**
   * Create Udf All Link
   */
  createAllUdfLink(userDefinedFieldsLinksEntitys: UserDefinedFieldsLinksEntity[]):
    Observable<UserDefinedFieldsLinksEntity[]> {
    return this.httpClient.post<UserDefinedFieldsLinksEntity[]>(AcmURLConstants.CREATE_ALL_UDF_LINK, userDefinedFieldsLinksEntitys);
  }

  /**
   * get udf link
   * @param userDefinedFieldsLinksEntity UserDefinedFieldsLinksEntity
   */
  getUdfLink(userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity): Observable<UserDefinedFieldsLinksEntity[]> {
    return this.httpClient.post<UserDefinedFieldsLinksEntity[]>(AcmURLConstants.GET_ALL_UDF_LINK, userDefinedFieldsLinksEntity);
  }

  /**
   * get udf link BY groupe
   * @param userDefinedFieldsLinksEntity UserDefinedFieldsLinksEntity
   */
  getUdfLinkGroupby(userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity): Observable<UDFLinksGroupeFieldsEntity[]> {
    return this.httpClient.post<UDFLinksGroupeFieldsEntity[]>(AcmURLConstants.GET_ALL_UDF_LINK_GROUP, userDefinedFieldsLinksEntity);
  }
  getUdfLinkGroupbyFromIb(userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity): Observable<UDFLinksGroupeFieldsEntity[]> {
    return this.httpClient.post<UDFLinksGroupeFieldsEntity[]>(AcmURLConstants.GET_ALL_UDF_LINK_GROUP_FROM_IB, userDefinedFieldsLinksEntity);
  }
 /**
  * get udf loans by customer
  * @param userDefinedFieldsLinksEntity UserDefinedFieldsLinksEntity
  */
  getLoansUdfByCustomer(userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity): Observable<LoansUdfEntity[]> {
    return this.httpClient.post<LoansUdfEntity[]>(AcmURLConstants.GET_UDF_LOANS_BY_CUSTOMER, userDefinedFieldsLinksEntity);
  }
  /**
   * getUdfGroupByWorkflowStep
   * @param stepEntity StepEntity
   * @returns UserDefinedFieldGroupEntity[]
   */
  getUdfGroupByWorkflowStep( stepEntity :StepEntity ): Observable<UserDefinedFieldGroupEntity[]>{
    return this.httpClient.post<UserDefinedFieldGroupEntity[]>(AcmURLConstants.GET_UDF_GROUPES_BY_WORKFLOW_STEP, stepEntity);
  }
  /**
   * updateUdfLinksByElementId
   * @param udfLinks UserDefinedFieldsLinksEntity[]
   * @returns UserDefinedFieldsLinksEntity[]
   */
  updateUdfLinksByElementId(udfLinks: UserDefinedFieldsLinksEntity[], elementId: number): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.UPDATE_UDF_LINKS_BY_ELEMENT_ID + elementId, udfLinks);
  }
  /**
   * findUdfGroupsByStepId
   * @param workflowStepUdfGroupeEntity WorkflowStepUdfGroupeEntity
   * @returns UserDefinedFieldGroupEntity[]
   */
  findUdfGroupsByStepId(workflowStepUdfGroupeEntity: WorkflowStepUdfGroupeEntity): Observable<UserDefinedFieldGroupEntity[]> {
    return this.httpClient.post<UserDefinedFieldGroupEntity[]>(AcmURLConstants.FIND_UDF_GROUPS_BY_STEP_ID, workflowStepUdfGroupeEntity);
  }
  /**
   * findUdfFieldsByStepId
   * @param workflowStepUdfGroupeEntity WorkflowStepUdfGroupeEntity
   * @param idUdfGroup number
   * @returns UserDefinedFieldsEntity[]
   */
  findUdfFieldsByStepId(workflowStepUdfGroupeEntity: WorkflowStepUdfGroupeEntity, idUdfGroup: number): Observable<UserDefinedFieldsEntity[]> {
    return this.httpClient.post<any>(AcmURLConstants.FIND_UDF_FIELDS_BY_STEP_ID + idUdfGroup, workflowStepUdfGroupeEntity);
  }
  /**
   * findMaxIndexGroup
   * @param elementId number
   * @param category string
   * @returns number
   */
  findMaxIndexGroup(elementId: number, category : string): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.FIND_MAX_INDEX_GROUP + elementId+'/'+category);
  }

  disableUdfFields(listUDFFieldToDisable: UserDefinedFieldsEntity[]) : Observable<UserDefinedFieldsEntity[]> {
    return this.httpClient.post<UserDefinedFieldsEntity[]>(AcmURLConstants.DISABLE_UDF_FIELD, listUDFFieldToDisable);
  }

  disableUdfListValues(listValuesToDisable: UserDefinedFieldListValuesEntity[]) : Observable<UserDefinedFieldListValuesEntity[]>{
    return this.httpClient.post<UserDefinedFieldListValuesEntity[]>(AcmURLConstants.DISABLE_UDF_LIST_VALUES, listValuesToDisable);
  }
}
