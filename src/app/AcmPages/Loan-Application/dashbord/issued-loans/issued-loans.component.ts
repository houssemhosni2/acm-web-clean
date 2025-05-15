import { Component, OnInit, ViewChild } from '@angular/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';
import { LoanStatutEntity } from 'src/app/shared/Entities/loan.statut.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { DashbordServices } from '../dashbord.services';
const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-issued-loans',
  templateUrl: './issued-loans.component.html',
  styleUrls: ['./issued-loans.component.sass']
})
export class IssuedLoansComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loanPaginationEntity: LoanPaginationEntity = new LoanPaginationEntity();
  public loansStatut: LoanStatutEntity = new LoanStatutEntity();
  public products: SelectItem[];
  public branches: SelectItem[];
  public page: number;
  public pageSize: number;
  public cols: any[];
  public selectedColumns: any[];
  public loan: LoanEntity;
  /**
   *
   * @param dashbordService DashbordServices
   * @param loanSharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public dashbordService: DashbordServices,
              public loanSharedService: SharedService,
              public devToolsServices: AcmDevToolsServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'customerType', header: 'category_loan.category_loan' },
      { field: 'accountNumber', header: 'dashboard.account' },
      { field: 'productDescription', header: 'dashboard.product_name' },
      { field: 'customerNameNoPipe', header: 'dashboard.client_name' },
      { field: 'branchName', header: 'customer_management.branch'},
      { field: 'applyAmountTotal', header: 'dashboard.amount' },
      { field: 'applyDate', header: 'dashboard.created' },
      { field: 'portfolioDescription', header: 'dashboard.loan_officer' },
      { field: 'ownerName', header: 'dashboard.owner' },
      { field: 'groupOwnerName', header: 'dashboard.groupOwnerName' },
      { field: 'dateLastUpdate', header: 'dashboard.dateLastUpdate' }
    ];
    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
    const searchLoan = new LoanEntity();
    // 0 : load all my task
    searchLoan.statut = '8';
    searchLoan.parentId = 0;
    this.loadLoansByPaginations(searchLoan, 0, 10);
    // load loans count by statut
    this.dashbordService.countIssuedLoans().subscribe(
      (data) => { this.loansStatut.status8Issued = data;
    });
    // load list product by params
    this.loadFilterProduct(searchLoan);
    // load list branches by params
    this.loadBranch(searchLoan);
  }
  /**
   * load list of loanDetails
   */
   loanDetails(loan: LoanEntity) {
    this.loanSharedService.openLoan(loan);
  }
  /**
   * load list of loans by paginations
   * @param searchLoan LoanEntity
   * @param page number
   * @param pageSize number
   */
  async loadLoansByPaginations(searchLoan: LoanEntity, page: number, pageSize: number) {
    const loanPaginationEntityParms: LoanPaginationEntity = new LoanPaginationEntity();
    loanPaginationEntityParms.params = searchLoan;
    loanPaginationEntityParms.pageSize = pageSize;
    loanPaginationEntityParms.pageNumber = page;
    await this.dashbordService.loadDashboardByStatusPagination(loanPaginationEntityParms).subscribe(
      (data) => {
        this.loanPaginationEntity = data;
        this.loanPaginationEntity.resultsLoans.forEach((customer) => {
          customer.customerNameNoPipe = this.loanSharedService.getCustomerName(customer.customerDTO);
        });
      });
  }
  /**
   * load Filter Product Workflow
   * @param searchLoan LoanEntity
   */
  async loadFilterProduct(searchLoan: LoanEntity) {
    // load list product by statut loan
    await this.dashbordService.loadFilterProduct(searchLoan).subscribe(
      (data) => {
        // mapping data
        this.products = [];
        data.forEach(element => {
          this.products.push({ label: element.productDescription, value: element.productDescription });
        });
      });
  }
  /**
   *
   * @param searchLoan LoanEntity
   */
  async loadBranch(searchLoan: LoanEntity) {
    // load list product by statut loan
    await this.dashbordService.loadFilterBranch(searchLoan).subscribe(
      (data) => {
        // mapping data
        this.branches = [];
        data.forEach(element => {
          this.branches.push({ label: element.branchName, value: element.branchName });
        });
      });
  }
  /**
   * method used by pagination table to reload list by given filter / sort
   * @param event  LazyLoadEvent
   */
  async reloadLoansList(event: LazyLoadEvent) {

    const loanPaginationEntityParms: LoanPaginationEntity = new LoanPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    loanPaginationEntityParms.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      loanPaginationEntityParms.pageNumber = event.first;
    } else {
      loanPaginationEntityParms.pageNumber = event.first / event.rows;
    }
    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const loanParams: LoanEntity = new LoanEntity();
    loanParams.parentId = 0;
    loanParams.statut = '8';
    if (event.filters !== undefined) {
      loanParams.accountNumber = event.filters.accountNumber !== undefined ? event.filters.accountNumber.value : null;
      loanParams.productDescription = event.filters.productDescription !== undefined ? event.filters.productDescription.value : null;
      loanParams.customerName = event.filters.customerNameNoPipe !== undefined ? event.filters.customerNameNoPipe.value : null;
      loanParams.applyAmountTotal = event.filters.applyAmountTotal !== undefined ? event.filters.applyAmountTotal.value : null;
      loanParams.applyDate = event.filters.applyDate !== undefined ? event.filters.applyDate.value : null;
      loanParams.portfolioDescription = event.filters.portfolioDescription !== undefined ? event.filters.portfolioDescription.value : null;
      loanParams.ownerName = event.filters.ownerName !== undefined ? event.filters.ownerName.value : null;
      loanParams.groupOwnerName = event.filters.groupOwnerName !== undefined ? event.filters.groupOwnerName.value : null;
      loanParams.dateLastUpdate = event.filters.dateLastUpdate !== undefined ? event.filters.dateLastUpdate.value : null;
      loanParams.customerType = event.filters.customerType !== undefined ? event.filters.customerType.value : null;
      loanParams.branchName = event.filters.branchName !== undefined ? event.filters.branchName.value : null;
    }
    loanPaginationEntityParms.params = loanParams;
    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      loanPaginationEntityParms.sortField = event.multiSortMeta[0].field;
      loanPaginationEntityParms.sortDirection = event.multiSortMeta[0].order;
    }
    await this.dashbordService.loadDashboardByStatusPagination(loanPaginationEntityParms).subscribe(
      (data) => {
        this.loanPaginationEntity = data;
        this.loanPaginationEntity.resultsLoans.forEach((customer) => {
          customer.customerNameNoPipe = this.loanSharedService.getCustomerName(customer.customerDTO);
        });
      }
    );
  }
}
