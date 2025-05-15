import { Component, Input, OnInit} from "@angular/core";
import { CustomerPaginationEntity } from "../../../shared/Entities/customer.pagination.entity";
import { CustomerEntity } from "../../../shared/Entities/customer.entity";
import { CustomerListService } from "./customer-list.service";
import { AcmConstants } from "../../../shared/acm-constants";
import { Router, ActivatedRoute } from "@angular/router";
import { SharedService } from "../../../shared/shared.service";
import { LazyLoadEvent } from "primeng/api";
import { CustomerLinksRelationshipEntity } from "src/app/shared/Entities/CustomerLinksRelationship.entity";
import { GuarantorsDetailsService } from "../../Loan-Application/guarantors-step/guarantors-details/guarantors-details.service";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
import { CustomerManagementService } from "../customer-management/customer-management.service";
import { GedServiceService } from "../../GED/ged-service.service";
import { DomSanitizer } from "@angular/platform-browser";
import { UserEntity } from "src/app/shared/Entities/user.entity";
import { ScreeningStepService } from "../../Loan-Application/screening-step/screening-step.service";
import { ThirdPartyHistoriqueEntity } from "src/app/shared/Entities/thirdPartyHistorique.entity";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AppComponent } from "src/app/app.component";
import { ReportService } from "../../Reporting/report.service";
import { checkOfflineMode } from "src/app/shared/utils";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { AcmAmlCheckEntity } from "src/app/shared/Entities/AcmAmlCheck";
import { SettingsService } from "../../Settings/settings.service";
import { AcmAmlDataEntity } from "src/app/shared/Entities/AcmAmlData";
import { ItemEntity } from "src/app/shared/Entities/Item.entity";
import { BlacklistItem } from "src/app/shared/Entities/blacklistItem.entity";
import { BlacklistItemPagination } from "src/app/shared/Entities/blacklistItemPagination.entity";
import { BlacklistService } from "../../Blacklist/blacklist.service";
import { AcmAmlListSetting } from "src/app/shared/Entities/AcmAmlListSetting.entity";
@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.sass"],
})
export class CustomerListComponent implements OnInit {
  public cols: any[];
  public selectedColumns: any[];
  public page: number;
  public pageSize: number;
  public customerPaginationEntity: CustomerPaginationEntity =
    new CustomerPaginationEntity();
  public customer: CustomerEntity;
  public selectedCustomers: CustomerEntity[];
  public currentPath = AcmConstants.CUSTOMER_LIST;
  public currentUser: UserEntity;
  public thirdPartyHistoriques: ThirdPartyHistoriqueEntity[] = [];
  public showButtonDownloadAML = false;
  image: any = "../../../../assets/images/avatars/user.jpg";
  // Mode 1 : customer 360
  // Mode 2 : Edit customer
  // Mode 3 : Add loan
  // Mode 5 : List Prospect
  // Mode 6 : setting offline
  @Input() mode;
  @Input() fromSupplier360;
  amlCheck: AcmAmlCheckEntity = new AcmAmlCheckEntity();
  acmAmlChecksDTOs : AcmAmlCheckEntity[];
  amlData: AcmAmlDataEntity;
  amlDetails: AcmAmlDataEntity;
  items: ItemEntity[] = [];
  amlStatusList: String[] = ['PENDING', 'FLAGGED', 'CLEARED']
  public amlListSettings: AcmAmlListSetting[] = [];

  public detailsTab: boolean = true;
  public sanctionsListTab: boolean = false;
  public identityTab: Boolean = false;
  public functionsTab: boolean = false;
  public noteTab: boolean = false;
  public sourcesTab: boolean = false;

  /**
   *
   * @param customerListService CustomerListService
   * @param router Router
   * @param sharedService SharedService
   * @param activatedRoute ActivatedRoute
   * @param guarantorsDetailsService GuarantorsDetailsService
   * @param devToolsServices AcmDevToolsServices
   * @param customerManagementService CustomerManagementService
   * @param gedService GedServiceService
   * @param sanitizer DomSanitizer
   * @param screeningStepService ScreeningStepService
   * @param modalService NgbModal
   * @param reportingService ReportService
   */
  constructor(
    public customerListService: CustomerListService,
    public router: Router,
    public sharedService: SharedService,
    public activatedRoute: ActivatedRoute,
    public guarantorsDetailsService: GuarantorsDetailsService,
    public devToolsServices: AcmDevToolsServices,
    public customerManagementService: CustomerManagementService,
    public gedService: GedServiceService,
    public sanitizer: DomSanitizer,
    public screeningStepService: ScreeningStepService,
    public modalService: NgbModal,
    public translate: TranslateService,
    public reportingService: ReportService,
    public settingService: SettingsService,
    private dbService: NgxIndexedDBService,
    public blacklistService: BlacklistService
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if(params?.mode)
      this.mode = params.mode;
    });
    this.cols = [
      { field: "customerType", header: "category_loan.category_loan" },
      { field: "customerNumber", header: "customer.customer_number" },
      { field: "customerNameNoPipe", header: "customer.customer_name" },
      { field: "identity", header: "customer.customer_identity" },
      { field: "solidarityName", header: "customer.customer_group" },
      { field: "branchesName", header: "customer.branch" },
      { field: "accountPortfolioDescription", header: "customer.portfolio" },
      { field: "dateInsertion", header: "customer.created" },
      { field: "amlStatus", header: "customer.aml_status" },
    ];
    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
    this.customerPaginationEntity.params = new CustomerEntity();
    this.currentUser = this.sharedService.getUser();
    if (this.mode === "5") {
      this.currentPath = "list-prospect";
      this.customerPaginationEntity.params.customerType =
        AcmConstants.CUSTOMER_CATEGORY_PROSPECT;
    }
    if (this.fromSupplier360) {
      this.customerPaginationEntity.params.supplierRecommandation =
        this.sharedService.getSupplier().id;
      this.mode = "1";
    }
    if (this.mode === "2" || this.mode === "3" || this.mode ==="6") {
      this.customerPaginationEntity.params.customerType =
        AcmConstants.CUSTOMER_TYPE_INDIVIDUAL;
    }

    if (checkOfflineMode()) {
      await this.dbService
        .getByKey("customers-pagination", "customers-list")
        .subscribe((data: any) => {
          if (data === undefined) {
            this.devToolsServices.openToast(3, "Customers data not saved");
          } else {
            delete data.id;
            this.customerPaginationEntity = data;
            this.customerPaginationEntity.resultsCustomers.forEach(
              (element) => {
                element.customerNameNoPipe =
                  this.sharedService.getCustomerName(element);
                // this.customerPaginationEntity.resultsCustomers.push(element);
              }
            );
            if (this.mode === "5") {
              this.customerPaginationEntity.resultsCustomers =
                this.customerPaginationEntity.resultsCustomers.filter(
                  (customer) => customer.customerType === "PROSPECT"
                );

              this.customerPaginationEntity.totalElements =
                this.customerPaginationEntity.resultsCustomers.length;
              this.customerPaginationEntity.totalPages = 1;
            }
            else if (this.mode == "2"|| this.mode === "3"){
              this.customerPaginationEntity.resultsCustomers =
              this.customerPaginationEntity.resultsCustomers.filter(
                (customer) => customer.customerType ===  AcmConstants.CUSTOMER_TYPE_INDIVIDUAL
              );
            }
          }
        });
    } else {
      await this.customerListService
        .getCustomersPagination(this.customerPaginationEntity)
        .subscribe((data) => {
          this.customerPaginationEntity = data;
          this.customerPaginationEntity.resultsCustomers.forEach((element) => {
            element.customerNameNoPipe =
              this.sharedService.getCustomerName(element);
          });
        });

        this.settingService.findAMLListSetting(new AcmAmlListSetting()).toPromise().then((res) => {
          this.amlListSettings = res.map(item => ({ ...item, listName: item.listName.replaceAll("_", " ") }));
        })
    }
  }

  /**
   * customerDetails open customer 360
   * @param rowData Customer
   */
  customerDetails(rowData) {
    try {
      this.customer = rowData;
      this.sharedService.setCustomer(this.customer);
      this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], {
        queryParams: { source: "customer-list" },
      });
    } catch (error) {
      this.sharedService.setCustomer(this.customer);
      this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], {
        queryParams: { source: "customer-list" },
      });
    }
  }

  /**
   * addLoanForCustomer open loan for customer
   * @param rowData Customer
   */
  async addLoanForCustomer(rowData) {
    this.customer = rowData;
    await this.checkBlacklist(rowData);
  }

  /**
   * customerUpdate open customer management for update
   * @param rowData Customer
   */
  async customerUpdate(rowData, action: string) {
    if (action === AcmConstants.UPDATE) {
      if (checkOfflineMode()) {        
        this.sharedService.setCustomer(rowData);
        this.sharedService.setLoan(null);
        if(rowData.id){
        this.router.navigate([AcmConstants.EDIT_CUSTOMER]);
        } else {
          this.router.navigate([AcmConstants.CUSTOMER_URL]);
        }
      } else {
        await this.customerListService
          .checkLoanIssuedByCustomer(rowData)
          .toPromise()
          .then((issued) => {
            if (
              issued &&
              this.currentUser.groupes[0].code !==
              AcmConstants.GROUPE_SUPER_ADMIN_CODE
            ) {
              this.devToolsServices.openToast(
                3,
                "alert.customer_have_a_loan_issued"
              );
            } else {
              this.sharedService.setCustomer(rowData);
              this.sharedService.setLoan(null);
              this.router.navigate([AcmConstants.EDIT_CUSTOMER]);
            }
          });
      }
    }else if (action === AcmConstants.UPDATE_ALL && this.mode === "5") {
      this.sharedService.setCustomer(rowData);
      this.sharedService.setLoan(null);
       const acmEnvironmentKeys: string[] = [AcmConstants.CONVERTIR_PROSPECT_AML];
      this.settingService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
        let ConvertirProspectAml = environments[0].enabled;
        if (ConvertirProspectAml) { 
         if (environments[0].value === '1') {
          let disabled = false;
  
          if (rowData.acmAmlChecksDTOs.length > 0) {
            for (const setting of this.amlListSettings) {
              if (
                rowData.acmAmlChecksDTOs.filter(
                  (aml) =>
                    (aml.amlStatus ===
                      AcmConstants.AML_STATUS_FLAGGED ||
                      aml.amlStatus ===
                        AcmConstants.AML_STATUS_PENDING) &&
                    setting.listName == aml.listName &&
                    setting.isBlockingList == true
                ).length !== 0
              ) {
                disabled = true;
              }
            }
            if (disabled ) {
              this.devToolsServices.openToast(1, 'alert.error-customer');
            } else {
              this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT]);
            } 
            }else {
              this.screeningStepService.checkAmlCustomer(rowData).subscribe((data) => {
                const dataWithCustomerId = data.map((item) => ({
                  ...item,
                  customerId: this.sharedService.getCustomer().id, 
                }));
                this.screeningStepService.saveCheckAmlCustomer(dataWithCustomerId).subscribe((amlCheck) => {
                  if (data.length > 0) {
                    for (const setting of this.amlListSettings) {
                      if (
                        data.filter(
                          (aml) =>
                            (aml.amlStatus ===
                              AcmConstants.AML_STATUS_FLAGGED ||
                              aml.amlStatus ===
                                AcmConstants.AML_STATUS_PENDING) &&
                            setting.listName == aml.listName &&
                            setting.isBlockingList == true
                        ).length !== 0
                      ) {
                        disabled = true;
                      }
                     }
                    }
                    if (disabled ) {
                      this.devToolsServices.openToast(1, 'alert.error-customer');
                    } else {
                      this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT]);
                    } 
                });
              }); 
            }
         }else {
          this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT]);
         }
        }else {
          this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT]);
         }
      }) 

    } else if (action === AcmConstants.UPDATE_ALL) {      
      this.sharedService.setCustomer(rowData);
      this.sharedService.setLoan(null);
      this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT]);
    } else if (action === AcmConstants.UPDATE_ALL && this.mode === "2") {
      this.sharedService.setCustomer(rowData);
      this.sharedService.setLoan(null);
      this.router.navigate([AcmConstants.EDIT_CUSTOMER]);
    }
  }

  prospectUpdate(rowData) {
    this.sharedService.setCustomer(rowData);
    this.sharedService.setLoan(null);
    this.router.navigate([AcmConstants.EDIT_PROSPECT], { queryParams: { source: 'edit' } });
  }
  /**
   * reloadCustomerList
   * @param $event Event
   */
  async reloadCustomerList(event: LazyLoadEvent) {
    const customerPaginationEntity: CustomerPaginationEntity =
      new CustomerPaginationEntity();
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
      customerParams.customerNumber =
        event.filters.customerNumber !== undefined
          ? event.filters.customerNumber.value
          : null;
      customerParams.customerName =
        event.filters.customerNameNoPipe !== undefined
          ? event.filters.customerNameNoPipe.value
          : null;
      customerParams.identity =
        event.filters.identity !== undefined
          ? event.filters.identity.value
          : null;
      customerParams.solidarityName =
        event.filters.solidarityName !== undefined
          ? event.filters.solidarityName.value
          : null;
      customerParams.branchesName =
        event.filters.branchesName !== undefined
          ? event.filters.branchesName.value
          : null;
      customerParams.accountPortfolioDescription =
        event.filters.accountPortfolioDescription !== undefined
          ? event.filters.accountPortfolioDescription.value
          : null;
      customerParams.customerType =
        event.filters.customerType !== undefined
          ? event.filters.customerType.value
          : null;
      customerParams.dateInsertion =
        event.filters.dateInsertion !== undefined
          ? event.filters.dateInsertion.value
          : null;
      if (this.mode === "4" && event.filters.amlStatus) {
        const amlCheckDto = new AcmAmlCheckEntity();
        amlCheckDto.amlStatus = event.filters.amlStatus.value;
        customerParams.acmAmlChecksDTOs = [amlCheckDto];
      }
    }

    if (this.mode === "5") {
      customerParams.customerType = AcmConstants.CUSTOMER_CATEGORY_PROSPECT;
    }
    if (this.mode === "2" || this.mode === "3" || this.mode ==="6") {
      customerParams.customerType = AcmConstants.CUSTOMER_TYPE_INDIVIDUAL;
    }
    if (this.mode === "1" && this.fromSupplier360) {
      customerParams.supplierRecommandation =
        this.sharedService.getSupplier().id;
    }
    customerPaginationEntity.params = customerParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      customerPaginationEntity.sortField = event.multiSortMeta[0].field;
      customerPaginationEntity.sortDirection = event.multiSortMeta[0].order;
    }

    if (this.mode === "5") {
      this.customerPaginationEntity.params.customerType =
        AcmConstants.CUSTOMER_CATEGORY_PROSPECT;
    }

    if (checkOfflineMode()) {
      if (this.customerPaginationEntity.params.customerType === undefined)
        this.customerPaginationEntity.params.customerType = null;

      const key =
        this.customerPaginationEntity.params.customerType +
        "-p-" +
        customerPaginationEntity.pageNumber;

      await this.dbService
        .getByKey("customers-pagination", key)
        .subscribe((data: any) => {
          if (data === undefined) {
            this.devToolsServices.openToast(3, "Customers data not saved");
          } else {
            delete data.id;
            this.customerPaginationEntity = data;
            this.customerPaginationEntity.resultsCustomers.forEach(
              (element) => {
                element.customerNameNoPipe =
                  this.sharedService.getCustomerName(element);
              }
            );
          }
        });
    } else {
      await this.customerListService
        .getCustomersPagination(customerPaginationEntity)
        .subscribe((data) => {
          this.customerPaginationEntity = data;
          this.customerPaginationEntity.resultsCustomers.forEach((element) => {
            element.customerNameNoPipe =
              this.sharedService.getCustomerName(element);
          });
        });
    }
  }
  /**
   * getExistCustomerGuarantor
   * @param customerSelected CustomerEntity
   */
  async getExistCustomerGuarantor(customerSelected: CustomerEntity) {
    if (checkOfflineMode()) {
      this.sharedService.setCustomer(customerSelected);
      this.sharedService.setLoan(null);
      this.router.navigate([AcmConstants.LOAN_MANAGEMENT_ADD_URL]);
    } else {
      await this.customerManagementService
        .getEnvirementValueByKey(AcmConstants.CUSTOMER_GUARANTOR)
        .toPromise()
        .then((data) => {
          if (data.value === "1") {
            const customerLinksRelationshipEntity: CustomerLinksRelationshipEntity =
              new CustomerLinksRelationshipEntity();
            customerLinksRelationshipEntity.category =
              AcmConstants.RELATION_GUARANTOR;
            customerLinksRelationshipEntity.member = customerSelected;
            this.guarantorsDetailsService
              .findCustomerActiveGuarantor(customerLinksRelationshipEntity)
              .toPromise()
              .then((guarantor) => {
                if (guarantor.length > 0) {
                  this.devToolsServices.openToast(
                    3,
                    "alert.customer_is_guarantor_add_loan"
                  );
                } else {
                  this.sharedService.setCustomer(customerSelected);
                  this.sharedService.setLoan(null);
                  this.router.navigate([AcmConstants.LOAN_MANAGEMENT_ADD_URL]);
                }
              });
          } else {
            this.sharedService.setCustomer(customerSelected);
            this.sharedService.setLoan(null);
            this.router.navigate([AcmConstants.LOAN_MANAGEMENT_ADD_URL]);
          }
        });
    }
  }

  /**
   *
   * @param customer customerEntity
   */
  async checkMaxActiveAccount(customer) {
    if (checkOfflineMode()) {
      this.getExistCustomerGuarantor(customer);
    } else {
      await this.customerManagementService
        .getEnvirementValueByKey(AcmConstants.MAX_CUSTOMER_ACCOUNTS)
        .toPromise()
        .then((environnement) => {
          const maxAccount = Number(environnement.value);
          this.guarantorsDetailsService
            .findAllActiveAccountsForCustomer(customer.customerIdExtern)
            .subscribe((res) => {
              if (res.length >= maxAccount) {
                // maximum account reached
                this.devToolsServices.openToast(
                  3,
                  "alert.customer_active_account_limit"
                );
              } else {
                // check exist customer
                this.getExistCustomerGuarantor(customer);
              }
            });
        });
    }
  }

  async checkBlacklist(customer) {
    if(checkOfflineMode()){
     const result = await this.dbService.getByKey('data', 'getBlacklistItemsByCustomer_' + customer.id).toPromise()as any;
     if(result === undefined){
      this.checkMaxActiveAccount(customer);
     } else {
      this.devToolsServices.openToast(
        3,
        "alert.blaclist_check"
      );
     }
    } else {
    let blacklistItemPagination: BlacklistItemPagination = new BlacklistItemPagination(); 

    blacklistItemPagination.params = new BlacklistItem();
    blacklistItemPagination.params.status = AcmConstants.BLACKLIST_DOWNGRADE_PROCESS;
    blacklistItemPagination.params.nationalId = customer.identity;

    blacklistItemPagination.pageNumber = 0;
    blacklistItemPagination.pageSize = 10;

    this.blacklistService.findBlacklistItems(blacklistItemPagination).toPromise().then((res) => {
      if(res.resultsBlacklistItems.length > 0){
        this.devToolsServices.openToast(
          3,
          "alert.blaclist_check"
        );
      }
      else {
        this.checkMaxActiveAccount(customer);
      }
    });
  }
  }

  /**
   * runAmlCustomer
   * @param rowData customerDTO
   */
  checkAmlCustomer(rowData) {
    // const screeningDTO = new ScreeningEntity();
    // screeningDTO.customerDTO = rowData;
    // screeningDTO.customerCategory = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
    // this.screeningStepService.thirdPartyCheckAml(screeningDTO).subscribe(
    //   (data) => {
    //     this.devToolsServices.openToast(0, 'alert.success');
    //   });

    this.screeningStepService.checkAmlCustomer(rowData).subscribe((data) => {
      this.screeningStepService.saveCheckAmlCustomer(data).subscribe((amlCheck) => {
        this.devToolsServices.openToast(0, "alert.success");
        this.customerPaginationEntity.resultsCustomers.forEach(elem => {
          if (elem.id === amlCheck[0].customerId) {
            elem.acmAmlChecksDTOs = amlCheck;
          }
        })
      });
    });
  }


  async detailsAmlCustomer(content, amlCheck, rowData) {
    this.sharedService.setCustomer(rowData);
    this.amlCheck = amlCheck;
    this.acmAmlChecksDTOs = rowData.acmAmlChecksDTOs;
    this.amlData = new AcmAmlDataEntity();
    this.amlData.id = amlCheck.idAmlData;
    if (amlCheck.idAmlData) {
      await this.settingService.getAmlData(this.amlData).subscribe((res) => {
        this.amlData = res[0];
        this.amlDetails = res[0];
        this.sharedService.setAmlDetails(this.amlDetails);
        this.sharedService.setAcmAmlChecksDTOs(this.acmAmlChecksDTOs);
      });
    }
    
    this.modalService.open(content, {
      size: "lg"
    });
    
  }

  getAmlData(content, rowData){
    let amlCheck = rowData.acmAmlChecksDTOs.filter((item)=> item.idAmlData !== null )[0];
    
    
    if(amlCheck){
      this.detailsAmlCustomer(content, amlCheck, rowData);
    }
  }

  closeAmlDetails(){
    this.amlCheck = new AcmAmlCheckEntity();
    this.acmAmlChecksDTOs = [];
    this.amlData = new AcmAmlDataEntity();
    this.amlDetails = null;
    this.modalService.dismissAll();
  }

  isExistAmlDetails(rowData){
    let amlCheck = rowData.acmAmlChecksDTOs.filter((item)=> item.idAmlData !== null )[0];
    if(amlCheck) return true;
    else return false;
  }

  getDirection() {
    return AppComponent.direction;
  }

  downloadAmlRapport(thirdPartyHistorique: ThirdPartyHistoriqueEntity) {
    const daterun = new Date();
    this.reportingService
      .reportingAml(thirdPartyHistorique)
      .subscribe((res: any) => {
        const fileData = [res];
        const blob = new Blob(fileData, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.download =
          "Report_AML_" +
          daterun.getFullYear() +
          "-" +
          daterun.getMonth() +
          "-" +
          daterun.getDate() +
          "_" +
          daterun.getHours() +
          "-" +
          daterun.getMinutes();
        anchor.href = url;
        anchor.click();
      });
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }

  dismissModal(event?: string){
    if(event === "0"){
      this.modalService.dismissAll();
    }
  }

  changeTab(tab: number) {
    switch (tab) {
      case 1:
        this.detailsTab = true;
        this.sanctionsListTab = false;
        this.identityTab = false;
        this.functionsTab = false;
        this.noteTab = false;
        this.sourcesTab = false;
        break;
      case 2:
        this.detailsTab = false;
        this.sanctionsListTab = true;
        this.identityTab = false;
        this.functionsTab = false;
        this.noteTab = false;
        this.sourcesTab = false;
        break;
      case 3:
        this.detailsTab = false;
        this.sanctionsListTab = false;
        this.identityTab = true;
        this.functionsTab = false;
        this.noteTab = false;
        this.sourcesTab = false;
        break;
      case 4:
        this.detailsTab = false;
        this.sanctionsListTab = false;
        this.identityTab = false;
        this.functionsTab = true;
        this.noteTab = false;
        this.sourcesTab = false;
        break;
      case 5:
        this.detailsTab = false;
        this.sanctionsListTab = false;
        this.identityTab = false;
        this.functionsTab = false;
        this.noteTab = true;
        this.sourcesTab = false;
        break;
      case 6:
        this.detailsTab = false;
        this.sanctionsListTab = false;
        this.identityTab = false;
        this.functionsTab = false;
        this.noteTab = false;
        this.sourcesTab = true;
        break;
    }
  }

  get currentSelection() {
    return this.mode === '6' ? this.selectedCustomers : this.customer;
  }

  set currentSelection(value: CustomerEntity | CustomerEntity[]) {
    if (this.mode === '6') {
      this.selectedCustomers =  Array.isArray(value) ? value : [value];;
    } else {
      this.customer = value  as CustomerEntity;
    }
  }
  getOfflineCustomersPagination(){
    const offlineCustomerspag = {...this.customerPaginationEntity};
    offlineCustomerspag.resultsCustomers = this.selectedCustomers;
    offlineCustomerspag.totalElements = offlineCustomerspag.resultsCustomers.length;
    this.sharedService.setCustomersPaginationOffline(offlineCustomerspag);
  }
}
