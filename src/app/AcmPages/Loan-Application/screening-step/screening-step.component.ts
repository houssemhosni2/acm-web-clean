import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AcmConstants } from '../../../shared/acm-constants';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { HabilitationEntity } from 'src/app/shared/Entities/habilitation.entity';
import { LoanDetailsServices } from '../loan-details/loan-details.services';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { AppComponent } from 'src/app/app.component';
import { MatDialog } from '@angular/material/dialog';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SettingCollectionValidationComponent } from '../../Settings/setting-collection-validation/setting-collection-validation.component';
import { UploadItemComponent } from '../../GED/upload-item/upload-item.component';
import { SettingsService } from '../../Settings/settings.service';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { UdfStepWorkflowComponent } from '../udf-step-workflow/udf-step-workflow.component';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-screening-step',
  templateUrl: './screening-step.component.html',
  styleUrls: ['./screening-step.component.sass']
})
export class ScreeningStepComponent implements OnInit, OnDestroy {
  idloan: string;
  public sub: any;
  public loan: LoanEntity = new LoanEntity();
  public loanACM: LoanEntity = new LoanEntity();

  public page: number;
  public pageSize: number;
  public confirm = false;
  public currentStatus: number;
  public userHabilitations: HabilitationEntity[] = [];
  public checkButtonHabilitation: boolean;
  public currentPath = 'screening';
  public loanProcessEntitys: LoanProcessEntity[] = [];
  public orderProcess: number;
  public loanGroupe: LoanEntity = new LoanEntity();
  public blockPrevious: boolean;
  public fieldVisitCheck = false;
  public rejectForm: FormGroup;
  public settingMotifRejetsEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifRejetsEntitys = [];
  public confirmReject: boolean;
  public echec = false;
  public buttonNextStepCustomerIScore: boolean;
  public buttonNextStepGuarantorIScore: boolean;
  public buttonNextStepCustomerAML: boolean;
  public buttonNextStepGuarantorAML: boolean;
  public userConnected: UserEntity = new UserEntity();
  @ViewChild(SettingCollectionValidationComponent)
  settingCollectionValidationComponent: SettingCollectionValidationComponent;
  public isLoan = true;
  categoryLoan = 'screening';
  @ViewChild(UploadItemComponent)
  uploadItemComponent: UploadItemComponent;
  public saveFilesAction = true;
  public originSource: string;
  public lengthDocuments: number;
  expanded = true;
  checkRequiredDocument = false;
  public checkNavigate = false;
  public displayButtonExecuteApi:boolean=false;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  /**
   * constructor
   * @param loanDetailsServices LoanDetailsServices
   * @param route ActivatedRoute
   * @param modalService NgbModal
   * @param router Router
   * @param loanSharedService LoanSharedService
   * @param dialog MatDialog
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   */
  constructor(public loanDetailsServices: LoanDetailsServices, public route: ActivatedRoute,
    public modalService: NgbModal, public router: Router, public loanSharedService: SharedService,
    public dialog: MatDialog, public devToolsServices: AcmDevToolsServices, public formBuilder: FormBuilder,
    public translate: TranslateService, public activatedRoute: ActivatedRoute,private dbService: NgxIndexedDBService,
    public settingService: SettingsService) {

  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
  ngOnInit() {
    this.devToolsServices.backTop();
    this.pageSize = 5;
    this.page = 1;
    this.loan = this.loanSharedService.getLoan();
    this.loanProcessEntitys = this.loan.loanInstancesDtos;
    this.userConnected = this.loanSharedService.getUser();
    for (let i = 0; i < this.loanProcessEntitys.length; i++) {
      if (this.loanProcessEntitys[i].code === this.loan.etapeWorkflow) {
        this.orderProcess = this.loanProcessEntitys[i].orderEtapeProcess;
      }
      if (this.loanProcessEntitys[i].ihmRoot === this.currentPath) {
        this.currentStatus = this.loanProcessEntitys[i].code;
      }
      if (this.loanProcessEntitys[i].code === AcmConstants.STATUT_WORKFLOW_FIELD_VISIT) {
        this.fieldVisitCheck = true;
      }
    }
    if(!checkOfflineMode()){
    const stepEntity: StepEntity = new StepEntity();
    stepEntity.productId = this.loan.productId;
    stepEntity.idWorkFlowStep = this.loan.etapeWorkflow;
    this.settingService.findWorkFlowSteps(stepEntity).subscribe((dataStep) => {
     if(dataStep[0].automaticStep
      &&
      (dataStep[0].acceptationCondition!== null || dataStep[0].rejectionCondition!== null))
      {
       this.displayButtonExecuteApi=true;
      }
    });
  } else {
    this.dbService.getByKey('data', 'getStepById_' + this.loan.etapeWorkflow).subscribe((result:any)=>{
      if(result !== undefined && result.data[0] !== undefined && result.data[0].automaticStep &&
        (result.data[0].acceptationCondition!== null || result.data[0].rejectionCondition!== null)){
          this.displayButtonExecuteApi=true;
      }
    });
  }
  }

  getStatus(event) {
    this.echec = event;
  }

  /**
   * Methode to next step
   */
  async nextStep() {
    // save udf
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.saveUdfs();
    }
    else {
      return;
    }
    if (this.echec === true) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.NEXT_SCREENING_BTN)
        .afterClosed().subscribe(async (res) => {
          if (res) {
            this.submitStep();
          }
        });
    } else {
      this.submitStep();
    }
  }
  saveUdfs() {
    this.udfStepWorkflowComponent.saveUdfLinks();
  }
  /**
   * Methode to submit step
   */
  async submitStep() {
    // save udf
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.saveUdfs();
    }
    else {
      return;
    }
    this.checkNavigate = false;
    if (!this.checkRequiredDocument) {
      this.devToolsServices.openToast(3,'alert.enter_required_documents');
      return;
    }
    else {
      this.loanSharedService.setLoan(this.loan);
      this.checkNavigate = true;
    }
    this.save(AcmConstants.COMPLETE_ACTION);
  }

  /**
   * Methode to next step
   */
  previousStep() {
    this.blockPrevious = this.loanSharedService.getCheckPrevious();
    if (this.blockPrevious) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.previous').afterClosed().subscribe(res => {
        if (res) {
          this.loanSharedService.getIhmByAction(AcmConstants.PREVIOUS_FORM_MSG);
        }
      });
    } else {
      this.loanSharedService.getIhmByAction(AcmConstants.PREVIOUS_FORM_MSG);
    }
  }

  /**
   * Methode exit
   */
  exit() {
    this.loanSharedService.exitFromLoan(this.loan);
  }

  /**
   * createForm
   */
  createForm() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required],
      note: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }

  /**
   * rejectModale : open reject modal
   * @param content modal
   */
  async rejectModal(content) {
    // save udf
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.saveUdfs();
    }
    else {
      return;
    }
    this.modalService.open(content, {
      size: 'md'
    });
    this.createForm();
    this.confirmReject = false;
    this.settingMotifRejetsEntity.categorie = AcmConstants.REJECT_CATEGORIE;
    await this.loanDetailsServices.getReason(this.settingMotifRejetsEntity).toPromise().then(
      (data) => {
        this.settingMotifRejetsEntitys = data;
      }
    );
  }

  /**
   * onSubmit
   */
  onSubmit() {
    this.loan.note = this.rejectForm.value.reason.libelle;
    this.loan.note = this.loan.note + ' : ' + this.rejectForm.value.note;
    this.loan.codeExternMotifRejet = this.rejectForm.value.reason.codeExternal;
    if (this.rejectForm.valid) {
      this.loan.confirm = this.confirmReject;
      this.reject();
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

  getDirection() {
    return AppComponent.direction;
  }

 async getButtonNextStepCustomerIScore(event) {
    this.buttonNextStepCustomerIScore = event;
  }

  getButtonNextStepGuarantorIScore(event) {
    this.buttonNextStepGuarantorIScore = event;
  }

  getButtonNextStepCustomerAML(event) {
    this.buttonNextStepCustomerAML = event;
  }

  getButtonNextStepGuarantorAML(event) {
    this.buttonNextStepGuarantorAML = event;
  }

  checkNextStep(): boolean {
    return this.buttonNextStepCustomerAML || this.buttonNextStepGuarantorAML ;

    // this.buttonNextStepCustomerIScore || this.buttonNextStepGuarantorIScore ||
    //   this.buttonNextStepCustomerAML || this.buttonNextStepGuarantorAML ||
    //   this.loan.owner !== this.loanSharedService.getUser().login;
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
    if (this.checkNavigate === true)
      this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT);
  }

  executeThirdPartyApi() {
    this.loanDetailsServices.automaticStepLoan(this.loan).subscribe();
  }
  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
}
