import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { LoanIbEntity } from 'src/app/shared/Entities/loanIb.entity';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AppComponent } from 'src/app/app.component';
import { SharedService } from 'src/app/shared/shared.service';
import { OnlineApplicationsService } from '../../online-applications.service';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { LoanIbPaginationEntity } from 'src/app/shared/Entities/loanIbPaginationEntity.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { CustomerAddressService } from '../../../Customer/customer-address/customer-address.service';
import {MatDialog} from '@angular/material/dialog';
const PrimaryBleu = 'var(--primary)';
@Component({
  selector: 'app-online-application-table',
  templateUrl: './online-application-table.component.html',
  styleUrls: ['./online-application-table.component.sass']
})
export class OnlineApplicationTableComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @Input() public statusTab;
  @Input() public status: SelectItem[];
  public assignForm: FormGroup;
  public loanIbEntitys: LoanIbEntity[] = [];
  public loanIbEntity: LoanIbEntity = new LoanIbEntity();
  public selectedLoanIbEntitys: LoanIbEntity[] = [];
  public page: number;
  public pageSize: number;
  public users: UserEntity[] = [];
  public loanIb: LoanIbEntity = new LoanIbEntity();
  public confirm = false;
  public currentPath = 'online-application';
  @Input() public loanIbPaginationEntity: LoanIbPaginationEntity = new LoanIbPaginationEntity();
  public cols: any[];
  public selectedColumns: any[];
  @Input() public products: SelectItem[];

  loading: boolean;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  /**
   * constructor
   * @param modal NgbModal
   * @param router Router
   * @param dialog MatDialog
   * @param onlineApplicationService OnlineApplicationsService
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService
   * @param loanSharedService SharedService
   * @param customerAddressService CustomerAddressService
   */
  constructor(public modal: NgbModal, public router: Router, public dialog: MatDialog,
              public onlineApplicationService: OnlineApplicationsService, public formBuilder: FormBuilder,
              public devToolsServices: AcmDevToolsServices, public translate: TranslateService,
              public loanSharedService: SharedService, public customerAddressService: CustomerAddressService) {

  }
  ngOnInit() {
    this.cols = [
      {field: 'customerType', header: 'category_loan.category_loan' },
      { field: 'customerNameNoPipe', header: 'dashboard.client_name' },
      { field: 'customerAddress', header: 'customer.address' },
      { field: 'productDescription', header: 'loan.loan_product' },
      { field: 'applyAmountTotal', header: 'dashboard.amount' },
      { field: 'applyDate', header: 'dashboard.created' },
      { field: 'ownerName', header: 'dashboard.owner' }
    ];

    // init pagination params
    this.selectedColumns = this.cols;
    const searchLoan = new LoanIbEntity();
    this.loadLoansIbByPaginations(searchLoan, 0, 10);
    this.loadFilterProduct(searchLoan);
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * method used by pagination table to reload list by given filter / sort
   * @param event event
   */
  async reloadLoansList(event: LazyLoadEvent) {

    const loanIbPaginationEntityParms: LoanIbPaginationEntity = new LoanIbPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    loanIbPaginationEntityParms.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      loanIbPaginationEntityParms.pageNumber = event.first;
    } else {
      loanIbPaginationEntityParms.pageNumber = event.first / event.rows;
    }

    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const loanParams: LoanIbEntity = new LoanIbEntity();
    loanParams.statut = this.statusTab;

    if (event.filters !== undefined) {
      loanParams.accountNumberIb = event.filters.accountNumberIb !== undefined ? event.filters.accountNumberIb.value : null;
      loanParams.productDescription = event.filters.productDescription !== undefined ? event.filters.productDescription.value : null;
      loanParams.customerName = event.filters.customerNameNoPipe !== undefined ? event.filters.customerNameNoPipe.value : null;
      const customerParams: CustomerEntity = new CustomerEntity();
      customerParams.customerAddress = event.filters.customerAddress !== undefined ? event.filters.customerAddress.value : null;
      customerParams.customerType = event.filters.customerType !== undefined ? event.filters.customerType.value : null;
      loanParams.customerDTO = customerParams;
      loanParams.applyAmountTotal = event.filters.applyAmountTotal !== undefined ? event.filters.applyAmountTotal.value : null;
      loanParams.applyDate = event.filters.applyDate !== undefined ? event.filters.applyDate.value : null;
      loanParams.ownerName = event.filters.ownerName !== undefined ? event.filters.ownerName.value : null;
    }
    loanIbPaginationEntityParms.params = loanParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      loanIbPaginationEntityParms.sortField = event.multiSortMeta[0].field;
      loanIbPaginationEntityParms.sortDirection = event.multiSortMeta[0].order;
    }
    await this.onlineApplicationService.loadLoanIbByStatusPagination(loanIbPaginationEntityParms).subscribe(
      (data) => {
        this.loanIbPaginationEntity = data;
        this.loanIbPaginationEntity.resultsIbLoans.forEach(element => {
         element.customerNameNoPipe = this.loanSharedService.getCustomerName(element.customerDTO);
         element.customerType = element.customerDTO.customerType;
     
    
         if (element.applyDate !== null) {
                element.applyDate = element.applyDate;
              } else if (element.dateInsertion !== null) {
              element.applyDate = element.dateInsertion;
              }
      });
      }
    );
  }

  /**
   * load list of loans by paginations
   * @param searchLoan searchLoan
   * @param page page
   * @param pageSize pageSize
   */
  async loadLoansIbByPaginations(searchLoan: LoanIbEntity, page: number, pageSize: number) {
    const loanIbPaginationEntityParms: LoanIbPaginationEntity = new LoanIbPaginationEntity();
    loanIbPaginationEntityParms.params = searchLoan;
    loanIbPaginationEntityParms.pageSize = pageSize;
    loanIbPaginationEntityParms.pageNumber = page;
    loanIbPaginationEntityParms.params.statut = this.statusTab;
    loanIbPaginationEntityParms.params.customerDTO = new CustomerEntity();
    await this.onlineApplicationService.loadLoanIbByStatusPagination(loanIbPaginationEntityParms).subscribe(
      (data) => {
        this.loanIbPaginationEntity = data;
        this.loanIbPaginationEntity.resultsIbLoans.forEach(element => {
          element.customerNameNoPipe = this.loanSharedService.getCustomerName(element.customerDTO);
          element.customerType = element.customerDTO.customerType;
    
          if (element.customerDTO.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
              if (element.applyDate !== null) {
                element.applyDate = element.applyDate;
              } else if (element.dateInsertion !== null) {
              element.applyDate = element.dateInsertion;
              }
                   }
        });
      }
    );
  }
  /**
   * load Filter Status Workflow
   * @param searchLoan searchLoan
   */
  async loadFilterProduct(searchLoan: LoanIbEntity) {
    // load list product by statut loan
    await this.onlineApplicationService.loadFilterProductIb(searchLoan).subscribe(
      (data) => {
        // mapping data
        this.products = [
          { label: 'All', value: null },
        ];
        data.forEach(element => {
          this.products.push({ label: element.productDescription, value: element.productDescription });
        });
      }
    );
  }
  /**
   * load list of loanIbDetails
   */
  async loanIbDetails(loanIb: LoanIbEntity) {

    this.loanSharedService.openLoanIb(loanIb);
    await this.router.navigate([AcmConstants.LOAN_IB_INFO_URL]);
  }

}
