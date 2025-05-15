import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TranslateService } from '@ngx-translate/core';
import { ChartOfAccountsService } from '../chart-of-accounts.service';
import { AcmJournalPagination } from 'src/app/shared/Entities/AcmJournalPagination.entity';
import { AcmJournal } from 'src/app/shared/Entities/AcmJournal.entity';
import { LazyLoadEvent } from 'primeng/api';
import { SettingsService } from '../../Settings/settings.service';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';
import { AcmGlAccount } from 'src/app/shared/Entities/AcmGlAccount.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserScreenPreferencesEntity } from 'src/app/shared/Entities/AcmUserScreenPreferences.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { SharedService } from 'src/app/shared/shared.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmCurrencySetting } from 'src/app/shared/Entities/acmCurrencySetting.entity';
import { CustomerPaginationEntity } from 'src/app/shared/Entities/customer.pagination.entity';
import { CustomerListService } from '../../Customer/customer-list/customer-list.service';
import { GedServiceService } from '../../GED/ged-service.service';
import { AcmGlAccountPagination } from 'src/app/shared/Entities/AcmGlAccountPagination.entity';
import { AdvancedSearchDTO } from 'src/app/shared/Entities/AdvancedSearchDTO.entity';

@Component({
  selector: 'app-receipt-view',
  templateUrl: './receipt-view.component.html',
  styleUrls: ['./receipt-view.component.sass']
})
export class ReceiptViewComponent implements OnInit {

  public pageSize: number;
  public page: number;
  public cols: any[];
  public acmJournalPagination: AcmJournalPagination = new AcmJournalPagination();
  public branchList: AcmBranches[] = [];
  public currencyList: AcmCurrencySetting[] = [];
  public formColumns: FormGroup;
  public advancedSearchForm: FormGroup;
  public selectedColumns: any[];
  public userScreenPreferencesEntity: UserScreenPreferencesEntity = new UserScreenPreferencesEntity();
  public customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();
  public acmGlAccountPagination: AcmGlAccountPagination = new AcmGlAccountPagination();

  public loanByCustomer: LoanEntity[] = [];
  public customerName: any;
  public accountNumber: string;
  public cutomerselectedInput = false;
  public loanFound = false;
  first: any;

  constructor(public translate: TranslateService, public library: FaIconLibrary,
    public chartOfAccountsService: ChartOfAccountsService, private fb: FormBuilder, public sharedService: SharedService,
    public settingsService: SettingsService, public devToolsServices: AcmDevToolsServices,
    public customerListService: CustomerListService, public gedService: GedServiceService) { }

  ngOnInit(): void {

    this.reset();

    this.formColumns = this.fb.group({
      selectedColumns: this.fb.array([])
    });

    this.settingsService.findBranches(new AcmBranches()).subscribe((res) => {
      this.branchList = res;
    })

    this.settingsService.findCurrencySetting(new AcmCurrencySetting()).toPromise().then((res) => {
      this.currencyList = res;
    })

    this.selectedColumns = [
      { field: 'receiptNumber', header: 'receipt-view.receipt-number' },
      { field: 'description', header: 'receipt-view.description' },
      { field: 'acmBranch', header: 'receipt-view.branch-name' },
      { field: 'customerName', header: 'receipt-view.customer-name' },
      { field: 'customerNumber', header: 'receipt-view.customer-number' },
      { field: 'accountNumber', header: 'receipt-view.account-number' },
      { field: 'loanStatus', header: 'receipt-view.loan-status' },
      { field: 'amount', header: 'receipt-view.amount' },
      { field: 'valueDate', header: 'receipt-view.value-date' },
      { field: 'drAccount', header: 'receipt-view.dr-account' },
      { field: 'crAccount', header: 'receipt-view.cr-account' },
    ]

    this.cols = this.selectedColumns;

    const userScreenPreferencesEntity: UserScreenPreferencesEntity = new UserScreenPreferencesEntity();
    userScreenPreferencesEntity.code = AcmConstants.RECEIPT_VIEW_TABLE_COLUMN_PREFERENCES;
    userScreenPreferencesEntity.ihmRoute = "receipt-view";
    userScreenPreferencesEntity.username = this.sharedService.getUser()?.login;
    this.settingsService.findUserScreenPreferences(userScreenPreferencesEntity).toPromise().then((res) => {
      if (res.length === 1) {
        this.selectedColumns = JSON.parse(res[0]?.value);
        this.userScreenPreferencesEntity = res[0];
      }
      const selectedColumnsFormArray = this.formColumns.get('selectedColumns') as FormArray;
      this.selectedColumns.forEach(col => {
        selectedColumnsFormArray.push(new FormControl(col));
      });
    })

    this.createForm();
  }

  createForm() {
    this.advancedSearchForm = this.fb.group({
      receiptNumber: [],
      valueDateFrom: [],
      valueDateTo: [],
      branchId: [],
      customerName: [],
      customerNumber: [],
      accountNumber: [],
      currencyId: [],
      acmGlAccount: []
    })
  }

  reloadJournalList(event: LazyLoadEvent) {
    // setting pageSize : event.rows = Number of rows per page
    this.acmJournalPagination.pageSize = event.rows * 2;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      this.acmJournalPagination.pageNumber = event.first;
    } else {
      this.acmJournalPagination.pageNumber = event.first / event.rows;
    }

    if (event.filters !== undefined) {
      this.acmJournalPagination.params.receiptNumber =
        event.filters.receiptNumber !== undefined
          ? event.filters.receiptNumber.value
          : this.advancedSearchForm.controls.receiptNumber.value;
      this.acmJournalPagination.params.description =
        event.filters.description !== undefined
          ? event.filters.description.value
          : null;
      this.acmJournalPagination.params.acmBranch.id =
        event.filters.acmBranch !== undefined
          ? event.filters.acmBranch.value
          : this.advancedSearchForm.controls.branchId.value;
      this.acmJournalPagination.params.acmLoan.customerDTO.customerName =
        event.filters.customerName !== undefined
          ? event.filters.customerName.value
          : this.advancedSearchForm.controls.customerName.value?.customerName;
      this.acmJournalPagination.params.acmLoan.customerDTO.customerNumber =
        event.filters.customerNumber !== undefined
          ? event.filters.customerNumber.value
          : this.advancedSearchForm.controls.customerNumber.value;
      this.acmJournalPagination.params.acmLoan.accountNumber =
        event.filters.accountNumber !== undefined
          ? event.filters.accountNumber.value
          : this.advancedSearchForm.controls.accountNumber.value;
      this.acmJournalPagination.params.acmLoan.statut =
        event.filters.loanStatus !== undefined
          ? event.filters.loanStatus.value
          : null;
      this.acmJournalPagination.params.amount =
        event.filters.amount !== undefined
          ? event.filters.amount.value
          : null;
      this.acmJournalPagination.params.valueDate =
        event.filters.valueDate !== undefined
          ? event.filters.valueDate.value
          : null;
      this.acmJournalPagination.params.acmGlAccount.accountNumber =
        event.filters.drAccount !== undefined
          ? event.filters.drAccount.value
          : this.advancedSearchForm.controls.acmGlAccount.value?.accountNumber;
      this.acmJournalPagination.params.credit =
        event.filters.drAccount !== undefined
          ? false
          : null;
      if (this.acmJournalPagination.params.acmGlAccount.accountNumber == null) {
        this.acmJournalPagination.params.acmGlAccount.accountNumber =
          event.filters.crAccount !== undefined
            ? event.filters.crAccount.value
            : this.advancedSearchForm.controls.acmGlAccount.value?.accountNumber;
        this.acmJournalPagination.params.credit =
          event.filters.crAccount !== undefined
            ? true
            : null;
      }

      if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
        this.acmJournalPagination.sortField =
          event.multiSortMeta[0].field;
        this.acmJournalPagination.sortDirection =
          event.multiSortMeta[0].order;
      }

    }

    this.chartOfAccountsService.findPaginationJournal(this.acmJournalPagination).subscribe((res) => {
      this.acmJournalPagination = res;
    })
  }

  colExists(col: any): boolean {
    const selectedColumns = this.formColumns.get('selectedColumns') as FormArray;

    return selectedColumns.value.some((selectedCol: any) => {
      return selectedCol.field === col.field && selectedCol.header === col.header;
    });
  }

  changeTableColumns(event: Event, col: any) {
    const isChecked = (event.target as HTMLInputElement).checked;

    const selectedColumns = this.formColumns.get('selectedColumns') as FormArray;

    if (isChecked) {
      selectedColumns.push(new FormControl(col));
    } else {
      const index = this.colIndex(col);
      selectedColumns.removeAt(index);
    }

    this.selectedColumns = selectedColumns.value;

  }

  colIndex(col: any): number {
    const selectedColumns = this.formColumns.get('selectedColumns') as FormArray;

    return selectedColumns.value.findIndex((selectedCol: any) => {
      return selectedCol.field === col.field && selectedCol.header === col.header;
    });
  }

  saveUserScreenPreferences(event) {

    if (!event) {
      if (this.userScreenPreferencesEntity.id) {
        this.userScreenPreferencesEntity.value = JSON.stringify(this.selectedColumns);
      }
      else {
        this.userScreenPreferencesEntity.username = this.sharedService.getUser()?.login;
        this.userScreenPreferencesEntity.ihmRoute = "receipt-view";
        this.userScreenPreferencesEntity.component = "TABLE";
        this.userScreenPreferencesEntity.value = JSON.stringify(this.selectedColumns);
        this.userScreenPreferencesEntity.code = AcmConstants.RECEIPT_VIEW_TABLE_COLUMN_PREFERENCES;
      }

      this.settingsService.saveUserScreenPreferences(this.userScreenPreferencesEntity).subscribe((res) => {
        this.userScreenPreferencesEntity = res;
      });
    }

  }


  exportexcel(): void {
    const acmJournalPagination: AcmJournalPagination =
      new AcmJournalPagination();

    // setting pageSize
    acmJournalPagination.pageSize = null;

    // setting pageNumber
    acmJournalPagination.pageNumber = 0;

    acmJournalPagination.params = this.acmJournalPagination.params;

    this.chartOfAccountsService.generateJournalExcelReport(acmJournalPagination).subscribe((res: any) => {
      const fileData = [res];
      const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      const formattedDate = new Date().toISOString().slice(0, 10);
      anchor.download = `RECEIPT_VIEW_${formattedDate}`;
      anchor.href = url;
      anchor.click();
      this.devToolsServices.openToast(0, 'alert.document_uploaded');
    });
  }

  filterCustmorname(event) {
    // init pagination params
    this.customerPaginationEntity.pageSize = 25;
    this.customerPaginationEntity.pageNumber = 0;
    this.customerPaginationEntity.params = new CustomerEntity();
    if (event.query.length >= 3) {
      this.customerPaginationEntity.params.customerName = event.query;

      this.customerListService.getCustomersPagination(this.customerPaginationEntity).subscribe(
        (data) => {
          this.customerPaginationEntity = data;
          this.customerPaginationEntity.resultsCustomers.forEach((element) => {
            element.customerNameNoPipe = this.sharedService.getCustomerName(element);
          });
        }
      );
    }
  }

  accountChange(event) {
    const param: LoanEntity = new LoanEntity();
    param.accountNumber = event.query;
    this.gedService.findLoanbyAccount(param).subscribe(
      (data) => {
        if (data.length > 0) {
          this.loanByCustomer = data;
        }
      });
  }

  glAccountChange(event) {
    this.acmGlAccountPagination.params = new AcmGlAccount();
    this.acmGlAccountPagination.pageNumber = 0;
    this.acmGlAccountPagination.pageSize = 25;
    if (event.query.length >= 2) {
      this.acmGlAccountPagination.params.accountNumber = event.query;

      this.chartOfAccountsService.findPaginationGlAccount(this.acmGlAccountPagination).toPromise().then((res) => {
        this.acmGlAccountPagination = res;
      })
    }
  }

  selectLoanByCustomer() {
    this.accountNumber = '';
    const param: LoanEntity = new LoanEntity();
    param.customerDTO = new CustomerEntity();
    if (this.customerName) {
      param.customerDTO.id = this.customerName.id;
    }
    else {
      param.customerDTO.customerNumber = this.advancedSearchForm.controls.customerNumber.value;
    }

    this.gedService.findLoanByCustumerDto(param.customerDTO).subscribe(
      (data) => {
        this.loanByCustomer = data;
        if (this.loanByCustomer.length > 0) {
          this.loanFound = true;
        }
      });

    this.cutomerselectedInput = true;
  }

  reset() {
    this.pageSize = 20;
    this.page = 0;

    this.acmJournalPagination.pageNumber = this.page;
    this.acmJournalPagination.pageSize = this.pageSize;

    this.acmJournalPagination.params = new AcmJournal();
    this.acmJournalPagination.params.acmBranch = new AcmBranches();
    this.acmJournalPagination.params.acmGlAccount = new AcmGlAccount();
    this.acmJournalPagination.params.acmLoan = new LoanEntity();
    this.acmJournalPagination.params.acmCurrencySetting = new AcmCurrencySetting();
    this.acmJournalPagination.params.acmLoan.customerDTO = new CustomerEntity();

  }

  resetForm() {
    this.cutomerselectedInput = false;
    this.customerName = null;
    this.reset();
    this.createForm();
  }

  onSubmit() {

    this.reset();

    if (this.advancedSearchForm.controls.receiptNumber.value) {
      this.acmJournalPagination.params.receiptNumber = this.advancedSearchForm.controls.receiptNumber.value;
    }
    if (this.advancedSearchForm.controls.branchId.value) {
      this.acmJournalPagination.params.acmBranch.id = this.advancedSearchForm.controls.branchId.value;
    }
    if (this.advancedSearchForm.controls.currencyId.value) {
      this.acmJournalPagination.params.acmCurrencySetting.id = this.advancedSearchForm.controls.currencyId.value;
    }
    if (this.advancedSearchForm.controls.customerName.value) {
      this.acmJournalPagination.params.acmLoan.customerDTO.customerName = this.advancedSearchForm.controls.customerName.value?.customerName;
    }
    if (this.advancedSearchForm.controls.customerNumber.value) {
      this.acmJournalPagination.params.acmLoan.customerDTO.customerNumber = this.advancedSearchForm.controls.customerNumber.value;
    }
    if (this.advancedSearchForm.controls.accountNumber.value) {
      this.acmJournalPagination.params.acmLoan.accountNumber = this.advancedSearchForm.controls.accountNumber.value;
    }
    if (this.advancedSearchForm.controls.acmGlAccount.value) {
      this.acmJournalPagination.params.acmGlAccount.accountNumber = this.advancedSearchForm.controls.acmGlAccount.value?.accountNumber;
      this.acmJournalPagination.params.credit = null;
    }

    if (this.advancedSearchForm.controls.valueDateFrom?.value || this.advancedSearchForm.controls.valueDateTo?.value) {
      this.acmJournalPagination.params.advancedSearchDTO = [];
      let advancedSearch: AdvancedSearchDTO = new AdvancedSearchDTO();
      advancedSearch.fieldKey = "valueDate";
      advancedSearch.min = this.advancedSearchForm.controls.valueDateFrom.value;
      advancedSearch.max = this.advancedSearchForm.controls.valueDateTo.value;
      this.acmJournalPagination.params.advancedSearchDTO.push(advancedSearch);
    }

    this.chartOfAccountsService.findPaginationJournal(this.acmJournalPagination).subscribe((res) => {
      this.acmJournalPagination = res;
      this.first = this.acmJournalPagination.pageNumber;
    })

  }

}
