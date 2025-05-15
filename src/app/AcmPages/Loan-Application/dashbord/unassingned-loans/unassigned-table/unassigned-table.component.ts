import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanManagementService } from '../../../loan-management/loan-management.service';
import { DashbordServices } from '../../dashbord.services';

@Component({
  selector: 'app-unassigned-table',
  templateUrl: './unassigned-table.component.html',
  styleUrls: ['./unassigned-table.component.sass']
})
export class UnassignedTableComponent implements OnInit {
  @Input() public loanPaginationEntity: LoanPaginationEntity = new LoanPaginationEntity();
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
  /**
   *
   * @param dashbordService DashbordServices
   * @param loanSharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   * @param loanManagementService LoanManagementService
   */
  constructor(public dashbordService: DashbordServices, public loanSharedService: SharedService,
              public devToolsServices: AcmDevToolsServices, public loanManagementService: LoanManagementService) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'customerType', header: 'category_loan.category_loan' },
      { field: 'accountNumber', header: 'dashboard.account' },
      { field: 'productDescription', header: 'dashboard.product_name' },
      { field: 'customerNameNoPipe', header: 'dashboard.client_name' },
      { field: 'applyAmountTotal', header: 'dashboard.amount' },
      { field: 'applyDate', header: 'dashboard.created' },
      { field: 'portfolioDescription', header: 'dashboard.loan_officer' },
      { field: 'etapeWorkflow', header: 'dashboard.status' },
      { field: 'dateLastUpdate', header: 'dashboard.dateLastUpdate' }
    ];

    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
  }
  /**
   * load list of loanDetails
   * @param loan LoanEntity
   */
  loanDetails(loan: LoanEntity) {
    this.loanSharedService.openLoan(loan);
  }

  /**
   * load list of users by responsable and the responsable
   */
  userSelect() {
    this.users = this.loanSharedService.getUsers();
    for (let i = 0; i < this.users.length; i++) {
      this.usersSelect.push({ label: this.users[i].item_text, value: this.users[i].item_text });
    }
  }
  /**
   * method used by pagination table to reload list by given filter / sort
   * @param event LazyLoadEvent
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
    if (event.filters !== undefined) {
      loanParams.accountNumber = event.filters.accountNumber !== undefined ? event.filters.accountNumber.value : null;
      loanParams.productDescription = event.filters.productDescription !== undefined ? event.filters.productDescription.value : null;
      loanParams.customerName = event.filters.customerNameNoPipe !== undefined ? event.filters.customerNameNoPipe.value : null;
      loanParams.applyAmountTotal = event.filters.applyAmountTotal !== undefined ? event.filters.applyAmountTotal.value : null;
      loanParams.applyDate = event.filters.applyDate !== undefined ? event.filters.applyDate.value : null;
      loanParams.portfolioDescription = event.filters.portfolioDescription !== undefined ? event.filters.portfolioDescription.value : null;
      loanParams.dateLastUpdate = event.filters.dateLastUpdate !== undefined ? event.filters.dateLastUpdate.value : null;
      loanParams.customerType = event.filters.customerType !== undefined ? event.filters.customerType.value : null;
      loanParams.statutLibelle = event.filters.etapeWorkflow !== undefined ? event.filters.etapeWorkflow.value : null;

    }
    loanPaginationEntityParms.params = loanParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      loanPaginationEntityParms.sortField = event.multiSortMeta[0].field;
      loanPaginationEntityParms.sortDirection = event.multiSortMeta[0].order;
    }

    await this.dashbordService.loadUnassignedLoans(loanPaginationEntityParms).subscribe(
      (data) => {
        this.loanPaginationEntity = data;
        this.loanPaginationEntity.resultsLoans.forEach((customer) => {
          customer.customerNameNoPipe = this.loanSharedService.getCustomerName(customer.customerDTO);
        });
      }
    );
  }
  /**
   * assign loan to the connected user
   * @param rowData loans
   */
  async assignLoan(rowData) {
    await this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.ASSIGN_LOAN)
      .afterClosed().subscribe(res => {
        if (res) {
          this.loanManagementService.assignLoan(rowData).subscribe((data) => {
            rowData.owner = data.owner;
            rowData.ownerName = data.ownerName;
            this.devToolsServices.openToast(0, 'alert.loan_assigned_successfully');
            this.loanSharedService.openLoan(data);
          });
        }
      });

  }
}
