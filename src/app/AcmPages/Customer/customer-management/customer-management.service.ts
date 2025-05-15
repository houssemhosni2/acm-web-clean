import { AcmLoanInstanceAcmGroupeApprovalEntity } from '../../../shared/Entities/acmLoanInstanceAcmGroupeApproval.entity';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcmURLConstants } from '../../../shared/acm-url-constants';
import { CustomerEntity } from '../../../shared/Entities/customer.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { UserDefinedFieldsEntity } from '../../../shared/Entities/userDefinedFields.entity';
import { RoleEntity } from 'src/app/shared/Entities/Role.entity';
import { RelationshipEntity } from 'src/app/shared/Entities/relationship.entity';
import { IndustryEntity } from '../../../shared/Entities/industry.entity';
import { ScreeningEntity } from 'src/app/shared/Entities/screening.entity';
import { AcmEnvironnementEntity } from '../../../shared/Entities/acmEnvironnement.entity';
import { AcmMezaCardEntity } from 'src/app/shared/Entities/acmMezaCard.entity';
import { RenewalConditionLoanEntity } from 'src/app/shared/Entities/renewalConditionLoan.entity';
import { CustomerAccountEntity } from 'src/app/shared/Entities/customer.account.entity';

@Injectable({
  providedIn: 'root'
})
export class CustomerManagementService {

  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * saveForApplication
   */
  saveForApplication(customerEntity: CustomerEntity): Observable<CustomerEntity> {
    return this.httpClient.post<CustomerEntity>(AcmURLConstants.SAVE_CUSTOMER_FOR_APPLICATION, customerEntity);
  }

  /**
   * getCustomer Pagination
   */
  getCustomerInformation(id: number): Observable<CustomerEntity> {
    return this.httpClient.get<CustomerEntity>(AcmURLConstants.GET_CUSTOMER_DETAILS_ACM + id);
  }

  getCustomerInformationForClaims(id: number): Observable<CustomerEntity> {
    return this.httpClient.get<CustomerEntity>(AcmURLConstants.GET_CUSTOMER_DETAILS_ACM_FOR_CLAIMS + id);
  }


  /**
   * getCustomer Pagination
   */
  getCustomerAccountPortfolio(userEntity: UserEntity): Observable<UserEntity[]> {
    return this.httpClient.post<UserEntity[]>(AcmURLConstants.GET_ACCOUNT_PORTFOLIO, userEntity);

   }

  /**
   * updateForApplication
   */
  updateForApplication(customerEntity: CustomerEntity): Observable<CustomerEntity> {
    return this.httpClient.put<CustomerEntity>(AcmURLConstants.UPDATE_CUSTOMER_FOR_APPLICATION, customerEntity);
  }

  /**
   * findCustomerLinkRelationShip
   */
  findCustomerLinkRelationShip(customerLinksRelationshipEntity: CustomerLinksRelationshipEntity):
    Observable<CustomerLinksRelationshipEntity[]> {
    return this.httpClient.post<CustomerLinksRelationshipEntity[]>
      (AcmURLConstants.GET_CUSTOMER_LINKS_RELATIONSHIP, customerLinksRelationshipEntity);
  }

  /**
   * Find all portfolio
   */
  findAllPortfolio(userEntity: UserEntity): Observable<UserEntity[]> {
    return this.httpClient.post<UserEntity[]>(AcmURLConstants.FIND_PORTFOLIO, userEntity);
  }

  /**
   * get udf feild
   * @param userDefinedFieldsEntity UserDefinedFieldsEntity
   */
  getUdfField(userDefinedFieldsEntity: UserDefinedFieldsEntity): Observable<UserDefinedFieldsEntity[]> {
    return this.httpClient.post<UserDefinedFieldsEntity[]>(AcmURLConstants.FIND_UDF_FIELD, userDefinedFieldsEntity);
  }

  /**
   * Find Role
   */
  findRole(): Observable<RoleEntity[]> {
    return this.httpClient.get<RoleEntity[]>(AcmURLConstants.ROLES_FIND);
  }

  /**
   * Find Relationship
   */
  findRelationship(): Observable<RelationshipEntity[]> {
    return this.httpClient.get<RelationshipEntity[]>(AcmURLConstants.RELATIONSHIPS_FIND);
  }

  /**
   * Find Sectors
   */
  findSector(): Observable<IndustryEntity[]> {
    return this.httpClient.get<IndustryEntity[]>(AcmURLConstants.INDUSTRY_FIND);
  }

  /**
   * Third party validate
   * @param screeningEntity ScreeningEntity
   */
  thirdPartyKycValidate(screeningEntity: ScreeningEntity): Observable<ScreeningEntity> {
    return this.httpClient.post<ScreeningEntity>(AcmURLConstants.THIRD_PARTY_VALIDATE, screeningEntity);
  }

  /**
   * thirdPartyConfirm
   * @param screeningEntity ScreeningEntity
   */
  thirdPartyKycConfirm(screeningEntity: ScreeningEntity): Observable<ScreeningEntity> {
    return this.httpClient.post<ScreeningEntity>(AcmURLConstants.THIRD_PARTY_CONFIRM, screeningEntity);
  }

  /**
   * getEnvirementValueByKey
   * @param key String
   */
  getEnvirementValueByKey(key: string): Observable<AcmEnvironnementEntity> {
    return this.httpClient.get<AcmEnvironnementEntity>(AcmURLConstants.SETTING_ENVIRONMENT_FIND_BY_KEY + key);
  }

  /**
   *
   * @param phoneNumber phoneNumber
   */
  checkCustomerExistPhoneNumber(phoneNumber: string): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.CHECK_EXIST_CUSTOMER_BY_PHONE_NUMBER + phoneNumber);
  }
  /**
   * get Meza Card by branchId and status order by account
   * @param acmMezaCard AcmMezaCardEntity
   */
  getMezaCard(acmMezaCard: AcmMezaCardEntity): Observable<AcmMezaCardEntity> {
    return this.httpClient.post<AcmMezaCardEntity>(AcmURLConstants.FIND_FIRST_MEZA_CARD_ORDER_BY_ACCOUNT, acmMezaCard);
  }

  /**
   * get All Loan guarantors of customer in parameter
   * @param customerLinksRelationshipEntity CustomerLinksRelationshipEntity
   */
   getAllLoanGuarantors(customerLinksRelationshipEntity: CustomerLinksRelationshipEntity):
   Observable<CustomerLinksRelationshipEntity[]> {
   return this.httpClient.post<CustomerLinksRelationshipEntity[]>
     (AcmURLConstants.GET_ALL_LOAN_GUARANTORS, customerLinksRelationshipEntity);
 }

  /**
   * get guarantees of member in parameter
   * @param customerLinksRelationshipEntity CustomerLinksRelationshipEntity
   */
  getGuarantees(customerLinksRelationshipEntity: CustomerLinksRelationshipEntity):
    Observable<CustomerLinksRelationshipEntity[]> {
    return this.httpClient.post<CustomerLinksRelationshipEntity[]>
      (AcmURLConstants.GET_GUARANTEES, customerLinksRelationshipEntity);
  }
  /**
   * deleteGenerationMezaCard
   * @param login string
   */
  deleteGenerationMezaCard(login: string): Observable<any> {
    return this.httpClient.delete<CustomerLinksRelationshipEntity[]>
      (AcmURLConstants.DELETE_GENERATION_MEZA_CARD + login);
  }
  /**
   * getRenewalConditionSetting
   * @param idCustomer number
   * @returns RenewalConditionLoanEntity
   */
  getRenewalConditionSetting(customerAccountEntity: CustomerAccountEntity): Observable<RenewalConditionLoanEntity> {
    return this.httpClient.post<RenewalConditionLoanEntity>(AcmURLConstants.FIND_RENEWAL_CONDITION_SETTING_BY_CUSTOMER_ID
      , customerAccountEntity);
  }

  /**
   * saveForApplication
   */
   saveValidationLoanInstance(loanInstanceGrpValidators: AcmLoanInstanceAcmGroupeApprovalEntity):
   Observable<AcmLoanInstanceAcmGroupeApprovalEntity> {
    return this.httpClient.post<AcmLoanInstanceAcmGroupeApprovalEntity>(AcmURLConstants.VALIDATORS_GROUP_LOAN_INSTANCE,
       loanInstanceGrpValidators);
  }

  /**
   * saveProspect
   */
  saveProspect(customerEntity: CustomerEntity): Observable<CustomerEntity> {
    return this.httpClient.post<CustomerEntity>(AcmURLConstants.CREATE_PROSPECT, customerEntity);
  }

  /**
   * updateProspect
   */
  updateProspect(customerEntity: CustomerEntity): Observable<CustomerEntity> {
    return this.httpClient.put<CustomerEntity>(AcmURLConstants.UPDATE_PROSPECT, customerEntity);
  }

}
