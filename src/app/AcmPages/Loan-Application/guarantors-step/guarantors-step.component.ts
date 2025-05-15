import { UploadItemComponent } from './../../GED/upload-item/upload-item.component';
import { Component, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AcmConstants } from '../../../shared/acm-constants';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { SharedService } from '../../../shared/shared.service';
import { Router } from '@angular/router';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { LoanDetailsServices } from '../loan-details/loan-details.services';
import { GuarantorsDetailsComponent } from './guarantors-details/guarantors-details.component';
import { CustomerEntity } from '../../../shared/Entities/customer.entity';
import { CustomerListService } from '../../Customer/customer-list/customer-list.service';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { GuarantorsDetailsService } from './guarantors-details/guarantors-details.service';
import { SettingCollectionValidationComponent } from '../../Settings/setting-collection-validation/setting-collection-validation.component';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DashbordServices } from '../dashbord/dashbord.services';
import { LoanProcessComponent } from '../loan-process/loan-process.component';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { SettingsService } from '../../Settings/settings.service';
import { UdfStepWorkflowComponent } from '../udf-step-workflow/udf-step-workflow.component';
import { SettingProductGuarantee } from 'src/app/shared/Entities/SettingProductGuarantee';

@Component({
  selector: 'app-guarantors-step',
  templateUrl: './guarantors-step.component.html',
  styleUrls: ['./guarantors-step.component.sass']
})
export class GuarantorsStepComponent implements OnInit, OnDestroy {
  public loan: LoanEntity = new LoanEntity();
  public checkGuarantor: boolean;
  public currentStatus = AcmConstants.STATUT_WORKFLOW_GUARANTOR;
  public currentPath = 'check-guarantor';
  @ViewChild(GuarantorsDetailsComponent, { static: true }) guarantorsDetailsComponent: GuarantorsDetailsComponent;
  public guarantors: CustomerEntity[] = [];
  public applicationFeeParent = 0;
  public isApplicationFeeParent = false;
  public view: string = AcmConstants.VIEW;
  @ViewChild(SettingCollectionValidationComponent)
  settingCollectionValidationComponent: SettingCollectionValidationComponent;
  public isLoan = true;
  categoryLoan = 'check guarantor';
  @ViewChild(UploadItemComponent)
  uploadItemComponent: UploadItemComponent;
  public saveFilesAction = true;
  public originSource: string;
  public lengthDocuments: number;
  expanded = true;
  checkRequiredDocument = false;
  public checkNavigate = false;
  loanUpdated: LoanEntity = new LoanEntity();
  public checkAge = false;
  @ViewChild(LoanProcessComponent, { static: true }) loanProcess: LoanProcessComponent;
  public displayButtonExecuteApi: boolean = false;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  public productGuarantor: SettingProductGuarantee;
  //expand: Boolean = false;
  /**
   * constructor
   * @param loanSharedService loanSharedService
   * @param router router
   * @param devToolsServices devToolsServices
   * @param loanDetailsServices loanDetailsServices
   * @param customerListService customerListService
   * @param customerManagementService customerManagementService
   * @param guarantorsDetailsService guarantorsDetailsService
   */
  constructor(public loanSharedService: SharedService,
    public router: Router,
    public devToolsServices: AcmDevToolsServices,
    public loanDetailsServices: LoanDetailsServices,
    public customerListService: CustomerListService,
    public customerManagementService: CustomerManagementService,
    public guarantorsDetailsService: GuarantorsDetailsService,
    private dbService: NgxIndexedDBService,
    public dashbordService: DashbordServices,
    public settingService: SettingsService) {
  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
  ngOnInit() {
    this.loanSharedService.checkLoanOwnerOrValidator();
    this.devToolsServices.backTop();
    this.loan = this.loanSharedService.getLoan();
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

  /**
   * get loan
   * @param loan loanEntity
   */
  async loadLoan(loan: LoanEntity) {
    if(!checkOfflineMode()){
    await this.dashbordService.loadDashboardByStatus(loan).subscribe(
      (data) => {
        this.loanUpdated = data[0];
        this.loanSharedService.setLoan(this.loan);
        this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT);
      }
    );
  } else {
    this.loanSharedService.setLoan(this.loan);
    this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT);
  }
  }
  /**
   * Methode to next Step
   */
  async nextStep() {
    // save udfs and check on required udfs
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.udfStepWorkflowComponent.saveUdfLinks();
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
      if (this.guarantorsDetailsComponent.guarantorAmount.valid) {
        this.guarantors = [];
        this.guarantorsDetailsComponent.getListGuarantors().forEach(
          (guarantor) => {
            // this.getExistCustomerIsGuarantorOrHaveLoan(guarantor);
            this.guarantors.push(guarantor);
          }
        );
        let sommeGuarantor = 0;
        let checkGuarantor = true;

        for (let i = 0; i < this.guarantors.length; i++) {
          if (this.guarantors[i].amountGuarantor === null) {
            checkGuarantor = false;
          } else if (this.guarantors[i].action !== AcmConstants.ACTION_DELETE) {
            sommeGuarantor += this.guarantors[i].amountGuarantor;
          }
        }
        let loanAmount = this.loan.applyAmountTotal;
        if (this.loan.loanApplicationStatus === AcmConstants.TOPUP) {
          loanAmount = this.loan.applyAmountTotal + this.loan.openingBalance;
        }

        if (this.loan.productDTO.productGuarantee) {
          this.productGuarantor = this.loan.productDTO.productGuarantee;
          const percentageGuarantorAmount: number = loanAmount * this.productGuarantor.minGuaranteePercentage / 100;
          const minimumRequiredAmount = Math.max(this.productGuarantor.minGuaranteeAmount, percentageGuarantorAmount);
          if (minimumRequiredAmount > sommeGuarantor) {
            this.devToolsServices.openToast(3, 'alert.min_guarantee_amount');
            return;
          }
        }

        if (this.guarantors.length === 0) {
          if (this.productGuarantor.minGuaranteePercentage == 0 && this.productGuarantor.minGuaranteeAmount == 0) {
            checkGuarantor = true
          } else {
            this.devToolsServices.openToast(3, 'waring.required_guarantors');
            return;
          }
        }
        // Desactivate for the new guarantor setting
        // else if (sommeGuarantor < loanAmount || !checkGuarantor) {
        //   if (this.loan.loanApplicationStatus === AcmConstants.TOPUP) {
        //     this.devToolsServices.openToast(3, 'waring.required_amount_topup');
        //   } else {
        //     this.devToolsServices.openToast(3, 'waring.required_amount');
        //   }
        // }
        if (checkGuarantor) {
          if (this.guarantorsDetailsComponent.check === true) {
            await this.saveGuarantor(AcmConstants.COMPLETE_ACTION);
          }
          if (this.loan.etapeWorkflow > 23) {
            this.checkNavigate = true;
          } else {
            this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT);
          }

        }
      }
    }
    if (this.checkAgeForProduct()) {
      await this.save(AcmConstants.COMPLETE_ACTION);
    }
  }
  async saveGuarantor(source?) {
    if (source !== AcmConstants.COMPLETE_ACTION) {
      // save udfs and do not check on required udfs
      this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
      this.udfStepWorkflowComponent.saveUdfLinks();
    }
    // save guarantors
    if (this.guarantorsDetailsComponent.guarantorAmount.valid) {
      this.guarantors = [];
      const actualStep = this.loan.loanInstancesDtos.filter(item => this.loan.etapeWorkflow === item.code)[0].ihmRoot
      this.guarantorsDetailsComponent.getListGuarantors().forEach(
        (guarantor) => {
          // this.getExistCustomerIsGuarantorOrHaveLoan(guarantor);
          this.guarantors.push(guarantor);
        }
      );
      let sommeGuarantor = 0;
      let checkGuarantor = true;
      for (let i = 0; i < this.guarantors.length; i++) {
        if (this.guarantors[i].amountGuarantor === null) {
          checkGuarantor = false;
        } else if (this.guarantors[i].action !== AcmConstants.ACTION_DELETE) {
          sommeGuarantor += this.guarantors[i].amountGuarantor;
        }
      }
      let loanAmount = this.loan.applyAmountTotal;

      if (this.loan.loanApplicationStatus === AcmConstants.TOPUP) {
        loanAmount = this.loan.applyAmountTotal + this.loan.openingBalance;
      }
      if ((actualStep !== 'check-guarantor' && actualStep !== ('/' + 'check-guarantor')) && sommeGuarantor < loanAmount) {

        if (this.guarantors.length === 0) {
          this.devToolsServices.openToast(3, 'waring.required_guarantors');

        } else if (sommeGuarantor < loanAmount || !checkGuarantor) {
          if (this.loan.loanApplicationStatus === AcmConstants.TOPUP) {
            this.devToolsServices.openToast(3, 'waring.required_amount_topup');
          } else {
            this.devToolsServices.openToast(3, 'waring.required_amount');
          }
        }
      } else {
        this.loanSharedService.setLoader(true);
        this.loan.guarantors = this.guarantors;
        if (!this.checkAgeForProduct()) {
          this.loanSharedService.setLoader(false);
          return;
        }

        const isFromOfflineSync = sessionStorage.getItem('isFromOfflineSync') === 'true';
        if (checkOfflineMode() && !isFromOfflineSync) {
          await this.dbService.update('guarantors', {loanId : this.loan.loanId , guarantors : this.guarantors }).toPromise();
          this.dbService.update('loans', this.loan).subscribe(
            () => {
              // remove deleted guarantors from the displayed list of guarantors
              this.guarantors = this.guarantors.filter(guar => guar.action !== AcmConstants.ACTION_DELETE);
              // reset the new guarantors 'action to ''
              this.guarantors.forEach(guar => {
                guar.action = '';
              });
              this.guarantorsDetailsComponent.setListGuarantors(this.guarantors);
              this.loanSharedService.setLoader(false);

              // this.save(AcmConstants.COMPLETE_ACTION);
            },
            error => console.error('Error saving gurantors:', error)
          );
          const key = 'getLoanGuarantorByLoanId_' + this.loan.loanId;         
          await this.dbService.update('data', {id : key , data : this.guarantors }).toPromise();
        } else {
          await this.customerListService.addGuarantors(this.loan).toPromise().then(res => {
            // remove deleted guarantors from the displayed list of guarantors
            this.guarantors = this.guarantors.filter(guar => guar.action !== AcmConstants.ACTION_DELETE);
            // reset the new guarantors 'action to ''
            this.guarantors.forEach(guar => {
              guar.action = '';
            });
            this.guarantorsDetailsComponent.setListGuarantors(this.guarantors);
            this.guarantorsDetailsComponent.saveGuarantor = true;
            this.loanSharedService.setLoader(false);
            this.loanSharedService.setLoan(this.loan);
            // this.save(AcmConstants.COMPLETE_ACTION);


          });
        }

        this.devToolsServices.openToast(0, 'alert.success');
        this.guarantorsDetailsComponent.check = false;
      }
    }
    if (this.uploadItemComponent.documentListUpdated === true && this.checkAge) {
      await this.save(AcmConstants.COMPLETE_ACTION);
    }

  }


  checkAgeForProduct() {
    if (this.loan.guarantors === null || this.loan.guarantors === undefined) {
      // this.getExistCustomerIsGuarantorOrHaveLoan(guarantor);
      this.loan.guarantors = this.guarantorsDetailsComponent.getListGuarantors()
    }
    for (const guarantor of this.loan.guarantors) {
      if (guarantor.action !== AcmConstants.ACTION_DELETE) {
        guarantor.age = this.updateAge();
        if (guarantor.age !== null && guarantor.age >= this.loan.productDTO.minimumAge &&
          guarantor.age <= this.loan.productDTO.maximumAge) {
          this.checkAge = true;
          return true;
        } else {
          this.devToolsServices.openToast(3, 'alert.age_guarantor_limit_product');
          this.checkAge = false;
          return false;
        }
      }
    }
    return true;
  }
  /**
   *
   * update age
   */
  updateAge(): number {
    const issueDate1: Date = new Date(this.loan.issueDate);
    const lastInstallementDate = issueDate1.getMonth() + this.loan.installmentNumber;
    const dateEndLoan = new Date(issueDate1.setMonth(lastInstallementDate));
    const bdate = new Date(this.loan.guarantors[0].dateOfBirth);
    const timeDiff = Math.abs(dateEndLoan.getTime() - bdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
  }

  /**
   * Methode to next step
   */
  previousStep() {
    if (this.guarantorsDetailsComponent.check === true) {
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

  checkDisabled(event: boolean) {
    this.checkGuarantor = event;
  }

  /**
   * getExistCustomerIsGuarantorOrHaveLoan
   * @param customerSelected CustomerEntity
   */
  async getExistCustomerIsGuarantorOrHaveLoan(customerSelected) {
    await this.customerManagementService.getEnvirementValueByKey(AcmConstants.CUSTOMER_GUARANTOR).toPromise().then((data) => {
      if (data.value === '1') {
        const customerLinksRelationshipEntity: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
        customerLinksRelationshipEntity.category = AcmConstants.RELATION_GUARANTOR;
        customerLinksRelationshipEntity.member = customerSelected;
        this.guarantorsDetailsService.findCustomerActiveGuarantor(customerLinksRelationshipEntity).toPromise().then(
          (guarantor) => {
            if (guarantor.length > 0) {
              this.devToolsServices.openToast(3, 'alert.customer_is_guarantor_add_guarantor');
              return;
            } else {
              this.guarantorsDetailsService.findAllActiveAccountsForCustomer(customerSelected.customerIdExtern).toPromise().then(
                (customerAccount) => {
                  if (customerAccount.length > 0) {
                    this.devToolsServices.openToast(3, 'alert.guarantor_have_loan');
                    return;
                  }
                });
            }
          });
      }
    });
  }

  getApplicationFeeValue(event) {
    this.applicationFeeParent = event;
  }
  getIsApplicationFee(event: boolean) {
    this.isApplicationFeeParent = event;
  }
  /**
   * Display the confirmation message
   */
  async save(source?: string) {
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
    if (this.checkNavigate === true) {
      await this.loadLoan(this.loan);
      if(checkOfflineMode()){
        this.loanSharedService.moveLoanNextStep(this.loan);
      }
    }
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }

  executeThirdPartyApi() {
    this.loanDetailsServices.automaticStepLoan(this.loan).subscribe();
  }
}
