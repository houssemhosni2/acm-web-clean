import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { CustomerManagementService } from 'src/app/AcmPages/Customer/customer-management/customer-management.service';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { CustomerAccountEntity } from 'src/app/shared/Entities/customer.account.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanCalculateEntity } from 'src/app/shared/Entities/LoanCalculate.entity';
import { LoanScheduleEntity } from 'src/app/shared/Entities/loanSchedule.entity';
import { RenewalConditionLoanEntity } from 'src/app/shared/Entities/renewalConditionLoan.entity';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { checkOfflineMode, customRequiredValidator } from 'src/app/shared/utils';
import { ExceptionRequestService } from '../../dashbord/exception-request/exception-request.service';
import { LoanApprovalService } from '../../loan-approval/loan-approval.service';
import { LoanManagementService } from '../loan-management.service';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.sass']
})
export class CalculatorComponent implements OnInit, OnChanges {
  @Input() customerType;
  @Input() selectedLoan;
  @Input() selectedProduct;
  @Input() loanDetailsValidity: boolean;
  // source : edit-loan / approval / add topup / change-data
  @Input() source: string;
  @Input() show: boolean;
  @Input() approveAction: boolean;
  public schedules: ScheduleEntity[] = [];
  public schedulesGrp: ScheduleEntity[][] = [];
  public loanEntity: LoanEntity = new LoanEntity();
  public calculatorGrpForm: FormGroup;
  public calculatorForm: FormGroup;
  public requestExceptionForm: FormGroup;
  public customer: CustomerEntity = new CustomerEntity();
  public customerMembers: CustomerLinksRelationshipEntity[] = [];
  public checkCalculateGrp: boolean[] = [];
  public aprGrp: number[] = [0];
  public irrGrp: number[] = [0];
  public minAmountValidationGrp = [];
  public maxAmountValidationGrp = [];
  public minTermValidationGrp = [];
  public maxTermValidationGrp = [];
  public aprGrpWitoutRound: number[] = [0];
  public irrGrpWithoutRound: number[] = [0];
  public issueFeeAmountGrp: number[] = [0];
  public minAmountValidation = 0;
  public maxAmountValidation = 0;
  public minTermValidation = 0;
  public maxTermValidation = 0;
  public checkCalculate = true;
  public expandedLoanSimulation = true;
  public limitMinAmountValidation = false;
  public limitMaxAmountValidation = false;
  public limitMinTermValidation = false;
  public limitMaxTermValidation = false;
  public limitMinPeriodsValidation = false;
  public limitMaxPeriodsValidation = false;
  public topupRefinance = true;
  public amountTrouv = false;
  public currencySymbol = '';
  public termTrouv = false;
  public minIssueDatevalue: string;
  public minPeriodsValidation = 0;
  public maxPeriodsValidation = 0;
  public maximumAllowedAmount: number;
  public loadingCalcule = false;
  public feeAmount: number;
  public apr = 0;
  public irr = 0;
  public aprWithoutRound = 0;
  public irrWithoutRound = 0;
  public issueFeeAmount = 0;
  public lastLine: ScheduleEntity;
  public lastLineGrp: ScheduleEntity;
  public effectiveInterestRateStandard = 0;
  public activeException = false;
  public renewelLoanCondition = false;
  public customerRenewalCondition: RenewalConditionLoanEntity = new RenewalConditionLoanEntity();
  public activeRenewalConditionSetting = false;
  public acceptedException = false;
  public newExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public acceptedExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public currentUser: UserEntity;
  public expandedLoanSchedule = true;
  public page: number;
  public pageSize: number;
  public decimalPlaces: string;
  private amountTrouvGrp: boolean[] = [];
  private termTrouvGrp: boolean[] = [];
  public limitMinAmountValidationGrp = [];
  public limitMaxAmountValidationGrp = [];
  public limitMinTermValidationGrp = [];
  public limitMaxTermValidationGrp = [];
  public showScheduleGrp = true;
  public customerActiveAccount = 0;
  public methodCalcule: string;
  public updateLoanAbacus = false;
  public currentAmount = 0;
  public apportPersonnel = 0;
  public scheduleFlexibleIsChecked : boolean = false;
  @Output() loanFormDetailsTouched = new EventEmitter<boolean>();
  @Output() totalInterest = new EventEmitter<number>();
  @Output() requiredCalculate = new EventEmitter<boolean>();

  @Output() validateLoanApproval = new EventEmitter<[boolean, LoanEntity, boolean, boolean]>();
  public MaxBalanceCustomer = 0.0;
  public enableBalance = false;
  public customerAccount: CustomerAccountEntity = new CustomerAccountEntity();
  constructor(private sharedService: SharedService, private formBuilder: FormBuilder,
    private customerManagementService: CustomerManagementService, private datePipe: DatePipe,
    private devToolsServices: AcmDevToolsServices, private loanApprovalService: LoanApprovalService,
    private dateFormatterService: DateFormatterService, private modalService: NgbModal,
    private exceptionRequestService: ExceptionRequestService, private authService: AuthentificationService,
    private translate: TranslateService, private loanManagementService: LoanManagementService,
    private settingsService: SettingsService,
    private dbService: NgxIndexedDBService) { }

  ngOnInit() {
    this.apportPersonnel = this.selectedLoan.personalContribution;
    this.currentAmount = this.selectedLoan.approvelAmount + this.apportPersonnel;

    if (this.show) {
      this.customer = this.sharedService.getCustomer();
      this.pageSize = 5;
      this.page = 1;
      if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
        this.createSimulationGrpForm();
        this.getCustomerMembers(this.customer);
      } else {
        if (this.source !== 'add-topup-refinance') {
          this.methodCalcule = '-1';
          this.editSimulationIndivForm();
        } else {
          if (this.source !== 'add-topup-refinance') {
            this.methodCalcule = '-1';
            this.editSimulationIndivForm();
          } else {
            this.createSimulationIndivForm();
            this.customerAccount = this.sharedService.getCustomerAccount();
          }
        }
        this.sharedService.getRenewalConditionStatus().then((data) => {
          this.renewelLoanCondition = data;
          if (this.renewelLoanCondition === true) {
            // get renewal condition setting if exist
            this.customerManagementService.getRenewalConditionSetting(this.customerAccount).subscribe((renewalSetting) => {
              this.customerRenewalCondition = renewalSetting;
              if (this.customerRenewalCondition !== null && Object.keys(this.customerRenewalCondition).length !== 0) {
                this.checkNewOrAccpetedException().then(
                  () => {
                    this.setRenewalAmount();
                  }
                );
                this.activeRenewalConditionSetting = true;
              }
            });
          }
        });
      }
    }
    if(!checkOfflineMode()){
    const acmEnvironmentKeys: string[] = [AcmConstants.MAXIMUM_BALANCE_BY_CUSTOMER];
    this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
      this.enableBalance = environments[0].enabled;
      if (this.enableBalance) { 
        this.MaxBalanceCustomer = Number(environments[0].value);
      }
    }); 
  } else {
    this.dbService.getByKey('data', 'envirement-values-by-keys').subscribe((environments:any)=>{
      if(environments !== undefined){
        const env = environments.data.filter(item => item.key === AcmConstants.MAXIMUM_BALANCE_BY_CUSTOMER);
        if(env.length > 0 ){
          this.enableBalance = env[0].enabled;
          if (this.enableBalance) { 
            this.MaxBalanceCustomer = Number(env[0].value);
          }
        }}
      }) ;  
  }
  }

  ngOnChanges(changes: SimpleChanges) {
    // edit case : status loan = topup or refinance
    if (this.show) {
      if (changes.selectedProduct !== undefined && changes.selectedProduct.currentValue !== '') {
        this.selectedProduct = changes.selectedProduct.currentValue;
        this.minPeriodsValidation = this.selectedProduct.minimumDeferredPeriod;
        this.maxPeriodsValidation = this.selectedProduct.maximumDeferredPeriod;
        if (this.calculatorForm !== undefined) {
          this.calculatorForm.controls.loanAmount.clearValidators();
          this.calculatorForm.controls.loanAmount.setValidators([Validators.required,
          Validators.min(this.selectedProduct.settingTopup.topupMinFixedLoanAmount)]);
          this.calculatorForm.controls.loanAmount.updateValueAndValidity();
        }
        if (
          Object.keys(this.selectedProduct).length !== 0) {
          this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.selectedProduct.decimal);
          this.currencySymbol = this.selectedProduct.currency;
          this.setTermAndAmounValidation();
          if (this.renewelLoanCondition) {
            this.setRenewalAmount();
          }
        }
      }
      if (changes.approveAction !== undefined && changes.approveAction.currentValue !== changes.approveAction.previousValue) {
        this.checkValidityForApproval();
      }

    }
     if (this.enableBalance) {
      this.maxAmountValidation = Math.min(this.maxAmountValidation, this.MaxBalanceCustomer);
    } 
  }
  editSimulationIndivForm() {
    this.apr = Math.round((this.selectedLoan.apr + Number.EPSILON) * 100) / 100;
    this.irr = Math.round((this.selectedLoan.effectiveIntRate + Number.EPSILON) * 100) / 100;
    this.effectiveInterestRateStandard = this.selectedLoan.productRate;
    this.calculatorForm = this.formBuilder.group({
      loanAmount: [this.selectedLoan.applyAmountTotal],
      repayment: [this.selectedLoan.normalPayment],
      loanTerm: [this.selectedLoan.termPeriodNum],
      termType: [this.selectedLoan.termPeriodID],
      issueDate: [new Date(this.selectedLoan.issueDate).toISOString().substring(0, 10), Validators.required],
      initialPayment: [new Date(this.selectedLoan.initialPaymentDate).toISOString().substring(0, 10), Validators.required],
      ignoreOddDays: [this.selectedLoan.ignoreOddDays],
      periodsDeferred: [this.selectedLoan.periodsDeferred],
      periodsDeferredType: [this.selectedLoan.periodsDeferredType],
      fees: [],
      vat: [0],
      apr: [this.selectedLoan.apr],
      closingBalance: [this.selectedLoan.openingBalance + this.selectedLoan.applyAmountTotal],
      openingBalance: [this.selectedLoan.openingBalance],

      frequency: [this.selectedLoan.paymentFreq, Validators.required],
      interestFrequency: [this.selectedLoan.interestFreq, Validators.required]

    });
    this.getCalculationInformation(this.selectedLoan);
    const issueDate1: Date = new Date(this.calculatorForm.controls.issueDate.value);
    const initialPayment = issueDate1;
    initialPayment.setDate(issueDate1.getDate() + 30);
    this.calculatorForm.controls.initialPayment.setValue(this.datePipe.transform(initialPayment, 'yyyy-MM-dd'));

  }
  async getCalculationInformation(loan: LoanEntity) {
    this.schedules = [];
    loan.approvelAmount = this.calculatorForm.controls.closingBalance.value;
    loan.applyAmountTotal = this.calculatorForm.controls.closingBalance.value;
    await this.loanApprovalService.calculateLoanSchedules(loan).toPromise().then(
      (data) => {
        this.schedules = data.loanSchedule;
        this.selectedLoan.approvelAmount = this.calculatorForm.controls.loanAmount.value;
        this.selectedLoan.applyAmountTotal = this.calculatorForm.controls.loanAmount.value;

        this.lastLine = this.schedules[this.schedules.length - 1];
        this.totalInterest.emit(Number(this.lastLine.interestRepayment));
        this.updateDataIndiv(data);

        this.loadingCalcule = false;
        this.checkCalculate = false;
      });
  }
  setTermAndAmounValidation() {
    if (this.renewelLoanCondition) {
      this.setRenewalAmount();
    }
    const amountMin = [];
    const amountMax = [];
    const termMin = [];
    const termMax = [];
    this.selectedProduct.productDetailsDTOs.forEach(element => {
      amountMin.push(element.minimumAmount);
      amountMax.push(element.maximumAmount);
      termMin.push(element.minimumTerm);
      termMax.push(element.maximumTerm);
    });
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      for (let i = 0; i < this.customerMembers.length; i++) {
        this.minAmountValidationGrp[i] = Math.min(...amountMin);
        this.maxAmountValidationGrp[i] = Math.max(...amountMax);
        this.minTermValidationGrp[i] = Math.min(...termMin);
        this.maxTermValidationGrp[i] = Math.max(...termMax);
      }
    } else {
      this.minAmountValidation = Math.min(...amountMin);
      this.maxAmountValidation = Math.max(...amountMax);
      this.minTermValidation = Math.min(...termMin);
      this.maxTermValidation = Math.max(...termMax);
    }

    this.minAmountValidation = Math.min(...amountMin);
    this.maxAmountValidation = Math.max(...amountMax);
    this.minTermValidation = Math.min(...termMin);
    this.maxTermValidation = Math.max(...termMax);
    this.calculatorForm.controls.loanTerm.clearValidators();
    this.calculatorForm.controls.loanTerm.setValidators([Validators.required,
    Validators.max(this.maxTermValidation), Validators.min(this.minTermValidation)]);
    this.calculatorForm.controls.loanTerm.updateValueAndValidity();
    if (this.calculatorForm.controls.loanTerm.value > this.maxTermValidation) {
      this.limitMaxTermValidation = true;
      // this.calculatorForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
    } else if (this.calculatorForm.controls.loanTerm.value < this.minTermValidation
      && this.calculatorForm.controls.loanTerm.value !== null) {
      this.limitMinTermValidation = true;
      // this.calculatorForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
    }

    // check validity of closing balance
    this.calculatorForm.controls.closingBalance.clearValidators();
    this.calculatorForm.controls.closingBalance.setValidators([Validators.required,
    Validators.max(this.maxAmountValidation), Validators.min(this.minAmountValidation)]);
    this.calculatorForm.controls.closingBalance.updateValueAndValidity();
    if (this.source === 'add-topup-refinance') {
      // re-load UDF by productId
      this.loanEntity = this.sharedService.getLoan();
      this.loanEntity.productId = this.selectedProduct.id;
      this.sharedService.setLoan(this.loanEntity);
    }

  }

  /**
   * createSimulationIndivForm
   */
  createSimulationIndivForm() {
    this.calculatorForm = this.formBuilder.group({
      calculatorType: [1, Validators.required],
      loanAmount: [0, Validators.required],
      repayment: [''],
      loanTerm: [null, Validators.required],
      termType: ['3', Validators.required],
      frequencyType: [''],
      fees: [''],
      issueDate: ['', Validators.required],
      initialPayment: ['', Validators.required],
      periodsDeferred: [0],
      periodsDeferredType: [this.selectedLoan.periodsDeferredType],
      vat: [0],
      apr: [0],
      closingBalance: [this.selectedLoan.openingBalance],
      openingBalance: [this.selectedLoan.openingBalance],
      frequency: [this.selectedLoan.paymentFreq, Validators.required],
      interestFrequency: [this.selectedLoan.interestFreq, Validators.required]
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minIssueDatevalue = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    // TODO
    this.calculatorForm.controls.issueDate.setValue(this.minIssueDatevalue);
    this.getInitialPaymentValue();
  }
  /**
   * createSimulationGrpForm
   */
  createSimulationGrpForm() {
    this.calculatorGrpForm = this.formBuilder.group({});
  }
  /**
   * getCustomerMembers
   * @param customer CustomerEntity
   */
  async getCustomerMembers(customer: CustomerEntity) {
    const customerRelationShip = new CustomerLinksRelationshipEntity();
    customerRelationShip.customerId = customer.id;
    customerRelationShip.category = AcmConstants.MEMBERS;
    await this.customerManagementService.findCustomerLinkRelationShip(customerRelationShip).subscribe(
      (data) => {
        this.customerMembers = data;
        for (let i = 0; i < this.customerMembers.length; i++) {
          this.schedulesGrp[i] = [];
          this.customerMembers[i].pageSize = 5;
          this.customerMembers[i].page = 1;
          this.calculatorGrpForm.addControl('loanAmount' + i, new FormControl(''));
          this.calculatorGrpForm.addControl('repayment' + i, new FormControl(''));
          this.calculatorGrpForm.addControl('loanTerm' + i, new FormControl(''));
          this.calculatorGrpForm.addControl('termType' + i, new FormControl('3'));
          this.calculatorGrpForm.addControl('fees' + i, new FormControl(''));
          this.calculatorGrpForm.addControl('initialPayment' + i, new FormControl(''));
          this.calculatorGrpForm.addControl('issueDate' + i, new FormControl(''));
          this.calculatorGrpForm.addControl('vat' + i, new FormControl('0'));
          this.calculatorGrpForm.addControl('apr' + i, new FormControl('0'));
          this.calculatorGrpForm.addControl('closingBalance' + i, new FormControl(''));
          this.calculatorGrpForm.addControl('periodsDeferred' + i, new FormControl('1'));
          this.calculatorGrpForm.addControl('periodsDeferredType' + i, new FormControl(''));
          this.checkCalculateGrp.push(true);
          this.aprGrp[i] = 0;
          this.irrGrp[i] = 0;
          this.minAmountValidationGrp.push(this.minAmountValidation);
          this.maxAmountValidationGrp.push(this.maxAmountValidation);
          this.minTermValidationGrp.push(this.minTermValidation);
          this.maxTermValidationGrp.push(this.maxTermValidation);
          this.aprGrpWitoutRound[i] = 0;
          this.irrGrpWithoutRound[i] = 0;
          this.issueFeeAmountGrp[i] = 0;
        }
      }
    );
  }
  /**
   * getMinMaxValueTerm
   */
  getMinMaxValueTerm() {
    // check on mnimum of loanAmount in setting topup of the product
    if (this.calculatorForm.value.loanAmount < this.selectedProduct.settingTopup.topupMinFixedLoanAmount) {
      this.devToolsServices.openToastWithParameter(3, 'error.topup_Min_Fixed_Loan_Amount_error',
        this.selectedProduct.settingTopup.topupMinFixedLoanAmount + ' ' + this.selectedProduct.currency);
    }
    this.calculateClosingBalance();
    this.amountTrouv = false;
    const termMin = [];
    const termMax = [];
    this.limitMinAmountValidation = false;
    this.limitMaxAmountValidation = false;
    if (this.calculatorForm.value.closingBalance === '' || this.calculatorForm.value.closingBalance === null) {
      this.resetValidation();
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      this.selectedProduct.productDetailsDTOs.forEach(element => {
         const valeurMaxAmount = this.enableBalance 
        ? Math.min(this.maxAmountValidation, element.maximumAmount) 
        : element.maximumAmount; 

        if ((this.calculatorForm.value.closingBalance >= element.minimumAmount
          && this.calculatorForm.value.closingBalance <= valeurMaxAmount)) {
          termMin.push(element.minimumTerm);
          termMax.push(element.maximumTerm);
          this.amountTrouv = true;
        }
      });
      if (this.amountTrouv) {
        this.minTermValidation = Math.min(...termMin);
        this.maxTermValidation = Math.max(...termMax);
        if (this.calculatorForm.value.loanTerm !== '') {
          if (
            this.calculatorForm.value.loanTerm < this.maxTermValidation) {
            this.calculatorForm.controls.loanTerm.clearValidators();
          } else {
            this.limitMinTermValidation = this.calculatorForm.value.loanTerm < this.minTermValidation;
            this.limitMaxTermValidation = this.calculatorForm.value.loanTerm > this.maxTermValidation;
            this.calculatorForm.controls.closingBalance.setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.calculatorForm.controls.closingBalance.value >= this.maxAmountValidation) {
          this.limitMaxAmountValidation = true;
        } else if (this.calculatorForm.controls.closingBalance.value <= this.minAmountValidation) {
          this.limitMinAmountValidation = true;
        }
        this.calculatorForm.controls.closingBalance.setErrors({ invalid: true, message: '' });
      }
    }


    

  }

  loanAmountModifier(product : ProductEntity,amount : number){
    this.selectedProduct = product;
    if (amount === 0) {
      this.sharedService.loan.loanAssetsDtos = [];
      this.currentAmount = 0;
      this.apportPersonnel = 0;
    }
    if ( this.selectedProduct.supplier){
      this.calculatorForm.controls.loanAmount.setValue(0);
      this.currentAmount = amount;
      this.updateApportPersonnel(this.apportPersonnel);
      this.getMinMaxValueTerm();
    }else {
      this.sharedService.loan.loanAssetsDtos = [];
      this.calculatorForm.controls.loanAmount.setValue(0);

    }
  }
  /**
   * calculateClosingBalance
   */
  calculateClosingBalance() {
    this.calculatorForm.controls.closingBalance.setValue(
      this.calculatorForm.value.loanAmount + this.selectedLoan.openingBalance
    );
    // check validity of closing balance
    this.calculatorForm.controls.closingBalance.clearValidators();
    this.calculatorForm.controls.closingBalance.setValidators([Validators.max(this.maxAmountValidation),
    Validators.min(this.minAmountValidation)]);
    this.calculatorForm.controls.closingBalance.updateValueAndValidity();
    // check if refinance or topup
    if (this.calculatorForm.value.loanAmount !== 0) {
      this.topupRefinance = false;
    } else {
      this.topupRefinance = true;
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
    this.calculatorForm.controls.closingBalance.clearValidators();
    if (this.calculatorForm.controls.closingBalance.value === null) {
      this.calculatorForm.controls.closingBalance.setErrors({ invalid: true, message: '' });
      this.limitMinAmountValidation = true;
    }
    this.minAmountValidation = Math.min(...amountMin);
    this.maxAmountValidation = Math.max(...amountMax);
    this.calculatorForm.controls.loanTerm.clearValidators();
    if (this.calculatorForm.controls.loanTerm.value === null) {
      this.calculatorForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
      this.limitMinTermValidation = true;
    }
    this.minTermValidation = Math.min(...termMin);
    this.maxTermValidation = Math.max(...termMax);
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
    if (this.calculatorForm.value.loanTerm === '' || this.calculatorForm.value.loanTerm === null) {
      this.resetValidation();
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      this.selectedProduct.productDetailsDTOs.forEach(element => {
         const valeurMaxAmount = this.enableBalance 
        ? Math.min(this.maxAmountValidation, element.maximumAmount) 
        : element.maximumAmount; 

        if ((this.calculatorForm.value.loanTerm >= element.minimumTerm
          && this.calculatorForm.value.loanTerm <= element.maximumTerm)) {
          amountMin.push(element.minimumAmount);
          amountMax.push(valeurMaxAmount);
          this.termTrouv = true;
        }
      });
      if (this.termTrouv) {
        this.minAmountValidation = Math.min(...amountMin);
        this.maxAmountValidation = Math.max(...amountMax);
        if (this.calculatorForm.value.closingBalance !== '') {
          if (this.calculatorForm.value.closingBalance >= this.minAmountValidation &&
            this.calculatorForm.value.closingBalance <= this.maxAmountValidation) {
            const amountForm = this.calculatorForm.value.closingBalance;
            this.calculatorForm.controls.closingBalance.reset();
            this.calculatorForm.controls.closingBalance.setValue(amountForm);
            this.limitMinAmountValidation = false;
            this.limitMaxAmountValidation = false;
          } else {
            this.limitMinAmountValidation = this.calculatorForm.value.closingBalance < this.minAmountValidation;
            this.limitMaxAmountValidation = this.calculatorForm.value.closingBalance > this.maxAmountValidation;
            this.calculatorForm.controls.closingBalance.setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.calculatorForm.controls.loanTerm.value > this.maxTermValidation) {
          this.limitMaxTermValidation = true;
        } else if (this.calculatorForm.controls.loanTerm.value < this.minTermValidation) {
          this.limitMinTermValidation = true;
        }
        this.calculatorForm.controls.loanTerm.setErrors({ invalid: true, message: '' });
      }
    }
  }
  /**
   * getInitialPaymentValue() : First repayment is 30 after issue date/ In case of frequency activated it will be X frequency month + issue date
   */
  getInitialPaymentValue() {
    if (this.datePipe.transform(this.loanEntity.issueDate, 'yyyy-MM-dd') !== this.calculatorForm.controls.issueDate.value) {
      this.checkCalculate = true;
    }
    const issueDate1: Date = new Date(this.calculatorForm.controls.issueDate.value);
    const initialPayment = issueDate1;
    if (this.selectedProduct.isFrequency) {
      initialPayment.setMonth(issueDate1.getMonth() + (this.calculatorForm.controls.interestFrequency.value));
    } else {
      initialPayment.setDate(issueDate1.getDate() + 30);
    }    this.calculatorForm.controls.initialPayment.setValue(this.datePipe.transform(initialPayment, 'yyyy-MM-dd'));
  }

  async calculate(resetSchedule : boolean) {

    this.loanFormDetailsTouched.emit(true);
    this.requiredCalculate.emit(true);
    if (!this.loanDetailsValidity || !this.calculatorForm.valid) {
      this.devToolsServices.openToast(3, 'alert.check-data');
      this.devToolsServices.backTop();
      return;
    }
    if (this.selectedProduct.topup) {
      if (this.calculatorForm.controls.loanAmount.value === 0) {
        this.devToolsServices.openToast(3, 'In case of Topup, the loan Amount should be greater than 0');
        return;
      }
    }
    if (this.selectedProduct.refinance && !this.selectedProduct.topup) {
      if (this.calculatorForm.controls.loanAmount.value !== 0) {
        this.devToolsServices.openToast(3, 'In case of Refinance, the loan amount should not be greater than 0');
        return;
      }
    }
    if ((this.customer.customerType !== AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY)
      && (this.calculatorForm.valid)) {
      if (!this.checkIssueDate() || !this.checkDeferredPeriod()) {
        return;
      }
    }
    if (!this.selectedProduct.isFrequencyWithDeferredPeriode) {
      if (this.calculatorForm.controls.periodsDeferred.value !== 0  &&
       this.calculatorForm.controls.frequency.value !== 1) {
        this.devToolsServices.openToast(3, 'alert.error_frequency_with_deferred_periode');
        return;
       }
    }
    if (this.selectedProduct.isFrequency) {
    const periodsDeferred = this.calculatorForm.controls.periodsDeferred.value;
    const loanTerm = this.calculatorForm.controls.loanTerm.value;
    const frequency = this.calculatorForm.controls.frequency.value;
    const interestFrequency = this.calculatorForm.controls.interestFrequency.value;
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
    // TEST VALID for All cases
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      // if the renewal condition feature is activate and the customer have a renewal condition setting
      if (this.renewelLoanCondition && this.activeRenewalConditionSetting) {
        if (this.calculatorForm.controls.closingBalance.value < this.minAmountValidation) {
          this.devToolsServices.openToast(3, 'alert.check_renewal_setting');
          return;
        }
        if (this.calculatorForm.controls.closingBalance.value > this.maximumAllowedAmount) {
          this.devToolsServices.openToastWithParameter(3, 'alert.max_allowed_amount', String(this.maximumAllowedAmount));
          this.calculatorForm.controls.closingBalance.clearValidators();
          this.calculatorForm.controls.closingBalance.setValidators([Validators.required, Validators.max(this.maximumAllowedAmount)]);
          this.calculatorForm.controls.closingBalance.updateValueAndValidity();
          this.calculatorForm.controls.closingBalance.markAsTouched();
          return;
        }
      }
    }
    this.checkMinMaxAmountTermCalculate();
    if (this.calculatorForm.valid && this.loanDetailsValidity && (this.amountTrouv || this.termTrouv)) {
      this.loadingCalcule = true;
      if (this.selectedProduct.flatInterestRate !== 0) {
        this.loanEntity.productRate = this.effectiveInterestRateStandard;
      } else {
        this.loanEntity.productRate =this.selectedProduct.rate ;
      }
      this.selectedLoan.personalContribution = this.apportPersonnel;
      this.loanEntity.productId = this.selectedProduct.id;
      this.loanEntity.loanCalculationMode = 0;
      // calculaion based on closing balance
      this.loanEntity.approvelAmount = this.calculatorForm.controls.closingBalance.value;
      this.loanEntity.applyAmountTotal = this.calculatorForm.controls.closingBalance.value;
      this.loanEntity.issueDate = this.calculatorForm.controls.issueDate.value;
      this.loanEntity.initialPaymentDate = this.calculatorForm.controls.initialPayment.value;
      this.loanEntity.normalPayment = this.calculatorForm.controls.repayment.value;
      this.loanEntity.termPeriodNum = this.calculatorForm.controls.loanTerm.value;
      this.loanEntity.paymentFreq = this.calculatorForm.controls.frequency.value;
      this.loanEntity.interestFreq = this.calculatorForm.controls.interestFrequency.value;
      this.loanEntity.termPeriodID = this.calculatorForm.controls.termType.value;
      this.loanEntity.periodsDeferred = this.calculatorForm.controls.periodsDeferred.value;
      this.loanEntity.periodsDeferredType = this.calculatorForm.controls.periodsDeferredType.value;
      this.loanEntity.apr = this.calculatorForm.controls.apr.value;
      this.loanEntity.productDTO = this.selectedProduct;
      this.loanEntity.personalContribution = this.apportPersonnel;
      this.loanEntity.customerDTO = this.sharedService.getCustomer();
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
        const interest = this.calculatorForm.value.product.flatInterestRate / 100;
        const loanAmount = this.calculatorForm.controls.loanAmount.value;
        const loanTerm = this.calculatorForm.controls.loanTerm.value;
        const loanRepayment = loanAmount * ((interest / 12) + (1 / loanTerm));

        this.calculatorForm.controls.repayment.setValue(Math.floor(loanRepayment));

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
            this.calculatorForm.controls.initialPayment.setValue(this.datePipe.transform(dateResult, 'yyyy-MM-dd', timeZone));
          }
          this.lastLine = this.schedules[this.schedules.length - 1];
          this.totalInterest.emit(Number(this.lastLine.interestRepayment));

          this.loadingCalcule = false;
          this.checkCalculate = false;
          if (this.source === 'loan-approval' || this.source === 'change-data') {
            this.updateLoanAbacus = true;
          }
        });
      }
    }
  }
  /**
   * Update data
   */
  updateDataIndiv(data: LoanCalculateEntity) {
    let decimal = 1;
    if (this.selectedProduct.decimal !== null || this.selectedProduct.decimal !== undefined || this.selectedProduct.decimal !== 0) {
      decimal = Math.pow(10, this.selectedProduct.decimal);
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
        this.calculatorForm.controls.repayment.setValue(Math.ceil((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.calculatorForm.controls.vat.setValue(Math.ceil((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calculatorForm.controls.apr.setValue(data.apr);
        this.calculatorForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.ceil(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      case AcmConstants.ROUND_DOWN:
        this.calculatorForm.controls.repayment.setValue(Math.floor((data.normalPayment + Number.EPSILON)
          * decimal) / decimal);
        this.calculatorForm.controls.vat.setValue(Math.floor((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calculatorForm.controls.apr.setValue(data.apr);
        this.calculatorForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.floor(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      case AcmConstants.ROUND:
        this.calculatorForm.controls.repayment.setValue(Math.round((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.calculatorForm.controls.vat.setValue(Math.round((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calculatorForm.controls.apr.setValue(data.apr);
        this.calculatorForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.round(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      default:
        this.calculatorForm.controls.repayment.setValue(data.normalPayment);
        this.calculatorForm.controls.vat.setValue(data.insurancePremium);
        this.calculatorForm.controls.apr.setValue(data.apr);
        this.calculatorForm.controls.fees.setValue(
          this.sharedService.useExternalCBS === '1' ? feeAmout1 + feeAmout2 : data?.acmIssueFee);
        break;
    }
    this.irr = Math.round((data.effectiveInterestRate + Number.EPSILON) * 100) / 100;
    this.apr = Math.round((data.apr + Number.EPSILON) * 100) / 100;
    this.irrWithoutRound = data.effectiveInterestRate;
    this.aprWithoutRound = data.apr;
    if (this.sharedService.useExternalCBS === '1') {
      this.issueFeeAmount = feeAmout1 + feeAmout2;
    }
    else {
      this.issueFeeAmount = data?.acmIssueFee;
    }
    if (this.selectedProduct.flatInterestRate !== 0) {
      this.effectiveInterestRateStandard = data.interestRate;
    }

  }
  /**
   *
   */
  checkMinMaxAmountTermCalculate() {
    this.termTrouv = false;
    this.amountTrouv = false;
    this.selectedProduct.productDetailsDTOs.forEach(element => {
      if ((this.calculatorForm.value.loanAmount >= element.minimumAmount
        && this.calculatorForm.value.loanAmount <= element.maximumAmount)
        && (this.calculatorForm.value.loanTerm >= element.minimumTerm &&
          this.calculatorForm.value.loanTerm <= element.maximumTerm)) {
        this.termTrouv = true;
        this.amountTrouv = true;
      }
    });
    if (!this.termTrouv && !this.amountTrouv) {
      this.resetValidation();
    }
  }
  /**
   * checkIssueDate
   */
  checkIssueDate() {
    const issueDate: Date = new Date(this.calculatorForm.controls.issueDate.value);
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
   * checkDeferredPeriod
   */
  checkDeferredPeriod() {
    this.limitMaxPeriodsValidation = false;
    this.limitMinPeriodsValidation = false;
    const periodsDeferred: number = this.calculatorForm.controls.periodsDeferred.value;
    if (periodsDeferred < this.selectedProduct.minimumDeferredPeriod ||
      periodsDeferred > this.selectedProduct.maximumDeferredPeriod) {
      if (this.calculatorForm.controls.periodsDeferred.value > this.maxPeriodsValidation) {
        this.limitMaxPeriodsValidation = true;
      } else if (this.calculatorForm.controls.periodsDeferred.value < this.minPeriodsValidation) {
        this.limitMinPeriodsValidation = true;
      }
      this.calculatorForm.controls.periodsDeferred.setErrors({ invalid: true, message: '' });
      return false;
    } else {
      const periodsDeferredForm = this.calculatorForm.controls.periodsDeferred.value;
      this.calculatorForm.controls.periodsDeferred.reset();
      this.calculatorForm.controls.periodsDeferred.setValue(periodsDeferredForm);
      return true;
    }
  }
  /**
   * changeFormLoan
   */
  changeFormLoan() {
    this.checkCalculate = true;
  }
  /**
   * checkValidityForApproval
   */
  async checkValidityForApproval() {
    const loanForApproval = new LoanEntity();
    loanForApproval.approvelAmount = this.calculatorForm.controls.loanAmount.value;
    loanForApproval.applyAmountTotal = this.calculatorForm.controls.loanAmount.value;
    loanForApproval.issueDate = this.calculatorForm.controls.issueDate.value;
    loanForApproval.initialPaymentDate = this.calculatorForm.controls.initialPayment.value;
    loanForApproval.normalPayment = this.calculatorForm.controls.repayment.value;
    loanForApproval.termPeriodNum = this.calculatorForm.controls.loanTerm.value;
    loanForApproval.paymentFreq = this.calculatorForm.controls.frequency.value;
    loanForApproval.interestFreq = this.calculatorForm.controls.interestFrequency.value;
    loanForApproval.termPeriodID = this.calculatorForm.controls.termType.value;
    loanForApproval.periodsDeferred = this.calculatorForm.controls.periodsDeferred.value;
    loanForApproval.periodsDeferredType = this.calculatorForm.controls.periodsDeferredType.value;
    loanForApproval.productRate = this.effectiveInterestRateStandard;
    loanForApproval.apr = this.aprWithoutRound;
    loanForApproval.effectiveIntRate = this.irrWithoutRound;
    if (this.sharedService.useExternalCBS === '1') {
      loanForApproval.issueFeeAmount = this.issueFeeAmount;
    }
    else {
      loanForApproval.acmIssueFees = this.issueFeeAmount;
    }
    loanForApproval.updateLoanAbacus = this.updateLoanAbacus;
    // !emit the output to the parents components (LoanApprovalComponent,CustomerDecisionComponent,UploadSignedAgreementComponent)
    // * checkCalculate to check calculate button, loanForApproval : loan object with updated fields,
    // * renewelLoanCondition : to check if the functionality is active
    // * acceptedException :to check if the customer has an exception in progress
    this.validateLoanApproval.emit([this.checkCalculate, loanForApproval, this.renewelLoanCondition, this.acceptedException]);
  }
  toggleCollapseLoanSimulation() {
    this.expandedLoanSimulation = !this.expandedLoanSimulation;
  }

  /**
   * setRenewalAmount
   */
  setRenewalAmount() {
    // if there is renewal condition setting
    if (this.customerRenewalCondition !== null && Object.keys(this.customerRenewalCondition).length !== 0) {
      // *update the closing balance field only in add new topup
      if (this.source === 'add-topup-refinance') {
        if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
          for (let i = 0; i < this.customerMembers.length; i++) {
            this.calculatorGrpForm.controls['closingBalance' + i].setValue('');
          }
        } else {
          this.calculatorForm.controls.closingBalance.setValue('');
        }
      }

      // check if there is an accepted request for this product
      if (this.acceptedException) {
        // the renewal amount will be the requested amount
        // determinate the min between the requested amount and the maximum product
        this.maximumAllowedAmount = Math.min(this.acceptedExceptionRequest.requestedAmount,
          this.selectedProduct.productDetailsDTOs[0].maximumAmount);
      } else {
        // calculate renewal amount based on percentage
        // ?renewal amount => (lastLoanAmout + lastLoanAmount*RenewalConditionPercentage ),
        if (this.selectedProduct.productDetailsDTOs && this.selectedProduct.productDetailsDTOs.length > 0) {
          const renewalAmount =
          this.customerRenewalCondition.lastLoanAmount * ((this.customerRenewalCondition.renewalConditionDTO.pourcentage / 100) + 1);
        // determinate maximum allowed amount => Min(Maximum Product Amount, Calculated Renewal Amount)
        this.maximumAllowedAmount = Math.min(renewalAmount, this.selectedProduct.productDetailsDTOs[0].maximumAmount);
        }
      }
      // *update the closing balance field only in add new topup
      if (this.source === 'add-topup-refinance') {
        // set the new loan amount
        if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
          for (let i = 0; i < this.customerMembers.length; i++) {
            this.calculatorGrpForm.controls['closingBalance' + i].setValue(this.maximumAllowedAmount);
          }
        } else {
          this.calculatorForm.controls.closingBalance.setValue(this.maximumAllowedAmount);
        }
      }
    }
  }
  /**
   * requestExceptionModal
   * @param renewalModalContent NgbModal
   */
  openRequestExceptionModal(renewalModalContent) {
    this.loanFormDetailsTouched.emit(true);

    // check if there is an active exception for this product
    if (this.activeException || this.acceptedException) {
      this.devToolsServices.openToast(3, 'alert.exception_request_in_progress');
      return;
    }

    if (!this.loanDetailsValidity || !this.calculatorForm.valid) {
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
      requestedAmount: ['', [Validators.required, Validators.min(this.maximumAllowedAmount)]],
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
   * checkActiveException
   */
  async checkNewOrAccpetedException() {
    const renewalExceptionRequest = new ExceptionRequestEntity();
    renewalExceptionRequest.customerId = this.customer.id;
    // 0: NEW 1: ACCEPTED
    renewalExceptionRequest.listStatut = [AcmConstants.NEW_STATUT_REQUEST, AcmConstants.ACCEPTED_STATUT_REQUEST];
    await this.exceptionRequestService.findExceptionRequest(renewalExceptionRequest).subscribe((data) => {
      data.forEach(element => {
        if (element.statut === AcmConstants.NEW_STATUT_REQUEST) {
          this.activeException = true;
        } else if (element.statut === AcmConstants.ACCEPTED_STATUT_REQUEST) {
          this.acceptedException = true;
          this.acceptedExceptionRequest = element;
        }
      });
    });
  }
  async getConnectedUser() {

    if (checkOfflineMode() && false) {
      console.log('canActivate - calculator');
      const user = JSON.parse(sessionStorage.getItem('currentUser'))
      this.currentUser = user;
    } else {
      await this.authService.curentUser().subscribe((user) => {
        this.currentUser = user;
      });
    }
  }

  getDirection() {
    return AppComponent.direction;
  }
  toggleCollapseLoanSchedule() {
    this.expandedLoanSchedule = !this.expandedLoanSchedule;
  }
  downloadSchedule(schedules) {
    const loanScheduleEntity = new LoanScheduleEntity();
    loanScheduleEntity.scheduleDTOs = schedules;
    loanScheduleEntity.loanDTO = this.selectedLoan;
    const loan = new LoanEntity();
    const customerEntity = new CustomerEntity();
    loan.customerNameNoPipe = this.customer.customerNameNoPipe;
    customerEntity.customerNumber = this.customer.customerNumber;
    loan.customerDTO = customerEntity
    loanScheduleEntity.loanDTO = loan;
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

  getMinMaxValueTermGrp(j) {
    this.amountTrouvGrp[j] = false;
    const termMin = [];
    const termMax = [];
    this.limitMinAmountValidationGrp[j] = false;
    this.limitMaxAmountValidationGrp[j] = false;
    if (this.calculatorGrpForm.controls['loanAmount' + j].value === '' ||
      this.calculatorGrpForm.controls['loanAmount' + j].value === null) {
      this.resetValidationGrp(j);
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      this.selectedProduct.productDetailsDTOs.forEach(element => {
        if (this.calculatorGrpForm.controls['loanAmount' + j].value >= element.minimumAmount
          && this.calculatorGrpForm.controls['loanAmount' + j].value <= element.maximumAmount) {
          termMin.push(element.minimumTerm);
          termMax.push(element.maximumTerm);
          this.amountTrouvGrp[j] = true;
        }
      });
      if (this.amountTrouvGrp[j]) {
        this.minTermValidationGrp[j] = Math.min(...termMin);
        this.maxTermValidationGrp[j] = Math.max(...termMax);
        if (this.calculatorGrpForm.value['loanTerm' + j] !== '') {
          if (this.calculatorGrpForm.value['loanTerm' + j] > this.minTermValidationGrp[j] &&
            this.calculatorGrpForm.value['loanTerm' + j] < this.maxTermValidationGrp[j]) {
            this.calculatorGrpForm.controls['loanTerm' + j].clearValidators();
          } else {
            this.limitMinTermValidationGrp[j] = this.calculatorGrpForm.value['loanTerm' + j] < this.minTermValidationGrp[j];
            this.limitMaxTermValidationGrp[j] = this.calculatorGrpForm.value['loanTerm' + j] > this.maxTermValidationGrp[j];
            this.calculatorGrpForm.controls['loanTerm' + j].setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.calculatorGrpForm.controls['loanAmount' + j].value >= this.maxAmountValidationGrp[j]) {
          this.limitMaxAmountValidationGrp[j] = true;
        } else if (this.calculatorGrpForm.controls['loanAmount' + j].value <= this.minAmountValidationGrp[j]) {
          this.limitMinAmountValidationGrp[j] = true;
        }
        this.calculatorGrpForm.controls['loanAmount' + j].setErrors({ invalid: true, message: '' });
      }
    }
  }
  resetValidationGrp(j) {
    const termMin = [];
    const termMax = [];
    const amountMin = [];
    const amountMax = [];
    this.selectedProduct.productDetailsDTOs.forEach(element => {
      termMin.push(element.minimumTerm);
      termMax.push(element.maximumTerm);
      amountMin.push(element.minimumAmount);
      amountMax.push(element.maximumAmount);
    });
    this.calculatorGrpForm.controls['loanAmount' + j].clearValidators();
    if (this.calculatorGrpForm.controls['loanAmount' + j].value === null) {
      this.calculatorGrpForm.controls['loanAmount' + j].setErrors({ invalid: true, message: '' });
      this.limitMinAmountValidationGrp[j] = true;
    }
    this.minAmountValidationGrp[j] = Math.min(...amountMin);
    this.maxAmountValidationGrp[j] = Math.max(...amountMax);
    this.calculatorGrpForm.controls['loanTerm' + j].clearValidators();
    if (this.calculatorGrpForm.controls['loanTerm' + j].value === null) {
      this.calculatorGrpForm.controls['loanTerm' + j].setErrors({ invalid: true, message: '' });
      this.limitMinTermValidationGrp[j] = true;
    }
    this.minTermValidationGrp[j] = Math.min(...termMin);
    this.maxTermValidationGrp[j] = Math.max(...termMax);
  }

  getInitialPaymentValueGrp(i: number) {
    const issueDate1: Date = new Date(this.calculatorGrpForm.controls['issueDate' + i].value);
    const initialPayment = issueDate1;
    initialPayment.setDate(issueDate1.getDate() + 30);
    this.calculatorGrpForm.controls['initialPayment' + i].setValue(this.datePipe.transform(initialPayment, 'yyyy-MM-dd'));
  }
  async calculateGrp(j: number) {
    this.loanFormDetailsTouched.emit(true);

    // this.checkMinMaxAmountTermCalculateGrp(j);
    if (!this.loanDetailsValidity || !this.calculatorGrpForm.valid) {
      this.devToolsServices.openToast(3, 'alert.check-data');
      this.devToolsServices.backTop();
      return;
    }
    if (this.calculatorGrpForm.valid && this.loanDetailsValidity && (this.amountTrouvGrp[j] || this.termTrouvGrp[j])) {
      this.checkCalculateGrp[j] = false;
      this.schedulesGrp[j] = [];
      this.loanEntity.customerDTO = this.sharedService.getCustomer();
      // load product by id
      this.loadingCalcule = true;
      this.loanEntity.productId = this.selectedProduct.id;
      this.loanEntity.loanCalculationMode = 0;
      this.loanEntity.approvelAmount = this.calculatorGrpForm.controls['loanAmount' + j].value;
      this.loanEntity.applyAmountTotal = this.calculatorGrpForm.controls['loanAmount' + j].value;
      this.loanEntity.issueDate = this.calculatorGrpForm.controls['issueDate' + j].value;
      this.loanEntity.initialPaymentDate = this.calculatorGrpForm.controls['initialPayment' + j].value;
      this.loanEntity.termPeriodNum = this.calculatorGrpForm.controls['loanTerm' + j].value;
      this.loanEntity.termPeriodID = this.calculatorGrpForm.controls['termType' + j].value;
      this.loanEntity.periodsDeferred = this.calculatorGrpForm.controls['periodsDeferred' + j].value;
      this.loanEntity.periodsDeferredType = this.calculatorGrpForm.controls['periodsDeferredType' + j].value;
      this.loanEntity.productDTO = this.selectedProduct;
      // call calculate Loan Schedules API
      await this.loanApprovalService.calculateLoanSchedules(this.loanEntity).toPromise().then(
        (data) => {
          data.loanSchedule.forEach(element => {
            this.schedulesGrp[j].push(element);
          });
          this.updateData(j, data);
          this.lastLineGrp = this.schedulesGrp[j][this.schedulesGrp[j].length - 1];
          this.loadingCalcule = false;
          this.totalInterest.emit(Number(this.lastLineGrp.interestRepayment));

        });
    }
  }
  updateData(j: number, data: LoanCalculateEntity) {
    let decimal = 1;
    if (this.selectedProduct.decimal !== null || this.selectedProduct.decimal !== undefined || this.selectedProduct.decimal !== 0) {
      decimal = Math.pow(10, this.selectedProduct.decimal);
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
        this.calculatorGrpForm.controls['repayment' + j].setValue(Math.ceil((data.normalPayment + Number.EPSILON)
          * decimal) / decimal);
        this.calculatorGrpForm.controls['vat' + j].setValue(Math.ceil((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.calculatorGrpForm.controls['apr' + j].setValue(data.apr);

        this.calculatorGrpForm.controls['closingBalance' + j].setValue(Math.ceil((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);
        this.calculatorGrpForm.controls['fees' + j].setValue(Math.ceil(((feeAmout1 + feeAmout2)
          + Number.EPSILON) * decimal) / decimal);
        break;
      case AcmConstants.ROUND_DOWN:
        this.calculatorGrpForm.controls['repayment' + j].setValue(Math.floor((data.normalPayment + Number.EPSILON)
          * decimal) / decimal);
        this.calculatorGrpForm.controls['vat' + j].setValue(Math.floor((data.insurancePremium + Number.EPSILON)
          * decimal) / decimal);
        this.calculatorGrpForm.controls['apr' + j].setValue(data.apr);

        this.calculatorGrpForm.controls['closingBalance' + j].setValue(Math.floor((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);
        this.calculatorGrpForm.controls['fees' + j].setValue(Math.floor(((feeAmout1 + feeAmout2)
          + Number.EPSILON) * decimal) / decimal);
        break;
      case AcmConstants.ROUND:
        this.calculatorGrpForm.controls['repayment' + j].setValue(Math.round((data.normalPayment + Number.EPSILON)
          * decimal) / decimal);
        this.calculatorGrpForm.controls['vat' + j].setValue(Math.round((data.insurancePremium + Number.EPSILON)
          * decimal) / decimal);
        this.calculatorGrpForm.controls['apr' + j].setValue(data.apr);

        this.calculatorGrpForm.controls['closingBalance' + j].setValue(Math.round((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);
        this.calculatorGrpForm.controls['fees' + j].setValue(Math.round(((feeAmout1 + feeAmout2)
          + Number.EPSILON) * decimal) / decimal);
        break;
      default:
        this.calculatorGrpForm.controls['repayment' + j].setValue(data.normalPayment);
        this.calculatorGrpForm.controls['vat' + j].setValue(data.insurancePremium);
        this.calculatorGrpForm.controls['apr' + j].setValue(data.apr);
        this.calculatorGrpForm.controls['closingBalance' + j].setValue(data.issueAmount);
        this.calculatorGrpForm.controls['fees' + j].setValue(feeAmout1 + feeAmout2);
        break;
    }
    this.irrGrp[j] = Math.round((data.effectiveInterestRate + Number.EPSILON) * 100) / 100;
    this.aprGrp[j] = Math.round((data.apr + Number.EPSILON) * 100) / 100;
    this.irrGrpWithoutRound[j] = data.effectiveInterestRate;
    this.aprGrpWitoutRound[j] = data.apr;
    this.issueFeeAmountGrp[j] = feeAmout1 + feeAmout2;
    if (this.selectedProduct.flatInterestRate !== 0) {
      this.effectiveInterestRateStandard = data.interestRate;
    }
  }
  getMinMaxValueAmountGrp(j) {
    this.termTrouvGrp[j] = false;
    const amountMin = [];
    const amountMax = [];
    this.limitMaxTermValidationGrp[j] = false;
    this.limitMinTermValidationGrp[j] = false;
    if (this.calculatorGrpForm.controls['loanTerm' + j].value === '' ||
      this.calculatorGrpForm.controls['loanTerm' + j].value === null) {
      this.resetValidationGrp(j);
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      this.selectedProduct.productDetailsDTOs.forEach(element => {
        if (this.calculatorGrpForm.controls['loanTerm' + j].value >= element.minimumTerm
          && this.calculatorGrpForm.controls['loanTerm' + j].value <= element.maximumTerm) {
          amountMin.push(element.minimumAmount);
          amountMax.push(element.maximumAmount);
          this.termTrouvGrp[j] = true;
        }
      });
      if (this.termTrouvGrp[j]) {
        this.minAmountValidationGrp[j] = Math.min(...amountMin);
        this.maxAmountValidationGrp[j] = Math.max(...amountMax);
        if (this.calculatorGrpForm.value['loanAmount' + j] !== '') {
          if (this.calculatorGrpForm.value['loanAmount' + j] >= this.minAmountValidationGrp[j] &&
            this.calculatorGrpForm.value['loanAmount' + j] <= this.maxAmountValidationGrp[j]) {
            const amountForm = this.calculatorGrpForm.value['loanAmount' + j];
            this.calculatorGrpForm.controls['loanAmount' + j].reset();
            this.calculatorGrpForm.controls['loanAmount' + j].setValue(amountForm);
            this.limitMinAmountValidationGrp[j] = false;
            this.limitMaxAmountValidationGrp[j] = false;
          } else {
            this.limitMinAmountValidation = this.calculatorGrpForm.value['loanAmount' + j] < this.minAmountValidationGrp[j];
            this.limitMaxAmountValidation = this.calculatorGrpForm.value['loanAmount' + j] > this.maxAmountValidationGrp[j];
            this.calculatorGrpForm.controls['loanAmount' + j].setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.calculatorGrpForm.controls['loanTerm' + j].value > this.maxTermValidationGrp[j]) {
          this.limitMaxTermValidationGrp[j] = true;
        } else if (this.calculatorGrpForm.controls['loanTerm' + j].value < this.minTermValidationGrp[j]) {
          this.limitMinTermValidationGrp[j] = true;
        }
        this.calculatorGrpForm.controls['loanTerm' + j].setErrors({ invalid: true, message: '' });
      }
    }
  }
  checkInitialPayment() {
    const issueDate1: Date = new Date(this.calculatorForm.controls.issueDate.value);
    issueDate1.setHours(0, 0, 0, 0);
    const initialPayment: Date = new Date(this.calculatorForm.controls.initialPayment.value);
    initialPayment.setHours(0, 0, 0, 0);
    if (initialPayment > issueDate1) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.issue-payment');
      return false;
    }
  }

  checkInitialPaymentValue() {
    const issueDate1: Date = new Date(this.calculatorForm.controls.issueDate.value);
    const initialPayment: Date = new Date(this.calculatorForm.controls.initialPayment.value);
    const utc1 = Date.UTC(issueDate1.getFullYear(), issueDate1.getMonth(), issueDate1.getDate());
    const utc2 = Date.UTC(initialPayment.getFullYear(), initialPayment.getMonth(), initialPayment.getDate());
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  }
  checkIssueDateGrp(indexMember: number) {
    const issueDate: Date = new Date(this.calculatorGrpForm.controls['issueDate' + indexMember].value);
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

  checkInitialPaymentGrp(indexMember: number) {
    const issueDate1: Date = new Date(this.calculatorGrpForm.controls['issueDate' + indexMember].value);
    issueDate1.setDate(issueDate1.getDate() + 1);
    issueDate1.setHours(0, 0, 0, 0);
    const initialPayment: Date = new Date(this.calculatorGrpForm.controls['initialPayment' + indexMember].value);
    initialPayment.setHours(0, 0, 0, 0);
    if (initialPayment >= issueDate1) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.issue-payment');
      return false;
    }
  }

  checkDeferredPeriodGrp(indexMember: number) {
    const periodsDeferred: number = this.calculatorGrpForm.controls['periodsDeferred' + indexMember].value;
    if (periodsDeferred < this.selectedProduct.minimumDeferredPeriod ||
      periodsDeferred > this.selectedProduct.maximumDeferredPeriod) {
      this.devToolsServices.openToast(3, 'alert.error-periods-deferred');
      return false;
    } else {
      return true;
    }
  }
  compareFrequency(d1, d2) {
    return d1 === d2;
  }
  updateApportPersonnel(value: number) {
    this.apportPersonnel = value;
    this.calculatorForm.get("loanAmount").setValue(this.currentAmount - this.apportPersonnel);
    this.getMinMaxValueTerm();
  }
  scheduleFlexibleChecked(event) {
    const check = event.target as HTMLInputElement;
    this.scheduleFlexibleIsChecked = check.checked;
  }
}
