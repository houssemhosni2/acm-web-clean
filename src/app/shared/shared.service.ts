import { SettingThirdPartyEntity } from './Entities/settingThirdParty.entity';
import { Injectable } from '@angular/core';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { CustomerEntity } from './Entities/customer.entity';
import { LoanEntity } from './Entities/loan.entity';
import { Router } from '@angular/router';
import { CustomerServices } from '../AcmPages/Loan-Application/customer/customer.services';
import { GedServiceService } from '../AcmPages/GED/ged-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HabilitationEntity } from './Entities/habilitation.entity';
import { LoanIbEntity } from './Entities/loanIb.entity';
import { UserEntity } from './Entities/user.entity';
import { AcmIhmFieldEntity } from './Entities/acmIhmField.entity';
import { ExpensesEntity } from './Entities/expenses.entity';
import { AcmIhmFormEntity } from './Entities/acmIhmForm.entity';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SettingFieldService } from '../AcmPages/Settings/setting-fields.service';
import { CustomerManagementService } from '../AcmPages/Customer/customer-management/customer-management.service';
import { NotificationsEntity } from './Entities/notifications.entity';
import { CustomerAccountEntity } from './Entities/customer.account.entity';
import { CollectionEntity } from './Entities/acmCollection.entity';
import { LoanDetailsServices } from '../AcmPages/Loan-Application/loan-details/loan-details.services';
import { SettingsService } from '../AcmPages/Settings/settings.service';
import { CollectionProcessEntity } from './Entities/CollectionProcess.entity';
import { AssetEntity } from './Entities/Asset.entity';
import { SupplierEntity } from './Entities/Supplier.entity';
import { LoanApprovalService } from '../AcmPages/Loan-Application/loan-approval/loan-approval.service';
import { AcmDevToolsServices } from './acm-dev-tools.services';
import { AcmLoanInstanceAcmGroupeApprovalEntity } from './Entities/acmLoanInstanceAcmGroupeApproval.entity';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, mergeMap } from 'rxjs/operators';
import { Customer360Services } from '../AcmPages/Customer/customer360/customer360.services';
import { checkOfflineMode } from './utils';
import { AcmEnvironnementEntity } from './Entities/acmEnvironnement.entity';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClaimsEntity } from './Entities/claims.entity';
import { ClaimsListEntity } from './Entities/claims.list.entity';
import { creditLineEntity } from './Entities/AcmCreditLine.entity';
import { CollateralEntity } from './Entities/Collateral.entity';
import { DynamicProductEntity } from './Entities/DynamicProduct.entity';
import { ItemEntity } from './Entities/Item.entity';
import { ElementId } from './Entities/elementId.entity';
import {customRequiredValidator,customPatternValidator,customEmailValidator} from './utils'
import { ProspectEntity } from './Entities/Prospect.entity';
import { AssetLoanEntity } from './Entities/AssetLoan.entity';
import { AcmAmlCheckEntity } from './Entities/AcmAmlCheck';
import { AcmDoubtfulLoanAnalyticsEntity } from './Entities/AcmDoubtfulLoanAnalytics.entity';
import { AcmAmlDataEntity } from "src/app/shared/Entities/AcmAmlData";
import { UdfService } from '../AcmPages/Loan-Application/udf/udf.service';
import { CollectionServices } from '../AcmPages/Collection/collection.services';
import { LoanManagementService } from '../AcmPages/Loan-Application/loan-management/loan-management.service';
import { CustomerNotesService } from '../AcmPages/Loan-Application/loan-approval/customer-notes/customer-notes.service';
import { CrmService } from '../AcmPages/CRM/crm.service';
import { title } from 'process';
import { LoanCollateralsServices } from '../AcmPages/Loan-Application/check-collateral/loan-collaterals/loan-collaterals.services';
import { LoanPaginationEntity } from './Entities/loan.pagination.entity';
import { ConditionnalApproveService } from '../AcmPages/Loan-Application/conditional-approve/conditional-approve.service';
import { CustomerListService } from '../AcmPages/Customer/customer-list/customer-list.service';
import { CustomerPaginationEntity } from './Entities/customer.pagination.entity';
import { CollectionPaginationEntity } from './Entities/collection.pagination.entity';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  /**
   *
   * @param Router router
   * @param CustomerServices customerServices
   * @param GedServiceService gedService
   * @param DomSanitizer sanitizer
   */
  constructor(public router: Router, public customerServices: CustomerServices,
    public devToolsServices: AcmDevToolsServices,public crmService: CrmService,public customerListService: CustomerListService,
    public settingFieldService: SettingFieldService, public gedService: GedServiceService,
    public translate: TranslateService, public formBuilder: FormBuilder,public collateralStepService: LoanCollateralsServices,
    public sanitizer: DomSanitizer, public customerManagementService: CustomerManagementService,public conditionnalApproveService: ConditionnalApproveService,
    public loanDetailsServices: LoanDetailsServices, public customer360Services: Customer360Services,
    public settingsService: SettingsService, public loanApprovalService: LoanApprovalService,public customerNotesService: CustomerNotesService,
    private dbService: NgxIndexedDBService,public udfService: UdfService,public loanManagementService: LoanManagementService,private collectionServices: CollectionServices) {
    this.loader = false;
  }

  public customer: CustomerEntity = new CustomerEntity();
  public supplier: SupplierEntity = new SupplierEntity();
  public elementId :ElementId =  new ElementId() ;
  public customerGrpOrg: CustomerEntity = new CustomerEntity();
  public guarantor: CustomerEntity = new CustomerEntity();
  public participant: SettingThirdPartyEntity = new SettingThirdPartyEntity();
  public user: UserEntity = new UserEntity();
  public loanGroupe: LoanEntity = new LoanEntity();
  public loanChild: LoanEntity[] = [];
  public loan: LoanEntity = new LoanEntity();
  public loanIb: LoanIbEntity = new LoanIbEntity();
  public users: Array<any> = [];
  public checkPrevious: boolean;
  public habilitationEntitys: HabilitationEntity[] = [];
  public userHabilitationButton: HabilitationEntity[] = [];
  public userHabilitationPath: HabilitationEntity[] = [];
  public listProcess: Array<LoanProcessEntity> = [];
  public listLoanValidators: AcmLoanInstanceAcmGroupeApprovalEntity[] = [];
  public checkButtonByEtapeWorkflow: boolean;
  public checkButtonHabilitation: boolean;
  public checkPathHabilitation: boolean;
  public maxSizeFileUpload = 2097152;
  countNotifications = 0;
  public ibDocumentsReceived  = new BehaviorSubject(false);
  public typeMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.ms-excel',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  public typeMimesOnlyCSV = ['application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  image: any = '../../../assets/images/avatars/user.jpg';
  public fields: AcmIhmFieldEntity[] = [];
  public fieldHabilitation: boolean;
  public expenses: ExpensesEntity = new ExpensesEntity();
  public form = new AcmIhmFormEntity();
  public loader: boolean;
  public renewalConditionStatus: boolean = null;
  public authorized: boolean;
  public customerAccount: CustomerAccountEntity = new CustomerAccountEntity();
  public notifications: NotificationsEntity[] = [];
  public currentStatus: number;
  private collection = new CollectionEntity();
  public forExitCustumer360 = false;
  private claim = new ClaimsListEntity();

  public oldCustomer: CustomerEntity = new CustomerEntity();
  private asset: AssetEntity;
  private loanAssets: AssetLoanEntity[];
  public screenSource: string = null;
  public activationKey: string[];
  public creptedKey: string;
  public environnementLicence: AcmEnvironnementEntity;
  public previousStep = false;
  public thirdParty: SettingThirdPartyEntity;
  public creditLine: creditLineEntity;
  private collateral: CollateralEntity;
  public prospect: ProspectEntity ;

  public validCustomerAge : boolean =true;
  public acmAmlCheck : AcmAmlCheckEntity;
  public acmDoubtfulLoanAnalyticsEntity : AcmDoubtfulLoanAnalyticsEntity;

  amlDetails: AcmAmlDataEntity;
  acmAmlChecksDTOs : AcmAmlCheckEntity[];
  public useExternalCBS : string;  collectionKey: string;
  statusTab : string;

  public loanPaginationOffline : LoanPaginationEntity = null;
  public customersPaginationOffline : CustomerPaginationEntity = null;
  public collectionPaginationOffline : CollectionPaginationEntity = null;
  public legalPaginationOffline : CollectionPaginationEntity = null;
  private goOffline = new Subject<void>();
  actionTriggered$ = this.goOffline.asObservable();
  public loadDataOffline : boolean;

  triggerGoOffline() {
    this.goOffline.next();
  }
  getCollateral() {
    return this.collateral;
  }
  setCollateral(collateralEntity: CollateralEntity) {
    this.collateral = collateralEntity;
  }  public dynamicProduct : DynamicProductEntity = new DynamicProductEntity() ;
  public item : ItemEntity = new ItemEntity () ;


  /**
   * getThirdParty
   */
  getThirdParty() {
    return this.thirdParty;
  }

  /**
   * setThirdParty
   */
  setThirdParty(settingThirdPartyEntity : SettingThirdPartyEntity) {
    this.thirdParty = settingThirdPartyEntity;
  }

  resetThirdParty(){
    this.thirdParty = undefined
  }

  getCreditLine() {
    return this.creditLine;
  }
  setCreditLine(creditLineEntity: creditLineEntity){
    this.creditLine = creditLineEntity;
  }
  resetCreditLine(){
    this.creditLine = undefined
  }

  /**
   * openLoan
   */

  getEnvironnementLicence() {
    return this.environnementLicence;
  }
  setEnvironnementLicence(environnementLicence: AcmEnvironnementEntity) {
    this.environnementLicence = environnementLicence;
  }
  getAsset() {
    return this.asset;
  }
  setAsset(assetEntity: AssetEntity) {
    this.asset = assetEntity;
  }
  getLoanAssets() {
    return this.loanAssets;
  }
  setLoanAssets(loanAssetsEntity: AssetLoanEntity[]) {
    this.loanAssets = loanAssetsEntity;
  }
  getCreptedKey() {
    return this.creptedKey;
  }
  setCreptedKey(creptedKey: string) {
    this.creptedKey = creptedKey;
  }
  getActivationKey() {
    return this.activationKey;
  }
  setActivationKey(activationKey: string[]) {
    this.activationKey = activationKey;
  }
  getSupplier() {
    return this.supplier;
  }
  setSupplier(supplierEntity: SupplierEntity) {
    this.supplier = supplierEntity;
  }

  getElementId() {
    return this.elementId;
  }
  setElementId(elementId: ElementId) {
    this.elementId = elementId;
  }

  setDynamicProduct(dynamicProductEntity: DynamicProductEntity) {
    this.dynamicProduct = dynamicProductEntity;
  }
  getDynamicProduct() {
    return this.dynamicProduct;
  }

  setItem(item: ItemEntity) {
    this.item = item;
  }
  getItem() {
    return this.item;
  }

  /**
   * check validators
   */

  async checkLoanOwnerOrValidator() {
    if (this.loan && this.user) {
      this.loan.isOwnerOrValidator = false;
      // if loan is cancelled | declined | rejected | (issued AND its workflow process is completed)
      // then Do not display the workflow buttons.
      if (this.loan.statutWorkflow === AcmConstants.STATUT_WORKFLOW_DECLINED ||
        this.loan.statutWorkflow === AcmConstants.STATUT_WORKFLOW_CANCELLED ||
        this.loan.statutWorkflow === AcmConstants.STATUT_WORKFLOW_REJECTED ||
        (this.loan.workflowCompleted === true && this.loan.statutWorkflow === AcmConstants.STATUT_WORKFLOW_ISSUED)) {
        return;
      }
      // if connected user is the owner of the loan OR  the connected user belongs to authorized groups then Display Workflow buttons
      if (this.loan.owner === this.user.login || this.getAuthorized()) {
        this.loan.isOwnerOrValidator = true;
      } else if (!checkOfflineMode()) {
        // if connected user belongs to the loan approvers then display workflow buttons
        this.getLoan();
        const paramFilter: AcmLoanInstanceAcmGroupeApprovalEntity = new AcmLoanInstanceAcmGroupeApprovalEntity();
        const loanIns: LoanProcessEntity = new LoanProcessEntity();
        loanIns.id = this.loan.processInstanceId;
        paramFilter.loanInstance = loanIns;
        paramFilter.validation = false;
        await this.loanApprovalService.getListValidatorsLoanInstance(paramFilter).subscribe((value) => {
          this.listLoanValidators = value;
          this.listLoanValidators.forEach(valid => {
            if (valid.owner === this.user.login) {
              this.loan.isOwnerOrValidator = true;
            }
          });
        });

      }
    }

  }
  /**
   * get collection
   * @returns CollectionEntity
   */
  getCollection(): CollectionEntity {
    // cast availability date to yyyy-mm-dd format
    if (String(this.collection.availableDate).indexOf('-') !== -1) {
      const year = String(this.collection.availableDate).substring(0, 4);
      const month = String(this.collection.availableDate).substring(5, 7);
      const day = String(this.collection.availableDate).substring(8, 10);
      this.collection.availableDate = new Date(year + '-' + month + '-' + (Number(day)));
    }
    return this.collection;
  }

  /**
   * set collection
   * @param value CollectionEntity
   */
  setCollection(value: CollectionEntity) {
    // cast availability date to yyyy-mm-dd format
    if (String(value.availableDate).indexOf('-') !== -1) {
      const year = String(value.availableDate).substring(0, 4);
      const month = String(value.availableDate).substring(5, 7);
      const day = String(value.availableDate).substring(8, 10);
      value.availableDate = new Date(year + '-' + month + '-' + (Number(day)));
    }
    this.collection = value;
  }


  setClaim(value: ClaimsListEntity) {
    this.claim = value;
  }

  getClaim(){
    return this.claim;
  }
  /**
   *
   * @returns NotificationsEntity[]
   */
  getNotification(): NotificationsEntity[] {
    return this.notifications;
  }

  /**
   *
   * @param value NotificationsEntity
   */
  addNotification(value: NotificationsEntity) {
    this.notifications.unshift(value);
  }

  /**
   *
   * @param value NotificationsEntity[]
   */
  setNotifications(value: NotificationsEntity[]) {
    this.notifications = value;
  }

  /**
   * getLoan
   */
  getLoan(): LoanEntity {
    if (this.loan) {
      if (this.loan.loanInstancesDtos !== undefined) {
        if (this.loan.loanInstancesDtos.length > 0) {
          const loanStep = this.loan.loanInstancesDtos.find(step =>
            step.code === this.loan.etapeWorkflow)
          if (loanStep) {
            this.loan.stepName = loanStep.libelle;
            this.loan.processInstanceId = loanStep.id;
          } else {
            this.loan.stepName = '';
            this.loan.processInstanceId = null;
          }
        }
      } else {
        this.loan.stepName = '';
      }
    }
    return this.loan;
  }



  /**
   * setLoan
   * @param LoanEntity the value to set
   */
  setLoan(value: LoanEntity) {
    this.loan = value;
    this.checkLoanOwnerOrValidator();
  }


  /**
   * setCustomerAccount
   * @param value CustomerAccountEntity
   */
  setCustomerAccount(value: CustomerAccountEntity) {
    this.customerAccount = value;
  }

  /**
   * getCustomerAccount
   */
  getCustomerAccount(): CustomerAccountEntity {
    return this.customerAccount;
  }

  /**
   * getFields
   */
  getFields(): AcmIhmFieldEntity[] {
    return this.fields;
  }

  /**
   * setFields
   * @param AcmIhmFieldEntity the value to set
   */
  setFields(value: AcmIhmFieldEntity[]) {
    this.fields = value;
  }

  /**
   * getUsers
   */
  getUsers(): Array<any> {
    return this.users;
  }

  /**
   * setUsers
   * @param Array<any> the value to set
   */
  setUsers(value: Array<any>) {
    this.users = value;
  }

  /**
   * getUser
   */
  getUser(): UserEntity {
    return this.user;
  }

  /**
   * getUser
   * @param value the value to set
   */
  setUser(value: UserEntity) {
    this.user = value;
  }

  /**
   * getCustomer
   */
  getCustomer(): CustomerEntity {
    return this.customer;
  }

  /**
   * setCustomer
   * @param CustomerEntity the value to set
   */
  setCustomer(value: CustomerEntity) {
    this.customer = value;
  }

  /**
   * getGuarantor
   */
  getGuarantor(): CustomerEntity {
    return this.guarantor;
  }

  /**
   * setThirdPartyLegal
   * @param SettingThirdPartyEntity the value to set
   */
  setThirdPartyLegal(value: SettingThirdPartyEntity) {
    this.participant = value;
  }

  /**
   * setGuarantor
   * @param CustomerEntity the value to set
   */
  setGuarantor(value: CustomerEntity) {
    this.guarantor = value;
  }
  /**
   * getCustomer
   */
  getcustomerGrpOrg(): CustomerEntity {
    return this.customerGrpOrg;
  }

  /**
   * setCustomer
   * @param CustomerEntity the value to set
   */
  setcustomerGrpOrg(value: CustomerEntity) {
    this.customerGrpOrg = value;
  }

  /**
   * getLoanGroupe
   */
  getLoanGroupe(): LoanEntity {
    return this.loanGroupe;
  }

  /**
   * setLoanGroupe
   * @param LoanEntity the value to set
   */
  setLoanGroupe(value: LoanEntity) {
    this.loanGroupe = value;
  }

  /**
   * getCheckPrevious
   */
  getCheckPrevious(): boolean {
    return this.checkPrevious;
  }

  /**
   * setCheckPrevious
   * @param CheckPrevious the value to set
   */
  setCheckPrevious(value: boolean) {
    this.checkPrevious = value;
  }

  /**
   * getHabilitationEntitys
   */
  getHabilitationEntitys(): HabilitationEntity[] {
    return this.habilitationEntitys;
  }

  /**
   * setHabilitationEntitys
   * @param HabilitationEntitys the value to set
   */
  setHabilitationEntitys(value: HabilitationEntity[]) {
    this.habilitationEntitys = value;
  }

  /**
   * getLoanIb
   */
  getLoanIb(): LoanIbEntity {
    return this.loanIb;
  }

  /**
   * setLoan
   * @param LoanIbEntity the value to set
   */
  setLoanIb(value: LoanIbEntity) {
    this.loanIb = value;
  }

  /**
   * Get Loan Child
   */
  getLoanChild(): LoanEntity[] {
    return this.loanChild;
  }

  /**
   * set Loan Child
   * @param loanChild LoanEntity[]
   */
  setLoanChild(loanChild: LoanEntity[]) {
    this.loanChild = loanChild;
  }

  /**
   * get form
   */
  getForm(): AcmIhmFormEntity {
    return this.form;
  }

  /**
   * set form
   * @param value the value to set
   */
  setForm(value: AcmIhmFormEntity) {
    this.form = value;
  }

  /**
   * getPreviousStep
   */
  getPreviousStep(): boolean {
    return this.previousStep;
  }

  /**
   * setCheckPrevious
   * @param CheckPrevious the value to set
   */
  setPreviousStep(value: boolean) {
    this.previousStep = value;
  }

  /**
   *
   * @returns boolean
   */
  async getRenewalConditionStatus(): Promise<boolean> {
    if (this.renewalConditionStatus === null) {
      if(checkOfflineMode()){
      await  this.dbService.getByKey('data', 'envirement-values-by-keys-upload').toPromise().then((environments:any)=>{
          if(environments !== undefined){
            const env = environments.data.filter(item => item.key === AcmConstants.RENEWEL_LOAN_CONDITION);
            if(env.length > 0){
              this.renewalConditionStatus = (env[0].value === '0' ? false : true);
            }
           }
          });
      } else {
      await this.customerManagementService.getEnvirementValueByKey(AcmConstants.RENEWEL_LOAN_CONDITION).toPromise().then((data) => {
        this.renewalConditionStatus = (data.value === '0' ? false : true);
      });
    }
  }
    return this.renewalConditionStatus;
  }

  /**
   *
   * @param value boolean
   */
  setRenewalConditionStatus(value: boolean) {
    this.renewalConditionStatus = value;
  }

  /**
   * getIhmByAction
   * @param action next/previous
   * @param workflowNextAction work flow Next Action
   */
  async getIhmByAction(action, workflowNextAction?) {

    const loanProcessEntitys: LoanProcessEntity[] = this.loan.loanInstancesDtos;
    
    let i = 0;
    while (loanProcessEntitys[i].code !== this.currentStatus && i < (loanProcessEntitys.length - 1)) {
      i++;
    }
    if (i < loanProcessEntitys.length) {
      if (action === AcmConstants.PREVIOUS_FORM_MSG) {
        this.previousStep = true;
        this.currentStatus = loanProcessEntitys[i - 1].code;
        this.loan.etapeWorkflow = this.currentStatus;
        
        this.router.navigate([AcmConstants.DASHBOARD_URL + '/' + loanProcessEntitys[i - 1].ihmRoot]);
      } else if (action === AcmConstants.NEXT_FORM_MSG) {
        if (this.currentStatus === this.loan.etapeWorkflow) {
          this.previousStep = false;
          this.loan.workflowNextAction = workflowNextAction;
          if (checkOfflineMode()) {            
            await this.dbService.update('loans', this.loan).toPromise();            
            const ihmRoot = loanProcessEntitys[i + 1].ihmRoot;
            this.refreshCurrentRoute(AcmConstants.DASHBOARD_URL + ihmRoot);
          } else {
            await this.loanDetailsServices.validate(this.loan).subscribe(
              (data) => {
                this.setLoan(data);
                this.checkLoanOwnerOrValidator();
                this.currentStatus = data.etapeWorkflow;
                const url = this.router.url;
                if(url.includes('preview')){
                  this.router.navigate(['/offline/preview'],{queryParams:{type:'Loans',title:'sidebar.loan_application'}})
                } else {
                this.refreshCurrentRoute(AcmConstants.DASHBOARD_URL + data.ihmRoot);
                }
              });
          }

        } else {
          this.currentStatus = loanProcessEntitys[i + 1].code;
          this.router.navigate([AcmConstants.DASHBOARD_URL + '/' + loanProcessEntitys[i + 1].ihmRoot]);
        }
      }
    } else {
      this.router.navigate([AcmConstants.DASHBOARD_URL]);
    }
  }
  refreshCurrentRoute(nextRoute: string): void {
    const currentRoute = this.router.url;
    if (currentRoute === nextRoute) {
      this.router.navigateByUrl(AcmConstants.DASHBOARD_URL, { skipLocationChange: true }).then(() => {
        this.router.navigate([nextRoute]);
      });
    }
    else {
      this.router.navigate([nextRoute]);
    }
  }
  /**
   * GET Loan Status
   */
  getLoanStatus(): number {
    return this.loan.loanInstancesDtos.find(step => step.code === this.loan.etapeWorkflow).code;
  }

  /**
   * get Max Size File Upload
   */
  getMaxSizeFileUpload(): number {
    return this.maxSizeFileUpload;
  }

  /**
   * set Max Size File Upload
   */
  setMaxSizeFileUpload(value: number) {
    this.maxSizeFileUpload = value;
  }

  /**
   * get Type mimes
   */
  geTypeMimes(): string[] {
    return this.typeMimes;
  }

  /**
   * get Type mimes
   */
  setTypeMimes(value: string[]) {
    this.typeMimes = value;
  }

  /**
   * rootingUrlByStatut rooting url to go by given loan statut
   */
  rootingUrlByStatut() {
    if (this.loan.etapeWorkflow ===AcmConstants.STATUT_WORKFLOW_ISSUED) {
        this.router.navigate([AcmConstants.LOAN_APPROVAL_URL]);
      }
      if (this.loan.etapeWorkflow ===AcmConstants.STATUT_WORKFLOW_REVIEW) {
        this.router.navigate([AcmConstants.LOAN_DETAIL_URL]);
      }
      if (this.loan.etapeWorkflow ===AcmConstants.STATUT_WORKFLOW_DISBURSEMENT_CASE_CLOSURE) {
        this.router.navigate([AcmConstants.UPLOAD_SIGNED_AGREEMENT_URL]);
      }
      else {
        const loanProcess: LoanProcessEntity = this.loan.loanInstancesDtos.find(
          step => step.code === this.loan.etapeWorkflow
        );
        this.router.navigate(['acm/' + loanProcess.ihmRoot]);
      }
  }

  rootingUrlByStatutCollection() {
    const collectionProcess: CollectionProcessEntity = this.collection.collectionInstancesDtos.find(
      step => step.idAcmCollectionStep === this.collection.idAcmCollectionStep
    );
    this.router.navigate(['acm/' + collectionProcess.ihmRoot]);
  }
  async openCollection() {
    this.currentStatus = this.collection.status;
    await this.customerServices.getCustomerInformationByIdExtrn(this.collection.customerIdExtern).toPromise().then(
      (data) => {
        this.setCustomer(data[0]);
      });
    await this.rootingUrlByStatutCollection();
  }

  async goToCollection(collection: CollectionEntity) {
    await this.customer360Services.findLoanByIdExtern(collection.idLoanExtern).pipe(
      map(data => {
        this.setLoan(data);
        return data;
      }),
      mergeMap(loan => this.customerServices.getCustomerInformation(loan.customerDTO.id))
    ).toPromise().then(data2 => {
      this.setCustomer(data2);
    });
    this.setCollection(collection);
    await this.rootingUrlByStatutCollection();
  }

  async openLoan(loan: LoanEntity, source?: string) {
    // reset ibDocumentsReceived to false
    this.ibDocumentsReceived.next(true);
    this.screenSource = source;
    this.setLoan(loan);
    this.currentStatus = loan.etapeWorkflow;
    // to do by rmila
    if (checkOfflineMode()) {
      this.customer = loan.customerDTO;
    }
    else {
      await this.checkLoanOwnerOrValidator();
      await this.customerServices.getCustomerInformation(loan.customerDTO.id).toPromise().then(
        (data) => {
          this.customer = data;
        });
    }
    if (source === AcmConstants.CHECK_GUARANTOR_URL) {
      this.router.navigate([AcmConstants.CHECK_GUARANTOR_URL]);
    }
    else if ((loan.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) || (loan.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS)) {
      this.rootingUrlByStatut();
      this.forExitCustumer360 = true;

    } else if (loan.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.setLoanGroupe(loan);
      this.router.navigate([AcmConstants.CUSTOMER_GROUPE_URL]);
      this.forExitCustumer360 = true;
    }
  }

  getForExitCustumer360(): boolean {
    return this.forExitCustumer360;
  }

  /**
   * openLoanIb
   * @param LoanIbEntity the loan entity
   */
  async openLoanIb(loanIb: LoanIbEntity) {
    this.setLoanIb(loanIb);
  }

  /**
   * habilitationButton (EXECUTE / READ button by given local path)
   * @param button button
   * @param path path
   */
  habilitationButton(button, path) {
    const mapActionButtonPath = new Map();
    this.userHabilitationButton = this.getHabilitationEntitys();
    if (this.userHabilitationButton.length > 0) {
      this.userHabilitationButton.forEach(element => {
        if (element.acmWebRoute === path) {
          mapActionButtonPath.set(element.value, element.actions);
        }
      });
    }
    if ((mapActionButtonPath.get(button) === '') || (mapActionButtonPath.get(button) === null)) {
      this.checkButtonHabilitation = true;
      return this.checkButtonHabilitation;
    } else {
      switch (button) {
        case AcmConstants.REJECT_CATEGORIE: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.WORKFLOW_REQUEST_ACTION_REVIEW: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_AGREE: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.WORKFLOW_REQUEST_ACTION_ASK_FOR_REVIEW: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.WORKFLOW_REQUEST_ACTION_DECLINED: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.WORKFLOW_REQUEST_ACTION_RECOMMEND_AUDIT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.WORKFLOW_REQUEST_ACTION_RECOMMEND_RISK: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ACTION_ASSIGN_LOAN: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ACTION_CUSTOMER_360: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.SAVE: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.REVIEW_AUDIT_BUTTON: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.REVIEW_RISK_BUTTON: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_FINISH: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_REVIEW_AGREEMENTS: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_CALCULATE: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_CHANGE_DATA: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ACTIVITY_STREAM: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ASSIGN_APPLICATION: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.CONTACT_CUSTOMER: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ASSIGN_TO_CUSTOMER: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.CANCEL_LOAN: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.PAYMENT_FROM_ACM: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.DEPOSIT_FROM_ACM: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.SAVING_DEPOSIT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.CANCEL_ASSIGN_TO_CUSTOMER: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ADD_BUTTON: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ACCEPT_BUTTON: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ADD_CUSTOMER_LOAN: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.REFRESH_LOAN_STATUS: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.WORKFLOW_REQUEST_ACTION_SUBMIT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.AML_DETAILS: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_RUN_AML_CUSTOMER: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_ACCEPT_AML_CUSTOMER: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_RUN_KYC_CUSTOMER: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_REJECT_AML_CUSTOMER: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_RUN_ISCORE_CUSTOMER: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_ACCPET_ISCORE_CUSTOMER: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_REJECT_ISCORE_CUSTOMER: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_RUN_AML_GUARANTOR: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_ACCEPT_AML_GUARANTOR: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_REJECT_AML_GUARANTOR: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_RUN_ISCORE_GUARANTOR: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_ACCEPT_ISCORE_GUARANTOR: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.HABILITATION_BUTTON_REJECT_ISCORE_GUARANTOR: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.CHECK_AML: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.LOAN_STATUT_REPORT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.COLLECTION_FOLLOW_UP_REPORT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.MEZA_CARD_REPORT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.I_SCORE_REPORT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ISSUANCE_REPAYEMENT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.REGISTRATION: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.OPERATION: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.LEGEL: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ISSUANCE_REPAYEMENT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.REGISTRATION: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.OPERATION: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.LEGEL: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.UPDATE: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.UPDATE_ALL: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.TOPUP_REFINANCE: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.TRUST_BUTTON: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.UNTRUSTED_BUTTON: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.SUPPLIER_360: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.ASSET_360: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.NOTIF_CATEGORY_EXCEPTION_REQUEST: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }

          return this.checkButtonHabilitation;
        }
        case AcmConstants.SYNCHRONIZE_CREDIT_LINE_ACCOUNTS: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }

          return this.checkButtonHabilitation;
        }
        case AcmConstants.CREDIT_LINE_ASSIGNMENT: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }

          return this.checkButtonHabilitation;
        }
        case AcmConstants.CLEAR_AML: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.CONFIRM_AML: {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.REVIEW_COLLECTION_HABILITATION : {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        case AcmConstants.REVIEW_LEGAL_HABILITATION : {
          if (mapActionButtonPath.get(button) === AcmConstants.EXECUTE) {
            this.checkButtonHabilitation = false;
          } else {
            this.checkButtonHabilitation = true;
          }
          return this.checkButtonHabilitation;
        }
        default: {
          this.checkButtonHabilitation = false;
          return this.checkButtonHabilitation;
        }
      }
    }

  }

  /**
   * habilitationPath
   * @param path path
   */
  habilitationPath(path) {
    this.userHabilitationPath = this.getHabilitationEntitys();
    this.checkPathHabilitation = false;
    this.userHabilitationPath.forEach(element => {
      if (element.acmHabilitation === path && element.value === AcmConstants.IHM) {
        this.checkPathHabilitation = true;
      }
    });
    return this.checkPathHabilitation;
  }

  /**
   * buttonByStatutWorkflow
   * @param code etapeworkflow
   * @param path currentpath
   */
  buttonByStatutWorkflow(code, path) {
    const mapCodePath = new Map();
    this.listProcess = this.loan.loanInstancesDtos;
    this.checkButtonByEtapeWorkflow = false;
    if (this.listProcess.length > 0) {
      this.listProcess.forEach(elementProcess => {
        if (elementProcess.ihmRoot === path) {
          mapCodePath.set(elementProcess.code, elementProcess.ihmRoot);
        }
      });
    }
    if (mapCodePath.has(code)) {
      this.checkButtonByEtapeWorkflow = true;
    }
    return this.checkButtonByEtapeWorkflow;
  }

  /**
   * get customerName No Pipe
   * @param customer CustomerEntity
   */
  getCustomerName(customer: CustomerEntity): string {
    if (customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL ||
      customer.customerType === AcmConstants.CUSTOMER_CATEGORY_PROSPECT) {
      customer.customerNameNoPipe = customer.firstName + ' ';
      if (customer.secondName !== null) {
        customer.customerNameNoPipe += customer.secondName + ' ';
      }
      if (customer.middleName !== null) {
        customer.customerNameNoPipe += customer.middleName + ' ';
      }
      customer.customerNameNoPipe += customer.lastName !== null ? customer.lastName : ' ';
    } else if (customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      customer.customerNameNoPipe = customer.solidarityName !== null ? customer.solidarityName : customer.customerName;
    } else if (customer.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      customer.customerNameNoPipe = customer.organizationName !== null ? customer.organizationName : customer.customerName;
    }
    return customer.customerNameNoPipe;
  }

  /**
   * getIHMFieldHabilitation
   *
   * @param formControlName String
   * @param action String
   */
  getIHMFieldHabilitation(action, formControlName): boolean {
    this.fieldHabilitation = false;
    let i = 0;
    if (this.form.acmIhmFields.length > 0) {
      while (this.fieldHabilitation !== true && i < this.form.acmIhmFields.length) {
        if (this.form.acmIhmFields[i].habilitation === action && this.form.acmIhmFields[i].formControlName === formControlName) {
          this.fieldHabilitation = true;
        }
        i++;
      }
    }
    return this.fieldHabilitation;
  }

  /**
   * getExpenses
   * @returns expenses
   */
  getExpenses(): ExpensesEntity {
    return this.expenses;
  }

  /**
   * setExpenses
   * @param value expenses
   */
  setExpenses(value) {
    this.expenses = value;
  }

  /**
   * get form and its fields from database
   * @param codeForm string
   */
  async habilitationIhmFields(codeForm, mode = 0) {
    const acmIhmFormEntity = new AcmIhmFormEntity();
    acmIhmFormEntity.codePage = codeForm;
    acmIhmFormEntity.enabled = true;
    acmIhmFormEntity.needFields = true;
    if (mode === 1) {
      let result;
      await this.settingFieldService.getForm(acmIhmFormEntity).toPromise().then((data) => {
        result = data;
      });
      return (result);
    } else if (mode === 2) {
      const data = await this.dbService.getByKey('data', codeForm).toPromise() as any;

      if (data === undefined) {
        this.devToolsServices.openToast(3, 'No ihm filer saved for offline use : ' + codeForm);
      } else {
        if (data !== null && data !== undefined) {
          this.form = this.createIhmForm(data.data[0]);
        }
      }

      //  await this.settingFieldService.getForm(acmIhmFormEntity).toPromise();
    } else {
      await this.settingFieldService.getForm(acmIhmFormEntity).toPromise().then((data) => {
        if (data !== null && data !== undefined) {
          this.form = this.createIhmForm(data[0]);
        }
        console.log(data)

      });


    }
  }

  async synchronizeCustomers(customers){    
    let error = false;
    if(customers == null){
    customers = await this.dbService.getAll('customers').toPromise() as CustomerEntity[];
    }
    for (let i = 0; i < customers.length; i++) {
      try {
        const customerIndex = customers[i].itemId;
        this.devToolsServices.openToast(0, `Start saving customer N°${i + 1}/${customers.length}`);
        let loan = null;
        if(customers[i].id){     
        loan = await this.dbService.getByKey('loans', customers[i].id).toPromise() as LoanEntity;
        }
        //  customers[i].id = null;
        let customer = new CustomerEntity();
        if(customers[i].id){
          customer = await this.customerManagementService.updateForApplication(customers[i]).toPromise();
        } else {
           customer = await this.customerManagementService.saveForApplication(customers[i]).toPromise();
        }
        if (loan && customer.customerNumber != null) {
          loan.customerDTO = customer;
          await this.dbService.update('loans', loan).toPromise();
        }

        this.devToolsServices.openToast(0, `Customers N°${i + 1} saved successfully`);
        this.dbService.delete('customers', customerIndex).toPromise();
      } catch (err) {
        error = true;
        console.error(`Error saving customer ${customers[i].id}: `, err);
      }
    }
    return error;
  }

  async synchronizeLoans(loans){
    let error = false;
    if(loans == null){
     loans = await this.dbService.getAll('loans').toPromise() as LoanEntity[];
    }
    for (let i = 0; i < loans.length; i++) {
      let loan: LoanEntity = loans[i];
      try {
        let calclate = await this.dbService.getByKey('calculate-loans', loan.loanId).toPromise() as LoanEntity;
  
        if (calclate) {
          await this.loanApprovalService.calculateLoanSchedules(calclate).toPromise().then(
            (data) => {
              const schedules = data.loanSchedule;
              let decimal = 1;
              if (loan.productDTO.acmCurrency.decimalPlaces !== null || loan.productDTO.acmCurrency.decimalPlaces !== undefined || loan.productDTO.acmCurrency.decimalPlaces !== 0) {
                decimal = Math.pow(10, loan.productDTO.acmCurrency.decimalPlaces);
              }
              const lastLine = schedules[schedules.length - 1];
              loan.totalInterest = Number(lastLine.interestRepayment);
              const pourcentage = (data.issueAmount
                * loan.productDTO.issueFeePercentage1) / 100;
              const pourcentage2 = (data.issueAmount
                * loan.productDTO.issueFeePercentage2) / 100;
              const feeAmout1 = pourcentage + ((pourcentage
                * loan.productDTO.issueFeeVAT1) / 100) + data.feeAmt1;
              // get application fees amount from API calculate
              loan.feeAmt1 = data.feeAmt1;
              const feeAmout2 = pourcentage2 + ((pourcentage2
                * loan.productDTO.issueFeeVAT2) / 100) + loan.productDTO.issueFeeAmount2;
              switch (loan.productDTO.roundType) {
                case AcmConstants.ROUND_UP:
                  loan.normalPayment = Math.ceil((data.normalPayment + Number.EPSILON) * decimal) / decimal;
  
                  break;
                case AcmConstants.ROUND_DOWN:
                  loan.normalPayment = Math.floor((data.normalPayment + Number.EPSILON)
                    * decimal) / decimal;
                  break;
                case AcmConstants.ROUND:
                  loan.normalPayment = Math.round((data.normalPayment + Number.EPSILON) * decimal) / decimal;
                  break;
                default:
                  loan.normalPayment = data.normalPayment;
                  break;
              }
              loan.apr = Math.round((data.apr + Number.EPSILON) * 100) / 100;
              loan.issueFeeAmount = feeAmout1 + feeAmout2;
              if (loan.productDTO.flatInterestRate !== 0) {
                loan.productRate = data.interestRate;
              }
            });
        }
  
        await this.synchronizeDocuments(AcmConstants.LOAN_CATEGORY,loan.loanId);

        await this.synchronizeCollaterals(loan.loanId);

        await this.synchronizeConditionnalApproves(loan.loanId);

        await this.synchronizeGuarantors(loan);

        const customer = await this.customerManagementService.getCustomerInformation(Number(loan.customerDTO.id)).toPromise();
        loan.customerDTO = customer;
        this.devToolsServices.openToast(0, `Start saving loan N°${i + 1}/${loans.length}`);

        // review loan
        if(loan.workflowNextAction === AcmConstants.WORKFLOW_REQUEST_ACTION_ASK_FOR_REVIEW){
          await this.loanDetailsServices.LoanReview(loan).toPromise().then(
            (data) => {
              this.router.navigate([AcmConstants.DASHBOARD_URL]);
            });
        }
        // decline loan
        else if(loan.workflowNextAction === AcmConstants.WORKFLOW_REQUEST_ACTION_DECLINED){
          await this.loanDetailsServices.validate(this.loan).toPromise().then(
            (data) => {
              this.router.navigate([AcmConstants.DASHBOARD_URL]);
            });
        }
        // submit loan
        else {

        if(loan.userDefinedFieldsLinksDTOs == null){
          loan.userDefinedFieldsLinksDTOs = [];
        }
  
        if (loan.accountNumber && loan.accountNumber.includes('-'))
          await this.loanManagementService.updateLoan(loan).toPromise();
        else
          await this.loanManagementService.createLoan(loan).toPromise();

        this.loan = loan;
        this.currentStatus = loan.etapeWorkflow;
        this.getIhmByAction(AcmConstants.NEXT_FORM_MSG, this.loan.workflowNextAction);
        }
  
        this.devToolsServices.openToast(0, `loan N°${i + 1} saved successfully`);
        await this.dbService.delete('loans', loan.loanId).toPromise()
          .then(() => {
            console.log('Loan deleted successfully');
          })
          .catch((error) => {
            console.error('Error deleting Loan:', error);
          });

          await this.dbService.delete('calculate-loans', loan.loanId).toPromise();
         
          await this.synchronizeNotes(AcmConstants.LOAN_CATEGORY,loan.loanId);

          await this.synchronizeTasks(AcmConstants.LOAN_CATEGORY,loan.loanId);

      } catch (err) {
        error = true;
        console.error(`Error saving loan ${loan.loanId}: `, err);
        this.devToolsServices.openToast(1, `Error saving loan ${loan.loanId}`);
        break;
      }
    }
    return error;
  }
  
  async synchronizeProspects(prospects){
    let error = false;
    if(prospects == null){
      prospects = await this.dbService.getAll('prospects').toPromise() as CustomerEntity[];
    }
    for (let i = 0; i < prospects.length; i++) {
      try {
        prospects[i].id = null;
        this.devToolsServices.openToast(0, `Start saving prospect N°${i + 1}/${prospects.length}`);
        const resultEntity = await this.customerManagementService.saveProspect(prospects[i]).toPromise();
        this.devToolsServices.openToast(0, `Prospect N°${i + 1} saved successfully`);
        this.dbService.delete('prospects', prospects[i].itemId).toPromise();
      } catch (err) {
        error = true;
        console.error(`Error saving prospect ${prospects[i].itemId}: `, err);
        this.devToolsServices.openToast(1, `Error saving prospect ${prospects[i].itemId}`);
      }
    }
    return error;
  }
  
 async synchronizeCollections(collections){
  let error = false;
    if(collections == null){
      collections = await this.dbService.getAll('collections').toPromise() as CollectionEntity[];
    }
  
    for(let i = 0 ; i< collections.length; i++) {
      try {
        this.devToolsServices.openToast(0, `Start saving collection N°${i + 1}/${collections.length}`);
        await this.saveUdfLinks(collections[i].id);
        await this.synchronizeDocuments(AcmConstants.COLLECTION_CATEGORY,collections[i].id);
        await this.synchronizeNotes(AcmConstants.COLLECTION_CATEGORY,collections[i].id);
        await this.synchronizeTasks(AcmConstants.COLLECTION_CATEGORY,collections[i].id);
        const resultEntity = await this.collectionServices.collectionActionCompleted(collections[i]).toPromise();
        this.devToolsServices.openToast(0, `Collection N°${i + 1} saved successfully`);
        this.dbService.delete('collections', collections[i].id).toPromise();
  
      } catch (err) {
        error = true;
        console.error(`Error saving collection ${collections[i].id}: `, err);
      }
    }
    return error;
  }
  
 async saveUdfLinks(elementId){
    try {
      let udfLinks :any;
       udfLinks = await this.dbService.getByKey('udfLinks', elementId).toPromise();
  
      if (udfLinks) {
        await this.udfService.updateUdfLinksByElementId(udfLinks.udfLink, elementId).toPromise();
        this.devToolsServices.openToast(0, `UDF links updated for collection ${elementId}`);
        await this.dbService.delete('udfLinks', elementId).toPromise();
      }
  }
   catch(error){
    console.error(`Error updating UDF links for collection ${elementId}:`, error);
  }
  }
  
 async synchronizeDocuments(category,elementId){
  let documentsList = [];
  if(elementId){
    const key = category === AcmConstants.LOAN_CATEGORY ? 'loanDocument_' + elementId : 'collectionDocument_' + elementId;
    const document = await this.dbService.getByKey('documents',key).toPromise() as any;
    if(document !== undefined){
      documentsList.push(document)
    }
  } else {
    documentsList = await this.dbService.getAll('documents').toPromise() as any[];
  }
    for (let i = 0; i < documentsList.length; i++) {
      try {
        this.devToolsServices.openToast(0, `Start saving documents N°${i + 1}/${documentsList.length}`);
  
        await this.gedService.saveListDocuments(documentsList[i].data.uploadedFiles, documentsList[i].data.documentsLoanDTO).toPromise()
          .then((value1) => {
            this.devToolsServices.openToast(0, `document N°${i + 1} saved successfully`);
          })
          .catch((error) => {
            this.devToolsServices.openToast(1, `Error document N°${i + 1} not saved`);
          });
        await this.dbService.delete('documents', documentsList[i].id).toPromise()
          .then(() => {
            console.log('Document deleted successfully');
          })
          .catch((error) => {
            console.error('Error deleting document:', error);
          });
      } catch (err) {
        console.error(`Error saving document ${documentsList[i].id}: `, err);
      }
    }
   }
  
   async synchronizeNotes(category,elementId){
  
    if(elementId){
    const key = category === AcmConstants.COLLECTION_CATEGORY ? 'collectionNote_' + elementId : 'loanNote_' + elementId;
    const notes = await this.dbService.getByKey('notes',key).toPromise() as any;
  
    for(let i = 0; i<notes?.elementNote?.length; i++) {
      try {
        this.devToolsServices.openToast(0, `Start saving note N°${i + 1}/${notes.elementNote.length}`);
        if(category === AcmConstants.COLLECTION_CATEGORY){
        await this.collectionServices.createNewCollectionNote(notes.elementNote[i]).toPromise().then(()=>{
          this.devToolsServices.openToast(0, `collection note N°${i + 1} saved successfully`);
         this.dbService.delete('notes',key).toPromise();
        })
      } else {
        this.customerNotesService.saveNote(notes.elementNote[i]).toPromise().then(()=>{
          this.devToolsServices.openToast(0, `loan note N°${i + 1} saved successfully`);
          this.dbService.delete('notes',key).toPromise();
        })
      }
      } catch (error){
        this.devToolsServices.openToast(1, `Error saving collection note ${elementId}`);
      }
    }
  }
  // else{
  // const notes = await this.dbService.getAll('notes').toPromise() as any[];
  
  // for(let i =0 ; i < notes.length ; i++){
  
  //  for(let j=0 ; j < notes[i].collectionNote.length; j++){
  //   try {
  //   this.devToolsServices.openToast(0, `Start saving collection note N°${j + 1}/${notes[i].collectionNote.length}`);
  //   await this.collectionServices.createNewCollectionNote(notes[i].collectionNote[j]).toPromise().then(()=>{
  //     this.devToolsServices.openToast(0, `collection note N°${j + 1} saved successfully`);
  //     this.dbService.delete('collection-notes',notes[i].collectionNote[j].collectionId).toPromise();
  //   })
  // } catch (error){
  //   this.devToolsServices.openToast(1, `Error saving collection note ${notes[i].collectionNote[j].collectionId}`);
  // }
  //  }}}
  }

  async synchronizeTasks(category,elementId){
    if(elementId){
      const key = category === AcmConstants.COLLECTION_CATEGORY ? 'collectionTask_' + elementId : 'loanTask_' + elementId;
      const tasks = await this.dbService.getByKey('tasks',key).toPromise() as any;

      for(let i = 0; i < tasks?.elementTasks?.length; i++) {
        try {
          this.devToolsServices.openToast(0, `Start saving task N°${i + 1}/${tasks.elementTasks.length}`);

          await this.crmService.create(tasks.elementTasks[i]).toPromise().then(data => {
            this.devToolsServices.openToast(0, `task N°${i + 1} saved successfully`);
            this.dbService.delete('tasks',key).toPromise();
          });
        
        } catch (error){
          this.devToolsServices.openToast(1, `Error saving task :  ${elementId}`);
        }
      }
    }
  }

  async synchronizeCollaterals(loanId){

    const loanCollaterals = await this.dbService.getByKey('collaterals',loanId).toPromise() as any;

      for(let i = 0; i < loanCollaterals?.loanCollateral?.length; i++) {
        try {
          this.devToolsServices.openToast(0, `Start saving collateral N°${i + 1}/${loanCollaterals.loanCollateral.length}`);

          await this.collateralStepService.saveUpdateDelete(loanCollaterals.loanCollateral[i]).toPromise();
            this.devToolsServices.openToast(0, `collateral N°${i + 1} saved successfully`);
          await this.dbService.delete('collaterals',loanId).toPromise();
        
        } catch (error){
          this.devToolsServices.openToast(1, `Error saving collateral :  ${loanId}`);
        }
      }
  }

  async synchronizeConditionnalApproves(loanId){

    const conditionalApproves = await this.dbService.getByKey('conditionalApproves',loanId).toPromise() as any;
    if(conditionalApproves !== undefined){
      const conditionnalAprroveList = conditionalApproves.conditionalApproves;
        try {
           for(let i =0 ; i < conditionnalAprroveList.length ; i++){
            await this.crmService.create(conditionnalAprroveList[i].calendarEventApprove).toPromise().then((data) => {
              conditionnalAprroveList[i].calendarEventApprove = data;
            })
           }
          this.devToolsServices.openToast(0, 'Start saving conditionnal approve ');

            await this.conditionnalApproveService.create(conditionnalAprroveList).toPromise();
            this.devToolsServices.openToast(0, 'conditionnal approve saved successfully');
            await this.dbService.delete('conditionalApproves',loanId).toPromise();
        
        } catch (error){
          this.devToolsServices.openToast(1, `Error saving conditionnal approve :  ${loanId}`);
        }
      }
  }

  async synchronizeGuarantors(loan: LoanEntity) {
    const guarantors = await this.dbService.getByKey('guarantors', loan.loanId).toPromise() as any;

    if (guarantors !== undefined && guarantors.guarantors.length > 0) {
        try {
            this.devToolsServices.openToast(0, `Start saving Guarantors for loan: ${loan.loanId}`);

            loan.guarantors = guarantors.guarantors;

            const savePromises = guarantors.guarantors.map(async (guarantor, index) => {
                if (!guarantor.id) {

                  const newCustomer = await this.dbService.getByKey('customers', guarantor.itemId).toPromise() as CustomerEntity;
                    if (newCustomer) {
                        // Save the customer
                        const savedCustomer = await this.customerManagementService.saveForApplication(newCustomer).toPromise();
                        
                        loan.guarantors[index] = savedCustomer;
                        await this.dbService.delete('customers', guarantor.itemId).toPromise();
                    } else {
                        throw new Error(`Customer with itemId ${guarantor.itemId} not found.`);
                    }
                }
            });

            await Promise.all(savePromises);
            await this.customerListService.addGuarantors(loan).toPromise();
            this.devToolsServices.openToast(0, `Guarantors saved successfully for loan: ${loan.loanId}`);
            await this.dbService.delete('guarantors', loan.loanId).toPromise();

        } catch (error) {
            console.error(`Error saving guarantors for loan ${loan.loanId}:`, error);
            this.devToolsServices.openToast(1, `Error saving guarantors for loan: ${loan.loanId}`);
        }
    } else {
        console.warn(`No guarantors found for loan: ${loan.loanId}`);
    }
}


  // move loan to next step in offline mode
 async  moveLoanNextStep(loan){
  let loansList = await this.dbService.getByKey('loans-pagination','loans-pagination-status-' + this.statusTab).toPromise() as LoanPaginationEntity;

  const sortedInstances = loan.loanInstancesDtos.sort((a, b) => a.orderEtapeProcess - b.orderEtapeProcess);
  const currentIndex = sortedInstances.findIndex(instance => instance.code === loan.etapeWorkflow);
  const nextInstance = sortedInstances[currentIndex + 1];
  loan.statutWorkflow = nextInstance.code;
  loan.etapeWorkflow = nextInstance.code;
  loan.statutLibelle = nextInstance.libelle;
  loan.statut = nextInstance.codeStatutLoan;
  loan.ihmRoot = nextInstance.ihmRoot;
  loan.stepName = nextInstance.libelle;

  loansList.resultsLoans = loansList.resultsLoans.filter((loan)=> { return loan.loanId !== this.loan.loanId});
  loansList.resultsLoans.unshift(loan);
  await this.dbService.update('loans-pagination', loansList).toPromise();
  
  return loan;
}

  /**
   * synchronize title with i18n
   * @param title string
   * @returns string
   */
  getTitle(title: string) {
    this.translate.get('customer_management.' + title).subscribe((value) => {
      title = value;
    });
    return title;
  }

  /**
   * create the formGroup for form in parameter
   * @param form acmIhmFormEntity
   * @returns acmIhmFormEntity
   */
  createIhmForm(form) {
    const f: FormGroup = this.formBuilder.group({});
    form.acmIhmFields = form.acmIhmFields.sort((a, b) => (a.ordre < b.ordre ? -1 : 1)).filter(a => a.habilitation !== AcmConstants.HIDE);
    form.acmIhmFields.forEach(field => {
      if (field.formControlName === '') {
        //  personnaliser un "control Form with its validators" pour ce field
      } else {
        f.addControl(field.formControlName, new FormControl(field.defaultValue));
        if (field.habilitation !== AcmConstants.DISABLE && field.validators != null) {
          field.validators.forEach(validator => {
            const c = field.formControlName;
            switch (validator.typeValidator) {
              case AcmConstants.PATTERN_REGEXP: {
                if (validator.parameter !== null) {
                  const mask = new RegExp('\\b' + validator.parameter + '\\b');
                  const validators: ValidatorFn[] = !!f.controls[c].validator ? [f.controls[c].validator, customPatternValidator(mask)] :
                    [customPatternValidator(mask)];
                  f.controls[c].setValidators(validators);
                }
                break;
              }
              case AcmConstants.PATTERN_STRING: {
                if (validator.parameter !== null) {
                  const patternRegExp = new RegExp(validator.parameter);
                  const validators: ValidatorFn[] = !!f.controls[c].validator ? [f.controls[c].validator,
                  customPatternValidator(patternRegExp)] : [customPatternValidator(patternRegExp)];
                  f.controls[c].setValidators(validators);
                }
                break;
              }
              case AcmConstants.REQUIRED: {
                // si typeField === date et il est required => ne pas creer le validator car nous ne traitons pas les
                // formControl de type date dans notre HTML
                if (field.typeField !== AcmConstants.DATE_TYPE) {
                  const validators: ValidatorFn[] = !!f.controls[c].validator ? [f.controls[c].validator, customRequiredValidator] :
                    [customRequiredValidator];
                  f.controls[c].setValidators(validators);
                }
                field.required = true;
                break;
              }
              case AcmConstants.EMAIL: {
                const validators: ValidatorFn[] = !!f.controls[c].validator ? [f.controls[c].validator, Validators.email] :
                  [Validators.email];
                f.controls[c].setValidators(validators);
                break;
              }
              case AcmConstants.MIN: {
                if (validator.parameter !== null) {
                  const validators: ValidatorFn[] = !!f.controls[c].validator ? [f.controls[c].validator,
                  Validators.min(validator.parameter)] : [Validators.min(validator.parameter)];
                  f.controls[c].setValidators(validators);
                }
                break;
              }
              case AcmConstants.MAX: {
                if (validator.parameter !== null) {
                  const validators: ValidatorFn[] = !!f.controls[c].validator ? [f.controls[c].validator,
                  Validators.max(validator.parameter)] :
                    [Validators.max(validator.parameter)];
                  f.controls[c].setValidators(validators);
                }
                break;
              }
              case AcmConstants.MAX_LENGTH: {
                if (validator.parameter !== null) {
                  const validators: ValidatorFn[] = !!f.controls[c].validator ? [f.controls[c].validator,
                  Validators.maxLength(validator.parameter)] : [Validators.maxLength(validator.parameter)];
                  f.controls[c].setValidators(validators);
                }
                break;
              }
              default:
                break;
            }
          });
        }
        // set field title translated and translate it if language changed
        const titleNotTranslated: string = field.titre;
        field.titre = this.getTitle(titleNotTranslated);
        this.translate.onLangChange.subscribe(() => {
          field.titre = this.getTitle(titleNotTranslated);
        });
      }
      /** BEGIN :manage habilitation of html fields */
      if (field.habilitation === AcmConstants.HIDE) {
        field.enableHabilitation = false;
        field.hiddenHabilitation = true;
      } else if (field.habilitation === AcmConstants.ENABLE) {
        field.enableHabilitation = true;
        field.hiddenHabilitation = false;
      } else if (field.habilitation === AcmConstants.DISABLE) {
        field.enableHabilitation = false;
        field.hiddenHabilitation = false;
      } else {
        field.enableHabilitation = true;
        field.hiddenHabilitation = false;
      }
      /** END :manage habilitation of html fields */
    });
    form.formGroup = f;
    return form;
  }

  /**
   * get Loader
   */
  getLoader(): boolean {
    if (checkOfflineMode())
      return false;
    return this.loader;
  }

  /**
   * set Loader
   * @param value boolean
   */
  setLoader(value: boolean) {
    this.loader = value;
  }

  /**
   * getAuthorized
   */
  getAuthorized() {
    return this.authorized;
  }

  /**
   * setAuthorized
   * @param value boolean
   */
  setAuthorized(value: boolean) {
    this.authorized = value;
  }

  /**
   * check if the year in parameter is leap
   * @param year number
   * @returns boolean
   */
  yearIsLeap(year: number) {
    return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
  }

  /**
   * return the number of leap years between two dates
   * @param date1 Date
   * @param date2 Date
   * @returns number
   */
  getNumberOfLeapYearsBetweenYears(date1: Date, date2: Date): number {
    // init returned value of number of leap years found
    let nbLeapYears = 0;
    // variable will be used in the iteration of do{}while() loop
    let indexedYear = date1.getFullYear();
    do {
      // if indexYear = year of date1 or indexYear = year of date 2
      if ((indexedYear === date1.getFullYear() && date1.getMonth() <= 2) ||
        (indexedYear === date2.getFullYear() && date2.getMonth() >= 2)) {
        if (this.yearIsLeap(indexedYear)) {
          nbLeapYears++;
        }
      } else if (indexedYear !== date1.getFullYear() && indexedYear !== date2.getFullYear()) {
        if (this.yearIsLeap(indexedYear)) {
          nbLeapYears++;
        }
      }
      indexedYear++;
    } while (indexedYear <= date2.getFullYear());
    // get out of the loop if indexYeay = year of date 2
    return nbLeapYears;
  }
  /**
   * rootingCollectionUrlByStatut
   */
  rootingCollectionUrlByStatut(sourceComponent: string) {
    if (this.collection.pendingCollectionInstance === undefined) {
      this.getPendingCollectionInstance(this.collection);
    }
    this.router.navigate(['acm/' + this.collection.pendingCollectionInstance.ihmRoot], { queryParams: { source: sourceComponent } });
  }
  /**
   *  get pending collection instance
   * @param collection CollectionEntity
   * @returns CollectionEntity
   */
  getPendingCollectionInstance(collection: CollectionEntity) {
    if (collection.collectionInstancesDtos.length > 0) {
      const date = new Date()
      if (String(collection.availableDate).indexOf('-') !== -1) {
        const year = String(collection.availableDate).substring(0, 4);
        const month = String(collection.availableDate).substring(5, 7);
        const day = String(collection.availableDate).substring(8, 10);
        collection.availableDate = new Date(year + '-' + month + '-' + (Number(day)));
      }
      if (date >= collection.availableDate) {
        collection.pendingCollectionInstance = collection.collectionInstancesDtos.find(
          step => step.idAcmCollectionStep === collection.idAcmCollectionStep
        );
      }
      else {
        collection.collectionInstancesDtos.sort((a, b) => a.idAcmCollectionStep - b.idAcmCollectionStep);
        if (collection.collectionInstancesDtos[0].idAcmCollectionStep === collection.idAcmCollectionStep) {
          collection.pendingCollectionInstance = collection.collectionInstancesDtos[0];
        } else {
          const waitingProcess: CollectionProcessEntity = collection.collectionInstancesDtos.find(
            step => step.idAcmCollectionStep === collection.idAcmCollectionStep
          );
          collection.pendingCollectionInstance = collection.collectionInstancesDtos.find(
            step => step.orderEtapeProcess === waitingProcess.orderEtapeProcess - 1
          );
        }
      }
      // set actual step libelle (to be used in complete action => save collection note)
      // collection.actualStepLibelle = collection.pendingCollectionInstance.libelle;
    }
    return collection;
  }
  exitFromLoan(loan: LoanEntity) {
    if (loan.parentId === 0) {
      if (this.screenSource === 'planning') {
        this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.TASK_URL);
      }
      else if (this.screenSource === 'calendar') {
        this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.CALENDAR_URL);
      }
      else {
        this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.DASHBOARD_URL);
      }
    } else {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.EXIT_FORM_MSG)
        .afterClosed().subscribe(res => {
          if (res) {
            if (this.getLoanGroupe() !== null) {
              this.openLoan(this.getLoanGroupe()).then(() => {
                this.router.navigate([AcmConstants.CUSTOMER_GROUPE_URL]);
              });
            } else {
              this.router.navigate([AcmConstants.DASHBOARD_URL]);
            }

          }
        });
    }
  }

  /**
   * get Type mimes
   */
  geTypeMimesOnlyCSV(): string[] {
    return this.typeMimesOnlyCSV;
  }

  /**
   * get Type mimes
   */
  setTypeMimesOnlyCSV(value: string[]) {
    this.typeMimesOnlyCSV = value;
  }
  /**
   * getProspect
   */
  getProspect(): ProspectEntity {
    return this.prospect;
  }

  /**
   * setProspect
   */
  setProspect(value: ProspectEntity) {
    this.prospect = value;
  }


    /**
   * getInvalidCustomerAge
   */
    getValidCustomerAge(): boolean {
      return this.validCustomerAge;
    }

    /**
     * setInvalidCustomerAge
     */
    setValidCustomerAge(value: boolean) {
      this.validCustomerAge = value;
    }


    getAcmAmlCheck(): AcmAmlCheckEntity {
      return this.acmAmlCheck;
    }

    setAcmAmlCheck(acmAmlCheck:AcmAmlCheckEntity) {
      this.acmAmlCheck = acmAmlCheck;
    }

    getAcmDoubtfulLoanAnalytics(): AcmDoubtfulLoanAnalyticsEntity {
      return this.acmDoubtfulLoanAnalyticsEntity;
    }

    setAcmDoubtfulLoanAnalytics(acmDoubtfulLoanAnalyticsEntity:AcmDoubtfulLoanAnalyticsEntity) {
      this.acmDoubtfulLoanAnalyticsEntity = acmDoubtfulLoanAnalyticsEntity;
    }


    setAmlDetails(amlDetails){
      this.amlDetails = amlDetails;
    }

    getAmlDetails(){
      return this.amlDetails;
    }

    setAcmAmlChecksDTOs(acmAmlChecksDTOs : AcmAmlCheckEntity[]){
      this.acmAmlChecksDTOs = acmAmlChecksDTOs;
    }

    getAcmAmlChecksDTOs(){
      return this.acmAmlChecksDTOs;
    }

    setCollectionsKey(collectionKey){
      this.collectionKey = collectionKey;
    }

    getCollectionsKey(){
      return this.collectionKey;
    }

    setStatusTab(statusTab){
      this.statusTab = statusTab;
    }

    getStatusTab(){
      return this.statusTab;
    }

    // Getter and setter for loanPaginationOffline
getLoanPaginationOffline(): LoanPaginationEntity {
  return this.loanPaginationOffline;
}

setLoanPaginationOffline(loanPaginationOffline: LoanPaginationEntity): void {
  this.loanPaginationOffline = loanPaginationOffline;
}

// Getter and setter for customersPaginationOffline
getCustomersPaginationOffline(): CustomerPaginationEntity {
  return this.customersPaginationOffline;
}

setCustomersPaginationOffline(customersPaginationOffline: CustomerPaginationEntity): void {
  this.customersPaginationOffline = customersPaginationOffline;
}

// Getter and setter for collectionPaginationOffline
getCollectionPaginationOffline(): CollectionPaginationEntity {
  return this.collectionPaginationOffline;
}

setCollectionPaginationOffline(collectionPaginationOffline: CollectionPaginationEntity): void {
  this.collectionPaginationOffline = collectionPaginationOffline;
}

// Getter and setter for legalPaginationOffline
getLegalPaginationOffline(): CollectionPaginationEntity {
  return this.legalPaginationOffline;
}

setLegalPaginationOffline(legalPaginationOffline: CollectionPaginationEntity): void {
  this.legalPaginationOffline = legalPaginationOffline;
}
 
 async setTranslationOffline(lang:string){
 await this.dbService.getByKey('data','translation_' + lang ).toPromise().then((res:any)=>{
    if(res){
      this.translate.setTranslation(lang,res.data);
    }
  })
 }

}
