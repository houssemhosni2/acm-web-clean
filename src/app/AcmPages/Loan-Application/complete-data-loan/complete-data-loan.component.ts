import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanDetailsServices } from '../loan-details/loan-details.services';
import { EditLoanComponent } from '../loan-management/edit-loan/edit-loan.component';
import { LoanProcessComponent } from '../loan-process/loan-process.component';
import { DashbordServices } from '../dashbord/dashbord.services';
import { MatDialog } from '@angular/material/dialog';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { SettingsService } from '../../Settings/settings.service';
import { UdfStepWorkflowComponent } from '../udf-step-workflow/udf-step-workflow.component';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';

@Component({
  selector: 'app-complete-data-loan',
  templateUrl: './complete-data-loan.component.html',
  styleUrls: ['./complete-data-loan.component.sass']
})
export class CompleteDataLoanComponent implements OnInit, OnDestroy {
  currentJustify2 = 'justified';
  loan: LoanEntity = new LoanEntity();
  currentPath = 'loan-details';
  loanProcessEntitys: LoanProcessEntity[] = [];
  // TODO fix loan process
  currentStatus: number;
  changeLoan = false;
  disabled = true;
  loanUpdated: LoanEntity = new LoanEntity();
  @ViewChild(EditLoanComponent) loanComp: EditLoanComponent;
  @ViewChild(LoanProcessComponent, { static: true }) loanProcess: LoanProcessComponent;
  public displayButtonExecuteApi: boolean = false;

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
   * @param dashbordService DashbordServices
   */
  constructor(public loanDetailsServices: LoanDetailsServices, public route: ActivatedRoute,
    public modalService: NgbModal, public router: Router, public loanSharedService: SharedService,
    public dialog: MatDialog, public devToolsServices: AcmDevToolsServices, public formBuilder: FormBuilder,
    public translate: TranslateService, public dashbordService: DashbordServices,
    private dbService: NgxIndexedDBService, public settingService: SettingsService,
  ) {
  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
 async ngOnInit() {
    this.loan = this.loanSharedService.getLoan();
    this.loanProcessEntitys = this.loan.loanInstancesDtos;

    this.loanProcessEntitys.forEach(element => {

      if (element.ihmRoot === this.currentPath) {
        this.currentStatus = element.code;
      }
    });

    // to rreview by Rmila
    if (!checkOfflineMode()) {
      this.loanSharedService.checkLoanOwnerOrValidator();
    
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
    const data = await this.dbService.getByKey('data', 'getStepById_' + this.loan.etapeWorkflow).toPromise() as any;
    if(data !== undefined){
       const dataStep = data.data ;
       if(dataStep[0].automaticStep
        &&
        (dataStep[0].acceptationCondition!== null || dataStep[0].rejectionCondition!== null))
        {
         this.displayButtonExecuteApi=true;
        }
    }
  }

  }

  /**
   * Methode to next step
   */
  async nextStep() {


    this.devToolsServices.makeFormAsTouched(this.loanComp.udfStepWorkflowComponent.udfLoanForm);
    if (!this.loanComp.checkAgeForProduct() || !this.loanComp.udfStepWorkflowComponent.udfLoanForm.valid) {

      return;
    }
    else {
    
      await this.submitLoan();
      this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT);

    }

  }

  /**
   * Methode exit
   */
  exit() {
    this.loanSharedService.exitFromLoan(this.loan);
  }

  /**
   * SubmitLoan
   */

  async submitLoan() {
    this.devToolsServices.makeFormAsTouched(this.loanComp.udfStepWorkflowComponent.udfLoanForm);

    if (this.loanComp.udfStepWorkflowComponent.udfLoanForm.valid) {
      await this.loanComp.submitLoan().then(() => {
        this.loadLoan(this.loan);
      });
      this.changeLoan = false;
    }
  }


  /**
   * get loan
   * @param loan loanEntity
   */
  async loadLoan(loan: LoanEntity) {
    const isFromOfflineSync = sessionStorage.getItem('isFromOfflineSync') === 'true';
    if (checkOfflineMode() && !isFromOfflineSync) {
      // await this.dbService.update('loans', this.loan).toPromise();

      let updatedtLoan = this.loan;
      updatedtLoan = await this.loanSharedService.moveLoanNextStep(updatedtLoan);

      this.loanSharedService.setLoan(updatedtLoan);
      this.loanProcess.ngOnInit();
      this.ngOnInit();

      //to do
    //  await this.dbService.update('loans', this.loan).subscribe(
    //     () => {
    //       this.loanSharedService.setLoan(loan);
    //       this.loanProcess.ngOnInit();
    //       this.ngOnInit();
    //       console.log("to be checked")
    //     },
    //     error => console.error('Error updating loan:', error)
    //   );

    } else {
      await this.dashbordService.loadDashboardByStatus(loan).subscribe(
        (data) => {
          this.loanUpdated = data[0];
          this.loanSharedService.setLoan(this.loanUpdated);
          this.loanProcess.ngOnInit();
          this.ngOnInit();
        }
      );
    }
  }

  /**
   * check loan if changed
   * @param event boolean
   */
  checkloan(event: boolean) {
    this.loan.updateLoan = event;
  }

  /**
   * check if any forms of loan changed
   * @param event boolean
   */
  changeFormsLoan(event: boolean) {
    this.changeLoan = true;
  }

  /**
   * previous Step
   */
  previousStep() {
    this.router.navigate([AcmConstants.LOAN_DETAIL_URL]);
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }

  executeThirdPartyApi() {
    this.loanDetailsServices.automaticStepLoan(this.loan).subscribe();
  }
}
