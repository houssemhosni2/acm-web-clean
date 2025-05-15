import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import { CustomerManagementService } from 'src/app/AcmPages/Customer/customer-management/customer-management.service';
import { CustomerServices } from 'src/app/AcmPages/Loan-Application/customer/customer.services';
import { ExceptionRequestService } from 'src/app/AcmPages/Loan-Application/dashbord/exception-request/exception-request.service';
import { LoanDetailsServices } from 'src/app/AcmPages/Loan-Application/loan-details/loan-details.services';
import { LoanManagementService } from 'src/app/AcmPages/Loan-Application/loan-management/loan-management.service';
import { ScreeningStepService } from 'src/app/AcmPages/Loan-Application/screening-step/screening-step.service';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AppComponent } from 'src/app/app.component';
import { AcmAmlCheckEntity } from 'src/app/shared/Entities/AcmAmlCheck';
import { AcmDoubtfulLoanAnalyticsEntity } from 'src/app/shared/Entities/AcmDoubtfulLoanAnalytics.entity';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { GenericWorkFlowObject } from 'src/app/shared/Entities/GenericWorkFlowObject';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { ItemRequestPagination } from 'src/app/shared/Entities/itemRequestPagination.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-generic-wf-unassigned-table',
  templateUrl: './generic-wf-unassigned-table.component.html',
  styleUrls: ['./generic-wf-unassigned-table.component.sass']
})
export class GenericWfUnassignedTableComponent implements OnInit {

  public currentPath = AcmConstants.EXCEPTION_REQUESTS_URL;
  @Input() public itemEntityList: ItemRequestPagination;
  @Input() public statut: string ;
  @Output() public update =  new EventEmitter<boolean>();
  public statusList = AcmConstants.STATUT_EXCEPTION_REQUEST_LIST;
  public cols: any[];
  public colsRejectTab: any[];
  public page: number;
  public pageSize: number;
  public selectedColumns: any[];
  public currentUser: UserEntity = new UserEntity();

  public modalForm: FormGroup;
  public exceptionRequest: ExceptionRequestEntity;
  public popupStatut: number;
  public decimalPlaces: string;
  public currencySymbol : string;
  public objects  : GenericWorkFlowObject[];
  public categories : string[] = ["SCAN","DOUBTFUL"];
  public sourceParam :string;
  /**
   *
   * @param authService AuthentificationService
   * @param sharedService SharedService
   * @param router Router
   * @param customerManagementService CustomerManagementService
   * @param exceptionRequestService ExceptionRequestService
   * @param devToolsServices AcmDevToolsServices
   * @param modalService NgbModal
   * @param loanDetailsServices LoanDetailsServices
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   */
  constructor(public authService: AuthentificationService, public sharedService: SharedService, public router: Router,
              public customerManagementService: CustomerManagementService, public exceptionRequestService: ExceptionRequestService,
              public devToolsServices: AcmDevToolsServices, public modalService: NgbModal,
              public loanDetailsServices: LoanDetailsServices, public formBuilder: FormBuilder,
              public translate: TranslateService,private route: ActivatedRoute , public loanManagementService : LoanManagementService
              ,public settingService  : SettingsService ,public customerServices:CustomerServices, public screeningStepService : ScreeningStepService) { }

  async ngOnInit() {
    await this.getConnectedUser();
    this.route.queryParams.subscribe(params => {
      this.sourceParam = params['source'];

    });
    this.cols = [
      { field: 'id', header: 'generic_wf.reference' },
      { field: 'description', header: 'customer.customer_name' },
      { field: 'insertBy', header: 'generic_wf.insertBy' },
      { field: 'genericWorkFlowObject', header:  'generic_wf.object_name' },
      { field: 'dateInsertion', header: 'loan_management.request_exception.inserted_date' },
      { field: 'dateLastUpdate', header: 'loan_management.request_exception.updated_date'},
      { field: 'ownerName', header: 'generic_wf.owner' },
      { field: 'groupOwner', header: 'generic_wf.groupe_owner' },
      { field: 'groupOwnerName', header: 'generic_wf.group_owner_name' },

    ];
    if (this.sourceParam === AcmConstants.AML_STATUS) {
      this.cols.splice(6, 0, { field: 'category', header: 'setting.category' });
  }
    // add column reject reason
      this.selectedColumns = this.cols;

    this.pageSize = 10;
    this.page = 1;
    this.getObejects();
  }
  /**
   * getProducts
   * @returns
   */
  async getObejects(){

 await this.settingService.findWorkFlowObjects().toPromise().then(
      (data) => {
        this.objects = data
      }
    );

  }
  async reloadItemList(event: LazyLoadEvent) {

    const itemPaginationEntity: ItemRequestPagination = new ItemRequestPagination();
    // setting pageSize : event.rows = Number of rows per page
    itemPaginationEntity.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      itemPaginationEntity.pageNumber = event.first;
    } else {
      itemPaginationEntity.pageNumber = event.first / event.rows;
    }

    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const requestParams: ItemEntity = new ItemEntity();
    if (this.statut === AcmConstants.AML_STATUS){
      requestParams.category = AcmConstants.AML_DOUBTFUL+","+AcmConstants.AML_CHECK ;
    }
    if (event.filters !== undefined) {
      requestParams.id = event.filters.id !== undefined ? event.filters.id.value : null;
      requestParams.insertBy = event.filters.insertBy !== undefined ? event.filters.insertBy.value : null;
      requestParams.dateInsertion = event.filters.dateInsertion !== undefined ? event.filters.dateInsertion.value : null;
      requestParams.dateLastUpdate = event.filters.dateLastUpdate !== undefined ? event.filters.dateLastUpdate.value : null;
      requestParams.owner = event.filters.owner !== undefined ? event.filters.owner.value : null;
      requestParams.groupOwner = event.filters.groupOwner !== undefined ? event.filters.groupOwner.value : null;
      requestParams.groupOwnerName = event.filters.groupOwnerName !== undefined ? event.filters.groupOwnerName.value : null;
      requestParams.genericWorkFlowObject =  new GenericWorkFlowObject()
      requestParams.genericWorkFlowObject.id = event.filters.genericWorkFlowObject !== undefined ? event.filters.genericWorkFlowObject.value : null;
      requestParams.description = event.filters.description !== undefined ? event.filters.description.value : null;
      if (this.sourceParam !== AcmConstants.AML_STATUS) {
        requestParams.category = event.filters.category !== undefined ? event.filters.category.value : null;
      }
    }
    itemPaginationEntity.params = requestParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      itemPaginationEntity.sortField = event.multiSortMeta[0].field;
      itemPaginationEntity.sortDirection = event.multiSortMeta[0].order;
    }

    await this.settingService.findUnassignedItemPagination(itemPaginationEntity).subscribe((data) => {
      this.itemEntityList = data;
    });
  }


  /**
   * get Connected User
   */
  async getConnectedUser() {
    this.currentUser = this.sharedService.getUser();

  }

  /**
   * form of reject exception request
   */
   createForm() {
    this.modalForm = this.formBuilder.group({
      reason: ['', Validators.required],
      note: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }
  /**
   * modal of reason
   * @param refModel modal reason
   */
  async modal(refModel, rowData: ExceptionRequestEntity, categorie: string) {
   this.modalService.open(refModel, {
      size: 'md',
    });
    // set the exception request to be rejected
   this.exceptionRequest = rowData;
   // Check if the category was accept or reject to change the statu of the exception request and bring the right list of reject reason


  }
  /**
   * Get direction
   */
  getDirection() {
    return AppComponent.direction;
  }


  async assignItem(rowData) {
    const confirmation = await this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.ASSIGN_ITEM).afterClosed().toPromise();
    if (confirmation) {

         const data = await this.settingService.assignItem(rowData).toPromise();
         rowData.owner = data.owner;
         rowData.ownerName = data.ownerName;
         this.devToolsServices.openToast(0, 'alert.generic_wf_assigned_successfully');
         this.sharedService.setItem(data);
   
         if (data.category === AcmConstants.AML_CHECK) {
           const acmAmlCheck = new AcmAmlCheckEntity();
           acmAmlCheck.id = rowData.elementId;
           const checkAmlResult = await this.screeningStepService.findCheckAml(acmAmlCheck).toPromise();
           this.sharedService.setAcmAmlCheck(checkAmlResult[0]);
           const customer = await this.customerServices.getCustomerInformation(checkAmlResult[0].customerId).toPromise();
           this.sharedService.setCustomer(customer);
           this.router.navigate(['/acm/generic-wf-screen'], { queryParams: { source: AcmConstants.AML_CHECK} });
         } else if (data.category === AcmConstants.AML_DOUBTFUL) {
           const acmDoubtfulLoanAnalyticsEntity = new AcmDoubtfulLoanAnalyticsEntity();
           acmDoubtfulLoanAnalyticsEntity.id = rowData.elementId;
           const doubtfulLoanResult = await this.screeningStepService.findDoubtfulLoanTransaction(acmDoubtfulLoanAnalyticsEntity).toPromise();
           if (doubtfulLoanResult) {
             this.sharedService.setAcmDoubtfulLoanAnalytics(doubtfulLoanResult[0]);
             const customer = await this.customerServices.getCustomerInformation(doubtfulLoanResult[0].customerId).toPromise();
             this.sharedService.setCustomer(customer);
             this.router.navigate(['/acm/generic-wf-screen'], { queryParams: { source: AcmConstants.AML_DOUBTFUL } });
           }
         } else {
           this.router.navigate(['/acm/generic-wf-screen']);
         }
    }
   }
   
}
