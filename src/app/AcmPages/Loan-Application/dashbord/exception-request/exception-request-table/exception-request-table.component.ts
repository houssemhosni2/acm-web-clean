import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import { CustomerManagementService } from 'src/app/AcmPages/Customer/customer-management/customer-management.service';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { ExceptionRequestPaginationEntity } from 'src/app/shared/Entities/ExceptionRequestPagination.entity';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanDetailsServices } from '../../../loan-details/loan-details.services';
import { ExceptionRequestService } from '../exception-request.service';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { LoanManagementService } from '../../../loan-management/loan-management.service';

@Component({
  selector: 'app-exception-request-table',
  templateUrl: './exception-request-table.component.html',
  styleUrls: ['./exception-request-table.component.sass']
})
export class ExceptionRequestTableComponent implements OnInit {
  public currentPath = AcmConstants.EXCEPTION_REQUESTS_URL;
  @Input() public exceptionRequestEntityList: ExceptionRequestPaginationEntity;
  @Input() public statut: number;
  @Output() public update =  new EventEmitter<boolean>();
  public statusList = AcmConstants.STATUT_EXCEPTION_REQUEST_LIST;
  public cols: any[];
  public colsRejectTab: any[];
  public page: number;
  public pageSize: number;
  public selectedColumns: any[];
  public currentUser: UserEntity = new UserEntity();
  public settingMotifRejetsEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifRejetsEntitys = [];
  public modalForm: FormGroup;
  public exceptionRequest: ExceptionRequestEntity;
  public popupStatut: number;
  public decimalPlaces: string;
  public currencySymbol : string;
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
              public translate: TranslateService, public loanManagementService : LoanManagementService) { }

  async ngOnInit() {
    await this.getConnectedUser();
    this.cols = [
      { field: 'makerName', header: 'loan_management.request_exception.maker_name' },
      { field: 'customerName', header: 'loan_management.request_exception.customer_name' },
      { field: 'allowedAmount', header: 'loan_management.request_exception.allowed_amount' },
      { field: 'requestedAmount', header: 'loan_management.request_exception.requested_amount' },
      { field: 'ownerUsername', header: 'loan_management.request_exception.updated_by' },
      { field: 'dateInsertion', header: 'loan_management.request_exception.inserted_date' },
      { field: 'dateLastUpdate', header: 'loan_management.request_exception.updated_date'},
    ];
    // add column reject reason
    this.colsRejectTab = [
      { field: 'makerName', header: 'loan_management.request_exception.maker_name' },
      { field: 'customerName', header: 'loan_management.request_exception.customer_name' },
      { field: 'allowedAmount', header: 'loan_management.request_exception.allowed_amount' },
      { field: 'requestedAmount', header: 'loan_management.request_exception.requested_amount' },
      { field: 'ownerUsername', header: 'loan_management.request_exception.updated_by' },
      { field: 'dateInsertion', header: 'loan_management.request_exception.inserted_date' },
      { field: 'dateLastUpdate', header: 'loan_management.request_exception.updated_date'},
      { field: 'rejectNote', header: 'loan_management.request_exception.reject_reason'}
    ];
    // init pagination params
    if (this.statut === -1 || this.statut === 1) {
      this.selectedColumns = this.colsRejectTab;
    } else {
      this.selectedColumns = this.cols;
    }

    this.pageSize = 10;
    this.page = 1;
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(3);
    this.getProducts();
  }
  /**
   * getProducts
   * @returns
   */
  async getProducts(): Promise<boolean> {
    let result:  boolean ;
    const productEntity = new ProductEntity();
    result = await this.loanManagementService.getProducts(productEntity).toPromise().then(
      (data) => {
        this.currencySymbol = data[0].acmCurrency.symbol;
        return true;
      }
    );
    return result
  }
  async reloadRequestsList(event: LazyLoadEvent) {

    const exceptionRequestPaginationEntity: ExceptionRequestPaginationEntity = new ExceptionRequestPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    exceptionRequestPaginationEntity.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      exceptionRequestPaginationEntity.pageNumber = event.first;
    } else {
      exceptionRequestPaginationEntity.pageNumber = event.first / event.rows;
    }

    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const requestParams: ExceptionRequestEntity = new ExceptionRequestEntity();

    if (event.filters !== undefined) {
      requestParams.makerName = event.filters.makerName !== undefined ? event.filters.makerName.value : null;
      requestParams.customerName = event.filters.customerName !== undefined ? event.filters.customerName.value : null;
      requestParams.allowedAmount = event.filters.allowedAmount !== undefined ? event.filters.allowedAmount.value : null;
      requestParams.requestedAmount = event.filters.requestedAmount !== undefined ? event.filters.requestedAmount.value : null;
      requestParams.dateInsertion = event.filters.dateInsertion !== undefined ? event.filters.dateInsertion.value : null;
      requestParams.dateLastUpdate = event.filters.dateLastUpdate !== undefined ? event.filters.dateLastUpdate.value : null;
      requestParams.ownerUsername = event.filters.ownerUsername !== undefined ? event.filters.ownerUsername.value : null;
      requestParams.rejectNote = event.filters.rejectNote !== undefined ? event.filters.rejectNote.value : null ;
      requestParams.statut = this.statut;
    }
    exceptionRequestPaginationEntity.params = requestParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      exceptionRequestPaginationEntity.sortField = event.multiSortMeta[0].field;
      exceptionRequestPaginationEntity.sortDirection = event.multiSortMeta[0].order;
    }

    await this.exceptionRequestService.findExceptionRequestPagination(exceptionRequestPaginationEntity).subscribe((data) => {
      this.exceptionRequestEntityList = data;
    });
  }

  updateStatus(rowData: ExceptionRequestEntity, newStatut: number) {
    // if status is reject/Accept exception request then check the validity of the reject from
    // and set the rejection reason
    if (newStatut === -1 || newStatut === 1) {
      if (this.modalForm.valid) {
        rowData.rejectNote = this.modalForm.controls.reason.value.libelle + ' : '
        + this.modalForm.controls.note.value;
      } else {
        return;
      }
    }
    const oldStatut = rowData.statut;
    rowData.statut = newStatut;
    this.exceptionRequestService.updateStatutExceptionRequest(rowData).subscribe(() => {
      // close the model if reject or accept reason
      if (newStatut === -1 || newStatut === 1 ) {
        this.modalService.dismissAll();
      }
      const index = this.exceptionRequestEntityList.result.indexOf(rowData);
      this.exceptionRequestEntityList.result.splice(index, 1);
      this.update.emit(true);
      this.devToolsServices.openToast(0, 'alert.success');
      },
        (err) => {
          // generally an error occured when the connected user is not from the allowed group declared in the system setting
          rowData.statut = oldStatut;
        }
      );
  }
  /**
   * get Connected User
   */
  async getConnectedUser() {
    this.currentUser = this.sharedService.getUser();

  }
  async customerDetails(rowData) {
      await this.customerManagementService.getCustomerInformation(rowData.customerId).toPromise().then(
        (data) => {
          this.sharedService.setCustomer(data);
        });
      this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'exception-request' } });
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
   if (categorie === AcmConstants.REJECT_CATEGORIE) {
    this.popupStatut = -1;
    this.settingMotifRejetsEntity.categorie = AcmConstants.REJECT_EXCEPTION_REQUEST;
   } else if (categorie === AcmConstants.ACCEPTED) {
    this.popupStatut = 1;
    this.settingMotifRejetsEntity.categorie = AcmConstants.ACCEPT_EXCEPTION_REQUEST;
   }
   this.createForm();
   this.settingMotifRejetsEntitys = [];
   await this.loanDetailsServices.getReason(this.settingMotifRejetsEntity).toPromise().then(
      (data) => {
        // list of reason by category Exception request
        this.settingMotifRejetsEntitys = data;
      }
    );
  }
  /**
   * Get direction
   */
  getDirection() {
    return AppComponent.direction;
  }
  close() {
    this.exceptionRequest.statut = 0;
    this.modalService.dismissAll();
  }
}
