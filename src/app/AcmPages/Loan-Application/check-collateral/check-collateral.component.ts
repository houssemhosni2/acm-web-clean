import { Component, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { Router } from '@angular/router';
import { LoanDetailsServices } from '../loan-details/loan-details.services';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { CollaterolEntity } from 'src/app/shared/Entities/collaterol.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { CollateralStepDetailsComponent } from './collateral-step-details/collateral-step-details.component';
import { LoanCollateralsServices } from './loan-collaterals/loan-collaterals.services';
import { UploadItemComponent } from '../../GED/upload-item/upload-item.component';
import { DashbordServices } from '../dashbord/dashbord.services';
import { LoanProcessComponent } from '../loan-process/loan-process.component';
import { SettingsService } from '../../Settings/settings.service';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { UdfStepWorkflowComponent } from '../udf-step-workflow/udf-step-workflow.component';
import { SettingProductGuarantee } from 'src/app/shared/Entities/SettingProductGuarantee';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-check-collateral',
  templateUrl: './check-collateral.component.html',
  styleUrls: ['./check-collateral.component.sass']
})
export class CheckCollateralComponent implements OnInit, OnDestroy {
  @ViewChild(CollateralStepDetailsComponent, { static: true }) collateralStepDetailsComponent: CollateralStepDetailsComponent;
  public loan: LoanEntity = new LoanEntity();
  public collateral: CollaterolEntity[] = [];
  public currentStatus: number;
  public checkCollateral = true;
  public currentPath = 'check-collateral';
  public loanProcessEntitys: LoanProcessEntity[] = [];
  public orderProcess: number;
  public sommeNetValue: number;
  public view: string = AcmConstants.VIEW;
  public checkSettingDocument = false;
  checkRequiredDocument = false;
  @ViewChild(UploadItemComponent)
  uploadItemComponent: UploadItemComponent;
  public saveFilesAction = true;
  public originSource: string;
  public lengthDocuments: number;
  public checkNavigate = false;
  loanUpdated: LoanEntity = new LoanEntity();
  @ViewChild(LoanProcessComponent, { static: true }) loanProcess: LoanProcessComponent;
  public displayButtonExecuteApi: boolean = false;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  public productGuarantor: SettingProductGuarantee;
  public isCollateralStep: boolean = false;

  /**
   * constructor
   * @param LoanDetailsServices loanDetailsServices
   * @param LoanSharedService  loanSharedService
   * @param Router router
   * @param AcmDevToolsServices devToolsServices
   */
  constructor(public loanDetailsServices: LoanDetailsServices, public loanSharedService: SharedService,
    public router: Router, public devToolsServices: AcmDevToolsServices,private dbService: NgxIndexedDBService,
    public collateralStepService: LoanCollateralsServices, public dashbordService: DashbordServices,
    public settingService: SettingsService) {
  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
  ngOnInit() {
    this.loan = this.loanSharedService.getLoan();
    this.devToolsServices.backTop();
    this.loanProcessEntitys = this.loan.loanInstancesDtos;
    this.loanProcessEntitys.forEach(element => {
      if (element.code === this.loan.etapeWorkflow) {
        this.orderProcess = element.orderEtapeProcess;
      }
      if (element.ihmRoot === '/check-collateral') {
        this.currentStatus = element.code;
        this.isCollateralStep = true;
      }
    });

    if ((this.loan.etapeWorkflow === this.currentStatus)) {
      this.checkCollateral = false;
    } else {
      this.checkCollateral = true;
    }

    if(!checkOfflineMode()){
    const stepEntity: StepEntity = new StepEntity();
    stepEntity.productId = this.loan.productId;
    stepEntity.idWorkFlowStep = this.loan.etapeWorkflow;
    this.settingService.findWorkFlowSteps(stepEntity).subscribe((dataStep) => {
      if (dataStep[0].automaticStep
        &&
        (dataStep[0].acceptationCondition !== null || dataStep[0].rejectionCondition !== null)) {
        this.displayButtonExecuteApi = true;
      }
    });
  }
  }
  calculateSommeNetValue() {
    this.sommeNetValue = 0;
    this.loan.collaterals = this.collateralStepDetailsComponent.getGuaranties();
    this.loan.collaterals.forEach((guarantie) => {
      this.sommeNetValue += guarantie.netValue;
    });
  }
  /**
   * save
   */
  async save() {
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.invalid ) {
      this.devToolsServices.InvalidControl();
      return;
    }
    if (!this.checkRequiredDocument) {
      this.devToolsServices.openToast(3, 'alert.enter_required_documents')
      return;
    }

    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.invalid ) {
      this.devToolsServices.InvalidControl();
      return;
    }
    if (!this.checkRequiredDocument) {
      this.devToolsServices.openToast(3, 'alert.enter_required_documents')
      return;
    }

    // save udfs
    this.udfStepWorkflowComponent.saveUdfLinks();
    if (this.uploadItemComponent.documentListUpdated === true) {
      await this.saveDocuments(AcmConstants.COMPLETE_ACTION);
    }
    if (!this.checkCollateral) {
      this.calculateSommeNetValue();
      // if loan is in current status => save in all cases so we don't check on netValue or guaranties[].empty
      if (this.loan.etapeWorkflow === this.currentStatus) {

            this.checkCollateral = true;
            this.devToolsServices.openToast(0, 'alert.success');
            return;
      }
        // check if table guaranties[] is empty
        if (this.loan.collaterals.length === 0) {
          this.devToolsServices.openToast(3, 'collaterol.missing_collaterol');
          return;
        } /*else if (this.sommeNetValue < this.loan.applyAmountTotal) {
          this.devToolsServices.openToast(3, 'collaterol.error_amount');
          return;
        }*/

    } else {
      this.devToolsServices.openToast(3, 'collaterol.no_change');
      return;
    }

  }
  /**
   * Methode to next Step
   */
  async nextStep() {
    this.checkNavigate = false;

    if (!this.checkRequiredDocument) {
      this.devToolsServices.openToast(3, 'alert.enter_required_documents')
      return;
    }
    else {
      this.calculateSommeNetValue();
      if (!this.checkCollateral) {
        await this.save();
      }
      if (this.checkCollateral) {
        this.checkNavigate = true;
      }
      else if (this.loan.collaterals.length === 0) {
        this.devToolsServices.openToast(3, 'collaterol.missing_collaterol');
        return;
      } else if (this.sommeNetValue < this.loan.applyAmountTotal) {
        this.devToolsServices.openToast(3, 'collaterol.error_amount');
        return;
      }
      if(this.loan.productDTO.productGuarantee){
        this.productGuarantor = this.loan.productDTO.productGuarantee;
        const percentageGuarantorAmount: number = this.loan.applyAmountTotal * this.productGuarantor.minCollateralPercentage / 100;
        const minimumRequiredAmount = Math.max(this.productGuarantor.minGuaranteeAmount, percentageGuarantorAmount);
        if(minimumRequiredAmount > this.sommeNetValue){
          this.devToolsServices.openToast(3, 'alert.min_collateral_amount');
          return;
        }
      }
    }
    await this.saveDocuments();
  }

  /**
   * Methode to next step
   */
  previousStep() {
    if (!this.checkCollateral) {
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
   * check disabled
   * @param event boolean
   */
  checkDisabled(event: boolean) {
    this.checkCollateral = event;
  }

  /**
   * check if setting documents exist
   * if setting documents exist event = true else event = false
   * @param Boolean event
   */
  typeDocumentExistMethode(event) {
    this.checkSettingDocument = event;
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

  /**
   * Display the confirmation message
   */
  async saveDocuments(source?: string) {
    // send origin source as 'click on save button' or 'click on complete button'
    this.originSource = source;
    this.saveFilesAction = !this.saveFilesAction;
  }

  receiveLengthDocuments(number: number) {
    this.lengthDocuments = number;
  }

  async saveDocumentsDone(event) {
    if (this.checkNavigate)
      await this.loadLoan(this.loan);
  }

  /**
   * get loan
   * @param loan loanEntity
   */
  async loadLoan(loan: LoanEntity) {
    if(!checkOfflineMode()){
    await this.dashbordService.loadDashboardByStatus(loan).toPromise().then(
      (data) => {
        this.loanUpdated = data.find((item: LoanEntity) => item.loanId === loan.loanId);
        this.loanSharedService.setLoan(this.loanUpdated);
        this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT);
      }
    )
  } else {
    let updatedtLoan = this.loan;
    this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT);
    updatedtLoan = await this.loanSharedService.moveLoanNextStep(updatedtLoan);
    this.loanSharedService.setLoan(updatedtLoan);
  }
  }

  executeThirdPartyApi() {
    this.loanDetailsServices.automaticStepLoan(this.loan).subscribe();
  }
}
