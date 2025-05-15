import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';
import { ProductLoanReasonEntity } from 'src/app/shared/Entities/productLoanReason.entity';
import { LoanSourceOfFundsEntity } from 'src/app/shared/Entities/loanSourceOfFunds.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { DatePipe } from '@angular/common';
import { RenewalConditionLoanEntity } from 'src/app/shared/Entities/renewalConditionLoan.entity';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { UdfComponent } from '../../udf/udf.component';
import { LoanManagementService } from '../loan-management.service';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { LoanApprovalService } from '../../loan-approval/loan-approval.service';
import { CustomerManagementService } from 'src/app/AcmPages/Customer/customer-management/customer-management.service';
import { ExceptionRequestService } from '../../dashbord/exception-request/exception-request.service';
import { TopupRefinanceService } from './topup-refinance.service';
import { CalculatorComponent } from '../calculator/calculator.component';
import {customRequiredValidator} from '../../../../shared/utils';
import { AssetLoanEntity } from 'src/app/shared/Entities/AssetLoan.entity';
@Component({
  selector: 'app-topup-refinance',
  templateUrl: './topup-refinance.component.html',
  styleUrls: ['./topup-refinance.component.sass']
})
export class TopupRefinanceComponent implements OnInit {
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
  public schedulesGrp: ScheduleEntity[][] = [];
  public page: number;
  public pageSize: number;
  public decimalPlaces: string;
  public methodeCalculeGrp: string[] = [];
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
  @Input() selectedLoan: LoanEntity;
  public currentPath = AcmConstants.LOAN_DETAIL_URL;
  public selectedPorfolio: UserEntity = new UserEntity();
  public selectedProduct: ProductEntity = new ProductEntity();
  public customerMembers: CustomerLinksRelationshipEntity[] = [];
  public showScheduleGrp = true;
  public currencySymbol = '';
  public minAmount = 0;
  public maxAmount = 0;
  public minTerm = 0;
  public maxTerm = 0;
  public amountTrouv = false;
  public termTrouv = false;
  public amountTrouvGrp: boolean[] = [];
  public termTrouvGrp: boolean[] = [];
  public apr = 0;
  public irr = 0;
  public aprGrp: number[] = [0];
  public irrGrp: number[] = [0];
  public aprWithoutRound = 0;
  public irrWithoutRound = 0;
  public aprGrpWitoutRound: number[] = [0];
  public irrGrpWithoutRound: number[] = [0];
  public issueFeeAmount = 0;
  public issueFeeAmountGrp: number[] = [0];
  updateId = 0;
  @Input() completeLoanData;
  @Input() mode;
  // @Input() loanEntity : LoanEntity;
  @ViewChild(UdfComponent, { static: true }) childcomp: UdfComponent;
  @ViewChild(CalculatorComponent, { static: true }) calculatorComp: CalculatorComponent;
  public selectedLoanReason: ProductLoanReasonEntity = new ProductLoanReasonEntity();
  public validateAge: boolean;
  public checkCalculate = true;
  public checkCalculateGrp: boolean[] = [];
  public customerActiveAccount = 0;
  public effectiveInterestRateStandard = 0;
  public minIssueDatevalue: string;
  public lastLine: ScheduleEntity;
  public lastLineGrp: ScheduleEntity;
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
  public minAmountValidationGrp = [];
  public maxAmountValidationGrp = [];
  public minTermValidationGrp = [];
  public maxTermValidationGrp = [];
  public minPeriodsValidationGrp = [];
  public maxPeriodsValidationGrp = [];
  public limitMinAmountValidationGrp = [];
  public limitMaxAmountValidationGrp = [];
  public limitMinTermValidationGrp = [];
  public limitMaxTermValidationGrp = [];
  public limitMinPeriodsValidationGrp = [];
  public limitMaxPeriodsValidationGrp = [];
  public renewelLoanCondition = false;
  public customerRenewalCondition: RenewalConditionLoanEntity = new RenewalConditionLoanEntity();
  public maximumAllowedAmount: number;
  public activeException = false;
  public acceptedException = false;
  public newExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public acceptedExceptionRequest: ExceptionRequestEntity = new ExceptionRequestEntity();
  public currentUser: UserEntity;
  public feeAmount: number;
  public topupRefinance = true;
  public openBalance: number;

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
   * @param datePipe DatePipe
   * @param modalService NgbModal
   * @param translate TranslateService
   * @param authService AuthentificationService
   * @param exceptionRequestService ExceptionRequestService
   * @param dateFormatterService DateFormatterService
   * @param route ActivatedRoute
   * @param topUpRefinanceService TopupRefinanceService
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
              public authService: AuthentificationService,
              public exceptionRequestService: ExceptionRequestService,
              public dateFormatterService: DateFormatterService,
              public route: ActivatedRoute,
              public topUpRefinanceService: TopupRefinanceService) {
  }

  async ngOnInit() {
    if (this.completeLoanData === undefined) {
      this.completeLoanData = true;
    }
    this.selectedLoan = this.sharedService.getLoan();
    this.schedules.length = 0;
    this.pageSize = 5;
    this.page = 1;
    this.customer = this.sharedService.getCustomer();
    this.getAccountPortfolios();
    this.getProductLoanReason();
    this.getLoanSourceOfFundss();
    this.getProducts();
    await this.createForm();
  }
  /**
   *
   * update age
   */
   updateAge(): number {
       const [day, month, year] = this.calculatorComp.schedules[this.calculatorComp.schedules.length - 2].repaymentDate.split('/');
       const dateConvert = [year, month, day].join('/');
       const dateEndLoan = new Date(dateConvert);
       const bdate = new Date(this.customer.dateOfBirth);
       const timeDiff = Math.abs(dateEndLoan.getTime() - bdate.getTime() );
       return  Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
  }
  /**
   * create form
   */
  createForm() {
       // Get portfolio loan object
     const portfolio = new UserEntity();
     portfolio.accountPortfolioId = this.selectedLoan.portfolioId;
     portfolio.login = this.selectedLoan.owner;
     portfolio.fullName = this.selectedLoan.ownerName;
     portfolio.simpleName = this.selectedLoan.ownerName;
      // Get sourceOfFunds object
     const sourceOfFunds = new LoanSourceOfFundsEntity();
     sourceOfFunds.loanSourceOfFundsID = this.selectedLoan.sourceOfFundsID;
     this.addLoanForm = this.formBuilder.group({
      accountPortfolio: [portfolio],
      loanReason: [this.selectedLoanReason, customRequiredValidator],
      sourceOfFunds: [sourceOfFunds, customRequiredValidator],
      product: ['', customRequiredValidator] 
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
   * load account portfolios of branch
   */
  getAccountPortfolios() {
    const userEntity: UserEntity = new UserEntity();
    userEntity.branchID = this.customer.branchId;
    this.loanManagementService.findAllPortfolio(userEntity).subscribe(
      (data) => {
        this.accountPortfolios = data;
        this.accountPortfolios.forEach((portfolio) => {
          if (portfolio.accountPortfolioId === this.customer.accountPortfolioID) {
            this.addLoanForm.controls.accountPortfolio.setValue(portfolio);
          }
        });
      }
    );
  }
  /**
   * load loan product reason
   */
  async getProductLoanReason() {
    await this.loanManagementService.getProductLoanReason().subscribe(
      (data) => {
        this.productLoanReasons = data;
        this.productLoanReasons.forEach(loanReasonElement => { 
            if (loanReasonElement.code === this.selectedLoan.loanReasonCode) {
              this.selectedLoanReason.code = loanReasonElement.code;
              this.selectedLoanReason.loanReasonID = loanReasonElement.loanReasonID;
              this.selectedLoanReason.description = loanReasonElement.description;
              this.addLoanForm.controls.loanReason.setValue(this.selectedLoanReason);
            }
          });
      }
    );
  }

  /**
   * load source of fundss
   */
  getLoanSourceOfFundss() {
    this.loanManagementService.getLoanSourceOfFunds().subscribe(
      (data) => {
        this.sourceOfFundss = data;
      }
    );
  }

  /**
   * load products
   */
  getProducts() {
    const productEntity = new ProductEntity();
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      productEntity.productGrp = true;
      productEntity.productIndiv = false;
      productEntity.productOrg = false;
    } else if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      productEntity.productIndiv = true;
      productEntity.productGrp = false;
      productEntity.productOrg = false;
    } else if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      productEntity.productOrg = true;
      productEntity.productGrp = false;
      productEntity.productIndiv = false;
    }
    this.loanManagementService.getProducts(productEntity).subscribe(
      (data) => {
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
              this.addLoanForm.controls.product.setValue(product);
              this.selectedProduct = product;
            }
          });

        this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.products[0].acmCurrency.decimalPlaces);
        this.currencySymbol = this.products[0].acmCurrency.symbol;
      }
    );
  }
  /**
   * toggle Loan Details card
   */
  toggleCollapseLoanDetails() {
    this.expandedLoanDetails = !this.expandedLoanDetails;
  }

  /**
   * get Requirement from selected product for grp
   */
  async getProductRequirement() {
    if (this.addLoanForm.value.product !== '') {
      this.selectedProduct = this.addLoanForm.value.product;
      this.minPeriodsValidation = this.selectedProduct.minimumDeferredPeriod;
      this.maxPeriodsValidation = this.selectedProduct.maximumDeferredPeriod;
      if ( !this.selectedProduct.supplier){
        this.sharedService.loan.loanAssetsDtos = [];
      }
      this.calculatorComp.loanAmountModifier(this.addLoanForm.value.product,0);
      // check active account for all product expect the product of the issued loan
      if (this.selectedProduct.id !== this.selectedLoan.productId) {
        this.loanManagementService.getCustomerActiveAccount(this.customer.customerIdExtern, this.selectedProduct.productIdAbacus).subscribe(
          (customerActiveAccount) => {
            this.customerActiveAccount = customerActiveAccount;
            if (customerActiveAccount >= this.selectedProduct.maxAccounts) {
              this.devToolsServices.openToast(3, 'alert.customer_active_account_limit');
            }
          }
        );
        }
        this.checkCalculate = true;
    }
  }

  /**
   * Methode to onSubmit save loan after validation
   */
  submitLoan() {
    if (this.calculatorComp.renewelLoanCondition && this.calculatorComp.activeException) {
      this.devToolsServices.openToast(3, 'alert.exception_request_in_progress');
      return ;
    }
    this.addLoan();
  }
  /**
   * Methode to save
   */
  async addLoan() {
    this.validateForms();
    this.devToolsServices.makeFormAsTouched(this.addLoanForm);
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
        this.devToolsServices.makeFormAsTouched(this.calculatorComp.calculatorForm);
        if (this.calculatorComp.checkCalculate) {
          this.devToolsServices.openToast(3, 'alert.error-calculate');
          return;
        }
      } else if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
        this.devToolsServices.makeFormAsTouched(this.calculatorComp.calculatorGrpForm);
        this.checkCalculateGrp.forEach((checkCalculate) => {
          if (checkCalculate) {
            this.devToolsServices.openToast(3, 'alert.error-calculate');
            return;
          }
        });
      }
    if (this.addLoanForm.valid  ) {
        this.loanEntity = new LoanEntity();
        this.loanEntity.portfolioCode = this.addLoanForm.value.accountPortfolio.login;
        this.loanEntity.portfolioId = this.addLoanForm.value.accountPortfolio.accountPortfolioId;
        this.loanEntity.productId = this.addLoanForm.value.product.id;
        if (this.selectedProduct.flatInterestRate !== 0) {
          this.loanEntity.productRate = this.calculatorComp.effectiveInterestRateStandard;
        } else {
          this.loanEntity.productRate = this.addLoanForm.value.product.rate;
        }

        this.loanEntity.productDTO = this.addLoanForm.value.product;
        this.loanEntity.customerDTO = this.customer;
        this.loanEntity.branchID = this.customer.branchId;
        this.loanEntity.branchDescription = this.customer.branchesDescription;
        this.loanEntity.branchName = this.customer.branchesName;
        this.loanEntity.loanReasonCode = this.addLoanForm.value.loanReason.code;
        this.loanEntity.loanReasonId = this.addLoanForm.value.loanReason.loanReasonID;
        this.loanEntity.sourceOfFundsID = this.addLoanForm.value.sourceOfFunds.loanSourceOfFundsID;
        this.loanEntity.customerType = this.customer.customerType;
        this.loanEntity.industryCode = 3;
        this.loanEntity.districtCodeId = 0;
        if ((this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY)
          && (this.calculatorComp.calculatorGrpForm.valid)) {
          this.loans = [];
          this.loans.push(this.loanEntity);
          for (let i = 0; i < this.customerMembers.length; i++) {
            if (!this.calculatorComp.checkIssueDateGrp(i) || !this.calculatorComp.checkInitialPaymentGrp(i)
            || !this.calculatorComp.checkDeferredPeriodGrp(i)) {
              return;
            }
            this.schedulesGrp[i].length = 0;
            const loanMember = new LoanEntity();
            loanMember.loanCalculationMode = 0;
            loanMember.applyAmountTotal = this.calculatorComp.calculatorGrpForm.controls['loanAmount' + i].value;
            loanMember.approvelAmount = this.calculatorComp.calculatorGrpForm.controls['loanAmount' + i].value;
            loanMember.normalPayment = this.calculatorComp.calculatorGrpForm.controls['repayment' + i].value;
            loanMember.termPeriodNum = this.calculatorComp.calculatorGrpForm.controls['loanTerm' + i].value;
            loanMember.paymentFreq = this.calculatorComp.calculatorGrpForm.controls['frequency' + i].value;
            loanMember.issueDate = this.calculatorComp.calculatorGrpForm.controls['issueDate' + i].value;
            loanMember.initialPaymentDate = this.calculatorComp.calculatorGrpForm.controls['initialPayment' + i].value;
            loanMember.periodsDeferred = this.calculatorComp.calculatorGrpForm.controls['periodsDeferred' + i].value;
            loanMember.periodsDeferredType = this.calculatorComp.calculatorGrpForm.controls['periodsDeferredType' + i].value;
            loanMember.intPayPeriodNum = 1;
            loanMember.termPeriodID = this.calculatorComp.calculatorGrpForm.controls['termType' + i].value;
            loanMember.apr = this.aprGrpWitoutRound[i];
            loanMember.effectiveIntRate = this.irrGrpWithoutRound[i];
            loanMember.issueFeeAmount = this.issueFeeAmountGrp[i];
            // TODO IIR
            loanMember.customerDTO = new CustomerEntity();
            loanMember.customerDTO = this.customerMembers[i].member;
            loanMember.customerType = AcmConstants.CUSTOMER_TYPE_INDIVIDUAL;
            this.loans.push(loanMember);
          }
          this.showScheduleGrp = false;
          this.sharedService.setLoader(true);
          // send data
          await this.loanManagementService.createLoanGroup(this.loans).toPromise().then(resultEntity => {
            for (let i = 0; i < this.loans.length; i++) {
              this.irrGrp[i] = 0;
              this.aprGrp[i] = 0;
              this.aprGrpWitoutRound[i] = 0;
              this.irrGrpWithoutRound[i] = 0;
              this.issueFeeAmountGrp[i] = 0;
            }
            this.sharedService.setLoader(false);
            this.devToolsServices.openToast(0, 'alert.success');
            this.router.navigate([AcmConstants.DASHBOARD_URL]);
          });
        } else if ((this.customer.customerType !== AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY)
          && (this.calculatorComp.calculatorForm.valid) ) {
          if (!this.calculatorComp.checkIssueDate() || !this.calculatorComp.checkInitialPayment()
          || !this.calculatorComp.checkDeferredPeriod()) {
            return;
          }
          if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL && !this.checkAgeForProduct()) {
            return;
          }
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
          this.loanEntity.issueFeeAmount = this.calculatorComp.issueFeeAmount;
          this.loanEntity.feeAmt1 = this.calculatorComp.feeAmount;
          this.loanEntity.idLoanExtern = this.selectedLoan.idLoanExtern;
          this.loanEntity.loanId = this.selectedLoan.loanId;
          this.loanEntity.idAccountExtern =   this.selectedLoan.idAccountExtern;
          this.loanEntity.accountNumber = this.selectedLoan.accountNumber;
          this.loanEntity.openingBalance = this.selectedLoan.openingBalance;
          this.loanEntity.personalContribution = this.selectedLoan.personalContribution;
          // CASE OF TOPUP / REFINANCE
          if (this.calculatorComp.calculatorForm.value.loanAmount !== 0) {
            this.loanEntity.loanApplicationStatus = AcmConstants.TOPUP;
          } else {
            this.loanEntity.loanApplicationStatus = AcmConstants.REFINANCE;
          }
          if (this.calculatorComp.checkInitialPaymentValue() < 30) {
            this.devToolsServices.openToast(3, 'alert.firstInstallmentDate');
            return;
          }
          this.sharedService.setLoader(true);
           // get list of asset to save
           if (this.sharedService.loan.loanAssetsDtos) {
            this.loanEntity.loanAssetsDtos = this.sharedService.loan.loanAssetsDtos;
          }else {
            this.loanEntity.loanAssetsDtos = [];
          }
          // send data
            await this.loanManagementService.createTopUpRefinanceLoan(this.loanEntity).toPromise().then(() => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.sharedService.setLoader(false);
            this.router.navigate([AcmConstants.DASHBOARD_URL]);
            this.irr = 0;
            this.apr = 0;
            this.irrWithoutRound = 0;
            this.aprWithoutRound = 0;
            this.issueFeeAmount = 0;
          });  
        }
      }

  }

  validateForms(){
    Object.values(this.addLoanForm.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }
  /**
   * Methode exit
   */
  exit() {
    this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.DASHBOARD_URL);
  }

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

  checkAgeForProductGrp(indexMember: number) {
    if (this.customer.age === null) {
      this.devToolsServices.openToast(3, 'alert.success');
      return false;
    }
    if (this.customer.age >= this.addLoanForm.value.product.minimumAge &&
      this.customer.age <= this.addLoanForm.value.product.maximumAge) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.success');
      return false;
    }
  }
  /**
   * Get Direction
   */
   getDirection() {
    return AppComponent.direction;
  }
  compareProduct(product1, product2) {
    return product1.id === product2.id;
  }
  markAsTouched(event) {
    this.devToolsServices.makeFormAsTouched(this.addLoanForm);
  }
  compareLoanReason(loanReason1, loanReason2) {
    return loanReason1.code === loanReason2.code;
  }
  compareSourceOfFunds(sourceOfFunds1, sourceOfFunds2) {
    return sourceOfFunds1.loanSourceOfFundsID === sourceOfFunds2.loanSourceOfFundsID;
  }



  updatemode(): string {
    return  "edit";
  } 

  addNewAsset() { 
    this.router.navigate(['acm/add-asset'], { queryParams: { source: 'MOD_Topup' } });
  }

  newAsset(listAssetsSelected: AssetLoanEntity[]) {
    this.sharedService.loan.loanAssetsDtos = listAssetsSelected
    
  }

  updateSupplier() : boolean{
    return this.addLoanForm.value.product.supplier
   }

   

   calculRequired(event){
    if (!event) {
      this.checkCalculate = true;
    }
  }

  totalAmount(amount: number) {
    this.calculatorComp.calculatorForm.controls.loanAmount.setValue(amount) ;
    this.calculatorComp.checkCalculate = true;
    if (this.sharedService.loan.loanAssetsDtos.length>0){
      this.calculatorComp.loanAmountModifier(this.addLoanForm.value.product,amount);
    }else {
      this.calculatorComp.loanAmountModifier(this.addLoanForm.value.product,amount);
    }
  }

}
