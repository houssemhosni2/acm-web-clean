import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleEntity } from '../../../shared/Entities/schedule.entity';
import { LoanDetailsServices } from '../loan-details/loan-details.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { LoanApprovalService } from './loan-approval.service';
import { NgxLoadingComponent } from 'ngx-loading';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { ProductEntity } from '../../../shared/Entities/product.entity';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { LoanCalculateEntity } from 'src/app/shared/Entities/LoanCalculate.entity';
import { DatePipe } from '@angular/common';
import { DashbordServices } from '../dashbord/dashbord.services';
import { LoanProcessComponent } from '../loan-process/loan-process.component';
import { LoanScheduleEntity } from 'src/app/shared/Entities/loanSchedule.entity';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UDFLinksGroupeFieldsEntity } from 'src/app/shared/Entities/udfLinksGroupeFields.entity';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { UdfService } from '../udf/udf.service';
import { UserDefinedFieldListValuesEntity } from 'src/app/shared/Entities/userDefinedFieldListValues.entity';
import { LoanManagementService } from '../loan-management/loan-management.service';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { RenewalConditionLoanEntity } from 'src/app/shared/Entities/renewalConditionLoan.entity';
import { ExceptionRequestService } from '../dashbord/exception-request/exception-request.service';
import { DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { CustomerAccountEntity } from 'src/app/shared/Entities/customer.account.entity';
import { ScheduleService } from '../loan-schedule/schedule.service';
import { SettingsService } from '../../Settings/settings.service';
import { Subject } from 'rxjs';
import { ConditionalApproveListComponent } from '../conditional-approve-list/conditional-approve-list.component';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { SettingCollectionValidationComponent } from '../../Settings/setting-collection-validation/setting-collection-validation.component';
import { UploadItemComponent } from '../../GED/upload-item/upload-item.component';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { ThirdPartyHistoriqueEntity } from 'src/app/shared/Entities/thirdPartyHistorique.entity';
import { UdfStepWorkflowComponent } from '../udf-step-workflow/udf-step-workflow.component';
import { ConditionalApproveComponent } from '../conditional-approve/conditional-approve.component';
import { checkOfflineMode, customRequiredValidator } from '../../../shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-loan-approval',
  templateUrl: './loan-approval.component.html',
  styleUrls: ['./loan-approval.component.sass']
})
export class LoanApprovalComponent implements OnInit, OnDestroy {

  /**
   * constructor
   * @param loanSharedService LoanSharedService
   * @param router Router
   * @param devToolsServices AcmDevToolsServices
   * @param modalService NgbModal
   * @param loanDetailsServices LoanDetailsServices
   * @param formBuilder FormBuilder
   * @param loanApprovalService LoanApprovalService
   * @param translate TranslateService
   * @param datePipe DatePipe
   * @param dashbordService DashbordServices
   * @param udfService UdfService
   * @param loanManagementService LoanManagementService
   */
  constructor(public loanSharedService: SharedService, public router: Router,
    public devToolsServices: AcmDevToolsServices, public modalService: NgbModal,
    public loanDetailsServices: LoanDetailsServices, public formBuilder: FormBuilder,
    public loanApprovalService: LoanApprovalService, public translate: TranslateService,
    public authentificationService: AuthentificationService,
    public datePipe: DatePipe, public dashbordService: DashbordServices,
    public udfService: UdfService, public loanManagementService: LoanManagementService,
    public customerManagementService: CustomerManagementService,
    public exceptionRequestService: ExceptionRequestService,
    public dateFormatterService: DateFormatterService, private dbService: NgxIndexedDBService,
    public scheduleSevice: ScheduleService, public settingsService: SettingsService) {
  }
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild(LoanProcessComponent, { static: true }) loanProcess: LoanProcessComponent;
  @ViewChild(ConditionalApproveListComponent)
  conditionalApproveListComponent: ConditionalApproveListComponent;
  public loan: LoanEntity = new LoanEntity();
  public schedules: ScheduleEntity[] = [];
  public page: number;
  public pageSize: number;
  public decimalPlaces: string;
  public loading = true;
  public loadingCalcule = false;
  public modalForm: FormGroup;
  public approveForm: FormGroup;
  public calcumationForm: FormGroup;
  public settingMotifRejetsEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifReviewEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifRejetsEntitys = [];
  public settingMotifReviewEntitys = [];
  public checkModalReject: boolean;
  public checkModalReview: boolean;
  public confirmReject: boolean;
  public confirmReview: boolean;
  public confirmApprove: boolean;
  public methodCalcule = '-1';
  public currentPath = 'loan-approval';
  public checkComponentDocVisibily = false;
  public checkComponentCollateralVisibily = false;
  public checkComponentGuarantorVisibily = false;
  public checkComponentFieldVisitVisibily = false;

  //// Activated only for test with the actual Financial Component
  public checkComponentFinancialAnalisisVisibily = true;
  public listProcess: Array<LoanProcessEntity> = [];
  public product: ProductEntity;
  public userConnected: UserEntity = new UserEntity();
  public termTrouv = false;
  public amountTrouv = false;
  public apr = 0;
  public irr = 0;
  public fees = 0;
  public checkCalculate = true;
  public loanUpdated: LoanEntity = new LoanEntity();
  public minInitialPayementvalue: string;
  public minIssueDatevalue: string;
  public lastLine: ScheduleEntity;
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
  public statusLoan = false;
  public udfLinkGroupLoan: UDFLinksGroupeFieldsEntity[] = [];
  udfLoanForm: FormGroup;
  public listUDFGroupsLoan: UserDefinedFieldGroupEntity[] = [];
  public indexFormUdfLoan = 0;
  public udfGroupLoan: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
  public udfGroupsLoan: UserDefinedFieldGroupEntity[] = [];
  public udfFieldsLoan: UserDefinedFieldsEntity[][] = [];
  public udfFieldLoan: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
  public selectedGroupLoan: UDFLinksGroupeFieldsEntity;
  public surveysId: number;
  public expandedUdf = true;
  public loanEntity: LoanEntity;
  public maximumAllowedAmount: number;
  public activeException = false;
  public acceptedException = false;
  public newExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public customerRenewalCondition: RenewalConditionLoanEntity = new RenewalConditionLoanEntity();
  public acceptedExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public activeRenewalConditionSetting = false;
  public renewelLoanCondition = false;
  public feeAmount = 0;
  public updateLoanAbacus = false;
  public approveAction = false;
  public deferedPeriodeSettingTypes = true;
  public view: string = AcmConstants.VIEW;
  public currencySymbol = '';
  public currentAmount = 0;
  public apportPersonnel = 0;
  public approvalConditionsCount: number;
  public customer: CustomerEntity;
  @ViewChild(SettingCollectionValidationComponent)
  settingCollectionValidationComponent: SettingCollectionValidationComponent;
  @ViewChild(ConditionalApproveComponent, { static: false }) conditionalApproveComp: ConditionalApproveComponent;

  validatorCheck: boolean = true;

  public isLoan = true;
  categoryLoan = 'loan approval';
  @ViewChild(UploadItemComponent)
  uploadItemComponent: UploadItemComponent;
  public saveFilesAction = true;
  public originSource: string;
  public lengthDocuments: number;
  expanded = true;
  checkRequiredDocument = false;
  public checkNavigate = false;
  public displayButtonExecuteApi: boolean = false;
  public minRateValidation = 0;
  public limitMaxRateValidation: Boolean;
  public limitMinRateValidation: Boolean;
  public actualRate: number;
  public thirdParty: ThirdPartyHistoriqueEntity;
  public color: string;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  public reisUrl = null;
  public reviewAllStepForDraftSteps = true;
  private aprMethod: string;
  public scheduleFlexibleIsChecked: boolean = false;
  //expand: Boolean = false;
  /**
   * Methode to next step
   */
  changingValue: Subject<boolean> = new Subject();
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
  ngOnInit() {
    this.loan = this.loanSharedService.getLoan();
    this.apportPersonnel = this.loan.personalContribution;
    this.currentAmount = this.loan.approvelAmount + this.apportPersonnel;
    this.userConnected = this.loanSharedService.getUser();
    this.loading = false;
    this.devToolsServices.backTop();
    this.loanSharedService.setCustomer(this.loan.customerDTO);
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    this.pageSize = 5;
    this.page = 1;
    this.listProcess = this.loan.loanInstancesDtos;
    this.getComponentVisibility();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minIssueDatevalue = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.getUdfLoanInformation();
    this.loanSharedService.getRenewalConditionStatus().then((data) => {
      this.renewelLoanCondition = data;
    });
    this.customer = this.loanSharedService.getCustomer();
    if(!checkOfflineMode()){
    this.settingsService.getEnvirementValueByKeys([AcmConstants.APR_KEY]).subscribe((res) => {
      if (res){
      this.aprMethod= res[0].value ;
    }

    });
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
  } else {
    this.dbService.getByKey('data', 'envirement-values-by-keys').subscribe((environments:any)=>{
      if(environments !== undefined){
        const env = environments.data.filter(item => item.key === AcmConstants.APR_KEY);
        if(env.length > 0){
          this.aprMethod = env[0].value;
        }
       }
      }) ;
  }
  }

  /**
   * rejectModale : open reject modal
   * @param content modal
   */
  async rejectModal(content) {
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.saveUdfs()
    }
    else {
      return;
    }
    this.modalService.open(content, {
      size: 'md'
    });
    this.loan = this.loanSharedService.getLoan();
    this.createForm(AcmConstants.REJECT_CATEGORIE);
    this.confirmReject = false;
    this.settingMotifRejetsEntity.categorie = AcmConstants.REJECT_CATEGORIE;
    if (!checkOfflineMode()) {
      await this.loanDetailsServices.getReason(this.settingMotifRejetsEntity).toPromise().then(
        (data) => {
          this.settingMotifRejetsEntitys = data;
        }
      );
    } else {
      await this.dbService.getByKey('data', 'getSettingMotif_' + AcmConstants.REJECT_CATEGORIE).toPromise().then((data: any) => {
        if (data !== undefined) {
          this.settingMotifRejetsEntitys = data.data;
        }
      })
    }
    this.checkModalReview = false;
    this.checkModalReject = true;
  }

  /**
   * reviewModale : open Review modal
   * @param content modal
   */
  async reviewModal(content) {
    this.modalService.open(content, {
      size: 'md'
    });
    this.loan = this.loanSharedService.getLoan();
    this.createForm(AcmConstants.REVIEW_CATEGORIE);
    this.confirmReview = false;
    this.settingMotifReviewEntity.categorie = AcmConstants.REVIEW_CATEGORIE;
    if (!checkOfflineMode()) {
      await this.loanDetailsServices.getReason(this.settingMotifReviewEntity).toPromise().then(
        (data) => {
          this.settingMotifReviewEntitys = data;
        }
      );
    } else {
      await this.dbService.getByKey('data', 'getSettingMotif_' + AcmConstants.REVIEW_CATEGORIE).toPromise().then((data: any) => {
        if (data !== undefined) {
          this.settingMotifReviewEntitys = data.data;
        }
      })
    }
    this.checkModalReject = false;
    this.checkModalReview = true;
  }
  async nextStep() {
    this.checkNavigate = false;
    if (this.checkCalculate) {
      this.devToolsServices.openToast(3, 'alert.error-calculate');
      return;
    }
    // check if loan application is from add loan do the normal comportement
    if (this.loan.loanApplicationStatus === AcmConstants.NEW_APPLICATION) {

      if (!this.checkIssueDate(this.calcumationForm.controls.issueDate.value) ||
        !this.checkDeferredPeriod(this.calcumationForm.controls.periodsDeferred.value)) {
        return;
      }
      if (this.renewelLoanCondition && this.activeException) {
        this.devToolsServices.openToast(3, 'alert.exception_request_in_progress');
        return;
      }

      this.validateForms('approveForm');
      if (this.approveForm.valid) {
        if (!this.checkRequiredDocument) {
          this.devToolsServices.openToast(3, 'alert.enter_required_documents')
          return;
        }
        else {
          /** Send next true in changingValue To check dates in form in conditional approve component */
          this.changingValue.next(false);
          if (this.validatorCheck) {
            this.changingValue.next(true);
            this.modalService.dismissAll();
            this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE;
            this.loan.workFlowAction = AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE;
            this.loan.confirm = this.confirmApprove;
            this.loan.updateLoanAbacus = this.updateLoanAbacus;
            this.loanSharedService.setLoan(this.loan);
            this.checkNavigate = true;
          } else {
            this.devToolsServices.openToast(3, 'alert.enter_required_data')
          }
        }
      }
    } else {
      // in case of topup/refinance : check validity of calculator
      // approveAction is an input to be be sent to child component : CalculatorComponent
      this.approveAction = !this.approveAction;
    }

    this.save();
  }


  validatorHandler(event: boolean) {
    this.validatorCheck = event;
  }

  getTotalInterest(event) {
    this.loan.totalInterest = event.totalInterest;
  }
  /**
   *
   * @param event event : tab of objects output from CalculatorComponent
   * event [checkCalculate,loanEntity,renewelLoanCondition,activeException]
   */
  async nextStepTopUpRefinance(event) {
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
        this.loan.paymentFreq = event[1].paymentFreq;
        this.loan.interestFreq = event[1].interestFreq;
        this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE;
        this.loan.confirm = this.confirmApprove;
        this.loanSharedService.setLoan(this.loan);
        this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE);
      }
    } else {
      // checkCalculate : in case the calculation is required
      this.devToolsServices.openToast(3, 'alert.error-calculate');
      return;
    }
  }
  /**
   * Methode exit
   */
  exit() {
    this.loanSharedService.exitFromLoan(this.loan);
  }

  /**
   * Open model report visit modal.
   * @param content modal input
   */

  async approveModel(content) {
    // if (this.aprMethod ===AcmConstants.TN_APR){
    this.checkCalculate = true;
    //}
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.saveUdfs()
    }
    else {
      return;
    }
    this.getcolorFromHisThirdPartyByLoan();
    this.updateLoanAbacus = false;
    this.loan = this.loanSharedService.getLoan();
    if (!checkOfflineMode()) {
      await this.loanApprovalService.getProduct(this.loan.productId).subscribe(
        (data) => {
          this.initializeCalculateForm(data, content);
        }
      );
    } else {
      const products = await this.dbService.getByKey('data', 'product_' + this.loan.productId).toPromise() as any;
      if (products !== undefined) {
        this.initializeCalculateForm(products.data, content);
      }
    }
  }

  initializeCalculateForm(data,content){
    this.product = data;
    this.minPeriodsValidation = this.product.minimumDeferredPeriod;
    this.maxPeriodsValidation = this.product.maximumDeferredPeriod;
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.product.acmCurrency.decimalPlaces);
    this.currencySymbol = this.product.acmCurrency.symbol;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minIssueDatevalue = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.createApproveForm();
    if (this.loan.loanApplicationStatus === AcmConstants.NEW_APPLICATION) {
      this.createCalculationForm(this.product);
      //this.checkRate() ;
      this.getCalculationInformation(this.loan);
    }
    this.confirmApprove = false;
    if (this.renewelLoanCondition) {
      if (!checkOfflineMode()) {
        const customerAccount = new CustomerAccountEntity();
        customerAccount.customerId = this.loan.customerId !== null ? (this.loan.customerId).toString() : "";
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
        this.dbService.getByKey('data', 'renewalCondition_' + this.loan.customerDTO.customerIdExtern).toPromise().then((renewalSetting: any) => {
          if (renewalSetting !== undefined) {
            this.customerRenewalCondition = renewalSetting.data;
            if (renewalSetting.data !== null && Object.keys(renewalSetting.data).length !== 0) {
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

  updateApportPersonnel(value) {
    this.calcumationForm.controls.loanAmount.setValue(this.currentAmount - value);
    this.loan.personalContribution = value;

  }


  /**
   * getCalculationInformation
   */
  async getCalculationInformation(loan: LoanEntity) {
    if (checkOfflineMode()) {
      await this.dbService.getByKey('data', 'loanSchedules_' + loan.loanId).subscribe((resultat: any) => {
        if (resultat !== undefined) {
          this.schedules = resultat.data;
          this.updateDataFromLoan(loan);
          this.loadingCalcule = false;
          this.checkCalculate = false;
          this.lastLine = this.schedules[this.schedules.length - 1];
        }
      })
    } else {
      await this.scheduleSevice.loanSchedules(loan).toPromise().then(
        (data) => {
          this.schedules = data;
          this.updateDataFromLoan(loan);
          this.loadingCalcule = false;
          //if (this.aprMethod !==AcmConstants.TN_APR){
          // this.checkCalculate = false;
          // }
          this.lastLine = this.schedules[this.schedules.length - 1];
        });
    }
  }

  /**
   * convert pdf to print
   */
  public generatePdf() {
    const data = document.getElementById('loan-approval');
    html2canvas(data, { scrollY: -window.scrollY }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jspdf('p', 'mm', [canvas.width, canvas.height]);
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, width, height);
      window.open(URL.createObjectURL(doc.output('blob')));
    });
  }

  /**
   * Methode reject : Reject loan
   */
  async reject() {
    this.modalService.dismissAll();
    this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_REJECT;
    this.loanSharedService.setLoader(true);
    await this.loanDetailsServices.rejectLoan(this.loan).toPromise().then(
      (data) => {
        this.loanSharedService.setLoan(data);
        this.loanSharedService.setLoader(false);
        this.router.navigate([AcmConstants.DASHBOARD_URL]);
      });
    this.checkModalReject = false;
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

    this.loan.reviewFrom = this.loan.etapeWorkflow;
    this.modalService.dismissAll();
    this.loan.etapeWorkflow = this.modalForm.controls.step.value.code;
    this.loan.statutWorkflow = this.modalForm.controls.step.value.code;
    this.loan.statutLibelle = this.modalForm.controls.step.value.libelle;

    if (this.modalForm.controls.step.value.actionUser) {
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
    this.checkModalReview = false;
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
      if (!checkOfflineMode()) {
        const acmEnvironmentKeys: string[] = [AcmConstants.REVIEW_ALL_STEPS_WHEN_DRAFT_SELECTED];
        this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
          if (environments[0].enabled === false || environments[0].value === '0') {
            this.reviewAllStepForDraftSteps = false;
          }
        });
      } else {
        this.dbService.getByKey('data', 'envirement-values-by-keys').subscribe((environments: any) => {
          if (environments !== undefined) {
            const env = environments.data.filter(item => item.key === AcmConstants.REVIEW_ALL_STEPS_WHEN_DRAFT_SELECTED);
            if (env.length > 0 && env[0].enabled === false || env[0].value === '0') {
              this.reviewAllStepForDraftSteps = false;
            }
          }
        });
      }


    } else if (action === AcmConstants.REJECT_CATEGORIE) {
      this.modalForm = this.formBuilder.group({
        reason: ['', customRequiredValidator],
        note: ['', customRequiredValidator],
        confirm: ['', customRequiredValidator]
      });
    }

  }


  createCalculationForm(product: ProductEntity) {
    const amountMin = [];
    const amountMax = [];
    const termMin = [];
    const termMax = [];
    this.apr = Math.round((this.loan.apr + Number.EPSILON) * 100) / 100;
    this.irr = Math.round((this.loan.effectiveIntRate + Number.EPSILON) * 100) / 100;
    this.fees = this.loanSharedService.useExternalCBS === '1' ? Math.round(((this.loan.issueFeeAmount) + Number.EPSILON) * 100) / 100 : this.loan?.acmIssueFees;
    
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
      loanAmount: [this.loan.approvelAmount],
      repayment: [this.loan.normalPayment, customRequiredValidator],
      loanTerm: [this.loan.termPeriodNum],
      termType: [this.loan.termPeriodID, customRequiredValidator],
      issueDate: [this.minIssueDatevalue, customRequiredValidator],
      initialPayment: [new Date(this.loan.initialPaymentDate).toISOString().substring(0, 10), customRequiredValidator],
      ignoreOddDays: [this.loan.ignoreOddDays],
      periodsDeferred: [this.loan.periodsDeferred],
      periodsDeferredType: [this.loan.periodsDeferredType],
      fees: [this.fees],
      vat: [0],
      apr: [this.loan.apr],
      closingBalance: [''],
      rate: [this.actualRate],
      frequency: [this.loan.paymentFreq == null || this.loan.paymentFreq == undefined || this.loan.paymentFreq == 0 ? 1 : this.loan.paymentFreq, customRequiredValidator],
      interestFrequency: [this.loan.interestFreq == null || this.loan.interestFreq == undefined || this.loan.interestFreq == 0 ? 1 : this.loan.interestFreq, customRequiredValidator]

    });
    
    this.getInitialPaymentValue(false)
  }

  createApproveForm() {
    this.approveForm = this.formBuilder.group({
      confirm: ['', customRequiredValidator]
    });
  }

  onSubmit() {
    this.loan.note = this.modalForm.value.reason.libelle;
    this.loan.note = this.loan.note + ' : ' + this.modalForm.value.note;
    this.loan.codeExternMotifRejet = this.modalForm.value.reason.codeExternal;
    if ((this.modalForm.valid) && (this.checkModalReject)) {
      this.loan.confirm = this.confirmReject;
      this.reject();
    } else if ((this.modalForm.valid) && (this.checkModalReview)) {
      this.loan.confirm = this.confirmReview;
      this.review();
    }
  }

  /**
   * update amount for child loan
   * TODO TOPUP for groupe
   */
  async updateAmount() {
    // if feeamount != 0 get the new feeamount value from calculate API
    if (this.feeAmount !== 0) {
      this.loan.feeAmt1 = this.feeAmount;
    }
   
    if (!this.checkIssueDate(this.calcumationForm.controls.issueDate.value) ||
      !this.checkDeferredPeriod(this.calcumationForm.controls.periodsDeferred.value)) {
      return;
    } else {
      this.modalService.dismissAll();
      if(this.calcumationForm.controls.fees.value !== 0){
        this.loan.acmIssueFees = this.calcumationForm.controls.fees.value;
      }
      await this.loanApprovalService.updateAcmLoan(this.loan).toPromise().then(() => {
        this.loadLoan(this.loan);
      });
    }
  }

  /**
   * get loan
   * @param loan LoanEntity
   */
  async loadLoan(loan: LoanEntity) {
    await this.dashbordService.loadDashboardByStatus(loan).subscribe(
      (data) => {
        this.loanUpdated = data[0];
        this.loanSharedService.setLoan(this.loanUpdated);
        this.loanProcess.ngOnInit();
        this.ngOnInit();
      }
    );
  }

  changeChecboxReject() {
    if (this.confirmReject === false) {
      this.confirmReject = true;
    } else {
      this.confirmReject = false;
      this.modalForm.controls.confirm.setValue('');
    }
  }

  changeChecboxReview() {
    if (this.confirmReview === false) {
      this.confirmReview = true;
    } else {
      this.confirmReview = false;
      this.modalForm.controls.confirm.setValue('');
    }
  }

  changeChecboxApprove() {
    if (this.confirmApprove === false) {
      this.confirmApprove = true;
    } else {
      this.confirmApprove = false;
      this.approveForm.controls.confirm.setValue('');
    }
  }

  /**
   * calculate the new schedule with new data
   */
  async calculate(resetSchedule: boolean) {
    this.validateForms('calculate');
    if (!this.calcumationForm.valid) {
      this.devToolsServices.openToast(3, 'alert.check-data');
      this.devToolsServices.backTop();
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

        // check if min <loanTerm / freq < max
        if (this.minTermValidation > (loanTerm / frequency)
          || (loanTerm / frequency) > this.maxTermValidation) {
          this.devToolsServices.openToast(3, 'alert.error_loan_term_by_frequency_between_min_max');
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
      this.loan.issueDate = this.calcumationForm.controls.issueDate.value;
      this.loan.initialPaymentDate = this.calcumationForm.controls.initialPayment.value;
      this.loan.normalPayment = this.calcumationForm.controls.repayment.value;
      this.loan.termPeriodNum = this.calcumationForm.controls.loanTerm.value;
      this.loan.paymentFreq = this.calcumationForm.controls.frequency.value;
      this.loan.interestFreq = this.calcumationForm.controls.interestFrequency.value;
      this.loan.termPeriodID = this.calcumationForm.controls.termType.value;
      this.loan.periodsDeferred = this.calcumationForm.controls.periodsDeferred.value;
      this.loan.periodsDeferredType = this.calcumationForm.controls.periodsDeferredType.value;
      if (resetSchedule) {
        this.scheduleFlexibleIsChecked = false;
        this.schedules = [];
      }
      this.loan.loanSchedules = this.schedules;
      this.loan.customRate = (this.calcumationForm.controls.rate.value != undefined && this.calcumationForm.controls.rate.value != null) ? this.calcumationForm.controls.rate.value : this.loan.customRate;

      if (!checkOfflineMode()) {
        await this.loanApprovalService.calculateLoanSchedules(this.loan).toPromise().then(
          (data) => {
            this.schedules = data.loanSchedule;
            this.updateData(data);
            if (this.schedules !== undefined &&
              this.schedules[0] !== undefined &&
              this.schedules[0].repaymentDate !== undefined &&
              this.schedules[0].repaymentDate !== undefined) {
              const timeZone = 'UTC+1'; // Replace this with your desired time zone 
              const transformDate = this.dateFormatterService.ToGregorianDateStruct(this.schedules[0].repaymentDate, 'DD/MM/YYYY');
              const dateResult = new Date(transformDate.year + '-' + transformDate.month + '-' + transformDate.day);
              this.calcumationForm.controls.initialPayment.setValue(this.datePipe.transform(dateResult, 'yyyy-MM-dd', timeZone));
            }
            this.updateLoanAbacus = true;
            this.loadingCalcule = false;
            this.lastLine = this.schedules[this.schedules.length - 1];
            this.loan.totalInterest = Number(this.lastLine.interestRepayment);

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
  validateForms(formType: string) {
    if (formType === 'calcumationForm') {
      Object.values(this.calcumationForm.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
    else {
      Object.values(this.approveForm.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }
  /**
   * Update data
   */
  updateData(data: LoanCalculateEntity) {
    let decimal = 1;
    if (this.product.acmCurrency.decimalPlaces !== null || this.product.acmCurrency.decimalPlaces !== undefined || this.product.acmCurrency.decimalPlaces !== 0) {
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
        this.calcumationForm.controls.fees.setValue(this.loanSharedService.useExternalCBS === '1' ? Math.ceil(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFees);
        break;
      case AcmConstants.ROUND_DOWN:
        this.calcumationForm.controls.repayment.setValue(Math.floor((parseInt(data.normalPayment)
          + Number.EPSILON) * decimal) / decimal);
        // Not used for Tamkeen
        // this.calcumationForm.controls.vat.setValue(Math.floor((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.closingBalance.setValue(Math.floor((data.applyAmountTotal
          + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue(this.loanSharedService.useExternalCBS === '1' ? Math.floor(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFees);
        break;
      case AcmConstants.ROUND:
        this.calcumationForm.controls.repayment.setValue(Math.round((parseInt(data.normalPayment)
          + Number.EPSILON) * decimal) / decimal);
        // Not used for Tamkeen
        // this.calcumationForm.controls.vat.setValue(Math.round((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.closingBalance.setValue(Math.round((data.applyAmountTotal
          + Number.EPSILON) * decimal) / decimal);
        this.calcumationForm.controls.fees.setValue(this.loanSharedService.useExternalCBS === '1'? Math.round(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFees);
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

  getComponentVisibility() {
    this.listProcess.forEach(element => {
      switch (AcmConstants.DASHBOARD_URL + '/' + element.ihmRoot.replace('/', '')) {
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
   * Methode recommend : recommend loan
   */
  recommend() {
    this.router.navigate([AcmConstants.LOAN_REVIEW_URL]);
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
   * getMinMaxValueTerm
   */
  getMinMaxValueTerm() {
    this.amountTrouv = false;
    const termMin = [];
    const termMax = [];
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
  getMinMaxValueAmountCalculate() {
    this.amountTrouv = false;
    let approvelAmount = 0;
    approvelAmount = this.calcumationForm.value.loanTerm * this.calcumationForm.value.repayment;
    if (this.calcumationForm.value.loanTerm === '' || this.calcumationForm.value.loanTerm === null) {
      this.resetValidation();
    } else if (this.product.productDetailsDTOs.length > 0) {
      if (approvelAmount !== 0) {
        this.product.productDetailsDTOs.forEach(element => {
          if ((this.calcumationForm.value.loanTerm >= element.minimumTerm
            && this.calcumationForm.value.loanTerm <= element.maximumTerm)
            && (approvelAmount >= element.minimumAmount && approvelAmount <= element.maximumAmount)) {
            this.amountTrouv = true;
            this.calcumationForm.controls.loanAmount.setValue(approvelAmount);
          }
        });
        if (!this.amountTrouv) {
          this.calcumationForm.controls.loanAmount.clearValidators();
          this.calcumationForm.controls.loanAmount.reset();
          this.calcumationForm.controls.loanAmount.setValidators([customRequiredValidator,
            Validators.min(this.product.minimumBalance), Validators.max(this.product.maximumBalance)]);
          this.devToolsServices.openToast(3, 'alert.error_amount');
        }
      } else {
        const amountMin = [];
        const amountMax = [];
        this.product.productDetailsDTOs.forEach(element => {
          if ((this.calcumationForm.value.loanTerm >= element.minimumTerm
            && this.calcumationForm.value.loanTerm <= element.maximumTerm)) {
            amountMin.push(element.minimumAmount);
            amountMax.push(element.maximumAmount);
            this.amountTrouv = true;
          }
        });
        this.calcumationForm.controls.loanAmount.setValidators([customRequiredValidator,
          Validators.min(Math.min(...amountMin)),
          Validators.max(Math.max(...amountMax))]);
      }
    }
  }

  /**
   * getMinMaxValuTerm
   */
  getMinMaxValueTermCalculate() {
    this.termTrouv = false;
    let approvalTerm = 0;
    approvalTerm = Math.round(this.calcumationForm.value.loanAmount / this.calcumationForm.value.repayment);
    if (this.calcumationForm.value.loanAmount === '' || this.calcumationForm.value.loanAmount === null) {
      this.resetValidation();
    } else if (this.product.productDetailsDTOs.length > 0) {
      if (approvalTerm !== 0) {
        this.product.productDetailsDTOs.forEach(element => {
          if ((this.calcumationForm.value.loanAmount >= element.minimumAmount
            && this.calcumationForm.value.loanAmount <= element.maximumAmount)
            && (approvalTerm >= element.minimumTerm && approvalTerm <= element.maximumTerm)) {
            this.termTrouv = true;
            this.calcumationForm.controls.loanTerm.setValue(approvalTerm);
          }
        });
        if (!this.termTrouv) {
          this.calcumationForm.controls.loanTerm.clearValidators();
          this.calcumationForm.controls.loanTerm.reset();
          this.calcumationForm.controls.loanTerm.setValidators([customRequiredValidator,
            Validators.min(this.product.minimumTerm), Validators.max(this.product.maximumTerm)]);
          this.devToolsServices.openToast(3, 'alert.error_term');
        }
      } else {
        const termMin = [];
        const termMax = [];
        this.product.productDetailsDTOs.forEach(element => {
          if (this.calcumationForm.value.loanAmount >= element.minimumAmount
            && this.calcumationForm.value.loanAmount <= element.maximumAmount) {
            termMin.push(element.minimumTerm);
            termMax.push(element.maximumTerm);
          }
        });
        this.calcumationForm.controls.loanTerm.setValidators([customRequiredValidator,
          Validators.min(Math.min(...termMin)),
          Validators.max(Math.max(...termMax))]);
      }
    }
  }

  /**
   * checkMinMaxAmountTermCalculate
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
      this.amountTrouv = true;
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

  /**
   * getInitialPaymentValue() : First repayment is 30 after issue date/ In case of frequency activated it will be X frequency month + issue date
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
   * checkIssueDate
   * @param date issue date
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
  checkInitialPayment() {
    const issueDate1: Date = new Date(this.calcumationForm.controls.issueDate.value);
    issueDate1.setHours(0, 0, 0, 0);
    const initialPayment: Date = new Date(this.calcumationForm.controls.initialPayment.value);
    initialPayment.setHours(0, 0, 0, 0);
    if (initialPayment > issueDate1) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.issue-payment');
      return false;
    }
  }

  /**
   * checkDeferredPeriod
   * @param periodsDeferredd deffered period
   */
  checkDeferredPeriod(periodsDeferredd: number) {
    this.limitMaxPeriodsValidation = false;
    this.limitMinPeriodsValidation = false;
    const periodsDeferred: number = periodsDeferredd !== undefined ? periodsDeferredd : this.calcumationForm.controls.periodsDeferred.value;
    if (periodsDeferred < this.product.minimumDeferredPeriod ||
      periodsDeferred > this.product.maximumDeferredPeriod) {
      if (periodsDeferred > this.product.maximumDeferredPeriod) {
        this.limitMaxPeriodsValidation = true;
      } else if (periodsDeferred < this.product.minimumDeferredPeriod) {
        this.limitMinPeriodsValidation = true;
      }
      if (this.loan.loanApplicationStatus === AcmConstants.NEW_APPLICATION) {
        this.calcumationForm.controls.periodsDeferred.setErrors({ invalid: true, message: '' });
      }
      return false;
    } else {
      if (this.loan.loanApplicationStatus === AcmConstants.NEW_APPLICATION) {
        const periodsDeferredForm = this.calcumationForm.controls.periodsDeferred.value;
        this.calcumationForm.controls.periodsDeferred.reset();
        this.calcumationForm.controls.periodsDeferred.setValue(periodsDeferredForm);
      }
      return true;
    }
  }

  checkFielsRate: boolean = true;
  getcolorFromHisThirdPartyByLoan() {
      this.loanApprovalService.getFromHisThirdPartyByLoan(this.loan.loanId).subscribe(res => {
        if (res != null && res != undefined) {
          this.thirdParty = res.filter(item => item.category == AcmConstants.KYC_SCORE)[0];
          if (this.thirdParty) {

            if (this.thirdParty.riskLevel === AcmConstants.LOW_RISK_LEVEL) {//green
              this.minRateValidation = this.loan.productDTO.productDetailsDTOs[0].greenRate;
            }
            if (this.thirdParty.riskLevel === AcmConstants.MEDUIM_RISK_LEVEL) {//orange
              this.minRateValidation = this.loan.productDTO.productDetailsDTOs[0].orangeRate;
            }
            if (this.thirdParty.riskLevel === AcmConstants.HIGH_RISK_LEVEL) {//red
              this.minRateValidation = this.loan.productDTO.productDetailsDTOs[0].redRate
            }
            this.actualRate = this.minRateValidation;

          }
        } else {
          this.checkFielsRate = false;
        }
      })
        ;


  }


  async checkRate() {
    this.limitMaxRateValidation = false;
    this.limitMinRateValidation = false;
    const interstRate: number = this.calcumationForm.controls.rate.value;
    if (this.thirdParty != null && this.thirdParty != undefined) {
      if (interstRate > this.loan.productDTO.rate) {
        this.limitMaxRateValidation = true;
      } else {
        this.limitMaxRateValidation = false;
      }
      if (this.thirdParty.riskLevel === AcmConstants.LOW_RISK_LEVEL && interstRate < this.loan.productDTO.productDetailsDTOs[0].greenRate) {//green
        this.limitMinRateValidation = true;
      } else if (this.thirdParty.riskLevel === AcmConstants.LOW_RISK_LEVEL && interstRate > this.loan.productDTO.productDetailsDTOs[0].greenRate) {
        this.limitMinRateValidation = false;
      }
      if (this.thirdParty.riskLevel === AcmConstants.MEDUIM_RISK_LEVEL && interstRate < this.loan.productDTO.productDetailsDTOs[0].orangeRate) {//orange
        this.limitMinRateValidation = true;

      } else if (this.thirdParty.riskLevel === AcmConstants.MEDUIM_RISK_LEVEL && interstRate > this.loan.productDTO.productDetailsDTOs[0].orangeRate) {
        this.limitMinRateValidation = false;
      }
      if (this.thirdParty.riskLevel === AcmConstants.HIGH_RISK_LEVEL && interstRate < this.loan.productDTO.productDetailsDTOs[0].redRate) {//red
        this.limitMinRateValidation = true;
      } else if (this.thirdParty.riskLevel === AcmConstants.HIGH_RISK_LEVEL && interstRate > this.loan.productDTO.productDetailsDTOs[0].redRate) {
        this.limitMinRateValidation = false;
      }
      this.calcumationForm.get('rate').setValidators([Validators.min(this.minRateValidation)]);
      this.calcumationForm.get('rate').updateValueAndValidity();
    }
  }

  /**
   * DownLoad schedule
   */
  downloadSchedule() {
    const loanScheduleEntity = new LoanScheduleEntity();
    loanScheduleEntity.scheduleDTOs = this.schedules;
    const daterun = new Date();
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
        const anchor = document.createElement('a');
        anchor.download = 'schedule_' + daterun.getFullYear() + '-' + daterun.getMonth() + '-'
          + daterun.getDate() + '_' + daterun.getHours() + '-' + daterun.getMinutes();
        anchor.href = url;
        anchor.click();
      }
    );
  }

  /**
   * check status if issued in abacus ()
   * @param loan loan entity
   */
  checkStatusIssued(loan) {
    this.loanDetailsServices.checkIssuedStatus(loan.idLoanExtern).subscribe(async (data) => {
      if (data !== null) {
        this.statusLoan = data;
        // The system check if the loan status in ABACUS is still "ISSUED" (no reversal done):
        if (this.statusLoan) {
          this.devToolsServices.openToast(3, 'alert.check_loan_status');
        } else {
          this.loan.etapeWorkflow = AcmConstants.STATUT_WORKFLOW_DISBURSEMENT_CASE_CLOSURE;
          this.loan.statutWorkflow = AcmConstants.STATUT_WORKFLOW_DISBURSEMENT_CASE_CLOSURE;
          await this.loanApprovalService.updateLoanStatus(this.loan).toPromise().then(resultEntity => {
            this.loanSharedService.setLoan(this.loan);
            this.router.navigate([AcmConstants.UPLOAD_SIGNED_AGREEMENT_URL]);
          });
        }
      }
    });
  }

  changeCalculationForm() {
    this.checkCalculate = true;
  }
  requiredCalculateFromCalculator($event) {
    this.checkCalculate = !$event;
  }
  getUdfLoanInformation() {
    // INIT UDF FORM
    this.udfLoanForm = this.formBuilder.group({});
    this.udfFieldsLoan[0] = [];
    // Group UDF
    const udfLink = new UserDefinedFieldsLinksEntity();
    udfLink.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
    udfLink.elementId = this.loan.customerDTO.id;
    if (!checkOfflineMode()) {
      const userDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      userDefinedFieldsLinksEntity.elementId = this.loan.loanId;
      userDefinedFieldsLinksEntity.category = AcmConstants.LOAN_CATEGORY;
      userDefinedFieldsLinksEntity.productId = this.loan.productId;
      this.udfService.getUdfLinkGroupby(userDefinedFieldsLinksEntity).subscribe(
        (data) => {
          this.setUdfGroupsLoan(data);
        });
    } else {
      this.dbService.getByKey('data', 'getUdfLinkGroupbyLoan_' + this.loan.loanId).subscribe((udfLinkGroup: any) => {
        if (udfLinkGroup !== undefined) {
          this.setUdfGroupsLoan(udfLinkGroup.data);
        }
      });
    }
  }

  setUdfGroupsLoan(data) {
    this.udfLinkGroupLoan = data;
    this.getUdfAllGroupLoan();
    let indexGroup = 0;
    data.forEach((udf) => {
      const groupUDF = new UserDefinedFieldGroupEntity();
      groupUDF.id = udf.userDefinedFieldGroupID;
      groupUDF.enabled = true;
      groupUDF.mondatory = udf.mondatory;
      groupUDF.indexGroup = indexGroup;
      groupUDF.code = udf.userDefinedFieldGroupName;
      this.udfLoanForm.addControl('udfGroup' + this.indexFormUdfLoan, new FormControl(groupUDF, Validators.required));
      this.listUDFGroupsLoan.push(groupUDF);
      this.indexFormUdfLoan++;
      indexGroup++;
    });
    for (let i = 0; i < this.listUDFGroupsLoan.length; i++) {
      this.getUdfGroupLoan(i);
    }
  }

  /**
   * load user defined group
   */
  async getUdfAllGroupLoan() {
    if (!checkOfflineMode()) {
      this.udfGroupLoan = new UserDefinedFieldGroupEntity();
      this.udfGroupLoan.loanId = 1;
      this.udfGroupLoan.productId = this.loan.productId;
      this.udfService.getUdfGroup(this.udfGroupLoan).subscribe(
        (data) => {
          this.udfGroupsLoan = data;
          const notApprovalUdfGrpToRemove = this.udfGroupsLoan.filter(value => value.code === AcmConstants.LOANS_INFORMATIONS ||
            value.code === AcmConstants.INDUSTRY_CODE);
          if (notApprovalUdfGrpToRemove.length > 0) {
            this.udfGroupsLoan.splice(this.udfGroupsLoan.indexOf(notApprovalUdfGrpToRemove[0]), 1);
            this.udfGroupsLoan.splice(this.udfGroupsLoan.indexOf(notApprovalUdfGrpToRemove[1]), 1);
          }
        }
      );
    } else {
      const udfGroup: any = await this.dbService.getByKey('data', 'getUdfGroup_' + this.loan.productId).toPromise();
      if (udfGroup !== undefined) {
        this.udfGroupsLoan = udfGroup.data;
        const notApprovalUdfGrpToRemove = this.udfGroupsLoan.filter(value => value.code === AcmConstants.LOANS_INFORMATIONS ||
          value.code === AcmConstants.INDUSTRY_CODE);
        if (notApprovalUdfGrpToRemove.length > 0) {
          this.udfGroupsLoan.splice(this.udfGroupsLoan.indexOf(notApprovalUdfGrpToRemove[0]), 1);
          this.udfGroupsLoan.splice(this.udfGroupsLoan.indexOf(notApprovalUdfGrpToRemove[1]), 1);
        }
      }
    }
  }

  /**
   * load user defined group
   */
  getUdfGroupLoan(indexFormUdf) {
    this.getUdfFiledListLoan(indexFormUdf, true);
  }

  /**
   * getUdfFiledListLoan
   *
   * @param j j
   * @param init  init
   */
  async getUdfFiledListLoan(j: number, init: boolean) {
    if (!init) {
      for (let i = 0; i < this.udfFieldsLoan[j].length; i++) {
        this.udfLoanForm.controls['udfField' + j + i].reset();
        this.udfLoanForm.controls['udfField' + j + i].clearValidators();
      }
    }

    let udfGroup;
    this.udfFieldsLoan[j] = [];
    this.udfFieldLoan.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
    if (init) {
      this.udfFieldLoan.userDefinedFieldGroupDTO.id = this.listUDFGroupsLoan[j].id;
      udfGroup = this.listUDFGroupsLoan[j];
    } else {
      this.udfFieldLoan.userDefinedFieldGroupDTO.id = this.udfLoanForm.controls['udfGroup' + j].value.id;
      udfGroup = this.udfLoanForm.controls['udfGroup' + j].value;
    }

    if (!checkOfflineMode()) {
      await this.udfService.getUdfField(this.udfFieldLoan).subscribe(
        (data) => {
          this.initializeUdfFieldsLoan(j, init, data);
        });
    } else {
      const key = this.getUdfKey(udfGroup);
      await this.dbService.getByKey('data', key).toPromise().then((udfFields: any) => {
        if (udfFields !== undefined) {
          this.initializeUdfFieldsLoan(j, init, udfFields.data);
        }
      })
    }
  }

  getUdfKey(group) {
    if (group.code === AcmConstants.BANK_INFORMATION_CODE) {
      return 'udf-fields-bank-info'
    } else {
      return 'udf-fields-group-id-' + group.id
    }
  }


  // set ufd fields and initialize form
  initializeUdfFieldsLoan(j, init, data) {
    this.udfGroupLoan = this.listUDFGroupsLoan[j];
    this.udfGroupLoan.loanId = 1;
    this.udfGroupLoan.productId = this.loan.productId;
    this.udfFieldsLoan[j] = data;
    let fieldExist: boolean;
    this.selectedGroupLoan = new UDFLinksGroupeFieldsEntity();
    this.selectedGroupLoan.udfGroupeFieldsModels = [];
    if (init) {
      this.selectedGroupLoan = this.udfLinkGroupLoan[this.udfGroupLoan.indexGroup];
    } else {
      this.udfLinkGroupLoan.forEach((group) => {
        if (group.userDefinedFieldGroupID === this.udfGroupLoan.id) {
          this.selectedGroupLoan = group;
        }
      });
    }
    for (let i = 0; i < this.udfFieldsLoan[j].length; i++) {
      fieldExist = false;
      this.selectedGroupLoan.udfGroupeFieldsModels.forEach((field) => {
        this.surveysId = field.surveysId;
        // find udf from udf Links saved compare with udf settings
        if (field.udfFieldID === this.udfFieldsLoan[j][i].id) {
          this.udfFieldsLoan[j][i].idAbacusUDFLink = field.idAbacusUDFLink;
          this.udfFieldsLoan[j][i].surveysId = field.surveysId;
          this.udfFieldsLoan[j][i].idUDFLink = field.id;
          this.udfFieldsLoan[j][i].delete = false;
          // udf has a parent
          if (this.udfFieldsLoan[j][i].idUDFParentField !== 0) {
            fieldExist = true;
            this.udfLoanForm.addControl('udfField' + j + i, new FormControl('', Validators.required));
            // find parent from udf link
            this.selectedGroupLoan.udfGroupeFieldsModels.forEach((parentField) => {
              if (parentField.udfFieldID === this.udfFieldsLoan[j][i].idUDFParentField) {
                const userDefinedFieldListValuesEntity = new UserDefinedFieldListValuesEntity();
                userDefinedFieldListValuesEntity.parentUDFListValue = parentField.fieldValueId;
                // get field list values of child
                this.udfService.getUdfListValue(userDefinedFieldListValuesEntity).subscribe(
                  (udfs) => {
                    this.udfFieldsLoan[j][i].fieldListValuesDTOs = udfs;
                    // find udf field Value from udf field value Links saved compare with udf field value settings
                    udfs.forEach(
                      (fieldListValuesDTO => {
                        if (fieldListValuesDTO.name === field.value) {
                          this.udfLoanForm.controls['udfField' + j + i].setValue(fieldListValuesDTO);
                        }
                      }));
                  });
              }
            });
            // udf no parent type list
          } else if (this.udfFieldsLoan[j][i].fieldType === 5) {
            this.udfFieldsLoan[j][i].fieldListValuesDTOs.forEach(
              (fieldListValuesDTO => {
                if (fieldListValuesDTO.name === field.value) {
                  if (this.udfFieldsLoan[j][i].mandatory === true) {
                    this.udfLoanForm.addControl('udfField' + j + i, new FormControl(fieldListValuesDTO, Validators.required));
                  } else {
                    this.udfLoanForm.addControl('udfField' + j + i, new FormControl(fieldListValuesDTO));
                  }
                  fieldExist = true;
                }
              }));
            // udf no parent type no list (text, date, number ....)
          } else {
            if (this.udfFieldsLoan[j][i].mandatory === true) {
              this.udfLoanForm.addControl('udfField' + j + i, new FormControl(field.value,
                [Validators.required, Validators.pattern(this.udfFieldsLoan[j][i].fieldMasc)]));
            } else {
              this.udfLoanForm.addControl('udfField' + j + i, new FormControl(field.value,
                Validators.pattern(this.udfFieldsLoan[j][i].fieldMasc)));
            }
            fieldExist = true;
          }
        }
      });
      // udf no exist in udf field links
      if (!fieldExist) {
        if (init) {
          this.udfFieldsLoan[j][i].surveysId = this.surveysId;
        }
        if (this.udfFieldsLoan[j][i].mandatory === true) {
          this.udfLoanForm.addControl('udfField' + j + i, new FormControl('',
            [Validators.required, Validators.pattern(this.udfFieldsLoan[j][i].fieldMasc)]));
        } else {
          this.udfLoanForm.addControl('udfField' + j + i, new FormControl('',
            Validators.pattern(this.udfFieldsLoan[j][i].fieldMasc)));
        }

      }
    }
  }


  changeUDFField(j: number, i: number) {
    const udfselected = this.udfFieldsLoan[j][i];
    let parent = udfselected.id;
    let findParent = true;
    while (findParent) {
      findParent = false;
      for (let indexUDF = 0; indexUDF < this.udfFieldsLoan[j].length; indexUDF++) {
        if (this.udfFieldsLoan[j][indexUDF].idUDFParentField === parent) {
          if (parent === udfselected.id) {
            const userDefinedFieldListValuesEntity = new UserDefinedFieldListValuesEntity();
            userDefinedFieldListValuesEntity.parentUDFListValue = this.udfLoanForm.controls['udfField' + j + i].value.idUDFListValue;
            this.udfService.getUdfListValue(userDefinedFieldListValuesEntity).subscribe(
              (data) => {
                this.udfFieldsLoan[j][indexUDF].fieldListValuesDTOs = data;
                this.udfLoanForm.controls['udfField' + j + indexUDF].setValue('');
              }
            );
          } else {
            this.udfFieldsLoan[j][indexUDF].fieldListValuesDTOs = [];
          }
          parent = this.udfFieldsLoan[j][indexUDF].idUDFField;
          findParent = true;
        }
      }
    }
  }

  /**
   * add a new udf group
   */
  addUdfLoan() {
    const groupUDF = new UserDefinedFieldGroupEntity();
    groupUDF.enabled = true;
    groupUDF.code = null;
    this.listUDFGroupsLoan.push(groupUDF);
    this.udfFieldsLoan[this.listUDFGroupsLoan.length - 1] = [];
    this.udfLoanForm.addControl('udfGroup' + this.indexFormUdfLoan, new FormControl(''));
    this.indexFormUdfLoan++;
  }

  /**
   * Delete Group
   * @param i Index
   */
  deleteGroupLoan(i: number) {
    this.listUDFGroupsLoan[i].enabled = false;
    this.udfFieldsLoan[i].forEach((udfDeleted) => {
      udfDeleted.delete = true;
    });
  }

  compareFieldUDF(udf1, udf2) {
    if ((udf2 !== undefined && udf1 !== undefined) && (udf2 !== null && udf1 !== null)) {
      if ((udf2.idUDFListValue !== undefined && udf1.idUDFListValue !== undefined)
        && (udf2.idUDFListValue !== null && udf1.idUDFListValue !== null)) {
        return udf1.idUDFListValue === udf2.idUDFListValue;
      }
    }
    return false;

  }

  comparegroup(group1, group2) {
    return group1.id === group2.id;
  }

  mascPlacHolder(fieldMasc) {
    if (fieldMasc !== '') {
      fieldMasc = new RegExp(fieldMasc);
      let lengthMasc = 0;
      fieldMasc.source.match(/\d+/g).map(Number).forEach(element => {
        lengthMasc = element;
      });
      let mask = '';
      for (let i = 1; i <= lengthMasc; i++) {
        mask += 'x';
      }
      return mask;
    }
    return '';
  }

  /**
   * toggle Customer analyses
   */
  toggleCollapseCustomerAnalyses() {
    this.expandedUdf = !this.expandedUdf;
  }

  /**
   * Methode to update
   */
  async submitLoan() {
    this.devToolsServices.makeFormAsTouched(this.udfLoanForm);
    if (this.udfLoanForm.valid) {
      this.loanEntity = this.loan;
      // load UDF
      if (this.listUDFGroupsLoan.length >= 0) {
        this.loanEntity.userDefinedFieldsLinksDTOs = [];
        this.loanEntity.industryCodeDescription = '';
        for (let j = 0; j < this.listUDFGroupsLoan.length; j++) {
          for (let i = 0; i < this.udfFieldsLoan[j].length; i++) {
            const udfLink: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
            udfLink.category = AcmConstants.LOAN_CATEGORY;
            udfLink.elementId = this.loan.loanId;
            // Setting idAbacusUDFLink and surveysId and id
            udfLink.idAbacusUDFLink = this.udfFieldsLoan[j][i].idAbacusUDFLink;
            udfLink.surveysId = this.udfFieldsLoan[j][i].surveysId;
            udfLink.id = this.udfFieldsLoan[j][i].idUDFLink;
            if (this.udfFieldsLoan[j][i].delete) {
              if (udfLink.idAbacusUDFLink !== undefined && udfLink.surveysId !== undefined) {
                udfLink.fieldValue = '';
              }
            } else if (this.udfFieldsLoan[j][i].fieldType === 5) {
              udfLink.fieldValue = this.udfLoanForm.controls['udfField' + j + i].value.idUDFListValue;
              udfLink.udfListValueId = this.udfLoanForm.controls['udfField' + j + i].value.idUDFListLink;
            } else {
              udfLink.fieldValue = this.udfLoanForm.controls['udfField' + j + i].value;
            }
            // save Idustry Code in Loan Entity
            if (this.udfFieldsLoan[j][i].userDefinedFieldGroupDTO.id === 8) {
              this.udfFieldsLoan[j][i].fieldListValuesDTOs.forEach((idustryCode) => {
                if (idustryCode.idUDFListValue.toString() === this.udfLoanForm.controls['udfField' + j + i].value.toString()) {
                  this.loanEntity.industryCodeDescription += idustryCode.description + '| ';
                  // TODO CHANGE TYPE COLUMN INDUSTRY CODE
                }
              });
            }

            udfLink.userDefinedFieldsDTO = this.udfFieldsLoan[j][i];
            udfLink.indexGroup = j;
            this.loanEntity.userDefinedFieldsLinksDTOs.push(udfLink);
          }
        }
      }
      this.loanSharedService.setLoader(true);
      // send update data
      await this.loanManagementService.updateLoan(this.loanEntity).toPromise(
      ).then(resultEntity => {
        this.loanSharedService.setLoader(false);
        this.loanEntity.updateLoan = true;
        this.devToolsServices.openToast(0, 'alert.success');
        this.udfLoanForm = this.formBuilder.group({});
        this.udfFieldsLoan = [];
        this.indexFormUdfLoan = 0;
        this.listUDFGroupsLoan = [];
        this.getUdfLoanInformation();
        this.udfStepWorkflowComponent.ngOnInit()

      });
    }
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
   * checkNewOrAccpetedException
   */
  async checkNewOrAccpetedException() {
    const renewalExceptionRequest = new ExceptionRequestEntity();
    renewalExceptionRequest.customerId = this.loan.customerDTO.id;
    renewalExceptionRequest.listStatut = [AcmConstants.NEW_STATUT_REQUEST, AcmConstants.ACCEPTED_STATUT_REQUEST];
    await this.exceptionRequestService.findExceptionRequest(renewalExceptionRequest).toPromise().
      then((data) => {
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
    /* if (number > 0 ) {
      this.expand = true;
    } */
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
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
    if (this.checkNavigate === true) {
      this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE);
      if (checkOfflineMode()) {
        this.loanSharedService.moveLoanNextStep(this.loan);
      }
    }
  }

  executeThirdPartyApi() {
    this.loanDetailsServices.automaticStepLoan(this.loan).subscribe(res => {
    }, error => {
      this.devToolsServices.openToast(1, 'error.api_failed_to_execute');
    });
  }

  saveUdfs() {
    this.udfStepWorkflowComponent.saveUdfLinks();
    this.save();
  }
  scheduleFlexibleChecked(event) {
    const check = event.target as HTMLInputElement;
    this.scheduleFlexibleIsChecked = check.checked;
  }
}
