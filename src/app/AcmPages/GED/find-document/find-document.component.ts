import {Component, OnInit} from '@angular/core';
import {AcmConstants} from '../../../shared/acm-constants';
import {AcmDevToolsServices} from '../../../shared/acm-dev-tools.services';
import {GedServiceService} from '../ged-service.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {LoanDocumentEntity} from '../../../shared/Entities/loanDocument.entity';
import {AcmDocumentPaginationEntity} from '../../../shared/Entities/acmDocumentPagination.entity';
import {Router} from '@angular/router';
import {CustomerServices} from '../../Loan-Application/customer/customer.services';
import {CustomerEntity} from 'src/app/shared/Entities/customer.entity';
import {LoanEntity} from 'src/app/shared/Entities/loan.entity';
import {SharedService} from '../../../shared/shared.service';
import { CustomerListService } from '../../Customer/customer-list/customer-list.service';
import { CustomerPaginationEntity } from '../../../shared/Entities/customer.pagination.entity';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../../app.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-find-document',
  templateUrl: './find-document.component.html',
  styleUrls: ['./find-document.component.sass']
})
export class FindDocumentComponent implements OnInit {
  customers: CustomerEntity[] = [];
  filteredCustomerSingle: CustomerEntity[] = [];
  filteredCustomer: CustomerEntity;
  public showTable: boolean;

  loans: LoanEntity[] = [];
  documentTypes: Array<any> = [];
  allDocuments: Array<any> = [];
  allDocumentss: Array<any> = [];

  public searchForm: FormGroup;
  public page: number;
  public pageSize: number;
  public totalPages: number;
  public totalElements: number;
  public loanDocumentEntity: LoanDocumentEntity = new LoanDocumentEntity();
  public formControlInput: FormControl = new FormControl();
  public customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();
  loanByCustomer: LoanEntity[] = [];
  public loanFound = true;
  public loanFoundByAccount = true;
  filteredLoanSingle: LoanEntity[];
  newSearch: boolean;
  accountNumber: string;
  productDescription: string;
  customerName: any;
  cutomerselectedInput = false;
  loading: boolean;
  selectedloan: string;
  loanselectedInput: boolean;
  loanAccount: any;
  public historyDocuments: any = [];

  /**
   *
   * @param devToolsServices AcmDevToolsServices
   * @param gedService GedServiceService
   * @param formBuilder FormBuilder
   * @param router Router
   * @param customerService CustomerServices
   * @param sharedService SharedService
   */
  constructor(public devToolsServices: AcmDevToolsServices,
              public modalService: NgbModal,
              public gedService: GedServiceService,
              public formBuilder: FormBuilder,
              public router: Router,
              public customerService: CustomerServices,
              public sharedService: SharedService,
              public translate: TranslateService,
              public customerListService: CustomerListService, ) {

  }

  ngOnInit() {
    this.createForm();
    this.showTable = false;
    this.getDocumentTypes();
  }

  resetafterAdd() {

    this.createForm();
  }
  async asyncResetAdd() {
    await this.resetafterAdd();
  }
  filterLoanSingle(event) {
    const param: LoanEntity = new LoanEntity();
    if (event.query.length >= 5) {
      param.accountNumber = event.query;
      // find loan by customer ID
      this.gedService.findLoanbyAccount(param).subscribe(
        (data) => {
          this.filteredLoanSingle = data;
        });
    }
  }
  filterCustmorname(event) {
    // init pagination params
    this.customerPaginationEntity.pageSize = 25;
    this.customerPaginationEntity.pageNumber = 0;
    this.customerPaginationEntity.params = new CustomerEntity();
    if (event.query.length >= 3) {
      this.customerPaginationEntity.params.customerName = event.query;

      this.customerListService.getCustomersPagination(this.customerPaginationEntity).subscribe(
        (data) => {
          this.customerPaginationEntity = data;
          this.customerPaginationEntity.resultsCustomers.forEach((element) => {
            element.customerNameNoPipe = this.sharedService.getCustomerName(element);
          });
        }
      );
    }
  }
  /**
   * create form
   */
  createForm() {
    this.searchForm = this.formBuilder.group({
      documentType: [''],
      loanAccount: [''],
      customerName: [''],
      creationDate: [''],
      customerNumber: [''],
      customerIdentity: ['']
    });
  }
  /**
   * methode to get loans of customer
   */
   selectLoanByCustomer() {

    if (this.newSearch === true) {
      this.reset();
      this.loanByCustomer = [];
      this.newSearch = false;
    } else {
      this.accountNumber = '';
      this.productDescription = '';
      const param: LoanEntity = new LoanEntity();
      if (this.customerName) {
        param.customerDTO = this.customerName  ;
      } else {
        param.customerDTO = new CustomerEntity();
        param.customerDTO.customerNumber = this.searchForm.controls.customerNumber.value;
        param.customerDTO.identity = this.searchForm.controls.customerIdentity.value;
        // param.customerDTO.telephone1 = this.searchForm.controls.telephone.value;
        param.customerDTO.customerNumber = this.searchForm.controls.customerNumber.value;

      }

      // find loan by customer ID

      this.gedService.findLoanByCustumerDto(param.customerDTO).subscribe(
        (data) => {
          this.loanByCustomer = data;
          this.filteredLoanSingle = data;
          if (this.loanByCustomer.length > 0) {
            this.loanFound = true;
          }
          this.loading = false;
        });
      this.cutomerselectedInput = true; }
    }

accountChange(event) {
  this.showTable = false;
  this.loanFoundByAccount = false;
  this.allDocuments = [];
  const param: LoanEntity = new LoanEntity();
  param.accountNumber = event.query;
  if (!this.searchForm.controls.loanAccount.value) {
    this.loanFoundByAccount = true;
  }
  this.gedService.findLoanbyAccount(param).subscribe(
    (data) => {
    if (data.length > 0) {
      this.loanByCustomer = data;
      this.loanFoundByAccount = true;
    }
    });
}
  /**
   * get All document Types
   */
  getDocumentTypes() {
    const body = {};
    this.gedService.getAllDocumentTypes(body).subscribe((allDocumentTypes => {
      allDocumentTypes.map((documentType) => {
        this.documentTypes.push(documentType);
      });
    }));
  }
  /**
   * Methode exit
   */
  exit() {
    this.router.navigate([AcmConstants.DASHBOARD_URL]);
  }

  /**
   * search document
   */
  async onSubmit() {
    if ((this.loanFound) && (this.loanFoundByAccount)) {
      this.reset();
      if (this.searchForm.controls.documentType.value) {
        this.loanDocumentEntity.titre = this.searchForm.controls.documentType.value;
      }
      if (this.searchForm.controls.loanAccount.value) {
        if (this.cutomerselectedInput === false) {
          this.loanDocumentEntity.accountNumberExtern = this.searchForm.controls.loanAccount.value.accountNumber;
        }
        if (this.cutomerselectedInput === true) {
          this.loanDocumentEntity.accountNumberExtern = this.searchForm.controls.loanAccount.value;
        }
      }
      if (this.searchForm.controls.customerName.value) {
        this.loanDocumentEntity.idCustomer = this.searchForm.controls.customerName.value.id;
      }
      if (this.searchForm.controls.creationDate.value) {
        this.loanDocumentEntity.dateCreation = this.searchForm.controls.creationDate.value;
      }
      if (this.searchForm.controls.customerNumber.value) {
        this.loanDocumentEntity.customerNumber = this.searchForm.controls.customerNumber.value;
      }
      if (this.searchForm.controls.customerIdentity.value) {
        this.loanDocumentEntity.customerIdentity = this.searchForm.controls.customerIdentity.value;
      }
      if ((this.searchForm.controls.documentType.value) || (this.searchForm.controls.loanAccount.value)
      || (this.searchForm.controls.customerName.value) || (this.searchForm.controls.creationDate.value)
      || (this.searchForm.controls.customerNumber.value) || (this.searchForm.controls.customerIdentity.value)) {
        this.getDocumentsWithPagination(this.page);
        this.showTable = true;
      }
    } else {
      this.showTable = false;

    }

  }

  /**
   * get all document with pagination
   * @param number page
   */
  async getDocumentsWithPagination(page) {
    if (this.loanFound) {
      const acmDocumentsPagination: AcmDocumentPaginationEntity = new AcmDocumentPaginationEntity();
      acmDocumentsPagination.pageNumber = page - 1;
      acmDocumentsPagination.pageSize = this.pageSize;
      acmDocumentsPagination.params = this.loanDocumentEntity;
      await this.gedService.getDocumentPagination(acmDocumentsPagination).toPromise().then((documentsPagination) => {
        this.allDocuments = documentsPagination.resultsAcmDocuments;

        this.totalPages = documentsPagination.totalPages;
        this.totalElements = documentsPagination.totalElements;
      });
    }

  }

  /**
   * methode change page
   * @param any event
   */
  changePagination(event) {
    this.allDocuments = [];
    const page = event;
    this.getDocumentsWithPagination(page);
  }

  /**
   * reset
   */
  reset() {
    this.allDocuments = [];
    this.pageSize = 5;
    this.page = 1;
    this.loanDocumentEntity = new LoanDocumentEntity();
    this.showTable = false;
    this.historyDocuments = [];
    this.modalService.dismissAll();
  }

  getDirection() {
    return AppComponent.direction;
  }


  /**
   * reset all screen
   */
  resetForm() {
    this.cutomerselectedInput = false;
    this.reset();
    this.createForm();
  }

  /**
   * view document selected
   * param file
   * param idDocumentGED
   */
  view(idDocumentGED) {
    if (idDocumentGED !== '') {
      this.gedService.getDocumentType(idDocumentGED).subscribe((value) => {
          const documentType = value.mimeType;
          this.gedService.getDocument(idDocumentGED).subscribe(
            (res: any) => {
              const fileData = [res];
              const blob = new Blob(fileData, {type: documentType});
              const url = window.URL.createObjectURL(blob);
              window.open(url, '_blank');
            }
          );
        }
      );
    } else {
      this.devToolsServices.openToast(3, 'error.ACM-00000');
    }
  }


  openLargePupupHistoryDoc(content, d) {
    this.modalService
      .open(content, {
        size: 'lg',
      })
      .result.then((result) => { });

     if ( d.loanId !== undefined && d.loanId !== null) {
      this.gedService
        .getHistoryListDocument(
          d.settingDocumentTypeDTO.id,
          d.loanId, 
          d.documentIndex
        )
        .subscribe((values) => {
          this.historyDocuments = values;
        });
    } else {
      this.gedService
        .getHistoryListDocumentByCustomer(
          d.settingDocumentTypeDTO.id,
          d.idCustomer, d.documentIndex
        )
        .subscribe((values) => {
          this.historyDocuments = values;
        });
    }
  }

  resetPupupHistoryDoc() {
    this.historyDocuments = [];
    this.modalService.dismissAll();
  }

}
