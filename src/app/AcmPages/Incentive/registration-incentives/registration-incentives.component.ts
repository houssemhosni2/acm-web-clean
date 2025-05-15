import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { IncentiveRegistrationEntity } from 'src/app/shared/Entities/incentiveRegistration.entity';
import { IncentiveRegistrationPaginationEntity } from 'src/app/shared/Entities/IncentiveRegistrationPagination.entity';
import { IncentiveSettingConstantEntity } from 'src/app/shared/Entities/incentiveSettingConstant.entity';
import { IncentiveSettingRunEntity } from 'src/app/shared/Entities/incentiveSettingRun.entity';
import { ProductCategoryEntity } from 'src/app/shared/Entities/productCategory.entity';
import { SettingsService } from '../../Settings/settings.service';
import { IncentiveService } from '../incentive.service';
import { RegistrationIncentivesService } from './registration-incentives.service';

@Component({
  selector: 'app-registration-incentives',
  templateUrl: './registration-incentives.component.html',
  styleUrls: ['./registration-incentives.component.sass']
})
export class RegistrationIncentivesComponent implements OnInit {
  public productEntity: ProductCategoryEntity;
  public productEntitys: ProductCategoryEntity[] = [];
  public groupeEntitys: GroupeEntity[] = [];
  public groupeEntity: GroupeEntity = new GroupeEntity();
  public registrationIncentiveForm: FormGroup;
  public incetiveRegistrationEntity: IncentiveRegistrationEntity;
  public registrations: IncentiveRegistrationEntity[] = [];
  public incentiveRegistrations: IncentiveRegistrationEntity[] = [];
  public frequency: IncentiveSettingConstantEntity;
  public frequencies: IncentiveSettingConstantEntity[] = [];
  public incentiveTypes: IncentiveSettingConstantEntity[] = [];
  public registrationCustomerType: IncentiveSettingConstantEntity[] = [];
  public registrationsBasedOn: IncentiveSettingConstantEntity[] = [];
  registrationIndex = 0;
  public productSelected = false;
  public frequencySelected = false;
  public enabled;
  public status: boolean;
  public pageSize = 5;
  public totalElements: number;
  public pageNumber: number;
  public incentiveSettingRunEntity: IncentiveSettingRunEntity;
  public saveRegistration = false;

  /**
   *
   * @param loanManagementService LoanManagementService
   * @param incentiveService IncentiveService
   * @param formBuilder FormBuilder
   * @param settingsService SettingsService
   * @param registrationIncentivesService RegistrationIncentivesService
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public incentiveService: IncentiveService,
              public formBuilder: FormBuilder, public settingsService: SettingsService,
              public registrationIncentivesService: RegistrationIncentivesService,
              public devToolsServices: AcmDevToolsServices) { }

  ngOnInit() {
    // get product
    this.getProduct().then(() => {
      // get settings Constants for registration
      this.getIncentiveConstantsSettingsbyCategories().then(() => {
        if (this.frequencies.length > 0 && this.productEntitys.length > 0) {
          this.frequency = this.frequencies[0];
          this.frequencySelected = true;
          this.productEntity = this.productEntitys[0];
          this.productSelected = true;
          this.getIncentiveRegistrations();
        }
      });
    });
    this.registrationIncentiveForm = this.formBuilder.group({});
    // get roles
    this.getRoles();
    // get setting Status
    this.getSettingStatus();
  }

  /**
   * reload list of incentive settings
   * @param event page number
   */
  reloadIncentiveRegistrations(event: number) {
    const incentiveRegistrationPaginationEntity = new IncentiveRegistrationPaginationEntity();
    incentiveRegistrationPaginationEntity.pageNumber = event - 1;
    incentiveRegistrationPaginationEntity.pageSize = this.pageSize;
    incentiveRegistrationPaginationEntity.params = new IncentiveRegistrationEntity();
    this.registrationIndex = 0;
    this.registrationIncentivesService.findPagination(incentiveRegistrationPaginationEntity).subscribe(
      (data) => {
        this.pageSize = data.pageSize;
        this.totalElements = data.totalElements;
        this.pageNumber = data.pageNumber + 1;
        this.incentiveRegistrations = [];
        if (data.totalElements > 0) {
          this.incentiveRegistrations = data.resultsIncentiveRegistrations;
          this.registrations = [];
          this.registrationIncentiveForm = this.formBuilder.group({});
          for (let i = 0; i < this.incentiveRegistrations.length; i++) {
            this.registrationIndex = i;
            this.registrations.push(this.incentiveRegistrations[i]);
            this.registrationIncentiveForm.addControl('role' + this.registrationIndex,
              new FormControl(this.incentiveRegistrations[i].role, Validators.required));
            this.registrationIncentiveForm.addControl('customerType' + this.registrationIndex,
              new FormControl(this.incentiveRegistrations[i].customerType, Validators.required));
            this.registrationIncentiveForm.addControl('incentiveType' + this.registrationIndex,
              new FormControl(this.incentiveRegistrations[i].incentiveType, Validators.required));
            this.registrationIncentiveForm.addControl('incentiveValue' + this.registrationIndex,
              new FormControl(this.incentiveRegistrations[i].incentiveValue, Validators.required));
            this.registrationIncentiveForm.addControl('basedOn' + this.registrationIndex,
              new FormControl(this.incentiveRegistrations[i].basedOnId, Validators.required));
          }
        } else {
          this.registrations.push(new IncentiveRegistrationEntity());
          this.createForm();
        }
      }
    );
  }
  /**
   * get Incentive registration settings
   */
  getIncentiveRegistrations() {
    const incentiveRegistrationPaginationEntity = new IncentiveRegistrationPaginationEntity();
    incentiveRegistrationPaginationEntity.pageSize = this.pageSize;
    incentiveRegistrationPaginationEntity.params = new IncentiveRegistrationEntity();
    if (this.productEntity !== null && this.productEntity !== undefined) {
      incentiveRegistrationPaginationEntity.params.productId = this.productEntity.id;
    }
    if (this.frequency !== null && this.frequency !== undefined) {
      const frequency = new IncentiveSettingConstantEntity();
      frequency.id = this.frequency.id;
      incentiveRegistrationPaginationEntity.params.frequency = frequency;
    }
    this.registrationIndex = 0;
    this.registrationIncentivesService.findPagination(incentiveRegistrationPaginationEntity).subscribe(
        (data) => {
          this.pageSize = data.pageSize;
          this.totalElements = data.totalElements;
          this.pageNumber = data.pageNumber + 1;
          this.incentiveRegistrations = [];
          if (data.totalElements > 0) {
            this.incentiveRegistrations = data.resultsIncentiveRegistrations;
            for (let i = 0; i < this.incentiveRegistrations.length; i++) {
              this.registrationIndex = i;
              this.registrations.push(this.incentiveRegistrations[i]);
              this.registrationIncentiveForm.addControl('role' + this.registrationIndex,
                new FormControl(this.incentiveRegistrations[i].role, Validators.required));
              this.registrationIncentiveForm.addControl('customerType' + this.registrationIndex,
                new FormControl(this.incentiveRegistrations[i].customerType, Validators.required));
              this.registrationIncentiveForm.addControl('incentiveType' + this.registrationIndex,
                new FormControl(this.incentiveRegistrations[i].incentiveType, Validators.required));
              this.registrationIncentiveForm.addControl('incentiveValue' + this.registrationIndex,
                new FormControl(this.incentiveRegistrations[i].incentiveValue, Validators.required));
              this.registrationIncentiveForm.addControl('basedOn' + this.registrationIndex,
                new FormControl(this.incentiveRegistrations[i].basedOnId, Validators.required));
            }
          } else {
            if (this.incentiveRegistrations.length > 0) {
              this.registrationIncentiveForm = this.formBuilder.group({});
            } else {
              this.registrations.push(new IncentiveRegistrationEntity());
              this.createForm();
            }
          }

        }
      );

  }
  /**
   * get setting status TODO
   */
  getSettingStatus() {
    const incentiveSettingRunEntity = new IncentiveSettingRunEntity();
    incentiveSettingRunEntity.code = AcmConstants.ACM_INCENTIVE_REGESTRATION;
    this.incentiveService.getStatusIncentiveSettingsByCode(incentiveSettingRunEntity).subscribe((data) => {
      this.incentiveSettingRunEntity = data;
    });
  }
  /**
   * selected product
   * @param selectedValue product
   */
  selectProduct(selectedValue) {
    this.productEntity = selectedValue;
    this.enabled = selectedValue.incentiveRegistration;
    this.productSelected = true;
    this.registrationIncentiveForm = this.formBuilder.group({});
    this.registrations = [];
    this.saveRegistration = false;
    this.getIncentiveRegistrations();
  }
  /**
   * selected frequency
   * @param frequency frequency
   */
  selectFrequency(frequency) {
    this.frequency = frequency;
    this.frequencySelected = true;
    this.registrationIncentiveForm = this.formBuilder.group({});
    this.registrations = [];
    this.saveRegistration = false;
    this.getIncentiveRegistrations();
  }
  /**
   * load list of incentive settings constants
   */
  async getIncentiveConstantsSettingsbyCategories() {
   await this.incentiveService.findIncentiveSettingsConstantsByCategories(AcmConstants.INCENTIVE_SETTING_CONSTANTS_REGISTRATION)
      .toPromise().then((settingConstants) => {
        settingConstants.forEach((element) => {
          if (element.category === AcmConstants.ACM_INCENTIVE_REGESTRATION) {
            this.registrationsBasedOn.push(element);
          } else if (element.category === AcmConstants.FREQUENCY) {
            this.frequencies.push(element);
          } else if (element.category === AcmConstants.INCENTIVE_REGESTRATION_CUSTOMER_TYPE) {
            this.registrationCustomerType.push(element);
          } else if (element.category === AcmConstants.INCENTIVE_SETTING_TYPE) {
            this.incentiveTypes.push(element);
          }
        });
      });
  }

  /**
   * compareWith incentiveType
   * @param incentiveType1 incentiveType1
   * @param incentiveType2 incentiveType2
   */
  compareIncentiveType(incentiveType1, incentiveType2) {
    return incentiveType1.code === incentiveType2.code && incentiveType1.id === incentiveType2.id;
  }
  /**
   * compareWith customerType
   * @param customerType1 customerType1
   * @param customerType2 customerType2
   */
  compareCustomerType(customerType1, customerType2) {
    return customerType1.code === customerType2.code && customerType1.id === customerType2.id;
  }
  /**
   * compareWith basedOn
   * @param basedOn1 basedOn1
   * @param basedOn2 basedOn2
   */
  compareBasedOn(basedOn1, basedOn2) {
    return basedOn1.code === basedOn2.code && basedOn1.id === basedOn2.id;
  }
  /**
   * Get Product
   */
  async getProduct() {
    // get enabled product
    const productCategoryEntity = new ProductCategoryEntity();
    await this.incentiveService.getProductCategories(productCategoryEntity).toPromise().then((
      (data) => {
        this.productEntitys = data;
        this.enabled = this.productEntitys[0].incentiveRegistration;
      }
    ));
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
   * create registration form
   */
  createForm() {
    this.registrationIncentiveForm = this.formBuilder.group({
      role0: ['', Validators.required],
      customerType0: ['', Validators.required],
      incentiveType0: ['', Validators.required],
      incentiveValue0: ['', Validators.required],
      basedOn0: ['', Validators.required],
    });
  }
  /**
   * add new registration form
   */
  addRegistration(scrollToNewRegistration: HTMLDivElement) {
    this.saveRegistration = true;
    const newRegistration = new IncentiveRegistrationEntity();
    this.registrations.push(newRegistration);
    this.registrationIndex++;
    this.registrationIncentiveForm.addControl('role' + this.registrationIndex, new FormControl('', Validators.required));
    this.registrationIncentiveForm.addControl('customerType' + this.registrationIndex, new FormControl('', Validators.required));
    this.registrationIncentiveForm.addControl('incentiveType' + this.registrationIndex, new FormControl('', Validators.required));
    this.registrationIncentiveForm.addControl('incentiveValue' + this.registrationIndex, new FormControl('', Validators.required));
    this.registrationIncentiveForm.addControl('basedOn' + this.registrationIndex, new FormControl('', Validators.required));
    setTimeout(() => {
      scrollToNewRegistration.scrollIntoView({behavior: 'smooth'});
    }, 0);
  }
  /**
   * add / update registration
   * @param index index
   */
  saveRegistrationSettings(index) {
    // check the validity of registrationForm
    this.devToolsServices.makeFormAsTouched(this.registrationIncentiveForm);

    if (this.registrationIncentiveForm.valid) {

      // add new registration
      if (index >= this.incentiveRegistrations.length) {
        // create
        let  maxOrder = 0;
        if (this.incentiveRegistrations.length > 0) {
           maxOrder = Math.max.apply(Math, this.incentiveRegistrations.map((setting) => {
            return setting.ordre;
          }));
        }
        const newOrder = maxOrder + 1;
        const incentiveRegistrationEntity = new IncentiveRegistrationEntity();
        incentiveRegistrationEntity.frequency = this.frequency;
        incentiveRegistrationEntity.productId = this.productEntity.id;
        incentiveRegistrationEntity.ordre = newOrder;
        incentiveRegistrationEntity.role = this.registrationIncentiveForm.controls['role' + index].value;
        incentiveRegistrationEntity.customerType = this.registrationIncentiveForm.controls['customerType' + index].value;
        incentiveRegistrationEntity.incentiveType = this.registrationIncentiveForm.controls['incentiveType' + index].value;
        incentiveRegistrationEntity.incentiveValue = this.registrationIncentiveForm.controls['incentiveValue' + index].value;
        incentiveRegistrationEntity.basedOnId = this.registrationIncentiveForm.controls['basedOn' + index].value;

        this.registrationIncentivesService.createRegistrationIncentive(incentiveRegistrationEntity).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.incentiveRegistrations.push(data);
          this.registrations[this.registrationIndex] = data;
          this.saveRegistration = false;
        });
        // update registration
      } else {
        // update
        this.incentiveRegistrations[index].role = this.registrationIncentiveForm.controls['role' + index].value;
        this.incentiveRegistrations[index].customerType = this.registrationIncentiveForm.controls['customerType' + index].value;
        this.incentiveRegistrations[index].incentiveType = this.registrationIncentiveForm.controls['incentiveType' + index].value;
        this.incentiveRegistrations[index].incentiveValue = this.registrationIncentiveForm.controls['incentiveValue' + index].value;
        this.incentiveRegistrations[index].basedOnId = this.registrationIncentiveForm.controls['basedOn' + index].value;
        this.registrationIncentivesService.updateRegistrationIncentive(this.incentiveRegistrations[index]).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.incentiveRegistrations[index] = data;
        });
      }
    }
  }
  /**
   * delete Incentive Registration
   * @param index index
   */
  deleteIncentiveRegistration(index) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.DELETE_INCENTIVE_SETTING)
      .afterClosed().subscribe(res => {
        if (res) {
          this.registrations[index].delete = true;
          this.registrationIncentiveForm.removeControl('basedOn' + index);
          this.registrationIncentiveForm.removeControl('role' + index);
          this.registrationIncentiveForm.removeControl('customerType' + index);
          this.registrationIncentiveForm.removeControl('incentiveType' + index);
          this.registrationIncentiveForm.removeControl('incentiveValue' + index);
          if (this.registrations[index].id !== null && this.registrations[index].id !== undefined) {
            this.registrationIncentivesService.deleteRegistrationIncentive(this.registrations[index].id).subscribe(
              () => {
                this.devToolsServices.openToast(0, 'alert.success');
              });
          }
        }
        this.saveRegistration = false;
      });
  }
  /**
   * change status enabled/disabled by product
   */
  EnableDisableRegistration() {
    // enable diable incentive registration type
    this.productEntity.incentiveRegistration = this.enabled;
    this.incentiveService.updateProductCategory(this.productEntity).subscribe((data) => {
      this.devToolsServices.openToast(0, 'alert.success');
      this.enabled = data[0].enabled;
    });
  }
}
