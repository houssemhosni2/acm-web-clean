import { UserScreenPreferencesEntity } from './../../../shared/Entities/AcmUserScreenPreferences.entity';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { SettingsService } from '../../Settings/settings.service';
import { CreditLineAccountPaginationEntity } from 'src/app/shared/Entities/CreditLineAccountPagination.entity';
import { CreditLineAccount } from 'src/app/shared/Entities/acmCreditLineAccount.entity';
import { CreditLineService } from '../credit-line.service';
import { LazyLoadEvent } from 'primeng/api';
import { UdfService } from '../../Loan-Application/udf/udf.service';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AddressSettingEntity } from 'src/app/shared/Entities/AddressSetting.entity';
import { CustomerAddressService } from 'src/app/AcmPages/Customer/customer-address/customer-address.service';
import { AdvancedSearchDTO } from 'src/app/shared/Entities/AdvancedSearchDTO.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { creditLineEntity } from 'src/app/shared/Entities/AcmCreditLine.entity';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CreditLineAssignmentProcessResponse } from 'src/app/shared/Entities/CreditLineAssignmentProcessResponse.entity';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AcmCreditLineAccountAssignment } from 'src/app/shared/Entities/AcmCreditLineAccountAssignment.entity';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-credit-line-account',
  templateUrl: './credit-line-account.component.html',
  styleUrls: ['./credit-line-account.component.sass']
})
export class CreditLineAccountComponent implements OnInit {

  @ViewChild('content1') content1!: TemplateRef<any>;

  public selectedColumns: any[] = [
    { field: 'accountStatus', header: 'credit-line-account.account-status' },
    { field: 'accountNumber', header: 'credit-line-account.account-number' },
    { field: 'customerId', header: 'credit-line-account.customer-id' },
    { field: 'active', header: 'credit-line-account.active' },
    { field: 'fullName', header: 'credit-line-account.full-name' },
    { field: 'issueDate', header: 'credit-line-account.issue-date' },
    { field: 'issueAmount', header: 'credit-line-account.issue-amount' },
    { field: 'loanTenure', header: 'credit-line-account.loan-tenure' },
    { field: 'outstanding', header: 'credit-line-account.outstanding' },
    { field: 'branchName', header: 'credit-line-account.branch-name' },
    { field: 'nationalId', header: 'credit-line-account.national-id' },
    { field: 'gender', header: 'credit-line-account.gender' },
    { field: 'lastPaymentDueDate', header: 'credit-line-account.last-payment-due-date' },
    { field: 'rating', header: 'credit-line-account.rating' },
    { field: 'delinquentDays', header: 'credit-line-account.delinquent-days' },
    { field: 'remainingInstallments', header: 'credit-line-account.remaining-installments' },
    { field: 'creditLineAssignments', header: 'credit-line.fund-name' }
  ];

  public cols: any[];

  formColumns: FormGroup;
  advancedSearchForm: FormGroup;

  public productEntitys: string[] = [];
  public displayMultiSelect: boolean = false;
  public formLoaded = false;
  public showAdvancedSearch: boolean = false;
  public educationLevelList: string[] = [];
  public familySituationList: string[] = [];
  public sectorList: string[] = [];
  public geographicAreaList: string[] = [];

  public pageSize: number;
  public page: number;
  public creditLineAccountPaginationEntity: CreditLineAccountPaginationEntity =
    new CreditLineAccountPaginationEntity();

  public selectedCreditLineAccount: CreditLineAccount[] = [];
  selectAll: boolean = false;

  public advancedSearchParam: CreditLineAccount = new CreditLineAccount();
  public userScreenPreferencesEntity: UserScreenPreferencesEntity = new UserScreenPreferencesEntity();
  public dropdownAutoClose = false;
  public creditLineList: string[] = [];
  public creditLineAssignList: creditLineEntity[] = [];


  public creditLine: creditLineEntity = null;
  public assignmentProcessResponse: CreditLineAssignmentProcessResponse;
  public unassignMode: boolean = false;

  public assignmentMode: boolean = false;

  public reportType: string;
  public acmCreditLineAccountAssignment: AcmCreditLineAccountAssignment = new AcmCreditLineAccountAssignment();

  public automaticAssignmentMode: boolean = false;
  public credit_line_accounts_path = "credit-line-accounts";


  constructor(public customerAddressService: CustomerAddressService, private fb: FormBuilder, public settingsService: SettingsService,
    public creditLineService: CreditLineService, public udfService: UdfService, public sharedService: SharedService,
    public modalService: NgbModal, public translate: TranslateService, public devToolsServices: AcmDevToolsServices,
    public dialog: MatDialog) {

  }

  async ngOnInit() {

    this.formColumns = this.fb.group({
      selectedColumns: this.fb.array([])
    });

    const userScreenPreferencesEntity: UserScreenPreferencesEntity = new UserScreenPreferencesEntity();
    userScreenPreferencesEntity.code = AcmConstants.CREDIT_LINE_ACCONTS_TABLE_COLUMN_PREFERENCES;
    userScreenPreferencesEntity.ihmRoute = "credit-line-account";
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

    this.cols = [
      { field: 'accountNumber', header: 'credit-line-account.account-number' },
      { field: 'accountStatus', header: 'credit-line-account.account-status' },
      { field: 'active', header: 'credit-line-account.active' },
      { field: 'customerId', header: 'credit-line-account.customer-id' },
      { field: 'adjustment', header: 'credit-line-account.adjustment' },
      { field: 'fullName', header: 'credit-line-account.full-name' },
      { field: 'age', header: 'credit-line-account.age' },
      { field: 'geographicArea', header: 'credit-line-account.geographic-area' },
      { field: 'issueDate', header: 'credit-line-account.issue-date' },
      { field: 'issueAmount', header: 'credit-line-account.issue-amount' },
      { field: 'loanTenure', header: 'credit-line-account.loan-tenure' },
      { field: 'outstanding', header: 'credit-line-account.outstanding' },
      { field: 'product', header: 'credit-line-account.product' },
      { field: 'branchName', header: 'credit-line-account.branch-name' },
      { field: 'nationalId', header: 'credit-line-account.national-id' },
      { field: 'gender', header: 'credit-line-account.gender' },
      { field: 'educationLevel', header: 'credit-line-account.education-level' },
      { field: 'socialStatus', header: 'credit-line-account.social-status' },
      { field: 'sector', header: 'credit-line-account.sector' },
      { field: 'rating', header: 'credit-line-account.rating' },
      { field: 'lastPaymentDueDate', header: 'credit-line-account.last-payment-due-date' },
      { field: 'remainingInstallments', header: 'credit-line-account.remaining-installments' },
      { field: 'delinquentDays', header: 'credit-line-account.delinquent-days' },
      { field: 'issuedInterest', header: 'credit-line-account.issued-interest' },
      { field: 'outstandingInterest', header: 'credit-line-account.outstanding-interest' },
      { field: 'assignmentStatus', header: 'credit-line-account.status' },
      { field: 'creditLineAssignments', header: 'credit-line.fund-name' },
    ]

    await this.settingsService.findAllProduct().toPromise().then((data) =>
      data.map((item) => this.productEntitys.push(item.description)))

    this.getUDFFieldsList();
    this.loadRegion();

    this.advancedSearchForm = this.fb.group({
      product: [],
      loanAmountFrom: [],
      loanAmountTo: [],
      loanTenure: [],
      issueDateFrom: [],
      issueDateTo: [],
      gender: [],
      accountStatus: [],
      nationalId: [],
      outstanding: [],
      sector: [],
      delinquentDays: [],
      remainingInstallments: [],
      issuedInterest: [],
      outstandingInterest: [],
      ageFrom: [],
      ageTo: [],
      educationLevel: [],
      socialStatus: [],
      geographicArea: [],
      creditLine: [],
      assignmentStatus: []
    });

    Object.keys(this.advancedSearchForm.controls).forEach(controlName => {
      this.advancedSearchForm.get(controlName).valueChanges.subscribe(() => {
        this.advancedSearch();
      });
    });

    // init pagination
    this.initPaginationAccounts()

    this.creditLineService.findAll().toPromise().then((res) => {
      this.creditLineAssignList = res ;
      res.map(item => this.creditLineList.push(item.fundName))
    })

    // get automatic assignment env variable
    const acmEnvironmentKeys: string[] = [AcmConstants.CREDIT_LINE_AUTOMATIC_ASSIGNMENT];
    this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
      if (environments[0].value === '1') {
        this.automaticAssignmentMode = true;
      }
    });

    this.formLoaded= true ;

  }

  initPaginationAccounts(){
    this.pageSize = 10;
    this.page = 0;

    this.creditLineAccountPaginationEntity.params = new CreditLineAccount();
    this.creditLineAccountPaginationEntity.pageSize = this.pageSize;
    this.creditLineAccountPaginationEntity.pageNumber = this.page;

    this.creditLineService.findCreditLineAccountPagination(this.creditLineAccountPaginationEntity)
      .subscribe((res) => {
        this.creditLineAccountPaginationEntity = res;
      })
  }

  // Pagination + Sort + filter
  async reloadCreditLineAccountList(event: LazyLoadEvent) {
    const creditLineAccountPaginationEntity: CreditLineAccountPaginationEntity =
      new CreditLineAccountPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    creditLineAccountPaginationEntity.pageSize = event.rows;
    this.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      creditLineAccountPaginationEntity.pageNumber = event.first;
      this.page = event.first;
    } else {
      creditLineAccountPaginationEntity.pageNumber = event.first / event.rows;
      this.page = event.first / event.rows;
    }

    if (event.filters !== undefined) {
      this.advancedSearchParam.accountNumberFilter = (event.filters.accountNumber !== undefined
        ? event.filters.accountNumber.value: this.advancedSearchParam.accountNumberFilter);
      this.advancedSearchParam.accountStatus = event.filters.accountStatus !== undefined
        ? event.filters.accountStatus.value
        : this.advancedSearchParam.accountStatus;
      this.advancedSearchParam.active = event.filters.active !== undefined
        ? event.filters.active.value
        : this.advancedSearchParam.active;
      this.advancedSearchParam.adjustment = event.filters.adjustment !== undefined
        ? event.filters.adjustment.value
        : this.advancedSearchParam.adjustment;
      this.advancedSearchParam.customerId = event.filters.customerId !== undefined
        ? event.filters.customerId.value
        : this.advancedSearchParam.customerId;
      this.advancedSearchParam.fullName = event.filters.fullName !== undefined
        ? event.filters.fullName.value
        : this.advancedSearchParam.fullName;
      this.advancedSearchParam.age = event.filters.age !== undefined
        ? event.filters.age.value
        : this.advancedSearchParam.age;
      this.advancedSearchParam.geographicArea = event.filters.geographicArea !== undefined
        ? event.filters.geographicArea.value
        : this.advancedSearchParam.geographicArea;
      this.advancedSearchParam.issueDate = event.filters.issueDate !== undefined
        ? event.filters.issueDate.value
        : this.advancedSearchParam.issueDate;
      this.advancedSearchParam.issueAmount = event.filters.issueAmount !== undefined
        ? event.filters.issueAmount.value
        : this.advancedSearchParam.issueAmount;
      this.advancedSearchParam.loanTenure = event.filters.loanTenure !== undefined
        ? event.filters.loanTenure.value
        : this.advancedSearchParam.loanTenure;
      this.advancedSearchParam.outstanding = event.filters.outstanding !== undefined
        ? event.filters.outstanding.value
        : this.advancedSearchParam.outstanding;
      this.advancedSearchParam.product = event.filters.product !== undefined
        ? event.filters.product.value
        : this.advancedSearchParam.product;
      this.advancedSearchParam.branchName = event.filters.branchName !== undefined
        ? event.filters.branchName.value
        : this.advancedSearchParam.branchName;
      this.advancedSearchParam.nationalId = event.filters.nationalId !== undefined
        ? event.filters.nationalId.value
        : this.advancedSearchParam.nationalId;
      this.advancedSearchParam.gender = event.filters.gender !== undefined
        ? event.filters.gender.value
        : this.advancedSearchParam.gender;
      this.advancedSearchParam.educationLevel = event.filters.educationLevel !== undefined
        ? event.filters.educationLevel.value
        : this.advancedSearchParam.educationLevel;
      this.advancedSearchParam.socialStatus = event.filters.socialStatus !== undefined
        ? event.filters.socialStatus.value
        : this.advancedSearchParam.socialStatus;
      this.advancedSearchParam.sector = event.filters.sector !== undefined
        ? event.filters.sector.value
        : this.advancedSearchParam.sector;
      this.advancedSearchParam.rating = event.filters.rating !== undefined
        ? event.filters.rating.value
        : this.advancedSearchParam.rating;
      this.advancedSearchParam.lastPaymentDueDate = event.filters.lastPaymentDueDate !== undefined
        ? event.filters.lastPaymentDueDate.value
        : this.advancedSearchParam.lastPaymentDueDate;
      this.advancedSearchParam.remainingInstallments = event.filters.remainingInstallments !== undefined
        ? event.filters.remainingInstallments.value
        : this.advancedSearchParam.remainingInstallments;
      this.advancedSearchParam.delinquentDays = event.filters.delinquentDays !== undefined
        ? event.filters.delinquentDays.value
        : this.advancedSearchParam.delinquentDays;
      this.advancedSearchParam.issuedInterest = event.filters.issuedInterest !== undefined
        ? event.filters.issuedInterest.value
        : this.advancedSearchParam.issuedInterest;
      this.advancedSearchParam.outstandingInterest = event.filters.outstandingInterest !== undefined
        ? event.filters.outstandingInterest.value
        : this.advancedSearchParam.outstandingInterest;
      this.advancedSearchParam.assignmentStatus = event.filters.assignmentStatus !== undefined
        ? event.filters.assignmentStatus.value
        : this.advancedSearchParam.assignmentStatus;

      this.advancedSearchParam.creditLineAssignments = [];
      this.advancedSearchParam.creditLineAssignments.push(new AcmCreditLineAccountAssignment())
      this.advancedSearchParam.creditLineAssignments[0].creditLine = new creditLineEntity();
      this.advancedSearchParam.creditLineAssignments[0].creditLine.fundName = event.filters.creditLineAssignments !== undefined
        ? event.filters.creditLineAssignments.value
        : null;
    }

    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {

      if(event.multiSortMeta[0].field !== null){
        creditLineAccountPaginationEntity.sortField =
          event.multiSortMeta[0].field;
        creditLineAccountPaginationEntity.sortDirection =
          event.multiSortMeta[0].order;
      }
    }




    creditLineAccountPaginationEntity.params = this.advancedSearchParam;

    this.creditLineService.findCreditLineAccountPagination(creditLineAccountPaginationEntity)
      .subscribe((res) => {
        this.creditLineAccountPaginationEntity = res;
      })

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


  colExists(col: any): boolean {
    const selectedColumns = this.formColumns.get('selectedColumns') as FormArray;

    return selectedColumns.value.some((selectedCol: any) => {
      return selectedCol.field === col.field && selectedCol.header === col.header;
    });
  }

  toggleShowAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  getUDFFieldsList() {
    const userDefinedFieldsEntity: UserDefinedFieldsEntity =
      new UserDefinedFieldsEntity();
    userDefinedFieldsEntity.names.push(AcmConstants.UDF_FIELD_EDUCATION_LEVEL)
    userDefinedFieldsEntity.names.push(AcmConstants.UDF_FIELD_FAMILY_SITUATION)
    userDefinedFieldsEntity.names.push(AcmConstants.UDF_FIELD_SECTOR)
    this.udfService.getUdfField(userDefinedFieldsEntity).subscribe((data) => {
      data.filter((item) => item.name === AcmConstants.UDF_FIELD_EDUCATION_LEVEL)[0]?.fieldListValuesDTOs.map((
        (item) => this.educationLevelList.push(item.description)
      ))
      data.filter((item) => item.name === AcmConstants.UDF_FIELD_FAMILY_SITUATION)[0]?.fieldListValuesDTOs.map((
        (item) => this.familySituationList.push(item.description)
      ))
      data.filter((item) => item.name === AcmConstants.UDF_FIELD_SECTOR)[0]?.fieldListValuesDTOs.map((
        (item) => this.sectorList.push(item.description)
      ))
    });
  }

  loadRegion() {
    let pays;
    const addressSettingEntityPays: AddressSettingEntity = new AddressSettingEntity();
    addressSettingEntityPays.addressListId = 1;
    this.customerAddressService.getAddressListValue(addressSettingEntityPays).toPromise().then(
      (result) => {
        pays = result[0];
      });

    const addressSettingEntityRegion: AddressSettingEntity = new AddressSettingEntity();
    addressSettingEntityRegion.addressListId = 2;
    addressSettingEntityRegion.parentId = pays?.addressListValueID;

    this.customerAddressService.getAddressListValue(addressSettingEntityRegion).toPromise().then(
      (result) => {
        result.map((item) => this.geographicAreaList.push(item.name));
      });
  }

  advancedSearch() {

    const creditLineAccountPaginationEntity: CreditLineAccountPaginationEntity =
      new CreditLineAccountPaginationEntity();

    // setting pageSize
    creditLineAccountPaginationEntity.pageSize = this.pageSize;

    // setting pageNumber
    creditLineAccountPaginationEntity.pageNumber = 0;

    this.advancedSearchParam.advancedSearchDTO = [];

    if (this.advancedSearchForm.controls.product?.value) {
      let advancedSearch: AdvancedSearchDTO = new AdvancedSearchDTO();
      this.automaticAssignmentMode ? advancedSearch.fieldKey="productDescription" : advancedSearch.fieldKey = "product";
      advancedSearch.list = this.advancedSearchForm.controls.product.value;
      this.advancedSearchParam.advancedSearchDTO.push(advancedSearch);
    }

    if (this.advancedSearchForm.controls.loanAmountFrom?.value || this.advancedSearchForm.controls.loanAmountTo?.value) {
      let advancedSearch: AdvancedSearchDTO = new AdvancedSearchDTO();
      this.automaticAssignmentMode ? advancedSearch.fieldKey="applyAmountTotal" : advancedSearch.fieldKey = "issueAmount";
      advancedSearch.min = this.advancedSearchForm.controls.loanAmountFrom?.value;
      advancedSearch.max = this.advancedSearchForm.controls.loanAmountTo?.value;
      this.advancedSearchParam.advancedSearchDTO.push(advancedSearch);
    }

    this.advancedSearchParam.loanTenure = (this.advancedSearchForm.controls.loanTenure?.value) !== undefined ?
      this.advancedSearchForm.controls.loanTenure.value : null;

    if (this.advancedSearchForm.controls.issueDateFrom?.value || this.advancedSearchForm.controls.issueDateTo?.value) {
      let advancedSearch: AdvancedSearchDTO = new AdvancedSearchDTO();
      advancedSearch.fieldKey = "issueDate";
      advancedSearch.min = this.advancedSearchForm.controls.issueDateFrom?.value;
      advancedSearch.max = this.advancedSearchForm.controls.issueDateTo?.value;
      this.advancedSearchParam.advancedSearchDTO.push(advancedSearch);
    }

    this.advancedSearchParam.gender = (this.advancedSearchForm.controls.gender?.value) !== undefined ?
      this.advancedSearchForm.controls.gender.value : null;

    this.advancedSearchParam.accountStatus = (this.advancedSearchForm.controls.accountStatus?.value) !== undefined ?
      this.advancedSearchForm.controls.accountStatus.value : null;

    this.advancedSearchParam.nationalId = (this.advancedSearchForm.controls.nationalId?.value) !== undefined ?
      this.advancedSearchForm.controls.nationalId.value : null;

    this.advancedSearchParam.outstanding = (this.advancedSearchForm.controls.outstanding?.value) !== undefined ?
      this.advancedSearchForm.controls.outstanding.value : null;

    if (this.advancedSearchForm.controls.sector?.value) {
      let advancedSearch: AdvancedSearchDTO = new AdvancedSearchDTO();
      this.automaticAssignmentMode ? advancedSearch.fieldKey="customer.sector" : advancedSearch.fieldKey = "sector";
      advancedSearch.list = this.advancedSearchForm.controls.sector.value;
      this.advancedSearchParam.advancedSearchDTO.push(advancedSearch);
    }

    this.advancedSearchParam.delinquentDays = (this.advancedSearchForm.controls.delinquentDays?.value) !== undefined ?
      this.advancedSearchForm.controls.delinquentDays.value : null;

    this.advancedSearchParam.remainingInstallments = (this.advancedSearchForm.controls.remainingInstallments?.value) !== undefined ?
      this.advancedSearchForm.controls.remainingInstallments.value : null;

    this.advancedSearchParam.issuedInterest = (this.advancedSearchForm.controls.issuedInterest?.value) !== undefined ?
      this.advancedSearchForm.controls.issuedInterest.value : null;

    this.advancedSearchParam.outstandingInterest = (this.advancedSearchForm.controls.outstandingInterest?.value) !== undefined ?
      this.advancedSearchForm.controls.outstandingInterest.value : null;

    if (this.advancedSearchForm.controls.ageFrom?.value || this.advancedSearchForm.controls.ageTo?.value) {
      let advancedSearch: AdvancedSearchDTO = new AdvancedSearchDTO();
      if(!this.automaticAssignmentMode){
        advancedSearch.fieldKey = "age";
        advancedSearch.min = this.advancedSearchForm.controls.ageFrom?.value;
        advancedSearch.max = this.advancedSearchForm.controls.ageTo?.value;
      }
      else{
        advancedSearch.fieldKey = "customer.dateOfBirth";
        const currentDate = new Date();
        const startYear = currentDate.getFullYear() - this.advancedSearchForm.controls.ageTo?.value - 1;
        const endYear = currentDate.getFullYear() - this.advancedSearchForm.controls.ageFrom?.value;
        advancedSearch.min = new Date(startYear, currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0]
        advancedSearch.max = new Date(endYear, currentDate.getMonth(), currentDate.getDate() + 1).toISOString().split('T')[0]
      }
      this.advancedSearchParam.advancedSearchDTO.push(advancedSearch);
    }

    if (this.advancedSearchForm.controls.educationLevel?.value) {
      let advancedSearch: AdvancedSearchDTO = new AdvancedSearchDTO();
      advancedSearch.fieldKey = "educationLevel";
      advancedSearch.list = this.advancedSearchForm.controls.educationLevel.value;
      this.advancedSearchParam.advancedSearchDTO.push(advancedSearch);
    }

    if (this.advancedSearchForm.controls.socialStatus?.value) {
      let advancedSearch: AdvancedSearchDTO = new AdvancedSearchDTO();
      advancedSearch.fieldKey = "socialStatus";
      advancedSearch.list = this.advancedSearchForm.controls.socialStatus.value;
      this.advancedSearchParam.advancedSearchDTO.push(advancedSearch);
    }

    if (this.advancedSearchForm.controls.geographicArea?.value) {
      let advancedSearch: AdvancedSearchDTO = new AdvancedSearchDTO();
      advancedSearch.fieldKey = "geographicArea";
      advancedSearch.list = this.advancedSearchForm.controls.geographicArea.value;
      this.advancedSearchParam.advancedSearchDTO.push(advancedSearch);
    }

    if (this.advancedSearchForm.controls.creditLine?.value) {
      let advancedSearch: AdvancedSearchDTO = new AdvancedSearchDTO();
      advancedSearch.fieldKey = "creditLineAssignments.creditLine.fundName";
      advancedSearch.list = this.advancedSearchForm.controls.creditLine.value;
      this.advancedSearchParam.advancedSearchDTO.push(advancedSearch);
    }

    this.advancedSearchParam.assignmentStatus = (this.advancedSearchForm.controls.assignmentStatus?.value) !== undefined ?
      this.advancedSearchForm.controls.assignmentStatus.value : null;

    creditLineAccountPaginationEntity.params = this.advancedSearchParam;

    this.creditLineService.findCreditLineAccountPagination(creditLineAccountPaginationEntity)
      .subscribe((res) => {
        this.creditLineAccountPaginationEntity = res;
      })


  }

  exportexcel(): void {
    const creditLineAccountPaginationEntity: CreditLineAccountPaginationEntity =
      new CreditLineAccountPaginationEntity();

    // setting pageSize
    creditLineAccountPaginationEntity.pageSize = null;

    // setting pageNumber
    creditLineAccountPaginationEntity.pageNumber = 0;

    creditLineAccountPaginationEntity.params = this.advancedSearchParam;

    this.creditLineService.exportExcel(creditLineAccountPaginationEntity).subscribe((res: any) => {
      const fileData = [res];
      const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      const formattedDate = new Date().toISOString().slice(0, 10);
      anchor.download = `CREDIT_LINE_ACCOUNT_${formattedDate}`;
      anchor.href = url;
      anchor.click();
      this.devToolsServices.openToast(0, 'alert.document_uploaded');
    });
  }


  saveUserScreenPreferences(event) {

    if (!event) {
      if (this.userScreenPreferencesEntity.id) {
        this.userScreenPreferencesEntity.value = JSON.stringify(this.selectedColumns);
      }
      else {
        this.userScreenPreferencesEntity.username = this.sharedService.getUser()?.login;
        this.userScreenPreferencesEntity.ihmRoute = "credit-line-account";
        this.userScreenPreferencesEntity.component = "TABLE";
        this.userScreenPreferencesEntity.value = JSON.stringify(this.selectedColumns);
        this.userScreenPreferencesEntity.code = AcmConstants.CREDIT_LINE_ACCONTS_TABLE_COLUMN_PREFERENCES;
      }

      this.settingsService.saveUserScreenPreferences(this.userScreenPreferencesEntity).subscribe((res) => {
        this.userScreenPreferencesEntity = res;
      });
    }

  }

  onSelectAllChange() {
    this.selectAll = !this.selectAll;
    if (!this.selectAll) {
      this.selectedCreditLineAccount = [];
    }
  }

  assignProcess() {
    if (this.selectedCreditLineAccount.length > 0) {
      if (this.creditLine !== null) {
        let assignedCreditLineAcount = JSON.parse(JSON.stringify(this.selectedCreditLineAccount));
        assignedCreditLineAcount.map(account => {
         this.acmCreditLineAccountAssignment = new AcmCreditLineAccountAssignment();
         this.acmCreditLineAccountAssignment.creditLine = this.creditLine;
         account.creditLineAssignments.push(this.acmCreditLineAccountAssignment);
        });

        this.creditLineService.assignProcess(assignedCreditLineAcount).subscribe((res) => {
          this.assignmentProcessResponse = res;
          this.close();
          this.selectedCreditLineAccount = [];

          if (this.assignmentProcessResponse.status === 'SUCCESS') {
            this.devToolsServices.openToastArrayMessagesWithParameterInMiddle(
              0,
              ["assignment_process_success", "assignment_process_success_records_nbr"],
              String(this.assignmentProcessResponse.nbrRecords)
            );
          }
          else if (this.assignmentProcessResponse.status === 'WARNING') {
            this.devToolsServices.openToastArrayMessagesWithParameterInMiddle(
              0,
              ["assignment_process_success", "assignment_process_success_records_nbr"],
              String(this.assignmentProcessResponse.nbrRecords)
            );
            this.openModal(this.content1);
          }
          else {
            this.openModal(this.content1);
          }

          this.assignmentMode = false;
          this.initPaginationAccounts();
          this.formLoaded= true ;
        })
      }
      else {
        this.devToolsServices.openToast(3, 'alert.required_fund_name');
      }
    }
    else{
      this.devToolsServices.openToast(3, 'alert.select_credit_line_account');
    }


  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: 'confirmation_dialog.unassign-process'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.creditLineService.unAssignProcess(this.selectedCreditLineAccount).subscribe((res) => {
          this.assignmentProcessResponse = res;
          this.selectedCreditLineAccount = [];
          if (this.assignmentProcessResponse.status === 'SUCCESS') {
            this.devToolsServices.openToastArrayMessagesWithParameterInMiddle(
              0,
              ["un_assignment_process_success", "assignment_process_success_records_nbr"],
              String(this.assignmentProcessResponse.nbrRecords)
            );
          }
          else {
            this.unassignMode = true;
            this.openModal(this.content1);
          }
          this.assignmentMode = false;
          this.initPaginationAccounts();
          this.formLoaded= true ;
        })
      }
      else {
        this.selectedCreditLineAccount = [];
      }

    });


  }

  close() {
    this.creditLine = null;
    this.unassignMode = false;
    this.modalService.dismissAll();
  }

  openModal(content) {
    this.modalService.open(content, {
      size: 'md'
    });
  }

  bulkAssign() {
    this.assignmentMode = true;
    this.formLoaded= false ;
    this.creditLineAccountPaginationEntity = new CreditLineAccountPaginationEntity();
  }

  onUpload(event) {
    this.creditLineService.uploadBulkAssignmentFile(event.files[0]).subscribe((res) => {
      this.creditLineAccountPaginationEntity.resultsCreditLineAccounts = res;

    })
  }

  exit(){
    this.assignmentMode = false;
    this.initPaginationAccounts();
    this.formLoaded= true ;
  }

  getLabelForValue(value: string): string {
    switch (value) {
      case "1":
        return 'dashboard.new';
      case "2":
        return 'dashboard.drafts';
      case "3":
        return 'dashboard.awaiting_approval';
      case "4":
        return 'dashboard.approved';
      case "5":
        return 'dashboard.rejected';
      case "6":
        return 'dashboard.cancelled';
      case "7":
        return 'dashboard.review';
      case "8":
        return 'dashboard.issued';
      default:
        return '';
    }
  }


  getDirection() {
    return AppComponent.direction;
  }


}
