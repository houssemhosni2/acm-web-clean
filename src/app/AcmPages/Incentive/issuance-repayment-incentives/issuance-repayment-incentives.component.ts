import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { IncentiveBranchProdLevelEntity } from 'src/app/shared/Entities/incentiveBranchProdLevel.entity';
import { IncentiveRepaymentEntity } from 'src/app/shared/Entities/incentiveRepayment.entity';
import { IncentiveRepaymentPaginationEntity } from 'src/app/shared/Entities/incentiveRepaymentPagination.entity';
import { IncentiveSettingEntity } from 'src/app/shared/Entities/incentiveSetting.entity';
import { IncentiveSettingConstantEntity } from 'src/app/shared/Entities/incentiveSettingConstant.entity';
import { IncentiveSettingRunEntity } from 'src/app/shared/Entities/incentiveSettingRun.entity';
import { ProductCategoryEntity } from 'src/app/shared/Entities/productCategory.entity';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { SettingsService } from '../../Settings/settings.service';
import { IncentiveService } from '../incentive.service';
import { IssuanceRepaymentIncentivesService } from './issuance-repayment-incentives.service';

@Component({
  selector: 'app-issuance-repayment-incentives',
  templateUrl: './issuance-repayment-incentives.component.html',
  styleUrls: ['./issuance-repayment-incentives.component.sass']
})
export class IssuanceRepaymentIncentivesComponent implements OnInit {
  public productEntity: ProductCategoryEntity;
  public productEntitys: ProductCategoryEntity[] = [];
  public groupeEntitys: GroupeEntity[] = [];
  public groupeEntity: GroupeEntity = new GroupeEntity();
  public frequency: IncentiveSettingConstantEntity;
  public frequencies: IncentiveSettingConstantEntity[] = [];
  public incentiveSettings: IncentiveSettingEntity[] = [];
  public activeCustomerForm: FormGroup;
  public activeCustomers: IncentiveSettingEntity[] = [];
  public listActiveCustomers: IncentiveSettingEntity[] = [];
  public productivityForm: FormGroup;
  public productivities: IncentiveSettingEntity[] = [];
  public listProductivities: IncentiveSettingEntity[] = [];
  public riskLevelForm: FormGroup;
  public riskLevels: IncentiveSettingEntity[] = [];
  public listRiskLevels: IncentiveSettingEntity[] = [];
  public discountForm: FormGroup;
  public discounts: IncentiveSettingEntity[] = [];
  public listDiscounts: IncentiveSettingEntity[] = [];
  public incentiveSettingRunEntity: IncentiveSettingRunEntity;
  public branchProdForm: FormGroup;
  public branchProdLevels: IncentiveBranchProdLevelEntity[] = [];
  public listBranchProdLevels: IncentiveBranchProdLevelEntity[] = [];
  public incentiveRepayments: IncentiveRepaymentEntity[] = [];
  public repayments: IncentiveRepaymentEntity[] = [];
  public repaymentForm: FormGroup;
  public repaymentFilterForm: FormGroup;
  public incentiveTypes: IncentiveSettingConstantEntity[] = [];
  public repaymentsBasedOn: IncentiveSettingConstantEntity[] = [];
  activeCustomerIndex = 0;
  productivityIndex = 0;
  riskLevelIndex = 0;
  discountIndex = 0;
  branchIndex = 0;
  repaymentIndex = 0;
  public productSelected = false;
  public frequencySelected = false;
  public enabled;
  public applyDiscount;
  public applyBranch;
  public saveNewActive = false;
  public saveNewProductivity = false;
  public saveNewRisk = false;
  public saveNewDiscount = false;
  public saveBranchProd = false;
  public saveRepayment = false;
  public pageSize = 5;
  public page: number;
  public totalElements: number;
  public pageNumber: number;
  public repaymentEntity: IncentiveRepaymentEntity = new IncentiveRepaymentEntity();
  public search: boolean;
  constructor(public loanManagementService: LoanManagementService, public settingsService: SettingsService,
              public incentiveService: IncentiveService, public formBuilder: FormBuilder,
              public issuanceRepaymentService: IssuanceRepaymentIncentivesService,
              public devToolsServices: AcmDevToolsServices) { }

  ngOnInit() {
    // get product
    this.getProduct().then(() => {
      // get settings Constants for repayments
      this.getIncentiveConstantsSettingsbyCategories().then(() => {
        if (this.frequencies.length > 0 && this.productEntitys.length > 0) {
          this.frequency = this.frequencies[0];
          this.frequencySelected = true;
          this.productEntity = this.productEntitys[0];
          this.productSelected = true;
          this.activeCustomerForm = this.formBuilder.group({});
          this.productivityForm = this.formBuilder.group({});
          this.riskLevelForm = this.formBuilder.group({});
          this.discountForm = this.formBuilder.group({});
          this.branchProdForm = this.formBuilder.group({});
          this.repaymentForm = this.formBuilder.group({});
          this.repaymentFilterForm = this.formBuilder.group({});
          this.getActiveCustomers();
          this.getProdictivity();
          this.getRiskLevel();
          this.getDiscounts();
          this.getBranchProdLevels();
          this.getIssuanceAndRepayment();
          this.createFilterForm();
        }
      });
    });
    // load roles
    this.getRoles();
    // get Repayment Incentive Setting
    this.getSettingStatus();
  }
  /**
   * get status Repayment Setting
   */
  getSettingStatus() {
    const incentiveSettingRunEntity = new IncentiveSettingRunEntity();
    incentiveSettingRunEntity.code = AcmConstants.ACM_INCENTIVE_REPAYMENT;
    this.incentiveService.getStatusIncentiveSettingsByCode(incentiveSettingRunEntity).subscribe((data) => {
      this.incentiveSettingRunEntity = data;
      this.applyDiscount = this.incentiveSettingRunEntity.applayDiscountRule;
      this.applyBranch = this.incentiveSettingRunEntity.appalyBranchProdLevel;
    });
  }
  /**
   * selected product
   * @param selectedValue product
   */
  selectProduct(selectedValue) {
    this.productEntity = selectedValue;
    this.productSelected = true;
    this.enabled = selectedValue.incentiveRepayment;
    this.activeCustomerForm = this.formBuilder.group({});
    this.activeCustomers = [];
    this.productivityForm = this.formBuilder.group({});
    this.productivities = [];
    this.riskLevelForm = this.formBuilder.group({});
    this.riskLevels = [];
    this.discountForm = this.formBuilder.group({});
    this.discounts = [];
    this.branchProdLevels = [];
    this.branchProdForm = this.formBuilder.group({});
    this.repayments = [];
    this.repaymentForm = this.formBuilder.group({});
    this.repaymentFilterForm = this.formBuilder.group({});
    this.saveNewActive = false;
    this.saveNewProductivity = false;
    this.saveNewRisk = false;
    this.saveNewDiscount = false;
    this.saveBranchProd = false;
    this.saveRepayment = false;
    this.getActiveCustomers();
    this.getProdictivity();
    this.getRiskLevel();
    this.getDiscounts();
    this.getBranchProdLevels();
    this.getIssuanceAndRepayment();
    this.createFilterForm();
  }
  /**
   * selected frequency
   * @param frequency frequency
   */
  selectFrequency(frequency) {
    this.frequency = frequency;
    this.frequencySelected = true;
    this.activeCustomerForm = this.formBuilder.group({});
    this.activeCustomers = [];
    this.productivityForm = this.formBuilder.group({});
    this.productivities = [];
    this.riskLevelForm = this.formBuilder.group({});
    this.riskLevels = [];
    this.discountForm = this.formBuilder.group({});
    this.discounts = [];
    this.branchProdLevels = [];
    this.branchProdForm = this.formBuilder.group({});
    this.repayments = [];
    this.repaymentForm = this.formBuilder.group({});
    this.saveNewActive = false;
    this.saveNewProductivity = false;
    this.saveNewRisk = false;
    this.saveNewDiscount = false;
    this.saveBranchProd = false;
    this.saveRepayment = false;
    this.repaymentFilterForm = this.formBuilder.group({});
    this.saveNewActive = false;
    this.saveNewProductivity = false;
    this.saveNewRisk = false;
    this.saveNewDiscount = false;
    this.saveBranchProd = false;
    this.saveRepayment = false;
    this.getActiveCustomers();
    this.getProdictivity();
    this.getRiskLevel();
    this.getDiscounts();
    this.getBranchProdLevels();
    this.getIssuanceAndRepayment();
    this.createFilterForm();
  }
  /**
   * get Products
   */
  async getProduct() {
    // get enabled product
    const productCategoryEntity = new ProductCategoryEntity();
    await this.incentiveService.getProductCategories(productCategoryEntity).toPromise().then(
      (data) => {
        this.productEntitys = data;
        this.enabled = this.productEntitys[0].incentiveRepayment;
      }
    );
  }
  /**
   * get roles
   */
  getRoles() {
    this.settingsService.findGroup(this.groupeEntity).subscribe(
      (data) => {
        this.groupeEntitys = data;
      }
    );
  }
  /**
   * load list of incentive settings constants
   */
  async getIncentiveConstantsSettingsbyCategories() {
    await this.incentiveService.findIncentiveSettingsConstantsByCategories(AcmConstants.INCENTIVE_SETTING_CONSTANTS_ISSUANCE_REPAYMENT)
      .toPromise().then((settingConstants) => {
        settingConstants.forEach((element) => {
          if (element.category === AcmConstants.ACM_INCENTIVE_REPAYMENT) {
            this.repaymentsBasedOn.push(element);
          } else if (element.category === AcmConstants.FREQUENCY) {
            this.frequencies.push(element);
          } else if (element.category === AcmConstants.INCENTIVE_SETTING_TYPE) {
            this.incentiveTypes.push(element);
          }
        });
      });
  }

  // ACTIVE CUSTOMER SETTINGS

  /**
   * create form ACTIVE CUSTOMER
   */
  createFormActiveCustomer() {
    this.activeCustomerForm = this.formBuilder.group({
      from0: ['', Validators.required],
      to0: ['', Validators.required]
    });
  }
  /**
   * get list active customers
   */
  async getActiveCustomers() {

    const incentiveSettingEntity = new IncentiveSettingEntity();
    incentiveSettingEntity.category = AcmConstants.ACTIVE_CUSTOMER;
    if (this.productEntity !== null && this.productEntity !== undefined) {
      incentiveSettingEntity.productId = this.productEntity.id;
    }
    if (this.frequency !== null && this.frequency !== undefined) {
      const frequency = new IncentiveSettingConstantEntity();
      frequency.id = this.frequency.id;
      incentiveSettingEntity.frequency = frequency;
    }
    if (this.frequencySelected && this.productSelected) {
      this.activeCustomerIndex = 0;
      await this.incentiveService.getIncentiveSettings(incentiveSettingEntity).subscribe((data) => {


        if (data.length > 0) {
          this.listActiveCustomers = data;
          for (let i = 0; i < this.listActiveCustomers.length; i++) {
            this.activeCustomerIndex = i;
            // list of forms table of active customer (html)
            this.activeCustomers.push(this.listActiveCustomers[i]);
            this.activeCustomerForm.addControl('from' + this.activeCustomerIndex,
              new FormControl(this.listActiveCustomers[i].from, Validators.required));
            this.activeCustomerForm.addControl('to' + this.activeCustomerIndex,
              new FormControl(this.listActiveCustomers[i].to, Validators.required));
          }
        } else {
          this.activeCustomers.push(new IncentiveSettingEntity());
          this.createFormActiveCustomer();
        }
      });
    }
  }
  /**
   * create form add new Active Customer
   */
  addActiveCustomer(scrollToNewActiveCustomer: HTMLDivElement) {
    setTimeout(() => {
      scrollToNewActiveCustomer.scrollIntoView({behavior: 'smooth'});
    }, 0);
    this.saveNewActive = true;
    const newActiveCustomer = new IncentiveSettingEntity();
    this.activeCustomers.push(newActiveCustomer);
    this.activeCustomerIndex++;
    this.activeCustomerForm.addControl('from' + this.activeCustomerIndex, new FormControl('', Validators.required));
    this.activeCustomerForm.addControl('to' + this.activeCustomerIndex, new FormControl('', Validators.required));
  }

  /**
   * CREATE or UPDATE ACTIVE CUSTOMER SETTING
   * @param index INDEX
   */
  saveActiveCustomer(index: number) {


    // check the validity of activeCustomerForm
    this.devToolsServices.makeFormAsTouched(this.activeCustomerForm);
    if (this.activeCustomerForm.valid) {
      // add new ACTIVE CUSTOMER
      if (this.activeCustomers[index].id === null || this.activeCustomers[index].id === undefined) {
        // create
        let  maxOrder = 0;
        if (this.listActiveCustomers.length > 0) {
           maxOrder = Math.max.apply(Math, this.listActiveCustomers.map((setting) => {
            return setting.ordre;
          }));
        }
        const newOrder = maxOrder + 1;
        const newActiveCustomerEntity = new IncentiveSettingEntity();
        newActiveCustomerEntity.frequency = this.frequency;
        newActiveCustomerEntity.productId = this.productEntity.id;
        newActiveCustomerEntity.category = 'ACTIVE_CUSTOMER';
        newActiveCustomerEntity.ordre = newOrder;
        newActiveCustomerEntity.from = this.activeCustomerForm.controls['from' + index].value;
        newActiveCustomerEntity.to = this.activeCustomerForm.controls['to' + index].value;
        const previousTo = this.listActiveCustomers[this.listActiveCustomers.length - 1].to;
        if (newActiveCustomerEntity.from < previousTo) {
          // from of the new setting should not be less then The max of the last setting
          this.activeCustomerForm.controls['from' + index].setValidators(
            [Validators.min(previousTo )]);
          return;
        } else {
          // the new setting interval [from to] should be correct
          if (newActiveCustomerEntity.from > newActiveCustomerEntity.to) {
            this.activeCustomerForm.controls['to' + index].setValidators(
              [Validators.min(newActiveCustomerEntity.from )]);
            return;
          }
        }
        this.incentiveService.createIncentiveSetting(newActiveCustomerEntity).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.listActiveCustomers.push(data);
          this.activeCustomers[index] = data;
          this.saveNewActive = false;
        });
        // update ACTIVE CUSTOMER
      } else {
        // update
        this.listActiveCustomers[index].from = this.activeCustomerForm.controls['from' + index].value;
        this.listActiveCustomers[index].to = this.activeCustomerForm.controls['to' + index].value;
        // check of the interval [FROM - TO]
        if(index>0){
        if (this.listActiveCustomers[index].from < this.listActiveCustomers[index - 1].to) {
          // from of the new setting should not be less then The max of the last setting
          this.activeCustomerForm.controls['from' + index].setValidators(
            [Validators.min(this.listActiveCustomers[index - 1].to )]);
          return;
        } else {
          // the new setting interval [from to] should be correct
          if (this.listActiveCustomers[index].from > this.listActiveCustomers[index].to) {
            this.activeCustomerForm.controls['to' + index].setValidators(
              [Validators.min(this.listActiveCustomers[index].from )]);
            return;
          } else if (index !== this.activeCustomerIndex) {
            if (this.listActiveCustomers[index].to > this.activeCustomerForm.controls['from' + (index + 1)].value) {
              this.activeCustomerForm.controls['to' + index].setValidators(
                [Validators.max(this.activeCustomerForm.controls['from' + (index + 1)].value )]);
              return;
            }
          }
        }}
        else{
          if (this.activeCustomerForm.controls['from'+ index].value <0 ) {

            this.activeCustomerForm.controls['from' + index].setValidators(
              [Validators.min(0)]);
            return;
          }

          if (this.listActiveCustomers[index].from > this.listActiveCustomers[index].to) {
            this.activeCustomerForm.controls['to' + index].setValidators(
              [Validators.min(this.listActiveCustomers[index].from )]);
            return;



        }}
        this.incentiveService.updateIncentiveSetting(this.listActiveCustomers[index]).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.listActiveCustomers[index] = data;
        });
      }
    }
  }
  /**
   * Delete ACTIVE CUSTOMER SETTING
   * @param index index
   */
  deleteActiveCustomer(index) {
    if (this.listActiveCustomers.length > 0) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.DELETE_INCENTIVE_SETTING)
        .afterClosed().subscribe(res => {
          if (res) {
            this.activeCustomers[index].delete = true;
            this.activeCustomerForm.removeControl('from' + index);
            this.activeCustomerForm.removeControl('to' + index);
            if (this.activeCustomers[index].id !== null && this.activeCustomers[index].id !== undefined) {
              this.incentiveService.deleteIncentiveSetting(this.activeCustomers[index].id).subscribe(
                () => {
                  this.activeCustomerForm = this.formBuilder.group({});
                  this.activeCustomers = [];
                  this.getActiveCustomers();
                  this.devToolsServices.openToast(0, 'alert.success');
                });
            }
            this.saveNewActive = false;
          }
        });
    } else {
      this.activeCustomers[index].delete = true;
      this.activeCustomerForm.removeControl('from' + index);
      this.activeCustomerForm.removeControl('to' + index);
      this.saveNewActive = false;
    }
  }

  // BLOCK PRODUCTIVITY SETTINGS

  /**
   * create form PRODUCTIVITY
   */
  createFormProdictivity() {
    this.productivityForm = this.formBuilder.group({
      from0: ['', Validators.required],
      to0: ['', Validators.required]
    });
  }
  /**
   * get list of productivity
   */
  async getProdictivity() {
    const incentiveSettingEntity = new IncentiveSettingEntity();
    // set category
    incentiveSettingEntity.category = AcmConstants.PRODUCTIVITY;
    // check if product selected
    if (this.productEntity !== null && this.productEntity !== undefined) {
      incentiveSettingEntity.productId = this.productEntity.id;
    }
    // check if fruequency selected
    if (this.frequency !== null && this.frequency !== undefined) {
      const frequency = new IncentiveSettingConstantEntity();
      frequency.id = this.frequency.id;
      incentiveSettingEntity.frequency = frequency;
    }
    // load list of prodictivity settings if product and frequency selected
    if (this.frequencySelected && this.productSelected) {
      this.productivityIndex = 0;
      await this.incentiveService.getIncentiveSettings(incentiveSettingEntity).subscribe((data) => {
        if (data.length > 0) {
          this.listProductivities = data;
          for (let i = 0; i < this.listProductivities.length; i++) {
            this.productivityIndex = i;
            // list of forms table of productivity (html)
            this.productivities.push(this.listProductivities[i]);
            this.productivityForm.addControl('from' + this.productivityIndex,
              new FormControl(this.listProductivities[i].from, Validators.required));
            this.productivityForm.addControl('to' + this.productivityIndex,
              new FormControl(this.listProductivities[i].to, Validators.required));
          }
        } else {
          this.productivities.push(new IncentiveSettingEntity());
          this.createFormProdictivity();
        }
      });
    }
  }
  /**
   * create form add productivity
   */
  addProductivity(scrollToNewProductivity: HTMLDivElement) {
    setTimeout(() => {
      scrollToNewProductivity.scrollIntoView({behavior: 'smooth'});
    }, 0);
    this.saveNewProductivity = true;
    const newProductivity = new IncentiveSettingEntity();
    this.productivities.push(newProductivity);
    this.productivityIndex++;
    this.productivityForm.addControl('from' + this.productivityIndex, new FormControl('', Validators.required));
    this.productivityForm.addControl('to' + this.productivityIndex, new FormControl('', Validators.required));
  }
  /**
   * CREATE or UPDATE PRODUCTIVITY SETTING
   * @param index index
   */
  saveProductivity(index) {
    // check the validity of productivity
    this.devToolsServices.makeFormAsTouched(this.productivityForm);
    if (this.productivityForm.valid) {
      // add new productivity
      if (index >= this.listProductivities.length) {
        // create
        let  maxOrder = 0;
        if (this.listProductivities.length > 0) {
           maxOrder = Math.max.apply(Math, this.listProductivities.map((setting) => {
            return setting.ordre;
          }));
        }
        const newOrder = maxOrder + 1;
        const newProductivityEntity = new IncentiveSettingEntity();
        newProductivityEntity.frequency = this.frequency;
        newProductivityEntity.productId = this.productEntity.id;
        newProductivityEntity.category = 'PRODUCTIVITY';
        newProductivityEntity.ordre = newOrder;
        newProductivityEntity.from = this.productivityForm.controls['from' + index].value;
        newProductivityEntity.to = this.productivityForm.controls['to' + index].value;
        // check validity of [From - To]
        const previousTo = this.listProductivities[this.listProductivities.length - 1].to;
        if (newProductivityEntity.from < previousTo) {
          // from of the new setting should not be less then The max of the last setting
          this.productivityForm.controls['from' + index].setValidators(
            [Validators.min(previousTo )]);
          return;
        } else {
          // the new setting interval [from to] should be correct
          if (newProductivityEntity.from > newProductivityEntity.to) {
            this.productivityForm.controls['to' + index].setValidators(
              [Validators.min(newProductivityEntity.from )]);
            return;
          }
        }

        this.incentiveService.createIncentiveSetting(newProductivityEntity).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.listProductivities.push(data);
          this.productivities[index] = data;
          this.saveNewProductivity = false;
        });
        // update productivity
      } else {

        // update
        this.listProductivities[index].from = this.productivityForm.controls['from' + index].value;
        this.listProductivities[index].to = this.productivityForm.controls['to' + index].value;
        // check of the interval [FROM - TO]
        if(index>0){
        if (this.listProductivities[index].from < this.listProductivities[index - 1].to) {
          // from of the new setting should not be less then The max of the last setting
          this.productivityForm.controls['from' + index].setValidators(
            [Validators.min(this.listProductivities[index - 1].to)]);
          return;
        } else {
          // the new setting interval [from to] should be correct
          if (this.listProductivities[index].from > this.listProductivities[index].to) {
            this.productivityForm.controls['to' + index].setValidators(
              [Validators.min(this.listProductivities[index].from )]);
            return;
          } else if (index !== this.productivityIndex) {
            if (this.listProductivities[index].to > this.productivityForm.controls['from' + (index + 1)].value) {
              this.productivityForm.controls['to' + index].setValidators(
                [Validators.max(this.productivityForm.controls['from' + (index + 1)].value )]);
              return;
            }
          }
        }}
        else {
          if (this.productivityForm.controls['from'+ index].value <0 ) {
              this.productivityForm.controls['from' + index].setValidators(
              [Validators.min(0)]);
            return;
          }
          if (this.listProductivities[index].from > this.listProductivities[index].to) {
            this.productivityForm.controls['to' + index].setValidators(
              [Validators.min(this.listProductivities[index].from )]);
            return;
        }
        }
        this.incentiveService.updateIncentiveSetting(this.listProductivities[index]).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.listProductivities[index] = data;
        });
      }
    }
  }
  /**
   * delete PRODUCTIVITY SETTING
   * @param index index
   */
  deleteProductivity(index) {
    if (this.listProductivities.length > 0) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.DELETE_INCENTIVE_SETTING)
        .afterClosed().subscribe(res => {
          if (res) {
            this.productivities[index].delete = true;
            this.productivityForm.removeControl('from' + index);
            this.productivityForm.removeControl('to' + index);
            if (this.productivities[index].id !== null && this.productivities[index].id !== undefined) {
              this.incentiveService.deleteIncentiveSetting(this.productivities[index].id).subscribe(
                () => {
                  this.productivityForm = this.formBuilder.group({});
                  this.productivities = [];
                  this.getProdictivity();
                  this.devToolsServices.openToast(0, 'alert.success');
                });
            }
            this.saveNewProductivity = false;
          }
        });
    } else {
      this.productivities[index].delete = true;
      this.productivityForm.removeControl('from' + index);
      this.productivityForm.removeControl('to' + index);
      this.saveNewProductivity = false;
    }
  }

  // BLOCK RISK LEVEL SETTINGS

  /**
   * create form RISK LEVEL
   */
  createFormRiskLevel() {
    this.riskLevelForm = this.formBuilder.group({
      from0: ['', Validators.required],
      to0: ['', Validators.required]
    });
  }
  /**
   * get list of risk levels
   */
  async getRiskLevel() {
    const incentiveSettingEntity = new IncentiveSettingEntity();
    // set category risk level
    incentiveSettingEntity.category = AcmConstants.RISK_LEVEL;
    // check if product selected
    if (this.productEntity !== null && this.productEntity !== undefined) {
      incentiveSettingEntity.productId = this.productEntity.id;
    }
    // check if fruequency selected
    if (this.frequency !== null && this.frequency !== undefined) {
      const frequency = new IncentiveSettingConstantEntity();
      frequency.id = this.frequency.id;
      incentiveSettingEntity.frequency = frequency;
    }
    // load list of risk level settings if product and frequency selected
    if (this.frequencySelected && this.productSelected) {
      this.riskLevelIndex = 0;
      await this.incentiveService.getIncentiveSettings(incentiveSettingEntity).subscribe((data) => {
        if (data.length > 0) {
          this.listRiskLevels = data;
          for (let i = 0; i < this.listRiskLevels.length; i++) {
            this.riskLevelIndex = i;
            // list of forms table of risk level (html)
            this.riskLevels.push(this.listRiskLevels[i]);
            this.riskLevelForm.addControl('from' + this.riskLevelIndex,
              new FormControl(this.listRiskLevels[i].from, Validators.required));
            this.riskLevelForm.addControl('to' + this.riskLevelIndex,
              new FormControl(this.listRiskLevels[i].to, Validators.required));
          }
        } else {
          this.riskLevels.push(new IncentiveSettingEntity());
          this.createFormRiskLevel();
        }
      });
    }
  }
  /**
   * create form add risk level
   */
  addRiskLevel(scrollToNewRisk: HTMLDivElement) {
    setTimeout(() => {
      scrollToNewRisk.scrollIntoView({behavior: 'smooth'});
    }, 0);
    this.saveNewRisk = true;
    const newRiskLevel = new IncentiveSettingEntity();
    this.riskLevels.push(newRiskLevel);
    this.riskLevelIndex++;
    this.riskLevelForm.addControl('from' + this.riskLevelIndex, new FormControl('', Validators.required));
    this.riskLevelForm.addControl('to' + this.riskLevelIndex, new FormControl('', Validators.required));
  }
  /**
   * CREATE or UPDATE RISK LEVEL SETTING
   * @param index INDEX
   */
  saveRiskLevel(index) {

    // check the validity of riskLevelForm
    this.devToolsServices.makeFormAsTouched(this.riskLevelForm);
    if (this.riskLevelForm.valid) {
      // add new RISK LEVEL
      if (index >= this.listRiskLevels.length) {
        // create
        let  maxOrder = 0;
        if (this.listRiskLevels.length > 0) {
           maxOrder = Math.max.apply(Math, this.listRiskLevels.map((setting) => {
            return setting.ordre;
          }));
        }
        const newOrder = maxOrder + 1;
        const newRiskLevelEntity = new IncentiveSettingEntity();
        newRiskLevelEntity.frequency = this.frequency;
        newRiskLevelEntity.productId = this.productEntity.id;
        newRiskLevelEntity.category = 'RISK_LEVEL';
        newRiskLevelEntity.ordre = newOrder;
        newRiskLevelEntity.from = this.riskLevelForm.controls['from' + index].value;
        newRiskLevelEntity.to = this.riskLevelForm.controls['to' + index].value;
        // check validity of [FROM - TO]
        const previousTo = this.listRiskLevels[this.listRiskLevels.length - 1].to;
        if (newRiskLevelEntity.from < previousTo) {
          // from of the new setting should not be less then The max of the last setting
          this.riskLevelForm.controls['from' + index].setValidators(
            [Validators.min(previousTo )]);
          return;
        } else {
          // the new setting interval [from to] should be correct
          if (newRiskLevelEntity.from > newRiskLevelEntity.to) {
            this.riskLevelForm.controls['to' + index].setValidators(
              [Validators.min(newRiskLevelEntity.from )]);
            return;
          }
        }
        this.incentiveService.createIncentiveSetting(newRiskLevelEntity).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.listRiskLevels.push(data);
          this.riskLevels[index] = data;
          this.saveNewRisk = false;
        });
        // update RISK LEVEL
      } else {
        // update

        this.listRiskLevels[index].from = this.riskLevelForm.controls['from' + index].value;
        this.listRiskLevels[index].to = this.riskLevelForm.controls['to' + index].value;
        // check of the interval [FROM - TO]
        if(index>0){
        if (this.listRiskLevels[index].from < this.listRiskLevels[index - 1].to) {
          // from of the new setting should not be less then The max of the last setting
          this.riskLevelForm.controls['from' + index].setValidators(
            [Validators.min(this.listRiskLevels[index - 1].to )]);
          return;
        } else {
          // the new setting interval [from to] should be correct
          if (this.listRiskLevels[index].from > this.listRiskLevels[index].to) {
            this.riskLevelForm.controls['to' + index].setValidators(
              [Validators.min(this.listRiskLevels[index].from )]);
            return;
          } else if (index !== this.riskLevelIndex) {
            if (this.listRiskLevels[index].to > this.riskLevelForm.controls['from' + (index + 1)].value) {
              this.riskLevelForm.controls['to' + index].setValidators(
                [Validators.max(this.riskLevelForm.controls['from' + (index + 1)].value )]);
              return;
            }
          }
        }}else {
          if (this.riskLevelForm.controls['from'+ index].value <0 ) {

            this.riskLevelForm.controls['from' + index].setValidators(
              [Validators.min(0)]);
            return;
          }

          if (this.listRiskLevels[index].from > this.listRiskLevels[index].to) {
            this.riskLevelForm.controls['to' + index].setValidators(
              [Validators.min(this.listRiskLevels[index].from )]);
            return;
        }
        }
        this.incentiveService.updateIncentiveSetting(this.listRiskLevels[index]).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.listRiskLevels[index] = data;
        });
      }
    }
  }
  /**
   * RISK LEVEL SETTING
   * @param index index
   */
  deleteRiskLevel(index) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.DELETE_INCENTIVE_SETTING)
      .afterClosed().subscribe(res => {
        if (res) {
          this.riskLevels[index].delete = true;
          this.riskLevelForm.removeControl('from' + index);
          this.riskLevelForm.removeControl('to' + index);
          if (this.riskLevels[index].id !== null && this.riskLevels[index].id !== undefined) {
            this.incentiveService.deleteIncentiveSetting(this.riskLevels[index].id).subscribe(
              () => {
                this.riskLevelForm = this.formBuilder.group({});
                this.riskLevels = [];
                this.getRiskLevel();
                this.devToolsServices.openToast(0, 'alert.success');
              });
          }
          this.saveNewRisk = false;
        }
  });
  }

  // BLOCK DISCOUNT SETTINGS

  /**
   * create form DISCOUNT
   */
  createFormDiscount() {
    this.discountForm = this.formBuilder.group({
      from0: ['', Validators.required],
      to0: ['', Validators.required],
      discount0: ['', Validators.required]
    });
  }

  /**
   * get list of discounts
   */
  async getDiscounts() {
    const incentiveSettingEntity = new IncentiveSettingEntity();
    // set category discounts
    incentiveSettingEntity.category = AcmConstants.DISCOUNT_FROM_TOTAL;
    // check if product selected
    if (this.productEntity !== null && this.productEntity !== undefined) {
      incentiveSettingEntity.productId = this.productEntity.id;
    }
    // check if fruequency selected
    if (this.frequency !== null && this.frequency !== undefined) {
      const frequency = new IncentiveSettingConstantEntity();
      frequency.id = this.frequency.id;
      incentiveSettingEntity.frequency = frequency;
    }
    // load list of risk level settings if product and frequency selected
    if (this.frequencySelected && this.productSelected) {
      this.discountIndex = 0;
      await this.incentiveService.getIncentiveSettings(incentiveSettingEntity).subscribe((data) => {
        if (data.length > 0) {
          this.listDiscounts = data;
          for (let i = 0; i < this.listDiscounts.length; i++) {
            this.discountIndex = i;
            // list of forms table of Discounts (html)
            this.discounts.push(this.listDiscounts[i]);
            this.discountForm.addControl('from' + this.discountIndex,
              new FormControl(this.listDiscounts[i].from, Validators.required));
            this.discountForm.addControl('to' + this.discountIndex,
              new FormControl(this.listDiscounts[i].to, Validators.required));
            this.discountForm.addControl('discount' + this.discountIndex,
              new FormControl(this.listDiscounts[i].discount, Validators.required));
          }
        } else {
          this.discounts.push(new IncentiveSettingEntity());
          this.createFormDiscount();
        }
      });
    }
  }
  /**
   * create form add discount
   */
  addDiscount(scrollToNewDiscount: HTMLDivElement) {
    setTimeout(() => {
      scrollToNewDiscount.scrollIntoView({behavior: 'smooth'});
    }, 0);
    this.saveNewDiscount = true;
    const newDiscount = new IncentiveSettingEntity();
    this.discounts.push(newDiscount);
    this.discountIndex++;
    this.discountForm.addControl('from' + this.discountIndex, new FormControl('', Validators.required));
    this.discountForm.addControl('to' + this.discountIndex, new FormControl('', Validators.required));
    this.discountForm.addControl('discount' + this.discountIndex, new FormControl('', Validators.required));
  }

  /**
   * CREATE or UPDATE DISCOUNT SETTING
   * @param index INDEX
   */
  saveDiscount(index) {

    // check the validity of discountForm
    this.devToolsServices.makeFormAsTouched(this.discountForm);

    if (this.discountForm.valid) {

      // add new DISCOUNT
      if (index >= this.listDiscounts.length) {
        // create
        let  maxOrder = 0;
        if (this.listDiscounts.length > 0) {
           maxOrder = Math.max.apply(Math, this.listDiscounts.map((setting) => {
            return setting.ordre;
          }));
        }
        const newOrder = maxOrder + 1;
        const newDiscountEntity = new IncentiveSettingEntity();
        newDiscountEntity.frequency = this.frequency;
        newDiscountEntity.productId = this.productEntity.id;
        newDiscountEntity.category = 'DISCOUNT_FROM_TOTAL';
        newDiscountEntity.ordre = newOrder;
        newDiscountEntity.from = this.discountForm.controls['from' + index].value;
        newDiscountEntity.to = this.discountForm.controls['to' + index].value;
        newDiscountEntity.discount = this.discountForm.controls['discount' + index].value;
        const previousTo = this.listDiscounts[this.listDiscounts.length - 1].to;
        if (newDiscountEntity.from < previousTo) {
          // from of the new setting should not be less then The max of the last setting
          this.discountForm.controls['from' + index].setValidators(
            [Validators.min(previousTo )]);
          return;
        } else {
          // the new setting interval [from to] should be correct
          if (newDiscountEntity.from > newDiscountEntity.to) {
            this.discountForm.controls['to' + index].setValidators(
              [Validators.min(newDiscountEntity.from  )]);
            return;
          }
        }
        this.incentiveService.createIncentiveSetting(newDiscountEntity).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.listDiscounts.push(data);
          this.discounts[index] = data;
          this.saveNewDiscount = false;
        });
        // update DISCOUNT
      } else {
        // update
        this.listDiscounts[index].from = this.discountForm.controls['from' + index].value;
        this.listDiscounts[index].to = this.discountForm.controls['to' + index].value;
        this.listDiscounts[index].discount = this.discountForm.controls['discount' + index].value;
        // check of the interval [FROM - TO]

        if (index>0){
        if (this.listDiscounts[index].from < this.listDiscounts[index - 1].to) {
          // from of the new setting should not be less then The max of the last setting
          this.discountForm.controls['from' + index].setValidators(
            [Validators.min(this.listDiscounts[index - 1].to )]);
          return;
        } else {
          // the new setting interval [from to] should be correct
          if (this.listDiscounts[index].from > this.listDiscounts[index].to) {
            this.discountForm.controls['to' + index].setValidators(
              [Validators.min(this.listDiscounts[index].from )]);
            return;
          } else if (index !== this.discountIndex) {
            if (this.listDiscounts[index].to > this.discountForm.controls['from' + (index + 1)].value) {
              this.discountForm.controls['to' + index].setValidators(
                [Validators.max(this.discountForm.controls['from' + (index + 1)].value )]);
              return;
            }
          }
        }}
        else{

            if (this.discountForm.controls['from'+ index].value <0 ) {

            this.discountForm.controls['from' + index].setValidators(
              [Validators.min(0)]);
            return;
          }

          if (this.listDiscounts[index].from > this.listDiscounts[index].to) {
            this.discountForm.controls['to' + index].setValidators(
              [Validators.min(this.listDiscounts[index].from )]);
            return;

        }}
        this.incentiveService.updateIncentiveSetting(this.listDiscounts[index]).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.listDiscounts[index] = data;
        });
      }
    }
  }
  /**
   * delete DISCOUNT SETTING
   * @param index index
   */
  deleteDiscount(index) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.DELETE_INCENTIVE_SETTING)
      .afterClosed().subscribe(res => {
        if (res) {
          this.discounts[index].delete = true;
          this.discountForm.removeControl('from' + index);
          this.discountForm.removeControl('to' + index);
          this.discountForm.removeControl('discount' + index);
          if (this.discounts[index].id !== null && this.discounts[index].id !== undefined) {
            this.incentiveService.deleteIncentiveSetting(this.discounts[index].id).subscribe(
              () => {
                this.discountForm = this.formBuilder.group({});
                this.discounts = [];
                this.getDiscounts();
                this.devToolsServices.openToast(0, 'alert.success');
              });
          }
          this.saveNewDiscount = false;
        }
      });
  }

  // BLOCK BRANCH PROD LEVELS

  /**
   * create Form Branch Prod
   */
  createFormBranchProd() {
    this.branchProdForm = this.formBuilder.group({
      role0: ['', Validators.required],
      minAmount0: ['', Validators.required],
      minCustomers0: ['', Validators.required]
    });
  }
  /**
   * GET list of branch prod levels settings
   */
  async getBranchProdLevels() {
    const incentiveBranchProdLevelEntity = new IncentiveBranchProdLevelEntity();
    // check if product selected
    if (this.productEntity !== null && this.productEntity !== undefined) {
      incentiveBranchProdLevelEntity.productId = this.productEntity.id;
    }
    // check if fruequency selected
    if (this.frequency !== null && this.frequency !== undefined) {
      const frequency = new IncentiveSettingConstantEntity();
      frequency.id = this.frequency.id;
      incentiveBranchProdLevelEntity.frequency = frequency;
    }
    // load list of risk level settings if product and frequency selected
    if (this.frequencySelected && this.productSelected) {
      this.branchIndex = 0;
      await this.issuanceRepaymentService.getBranchProdLevels(incentiveBranchProdLevelEntity).subscribe((data) => {
        if (data.length > 0) {
          this.listBranchProdLevels = data;
          for (let i = 0; i < this.listBranchProdLevels.length; i++) {
            this.branchIndex = i;
            // list of forms table of Branch Prod Levels (html)
            this.branchProdLevels.push(this.listBranchProdLevels[i]);
            this.branchProdForm.addControl('role' + this.branchIndex,
              new FormControl(this.listBranchProdLevels[i].role, Validators.required));
            this.branchProdForm.addControl('minAmount' + this.branchIndex,
              new FormControl(this.listBranchProdLevels[i].minAmount, Validators.required));
            this.branchProdForm.addControl('minCustomers' + this.branchIndex,
              new FormControl(this.listBranchProdLevels[i].minNumberCustomer, Validators.required));
          }
        } else {
          this.branchProdLevels.push(new IncentiveBranchProdLevelEntity());
          this.createFormBranchProd();
        }
      });
    }
  }
  /**
   * add new Form Branch Prod Level
   */
  addBranchProdLevel(scrollToNewBranchProd: HTMLDivElement) {
    setTimeout(() => {
      scrollToNewBranchProd.scrollIntoView({behavior: 'smooth', block: 'start' });
    }, 0);
    this.saveBranchProd = true;
    const newBranchProd = new IncentiveBranchProdLevelEntity();
    this.branchProdLevels.push(newBranchProd);
    this.branchIndex++;
    this.branchProdForm.addControl('role' + this.branchIndex, new FormControl('', Validators.required));
    this.branchProdForm.addControl('minAmount' + this.branchIndex, new FormControl('', Validators.required));
    this.branchProdForm.addControl('minCustomers' + this.branchIndex, new FormControl('', Validators.required));
  }
  /**
   * CREATE or UPDATE BRANCH PROD LEVEL SETTING
   * @param index index
   */
  saveBranchProdLevel(index) {
    // check the validity of branchProdForm
    this.devToolsServices.makeFormAsTouched(this.branchProdForm);
    if (this.branchProdForm.valid) {
      // add new BRANCH PROD LEVEL
      if (index >= this.listBranchProdLevels.length) {
        // create
        let  maxOrder = 0;
        if (this.listBranchProdLevels.length > 0) {
           maxOrder = Math.max.apply(Math, this.listBranchProdLevels.map((setting) => {
            return setting.ordre;
          }));
        }
        const newOrder = maxOrder + 1;
        const newBranchProd = new IncentiveBranchProdLevelEntity();
        newBranchProd.frequency = this.frequency;
        newBranchProd.productId = this.productEntity.id;
        newBranchProd.ordre = newOrder;
        newBranchProd.role = this.branchProdForm.controls['role' + index].value;
        newBranchProd.minAmount = this.branchProdForm.controls['minAmount' + index].value;
        newBranchProd.minNumberCustomer = this.branchProdForm.controls['minCustomers' + index].value;
        this.issuanceRepaymentService.createBranchProdLevel(newBranchProd).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.listBranchProdLevels.push(data);
          this.branchProdLevels[index] = data;
          this.saveBranchProd = false;
        });
        // update DISCOUNT
      } else {
        // update
        this.listBranchProdLevels[index].role = this.branchProdForm.controls['role' + index].value;
        this.listBranchProdLevels[index].minAmount = this.branchProdForm.controls['minAmount' + index].value;
        this.listBranchProdLevels[index].minNumberCustomer = this.branchProdForm.controls['minCustomers' + index].value;

        this.issuanceRepaymentService.updateBranchProdLevel(this.listBranchProdLevels[index]).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.listBranchProdLevels[index] = data;
        });
      }
    }
  }
  /**
   * delete Branch Prod Level
   * @param index index
   */
  deleteBranchProdLevel(index) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.DELETE_INCENTIVE_SETTING)
      .afterClosed().subscribe(res => {
        if (res) {
          this.branchProdLevels[index].delete = true;
          this.branchProdForm.removeControl('role' + index);
          this.branchProdForm.removeControl('minAmount' + index);
          this.branchProdForm.removeControl('minCustomers' + index);
          if (this.branchProdLevels[index].id !== null && this.branchProdLevels[index].id !== undefined) {
            this.issuanceRepaymentService.deleteBranchProdLevel(this.branchProdLevels[index].id).subscribe(
              () => {
                this.devToolsServices.openToast(0, 'alert.success');
              });
          }
          this.saveBranchProd = false;
        }
      });
  }

  // Block Issuance and Repayment Icentive Setting

  /**
   * create Form Repayment Setting
   */
  createFormRepayment() {
    this.repaymentForm = this.formBuilder.group({
      role0: ['', Validators.required],
      activeCustomer0: ['', Validators.required],
      productivity0: ['', Validators.required],
      riskLevel0: ['', Validators.required],
      incentiveType0: ['', Validators.required],
      incentiveValue0: ['', Validators.required],
      basedOn0: ['', Validators.required],
    });
  }
  /**
   * get pagination list of repayment incentive Settings
   */
  getIssuanceAndRepayment() {
    const incentiveRepaymentPaginationEntity = new IncentiveRepaymentPaginationEntity();
    incentiveRepaymentPaginationEntity.pageSize = this.pageSize;
    incentiveRepaymentPaginationEntity.params = new IncentiveRepaymentEntity();
    if (this.productEntity !== null && this.productEntity !== undefined) {
      incentiveRepaymentPaginationEntity.params.productId = this.productEntity.id;
    }
    if (this.frequency !== null && this.frequency !== undefined) {
      const frequency = new IncentiveSettingConstantEntity();
      frequency.id = this.frequency.id;
      incentiveRepaymentPaginationEntity.params.frequency = frequency;
    }
    if (this.frequencySelected && this.productSelected) {
      this.repaymentIndex = 0;
      this.issuanceRepaymentService.findPaginationRepayment(incentiveRepaymentPaginationEntity).subscribe(
        (data) => {
          this.pageSize = data.pageSize;
          this.totalElements = data.totalElements;
          this.pageNumber = data.pageNumber + 1;
          this.incentiveRepayments = [];
          if (data.totalElements > 0) {
            this.incentiveRepayments = data.resultsIncentiveRepayments;
            for (let i = 0; i < this.incentiveRepayments.length; i++) {
              this.repaymentIndex = i;
              this.repayments.push(this.incentiveRepayments[i]);
              this.repaymentForm.addControl('role' + this.repaymentIndex,
                new FormControl(this.incentiveRepayments[i].role, Validators.required));
              this.repaymentForm.addControl('activeCustomer' + this.repaymentIndex,
                new FormControl(this.incentiveRepayments[i].activeCustomerId, Validators.required));
              this.repaymentForm.addControl('productivity' + this.repaymentIndex,
                new FormControl(this.incentiveRepayments[i].productivityId, Validators.required));
              this.repaymentForm.addControl('riskLevel' + this.repaymentIndex,
                new FormControl(this.incentiveRepayments[i].riskLevelId, Validators.required));
              this.repaymentForm.addControl('incentiveType' + this.repaymentIndex,
                new FormControl(this.incentiveRepayments[i].incentiveType, Validators.required));
              this.repaymentForm.addControl('incentiveValue' + this.repaymentIndex,
                new FormControl(this.incentiveRepayments[i].incentiveValue, Validators.required));
              this.repaymentForm.addControl('basedOn' + this.repaymentIndex,
                new FormControl(this.incentiveRepayments[i].basedOnId, Validators.required));
            }
          } else {

              this.repayments.push(new IncentiveRepaymentEntity());
              this.createFormRepayment();

          }

        }
      );
    }
  }
  /**
   * reload list of repayment incentive by given page number
   * @param event page number
   */
  reloadRepaymentIncentive(event) {
    const incentiveRepaymentPaginationEntity = new IncentiveRepaymentPaginationEntity();
    incentiveRepaymentPaginationEntity.pageNumber = event - 1;
    incentiveRepaymentPaginationEntity.pageSize = this.pageSize;
    incentiveRepaymentPaginationEntity.params = this.repaymentEntity;
    this.repaymentIndex = 0;
    this.issuanceRepaymentService.findPaginationRepayment(incentiveRepaymentPaginationEntity).subscribe(
      (data) => {
        this.pageSize = data.pageSize;
        this.totalElements = data.totalElements;
        this.pageNumber = data.pageNumber + 1;
        this.incentiveRepayments = [];
        if (data.totalElements > 0) {
          this.incentiveRepayments = data.resultsIncentiveRepayments;
          this.repayments = [];
          this.repaymentForm = this.formBuilder.group({});
          for (let i = 0; i < this.incentiveRepayments.length; i++) {
            this.repaymentIndex = i;
            this.repayments.push(this.incentiveRepayments[i]);
            this.repaymentForm.addControl('role' + this.repaymentIndex,
              new FormControl(this.incentiveRepayments[i].role, Validators.required));
            this.repaymentForm.addControl('activeCustomer' + this.repaymentIndex,
              new FormControl(this.incentiveRepayments[i].activeCustomerId, Validators.required));
            this.repaymentForm.addControl('productivity' + this.repaymentIndex,
              new FormControl(this.incentiveRepayments[i].productivityId, Validators.required));
            this.repaymentForm.addControl('riskLevel' + this.repaymentIndex,
              new FormControl(this.incentiveRepayments[i].riskLevelId, Validators.required));
            this.repaymentForm.addControl('incentiveType' + this.repaymentIndex,
              new FormControl(this.incentiveRepayments[i].incentiveType, Validators.required));
            this.repaymentForm.addControl('incentiveValue' + this.repaymentIndex,
              new FormControl(this.incentiveRepayments[i].incentiveValue, Validators.required));
            this.repaymentForm.addControl('basedOn' + this.repaymentIndex,
              new FormControl(this.incentiveRepayments[i].basedOnId, Validators.required));
          }
        }
      }
    );
  }
  /**
   * add new repayment form
   */
  addRepayment(scrollToNewRepayment: HTMLDivElement) {
    setTimeout(() => {
      scrollToNewRepayment.scrollIntoView({behavior: 'smooth'});
    }, 0);
    this.saveRepayment = true;
    const newRepayment = new IncentiveRepaymentEntity();
    this.repayments.push(newRepayment);
    this.repaymentIndex++;
    this.repaymentForm.addControl('role' + this.repaymentIndex, new FormControl('', Validators.required));
    this.repaymentForm.addControl('activeCustomer' + this.repaymentIndex, new FormControl('', Validators.required));
    this.repaymentForm.addControl('productivity' + this.repaymentIndex, new FormControl('', Validators.required));
    this.repaymentForm.addControl('riskLevel' + this.repaymentIndex, new FormControl('', Validators.required));
    this.repaymentForm.addControl('incentiveType' + this.repaymentIndex, new FormControl('', Validators.required));
    this.repaymentForm.addControl('incentiveValue' + this.repaymentIndex, new FormControl('', Validators.required));
    this.repaymentForm.addControl('basedOn' + this.repaymentIndex, new FormControl('', Validators.required));

  }
  /**
   * Create Or Update Repayment Incentive
   * @param index index
   */
  saveRepaymentSettings(index) {
    // check the validity of registrationForm
    this.devToolsServices.makeFormAsTouched(this.repaymentForm);

    if (this.repaymentForm.valid) {

      // add new registration
      if (index >= this.incentiveRepayments.length) {
        // create
        let  maxOrder = 0;
        if (this.incentiveRepayments.length > 0) {
           maxOrder = Math.max.apply(Math, this.incentiveRepayments.map((setting) => {
            return setting.ordre;
          }));
        }
        const newOrder = maxOrder + 1;
        const incentiveRepaymentEntity = new IncentiveRepaymentEntity();
        incentiveRepaymentEntity.frequency = this.frequency;
        incentiveRepaymentEntity.productId = this.productEntity.id;
        incentiveRepaymentEntity.ordre = newOrder;
        incentiveRepaymentEntity.role = this.repaymentForm.controls['role' + index].value;
        incentiveRepaymentEntity.activeCustomerId = this.repaymentForm.controls['activeCustomer' + index].value;
        incentiveRepaymentEntity.productivityId = this.repaymentForm.controls['productivity' + index].value;
        incentiveRepaymentEntity.riskLevelId = this.repaymentForm.controls['riskLevel' + index].value;
        incentiveRepaymentEntity.incentiveType = this.repaymentForm.controls['incentiveType' + index].value;
        incentiveRepaymentEntity.incentiveValue = this.repaymentForm.controls['incentiveValue' + index].value;
        incentiveRepaymentEntity.basedOnId = this.repaymentForm.controls['basedOn' + index].value;

        this.issuanceRepaymentService.createIncentiveRepayment(incentiveRepaymentEntity).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.incentiveRepayments.push(data);
          this.repayments[this.repaymentIndex] = data;
          this.saveRepayment = false;
        });
        // update registration
      } else {
        // update
        this.incentiveRepayments[index].role = this.repaymentForm.controls['role' + index].value;
        this.incentiveRepayments[index].activeCustomerId = this.repaymentForm.controls['activeCustomer' + index].value;
        this.incentiveRepayments[index].productivityId = this.repaymentForm.controls['productivity' + index].value;
        this.incentiveRepayments[index].riskLevelId = this.repaymentForm.controls['riskLevel' + index].value;
        this.incentiveRepayments[index].incentiveType = this.repaymentForm.controls['incentiveType' + index].value;
        this.incentiveRepayments[index].incentiveValue = this.repaymentForm.controls['incentiveValue' + index].value;
        this.incentiveRepayments[index].basedOnId = this.repaymentForm.controls['basedOn' + index].value;
        this.issuanceRepaymentService.updateIncentiveRepayment(this.incentiveRepayments[index]).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.incentiveRepayments[index] = data;
        });
      }
    }
  }
  /**
   * delete Incentive Repayment
   * @param index index
   */
  deleteIncentiveRepayment(index) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.DELETE_INCENTIVE_SETTING)
      .afterClosed().subscribe(res => {
        if (res) {
          this.repayments[index].delete = true;
          this.repaymentForm.removeControl('role' + index);
          this.branchProdForm.removeControl('activeCustomer' + index);
          this.branchProdForm.removeControl('productivity' + index);
          this.repaymentForm.removeControl('riskLevel' + index);
          this.branchProdForm.removeControl('incentiveType' + index);
          this.branchProdForm.removeControl('incentiveValue' + index);
          this.repaymentForm.removeControl('basedOn' + index);
          if (this.repayments[index].id !== null && this.repayments[index].id !== undefined) {
            this.issuanceRepaymentService.deleteIncentiveRepayment(this.repayments[index].id).subscribe(
              () => {
                this.devToolsServices.openToast(0, 'alert.success');
              });
          }
          this.saveRepayment = false;
        }
      });
  }
  /**
   * Compare With Incentive Type
   * @param incentiveType1 incentiveType 1
   * @param incentiveType2 incentiveType 2
   */
  compareIncentiveType(incentiveType1, incentiveType2) {
    return incentiveType1.code === incentiveType2.code && incentiveType1.id === incentiveType2.id;
  }
  /**
   * Compare with Incentive Based On
   * @param basedOn1 basedOn 1
   * @param basedOn2 basedOn 2
   */
  compareBasedOn(basedOn1, basedOn2) {
    return basedOn1.code === basedOn2.code && basedOn1.id === basedOn2.id;
  }
  /**
   * changeStatusRepaymentSetting
   */
  changeStatusRepaymentSetting() {
    // enable diable incentive Isuuance Repayment type
    this.productEntity.incentiveRepayment = this.enabled;
    this.incentiveService.updateProductCategory(this.productEntity).subscribe((data) => {
      this.devToolsServices.openToast(0, 'alert.success');
      this.enabled = data[0].enabled;
    });
  }
  /**
   * apply discount rule
   */
  applyDiscountRule() {
    const updateApplyDiscount = new IncentiveSettingRunEntity();
    updateApplyDiscount.code = AcmConstants.ACM_INCENTIVE_REPAYMENT;
    updateApplyDiscount.applayDiscountRule = this.applyDiscount;
    this.issuanceRepaymentService.updateApplyDiscountOrBranch(updateApplyDiscount).subscribe((data) => {
      this.devToolsServices.openToast(0, 'alert.success');
    });
  }
  /**
   * apply branch rule
   */
  applyBranchRule() {
    const updateApplyDiscount = new IncentiveSettingRunEntity();
    updateApplyDiscount.code = AcmConstants.ACM_INCENTIVE_REPAYMENT;
    updateApplyDiscount.appalyBranchProdLevel = this.applyBranch;
    this.issuanceRepaymentService.updateApplyDiscountOrBranch(updateApplyDiscount).subscribe((data) => {
      this.devToolsServices.openToast(0, 'alert.success');
    });
  }
  /**
   * create form filter Issuance and repayment
   */
  createFilterForm() {
    this.repaymentFilterForm = this.formBuilder.group({
      role: [''],
      activeCustomer: [''],
      productivity: [''],
      riskLevel: [''],
      incentiveType: [''],
      basedOn: [''],
    });
  }
  /**
   * search criterias
   */
   onSubmit() {
    if (this.repaymentFilterForm.controls.role.value) {
      this.repaymentEntity.role = this.repaymentFilterForm.controls.role.value;
    }
    if (this.repaymentFilterForm.controls.activeCustomer.value || this.repaymentFilterForm.controls.activeCustomer.value === 0) {
      this.repaymentEntity.activeCustomerId = this.repaymentFilterForm.controls.activeCustomer.value;
    }
    if (this.repaymentFilterForm.controls.productivity.value || this.repaymentFilterForm.controls.productivity.value === 0) {
      this.repaymentEntity.productivityId = this.repaymentFilterForm.controls.productivity.value;
    }
    if (this.repaymentFilterForm.controls.riskLevel.value || this.repaymentFilterForm.controls.riskLevel.value === 0) {
      this.repaymentEntity.riskLevelId = this.repaymentFilterForm.controls.riskLevel.value;
    }
    if (this.repaymentFilterForm.controls.incentiveType.value || this.repaymentFilterForm.controls.incentiveType.value === 0) {
      this.repaymentEntity.incentiveType = this.repaymentFilterForm.controls.incentiveType.value;
    }
    if (this.repaymentFilterForm.controls.basedOn.value || this.repaymentFilterForm.controls.basedOn.value === 0) {
      this.repaymentEntity.basedOnId = this.repaymentFilterForm.controls.basedOn.value;
    }
    if (this.productEntity !== null && this.productEntity !== undefined) {
      this.repaymentEntity.productId = this.productEntity.id;
    }
    if (this.frequency !== null && this.frequency !== undefined) {
      const frequency = new IncentiveSettingConstantEntity();
      frequency.id = this.frequency.id;
      this.repaymentEntity.frequency = frequency;
    }
    this.repayments = [];
    this.repaymentForm = this.formBuilder.group({});
    this.reloadRepaymentIncentive(1);
  }
  /**
   * reset form search
   */
  reset() {
    this.pageSize = 5;
    this.page = 1;
    this.repaymentEntity = new IncentiveRepaymentEntity();
    this.repayments = [];
    this.repaymentForm = this.formBuilder.group({});
    this.getIssuanceAndRepayment();
    this.createFilterForm();
  }
}
