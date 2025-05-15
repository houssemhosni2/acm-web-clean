import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanDetailsServices } from '../loan-details/loan-details.services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerDecisionServices } from './customer-decision.services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { TranslateService } from '@ngx-translate/core';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { AppComponent } from '../../../app.component';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { LoanApprovalService } from '../loan-approval/loan-approval.service';
import { LoanCalculateEntity } from 'src/app/shared/Entities/LoanCalculate.entity';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';
import { DatePipe } from '@angular/common';
import { LoanScheduleEntity } from 'src/app/shared/Entities/loanSchedule.entity';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { RenewalConditionLoanEntity } from 'src/app/shared/Entities/renewalConditionLoan.entity';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { ExceptionRequestService } from '../dashbord/exception-request/exception-request.service';
import { DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { CustomerAccountEntity } from 'src/app/shared/Entities/customer.account.entity';
import { ScheduleService } from '../loan-schedule/schedule.service';
import { SettingsService } from '../../Settings/settings.service';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { SettingCollectionValidationComponent } from '../../Settings/setting-collection-validation/setting-collection-validation.component';
import { UploadItemComponent } from '../../GED/upload-item/upload-item.component';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { UdfStepWorkflowComponent } from '../udf-step-workflow/udf-step-workflow.component';
import {checkOfflineMode, customRequiredValidator} from '../../../shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-customer-decision',
  templateUrl: './customer-decision.component.html',
  styleUrls: ['./customer-decision.component.sass']
})
export class CustomerDecisionComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public apr = 0;
  public irr = 0;
  public calcumationForm: FormGroup;
  public product: ProductEntity;
  public approveForm: FormGroup;
  public confirmApprove: boolean;
  public schedules: ScheduleEntity[] = [];
  public loadingCalcule = false;
  public checkCalculate = true;
  public termTrouv = false;
  public amountTrouv = false;
  public page: number;
  public pageSize: number;
  public loan: LoanEntity = new LoanEntity();
  public loading = true;
  public htmlContent: string;
  public customerdecisionForm: FormGroup;
  public modalForm: FormGroup;
  public settingMotifDeclineEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifDeclineEntitys = [];
  public confirmDecline = false;
  public currentPath = 'customer-decision';
  public checkComponentDocVisibily = false;
  public checkComponentCollateralVisibily = false;
  public checkComponentGuarantorVisibily = false;
  public checkComponentFieldVisitVisibily = false;
  public checkComponentFinancialAnalisisVisibily = false;
  public loanProcessEntitys: Array<LoanProcessEntity> = [];
  public orderProcess: number;
  public contactDate = new Date();
  public currentStatus: number;
  public minIssueDatevalue: string;
  public minInitialPayementvalue: string;
  public lastLine: ScheduleEntity;
  public maximumAllowedAmount: number;
  public activeException = false;
  public acceptedException = false;
  public newExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public customerRenewalCondition: RenewalConditionLoanEntity = new RenewalConditionLoanEntity();
  public acceptedExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public activeRenewalConditionSetting = false;
  public approveAction = false;
  public view: string = AcmConstants.VIEW;
  public currencySymbol = '';
  public currentAmount = 0;
  public apportPersonnel = 0;
  @ViewChild(SettingCollectionValidationComponent)
  settingCollectionValidationComponent: SettingCollectionValidationComponent;
  public isLoan = true;
  public checkNavigate=false;
  public displayButtonExecuteApi:boolean=false;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  expanded = true;
  configEditor: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    translate: 'no',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };
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
  public renewelLoanCondition = false;
  public feeAmount = 0;
  public decimalPlaces: string;
  public customer: CustomerEntity;
  categoryLoan = 'complete data';
  @ViewChild(UploadItemComponent)
  uploadItemComponent: UploadItemComponent;
  public saveFilesAction = true;
  public originSource: string;
  public lengthDocuments:number;
  checkRequiredDocument = false;
  checkUdf: boolean;
  public scheduleFlexibleIsChecked : boolean = false;
  /**
   * constructor
   * @param loanSharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   * @param modalService NgbModal
   * @param loanDetailsServices LoanDetailsServices
   * @param router Router
   * @param customerDecisionServices CustomerDecisionServices
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   * @param loanApprovalService LoanApprovalService
   * @param datePipe DatePipe
   */
  constructor(public loanSharedService: SharedService,
    public devToolsServices: AcmDevToolsServices, public modalService: NgbModal,
    public loanDetailsServices: LoanDetailsServices,
    public router: Router, public customerDecisionServices: CustomerDecisionServices, public formBuilder: FormBuilder,
    public translate: TranslateService, public loanApprovalService: LoanApprovalService, public datePipe: DatePipe,
    public customerManagementService: CustomerManagementService,
    public exceptionRequestService: ExceptionRequestService,
    public dateFormatterService: DateFormatterService,private dbService: NgxIndexedDBService,
    public scheduleService: ScheduleService,private cdr: ChangeDetectorRef,
    public settingsService: SettingsService) {
  }

 async ngOnInit() {
    this.devToolsServices.backTop();
    this.loan = this.loanSharedService.getLoan();    
    this.apportPersonnel = this.loan.personalContribution;
    this.currentAmount = this.loan.approvelAmount + this.apportPersonnel;
    this.loanSharedService.setCustomer(this.loan.customerDTO);
    this.createForm();
    this.loanProcessEntitys = this.loan.loanInstancesDtos;
    this.pageSize = 5;
    this.page = 1;
    this.loanProcessEntitys.forEach(element => {
      if (element.code === this.loan.etapeWorkflow) {
        this.orderProcess = element.orderEtapeProcess;
      }
      if (element.ihmRoot === this.currentPath) {
        this.currentStatus = element.code;
      }
    });
    this.getComponentVisibility();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.loanSharedService.getRenewalConditionStatus().then((data) => {
      this.renewelLoanCondition = data;
    });
    this.minIssueDatevalue = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    this.customer = this.loanSharedService.getCustomer();
    // Get the last line of the schedule to change his style to bold
    if(!checkOfflineMode()){
    if (this.loanSharedService.useExternalCBS === '1') {
      this.scheduleService.loanSchedules(this.loan).toPromise().then(
        (data) => {
          this.lastLine =data[data.length - 1];
        });
    }

      const stepEntity: StepEntity = new StepEntity();
      stepEntity.productId = this.loan.productId;
      stepEntity.idWorkFlowStep = this.loan.etapeWorkflow;
      this.settingsService.findWorkFlowSteps(stepEntity).subscribe((dataStep) => {
       if(dataStep[0].automaticStep
        &&
        (dataStep[0].acceptationCondition!== null || dataStep[0].rejectionCondition!== null))
        {
         this.displayButtonExecuteApi=true;
        }
      });
    } else {
      await this.dbService.getByKey('data','loanSchedules_' + this.loan.loanId).subscribe((resultat:any)=>{
        if(resultat !== undefined){
          this.lastLine = resultat.data[resultat.data.length - 1];
        }
      })
    }
  }

  /**
   * Methode to create form
   */
  createForm() {
    this.customerdecisionForm = this.formBuilder.group({
      comments: ['', customRequiredValidator]
    });
  }

  /**
   * Methode to create form Decline
   */
  createFormDecline() {
    this.modalForm = this.formBuilder.group({
      reason: ['', customRequiredValidator],
      confirm: ['', customRequiredValidator]
    });
  }

  /**
   * Methode exit
   */
  exit() {
    if (this.loan.parentId === 0) {
      this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.DASHBOARD_URL);
    } else {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.EXIT_FORM_MSG)
        .afterClosed().subscribe(res => {
          if (res) {
            if (this.loanSharedService.getLoanGroupe() !== null) {
              this.loanSharedService.openLoan(this.loanSharedService.getLoanGroupe()).then(() => {
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
   * Methode decline : decline loan
   */
  async decline() {
    this.loan.contactDateCustomerDecision = this.contactDate;
    this.loan.commentsCustomerDecision = this.customerdecisionForm.value.comments;
    this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_DECLINED;
    this.loan.workFlowAction = 'CUSTOMER_DECISION';
    this.loanSharedService.setLoader(true);
    if(!checkOfflineMode()){
    await this.loanDetailsServices.validate(this.loan).toPromise().then(
      (data) => {
        this.loanSharedService.setLoan(data);
        this.loanSharedService.setLoader(false);
        this.router.navigate([AcmConstants.DASHBOARD_URL]);
      });
    } else {
      await this.dbService.update('loans',this.loan).toPromise();

      let loansList = await this.dbService.getByKey('loans-pagination','loans-pagination-status-' + this.loanSharedService.statusTab).toPromise() as LoanPaginationEntity;

      loansList.resultsLoans = loansList.resultsLoans.filter((loan)=> { return loan.loanId !== this.loan.loanId});
      loansList.resultsLoans.unshift(this.loan);
      await this.dbService.update('loans-pagination', loansList).toPromise();

      this.loanSharedService.setLoan(this.loan);
      this.loanSharedService.setLoader(false);
      this.router.navigate([AcmConstants.DASHBOARD_URL]);
    }
    this.modalService.dismissAll();
  }

  /**
   * Methode agree : agree loan
   */
  async agree() {
    this.checkNavigate=false;
    if(!this.checkRequiredDocument)
    {      this.devToolsServices.openToast(3,'alert.enter_required_documents')
          return;
        }
        else{
          if (!this.checkAgeForProduct()) {
            return;
          }
          // if feeamount != 0 get the new feeamount value from calculate API
          if (this.feeAmount !== 0) {
            this.loan.feeAmt1 = this.feeAmount;
          }
          this.loan.contactDateCustomerDecision = this.contactDate;
          this.loan.commentsCustomerDecision = this.customerdecisionForm.value.comments;
          this.loan.workFlowAction = 'CUSTOMER_DECISION';
          this.loan.applyAmountTotal = this.loan.approvelAmount;
         this.checkNavigate=true;
        }

      this.saveDocuments();
  }

  /**
   * Methode toBeReview : toBeReview loan
   */
  async toBeReview() {
    this.loan.contactDateCustomerDecision = this.contactDate;
    this.loan.commentsCustomerDecision = this.customerdecisionForm.value.comments;
    this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_ASK_FOR_REVIEW;

    this.loan.reviewFrom = this.loan.etapeWorkflow;
    this.loan.etapeWorkflow = this.loan.loanInstancesDtos[0].code;
    this.loan.statutLibelle = this.loan.loanInstancesDtos[0].libelle;

    this.loanSharedService.setLoader(true);
    if(!checkOfflineMode()){
    await this.loanDetailsServices.LoanReview(this.loan).toPromise().then(
      (data) => {
        this.loanSharedService.setLoan(data);
        this.loanSharedService.setLoader(false);
        this.router.navigate([AcmConstants.DASHBOARD_URL]);
      });
    } else {
      await this.dbService.update('loans', this.loan).toPromise();

      let loansList = await this.dbService.getByKey('loans-pagination','loans-pagination-status-' + this.loanSharedService.statusTab).toPromise() as LoanPaginationEntity;

      loansList.resultsLoans = loansList.resultsLoans.filter((loan)=> { return loan.loanId !== this.loan.loanId});
      loansList.resultsLoans.unshift(this.loan);
      await this.dbService.update('loans-pagination', loansList).toPromise();

      this.loanSharedService.setLoan(this.loan);
      this.loanSharedService.setLoader(false);
      this.router.navigate([AcmConstants.DASHBOARD_URL]);
    }
  }

  /**
   * Open model decline modal.
   * @param content modal input
   */
  async declineModel(content) {
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if( this.udfStepWorkflowComponent.udfLoanForm.valid){
      this.saveUdfs()
    }
    else {
      return;
    }
    if (this.customerdecisionForm.valid) {
      this.modalService.open(content, {
        size: 'md'
      });
      this.loan = this.loanSharedService.getLoan();
      this.createFormDecline();
      this.confirmDecline = false;
      this.settingMotifDeclineEntity.categorie = AcmConstants.DECLINE_CATEGORIE;
      if(!checkOfflineMode()){
      await this.loanDetailsServices.getReason(this.settingMotifDeclineEntity).toPromise().then(
        (data) => {
          this.settingMotifDeclineEntitys = data;
        });
      } else {
        await this.dbService.getByKey('data', 'getSettingMotif_' + AcmConstants.DECLINE_CATEGORIE ).toPromise().then((data:any)=>{
          if(data !== undefined){
            this.settingMotifDeclineEntitys = data.data;
          }
      })
    }
    }
  }

  /**
   * Methode onSubmit : onSubmit Agree loan
   */
  onSubmitAgree(content) {
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm)
    if (this.udfStepWorkflowComponent.udfLoanForm.invalid) {
      this.devToolsServices.InvalidControl();
      return;
    }
    if( this.udfStepWorkflowComponent.udfLoanForm.valid){
      this.saveUdfs()
    }
    else {
      return;
    }
    if (this.customerdecisionForm.valid) {
      if (!this.checkInitialPayment()) {
        return;
      }
      this.agree();
    }
  }

  /**
   * Methode calculateModel : change issue date
   */
  calculateModel(content) {
    this.loan = this.loanSharedService.getLoan();
    if (this.customerdecisionForm.valid) {
      this.approveModel(content);
    }
  }

  close() {
    this.loan = this.loanSharedService.getLoan();
    this.modalService.dismissAll();
  }

  /**
   * confirm agree
   */
  async save() {
    if (this.loan.loanApplicationStatus === AcmConstants.NEW_APPLICATION &&  this.approveForm.valid) {
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
    this.saveDocuments(AcmConstants.COMPLETE_ACTION);
  }
  /**
   *
   * @param event event : tab of objects output from CalculatorComponent
   * event [checkCalculate,loanEntity,renewelLoanCondition,activeException]
   */
  async saveTopUpRefinance(event) {
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
   * Modal approval issue date
   * @param content content
   */
  async approveModel(content) {
    this.loan = this.loanSharedService.getLoan();
    if(!checkOfflineMode()){
      await this.loanApprovalService.getProduct(this.loan.productId).toPromise().then(
        (data) => {
          this.initializeCalculateForm(data,content);
        });
    } else {
      const products = await this.dbService.getByKey('data','product_' + this.loan.productId).toPromise() as any;
      if(products !== undefined){        
        this.initializeCalculateForm(products.data,content);
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
          if( renewalSetting.data !== null && Object.keys(renewalSetting.data).length !== 0) {
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
   * Methode onSubmit : onSubmit ToBeReview loan
   */
  onSubmitToBeReview() {
    this.loan = this.loanSharedService.getLoan();
    if (this.customerdecisionForm.valid) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.to_be_review').afterClosed().subscribe(res => {
        if (res) {
          this.toBeReview();
        }
      });
    }
  }

  /**
   * Methode onSubmitDecline : Decline loan
   */
  onSubmitDecline() {
    this.loan = this.loanSharedService.getLoan();
    this.loan.note = this.modalForm.value.reason;
    this.loan.note = 'Declined via ACM';
    this.loan.codeExternMotifRejet = this.modalForm.value.reason.codeExternal;
    if (this.modalForm.valid) {
      this.loan.confirm = this.confirmDecline;
      this.decline();
    }
  }

  changeChecboxDecline($event: Event) {
    if (this.confirmDecline === false) {
      this.confirmDecline = true;
    } else {
      this.confirmDecline = false;
      this.modalForm.controls.confirm.setValue('');
    }
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

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
      loanAmount: [this.loan.approvelAmount, customRequiredValidator],
      repayment: [this.loan.normalPayment, customRequiredValidator],
      loanTerm: [this.loan.termPeriodNum, customRequiredValidator],
      termType: [this.loan.termPeriodID, customRequiredValidator],
      issueDate: [new Date(this.loan.issueDate).toISOString().substring(0, 10), customRequiredValidator],
      initialPayment: [new Date(this.loan.initialPaymentDate).toISOString().substring(0, 10), customRequiredValidator],
      ignoreOddDays: [this.loan.ignoreOddDays],
      periodsDeferred: [this.loan.periodsDeferred],
      periodsDeferredType: [this.loan.periodsDeferredType],
      fees: [],
      apr :  [0],
      vat: [0],
      closingBalance: [''],
      frequency: [this.loan.paymentFreq, customRequiredValidator],
      interestFrequency: [this.loan.interestFreq, customRequiredValidator],
    });
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
   * get schedule
   * @param loan LoanEntity
   */
  async getCalculationInformation(loan: LoanEntity) {
    if(!checkOfflineMode()){
    await this.scheduleService.loanSchedules(loan).toPromise().then(
      (data) => {
        this.schedules = data;
        this.updateDataFromLoan(loan);
        this.loadingCalcule = false;
        this.checkCalculate = false;
      });
    } else {
      await this.dbService.getByKey('data','loanSchedules_' + loan.loanId).subscribe((resultat:any)=>{
        if(resultat !== undefined){
          this.schedules = resultat.data;
          this.updateDataFromLoan(loan);
          this.loadingCalcule = false;
          this.checkCalculate = false;
        }
      })
    }
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
    this.feeAmount = data.feeAmt1;
    const feeAmout2 = pourcentage2 + ((pourcentage2
      * this.product.issueFeeVAT2) / 100) + this.product.issueFeeAmount2;
    switch (this.product.roundType) {
      case AcmConstants.ROUND_UP:
        this.calcumationForm.controls.repayment.setValue(Math.ceil((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.vat.setValue(Math.ceil((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.apr.setValue(data.apr);
        this.calcumationForm.controls.closingBalance.setValue(Math.ceil((data.issueAmount + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue((this.loanSharedService.useExternalCBS === '1' ? Math.ceil(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee));
        break;
      case AcmConstants.ROUND_DOWN:
        this.calcumationForm.controls.repayment.setValue(Math.floor((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.vat.setValue(Math.floor((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.apr.setValue(data.apr);

        this.calcumationForm.controls.closingBalance.setValue(Math.floor((data.issueAmount + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue((this.loanSharedService.useExternalCBS === '1' ? Math.floor(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee));
        break;
      case AcmConstants.ROUND:
        this.calcumationForm.controls.repayment.setValue(Math.round((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.vat.setValue(Math.round((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.apr.setValue(data.apr);
        this.calcumationForm.controls.closingBalance.setValue(Math.round((data.issueAmount + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue((this.loanSharedService.useExternalCBS === '1' ? Math.round(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee));
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
   *
   * calculate
   */
  async calculate(resetSchedule : boolean) {
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
        if (this.calcumationForm.controls.periodsDeferred.value !== 0  &&
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
      this.loan.normalPayment = this.calcumationForm.controls.repayment.value;
      this.loan.termPeriodNum = this.calcumationForm.controls.loanTerm.value;
      this.loan.paymentFreq = this.calcumationForm.controls.frequency.value;
      this.loan.interestFreq = this.calcumationForm.controls.interestFrequency.value;
      this.loan.termPeriodID = this.calcumationForm.controls.termType.value;
      this.loan.periodsDeferred = this.calcumationForm.controls.periodsDeferred.value;
      this.loan.periodsDeferredType = this.calcumationForm.controls.periodsDeferredType.value;
      if(!checkOfflineMode()){
      if(resetSchedule) {
        this.scheduleFlexibleIsChecked = false;
        this.schedules = [];
      }
      this.loan.loanSchedules = this.schedules; 
      await this.loanApprovalService.calculateLoanSchedules(this.loan).toPromise().then(
        (data) => {
          this.schedules = data.loanSchedule;
          this.updateData(data);
          if (this.schedules !== null &&
            (this.schedules[0] !== null && this.schedules[0] !== undefined) &&
            (this.schedules[0].repaymentDate !== null && this.schedules[0].repaymentDate !== undefined)) {
              const timeZone = 'UTC+1'; // Replace this with your desired time zone 
            const transformDate = this.dateFormatterService.ToGregorianDateStruct(this.schedules[0].repaymentDate, 'DD/MM/YYYY');
            const dateResult = new Date(transformDate.year + '-' + transformDate.month + '-' + transformDate.day);
            this.calcumationForm.controls.initialPayment.setValue(this.datePipe.transform(dateResult, 'yyyy-MM-dd',timeZone));
            this.lastLine = this.schedules[this.schedules.length - 1];
          }
          this.loadingCalcule = false;
        });
      } else {
        await this.dbService.update('calculate-loans', this.loan).toPromise();
        const interest = this.product.flatInterestRate / 100;
        const loanAmout = this.calcumationForm.get("loanAmount").value;
        const loanTerm = this.calcumationForm.controls.loanTerm.value;
        const loanRepayment = loanAmout * ((interest / 12) + (1 / loanTerm));

        this.calcumationForm.controls.repayment.setValue(Math.floor(loanRepayment));

        for (let i = 0; i < loanTerm; i++) {
          const scheduleEntity = new ScheduleEntity();
          scheduleEntity.period = String(i + 1);
          scheduleEntity.totalRepayment = loanRepayment;
          this.schedules.push(scheduleEntity);
        }
        this.checkCalculate = false;
        this.loadingCalcule = false;
      }
    }
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
   * check issue date
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
   *
   *  checkDeferredPeriod
   */
  checkDeferredPeriod(data) {
    const periodsDeferred: number = data;
    if (periodsDeferred < this.product.minimumDeferredPeriod ||
      periodsDeferred > this.product.maximumDeferredPeriod) {
      this.devToolsServices.openToast(3, 'alert.error-periods-deferred');
      return false;
    } else {
      return true;
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
   * reset calculation form
   */
  resetValidation() {
    this.calcumationForm.controls.loanAmount.clearValidators();
    this.calcumationForm.controls.loanAmount.reset();
    this.calcumationForm.controls.loanAmount.setValidators([customRequiredValidator,
    Validators.min(this.product.minimumBalance), Validators.max(this.product.maximumBalance)]);
    this.calcumationForm.controls.loanTerm.clearValidators();
    this.calcumationForm.controls.loanTerm.reset();
    this.calcumationForm.controls.loanTerm.setValidators([customRequiredValidator,
    Validators.min(this.product.minimumTerm), Validators.max(this.product.maximumTerm)]);
  }

  /**
   * downloadSchedule
   */
  downloadSchedule() {
    const loanScheduleEntity = new LoanScheduleEntity();
    loanScheduleEntity.scheduleDTOs = this.schedules;
    const customerEntity = new CustomerEntity();
    customerEntity.customerNumber = this.customer.customerNumber;
    this.loan.customerNameNoPipe = this.customer.customerNameNoPipe;
    this.loan.customerDTO = customerEntity;
    loanScheduleEntity.loanDTO = this.loan;
    this.loanApprovalService.reportingSchedule(loanScheduleEntity).subscribe(
      (res: any) => {
        const fileData = [res];
        const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      });
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
      this.maximumAllowedAmount = Math.min(this.acceptedExceptionRequest.requestedAmount, this.product.productDetailsDTOs[0].maximumAmount);
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
   * checkActiveException
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

  /**
   * Display the confirmation message
   */
      saveDocuments(source?: string) {
        // send origin source as 'click on save button' or 'click on complete button'
        this.originSource = source;
        // check if there is changes in documents
          this.saveFilesAction = !this.saveFilesAction;
          this.cdr.detectChanges();
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
  saveDocumentsDone(event){
    if( this.checkNavigate===true){
    this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_AGREED);
    if(checkOfflineMode()){
      this.loanSharedService.moveLoanNextStep(this.loan); 
    }
    }
  }

  executeThirdPartyApi() {
    this.loanDetailsServices.automaticStepLoan(this.loan).subscribe();
  }
  saveUdfs(){
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm)
    if (this.checkUdf) {
      this.devToolsServices.InvalidControl();
      return;
    }
    this.udfStepWorkflowComponent.saveUdfLinks();
    this.saveDocuments();
  }

  validationUdf(udfLink : boolean)  {
    this.checkUdf = udfLink
  }
  scheduleFlexibleChecked(event) {
    const check = event.target as HTMLInputElement;
    this.scheduleFlexibleIsChecked = check.checked;
  }
}
