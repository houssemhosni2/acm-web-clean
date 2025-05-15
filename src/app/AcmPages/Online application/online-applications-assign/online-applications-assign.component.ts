import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnlineApplicationsService } from '../online-applications.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { LoanIbEntity } from 'src/app/shared/Entities/loanIb.entity';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AppComponent } from 'src/app/app.component';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanIbPaginationEntity } from 'src/app/shared/Entities/loanIbPaginationEntity.entity';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { CustomerAddressService } from '../../Customer/customer-address/customer-address.service';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import {MatDialog} from '@angular/material/dialog';
const PrimaryBleu = 'var(--primary)';
@Component({
  selector: 'app-online-applications-assign',
  templateUrl: './online-applications-assign.component.html',
  styleUrls: ['./online-applications-assign.component.sass']
})
export class OnlineApplicationAssignComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  public assignForm: FormGroup;
  public loanIbEntitys: LoanIbEntity[] = [];
  public loanIbEntity: LoanIbEntity = new LoanIbEntity();
  public selectedLoanIbEntitys: LoanIbEntity[] = [];
  public page: number;
  public pageSize: number;
  public users: UserEntity[] = [];
  public loanofficers: UserEntity[] = [];
  public accountPortfolios: UserEntity[] = [];
  public userConnected: UserEntity;
  public loanIb: LoanIbEntity = new LoanIbEntity();
  public confirm = false;
  public currentPath = 'loan-assign';
  public loanIbPaginationEntity: LoanIbPaginationEntity = new LoanIbPaginationEntity();
  public cols: any[];
  public selectedColumns: any[];
  public products: SelectItem[];
  loading: boolean;
  public disable = false;
  public check = true;
  public inputs = [];
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
   * @param loanManagementService LoanManagementService
   * @param authenticationService AuthentificationService
   */
  constructor(public modal: NgbModal, public router: Router, public dialog: MatDialog,
              public onlineApplicationService: OnlineApplicationsService, public formBuilder: FormBuilder,
              public devToolsServices: AcmDevToolsServices, public translate: TranslateService,
              public loanSharedService: SharedService, public customerAddressService: CustomerAddressService,
              public loanManagementService: LoanManagementService, public authenticationService: AuthentificationService) {

  }
  ngOnInit() {
    this.cols = [
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
    searchLoan.statut = 0;
    this.loadLoansIbByPaginations(searchLoan, 0, 10);
    this.loadFilterProduct(searchLoan);
    this.pageSize = 10;
    this.page = 1;
    this.userConnected = this.loanSharedService.getUser();

  }
  /**
   * Methode openAssign
   */
  openAssign(content): void {
    this.getAccountPortfolios();
    this.createForm();
    this.confirm = false;
    this.modal.open(content, { size: 'md' });
  }

  /**
   * Methode onChange
   * @param loanIb loanIb
   * @param Number number
   */
  onChangeCheckBox(loanIb, i, event) {
    if (this.selectedLoanIbEntitys.indexOf(loanIb) === -1) {
      this.selectedLoanIbEntitys.push(loanIb);
    } else {
      this.selectedLoanIbEntitys.splice(this.selectedLoanIbEntitys.indexOf(loanIb), 1);
    }
    if (event.target.checked) { this.inputs.push(loanIb); } else { this.inputs = this.arrayRemove(this.inputs, loanIb); }
    if (this.inputs.length === 0) {
      this.check = true;
    } else if (this.inputs.length > 0) {
      this.check = false;
    }
  }

  /**
   *
   * @param array checked element
   * @param value element
   */
  arrayRemove(array, value) {
    return array.filter((element) => {
      return element !== value;
    });
  }

  /**
   * createForm : create Form reassign
   */
  createForm() {
    this.assignForm = this.formBuilder.group({
      participants: ['', Validators.required],
      note: [''],
      confirm: ['', Validators.required]
    });
  }

  /**
   * load account portfolios of branch
   */
  getAccountPortfolios() {
    this.accountPortfolios = [];
    const userEntity: UserEntity = new UserEntity();
    userEntity.branchID = this.userConnected.branchID;
    this.loanManagementService.findAllPortfolio(userEntity).subscribe(
      (data) => {
        data.forEach((loanofficers) => {
          loanofficers.groupes.forEach(element => {
            if (element.code === AcmConstants.LOAN_OFFICER) {
              this.accountPortfolios.push(loanofficers);
            }
          });
        });
      }
    );
  }
  /**
   * load users
   */
  getUsers() {
    this.onlineApplicationService.getUsersBranch().subscribe(
      (data) => {
        this.users = data;
      }
    );
    
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * onSubmit : submit form
   */
  onSubmit() {
    if (this.assignForm.valid) {
      this.loanIb.confirm = this.confirm;
      this.modal.dismissAll();
      this.selectedLoanIbEntitys.forEach(element => {
        element.owner = this.assignForm.value.participants.login;
        element.ownerName = this.assignForm.value.participants.simpleName;
        element.portfolioCode = this.assignForm.value.participants.login;
        element.portfolioDescription = this.assignForm.value.participants.simpleName;
        element.portfolioId = this.assignForm.value.participants.accountPortfolioId;
        element.note = element.note + ' : ' + this.assignForm.value.note;
      });
      this.assign();
    }
  }

  /**
   * Methode to reassign
   */
  async assign() {
    await this.onlineApplicationService.assignLoanIb(this.selectedLoanIbEntitys).toPromise().then(
      (data) => {
        this.reloadTable();
      });
  }
  /**
   * Methode to reloadTable
   */
  reloadTable() {
    const searchLoan = new LoanIbEntity();
    searchLoan.statut = 0;
    this.loadLoansIbByPaginations(searchLoan, 0, 10);
    this.loadFilterProduct(searchLoan);
  }

  /**
   * method used by pagination table to reload list by given filter / sort
   * @param event event
   */
  async reloadLoansList(event: LazyLoadEvent) {

    const loanIbPaginationEntityParms: LoanIbPaginationEntity = new LoanIbPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    loanIbPaginationEntityParms.pageSize = event.rows;
    loanIbPaginationEntityParms.params.statut = 0;
    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      loanIbPaginationEntityParms.pageNumber = event.first;
    } else {
      loanIbPaginationEntityParms.pageNumber = event.first / event.rows;
    }

    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const loanParams: LoanIbEntity = new LoanIbEntity();
    if (event.filters !== undefined) {
      loanParams.accountNumberIb = event.filters.accountNumberIb !== undefined ? event.filters.accountNumberIb.value : null;
      loanParams.productDescription = event.filters.productDescription !== undefined ? event.filters.productDescription.value : null;
      loanParams.customerName = event.filters.customerNameNoPipe !== undefined ? event.filters.customerNameNoPipe.value : null;
      const customerParams: CustomerEntity = new CustomerEntity();
      customerParams.customerAddress = event.filters.customerAddress !== undefined ? event.filters.customerAddress.value : null;
      loanParams.customerDTO = customerParams;
      loanParams.applyAmountTotal = event.filters.applyAmountTotal !== undefined ? event.filters.applyAmountTotal.value : null;
      loanParams.applyDate = event.filters.applyDate !== undefined ? event.filters.applyDate.value : null;
      loanParams.owner = event.filters.owner !== undefined ? event.filters.owner.value : null;
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
          const addressEntity: AddressEntity = new AddressEntity();
          addressEntity.customerId = element.customerDTO.id;
          this.customerAddressService.getCustomerAddress(addressEntity).subscribe((value) => {
            if (value.length > 0) {
              if (value[0].townCity !== null) {
                element.customerAddress = value[0].townCity + ' ';
              }
              if (value[0].county !== null) {
                element.customerAddress += value[0].county + ' ';
              }
              if (value[0].state !== null) {
                element.customerAddress += value[0].state;
              }
            }
          });
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
    await this.onlineApplicationService.loadLoanIbByStatusPagination(loanIbPaginationEntityParms).subscribe(
      (data) => {
        this.loanIbPaginationEntity = data;
        if (this.loanIbPaginationEntity.resultsIbLoans.length === 0) {
          this.disable = true;
        }
        this.loanIbPaginationEntity.resultsIbLoans.forEach(element => {
          element.customerNameNoPipe = this.loanSharedService.getCustomerName(element.customerDTO);
       
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
    await this.router.navigate([AcmConstants.LOAN_IB_INFO_URL], { queryParams: { assign: true }});
  }

  
}
