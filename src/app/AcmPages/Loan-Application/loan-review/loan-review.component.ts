import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanDetailsServices } from '../loan-details/loan-details.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { ProductEntity } from '../../../shared/Entities/product.entity';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';
import { LoanApprovalService } from '../loan-approval/loan-approval.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SettingCollectionValidationComponent } from '../../Settings/setting-collection-validation/setting-collection-validation.component';
import { UploadItemComponent } from '../../GED/upload-item/upload-item.component';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { SettingsService } from '../../Settings/settings.service';
import { UdfStepWorkflowComponent } from '../udf-step-workflow/udf-step-workflow.component';
import { checkOfflineMode, customRequiredValidator } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-loan-review',
  templateUrl: './loan-review.component.html',
  styleUrls: ['./loan-review.component.sass']
})
export class LoanReviewComponent implements OnInit, OnDestroy {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loan: LoanEntity = new LoanEntity();
  public page: number;
  public pageSize: number;
  public decimalPlaces: string;
  public modalForm: FormGroup;
  public approveForm: FormGroup;
  public settingMotifRecommendEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifReviewEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifRecommendEntitys = [];
  public settingMotifReviewEntitys = [];
  public checkModalRecommend: boolean;
  public checkModalReview: boolean;
  public confirmRecommend: boolean;
  public confirmReview: boolean;
  public currentStatus: number;
  public currentPath = 'loan-review';
  public orderProcess: number;
  public checkComponentDocVisibily = false;
  public checkComponentCollateralVisibily = false;
  public checkComponentGuarantorVisibily = false;
  public checkComponentFieldVisitVisibily = false;
  public checkComponentFinancialAnalisisVisibily = false;
  public loanProcessEntitys: Array<LoanProcessEntity> = [];
  public product: ProductEntity;
  public userConnected: UserEntity = new UserEntity();
  public view: string = AcmConstants.VIEW;
  public reviewAllStepForDraftSteps = true;
  @ViewChild(SettingCollectionValidationComponent)
  settingCollectionValidationComponent: SettingCollectionValidationComponent;
  public isLoan = true;
  categoryLoan = 'loan review';
  @ViewChild(UploadItemComponent)
  uploadItemComponent: UploadItemComponent;
  public saveFilesAction = true;
  public originSource: string;
  public lengthDocuments: number;
  expanded = true;
  checkRequiredDocument = false;
  public checkNavigate = false;
  public displayButtonExecuteApi: boolean = false;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  //expand: Boolean = false;
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
   */
  constructor(public loanSharedService: SharedService, public router: Router,
    public devToolsServices: AcmDevToolsServices, public modalService: NgbModal,
    public loanDetailsServices: LoanDetailsServices, public formBuilder: FormBuilder,private dbService: NgxIndexedDBService,
    public loanApprovalService: LoanApprovalService, public translate: TranslateService,
    public route: ActivatedRoute, public activatedRoute: ActivatedRoute,
    public authentificationService: AuthentificationService, public settingsService: SettingsService) {
  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
  ngOnInit() {
    this.devToolsServices.backTop();
    this.userConnected = this.loanSharedService.getUser();
    this.loan = this.loanSharedService.getLoan();
    this.loanSharedService.setCustomer(this.loan.customerDTO);
    this.decimalPlaces = '1.' + this.loan.currencyDecimalPlaces + '-' + this.loan.currencyDecimalPlaces;
    this.pageSize = 5;
    this.page = 1;
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
   * recommendModel : open recommend modal
   * @param content modal
   * @param type of recommendation AUDIT / RISK
   */
  async recommendModel(content, type: string) {
    this.modalService.open(content, {
      size: 'md'
    });
    this.createForm(false);
    this.confirmRecommend = false;
    this.settingMotifRecommendEntity.categorie = AcmConstants.RECOMMEND_CATEGORIE;
    if (type === 'AUDIT') {
      this.loan.workFlowAction = AcmConstants.WORKFLOW_REQUEST_ACTION_RECOMMEND_AUDIT;
    } else if (type === 'RISK') {
      this.loan.workFlowAction = AcmConstants.WORKFLOW_REQUEST_ACTION_RECOMMEND_RISK;
    }
    if(checkOfflineMode()){
      await this.dbService.getByKey('data', 'getSettingMotif_' + AcmConstants.RECOMMEND_CATEGORIE ).toPromise().then((data:any)=>{
        if(data !== undefined){
          this.settingMotifRecommendEntitys = data.data;
        }
      })
    } else {
      await this.loanDetailsServices.getReason(this.settingMotifRecommendEntity).toPromise().then(
        (data) => {
          this.settingMotifRecommendEntitys = data;
  
        }
      );
    }
    this.checkModalRecommend = true;
  }

  /**
   * reviewModale : open Review modal
   * @param content modal
   */
  async reviewModal(content) {
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
    this.createForm(true);
    this.confirmReview = false;

    this.settingMotifReviewEntity.categorie = AcmConstants.REVIEW_CATEGORIE;
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
    this.checkModalReview = true;
  }

  /**
   * Methode to next step
   */
  async recommand() {
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.saveUdfs()
    }
    else {
      return;
    }
    this.checkNavigate = false;
    if (!this.checkRequiredDocument) {
      this.devToolsServices.openToast(3, 'alert.enter_required_documents')
      return;
    }
    else {
      this.modalService.dismissAll();
      this.loanSharedService.setLoan(this.loan);
      this.checkNavigate = true;
    }
    this.save();
  }

  /**
   * Methode exit
   */
  exit() {
    this.loanSharedService.exitFromLoan(this.loan);
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
    if(this.modalForm.controls.step.value.actionUser){
      this.loan.owner = this.modalForm.controls.step.value.actionUser;
      // get full name by username to display it in loanOwnerName
      await this.authentificationService.getUserByLogin(this.modalForm.controls.step.value.actionUser)
        .toPromise().then(res => {
          this.loan.ownerName = res.fullName;
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
   * create Form for modale
   * @param mode true for review to add step / false for recommendation.
   */
  createForm(mode: boolean) {
    this.modalForm = this.formBuilder.group({
      reason: ['', customRequiredValidator],
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
    if (mode) {
      this.modalForm.addControl('step', new FormControl('', customRequiredValidator))

    }
  }

  /**
   * Methode createForm
   */
  onSubmit() {
    // save udf
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.saveUdfs();
      this.loan.note = this.modalForm.value.reason.libelle;
      this.loan.note = this.loan.note + ' : ' + this.modalForm.value.note;
      this.loan.codeExternMotifRejet = this.modalForm.value.reason.codeExternal;

      if ((this.modalForm.valid) && (this.checkModalRecommend)) {
        this.loan.confirm = this.confirmRecommend;
        this.recommand();
      } else if ((this.modalForm.valid) && (this.checkModalReview)) {
        this.loan.confirm = this.confirmReview;
        this.review();
      }
    }
  }

  /**
   * OnSubmit review
   */
  onSubmitReview() {
    this.loan.note = this.modalForm.value.reason.libelle;
    this.loan.note = this.loan.note + ' : ' + this.modalForm.value.note;
    this.loan.codeExternMotifRejet = this.modalForm.value.reason.codeExternal;
    if (this.modalForm.valid) {
      this.loan.confirm = this.confirmReview;
      this.review();
    }
  }

  /**
   * Methode changeChecboxRecommand
   */
  changeChecboxRecommand() {
    if (this.confirmRecommend === false) {
      this.confirmRecommend = true;
    } else {
      this.confirmRecommend = false;
      this.modalForm.controls.confirm.setValue('');
    }
  }
  /**
   * Methode changeChecboxReview
   */
  changeChecboxReview() {
    if (this.confirmReview === false) {
      this.confirmReview = true;
    } else {
      this.confirmReview = false;
      this.modalForm.controls.confirm.setValue('');
    }
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

 async saveDocumentsDone(event) {
    if (this.checkNavigate === true){
      this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT);
      if(checkOfflineMode()){
        let updatedtLoan = this.loan;
        updatedtLoan = await this.loanSharedService.moveLoanNextStep(updatedtLoan);
      }
    }
  }

  executeThirdPartyApi() {
    this.loanDetailsServices.automaticStepLoan(this.loan).subscribe();
  }
  saveUdfs() {
    this.udfStepWorkflowComponent.saveUdfLinks();
    this.save();
    // this.devToolsServices.openToast(0, 'alert.success');
  }
}
