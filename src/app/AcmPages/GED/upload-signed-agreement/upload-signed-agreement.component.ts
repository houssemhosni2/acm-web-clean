import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GedServiceService } from '../ged-service.service';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { AcmConstants } from '../../../shared/acm-constants';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanDocumentEntity } from '../../../shared/Entities/loanDocument.entity';
import { DatePipe } from '@angular/common';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { LoanDetailsServices } from '../../Loan-Application/loan-details/loan-details.services';
import { Router } from '@angular/router';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { LoanCalculateEntity } from 'src/app/shared/Entities/LoanCalculate.entity';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { LoanApprovalService } from '../../Loan-Application/loan-approval/loan-approval.service';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { RenewalConditionLoanEntity } from 'src/app/shared/Entities/renewalConditionLoan.entity';
import { ExceptionRequestService } from '../../Loan-Application/dashbord/exception-request/exception-request.service';
import { SettingsService } from '../../Settings/settings.service';
import { DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { CustomerAccountEntity } from 'src/app/shared/Entities/customer.account.entity';
import { ScheduleService } from '../../Loan-Application/loan-schedule/schedule.service';
import { LoanGuarantorsServices } from '../../Loan-Application/check-guarantor/loan-guarantors/loan-guarantors.services';
import { UploadItemComponent } from '../upload-item/upload-item.component';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { UdfStepWorkflowComponent } from '../../Loan-Application/udf-step-workflow/udf-step-workflow.component';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import { UdfService } from '../../Loan-Application/udf/udf.service';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { UDFLinksGroupeFieldsEntity } from 'src/app/shared/Entities/udfLinksGroupeFields.entity';
import { UDFLinksGroupeFieldsModelEntity } from 'src/app/shared/Entities/udfLinksGroupeFieldsModel.entity';
import {checkOfflineMode, customRequiredValidator} from '../../../shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-upload-signed-agreement',
  templateUrl: './upload-signed-agreement.component.html',
  styleUrls: ['./upload-signed-agreement.component.sass']
})
export class UploadSignedAgreementComponent implements OnInit, OnDestroy {
  public view: string = AcmConstants.VIEW;
  categoryLoan = 'signed agreement';
  signedDocuments = [];
  allDocuments = [];
  loan: LoanEntity = new LoanEntity();
  loanDTO: LoanEntity = new LoanEntity();
  public feeRepayment = 0;
  expanded = true;
  checkRequiredDocument = false;
  public currentPath = 'upload-signed-agreement';
  public settingMotifReviewEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifReviewEntitys = [];
  public modalForm: FormGroup;
  public confirmReview: boolean;
  public orderProcess: number;
  public currentStatus: number;
  public checkComponentDocVisibily = false;
  public checkComponentCollateralVisibily = false;
  public checkComponentGuarantorVisibily = false;
  public checkComponentFieldVisitVisibily = false;
  public checkComponentFinancialAnalisisVisibily = false;
  public loanProcessEntitys: Array<LoanProcessEntity> = [];
  public apr = 0;
  public irr = 0;
  public checkCalculate = true;
  public calcumationForm: FormGroup;
  public schedules: ScheduleEntity[] = [];
  public loadingCalcule = false;
  public product: ProductEntity = new ProductEntity();
  public isAdminFee = false;
  public confirmApprove: boolean;
  public approveForm: FormGroup;
  public lastLine: ScheduleEntity;
  public minInitialPayementvalue: string;
  public termTrouv = false;
  public amountTrouv = false;
  public page: number;
  public pageSize: number;
  public issued = false;
  public minAmountValidation = 0;
  public maxAmountValidation = 0;
  public minTermValidation = 0;
  public maxTermValidation = 0;
  public minPeriodsValidation = 0;
  public maxPeriodsValidation = 0;
  public limitMinAmountValidation = false;
  public limitMaxAmountValidation = false;
  public limitMinTermValidation = false;
  public limitMaxTermValidation = false;
  public limitMinPeriodsValidation = false;
  public limitMaxPeriodsValidation = false;
  public reviewAgreementsModal = false;
  public settingMotifRejetsEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifRejetsEntitys = [];
  public checkModalReject: boolean;
  public confirmReject: boolean;
  public userConnected: UserEntity = new UserEntity();
  public maximumAllowedAmount: number;
  public activeException = false;
  public acceptedException = false;
  public newExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public customerRenewalCondition: RenewalConditionLoanEntity = new RenewalConditionLoanEntity();
  public acceptedExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public activeRenewalConditionSetting = false;
  public renewelLoanCondition = false;
  minIssueDatevalue: string;
  public feeAmount = 0;
  public updateLoanAbacus = false;
  public approveAction = false;
  public documentsToRemove: LoanDocumentEntity[] = [];
  // public deferedPeriodeSettingTypes = true;
  public reviewAllStepForDraftSteps = true;
  public currencySymbol = '';
  public currentAmount = 0;
  public apportPersonnel = 0;
  public decimalPlaces: string;
  @ViewChild(UploadItemComponent)
  uploadItemComponent: UploadItemComponent;
  public saveFilesAction = true;
  public originSource: string;
  public lengthDocuments: number;
  public checkNavigate = false;
  public displayButtonExecuteApi: boolean = false;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  public checkModalReview: boolean;

  
  public scheduleFlexibleIsChecked : boolean = false;
  /**
   *
   * @param gedService GedServiceService
   * @param devToolsServices AcmDevToolsServices
   * @param loanSharedService SharedService
   * @param datePipe DatePipe
   * @param loanDetailsServices LoanDetailsServices
   * @param router Router
   * @param modalService NgbModal
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   * @param loanManagementService LoanManagementService
   * @param loanApprovalService LoanApprovalService
   * @param customerManagementService CustomerManagementService
   */
  constructor(public gedService: GedServiceService,
    public devToolsServices: AcmDevToolsServices,
    public loanSharedService: SharedService,
    public datePipe: DatePipe,
    public loanDetailsServices: LoanDetailsServices,
    public router: Router,
    public modalService: NgbModal,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    public loanManagementService: LoanManagementService,
    public loanApprovalService: LoanApprovalService,
    public customerManagementService: CustomerManagementService,
    public authentificationService: AuthentificationService,
    public exceptionRequestService: ExceptionRequestService,
    public settingsService: SettingsService,
    public dateFormatterService: DateFormatterService,private dbService: NgxIndexedDBService,
    public scheduleService: ScheduleService, public loanGuarantorsServices: LoanGuarantorsServices,
    public udfService: UdfService) {
  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
  /**
   * get signed agreement
   */
  async ngOnInit() {    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minIssueDatevalue = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.loan = this.loanSharedService.getLoan();
    this.loan.checkMezaCard = false;
    this.loanSharedService.setCustomer(this.loan.customerDTO);
    this.loanDTO.productId = this.loan.productId;
    this.loanDTO.statutWorkflow = this.loan.statutWorkflow;
    this.apportPersonnel = this.loan.personalContribution;
    this.currentAmount = this.loan.approvelAmount + this.apportPersonnel;

    this.pageSize = 5;
    this.page = 1;
    this.userConnected = this.loanSharedService.getUser();
    if(checkOfflineMode()){
      const environments = await this.dbService.getByKey('data', 'envirement-values-by-keys-upload').toPromise() as any;
      if(environments !== undefined){
        const adminFeeEnv = environments.data.filter(item => item.key === AcmConstants.ADMIN_FEE);
        const renewalConditionEnv = environments.data.filter(item => item.key === AcmConstants.RENEWEL_LOAN_CONDITION);
        if(adminFeeEnv.length > 0 && adminFeeEnv[0].value === '1'){
          this.dbService.getByKey('data','getFeeRepayment_' + this.loan.loanId).subscribe((feeRepayment:any)=>{
            this.isAdminFee = true;
            this.feeRepayment = feeRepayment.data;
          })
       }
       if(renewalConditionEnv.length > 0 && renewalConditionEnv[0].value === '1'){
        this.renewelLoanCondition = true;
       }
      }
    } else {
      const acmEnvironmentKeys: string[] = [AcmConstants.ADMIN_FEE, AcmConstants.RENEWEL_LOAN_CONDITION, AcmConstants.DEFERRED_PERIODE_TYPES];
      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
        if (environments[0].value === '1' && this.loanSharedService.useExternalCBS === '1') {
          this.gedService.getFeeRepayment(this.loan.idAccountExtern).subscribe(
            (data) => {
              this.isAdminFee = true;
              this.feeRepayment = data;
            }
          );
        }
        if (environments[1].value === '1') {
          this.renewelLoanCondition = true;
        }
      });
    }
    this.devToolsServices.backTop();
    this.loanProcessEntitys = this.loan.loanInstancesDtos;
    this.loanProcessEntitys.forEach(element => {
      if (element.code === this.loan.etapeWorkflow) {
        this.orderProcess = element.orderEtapeProcess;
      }
      if (element.ihmRoot === this.currentPath) {
        this.currentStatus = element.code;
      }
    });
    this.getComponentVisibility();
    this.checkStatusIssued(this.loan);
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);


    if(!checkOfflineMode()){
    const stepEntity: StepEntity = new StepEntity();
    stepEntity.productId = this.loan.productId;
    stepEntity.idWorkFlowStep = this.loan.etapeWorkflow;
    this.settingsService.findWorkFlowSteps(stepEntity).subscribe((dataStep) => {
      if (dataStep[0].automaticStep
        &&
        (dataStep[0].acceptationCondition !== null || dataStep[0].rejectionCondition !== null)) {
        this.displayButtonExecuteApi = true;
      }
    });
  }
  }

  /**
   * check status if issued in abacus (step ready for disbursement)
   * @param loan loan entity
   */
  checkStatusIssued(loan) {
    if (this.loan.etapeWorkflow === AcmConstants.STATUT_WORKFLOW_DISBURSEMENT_CASE_CLOSURE) {
      this.loanDetailsServices.checkIssuedStatus(loan.idLoanExtern).subscribe((data) => {
        if (data !== null) {
          this.issued = data;
        }
      });
    }
  }

  /**
   * delete document
   * @param any deletedDocument
   */

  /**
   * Display the confirmation message
   */
  onsave() {
    // save udfs
    this.udfStepWorkflowComponent.saveUdfLinks();
    this.save(AcmConstants.COMPLETE_ACTION);

  }

  exit() {
    this.loanSharedService.exitFromLoan(this.loan);
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  /**
   * Methode to next step for Upload Signed Agreement
   */
  async nextStepUploadSignedAgreement() {
    // save udfs
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.udfStepWorkflowComponent.saveUdfLinks();
    }
    else {
      return;
    }
    this.checkNavigate = false;
    // if fee amount != 0 get the new fe eamount value from calculate API
    if (this.feeAmount !== 0) {
      this.loan.feeAmt1 = this.feeAmount;
    }
    if (!this.checkInitialPayment() || !this.checkAgeForProduct()) {
      return;
    }
    // check if all required documents are uploaded and saved
    if (!this.checkRequiredDocument) {
      this.devToolsServices.openToast(3, 'waring.required_document');
      return;
    }
    if (this.loan.customerDTO.mezaCardStatus === AcmConstants.MEZA_STATUS_SENT ||
      this.loan.customerDTO.mezaCardStatus === AcmConstants.MEZA_STATUS_NEW) {
      this.checkMezaCard(AcmConstants.MEZA_STATUS_NEW);
    }
    if (this.loan.customerDTO.mezaCardStatus === AcmConstants.MEZA_STATUS_UNTRUST) {
      this.checkMezaCard(AcmConstants.MEZA_STATUS_UNTRUST);
    }
    if (this.loan.customerDTO.mezaCardStatus === AcmConstants.MEZA_STATUS_TRUST ||
      this.loan.customerDTO.mezaCardStatus === AcmConstants.MEZA_STATUS_NONE) {
      this.checkMezaCard(AcmConstants.MEZA_STATUS_TRUST);
    }

  }

  async checkMezaCard(action: string) {
    if(!checkOfflineMode()){
    const udfLink = new UserDefinedFieldsLinksEntity();
    udfLink.elementId = this.loanSharedService.getCustomer().id;
    udfLink.cutomerType = this.loanSharedService.getCustomer().customerType;
    await this.udfService.getUdfLinkGroupby(udfLink).subscribe(
      (data) => {
        this.processMezaCardStatus(action,data);
      }
    );
  } else {
    await this.dbService.getByKey('data', 'getUdfLinkGroupby_' + this.loanSharedService.getCustomer().id).subscribe((data:any)=>{
      if(data !== undefined){
        this.processMezaCardStatus(action,data.data);
      }
    })
  }
  }

  processMezaCardStatus(action,data){
    for (const userdefinedLinkGroup of data) {
      if (userdefinedLinkGroup.userDefinedFieldGroupName === AcmConstants.BANK_INFORMATION_CODE) {
        userdefinedLinkGroup.udfGroupeFieldsModels.forEach(UDFLinksGroupeFieldsModelEntity => {
          if (UDFLinksGroupeFieldsModelEntity.value === AcmConstants.MEZA_CARD_ARABIC) {
            this.loan.checkMezaCard = true;
            if (action === AcmConstants.MEZA_STATUS_NEW) {
              return this.devToolsServices.openToast(3, 'alert.customer_meza_card_check');

            }
            else if (action === AcmConstants.MEZA_STATUS_UNTRUST) {
              return this.devToolsServices.openToast(3, 'alert.customer_meza_card_untrust');
            }
          }
        })
      }
    }
    if (action === AcmConstants.MEZA_STATUS_TRUST && this.checkRequiredDocument) {
      this.checkNavigate = true;
      this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE;
      this.loan.workFlowAction = AcmConstants.WORKFLOW_REQUEST_ACTION_AGREED_UPLOAD_SIGNED_AGREEMENT;
      this.loan.updateLoanAbacus = this.updateLoanAbacus;
      this.save();
      return;
    }
    if (!this.loan.checkMezaCard && this.checkRequiredDocument) {
      this.checkNavigate = true;
      this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE;
      this.loan.workFlowAction = AcmConstants.WORKFLOW_REQUEST_ACTION_AGREED_UPLOAD_SIGNED_AGREEMENT;
      this.loan.updateLoanAbacus = this.updateLoanAbacus;
      this.save();
      return;
    }
  }

  async BackStep() {
    this.modalService.dismissAll();
    if (this.loan.etapeWorkflow === AcmConstants.STATUT_WORKFLOW_CENTRAL_REVISION) {
      this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_REVIEW_AGREEMENT;
      await this.loanDetailsServices.validate(this.loan).toPromise().then((data) => {
        this.loanSharedService.setLoan(data);
        if (data.etapeWorkflow === AcmConstants.STATUT_WORKFLOW_CENTRAL_REVISION) {
          this.devToolsServices.openToast(3, 'waring.required_document');
        } else {
          this.router.navigate([AcmConstants.DASHBOARD_URL]);
        }
      });
    }
  }

  /**
   * Create from review
   */
  createForm(action: String) {
    if (action === AcmConstants.REVIEW_CATEGORIE) {
      this.modalForm = this.formBuilder.group({
        reason: ['', customRequiredValidator],
        step: ['', customRequiredValidator],
        note: ['', customRequiredValidator],
        confirm: ['', customRequiredValidator],
        reviewAllPreviousSteps: [false]
      });

      // check if force review all step when draf step selected
      if(!checkOfflineMode()){
      const acmEnvironmentKeys: string[] = [AcmConstants.REVIEW_ALL_STEPS_WHEN_DRAFT_SELECTED];
      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
        if (environments[0].enabled === false || environments[0].value === '0') {
          this.reviewAllStepForDraftSteps = false;
        }
      });
    } else {
      this.dbService.getByKey('data', 'envirement-values-by-keys').subscribe((environments:any)=>{
        if(environments !== undefined){
          const env = environments.data.filter(item => item.key === AcmConstants.REVIEW_ALL_STEPS_WHEN_DRAFT_SELECTED);
          if(env.length > 0 && env[0].enabled === false || env[0].value === '0'){
            this.reviewAllStepForDraftSteps = false;
          }
         }
        }) ;   
    }

    } else if (action === AcmConstants.REJECT_CATEGORIE) {
      this.modalForm = this.formBuilder.group({
        reason: ['', customRequiredValidator],
        note: ['', customRequiredValidator],
        confirm: ['', customRequiredValidator]
      });
    }

  }

  /**
   * reviewModale : open Review modal
   * @param content modal
   * @param categories Categories
   */
  async reviewModal(content, categories) {
    if (this.issued) {
      return this.devToolsServices.openToast(3, 'alert.loan_already_issued');
    }
    this.modalService.open(content, {
      size: 'md'
    });
    this.loan = this.loanSharedService.getLoan();
    this.createForm(AcmConstants.REVIEW_CATEGORIE);
    if (categories === AcmConstants.REVIEW_CATEGORIE) {
      this.reviewAgreementsModal = false;
      this.settingMotifReviewEntity.categorie = AcmConstants.REVIEW_CATEGORIE;
    } else if (categories === AcmConstants.REVIEW_AGREEMENTS_CATEGORIE) {
      this.reviewAgreementsModal = true;
      this.settingMotifReviewEntity.categorie = AcmConstants.REVIEW_AGREEMENTS_CATEGORIE;
    }
    if(checkOfflineMode()){
      await this.dbService.getByKey('data', 'getSettingMotif_' + AcmConstants.REVIEW_CATEGORIE ).toPromise().then((data:any)=>{
        if(data !== undefined){
          this.settingMotifReviewEntitys = data.data;
        }
      })
    } else {
    await this.loanDetailsServices.getReason(this.settingMotifReviewEntity).toPromise().then(
      (data) => {
        this.settingMotifReviewEntitys = data;
      }
    );
  }
  this.checkModalReject = false;
  this.checkModalReview = true;
  }

  /**
   * OnSubmit review
   */
  onSubmit() {
    this.loan.note = this.modalForm.value.reason.libelle;
    this.loan.note = this.loan.note + ' : ' + this.modalForm.value.note;
    this.loan.codeExternMotifRejet = this.modalForm.value.reason.codeExternal;

    if (this.modalForm.valid) {

      if (this.checkModalReject) {
        this.loan.confirm = this.confirmReject;
        this.reject();
      } else if(this.checkModalReview) {
        /// Review Action
        this.loan.confirm = this.confirmReview;
        if (this.reviewAgreementsModal) {
          this.BackStep();
        } else {
          this.review();
        }
      }
    }
  }

  /**
   * Methode reject : Reject loan without workflow shemas
   */
  async reject() {
    this.modalService.dismissAll();
    await this.loanDetailsServices.rejectLoan(this.loan).toPromise().then(
      (data) => {
        this.loanSharedService.setLoan(data);
        this.router.navigate([AcmConstants.DASHBOARD_URL]);
      });
  }

  /**
   * changeChecboxReject
   */
  changeChecboxReject() {
    if (this.confirmReject === false) {
      this.confirmReject = true;
    } else {
      this.confirmReject = false;
      this.modalForm.controls.confirm.setValue('');
    }
  }

  /**
   * rejectModale : open reject modal
   * @param content modal
   */
  async rejectModal(content) {
    this.modalService.open(content, {
      size: 'md'
    });
    this.loan = this.loanSharedService.getLoan();
    this.createForm(AcmConstants.REJECT_CATEGORIE);
    this.confirmReject = false;
    if(!checkOfflineMode()){
    this.settingMotifRejetsEntity.categorie = AcmConstants.REJECT_CATEGORIE;
    await this.loanDetailsServices.getReason(this.settingMotifRejetsEntity).toPromise().then(
      (data) => {
        this.settingMotifRejetsEntitys = data;
      }
    );
  } else {
    await this.dbService.getByKey('data', 'getSettingMotif_' + AcmConstants.REJECT_CATEGORIE ).toPromise().then((data:any)=>{
      if(data !== undefined){
        this.settingMotifRejetsEntitys = data.data;
      }
    })
  }
    this.checkModalReject = true;
    this.checkModalReview = false;
  }

  /**
   * confirm button
   */
  changeChecboxReview() {
    if (this.confirmReview === false) {
      this.confirmReview = true;
    } else {
      this.confirmReview = false;
      this.modalForm.controls.confirm.setValue('');
    }
  }

  checkreviewalloption() {
    if (this.reviewAllStepForDraftSteps) {
      if (this.modalForm.controls.step.value.codeStatutLoan > 2) {
        this.modalForm.controls.reviewAllPreviousSteps.enable();
      } else {
        this.modalForm.controls.reviewAllPreviousSteps.disable();
        this.modalForm.controls.reviewAllPreviousSteps.setValue(true);
      }
    }
  }

  /**
   * Methode review : review loan
   */
  async review() {
    const oldLoan = Object.assign({}, this.loan);

    // if checkBox is not checked , set reviewOnlySelectedStep as true


    this.loan.reviewOnlySelectedStep = !this.modalForm.controls.reviewAllPreviousSteps.value;

    this.modalService.dismissAll();
    this.loan.reviewFrom = this.loan.etapeWorkflow;
    this.loan.etapeWorkflow = this.modalForm.controls.step.value.code;
    this.loan.statutWorkflow = this.modalForm.controls.step.value.code;
    this.loan.statutLibelle = this.modalForm.controls.step.value.libelle;
    if(this.modalForm.controls.step.value.actionUser){
    this.loan.owner = this.modalForm.controls.step.value.actionUser;
    // get full name by username to display it in loanOwnerName
    await this.authentificationService.getUserByLogin(this.modalForm.controls.step.value.actionUser)
    .toPromise().then(res => {
      oldLoan.ownerName = res.fullName;
    });
  } else {
    const userParam = new UserEntity();
    userParam.accountPortfolioId = this.loan.portfolioId;
    await this.authentificationService.findUsers(userParam).toPromise().then(res => {
      this.loan.owner = res[0].login;
      this.loan.ownerName = res[0].fullName;
      });
  }
    this.loan.statut = AcmConstants.WORKFLOW_STATUS_REVIEW;
    await this.loanDetailsServices.LoanReview(this.loan).subscribe(
      (data) => {
          this.modalService.dismissAll();
          this.loanSharedService.setLoan(data);
          this.router.navigate([AcmConstants.DASHBOARD_URL]);
        }
      );
  }

  /**
   * Methode getComponentVisibility
   */
  getComponentVisibility() {
    this.loanProcessEntitys.forEach(element => {
      switch (AcmConstants.DASHBOARD_URL + '/' + element.ihmRoot.replace('/','')) {
        case '/' + AcmConstants.UPLOAD_DOCUMENT_URL: {
          this.checkComponentDocVisibily = true;
          break;
        }
        case '/' + AcmConstants.CHECK_COLLATERAL_URL: {
          this.checkComponentCollateralVisibily = true;
          break;
        }
        case '/' + AcmConstants.CHECK_GUARANTOR_URL: {
          this.checkComponentGuarantorVisibily = true;
          break;
        }
        case '/' + AcmConstants.FIELD_VISIT_URL: {
          this.checkComponentFieldVisitVisibily = true;
          break;
        }
        case '/' + AcmConstants.FINANCIAL_ANALYSIS_URL: {
          this.checkComponentFinancialAnalisisVisibily = true;
          break;
        }
      }
    });
  }


  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * checkInitialPayment issue date must be >= to sysdate
   */
  checkInitialPayment() {
    const issueDate1: Date = new Date(this.loan.issueDate);
    issueDate1.setHours(0, 0, 0, 0);
    const initialPayment: Date = new Date();
    initialPayment.setHours(0, 0, 0, 0);
    if (issueDate1 >= initialPayment) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.issue_date_error');
      return false;
    }
  }

  /**
   *
   * calculation form
   * @param product ProductEntity
   */
  createCalculationForm(product: ProductEntity) {
    const amountMin = [];
    const amountMax = [];
    const termMin = [];
    const termMax = [];
    this.apr = Math.round((this.loan.apr + Number.EPSILON) * 100) / 100;
    this.irr = Math.round((this.loan.effectiveIntRate + Number.EPSILON) * 100) / 100;
    product.productDetailsDTOs.forEach(element => {
      amountMin.push(element.minimumAmount);
      amountMax.push(element.maximumAmount);
      termMin.push(element.minimumTerm);
      termMax.push(element.maximumTerm);
    });
    product.minimumBalance = Math.min(...amountMin);
    product.maximumBalance = Math.max(...amountMax);
    product.minimumTerm = Math.min(...termMin);
    product.maximumTerm = Math.max(...termMax);
    this.minAmountValidation = Math.min(...amountMin);
    this.maxAmountValidation = Math.max(...amountMax);
    this.minTermValidation = Math.min(...termMin);
    this.maxTermValidation = Math.max(...termMax);
    this.calcumationForm = this.formBuilder.group({
      calculation_method: ['0', customRequiredValidator],
      loanAmount: [this.loan.approvelAmount, [customRequiredValidator, Validators.min(product.minimumBalance),
      Validators.max(product.maximumBalance)]],
      repayment: [this.loan.normalPayment, customRequiredValidator],
      loanTerm: [this.loan.termPeriodNum, [customRequiredValidator, Validators.max(product.maximumTerm),
      Validators.min(product.minimumTerm)]],
      termType: [this.loan.termPeriodID, customRequiredValidator],
      issueDate: [new Date(this.loan.issueDate).toISOString().substring(0, 10), customRequiredValidator],
      initialPayment: [new Date(this.loan.initialPaymentDate).toISOString().substring(0, 10), customRequiredValidator],
      ignoreOddDays: [this.loan.ignoreOddDays],
      periodsDeferred: [this.loan.periodsDeferred, [Validators.min(product.minimumDeferredPeriod),
      Validators.max(product.maximumDeferredPeriod)]],
      periodsDeferredType: [this.loan.periodsDeferredType],
      fees: [],
      vat: [0],
      apr: [this.loan.apr],
      closingBalance: [''],
      frequency: [this.loan.paymentFreq, customRequiredValidator],
      interestFrequency: [this.loan.interestFreq, customRequiredValidator]
    });
  }

  /**
   *
   * calculate
   */
  async calculate(resetSchedule : boolean) {
    if (this.issued) {
      this.devToolsServices.openToast(3, 'alert.loan_issued');
      return;
    }
    this.checkCalculate = false;
    this.checkMinMaxAmountTermCalculate();
    if (this.calcumationForm.valid && (this.amountTrouv || this.termTrouv)) {
      if (!this.checkIssueDate(this.calcumationForm.controls.issueDate.value) ||
        !this.checkDeferredPeriod(this.calcumationForm.controls.periodsDeferred.value)) {
        return;
      }
      if (this.renewelLoanCondition && this.activeRenewalConditionSetting) {
        if (this.calcumationForm.controls.loanAmount.value > this.maximumAllowedAmount) {
          this.devToolsServices.openToastWithParameter(3, 'alert.max_allowed_amount', String(this.maximumAllowedAmount));
          this.calcumationForm.controls.loanAmount.clearValidators();
          this.calcumationForm.controls.loanAmount.setValidators([customRequiredValidator, Validators.max(this.maximumAllowedAmount)]);
          this.calcumationForm.controls.loanAmount.updateValueAndValidity();
          this.calcumationForm.controls.loanAmount.markAsTouched();
          return;
        }
      }
      if (!this.product.isFrequencyWithDeferredPeriode) {
        if (this.calcumationForm.controls.periodsDeferred.value !== 0 &&
          this.calcumationForm.controls.frequency.value !== 1) {
          this.devToolsServices.openToast(3, 'alert.error_frequency_with_deferred_periode');
          return;
        }
      }
      if (this.product.isFrequency) {
        const periodsDeferred = this.calcumationForm.controls.periodsDeferred.value;
        const loanTerm = this.calcumationForm.controls.loanTerm.value;
        const frequency = this.calcumationForm.controls.frequency.value;
        const interestFrequency = this.calcumationForm.controls.interestFrequency.value;
        // check if loanTerm MOD frequency = 0
        if (loanTerm % frequency !== 0) {
          this.devToolsServices.openToast(3, 'alert.error_frequency_mod_loan_term');
          return;
        }
        // check if deferred period < (loanTerm / freq)
        if (periodsDeferred >= ((loanTerm / frequency))) {
          this.devToolsServices.openToast(3, 'alert.error_period_deferred_less_loan_term_by_frequency');
          return;
        }
        // check if min <loanTerm / freq < max
        if (this.minTermValidation > (loanTerm / frequency)
          || (loanTerm / frequency) > this.maxTermValidation) {
          this.devToolsServices.openToast(3, 'alert.error_loan_term_by_frequency_between_min_max');
          return;
        }
        if (frequency % interestFrequency !== 0) {
          this.devToolsServices.openToast(3, 'alert.error_repayement_frequency_mod_interest_frequency');
          return;
        }
      }
      if (this.renewelLoanCondition && this.activeRenewalConditionSetting) {
        if (this.calcumationForm.controls.loanAmount.value > this.maximumAllowedAmount) {
          this.devToolsServices.openToastWithParameter(3, 'alert.max_allowed_amount', String(this.maximumAllowedAmount));
          this.calcumationForm.controls.loanAmount.clearValidators();
          this.calcumationForm.controls.loanAmount.setValidators([customRequiredValidator, Validators.max(this.maximumAllowedAmount)]);
          this.calcumationForm.controls.loanAmount.updateValueAndValidity();
          this.calcumationForm.controls.loanAmount.markAsTouched();
          return;
        }
      }
      // not allow amount bigger then the applied amount
      if (this.calcumationForm.controls.loanAmount.value > this.loan.applyAmountTotal) {
        this.devToolsServices.openToastWithParameter(3, 'alert.max_allowed_amount_bigger_then_applyAmount', String(this.loan.applyAmountTotal));
        this.calcumationForm.controls.loanAmount.clearValidators();
        this.calcumationForm.controls.loanAmount.setValidators([customRequiredValidator, Validators.max(this.loan.applyAmountTotal)]);
        this.calcumationForm.controls.loanAmount.updateValueAndValidity();
        this.calcumationForm.controls.loanAmount.markAsTouched();
        return;
      }
      this.amountTrouv = false;
      this.termTrouv = false;
      this.checkMinMaxAmountTermCalculate();
      this.loadingCalcule = true;
      this.loan.loanCalculationMode = 0;
      this.loan.approvelAmount = this.calcumationForm.controls.loanAmount.value;
      this.loan.applyAmountTotal = this.calcumationForm.controls.loanAmount.value;
      this.loan.issueDate = this.calcumationForm.controls.issueDate.value;
      this.loan.initialPaymentDate = this.calcumationForm.controls.initialPayment.value;
      this.loan.normalPayment = "";
      this.loan.termPeriodNum = this.calcumationForm.controls.loanTerm.value;
      this.loan.paymentFreq = this.calcumationForm.controls.frequency.value;
      this.loan.interestFreq = this.calcumationForm.controls.interestFrequency.value;
      this.loan.termPeriodID = this.calcumationForm.controls.termType.value;
      this.loan.periodsDeferred = this.calcumationForm.controls.periodsDeferred.value;
      this.loan.periodsDeferredType = this.calcumationForm.controls.periodsDeferredType.value;

      if(resetSchedule) {
        this.scheduleFlexibleIsChecked = false;
        this.schedules = [];
      }
      this.loan.loanSchedules = this.schedules; 
      if(checkOfflineMode()){
        await this.dbService.update('calculate-loans', this.loan).toPromise();


        const interest = this.product.flatInterestRate / 100;
        const loanAmout = this.calcumationForm.get("loanAmount").value;
        const loanTerm = this.calcumationForm.controls.loanTerm.value;
        const loenRepayment = loanAmout * ((interest / 12) + (1 / loanTerm));

        this.calcumationForm.controls.repayment.setValue(Math.floor(loenRepayment));

        for (let i = 0; i < loanTerm; i++) {
          const scheduleEntity = new ScheduleEntity();
          scheduleEntity.period = String(i + 1);
          scheduleEntity.totalRepayment = loenRepayment;
          this.schedules.push(scheduleEntity);
        }
        this.checkCalculate = false;
        this.loadingCalcule = false;

      } else {
        await this.loanApprovalService.calculateLoanSchedules(this.loan).toPromise().then(
          (data) => {
            this.schedules = data.loanSchedule;
            this.updateData(data);
            if ((this.schedules !== null) &&
              (this.schedules[0] !== null || this.schedules[0] !== undefined) &&
              (this.schedules[0].repaymentDate !== null || this.schedules[0].repaymentDate !== undefined)) {
            const timeZone = 'UTC+1'; // Replace this with your desired time zone 
              const transformDate = this.dateFormatterService.ToGregorianDateStruct(this.schedules[0].repaymentDate, 'DD/MM/YYYY');
              const dateResult = new Date(transformDate.year + '-' + transformDate.month + '-' + transformDate.day);
              this.calcumationForm.controls.initialPayment.setValue(this.datePipe.transform(dateResult, 'yyyy-MM-dd',timeZone));
            }
            this.loadingCalcule = false;
            this.lastLine = this.schedules[this.schedules.length - 1];
            this.updateLoanAbacus = true;
          });
      }
    }
  }

  /**
   * load product
   */
  getProduct() {
    this.loanManagementService.getProductByIb(this.loan.productId).subscribe(
      (data) => {
        this.product = data;

      }
    );
  }

  /**
   * checkIssueDate
   */
  checkIssueDate(date) {
    const issueDate: Date = new Date(date);
    issueDate.setHours(0, 0, 0, 0);
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);
    if (issueDate >= today) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.issue-date');
      return false;
    }
  }

  /**
   * validCalculate
   */
  validCalculate() {
    if (this.checkCalculate) {
      this.devToolsServices.openToast(3, 'alert.error-calculate');
      return;
    }
  }

  /**
   * check box confirm
   */
  createApproveForm() {
    this.approveForm = this.formBuilder.group({
      confirm: ['', customRequiredValidator]
    });
  }

  /**
   * check box confirm
   */
  changeChecboxApprove() {
    if (this.confirmApprove === false) {
      this.confirmApprove = true;
    } else {
      this.confirmApprove = false;
      this.approveForm.controls.confirm.setValue('');
    }
  }

  /**
   * Modal approval issue date
   * @param content content
   */  
  async calculateModel(content) {
    if (this.issued) {
      return this.devToolsServices.openToast(3, 'alert.loan_already_issued');
    }
    this.loan = this.loanSharedService.getLoan();
    this.updateLoanAbacus = false;
    if(!checkOfflineMode()){
    await this.loanApprovalService.getProduct(this.loan.productId).toPromise().then(
      (data) => {
        this.initializeCalculateForm(data,content);
      });
    } else {
      const allProducts = await this.dbService.getByKey('data','allProducts').toPromise() as any;
      if(allProducts !== undefined){
        const product = allProducts.data.filter(product => product.id === this.loan.productId);
        this.initializeCalculateForm(product[0],content);
      }
    }
  }

  initializeCalculateForm(data,content){
    this.product = data;
    this.currencySymbol = this.product.acmCurrency.symbol;
    this.createApproveForm();
    if (this.loan.loanApplicationStatus === AcmConstants.NEW_APPLICATION) {
      this.createCalculationForm(this.product);
      this.getCalculationInformation(this.loan);
    }
    this.confirmApprove = false;
    if (this.renewelLoanCondition) {
      if(!checkOfflineMode()){
        const customerAccount = new CustomerAccountEntity();
        customerAccount.customerId = String(this.loan.customerDTO.customerIdExtern);
        // get renewal condition setting if exist
        this.customerManagementService.getRenewalConditionSetting(customerAccount)
          .toPromise().then((renewalSetting) => {
            this.customerRenewalCondition = renewalSetting;
            if (this.customerRenewalCondition !== null && Object.keys(this.customerRenewalCondition).length !== 0) {
              this.checkNewOrAccpetedException();
              this.activeRenewalConditionSetting = true;
            }
          });
      } else {
        this.dbService.getByKey('data' , 'renewalCondition_' + this.loan.customerDTO.customerIdExtern).toPromise().then((renewalSetting:any)=>{
          if(renewalSetting !== undefined ) {
            this.customerRenewalCondition = renewalSetting.data;
          if(renewalSetting.data !== null && Object.keys(renewalSetting.data).length !== 0) {
            this.checkNewOrAccpetedException();
            this.activeRenewalConditionSetting = true;
          }
        }
        })
      }
      
    }
    this.modalService.open(content, {
      size: 'xl'
    });
  }

  /**
   * get schedule
   * @param loan LoanEntity
   */
  async getCalculationInformation(loan: LoanEntity) {
    if(checkOfflineMode()){
      await this.dbService.getByKey('data','loanSchedules_' + loan.loanId).subscribe((resultat:any)=>{
        if(resultat !== undefined){
          this.updateCalculationInfo(loan,resultat.data);
        }
      })
    } else {
      await this.scheduleService.loanSchedules(loan).toPromise().then(
        (data) => {
          this.updateCalculationInfo(loan,data);
        });
    }
  }

  updateCalculationInfo(loan,data){
    this.schedules = data;
    this.updateDataFromLoan(loan);
    if (this.schedules !== null &&
      (this.schedules[0] !== null && this.schedules[0] !== undefined) &&
      (this.schedules[0].repaymentDate !== null && this.schedules[0].repaymentDate !== undefined)) {
      const transformDate = this.dateFormatterService.ToGregorianDateStruct(this.schedules[0].repaymentDate, 'DD/MM/YYYY');
      const dateResult = new Date(transformDate.year + '-' + transformDate.month + '-' + transformDate.day);
      this.calcumationForm.controls.initialPayment.setValue(this.datePipe.transform(dateResult, 'yyyy-MM-dd'));
    }
    this.loadingCalcule = false;
    this.checkCalculate = false;
  }

  /**
   *
   * @param data LoanCalculateEntity
   */
  updateData(data: LoanCalculateEntity) {
    let decimal = 1;
    if (this.product.acmCurrency.decimalPlaces !== null || this.product.acmCurrency.decimalPlaces !== 0) {
      decimal = Math.pow(10, this.product.acmCurrency.decimalPlaces);
    }
    const pourcentage = (data.issueAmount
      * this.product.issueFeePercentage1) / 100;
    const pourcentage2 = (data.issueAmount
      * this.product.issueFeePercentage2) / 100;
    const feeAmout1 = pourcentage + ((pourcentage
      * this.product.issueFeeVAT1) / 100) + data.feeAmt1;
    // get application fees amount from API calculate
    this.feeAmount = data.feeAmt1;
    const feeAmout2 = pourcentage2 + ((pourcentage2
      * this.product.issueFeeVAT2) / 100) + this.product.issueFeeAmount2;
    switch (this.product.roundType) {
      case AcmConstants.ROUND_UP:
        this.calcumationForm.controls.repayment.setValue(Math.ceil((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.vat.setValue(Math.ceil((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.apr.setValue(data.apr);
        this.calcumationForm.controls.closingBalance.setValue(Math.ceil((data.issueAmount + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue(this.loanSharedService.useExternalCBS === '1'? Math.ceil(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      case AcmConstants.ROUND_DOWN:
        this.calcumationForm.controls.repayment.setValue(Math.floor((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.vat.setValue(Math.floor((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.apr.setValue(data.apr);
        this.calcumationForm.controls.closingBalance.setValue(Math.floor((data.issueAmount + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue(this.loanSharedService.useExternalCBS === '1' ? Math.floor(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      case AcmConstants.ROUND:
        this.calcumationForm.controls.repayment.setValue(Math.round((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.vat.setValue(Math.round((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.apr.setValue(data.apr);
        this.calcumationForm.controls.closingBalance.setValue(Math.round((data.issueAmount + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue(this.loanSharedService.useExternalCBS === '1' ? Math.round(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      default:
        this.calcumationForm.controls.repayment.setValue(data.normalPayment);
        this.calcumationForm.controls.vat.setValue(data.insurancePremium);
        this.calcumationForm.controls.apr.setValue(data.apr);
        this.calcumationForm.controls.closingBalance.setValue(data.issueAmount);
        this.calcumationForm.controls.fees.setValue(this.loanSharedService.useExternalCBS === '1' ? feeAmout1 + feeAmout2 : data?.acmIssueFee);
        break;
    }
    this.irr = Math.round((data.effectiveInterestRate + Number.EPSILON) * 100) / 100;
    this.apr = Math.round((data.apr + Number.EPSILON) * 100) / 100;
    this.loan.productRate = data.interestRate;
    this.loan.apr = data.apr;
    this.loan.effectiveIntRate = data.effectiveInterestRate;
    if (this.loanSharedService.useExternalCBS === '1') {
      this.loan.issueFeeAmount = feeAmout1 + feeAmout2;
    }
    else {
      this.loan.acmIssueFees = data?.acmIssueFee;
    }

    // get normal payment from api calculate
    this.loan.normalPayment = this.calcumationForm.controls.repayment.value;
  }

  /**
   * Update data
   */
  updateDataFromLoan(data: LoanEntity) {
    let decimal = 1;
    if (this.product.acmCurrency.decimalPlaces !== null || this.product.acmCurrency.decimalPlaces !== undefined || this.product.acmCurrency.decimalPlaces !== 0) {
      decimal = Math.pow(10, this.product.acmCurrency.decimalPlaces);
    }
    const pourcentage = (data.applyAmountTotal
      * this.product.issueFeePercentage1) / 100;
    const pourcentage2 = (data.applyAmountTotal
      * this.product.issueFeePercentage2) / 100;
    const feeAmout1 = pourcentage + ((pourcentage
      * this.product.issueFeeVAT1) / 100) + data.feeAmt1;
    this.feeAmount = data.feeAmt1;
    const feeAmout2 = pourcentage2 + ((pourcentage2
      * this.product.issueFeeVAT2) / 100) + this.product.issueFeeAmount2;
    switch (this.product.roundType) {
      case AcmConstants.ROUND_UP:
        this.calcumationForm.controls.repayment.setValue(Math.ceil((parseInt(data.normalPayment)
          + Number.EPSILON) * decimal) / decimal);
        // Not used for Tamkeen
        // this.calcumationForm.controls.vat.setValue(Math.ceil((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.closingBalance.setValue(Math.ceil((data.applyAmountTotal
          + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue((this.loanSharedService.useExternalCBS === '1' ? Math.ceil(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFees));
        break;
      case AcmConstants.ROUND_DOWN:
        this.calcumationForm.controls.repayment.setValue(Math.floor((parseInt(data.normalPayment)
          + Number.EPSILON) * decimal) / decimal);
        // Not used for Tamkeen
        // this.calcumationForm.controls.vat.setValue(Math.floor((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.closingBalance.setValue(Math.floor((data.applyAmountTotal
          + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue((this.loanSharedService.useExternalCBS === '1' ? Math.floor(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFees));
        break;
      case AcmConstants.ROUND:
        this.calcumationForm.controls.repayment.setValue(Math.round((parseInt(data.normalPayment)
          + Number.EPSILON) * decimal) / decimal);
        // Not used for Tamkeen
        // this.calcumationForm.controls.vat.setValue(Math.round((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.closingBalance.setValue(Math.round((data.applyAmountTotal
          + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue((this.loanSharedService.useExternalCBS === '1' ? Math.round(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFees));
        break;
      default:
        this.calcumationForm.controls.repayment.setValue(data.normalPayment);
        // Not used for Tamkeen
        // this.calcumationForm.controls.vat.setValue(data.insurancePremium);
        this.calcumationForm.controls.closingBalance.setValue(data.applyAmountTotal);
        this.calcumationForm.controls.fees.setValue(this.loanSharedService.useExternalCBS === '1' ? feeAmout1 + feeAmout2 : data?.acmIssueFees);
        break;
    }
    this.irr = Math.round((data.effectiveIntRate + Number.EPSILON) * 100) / 100;
    this.apr = Math.round((data.apr + Number.EPSILON) * 100) / 100;
    this.loan.productRate = data.productRate;
    this.loan.apr = data.apr;
    this.loan.effectiveIntRate = data.effectiveIntRate;
    if (this.loanSharedService.useExternalCBS === '1') {
      this.loan.issueFeeAmount = feeAmout1 + feeAmout2;
    }
    else {
      this.loan.acmIssueFees = data?.acmIssueFees;
    }
  }
  /**
   * initial payment value : First repayment is 30 after issue date
   */
  getInitialPaymentValue(fromModel: boolean) {
    if (this.datePipe.transform(this.loan.issueDate, 'yyyy-MM-dd') !== this.calcumationForm.controls.issueDate.value) {
      this.checkCalculate = true;
    }
    if (fromModel) {
      this.calcumationForm.controls.initialPayment.setValue(this.datePipe.transform(this.loan.initialPaymentDate, 'yyyy-MM-dd'));
    } else {
      const issueDate1: Date = new Date(this.calcumationForm.controls.issueDate.value);
      const initialPayment = issueDate1;
      if (this.product.isFrequency) {
        initialPayment.setMonth(issueDate1.getMonth() + (this.calcumationForm.controls.interestFrequency.value));
      } else {
        initialPayment.setDate(issueDate1.getDate() + 30);
      }
      this.calcumationForm.controls.initialPayment.setValue(this.datePipe.transform(initialPayment, 'yyyy-MM-dd'));
    }
  }

  /**
   *
   * @param event event
   */
  checkChangeInitialPayment(event) {
    this.checkCalculate = true;
  }

  /**
   * check amount
   */
  checkMinMaxAmountTermCalculate() {
    this.termTrouv = false;
    this.amountTrouv = false;
    this.product.productDetailsDTOs.forEach(element => {
      if ((this.calcumationForm.value.loanAmount >= element.minimumAmount
        && this.calcumationForm.value.loanAmount <= element.maximumAmount)
        && (this.calcumationForm.value.loanTerm >= element.minimumTerm &&
          this.calcumationForm.value.loanTerm <= element.maximumTerm)) {
        this.termTrouv = true;
        this.amountTrouv = true;
      }
    });
    if (!this.termTrouv && !this.amountTrouv) {
      this.calcumationForm.controls.loanTerm.clearValidators();
      this.calcumationForm.controls.loanTerm.reset();
      this.calcumationForm.controls.loanTerm.setValidators([customRequiredValidator,
      Validators.min(this.product.minimumTerm), Validators.max(this.product.maximumTerm)]);
      this.devToolsServices.openToast(3, 'alert.error_term');
    }
  }

  /**
   *
   *  checkDeferredPeriod
   */
  checkDeferredPeriod(date) {
    const periodsDeferred: number = date;
    if (periodsDeferred < this.product.minimumDeferredPeriod ||
      periodsDeferred > this.product.maximumDeferredPeriod) {
      this.devToolsServices.openToast(3, 'alert.error-periods-deferred');
      return false;
    } else {
      return true;
    }
  }

  /**
   * confirm agree
   */
  async saveChange() {
    if (this.loan.loanApplicationStatus === AcmConstants.NEW_APPLICATION) {
      if (this.checkCalculate) {
        this.devToolsServices.openToast(3, 'alert.error-calculate');
        return;
      }
      if (!this.checkIssueDate(this.calcumationForm.controls.issueDate.value) ||
        !this.checkDeferredPeriod(this.calcumationForm.controls.periodsDeferred.value)) {
        return;
      }
      if (this.renewelLoanCondition && this.activeException) {
        this.devToolsServices.openToast(3, 'alert.exception_request_in_progress');
        return;
      }
      this.modalService.dismissAll();
    } else {
      // in case of topUp/refinance : check validity of calculator
      // approveAction is an input to be be sent to child component : CalculatorComponent
      this.approveAction = !this.approveAction;
    }
  }

  close() {
    this.loan = this.loanSharedService.getLoan();
    this.modalService.dismissAll();
  }

  /**
   * saveChangesTopUpRefinance
   * @param event [checkCalculate,loanEntity,renewelLoanCondition,activeException]
   */
  async saveChangesTopUpRefinance(event) {
    if (!event[0]) {
      if (!this.checkIssueDate(event[1].issueDate) ||
        !this.checkDeferredPeriod(event[1].periodsDeferred)) {
        return;
      }
      // *event[2] : renewelLoanCondition - event[3] : activeException
      if (event[2] && event[3]) {
        this.devToolsServices.openToast(3, 'alert.exception_request_in_progress');
        return;
      }
      if (this.approveForm.valid) {
        this.modalService.dismissAll();
        this.loan.loanCalculationMode = 0;
        this.loan.approvelAmount = event[1].approvelAmount;
        this.loan.applyAmountTotal = event[1].applyAmountTotal;
        this.loan.issueDate = event[1].issueDate;
        this.loan.initialPaymentDate = event[1].initialPaymentDate;
        this.loan.normalPayment = event[1].normalPayment;
        this.loan.termPeriodNum = event[1].termPeriodNum;
        this.loan.termPeriodID = event[1].termPeriodID;
        this.loan.periodsDeferred = event[1].periodsDeferred;
        this.loan.periodsDeferredType = event[1].periodsDeferredType;
        this.loan.productRate = event[1].productRate;
        this.loan.apr = event[1].apr;
        this.loan.effectiveIntRate = event[1].effectiveIntRate;
        this.loan.issueFeeAmount = event[1].issueFeeAmount;
        this.loan.normalPayment = event[1].normalPayment;
        this.loan.updateLoanAbacus = event[1].updateLoanAbacus;
        this.loan.confirm = this.confirmApprove;
      }
    } else {
      // checkCalculate : in case the calculation is required
      this.devToolsServices.openToast(3, 'alert.error-calculate');
      return;
    }
  }

  /**
   * getMinMaxValueTerm
   */
  getMinMaxValueTerm() {
    this.amountTrouv = false;
    const termMin = [];
    const termMax = [];
    this.limitMinAmountValidation = false;
    this.limitMaxAmountValidation = false;
    if (this.calcumationForm.value.loanAmount === '' || this.calcumationForm.value.loanAmount === null) {
      this.resetValidation();
    } else if (this.product.productDetailsDTOs.length > 0) {
      this.product.productDetailsDTOs.forEach(element => {
        if ((this.calcumationForm.value.loanAmount >= element.minimumAmount
          && this.calcumationForm.value.loanAmount <= element.maximumAmount)) {
          termMin.push(element.minimumTerm);
          termMax.push(element.maximumTerm);
          this.amountTrouv = true;
        }
      });
      if (this.amountTrouv) {
        this.minTermValidation = Math.min(...termMin);
        this.maxTermValidation = Math.max(...termMax);
        if (this.calcumationForm.value.loanTerm !== '') {
          if (this.calcumationForm.value.loanTerm > this.minTermValidation &&
            this.calcumationForm.value.loanTerm < this.maxTermValidation) {
            this.calcumationForm.controls.loanTerm.clearValidators();
          } else {
            this.limitMinTermValidation = this.calcumationForm.value.loanTerm < this.minTermValidation;
            this.limitMaxTermValidation = this.calcumationForm.value.loanTerm > this.maxTermValidation;
            this.calcumationForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.calcumationForm.controls.loanAmount.value >= this.maxAmountValidation) {
          this.limitMaxAmountValidation = true;
        } else if (this.calcumationForm.controls.loanAmount.value <= this.minAmountValidation) {
          this.limitMinAmountValidation = true;
        }
        this.calcumationForm.controls.loanAmount.setErrors({ invalid: true, message: '' });
      }
    }
  }

  /**
   * getMinMaxValueAmount
   */
  getMinMaxValueAmount() {
    this.termTrouv = false;
    const amountMin = [];
    const amountMax = [];
    this.limitMinTermValidation = false;
    this.limitMaxTermValidation = false;
    if (this.calcumationForm.value.loanTerm === '' || this.calcumationForm.value.loanTerm === null) {
      this.resetValidation();
    } else if (this.product.productDetailsDTOs.length > 0) {
      this.product.productDetailsDTOs.forEach(element => {
        if ((this.calcumationForm.value.loanTerm >= element.minimumTerm
          && this.calcumationForm.value.loanTerm <= element.maximumTerm)) {
          amountMin.push(element.minimumAmount);
          amountMax.push(element.maximumAmount);
          this.termTrouv = true;
        }
      });
      if (this.termTrouv) {
        this.minAmountValidation = Math.min(...amountMin);
        this.maxAmountValidation = Math.max(...amountMax);
        if (this.calcumationForm.value.loanAmount !== '') {
          if (this.calcumationForm.value.loanAmount >= this.minAmountValidation &&
            this.calcumationForm.value.loanAmount <= this.maxAmountValidation) {
            const amountForm = this.calcumationForm.value.loanAmount;
            this.calcumationForm.controls.loanAmount.reset();
            this.calcumationForm.controls.loanAmount.setValue(amountForm);
            this.limitMinAmountValidation = false;
            this.limitMaxAmountValidation = false;
          } else {
            this.limitMinAmountValidation = this.calcumationForm.value.loanAmount < this.minAmountValidation;
            this.limitMaxAmountValidation = this.calcumationForm.value.loanAmount > this.maxAmountValidation;
            this.calcumationForm.controls.loanAmount.setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.calcumationForm.controls.loanTerm.value > this.maxTermValidation) {
          this.limitMaxTermValidation = true;
        } else if (this.calcumationForm.controls.loanTerm.value < this.minTermValidation) {
          this.limitMinTermValidation = true;
        }
        this.calcumationForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
      }
    }
  }

  /**
   * resetValidation
   */
  resetValidation() {
    const termMin = [];
    const termMax = [];
    const amountMin = [];
    const amountMax = [];
    this.product.productDetailsDTOs.forEach(element => {
      termMin.push(element.minimumTerm);
      termMax.push(element.maximumTerm);
      amountMin.push(element.minimumAmount);
      amountMax.push(element.maximumAmount);
    });
    this.calcumationForm.controls.loanAmount.clearValidators();
    if (this.calcumationForm.controls.loanAmount.value === null) {
      this.calcumationForm.controls.loanAmount.setErrors({ invalid: true, message: '' });
      this.limitMinAmountValidation = true;
    }
    this.minAmountValidation = Math.min(...amountMin);
    this.maxAmountValidation = Math.max(...amountMax);
    this.calcumationForm.controls.loanTerm.clearValidators();
    if (this.calcumationForm.controls.loanTerm.value === null) {
      this.calcumationForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
      this.limitMinTermValidation = true;
    }
    this.minTermValidation = Math.min(...termMin);
    this.maxTermValidation = Math.max(...termMax);
  }

  changeCalculationForm() {
    this.checkCalculate = true;
  }

  /**
   * setRenewalAmount
   */
  setRenewalAmount() {
    // check if there is an accepted request for this product
    if (this.acceptedException) {
      // the renewal amount will be the requested amount
      // determinate the min between the requested amount and the maximum product
      this.maximumAllowedAmount = Math.min(this.acceptedExceptionRequest.requestedAmount,
        this.product.productDetailsDTOs[0].maximumAmount);
    } else {
      // calculate renewal amount based on percentage
      // renewal amount => (lastLoanAmout + lastLoanAmount*RenewalConditionPercentage )
      const renewalAmount =
        this.customerRenewalCondition.lastLoanAmount * ((this.customerRenewalCondition.renewalConditionDTO.pourcentage / 100) + 1);
      // determinate maximum allowed amount => Min(Maximum Product Amount, Calculated Renewal Amount)
      this.maximumAllowedAmount = Math.min(renewalAmount, this.product.productDetailsDTOs[0].maximumAmount);
    }
  }

  /**
   * checkNewOrAccpetedException
   */
  async checkNewOrAccpetedException() {
    const renewalExceptionRequest = new ExceptionRequestEntity();
    renewalExceptionRequest.customerId = this.loan.customerDTO.id;
    renewalExceptionRequest.listStatut = [AcmConstants.NEW_STATUT_REQUEST, AcmConstants.ACCEPTED_STATUT_REQUEST];
    await this.exceptionRequestService.findExceptionRequest(renewalExceptionRequest).toPromise().then((data) => {
      if (data.length > 0) {
        data.forEach(element => {
          if (element.statut === AcmConstants.NEW_STATUT_REQUEST) {
            this.activeException = true;
          } else if (element.statut === AcmConstants.ACCEPTED_STATUT_REQUEST) {
            this.acceptedException = true;
            this.acceptedExceptionRequest = element;
          }
        });
      }
    }).then(() => {
      this.setRenewalAmount();
    });
  }

  /**
   * checkAgeForProduct()
   */
  checkAgeForProduct() {
    if (this.loan.customerDTO.age === null) {
      this.devToolsServices.openToast(3, 'alert.age_limit_product');
      return false;
    }
    if (this.loan.customerDTO.age >= this.loan.productDTO.minimumAge &&
      this.loan.customerDTO.age <= this.loan.productDTO.maximumAge) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.age_limit_product');
      return false;
    }
  }

  compareFrequency(d1, d2) {
    return d1 === d2;
  }

  reviewSteps(): LoanProcessEntity[] {
    let currentstep = this.loan.loanInstancesDtos.filter(step => step.code === this.loan.etapeWorkflow);
    if (currentstep.length > 0) {
      return this.loan.loanInstancesDtos.filter(step => step.orderEtapeProcess < currentstep[0].orderEtapeProcess);

    }
    return this.loan.loanInstancesDtos.filter(step => step.code < this.loan.etapeWorkflow);
  }

  /**
   * Display the confirmation message
   */
  save(source?: string) {
    // send origin source as 'click on save button' or 'click on complete button'
    this.originSource = source;
    // check if there is changes in documents
    this.saveFilesAction = !this.saveFilesAction;
  }

  receiveLengthDocuments(number: number) {
    this.lengthDocuments = number;
  }

  /**
   * check required
   * param event
   */
  checkRequiredDocumentParent(event) {
    if (event === 0) {
      this.checkRequiredDocument = true;
    } else {
      this.checkRequiredDocument = false;
    }
  }
  saveDocumentsDone(event) {
    if (this.checkNavigate === true){
      this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE);

      if(checkOfflineMode()){
        this.loanSharedService.moveLoanNextStep(this.loan);
      }
    }
  }

  executeThirdPartyApi() {
    this.loanDetailsServices.automaticStepLoan(this.loan).subscribe();
  }
  scheduleFlexibleChecked(event) {
    const check = event.target as HTMLInputElement;
    this.scheduleFlexibleIsChecked = check.checked;
  }
}
