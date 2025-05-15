import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';
import { SelectItem, LazyLoadEvent } from 'primeng/api';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { DashbordServices } from '../../dashbord/dashbord.services';
import { SharedService } from 'src/app/shared/shared.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
const PrimaryBleu = 'var(--primary)';
@Component({
  selector: 'app-customer-groupe-dashbord',
  templateUrl: './customer-groupe-dashbord.component.html',
  styleUrls: ['./customer-groupe-dashbord.component.sass']
})
export class CustomerGroupeDashbordComponent implements OnInit {

  @Input() public loanPaginationEntity: LoanPaginationEntity = new LoanPaginationEntity();
  @Input() expanded;
  @Input() public status: SelectItem[];
  @Input() public products: SelectItem[];
  @Input() public customerType: string;

  public page: number;
  public pageSize: number;
  public cols: any[];
  public amountFilter = 0;
  public amountTimeout: any;
  public selectedColumns: any[];
  public loan: LoanEntity;
  public users: Array<any>;
  public usersSelect: SelectItem[];
  public decimalPlaces: string;
  public customer: CustomerEntity;
  public loanProcess: LoanProcessEntity = new LoanProcessEntity();

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };

  /**
   * constructor
   * @param dashbordService  dashbordService
   * @param Router router
   * @param LoanSharedService loanSharedService
   * @param AcmDevToolsServices devToolsServices
   */
  constructor(public dashbordService: DashbordServices,
              public loanSharedService: SharedService,
              public devToolsServices: AcmDevToolsServices) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'accountNumber', header: 'dashboard.account' },
      { field: 'productDescription', header: 'dashboard.product_name' },
      { field: 'customerNameNoPipe', header: 'dashboard.client_name' },
      { field: 'applyAmountTotal', header: 'dashboard.amount' },
      { field: 'applyDate', header: 'dashboard.created' },
      { field: 'statutWorkflow', header: 'dashboard.status' },
    ];
    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
    this.loan = this.loanSharedService.getLoan();
  }

  /**
   * load list of loanDetails
   */
  loanDetails(loan: LoanEntity) {
    this.loanSharedService.openLoan(loan);
  }

  /**
   * method used by pagination table to reload list by given filter / sort
   * @param event event
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
    loanParams.parentId = this.loan.loanId;
    if (event.filters !== undefined) {
      loanParams.accountNumber = event.filters.accountNumber !== undefined ? event.filters.accountNumber.value : null;
      loanParams.productDescription = event.filters.productDescription !== undefined ? event.filters.productDescription.value : null;
      loanParams.customerName = event.filters.customerNameNoPipe !== undefined ? event.filters.customerNameNoPipe.value : null;
      loanParams.applyAmountTotal = event.filters.applyAmountTotal !== undefined ? event.filters.applyAmountTotal.value : null;
      loanParams.applyDate = event.filters.applyDate !== undefined ? event.filters.applyDate.value : null;
      loanParams.statutWorkflow = event.filters.statutWorkflow !== undefined ? event.filters.statutWorkflow.value : null;
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

  toggleCollapse() {
    this.expanded = !this.expanded;
  }
}
