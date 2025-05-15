import { AssetLoanEntity } from 'src/app/shared/Entities/AssetLoan.entity';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../Settings/settings.service';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanManagementService } from './loan-management.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';
import { LoanApprovalService } from '../loan-approval/loan-approval.service';
import { ProductLoanReasonEntity } from 'src/app/shared/Entities/productLoanReason.entity';
import { LoanSourceOfFundsEntity } from 'src/app/shared/Entities/loanSourceOfFunds.entity';
import { UdfComponent } from '../udf/udf.component';
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
import { ExceptionRequestService } from '../dashbord/exception-request/exception-request.service';
import { DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { CustomerAccountEntity } from 'src/app/shared/Entities/customer.account.entity';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { forkJoin, from } from 'rxjs';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { ProductCustomerEntity } from 'src/app/shared/Entities/ProductCustomer.entity';
import { ProductFiltersEntity } from 'src/app/shared/Entities/ProductFilters.entity';
import { customRequiredValidator } from '../../../shared/utils';
import { AssetTypeListDTO } from 'src/app/shared/Entities/AssetTypeListDTO.entity';
import { ProductTypeListDTO } from 'src/app/shared/Entities/ProductTypeListDTO.entity';
import { PortfolioEntity } from 'src/app/shared/Entities/Portfolio.entity';

@Component({
  selector: 'app-loan-management',
  templateUrl: './loan-management.component.html',
  styleUrls: ['./loan-management.component.sass']
})
export class LoanManagementComponent implements OnInit {
  public edit = 'edit';
  public expandedLoanDetails = true;
  public expandedLoanSimulation = true;
  public expandedLoanSchedule = true;
  public expandedProductFilter = true;
  public addLoanForm: FormGroup;
  public addLoanSimulationGrpForm: FormGroup;
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
  public productsToFilter: ProductEntity[] = [];
  public accountPortfolios: UserEntity[] = [];
  public productLoanReasons: ProductLoanReasonEntity[] = [];
  public sourceOfFundss: LoanSourceOfFundsEntity[] = [];
  public minDateIssueDate = new Date();
  public minInitialPayement = new Date();
  public minInitialPayementvalue: string;
  public activeInitialPayement = false;
  public selectedLoan: LoanEntity = new LoanEntity();
  // public currentPath = AcmConstants.LOAN_DETAIL_URL;
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
  public apportPersonnel = 0;
  @Input() completeLoanData;
  @ViewChild(UdfComponent, { static: true }) childcomp: UdfComponent;
  public selectedLoanReason: ProductLoanReasonEntity;
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
  public fullAmount: number;
  public currentPath = AcmConstants.LOAN_MANAGEMENT;
  public filterValues = {};
  public productFilterOption = false
  public disableAmount = false;
  public instrumentList: AssetTypeListDTO[] = [];
  public typeList: ProductTypeListDTO[] = [];
  public filtredTypeList: ProductTypeListDTO[] = [];
  public activityList: ProductTypeListDTO[] = [];
  public filtredActivityList: ProductTypeListDTO[] = [];
  public natureList: ProductTypeListDTO[] = [];
  public filtredNatureList: ProductTypeListDTO[] = [];
  allProducts: ProductEntity[] = [];
  public BalanceCustomer = 0;
  public MaxBalanceCustomer = 0.0;
  public enableBalance = false;
  public scheduleFlexibleIsChecked: boolean = false;
  public listPortfolio: PortfolioEntity[];
  dropdownConfig = {
    displayKey: 'libelle', // Display the libelle in the dropdown
    search: true,          // Enable search feature
    height: 'auto',        // Adjust the height of the dropdown
    moreText: 'more', // Text for showing more items
    noResultsFound: 'No results found!', // Text when no results found
    searchOnKey: 'libelle', // Field to search on
    clearOnSelection: false, // Clear the search input upon selection
  };

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
    public exceptionRequestService: ExceptionRequestService, public dateFormatterService: DateFormatterService,
    private dbService: NgxIndexedDBService,
    public settingService: SettingsService,) {
  }

  async ngOnInit() {
    if (checkOfflineMode()) {
      await this.dbService.getByKey('data', 'allProducts').subscribe((data: any) => {
        if (data === undefined) {
          this.devToolsServices.openToast(3, 'No products saved for offline use');
        } else {
          this.allProducts = data.data;
        }
      })

      await this.dbService.getByKey('data', 'envirement-values-by-keys').subscribe((environments: any) => {
        if (environments !== undefined) {
          const env = environments.data.filter(item => item.key === AcmConstants.MAXIMUM_BALANCE_BY_CUSTOMER);
          if (env.length > 0) {
            this.enableBalance = env[0].enabled;
            if (this.enableBalance) {
              this.MaxBalanceCustomer = Number(env[0].value);
              this.dbService.getByKey('data', 'customerBalance_' + this.sharedService.getCustomer().customerIdExtern).subscribe((res: any) => {
                if (res !== undefined) {
                  this.BalanceCustomer = res.data
                }
              })
            }
          }
        }
      });
    } else {
      if (checkOfflineMode()) {
        this.dbService.getByKey('data', 'envirement-values-by-keys-deffered-periode-types').subscribe((environments: any) => {
          if (environments === undefined) {
            this.devToolsServices.openToast(3, 'No environments saved for offline use');
          } else {
            if (environments.data[0].value === '0') {
              this.deferedPeriodeSettingTypes = false;
            }
          }
        });
      } else {
        const acmEnvironmentKeys: string[] = [AcmConstants.DEFERRED_PERIODE_TYPES];
        this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
          if (environments[0].value === '0') {
            this.deferedPeriodeSettingTypes = false;
          }        
        });
      }

      const acmEnvironmentKeys: string[] = [AcmConstants.MAXIMUM_BALANCE_BY_CUSTOMER];
      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
        this.enableBalance = environments[0].enabled;
        if (this.enableBalance) {
          this.MaxBalanceCustomer = Number(environments[0].value);
          if (this.sharedService.useExternalCBS === '1') {
            this.settingsService.findBalanceCustomer(this.sharedService.getCustomer().customerIdExtern).subscribe((data) => {
              this.BalanceCustomer = data
            });
          }
          else {
            this.loanManagementService.findCustomerBalance(this.sharedService.getCustomer().id).subscribe((data) => {
              this.BalanceCustomer = data
              
            });
          }
        }
      });
    }
    await this.createForm();
    forkJoin([
      from(this.getProductLoanReason()),
      from(this.getLoanSourceOfFundss()),
      from(this.getProducts()),
      from(this.getAccountPortfolios())
    ]).subscribe(([res1, res2, res3, res4]) => {
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
          if (this.sharedService.supplier.assets !== undefined) {
            this.loanEntity = this.sharedService.getLoan();
            this.loanEntity.loanAssetsDtos = this.listAssets;
          }
          this.selectedProduct = this.loanEntity.productDTO;
        }
      }
    });
    // check deferred period setting (if not activate, hide the frequency input and set the value 1 by default)

    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'envirement-values-by-keys-deffered-periode-types').subscribe((environments: any) => {
        if (environments === undefined) {
          this.devToolsServices.openToast(3, 'No environments saved for offline use');
        } else {
          if (environments.data[0].value === '0') {
            this.deferedPeriodeSettingTypes = false;
          }
        }
      });
    } else {
      const acmEnvironmentKeys: string[] = [AcmConstants.DEFERRED_PERIODE_TYPES];
      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
        if (environments[0].value === '0') {
          this.deferedPeriodeSettingTypes = false;
        }
      });
    }

    if (this.completeLoanData === undefined) {
      this.completeLoanData = true;
    }
    this.schedules.length = 0;
    this.pageSize = 5;
    this.page = 1;
    this.customer = this.sharedService.getCustomer();
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    this.minIssueDatevalue = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.addLoanSimulationIndivForm.controls.issueDate.setValue(this.minIssueDatevalue);
    this.getInitialPaymentValue();
    // check the renewal condition setting : activate or not

    if (!checkOfflineMode()) {
      this.sharedService.getRenewalConditionStatus().then((data) => {
        this.renewelLoanCondition = data;
        if (this.renewelLoanCondition === true) {
          const customerAccount = new CustomerAccountEntity();
          customerAccount.customerId = String(this.customer.customerIdExtern);
          // get renewal condition setting by id customer if exist
          this.customerManagementService.getRenewalConditionSetting(customerAccount).subscribe((renewalSetting) => {
            // last paid amount & the percentage
            this.customerRenewalCondition = renewalSetting;
            if (this.customerRenewalCondition !== null && Object.keys(this.customerRenewalCondition).length !== 0) {
              //  we can apply the renewal condition on this customer ( he has old paid loan(s))
              this.activeRenewalConditionSetting = true;
              // check if the customer has an exception in progress or an accepted request
              this.checkNewOrAccpetedException();

            }
          });
        }
      });
    }
    this.getProdcutFilterEnvironment();
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
      accountPortfolio: ['', customRequiredValidator],
      loanReason: ['', customRequiredValidator],
      sourceOfFunds: ['', customRequiredValidator],
      product: ['', customRequiredValidator]
    });
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.createSimulationGrpForm();
      this.getCustomerMembers(this.customer);
    } else {
      this.createSimulationIndivForm();
    }
  }

  /**
   * create simulation form grp
   */
  createSimulationGrpForm() {
    this.addLoanSimulationGrpForm = this.formBuilder.group({});
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
      fees: [''],
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
    if (this.customer.customerType !== AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.addLoanSimulationIndivForm.reset();
      this.schedules = [];
    } else {
      this.addLoanSimulationGrpForm.reset();
      this.schedulesGrp = [];
    }

    this.childcomp.clearForm();
  }

  /**
   * load account portfolios of branch
   */
  async getAccountPortfolios(): Promise<boolean> {
    const userEntity: UserEntity = new UserEntity();
    userEntity.branchID = this.customer.branchId;
    try {
      let data;

      if (checkOfflineMode()) {
        data = await this.dbService.getByKey('data', 'find-all-portfolio-0').toPromise();
        data = data.data;
      } else {
        data = await this.settingsService.findAllAcmPortfolio().toPromise();
      }

      this.listPortfolio = data;
      const selectedPortfolio = this.listPortfolio.find(portfolio => portfolio.portfolioId.toString() == this.customer.accountPortfolioID);
      if (selectedPortfolio) {
        this.addLoanForm.controls.accountPortfolio.setValue(selectedPortfolio);
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
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
    let data;
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
    const wrapper = new ProductCustomerEntity(productEntity, this.sharedService.getCustomer());
    if (checkOfflineMode()) {
      data = await this.dbService.getByKey('data', 'get_products').toPromise();
      data = data.data;
    } else {
      if (this.sharedService.useExternalCBS === '1') {
        data = await this.loanManagementService.getEligibleProducts(wrapper).toPromise();
      }
      else {
        data = await this.loanManagementService.getProducts(productEntity).toPromise();
      }
    }
    this.products = data;
    this.productsToFilter = data;
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.products[0].acmCurrency.decimalPlaces);
    this.currencySymbol = this.products[0].acmCurrency?.symbol;
  }
  async getProdcutFilterEnvironment() {
    if (checkOfflineMode()) {
      const environments = await this.dbService.getByKey('data', 'envirement-values-by-keys').toPromise() as any;
      if (environments !== undefined) {
        const env = environments.data.filter((env => env.key === AcmConstants.PRODUCT_FILTER_KEY));
        if (env.length > 0 && env[0].enabled) {
          this.initListValues()
          this.productFilterOption = true;
        }
      }
    } else {
      const acmEnvironmentKeys: string[] = [AcmConstants.PRODUCT_FILTER_KEY]
      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
        if (environments[0].enabled) {
          this.initListValues()
          this.productFilterOption = true;
        }
      });
    }
  }
  /**
   * toggle Loan Details card
   */
  toggleProductFilter() {
    this.expandedProductFilter = !this.expandedProductFilter;
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
  async calculateGrp(j: number) {
    this.devToolsServices.makeFormAsTouched(this.addLoanForm);
    // this.checkMinMaxAmountTermCalculateGrp(j);
    if (!this.addLoanForm.valid || !this.addLoanSimulationGrpForm.valid) {
      this.devToolsServices.openToast(3, 'alert.check-data');
      this.devToolsServices.backTop();
      return;
    }
    if (this.addLoanSimulationGrpForm.valid && this.addLoanForm.valid && (this.amountTrouvGrp[j] || this.termTrouvGrp[j])) {
      this.checkCalculateGrp[j] = false;
      this.schedulesGrp[j] = [];
      this.loanEntity.customerDTO = this.sharedService.getCustomer();
      // load product by id
      this.loadingCalcule = true;
      this.loanEntity.productId = this.addLoanForm.value.product.id;
      this.loanEntity.customerDTO = this.sharedService.getCustomer();
      this.loanEntity.loanCalculationMode = 0;
      this.loanEntity.approvelAmount = this.addLoanSimulationGrpForm.controls['loanAmount' + j].value;
      this.loanEntity.applyAmountTotal = this.addLoanSimulationGrpForm.controls['loanAmount' + j].value;
      this.loanEntity.issueDate = this.addLoanSimulationGrpForm.controls['issueDate' + j].value;
      this.loanEntity.initialPaymentDate = this.addLoanSimulationGrpForm.controls['initialPayment' + j].value;
      this.loanEntity.termPeriodNum = this.addLoanSimulationGrpForm.controls['loanTerm' + j].value;
      this.loanEntity.termPeriodID = this.addLoanSimulationGrpForm.controls['termType' + j].value;
      this.loanEntity.periodsDeferred = this.addLoanSimulationGrpForm.controls['periodsDeferred' + j].value;
      this.loanEntity.periodsDeferredType = this.addLoanSimulationGrpForm.controls['periodsDeferredType' + j].value;
      this.loanEntity.productDTO = this.addLoanForm.value.product;
      // call calculate Loan Schedules API
      await this.loanApprovalService.calculateLoanSchedules(this.loanEntity).toPromise().then(
        (data) => {
          data.loanSchedule.forEach(element => {
            this.schedulesGrp[j].push(element);
          });
          this.updateData(j, data);
          this.lastLineGrp = this.schedulesGrp[j][this.schedulesGrp[j].length - 1];
          this.loadingCalcule = false;
        });
    }
  }

  /**
   * calculate the new schedule with new data
   */
  async calculate(resetSchedule: boolean) {

    this.devToolsServices.makeFormAsTouched(this.addLoanForm);
    if (!this.addLoanForm.valid || !this.addLoanSimulationIndivForm.valid) {
      this.devToolsServices.openToast(3, 'alert.check-data');
      this.devToolsServices.backTop();
      return;
    }
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      // if the renewal condition feature is activate and the customer have a renewal condition setting
      if (this.limitMinAmountValidation || this.limitMaxAmountValidation) {
        this.schedules = [];
        this.devToolsServices.openToast(3, 'check-loan-amount');
        return;
      }

      if (this.renewelLoanCondition && this.activeRenewalConditionSetting) {
        if (this.addLoanSimulationIndivForm.get('loanAmount').value < this.minAmountValidation) {
          this.devToolsServices.openToast(3, 'alert.check_renewal_setting');
          return;
        }
        if (this.addLoanSimulationIndivForm.get('loanAmount').value > this.maximumAllowedAmount) {
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
      if (this.addLoanSimulationIndivForm.controls.periodsDeferred.value !== 0 &&
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
      this.loanEntity.branchID = this.customer.branchId;
      this.loanEntity.loanCalculationMode = 0;
      this.loanEntity.customerDTO = this.sharedService.getCustomer();
      this.loanEntity.branchID = this.customer.branchId;
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

      this.loanEntity.customerDTO = this.sharedService.getCustomer();
      this.loanEntity.issueFeeAmount = 150
      this.loanEntity.feeAmt1 = 0;
      this.loanEntity.productRate = this.product.rate;
      if (resetSchedule) {
        this.scheduleFlexibleIsChecked = false;
        this.schedules = [];
      }
      this.loanEntity.loanSchedules = this.schedules;
      if (this.enableBalance) {
        this.customer.balanceAbacus = parseFloat(this.BalanceCustomer.toFixed(3));
        this.customer.balanceTotal = parseFloat(this.BalanceCustomer.toFixed(3)) + parseFloat(this.addLoanSimulationIndivForm.controls.loanAmount.value.toFixed(3))
      }
      if (checkOfflineMode()) {
        this.loanEntity.loanId = this.customer.id;
        await this.dbService.update('calculate-loans', this.loanEntity).toPromise();

        // Loan repayment = Loan amount * (Interest /12 + 1/Loan term)
        const interest = this.addLoanForm.value.product.flatInterestRate / 100;
        const loanAmout = this.addLoanSimulationIndivForm.controls.loanAmount.value;
        const loanTerm = this.addLoanSimulationIndivForm.controls.loanTerm.value;
        const loenRepayment = loanAmout * ((interest / 12) + (1 / loanTerm));

        this.addLoanSimulationIndivForm.controls.repayment.setValue(Math.floor(loenRepayment));

        for (let i = 0; i < loanTerm; i++) {
          const scheduleEntity = new ScheduleEntity();
          scheduleEntity.period = String(i + 1);
          scheduleEntity.totalRepayment = loenRepayment;
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
              this.addLoanSimulationIndivForm.controls.initialPayment.setValue(this.datePipe.transform(dateResult, 'yyyy-MM-dd', timeZone));
            }
            this.lastLine = this.schedules[this.schedules.length - 1];
            this.loadingCalcule = false;
            this.checkCalculate = false;
          });
      }

    }
  }

  /**
   * Update data
   */
  updateData(j: number, data: LoanCalculateEntity) {
    let decimal = 1;
    if (this.selectedProduct.acmCurrency.decimalPlaces !== null ||
      this.selectedProduct.acmCurrency.decimalPlaces !== undefined || this.selectedProduct.acmCurrency.decimalPlaces !== 0) {
      decimal = Math.pow(10, this.selectedProduct.acmCurrency.decimalPlaces);
    }
    const pourcentage = (data.issueAmount
      * this.selectedProduct.issueFeePercentage1) / 100;
    const pourcentage2 = (data.issueAmount
      * this.selectedProduct.issueFeePercentage2) / 100;
    const feeAmout1 = pourcentage + ((pourcentage
      * this.product.issueFeeVAT1) / 100) + data.feeAmt1;
    // get application fees amount from API calculate
    this.feeAmount = data.feeAmt1;
    const feeAmout2 = pourcentage2 + ((pourcentage2
      * this.selectedProduct.issueFeeVAT2) / 100) + this.selectedProduct.issueFeeAmount2;
    switch (this.selectedProduct.roundType) {
      case AcmConstants.ROUND_UP:
        this.addLoanSimulationGrpForm.controls['repayment' + j].setValue(Math.ceil((data.normalPayment + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationGrpForm.controls['vat' + j].setValue(Math.ceil((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.addLoanSimulationGrpForm.controls['apr' + j].setValue(data.apr);

        this.addLoanSimulationGrpForm.controls['closingBalance' + j].setValue(Math.ceil((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationGrpForm.controls['fees' + j].setValue(Math.ceil(((feeAmout1 + feeAmout2)
          + Number.EPSILON) * decimal) / decimal);
        break;
      case AcmConstants.ROUND_DOWN:
        this.addLoanSimulationGrpForm.controls['repayment' + j].setValue(Math.floor((data.normalPayment + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationGrpForm.controls['vat' + j].setValue(Math.floor((data.insurancePremium + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationGrpForm.controls['apr' + j].setValue(data.apr);
        this.addLoanSimulationGrpForm.controls['closingBalance' + j].setValue(Math.floor((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationGrpForm.controls['fees' + j].setValue(Math.floor(((feeAmout1 + feeAmout2)
          + Number.EPSILON) * decimal) / decimal);
        break;
      case AcmConstants.ROUND:
        this.addLoanSimulationGrpForm.controls['repayment' + j].setValue(Math.round((data.normalPayment + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationGrpForm.controls['vat' + j].setValue(Math.round((data.insurancePremium + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationGrpForm.controls['apr' + j].setValue(data.apr);
        this.addLoanSimulationGrpForm.controls['closingBalance' + j].setValue(Math.round((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationGrpForm.controls['fees' + j].setValue(Math.round(((feeAmout1 + feeAmout2)
          + Number.EPSILON) * decimal) / decimal);
        break;
      default:
        this.addLoanSimulationGrpForm.controls['repayment' + j].setValue(data.normalPayment);
        this.addLoanSimulationGrpForm.controls['vat' + j].setValue(data.insurancePremium);
        this.addLoanSimulationGrpForm.controls['apr' + j].setValue(data.apr);
        this.addLoanSimulationGrpForm.controls['closingBalance' + j].setValue(data.issueAmount);
        this.addLoanSimulationGrpForm.controls['fees' + j].setValue(feeAmout1 + feeAmout2);
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
        this.addLoanSimulationIndivForm.controls.apr.setValue(data.apr);

        this.addLoanSimulationIndivForm.controls.closingBalance.setValue(Math.ceil((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);

        this.addLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1'? Math.ceil(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      case AcmConstants.ROUND_DOWN:
        this.addLoanSimulationIndivForm.controls.repayment.setValue(Math.floor((data.normalPayment + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationIndivForm.controls.vat.setValue(Math.floor((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.addLoanSimulationIndivForm.controls.apr.setValue(data.apr);

        this.addLoanSimulationIndivForm.controls.closingBalance.setValue(Math.floor((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);

        this.addLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.floor(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      case AcmConstants.ROUND:
        this.addLoanSimulationIndivForm.controls.repayment.setValue(Math.round((data.normalPayment + Number.EPSILON) * decimal) / decimal);
        this.addLoanSimulationIndivForm.controls.vat.setValue(Math.round((data.insurancePremium + Number.EPSILON) * decimal) / decimal);
        this.addLoanSimulationIndivForm.controls.apr.setValue(data.apr);
        this.addLoanSimulationIndivForm.controls.closingBalance.setValue(Math.round((data.issueAmount + Number.EPSILON)
          * decimal) / decimal);
        this.addLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? Math.round(((feeAmout1 + feeAmout2) + Number.EPSILON) * decimal) / decimal : data?.acmIssueFee);
        break;
      default:
        this.addLoanSimulationIndivForm.controls.repayment.setValue(data.normalPayment);
        this.addLoanSimulationIndivForm.controls.vat.setValue(data.insurancePremium);
        this.addLoanSimulationIndivForm.controls.apr.setValue(data.apr);
        this.addLoanSimulationIndivForm.controls.closingBalance.setValue(data.issueAmount);
        this.addLoanSimulationIndivForm.controls.fees.setValue(this.sharedService.useExternalCBS === '1' ? feeAmout1 + feeAmout2 : data?.acmIssueFee);
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
  selectAssets(listAssetsSelected: AssetLoanEntity[]) {
    this.listAssets = listAssetsSelected;
    if (listAssetsSelected.length > 0) {
      this.addLoanSimulationIndivForm.controls.loanAmount.disable();
    } else {
      this.addLoanSimulationIndivForm.controls.loanAmount.enable();
    }
  }
  /**
   * get   Requirement from selected product for grp
   */
  async getProductRequirement() {
    // init schedule
    this.schedules = [];
    if (this.addLoanForm.value.product !== '') {
      this.selectedProduct = this.addLoanForm.value.product;
      this.supplier = this.selectedProduct.supplier;
      if (this.selectedProduct.supplier) {
        this.addLoanSimulationIndivForm.controls.loanAmount.disable();

      } else {
        this.addLoanSimulationIndivForm.controls.loanAmount.enable()

      }
      this.minPeriodsValidation = this.selectedProduct.minimumDeferredPeriod;
      // set default periode deferred the minimum periodeDeferred by Product
      this.addLoanSimulationIndivForm.controls.periodsDeferred.setValue(this.minPeriodsValidation);
      // set default periode deferred type the first periode deferred type configured for the product
      if (this.selectedProduct.productDetailsDTOs[0].deferredPeriodTypeDTOs[0]) {
        this.addLoanSimulationIndivForm.controls.periodsDeferredType.setValue(
          this.selectedProduct.productDetailsDTOs[0].deferredPeriodTypeDTOs[0]);
      }
      this.maxPeriodsValidation = this.selectedProduct.maximumDeferredPeriod;
      this.currencySymbol =this.selectedProduct.acmCurrency?.symbol;
      if (checkOfflineMode()) {
        this.initializeLoanSimulation();
      } else {
        this.loanManagementService.getCustomerActiveAccount(this.customer.customerIdExtern, this.selectedProduct.productIdAbacus).subscribe(
          (customerActiveAccount) => {
            this.customerActiveAccount = customerActiveAccount;
            if (customerActiveAccount >= this.selectedProduct.maxAccounts) {
              this.devToolsServices.openToast(3, 'alert.customer_active_account_limit');
            } else {
              this.initializeLoanSimulation();
            }
          }
        );
      }
    }
  }

  initializeLoanSimulation() {
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      for (let i = 0; i < this.customerMembers.length; i++) {
        this.addLoanSimulationGrpForm.controls['loanAmount' + i].setValue('');
      }
    } else if (this.source !== 'ADD_ASSET') {
      this.addLoanSimulationIndivForm.controls.loanAmount.setValue('');
    }
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
    if (this.enableBalance) {
      const maxBalanceByCustomer = this.MaxBalanceCustomer - this.BalanceCustomer;
      
      this.maxAmountValidation = Math.min(this.maxAmountValidation, maxBalanceByCustomer);
      
    }
    // re-load UDF by productId
    this.loanEntity.customerDTO = this.sharedService.getCustomer();
    this.loanEntity.productId = this.addLoanForm.value.product.id;
    this.sharedService.setLoan(this.loanEntity);
    this.childcomp.ngOnInit();
  }
  getFullAmount(amount: number) {
    this.fullAmount = amount;

  }
  /**
   * Methode to onSubmit save loan after validation
   */
  submitLoan() {
    if (this.renewelLoanCondition && this.activeException) {
      this.devToolsServices.openToast(3, 'alert.exception_request_in_progress');
      return;
    }

    const product: ProductEntity = this.addLoanForm.value.product;
    if (!product.supplier) {
      this.addLoan();
      return;
    }
    const eligibilitySettings = product.settingProductEligibility;
    if (!eligibilitySettings || !eligibilitySettings.personalContributionStatus) {
      this.addLoan();
      return;
    }
    const percentageContributionAmount: number = this.fullAmount * eligibilitySettings.minLoanAmountPercantage / 100;
    const minimumRequiredAmount = Math.max(eligibilitySettings.minFixedLoanAmount, percentageContributionAmount);

    this.apportPersonnel >= minimumRequiredAmount
      ? this.addLoan()
      : this.devToolsServices.openToast(3, 'alert.min_personal_contribution');
  }
  /**
   * Methode to save
   */
  async addLoan() {
    if (this.addLoanForm.invalid || this.childcomp.udfForm.invalid || this.addLoanSimulationIndivForm.invalid) {
      this.devToolsServices.InvalidControl();
    }
    this.validateForms();
    this.devToolsServices.makeFormAsTouched(this.addLoanForm);
    this.devToolsServices.makeFormAsTouched(this.childcomp.udfForm);
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      this.devToolsServices.makeFormAsTouched(this.addLoanSimulationIndivForm);
      if (this.checkCalculate) {
        this.devToolsServices.openToast(3, 'alert.error-calculate');
        return;
      }
    } else if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.devToolsServices.makeFormAsTouched(this.addLoanSimulationGrpForm);
      this.checkCalculateGrp.forEach((checkCalculate) => {
        if (checkCalculate) {
          this.devToolsServices.openToast(3, 'alert.error-calculate');
          return;
        }
      });
    }
    if (this.addLoanForm.valid && this.childcomp.udfForm.valid) {

      this.loanEntity = new LoanEntity();

      if (!checkOfflineMode()) {
        this.loanEntity.totalInterest = Number(this.lastLine.interestRepayment); // to be recalculated for offline
      }

      this.loanEntity.portfolioCode = this.addLoanForm.value.accountPortfolio.code;
      this.loanEntity.portfolioId = this.addLoanForm.value.accountPortfolio.portfolioId;
      this.loanEntity.portfolioDescription = this.addLoanForm.value.accountPortfolio.portfolioName.replace(/\s*\(.*\)/, "").trim();
      this.loanEntity.productId = this.addLoanForm.value.product.id;
      if (this.selectedProduct.flatInterestRate !== 0) {
        this.loanEntity.productRate = this.effectiveInterestRateStandard;
      } else {
        this.loanEntity.productRate = this.addLoanForm.value.product.rate;
      }
      // to be shared as imput and setted to the loan
      this.loanEntity.loanAssetsDtos = this.listAssets;
      this.loanEntity.personalContribution = this.apportPersonnel;
      // set id Loan
      // this.loanEntity.loanId=this.sharedService.getLoan().loanId;
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
      // set schedule in loanEntity
      this.loanEntity.loanSchedules = this.schedules;
      this.loanEntity.userDefinedFieldsLinksDTOs = this.childcomp.onSubmitLoan(this.loanEntity);
      if ((this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY)
        && (this.addLoanSimulationGrpForm.valid)) {
        this.loans = [];
        this.loans.push(this.loanEntity);
        for (let i = 0; i < this.customerMembers.length; i++) {
          if (!this.checkIssueDateGrp(i) || !this.checkInitialPaymentGrp(i) || !this.checkDeferredPeriodGrp(i)) {
            return;
          }
          this.schedulesGrp[i].length = 0;
          const loanMember = new LoanEntity();
          loanMember.loanCalculationMode = 0;
          loanMember.applyAmountTotal = this.addLoanSimulationGrpForm.controls['loanAmount' + i].value;
          loanMember.approvelAmount = this.addLoanSimulationGrpForm.controls['loanAmount' + i].value;
          loanMember.normalPayment = this.addLoanSimulationGrpForm.controls['repayment' + i].value;
          loanMember.termPeriodNum = this.addLoanSimulationGrpForm.controls['loanTerm' + i].value;
          loanMember.paymentFreq = this.addLoanSimulationGrpForm.controls['frequency' + i].value;
          loanMember.issueDate = this.addLoanSimulationGrpForm.controls['issueDate' + i].value;
          loanMember.initialPaymentDate = this.addLoanSimulationGrpForm.controls['initialPayment' + i].value;
          loanMember.periodsDeferred = this.addLoanSimulationGrpForm.controls['periodsDeferred' + i].value;
          loanMember.periodsDeferredType = this.addLoanSimulationGrpForm.controls['periodsDeferredType' + i].value.deferredPeriodTypeId;
          loanMember.intPayPeriodNum = 1;
          loanMember.termPeriodID = this.addLoanSimulationGrpForm.controls['termType' + i].value;
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
          this.clearForm();
          this.router.navigate([AcmConstants.DASHBOARD_URL]);
        });
      } else if ((this.customer.customerType !== AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY)
        && (this.addLoanSimulationIndivForm.valid) && (this.childcomp.udfForm.valid)) {
        if (!this.checkIssueDate() || !this.checkInitialPayment() || !this.checkDeferredPeriod()) {
          return;
        }
        if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL && !this.checkAgeForProduct()) {
          return;
        }
        this.loanEntity.loanCalculationMode = 0;
        this.loanEntity.applyAmountTotal = this.addLoanSimulationIndivForm.get('loanAmount').value;
        this.loanEntity.approvelAmount = this.addLoanSimulationIndivForm.get('loanAmount').value;
        this.loanEntity.normalPayment = this.addLoanSimulationIndivForm.value.repayment;
        this.loanEntity.termPeriodNum = this.addLoanSimulationIndivForm.value.loanTerm;
        this.loanEntity.interestFreq = this.addLoanSimulationIndivForm.value.interestFrequency;
        this.loanEntity.paymentFreq = this.addLoanSimulationIndivForm.value.frequency;
        this.loanEntity.issueDate = this.addLoanSimulationIndivForm.value.issueDate;
        this.loanEntity.initialPaymentDate = this.addLoanSimulationIndivForm.value.initialPayment;
        this.loanEntity.periodsDeferredType = this.addLoanSimulationIndivForm.value.periodsDeferredType.deferredPeriodTypeId;
        this.loanEntity.periodsDeferred = this.addLoanSimulationIndivForm.value.periodsDeferred;
        this.loanEntity.intPayPeriodNum = 1;
        this.loanEntity.termPeriodID = this.addLoanSimulationIndivForm.value.termType;
        this.loanEntity.apr = this.aprWithoutRound;
        this.loanEntity.effectiveIntRate = this.irrWithoutRound;
        if (this.sharedService.useExternalCBS === '1') {
          this.loanEntity.issueFeeAmount = this.issueFeeAmount;
        }
        else {
          this.loanEntity.acmIssueFees = this.issueFeeAmount;
        }
        this.loanEntity.feeAmt1 = this.feeAmount;
        this.loanEntity.loanApplicationStatus = AcmConstants.NEW_APPLICATION;
        // set schedule in loanEntity
        this.loanEntity.loanSchedules = this.schedules;
        this.loanEntity.userDefinedFieldsLinksDTOs = this.childcomp.onSubmitLoan(this.loanEntity);
        if (this.checkInitialPaymentValue() < 30) {
          this.devToolsServices.openToast(3, 'alert.firstInstallmentDate');
          return;
        }
        this.sharedService.setLoader(true);
        // send data

        if (checkOfflineMode()) {
          const workflow: any = await this.dbService.getByKey('data', 'workflow_steps_' + this.loanEntity.productDTO.id).toPromise();
          let loanInstances: LoanProcessEntity[] = [];

          workflow.data.forEach((step: StepEntity) => {
            const loanInstancesDto = new LoanProcessEntity();
            loanInstancesDto.code = step.idWorkFlowStep;
            loanInstancesDto.codeStatutLoan = step.codeStatutLoan;
            loanInstancesDto.enabled = step.enabled;
            loanInstancesDto.ihmRoot = step.screen;
            loanInstancesDto.libelle = step.stepName;
            loanInstancesDto.orderEtapeProcess = step.order;
            loanInstancesDto.statutLoan = step.process;

            // to do by rmila

            if (loanInstancesDto.orderEtapeProcess === 0) {
              this.loanEntity.etapeWorkflow = loanInstancesDto.code;
              this.loanEntity.statutLibelle = loanInstancesDto.libelle;
              this.loanEntity.loanApplicationStatus = AcmConstants.NEW_APPLICATION;
              this.loanEntity.productDescription = this.loanEntity.productDTO.description;
              this.loanEntity.accountNumber = this.loanEntity.customerDTO.customerNumber;
              this.loanEntity.applyAmountTotal = this.loanEntity.approvelAmount;
              this.loanEntity.portfolioDescription = this.loanEntity.customerDTO.accountPortfolioDescription;
              this.loanEntity.ownerName = this.loanEntity.customerDTO.accountPortfolioDescription;
              this.loanEntity.applyAmountTotal = this.loanEntity.approvelAmount;
              this.loanEntity.currencyDecimalPlaces = '2';
            }

            loanInstances.push(loanInstancesDto);

          });

          this.loanEntity.loanInstancesDtos = loanInstances;

          this.loanEntity.loanId = this.customer.id;

          await this.dbService.update('loans', this.loanEntity).toPromise();

          await this.dbService.getByKey('loans-pagination', 'loans-pagination-status-0').subscribe((loans: any) => {

            loans.resultsLoans.unshift(this.loanEntity);
            this.dbService
              .update('loans-pagination', loans)
              .subscribe(
                () => {
                  this.devToolsServices.openToast(0, 'alert.success');
                }
              );

            this.router.navigate([AcmConstants.DASHBOARD_URL]);
            this.sharedService.setLoader(false);
          });

        } else {
          await this.loanManagementService.createLoan(this.loanEntity).toPromise().then(resultEntity => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.sharedService.setLoader(false);
            this.clearForm();
            this.irr = 0;
            this.apr = 0;
            this.irrWithoutRound = 0;
            this.aprWithoutRound = 0;
            this.issueFeeAmount = 0;
            // reset supplier data in sharedService
            this.sharedService.setSupplier(new SupplierEntity());
            // this.sharedService.setLoanAssets([]);
            // this.sharedService.setLoan(this.loanEntity);
            this.router.navigate([AcmConstants.DASHBOARD_URL]);
            this.sharedService.setLoader(false);
          });
        }
      }
    }
  }
  validateForms() {
    Object.values(this.addLoanForm.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      Object.values(this.addLoanSimulationIndivForm.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }
  /**
   * Methode exit
   */
  exit() {
    this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.DASHBOARD_URL);
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
        for (let i = 0; i < this.customerMembers.length; i++) {
          this.schedulesGrp[i] = [];
          this.customerMembers[i].pageSize = 5;
          this.customerMembers[i].page = 1;
          this.addLoanSimulationGrpForm.addControl('loanAmount' + i, new FormControl(''));
          this.addLoanSimulationGrpForm.addControl('repayment' + i, new FormControl(''));
          this.addLoanSimulationGrpForm.addControl('loanTerm' + i, new FormControl(''));
          this.addLoanSimulationGrpForm.addControl('termType' + i, new FormControl('3'));
          this.addLoanSimulationGrpForm.addControl('fees' + i, new FormControl(''));
          this.addLoanSimulationGrpForm.addControl('initialPayment' + i, new FormControl(''));
          this.addLoanSimulationGrpForm.addControl('issueDate' + i, new FormControl(''));
          this.addLoanSimulationGrpForm.addControl('vat' + i, new FormControl('0'));
          this.addLoanSimulationGrpForm.addControl('apr' + i, new FormControl('0'));
          this.addLoanSimulationGrpForm.addControl('closingBalance' + i, new FormControl(''));
          this.addLoanSimulationGrpForm.addControl('periodsDeferred' + i, new FormControl('1'));
          this.addLoanSimulationGrpForm.addControl('periodsDeferredType' + i, new FormControl(''));
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
        const valeurMaxAmount = this.enableBalance
          ? Math.min(this.maxAmountValidation, element.maximumAmount)
          : element.maximumAmount;

        if ((this.addLoanSimulationIndivForm.value.loanTerm >= element.minimumTerm
          && this.addLoanSimulationIndivForm.value.loanTerm <= element.maximumTerm)) {
          amountMin.push(element.minimumAmount);
          amountMax.push(valeurMaxAmount);
          this.termTrouv = true;
        }
      });
      if (this.termTrouv) {
        this.minAmountValidation = Math.min(...amountMin);
        this.maxAmountValidation = Math.max(...amountMax);
        if (this.addLoanSimulationIndivForm.get('loanAmount').value !== '') {
          if (this.addLoanSimulationIndivForm.get('loanAmount').value >= this.minAmountValidation &&
            this.addLoanSimulationIndivForm.get('loanAmount').value <= this.maxAmountValidation && this.source !== 'ADD_ASSET') {
            const amountForm = this.addLoanSimulationIndivForm.get('loanAmount').value;
            this.addLoanSimulationIndivForm.controls.loanAmount.reset();
            this.addLoanSimulationIndivForm.controls.loanAmount.setValue(amountForm);
            this.limitMinAmountValidation = false;
            this.limitMaxAmountValidation = false;
          } else {
            this.limitMinAmountValidation = this.addLoanSimulationIndivForm.get('loanAmount').value < this.minAmountValidation;
            this.limitMaxAmountValidation = this.addLoanSimulationIndivForm.get('loanAmount').value > this.maxAmountValidation;
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
    if (this.addLoanSimulationIndivForm.get('loanAmount').value === '' || this.addLoanSimulationIndivForm.get('loanAmount').value === null) {
      this.resetValidation();
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      this.selectedProduct.productDetailsDTOs.forEach(element => {
        const valeurMaxAmount = this.enableBalance
          ? Math.min(this.maxAmountValidation, element.maximumAmount)
          : element.maximumAmount;

        if ((this.addLoanSimulationIndivForm.get('loanAmount').value >= element.minimumAmount
          && this.addLoanSimulationIndivForm.get('loanAmount').value <= valeurMaxAmount)) {
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
        if (this.addLoanSimulationIndivForm.get('loanAmount').value >= this.maxAmountValidation) {
          this.limitMaxAmountValidation = true;
        } else if (this.addLoanSimulationIndivForm.get('loanAmount').value <= this.minAmountValidation) {
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
          const valeurMaxAmount = this.enableBalance
            ? Math.min(this.maxAmountValidation, element.maximumAmount)
            : element.maximumAmount;

          if ((this.addLoanSimulationIndivForm.value.loanTerm >= element.minimumTerm
            && this.addLoanSimulationIndivForm.value.loanTerm <= element.maximumTerm)
            && (approvelAmount >= element.minimumAmount && approvelAmount <= valeurMaxAmount) && this.source !== 'ADD_ASSET') {
            this.amountTrouv = true;
            this.addLoanSimulationIndivForm.controls.loanAmount.clearValidators();
            this.addLoanSimulationIndivForm.controls.loanAmount.setValue(approvelAmount);
          }
        });
        if (!this.amountTrouv) {
          if (this.addLoanSimulationIndivForm.get('loanAmount').value > this.maxAmountValidation) {
            this.limitMaxAmountValidation = true;
          } else if (this.addLoanSimulationIndivForm.get('loanAmount').value < this.minAmountValidation) {
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
    approvalTerm = Math.round(this.addLoanSimulationIndivForm.get('loanAmount').value / this.addLoanSimulationIndivForm.value.repayment);
    if (this.addLoanSimulationIndivForm.get('loanAmount').value === '' || this.addLoanSimulationIndivForm.get('loanAmount').value === null) {
      this.resetValidation();
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      if (approvalTerm !== 0) {
        this.selectedProduct.productDetailsDTOs.forEach(element => {
          const valeurMaxAmount = this.enableBalance
            ? Math.min(this.maxAmountValidation, element.maximumAmount)
            : element.maximumAmount;

          if ((this.addLoanSimulationIndivForm.get('loanAmount').value >= element.minimumAmount
            && this.addLoanSimulationIndivForm.get('loanAmount').value <= valeurMaxAmount)
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
          if (this.addLoanSimulationIndivForm.get('loanAmount').value >= element.minimumAmount
            && this.addLoanSimulationIndivForm.get('loanAmount').value <= element.maximumAmount) {
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
      if ((this.addLoanSimulationIndivForm.get('loanAmount').value >= element.minimumAmount
        && this.addLoanSimulationIndivForm.get('loanAmount').value <= element.maximumAmount)
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
    if (this.addLoanSimulationIndivForm.get('loanAmount').value === null) {
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
  getMinMaxValueAmountGrp(j) {
    this.termTrouvGrp[j] = false;
    const amountMin = [];
    const amountMax = [];
    this.limitMaxTermValidationGrp[j] = false;
    this.limitMinTermValidationGrp[j] = false;
    if (this.addLoanSimulationGrpForm.controls['loanTerm' + j].value === '' ||
      this.addLoanSimulationGrpForm.controls['loanTerm' + j].value === null) {
      this.resetValidationGrp(j);
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      this.selectedProduct.productDetailsDTOs.forEach(element => {
        if (this.addLoanSimulationGrpForm.controls['loanTerm' + j].value >= element.minimumTerm
          && this.addLoanSimulationGrpForm.controls['loanTerm' + j].value <= element.maximumTerm) {
          amountMin.push(element.minimumAmount);
          amountMax.push(element.maximumAmount);
          this.termTrouvGrp[j] = true;
        }
      });
      if (this.termTrouvGrp[j]) {
        this.minAmountValidationGrp[j] = Math.min(...amountMin);
        this.maxAmountValidationGrp[j] = Math.max(...amountMax);
        if (this.addLoanSimulationGrpForm.value['loanAmount' + j] !== '') {
          if (this.addLoanSimulationGrpForm.value['loanAmount' + j] >= this.minAmountValidationGrp[j] &&
            this.addLoanSimulationGrpForm.value['loanAmount' + j] <= this.maxAmountValidationGrp[j]) {
            const amountForm = this.addLoanSimulationGrpForm.value['loanAmount' + j];
            this.addLoanSimulationGrpForm.controls['loanAmount' + j].reset();
            this.addLoanSimulationGrpForm.controls['loanAmount' + j].setValue(amountForm);
            this.limitMinAmountValidationGrp[j] = false;
            this.limitMaxAmountValidationGrp[j] = false;
          } else {
            this.limitMinAmountValidation = this.addLoanSimulationGrpForm.value['loanAmount' + j] < this.minAmountValidationGrp[j];
            this.limitMaxAmountValidation = this.addLoanSimulationGrpForm.value['loanAmount' + j] > this.maxAmountValidationGrp[j];
            this.addLoanSimulationGrpForm.controls['loanAmount' + j].setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.addLoanSimulationGrpForm.controls['loanTerm' + j].value > this.maxTermValidationGrp[j]) {
          this.limitMaxTermValidationGrp[j] = true;
        } else if (this.addLoanSimulationGrpForm.controls['loanTerm' + j].value < this.minTermValidationGrp[j]) {
          this.limitMinTermValidationGrp[j] = true;
        }
        this.addLoanSimulationGrpForm.controls['loanTerm' + j].setErrors({ invalid: true, message: '' });
      }
    }
  }

  /**
   * getMinMaxValueTermGrp
   */
  getMinMaxValueTermGrp(j) {
    this.amountTrouvGrp[j] = false;
    const termMin = [];
    const termMax = [];
    this.limitMinAmountValidationGrp[j] = false;
    this.limitMaxAmountValidationGrp[j] = false;
    if (this.addLoanSimulationGrpForm.controls['loanAmount' + j].value === '' ||
      this.addLoanSimulationGrpForm.controls['loanAmount' + j].value === null) {
      this.resetValidationGrp(j);
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      this.selectedProduct.productDetailsDTOs.forEach(element => {
        if (this.addLoanSimulationGrpForm.controls['loanAmount' + j].value >= element.minimumAmount
          && this.addLoanSimulationGrpForm.controls['loanAmount' + j].value <= element.maximumAmount) {
          termMin.push(element.minimumTerm);
          termMax.push(element.maximumTerm);
          this.amountTrouvGrp[j] = true;
        }
      });
      if (this.amountTrouvGrp[j]) {
        this.minTermValidationGrp[j] = Math.min(...termMin);
        this.maxTermValidationGrp[j] = Math.max(...termMax);
        if (this.addLoanSimulationGrpForm.value['loanTerm' + j] !== '') {
          if (this.addLoanSimulationGrpForm.value['loanTerm' + j] > this.minTermValidationGrp[j] &&
            this.addLoanSimulationGrpForm.value['loanTerm' + j] < this.maxTermValidationGrp[j]) {
            this.addLoanSimulationGrpForm.controls['loanTerm' + j].clearValidators();
          } else {
            this.limitMinTermValidationGrp[j] = this.addLoanSimulationGrpForm.value['loanTerm' + j] < this.minTermValidationGrp[j];
            this.limitMaxTermValidationGrp[j] = this.addLoanSimulationGrpForm.value['loanTerm' + j] > this.maxTermValidationGrp[j];
            this.addLoanSimulationGrpForm.controls['loanTerm' + j].setErrors({ invalid: true, message: '' });
          }
        }
      } else {
        if (this.addLoanSimulationGrpForm.controls['loanAmount' + j].value >= this.maxAmountValidationGrp[j]) {
          this.limitMaxAmountValidationGrp[j] = true;
        } else if (this.addLoanSimulationGrpForm.controls['loanAmount' + j].value <= this.minAmountValidationGrp[j]) {
          this.limitMinAmountValidationGrp[j] = true;
        }
        this.addLoanSimulationGrpForm.controls['loanAmount' + j].setErrors({ invalid: true, message: '' });
      }
    }
  }

  /**
   * resetValidation
   */
  resetValidationGrp(j) {
    const termMin = [];
    const termMax = [];
    const amountMin = [];
    const amountMax = [];
    this.product.productDetailsDTOs.forEach(element => {
      termMin.push(element.minimumTerm);
      termMax.push(element.maximumTerm);
      amountMin.push(element.minimumAmount);
      amountMax.push(element.maximumAmount);
    });
    this.addLoanSimulationGrpForm.controls['loanAmount' + j].clearValidators();
    if (this.addLoanSimulationGrpForm.controls['loanAmount' + j].value === null) {
      this.addLoanSimulationGrpForm.controls['loanAmount' + j].setErrors({ invalid: true, message: '' });
      this.limitMinAmountValidationGrp[j] = true;
    }
    this.minAmountValidationGrp[j] = Math.min(...amountMin);
    this.maxAmountValidationGrp[j] = Math.max(...amountMax);
    this.addLoanSimulationGrpForm.controls['loanTerm' + j].clearValidators();
    if (this.addLoanSimulationGrpForm.controls['loanTerm' + j].value === null) {
      this.addLoanSimulationGrpForm.controls['loanTerm' + j].setErrors({ invalid: true, message: '' });
      this.limitMinTermValidationGrp[j] = true;
    }
    this.minTermValidationGrp[j] = Math.min(...termMin);
    this.maxTermValidationGrp[j] = Math.max(...termMax);
  }

  /**
   * getMinMaxValueAmount
   */
  getMinMaxValueAmountCalculateGrp(j) {
    this.amountTrouvGrp[j] = false;
    let approvelAmount = 0;
    approvelAmount = this.addLoanSimulationGrpForm.controls['loanTerm' + j].value *
      this.addLoanSimulationGrpForm.controls['repayment' + j].value;
    if (this.addLoanSimulationGrpForm.controls['loanTerm' + j].value === '' ||
      this.addLoanSimulationGrpForm.controls['loanTerm' + j].value === null) {
      this.resetValidationGrp(j);
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      if (approvelAmount !== 0) {
        this.selectedProduct.productDetailsDTOs.forEach(element => {
          if ((this.addLoanSimulationGrpForm.controls['loanTerm' + j].value >= element.minimumTerm
            && this.addLoanSimulationGrpForm.controls['loanTerm' + j].value <= element.maximumTerm)
            && (approvelAmount >= element.minimumAmount && approvelAmount <= element.maximumAmount)) {
            this.amountTrouvGrp[j] = true;
            this.addLoanSimulationGrpForm.controls['loanAmount' + j].setValue(approvelAmount);
          }
        });
        if (!this.amountTrouvGrp[j]) {
          this.addLoanSimulationGrpForm.controls['loanAmount' + j].clearValidators();
          this.addLoanSimulationGrpForm.controls['loanAmount' + j].reset();
          this.addLoanSimulationGrpForm.controls['loanAmount' + j].setValidators([Validators.required,
          Validators.min(this.selectedProduct.minimumBalance), Validators.max(this.selectedProduct.maximumBalance)]);
          this.devToolsServices.openToast(3, 'alert.error_amount');
        }
      } else {
        const amountMin = [];
        const amountMax = [];
        this.selectedProduct.productDetailsDTOs.forEach(element => {
          if ((this.addLoanSimulationGrpForm.controls['loanTerm' + j].value >= element.minimumTerm
            && this.addLoanSimulationGrpForm.controls['loanTerm' + j].value <= element.maximumTerm)) {
            amountMin.push(element.minimumAmount);
            amountMax.push(element.maximumAmount);
            this.amountTrouvGrp[j] = true;
          }
        });
        this.addLoanSimulationGrpForm.controls['loanAmount' + j].setValidators([Validators.required,
        Validators.min(Math.min(...amountMin)),
        Validators.max(Math.max(...amountMax))]);
      }
    }
  }

  /**
   * getMinMaxValuTerm
   */
  getMinMaxValueTermCalculateGrp(j) {
    this.termTrouvGrp[j] = false;
    let approvalTerm = 0;
    approvalTerm = Math.round(this.addLoanSimulationGrpForm.controls['loanAmount' + j].value /
      this.addLoanSimulationGrpForm.controls['repayment' + j].value);
    if (this.addLoanSimulationGrpForm.controls['loanAmount' + j].value === '' ||
      this.addLoanSimulationGrpForm.controls['loanAmount' + j].value === null) {
      this.resetValidationGrp(j);
    } else if (this.selectedProduct.productDetailsDTOs.length > 0) {
      if (approvalTerm !== 0) {
        this.selectedProduct.productDetailsDTOs.forEach(element => {
          if ((this.addLoanSimulationGrpForm.controls['loanAmount' + j].value >= element.minimumAmount
            && this.addLoanSimulationGrpForm.controls['loanAmount' + j].value <= element.maximumAmount)
            && (approvalTerm >= element.minimumTerm && approvalTerm <= element.maximumTerm)) {
            this.termTrouvGrp[j] = true;
            this.addLoanSimulationGrpForm.controls['loanTerm' + j].setValue(approvalTerm);
          }
        });
        if (!this.termTrouvGrp[j]) {
          this.addLoanSimulationGrpForm.controls['loanTerm' + j].clearValidators();
          this.addLoanSimulationGrpForm.controls['loanTerm' + j].reset();
          this.addLoanSimulationGrpForm.controls['loanTerm' + j].setValidators([Validators.required,
          Validators.min(this.selectedProduct.minimumTerm), Validators.max(this.selectedProduct.maximumTerm)]);
          this.devToolsServices.openToast(3, 'alert.error_term');
        }
      } else {
        const termMin = [];
        const termMax = [];
        this.selectedProduct.productDetailsDTOs.forEach(element => {
          if (this.addLoanSimulationGrpForm.controls['loanAmount' + j].value >= element.minimumAmount
            && this.addLoanSimulationGrpForm.controls['loanAmount' + j].value <= element.maximumAmount) {
            termMin.push(element.minimumTerm);
            termMax.push(element.maximumTerm);
          }
        });
        this.addLoanSimulationGrpForm.controls['loanTerm' + j].setValidators([Validators.required,
        Validators.min(Math.min(...termMin)),
        Validators.max(Math.max(...termMax))]);
      }
    }
  }

  /**
   * checkMinMaxAmountTermCalculate
   */
  checkMinMaxAmountTermCalculateGrp(j) {
    this.termTrouvGrp[j] = false;
    this.amountTrouvGrp[j] = false;
    this.selectedProduct.productDetailsDTOs.forEach(element => {
      if ((this.addLoanSimulationGrpForm.controls['loanAmount' + j].value >= element.minimumAmount
        && this.addLoanSimulationGrpForm.controls['loanAmount' + j].value <= element.maximumAmount)
        && (this.addLoanSimulationGrpForm.controls['loanTerm' + j].value >= element.minimumTerm &&
          this.addLoanSimulationGrpForm.controls['loanTerm' + j].value <= element.maximumTerm)) {
        this.termTrouvGrp[j] = true;
        this.amountTrouvGrp[j] = true;
      }
    });
    if (!this.termTrouvGrp[j] && !this.amountTrouvGrp[j]) {
      this.resetValidationGrp(j);
    }
  }

  checkAgeForProduct() {
    if (checkOfflineMode()) return true;
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
  getInitialPaymentValueGrp(i: number) {
    const issueDate1: Date = new Date(this.addLoanSimulationGrpForm.controls['issueDate' + i].value);
    const initialPayment = issueDate1;
    initialPayment.setDate(issueDate1.getDate() + 30);
    this.addLoanSimulationGrpForm.controls['initialPayment' + i].setValue(this.datePipe.transform(initialPayment, 'yyyy-MM-dd'));
  }

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

  checkIssueDateGrp(indexMember: number) {
    const issueDate: Date = new Date(this.addLoanSimulationGrpForm.controls['issueDate' + indexMember].value);
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
    const issueDate1: Date = new Date(this.addLoanSimulationGrpForm.controls['issueDate' + indexMember].value);
    issueDate1.setDate(issueDate1.getDate() + 1);
    issueDate1.setHours(0, 0, 0, 0);
    const initialPayment: Date = new Date(this.addLoanSimulationGrpForm.controls['initialPayment' + indexMember].value);
    initialPayment.setHours(0, 0, 0, 0);
    if (initialPayment >= issueDate1) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.issue-payment');
      return false;
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

  checkDeferredPeriodGrp(indexMember: number) {
    const periodsDeferred: number = this.addLoanSimulationGrpForm.controls['periodsDeferred' + indexMember].value;
    if (periodsDeferred < this.addLoanForm.value.product.minimumDeferredPeriod ||
      periodsDeferred > this.addLoanForm.value.product.maximumDeferredPeriod) {
      this.devToolsServices.openToast(3, 'alert.error-periods-deferred');
      return false;
    } else {
      return true;
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
  setRenewalAmount() {
    // if there is renewal condition setting
    if (this.customerRenewalCondition !== null && Object.keys(this.customerRenewalCondition).length !== 0) {

      if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
        for (let i = 0; i < this.customerMembers.length; i++) {
          this.addLoanSimulationGrpForm.controls['loanAmount' + i].setValue('');
        }
      } else if (this.source !== 'ADD_ASSET') {
        this.addLoanSimulationIndivForm.controls.loanAmount.setValue('');
      }
      // check if there is an accepted request for this product
      if (this.acceptedException) {
        // the renewal amount will be the requested amount
        // determinate the min between the requested amount and the maximum product
        this.maximumAllowedAmount = Math.min(this.acceptedExceptionRequest.requestedAmount,
          this.selectedProduct.productDetailsDTOs[0].maximumAmount);
      } else {
        // calculate renewal amount based on percentage
        // renewal amount => (lastLoanAmout + lastLoanAmount*RenewalConditionPercentage )
        const renewalAmount =
          this.customerRenewalCondition.lastLoanAmount * ((this.customerRenewalCondition.renewalConditionDTO.pourcentage / 100) + 1);
        // determinate maximum allowed amount => Min(Maximum Product Amount, Calculated Renewal Amount)
        this.maximumAllowedAmount = Math.min(renewalAmount, this.selectedProduct.productDetailsDTOs[0].maximumAmount);
      }
      // set the new loan amount
      if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
        for (let i = 0; i < this.customerMembers.length; i++) {
          this.addLoanSimulationGrpForm.controls['loanAmount' + i].setValue(this.maximumAllowedAmount);
        }
      } else if (this.source !== 'ADD_ASSET') {
        this.addLoanSimulationIndivForm.controls.loanAmount.setValue(this.maximumAllowedAmount);
      }
    }
  }
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
    this.getMinMaxValueTerm();

  }
  fillAddLoanForm() {
    this.addLoanForm.controls.accountPortfolio.setValue(this.listPortfolio.find(
      portfolio => portfolio.portfolioId.toString() == this.loanEntity.portfolioId));
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
    if (this.currentAmount) {
      this.addLoanSimulationIndivForm.controls.loanAmount.setValue(this.currentAmount);
      this.addLoanSimulationIndivForm.controls.loanAmount.disable();
    } else {
      this.addLoanSimulationIndivForm.controls.loanAmount.setValue(this.loanEntity.applyAmountTotal);
      this.addLoanSimulationIndivForm.controls.loanAmount.enable();


    }
    //this.addLoanSimulationIndivForm.controls.loanAmount.setValue(this.loanEntity.applyAmountTotal);
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
    this.sharedService.setSupplier(null);
    this.router.navigate(['acm/add-asset'], { queryParams: { source: 'ADD_LOAN' } });
  }
  setLoanEntity() {
    this.loanEntity = new LoanEntity();
    this.loanEntity.portfolioCode = this.addLoanForm.controls.accountPortfolio.value !== undefined ?
      this.addLoanForm.controls.accountPortfolio.value.code : null;
    this.loanEntity.portfolioId = this.addLoanForm.controls.accountPortfolio.value !== undefined ?
      this.addLoanForm.controls.accountPortfolio.value.portfolioId : null;
    this.loanEntity.productId = this.addLoanForm.controls.product.value !== undefined ?
      this.addLoanForm.controls.product.value.id : null;
    this.loanEntity.loanAssetsDtos = [];
    if (this.listAssets !== undefined && this.listAssets.length !== 0) {
      this.loanEntity.loanAssetsDtos = this.listAssets;
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
    this.loanEntity.issueFeeAmount = this.issueFeeAmount;
    this.loanEntity.feeAmt1 = this.feeAmount;
    this.loanEntity.loanApplicationStatus = AcmConstants.NEW_APPLICATION;
    this.sharedService.setLoan(this.loanEntity);
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }

  calculRequired(event) {
    if (!event) {
      this.checkCalculate = true;
    }
  }
  async initListValues() {
    if (checkOfflineMode()) {

      const lists = await Promise.all([
        this.dbService.getByKey('data', 'financialInstrument').toPromise(),
        this.dbService.getByKey('data', 'financingType').toPromise(),
        this.dbService.getByKey('data', 'financingActivity').toPromise(),
        this.dbService.getByKey('data', 'financingNature').toPromise()
      ]);

      const instrumentList = lists[0] as any;
      const typeList = lists[1] as any;
      const activityList = lists[2] as any;
      const natureList = lists[3] as any;

      if (instrumentList === undefined) {
        this.devToolsServices.openToast(3, 'No financial instrument saved for offline use');
      } else {
        this.instrumentList = instrumentList.data;
      }

      if (typeList === undefined) {
        this.devToolsServices.openToast(3, 'No financing type saved for offline use');
      } else {
        this.typeList = typeList.data;
      }

      if (activityList === undefined) {
        this.devToolsServices.openToast(3, 'No financing activities saved for offline use');
      } else {
        this.activityList = activityList.data;
      }

      if (natureList === undefined) {
        this.devToolsServices.openToast(3, 'No financing nature saved for offline use');
      } else {
        this.natureList = natureList.data;
      }

    } else {
      this.settingsService.findProductFinanceList(AcmConstants.PRODUCT_INSTRUMENT).subscribe((data) => {
        this.instrumentList = data;
      });
      this.settingsService.findProductFilterList(AcmConstants.PRODUCT_TYPE).subscribe((data) => {
        this.typeList = data;
      });
      this.settingsService.findProductFilterList(AcmConstants.PRODUCT_ACTIVITY).subscribe((data) => {
        this.activityList = data;
      });
      this.settingsService.findProductFilterList(AcmConstants.PRODUCT_NATURE).subscribe((data) => {
        this.natureList = data;
      });
    }
  }

  onInstrumentChange(event: any) {
    const selectedIds = event.map((item: AssetTypeListDTO) => item.id);
    const uniqueIds = new Set<number>();

    this.filtredTypeList = this.typeList.filter(item => {
      const hasMatchingParent = item.id_parent.some(parentId => selectedIds.includes(parentId));
      if (hasMatchingParent && !uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
      }
      return false;
    });
    this.productFilter('instrument', selectedIds.join(","));
  }

  onProductChange(event: any) {
    const selectedIds = event.map((item: ProductTypeListDTO) => item.id);
    const uniqueIds = new Set<number>();

    this.filtredActivityList = this.activityList.filter(item => {
      const hasMatchingParent = item.id_parent.some(parentId => selectedIds.includes(parentId));
      if (hasMatchingParent && !uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
      }
      return false;
    });
    this.productFilter('productType', selectedIds.join(","));
  }

  onActivityChange(event: any) {
    const selectedIds = event.map((item: AssetTypeListDTO) => item.id);
    const uniqueIds = new Set<number>();

    this.filtredNatureList = this.natureList.filter(item => {
      const hasMatchingParent = item.id_parent.some(parentId => selectedIds.includes(parentId));
      if (hasMatchingParent && !uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
      }
      return false;
    });
    this.productFilter('activity', selectedIds.join(","));
  }

  onNatureChange(event: any) {
    const selectedIds = event.map((item: AssetTypeListDTO) => item.id);
    this.productFilter('nature', selectedIds.join(","));
  }

  async productFilter(field: string, value: string) {
    const product: ProductEntity = new ProductEntity();
    if (value === '') {
      delete this.filterValues[field];
    } else {
      this.filterValues[field] = value;
    }
    if (Object.keys(this.filterValues).length) {
      product.productFilter = new ProductFiltersEntity();
      for (const filterField in this.filterValues) {
        product.productFilter[filterField] = this.filterValues[filterField];
      }
    }
    const wrapper = new ProductCustomerEntity(product, this.sharedService.getCustomer());
    if (!checkOfflineMode()) {
      this.products = await this.loanManagementService.getEligibleProducts(wrapper).toPromise();
    } else {
      this.products = this.filterProductsOffline();
    }
  }
  filterProductsOffline(): ProductEntity[] {

    let filteredProducts = this.productsToFilter;

    Object.keys(this.filterValues).forEach(field => {
      const value = this.filterValues[field];
      filteredProducts = filteredProducts.filter(product => {
        if (product.productFilter && product.productFilter[field]) {
          return product.productFilter[field].toString().toLowerCase().includes(value.toLowerCase());
        }
        return false;
      });
    });

    return filteredProducts;
  }
  totalRepayementChanged() {
    // calculate required
    this.checkCalculate = true;
  }
  scheduleFlexibleChecked(event) {
    const check = event.target as HTMLInputElement;
    this.scheduleFlexibleIsChecked = check.checked;
  }
}
