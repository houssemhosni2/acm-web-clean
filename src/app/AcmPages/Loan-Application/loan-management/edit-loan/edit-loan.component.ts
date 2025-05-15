import { AssetLoanEntity } from './../../../../shared/Entities/AssetLoan.entity';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { CustomerManagementService } from 'src/app/AcmPages/Customer/customer-management/customer-management.service';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanCalculateEntity } from 'src/app/shared/Entities/LoanCalculate.entity';
import { LoanSourceOfFundsEntity } from 'src/app/shared/Entities/loanSourceOfFunds.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { ProductLoanReasonEntity } from 'src/app/shared/Entities/productLoanReason.entity';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';
import { UDFLinksGroupeFieldsEntity } from 'src/app/shared/Entities/udfLinksGroupeFields.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanApprovalService } from '../../loan-approval/loan-approval.service';
import { UdfComponent } from '../../udf/udf.component';
import { UdfService } from '../../udf/udf.service';
import { LoanManagementService } from '../loan-management.service';
import { UserDefinedFieldListValuesEntity } from '../../../../shared/Entities/userDefinedFieldListValues.entity';
import { DatePipe } from '@angular/common';
import { LoanScheduleEntity } from 'src/app/shared/Entities/loanSchedule.entity';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { RenewalConditionLoanEntity } from 'src/app/shared/Entities/renewalConditionLoan.entity';
import { ExceptionRequestService } from '../../dashbord/exception-request/exception-request.service';
import { TranslateService } from '@ngx-translate/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CalculatorComponent } from '../calculator/calculator.component';
import { CustomerAccountEntity } from 'src/app/shared/Entities/customer.account.entity';
import { ScheduleService } from '../../loan-schedule/schedule.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UdfStepWorkflowComponent } from '../../udf-step-workflow/udf-step-workflow.component';
import {customRequiredValidator} from '../../../../shared/utils';
import { LoanProviderArticleComponent } from '../../loan-provider-article/loan-provider-article.component';

@Component({
  selector: 'app-edit-loan',
  templateUrl: './edit-loan.component.html',
  styleUrls: ['./edit-loan.component.sass']
})
export class EditLoanComponent implements OnInit {
  @Input() completeLoanData;
  public expandedLoanDetails = true;
  public expandedLoanSimulation = true;
  public expandedLoanSchedule = true;
  public page: number;
  public pageSize: number;
  public decimalPlaces: string;
  public methodCalcule = '-1';
  public products: ProductEntity[] = [];
  public product: ProductEntity = new ProductEntity();
  public accountPortfolios: UserEntity[] = [];
  public productLoanReasons: ProductLoanReasonEntity[] = [];
  public sourceOfFundss: LoanSourceOfFundsEntity[] = [];
  public schedules: ScheduleEntity[] = [];
  public selectedLoan: LoanEntity = new LoanEntity();
  public customer: CustomerEntity = new CustomerEntity();
  public editLoanForm: FormGroup;
  public editLoanSimulationIndivForm: FormGroup;
  public editLoanSimulationGrpForm: FormGroup;
  public customerMembers: CustomerLinksRelationshipEntity[] = [];
  public loanEntity: LoanEntity = new LoanEntity();
  public loadingCalcule = false;
  public currencySymbol = '';
  public selectedProduct: ProductEntity = new ProductEntity();
  public expirydateG: NgbDate;
  public expirydateH: NgbDateStruct;
  public udfLinkGroupLoan: UDFLinksGroupeFieldsEntity[] = [];
  udfLoanForm: FormGroup;
  public listUDFGroupsLoan: UserDefinedFieldGroupEntity[] = [];
  public indexFormUdfLoan = 0;
  public udfGroupLoan: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
  public udfGroupsLoan: UserDefinedFieldGroupEntity[] = [];
  public udfFieldsLoan: UserDefinedFieldsEntity[][] = [];
  public udfFieldLoan: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
  public selectedGroupLoan: UDFLinksGroupeFieldsEntity;
  public expandedUdf = true;
  public amountTrouv = false;
  public termTrouv = false;
  public selectedLoanReason: ProductLoanReasonEntity = new ProductLoanReasonEntity();
  public apr = 0;
  public irr = 0;
  public aprWithoutRound = 0;
  public irrWithoutRound = 0;
  indexFormUdf = 0;
  public loanUpdated: LoanEntity = new LoanEntity();
  public minInitialPayementvalue: string;
  public minIssueDatevalue: string;
  public lastLine: ScheduleEntity;
  public issueFeeAmount = 0;
  @ViewChild(UdfComponent, { static: true }) childcomp: UdfComponent;
  @ViewChild(CalculatorComponent, { static: true }) calculatorComp: CalculatorComponent;
  @Output() updateLoan = new EventEmitter<boolean>();
  @Output() updateL = new EventEmitter<boolean>();


  public udfFormData: boolean = false;

  // Validation Date
  public validateIssueDate: boolean;
  public validateInitialPayment: boolean;
  public checkCalculate = false;
  public groupLoan: LoanEntity[] = [];
  public effectiveInterestRateStandard = 0;
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
  public surveysId: number;
  public maximumAllowedAmount: number;
  public activeException = false;
  public acceptedException = false;
  public newExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public customerRenewalCondition: RenewalConditionLoanEntity = new RenewalConditionLoanEntity();
  public activeRenewalConditionSetting = false;
  public currentUser: UserEntity;
  public acceptedExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public renewelLoanCondition = false;
  public feeAmount = 0;
  public requestExceptionForm: FormGroup;
  public deferedPeriodeSettingTypes = true;
  public frequencyByDefault = 1;
  public edit = AcmConstants.EDIT;
  public listAssets: AssetLoanEntity[] = [];
  public currentAmount = 0;
  public apportPersonnel = 0;
  public udfLinks: UserDefinedFieldsLinksEntity[] = [];
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;

  @ViewChild(LoanProviderArticleComponent)
  loanProviderArticleComponent: LoanProviderArticleComponent;
  public scheduleFlexibleIsChecked : boolean = false;

  /**
   *
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param router Router
   * @param loanManagementService LoanManagementService
   * @param settingsService SettingsService
   * @param sharedService SharedService
   * @param loanApprovalService LoanApprovalService
   * @param customerManagementService CustomerManagementService
   * @param udfService UdfService
   * @param dateFormatterService DateFormatterService
   * @param datePipe DatePipe
   * @param exceptionRequestService ExceptionRequestService
   * @param modalService NgbModal
   * @param translate TranslateService
   * @param library FaIconLibrary
   */
  constructor(public devToolsServices: AcmDevToolsServices,
    public formBuilder: FormBuilder,
    public router: Router,
    public loanManagementService: LoanManagementService,
    public settingsService: SettingsService,
    public sharedService: SharedService,
    public loanApprovalService: LoanApprovalService,
    public customerManagementService: CustomerManagementService,
    public udfService: UdfService, public dateFormatterService: DateFormatterService,
    public datePipe: DatePipe,
    public exceptionRequestService: ExceptionRequestService,
    public modalService: NgbModal,
    public translate: TranslateService,
    public library: FaIconLibrary, private scheduleService: ScheduleService,
    private dbService: NgxIndexedDBService
  ) {
  }

  ngOnInit() {
    if (this.completeLoanData === undefined) {
      this.completeLoanData = true;
    }
    this.schedules.length = 0;
    this.pageSize = 5;
    this.page = 1;
    this.selectedLoan = this.sharedService.getLoan();
    this.apportPersonnel = this.selectedLoan.personalContribution;
    this.currentAmount = this.selectedLoan.approvelAmount + this.apportPersonnel;
    this.groupLoan = this.sharedService.getLoanChild();
    if (this.selectedLoan !== null && Object.keys(this.selectedLoan).length !== 0) {
      this.currencySymbol = this.selectedLoan.currencySymbol;
      this.customer = this.selectedLoan.customerDTO;
      this.getAccountPortfolios();
      this.getProductLoanReason();
      this.getLoanSourceOfFundss();
      this.getProducts();
      //this.getUdfLoanInformation();
      // Get portfolio loan object
      const portfolio = new UserEntity();
      portfolio.accountPortfolioId = this.selectedLoan.portfolioId;
      portfolio.login = this.selectedLoan.owner;
      portfolio.fullName = this.selectedLoan.ownerName;
      portfolio.simpleName = this.selectedLoan.ownerName;
      // Get sourceOfFunds object
      const sourceOfFunds = new LoanSourceOfFundsEntity();
      sourceOfFunds.loanSourceOfFundsID = this.selectedLoan.sourceOfFundsID;
      this.editLoanForm = this.formBuilder.group({
        accountPortfolio: [portfolio],
        loanReason: [this.selectedLoanReason],
        sourceOfFunds: [sourceOfFunds],
        product: [this.product]
      });
      this.createFormUpdate();
      this.getSelectedProductObject();
      if (!checkOfflineMode()) {
        this.sharedService.getRenewalConditionStatus().then((data) => {
          this.renewelLoanCondition = data;
          if (this.renewelLoanCondition === true) {
            const customerAccount = new CustomerAccountEntity();
            customerAccount.customerId = String(this.customer.customerIdExtern);
            // get renewal condition setting if exist
            this.customerManagementService.getRenewalConditionSetting(customerAccount).subscribe((renewalSetting) => {
              this.customerRenewalCondition = renewalSetting;
              if (this.customerRenewalCondition !== null && Object.keys(this.customerRenewalCondition).length !== 0) {
                this.checkNewOrAccpetedException();
                this.activeRenewalConditionSetting = true;
              }
            });
          }
        });
      }
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minIssueDatevalue = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');

  }

  /**
   * getSelectedProductObject
   */
  getSelectedProductObject() {
    this.products.forEach(productElement => {
      if (productElement.id === this.editLoanForm.value.product.id) {
        this.product = productElement;
        const amountMin = [];
        const amountMax = [];
        const termMin = [];
        const termMax = [];
        this.product.productDetailsDTOs.forEach(element => {
          amountMin.push(element.minimumAmount);
          amountMax.push(element.maximumAmount);
          termMin.push(element.minimumTerm);
          termMax.push(element.maximumTerm);
        });
        this.product.minimumBalance = Math.min(...amountMin);
        this.product.maximumBalance = Math.max(...amountMax);
        this.product.minimumTerm = Math.min(...termMin);
        this.product.maximumTerm = Math.max(...termMax);
      }
    });
  }

  /**
   * toggle Customer analyses
   */
  toggleCollapseCustomerAnalyses() {
    this.expandedUdf = !this.expandedUdf;
  }

  /**
   * load account portfolios of branch
   */
  getAccountPortfolios() {
    const userEntity: UserEntity = new UserEntity();
    userEntity.branchID = this.customer.branchId;

    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'find-all-portfolio-0').subscribe((portfolios: any) => {
        if (portfolios === undefined) {
          this.devToolsServices.openToast(3, 'No portfolios saved for offline use');
        } else {
          this.accountPortfolios = portfolios.data;
        }
      });
    } else {
      this.loanManagementService.findAllPortfolio(userEntity).subscribe(
        (data) => {
          this.accountPortfolios = data;
        }
      );
    }
  }

  /**
   * load loan product reason
   */
  async getProductLoanReason() {
    let data;
    if (checkOfflineMode()) {
      const productLoanReason: any = await this.dbService.getByKey('data', 'product_loan_reason').toPromise();
      data = productLoanReason.data;
    } else {
      data = await this.loanManagementService.getProductLoanReason().toPromise();
    }
    this.productLoanReasons = data;

    this.productLoanReasons = data;
    this.productLoanReasons.forEach(loanReasonElement => {
      if (loanReasonElement.code === this.selectedLoan.loanReasonCode) {
        this.selectedLoanReason.code = loanReasonElement.code;
        this.selectedLoanReason.loanReasonID = loanReasonElement.loanReasonID;
        this.selectedLoanReason.description = loanReasonElement.description;
        this.editLoanForm.controls.loanReason.setValue(this.selectedLoanReason);
      }
    });
  }

  /**
   * load source of fundss
   */
  async getLoanSourceOfFundss() {
    let data;
    if (checkOfflineMode()) {
      data = await this.dbService.getByKey('data', 'loan_source_of_funds').toPromise();
      data = data.data;
    } else {
      data = await this.loanManagementService.getLoanSourceOfFunds().toPromise();
    }
    this.sourceOfFundss = data;
  }

  /**
   * load products
   */
  async getProducts() {
    const productEntity = new ProductEntity();
    if (this.selectedLoan.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      productEntity.productGrp = true;
      productEntity.productIndiv = false;
      productEntity.productOrg = false;
    } else if (this.selectedLoan.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      if (this.selectedLoan.parentId === 0) {
        productEntity.productIndiv = true;
        productEntity.productGrp = false;
        productEntity.productOrg = false;
      } else {
        productEntity.productIndiv = false;
        productEntity.productGrp = true;
        productEntity.productOrg = false;
      }
    } else if (this.selectedLoan.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      productEntity.productOrg = true;
      productEntity.productGrp = false;
      productEntity.productIndiv = false;
    }

    let data;

    if (checkOfflineMode()) {
      const products: any = await this.dbService.getByKey('data', 'get_products').toPromise();
      data = products.data;
    } else {
      data = await this.loanManagementService.getProducts(productEntity).toPromise();
    }

    this.products = data;
    data.forEach((product) => {
      if (product.id === this.selectedLoan.productId) {
        this.product = product;
        this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.product.acmCurrency.decimalPlaces);
        const amountMin = [];
        const amountMax = [];
        const termMin = [];
        const termMax = [];
        this.product.productDetailsDTOs.forEach(element => {
          amountMin.push(element.minimumAmount);
          amountMax.push(element.maximumAmount);
          termMin.push(element.minimumTerm);
          termMax.push(element.maximumTerm);
        });
        this.product.minimumBalance = Math.min(...amountMin);
        this.product.maximumBalance = Math.max(...amountMax);
        this.product.minimumTerm = Math.min(...termMin);
        this.product.maximumTerm = Math.max(...termMax);
        this.minAmountValidation = Math.min(...amountMin);
        this.maxAmountValidation = Math.max(...amountMax);
        this.minTermValidation = Math.min(...termMin);
        this.maxTermValidation = Math.max(...termMax);
        this.minPeriodsValidation = product.minimumDeferredPeriod;
        this.maxPeriodsValidation = product.maximumDeferredPeriod;
        this.editLoanForm.controls.product.setValue(product);
      }
    });
  }

  /**
   * create form fro update
   */
  createFormUpdate() {
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.createSimulationGrpForm();
      this.getCustomerMembers(this.customer);
    } else {
      if (this.selectedLoan.loanApplicationStatus === AcmConstants.NEW_APPLICATION) {
        this.createSimulationIndivForm();
      }
      this.getSelectedProductObject();
    }
  }

  /**
   * create simulation form indiv
   */
  createSimulationIndivForm() {
    this.apr = Math.round((this.selectedLoan.apr + Number.EPSILON) * 100) / 100;
    this.irr = Math.round((this.selectedLoan.effectiveIntRate + Number.EPSILON) * 100) / 100;
    this.effectiveInterestRateStandard = this.selectedLoan.productRate;
    this.editLoanSimulationIndivForm = this.formBuilder.group({
      loanAmount: [this.selectedLoan.applyAmountTotal],
      repayment: [this.selectedLoan.normalPayment],
      loanTerm: [this.selectedLoan.termPeriodNum],
      termType: [this.selectedLoan.termPeriodID],
      issueDate: [new Date(this.selectedLoan.issueDate).toISOString().substring(0, 10), customRequiredValidator],
      initialPayment: [new Date(this.selectedLoan.initialPaymentDate).toISOString().substring(0, 10), customRequiredValidator],
      ignoreOddDays: [this.selectedLoan.ignoreOddDays],
      periodsDeferred: [this.selectedLoan.periodsDeferred],
      periodsDeferredType: [this.selectedLoan.periodsDeferredType],
      fees: [this.selectedLoan.feeAmt1],
      vat: [0],
      apr: [this.selectedLoan.apr],
      closingBalance: [''],
      frequency: [this.selectedLoan.paymentFreq, customRequiredValidator],
      interestFrequency: [this.selectedLoan.interestFreq, customRequiredValidator]

    });
    if ((this.selectedLoan.loanAssetsDtos && this.selectedLoan.loanAssetsDtos.length)|| this.product.supplier){
      this.editLoanSimulationIndivForm.controls.loanAmount.disable()
    }else {
      this.editLoanSimulationIndivForm.controls.loanAmount.enable()

    }
    const issueDate1: Date = new Date(this.editLoanSimulationIndivForm.controls.issueDate.value);
    const initialPayment = issueDate1;
    initialPayment.setDate(issueDate1.getDate() + 30);
    this.editLoanSimulationIndivForm.controls.initialPayment.setValue(this.datePipe.transform(initialPayment, 'yyyy-MM-dd'));
    // to do by rmila
    this.getCalculationInformation(this.selectedLoan);
  }

  /**
   * create simulation form grp
   */
  createSimulationGrpForm() {
    this.editLoanSimulationGrpForm = this.formBuilder.group({});
  }

  /**
   * load customer members
   */
  async getCustomerMembers(customer: CustomerEntity) {
    const customerRelationShip = new CustomerLinksRelationshipEntity();
    customerRelationShip.customerId = customer.id;
    customerRelationShip.category = AcmConstants.MEMBERS;
    await this.customerManagementService.findCustomerLinkRelationShip(customerRelationShip).subscribe(
      (data) => {
        this.customerMembers = data;
      });
  }

  /**
   * compare Account Portfolio
   * @param accountPortfolio1 account portfolio 1
   * @param accountPortfolio2 account portfolio 2
   */
  compareAccountPortfolio(accountPortfolio1, accountPortfolio2) {
    return accountPortfolio1?.accountPortfolioId === accountPortfolio2?.accountPortfolioId;
  }

  /**
   * compare LoanReason
   * @param loanReason1 loan Reason 1
   * @param loanReason2 loan Reason 2
   */
  compareLoanReason(loanReason1, loanReason2) {
    return loanReason1?.code === loanReason2?.code;
  }

  /**
   * compare SourceOfFunds
   * @param sourceOfFunds1 sourceOfFunds 1
   * @param sourceOfFunds2 sourceOfFunds 2
   */
  compareSourceOfFunds(sourceOfFunds1, sourceOfFunds2) {
    return sourceOfFunds1?.loanSourceOfFundsID === sourceOfFunds2?.loanSourceOfFundsID;
  }

  /**
   * compare Product
   * @param product1 product 1
   * @param product2 product 2
   */
  compareProduct(product1, product2) {
    return product1?.id === product2?.id;
  }

  /**
   * toggle Loan Details card
   */
  toggleCollapseLoanDetails() {
    this.expandedLoanDetails = !this.expandedLoanDetails;
  }

  /**
   * toggle Loan Details simulation
   */
  toggleCollapseLoanSimulation() {
    this.expandedLoanSimulation = !this.expandedLoanSimulation;
  }

  /**
   * toggle Loan Details schedule
   */
  toggleCollapseLoanSchedule() {
    this.expandedLoanSchedule = !this.expandedLoanSchedule;
  }

  /**
   * calculate the new schedule with new data
   */
  async calculate(resetSchedule : boolean) {

    // bock the increase of loan amount in the calculation screen
    if (this.editLoanSimulationIndivForm.value.loanAmount > this.selectedLoan.applyAmountTotal) {
      this.devToolsServices.openToastWithParameter(3, 'alert.max_allowed_amount_bigger_then_applyAmount', String(this.selectedLoan.applyAmountTotal));
      this.editLoanForm.get("loanAmount").clearValidators();
      this.editLoanForm.get("loanAmount").setValidators([customRequiredValidator, Validators.max(this.selectedLoan.applyAmountTotal)]);
      this.editLoanForm.get("loanAmount").updateValueAndValidity();
      this.editLoanForm.get("loanAmount").markAsTouched();
      return;
    }
    if (!this.editLoanForm.valid || !this.editLoanSimulationIndivForm.valid) {
      this.devToolsServices.openToast(3, 'alert.check-data');
      this.devToolsServices.backTop();
      return;
    }
    if (!this.checkIssueDate() || !this.checkDeferredPeriod()) {
      return;
    }
    if (this.selectedProduct.isFrequency) {
      const periodsDeferred = this.editLoanSimulationIndivForm.controls.periodsDeferred.value;
      const loanTerm = this.editLoanSimulationIndivForm.controls.loanTerm.value;
      const frequency = this.editLoanSimulationIndivForm.controls.frequency.value;
      // check if loanTerm MOD frequency = 0
      if (loanTerm % frequency !== 0) {
        this.devToolsServices.openToast(3, 'alert.error_frequency_mod_loan_term');
        return;
      }
    }
    if (!this.product.isFrequencyWithDeferredPeriode) {
      if (this.editLoanSimulationIndivForm.controls.periodsDeferred.value !== 0 &&
        this.editLoanSimulationIndivForm.controls.frequency.value !== 1) {
        this.devToolsServices.openToast(3, 'alert.error_frequency_with_deferred_periode');
        return;
      }
    }
    if (this.product.isFrequency) {
      const periodsDeferred = this.editLoanSimulationIndivForm.controls.periodsDeferred.value;
      const loanTerm = this.editLoanSimulationIndivForm.controls.loanTerm.value;
      const frequency = this.editLoanSimulationIndivForm.controls.frequency.value;
      const interestFrequency = this.editLoanSimulationIndivForm.controls.interestFrequency.value;
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
      if (this.editLoanSimulationIndivForm.get("loanAmount").value > this.maximumAllowedAmount) {
        this.devToolsServices.openToastWithParameter(3, 'alert.max_allowed_amount', String(this.maximumAllowedAmount));
        this.editLoanSimulationIndivForm.get("loanAmount").clearValidators();
        this.editLoanSimulationIndivForm.get("loanAmount").setValidators([customRequiredValidator,
        Validators.max(this.maximumAllowedAmount)]);
        this.editLoanSimulationIndivForm.get("loanAmount").updateValueAndValidity();
        this.editLoanSimulationIndivForm.get("loanAmount").markAsTouched();
        return; 
      }
    }
    this.checkCalculate = false;
    this.devToolsServices.makeFormAsTouched(this.editLoanForm);
    this.amountTrouv = false;
    this.termTrouv = false;
    this.checkMinMaxAmountTermCalculate();
    if (this.editLoanSimulationIndivForm.valid && this.editLoanForm.valid && (this.termTrouv || this.amountTrouv)) {
      this.loadingCalcule = true;
      if (this.product.flatInterestRate !== 0) {
        this.selectedLoan.productRate = this.effectiveInterestRateStandard;
      } else {
        this.selectedLoan.productRate = this.editLoanForm.value.product.rate;
      }
      this.selectedLoan.loanCalculationMode = 0;
      this.selectedLoan.personalContribution = this.apportPersonnel;
      this.selectedLoan.approvelAmount = this.editLoanSimulationIndivForm.get("loanAmount").value;
      this.selectedLoan.applyAmountTotal =this.editLoanSimulationIndivForm.get("loanAmount").value;
      this.selectedLoan.issueDate = this.editLoanSimulationIndivForm.controls.issueDate.value;
      this.selectedLoan.initialPaymentDate = this.editLoanSimulationIndivForm.controls.initialPayment.value;
      this.selectedLoan.normalPayment = this.editLoanSimulationIndivForm.controls.repayment.value;
      this.selectedLoan.termPeriodNum = this.editLoanSimulationIndivForm.controls.loanTerm.value;
      this.selectedLoan.apr = this.editLoanSimulationIndivForm.get("apr").value;
      this.selectedLoan.paymentFreq = this.editLoanSimulationIndivForm.controls.frequency.value;
      this.selectedLoan.interestFreq = this.editLoanSimulationIndivForm.controls.interestFrequency.value;
      this.selectedLoan.termPeriodID = this.editLoanSimulationIndivForm.controls.termType.value;
      this.selectedLoan.periodsDeferred = this.editLoanSimulationIndivForm.controls.periodsDeferred.value;
      this.selectedLoan.periodsDeferredType = this.editLoanSimulationIndivForm.controls.periodsDeferredType.value;
      if(resetSchedule) {
        this.scheduleFlexibleIsChecked = false;
        this.schedules = [];
      }
      this.selectedLoan.loanSchedules = this.schedules;

      if (checkOfflineMode()) {
        if (this.selectedLoan.loanId === null)
          this.selectedLoan.loanId = this.customer.id;
        
        await this.dbService.update('calculate-loans', this.selectedLoan).toPromise();

        // Loan repayment = Loan amount * (Interest /12 + 1/Loan term)
        const interest = this.product.flatInterestRate / 100;
        const loanAmout = this.editLoanSimulationIndivForm.get("loanAmount").value;
        const loanTerm = this.editLoanSimulationIndivForm.controls.loanTerm.value;
        const loenRepayment = loanAmout * ((interest / 12) + (1 / loanTerm));

        this.editLoanSimulationIndivForm.controls.repayment.setValue(Math.floor(loenRepayment));

        for (let i = 0; i < loanTerm; i++) {
          const scheduleEntity = new ScheduleEntity();
          scheduleEntity.period = String(i + 1);
          scheduleEntity.totalRepayment = loenRepayment;
          this.schedules.push(scheduleEntity);
        }
        this.checkCalculate = false;
        this.loadingCalcule = false;
      } else {
        await this.loanApprovalService.calculateLoanSchedules(this.selectedLoan).toPromise().then(
          (data) => {
            this.schedules = data.loanSchedule;
            this.updateDataIndiv(data);

            if (this.schedules !== null &&
              (this.schedules[0] !== null || this.schedules[0] !== undefined) &&
              (this.schedules[0].repaymentDate !== null || this.schedules[0].repaymentDate !== undefined)) {
              const timeZone = 'UTC+1'; // Replace this with your desired time zone 
              const transformDate = this.dateFormatterService.ToGregorianDateStruct(this.schedules[0].repaymentDate, 'DD/MM/YYYY');
              const dateResult = new Date(transformDate.year + '-' + transformDate.month + '-' + transformDate.day);
              this.editLoanSimulationIndivForm.controls.initialPayment.setValue(this.datePipe.transform(dateResult, 'yyyy-MM-dd', timeZone));
            }
            this.loadingCalcule = false;
            this.lastLine = this.schedules[this.schedules.length - 1];
          });
      }

    }
  }

  /**
   * getCalculationInformation
   */
  async getCalculationInformation(loan: LoanEntity) {
    this.schedules = [];
    let data;

    if (checkOfflineMode()) {
      data = await this.dbService.getByKey('data', 'loanSchedules_' + loan.loanId).toPromise();
      data = data.data;
    } else {
      data = await this.scheduleService.loanSchedules(loan).toPromise();
    }

    this.schedules = data;
    this.lastLine = this.schedules[this.schedules.length - 1];
    this.updateDataIndivFromLoan(loan);
    if (this.schedules !== undefined &&
      this.schedules[0] !== undefined &&
      this.schedules[0].repaymentDate !== undefined &&
      this.schedules[0].repaymentDate !== null) {
      const transformDate = this.dateFormatterService.ToGregorianDateStruct(this.schedules[0].repaymentDate, 'DD/MM/YYYY');
      const dateResult = new Date(transformDate.year + '-' + transformDate.month + '-' + transformDate.day);
      this.editLoanSimulationIndivForm.controls.initialPayment.setValue(this.datePipe.transform(dateResult, 'yyyy-MM-dd'));
    }
    this.loadingCalcule = false;
    this.checkCalculate = false;
  }

  /**
   * Update data
   */
  updateDataIndiv(data: LoanCalculateEntity) {
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
    // get application fees amount from API calculate
    this.feeAmount = data.feeAmt1;
    const feeAmout2 = pourcentage2 + ((pourcentage2
      * this.product.issueFeeVAT2) / 100) + this.product.issueFeeAmount2;
    switch (this.product.roundType) {
      case AcmConstants.ROUND_UP:
        this.editLoanSimulationIndivForm.controls.repayment.setValue(Math.ceil((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.vat.setValue(Math.ceil((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.apr.setValue(this.loanEntity.apr);
        this.editLoanSimulationIndivForm.controls.closingBalance.setValue(Math.ceil((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.ceil(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      case AcmConstants.ROUND_DOWN:
        this.editLoanSimulationIndivForm.controls.repayment.setValue(Math.floor((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.vat.setValue(Math.floor((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.apr.setValue(this.loanEntity.apr);
        this.editLoanSimulationIndivForm.controls.closingBalance.setValue(Math.floor((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.floor(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      case AcmConstants.ROUND:
        this.editLoanSimulationIndivForm.controls.repayment.setValue(Math.round((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.vat.setValue(Math.round((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.apr.setValue(data.apr);
        // tslint:disable-next-line:max-line-length
        this.editLoanSimulationIndivForm.controls.closingBalance.setValue(Math.round((data.issueAmount + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.round(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      default:
        this.editLoanSimulationIndivForm.controls.repayment.setValue(data.normalPayment);
        this.editLoanSimulationIndivForm.controls.vat.setValue(data.insurancePremium);
        this.editLoanSimulationIndivForm.controls.apr.setValue(data.apr);
        this.editLoanSimulationIndivForm.controls.closingBalance.setValue(data.issueAmount);
        this.editLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? feeAmout1 + feeAmout2 : data?.acmIssueFee);
        break;
    }
    this.irr = Math.round((data.effectiveInterestRate + Number.EPSILON) * 100) / 100;
    this.apr = Math.round((data.apr + Number.EPSILON) * 100) / 100;
    this.aprWithoutRound = data.apr;
    this.irrWithoutRound = data.effectiveInterestRate;
    // issueFeeAmount without vat
    if (this.sharedService.useExternalCBS === '1') {
      this.issueFeeAmount = feeAmout1 + feeAmout2;
    }
    else {
      this.issueFeeAmount = data?.acmIssueFee;
    }

    // product with flat interest rate
    if (this.product.flatInterestRate !== 0) {
      this.effectiveInterestRateStandard = data.interestRate;
    }
  }

  /**
   * Update data
   */
  updateDataIndivFromLoan(data: LoanEntity) {
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
    // get application fees amount from API calculate
    this.feeAmount = data.feeAmt1;
    const feeAmout2 = pourcentage2 + ((pourcentage2
      * this.product.issueFeeVAT2) / 100) + this.product.issueFeeAmount2;
    switch (this.product.roundType) {
      case AcmConstants.ROUND_UP:
        this.editLoanSimulationIndivForm.controls.repayment.setValue(Math.ceil((parseInt(data.normalPayment)
          + Number.EPSILON) * decimal) / decimal);
        // this.editLoanSimulationIndivForm.controls.vat.setValue(Math.ceil((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.closingBalance.setValue(Math.ceil((data.applyAmountTotal
          + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.ceil(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFees);
        break;
      case AcmConstants.ROUND_DOWN:
        this.editLoanSimulationIndivForm.controls.repayment.setValue(Math.floor((parseInt(data.normalPayment)
          + Number.EPSILON) * decimal) / decimal);
        // this.editLoanSimulationIndivForm.controls.vat.setValue(Math.floor((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.closingBalance.setValue(Math.floor((data.applyAmountTotal
          + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.floor(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFees);
        break;
      case AcmConstants.ROUND:
        this.editLoanSimulationIndivForm.controls.repayment.setValue(Math.round((parseInt(data.normalPayment) + Number.EPSILON)
          * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.closingBalance.setValue(Math.round((data.applyAmountTotal
          + Number.EPSILON) * decimal) / decimal);
        this.editLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.round(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFees);
        break;
      default:
        this.editLoanSimulationIndivForm.controls.repayment.setValue(data.normalPayment);
        this.editLoanSimulationIndivForm.controls.closingBalance.setValue(data.applyAmountTotal);
        this.editLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? feeAmout1 + feeAmout2 : data?.acmIssueFees);
        break;
    }
    this.irr = Math.round((data.effectiveIntRate + Number.EPSILON) * 100) / 100;
    this.apr = Math.round((data.apr + Number.EPSILON) * 100) / 100; this.aprWithoutRound = data.apr;
    this.irrWithoutRound = data.effectiveIntRate;
    // issueFeeAmount without vat
    if (this.sharedService.useExternalCBS === '1' ) {
      this.issueFeeAmount = feeAmout1 + feeAmout2;
    }
    else {
      this.issueFeeAmount = data?.acmIssueFees;
    }
    // product with flat interest rate
    if (this.product.flatInterestRate !== 0) {
      this.effectiveInterestRateStandard = data.productRate;
    }
  }

  /**
   * getInitialPaymentValue() : First repayment is 30 after issue date/ In case of frequency activated it will be X frequency month + issue date
   */
  getInitialPaymentValue() {
    if (this.datePipe.transform(this.loanEntity.issueDate, 'yyyy-MM-dd') !== this.editLoanSimulationIndivForm.controls.issueDate.value) {
      this.checkCalculate = true;
    }
    const issueDate1: Date = new Date(this.editLoanSimulationIndivForm.controls.issueDate.value);
    const initialPayment = issueDate1;
    if (this.product.isFrequency) {
      initialPayment.setMonth(issueDate1.getMonth() + (this.editLoanSimulationIndivForm.controls.interestFrequency.value));
    } else {
      initialPayment.setDate(issueDate1.getDate() + 30);
    }
    this.editLoanSimulationIndivForm.controls.initialPayment.setValue(this.datePipe.transform(initialPayment, 'yyyy-MM-dd'));
  }

  /**
   * get   Requirement from selected product for grp
   */
  async getProductRequirement() {
    // init schedule
    this.schedules = [];
    this.product = this.editLoanForm.value.product;
    const amountMin = [];
    const amountMax = [];
    const termMin = [];
    const termMax = [];
    this.product.productDetailsDTOs.forEach(element => {
      amountMin.push(element.minimumAmount);
      amountMax.push(element.maximumAmount);
      termMin.push(element.minimumTerm);
      termMax.push(element.maximumTerm);
    });
    this.minAmountValidation = Math.min(...amountMin);
    this.maxAmountValidation = Math.max(...amountMax);
    this.minTermValidation = Math.min(...termMin);
    this.maxTermValidation = Math.max(...termMax);
  }
  async submitLoanTopup() {
    //this.devToolsServices.makeFormAsTouched(this.udfLoanForm);
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);

    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      if (this.calculatorComp.checkCalculate) {
        this.devToolsServices.openToast(3, 'alert.error-calculate');
        return;
      }
      if (!this.calculatorComp.checkIssueDate() || !this.calculatorComp.checkDeferredPeriod()
        || !this.checkAgeForProduct()) {
        return;
      }
      if (this.calculatorComp.renewelLoanCondition && this.calculatorComp.activeException) {
        this.devToolsServices.openToast(3, 'alert.exception_request_in_progress');
        return;
      }
      this.customer = this.sharedService.getCustomer();
      this.loanEntity = this.calculatorComp.selectedLoan;
      if (this.editLoanForm.valid && this.loanEntity.loanId !== 0) {
        this.loanEntity.portfolioCode = this.editLoanForm.value.accountPortfolio.login;
        this.loanEntity.portfolioId = this.editLoanForm.value.accountPortfolio.accountPortfolioId;
        this.loanEntity.portfolioDescription = this.editLoanForm.value.accountPortfolio.simpleName;
        if (this.product.flatInterestRate !== 0) {
          this.loanEntity.productRate = this.calculatorComp.effectiveInterestRateStandard;
        } else if (this.product.flatInterestRate === 0) {
          this.loanEntity.productRate = this.editLoanForm.value.product.rate;
        }
        if (this.calculatorComp.feeAmount !== 0) {
          this.loanEntity.feeAmt1 = this.calculatorComp.feeAmount;
        }
        this.loanEntity.customerDTO = this.customer;
        this.loanEntity.branchID = this.customer.branchId;
        this.loanEntity.branchDescription = this.customer.branchesDescription;
        this.loanEntity.branchName = this.customer.branchesName;
        this.loanEntity.loanReasonCode = this.editLoanForm.value.loanReason.code;
        this.loanEntity.loanReasonId = this.editLoanForm.value.loanReason.loanReasonID;
        this.loanEntity.sourceOfFundsID = this.editLoanForm.value.sourceOfFunds.loanSourceOfFundsID;
        this.loanEntity.customerType = this.customer.customerType;
        this.loanEntity.industryCode = 3;
        this.loanEntity.districtCodeId = 0;
        this.loanEntity.loanCalculationMode = 0;
        this.loanEntity.applyAmountTotal = this.calculatorComp.calculatorForm.value.loanAmount;
        this.loanEntity.approvelAmount = this.calculatorComp.calculatorForm.value.loanAmount;
        this.loanEntity.normalPayment = this.calculatorComp.calculatorForm.value.repayment;
        this.loanEntity.termPeriodNum = this.calculatorComp.calculatorForm.value.loanTerm;

        this.loanEntity.paymentFreq = this.calculatorComp.calculatorForm.value.frequency;
        this.loanEntity.interestFreq = this.calculatorComp.calculatorForm.value.interestFrequency;
        this.loanEntity.issueDate = this.calculatorComp.calculatorForm.value.issueDate;
        this.loanEntity.initialPaymentDate = this.calculatorComp.calculatorForm.value.initialPayment;
        this.loanEntity.periodsDeferredType = this.calculatorComp.calculatorForm.value.periodsDeferredType;
        this.loanEntity.periodsDeferred = this.calculatorComp.calculatorForm.value.periodsDeferred;
        this.loanEntity.intPayPeriodNum = 1;
        this.loanEntity.termPeriodID = this.calculatorComp.calculatorForm.value.termType;
        this.loanEntity.apr = this.calculatorComp.aprWithoutRound;
        this.loanEntity.effectiveIntRate = this.calculatorComp.irrWithoutRound;
        if (this.sharedService.useExternalCBS === '1') {
          this.loanEntity.issueFeeAmount = this.calculatorComp.issueFeeAmount;
        }
        else {
          this.loanEntity.acmIssueFees = this.calculatorComp.issueFeeAmount;
        }
        this.loanEntity.userDefinedFieldsLinksDTOs =this.udfStepWorkflowComponent.onSubmitElement();
        // load UDF
        // if (this.listUDFGroupsLoan.length >= 0) {
        //   this.loanEntity.userDefinedFieldsLinksDTOs = [];
        //   this.loanEntity.industryCodeDescription = '';
        //   for (let j = 0; j < this.listUDFGroupsLoan.length; j++) {
        //     for (let i = 0; i < this.udfFieldsLoan[j].length; i++) {
        //       const udfLink: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
        //       udfLink.category = AcmConstants.LOAN_CATEGORY;
        //       udfLink.elementId = this.selectedLoan.loanId;
        //       // Setting idAbacusUDFLink and surveysId and id
        //       udfLink.idAbacusUDFLink = this.udfFieldsLoan[j][i].idAbacusUDFLink;
        //       udfLink.surveysId = this.udfFieldsLoan[j][i].surveysId;
        //       udfLink.id = this.udfFieldsLoan[j][i].idUDFLink;
        //       if (this.udfFieldsLoan[j][i].delete) {
        //         if (udfLink.idAbacusUDFLink !== undefined && udfLink.surveysId !== undefined) {
        //           udfLink.fieldValue = '';
        //         }
        //       } else if (this.udfFieldsLoan[j][i].fieldType === 5) {
        //         udfLink.fieldValue = this.udfLoanForm.controls['udfField' + j + i].value.idUDFListValue;
        //         udfLink.udfListValueId = this.udfLoanForm.controls['udfField' + j + i].value.idUDFListLink;
        //       } else {
        //         udfLink.fieldValue = this.udfLoanForm.controls['udfField' + j + i].value;
        //       }
        //       // save Idustry Code in Loan Entity
        //       if (this.udfFieldsLoan[j][i].userDefinedFieldGroupDTO.id === 8) {
        //         this.udfFieldsLoan[j][i].fieldListValuesDTOs.forEach((idustryCode) => {
        //           if (idustryCode.idUDFListValue.toString() === this.udfLoanForm.controls['udfField' + j + i].value.toString()) {
        //             this.loanEntity.industryCodeDescription += idustryCode.description + '| ';
        //             // TODO CHANGE TYPE COLUMN INDUSTRY CODE
        //           }
        //         });
        //       }

        //       udfLink.userDefinedFieldsDTO = this.udfFieldsLoan[j][i];
        //       udfLink.indexGroup = j;
        //       this.loanEntity.userDefinedFieldsLinksDTOs.push(udfLink);
        //     }
        //   }
        // }
        if (this.loanEntity.parentId !== 0) {
          for (let i = 0; i < this.groupLoan.length; i++) {
            this.groupLoan[i].changed = false;
            if (this.groupLoan[i].loanId === this.loanEntity.loanId) {
              this.groupLoan[i] = this.loanEntity;
              this.groupLoan[i].changed = true;
              break;
            }
          }
          this.sharedService.setLoader(true);
          // send update data
          await this.loanManagementService.updateLoanForGroup(this.groupLoan).toPromise(
          ).then(async (resultEntity) => {
            this.sharedService.setLoader(false);
            this.loanEntity.updateLoan = true;
            this.devToolsServices.openToast(0, 'alert.success');
            //this.udfLoanForm = this.formBuilder.group({});
            this.udfFieldsLoan = [];
            this.indexFormUdfLoan = 0;
            this.listUDFGroupsLoan = [];
            //await this.getUdfLoanInformation();
          });
        } else {
          this.sharedService.setLoader(true);
          // send update data
          // update loan
          if (checkOfflineMode()) {
            if (this.loanEntity.loanId === null)
              this.loanEntity.loanId = this.customer.id;
            await this.dbService.update('loans', this.loanEntity).toPromise();
          } else {
            await this.loanManagementService.updateLoan(this.loanEntity).toPromise(
            ).then(resultEntity => {
              this.sharedService.setLoader(false);
              this.loanEntity.updateLoan = true;
              this.devToolsServices.openToast(0, 'alert.success');
              //this.udfLoanForm = this.formBuilder.group({});
              this.udfFieldsLoan = [];
              this.indexFormUdfLoan = 0;
              this.listUDFGroupsLoan = [];
              //this.getUdfLoanInformation();
            });
          }
        }
      }
    }
  }
  /**
   * Methode to update
   */
  async submitLoan() {

    if (this.selectedLoan.loanApplicationStatus !== 'NEW_APPLICATION') {
      await this.submitLoanTopup();
    } else {
      //this.devToolsServices.makeFormAsTouched(this.udfLoanForm);
      this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm); 
      
      if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
        if (this.checkCalculate) {
          this.devToolsServices.openToast(3, 'alert.error-calculate');
          return;
        }
        if (!this.checkIssueDate() || !this.checkDeferredPeriod() || !this.checkAgeForProduct()) {
          return;
        }
        if (this.renewelLoanCondition && this.activeException) {
          this.devToolsServices.openToast(3, 'alert.exception_request_in_progress');
          return;
        }
        this.customer = this.sharedService.getCustomer();
        this.loanEntity = this.selectedLoan;
        // if feeamount != 0 get the new feeamount value from calculate API
        if (this.feeAmount !== 0) {
          this.loanEntity.feeAmt1 = this.feeAmount;
        }
        if (this.editLoanForm.valid && this.loanEntity.loanId !== 0) {
          this.loanEntity.portfolioCode = this.loanEntity.portfolioCode;
          this.loanEntity.portfolioId = this.loanEntity.portfolioId;
          this.loanEntity.portfolioDescription = this.loanEntity.portfolioDescription;
          if (this.product.flatInterestRate !== 0) {
            this.loanEntity.productRate = this.effectiveInterestRateStandard;
          } else if (this.product.flatInterestRate === 0) {
            this.loanEntity.productRate = this.editLoanForm.value.product.rate;
          }
          if (!this.checkIssueDate() || !this.checkDeferredPeriod() || !this.checkAgeForProduct()) {
            return;
          }
          if (this.renewelLoanCondition && this.activeException) {
            this.devToolsServices.openToast(3, 'alert.exception_request_in_progress');
            return;
          }
          this.customer = this.sharedService.getCustomer();
          this.loanEntity = this.selectedLoan;
          if (this.editLoanForm.valid && this.loanEntity.loanId !== 0) {
            this.loanEntity.portfolioCode = this.editLoanForm.value.accountPortfolio.login;
            this.loanEntity.portfolioId = this.editLoanForm.value.accountPortfolio.accountPortfolioId;
            this.loanEntity.portfolioDescription = this.editLoanForm.value.accountPortfolio.simpleName;
            if (this.product.flatInterestRate !== 0) {
              this.loanEntity.productRate = this.effectiveInterestRateStandard;
            } else if (this.product.flatInterestRate === 0) {
              this.loanEntity.productRate = this.editLoanForm.value.product.rate;
            }
            this.loanEntity.customerDTO = this.customer;
            this.loanEntity.branchID = this.customer.branchId;
            this.loanEntity.branchDescription = this.customer.branchesDescription;
            this.loanEntity.branchName = this.customer.branchesName;
            this.loanEntity.loanReasonCode = this.editLoanForm.value.loanReason.code;
            this.loanEntity.loanReasonId = this.editLoanForm.value.loanReason.loanReasonID;
            this.loanEntity.sourceOfFundsID = this.editLoanForm.value.sourceOfFunds.loanSourceOfFundsID;
            this.loanEntity.customerType = this.customer.customerType;
            this.loanEntity.industryCode = 3;
            this.loanEntity.districtCodeId = 0;
            this.loanEntity.loanCalculationMode = 0;
            this.loanEntity.applyAmountTotal = this.editLoanSimulationIndivForm.get("loanAmount").value;
            this.loanEntity.approvelAmount =  this.editLoanSimulationIndivForm.get("loanAmount").value;
            this.loanEntity.normalPayment = this.editLoanSimulationIndivForm.value.repayment;
            this.loanEntity.termPeriodNum = this.editLoanSimulationIndivForm.value.loanTerm;
            this.loanEntity.paymentFreq = this.editLoanSimulationIndivForm.value.frequency;
            this.loanEntity.interestFreq = this.editLoanSimulationIndivForm.value.interestFrequency;
            this.loanEntity.issueDate = this.editLoanSimulationIndivForm.value.issueDate;
            this.loanEntity.initialPaymentDate = this.editLoanSimulationIndivForm.value.initialPayment;
            this.loanEntity.periodsDeferredType = this.editLoanSimulationIndivForm.value.periodsDeferredType;
            this.loanEntity.periodsDeferred = this.editLoanSimulationIndivForm.value.periodsDeferred;
            this.loanEntity.intPayPeriodNum = 1;
            this.loanEntity.termPeriodID = this.editLoanSimulationIndivForm.value.termType;
            this.loanEntity.apr = this.aprWithoutRound;
            this.loanEntity.effectiveIntRate = this.irrWithoutRound;
            if (this.sharedService.useExternalCBS === '1') {
              this.loanEntity.issueFeeAmount = this.issueFeeAmount;
            }
            else {
              this.loanEntity.acmIssueFees = this.issueFeeAmount;
            }
            this.loanEntity.userDefinedFieldsLinksDTOs =this.udfStepWorkflowComponent.onSubmitElement();
            // load UDF
            // if (this.listUDFGroupsLoan.length >= 0) {
            //   this.loanEntity.userDefinedFieldsLinksDTOs = [];
            //   this.loanEntity.industryCodeDescription = '';
            //   for (let j = 0; j < this.listUDFGroupsLoan.length; j++) {
            //     for (let i = 0; i < this.udfFieldsLoan[j].length; i++) {
            //       const udfLink: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
            //       udfLink.category = AcmConstants.LOAN_CATEGORY;
            //       udfLink.elementId = this.selectedLoan.loanId;
            //       // Setting idAbacusUDFLink and surveysId and id
            //       udfLink.idAbacusUDFLink = this.udfFieldsLoan[j][i].idAbacusUDFLink;
            //       udfLink.surveysId = this.udfFieldsLoan[j][i].surveysId;
            //       udfLink.id = this.udfFieldsLoan[j][i].idUDFLink;
            //       if (this.udfFieldsLoan[j][i].delete) {
            //         if (udfLink.idAbacusUDFLink !== undefined && udfLink.surveysId !== undefined) {
            //           udfLink.fieldValue = '';
            //         }
            //       } else if (this.udfFieldsLoan[j][i].fieldType === 5) {
            //         udfLink.fieldValue = this.udfLoanForm.controls['udfField' + j + i].value.idUDFListValue;
            //         udfLink.udfListValueId = this.udfLoanForm.controls['udfField' + j + i].value.idUDFListLink;
            //       } else {
            //         udfLink.fieldValue = this.udfLoanForm.controls['udfField' + j + i].value;
            //       }
            //       // save Idustry Code in Loan Entity
            //       if (this.udfFieldsLoan[j][i].userDefinedFieldGroupDTO.id === 8) {
            //         this.udfFieldsLoan[j][i].fieldListValuesDTOs.forEach((idustryCode) => {
            //           if (idustryCode.idUDFListValue.toString() === this.udfLoanForm.controls['udfField' + j + i].value.toString()) {
            //             this.loanEntity.industryCodeDescription += idustryCode.description + '| ';
            //             // TODO CHANGE TYPE COLUMN INDUSTRY CODE
            //           }
            //         });
            //       }

            //       udfLink.userDefinedFieldsDTO = this.udfFieldsLoan[j][i];
            //       udfLink.indexGroup = j;
            //       this.loanEntity.userDefinedFieldsLinksDTOs.push(udfLink);
            //     }
            //   }
            // }
            if (this.loanEntity.parentId !== 0) {
              for (let i = 0; i < this.groupLoan.length; i++) {
                this.groupLoan[i].changed = false;
                if (this.groupLoan[i].loanId === this.loanEntity.loanId) {
                  this.groupLoan[i] = this.loanEntity;
                  this.groupLoan[i].changed = true;
                  break;
                }
              }
              this.sharedService.setLoader(true);
              // send update data
              await this.loanManagementService.updateLoanForGroup(this.groupLoan).toPromise(
              ).then(async (resultEntity) => {
                this.sharedService.setLoader(false);
                this.loanEntity.updateLoan = true;
                this.devToolsServices.openToast(0, 'alert.success');
                //this.udfLoanForm = this.formBuilder.group({});
                this.udfFieldsLoan = [];
                this.indexFormUdfLoan = 0;
                this.listUDFGroupsLoan = [];
                //await this.getUdfLoanInformation();
              });
            } else {
              this.sharedService.setLoader(true);

              // get list of asset to save
              this.loanEntity.loanAssetsDtos = this.sharedService.loan.loanAssetsDtos;
              // send update data
              const isFromOfflineSync = sessionStorage.getItem('isFromOfflineSync') === 'true';
              if (checkOfflineMode() && !isFromOfflineSync) {
                if (this.loanEntity.loanId === null)
                  this.loanEntity.loanId = this.customer.id;
                
                await this.dbService.update('loans', this.loanEntity).toPromise();
              } else {
                await this.loanManagementService.updateLoan(this.loanEntity).toPromise(
                ).then(async(resultEntity) => {
                  if(resultEntity.loanAssetsDtos && this.loanProviderArticleComponent){
                   this.sharedService.loan.loanAssetsDtos = resultEntity.loanAssetsDtos?.filter(asset => asset.id !== null).sort((a, b) => (a.enabled === b.enabled) ? 0 : a.enabled ? -1 : 1);
                   this.loanProviderArticleComponent.listAssetsSelected = resultEntity.loanAssetsDtos.filter(asset => asset.id !== null).sort((a, b) => (a.enabled === b.enabled) ? 0 : a.enabled ? -1 : 1);
                  }
                   this.sharedService.setLoader(false);
                  this.loanEntity.updateLoan = true;
                  this.devToolsServices.openToast(0, 'alert.success');
                  this.udfLoanForm = this.formBuilder.group({});
                  this.udfFieldsLoan = [];
                  this.indexFormUdfLoan = 0;
                  this.listUDFGroupsLoan = [];
                  this.udfStepWorkflowComponent.ngOnInit();
                  this.devToolsServices.backTop();
                  //this.router.navigate([AcmConstants.DASHBOARD_URL]);
                 // await this.getUdfLoanInformation();
                });
              }
            }
          }
        }
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
    if (this.editLoanSimulationIndivForm.value.loanTerm === '' || this.editLoanSimulationIndivForm.value.loanTerm === null) {
      this.resetValidation();
    } else if (this.product.productDetailsDTOs.length > 0) {
      this.product.productDetailsDTOs.forEach(element => {
        if ((this.editLoanSimulationIndivForm.value.loanTerm >= element.minimumTerm
          && this.editLoanSimulationIndivForm.value.loanTerm <= element.maximumTerm)) {
          amountMin.push(element.minimumAmount);
          amountMax.push(element.maximumAmount);
          this.termTrouv = true;
        }
      });
      if (this.termTrouv) {
        this.minAmountValidation = Math.min(...amountMin);
        this.maxAmountValidation = Math.max(...amountMax);
        if (this.editLoanSimulationIndivForm.get("loanAmount").value !== '') {
          if (this.editLoanSimulationIndivForm.get("loanAmount").value >= this.minAmountValidation &&
            this.editLoanSimulationIndivForm.get("loanAmount").value <= this.maxAmountValidation) {
            const amountForm = this.editLoanSimulationIndivForm.get("loanAmount").value;
            this.editLoanSimulationIndivForm.get("loanAmount").reset();
            this.editLoanSimulationIndivForm.get("loanAmount").setValue(amountForm);
            this.limitMinAmountValidation = false;
            this.limitMaxAmountValidation = false;
          } else {
            this.limitMinAmountValidation = this.editLoanSimulationIndivForm.get("loanAmount").value < this.minAmountValidation;
            this.limitMaxAmountValidation = this.editLoanSimulationIndivForm.get("loanAmount").value > this.maxAmountValidation;
            this.editLoanSimulationIndivForm.get("loanAmount").setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.editLoanSimulationIndivForm.controls.loanTerm.value > this.maxTermValidation) {
          this.limitMaxTermValidation = true;
        } else if (this.editLoanSimulationIndivForm.controls.loanTerm.value < this.minTermValidation) {
          this.limitMinTermValidation = true;
        }
        this.editLoanSimulationIndivForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
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
    this.limitMinAmountValidation = false;
    this.limitMaxAmountValidation = false;
    if (this.editLoanSimulationIndivForm.value.loanAmount === '' || this.editLoanSimulationIndivForm.value.loanAmount === null) {
      this.resetValidation();
    } else if (this.product.productDetailsDTOs.length > 0) {
      this.product.productDetailsDTOs.forEach(element => {
        if ((this.editLoanSimulationIndivForm.value.loanAmount >= element.minimumAmount
          && this.editLoanSimulationIndivForm.value.loanAmount <= element.maximumAmount)) {
          termMin.push(element.minimumTerm);
          termMax.push(element.maximumTerm);
          this.amountTrouv = true;
        }
      });
      if (this.amountTrouv) {
        this.minTermValidation = Math.min(...termMin);
        this.maxTermValidation = Math.max(...termMax);
        if (this.editLoanSimulationIndivForm.value.loanTerm !== '') {
          if (this.editLoanSimulationIndivForm.value.loanTerm > this.minTermValidation &&
            this.editLoanSimulationIndivForm.value.loanTerm < this.maxTermValidation) {
            this.editLoanSimulationIndivForm.controls.loanTerm.clearValidators();
          } else {
            this.limitMinTermValidation = this.editLoanSimulationIndivForm.value.loanTerm < this.minTermValidation;
            this.limitMaxTermValidation = this.editLoanSimulationIndivForm.value.loanTerm > this.maxTermValidation;
            this.editLoanSimulationIndivForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.editLoanSimulationIndivForm.get("loanAmount").value >= this.maxAmountValidation) {
          this.limitMaxAmountValidation = true;
        } else if (this.editLoanSimulationIndivForm.get("loanAmount").value <= this.minAmountValidation) {
          this.limitMinAmountValidation = true;
        }
        this.editLoanSimulationIndivForm.get("loanAmount").setErrors({ invalid: true, message: '' });
      }
    }
  }

  /**
   * getMinMaxValueAmount
   */
  getMinMaxValueAmountCalculate() {
    this.amountTrouv = false;
    let approvelAmount = 0;
    approvelAmount = this.editLoanSimulationIndivForm.value.loanTerm * this.editLoanSimulationIndivForm.value.repayment;
    if (this.editLoanSimulationIndivForm.value.loanTerm === '' || this.editLoanSimulationIndivForm.value.loanTerm === null) {
      this.resetValidation();
    } else if (this.product.productDetailsDTOs.length > 0) {
      if (approvelAmount !== 0) {
        this.product.productDetailsDTOs.forEach(element => {
          if ((this.editLoanSimulationIndivForm.value.loanTerm >= element.minimumTerm
            && this.editLoanSimulationIndivForm.value.loanTerm <= element.maximumTerm)
            && (approvelAmount >= element.minimumAmount && approvelAmount <= element.maximumAmount)) {
            this.amountTrouv = true;
            this.editLoanSimulationIndivForm.get("loanAmount").setValue(approvelAmount);
          }
        });
        if (!this.amountTrouv) {
          this.editLoanSimulationIndivForm.get("loanAmount").clearValidators();
          this.editLoanSimulationIndivForm.get("loanAmount").reset();
          this.editLoanSimulationIndivForm.get("loanAmount").setValidators([customRequiredValidator,
          Validators.min(this.product.minimumBalance), Validators.max(this.product.maximumBalance)]);
          this.devToolsServices.openToast(3, 'alert.error_amount');
        }
      } else {
        const amountMin = [];
        const amountMax = [];
        this.product.productDetailsDTOs.forEach(element => {
          if ((this.editLoanSimulationIndivForm.value.loanTerm >= element.minimumTerm
            && this.editLoanSimulationIndivForm.value.loanTerm <= element.maximumTerm)) {
            amountMin.push(element.minimumAmount);
            amountMax.push(element.maximumAmount);
            this.amountTrouv = true;
          }
        });
        this.editLoanSimulationIndivForm.get("loanAmount").setValidators([customRequiredValidator,
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
    approvalTerm = Math.round(this.editLoanSimulationIndivForm.get("loanAmount").value / this.editLoanSimulationIndivForm.value.repayment);
    if (this.editLoanSimulationIndivForm.get("loanAmount").value === '' || this.editLoanSimulationIndivForm.get("loanAmount").value === null) {
      this.resetValidation();
    } else if (this.product.productDetailsDTOs.length > 0) {
      if (approvalTerm !== 0) {
        this.product.productDetailsDTOs.forEach(element => {
          if ((this.editLoanSimulationIndivForm.get("loanAmount").value >= element.minimumAmount
            && this.editLoanSimulationIndivForm.get("loanAmount").value <= element.maximumAmount)
            && (approvalTerm >= element.minimumTerm && approvalTerm <= element.maximumTerm)) {
            this.termTrouv = true;
            this.editLoanSimulationIndivForm.controls.loanTerm.setValue(approvalTerm);
          }
        });
        if (!this.termTrouv) {
          this.editLoanSimulationIndivForm.controls.loanTerm.clearValidators();
          this.editLoanSimulationIndivForm.controls.loanTerm.reset();
          this.editLoanSimulationIndivForm.controls.loanTerm.setValidators([customRequiredValidator,
          Validators.min(this.product.minimumTerm), Validators.max(this.product.maximumTerm)]);
          this.devToolsServices.openToast(3, 'alert.error_term');
        }
      } else {
        const termMin = [];
        const termMax = [];
        this.product.productDetailsDTOs.forEach(element => {
          if (this.editLoanSimulationIndivForm.value.loanAmount >= element.minimumAmount
            && this.editLoanSimulationIndivForm.value.loanAmount <= element.maximumAmount) {
            termMin.push(element.minimumTerm);
            termMax.push(element.maximumTerm);
          }
        });
        this.editLoanSimulationIndivForm.controls.loanTerm.setValidators([customRequiredValidator,
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
      if ((this.editLoanSimulationIndivForm.get("loanAmount").value >= element.minimumAmount
        && this.editLoanSimulationIndivForm.get("loanAmount").value <= element.maximumAmount)
        && (this.editLoanSimulationIndivForm.value.loanTerm >= element.minimumTerm &&
          this.editLoanSimulationIndivForm.value.loanTerm <= element.maximumTerm)) {
        this.termTrouv = true;
        this.amountTrouv = true;
      }
    });
    if (!this.termTrouv && !this.amountTrouv) {
      this.editLoanSimulationIndivForm.controls.loanTerm.clearValidators();
      this.editLoanSimulationIndivForm.controls.loanTerm.reset();
      this.editLoanSimulationIndivForm.controls.loanTerm.setValidators([customRequiredValidator,
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
    this.selectedProduct.productDetailsDTOs.forEach(element => {
      termMin.push(element.minimumTerm);
      termMax.push(element.maximumTerm);
      amountMin.push(element.minimumAmount);
      amountMax.push(element.maximumAmount);
      this.amountTrouv = true;
    });
    this.editLoanSimulationIndivForm.get("loanAmount").clearValidators();
    if (this.editLoanSimulationIndivForm.get("loanAmount").value === null) {
      this.editLoanSimulationIndivForm.get("loanAmount").setErrors({ invalid: true, message: '' });
      this.limitMinAmountValidation = true;
    }
    this.minAmountValidation = Math.min(...amountMin);
    this.maxAmountValidation = Math.max(...amountMax);
    this.editLoanSimulationIndivForm.controls.loanTerm.clearValidators();
    if (this.editLoanSimulationIndivForm.controls.loanTerm.value === null) {
      this.editLoanSimulationIndivForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
      this.limitMinTermValidation = true;
    }
    this.minTermValidation = Math.min(...termMin);
    this.maxTermValidation = Math.max(...termMax);
  }

  /**
   * convert Expiry Date Hijri To Gregorian
   */
  convertExpiryDateToGregorian() {
    this.expirydateG = this.dateFormatterService.ToGregorian(this.expirydateH);
  }

  /**
   * convert Expiry Date Gregorian To Hijri
   */
  convertExpiryDateToHijri() {
    this.expirydateH = this.dateFormatterService.ToHijri(this.expirydateG);
  }

  async getUdfLoanInformation() {
    // INIT UDF FORM
    this.udfLoanForm = this.formBuilder.group({});
    this.udfFieldsLoan[0] = [];
    // Group UDF
    const userDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
    userDefinedFieldsLinksEntity.elementId = this.selectedLoan.loanId;
    userDefinedFieldsLinksEntity.category = AcmConstants.LOAN_CATEGORY;
    userDefinedFieldsLinksEntity.productId = this.selectedLoan.productId;

    let data;

    if (checkOfflineMode()) {
      const udfGroup: any = await this.dbService.getByKey('data', 'getUdfLinkGroupbyLoan_' + this.selectedLoan.loanId).toPromise();
      data = udfGroup.data;
    } else {
      data = await this.udfService.getUdfLinkGroupby(userDefinedFieldsLinksEntity).toPromise();
    }

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
      await this.getUdfGroupLoan(i);
    }
  }

  /**
   * load user defined group
   */
  async getUdfAllGroupLoan() {
    this.udfGroupLoan = new UserDefinedFieldGroupEntity();
    this.udfGroupLoan.category = AcmConstants.LOAN_CATEGORY;
    this.udfGroupLoan.productId = this.selectedLoan.productId;

    let data;

    if (checkOfflineMode()) {
      const udfGroup: any = await this.dbService.getByKey('data', 'getUdfGroup_' + this.selectedLoan.productId).toPromise();
      data = udfGroup.data;
    } else {
      data = await this.udfService.getUdfGroup(this.udfGroupLoan).toPromise();
    }

    this.udfGroupsLoan = data;
    const approvalUdfGrpToRemove = this.udfGroupsLoan.filter(value => value.code === AcmConstants.L1_APPROVAL ||
      value.code === AcmConstants.SOURCE_OF_INVESTIGATION);
    if (approvalUdfGrpToRemove.length > 0) {
      this.udfGroupsLoan.splice(this.udfGroupsLoan.indexOf(approvalUdfGrpToRemove[0]), 1);
      this.udfGroupsLoan.splice(this.udfGroupsLoan.indexOf(approvalUdfGrpToRemove[1]), 1);
    }
  }

  /**
   * load user defined group
   */
  async getUdfGroupLoan(indexFormUdf) {
    await this.getUdfFiledListLoan(indexFormUdf, true);
  }

  /**
   * getUdfFiledListLoan
   *
   * @param j j
   * @param init  init
   */
  async getUdfFiledListLoan(j: number, init: boolean) {
    this.udfFormData = false;

    if (!init) {
      for (let i = 0; i < this.udfFieldsLoan[j].length; i++) {
        this.udfLoanForm.controls['udfField' + j + i].reset();
        this.udfLoanForm.controls['udfField' + j + i].clearValidators();
      }
    }
    this.udfFieldsLoan[j] = [];
    this.udfFieldLoan.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
    if (init) {
      this.udfFieldLoan.userDefinedFieldGroupDTO.id = this.listUDFGroupsLoan[j].id;
    } else {
      this.udfFieldLoan.userDefinedFieldGroupDTO.id = this.udfLoanForm.controls['udfGroup' + j].value.id;
    }
    const data = await this.udfService.getUdfField(this.udfFieldLoan).toPromise();
    this.udfGroupLoan = this.listUDFGroupsLoan[j];

    this.udfGroupLoan.category = AcmConstants.LOAN_CATEGORY;
    this.udfGroupLoan.productId = this.selectedLoan.productId;
    this.udfFieldsLoan[j] = data;
    this.udfFieldsLoan[j].filter((item) => item.idUDFParentField !== 0).map((item) => item.fieldListValuesDTOs = []);
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
      for (const field of this.selectedGroupLoan.udfGroupeFieldsModels) {
        this.surveysId = field.surveysId;
        // find udf from udf Links saved compare with udf settings
        if (field.udfFieldID === this.udfFieldsLoan[j][i].id) {
          this.udfFieldsLoan[j][i].idAbacusUDFLink = field.idAbacusUDFLink;
          this.udfFieldsLoan[j][i].surveysId = field.surveysId;
          this.udfFieldsLoan[j][i].idUDFLink = field.id;
          this.udfFieldsLoan[j][i].delete = false;
          if (this.udfFieldsLoan[j][i].fieldType === 5) {
            fieldExist = true;
            for (const fieldListValuesDTO of this.udfFieldsLoan[j][i].fieldListValuesDTOs) {
              if (fieldListValuesDTO.name === field.value) {
                if (this.udfFieldsLoan[j][i].mandatory === true) {
                  this.udfLoanForm.addControl('udfField' + j + i, new FormControl(fieldListValuesDTO, Validators.required));
                } else {
                  this.udfLoanForm.addControl('udfField' + j + i, new FormControl(fieldListValuesDTO));
                }
                fieldExist = true;
                await this.changeUDFField(j, i)
              }
            }
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
      }
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

    this.udfFormData = true;
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
    return group1?.id === group2?.id;
  }

  checkIssueDate() {
    const issueDate: Date = new Date(this.editLoanSimulationIndivForm.controls.issueDate.value);
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
    const issueDate1: Date = new Date(this.editLoanSimulationIndivForm.controls.issueDate.value);
    issueDate1.setHours(0, 0, 0, 0);
    const initialPayment: Date = new Date(this.editLoanSimulationIndivForm.controls.initialPayment.value);
    initialPayment.setHours(0, 0, 0, 0);
    if (initialPayment > issueDate1) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.issue-payment');
      return false;
    }
  }

  checkDeferredPeriod() {
    this.limitMaxPeriodsValidation = false;
    this.limitMinPeriodsValidation = false;
    const periodsDeferred: number = this.editLoanSimulationIndivForm.controls.periodsDeferred.value;
    if (periodsDeferred < this.editLoanForm.value.product.minimumDeferredPeriod ||
      periodsDeferred > this.editLoanForm.value.product.maximumDeferredPeriod) {
      if (periodsDeferred > this.maxPeriodsValidation) {
        this.limitMaxPeriodsValidation = true;
      } else if (periodsDeferred < this.minPeriodsValidation) {
        this.limitMinPeriodsValidation = true;
      }
      this.editLoanSimulationIndivForm.controls.periodsDeferred.setErrors({ invalid: true, message: '' });
      return false;
    } else {
      const periodsDeferredForm = this.editLoanSimulationIndivForm.controls.periodsDeferred.value;
      this.editLoanSimulationIndivForm.controls.periodsDeferred.reset();
      this.editLoanSimulationIndivForm.controls.periodsDeferred.setValue(periodsDeferredForm);
      return true;
    }
  }

  /**
   * detect if loan changed
   * @param calculate boolean True if form calculate else false
   */
  changeFormLoan(calculate: boolean) {
    this.checkCalculate = calculate;
    this.updateLoan.emit(false);
    this.updateL.emit(false);
  }

  async changeUDFField(j: number, i: number) {
    const udfselected = this.udfFieldsLoan[j][i];
    for (let indexUDF = 0; indexUDF < this.udfFieldsLoan[j].length; indexUDF++) {
      if (this.udfFieldsLoan[j][indexUDF].idUDFParentField === udfselected.id) {
        if(!checkOfflineMode()){
        const userDefinedFieldListValuesEntity = new UserDefinedFieldListValuesEntity();
        // Make the link between list values based on the ACM id
        userDefinedFieldListValuesEntity.parentUDFListValue = this.udfLoanForm.controls['udfField' + j + i].value.id;
        await this.udfService.getUdfListValue(userDefinedFieldListValuesEntity).toPromise().then(
          (data) => {
            this.udfFieldsLoan[j][indexUDF].fieldListValuesDTOs = data;
          }
        );
      } else {
        await this.dbService.getByKey('data', 'udf-fields-group-id-' + this.udfFieldsLoan[j][indexUDF].userDefinedFieldGroupDTO.id).toPromise().then((udfFields: any) => {
          if(udfFields !== undefined){
            const res = udfFields.data?.filter(udfField => udfField.id === this.udfFieldsLoan[j][indexUDF].id);
            if(res.length > 0){
              
              let resultListValues = res[0].fieldListValuesDTOs;
              resultListValues = resultListValues.filter((listValue)=> listValue.parentUDFListValue === this.udfLoanForm.controls['udfField' + j + i].value.id);
              this.udfFieldsLoan[j][indexUDF].fieldListValuesDTOs = resultListValues;
            }
          }
          });     
      }
      }
    }
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
   * DownLoad schedule
   */
  downloadSchedule() {
    const loanScheduleEntity = new LoanScheduleEntity();
    loanScheduleEntity.scheduleDTOs = this.schedules;
    loanScheduleEntity.loanDTO = this.selectedLoan;
    loanScheduleEntity.loanDTO.customerNameNoPipe = this.customer.customerNameNoPipe;
    const daterun = new Date();
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
   * setRenewalAmount
   */
  setRenewalAmount() {
    // check if there is an accepted request for this product
    if (this.acceptedException) {
      // the renewal amount will be the accepted requested amount
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
    renewalExceptionRequest.customerId = this.customer.id;
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
    if (this.selectedLoan.customerDTO.age === null) {
      this.devToolsServices.openToast(3, 'alert.age_limit_product');
      return false;
    }
    if (this.selectedLoan.customerDTO.age >= this.product.minimumAge &&
      this.selectedLoan.customerDTO.age <= this.product.maximumAge) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.age_limit_product');
      return false;
    }
  }
  markAsTouched(event) {
    this.devToolsServices.makeFormAsTouched(this.editLoanForm);
  }
  compareFrequency(d1, d2) {
    return d1 === d2;
  }

  newAsset(listAssetsSelected: AssetLoanEntity[]) {
    this.sharedService.loan.loanAssetsDtos = listAssetsSelected
  }

  updateApportPersonnel(value: number) {
    this.apportPersonnel = value;
    this.editLoanSimulationIndivForm.get("loanAmount").setValue(this.currentAmount - this.apportPersonnel);

  }

  totalAmount(amount: number) {
    if (this.selectedLoan.loanApplicationStatus !== 'NEW_APPLICATION') {
      this.calculatorComp.calculatorForm.controls.loanAmount.setValue(amount) ;
      if (this.sharedService.loan.loanAssetsDtos.length>0){
        this.calculatorComp.loanAmountModifier(this.editLoanForm.value.product,amount);
      }else {
        this.calculatorComp.loanAmountModifier(this.editLoanForm.value.product,amount);
      }
    }else {
      this.currentAmount = amount;
      this.updateApportPersonnel(this.apportPersonnel);
    }
   
  }



  addNewAsset() {
    this.router.navigate(['acm/add-asset'], { queryParams: { source: 'MOD_LOAN', firstSource : "ADD_Supplier" } });
  }

  updatemode(): string {
    return  "edit";
  } 

  scheduleFlexibleChecked(event) {
    const check = event.target as HTMLInputElement;
    this.scheduleFlexibleIsChecked = check.checked;
  }




}
