import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { SettingLevelEntity } from '../../../shared/Entities/settingLevel.entity';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SettingSMSEntity } from 'src/app/shared/Entities/SettingSMS.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { CustomerListService } from '../../Customer/customer-list/customer-list.service';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionServices } from '../../Collection/collection.services';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { CollectionProcessEntity } from 'src/app/shared/Entities/CollectionProcess.entity';

@Component({
  selector: 'app-setting-sms',
  templateUrl: './setting-sms.component.html',
  styleUrls: ['./setting-sms.component.sass']
})
export class SettingSMSComponent implements OnInit {

  public settingSMSFilter :  SettingSMSEntity = new  SettingSMSEntity() ;
  public setting_SMS1: SettingSMSEntity = new SettingSMSEntity();
  public setting_SMS: SettingSMSEntity = new SettingSMSEntity();
  public settingSMS: SettingSMSEntity[] = [];
  public popupForm: FormGroup;
  public updateId = 0;
  public categoryList: string[];
  public KeywordsList: string[]
  public Keywords : string[];
  public selectedKeywords:string;
  public selectedKeyword:boolean;
  public Keyword:string;
  public pageSize: number;
  public page: number;
  public checksms:boolean=true;

   loanKeys :LoanEntity = new LoanEntity();
   customerKeys : CustomerEntity = new CustomerEntity();
   collectionKeys : CollectionEntity = new CollectionEntity();
  

  /**
   * @param customerListService CustomerListService
   * @param settingsService SettingsService
   * @param translate TranslateService
   * @param formBuilder FormBuilder
   * @param modalService NgbModal
   * @param devToolsServices AcmDevToolsServices
   * @param library FaIconLibrary
   */
  constructor(public settingsService: SettingsService,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    public modalService: NgbModal,
    public devToolsServices: AcmDevToolsServices,
    public library: FaIconLibrary,
    public customerListService:CustomerListService,
    public collectionService:CollectionServices) { }

 async ngOnInit() {
    this.categoryList = [AcmConstants.LOAN,AcmConstants.COLLECTION,AcmConstants.LEGAL,AcmConstants.TOPUP];
    this.KeywordsList =[AcmConstants.LOAN,AcmConstants.CUSTOMER,AcmConstants.Collection];
    this.pageSize = 5;
    this.page = 1;
    await this.loadSettingSMS();
    this.createKeywordsList();
  }
  loadSettingSMS() {
    this.settingsService.findAllSettingSMS(this.settingSMSFilter).subscribe((data) => {
      this.settingSMS = data;
    });
  }

  openLarge(content, settingSMSEntity: SettingSMSEntity) {
    console.log(settingSMSEntity);
    
    this.createForm(settingSMSEntity);
    if (settingSMSEntity.idAcmTemplateSMS != null) {
      this.setting_SMS = settingSMSEntity;
    }
    this.modalService.open(content, {
      size: 'lg'
    });
    if (settingSMSEntity.idAcmTemplateSMS == undefined) {
      this.updateId = 0;
    }
    else { this.updateId = 1; }
  }

  /**
 * Create Form.
 * @param settingSMSEntity SettingSMSEntity
 */
  createForm(settingSMSEntity) {
    this.popupForm = this.formBuilder.group({
      codeSMSEvent: [settingSMSEntity.codeSMSEvent, [Validators.required]],
      messageBody: [settingSMSEntity.messageBody, Validators.required],
      selectedCategory: [settingSMSEntity.category, Validators.required],
      selectedKeywords: [],
      selectedKey:[]
    });
  }



   checkSMSValid(){
    for (const entity of this.settingSMS) {
      if (entity.codeSMSEvent === this.popupForm.controls.codeSMSEvent.value) {
        this.checksms = false;
        this.devToolsServices.openToast(3, 'alert.existing_event_code');
        break;
      }
    }
   }

  onListSelectionChange(selectedCategory: string){
      this.selectedKeywords=selectedCategory;
      if(selectedCategory==='collection'){
      this.Keywords = Object.keys(this.collectionKeys);
      this.selectedKeyword=true;
      }
      else if (selectedCategory==='loan') {
        this.Keywords = Object.keys(this.loanKeys);
        this.selectedKeyword=true;
      } 
      else if (selectedCategory==='customer'){
        this.Keywords = Object.keys(this.customerKeys);
        this.selectedKeyword=true;
      }
  }

  filterCollectionEntity(entity: CollectionEntity): CollectionEntity {
    const filteredEntity: Partial<CollectionEntity> = {};

    for (const key in entity) {
      if (entity.hasOwnProperty(key)) {
        const value = entity[key];

        if (typeof value === 'string' || typeof value === 'boolean' || value instanceof Date || typeof value === 'number') {
          // Ajoutez cette propriété au nouvel objet filtré
          filteredEntity[key] = value;
        }
      }
    }

    // Utilisez 'as' pour indiquer que le type est CustomerEntity
    return filteredEntity as CollectionEntity;
  }



  filterCustomerEntity(entity: CustomerEntity): CustomerEntity {
    const filteredEntity: Partial<CustomerEntity> = {};

    for (const key in entity) {
      if (entity.hasOwnProperty(key)) {
        const value = entity[key];

        if (typeof value === 'string' || typeof value === 'boolean' || value instanceof Date || typeof value === 'number') {
          // Ajoutez cette propriété au nouvel objet filtré
          filteredEntity[key] = value;
        }
      }
    }

    // Utilisez 'as' pour indiquer que le type est CustomerEntity
    return filteredEntity as CustomerEntity;
  }



  filterLoanEntity(entity: LoanEntity): LoanEntity {
    const filteredEntity: Partial<LoanEntity> = {};

    for (const key in entity) {
      if (entity.hasOwnProperty(key)) {
        const value = entity[key];

        if (typeof value === 'string' || typeof value === 'boolean' || value instanceof Date || typeof value === 'number') {
          // Ajoutez cette propriété au nouvel objet filtré
          filteredEntity[key] = value;
        }
      }
    }

    // Utilisez 'as' pour indiquer que le type est LoanEntity
    return filteredEntity as LoanEntity;
  }


  updateMessageBody(selectedValue: string) {
    const currentMessageBody = this.popupForm.get('messageBody').value;

    let updatedMessageBody = currentMessageBody || '';
    if (selectedValue) {
      updatedMessageBody +=' ${'+this.selectedKeywords+ '.' + selectedValue + '}';
    }
    this.popupForm.get('messageBody').setValue(updatedMessageBody);

  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }


  closeModale() {
    this.modalService.dismissAll();
  }


  onSubmit() {
    if (this.popupForm.valid ) {
      if (this.updateId !== 0) {
              this.setting_SMS.messageBody = this.popupForm.controls.messageBody.value;
              this.setting_SMS.category = this.popupForm.controls.selectedCategory.value;
              this.setting_SMS.codeSMSEvent = this.popupForm.controls.codeSMSEvent.value;
              this.settingsService.updateSettingSMS(this.setting_SMS).subscribe(() => {
                this.loadSettingSMS();
                this.modalService.dismissAll();
                this.updateId = 0;
                this.devToolsServices.openToast(0, 'alert.success');
              });
      }
      else {
        this.checkSMSValid();
          if(this.checksms){
              const settingSMS: SettingSMSEntity = new SettingSMSEntity();
              settingSMS.codeSMSEvent = this.popupForm.controls.codeSMSEvent.value;
              settingSMS.messageBody = this.popupForm.controls.messageBody.value;
              settingSMS.category = this.popupForm.controls.selectedCategory.value;
              this.settingsService.saveSettingSMS(settingSMS).subscribe(() => {
                this.loadSettingSMS();
                this.modalService.dismissAll();
                this.updateId = 0;
                this.devToolsServices.openToast(0, 'alert.success');
              });
            }
      }

    }
  }
  createKeywordsList(){
    //fill loan keys
    this.loanKeys.loanId = 0;
    this.loanKeys.applyAmountTotal = 0;
    this.loanKeys.approvelAmount = 0;
    this.loanKeys.applyDate = '';
    this.loanKeys.cuLoanReFinanceReason = '';
    this.loanKeys.currencyId = '';
    this.loanKeys.gracePeriod = '';
    this.loanKeys.industryCode = 0;
    this.loanKeys.industryCodeDescription = '';
    this.loanKeys.issueDate = new Date();
    this.loanKeys.loanSourceOffunds = '';
    this.loanKeys.portfolioId = '';
    this.loanKeys.productId = 0;
    this.loanKeys.processInstanceId = 0;
    this.loanKeys.idLoanExtern = '';
    this.loanKeys.statut = '';
    this.loanKeys.idAccountExtern = 0;
    // this.loanKeys.accountNumberExtern = '';
    this.loanKeys.accountNumber = '';
    this.loanKeys.creationDate = '';
    this.loanKeys.termPeriodNum = 0;
    this.loanKeys.paymentPeriod = '';
    this.loanKeys.paymentFreq = 0;
    this.loanKeys.issueFeeAmount = 0;
    this.loanKeys.productCode = '';
    this.loanKeys.productDescription = '';
    this.loanKeys.productRate = 0;
    this.loanKeys.customerId = 0;
    this.loanKeys.loanReasonId = 0;
    this.loanKeys.loanReasonCode = '';
    this.loanKeys.loanReasonDescription = '';
    this.loanKeys.portfolioCode = '';
    this.loanKeys.portfolioDescription = '';
    this.loanKeys.currencySymbol = '';
    this.loanKeys.currencyDecimalPlaces = '';
    this.loanKeys.customerName = '';
    this.loanKeys.customerNameNoPipe = '';
    this.loanKeys.owner = '';
    this.loanKeys.ownerName = '';
    this.loanKeys.statutLibelle = '';
    this.loanKeys.statutWorkflow = 0;
    this.loanKeys.etapeWorkflow = 0;
    this.loanKeys.workflowNextAction = '';
    this.loanKeys.pourcentage = '';
    this.loanKeys.ihmRoot = '';
    this.loanKeys.note = '';
    this.loanKeys.dateLastUpdate = new Date();
    this.loanKeys.contactDateCustomerDecision = new Date();
    this.loanKeys.commentsCustomerDecision = '';
    this.loanKeys.confirm = false;
    this.loanKeys.normalPayment = '';
    this.loanKeys.codeExternMotifRejet = 0;
    this.loanKeys.category = '';
    this.loanKeys.loanCalculationMode = 0;
    this.loanKeys.listMissingData = [];
    this.loanKeys.customerDTO = new CustomerEntity();
    this.loanKeys.customerType = '';
    this.loanKeys.parentId = 0;
    this.loanKeys.approvelAmountGroupe = 0;
    this.loanKeys.childMissingInfo = false;
    this.loanKeys.initialPaymentDate = new Date();
    this.loanKeys.ignoreOddDays = false;
    this.loanKeys.communityCULoanID = 0;
    this.loanKeys.guarantorSourceId = 0;
    this.loanKeys.sourceOfFundsID = 0;
    this.loanKeys.refinanceReasonId = 0;
    this.loanKeys.districtCodeId = 0;
    this.loanKeys.interestFreq = 0;
    this.loanKeys.intPayPeriodNum = 0;
    this.loanKeys.termPeriodID = 0;
    this.loanKeys.loanInstancesDtos = [];
    this.loanKeys.userDefinedFieldsLinksDTOs = [];
    this.loanKeys.updateLoan = false;
    this.loanKeys.branchID = 0;
    this.loanKeys.branchDescription = '';
    this.loanKeys.branchName = '';
    this.loanKeys.periodsDeferred = 0;
    this.loanKeys.periodsDeferredType = 0;
    this.loanKeys.assignCustomer = false;
    this.loanKeys.guarantors = [];
    this.loanKeys.apr = 0;
    this.loanKeys.effectiveIntRate = 0;
    this.loanKeys.productDTO = new ProductEntity();
    this.loanKeys.changed = false;
    this.loanKeys.groupOwner = '';
    this.loanKeys.groupOwnerName = '';
    this.loanKeys.collaterals = [];
    this.loanKeys.feeAmt1 = 0;
    this.loanKeys.updateLoanAbacus = false;
    this.loanKeys.stepName = '';
    this.loanKeys.workFlowAction = '';
    this.loanKeys.loanApplicationStatus = '';
    this.loanKeys.openingBalance = 0;
    this.loanKeys.loanAssetsDtos = [];
    this.loanKeys.quantitySupplier = 0;
    this.loanKeys.balanceSupplier = 0;
    this.loanKeys.isOwnerOrValidator = false;
    this.loanKeys.reviewFrom = 0;
    this.loanKeys.totalInterest = 0;
    this.loanKeys.personalContribution = 0;
    this.loanKeys.workflowCompleted = false;
    this.loanKeys.reviewOnlySelectedStep = false;
    this.loanKeys.idIbLoan = 0;
    this.loanKeys.otherInformations = '';
    this.loanKeys.customRate = 0;

    //fill customer keys 
    this.customerKeys.id = 0;
    this.customerKeys.customerIdExtern = 0;
    this.customerKeys.customerNumber = '';
    this.customerKeys.customerName = '';
    this.customerKeys.customerNameNoPipe = '';
    this.customerKeys.firstName = '';
    this.customerKeys.secondName = '';
    this.customerKeys.middleName = '';
    this.customerKeys.lastName = '';
    this.customerKeys.customerOpenDate = '';
    this.customerKeys.dateOfBirth = new Date();
    this.customerKeys.dateOfBirthHijri = '';
    this.customerKeys.accountPortfolioID = '';
    this.customerKeys.accountPortfolioCode = '';
    this.customerKeys.accountPortfolioDescription = '';
    this.customerKeys.altName = '';
    this.customerKeys.customerAddress = '';
    this.customerKeys.branchId = 0;
    this.customerKeys.branchesName = '';
    this.customerKeys.branchesDescription = '';
    this.customerKeys.age = 0;
    this.customerKeys.arrearDay = 0;
    this.customerKeys.arrearSchedule = 0;
    this.customerKeys.telephone1 = '';
    this.customerKeys.telephone2 = '';
    this.customerKeys.telephone3 = '';
    this.customerKeys.customerType = '';
    this.customerKeys.customerCategory = '';
    this.customerKeys.organisationId = 0;
    this.customerKeys.groupeId = 0;
    this.customerKeys.telephone = '';
    this.customerKeys.fax = '';
    this.customerKeys.registerNumber = '';
    this.customerKeys.webSite = '';
    this.customerKeys.sector = '';
    this.customerKeys.organisationIdExtern = '';
    this.customerKeys.email = '';
    this.customerKeys.gender = '';
    this.customerKeys.organizationName = '';
    this.customerKeys.accountYearEnd = new Date();
    this.customerKeys.customerLinksRelationshipDTOs = [];
    this.customerKeys.customerLinksDTOs = [];
    this.customerKeys.solidarityName = '';
    this.customerKeys.listAddress = [];
    this.customerKeys.updateCustomer = false;
    this.customerKeys.isCustomer = false;
    this.customerKeys.userDefinedFieldsLinksDTOs = [];
    this.customerKeys.amountGuarantor = 0;
    this.customerKeys.listUDF = [];
    this.customerKeys.guarantors = [];
    this.customerKeys.listUDFGroup = [];
    this.customerKeys.expiryHijryDate = null;
    this.customerKeys.identity = '';
    this.customerKeys.industryCode = null;
    this.customerKeys.resident = false;
    this.customerKeys.colorCustomerKYC = '';
    this.customerKeys.currentCustomerKYC = 0;
    this.customerKeys.existkyc = false;
    this.customerKeys.thirdPartyHistoriqueKyc = null;
    this.customerKeys.currentCustomerAML = 0;
    this.customerKeys.colorCustomerAml = '';
    this.customerKeys.existaml = false;
    this.customerKeys.thirdPartyHistoriqueAml = null;
    this.customerKeys.currentCustomerISCORE = 0;
    this.customerKeys.colorCustomerISCORE = '';
    this.customerKeys.existISCORE = false;
    this.customerKeys.thirdPartyHistoriqueISCORE = null;
    this.customerKeys.customerLinkCategory = '';
    this.customerKeys.maritalStatus = '';
    this.customerKeys.imageGrpOrg = null;
    this.customerKeys.photo = null;
    this.customerKeys.mezaCardId = 0;
    this.customerKeys.disbursementMethodUpdatedToOtherThanMezaCard = false;
    this.customerKeys.mezaCardStatus = '';
    this.customerKeys.acmMezaCardDTO = null;
    this.customerKeys.disbursementMethodSelected = '';
    this.customerKeys.dateInsertion = new Date();
    this.customerKeys.action = '';
    this.customerKeys.enableCriticalData = false;
    this.customerKeys.enabled = false;
    this.customerKeys.ibCustomerId = 0;
    this.customerKeys.udfLinksGroupeFieldsDTOs = [];
    this.customerKeys.isSupplier = false;
    this.customerKeys.beneficialEffective = '';
    this.customerKeys.prospectionSource = '';
    this.customerKeys.prospectionComment = '';
    this.customerKeys.supplierRecommandation = 0;

    //fill collection keys
    this.collectionKeys.id = 0;
    this.collectionKeys.typeCustomer = '';
    this.collectionKeys.accountNumber = '';
    this.collectionKeys.productDescription = '';
    this.collectionKeys.productId = 0;
    this.collectionKeys.customerName = '';
    this.collectionKeys.branchDescription = '';
    this.collectionKeys.branchId = 0;
    this.collectionKeys.currencyDecimalPlaces = 0;
    this.collectionKeys.currencySymbol = '';
    this.collectionKeys.amount = 0;
    this.collectionKeys.loanOfficer = '';
    this.collectionKeys.firstUnpaidInstallment= new Date();
    this.collectionKeys.unpaidAmount = 0;
    this.collectionKeys.lateDays = 0;
    this.collectionKeys.numberOfUnpaidInstallment = 0;
    this.collectionKeys.status = 0;
    this.collectionKeys.idAcmCollectionStep = 0;
    this.collectionKeys.enabled = false;
    this.collectionKeys.dateInsertion = new Date();
    this.collectionKeys.dateLastUpdate = new Date();
    this.collectionKeys.customerIdExtern = 0;
    this.collectionKeys.idLoanExtern = 0;
    this.collectionKeys.collectionInstancesDtos = [];
    this.collectionKeys.availableDate = new Date();
    this.collectionKeys.statutLibelle = '';
    this.collectionKeys.statutLibelleDone = '';
    this.collectionKeys.ownerName = '';
    this.collectionKeys.owner = '';
    this.collectionKeys.collectionType = '';
    this.collectionKeys.idParentCollection = 0;
    this.collectionKeys.acmThirdPartyCollections= [];
    this.collectionKeys.acmParticipantsCollections= [];
    this.collectionKeys.pendingCollectionInstance = new CollectionProcessEntity();
    this.collectionKeys.statutWorkflow = '';
  }
}
