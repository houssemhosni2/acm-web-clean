import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DashbordServices } from '../AcmPages/Loan-Application/dashbord/dashbord.services';
import { LoanEntity } from './Entities/loan.entity';
import { LoanPaginationEntity } from './Entities/loan.pagination.entity';
import { SharedService } from './shared.service';
import { AcmDevToolsServices } from './acm-dev-tools.services';
import { CustomerListService } from '../AcmPages/Customer/customer-list/customer-list.service';
import { CustomerPaginationEntity } from './Entities/customer.pagination.entity';
import { CustomerEntity } from './Entities/customer.entity';
import { SettingsService } from '../AcmPages/Settings/settings.service';
import { DataList } from './Entities/data.entity';
import { SettingFieldService } from '../AcmPages/Settings/setting-fields.service';
import { AcmIhmValidatorEntity } from './Entities/acmIhmValidator.entity';
import { AcmConstants } from './acm-constants';
import { SupplierEntity } from './Entities/Supplier.entity';
import { SupplierService } from '../AcmPages/Supplier/supplier.service';
import { SupplierPaginationEntity } from './Entities/Supplier.pagination.entity';
import { forkJoin } from 'rxjs';
import { CustomerManagementService } from '../AcmPages/Customer/customer-management/customer-management.service';
import { UserDefinedFieldsEntity } from './Entities/userDefinedFields.entity';
import { UserDefinedFieldGroupEntity } from './Entities/userDefinedFieldGroup.entity';
import { UserEntity } from './Entities/user.entity';
import { UdfService } from '../AcmPages/Loan-Application/udf/udf.service';
import { CustomerAddressService } from '../AcmPages/Customer/customer-address/customer-address.service';
import { AddressSettingEntity } from './Entities/AddressSetting.entity';
import { VisitReportServices } from '../AcmPages/Loan-Application/field-visit/filed-visit-details/visit-report.services';
import { AuthentificationService } from './authentification/authentification.service';
import { LoanManagementService } from '../AcmPages/Loan-Application/loan-management/loan-management.service';
import { ProductEntity } from './Entities/product.entity';
import { StepEntity } from './Entities/step.entity';
import { UserDefinedFieldsLinksEntity } from './Entities/userDefinedFieldsLinks.entity';
import { GedServiceService } from '../AcmPages/GED/ged-service.service';
import { LoanDocumentEntity } from './Entities/loanDocument.entity';
import { LoanApprovalService } from '../AcmPages/Loan-Application/loan-approval/loan-approval.service';
import { AddressEntity } from './Entities/Address.entity';
import { ScheduleService } from '../AcmPages/Loan-Application/loan-schedule/schedule.service';
import { Observable, of } from 'rxjs';
import { CollectionEntity } from './Entities/acmCollection.entity';
import { CollectionPaginationEntity } from './Entities/collection.pagination.entity';
import { CollectionServices } from '../AcmPages/Collection/collection.services';
import { getCollectionKey } from './utils';
import { CustomerServices } from '../AcmPages/Loan-Application/customer/customer.services';
import { Customer360Services } from '../AcmPages/Customer/customer360/customer360.services';
import { CollectionProcessEntity } from './Entities/CollectionProcess.entity';
import { CustomerLinksRelationshipEntity } from './Entities/CustomerLinksRelationship.entity';
import { GuarantorsDetailsService } from '../AcmPages/Loan-Application/guarantors-step/guarantors-details/guarantors-details.service';
import { CustomerAccount360Service } from '../AcmPages/Customer/customer-account-360/customer-account-360.service';
import { CollectionNoteEntity } from './Entities/CollectionNote.entity';
import { WorkflowStepUdfGroupeEntity } from './Entities/WorkflowStepUdfGroupe.entity';
import { SettingListValuesEntity } from './Entities/settingListValues.entity';
import { TransitionAccountService } from '../AcmPages/Customer/transition-account/transition-account.service';
import { LoanCollateralsServices } from '../AcmPages/Loan-Application/check-collateral/loan-collaterals/loan-collaterals.services';
import { SettingDocumentTypeEntity } from './Entities/settingDocumentType.entity';
import { CustomerContactEntity } from './Entities/CustomerContactEntity';
import { CustomerMessageService } from '../AcmPages/Customer/customer-message/customer-message.service';
import { BlacklistItemPagination } from './Entities/blacklistItemPagination.entity';
import { BlacklistItem } from './Entities/blacklistItem.entity';
import { BlacklistService } from '../AcmPages/Blacklist/blacklist.service';
import { AssetPaginationEntity } from './Entities/AssetPagination.entity';
import { AssetEntity } from './Entities/Asset.entity';
import { ChargeFeeEntity } from './Entities/ChargeFee.entity';
import { ChargeFeeService } from '../AcmPages/Loan-Application/charge-fee-step/charge-fee.service';
import { ConditionalApproveEntity } from './Entities/conditionalApprove.entity';
import { ConditionnalApproveService } from '../AcmPages/Loan-Application/conditional-approve/conditional-approve.service';
import { AcmAmlListSetting } from './Entities/AcmAmlListSetting.entity';
import { ThirdPartyHistoriqueEntity } from './Entities/thirdPartyHistorique.entity';
import { ScreeningStepService } from '../AcmPages/Loan-Application/screening-step/screening-step.service';
import { AcmScoreCheckEntity } from './Entities/AcmScoreCheck.entity';
import { AcmKycCheckEntity } from './Entities/AcmKycCheck.entity';
import { LoanCollateralTypeEntity } from './Entities/CollateralType.entity';
import { CollateralEntity } from './Entities/Collateral.entity';
import { LoanNoteHistory } from './Entities/loan.note.history';
import { CustomerNotesService } from '../AcmPages/Loan-Application/loan-approval/customer-notes/customer-notes.service';
import { CalendarEventsEntity } from './Entities/calendarEvents.entity';
import { CrmService } from '../AcmPages/CRM/crm.service';
import { SettingMotifRejetsEntity } from './Entities/settingMotifRejets.entity';
import { LoanDetailsServices } from '../AcmPages/Loan-Application/loan-details/loan-details.services';
import { CustomerAccountEntity } from './Entities/customer.account.entity';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { AcmBranches } from './Entities/AcmBranches.entity';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  currentUser: UserEntity;

  constructor(private dashbordService: DashbordServices, public udfService: UdfService,public screeningStepService: ScreeningStepService,private http: HttpClient,
    public customerListService: CustomerListService, public settingsService: SettingsService, public customerNotesService: CustomerNotesService,public translate: TranslateService,
    private loanSharedService: SharedService, private devToolsServices: AcmDevToolsServices,public customerMessageService: CustomerMessageService,public loanDetailsServices: LoanDetailsServices,
    public settingFieldService: SettingFieldService, private dbService: NgxIndexedDBService,public loanCollateralsServices: LoanCollateralsServices,public chargeFeeService: ChargeFeeService,
    private supplierService: SupplierService, private sharedService: SharedService,public customer360Services :Customer360Services, public conditionnalApproveService : ConditionnalApproveService,
    private customerManagementService: CustomerManagementService, private customerAddressService: CustomerAddressService,public blacklistService: BlacklistService, public router: Router,
    private visitReportServices: VisitReportServices, private authService: AuthentificationService,public customerAccountService: CustomerAccount360Service,public crmService: CrmService,
    private loanManagementService: LoanManagementService, public gedService: GedServiceService,private customerServices: CustomerServices,public transitionAccountService: TransitionAccountService,
    public loanApprovalService: LoanApprovalService, private scheduleService: ScheduleService,public guarantorsDetailsService: GuarantorsDetailsService,private collectionService: CollectionServices) {
    this.saveUser();
    this.currentUser = this.getUser();
  }


  goOffline(): Observable<number> {
    return new Observable<number>((observer) => {

      const acmEnvironmentKeys: string[] = [AcmConstants.MEMBERS_NUMBER_MAX, AcmConstants.MEMBERS_NUMBER_MIN,
        AcmConstants.DIFFERENCE_PERIOD_OF_EXPIRY_DATE_AND_ISSUE_DATE];

        const userDefinedFieldsEntity: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
        const userDefinedFieldGroupDTO: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
        userDefinedFieldGroupDTO.code = AcmConstants.CUSTOMER_NATIONALITY_CODE;
        userDefinedFieldsEntity.userDefinedFieldGroupDTO = userDefinedFieldGroupDTO;

        const groupNationality: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
        groupNationality.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
        groupNationality.userDefinedFieldGroupDTO.code = AcmConstants.BANK_INFORMATION_CODE;

        const udfGroupCustomer: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
        udfGroupCustomer.customerId = 1;
        udfGroupCustomer.customerTypeLabel = AcmConstants.CUSTOMER_TYPE_INDIVIDUAL;

        
      let udfGroupParam = new UserDefinedFieldGroupEntity();
      udfGroupParam.category = AcmConstants.PROSPECT_CATEGORY;

      
      let udfGroupParam2 = new UserDefinedFieldGroupEntity();
      udfGroupParam2.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;

      
      let udfGroupParam3 = new UserDefinedFieldGroupEntity();
      udfGroupParam3.category = AcmConstants.LOAN_PRODUCTS_CATEGORY;

      
      let udfGroupParam4 = new UserDefinedFieldGroupEntity();
      udfGroupParam4.category = AcmConstants.COLLATERAL_CATEGORY;

      const subfunctions = [
        this.getCustomersList(),this.loadLoansByPaginations(),this.getBranches(),this.getIhmValidators(),
        this.getEnvirementValueByKeys([AcmConstants.ASSIGN_CUSTOMER, AcmConstants.INTERNET_BANKING, AcmConstants.MAX_SIZE_FILE_UPLOAD, AcmConstants.SAVING_ACCOUNT_AUTOMATIC, AcmConstants.DISBURSMENT_CARD, AcmConstants.PRODUCT_FILTER_KEY, AcmConstants.KEY_LICENCE, AcmConstants.REVIEW_ALL_STEPS_WHEN_DRAFT_SELECTED, AcmConstants.APR_KEY, AcmConstants.GUARANTOR_BRANCH_FILTER, AcmConstants.MAXIMUM_BALANCE_BY_CUSTOMER]),
        this.getSupplierPagination(),this.getAssetsPagination(),this.getUdfField(userDefinedFieldsEntity, '-customer'),this.findRole(),this.findRelationship(),this.findSector(),
        this.getEnvirementValueByKeys(acmEnvironmentKeys, '-customer'),this.getUdfField(groupNationality, '-bank-info'),this.getUdfField(udfGroupCustomer, '-indiv'),this.findAllPortfolio(this.currentUser.branchID),
        this.findAllPortfolio(0),this.addressesList(),this.addressType(),this.saveHabilitation(),this.getUsersVisit(),
        this.getEnvirementValueByKey(AcmConstants.CUSTOMER_GUARANTOR, 'customer_guarantor'),
        this.getEnvirementValueByKey(AcmConstants.MAX_CUSTOMER_ACCOUNTS, 'max_customer_accounts'),
        this.getEnvirementValueByKey(AcmConstants.INTERNET_BANKING, 'internet-banking'),
        this.getProductLoanReason(),this.getProducts(),this.findProductFinanceList(),this.findProductFilterList(),this.findAllProduct(),
        this.getEnvirementValueByKeys([AcmConstants.ADMIN_FEE, AcmConstants.RENEWEL_LOAN_CONDITION, AcmConstants.DEFERRED_PERIODE_TYPES], '-upload'),
        this.getLoanSourceOfFunds(),this.updateCriticalDataAllowedGroups(),this.checkIfUserIsAuthorized(),this.getGoogleMaps(),
        this.habilitationIhmFields(AcmConstants.FORM_ADD_CUSTOMER_INDIV, 1),this.getCollectionsPagination(),this.getSettingListValue(AcmConstants.PROSPECTION_LIST),this.getUdfGroupByCategory(udfGroupParam),
        this.getUdfGroupByCategory(udfGroupParam2),this.getUdfGroupByCategory(udfGroupParam3),this.getUdfGroupByCategory(udfGroupParam4),
        this.findCustomerSettings(),this.findAmlListSettings(),this.findCollateralTypes(),this.findUsers(),this.getTranslation(),this.getSettingMotifReject(AcmConstants.RECOMMEND_CATEGORIE),
        this.getSettingMotifReject(AcmConstants.REVIEW_CATEGORIE),this.getSettingMotifReject(AcmConstants.REJECT_CATEGORIE),this.getSettingMotifReject(AcmConstants.DECLINE_CATEGORIE),
      ];
      
      let completedSubfunctions = 0;
      const totalSubfunctions = subfunctions.length;
      // console.log('total sub fn :',totalSubfunctions);

      subfunctions.forEach((subfunction) => {
        subfunction
          .then(() => {
            completedSubfunctions++;            
            observer.next((completedSubfunctions / totalSubfunctions) * 100);
          })
          .catch((err) => console.error('Error in subfunction:', err));
      });

      Promise.all(subfunctions)
      .then(() => {
        this.devToolsServices.openToast(0, 'success.All_your_data_loaded');
        this.loanSharedService.loadDataOffline = false;
        observer.complete();
        this.router.navigate([AcmConstants.DASHBOARD_URL]);
      })
      .catch((err) => {
        console.error('Error completing all subfunctions:', err);
        observer.error(err);
      });
     
    });
  }

  private async saveDataListToDb(id: string, data: any) {
    const dataList: DataList = { id, data };
    await this.dbService.update('data', dataList).toPromise();
  }

  async loadLoansByPaginations(pageSize: number = 10) {
    if(this.sharedService.getLoanPaginationOffline()){
      
      if(this.sharedService.getLoanPaginationOffline().resultsLoans?.length > 0){
        try {
          this.devToolsServices.openToast(0, 'loading loans list : 1/1');

        this.getLoansData(this.sharedService.getLoanPaginationOffline());
        this.sharedService.getLoanPaginationOffline().id = "loans-pagination-status-0";
        
        await this.dbService.update('loans-pagination', this.sharedService.getLoanPaginationOffline()).toPromise();
        } catch (err) {
          console.error('Error loading loans:', err);
        }
      } else {
    let loanPaginationEntityParms: LoanPaginationEntity = new LoanPaginationEntity();
    loanPaginationEntityParms = this.sharedService.getLoanPaginationOffline();
    const statuses = 2; // from 0 to 8 => 9 status
    for (let i = 0; i <= statuses; i++) {
      const searchLoan = new LoanEntity();
      searchLoan.statut = String(i);
      searchLoan.parentId = 0;

      // loanPaginationEntityParms.params = searchLoan;
      // loanPaginationEntityParms.pageSize = pageSize;
      // loanPaginationEntityParms.pageNumber = 0;

      loanPaginationEntityParms.params.statut = String(i); 

      let loans = await this.dbService.getAll('loans').toPromise() as LoanEntity[];

      try {
        this.devToolsServices.openToast(0, 'loading loans list : ' + (i + 1).toString(10) + "/" + (statuses + 1).toString(10));

        const data = await this.dashbordService.loadDashboardByStatusPagination(loanPaginationEntityParms).toPromise();

        if (loanPaginationEntityParms.params.branchName === undefined) loanPaginationEntityParms.params.branchName = null;

        data.id = "loans-pagination-status-" + searchLoan.statut;

        // if (i === 0) {
          this.getLoansData(data);
        // }

        if (loans.length > 0 && i === 0) {
          data.resultsLoans.unshift(...loans);
        }        

        await this.dbService.update('loans-pagination', data).toPromise();

      } catch (err) {
        console.error('Error loading loans:', err);
      }
    }
  }
  }
}

  async getLoansData(data){
    for(let j=0; j < data.resultsLoans.length ; j++){
      const loan = data.resultsLoans[j];
      await this.getUdfLinkGroupby(loan.customerDTO);
      await this.getUdfLinkGroupby(loan, 1);
      await this.getRequiredDocument(loan);
      await this.getDocumentsByLoan(loan);
      await this.getCustomerInformation(loan.customerDTO.id);
      await this.getCustomerAddress(loan.customerDTO.id);
      await this.loanSchedules(loan);
      await this.getChargesFee(loan);
      await this.findWorkflowSteps(loan);
      await this.findConditionnalApprove(loan);
      await this.getUdfStepWorkflow(loan,AcmConstants.LOAN_CATEGORY);
      await this.getThirdPartyHistoriqueForCustomerAndGuarantor(loan,loan.customerDTO);
      await this.findCollateral(loan);
      await this.getNotes(loan);
      await this.getTasks(loan,AcmConstants.LOAN_CATEGORY);
      // await this.getSchedules(loan);
      await this.getLoanDetailsFromAbacus(loan);
      await this.getFeeRepayment(loan);
      await this.getRenewalConditionSetting(loan.customerDTO);
    }
  }

  async getCollectionsPagination(pageSize: number = 10) {
    const specificCases = [
      { status: 0, statutWorkflow: "amicably", collectionType: 'COLLECTION' },
      { status: 0, statutWorkflow: "pre-litigation", collectionType: 'COLLECTION' },
      { status: 2, statutWorkflow: "review", collectionType: 'COLLECTION' },
      { status: -1, statutWorkflow: null, collectionType: 'COLLECTION' },
      { status: 1, statutWorkflow: null, collectionType: 'COLLECTION' },
      { status: 0, statutWorkflow: null, collectionType: 'LEGAL' }, 
      { status: 2, statutWorkflow: null, collectionType: 'LEGAL' }, 
      { status: 1, statutWorkflow: null, collectionType: 'LEGAL' }  
    ];
    

    for (let caseConfig of specificCases) {
          const collectionEntity = new CollectionEntity();
          collectionEntity.status = caseConfig.status;
          collectionEntity.statutWorkflow = caseConfig.statutWorkflow;
          collectionEntity.collectionType = caseConfig.collectionType;
  
          // const collectionPaginationEntityParms: CollectionPaginationEntity = new CollectionPaginationEntity();
          // collectionPaginationEntityParms.params = collectionEntity;
          // collectionPaginationEntityParms.pageSize = pageSize;
          // collectionPaginationEntityParms.pageNumber = 0;
          let cachedPagination: CollectionPaginationEntity = null;
          if (caseConfig.collectionType === 'COLLECTION') {
            cachedPagination = this.sharedService.getCollectionPaginationOffline();
        } else if (caseConfig.collectionType === 'LEGAL') {
            cachedPagination = this.sharedService.getLegalPaginationOffline();
        }

        if(cachedPagination){          
          let data : CollectionPaginationEntity;
          if(cachedPagination.resultsCollections?.length > 0){
            data = {...cachedPagination}
            data.resultsCollections = data.resultsCollections.filter(
              collection => 
                  collection.status === caseConfig.status && 
                  collection.statutWorkflow === caseConfig.statutWorkflow
          );
          data.totalElements = data.resultsCollections.length;          
          } else {
            cachedPagination.params.status = caseConfig.status;
            cachedPagination.params.statutWorkflow = caseConfig.statutWorkflow;
            data = await this.collectionService.loadDashboardByStatusPagination(cachedPagination).toPromise();
          }

          const id = 'collections-pagination-' + getCollectionKey(collectionEntity);
          data.id = id;

            for(let i = 0 ; i< data.resultsCollections.length ; i++){
              const collection = data.resultsCollections[i];
              await this.getCustomerInformationByIdExtern(collection.customerIdExtern);
              await this.getLoanByIdExtern(collection.idLoanExtern);
              await this.getDocumentsByCollectionStep(collection);
              await this.getTasks(collection,AcmConstants.COLLECTION_CATEGORY);
              await this.getCollectionNote(collection);
              await this.getCollectionStep(collection,collectionEntity.collectionType);
              await this.getUdfStepWorkflow(collection,AcmConstants.COLLECTION_CATEGORY);
            }
  
            this.dbService.update('collections-pagination', data).subscribe(() => {
              this.devToolsServices.openToast(0, 'collection list saved');
            });
        } 
      }
  }

  async getCustomersList(pageSize: number = 20) {
    if(this.sharedService.getCustomersPaginationOffline()){
    let customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();
    // customerPaginationEntity.params = new CustomerEntity();
    // customerPaginationEntity.pageSize = pageSize;
    customerPaginationEntity = this.sharedService.getCustomersPaginationOffline();
    this.devToolsServices.openToast(0, 'Start loading Customers list done ');
    let data : CustomerPaginationEntity;
    if(customerPaginationEntity.resultsCustomers?.length > 0){
      data = customerPaginationEntity;
    } else {
     data = await this.customerListService.getCustomersPagination(customerPaginationEntity).toPromise();
    }
    if (customerPaginationEntity?.params.customerType === undefined) customerPaginationEntity.params.customerType = null;

        for(let i = 0 ; i < data.resultsCustomers.length ; i++){
          const customer = data.resultsCustomers[i];
          await this.getCustomerInformation(customer.id);
          await this.getCustomerAddress(customer.id);
          await this.getUdfLinkGroupby(customer,null);
          await this.getLinkRelationship(customer,AcmConstants.MEMBERS);
          await this.getLinkRelationship(customer,AcmConstants.CUSTOMER_TYPE_RELATION);
          const loans = await this.getLoansByCustomerId(customer.id);
          await this.getLoansUDF(customer);
          await this.getCustomerAccount(customer);
          await this.getGuarantorsInformation(customer,loans);
          await this.getCustomerDocuments(customer);
          await this.getCustomerContact(customer);
          await this.getCollectionHistory(customer);
          if(customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL){
            await this.findBlacklistItems(customer);
          }
          await this.getCustomerBalance(customer.customerIdExtern)
        }

        data.id = 'customers-list';
        this.dbService
          .update('customers-pagination', data)
          .subscribe(
            () => {
              this.devToolsServices.openToast(0, 'Customers list saved ');
            }
          );
  }
}

  async getGoogleMaps() {
    const data = await this.customerManagementService.getEnvirementValueByKey('GOOGLE_MAPS_KEY').toPromise();
    await this.saveDataListToDb('google-maps-keys', data);
  }

  async getBranches() {
    const data = await this.settingsService.findBranches(new AcmBranches()).toPromise();
    await this.saveDataListToDb('branches-list', data);
  }

  async getIhmValidators() {
    const data = await this.settingFieldService.getIhmValidators(new AcmIhmValidatorEntity()).toPromise();
    await this.saveDataListToDb('ihm-validators', data);
  }

  async getEnvirementValueByKeys(environnements: string[], suffix = '') {
    const data = await this.settingsService.getEnvirementValueByKeys(environnements).toPromise();
    await this.saveDataListToDb('envirement-values-by-keys' + suffix, data);
  }

  async getSettingListValue(listName :string) {
    let settingListValuesEntity: SettingListValuesEntity = new SettingListValuesEntity();
    settingListValuesEntity.listName = listName;
    const data = await this.settingsService.getSettingListValues(settingListValuesEntity).toPromise();
    await this.saveDataListToDb('settingListValue_' + listName, data);
  }

  async getSupplierPagination(pageSize: number = 20) {
    let supplierPaginationEntity: SupplierPaginationEntity = new SupplierPaginationEntity();
    supplierPaginationEntity.params = new SupplierEntity();
    supplierPaginationEntity.pageSize = pageSize;
    const data = await this.supplierService.getSupplierPagination(supplierPaginationEntity).toPromise();
    await this.saveDataListToDb('supplier-pagination', data);
  }

  async getAssetsPagination(pageSize: number =10) {

    let assetPaginationEntity = new AssetPaginationEntity();
    assetPaginationEntity.params = new AssetEntity();

    assetPaginationEntity.params.supplier = new SupplierEntity();
    assetPaginationEntity.pageSize = pageSize;
    const data = await this.supplierService.getAssetsPagination(assetPaginationEntity).toPromise();
    await this.saveDataListToDb('asset-pagination', data);
  }

  async habilitationIhmFields(form, mode = 1) {
    const data = await this.sharedService.habilitationIhmFields(form, mode);
    await this.saveDataListToDb(AcmConstants.FORM_ADD_CUSTOMER_INDIV, data);
  }

  async getUdfField(userDefinedFieldsEntity, suffix = '') {
    const data = await this.udfService.getUdfField(userDefinedFieldsEntity).toPromise();
    await this.saveDataListToDb('udf-fields' + suffix, data);
  }

  async findRole() {
    const data = await this.customerManagementService.findRole().toPromise();
    await this.saveDataListToDb('find-role', data);
  }

  async findRelationship() {
    const data = await this.customerManagementService.findRelationship().toPromise();
    await this.saveDataListToDb('find-relationship', data);
  }

  async findSector() {
    const data = await this.customerManagementService.findSector().toPromise();
    await this.saveDataListToDb('find-sector', data);
  }

  async findAllPortfolio(branchID) {
    // find portfolio of connected user
    const userEntity: UserEntity = new UserEntity();
    if (branchID != 0)
      userEntity.branchID = branchID;

    const data = await this.customerManagementService.findAllPortfolio(userEntity).toPromise();
    await this.saveDataListToDb('find-all-portfolio-' + branchID, data);
  }


  async addressesList() {
    const addressListEntity = await this.customerAddressService.getAddressList([]).toPromise();
    await this.saveDataListToDb('address-list', addressListEntity);

    addressListEntity.forEach(async (list) => {
  
        const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
        addressSettingEntity.addressListId = list.addressListID;

        const addressListValuePromise = await this.customerAddressService.getAddressListValue(addressSettingEntity).toPromise();
        await this.saveDataListToDb('address-list-value-' + addressSettingEntity.addressListId, addressListValuePromise);

      });
  }

  async addressType() {
    const data = await this.customerAddressService.getAddressType().toPromise();
    await this.saveDataListToDb('address-type', data);
  }

  async saveHabilitation() {
    const habilitations = this.loanSharedService.getHabilitationEntitys();
    sessionStorage.setItem('habilitations', JSON.stringify(habilitations));
  }

  async saveUser() {
    const currentUser = this.loanSharedService.getUser();
    if (currentUser)
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    else
      this.devToolsServices.openToast(1, 'No user found');

  }

  async checkIfUserIsAuthorized() {
    const data = await this.authService.checkIfGroupOfConnectedUserIsAuthorized(AcmConstants.AUTHORIZED_GROUPS).toPromise()
    sessionStorage.setItem('check-if-user-authorized', JSON.stringify(data));
  }

  async updateCriticalDataAllowedGroups() {
    const data = await this.authService.checkIfGroupOfConnectedUserIsAuthorized(AcmConstants.UPDATE_CRITICAL_DATA_ALLOWED_GROUPES).toPromise()
    sessionStorage.setItem('update-critical-data-allowed-groups', JSON.stringify(data));
  }

  getUser() {
    // if (checkOfflineMode()) {
    //   localStorage.setItem('currentUser', 'token');
    // }
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }

  async getUsersVisit() {
    const data = await this.visitReportServices.getUsersVisit().toPromise();
    await this.saveDataListToDb('get-users_visit', data);
  }

  async getEnvirementValueByKey(param, key) {
    const data = await this.customerManagementService.getEnvirementValueByKey(param).toPromise();
    await this.saveDataListToDb(key, data);
  }

  async getProductLoanReason() {
    const data = await this.loanManagementService.getProductLoanReason().toPromise();
    await this.saveDataListToDb('product_loan_reason', data);
  }

  async getLoanSourceOfFunds() {
    const data = await this.loanManagementService.getLoanSourceOfFunds().toPromise();
    await this.saveDataListToDb('loan_source_of_funds', data);
  }

  async getProducts() {
    const productEntity = new ProductEntity();
    productEntity.productIndiv = true;
    productEntity.productGrp = false;
    productEntity.productOrg = false;

    const data = await this.loanManagementService.getProducts(productEntity).toPromise();
    await this.saveDataListToDb('get_products', data);

    data.forEach(async product => {
      const StepParam: StepEntity = new StepEntity();
      StepParam.productId = product.id;
      StepParam.enabled = true;
      StepParam.process = AcmConstants.NEW_LOAN_APPLICATION;
      await this.getUdfGroup(product.id);
      const workFlowSteps = await this.settingsService.findWorkFlowSteps(StepParam).toPromise();
      await this.saveDataListToDb('workflow_steps_' + product.id, workFlowSteps);
    })

  }

  async getUdfLinkGroupby(data: any, isLoean = 0) {
    const userDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
    let key;
    if (isLoean) {
      userDefinedFieldsLinksEntity.category = AcmConstants.LOAN_CATEGORY;
      userDefinedFieldsLinksEntity.elementId =  data.loanId;
      userDefinedFieldsLinksEntity.productId = data.productId;
      key = 'getUdfLinkGroupbyLoan_' + data.loanId;
    } else {
      userDefinedFieldsLinksEntity.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
      userDefinedFieldsLinksEntity.elementId = data.id;
      userDefinedFieldsLinksEntity.cutomerType = data.customerType;
      key = 'getUdfLinkGroupby_' + data.id;
    }
    const cachedData = await this.dbService.getByKey('data',key).toPromise();
    if(cachedData === undefined){
    const udfLinkGroup = await this.udfService.getUdfLinkGroupby(userDefinedFieldsLinksEntity).toPromise();

    await this.saveDataListToDb(key, udfLinkGroup);
    }
  }

  async getRequiredDocument(loan) {
    const instances = loan.loanInstancesDtos;

    for (let i =0 ; i< instances.length ; i++){
      const cachedData = await this.dbService.getByKey('data','getRequiredDocumentByStep_' + instances[i].code).toPromise();
      if(cachedData === undefined){
      let loanDTO: LoanEntity = new LoanEntity();
      loanDTO.productId = loan.productId;
      loanDTO.statutWorkflow = instances[i].code;
      loanDTO.etapeWorkflow = instances[i].code;

      const requiredDocument = await this.gedService.getRequiredDocument(loanDTO).toPromise();
      await this.saveDataListToDb('getRequiredDocumentByStep_' + instances[i].code, requiredDocument);
    }
  }
  }

  async getDocumentsByLoan(loan: LoanEntity) {
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.loanId = loan.loanId;

    const documents = await this.gedService.getDocumentsByLoan(document).toPromise();

    await this.saveDataListToDb('getDocumentsByLoan_' + loan.loanId, documents);
  }

  async getCustomerInformation(selectedCustomerId) {
    const cachedData = await this.dbService.getByKey('data', 'getCustomerInformation_' + selectedCustomerId).toPromise();
    if(cachedData == undefined){
    const customer = await this.customerManagementService.getCustomerInformation(selectedCustomerId).toPromise();

    await this.saveDataListToDb('getCustomerInformation_' + selectedCustomerId, customer);
  }
}

  async getCustomerAddress(selectedCustomerId) {
    // mode Edit Get Customer Address
    const customerAddress = new AddressEntity();
    customerAddress.customerId = selectedCustomerId;
    const documents = await this.customerAddressService.getCustomerAddress(customerAddress).toPromise();

    await this.saveDataListToDb('getCustomerAddress_' + selectedCustomerId, documents);
  }

  async getUdfGroup(productId) {
    let udfGroupLoan = new UserDefinedFieldGroupEntity();
    udfGroupLoan.loanId = 1;
    udfGroupLoan.productId = productId;
    const documents = await this.udfService.getUdfGroup(udfGroupLoan).toPromise();

    await this.saveDataListToDb('getUdfGroup_' + productId, documents);
  }

  async loanSchedules(loan: LoanEntity) {
    const schedules = await this.scheduleService.loanSchedules(loan).toPromise();
    if(schedules.length > 0){
    await this.saveDataListToDb('loanSchedules_' + loan.loanId, schedules);
    }
  }

  async getChargesFee(loan){
    const loanInstances = loan.loanInstancesDtos;
    for(let i = 0 ; i < loanInstances.length ; i++){
      const chargeFeeParam = new ChargeFeeEntity();
      chargeFeeParam.idLoanInstance = loanInstances[i].id;
      chargeFeeParam.charged = false;
      const data = await this.chargeFeeService.find(chargeFeeParam).toPromise();
      if(data.length > 0 ){
       await this.saveDataListToDb('getChargesFeeByLoanInstance_' + loanInstances[i].id , data);
      }
    }
  }

  async findWorkflowSteps(loan){
    const loanInstances = loan.loanInstancesDtos;
    for(let i = 0 ; i < loanInstances.length ; i++){
      const cachedData = await this.dbService.getByKey('data', 'getStepById_' + loanInstances[i].code).toPromise();
      if(cachedData === undefined){
      const step = new StepEntity();
      step.idWorkFlowStep = loanInstances[i].code;
      const res = await this.settingsService.findWorkFlowSteps(step).toPromise();
      await this.saveDataListToDb('getStepById_' + loanInstances[i].code , res);
    }
  }
  }

  async findConditionnalApprove(loan){
    const conditionalApproveEntity = new ConditionalApproveEntity();
    conditionalApproveEntity.loan = loan;

    const res = await this.conditionnalApproveService.find(conditionalApproveEntity).toPromise();
    if(res.length > 0){
    await this.saveDataListToDb('getConditionnalApproveByLoanId_' + loan.loanId , res);
  }
}

async getThirdPartyHistoriqueForCustomerAndGuarantor(loan , customer){
  await this.getThirdPartyHistoriqueByCategory(loan,customer,AcmConstants.CUSTOMER_CATEGORY_CUSTOMER);

  const customerLinks = await this.getLinkRelationship(loan,AcmConstants.LOAN_CATEGORY);
  
  if(customerLinks.length > 0){
    // customerLinks.forEach(async (guarantor) => {
      for (let i = 0 ; i < customerLinks.length ; i++ ){
      const guarantor = customerLinks[i];
      await this.getThirdPartyHistoriqueByCategory(loan,guarantor.member,AcmConstants.RELATION_GUARANTOR);
      }
    // })
  }
}

async getThirdPartyHistoriqueByCategory(loan: LoanEntity,customer: CustomerEntity,customerCategory: string){
  const key1 = 'getThirdPartyHistoriques_' + customerCategory + '_' + customer.id;
  const cachedData1 = await this.dbService.getByKey('data', key1).toPromise();
  if(cachedData1 === undefined){
  customer.existISCORE = false;
    customer.existaml = false;
    customer.existkyc = false;
    customer.existSCORE = false;
    const thirdPartyHistorique = new ThirdPartyHistoriqueEntity();
    if (customerCategory === AcmConstants.CUSTOMER_CATEGORY_CUSTOMER) {
      thirdPartyHistorique.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
      thirdPartyHistorique.identityCustomer = customer.identity;
    } else if (customerCategory === AcmConstants.RELATION_GUARANTOR) {
      thirdPartyHistorique.category = AcmConstants.RELATION_GUARANTOR;
      thirdPartyHistorique.identityCustomerGuarantor = customer.identity;
    }
    const thirdPartyHistoriques = await this.screeningStepService.thirdPartyHistoriqueScreening(thirdPartyHistorique).toPromise();

    if(thirdPartyHistoriques.length > 0){
      await this.saveDataListToDb( key1 ,thirdPartyHistoriques);
    }
  }

    //
    const key2 = 'getKycCheck_' + customerCategory + '_' + customer.id;
    const cachedData2 = await this.dbService.getByKey('data', key2).toPromise();
    if(cachedData2 === undefined){
    const acmKycCheckEntity = new AcmKycCheckEntity();
    acmKycCheckEntity.customerId = customer.id;
    acmKycCheckEntity.loandId = loan.loanId;
    acmKycCheckEntity.customerCategory = customerCategory;
     const kyc = await this.screeningStepService.findKycCheck(acmKycCheckEntity).toPromise();
     if(kyc !== null){
      await this.saveDataListToDb(key2,kyc);
     }
    }

    const key3 = 'getScoreCheck_' + customerCategory + '_' + customer.id;
    const cachedData3 = await this.dbService.getByKey('data', key3).toPromise();
    if(cachedData3 === undefined){
      const acmScoreCheckEntity = new AcmScoreCheckEntity();
      acmScoreCheckEntity.customerId = customer.id;
      acmScoreCheckEntity.loandId = loan.loanId;
      acmScoreCheckEntity.customerCategory = customerCategory;
      const scoreCheck = await this.screeningStepService.findScoreCheck(acmScoreCheckEntity).toPromise();
     if(scoreCheck !== null){
      await this.saveDataListToDb(key3, scoreCheck);
     }
    }
}
 async getCustomerInformationByIdExtern(idExtern){
    const customer = await this.customerServices.getCustomerInformationByIdExtrn(idExtern).toPromise();
    await this.getCustomerAccount(customer[0]);
    await this.saveDataListToDb('getCustomerInformationByIdExtern_' + idExtern, customer);
  }

  async getCustomerAccount(customer){
    if(customer.customerIdExtern !== 0){
    const customerAccounts = await this.customerAccountService.getCustomersAccount(customer.customerIdExtern).toPromise();
    if(customerAccounts.length > 0){
      await this.saveDataListToDb('getCustomerAccountsById_' + customer.id , customerAccounts);
    }
    const transactionAccount = await this.transitionAccountService.getTransitionsAccount(customer.customerIdExtern).toPromise();
    if(transactionAccount.length > 0){
      await this.saveDataListToDb('getTransactionAccounts_' + customer.id, transactionAccount);
    }
    const customerReceipts = await this.transitionAccountService.getCustomerReceipts(customer.customerIdExtern).toPromise();
    if(customerReceipts.length > 0){
      await this.saveDataListToDb('getCustomerReceipts_' + customer.id, customerReceipts);
    }
  }
  }

  async getGuarantorsInformation(customer,loans){
    //guarantees
    const customerLinksRelationshipEntity: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
    customerLinksRelationshipEntity.member = new CustomerEntity();
    customerLinksRelationshipEntity.member.id = customer.id;
    customerLinksRelationshipEntity.category = AcmConstants.RELATION_GUARANTOR;
  
    const guarantees = await  this.customerManagementService.getGuarantees(customerLinksRelationshipEntity).toPromise();
    if(guarantees.length > 0){
      await this.saveDataListToDb('getGuarantees_' + customer.id, guarantees);
    }

    //loan guarantors
    const customerLinksRelationship: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
    customerLinksRelationship.customerId = customer.id;
    const loanGuarantors = await this.customerManagementService.getAllLoanGuarantors(customerLinksRelationship).toPromise();
    if(loanGuarantors.length > 0){
      await this.saveDataListToDb('getLoanGuarantors_' + customer.id, loanGuarantors);
    }

    //loan collateral
    const idLoanList: number[] = [];
    for (let i = 0; i < loans.length; i++) {
      idLoanList.push(loans[i].loanId);
    }
    const loanCollateral = await this.loanCollateralsServices.getActiveAndInactiveCollateralsFromACM(idLoanList).toPromise();
    if(loanCollateral.length > 0){
      await this.saveDataListToDb('getLoanCollateral_' + customer.id, loanCollateral);
    }
  }

  async getCustomerDocuments(customer){
    let documents = [];
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.idCustomer = customer.id;
    document.processLoanDocuments = true;
    const res = await this.gedService.getDocumentsByLoan(document).toPromise();
    res.forEach(element=>{
      if (element.settingDocumentTypeDTO.categorie ===  AcmConstants.TYPE_DOCUMENT_CATEGORIE_CUSTOMER) {
        documents.push(element);
      }
    })
    if(documents.length > 0){
      await this.saveDataListToDb('getCustomerDocument_'+customer.id,documents);
    }

    const loanDocument: LoanDocumentEntity = new LoanDocumentEntity();
    loanDocument.idCustomer = customer.id;
    const settingDocumentTypeDTO: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentTypeDTO.categorie = AcmConstants.TYPE_DOCUMENT_CATEGORIE_LOAN;
    loanDocument.settingDocumentTypeDTO = settingDocumentTypeDTO;
    const loanDocuments = await this.gedService.getDocumentsByCustomer(loanDocument).toPromise();
    if(loanDocuments.length > 0){
      await this.saveDataListToDb('getLoanDocumentsByCustomer_' + customer.id , loanDocuments);
    }
  }

  async getCustomerContact(customer){
    const contact = new CustomerContactEntity();
    contact.customerId = customer.id;
    contact.linkReplay = 0;
    const contacts = await this.customerMessageService.findCustomerContactList(contact).toPromise();
    if(contacts.length > 0){
      await this.saveDataListToDb('getCustomerContacts_' + customer.id , contacts);
    }
  }

  async getCollectionHistory(customer){
    const collectionParam = new CollectionEntity();
    collectionParam.customerIdExtern = customer.customerIdExtern;
    collectionParam.collectionType = AcmConstants.Collection + "," + AcmConstants.LEGAL
    const collections = await this.collectionService.getCollection(collectionParam).toPromise();
    if(collections.length > 0){
      await this.saveDataListToDb('getCustomerCollections_' + customer.id , collections);
    }
  }

  async getLoanByIdExtern(idExtern){
    const loan = await this.customer360Services.findLoanByIdExtern(idExtern).toPromise();
    await this.getLinkRelationship(loan,AcmConstants.LOAN_CATEGORY);
    const loanList = [loan];
    await this.saveDataListToDb('getLoanByIdExtern_' + idExtern, loanList);
  }

  async getLinkRelationship(element,category){
    let key;
    const customerLinksRelationshipEntity: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
    if(category === AcmConstants.LOAN_CATEGORY){
      customerLinksRelationshipEntity.idLoan = element.loanId;
      customerLinksRelationshipEntity.category = AcmConstants.RELATION_GUARANTOR;
      customerLinksRelationshipEntity.statutLoan = element.statutWorkflow;
      key = 'getLoanGuarantorByLoanId_' + element.loanId;
    } else if(category === AcmConstants.MEMBERS) {
      customerLinksRelationshipEntity.category = AcmConstants.MEMBERS;
      customerLinksRelationshipEntity.customerId = element.id;
      key = 'getMemberLinkByCustomerId_' + element.id;
    } else {
      customerLinksRelationshipEntity.category = AcmConstants.CUSTOMER_TYPE_RELATION;
      customerLinksRelationshipEntity.customerId = element.id;
      key = 'getRelationshipLinkByCustomerId_' + element.id;
    }
        const cachedData = await this.dbService.getByKey('data',key).toPromise() as any;
        if(cachedData === undefined){
        const data = await this.guarantorsDetailsService.findCustomerLinkRelationShip(customerLinksRelationshipEntity).toPromise();
        if(data.length > 0){
        // data.forEach(async(link)=>{
          for(let i = 0 ; i < data.length ; i++){
            const link = data[i];
          const userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
          userDefinedFieldsLinksEntity.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
          userDefinedFieldsLinksEntity.elementId = link.member.id;
          userDefinedFieldsLinksEntity.userDefinedFieldsDTO = new UserDefinedFieldsEntity();
          userDefinedFieldsLinksEntity.userDefinedFieldsDTO.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
          userDefinedFieldsLinksEntity.userDefinedFieldsDTO.userDefinedFieldGroupDTO.id = AcmConstants.UDF_GROUP_NATIONALITY;

          const udfLinkGroup = await this.udfService.getUdfLinkGroupby(userDefinedFieldsLinksEntity).toPromise();
          if(udfLinkGroup.length > 0){
            await this.saveDataListToDb('udfLinkGroupByMemberId_' + link.member.id, udfLinkGroup);
          }
        }

        const addressPromises = data.map(element => {
            const address: AddressEntity = new AddressEntity();
            address.customerId = element.member.id;
            address.isPrimary = true;
            return this.customerAddressService.getCustomerAddress(address).toPromise()
                .then(value => {
                    element.member.listAddress = value; 
                    return element;
                });
        });

        const updatedElements = await Promise.all(addressPromises);

        await this.saveDataListToDb(key, updatedElements);
      }
      return data;
    } else {
      return cachedData.data;
    }
}

async getLoansUDF(customer) {
  const udfLink = new UserDefinedFieldsLinksEntity();
  udfLink.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
  udfLink.elementId = customer.id;
  const udfLoans = await this.udfService.getLoansUdfByCustomer(udfLink).toPromise();
  if(udfLoans.length > 0){
  await this.saveDataListToDb('getLoanUdfByCustomer_' + customer.id , udfLoans);
  }
}

async getLoansByCustomerId(id){
 const loans = await this.gedService.findLoanByCustumer(id).toPromise();
 if(loans.length > 0){
  await this.saveDataListToDb('getLoansByCustomer_' + id , loans);
 }
 return loans;
}


  async getDocumentsByCollectionStep(collection){
    
    let loanDocumentEntitys: LoanDocumentEntity[] = [];
    let document: LoanDocumentEntity = new LoanDocumentEntity();

    for(let i = 0 ; i < collection.collectionInstancesDtos.length ; i++ ){

      const instance = collection.collectionInstancesDtos[i];
      document.collectionInstanceId = instance.id;
      document.collectionStepName = instance.stepName;
      loanDocumentEntitys = await this.gedService.getDocumentsByCollectionStep(document).toPromise();
      if(loanDocumentEntitys.length > 0 ){
      await this.saveDataListToDb('getDocumentsByCollectionInstance_' + instance.id, loanDocumentEntitys);
    }
  }
  }

  async getCollectionNote(collection){
   const c = new CollectionNoteEntity();
   c.collectionId = collection.id;
   const collectionNotes = await this.collectionService.getCollectionNotes(c).toPromise();
   await this.saveDataListToDb('getCollectionNoteByCollectionId_' + collection.id , collectionNotes)
  }

  async getCollectionStep(collection,collectionType){
    const cachedData = await this.dbService.getByKey('data','getCollectionStepByCollectionId_' + collection.idAcmCollectionStep).toPromise();
    if(cachedData === undefined){
    let step;
    collection.collectionInstancesDtos.forEach((collectionInstance) => {
      if (collectionInstance.idAcmCollectionStep === collection.idAcmCollectionStep) {
        const stepEntity: StepEntity = new StepEntity();
        stepEntity.idCollectionStep = collectionInstance.idAcmCollectionStep;
        stepEntity.productId = collection.productId;
        if (collectionType == "COLLECTION") {
          stepEntity.process = "COLLECTION";
        } else {
          stepEntity.process = "LEGAL";
        }
        step = this.settingsService.getCollectionStepByParms(stepEntity).toPromise();
      }
    });
    await this.saveDataListToDb('getCollectionStepByCollectionId_' + collection.idAcmCollectionStep, step);
  }
  }
  async getUdfStepWorkflow(item,category){
    const instances = category === AcmConstants.COLLECTION_CATEGORY ? item.collectionInstancesDtos : category === AcmConstants.LOAN_CATEGORY ? item.loanInstancesDtos : [item];
    
    for (let j = 0 ; j < instances.length ; j++){
    const udfGroups = await this.getUdfAllGroupLoan(instances[j],category);
    const udfLinkGroupLoan = await this.getUdfLoanInformation(item,udfGroups,category);
    await this.getMaxIndexGroup(item,category);

    let udfGroupsSelected: UserDefinedFieldGroupEntity[] = [];
    for(let z = 0 ; z < udfLinkGroupLoan.length ; z++){
      const udf = udfLinkGroupLoan[z];
    // }
    // udfLinkGroupLoan.forEach((udf) => {
      if (udfGroups.find(udfG => udfG.id === udf.userDefinedFieldGroupID) !== undefined) {
        const groupUDF = new UserDefinedFieldGroupEntity();
        groupUDF.id = udf.userDefinedFieldGroupID;
        udfGroupsSelected.push(groupUDF);
      }
    }

    for (let i = 0; i < udfGroups.length; i++) {
      if(category === AcmConstants.COLLATERAL_CATEGORY){
        let udfFieldParam = new UserDefinedFieldsEntity();
        udfFieldParam.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
        udfFieldParam.userDefinedFieldGroupDTO.id = udfGroups[i].id ;
       await this.getUdfField(udfFieldParam,'-group-id-' + udfGroups[i].id);
      } else {
     await this.getUdfFiledListLoan(instances[j],udfGroups[i], category);
    }
  }
  }
  }

  async getUdfAllGroupLoan(item,category){
    let udfGroups = [];
    const key = category === AcmConstants.COLLECTION_CATEGORY ? 'getUdfGroupsByIdCollectionStep_' + item.idAcmCollectionStep :
    category === AcmConstants.LOAN_CATEGORY ? 'getUdfGroupsByLoanWorkflowStep_' + item.code : 'getUdfGroup_' + category;
    const cachedData :any = await this.dbService.getByKey('data',key).toPromise();
    if(cachedData === undefined){
      if(category === AcmConstants.COLLATERAL_CATEGORY){
      let udfGroupParam = new UserDefinedFieldGroupEntity();
      udfGroupParam.category = AcmConstants.COLLATERAL_CATEGORY;
      udfGroups = await this.udfService.getUdfGroup(udfGroupParam).toPromise();

      } else {
        let workflowStepUdfGroupeEntity = new WorkflowStepUdfGroupeEntity();
        if(category === AcmConstants.COLLECTION_CATEGORY){
        workflowStepUdfGroupeEntity.idCollectionStep = item.idAcmCollectionStep;
        } else {
          workflowStepUdfGroupeEntity.idWorkflowStep = item.code;
        }
        udfGroups = await this.udfService.findUdfGroupsByStepId(workflowStepUdfGroupeEntity).toPromise();
      }

    if(udfGroups.length > 0){
    await this.saveDataListToDb(key ,udfGroups);
    }
    return udfGroups;
    }
    else {
      return cachedData.data;
    }
  }

  async getUdfLoanInformation(item,udfGroups,category){
    const key = category === AcmConstants.COLLECTION_CATEGORY ? 'getUdfLinkGroupLoanByCollectionId_' + item.id : category === AcmConstants.LOAN_CATEGORY ? 'getUdfLinkGroupLoanByLoanId_' + item.loanId : 
    'getUdfLinkGroupLoanByCollateralId_' + item.idAcmCollateral;
    const cachedData :any = await this.dbService.getByKey('data',key).toPromise();
    if(cachedData === undefined){
    const userDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
    userDefinedFieldsLinksEntity.category = category;
    userDefinedFieldsLinksEntity.elementId = category === AcmConstants.COLLECTION_CATEGORY ? item.id : category === AcmConstants.LOAN_CATEGORY ? item.loanId : item.idAcmCollateral;
    userDefinedFieldsLinksEntity.udfGroupIds = udfGroups.map(udfG => udfG.id);
    const udfLinkGroupLoan = await this.udfService.getUdfLinkGroupby(userDefinedFieldsLinksEntity).toPromise();    
    
    await this.saveDataListToDb(key , udfLinkGroupLoan);
    return udfLinkGroupLoan;
    } else {
      return cachedData.data;
    }
  } 

  async getMaxIndexGroup(item,category) {
    const isCollection = category === AcmConstants.COLLECTION_CATEGORY;
    const key = isCollection ? 'getMaxIndexGroupByCollectionId_' + item.id : category === AcmConstants.LOAN_CATEGORY ? 'getMaxIndexGroupByLoanId_' + item.loanId : 'getMaxIndexGroupByCollateralId_' + item.idAcmCollateral;
    const cachedData :any = await this.dbService.getByKey('data',key).toPromise();
    if(cachedData === undefined){
    let maxIndexGroup = await this.udfService.findMaxIndexGroup( isCollection ? item.id : category === AcmConstants.LOAN_CATEGORY ? item.loanId : item.idAcmCollateral ,category).toPromise();
    if(maxIndexGroup == null) { 
    maxIndexGroup = 0;
    }
    await this.saveDataListToDb(key , maxIndexGroup);
    }
  }

  async getUdfFiledListLoan(instance,udfGroupSelected,category){
    const isCollection = category === AcmConstants.COLLECTION_CATEGORY;   
    const key = isCollection ? 'getUdfFieldsByIdCollectionStep_' + instance.idAcmCollectionStep : 'getUdfFieldsByIdLoanStep_' + instance.code;
    const cachedData :any = await this.dbService.getByKey('data',key).toPromise();
    if(cachedData === undefined){
    let workflowStepUdfGroupeEntity = new WorkflowStepUdfGroupeEntity();
    if(isCollection){
    workflowStepUdfGroupeEntity.idCollectionStep = instance.idAcmCollectionStep;
    } else {
      workflowStepUdfGroupeEntity.idWorkflowStep = instance.code;
    }
    const data = await this.udfService.findUdfFieldsByStepId(workflowStepUdfGroupeEntity, udfGroupSelected.id).toPromise();

    await this.saveDataListToDb(key , data);
    }
  }
  
  async getUdfGroupByCategory(udfGroupParam){
    const data = await this.udfService.getUdfGroup(udfGroupParam).toPromise();
    if(data){
      await this.saveDataListToDb('getUdfGroup_' + udfGroupParam.category, data);
      for(let i = 0; i < data.length ; i++){
        let udfFieldParam = new UserDefinedFieldsEntity();
        udfFieldParam.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
        udfFieldParam.userDefinedFieldGroupDTO.id = data[i].id ;
       await this.getUdfField(udfFieldParam,'-group-id-' + data[i].id);
      } 
    }
  }
  async findCustomerSettings() {
    const data = await this.settingsService.findAllSettingCustomer().toPromise();
    await this.saveDataListToDb('customer_setting', data);
  }
  async findBlacklistItems(customer){
    let blacklistItemPagination: BlacklistItemPagination = new BlacklistItemPagination(); 

    blacklistItemPagination.params = new BlacklistItem();
    blacklistItemPagination.params.status = AcmConstants.BLACKLIST_DOWNGRADE_PROCESS;
    blacklistItemPagination.params.nationalId = customer.identity;

    blacklistItemPagination.pageNumber = 0;
    blacklistItemPagination.pageSize = 10;

    const results = await this.blacklistService.findBlacklistItems(blacklistItemPagination).toPromise();

    if(results.resultsBlacklistItems.length > 0){
      await this.saveDataListToDb('getBlacklistItemsByCustomer_' + customer.id , results);
    }
  }

  async getCustomerBalance(customerIdExtern){
    const customerBalance = await this.settingsService.findBalanceCustomer(customerIdExtern).toPromise();
    if(customerBalance){
      await this.saveDataListToDb('customerBalance_' + customerIdExtern, customerBalance);
    }
  }

  async findProductFinanceList(){
   const data = await this.settingsService.findProductFinanceList(AcmConstants.PRODUCT_INSTRUMENT).toPromise();
    await this.saveDataListToDb('financialInstrument',data);
   
  }

  async findProductFilterList(){
    const typeList = await this.settingsService.findProductFilterList(AcmConstants.PRODUCT_TYPE).toPromise();
    const activityList = await this.settingsService.findProductFilterList(AcmConstants.PRODUCT_ACTIVITY).toPromise();
    const natureList = await this.settingsService.findProductFilterList(AcmConstants.PRODUCT_NATURE).toPromise();

      await this.saveDataListToDb('financingType', typeList);
    
      await this.saveDataListToDb('financingActivity', activityList);
    
      await this.saveDataListToDb('financingNature', natureList);
    
  }
  async findAllProduct(){
    const allProducts = await this.settingsService.findAllProduct().toPromise();
    await this.saveDataListToDb('allProducts', allProducts);
    for(let i = 0 ; i < allProducts.length ; i++){
      const product = await this.loanApprovalService.getProduct(allProducts[i].id).toPromise();
      await this.saveDataListToDb('product_' + allProducts[i].id, product);
    }
  }
  
  async findAmlListSettings(){
    const amlListSetting = new AcmAmlListSetting();
    amlListSetting.enabled = true;
    const data = await this.settingsService.findAMLListSetting(amlListSetting).toPromise();
    await this.saveDataListToDb('findAmlListSetting',data);
  }

  async findCollateralTypes(){
    const collateralTypes = await this.loanCollateralsServices.findCollateralTypes(new LoanCollateralTypeEntity()).toPromise();
    if(collateralTypes !== null){
    await this.saveDataListToDb('find_collateral_types',collateralTypes);
    }
  }

  async findCollateral(loan){
    const collateralEntity = new CollateralEntity();
    collateralEntity.loan = loan;
    const loanCollateral = await this.loanCollateralsServices.findCollateralByLoan(collateralEntity).toPromise();

    if(loanCollateral.length > 0){
      for(let i = 0 ; i < loanCollateral.length ; i++){
        await this.getUdfStepWorkflow(loanCollateral[i],AcmConstants.COLLATERAL_CATEGORY);
      }
      await this.saveDataListToDb('getCollateralByLoanId_' + loan.loanId,loanCollateral);
    }
  }

  async getNotes(loan){
    const loanNoteHistory: LoanNoteHistory = new LoanNoteHistory();
    loanNoteHistory.loanDTO = loan;
    const notes = await this.customerNotesService.getLoanHistoriqueNotesNotes(loanNoteHistory).toPromise();
    if(notes.length > 0){
      await this.saveDataListToDb('getLoanNotes_' + loan.loanId,notes);
    }
  }

  async getTasks(element,category){
    const key = category === AcmConstants.LOAN_CATEGORY ? 'getLoanTasks_' + element.loanId : 'getCollectionTask_' + element.id;
    const calendarEventsEntityParam = new CalendarEventsEntity();
    calendarEventsEntityParam.category = category;
    calendarEventsEntityParam.typeEvent = AcmConstants.EVENT_TYPE_STEP_TASK;
    if(category === AcmConstants.LOAN_CATEGORY){
    calendarEventsEntityParam.idLoanExtern = Number(element.idLoanExtern);
    } else {
      calendarEventsEntityParam.idCollection = Number(element.id)
    }
    const tasks = await this.crmService.find(calendarEventsEntityParam).toPromise();
    if(tasks.length > 0 ){
      await this.saveDataListToDb(key,tasks);
    }
  }

  async getSchedules(loan){
    const schedules = await this.scheduleService.loanSchedules(loan).toPromise();
    if(schedules.length > 0){
      await this.saveDataListToDb('getLoanSchedules_' + loan.loanId, schedules);
    }
  }

  async getLoanDetailsFromAbacus(loan : LoanEntity){
   const loanDetails = await this.settingsService.getDetailsInformationsLoanFromAbacus(Number(loan.idLoanExtern)).toPromise();
   if(loanDetails.length > 0){
    await this.saveDataListToDb('getLoanDetailsFromAbacus_' + loan.loanId, loanDetails);
   }
  }

  async getFeeRepayment(loan : LoanEntity){
   const feeRepayment = await this.gedService.getFeeRepayment(loan.idAccountExtern).toPromise();
   await this.saveDataListToDb('getFeeRepayment_' + loan.loanId, feeRepayment);
  }
  
  async findUsers(){
     const users = await this.authService.loadAllUserList().toPromise();
     if(users.length > 0 ){
      await this.saveDataListToDb('getAllUsers',users);
     }
  }

  async getRenewalConditionSetting(customer :CustomerEntity){
    const customerAccount = new CustomerAccountEntity();
      customerAccount.customerId = String(customer.customerIdExtern);
      const renewalCondition = await this.customerManagementService.getRenewalConditionSetting(customerAccount).toPromise()
        await this.saveDataListToDb('renewalCondition_' + customer.customerIdExtern, renewalCondition);
  }

  async getSettingMotifReject(category){
    let settingMotifEntity = new SettingMotifRejetsEntity();
    settingMotifEntity.categorie = category;
    const reasons = await this.loanDetailsServices.getReason(settingMotifEntity).toPromise();
    await this.saveDataListToDb('getSettingMotif_' + category ,reasons);
  }

  async getTranslation(){
   const langs = ['en','fr','ar'];
   for(let i =0 ; i < langs.length ; i++){
    const res = await this.translate.getTranslation(langs[i]).toPromise();
    this.saveDataListToDb('translation_' + langs[i] , res); 

    const validationTranslation = await this.http.get(`../../../assets/i18n/validation/${langs[i]}.json`).toPromise();
    await this.saveDataListToDb('validationTranslation_' + langs[i] , validationTranslation);
   } 
  }
}
