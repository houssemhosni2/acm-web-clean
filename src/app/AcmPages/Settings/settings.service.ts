
import { SettingThirdPartyPaginationEntity } from '../../shared/Entities/SettingThirdPartyPaginations.entity';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductEntity } from '../../shared/Entities/product.entity';
import { SettingGurantorCollateralEntity } from '../../shared/Entities/settingGurantorCollateral.entity';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { SettingDocumentTypeProductEntity } from 'src/app/shared/Entities/settingDocumentTypeProduct.entity';
import { SettingMotifRejetsEntity } from '../../shared/Entities/settingMotifRejets.entity';
import { SettingLevelEntity } from '../../shared/Entities/settingLevel.entity';
import { AcmEnvironnementEntity } from '../../shared/Entities/acmEnvironnement.entity';
import { SettingNotificationsEntity } from '../../shared/Entities/settingNotifications.entity';
import { SettingLevelProcessEntity } from '../../shared/Entities/settingLevelProcess.entity';
import { HabilitationEntity } from 'src/app/shared/Entities/habilitation.entity';
import { HabilitationIhmRouteEntity } from 'src/app/shared/Entities/habilitationIhmRoute.entity';
import { UserEntity } from '../../shared/Entities/user.entity';
import { BrancheEntity } from '../../shared/Entities/branche.entity';
import { SettingRequiredStepEntity } from '../../shared/Entities/settingRequiredStep.entity';
import { GroupePaginationEntity } from 'src/app/shared/Entities/groupePagination.entity';
import { ProductDetailsEntity } from 'src/app/shared/Entities/productDetails.entity';
import { UserPaginationEntity } from '../../shared/Entities/user.pagination.entity';
import { PortfolioEntity } from '../../shared/Entities/Portfolio.entity';
import { UsersNotificationsEntity } from 'src/app/shared/Entities/usersNotifications.entity';
import { AcmDocumentsGedEntity } from 'src/app/shared/Entities/acmDocumentsGed.entity';
import { RenewalConditionEntity } from 'src/app/shared/Entities/renewalCondition.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { DeferredPeriodTypeEntity } from 'src/app/shared/Entities/DeferredPeriodType.entity';
import { StepEntity } from '../../shared/Entities/step.entity';
import { SettingThirdPartyEntity } from 'src/app/shared/Entities/settingThirdParty.entity';
import { SettingJournalEntryTypeEntity } from 'src/app/shared/Entities/settingJournalEntryType.entity';
import { AccountAbacusEntity } from 'src/app/shared/Entities/AccountAbacus.entity';
import { SettingJournalEnteriesEntity } from 'src/app/shared/Entities/settingJournalEntry.entity';
import { JournalEntity } from 'src/app/shared/Entities/Journal.entity';
import { ApplicationFeeEntity } from 'src/app/shared/Entities/applicationFee.entity';
import { LoanDetailsInformationsResponseEntity } from 'src/app/shared/Entities/LoanDetailsInformationsResponse.entity';
import { SettingSMSEntity } from 'src/app/shared/Entities/SettingSMS.entity';
import { ReadCsvFileEntity } from 'src/app/shared/Entities/ReadCsvFile.entity';
import { GenericWorkFlowObject } from 'src/app/shared/Entities/GenericWorkFlowObject';
import { DynamicProductEntity } from 'src/app/shared/Entities/DynamicProduct.entity';
import { SettingTypeRiskEntity } from 'src/app/shared/Entities/settingTypeRisk.entity';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { ItemRequestPagination } from 'src/app/shared/Entities/itemRequestPagination.entity';
import { SettingClaimsEntity } from 'src/app/shared/Entities/settingClaims.entity';
import { ClaimNoteEntity } from 'src/app/shared/Entities/ClaimNote.entity';
import { SettingChargeFeeEntity } from 'src/app/shared/Entities/settingChargeFee.entity';
import { InformationsPaymentEntity } from 'src/app/shared/Entities/InformationsPayment.entity';
import { paymentAbacusRequestEntity } from 'src/app/shared/Entities/paymentAbacusRequest.entity';
import { StepRiskSetting } from 'src/app/shared/Entities/StepRiskSetting.entity';
import { requestPaymentAbacusApiEntity } from 'src/app/shared/Entities/requestPaymentAbacusApi.entity';
import { SettingListValuesEntity } from 'src/app/shared/Entities/settingListValues.entity';
import { UserScreenPreferencesEntity } from 'src/app/shared/Entities/AcmUserScreenPreferences.entity';
import { ItemProcessEntity } from 'src/app/shared/Entities/Item.process.entity';
import { GnericWorkflowObjectWorkflow } from 'src/app/shared/Entities/GnericWorkflowObjectWorkflow.entity';
import { AcmAmlListSetting } from 'src/app/shared/Entities/AcmAmlListSetting.entity';
import { AcmDoubtfulTransactionSetting } from 'src/app/shared/Entities/AcmDoubtfulTransactionSetting.entity';
import { AcmAmlCheckEntity } from 'src/app/shared/Entities/AcmAmlCheck';
import { AcmAmlDataEntity } from 'src/app/shared/Entities/AcmAmlData';
import { CustomerSettingEntity } from 'src/app/shared/Entities/customerSetting.entity';
import { AssetTypeListDTO } from 'src/app/shared/Entities/AssetTypeListDTO.entity';
import { ProductTypeListDTO } from 'src/app/shared/Entities/ProductTypeListDTO.entity';
import { SettingBalcklistPartyType } from 'src/app/shared/Entities/settingBlacklistPartyType.entity';
import { AcmCurrencySetting } from 'src/app/shared/Entities/acmCurrencySetting.entity';
import { AcmClosedDaysSetting } from 'src/app/shared/Entities/acmClosedDaysSetting.entity';
import { AcmHolidaySetting } from 'src/app/shared/Entities/acmHolidaySetting.entity';
import { PortfolioPaginationEntity } from 'src/app/shared/Entities/PortfolioPagination.entity';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';
import { FinancialCategory } from 'src/app/shared/Entities/AcmFinancialCategory.entity';
import { AcmFinancialCategoryPagination } from 'src/app/shared/Entities/AcmFinancialCategoryPagination.entity';
import { SettingListEntity } from 'src/app/shared/Entities/AcmSettingList.entity';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public refreshSettingConfiguration$: BehaviorSubject<any> = new BehaviorSubject(null);
  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * find by given params
   * @param groupeEntity the GroupeEntity
   */
  find(groupeEntity: GroupeEntity): Observable<GroupeEntity[]> {
    return this.httpClient.post<GroupeEntity[]>(AcmURLConstants.GROUP_FIND, groupeEntity);
  }

  /**
   * find all Product
   */
  findAllProduct(): Observable<ProductEntity[]> {
    return this.httpClient.get<ProductEntity[]>(AcmURLConstants.LIST_ALL_PRODUCTS);
  }

  /**
   * find all Product
   */
  findProductById(id: number): Observable<ProductEntity> {
    return this.httpClient.get<ProductEntity>(AcmURLConstants.PRODUCT_DETAILS + id);
  }

  /**
   * update product
   * @param productEntity the ProductEntity
   */
  updateProduct(productEntity: ProductEntity) {
    return this.httpClient.put<ProductEntity>(AcmURLConstants.PRODUCT_UPDATE, productEntity);
  }

  /**
   * find setting Guarantor Collateral
   * @param settingGurantorCollateralEntity SettingGurantorCollateralEntity
   */
  findSettingGurantorCollateral(settingGurantorCollateralEntity: SettingGurantorCollateralEntity):
    Observable<SettingGurantorCollateralEntity[]> {
    return this.httpClient.post<SettingGurantorCollateralEntity[]>(AcmURLConstants.SETTING_GUARANTOR_COLLATERAL_FIND,
      settingGurantorCollateralEntity);
  }

  /**
   * update setting Guarantor Collateral
   * @param settingGurantorCollateralEntity SettingGurantorCollateralEntity
   */
  updateSettingGurantorCollateral(settingGurantorCollateralEntity: SettingGurantorCollateralEntity):
    Observable<SettingGurantorCollateralEntity> {
    return this.httpClient.put<SettingGurantorCollateralEntity>(AcmURLConstants.SETTING_GUARANTOR_COLLATERAL_UPDATE,
      settingGurantorCollateralEntity);
  }

  /**
   * update setting Guarantor Collateral
   * @param settingGurantorCollateralEntity SettingGurantorCollateralEntity
   */
  createSettingGurantorCollateral(settingGurantorCollateralEntity: SettingGurantorCollateralEntity):
    Observable<SettingGurantorCollateralEntity> {
    return this.httpClient.post<SettingGurantorCollateralEntity>(AcmURLConstants.SETTING_GUARANTOR_COLLATERAL_CREATE,
      settingGurantorCollateralEntity);
  }

  /**
   * find by given params
   * @param groupeEntity the GroupeEntity
   */
  findGroup(groupeEntity: GroupeEntity): Observable<GroupeEntity[]> {
    return this.httpClient.post<GroupeEntity[]>(AcmURLConstants.GROUP_FIND, groupeEntity);
  }

  /**
   * create
   * @param groupeEntity the groupeEntity
   */
  createGroup(groupeEntity: GroupeEntity) {
    return this.httpClient.post<GroupeEntity>(AcmURLConstants.GROUP_CREATE, groupeEntity);

  }

  /**
   * update
   * @param groupeEntity the GroupeEntity
   */
  updateGroup(groupeEntity: GroupeEntity) {
    return this.httpClient.put<GroupeEntity>(AcmURLConstants.GROUP_UPDATE, groupeEntity);
  }

  /**
   * update
   * @param groupeEntity the GroupeEntity
   */
  updateGroupEnabled(groupeEntity: GroupeEntity) {
    return this.httpClient.put<GroupeEntity>(AcmURLConstants.GROUP_UPDATE_ENABLED, groupeEntity);
  }

    /**
   * update
   * @param groupeEntity the GroupeEntity
   */
    updateGroupLinkedPortfolio(groupeEntity: GroupeEntity) {
      return this.httpClient.put<GroupeEntity>(AcmURLConstants.GROUP_UPDATE_LinkedPortfolio, groupeEntity);
    }

  /**
   * find all Groupes
   */
  findAllGroup(): Observable<GroupeEntity[]> {
    return this.httpClient.get<GroupeEntity[]>(AcmURLConstants.GROUP_FIND_ALL);
  }

  /**
   * find all document types
   */
  findAllDocumentTypes(): Observable<SettingDocumentTypeEntity[]> {
    return this.httpClient.get<SettingDocumentTypeEntity[]>(AcmURLConstants.FIND_ALL_TYPES_DOCUMENT);
  }

  /**
   * find all document types categories
   */
  findAllDocumentTypesCategory(): Observable<any[]> {
    return this.httpClient.get<any[]>(AcmURLConstants.FIND_DOCUMENT_TYPE_CATEGORY);
  }

  /**
   * create document types
   * @param  body SettingDocumentTypeEntity
   */
  createDocumentTypes(body: SettingDocumentTypeEntity): Observable<SettingDocumentTypeEntity> {
    return this.httpClient.post<SettingDocumentTypeEntity>(AcmURLConstants.CREATE_DOCUMENT_TYPE, body);
  }

  /**
   * update document types
   * @param  body SettingDocumentTypeEntity
   */
  updateDocumentTypes(body: SettingDocumentTypeEntity): Observable<SettingDocumentTypeEntity> {
    return this.httpClient.put<SettingDocumentTypeEntity>(AcmURLConstants.UPDATE_DOCUMENT_TYPE, body);
  }

  /**
   * disable document types
   * @param  body SettingDocumentTypeEntity
   */
  disableDocumentTypes(body: SettingDocumentTypeEntity): Observable<SettingDocumentTypeEntity> {
    return this.httpClient.put<SettingDocumentTypeEntity>(AcmURLConstants.DISABLE_DOCUMENT_TYPE, body);
  }

  /**
   * enable document types
   * @param  body SettingDocumentTypeEntity
   */
  enableDocumentTypes(body: SettingDocumentTypeEntity): Observable<SettingDocumentTypeEntity[]> {
    return this.httpClient.put<SettingDocumentTypeEntity[]>(AcmURLConstants.ENABLE_DOCUMENT_TYPE, body);
  }

  /**
   * find all document product
   */
  findAllDocumentProduct(body: SettingDocumentTypeProductEntity): Observable<SettingDocumentTypeProductEntity[]> {
    return this.httpClient.post<SettingDocumentTypeProductEntity[]>(AcmURLConstants.FIND_ALL_DOCUMENT_PRODUCT, body);
  }

  /**
   * disable document product
   * @param  body SettingDocumentTypeProductEntity
   */
  disableDocumentProduct(body: SettingDocumentTypeProductEntity): Observable<SettingDocumentTypeProductEntity> {
    return this.httpClient.put<SettingDocumentTypeProductEntity>(AcmURLConstants.DISABLE_DOCUMENT_PRODUCT, body);
  }

  /**
   * enable document product
   * @param  body SettingDocumentTypeProductEntity
   */
  enableDocumentProduct(body: SettingDocumentTypeProductEntity): Observable<SettingDocumentTypeProductEntity[]> {
    return this.httpClient.put<SettingDocumentTypeProductEntity[]>(AcmURLConstants.ENABLE_DOCUMENT_PRODUCT, body);
  }

  /**
   * update document product
   * @param  body SettingDocumentTypeProductEntity
   */
  updateDocumentProduct(body: SettingDocumentTypeProductEntity): Observable<SettingDocumentTypeProductEntity> {
    return this.httpClient.put<SettingDocumentTypeProductEntity>(AcmURLConstants.UPDATE_DOCUMENT_PRODUCT, body);
  }

  /**
   * Find all Setting motifs Reject
   */
  findAllSettingMotifRejects(): Observable<SettingMotifRejetsEntity[]> {
    return this.httpClient.get<SettingMotifRejetsEntity[]>(AcmURLConstants.SETTING_MOTIFS_REJECTS_FIND);
  }



  findAllSettingClaims(): Observable<SettingClaimsEntity[]> {
    return this.httpClient.get<SettingClaimsEntity[]>(AcmURLConstants.SETTING_CLAIMS_FIND);
  }


  findsettingClaimsById(settingClaimsEntity: SettingClaimsEntity): Observable<SettingClaimsEntity[]> {
    return this.httpClient.post<SettingClaimsEntity[]>(AcmURLConstants.SETTING_CLAIMS_FIND_BY_ID, settingClaimsEntity);
  }
  /**
   * get All Motif Rejects Ids ABACUS
   */
  getAllMotifRejectsIdsABACUS(): Observable<SettingMotifRejetsEntity[]> {
    return this.httpClient.get<SettingMotifRejetsEntity[]>(AcmURLConstants.GET_ABACUS_ALL_MOTIFS_DE_REJET);
  }

  /**
   * Update Setting motifs Reject
   */
  updateSettingMotifRejects(settingMotifRejetsEntity: SettingMotifRejetsEntity): Observable<SettingMotifRejetsEntity> {
    return this.httpClient.put<SettingMotifRejetsEntity>(AcmURLConstants.SETTING_MOTIFS_REJECTS_UPDATE, settingMotifRejetsEntity);
  }
  /**
   * Update Setting motifs Reject
   */
  updateSettingClaims(settingClaimsEntity: SettingClaimsEntity): Observable<SettingClaimsEntity> {
    return this.httpClient.put<SettingClaimsEntity>(AcmURLConstants.SETTING_CLAIMS_UPDATE, settingClaimsEntity);
  }

  /**
    * Create Setting motifs Reject
    */
  createSettingClaims(settingClaimsEntity: SettingClaimsEntity): Observable<SettingClaimsEntity> {
    return this.httpClient.post<SettingClaimsEntity>(AcmURLConstants.SETTING_CLAIMS_CREATE, settingClaimsEntity);
  }
  /**
     * Get Notes By Claim Id
     */
  getNotesByClaimId(ClaimNoteEntity: ClaimNoteEntity): Observable<ClaimNoteEntity[]> {
    return this.httpClient.post<ClaimNoteEntity[]>(AcmURLConstants.GET_CLAIM_NOTE, ClaimNoteEntity);
  }
  /**
     * Create Claim note
     */
  createClaimNote(claimNoteEntity: ClaimNoteEntity, categorie: string): Observable<ClaimNoteEntity> {
    const url = `${AcmURLConstants.CREATE_CLAIM_NOTE}/${categorie}`;
    return this.httpClient.post<ClaimNoteEntity>(url, claimNoteEntity);
  }


  /**
   * Create Setting motifs Reject
   */
  createSettingMotifRejects(settingMotifRejetsEntity: SettingMotifRejetsEntity): Observable<SettingMotifRejetsEntity> {
    return this.httpClient.post<SettingMotifRejetsEntity>(AcmURLConstants.SETTING_MOTIFS_REJECTS_CREATE, settingMotifRejetsEntity);
  }

  /**
   * find all Setting level
   */
  findAllSettingLevel(): Observable<SettingLevelEntity[]> {
    return this.httpClient.get<SettingLevelEntity[]>(AcmURLConstants.FIND_ALL_LEVEL);
  }

  /**
   * update level
   * @param  body SettingLevelEntity
   */
  updateLevel(body: SettingLevelEntity): Observable<SettingLevelEntity> {
    return this.httpClient.put<SettingLevelEntity>(AcmURLConstants.UPDATE_LEVEL, body);
  }

  /**
   * create level
   * @param  body SettingLevelEntity
   */
  createLevel(body: SettingLevelEntity): Observable<SettingLevelEntity> {
    return this.httpClient.post<SettingLevelEntity>(AcmURLConstants.CREATE_LEVEL, body);
  }

  /**
   * Find all ACM Environment
   */
  findAllAcmEnvironment(): Observable<AcmEnvironnementEntity[]> {
    return this.httpClient.get<AcmEnvironnementEntity[]>(AcmURLConstants.SETTING_ENVIRONMENT_FIND);
  }

  /**
   * Update ACM Environment
   */
  updateAcmEnvironment(acmEnvironnementEntity: AcmEnvironnementEntity): Observable<AcmEnvironnementEntity> {
    return this.httpClient.put<AcmEnvironnementEntity>(AcmURLConstants.SETTING_ENVIRONMENT_UPDATE, acmEnvironnementEntity);
  }

  /**
   * Create ACM Environment
   */
  createAcmEnvironment(acmEnvironnementEntity: AcmEnvironnementEntity): Observable<AcmEnvironnementEntity> {
    return this.httpClient.post<AcmEnvironnementEntity>(AcmURLConstants.SETTING_ENVIRONMENT_CREATE, acmEnvironnementEntity);
  }

  /**
   * Find all Setting Notification
   */
  findAllSettingNotification(): Observable<SettingNotificationsEntity[]> {
    return this.httpClient.get<SettingNotificationsEntity[]>(AcmURLConstants.SETTING_NOTIFICATION_FIND);
  }


  /**
  * Find all Setting Notification
  */
  findAllSettingCalendarSynchro(): Observable<SettingNotificationsEntity[]> {
    return this.httpClient.get<SettingNotificationsEntity[]>(AcmURLConstants.SETTING_NOTIFICATION_FIND_CALENDAR_SETTING);
  }


  findAllSettingCustomer(): Observable<CustomerSettingEntity[]> {
    return this.httpClient.get<CustomerSettingEntity[]>(AcmURLConstants.SETTING_CUSTOMER_FIND);
  }

  /**
   * Update Setting Notification
   */
  updateSettingNotification(settingNotificationsEntity: SettingNotificationsEntity):
    Observable<SettingNotificationsEntity> {
    return this.httpClient.put<SettingNotificationsEntity>(AcmURLConstants.SETTING_NOTIFICATION_UPDATE, settingNotificationsEntity);
  }


  /**
   * Update Setting Notification
   */
  updateSettingCustomer(customerSettingEntity: CustomerSettingEntity):
    Observable<CustomerSettingEntity> {
    return this.httpClient.put<CustomerSettingEntity>(AcmURLConstants.SETTING_CUSTOMER_UPDATE, customerSettingEntity);
  }

  /**
   * find all setting level process
   * @param  body SettingLevelProcessEntity
   */
  findAllSettingLevelProcess(body: SettingLevelProcessEntity): Observable<SettingLevelProcessEntity[]> {
    return this.httpClient.post<SettingLevelProcessEntity[]>(AcmURLConstants.FIND_ALL_LEVEL_PROCESS, body);
  }

  /**
   * update level process
   * @param  body SettingLevelProcessEntity
   */
  updateLevelProcess(body: SettingLevelProcessEntity): Observable<SettingLevelProcessEntity> {
    return this.httpClient.put<SettingLevelProcessEntity>(AcmURLConstants.UPDATE_LEVEL_PROCESS, body);
  }

  /**
   * update order level
   * @param  body SettingLevelEntity
   */
  updateOrderLevel(body: SettingLevelEntity[]): Observable<SettingLevelEntity[]> {
    return this.httpClient.put<SettingLevelEntity[]>(AcmURLConstants.UPDATE_ORDER_LEVEL, body);
  }

  /**
   * update update level amount
   * @param  body SettingLevelProcessEntity
   */
  updateLevelAmount(body: SettingLevelProcessEntity[]): Observable<boolean> {
    return this.httpClient.put<boolean>(AcmURLConstants.UPDATE_LEVEL_AMOUNT, body);
  }
  /**
   *
   * @param settingLevelProcessEntity SettingLevelProcessEntity
   */
  createLevelProcess(settingLevelProcessEntity: SettingLevelProcessEntity): Observable<SettingLevelProcessEntity> {
    return this.httpClient.post<SettingLevelProcessEntity>(AcmURLConstants.CREATE_LEVEL_PROCESS, settingLevelProcessEntity);
  }
  /**
   * find all habilitation setting
   */
  findAllHabilitation(habilitationEntity: HabilitationEntity): Observable<HabilitationEntity[]> {
    return this.httpClient.post<HabilitationEntity[]>(AcmURLConstants.SETTING_HABILITATION_FIND_ALL, habilitationEntity);
  }

  /**
   * find all habilitation ihm route setting
   */
  findAllHabilitationIhmRoute(habilitationIhmRouteEntity: HabilitationIhmRouteEntity): Observable<HabilitationIhmRouteEntity[]> {
    return this.httpClient.post<HabilitationIhmRouteEntity[]>(AcmURLConstants.SETTING_HABILITATION_FIND_IHM_ROUTE,
      habilitationIhmRouteEntity);
  }
  /**
   *
   * @param usersNotificationsEntity UsersNotificationsEntity
   */
  findAllUsersNotification(usersNotificationsEntity: UsersNotificationsEntity): Observable<UsersNotificationsEntity[]> {
    return this.httpClient.post<UsersNotificationsEntity[]>(AcmURLConstants.USER_NOTIFICATION_SETTING_FIND, usersNotificationsEntity);
  }
  /**
   * Update user notification (enable desable)
   *
   * @param usersNotificationsEntity UsersNotificationsEntity
   */
  updateEnableUserNotification(usersNotificationsEntity: UsersNotificationsEntity): Observable<UsersNotificationsEntity> {
    return this.httpClient.put<UsersNotificationsEntity>(AcmURLConstants.USER_NOTIFICATION_UPDATE_STATUT, usersNotificationsEntity);

  }

  /**
   * updateHabilitation
   * @param hablitationEntitys the list HabilitationEntity
   */
  updateHabilitation(hablitationEntitys: HabilitationEntity[]) {
    return this.httpClient.put<HabilitationEntity[]>(AcmURLConstants.SETTING_HABILITATION_UPDATE, hablitationEntitys);
  }

  /**
   * Find all Users
   */
  findAllUsers(): Observable<UserEntity[]> {
    return this.httpClient.get<UserEntity[]>(AcmURLConstants.SETTING_USER_FIND);
  }
  /**
 * Find all Users
 */
  findAllSettingSMS(settingSMSEntity: SettingSMSEntity): Observable<SettingSMSEntity[]> {
    return this.httpClient.post<SettingSMSEntity[]>(AcmURLConstants.FIND_SMS, settingSMSEntity);
  }

  saveSettingSMS(settingSMSEntity: SettingSMSEntity): Observable<SettingSMSEntity> {
    return this.httpClient.post<SettingSMSEntity>(AcmURLConstants.SAVE_SMS, settingSMSEntity);
  }
  updateSettingSMS(settingSMSEntity: SettingSMSEntity): Observable<SettingSMSEntity> {
    return this.httpClient.post<SettingSMSEntity>(AcmURLConstants.UPDATE_SMS, settingSMSEntity);
  }
  /**
   * Update Enable User
   */
  updateEnableUser(userEntity: UserEntity): Observable<UserEntity> {
    return this.httpClient.post<UserEntity>(AcmURLConstants.SETTING_USER_ENABLE_UPDATE, userEntity);
  }

  /**
   * Update Default Lang for user
   */
  updateDefaultLangUser(userEntity: UserEntity): Observable<UserEntity> {
    return this.httpClient.post<UserEntity>(AcmURLConstants.UPDATE_DEFAULT_LANG, userEntity);
  }

  /**
   * getUsers
   */
  getUsers(userEntity: UserEntity): Observable<UserEntity[]> {
    return this.httpClient.post<UserEntity[]>(AcmURLConstants.GET_ACCOUNT_PORTFOLIO, userEntity);
  }
  /**
   * getResponsible
   * @param userEntity UserEntity
   */
  getResponsible(userEntity: UserEntity): Observable<UserEntity[]> {
    return this.httpClient.post<UserEntity[]>(AcmURLConstants.FIND_RESPONSIBLE, userEntity);
  }

  getCheckResponsibleLoop(username: string, oldResponsible: string, newResponible: string): Observable<string> {
    return this.httpClient.get<string>(AcmURLConstants.CHECK_RESPONSIBLE_LOOP +'/'+ username +'/'+ oldResponsible +'/'+ newResponible, { responseType: 'text' as 'json'});
  }
  /**
   * Find all portfolio
   */
  findAllPortfolio(): Observable<PortfolioEntity[]> {
    return this.httpClient.get<PortfolioEntity[]>(AcmURLConstants.FIND_PORTFOLIO_ABACUS);
  }

  /**
   * Find all Users by Pagination
   */
  findUserPagination(userPaginationEntity: UserPaginationEntity): Observable<UserPaginationEntity> {
    return this.httpClient.post<UserPaginationEntity>(AcmURLConstants.SETTING_USER_PAGINATION, userPaginationEntity);
  }

    /**
   * Find all Portfolio by Pagination
   */
    findPortfolioPagination(portfolioPaginationEntity: PortfolioPaginationEntity): Observable<PortfolioPaginationEntity> {
      return this.httpClient.post<PortfolioPaginationEntity>(AcmURLConstants.SETTING_Portfolio_PAGINATION, portfolioPaginationEntity);
    }

    /**
   * Find all Portfolio by Pagination
   */
    findAllAcmPortfolio(): Observable<PortfolioEntity[]> {
      return this.httpClient.get<PortfolioEntity[]>(AcmURLConstants.FIND_All_PORTFOLIO);
    }

    getCustomerPortfolio(portfolioEntity: PortfolioEntity): Observable<PortfolioEntity[]> {
      return this.httpClient.post<PortfolioEntity[]>(AcmURLConstants.SETTING_GET_PORTFOLIO, portfolioEntity);
  
     }
  /**
   * Update User
   */
  updateUser(userEntity: UserEntity): Observable<UserEntity> {
    return this.httpClient.post<UserEntity>(AcmURLConstants.SETTING_USER_UPDATE, userEntity);
  }

  SavePortfolio(portfolioEntity: PortfolioEntity): Observable<PortfolioEntity> {
    return this.httpClient.post<PortfolioEntity>(AcmURLConstants.SETTING_PORTFOLIO_CREATE, portfolioEntity);
  }

  /**
   * change supervisor
   * @param usersEntity UserEntity
   * @returns UserEntity
   */
  updateusersSupervisor(usersEntity: UserEntity[]) {
    return this.httpClient.put<UserEntity[]>(AcmURLConstants.UPDATE_USERS_RESPONSIBLE, usersEntity);
  }
  /**
   * Create ACM Environment
   */
  createUser(userEntity: UserEntity): Observable<UserEntity> {
    return this.httpClient.post<UserEntity>(AcmURLConstants.SETTING_USER_CREATE, userEntity);
  }

  /**
   * Find branches
   */
  findBranche(): Observable<BrancheEntity[]> {
    return this.httpClient.get<BrancheEntity[]>(AcmURLConstants.BRANCHE_FIND);
  }

  /**
   * Find all Setting Required Step
   */
  findAllSettingRequiredStep(): Observable<SettingRequiredStepEntity[]> {
    return this.httpClient.get<SettingRequiredStepEntity[]>(AcmURLConstants.SETTING_REQUIRED_STEP_FIND_ALL);
  }

  /**
   * Find Setting Required Step by param
   */
  findSettingRequiredStep(settingRequiredStepEntity: SettingRequiredStepEntity):
    Observable<SettingRequiredStepEntity[]> {
    return this.httpClient.post<SettingRequiredStepEntity[]>(AcmURLConstants.SETTING_REQUIRED_STEP_FIND, settingRequiredStepEntity);
  }

  /**
   * Update Setting Required Step
   */
  updateSettingRequiredStep(settingRequiredStepEntity: SettingRequiredStepEntity):
    Observable<SettingRequiredStepEntity> {
    return this.httpClient.put<SettingRequiredStepEntity>(AcmURLConstants.SETTING_REQUIRED_STEP_UPDATE, settingRequiredStepEntity);
  }

  /**
   * Create Setting Required Step
   */
  createSettingRequiredStep(settingRequiredStepEntity: SettingRequiredStepEntity):
    Observable<SettingRequiredStepEntity> {
    return this.httpClient.post<SettingRequiredStepEntity>(AcmURLConstants.SETTING_REQUIRED_STEP_CREATE, settingRequiredStepEntity);
  }

  /**
   * load groupe By Status and paginations
   * @param groupePaginationEntity GroupePaginationEntity
   */
  loadGroupeIbByStatusPagination(groupePaginationEntity: GroupePaginationEntity): Observable<GroupePaginationEntity> {
    return this.httpClient.post<GroupePaginationEntity>(AcmURLConstants.FIND_GROUPES_PAGINATIONS, groupePaginationEntity);
  }

  /**
   * createProductDetails
   * @param productDetailsEntity ProductDetailsEntity
   */
  createProductDetails(productDetailsEntity: ProductDetailsEntity): Observable<ProductDetailsEntity> {
    return this.httpClient.post<ProductDetailsEntity>(AcmURLConstants.CREATE_PRODUCT_DETAILS, productDetailsEntity);
  }

  /**
   * createProductDetails
   * @param productDetailsEntity ProductDetailsEntity
   */
  updateProductDetails(productDetailsEntity: ProductDetailsEntity): Observable<ProductDetailsEntity> {
    return this.httpClient.put<ProductDetailsEntity>(AcmURLConstants.UPDATE_PRODUCT_DETAILS, productDetailsEntity);
  }

  /**
   * deleteProductDetails by given params
   * @param productDetailsId the productDetails Id
   */
  deleteProductDetails(productDetailsId: any): Observable<any> {
    return this.httpClient.delete<any>(AcmURLConstants.DELETE_PRODUCT_DETAILS + productDetailsId);
  }

  /**
   * findProduct
   * @param id id
   */
  findProduct(id: any): Observable<ProductEntity> {
    return this.httpClient.get<ProductEntity>(AcmURLConstants.PRODUCT_DETAILS + id);
  }

  /**
   * Reset Setting Address
   */
  resetSettingAddress(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.RESET_SETTING_ADDRESS);
  }

  /**
   * Reset Setting List Values
   */
  resetSettingListValues(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.RESET_SETTING_LIST_VALUS);
  }

  /**
   * Reset Setting UDF
   */
  resetSettingUDF(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.RESET_SETTING_UDF);
  }

  /**
   * Reload Setting Product
   */
  reloadSettingProduct(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.RELOAD_SETTING_PRODUCT);
  }

  /**
   * Reload Setting Product
   */
  synchronizeIB(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.SYNC_IB_SETTING_AND_UDF);
  }

  /**
   *
   * @param usersNotificationsEntity UsersNotificationsEntity
   * @returns UsersNotificationsEntity
   */
  createUserNotification(usersNotificationsEntity: UsersNotificationsEntity): Observable<UsersNotificationsEntity> {
    return this.httpClient.post<UsersNotificationsEntity>(AcmURLConstants.USER_NOTIFICATION_CREATE, usersNotificationsEntity);

  }
  /**
   *
   * find all settingMotifRejects (enabled and disabled data)
   * @returns SettingMotifRejetsEntity[]
   */
  findAllEnabledDisabledSettingMotifRejects(settingMotifRejetsEntity: SettingMotifRejetsEntity): Observable<SettingMotifRejetsEntity[]> {
    return this.httpClient.post<SettingMotifRejetsEntity[]>(AcmURLConstants.GET_ENABLED_DISABLED_MOTIF_REJETS, settingMotifRejetsEntity);
  }
  /**
   * find Setting I-Score
   * @returns AcmEnvironnementEntity[]
   */
  findSettingIScore(): Observable<AcmEnvironnementEntity[]> {
    return this.httpClient.get<AcmEnvironnementEntity[]>(AcmURLConstants.SETTING_ENVIRONMENT_FIND_SETTING_ISCORE);
  }

  /**
   *
   * @param uploadedFile any
   */
  loadAmlData(uploadedFiles: any[]): Observable<any> {
    const formdata = new FormData();
    for (const i of uploadedFiles) {
      formdata.append('uploadedFiles', i);
    }
    return this.httpClient.post<void>(AcmURLConstants.SETTING_ENVIRONMENT_LOAD_AML_DATA, formdata);
  }


  getAmlData(acmAmlCheck: AcmAmlDataEntity): Observable<AcmAmlDataEntity[]> {
    return this.httpClient.post<AcmAmlDataEntity[]>(AcmURLConstants.SETTING_LOAD_AML_DATA_BY_ID, acmAmlCheck);
  }

  /**
   * get acmEnvirement By Category
   * @param category TECHNICAL / FUNCTION / REMINDER
   * @returns AcmEnvironnementEntity
   */
  getEnvirementValueByCatgeory(category: string): Observable<AcmEnvironnementEntity[]> {
    return this.httpClient.get<AcmEnvironnementEntity[]>(AcmURLConstants.SETTING_ENVIRONMENT_FIND_BY_CATEGORY + category);
  }

  /**
   * get ACM ENVIRONNEMENT BY KEYS
   * @param keys Kyes
   * @returns the list of AcmEnvironnementEntity
   */
  getEnvirementValueByKeys(keys: string[]):
    Observable<AcmEnvironnementEntity[]> {
    return this.httpClient.post<AcmEnvironnementEntity[]>(AcmURLConstants.SETTING_ENVIRONMENT_FIND_BY_KEYS, keys);
  }

  getEnvirementValueByKey(key: string): Observable<AcmEnvironnementEntity> {
    return this.httpClient.get<AcmEnvironnementEntity>(AcmURLConstants.SETTING_ENVIRONMENT_FIND_BY_KEY + key);
  }
  
  /**
   * save documents in ged
   *
   * @returns number
   */
  synchroniseDocuments(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.SAVE_DOCUMENT_IN_GED);
  }

  /**
   * count documents not saved in ged
   *
   * @returns number
   */
  countBackUpDocuments(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_BACKUP_GED_DOCUMENTS);
  }

  /**
   * find Document Types
   * @param settingDocumentTypeEntity SettingDocumentTypeEntity
   */
  findDocumentTypes(settingDocumentTypeEntity: SettingDocumentTypeEntity): Observable<SettingDocumentTypeEntity[]> {
    return this.httpClient.post<SettingDocumentTypeEntity[]>(AcmURLConstants.GET_ALL_TYPES_DOCUMENT, settingDocumentTypeEntity);
  }

  /**
   * find photo client
   * @param idDocument number
   */
  getClientPhoto(idDocument: number): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.FIND_PHOTO_CLIENT + idDocument, { responseType: 'blob' as 'json' });
  }
  /**
   * update photo client
   * @param uploadedFiles photo
   * @param documentsGedEntity AcmDocumentsGedEntity
   */
  updateClientPhoto(uploadedFiles: any[], documentsGedEntity: AcmDocumentsGedEntity): Observable<any> {
    const formdata = new FormData();
    for (const i of uploadedFiles) {
      formdata.append('photo', i);
    }
    formdata.append('idDocument', JSON.stringify(documentsGedEntity.idDocument));
    return this.httpClient.post<any>(AcmURLConstants.UPDATE_PHOTO_CLIENT, formdata, { responseType: 'blob' as 'json' });
  }
  /**
   * get loans from abacus and save them in acm
   * @returns number of synchronized loans
   */
  synchroniseLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.SYNCHRONIZE_LOANS);
  }
  /**
   * synchronize loan issued
   * @returns number of loan issued synchronized
   */
  synchroniseIssuedLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.SYNCHRONIZE_ISSUED_LOANS);
  }
  /**
   * synchronize loan cancelled
   * @returns number of loan cancelled synchronized
   */
  synchroniseCancelledLoans(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.SYNCHRONIZE_CANCELLED_LOANS);
  }
  /**
   * get loan by account number
   * @param accountNumber string
   * @returns loanDTO
   */
  synchroniseLoanAccountNumber(accountNumber: string): Observable<LoanEntity> {
    return this.httpClient.get<LoanEntity>(AcmURLConstants.SYNCHRONIZE_LOAN_BY_ACCOUNT_NUMBER + accountNumber);
  }

  /**
   * getRefreshSettingConfiguration()
   *
   */
  getRefreshSettingConfiguration(): Observable<any> {
    return this.refreshSettingConfiguration$.asObservable();
  }
  /**
   *
   * @param productDetailsDTOs   productDetailsDTOs
   */
  setrefreshSettingConfiguration(productDetailsDTOs: any) {
    this.refreshSettingConfiguration$.next(productDetailsDTOs);
  }
  /**
   * get list of renewal condition settings
   * @param renewalConditionEntity RenewalConditionEntity
   * @returns list of renewalConditionEntity
   */
  getRenewalConditionSettings(renewalConditionEntity: RenewalConditionEntity): Observable<RenewalConditionEntity[]> {
    return this.httpClient.post<RenewalConditionEntity[]>(AcmURLConstants.FIND_RENEWAL_CONDITION_SETTINGS, renewalConditionEntity);
  }
  /**
   * create new renewalConditionEntity
   */
  createRenewalConditionSetting(renewalConditionEntity: RenewalConditionEntity):
    Observable<RenewalConditionEntity> {
    return this.httpClient.post<RenewalConditionEntity>(AcmURLConstants.CREATE_RENEWAL_CONDITION_SETTING, renewalConditionEntity);
  }
  /**
   * update RenewalConditionEntity
   * @param renewalConditionEntity RenewalConditionEntity
   */
  updateRenewalConditionSetting(renewalConditionEntity: RenewalConditionEntity): Observable<RenewalConditionEntity> {
    return this.httpClient.put<RenewalConditionEntity>(AcmURLConstants.UPDATE_RENEWAL_CONDITION_SETTING, renewalConditionEntity);
  }
  /**
   * delete RenewalConditionEntity
   * @param idRenewalConditionSetting number
   */
  deleteRenewalConditionSetting(idRenewalConditionSetting: number): Observable<RenewalConditionEntity> {
    return this.httpClient.delete<RenewalConditionEntity>(AcmURLConstants.DELETE_RENEWAL_CONDITION_SETTING + idRenewalConditionSetting);
  }
  /**
   * synchroniseCustomers
   */
  synchroniseCustomers(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.SYNCHRONIZE_CUSTOMERS);
  }
  /**
   * synchronize Portfolio
   */
  synchronisePortfolio(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.SYNCHRONIZE_PORTFOLIO);
  }

  /**
   * synchronize CustomerBranches
   */
  synchroniseCustomerBranches(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.SYNCHRONIZE_CUSTOMER_BRANCHES);
  }

  /**
  * synchronize Collections
  */
  synchroniseCollections(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.SYNCHRONIZE_COLLECTIONS);
  }

  /**
   * get deferred period types
   * @returns DeferredPeriodTypeEntity[]
   */
  getDeferredPeriodTypes(): Observable<DeferredPeriodTypeEntity[]> {
    return this.httpClient.get<DeferredPeriodTypeEntity[]>(AcmURLConstants.FIND_DEFERRED_PERIOD_TYPES);
  }

  /**
   * save Approval Steps
   * @param steps Array of approval steps
   * @param productId product ID
   * @param process process Name
   */
  saveApprovalSteps(steps: StepEntity[], productId: number, process: string): Observable<any> {
    return this.httpClient.post<StepEntity[]>(AcmURLConstants.SAVE_APPROVAL_STEPS + productId + '/' + process, steps);
  }
  /**
   * save Collection Steps
   * @param steps Array of approval steps
   * @param productId product ID
   */
  saveCollectionSteps(steps: StepEntity[], productId: number, process: string): Observable<any> {
    return this.httpClient.post<StepEntity[]>(AcmURLConstants.SAVE_COLLECTION_STEPS + productId + '/' + process, steps);
  }

  /**
   * find Approval Steps
   * @param stepEntity Step Entity to find
   */
  findWorkFlowSteps(stepEntity: StepEntity): Observable<StepEntity[]> {
    return this.httpClient.post<StepEntity[]>(AcmURLConstants.FIND_APPROVAL_STEPS, stepEntity);
  }

  /**
   * find Approval Steps
   * @param stepEntity Step Entity to find
   */
  findCollectionSteps(stepEntity: StepEntity): Observable<any> {
    return this.httpClient.post<StepEntity[]>(AcmURLConstants.FIND_COLLECTION_STEPS, stepEntity);
  }

  /**
   * create setting collection third party
   * @param SettingThirdPartyEntity setting Collection Third Party Entity to create
   */
  createSettingThirdParty(SettingThirdPartyEntity: SettingThirdPartyEntity):
    Observable<SettingThirdPartyEntity> {
    return this.httpClient.post<SettingThirdPartyEntity>(AcmURLConstants.SETTING_THIRD_PARTY_CREATE,
      SettingThirdPartyEntity);
  }

  /**
   * Find all settings third party by Pagination
   */
  findSettingThirdPartyPagination(settingThirdPartyPaginationEntity:
    SettingThirdPartyPaginationEntity): Observable<SettingThirdPartyPaginationEntity> {
    return this.httpClient.post<SettingThirdPartyPaginationEntity>(
      AcmURLConstants.SETTING_THIRD_PARTY_PAGINATION, settingThirdPartyPaginationEntity);
  }

  /**
   * Update setting collection third party
   */
  updateSettingThirdParty(SettingThirdPartyEntity: SettingThirdPartyEntity):
    Observable<SettingThirdPartyEntity> {
    return this.httpClient.post<SettingThirdPartyEntity>(
      AcmURLConstants.SETTING_THIRD_PARTY_UPDATE, SettingThirdPartyEntity);
  }

  /**
   * Update Enable setting collection third party
   */
  updateEnableSettingThirdParty(SettingThirdPartyEntity:
    SettingThirdPartyEntity):
    Observable<SettingThirdPartyEntity> {
    return this.httpClient.post<SettingThirdPartyEntity>(
      AcmURLConstants.SETTING_THIRD_PARTY_ENABLE,
      SettingThirdPartyEntity);
  }

  /**
   * getCollectionStep by given params
   * @param StepEntity the stepEntity
   */
  getCollectionStepByParms(collectionStepDTO: StepEntity): Observable<StepEntity[]> {
    return this.httpClient.post<StepEntity[]>(AcmURLConstants.FIND_COLLECTION_STEP_BY_PARAMS,
      collectionStepDTO);
  }
  /**
   * Setting Charge fee
   */
  findSettingChargeFee(settingChargeFeeEntity: SettingChargeFeeEntity): Observable<SettingChargeFeeEntity[]> {
    return this.httpClient.post<SettingChargeFeeEntity[]>(AcmURLConstants.SETTING_CHARGE_FEE_FIND, settingChargeFeeEntity);
  }
  createSettingChargeFee(settingChargeFeeEntity: SettingChargeFeeEntity): Observable<SettingChargeFeeEntity> {
    return this.httpClient.post<SettingChargeFeeEntity>(AcmURLConstants.SETTING_CHARGE_FEE_CREATE, settingChargeFeeEntity);
  }
  updateSettingChargeFee(settingChargeFeeEntity: SettingChargeFeeEntity): Observable<SettingChargeFeeEntity[]> {
    return this.httpClient.put<SettingChargeFeeEntity[]>(AcmURLConstants.SETTING_CHARGE_FEE_UPDATE, settingChargeFeeEntity);
  }
  findAllSettingChargeFee(): Observable<SettingChargeFeeEntity[]> {
    return this.httpClient.get<SettingChargeFeeEntity[]>(AcmURLConstants.SETTING_CHARGE_FEE_FIND_ALL);
  }
  findByIdSettingChargeFee(id: number): Observable<SettingChargeFeeEntity> {
    return this.httpClient.get<SettingChargeFeeEntity>(AcmURLConstants.SETTING_CHARGE_FEE_FIND + id);
  }

  /**
   * getThirdPartys by given params
   * @param SettingThirdPartyEntity the SettingThirdPartyEntity
   */
  getThirdPartysByParms(SettingThirdPartyEntity: SettingThirdPartyEntity):
    Observable<SettingThirdPartyEntity[]> {
    return this.httpClient.post<SettingThirdPartyEntity[]>(
      AcmURLConstants.FIND_SETTING_THIRD_PARTY, SettingThirdPartyEntity);
  }

  getstep(code: string): Observable<StepEntity> {
    return this.httpClient.get<StepEntity>(AcmURLConstants.FIND_WORK_FLOW_LOAN + code);
  }

  findAllSettingJournalEntryType(): Observable<SettingJournalEntryTypeEntity[]> {
    return this.httpClient.get<SettingJournalEntryTypeEntity[]>(AcmURLConstants.SETTING_JOURNAL_ENTRY_FIND);
  }
  createSettingJournalEntry(settingJournalEntryTypeEntity: SettingJournalEntryTypeEntity): Observable<SettingJournalEntryTypeEntity> {
    return this.httpClient.post<SettingJournalEntryTypeEntity>(AcmURLConstants.SETTING_JOURNAL_ENTRY_CREATE,
      settingJournalEntryTypeEntity);
  }
  deleteSettingJournalEntryCondition(journalEntryId: any): Observable<any> {
    return this.httpClient.delete<any>(AcmURLConstants.SETTING_JOURNAL_ENTRY_DELETE + journalEntryId);
  }

  findCreditAcountFromAbacus(filter: string): Observable<AccountAbacusEntity[]> {
    return this.httpClient.post<[]>(AcmURLConstants.FIND_CREDIT_ACCOUNT_FROM_ABACUS, filter);
  }
  createJournalEnteries(settingJournalEnteriesEntity: SettingJournalEnteriesEntity[], settingJournalEntryTypeEntityId: number):
    Observable<SettingJournalEnteriesEntity[]> {
    return this.httpClient.post<SettingJournalEnteriesEntity[]>(AcmURLConstants.SETTING_JOURNAL_ENTERIES_CREATE +
      settingJournalEntryTypeEntityId, settingJournalEnteriesEntity);
  }

  updateSettingJournalEntry(settingJournalEntryTypeEntity: SettingJournalEntryTypeEntity): Observable<SettingJournalEntryTypeEntity> {
    return this.httpClient.put<SettingJournalEntryTypeEntity>(AcmURLConstants.SETTING_JOURNAL_ENTRY_UPDATE,
      settingJournalEntryTypeEntity);
  }
  findJournals(): Observable<JournalEntity[]> {
    return this.httpClient.get<JournalEntity[]>(AcmURLConstants.FIND_JOURNALS);
  }
  findSettingJournalEntryBy(settingJournalEntryTypeEntity: SettingJournalEntryTypeEntity): Observable<SettingJournalEntryTypeEntity[]> {
    return this.httpClient.post<SettingJournalEntryTypeEntity[]>(AcmURLConstants.SETTING_JOURNAL_ENTRY_FIND_BY, settingJournalEntryTypeEntity);
  }
  getApplicationFees(): Observable<ApplicationFeeEntity[]> {
    return this.httpClient.get<ApplicationFeeEntity[]>(AcmURLConstants.FIND_APPLICATION_FEES);
  }

  getMacServer(): Observable<string[]> {
    return this.httpClient.get<string[]>(AcmURLConstants.FIND_MAC);
  }

  getDetailsInformationsLoanFromAbacus(loanIdExtern: number): Observable<LoanDetailsInformationsResponseEntity[]> {
    return this.httpClient.get<LoanDetailsInformationsResponseEntity[]>(AcmURLConstants.FIND_DETAILS_INFORMATIONS_LOAN_FROM_ABACUS + loanIdExtern);
  }

  sendDataCsvFileChargeOff(listData: ReadCsvFileEntity[]): Observable<string> {
    return this.httpClient.post<string>(AcmURLConstants.UPLOAD_CSV_FILE_CHARGE_OFF, listData);
  }
  saveUserScreenPreferences(userScreenPreferences: UserScreenPreferencesEntity): Observable<UserScreenPreferencesEntity> {
    return this.httpClient.post<UserScreenPreferencesEntity>(AcmURLConstants.SAVE_USER_SCREEN_PREFERENCES, userScreenPreferences);
  }
  findUserScreenPreferences(userScreenPreferences: UserScreenPreferencesEntity): Observable<UserScreenPreferencesEntity[]> {
    return this.httpClient.post<UserScreenPreferencesEntity[]>(AcmURLConstants.FIND_USER_SCREEN_PREFERENCES, userScreenPreferences);
  }
  getInformationsPayment(cuAccountId: number): Observable<InformationsPaymentEntity> {
    return this.httpClient.get<InformationsPaymentEntity>(AcmURLConstants.FIND_INFORMATIONS_PAYMENT + cuAccountId);
  }

  paymentAcmToAbacus(paymentAbacusRequestEntity: paymentAbacusRequestEntity, username: string, paymentFrom: string,referencePayment: string): Observable<boolean> {
    return this.httpClient.post<boolean>(AcmURLConstants.PAYMENT_ACM_TO_ABACUS + '?username=' + username + '&paymentFrom=' + paymentFrom +'&referencePayment='+referencePayment,
      paymentAbacusRequestEntity);
  }

    saveWorkFlowObject(genericWorkFlowObject : GenericWorkFlowObject ): Observable<GenericWorkFlowObject>{
      return this.httpClient.post<GenericWorkFlowObject>(AcmURLConstants.CREATE_GENERIC_WORKFLOW_OBEJCT , genericWorkFlowObject);


    }

    findAllSettingRiskType(): Observable<SettingTypeRiskEntity[]> {
      return this.httpClient.get<SettingTypeRiskEntity[]>(AcmURLConstants.SETTING_RISK_TYPE_FIND);
    }
    findAllSettingRiskTypeEnabled(): Observable<SettingTypeRiskEntity[]> {
      return this.httpClient.get<SettingTypeRiskEntity[]>(AcmURLConstants.SETTING_RISK_TYPE_FIND_ENABLED);
    }

    findWorkFlowObjects(): Observable<GenericWorkFlowObject[]> {
        return this.httpClient.get<GenericWorkFlowObject[]>(AcmURLConstants.FIND_GENERIC_WORKFLOW_OBEJCT );
    }


    findProductWorkFlow(): Observable<StepEntity[]> {
      return this.httpClient.get<StepEntity[]>(AcmURLConstants.FIND_PRODUCT_STEPS);
    }
    findWorkFlowProductById(dynamicProduct : DynamicProductEntity): Observable<StepEntity> {
      return this.httpClient.get<StepEntity>(AcmURLConstants.FIND_BY_PRODUCT_STEPS+ dynamicProduct.stepProductId);
    }
    getRiskLevel(idLoan : number): Observable<any[]> {
      return this.httpClient.get<any[]>(AcmURLConstants.GET_RISK+idLoan);
    }
    updateRiskLevel(risk : any[]): Observable<any[]> {
      return this.httpClient.post<any[]>(AcmURLConstants.SAVE_RISK,risk);
    }
    createProduct(product:ProductEntity): Observable<ProductEntity>{
      return this.httpClient.post<ProductEntity>(AcmURLConstants.CREATE_PRODUCT,product);


    }
    createItem(itemEntity:ItemEntity): Observable<ItemEntity>{
      return this.httpClient.post<ItemEntity>(AcmURLConstants.CREATE_ITEM,itemEntity);


    }

    public findItemPagination(itemRequestPaginationEntity: ItemRequestPagination):
    Observable<ItemRequestPagination> {
    return this.httpClient.post<ItemRequestPagination>(AcmURLConstants.FIND_PAGINATION_ITEM,
      itemRequestPaginationEntity);
  }

  public getWorkFlowSteps(workFlow: StepEntity): Observable<StepEntity[]> {
    return this.httpClient.post<StepEntity[]>(AcmURLConstants.FIND_WORKFLOW_STEPS, workFlow);
  }

  public findUnassignedItemPagination(itemRequestPaginationEntity: ItemRequestPagination):
  Observable<ItemRequestPagination> {
  return this.httpClient.post<ItemRequestPagination>(AcmURLConstants.FIND_PAGINATION_UNASSIGNED_ITEM,
    itemRequestPaginationEntity);
}


  public findItems(itemEntity: ItemEntity):
  Observable<ItemEntity[]> {
  return this.httpClient.post<ItemEntity[]>(AcmURLConstants.FIND_ITEMS,
    itemEntity);
}



  SaveSettingRiskType(settingTypeRiskEntity :SettingTypeRiskEntity): Observable<SettingTypeRiskEntity> {
    return this.httpClient.post<SettingTypeRiskEntity>(AcmURLConstants.SETTING_RISK_TYPE_CREATE,settingTypeRiskEntity);
  }
  updateSettingRiskType(settingTypeRiskEntity :SettingTypeRiskEntity): Observable<SettingTypeRiskEntity> {
    return this.httpClient.put<SettingTypeRiskEntity>(AcmURLConstants.SETTING_RISK_TYPE_UPDATE,settingTypeRiskEntity);
  }

  deleteSettingRiskType(idRiskType:number){
    return this.httpClient.delete<any>(AcmURLConstants.SETTING_RISK_TYPE_DELETE + idRiskType);

  }
  findStepRisk(item: ItemEntity): Observable<StepRiskSetting[]> {
    return this.httpClient.post<StepRiskSetting[]>(AcmURLConstants.FIND_STEP_RISK,item);
  }

  findItemRisk(item: ItemEntity): Observable<StepRiskSetting[]> {
    return this.httpClient.post<StepRiskSetting[]>(AcmURLConstants.FIND_INSTANCE_RISK,item);
  }


  saveStepSettingRisk(listItemWfRisk: StepRiskSetting[]): Observable<StepRiskSetting[]> {
    return this.httpClient.post<StepRiskSetting[]>(AcmURLConstants.SAVE_STEP_RISK,listItemWfRisk);
  }

  saveInstanceSettingRisk(listItemWfRisk: StepRiskSetting[]): Observable<StepRiskSetting[]> {
    return this.httpClient.post<StepRiskSetting[]>(AcmURLConstants.SAVE_INSTANCE_RISK,listItemWfRisk);
  }

  getDocumentTypeByStep(idStep: number , idInstance : number ): Observable<SettingDocumentTypeEntity[]> {
    return this.httpClient.get<SettingDocumentTypeEntity[]>(AcmURLConstants.GET_DOC_STEP+idStep+"/"+idInstance);
  }

  getDocumentTypeByCategory(category: string,elementId : number): Observable<SettingDocumentTypeEntity[]> {
    return this.httpClient.get<SettingDocumentTypeEntity[]>(AcmURLConstants.GET_DOC_CATEGORY+category+"/"+elementId);
  }
  nextStep(item : ItemEntity) :Observable<ItemEntity>{
    return this.httpClient.post<ItemEntity>(AcmURLConstants.NEXT_STEP_ITEM,item);

  }

  rejectItem(item : ItemEntity){

    return this.httpClient.post<ItemEntity>(AcmURLConstants.REJECT_ITEM,item);


  }

  itemReview(item : ItemEntity){

    return this.httpClient.post<ItemEntity>(AcmURLConstants.REVIEW_ITEM,item);


  }


  finItemById(id : number){
    return this.httpClient.get<ItemEntity>(AcmURLConstants.ITEM_BY_ID+id);
  }


  assignItem(itemEntity: ItemEntity): Observable<ItemEntity> {
    return this.httpClient.post<ItemEntity>(AcmURLConstants.ASSIGN_ITEM, itemEntity);
  }


  paymentApiAbacusLoanNotIssued(body: requestPaymentAbacusApiEntity): Observable<boolean> {
    return this.httpClient.post<boolean>(AcmURLConstants.PAYMENT_LOAN_NOT_ISSUED, body);
  }

  getSettingListValues(settingListValuesEntity: SettingListValuesEntity): Observable<SettingListValuesEntity[]> {
    return this.httpClient.post<SettingListValuesEntity[]>(AcmURLConstants.GET_SETTING_LIST_VALUES ,settingListValuesEntity);
  }

  UpdateItemInstances(itemProcess: ItemProcessEntity): Observable<ItemProcessEntity> {

    return this.httpClient.put<ItemProcessEntity>(AcmURLConstants.UPDATE_ITEM_INSTANCE,itemProcess);
  }

  UpdateItem(itemEntity: ItemEntity): Observable<ItemEntity> {

    return this.httpClient.put<ItemEntity>(AcmURLConstants.UPDATE_ITEM,itemEntity);
  }



  findGenericWFByStep(category , stepId): Observable<GnericWorkflowObjectWorkflow[]>{
    return this.httpClient.get<GnericWorkflowObjectWorkflow[]>(AcmURLConstants.GENERIC_WF_BY_STEP+category+"/"+stepId);

  }

  findAMLListSetting(acmAmlListSetting: AcmAmlListSetting) : Observable<AcmAmlListSetting[]> {
    return this.httpClient.post<AcmAmlListSetting[]>(AcmURLConstants.FIND_AML_LIST_SETTING, acmAmlListSetting);
  }

  saveAMLListSetting(acmAmlListSetting: AcmAmlListSetting) : Observable<AcmAmlListSetting[]> {
    return this.httpClient.post<AcmAmlListSetting[]>(AcmURLConstants.SAVE_AML_LIST_SETTING, acmAmlListSetting);
  }

  findDoubtfulTxSetting(acmDoubtfulTransactionSetting : AcmDoubtfulTransactionSetting) : Observable<AcmDoubtfulTransactionSetting[]> {
    return this.httpClient.post<AcmDoubtfulTransactionSetting[]>(AcmURLConstants.FIND_DOUBTFUL_TRANSACTION_SETTING, acmDoubtfulTransactionSetting);
  }

  saveDoubtfulTxSetting(acmDoubtfulTransactionSetting : AcmDoubtfulTransactionSetting) : Observable<AcmDoubtfulTransactionSetting> {
    return this.httpClient.post<AcmDoubtfulTransactionSetting>(AcmURLConstants.SAVE_DOUBTFUL_TRANSACTION_SETTING, acmDoubtfulTransactionSetting);
  }

  disableDoubtfulTxSetting(acmDoubtfulTransactionSetting : AcmDoubtfulTransactionSetting) : Observable<AcmDoubtfulTransactionSetting> {
    return this.httpClient.post<AcmDoubtfulTransactionSetting>(AcmURLConstants.DISABLE_DOUBTFUL_TRANSACTION_SETTING, acmDoubtfulTransactionSetting);
  }

  savingDeposit(paymentAbacusRequestEntity: paymentAbacusRequestEntity, username: string, paymentFrom: string): Observable<boolean> {
    return this.httpClient.post<boolean>(AcmURLConstants.SAVING_DEPOSIT + '?username=' + username + '&paymentFrom=' + paymentFrom,
      paymentAbacusRequestEntity);
  }
  runAML(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.SYNCHRONIZE_AML);
  }
  runDoubtfulLoan(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.SYNCHRONIZE_DOUBTFUL_LOAN);
  }
  findProductFinanceList(listName : String): Observable<AssetTypeListDTO[]> {
    return this.httpClient.get<AssetTypeListDTO[]>(AcmURLConstants.FIND_ASSET_TYPE_LIST + listName);
  }
  findProductFilterList(listName : String): Observable<ProductTypeListDTO[]> {
    return this.httpClient.get<ProductTypeListDTO[]>(AcmURLConstants.FIND_PRODUCT_TYPE_LIST + listName);
  }

  findSettingBlacklistPartyType(settingBalcklistPartyType: SettingBalcklistPartyType): Observable<SettingBalcklistPartyType[]> {
    return this.httpClient.post<SettingBalcklistPartyType[]>(AcmURLConstants.FIND_SETTING_BLACKLIST_PARTY_TYPE, settingBalcklistPartyType);
  }

  saveSettingBlacklistPartyType(settingBalcklistPartyType: SettingBalcklistPartyType): Observable<SettingBalcklistPartyType> {
    return this.httpClient.post<SettingBalcklistPartyType>(AcmURLConstants.SAVE_SETTING_BLACKLIST_PARTY_TYPE, settingBalcklistPartyType);
  }

  findBalanceCustomer(IdExternCustome: any): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.FIND_CUSTOMER_Balance_FROM_ABACUS + IdExternCustome);
  }

  findPortfolio(IdPortfolio: any): Observable<any> {
    return this.httpClient.get<PortfolioEntity>(AcmURLConstants.FIND_PORTFOLIOById + IdPortfolio);
  }

  saveCurrencySetting(currencySetting: AcmCurrencySetting): Observable<AcmCurrencySetting> {
    return this.httpClient.post<AcmCurrencySetting>(AcmURLConstants.SAVE_CURRENCY_SETTING, currencySetting);
  }

  findCurrencySetting(currencySetting: AcmCurrencySetting): Observable<AcmCurrencySetting[]>{
    return this.httpClient.post<AcmCurrencySetting[]>(AcmURLConstants.FIND_CURRENCY_SETTING, currencySetting);
  }

  saveClosedDaysSetting(closedDays: AcmClosedDaysSetting): Observable<AcmClosedDaysSetting>{
    return this.httpClient.post<AcmClosedDaysSetting>(AcmURLConstants.SAVE_CLOSED_DAYS_SETTING, closedDays);
  }

  findClosedDaysSetting(closedDays: AcmClosedDaysSetting): Observable<AcmClosedDaysSetting[]>{
    return this.httpClient.post<AcmClosedDaysSetting[]>(AcmURLConstants.FIND_CLOSED_DAYS_SETTING, closedDays);
  }

  saveHolidaysSetting(holiday: AcmHolidaySetting): Observable<AcmHolidaySetting>{
    return this.httpClient.post<AcmHolidaySetting>(AcmURLConstants.SAVE_HOLIDAY_SETTING, holiday);
  }

  findHolidaysSetting(holiday: AcmHolidaySetting): Observable<AcmHolidaySetting[]>{
    return this.httpClient.post<AcmHolidaySetting[]>(AcmURLConstants.FIND_HOLIDAY_SETTING, holiday);
  }

  saveBranch(branchSetting: AcmBranches) : Observable<AcmBranches> {
    return this.httpClient.post<AcmBranches>(AcmURLConstants.SAVE_BRANCH_SETTING, branchSetting);
  }

  findBranches(branchSetting: AcmBranches) : Observable<AcmBranches[]>{
    return this.httpClient.post<AcmBranches[]>(AcmURLConstants.FIND_BRANCH_SETTING, branchSetting);
  }

  saveFinancialCategory(financialCategory: FinancialCategory): Observable<FinancialCategory>{
    return this.httpClient.post<FinancialCategory>(AcmURLConstants.SAVE_FINANCIAL_CATEGORY, financialCategory);
  }

  findFinancialCategories(financialCategory: FinancialCategory): Observable<FinancialCategory[]>{
    return this.httpClient.post<FinancialCategory[]>(AcmURLConstants.FIND_FINANCIAL_CATEGORY, financialCategory);
  }

  findPaginationFinancialCategory(financialCategoryPagination: AcmFinancialCategoryPagination): Observable<AcmFinancialCategoryPagination>{
    return this.httpClient.post<AcmFinancialCategoryPagination>(AcmURLConstants.FIND_PAGINATION_FINANCIAL_CATEGORY, financialCategoryPagination);
  }

  saveListSetting(settingListEntity: SettingListEntity): Observable<SettingListEntity> {
    return this.httpClient.post<SettingListEntity>(AcmURLConstants.SAVE_SETTING_LIST, settingListEntity);
  }

  findListSetting(settingListEntity: SettingListEntity): Observable<SettingListEntity[]> {
    return this.httpClient.post<SettingListEntity[]>(AcmURLConstants.GET_SETTING_LIST, settingListEntity);
  }

  saveAllListSetting(settingListEntity: SettingListEntity[]): Observable<SettingListEntity[]> {
    return this.httpClient.post<SettingListEntity[]>(AcmURLConstants.SAVE_All_SETTING_LIST, settingListEntity);
  }

}
