import { Component, OnInit, ViewChild } from '@angular/core';
import { GedServiceService } from '../ged-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { LoanDocumentEntity } from '../../../shared/Entities/loanDocument.entity';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { DocumentTypeEntity } from '../../../shared/Entities/documentType.entity';
import { SettingDocumentTypeEntity } from '../../../shared/Entities/settingDocumentType.entity';
import { AcmConstants } from '../../../shared/acm-constants';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';
import { SharedService } from '../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';
import { CustomerPaginationEntity } from 'src/app/shared/Entities/customer.pagination.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerListService } from '../../Customer/customer-list/customer-list.service';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-add-document-ged',
  templateUrl: './add-document-ged.component.html',
  styleUrls: ['./add-document-ged.component.sass'],
})
export class AddDocumentGedComponent implements OnInit {
  public searchForm: FormGroup;
  disableButtonSerche: boolean;
  filteredLoanSingle: LoanEntity[];
  filteredCustomerSingle: any[] = [];
  customerByLoan: object;
  accountNumber: any = '';
  customerName: any = '';
  customerNumber: any = '';
  customerIdentity: any = '';
  cutomerselectedInput = false;
  loanselectedInput = false;
  productDescription = '';
  selectedTitle: string;
  selectedValue = AcmConstants.LOAN;
  uploadedFile: any = AcmConstants.UPLOAD;
  fileName = '';
  fileDescription = '';
  loanByCustomer: LoanEntity[] = [];
  customerDocuments = [];
  loanDocuments = [];
  acmDocuments: DocumentTypeEntity[] = [];
  allDocuments = [];
  settingDocTypeMltipleCustomer: SettingDocumentTypeEntity[] = [];
  settingDocTypeMltipleLoan: SettingDocumentTypeEntity[] = [];
  settingDocTypes: SettingDocumentTypeEntity[] = [];
  selectedloan: LoanEntity = new LoanEntity();
  test = false;
  public popupForm: FormGroup;
  customers: Array<any> = [];
  uploadedFiles: any[] = [];
  public customerPaginationEntity: CustomerPaginationEntity =
    new CustomerPaginationEntity();
  filteredCustomer: CustomerEntity;
  public loanFound = false;
  public newSearch = false;
  public idCustomer: any;
  public documentsToRemove: LoanDocumentEntity[] = [];
  public historyDocuments: any = [];

  public customerNotFound = true;
  documentsToDisable = [];
  /**
   *
   * @param gedService GedServiceService
   * @param modalService NgbModal
   * @param datePipe DatePipe
   * @param sharedFunction AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param router Router
   * @param devToolsServices AcmDevToolsServices
   * @param customerService CustomerServices
   * @param sharedService SharedService
   * @param translate TranslateService
   */
  constructor(
    public gedService: GedServiceService,
    public modalService: NgbModal,
    public datePipe: DatePipe,
    public sharedFunction: AcmDevToolsServices,
    public formBuilder: FormBuilder,
    public router: Router,
    public devToolsServices: AcmDevToolsServices,
    public customerService: CustomerServices,
    public sharedService: SharedService,
    public translate: TranslateService,
    public customerListService: CustomerListService
  ) { }

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public loading = true;

  /**
   * Oninit get loans
   */
  ngOnInit() {
    this.createForm();
    this.loading = false;
  }

  /**
   * Methode to create form popup
   * @param title title
   * @param fileName fileName
   * @param file file
   * @param description description
   */
  createForm() {
    this.popupForm = this.formBuilder.group({
      title: ['', Validators.required],
      fileName: ['', Validators.required],
      file: ['', Validators.required],
      description: [''],
    });

    this.searchForm = this.formBuilder.group({
      customerNumber: [''],
      customerIdentity: [''],
      customerName: [''],
      telephone: [''],
    });
  }

  /**
   * Methode to getCustomers
   */
  getCustomers() {
    this.customerService.getCustomerByOwner().subscribe((data) => {
      data.forEach((element) => {
        element.customerNameNoPipe =
          this.sharedService.getCustomerName(element);
      });
      for (let i = 0; i < data.length; i++) {
        this.customers.push(data[i].customerNameNoPipe);
      }
    });
  }
  filterCustmorname(event) {
    // init pagination params
    this.customerPaginationEntity.pageSize = 25;
    this.customerPaginationEntity.pageNumber = 0;
    this.customerPaginationEntity.params = new CustomerEntity();
    if (event.query.length >= 3) {
      this.customerPaginationEntity.params.customerName = event.query;

      this.customerListService
        .getCustomersPagination(this.customerPaginationEntity)
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
   * methode to get loans (autocomplete)
   * param event
   */
  filterLoanSingle(event) {
    const param: LoanEntity = new LoanEntity();
    if (event.query.length >= 5) {
      param.accountNumber = event.query;
      // find loan by customer ID
      this.gedService.findLoanbyAccount(param).subscribe((data) => {
        this.filteredLoanSingle = data;
      });
    }
  }

  /**
   * methode to get customers (autocomplete)
   * param event
   */
  filterCustomerSingle(event) {
    this.filteredCustomerSingle = [];
    for (let i = 0; i < this.customers.length; i++) {
      const customer = this.customers[i];
      if (customer.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredCustomerSingle.push({ name: customer, code: i });
      }
    }
  }
  /**
   * methode to get cutomer by loan account and change value loanselectedInput to true
   * and get all document by loan account
   */
  select() {
    this.asyncResetAdd().then(() => {
      this.selectedloan = this.accountNumber;
      this.accountNumber.customerDTO.customerNameNoPipe =
        this.sharedService.getCustomerName(this.accountNumber.customerDTO);
      this.customerName = this.accountNumber.customerDTO.customerNameNoPipe;
      this.productDescription = this.accountNumber.productDescription;
      this.loanselectedInput = true;
      if (
        this.sharedService.getUser().login === this.accountNumber.owner ||
        this.sharedService.getAuthorized()
      ) {
        this.getAllDocumentsByLoan(this.accountNumber);
      }
    });
  }

  /**
   * get select value from checkbox
   * param event
   */
  selectValue(event) {
    this.selectedValue = event.target.value;
  }

  /**
   * delete selected document
   * param deletedDocument
   */
  deleteDocument(deletedDocument) {
    const documentTypeEntity = new LoanDocumentEntity();
    documentTypeEntity.file = deletedDocument.file;
    documentTypeEntity.name = deletedDocument.name;
    documentTypeEntity.idDocument = deletedDocument.idDocument;
    this.devToolsServices
      .openConfirmDialogWithoutRedirect('confirmation_dialog.delete')
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (
            deletedDocument.settingDocumentType.categorie ===
            AcmConstants.TYPE_DOCUMENT_CATEGORIE_CUSTOMER
          ) {
            this.customerDocuments.map((value, index) => {
              if (value === deletedDocument) {
                if (value.idDocument !== null) {
                  // add deleted document to documentToRemoveList
                  this.documentsToRemove.push(documentTypeEntity);
                }
                this.customerDocuments.splice(index, 1);
              }
            });
          }
          if (
            deletedDocument.settingDocumentType.categorie ===
            AcmConstants.TYPE_DOCUMENT_CATEGORIE_LOAN
          ) {
            this.loanDocuments.map((value, index) => {
              if (value === deletedDocument) {
                if (value.idDocument !== null) {
                  // add deleted document to documentToRemoveList
                  this.documentsToRemove.push(documentTypeEntity);
                }
                this.loanDocuments.splice(index, 1);
              }
            });
          }
          this.check();
          this.devToolsServices.openToast(
            2,
            'alert.document_deleted_after_save'
          );
        }
      });
  }

  /**
   *  check required
   *  if file not emty add to alldocuments
   */
  check() {
    this.allDocuments = [];
    this.customerDocuments.map((value) => {
      if (value.file !== '' && value.idDocument === null) {
        this.allDocuments.push(value);
      }
    });
    this.loanDocuments.map((value) => {
      if (value.file !== '' && value.idDocument === null) {
        this.allDocuments.push(value);
      }
    });
  }

  /**
   * add the new document to alldocuments
   */
  addNewDocument() {
    let type: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();
    type = this.settingDocTypes.find(
      (value) => value.libelle === this.popupForm.controls.title.value
    );
    const document: DocumentTypeEntity = new DocumentTypeEntity();
    document.title = type.libelle;
    document.name = this.popupForm.controls.fileName.value;
    document.settingDocumentType = type;
    document.description = this.popupForm.controls.description.value;
    document.date = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
    document.file = this.uploadedFile;
    document.idfile = '';
    document.idDocument = null;
    document.mandatory = type.mandatory;
    const arrayfiltredByTitle = this.acmDocuments.filter(
      (documentTitle) => documentTitle.title === type.libelle
    );
    let maxIndex = 0;
    if (arrayfiltredByTitle.length > 0) {
      maxIndex = Math.max.apply(
        Math,
        arrayfiltredByTitle.map((max) => max.documentIndex)
      );
      document.documentIndex = maxIndex + 1;
    } else {
      document.documentIndex = 1;
    }
    this.acmDocuments.push(document);
    if (this.selectedValue === AcmConstants.CUSTOMER) {
      this.customerDocuments.push(document);
    }
    if (this.selectedValue === AcmConstants.LOAN) {
      this.loanDocuments.push(document);
    }
    this.check();
  }

  /**
   * add document to array according to the category
   * param uploadedDocument
   */
  addDocuments(event, selectedDocument) {
    if (
      selectedDocument.settingDocumentType.categorie ===
      AcmConstants.TYPE_DOCUMENT_CATEGORIE_CUSTOMER
    ) {
      this.customerDocuments.map((value) => {
        if (value === selectedDocument) {
          if (this.documentsToDisable.length !== 0) {
            this.documentsToDisable.map((element) => {
              if (element.title == selectedDocument.title) {
                element = selectedDocument;
              }
            });
          }
          else {
            this.documentsToDisable.push(selectedDocument);
          }
          // Convert the list to a JSON string
          const listDocumentsToRemove = JSON.stringify(this.documentsToDisable);
          // Store the list string in localStorage
          localStorage.setItem('listDocumentsToRemove', listDocumentsToRemove);
          value.name = event.target.files[0].name;
          value.date = this.datePipe.transform(Date.now(), 'yyyy/MM/dd');
          value.file = event.target.files[0];
          value.settingDocumentType = selectedDocument.settingDocumentType;
          value.mandatory = selectedDocument.mandatory;
          value.idfile = '';
          value.idDocument = null;
        }
      });
    }
    if (
      selectedDocument.settingDocumentType.categorie ===
      AcmConstants.TYPE_DOCUMENT_CATEGORIE_LOAN || selectedDocument.settingDocumentType.categorie ===
      AcmConstants.TYPE_DOCUMENT_CATEGORIE_SIGNED_AGREEMENT
    ) {
      this.loanDocuments.map((value) => {
        if (value === selectedDocument) {
          if (this.documentsToDisable.length !== 0) {
            this.documentsToDisable.map((element) => {
              if (element.title == selectedDocument.title) {
                element = selectedDocument;
              }
            });
          }
          else {
            this.documentsToDisable.push(selectedDocument);

          }
          // Convert the list to a JSON string
          const listDocumentsToRemove = JSON.stringify(this.documentsToDisable);
          // Store the list string in localStorage
          localStorage.setItem('listDocumentsToRemove', listDocumentsToRemove);
          value.name = event.target.files[0].name;
          value.date = this.datePipe.transform(Date.now(), 'yyyy/MM/dd');
          value.file = event.target.files[0];
          value.settingDocumentType = selectedDocument.settingDocumentType;
          value.mandatory = selectedDocument.mandatory;
          value.idfile = '';
          value.idDocument = null;
        }
      });
    }
    this.check();
  }

  /**
   * change id saved document
   * @param Document document
   */
  changeIdSavedDocument(document, idDocument) {
    if (document.settingDocumentTypeDTO.categorie === 1) {
      this.customerDocuments.map((customerDoc) => {
        if (customerDoc.title === document.titre) {
          customerDoc.idDocument = idDocument;
        }
      });
    } else if (document.settingDocumentTypeDTO.categorie === 0) {
      this.loanDocuments.map((loanDoc) => {
        if (loanDoc.title === document.titre) {
          loanDoc.idDocument = idDocument;
        }
      });
    }
  }

  /**
   * save documents in database
   */
  async save() {
    // Retrieve the list from localStorage
    const storedListDocuments = localStorage.getItem('listDocumentsToRemove');
    if (storedListDocuments) {
      // Parse the JSON string back to a list
      const storedList: LoanDocumentEntity[] = JSON.parse(storedListDocuments);
      storedList.forEach((value) => {
        this.gedService
          .disableDocument(value)
          .toPromise()
          .then((res) => {
            this.devToolsServices.openToast(0, 'alert.success');
            // Remove the list from localStorage
            localStorage.removeItem('listDocumentsToRemove');

          });
      });
    }
    // save added documents
    const arrayFile: any[] = [];
    const documents: any[] = [];
    this.allDocuments.map((value, index) => {
      const document: LoanDocumentEntity = new LoanDocumentEntity();
      let settingDocumentType: SettingDocumentTypeEntity;
      settingDocumentType = value.settingDocumentType;
      if (value.file !== '') {
        document.titre = value.title;
        if (value.description) {
          document.description = value.description;
        } else {
          document.description = value.settingDocumentType.description;
        }
        if (this.selectedloan.accountNumber) {
          document.loanId = this.selectedloan.loanId;
          document.idCustomer = this.selectedloan.customerDTO.id;
          document.customerName = this.sharedService.getCustomerName(
            this.selectedloan.customerDTO
          );
          document.accountNumberExtern = this.selectedloan.accountNumber;
        } else {
          document.idCustomer = this.customerName.id;
          document.customerName = this.sharedService.getCustomerName(
            this.customerName
          );
        }
        document.auteur = 'acm';
        document.settingDocumentTypeDTO = settingDocumentType;
        document.mandatory = value.mandatory;
        document.documentIndex = value.documentIndex;
        document.name = value.file.name;
        document.documentSize = value.file.size;
        document.idCustomer = this.idCustomer;
        value.idCustomer = this.idCustomer;
        documents.push(document);
        arrayFile.push(value.file);
      }
    });
    await this.gedService
      .saveListDocuments(arrayFile, documents)
      .subscribe((value1) => {
        value1.forEach((doc) => {
          this.changeIdSavedDocument(doc, doc.idDocument);
          this.devToolsServices.openToast(0, 'alert.success');
        });
      });
    this.allDocuments = [];
  }

  /**
   * Display the confirmation message
   */
  onsave() {
    if (
      (this.allDocuments === undefined || this.allDocuments.length === 0) &&
      this.documentsToRemove.length === 0
    ) {
      this.sharedFunction.openToast(3, 'alert.no_document_to_save');
    } else {
      this.devToolsServices
        .openConfirmDialogWithoutRedirect('confirmation_dialog.upload')
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            this.save().then(() => {
              this.allDocuments = [];
              this.documentsToRemove = [];
            });
          }
        });
    }
  }

  openLargePupupHistoryDoc(content, d) {
    this.modalService
      .open(content, {
        size: 'lg',
      })
      .result.then((result) => { });

    if (this.selectedValue === 'loan') {
      this.gedService
        .getHistoryListDocument(
          d.settingDocumentType.id,
          this.selectedloan.loanId,
          d.documentIndex
        )
        .subscribe((values) => {
          this.historyDocuments = values;
        });
    } else {
      this.gedService
        .getHistoryListDocumentByCustomer(
          d.settingDocumentType.id,
          this.idCustomer, d.documentIndex
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
  openPopupCustomer(content) {
    this.settingDocTypeMltipleCustomer = [];
    this.openLarge(content);
    this.settingDocTypes.map((value) => {
      let index;
      if (value.categorie === 1) {
        index = this.customerDocuments.filter(
          (type) => type.title === value.libelle
        );
        if (index.length > 0) {
          if (value.uniqueness === false) {
            this.settingDocTypeMltipleCustomer.push(value);
          }
        } else {
          this.settingDocTypeMltipleCustomer.push(value);
        }
      }
    });
  }

  openPopupLoan(content) {
    this.settingDocTypeMltipleLoan = [];
    this.openLarge(content);
    this.settingDocTypes.map((value) => {
      let index;
      if (value.categorie === 0) {
        index = this.loanDocuments.filter(
          (type) => type.title === value.libelle
        );
        if (index.length > 0) {
          if (value.uniqueness === false) {
            this.settingDocTypeMltipleLoan.push(value);
          }
        } else {
          this.settingDocTypeMltipleLoan.push(value);
        }
      }
      if (value.categorie === 2) {
        this.settingDocTypeMltipleLoan.push(value);
      }
    });
  }

  /**
   * methode to open the popup create new
   * param content
   */
  openLarge(content) {
    this.createForm();
    this.modalService.open(content, {
      size: 'lg',
    });
  }

  /**
   * reset all arrays when changing the value checkbox
   */
  reset() {
    this.selectedloan = new LoanEntity();
    this.filteredLoanSingle = [];
    this.filteredCustomerSingle = [];
    this.customerName = '';
    this.selectedTitle = '';
    this.uploadedFile = AcmConstants.UPLOAD;
    this.customerByLoan = [];
    this.accountNumber = '';
    this.customerName = '';
    this.cutomerselectedInput = false;
    this.loanselectedInput = false;
    this.productDescription = '';
    this.loanByCustomer = [];
    this.acmDocuments = [];
    this.loanDocuments = [];
    this.customerDocuments = [];
    this.settingDocTypeMltipleCustomer = [];
    this.settingDocTypeMltipleLoan = [];
    this.fileDescription = '';
    this.fileName = '';
    this.allDocuments = [];
    this.test = true;
    this.settingDocTypes = [];
    this.documentsToRemove = [];
    this.createForm();
  }

  /**
   * reset after add new document
   */
  resetafterAdd() {
    this.selectedTitle = '';
    this.uploadedFile = AcmConstants.UPLOAD;
    this.fileDescription = '';
    this.fileName = '';
    this.settingDocTypeMltipleCustomer = [];
    this.settingDocTypeMltipleLoan = [];
    this.settingDocTypes = [];
    this.acmDocuments = [];
    this.loanDocuments = [];
    this.customerDocuments = [];
    this.createForm();
  }

  async asyncResetAdd() {
    await this.resetafterAdd();
  }

  /**
   * methode to get loans of customer
   */
  async selectLoanByCustomer() {
    if (this.newSearch === true) {
      this.reset();
      this.loanByCustomer = [];
      this.newSearch = false;
    } else {
      this.accountNumber = '';
      this.productDescription = '';
      const param: LoanEntity = new LoanEntity();
      if (this.customerName) {
        param.customerDTO = this.customerName;
      } else {
        const customerPagination = new CustomerPaginationEntity();
        customerPagination.params = new CustomerEntity();
        customerPagination.params.customerNumber = this.searchForm.controls.customerNumber.value;
        customerPagination.params.identity = this.searchForm.controls.customerIdentity.value;
        customerPagination.params.telephone1 = this.searchForm.controls.telephone.value;
        await this.customerListService.getCustomersPagination(customerPagination).toPromise().then(
          (data) => {
            if (data.resultsCustomers.length === 0) {
              this.customerNotFound = false;
            } else {
              param.customerDTO = data.resultsCustomers[0];
            }
          }
        );
      }
      if (this.customerNotFound) {
        // find loan by customer ID and get all loan without owner check (For only Authorized Group)
        this.gedService.findLoanByCustumerDto(param.customerDTO).subscribe(
          (data) => {
            this.loanByCustomer = data;
            if (this.loanByCustomer.length > 0) {
              this.loanFound = true;
            }
            this.loading = false;
          });
        this.cutomerselectedInput = true;
      }
    }
    // Get loan by owner

  }

  /**
   * get all documents by customerName or accountNumber
   * @param any customerName
   * @param any loan
   */
  getAllDocumentsByLoan(loan: LoanEntity) {
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.loanId = loan.loanId;
    this.acmDocuments = [];
    this.loanDocuments = [];
    this.gedService.getDocumentsByLoan(document).subscribe((arrayDocuments) => {
      this.acmDocuments = [];
      this.loanDocuments = [];
      arrayDocuments.map((value) => {
        const documentType: DocumentTypeEntity = new DocumentTypeEntity();
        documentType.title = value.titre;
        documentType.name = value.name;
        documentType.settingDocumentType = value.settingDocumentTypeDTO;
        documentType.date = this.datePipe.transform(
          value.dateCreation,
          'yyyy/MM/dd'
        );
        documentType.description = value.description;
        documentType.file = value.idDocumentGED;
        documentType.idfile = value.idDocumentGED;
        documentType.idDocument = value.idDocument;
        documentType.mandatory = value.mandatory;
        documentType.documentIndex = value.documentIndex;
        this.acmDocuments.push(documentType);
      });
      this.acmDocuments.map((type) => {
        if (type.settingDocumentType.categorie !== 1) {
          this.loanDocuments.push(type);
        }
      });
    });
    this.gedService.getAllDocumentTypes({}).subscribe((documentTypes) => {
      documentTypes.map((value) => {
        this.settingDocTypes.push(value);
      });
    });
    this.newSearch = true;
  }

  /**
   * get all documents by customerName
   * @param any customerName
   * @param any accountNumber
   */
  getDocumentCustomer(customerIdentity, customerNumber, telephone) {
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.idCustomer = this.customerName.id;
    document.customerIdentity = customerIdentity;
    document.customerNumber = customerNumber;
    document.telephone1 = telephone;
    if (this.selectedValue === 'customer') {
      document.processLoanDocuments = true;
    }
    this.acmDocuments = [];
    this.customerDocuments = [];
    this.gedService.getDocumentsByLoan(document).subscribe((arrayDocuments) => {
      arrayDocuments.map((value) => {
        if (value.settingDocumentTypeDTO.categorie === 1) {
          const documentType: DocumentTypeEntity = new DocumentTypeEntity();
          documentType.title = value.titre;
          documentType.name = value.name;
          documentType.settingDocumentType = value.settingDocumentTypeDTO;
          documentType.date = this.datePipe.transform(
            value.dateCreation,
            'yyyy/MM/dd'
          );
          documentType.description = value.description;
          documentType.file = value.idDocumentGED;
          documentType.idfile = value.idDocumentGED;
          documentType.idDocument = value.idDocument;
          documentType.mandatory = value.mandatory;
          documentType.documentIndex = value.documentIndex;
          this.acmDocuments.push(documentType);
        }
        this.idCustomer = value.idCustomer;
      });
      this.acmDocuments.map((type) => {
        this.customerDocuments.push(type);
      });
    });
    this.gedService.getAllDocumentTypes({}).subscribe((documentTypes) => {
      documentTypes.map((value) => {
        this.settingDocTypes.push(value);
      });
    });
  }

  /**
   * get all documents by customer
   */
  getAllDocumentsByCustomer() {
    if (
      !this.searchForm.controls.customerName.value &&
      !this.searchForm.controls.customerIdentity.value &&
      !this.searchForm.controls.customerNumber.value &&
      !this.searchForm.controls.telephone.value
    ) {
      this.devToolsServices.openToast(3, 'alert.no_search_document_criteria');
    } else {
      this.getDocumentCustomer(
        this.searchForm.controls.customerIdentity.value,
        this.searchForm.controls.customerNumber.value,
        this.searchForm.controls.telephone.value
      );
    }
  }

  /**
   * change product value by selecting account number
   */
  selectAccountNumber() {
    if (this.loanFound && this.accountNumber !== 'Select loan number') {
      this.selectedloan = new LoanEntity();
      this.loanByCustomer.map((value, index) => {
        if (value.accountNumber === this.accountNumber) {
          this.selectedloan = value;
          this.productDescription = value.productDescription;
        }
      });
      // select return accountNumber without {name}
      this.getAllDocumentsByLoan(this.selectedloan);
    }
  }

  /**
   * reset all arrays when input change
   */
  inputchange() {
    this.reset();
  }

  /**
   * Methode exit
   */
  exit() {
    this.router.navigate([AcmConstants.DASHBOARD_URL]);
  }

  /**
   * methode to get selected file to upload
   * @param Any event
   */
  onUpload(event) {
    if (event.files.length > 0) {
      for (const file of event.files) {
        this.uploadedFile = '';
        this.popupForm.controls.fileName.setValue(this.uploadedFile.name);
        if (this.sharedService.geTypeMimes().includes(file.type)) {
          if (file.size <= this.sharedService.getMaxSizeFileUpload()) {
            this.uploadedFile = file;
            this.popupForm.controls.fileName.setValue(this.uploadedFile.name);
            this.popupForm.controls.file.setValue(this.uploadedFile);
          } else {
            this.devToolsServices.openToastForMaxSizeImg(
              3,
              'alert.file_size',
              this.sharedService.getMaxSizeFileUpload()
            );
          }
        } else {
          this.devToolsServices.openToast(3, 'alert.file_type');
        }
      }
    }
  }

  /**
   * set value null to file variable when remove file from list
   */
  onRemove() {
    this.popupForm.controls.file.setValue('');
    this.uploadedFile = '';
    this.popupForm.controls.fileName.setValue(this.uploadedFile.name);
  }

  /**
   * view document selected
   * param file
   * param idDocumentGED
   */
  view(file, idDocumentGED, docName) {
    let url = '';
    let name = docName;
    if (idDocumentGED !== '') {
      this.gedService.getDocumentType(idDocumentGED).subscribe((value) => {
        const documentType = value.mimeType;
        this.gedService.getDocument(idDocumentGED).subscribe((res: any) => {
          const fileData = [res];
          const blob = new Blob(fileData, { type: documentType });
          url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          document.body.appendChild(a);
          a.hidden = true;

          a.href = url;
          a.download = name;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    } else {
      url = URL.createObjectURL(file);
      name = file.name;
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.hidden = true;

      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  ngOnDestroy(): void {
    localStorage.removeItem('listDocumentsToRemove');
  }
}
