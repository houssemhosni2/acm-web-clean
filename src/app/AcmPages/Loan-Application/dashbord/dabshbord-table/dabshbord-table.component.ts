import { Component, Input, OnInit } from '@angular/core';
import { LoanEntity } from '../../../../shared/Entities/loan.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { SelectItem, LazyLoadEvent } from 'primeng/api';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';
import { DashbordServices } from '../dashbord.services';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-dabshbord-table',
  templateUrl: './dabshbord-table.component.html',
  styleUrls: ['./dabshbord-table.component.sass']
})
export class DabshbordTableComponent implements OnInit {
  @Input() public loanPaginationEntity: LoanPaginationEntity = new LoanPaginationEntity();
  @Input() public statusTab = '0';
  @Input() public status: SelectItem[];
  @Input() public products: SelectItem[];
  @Input() public customerType: string;
  @Input() public source: string;
  @Input() public branches: SelectItem[];

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
  public selectedLoans : LoanEntity[] = [];
  


  /**
   * constructor
   * @param dashbordService  dashbordService
   * @param Router router
   * @param LoanSharedService loanSharedService
   * @param AcmDevToolsServices devToolsServices
   */
  constructor(public dashbordService: DashbordServices,
    public loanSharedService: SharedService,
    public devToolsServices: AcmDevToolsServices,
    private dbService: NgxIndexedDBService) {
  }

  ngOnInit() {

    this.cols = [
      { field: 'customerType', header: 'category_loan.category_loan' },
      { field: 'accountNumber', header: 'dashboard.account' },
      { field: 'productDescription', header: 'dashboard.product_name' },
      { field: 'customerNameNoPipe', header: 'dashboard.client_name' },
      { field: 'branchName', header: 'customer_management.branch' },
      { field: 'applyAmountTotal', header: 'dashboard.amount' },
      { field: 'dateInsertion', header: 'dashboard.created' },
      { field: 'portfolioDescription', header: 'dashboard.loan_officer' },
      { field: 'ownerName', header: 'dashboard.owner' },
      { field: 'groupOwnerName', header: 'dashboard.groupOwnerName' },
      { field: 'etapeWorkflow', header: 'dashboard.status' },
      { field: 'dateLastUpdate', header: 'dashboard.dateLastUpdate' }
    ];

    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
  }

  get currentSelection() {
    return this.source === 'settingOffline' ? this.selectedLoans : this.loan;
  }

  set currentSelection(value: LoanEntity | LoanEntity[]) {
    if (this.source === 'settingOffline') {
      this.selectedLoans =  Array.isArray(value) ? value : [value];;
    } else {
      this.loan = value  as LoanEntity;
    }
  }

  /**
   * load list of loanDetails
   */
  async loanDetails(loan: LoanEntity) {
    if (checkOfflineMode()) {
      let customer = await this.dbService.getByKey('customers', loan.customerDTO.id).toPromise() as CustomerEntity;

      // let offlineLoan = await this.dbService.getByKey('loans', loan.loanId).toPromise() as LoanEntity;



      // if (offlineLoan) {
      //   if (customer) {
      //     offlineLoan.customerDTO = customer;
      //   }
      //   this.loanSharedService.openLoan(offlineLoan);
      //   return;
      // }

      if (customer) {
        loan.customerDTO = customer;
      }
    }
    this.loanSharedService.setStatusTab(this.statusTab);

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
    if(this.source === 'settingOffline'){
      loanParams.listStatus = [0,1,2,7,3,4]
    } else {
    loanParams.statut = this.statusTab;
    }
    loanParams.parentId = 0;
    if (event.filters !== undefined) {
      loanParams.accountNumber = event.filters.accountNumber !== undefined ? event.filters.accountNumber.value : null;
      loanParams.productDescription = event.filters.productDescription !== undefined ? event.filters.productDescription.value : null;
      loanParams.customerName = event.filters.customerNameNoPipe !== undefined ? event.filters.customerNameNoPipe.value : null;
      loanParams.applyAmountTotal = event.filters.applyAmountTotal !== undefined ? event.filters.applyAmountTotal.value : null;
      loanParams.dateInsertion = event.filters.dateInsertion !== undefined ? event.filters.dateInsertion.value : null;
      loanParams.portfolioDescription = event.filters.portfolioDescription !== undefined ? event.filters.portfolioDescription.value : null;
      loanParams.ownerName = event.filters.ownerName !== undefined ? event.filters.ownerName.value : null;
      loanParams.groupOwnerName = event.filters.groupOwnerName !== undefined ? event.filters.groupOwnerName.value : null;
      //  loanParams.statutWorkflow = event.filters.statutWorkflow !== undefined ? event.filters.statutWorkflow.value : null;
      loanParams.statutLibelle = event.filters.etapeWorkflow !== undefined ? event.filters.etapeWorkflow.value : null;
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

    if (checkOfflineMode()) {
      const key = "loans-pagination-status-" + this.statusTab;

      console.log("loanPaginationEntityParms.params.branchName loading")
      console.log(loanPaginationEntityParms.params.branchName);
      console.log(key);
      await this.dbService.getByKey('loans-pagination', key).subscribe((loans: any) => {
        if (loans === undefined) {
          this.devToolsServices.openToast(3, 'No data saved for offline use');
        } else {
          delete loans.id;
          this.loanPaginationEntity = loans;
          this.loanPaginationEntity.resultsLoans.forEach((customer) => {
            customer.customerNameNoPipe = this.loanSharedService.getCustomerName(customer.customerDTO);
          });
        }
      });
    } else {
      await this.dashbordService.loadDashboardByStatusPagination(loanPaginationEntityParms).subscribe(
        (data) => {


          this.loanPaginationEntity = data;
          this.loanPaginationEntity.resultsLoans.forEach((customer) => {
            customer.customerNameNoPipe = this.loanSharedService.getCustomerName(customer.customerDTO);
          });

        });
    }
  }

  getStepName(loan: LoanEntity): string {
    if (loan.loanInstancesDtos.length > 0) {
      return loan.loanInstancesDtos.find(step => step.code === loan.etapeWorkflow).libelle
    }
    return '';
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
  getOfflineLoanPagination(){
    const offlineLoanPag = {...this.loanPaginationEntity};
    
    offlineLoanPag.resultsLoans = this.selectedLoans;
    offlineLoanPag.totalAmount = 0 ;
    offlineLoanPag.resultsLoans.forEach((loan)=>{ offlineLoanPag.totalAmount += loan.applyAmountTotal })
    offlineLoanPag.totalElements = offlineLoanPag.resultsLoans.length;
    this.loanSharedService.setLoanPaginationOffline(offlineLoanPag);
  }
}
