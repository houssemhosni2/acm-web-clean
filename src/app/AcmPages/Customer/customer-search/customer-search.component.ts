import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { TranslateService } from '@ngx-translate/core';
import { AcmConstants } from '../../../shared/acm-constants';
import { CustomerEntity } from '../../../shared/Entities/customer.entity';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/shared.service';
import { CustomerPaginationEntity } from '../../../shared/Entities/customer.pagination.entity';
import { LazyLoadEvent } from 'primeng/api';
import { CustomerListService } from '../customer-list/customer-list.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { CustomerManagementService } from '../customer-management/customer-management.service';
import { DashbordServices } from '../../Loan-Application/dashbord/dashbord.services';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { GuarantorsDetailsService } from '../../Loan-Application/guarantors-step/guarantors-details/guarantors-details.service';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { checkOfflineMode } from 'src/app/shared/utils';
import { SettingsService } from '../../Settings/settings.service';
import { BlacklistItem } from 'src/app/shared/Entities/blacklistItem.entity';
import { BlacklistItemPagination } from 'src/app/shared/Entities/blacklistItemPagination.entity';
import { BlacklistService } from '../../Blacklist/blacklist.service';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.sass']
})
export class CustomerSearchComponent implements OnInit {
  public cols: any[];
  public selectedColumns: any[];
  public page: number;
  public pageSize: number;
  public customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();
  public customer: CustomerEntity[];
  public currentCustomer: CustomerEntity;
  public currentPath = AcmConstants.CUSTOMER_360_URL;
  public customerGuarantors: CustomerEntity[] = [];
  checked = false;
  @Output() selectedCustomer = new EventEmitter();
  @Input() guarantor: boolean;
  @Input() guarantors: CustomerEntity[];
  @Input() categoryCustomerLink: string;
  @Input() currentUser: UserEntity;
  public guarantorHaveLoan = false;
  public index = 0;
  public members: CustomerLinksRelationshipEntity[] = [];
  public customerMembers: CustomerEntity[] = [];
  guarantorsAreValid: boolean;
  public guarantorBranchFilterSetting: boolean;
  public isBlacklisted: boolean = false;

  /**
   * constructor
   * @param customerListService CustomerListService
   * @param translate TranslateService
   * @param router Router
   * @param sharedService SharedService
   * @param modal Modal
   * @param authService AuthentificationService
   * @param customerManagementService CustomerManagementService
   * @param dashbordService DashbordServices
   * @param devToolsServices AcmDevToolsServices
   * @param guarantorsDetailsService GuarantorsDetailsService
   */
  constructor(public customerListService: CustomerListService,
    public translate: TranslateService,
    public router: Router, public sharedService: SharedService,
    public modal: NgbModal,
    public authService: AuthentificationService, public customerManagementService: CustomerManagementService,
    public dashbordService: DashbordServices, public devToolsServices: AcmDevToolsServices,
    public guarantorsDetailsService: GuarantorsDetailsService, public customerServices: CustomerServices,
    private dbService: NgxIndexedDBService, public settingsService: SettingsService,
    public blacklistService: BlacklistService) {
  }

  async ngOnInit() {
    this.cols = [
      { field: 'customerNumber', header: 'customer.customer_number' },
      { field: 'customerNameNoPipe', header: 'customer.customer_name' },
      { field: 'identity', header: 'customer.customer_identity' },
      { field: 'solidarityName', header: 'customer.customer_group' },
      { field: 'branchesName', header: 'customer.branch' },
      { field: 'accountPortfolioDescription', header: 'customer.portfolio' },
      { field: 'dateInsertion', header: 'customer.created' }
    ];
    this.getConnectedUser();
    // check guarantor branch filter setting (if not activate, get guarantors from all branches)
    if(!checkOfflineMode()){
    const acmEnvironmentKeys: string[] = [AcmConstants.GUARANTOR_BRANCH_FILTER];
    await this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).toPromise().then((environments) => {
      this.guarantorBranchFilterSetting = environments[0].enabled;
    });
  } else {
    this.dbService.getByKey('data', 'envirement-values-by-keys').subscribe((environments:any)=>{
      if(environments !== undefined){
        const env = environments.data.filter(item => item.key === AcmConstants.GUARANTOR_BRANCH_FILTER);
        if(env.length > 0 ){
          this.guarantorBranchFilterSetting = env[0].enabled;
        }
       }
      }) ;   
  }
    this.currentCustomer = this.sharedService.getCustomer() !== null ? this.sharedService.getCustomer() : new CustomerEntity();
    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
    this.customerPaginationEntity.params = new CustomerEntity();
    this.customerPaginationEntity.params.customerLinkCategory = AcmConstants.CUSTOMER_LINK_CATEGORY_RELATIONSHIP;
    if (this.guarantor === true) {
      if (this.categoryCustomerLink === AcmConstants.CUSTOMER_LINK_CATEGORY_GUARANTOR) {
        this.customerPaginationEntity.params.customerLinkCategory = AcmConstants.CUSTOMER_LINK_CATEGORY_GUARANTOR;
        this.customerPaginationEntity.params.guarantors = this.guarantors;
        if (this.guarantorBranchFilterSetting) {
          this.customerPaginationEntity.params.branchId = this.currentUser.branchID;
        }
      } else if (this.categoryCustomerLink === AcmConstants.CUSTOMER_LINK_CATEGORY_ORG) {
        this.customerPaginationEntity.params.customerLinkCategory = AcmConstants.CUSTOMER_LINK_CATEGORY_ORG;
        this.customerPaginationEntity.params.branchId = this.currentUser.branchID;
      } else if (this.categoryCustomerLink === AcmConstants.CUSTOMER_LINK_CATEGORY_GRP) {
        this.customerPaginationEntity.params.customerLinkCategory = AcmConstants.CUSTOMER_LINK_CATEGORY_GRP;
        this.customerPaginationEntity.params.branchId = this.currentUser.branchID;
      }
      if (checkOfflineMode()) {
        await this.dbService.getByKey('customers-pagination', 'customers-list').subscribe((value: any) => {
          if (value === undefined) {
            this.devToolsServices.openToast(3, 'Customers data not saved');
          } else {
            this.customerPaginationEntity = value;
            this.customerPaginationEntity.resultsCustomers.forEach(element => {
              element.customerNameNoPipe = this.sharedService.getCustomerName(element);
            });
          }
        })
      } else {
        this.customerListService.getCustomerForLinkPagination(this.customerPaginationEntity).subscribe((value) => {
          this.customerPaginationEntity = value;
          this.customerPaginationEntity.resultsCustomers.forEach(element => {
            element.customerNameNoPipe = this.sharedService.getCustomerName(element);
          });
        });
      }

    } else {
      if (checkOfflineMode()) {
        await this.dbService.getByKey('customers-pagination', 'customers-list').subscribe((value: any) => {
          if (value === undefined) {
            this.devToolsServices.openToast(3, 'Customers data not saved');
          } else {
            this.customerPaginationEntity = value;
            this.customerPaginationEntity.resultsCustomers.forEach(element => {
              element.customerNameNoPipe = this.sharedService.getCustomerName(element);
            });
          }
        })
      } else {
        this.customerListService.getCustomerForLinkPagination(this.customerPaginationEntity).subscribe((value) => {
          this.customerPaginationEntity = value;
          this.customerPaginationEntity.resultsCustomers.forEach(element => {
            element.customerNameNoPipe = this.sharedService.getCustomerName(element);
          });
        });
      }
    }
  }

  /**
   * customerDetails open customer 360
   * @param rowData Customer
   */
  customerDetails(rowData) {
    this.sharedService.setCustomer(rowData);
    this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL]);
  }

  /**
   * reloadCustomerList
   * @param $event Event
   */
  async reloadCustomerList(event: LazyLoadEvent) {
    const customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    customerPaginationEntity.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      customerPaginationEntity.pageNumber = event.first;
    } else {
      customerPaginationEntity.pageNumber = event.first / event.rows;
    }

    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const customerParams: CustomerEntity = new CustomerEntity();
    if (event.filters !== undefined) {
      customerParams.customerNumber = event.filters.customerNumber !== undefined ? event.filters.customerNumber.value : null;
      customerParams.customerName = event.filters.customerNameNoPipe !== undefined ? event.filters.customerNameNoPipe.value : null;
      customerParams.identity = event.filters.identity !== undefined ? event.filters.identity.value : null;
      customerParams.solidarityName = event.filters.solidarityName !== undefined ? event.filters.solidarityName.value : null;
      customerParams.branchesName = event.filters.branchesName !== undefined ? event.filters.branchesName.value : null;
      customerParams.accountPortfolioDescription = event.filters.accountPortfolioDescription !== undefined ?
        event.filters.accountPortfolioDescription.value : null;
      customerParams.dateInsertion = event.filters.dateInsertion !== undefined ? event.filters.dateInsertion.value : null;
    }
    customerPaginationEntity.params = customerParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      customerPaginationEntity.sortField = event.multiSortMeta[0].field;
      customerPaginationEntity.sortDirection = event.multiSortMeta[0].order;
    }
    if (this.guarantor === true) {
      customerPaginationEntity.params.customerLinkCategory = AcmConstants.CUSTOMER_LINK_CATEGORY_RELATIONSHIP;
      if (this.categoryCustomerLink === AcmConstants.CUSTOMER_LINK_CATEGORY_GUARANTOR) {
        customerPaginationEntity.params.customerLinkCategory = AcmConstants.CUSTOMER_LINK_CATEGORY_GUARANTOR;
        customerPaginationEntity.params.guarantors = this.guarantors;
        if (this.guarantorBranchFilterSetting) {
          customerPaginationEntity.params.branchId = this.currentUser.branchID;
        }
      } else if (this.categoryCustomerLink === AcmConstants.CUSTOMER_LINK_CATEGORY_ORG) {
        customerPaginationEntity.params.customerLinkCategory = AcmConstants.CUSTOMER_LINK_CATEGORY_ORG;
        customerPaginationEntity.params.branchId = this.currentUser.branchID;
      } else if (this.categoryCustomerLink === AcmConstants.CUSTOMER_LINK_CATEGORY_GRP) {
        customerPaginationEntity.params.customerLinkCategory = AcmConstants.CUSTOMER_LINK_CATEGORY_GRP;
        customerPaginationEntity.params.branchId = this.currentUser.branchID;
      }
      this.customerListService.getCustomerForLinkPagination(customerPaginationEntity).subscribe((value) => {
        this.customerPaginationEntity = value;
        this.customerPaginationEntity.resultsCustomers.forEach(element => {
          element.customerNameNoPipe = this.sharedService.getCustomerName(element);
        });
      });
    } else {
      await this.customerListService.getCustomersPagination(customerPaginationEntity).subscribe(
        (data) => {
          this.customerPaginationEntity = data;
          this.customerPaginationEntity.resultsCustomers.forEach(element => {
            element.customerNameNoPipe = this.sharedService.getCustomerName(element);
          });
        }
      );
    }
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Get Selected Customer
   */
  addCustomer(rowData: any) {
    this.selectedCustomer.emit(rowData);
  }

  /**
   * add guarantors
   * @param customer customer
   */
  addguarantors(customer) {
    if (this.categoryCustomerLink === AcmConstants.CUSTOMER_LINK_CATEGORY_GUARANTOR) {
      this.customerGuarantors = [];
      this.guarantorsAreValid = true;
      this.index = 0;
      this.getExistCustomerIsGuarantorOrHaveLoan(customer);
    } else if (this.categoryCustomerLink === AcmConstants.CUSTOMER_LINK_CATEGORY_GRP) {
      this.addMembers(customer);
    } else {
      this.selectedCustomer.emit(customer);
      this.modal.dismissAll();
    }
  }
  /**
   * close Modale
   */
  closeModale() {
    this.modal.dismissAll();
  }

  /**
   * getConnectedUser
   */
  async getConnectedUser() {
    this.currentUser = this.sharedService.getUser();

  }
  /**
   * getExistCustomerIsGuarantorOrHaveLoan
   * @param customerSelected list
   */
  async getExistCustomerIsGuarantorOrHaveLoan(customerSelected) {
    if (checkOfflineMode()) {
      this.selectedCustomer.emit(customerSelected);
      this.modal.dismissAll();



    } else {

      
      let blacklistCheckPromises = customerSelected.map(async (element) => {
        // check Blacklist
        let blacklistItemPagination: BlacklistItemPagination = new BlacklistItemPagination();
    
        blacklistItemPagination.params = new BlacklistItem();
        blacklistItemPagination.params.status = AcmConstants.BLACKLIST_DOWNGRADE_PROCESS;
        blacklistItemPagination.params.nationalId = element.identity;
    
        blacklistItemPagination.pageNumber = 0;
        blacklistItemPagination.pageSize = 10;
    
        let res = await this.blacklistService.findBlacklistItems(blacklistItemPagination).toPromise();
        if (res.resultsBlacklistItems.length > 0) {
          this.devToolsServices.openToast(3, "alert.blaclist_check");
          return true;  // Return true if blacklisted
        }
        return false;  // Return false if not blacklisted
      });
    
      // Wait for all promises to resolve
      let blacklistResults = await Promise.all(blacklistCheckPromises);
    
      // Check if any customer is blacklisted
      this.isBlacklisted = blacklistResults.some(result => result);
    
      if (!this.isBlacklisted) {
        await this.customerManagementService.getEnvirementValueByKey(AcmConstants.CUSTOMER_GUARANTOR).toPromise().then((data) => {
          if (data.value === '1') {
            customerSelected.forEach(element => {
              const customerLinksRelationshipEntity: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
              customerLinksRelationshipEntity.category = AcmConstants.RELATION_GUARANTOR;
              customerLinksRelationshipEntity.member = element;
              this.guarantorsDetailsService.findCustomerActiveGuarantor(customerLinksRelationshipEntity).toPromise().then(
                (guarantor) => {
                  if (guarantor.length > 0) {
                    this.index++;
                    this.guarantorsAreValid = false;
                    this.devToolsServices.openToastWithCustomerName(3, 'alert.customer_is_guarantor_add_guarantor', element.customerName);
                    return;
                  } else {
                    this.guarantorsDetailsService.findAllActiveAccountsForCustomer(element.customerIdExtern).toPromise().then(
                      (customerAccount) => {
                        if (customerAccount.length > 0) {
                          this.index++;
                          this.guarantorsAreValid = false;
                          this.devToolsServices.openToastWithCustomerName(3, 'alert.guarantor_have_loan', element.customerName);
                          return;
                        } else {
                          this.index++;
                          this.customerGuarantors.push(element);
                          if ((this.index === customerSelected.length) && (this.guarantorsAreValid === true)) {
                            this.selectedCustomer.emit(this.customerGuarantors);
                            this.modal.dismissAll();
                          }
                        }
                      });
                  }

                });

            });

          } else {
            this.selectedCustomer.emit(customerSelected);
            this.modal.dismissAll();
          }
        });
      }
    }
  }

  /**
   * add only members who doesn't belongs to groups
   * @param customerSelected members selected
   */
  addMembers(customerSelected) {
    customerSelected.forEach(element => {

      const relationShip = new CustomerLinksRelationshipEntity();
      relationShip.member = new CustomerEntity();
      relationShip.member.id = element.id;
      relationShip.category = AcmConstants.MEMBERS;
      relationShip.checkForGroup = true;
      this.customerServices.findCustomerLinkRelationShip(relationShip).subscribe(
        (value) => {
          this.index++;
          this.members = value;
          if (this.members.length !== 0) {
            this.devToolsServices.openToastWithCustomerName(3, 'alert.member_exist', this.members[0].member.customerName);
          } else {
            this.customerMembers.push(element);
          }
          if (this.index === customerSelected.length) {
            this.selectedCustomer.emit(this.customerMembers);
            this.modal.dismissAll();
          }
        });
    });
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
}
