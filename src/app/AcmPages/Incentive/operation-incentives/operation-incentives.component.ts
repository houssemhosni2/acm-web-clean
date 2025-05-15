import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { IncentiveOperationEntity } from 'src/app/shared/Entities/incentiveOperation.entity';
import { IncentiveOperationPaginationEntity } from 'src/app/shared/Entities/incentiveOperationPagination.entity';
import { IncentiveSettingConstantEntity } from 'src/app/shared/Entities/incentiveSettingConstant.entity';
import { IncentiveSettingRunEntity } from 'src/app/shared/Entities/incentiveSettingRun.entity';
import { ProductCategoryEntity } from 'src/app/shared/Entities/productCategory.entity';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { SettingsService } from '../../Settings/settings.service';
import { IncentiveService } from '../incentive.service';
import { OperationIncentivesService } from './operation-incentives.service';

@Component({
  selector: 'app-operation-incentives',
  templateUrl: './operation-incentives.component.html',
  styleUrls: ['./operation-incentives.component.sass']
})
export class OperationIncentivesComponent implements OnInit {
  public productEntitys: ProductCategoryEntity[] = [];
  public productEntity: ProductCategoryEntity;
  public productSelected = false;
  public frequencySelected = false;
  public groupeEntitys: GroupeEntity[] = [];
  public groupeEntity: GroupeEntity = new GroupeEntity();
  public operationIncentiveForm: FormGroup;
  public frequencies: IncentiveSettingConstantEntity[] = [];
  public incentiveTypes: IncentiveSettingConstantEntity[] = [];
  public operationsBasedOn: IncentiveSettingConstantEntity[] = [];
  public operations: IncentiveOperationEntity[] = [];
  public incentiveOperations: IncentiveOperationEntity[] = [];
  public frequency: IncentiveSettingConstantEntity;
  operationIndex = 0;
  public enabled;
  public pageSize = 5;
  public totalElements: number;
  public pageNumber: number;
  public incentiveSettingRunEntity: IncentiveSettingRunEntity;
  public disableBasedOn = true;
  public saveOperation = false;
  /**
   *
   * @param loanManagementService LoanManagementService
   * @param formBuilder FormBuilder
   * @param incentiveService IncentiveService
   * @param settingsService SettingsService
   * @param operationIncentivesService OperationIncentivesService
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public loanManagementService: LoanManagementService, public formBuilder: FormBuilder,
              public incentiveService: IncentiveService, public settingsService: SettingsService,
              public operationIncentivesService: OperationIncentivesService, public devToolsServices: AcmDevToolsServices) { }

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
          this.getIncentiveOperations();
        }
      });
    });
    // init form
    this.operationIncentiveForm = this.formBuilder.group({});
    // get roles
    this.getRoles();
    // get setting Status
    this.getSettingStatus();
  }
  /**
   * reload incentive operation by page number
   */
  reloadIncentiveOperations(event: number) {
    const incentiveOperationPaginationEntity = new IncentiveOperationPaginationEntity();
    incentiveOperationPaginationEntity.pageNumber = event - 1;
    incentiveOperationPaginationEntity.pageSize = this.pageSize;
    incentiveOperationPaginationEntity.params = new IncentiveOperationEntity();
    this.operationIndex = 0;
    this.operationIncentivesService.findPagination(incentiveOperationPaginationEntity).subscribe(
      (data) => {
        this.pageSize = data.pageSize;
        this.totalElements = data.totalElements;
        this.pageNumber = data.pageNumber + 1;
        this.incentiveOperations = [];
        if (data.totalElements > 0) {
          this.incentiveOperations = data.resultsIncentiveOperations;
          this.operations = [];
          this.operationIncentiveForm = this.formBuilder.group({});
          for (let i = 0; i < this.incentiveOperations.length; i++) {
            this.operationIndex = i;
            this.operations.push(this.incentiveOperations[i]);
            this.operationIncentiveForm.addControl('role' + this.operationIndex,
              new FormControl(this.incentiveOperations[i].role, Validators.required));
            this.operationIncentiveForm.addControl('incentiveType' + this.operationIndex,
              new FormControl(this.incentiveOperations[i].incentiveType, Validators.required));
            this.operationIncentiveForm.addControl('incentiveValue' + this.operationIndex,
              new FormControl(this.incentiveOperations[i].incentiveValue, Validators.required));
            this.operationIncentiveForm.addControl('basedOn' + this.operationIndex,
              new FormControl(this.incentiveOperations[i].basedOnId, Validators.required));
          }
        } else {
          this.operations.push(new IncentiveOperationEntity());
          this.createForm();

        }
      }
    );
  }
  /**
   * get status incentive by code setting
   */
  getSettingStatus() {
    const incentiveSettingRunEntity = new IncentiveSettingRunEntity();
    incentiveSettingRunEntity.code = AcmConstants.ACM_INCENTIVE_OPERATION;
    this.incentiveService.getStatusIncentiveSettingsByCode(incentiveSettingRunEntity).subscribe((data) => {
      this.incentiveSettingRunEntity = data;
    });
  }
  /**
   * select product
   * @param selectedValue product
   */
  selectProduct(selectedValue) {
    this.productEntity = selectedValue;
    this.enabled = selectedValue.incentiveOperation;
    this.productSelected = true;
    this.operationIncentiveForm = this.formBuilder.group({});
    this.operations = [];
    this.saveOperation = false;
    this.getIncentiveOperations();
  }
  /**
   * selected frequency
   * @param frequency frequency
   */
  selectFrequency(frequency) {
    this.frequency = frequency;
    this.frequencySelected = true;
    this.operationIncentiveForm = this.formBuilder.group({});
    this.operations = [];
    this.saveOperation = false;
    this.getIncentiveOperations();
  }
  /**
   * get Incentives Operations Settings
   */
  getIncentiveOperations() {
    const incentiveOperationPaginationEntity = new IncentiveOperationPaginationEntity();
    incentiveOperationPaginationEntity.pageSize = this.pageSize;
    incentiveOperationPaginationEntity.params = new IncentiveOperationEntity();
    if (this.productEntity !== null && this.productEntity !== undefined) {
      incentiveOperationPaginationEntity.params.productId = this.productEntity.id;
    }
    if (this.frequency !== null && this.frequency !== undefined) {
      const frequency = new IncentiveSettingConstantEntity();
      frequency.id = this.frequency.id;
      incentiveOperationPaginationEntity.params.frequency = frequency;
    }
    this.operationIndex = 0;
    this.operationIncentivesService.findPagination(incentiveOperationPaginationEntity).subscribe((data) => {
        this.pageSize = data.pageSize;
        this.totalElements = data.totalElements;
        this.pageNumber = data.pageNumber + 1;
        this.incentiveOperations = [];
        if (data.totalElements > 0) {
          this.incentiveOperations = data.resultsIncentiveOperations;
          for (let i = 0; i < this.incentiveOperations.length; i++) {
            this.operationIndex = i;
            this.operations.push(this.incentiveOperations[i]);
            this.operationIncentiveForm.addControl('role' + this.operationIndex,
              new FormControl(this.incentiveOperations[i].role, Validators.required));
            this.operationIncentiveForm.addControl('incentiveType' + this.operationIndex,
              new FormControl(this.incentiveOperations[i].incentiveType, Validators.required));
            this.operationIncentiveForm.addControl('incentiveValue' + this.operationIndex,
              new FormControl(this.incentiveOperations[i].incentiveValue, Validators.required));
            this.operationIncentiveForm.addControl('basedOn' + this.operationIndex,
              new FormControl(this.incentiveOperations[i].basedOnId, Validators.required));
          }
        } else {
          this.operations.push(new IncentiveOperationEntity());
          this.createForm();
        }
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
    await this.incentiveService.getProductCategories(productCategoryEntity).toPromise().then(((data) => {
      this.productEntitys = data;
      this.enabled = this.productEntitys[0].incentiveOperation;
    }
    ));
  }
  /**
   * load list of incentive settings constants
   */
  async getIncentiveConstantsSettingsbyCategories() {
    await this.incentiveService.findIncentiveSettingsConstantsByCategories(AcmConstants.INCENTIVE_SETTING_CONSTANTS_OPERATION)
      .toPromise().then((settingConstants) => {
        settingConstants.forEach((element) => {
          if (element.category === AcmConstants.ACM_INCENTIVE_OPERATION) {
            this.operationsBasedOn.push(element);
          } else if (element.category === AcmConstants.FREQUENCY) {
            this.frequencies.push(element);
          } else if (element.category === AcmConstants.INCENTIVE_SETTING_TYPE) {
            this.incentiveTypes.push(element);
          }
        });
      });
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
   * create operation form
   */
  createForm() {
    this.operationIncentiveForm = this.formBuilder.group({
      role0: ['', Validators.required],
      incentiveType0: ['', Validators.required],
      incentiveValue0: ['', Validators.required],
      basedOn0: ['', Validators.required],
    });
  }
  /**
   * add new operation Form
   */
  addOperation(scrollToNewOperation: HTMLDivElement) {
    setTimeout(() => {
      scrollToNewOperation.scrollIntoView({behavior: 'smooth'});
    }, 0);
    this.saveOperation = true;
    const newOperation = new IncentiveOperationEntity();
    this.operations.push(newOperation);
    this.operationIndex++;
    this.operationIncentiveForm.addControl('role' + this.operationIndex, new FormControl('', Validators.required));
    this.operationIncentiveForm.addControl('incentiveType' + this.operationIndex, new FormControl('', Validators.required));
    this.operationIncentiveForm.addControl('incentiveValue' + this.operationIndex, new FormControl('', Validators.required));
    this.operationIncentiveForm.addControl('basedOn' + this.operationIndex, new FormControl('', Validators.required));
  }

  /**
   * add / update operation
   * @param index index
   */
  saveOperationSettings(index) {
    // check the validity of operationForm
    this.devToolsServices.makeFormAsTouched(this.operationIncentiveForm);
    // CHECK THE UNIQUEINESS OF THE FIELDS
    if (this.operationIncentiveForm.valid) {
      // add new operation
      if (index >= this.incentiveOperations.length) {
        // create
        let  maxOrder = 0;
        if (this.incentiveOperations.length > 0) {
           maxOrder = Math.max.apply(Math, this.incentiveOperations.map((setting) => {
            return setting.ordre;
          }));
        }
        const newOrder = maxOrder + 1;
        const incentiveOperationEntity = new IncentiveOperationEntity();
        incentiveOperationEntity.frequency = this.frequency;
        incentiveOperationEntity.productId = this.productEntity.id;
        incentiveOperationEntity.ordre = newOrder;
        incentiveOperationEntity.role = this.operationIncentiveForm.controls['role' + index].value;
        incentiveOperationEntity.incentiveType = this.operationIncentiveForm.controls['incentiveType' + index].value;
        incentiveOperationEntity.incentiveValue = this.operationIncentiveForm.controls['incentiveValue' + index].value;
        incentiveOperationEntity.basedOnId = this.operationIncentiveForm.controls['basedOn' + index].value;

        this.operationIncentivesService.createOperationIncentive(incentiveOperationEntity).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.incentiveOperations.push(data);
          this.operations[this.operationIndex] = data;
          this.saveOperation = false;
        });
        // update operation
      } else {
        // update
        this.incentiveOperations[index].role = this.operationIncentiveForm.controls['role' + index].value;
        this.incentiveOperations[index].incentiveType = this.operationIncentiveForm.controls['incentiveType' + index].value;
        this.incentiveOperations[index].incentiveValue = this.operationIncentiveForm.controls['incentiveValue' + index].value;
        this.incentiveOperations[index].basedOnId = this.operationIncentiveForm.controls['basedOn' + index].value;
        this.operationIncentivesService.updateOperationIncentive(this.incentiveOperations[index]).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.incentiveOperations[index] = data;
        });
      }
    }
  }

  /**
   * delete Incentive Operation
   * @param index i
   */
  deleteIncentiveOperation(index) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.DELETE_INCENTIVE_SETTING)
      .afterClosed().subscribe(res => {
        if (res) {
          this.operations[index].delete = true;
          this.operationIncentiveForm.removeControl('basedOn' + index);
          this.operationIncentiveForm.removeControl('role' + index);
          this.operationIncentiveForm.removeControl('incentiveType' + index);
          this.operationIncentiveForm.removeControl('incentiveValue' + index);
          if (this.operations[index].id !== null && this.operations[index].id !== undefined) {
            this.operationIncentivesService.deleteOperationIncentive(this.operations[index].id).subscribe(
              () => {
                this.devToolsServices.openToast(0, 'alert.success');
              });
          }
        }
        this.saveOperation = false;
      });
  }
  /**
   * change status enabled/disabled by product
   */
  EnableDisableOperation() {
    // enable diable incentive operation type
    this.productEntity.incentiveOperation = this.enabled;
    this.incentiveService.updateProductCategory(this.productEntity).subscribe((data) => {
      this.devToolsServices.openToast(0, 'alert.success');
      this.enabled = data[0].enabled;
    });
  }
  /**
   * change basedOn value according to incentive type
   * @param event event
   * @param i index
   */
  onChangeIncentiveType(event , i) {
    let setBasedOn  = new IncentiveSettingConstantEntity();
    if (event.code === 'FIXED') {
      this.disableBasedOn = true;
      setBasedOn = this.operationsBasedOn.find(element => element.code === 'NB_ISSUED_LOANS');
      this.operationIncentiveForm.controls['basedOn' + i].setValue(setBasedOn);
    } else {
      setBasedOn = this.operationsBasedOn.find(element => element.code === 'TOTAL_ISSUED');
      this.operationIncentiveForm.controls['basedOn' + i].setValue(setBasedOn);
    }
  }
}
