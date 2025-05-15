import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';
import { AcmCurrencySetting } from 'src/app/shared/Entities/acmCurrencySetting.entity';
import { FinancialCategory } from 'src/app/shared/Entities/AcmFinancialCategory.entity';
import { SettingsService } from '../../Settings/settings.service';
import { AcmGlAccount } from 'src/app/shared/Entities/AcmGlAccount.entity';
import { customPatternValidator, customRequiredValidator } from 'src/app/shared/utils';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { ChartOfAccountsService } from '../chart-of-accounts.service';
import { AcmGlAccountPagination } from 'src/app/shared/Entities/AcmGlAccountPagination.entity';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-gl-account',
  templateUrl: './gl-account.component.html',
  styleUrls: ['./gl-account.component.sass']
})
export class GlAccountComponent implements OnInit {

  public groupForm: FormGroup;

  public branchList: AcmBranches[] = [];
  public financialCategoryList: FinancialCategory[] = [];
  public currencyList: AcmCurrencySetting[] = [];

  public mainAccountList: AcmGlAccount[] = [];

  public normalAccount: string = AcmConstants.NORMAL_ACCOUNT;
  public memoAccount: string = AcmConstants.MEMO_ACCOUNT;

  public action: string = "create";

  public glAccount: AcmGlAccount;

  public lastLevel: number;
  public accountNumberPatern: string;
  public accountNumberExp;

  public pageSize: number;
  public page: number;
  public cols: any[];
  public acmGlAccountPagination: AcmGlAccountPagination = new AcmGlAccountPagination();

  constructor(public settingsService: SettingsService, public modal: NgbModal,
    private fb: FormBuilder, public translate: TranslateService, public library: FaIconLibrary
    , public devToolsServices: AcmDevToolsServices, public customerManagementService: CustomerManagementService,
    public chartOfAccountsService: ChartOfAccountsService) { }

  async ngOnInit() {

    await this.settingsService.findCurrencySetting(new AcmCurrencySetting()).toPromise().then((res) => {
      this.currencyList = res;
    })

    await this.customerManagementService.getEnvirementValueByKey(AcmConstants.FINANCIAL_CATEGORIES_LEVEL_NUMBER).toPromise().then((data) => {
      this.lastLevel = parseInt(data.value);
      let financialCategoryParam = new FinancialCategory();
      financialCategoryParam.level = this.lastLevel;
      this.settingsService.findFinancialCategories(financialCategoryParam).toPromise().then((res) => {
        this.financialCategoryList = res;
      })
    })

    await this.customerManagementService.getEnvirementValueByKey(AcmConstants.GL_ACCOUNT_NUMBER_PATTERN).toPromise().then((data) => {
      this.accountNumberPatern = data.value;
      this.accountNumberExp = new RegExp('\\b' + this.accountNumberPatern + '\\b');
    })

    await this.settingsService.findBranches(new AcmBranches()).toPromise().then((res) => {
      this.branchList = res;
    })

    // find main accounts
    let glAccountParam = new AcmGlAccount();
    glAccountParam.mainAccounts = true;
    await this.chartOfAccountsService.findGlAccount(glAccountParam).toPromise().then((res) => {
      this.mainAccountList = res;
    })

    // find pagination
    this.cols = [
      { field: 'accountNumber', header: 'gl-accounts.account-number' },
      { field: 'name', header: 'gl-accounts.name' },
      { field: 'description', header: 'gl-accounts.description' },
      { field: 'category', header: 'gl-accounts.category' },
      { field: 'accountType', header: 'gl-accounts.account-type' },

      { field: 'idMainAccount', header: 'gl-accounts.main-account' },
      { field: 'branchId', header: 'gl-accounts.branch' },
      { field: 'financialCategoryId', header: 'gl-accounts.financial-category' },
      { field: 'currencyId', header: 'gl-accounts.currency' }
    ]

    this.pageSize = 10;
    this.page = 0;

    this.acmGlAccountPagination.params = new AcmGlAccount();
    this.acmGlAccountPagination.pageNumber = this.page;
    this.acmGlAccountPagination.pageSize = this.pageSize;

    await this.chartOfAccountsService.findPaginationGlAccount(this.acmGlAccountPagination).toPromise().then((res) => {
      res?.results.map((item) => {
        item.currency = this.currencyList.find((currency) => currency.id === item.currencyId)?.symbol;
        item.branch = this.branchList.find((branch) => branch.id === item.branchId)?.name;
        item.financialCategory = this.financialCategoryList.find((category) => category.id === item.financialCategoryId)?.code;
        item.mainAccount = this.mainAccountList.find((account) => account.id === item.idMainAccount)?.accountNumber;
      })
      this.acmGlAccountPagination = res;
    })
  }

  reloadGlAccountList(event: LazyLoadEvent) {
    const acmGlAccountPagination: AcmGlAccountPagination = new AcmGlAccountPagination();

    // setting pageSize : event.rows = Number of rows per page
    acmGlAccountPagination.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      acmGlAccountPagination.pageNumber = event.first;
    } else {
      acmGlAccountPagination.pageNumber = event.first / event.rows;
    }

    const glAccountParam: AcmGlAccount = new AcmGlAccount();

    if (event.filters !== undefined) {

      glAccountParam.accountNumber =
        event.filters.accountNumber !== undefined
          ? event.filters.accountNumber.value
          : null;

      glAccountParam.name =
        event.filters.name !== undefined
          ? event.filters.name.value
          : null;

      glAccountParam.description =
        event.filters.description !== undefined
          ? event.filters.description.value
          : null;

      glAccountParam.category =
        event.filters.category !== undefined
          ? event.filters.category.value
          : null;

      glAccountParam.idMainAccount =
        event.filters.idMainAccount !== undefined
          ? parseInt(event.filters.idMainAccount.value)
          : null;

      glAccountParam.branchId =
        event.filters.branchId !== undefined
          ? parseInt(event.filters.branchId.value)
          : null;

      glAccountParam.currencyId =
        event.filters.currencyId !== undefined
          ? parseInt(event.filters.currencyId.value)
          : null;

      glAccountParam.financialCategoryId =
        event.filters.financialCategoryId !== undefined
          ? parseInt(event.filters.financialCategoryId.value)
          : null;

      glAccountParam.accountType =
        event.filters.accountType !== undefined
          ? event.filters.accountType.value
          : null;

    }

    acmGlAccountPagination.params = glAccountParam;

    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      acmGlAccountPagination.sortField =
        event.multiSortMeta[0].field;
      acmGlAccountPagination.sortDirection =
        event.multiSortMeta[0].order;
    }

    this.chartOfAccountsService.findPaginationGlAccount(acmGlAccountPagination).subscribe((res) => {
      res?.results.map((item) => {
        item.currency = this.currencyList.find((currency) => currency.id === item.currencyId)?.symbol;
        item.branch = this.branchList.find((branch) => branch.id === item.branchId)?.name;
        item.financialCategory = this.financialCategoryList.find((category) => category.id === item.financialCategoryId)?.code;
        item.mainAccount = this.mainAccountList.find((account) => account.id === item.idMainAccount)?.accountNumber;
      })
      this.acmGlAccountPagination = res;
    })

  }

  createForm(acmGlAccount: AcmGlAccount) {
    this.groupForm = this.fb.group({
      accountNumber: [acmGlAccount.accountNumber, [customRequiredValidator, customPatternValidator(this.accountNumberExp)]],
      name: [acmGlAccount.name, [customRequiredValidator]],
      description: [acmGlAccount.description, [customRequiredValidator]],
      category: [acmGlAccount.category, [customRequiredValidator]],
      idMainAccount: [acmGlAccount.idMainAccount],
      branchId: [acmGlAccount.branchId, [customRequiredValidator]],
      currencyId: [acmGlAccount.currencyId, [customRequiredValidator]],
      financialCategoryId: [acmGlAccount.financialCategoryId, [customRequiredValidator]],
      accountType: [acmGlAccount.accountType, [customRequiredValidator]],
      subAccounts: [acmGlAccount.subAccounts],
    });
  }

  closeModale() {
    this.modal.dismissAll();
  }

  getDirection() {
    return AppComponent.direction;
  }

  addGlAccount(modalContent: TemplateRef<any>) {
    this.action = "create";
    this.glAccount = new AcmGlAccount();
    this.glAccount.subAccounts = false;
    this.createForm(new AcmGlAccount());
    this.modal.open(modalContent);
  }

  editGlAccount(modalContent: TemplateRef<any>, glAccount: AcmGlAccount) {
    this.action = "update";
    this.glAccount = glAccount;
    this.createForm(glAccount);
    this.modal.open(modalContent);
  }

  disableGlAccount(glAccount: AcmGlAccount){
    this.glAccount = glAccount;
    this.glAccount.enabled = false;
    this.devToolsServices.openConfirmDialogWithoutRedirect('gl-accounts.delete-gl-accounts').afterClosed().subscribe(
      res => {
        if (res) {
          this.chartOfAccountsService.saveGlAccount(this.glAccount).subscribe((res)=> {
            this.devToolsServices.openToast(0, 'alert.success');
            this.ngOnInit();
          });
        }
      }
    );
  }

  onSubmit() {
    this.devToolsServices.makeFormAsTouched(this.groupForm);

    if (this.groupForm.valid) {
      this.glAccount.accountNumber = this.groupForm.controls.accountNumber.value;
      this.glAccount.name = this.groupForm.controls.name.value;
      this.glAccount.description = this.groupForm.controls.description.value;
      this.glAccount.category = this.groupForm.controls.category.value;

      this.glAccount.branchId = this.groupForm.controls.branchId.value;
      this.glAccount.currencyId = this.groupForm.controls.currencyId.value;
      this.glAccount.financialCategoryId = this.groupForm.controls.financialCategoryId.value;
      this.glAccount.accountType = this.groupForm.controls.accountType.value;
      this.glAccount.subAccounts = this.groupForm.controls.subAccounts.value;

      if (!this.glAccount.id) {
        if (this.glAccount.subAccounts === false) {
          this.glAccount.idMainAccount = this.groupForm.controls.idMainAccount.value;
        }
        else {
          this.glAccount.idMainAccount = null;
        }
      }
      else {
        this.glAccount.idMainAccount = this.groupForm.controls.idMainAccount.value;
      }
      
      this.chartOfAccountsService.saveGlAccount(this.glAccount).subscribe((res) => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.ngOnInit();
      })
    }
  }

}
