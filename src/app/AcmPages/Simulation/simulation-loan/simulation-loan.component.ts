
import { AssetLoanEntity } from 'src/app/shared/Entities/AssetLoan.entity';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../Settings/settings.service';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';
import { LoanApprovalService } from '../../Loan-Application/loan-approval/loan-approval.service';
import { ProductLoanReasonEntity } from 'src/app/shared/Entities/productLoanReason.entity';
import { LoanSourceOfFundsEntity } from 'src/app/shared/Entities/loanSourceOfFunds.entity';
import { UdfComponent } from '../../Loan-Application/udf/udf.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { LoanCalculateEntity } from 'src/app/shared/Entities/LoanCalculate.entity';
import { DatePipe } from '@angular/common';
import { LoanScheduleEntity } from 'src/app/shared/Entities/loanSchedule.entity';
import { RenewalConditionLoanEntity } from 'src/app/shared/Entities/renewalConditionLoan.entity';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { ExceptionRequestService } from '../../Loan-Application/dashbord/exception-request/exception-request.service';
import { DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { forkJoin, from } from 'rxjs';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {customRequiredValidator} from '../../../shared/utils';

@Component({
  selector: 'app-simulation-loan',
  templateUrl: './simulation-loan.component.html',
  styleUrls: ['./simulation-loan.component.sass']
})
export class SimulationLoanComponent implements OnInit {
  public edit = 'edit';
  public expandedLoanDetails = true;
  public expandedLoanSimulation = true;
  public expandedLoanSchedule = true;
  public addLoanForm: FormGroup;

  public addLoanSimulationIndivForm: FormGroup;
  public requestExceptionForm: FormGroup;
  public loanEntity: LoanEntity = new LoanEntity();
  public loans: LoanEntity[] = [];
  public customer: CustomerEntity = new CustomerEntity();

  public schedules: ScheduleEntity[] = [];

  public page: number;
  public pageSize: number;
  public decimalPlaces: string;

  public loadingCalcule = false;
  public product: ProductEntity = new ProductEntity();
  public productAbacus: ProductEntity = new ProductEntity();
  public products: ProductEntity[] = [];
  public accountPortfolios: UserEntity[] = [];
  public productLoanReasons: ProductLoanReasonEntity[] = [];
  public sourceOfFundss: LoanSourceOfFundsEntity[] = [];
  public minDateIssueDate = new Date();
  public minInitialPayement = new Date();
  public minInitialPayementvalue: string;
  public activeInitialPayement = false;
  public selectedLoan: LoanEntity = new LoanEntity();
  public currentPath = AcmConstants.LOAN_DETAIL_URL;
  public selectedPorfolio: UserEntity = new UserEntity();
  public selectedProduct: ProductEntity = new ProductEntity();
  public customerMembers: CustomerLinksRelationshipEntity[] = [];

  public currencySymbol = '';
  public minAmount = 0;
  public maxAmount = 0;
  public minTerm = 0;
  public maxTerm = 0;
  public amountTrouv = false;
  public termTrouv = false;

  public apr = 0;
  public irr = 0;

  public aprWithoutRound = 0;
  public irrWithoutRound = 0;

  public issueFeeAmount = 0;

  updateId = 0;
  public apportPersonnel = 0;
  @Input() completeLoanData;
  @ViewChild(UdfComponent, { static: true }) childcomp: UdfComponent;
  public selectedLoanReason: ProductLoanReasonEntity;
  public validateAge: boolean;
  public checkCalculate = true;

  public customerActiveAccount = 0;
  public effectiveInterestRateStandard = 0;
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

  public customerRenewalCondition: RenewalConditionLoanEntity = new RenewalConditionLoanEntity();
  public activeRenewalConditionSetting = false;
  public maximumAllowedAmount: number;
  public renewelLoanCondition = false;
  public activeException = false;
  public acceptedException = false;
  public newExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public acceptedExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public currentUser: UserEntity;
  public feeAmount: number;
  public deferedPeriodeSettingTypes = true;
  public listAssets: AssetLoanEntity[] = [];
  public currentAmount: number;
  public supplier = false;
  public source: string;
  public scheduleFlexibleIsChecked : boolean = false;
  public useExternalCbs = false; // by default acm core , else abacus
  /**
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param router Router
   * @param loanManagementService LoanManagementService
   * @param settingsService SettingsService
   * @param sharedService SharedService
   * @param loanApprovalService LoanApprovalService
   * @param customerManagementService CustomerManagementService
   * @param datePipe DatePipe
   *
   */
  constructor(public devToolsServices: AcmDevToolsServices,
    public formBuilder: FormBuilder,
    public router: Router,
    public loanManagementService: LoanManagementService,
    public settingsService: SettingsService,
    public sharedService: SharedService,
    public loanApprovalService: LoanApprovalService,
    public customerManagementService: CustomerManagementService,
    public datePipe: DatePipe,
    public modalService: NgbModal,
    public translate: TranslateService,
    public authService: AuthentificationService, public route: ActivatedRoute,
    public exceptionRequestService: ExceptionRequestService, public dateFormatterService: DateFormatterService,private dbService: NgxIndexedDBService) {
  }

  async ngOnInit() {
    await this.createForm();
    forkJoin([
      from(this.getProductLoanReason()),
      from(this.getProducts())
    ]).subscribe(([res1]) => {
      if (this.source === 'ADD_ASSET') {
        // fill add loan form
        this.fillAddLoanForm();
        this.fillAddLoanSimulationIndivForm();
      }
    });
    // get source screen if exist. exp:(ADD ASSET screen)
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.source = params.source;
        let totalAssetAmount = 0;
        if (params.source === 'ADD_ASSET') {
          if(this.sharedService.supplier.assets !== undefined){
          this.sharedService.supplier.assets.forEach((data) => {
            const c = new AssetLoanEntity();
            c.remiseArticle = data.remiseArticle;
            c.prixUnitaire = data.prixUnitaire;
            c.quantiteArticle =1;
            c.asset = data;
           totalAssetAmount = totalAssetAmount +  (c.prixUnitaire * (1 - c.remiseArticle / 100) * c.quantiteArticle);
            this.listAssets.push(c);
          });
          // push asset list to child component's input
          this.loanEntity.loanAssetsDtos.push(...this.listAssets);
        }
          // get loan from sharedService
          this.loanEntity = this.sharedService.getLoan();
        }
      }
    });
    // check deferred period setting (if not activate, hide the frequency input and set the value 1 by default)
    const acmEnvironmentKeys: string[] = [AcmConstants.DEFERRED_PERIODE_TYPES, , AcmConstants.USE_EXTERNAL_CBS];
    this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
      if (environments[0].value === '0') {
        this.deferedPeriodeSettingTypes = false;
      }
      if (environments[1].value == '1') {
        this.useExternalCbs = true;
      }
    });
    if (this.completeLoanData === undefined) {
      this.completeLoanData = true;
    }
    this.schedules.length = 0;
    this.pageSize = 5;
    this.page = 1;
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    this.minIssueDatevalue = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.addLoanSimulationIndivForm.controls.issueDate.setValue(this.minIssueDatevalue);
    this.getInitialPaymentValue();


}
  /**
   *
   * update age
   */
  updateAge(): number {
    const [day, month, year] = this.schedules[this.schedules.length - 2].repaymentDate.split('/');
    const dateConvert = [year, month, day].join('/');
    const dateEndLoan = new Date(dateConvert);
    const bdate = new Date(this.customer.dateOfBirth);
    const timeDiff = Math.abs(dateEndLoan.getTime() - bdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
  }
  /**
   * create form
   */
  createForm() {
    this.addLoanForm = this.formBuilder.group({
    product: ['', customRequiredValidator],
    loanReason: ['', customRequiredValidator]
    });

      this.createSimulationIndivForm();

  }

  /**
   * load loan product reason
   */product_loan_reason
   async getProductLoanReason() {
    let data;
    if (checkOfflineMode()) {
      data = await this.dbService.getByKey('data', 'product_loan_reason').toPromise();
      data = data.data;
    } else {
      data = await this.loanManagementService.getProductLoanReason().toPromise();
    }
    this.productLoanReasons = data;
  }


  /**
   * create simulation form indiv
   */
  createSimulationIndivForm() {
    this.addLoanSimulationIndivForm = this.formBuilder.group({
      calculatorType: [1, customRequiredValidator],
      loanAmount: ['', customRequiredValidator],
      repayment: [''],
      loanTerm: ['', customRequiredValidator],
      termType: ['3', customRequiredValidator],
      frequencyType: [''],
      fees: [0],
      issueDate: ['', customRequiredValidator],
      initialPayment: [''],
      periodsDeferred: [],
      periodsDeferredType: ['', customRequiredValidator],
      vat: [0],
      apr: [0],
      closingBalance: [''],
      frequency: [1, customRequiredValidator],
      interestFrequency: [1, customRequiredValidator]

    });
  }

  /**
   * set min date of initial payement the issueDate
   */
  activeInitial() {
    this.activeInitialPayement = true;
    this.minInitialPayement = this.addLoanForm.value.issueDate;
  }

  /**
   * Methode clearForm
   */
  clearForm() {
    this.addLoanForm.reset();

      this.addLoanSimulationIndivForm.reset();
      this.schedules = [];
      this.childcomp.clearForm();
  }

  /**
   * load account portfolios of branch
   */


  /**
   * load products
   */
  async getProducts(): Promise<boolean> {
    let result:  boolean ;
    const productEntity = new ProductEntity();
    productEntity.productIndiv = true;
    result =await this.loanManagementService.getProducts(productEntity).toPromise().then(
      (data) => {
        this.products = data;
        this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.products[0].acmCurrency.decimalPlaces);
        this.currencySymbol = this.products[0].acmCurrency.symbol;
        return true;
      }
    );
    return result
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


  /**
   * calculate the new schedule with new data
   */
  async calculate(resetSchedule : boolean) {


    this.customer.customerIdExtern=1;
    this.customer.dateOfBirth = new Date("1990-05-05");
    this.loanEntity.customerDTO= this.customer;

    this.devToolsServices.makeFormAsTouched(this.addLoanForm);
    if (!this.addLoanForm.valid || !this.addLoanSimulationIndivForm.valid) {
      this.devToolsServices.openToast(3, 'alert.check-data');
      this.devToolsServices.backTop();
      return;
    }
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      // if the renewal condition feature is activate and the customer have a renewal condition setting
      if (this.renewelLoanCondition && this.activeRenewalConditionSetting) {
        if (this.addLoanSimulationIndivForm.controls.loanAmount.value < this.minAmountValidation) {
          this.devToolsServices.openToast(3, 'alert.check_renewal_setting');
          return;
        }
        if (this.addLoanSimulationIndivForm.controls.loanAmount.value > this.maximumAllowedAmount) {
          this.devToolsServices.openToastWithParameter(3, 'alert.max_allowed_amount', String(this.maximumAllowedAmount));
          this.addLoanSimulationIndivForm.controls.loanAmount.clearValidators();
          this.addLoanSimulationIndivForm.controls.loanAmount.setValidators([customRequiredValidator,
             Validators.max(this.maximumAllowedAmount)]);
          this.addLoanSimulationIndivForm.controls.loanAmount.updateValueAndValidity();
          this.addLoanSimulationIndivForm.controls.loanAmount.markAsTouched();
          return;
        }
      }
    }
    if ((this.customer.customerType !== AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY)
      && (this.addLoanSimulationIndivForm.valid)) {
      if (!this.checkIssueDate() || !this.checkDeferredPeriod()) {
        return;
      }
    }
    if (!this.selectedProduct.isFrequencyWithDeferredPeriode) {
      if (this.addLoanSimulationIndivForm.controls.periodsDeferred.value !== 0  &&
       this.addLoanSimulationIndivForm.controls.frequency.value !== 1) {
        this.devToolsServices.openToast(3, 'alert.error_frequency_with_deferred_periode');
        return;
       }
    }
    if (this.selectedProduct.isFrequency) {
    const periodsDeferred = this.addLoanSimulationIndivForm.controls.periodsDeferred.value;
    const loanTerm = this.addLoanSimulationIndivForm.controls.loanTerm.value;
    const frequency = this.addLoanSimulationIndivForm.controls.frequency.value;
    const interestFrequency = this.addLoanSimulationIndivForm.controls.interestFrequency.value;

    // check if loanTerm MOD frequency = 0
    if (loanTerm % frequency !== 0) {
      this.devToolsServices.openToast(3, 'alert.error_frequency_mod_loan_term');
      return;
    }
    if (frequency % interestFrequency !== 0) {
      this.devToolsServices.openToast(3, 'alert.error_repayement_frequency_mod_interest_frequency');
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
    }
    this.checkMinMaxAmountTermCalculate();
    if (this.addLoanSimulationIndivForm.valid && this.addLoanForm.valid && (this.amountTrouv || this.termTrouv)) {
      this.loadingCalcule = true;
      this.loanEntity.productId = this.addLoanForm.value.product.id;
      this.loanEntity.loanCalculationMode = 0;
      this.loanEntity.approvelAmount = this.addLoanSimulationIndivForm.controls.loanAmount.value;
      this.loanEntity.applyAmountTotal = this.addLoanSimulationIndivForm.controls.loanAmount.value;
      this.loanEntity.issueDate = this.addLoanSimulationIndivForm.controls.issueDate.value;
      this.loanEntity.initialPaymentDate = this.addLoanSimulationIndivForm.controls.initialPayment.value;
      this.loanEntity.normalPayment = this.addLoanSimulationIndivForm.controls.repayment.value;
      this.loanEntity.termPeriodNum = this.addLoanSimulationIndivForm.controls.loanTerm.value;
      this.loanEntity.paymentFreq = this.addLoanSimulationIndivForm.controls.frequency.value;
      this.loanEntity.interestFreq = this.addLoanSimulationIndivForm.controls.interestFrequency.value;
      this.loanEntity.termPeriodID = this.addLoanSimulationIndivForm.controls.termType.value;
      this.loanEntity.periodsDeferred = this.addLoanSimulationIndivForm.controls.periodsDeferred.value;
      this.loanEntity.periodsDeferredType = this.addLoanSimulationIndivForm.controls.periodsDeferredType.value.deferredPeriodTypeId;
      this.loanEntity.productDTO = this.addLoanForm.value.product;
     this.loanEntity.customerDTO = this.customer;
     if(resetSchedule) {
      this.scheduleFlexibleIsChecked = false;
      this.schedules = [];
    }
    this.loanEntity.loanSchedules = this.schedules; 
      if (checkOfflineMode()) {
        if (this.loanEntity.loanId === null)
          this.loanEntity.loanId = this.customer.id;
        await this.dbService.update('calculate-loans', this.loanEntity).toPromise();

        // Loan repayment = Loan amount * (Interest /12 + 1/Loan term)
        const interest = this.addLoanSimulationIndivForm.value.product.flatInterestRate / 100;
        const loanAmount = this.addLoanSimulationIndivForm.controls.loanAmount.value;
        const loanTerm = this.addLoanSimulationIndivForm.controls.loanTerm.value;
        const loanRepayment = loanAmount * ((interest / 12) + (1 / loanTerm));

        this.addLoanSimulationIndivForm.controls.repayment.setValue(Math.floor(loanRepayment));

        for (let i = 0; i < loanTerm; i++) {
          const scheduleEntity = new ScheduleEntity();
          scheduleEntity.period = String(i + 1);
          scheduleEntity.totalRepayment = loanRepayment;
          this.schedules.push(scheduleEntity);
        }
        this.checkCalculate = false;
        this.loadingCalcule = false;
      } else {
      await this.loanApprovalService.calculateLoanSchedules(this.loanEntity).toPromise().then(
        (data) => {
          this.schedules = data.loanSchedule;
          this.updateDataIndiv(data);
          if (this.schedules !== undefined &&
            this.schedules[0] !== undefined &&
            this.schedules[0].repaymentDate !== undefined &&
            this.schedules[0].repaymentDate !== null) {
              const timeZone = 'UTC+1'; // Replace this with your desired time zone 
            const transformDate = this.dateFormatterService.ToGregorianDateStruct(this.schedules[0].repaymentDate, 'DD/MM/YYYY');
            const dateResult = new Date(transformDate.year + '-' + transformDate.month + '-' + transformDate.day);
            this.addLoanSimulationIndivForm.controls.initialPayment.setValue(this.datePipe.transform(dateResult, 'yyyy-MM-dd',timeZone));
          }
          this.lastLine = this.schedules[this.schedules.length - 1];
          this.loadingCalcule = false;
          this.checkCalculate = false;
        });
      }
    }
  }


  checkDeferredPeriod() {
    this.limitMaxPeriodsValidation = false;
    this.limitMinPeriodsValidation = false;
    const periodsDeferred: number = this.addLoanSimulationIndivForm.controls.periodsDeferred.value;
    if (periodsDeferred < this.addLoanForm.value.product.minimumDeferredPeriod ||
      periodsDeferred > this.addLoanForm.value.product.maximumDeferredPeriod) {
      if (periodsDeferred > this.maxPeriodsValidation) {
        this.limitMaxPeriodsValidation = true;
      } else if (periodsDeferred < this.minPeriodsValidation) {
        this.limitMinPeriodsValidation = true;
      }
      this.addLoanSimulationIndivForm.controls.periodsDeferred.setErrors({ invalid: true, message: '' });
      return false;
    } else {
      const periodsDeferredForm = this.addLoanSimulationIndivForm.controls.periodsDeferred.value;
      this.addLoanSimulationIndivForm.controls.periodsDeferred.reset();
      this.addLoanSimulationIndivForm.controls.periodsDeferred.setValue(periodsDeferredForm);
      return true;
    }
  }
  /**
   * Update data
   */

  /**
   * Update data
   */
  updateDataIndiv(data: LoanCalculateEntity) {

    let decimal = 1;
    if (this.selectedProduct.acmCurrency.decimalPlaces !== null || this.selectedProduct.acmCurrency.decimalPlaces !== undefined || this.selectedProduct.acmCurrency.decimalPlaces !== 0) {
      decimal = Math.pow(10, this.selectedProduct.acmCurrency.decimalPlaces);
    }
    const pourcentage = (data.issueAmount
      * this.selectedProduct.issueFeePercentage1) / 100;
    const pourcentage2 = (data.issueAmount
      * this.selectedProduct.issueFeePercentage2) / 100;
    const feeAmout1 = pourcentage + ((pourcentage
      * this.selectedProduct.issueFeeVAT1) / 100) + data.feeAmt1;
    // get application fees amount from API calculate
    this.feeAmount = data.feeAmt1;
    const feeAmout2 = pourcentage2 + ((pourcentage2
      * this.selectedProduct.issueFeeVAT2) / 100) + this.selectedProduct.issueFeeAmount2;
    switch (this.selectedProduct.roundType) {
      case AcmConstants.ROUND_UP:
        this.addLoanSimulationIndivForm.controls.repayment.setValue(Math.ceil((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.addLoanSimulationIndivForm.controls.vat.setValue(Math.ceil((data.insurancePremium + Number.EPSILON) * decimal) / decimal);

        this.addLoanSimulationIndivForm.controls.apr.setValue(this.loanEntity.apr);

        this.addLoanSimulationIndivForm.controls.closingBalance.setValue(Math.ceil((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);

        this.addLoanSimulationIndivForm.controls.fees.setValue(this.useExternalCbs == true ? Math.ceil(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      case AcmConstants.ROUND_DOWN:
        this.addLoanSimulationIndivForm.controls.repayment.setValue(Math.floor((data.normalPayment + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationIndivForm.controls.vat.setValue(Math.floor((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        //this.addLoanSimulationIndivForm.controls.apr.setValue(data.apr);
        this.addLoanSimulationIndivForm.controls.apr.setValue(this.loanEntity.apr);


        this.addLoanSimulationIndivForm.controls.closingBalance.setValue(Math.floor((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);

        this.addLoanSimulationIndivForm.controls.fees.setValue(this.useExternalCbs == true ? Math.floor(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      case AcmConstants.ROUND:
        this.addLoanSimulationIndivForm.controls.repayment.setValue(Math.round((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.addLoanSimulationIndivForm.controls.vat.setValue(Math.round((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        //this.addLoanSimulationIndivForm.controls.apr.setValue(data.apr);
        this.addLoanSimulationIndivForm.controls.apr.setValue(this.loanEntity.apr);

        this.addLoanSimulationIndivForm.controls.closingBalance.setValue(Math.round((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationIndivForm.controls.fees.setValue(this.useExternalCbs == true ? Math.round(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      default:
        this.addLoanSimulationIndivForm.controls.repayment.setValue(data.normalPayment);
        this.addLoanSimulationIndivForm.controls.vat.setValue(data.insurancePremium);
        //this.addLoanSimulationIndivForm.controls.apr.setValue(data.apr);
        this.addLoanSimulationIndivForm.controls.apr.setValue(this.loanEntity.apr);

        this.addLoanSimulationIndivForm.controls.closingBalance.setValue(data.issueAmount);
        this.addLoanSimulationIndivForm.controls.fees.setValue(this.useExternalCbs == true ? feeAmout1 + feeAmout2 : data?.acmIssueFee);
        break;
    }
    this.irr = Math.round((data.effectiveInterestRate + Number.EPSILON) * 100) / 100;
    this.apr = Math.round((data.apr + Number.EPSILON) * 100) / 100;
    this.irrWithoutRound = data.effectiveInterestRate;
    this.aprWithoutRound = data.apr;
    if (this.useExternalCbs == true) {
      this.issueFeeAmount = feeAmout1 + feeAmout2;
    }
    else {
      this.issueFeeAmount = data?.acmIssueFee;
    }
    if (this.selectedProduct.flatInterestRate !== 0) {
      this.effectiveInterestRateStandard = data.interestRate;
    }

  }
  selectAssets(listAssetsSelected: AssetLoanEntity[]) {
    this.listAssets = listAssetsSelected;
  }
  /**
   * get   Requirement from selected product for grp
   */
  async getProductRequirement() {
    if (this.addLoanForm.value.product !== '') {
      this.selectedProduct = this.addLoanForm.value.product;
      this.supplier = this.selectedProduct.supplier;
      this.minPeriodsValidation = this.selectedProduct.minimumDeferredPeriod;
      // set default periode deferred the minimum periodeDeferred by Product
      this.addLoanSimulationIndivForm.controls.periodsDeferred.setValue(this.minPeriodsValidation);
      // set default periode deferred type the first periode deferred type configured for the product
      if (this.selectedProduct.productDetailsDTOs[0].deferredPeriodTypeDTOs[0]) {
        this.addLoanSimulationIndivForm.controls.periodsDeferredType.setValue(
          this.selectedProduct.productDetailsDTOs[0].deferredPeriodTypeDTOs[0]);
      }
      this.maxPeriodsValidation = this.selectedProduct.maximumDeferredPeriod;

            const amountMin = [];
            const amountMax = [];
            const termMin = [];
            const termMax = [];
            this.selectedProduct.productDetailsDTOs.forEach(element => {
              amountMin.push(element.minimumAmount);
              amountMax.push(element.maximumAmount);
              termMin.push(element.minimumTerm);
              termMax.push(element.maximumTerm);


            this.minAmountValidation = Math.min(...amountMin);
            this.maxAmountValidation = Math.max(...amountMax);
            this.minTermValidation = Math.min(...termMin);
            this.maxTermValidation = Math.max(...termMax);
            // re-load UDF by productId
            this.loanEntity.customerDTO = this.customer;
            this.loanEntity.productId = this.addLoanForm.value.product.id;
            this.sharedService.setLoan(this.loanEntity);
            this.childcomp.ngOnInit();

          }
       // }
      );
    }
  }
  /**
   * Methode to onSubmit save loan after validation
   */
  submitLoan() {

    this.router.navigate([AcmConstants.CUSTOMER_LIST_SIMULATION], { queryParams: { mode: '3' } });

  }


  submitcustomer() {

    this.router.navigate([AcmConstants.CUSTOMER_URL], { queryParams: { source: 'add-customer' } });

  }



  /**
   * Methode to save
   */


  /**
   * Methode exit
   */
  exit() {
    this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.DASHBOARD_URL);
  }

  /**
   * load customer members
   */


  /**
   * getMinMaxValueAmount
   */
  getMinMaxValueAmount() {
    this.termTrouv = false;
    const amountMin = [];
    const amountMax = [];
    this.limitMinTermValidation = false;
    this.limitMaxTermValidation = false;
    if (this.addLoanSimulationIndivForm.value.loanTerm === '' || this.addLoanSimulationIndivForm.value.loanTerm === null) {
      this.resetValidation();
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      this.selectedProduct.productDetailsDTOs.forEach(element => {
        if ((this.addLoanSimulationIndivForm.value.loanTerm >= element.minimumTerm
          && this.addLoanSimulationIndivForm.value.loanTerm <= element.maximumTerm)) {
          amountMin.push(element.minimumAmount);
          amountMax.push(element.maximumAmount);
          this.termTrouv = true;
        }
      });
      if (this.termTrouv) {
        this.minAmountValidation = Math.min(...amountMin);
        this.maxAmountValidation = Math.max(...amountMax);
        if (this.addLoanSimulationIndivForm.value.loanAmount !== '') {
          if (this.addLoanSimulationIndivForm.value.loanAmount >= this.minAmountValidation &&
            this.addLoanSimulationIndivForm.value.loanAmount <= this.maxAmountValidation && this.source !== 'ADD_ASSET') {
            const amountForm = this.addLoanSimulationIndivForm.value.loanAmount;
            this.addLoanSimulationIndivForm.controls.loanAmount.reset();
            this.addLoanSimulationIndivForm.controls.loanAmount.setValue(amountForm);
            this.limitMinAmountValidation = false;
            this.limitMaxAmountValidation = false;
          } else {
            this.limitMinAmountValidation = this.addLoanSimulationIndivForm.value.loanAmount < this.minAmountValidation;
            this.limitMaxAmountValidation = this.addLoanSimulationIndivForm.value.loanAmount > this.maxAmountValidation;
            this.addLoanSimulationIndivForm.controls.loanAmount.setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.addLoanSimulationIndivForm.controls.loanTerm.value > this.maxTermValidation) {
          this.limitMaxTermValidation = true;
        } else if (this.addLoanSimulationIndivForm.controls.loanTerm.value < this.minTermValidation) {
          this.limitMinTermValidation = true;
        }
        this.addLoanSimulationIndivForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
      }
    }
  }
  updateApportPersonnel(value: number) {
    this.apportPersonnel = value;
    this.addLoanSimulationIndivForm.controls.loanAmount.setValue(this.currentAmount - this.apportPersonnel);
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
    if (this.addLoanSimulationIndivForm.value.loanAmount === '' || this.addLoanSimulationIndivForm.value.loanAmount === null) {
      this.resetValidation();
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      this.selectedProduct.productDetailsDTOs.forEach(element => {
        if ((this.addLoanSimulationIndivForm.value.loanAmount >= element.minimumAmount
          && this.addLoanSimulationIndivForm.value.loanAmount <= element.maximumAmount)) {
          termMin.push(element.minimumTerm);
          termMax.push(element.maximumTerm);
          this.amountTrouv = true;
        }
      });
      if (this.amountTrouv) {
        this.minTermValidation = Math.min(...termMin);
        this.maxTermValidation = Math.max(...termMax);
        if (this.addLoanSimulationIndivForm.value.loanTerm !== '') {
          if (this.addLoanSimulationIndivForm.value.loanTerm > this.minTermValidation &&
            this.addLoanSimulationIndivForm.value.loanTerm < this.maxTermValidation) {
            this.addLoanSimulationIndivForm.controls.loanTerm.clearValidators();
          } else {
            this.limitMinTermValidation = this.addLoanSimulationIndivForm.value.loanTerm < this.minTermValidation;
            this.limitMaxTermValidation = this.addLoanSimulationIndivForm.value.loanTerm > this.maxTermValidation;
            this.addLoanSimulationIndivForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.addLoanSimulationIndivForm.controls.loanAmount.value >= this.maxAmountValidation) {
          this.limitMaxAmountValidation = true;
        } else if (this.addLoanSimulationIndivForm.controls.loanAmount.value <= this.minAmountValidation) {
          this.limitMinAmountValidation = true;
        }
        this.addLoanSimulationIndivForm.controls.loanAmount.setErrors({ invalid: true, message: '' });
      }
    }
  }

  /**
   * getMinMaxValueAmount
   */
  getMinMaxValueAmountCalculate() {
    this.amountTrouv = false;
    let approvelAmount = 0;
    approvelAmount = this.addLoanSimulationIndivForm.value.loanTerm * this.addLoanSimulationIndivForm.value.repayment;
    if (this.addLoanSimulationIndivForm.value.loanTerm === '' || this.addLoanSimulationIndivForm.value.loanTerm === null) {
      this.resetValidation();
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      if (approvelAmount !== 0) {
        this.selectedProduct.productDetailsDTOs.forEach(element => {
          if ((this.addLoanSimulationIndivForm.value.loanTerm >= element.minimumTerm
            && this.addLoanSimulationIndivForm.value.loanTerm <= element.maximumTerm)
            && (approvelAmount >= element.minimumAmount && approvelAmount <= element.maximumAmount) && this.source !== 'ADD_ASSET' ) {
            this.amountTrouv = true;
            this.addLoanSimulationIndivForm.controls.loanAmount.clearValidators();
            this.addLoanSimulationIndivForm.controls.loanAmount.setValue(approvelAmount);
          }
        });
        if (!this.amountTrouv) {
          if (this.addLoanSimulationIndivForm.controls.loanAmount.value > this.maxAmountValidation) {
            this.limitMaxAmountValidation = true;
          } else if (this.addLoanSimulationIndivForm.controls.loanAmount.value < this.minAmountValidation) {
            this.limitMinAmountValidation = true;
          }
          this.addLoanSimulationIndivForm.controls.loanAmount.setErrors({ invalid: true, message: '' });
        }
      } else {
        const amountMin = [];
        const amountMax = [];
        this.selectedProduct.productDetailsDTOs.forEach(element => {
          if ((this.addLoanSimulationIndivForm.value.loanTerm >= element.minimumTerm
            && this.addLoanSimulationIndivForm.value.loanTerm <= element.maximumTerm)) {
            amountMin.push(element.minimumAmount);
            amountMax.push(element.maximumAmount);
            this.amountTrouv = true;

          }
        });
        this.minAmountValidation = Math.min(...amountMin);
        this.maxAmountValidation = Math.max(...amountMax);
      }
    }
  }

  /**
   * getMinMaxValuTerm
   */
  getMinMaxValueTermCalculate() {
    this.termTrouv = false;
    let approvalTerm = 0;
    approvalTerm = Math.round(this.addLoanSimulationIndivForm.value.loanAmount / this.addLoanSimulationIndivForm.value.repayment);
    if (this.addLoanSimulationIndivForm.value.loanAmount === '' || this.addLoanSimulationIndivForm.value.loanAmount === null) {
      this.resetValidation();
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      if (approvalTerm !== 0) {
        this.selectedProduct.productDetailsDTOs.forEach(element => {
          if ((this.addLoanSimulationIndivForm.value.loanAmount >= element.minimumAmount
            && this.addLoanSimulationIndivForm.value.loanAmount <= element.maximumAmount)
            && (approvalTerm >= element.minimumTerm && approvalTerm <= element.maximumTerm)) {
            this.termTrouv = true;
            this.addLoanSimulationIndivForm.controls.loanTerm.clearValidators();
            this.addLoanSimulationIndivForm.controls.loanTerm.setValue(approvalTerm);
          }
        });
        if (!this.termTrouv) {
          if (this.addLoanSimulationIndivForm.controls.loanTerm.value > this.maxTermValidation) {
            this.limitMaxTermValidation = true;
          } else if (this.addLoanSimulationIndivForm.controls.loanTerm.value < this.minTermValidation) {
            this.limitMinTermValidation = true;
          }
          this.addLoanSimulationIndivForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
        }
      } else {
        const termMin = [];
        const termMax = [];
        this.selectedProduct.productDetailsDTOs.forEach(element => {
          if (this.addLoanSimulationIndivForm.value.loanAmount >= element.minimumAmount
            && this.addLoanSimulationIndivForm.value.loanAmount <= element.maximumAmount) {
            termMin.push(element.minimumTerm);
            termMax.push(element.maximumTerm);
          }
        });
        this.addLoanSimulationIndivForm.controls.loanTerm.setValidators([customRequiredValidator,
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
    this.addLoanForm.controls.product.value.productDetailsDTOs.forEach(element => {
      if ((this.addLoanSimulationIndivForm.value.loanAmount >= element.minimumAmount
        && this.addLoanSimulationIndivForm.value.loanAmount <= element.maximumAmount)
        && (this.addLoanSimulationIndivForm.value.loanTerm >= element.minimumTerm &&
          this.addLoanSimulationIndivForm.value.loanTerm <= element.maximumTerm)) {
        this.termTrouv = true;
        this.amountTrouv = true;
      }
    });
    if (!this.termTrouv && !this.amountTrouv) {
      this.resetValidation();
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
    this.addLoanSimulationIndivForm.controls.loanAmount.clearValidators();
    if (this.addLoanSimulationIndivForm.controls.loanAmount.value === null) {
      this.addLoanSimulationIndivForm.controls.loanAmount.setErrors({ invalid: true, message: '' });
      this.limitMinAmountValidation = true;
    }
    this.minAmountValidation = Math.min(...amountMin);
    this.maxAmountValidation = Math.max(...amountMax);
    this.addLoanSimulationIndivForm.controls.loanTerm.clearValidators();
    if (this.addLoanSimulationIndivForm.controls.loanTerm.value === null) {
      this.addLoanSimulationIndivForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
      this.limitMinTermValidation = true;
    }
    this.minTermValidation = Math.min(...termMin);
    this.maxTermValidation = Math.max(...termMax);
  }

  /**
   * getMinMaxValueAmountGrp
   */


  /**
   * resetValidation
   */


  checkAgeForProduct() {
    this.customer.age = this.updateAge();
    if (this.customer.age === null) {
      this.devToolsServices.openToast(3, 'alert.age_limit_product');
      return false;
    }
    if (this.customer.age >= this.addLoanForm.value.product.minimumAge &&
      this.customer.age <= this.addLoanForm.value.product.maximumAge) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.age_limit_product');
      return false;
    }
  }

  checkIssueDate() {
    const issueDate: Date = new Date(this.addLoanSimulationIndivForm.controls.issueDate.value);
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
   * getInitialPaymentValue() : First repayment is 30 after issue date/ In case of frequency activated it will be X frequency month + issue date
   */
  getInitialPaymentValue() {
    if (this.datePipe.transform(this.loanEntity.issueDate, 'yyyy-MM-dd') !== this.addLoanSimulationIndivForm.controls.issueDate.value) {
      this.checkCalculate = true;
    }
    const issueDate1: Date = new Date(this.addLoanSimulationIndivForm.controls.issueDate.value);
    const initialPayment = issueDate1;
    if (this.selectedProduct.isFrequency) {
      initialPayment.setMonth(issueDate1.getMonth() + (this.addLoanSimulationIndivForm.controls.interestFrequency.value));
    } else {
      initialPayment.setDate(issueDate1.getDate() + 30);
    }
    this.addLoanSimulationIndivForm.controls.initialPayment.setValue(this.datePipe.transform(initialPayment, 'yyyy-MM-dd'));
  }
  /**
   * check if the next installment date is 30 after issue date
   */
  checkInitialPaymentValue() {
    const issueDate1: Date = new Date(this.addLoanSimulationIndivForm.controls.issueDate.value);
    const initialPayment: Date = new Date(this.addLoanSimulationIndivForm.controls.initialPayment.value);
    const utc1 = Date.UTC(issueDate1.getFullYear(), issueDate1.getMonth(), issueDate1.getDate());
    const utc2 = Date.UTC(initialPayment.getFullYear(), initialPayment.getMonth(), initialPayment.getDate());
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  }
  /**
   * getInitialPaymentValueGrp() : First repayment is 30 after issue date
   * @param i number
 */

  checkInitialPayment() {
    const issueDate1: Date = new Date(this.addLoanSimulationIndivForm.controls.issueDate.value);
    issueDate1.setHours(0, 0, 0, 0);
    const initialPayment: Date = new Date(this.addLoanSimulationIndivForm.controls.initialPayment.value);
    initialPayment.setHours(0, 0, 0, 0);
    if (initialPayment > issueDate1) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.issue-payment');
      return false;
    }
  }


  /**
   * detect if loan changed
   * @param calculate boolean True if form calculate else false
   */
  changeFormLoan() {
    this.checkCalculate = true;
  }

  /**
   * DownLoad schedule
   */
  downloadSchedule(schedules) {
    const loanScheduleEntity = new LoanScheduleEntity();
    loanScheduleEntity.scheduleDTOs = schedules;
    loanScheduleEntity.loanDTO = this.selectedLoan;
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

  /**
   * requestExceptionModal
   * @param renewalModalContent NgbModal
   */
  openRequestExceptionModal(renewalModalContent) {
    this.devToolsServices.makeFormAsTouched(this.addLoanForm);
    // check if there is an active exception for this product
    if (this.activeException || this.acceptedException) {
      this.devToolsServices.openToast(3, 'alert.exception_request_in_progress');
      return;
    }

    if (!this.addLoanForm.valid || !this.addLoanSimulationIndivForm.valid) {
      this.devToolsServices.openToast(3, 'alert.check-data');
      return;
    }
    this.getConnectedUser();
    this.createRequestExceptionForm();
    this.modalService.open(renewalModalContent, {
      size: 'md'
    });
  }

  /**
   * createRequestExceptionForm
   */
  createRequestExceptionForm() {
    this.requestExceptionForm = this.formBuilder.group({
      maximumAllowedAmount: [this.maximumAllowedAmount],
      requestedAmount: ['', [customRequiredValidator, Validators.min(this.maximumAllowedAmount)]],
      note: ['']
    });
  }
  /**
   * submitException
   */
  submitException() {
    this.requestExceptionForm.markAsTouched();
    if (this.requestExceptionForm.valid) {
      this.newExceptionRequest.allowedAmount = this.maximumAllowedAmount;
      this.newExceptionRequest.customerId = this.customer.id;
      this.newExceptionRequest.customerName = this.customer.customerNameNoPipe;
      this.newExceptionRequest.statut = AcmConstants.NEW_STATUT_REQUEST;
      this.newExceptionRequest.makerName = this.currentUser.fullName;
      this.newExceptionRequest.makerUsername = this.currentUser.login;
      this.newExceptionRequest.note = this.requestExceptionForm.controls.note.value;
      this.newExceptionRequest.requestedAmount = this.requestExceptionForm.controls.requestedAmount.value;
      this.newExceptionRequest.branchId = this.customer.branchId;
      this.exceptionRequestService.createExceptionRequest(this.newExceptionRequest).subscribe((data) => {
        this.activeException = true;
        this.devToolsServices.openToast(0, 'alert.success');
        this.modalService.dismissAll();
      });
    }
  }
  /**
   * checkActiveException : check if the customer has an exception
   * in progress or accepted (the customer can has only one exception)
   */
  checkNewOrAccpetedException() {
    const renewalExceptionRequest = new ExceptionRequestEntity();
    renewalExceptionRequest.customerId = this.customer.id;
    // 0: NEW 1: ACCEPTED
    renewalExceptionRequest.listStatut = [AcmConstants.NEW_STATUT_REQUEST, AcmConstants.ACCEPTED_STATUT_REQUEST];
    // get exception request by id customer and status (new/ accepted)
    this.exceptionRequestService.findExceptionRequest(renewalExceptionRequest).subscribe((data) => {
      data.forEach(element => {
        if (element.statut === AcmConstants.NEW_STATUT_REQUEST) {
          // exception in progress
          this.activeException = true;
        } else if (element.statut === AcmConstants.ACCEPTED_STATUT_REQUEST) {
          // accepted exception
          this.acceptedException = true;
          // the accepted exception
          this.acceptedExceptionRequest = element;
        }
      });
    });
  }
  async getConnectedUser() {
    this.currentUser = this.sharedService.getUser();

  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  totalAmount(amount: number) {
    this.currentAmount = amount;
    this.updateApportPersonnel(this.apportPersonnel);
  }
  fillAddLoanForm() {
    this.addLoanForm.controls.accountPortfolio.setValue(this.accountPortfolios.find(
      portfolio => portfolio.accountPortfolioId === this.loanEntity.portfolioId));
    this.addLoanForm.controls.loanReason.setValue(this.productLoanReasons.find(
      reason => reason.code === this.loanEntity.loanReasonCode));
    this.addLoanForm.controls.sourceOfFunds.setValue(this.sourceOfFundss.find(
      sourceOfFunds => sourceOfFunds.loanSourceOfFundsID === this.loanEntity.sourceOfFundsID));
    this.addLoanForm.controls.product.setValue(this.products.find(
      product => product.id === this.loanEntity.productId));
    this.getProductRequirement();
  }
  fillAddLoanSimulationIndivForm() {
    this.addLoanSimulationIndivForm.controls.repayment.setValue(this.loanEntity.normalPayment);
    this.addLoanSimulationIndivForm.controls.loanAmount.setValue(this.loanEntity.applyAmountTotal);
    this.addLoanSimulationIndivForm.controls.loanTerm.setValue(this.loanEntity.termPeriodNum);
    this.addLoanSimulationIndivForm.controls.issueDate.setValue(this.loanEntity.issueDate);
    this.addLoanSimulationIndivForm.controls.initialPayment.setValue(this.loanEntity.initialPaymentDate);
    this.addLoanSimulationIndivForm.controls.periodsDeferred.setValue(this.loanEntity.periodsDeferred);
    this.addLoanSimulationIndivForm.controls.periodsDeferredType.setValue(this.loanEntity.periodsDeferredType);
    this.addLoanSimulationIndivForm.controls.frequency.setValue(this.loanEntity.paymentFreq);
    this.addLoanSimulationIndivForm.controls.interestFrequency.setValue(this.loanEntity.interestFreq);
    this.getMinMaxValueTerm();

  }
  addNewAsset() {
    this.setLoanEntity();
    this.sharedService.setLoan(this.loanEntity);
    this.router.navigate(['acm/add-asset'], { queryParams: { source: 'ADD_LOAN' } });
  }
  setLoanEntity() {
    this.loanEntity = new LoanEntity();
    this.loanEntity.portfolioCode =this.addLoanForm.controls.accountPortfolio.value !== undefined ?
    this.addLoanForm.controls.accountPortfolio.value.login : null;
    this.loanEntity.portfolioId = this.addLoanForm.controls.accountPortfolio.value !== undefined ?
     this.addLoanForm.controls.accountPortfolio.value.accountPortfolioId : null;
    this.loanEntity.productId = this.addLoanForm.controls.product.value !== undefined ?
     this.addLoanForm.controls.product.value.id : null;
     this.loanEntity.loanAssetsDtos= [];
     if (this.listAssets !==undefined && this.listAssets.length !== 0 ){
     this.listAssets.forEach(item=>{
      this.loanEntity.loanAssetsDtos.push(item) ;
     }) ;
    }else {
    this.sharedService.getLoan().loanAssetsDtos.forEach(item=>{
      this.loanEntity.loanAssetsDtos.push(item) ;
     }) ;
    }
    this.loanEntity.personalContribution = this.apportPersonnel;
    // set id Loan
    // this.loanEntity.loanId=this.sharedService.getLoan().loanId;
    this.loanEntity.productDTO = this.addLoanForm.controls.product.value;
   this.loanEntity.customerDTO = this.customer;
    this.loanEntity.branchID = this.customer.branchId;
    this.loanEntity.branchDescription = this.customer.branchesDescription;
    this.loanEntity.branchName = this.customer.branchesName;
    this.loanEntity.loanReasonCode = this.addLoanForm.controls.loanReason.value !== undefined
    ? this.addLoanForm.controls.loanReason.value.code : '';
    this.loanEntity.loanReasonId = this.addLoanForm.controls.loanReason.value !== undefined
    ? this.addLoanForm.controls.loanReason.value.loanReasonID : null;
    this.loanEntity.sourceOfFundsID = this.addLoanForm.controls.sourceOfFunds.value !== undefined
    ? this.addLoanForm.controls.sourceOfFunds.value.loanSourceOfFundsID : null;
    this.loanEntity.customerType = this.customer.customerType;
    this.loanEntity.applyAmountTotal = this.addLoanSimulationIndivForm.controls.loanAmount.value;
    this.loanEntity.approvelAmount = this.addLoanSimulationIndivForm.controls.loanAmount.value;
    this.loanEntity.normalPayment = this.addLoanSimulationIndivForm.controls.repayment.value;
    this.loanEntity.termPeriodNum = this.addLoanSimulationIndivForm.controls.loanTerm.value;
    this.loanEntity.interestFreq = this.addLoanSimulationIndivForm.controls.interestFrequency.value;
    this.loanEntity.paymentFreq = this.addLoanSimulationIndivForm.controls.frequency.value;
    this.loanEntity.issueDate = this.addLoanSimulationIndivForm.controls.issueDate.value;
    this.loanEntity.initialPaymentDate = this.addLoanSimulationIndivForm.controls.initialPayment.value;
    this.loanEntity.periodsDeferredType = this.addLoanSimulationIndivForm.controls.periodsDeferredType.value;
    this.loanEntity.periodsDeferred = this.addLoanSimulationIndivForm.controls.periodsDeferred.value;
    this.loanEntity.termPeriodID = this.addLoanSimulationIndivForm.controls.termType.value;
    this.loanEntity.apr = this.aprWithoutRound;
    this.loanEntity.effectiveIntRate = this.irrWithoutRound;
    if (this.useExternalCbs === true) {
      this.loanEntity.issueFeeAmount = this.issueFeeAmount;
    }
    else {
      this.loanEntity.acmIssueFees = this.issueFeeAmount;
    }
    this.loanEntity.feeAmt1 = this.feeAmount;
    this.loanEntity.loanApplicationStatus = AcmConstants.NEW_APPLICATION;
    this.sharedService.setLoan(this.loanEntity);
  }
  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
  scheduleFlexibleChecked(event) {
    const check = event.target as HTMLInputElement;
    this.scheduleFlexibleIsChecked = check.checked;
  }
}
