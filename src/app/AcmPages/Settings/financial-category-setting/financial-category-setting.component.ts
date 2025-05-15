import { Component, OnInit, TemplateRef } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../settings.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FinancialCategory } from 'src/app/shared/Entities/AcmFinancialCategory.entity';
import { customRequiredValidator } from 'src/app/shared/utils';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { AcmFinancialCategoryPagination } from 'src/app/shared/Entities/AcmFinancialCategoryPagination.entity';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-financial-category-setting',
  templateUrl: './financial-category-setting.component.html',
  styleUrls: ['./financial-category-setting.component.sass']
})
export class FinancialCategorySettingComponent implements OnInit {

  public cols: any[];
  public pageSize: number;
  public page: number;

  public acmFinancialCategoryPagination: AcmFinancialCategoryPagination =
    new AcmFinancialCategoryPagination();

  public groupForm: FormGroup;
  public financialCategory: FinancialCategory;
  public financialCategoryList: FinancialCategory[];

  public levelNumber: number;
  public levelArray: any[];

  public levelParentList: FinancialCategory[];

  public action: string = "create";

  constructor(public translate: TranslateService, public library: FaIconLibrary, public modal: NgbModal,
    public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices, public settingsService: SettingsService,
    public customerManagementService: CustomerManagementService) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'code', header: 'setting.financial-category-setting.code' },
      { field: 'description', header: 'setting.financial-category-setting.description' },
      { field: 'category', header: 'setting.financial-category-setting.category' },
      { field: 'level', header: 'setting.financial-category-setting.level' },
      { field: 'parentLevelCode', header: 'setting.financial-category-setting.parent-level' },
    ]

    this.pageSize = 10;
    this.page = 0;

    this.acmFinancialCategoryPagination.params = new FinancialCategory();
    this.acmFinancialCategoryPagination.pageNumber = this.page;
    this.acmFinancialCategoryPagination.pageSize = this.pageSize;

    this.settingsService.findPaginationFinancialCategory(this.acmFinancialCategoryPagination).subscribe((res) => {
      this.acmFinancialCategoryPagination = res;
    })

    this.customerManagementService.getEnvirementValueByKey(AcmConstants.FINANCIAL_CATEGORIES_LEVEL_NUMBER).subscribe((data) => {
      this.levelNumber = parseInt(data.value);
      this.levelArray = new Array(this.levelNumber);
    })


  }

  async reloadFinancialCategoryList(event: LazyLoadEvent) {

    const acmFinancialCategoryPagination: AcmFinancialCategoryPagination =
      new AcmFinancialCategoryPagination();
    // setting pageSize : event.rows = Number of rows per page
    acmFinancialCategoryPagination.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      acmFinancialCategoryPagination.pageNumber = event.first;
    } else {
      acmFinancialCategoryPagination.pageNumber = event.first / event.rows;
    }

    const params: FinancialCategory =
      new FinancialCategory();

    if (event.filters !== undefined) {
      params.code =
        event.filters.code !== undefined
          ? event.filters.code.value
          : null;
      params.description =
        event.filters.description !== undefined
          ? event.filters.description.value
          : null;
      params.category =
        event.filters.category !== undefined
          ? event.filters.category.value
          : null;
      params.level =
        event.filters.level !== undefined
          ? event.filters.level.value
          : null;    
      params.parentLevelCode =
        event.filters.parentLevelCode !== undefined
          ? event.filters.parentLevelCode.value
          : null;
    }

    acmFinancialCategoryPagination.params = params;

    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      acmFinancialCategoryPagination.sortField =
        event.multiSortMeta[0].field;
      acmFinancialCategoryPagination.sortDirection =
        event.multiSortMeta[0].order;
    }

    this.settingsService.findPaginationFinancialCategory(acmFinancialCategoryPagination).subscribe((res) => {
      this.acmFinancialCategoryPagination = res;
    })

  }

  createForm(financialCategory: FinancialCategory) {
    if(financialCategory.idParentLevel){
      let param: FinancialCategory = new FinancialCategory();
      param.level = financialCategory.level - 1 ;
      this.settingsService.findFinancialCategories(param).toPromise().then((res) => {
        this.levelParentList = res;
      })
    }
    else {
      this.levelParentList = [];
    }

    this.groupForm = this.formBuilder.group({
      code: [financialCategory.code, [customRequiredValidator]],
      description: [financialCategory.description, [customRequiredValidator]],
      category: [financialCategory.category, [customRequiredValidator]],
      level: [financialCategory.level, [customRequiredValidator]],
      idParentLevel: [financialCategory.idParentLevel],
    });

  }

  onSubmit() {
    this.devToolsServices.makeFormAsTouched(this.groupForm);
    if (this.groupForm.valid) {
      this.financialCategory.code = this.groupForm.controls.code.value;
      this.financialCategory.description = this.groupForm.controls.description.value;
      this.financialCategory.category = this.groupForm.controls.category.value;
      this.financialCategory.level = this.groupForm.controls.level.value;
      this.financialCategory.idParentLevel = this.groupForm.controls.idParentLevel.value;

      this.settingsService.saveFinancialCategory(this.financialCategory).subscribe((res) => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.ngOnInit();
      })
    }
  }

  addFinancialCategory(modalContent: TemplateRef<any>) {
    this.action = "create";
    this.financialCategory = new FinancialCategory();
    this.createForm(this.financialCategory);
    this.modal.open(modalContent);
  }

  updateFinancialCategory(modalContent: TemplateRef<any>, financialCategory: FinancialCategory) {
    this.action = "update";
    this.financialCategory = financialCategory;
    this.createForm(this.financialCategory);
    this.modal.open(modalContent);
  }

  disableFinancialCategory(financialCategory: FinancialCategory) {
    this.financialCategory = financialCategory;
    this.financialCategory.enabled = false;
    this.devToolsServices.openConfirmDialogWithoutRedirect('setting.financial-category-setting.delete-financial-category-setting').afterClosed().subscribe(
      res => {
        if (res) {
          this.settingsService.saveFinancialCategory(this.financialCategory).subscribe((res) => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.ngOnInit();
          });
        }
      }
    );
  }
  onChange() {
    const selectedValue = parseInt(this.groupForm.controls.level.value);

    if (selectedValue !== 1) {


      let param: FinancialCategory = new FinancialCategory();
      param.level = selectedValue - 1;
      this.settingsService.findFinancialCategories(param).toPromise().then((res) => {
        this.levelParentList = res;

        this.groupForm.controls.idParentLevel.reset(null);
        if (this.levelParentList.length === 1) {
          // If the list has one item, automatically select it
          this.groupForm.controls.idParentLevel.setValue(this.levelParentList[0].id);
        }
        this.groupForm.controls.idParentLevel.setValidators([customRequiredValidator]);
        this.groupForm.controls.idParentLevel.updateValueAndValidity();

      })

    }
    else {
      this.groupForm.controls.idParentLevel.clearValidators();
      this.groupForm.controls.idParentLevel.reset();
      this.groupForm.controls.idParentLevel.updateValueAndValidity();
    }
  }

  closeModale() {
    this.modal.dismissAll();
  }

  getDirection() {
    return AppComponent.direction;
  }

}
