import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { DatePipe } from '@angular/common';
import { GedServiceService } from '../ged-service.service';
import { LoanDocumentEntity } from '../../../shared/Entities/loanDocument.entity';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { SettingDocumentTypeEntity } from '../../../shared/Entities/settingDocumentType.entity';
import { DocumentTypeEntity } from '../../../shared/Entities/documentType.entity';
import { AcmConstants } from '../../../shared/acm-constants';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.sass']
})
export class UploadDocumentComponent implements OnInit {

  categoryCostumer = AcmConstants.CUSTOMER;
  categoryLoan = AcmConstants.LOAN;
  costumerDocuments = [];
  settingDocTypeMltipleLoan: SettingDocumentTypeEntity[] = [];
  settingDocTypeMltipleCustomer: SettingDocumentTypeEntity[] = [];
  loanDocuments = [];
  typesDocuments = [];
  allDocuments = [];
  selectedFile: any = '';
  loan: LoanEntity = new LoanEntity();
  loanDTO: LoanEntity = new LoanEntity();
  @Input() idloan: string;
  @Output() toSaveDocuments = new EventEmitter();
  @Output() checkRequiredDoc = new EventEmitter();
  @Output() typeDocumentExist = new EventEmitter();
  public popupForm: FormGroup;
  public loadDocument = false;

  public documentsToRemove: LoanDocumentEntity[] = [];

  /**
   *
   * @param loanSharedService SharedService
   * @param datePipe DatePipe
   * @param gedService GedServiceService
   * @param modalService NgbModal
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   */
  constructor(
    public loanSharedService: SharedService,
    public datePipe: DatePipe,
    public gedService: GedServiceService,
    public modalService: NgbModal,
    public devToolsServices: AcmDevToolsServices,
    public formBuilder: FormBuilder,
    public translate: TranslateService) {

  }

  /**
   * oninit get the settingDocumentType
   * and fill documents from the datababse
   */
  async ngOnInit() {
    this.loan = this.loanSharedService.getLoan();
    this.loanDTO.productId = this.loan.productId;
    // this.loanDTO.statutWorkflow = this.loan.statutWorkflow;

    await this.gedService.getRequiredDocument(this.loanDTO).toPromise().then(documentTypes => {
      documentTypes.map((value) => {
        if (value.categorie !== AcmConstants.TYPE_DOCUMENT_CATEGORIE_SIGNED_AGREEMENT &&
           value.categorie !== AcmConstants.TYPE_DOCUMENT_CATEGORIE_COLLECTION) {
          const documentType: DocumentTypeEntity = new DocumentTypeEntity();
          documentType.settingDocumentType = value;
          documentType.title = value.libelle;
          documentType.mandatory = value.mandatory;
          documentType.name = '-';
          documentType.date = '-';
          documentType.file = '';
          documentType.idfile = '';
          documentType.idDocument = null;
          documentType.documentIndex = 1;
          this.typesDocuments.push(documentType);
          if (value.uniqueness === false) {
            if (value.categorie === AcmConstants.TYPE_DOCUMENT_CATEGORIE_CUSTOMER) {
              this.settingDocTypeMltipleCustomer.push(value);
            } else if (value.categorie === AcmConstants.TYPE_DOCUMENT_CATEGORIE_LOAN) {
              this.settingDocTypeMltipleLoan.push(value);
            }
          }
        }
      });
      if (this.typesDocuments.length !== 0) {
        this.typeDocumentExist.emit(true);
      }
      this.typesDocuments.map((type) => {
        if (type.settingDocumentType.categorie === AcmConstants.TYPE_DOCUMENT_CATEGORIE_CUSTOMER) {
          this.costumerDocuments.push(type);
        } else if (type.settingDocumentType.categorie === AcmConstants.TYPE_DOCUMENT_CATEGORIE_LOAN) {
          this.loanDocuments.push(type);
        }
      });
      this.fillLoanDocument();
      this.fillCustomerDocument();
    });
    this.createForm();
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
      selectedValue: [AcmConstants.CUSTOMER],
      description: ['']
    });
  }

  /**
   * fill loan documents from database
   */
  fillLoanDocument() {
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.loanId = this.loan.loanId;
    this.gedService.getDocumentsByLoan(document).subscribe((arrayDocuments) => {
      arrayDocuments.map((loanDocument) => {
        let found = false;
        this.loanDocuments.map((type) => {
          if ((loanDocument.titre === type.settingDocumentType.libelle) && (loanDocument.documentIndex === type.documentIndex)) {
            type.name = loanDocument.name;
            type.settingDocumentType = loanDocument.settingDocumentTypeDTO;
            type.date = this.datePipe.transform(loanDocument.dateCreation, 'yyyy/MM/dd');
            type.idfile = loanDocument.idDocumentGED;
            type.file = loanDocument.idDocumentGED;
            type.idDocument = loanDocument.idDocument;
            type.mandatory = loanDocument.mandatory;
            type.documentIndex = loanDocument.documentIndex;
            type.updatedBy = loanDocument.updatedBy;
            found = true;
          }
        });
        if (!found) {
          if (loanDocument.settingDocumentTypeDTO.categorie === AcmConstants.TYPE_DOCUMENT_CATEGORIE_LOAN) {
            const documentEntity: DocumentTypeEntity = new DocumentTypeEntity();
            documentEntity.settingDocumentType = loanDocument.settingDocumentTypeDTO,
              documentEntity.title = loanDocument.titre,
              documentEntity.name = loanDocument.name,
              documentEntity.date = this.datePipe.transform(loanDocument.dateCreation, 'yyyy/MM/dd'),
              documentEntity.idfile = loanDocument.idDocumentGED,
              documentEntity.file = loanDocument.idDocumentGED,
              documentEntity.idDocument = loanDocument.idDocument,
              documentEntity.mandatory = loanDocument.mandatory,
              documentEntity.documentIndex = loanDocument.documentIndex;
              documentEntity.file.updatedBy = loanDocument.updatedBy
            this.loanDocuments.push(documentEntity);
          }
        }
      });
      this.check();
      if (this.loanDocuments.length !== 0) {
        this.loadDocument = true;
      }
    });
  }

  /**
   * fill costumer documents from database
   */
  fillCustomerDocument() {
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.idCustomer = this.loan.customerDTO.id;
    document.processLoanDocuments = true;
    document.settingDocumentTypeDTO = new SettingDocumentTypeEntity();
    document.settingDocumentTypeDTO.categorie = AcmConstants.TYPE_DOCUMENT_CATEGORIE_CUSTOMER;
    this.gedService.getDocumentsByLoan(document).subscribe((arrayDocuments) => {

        arrayDocuments.map((loanDocument) => {
          let found = false;
          this.costumerDocuments.map((type) => {
            if ((loanDocument.titre === type.settingDocumentType.libelle) && (loanDocument.documentIndex === type.documentIndex)) {
              type.name = loanDocument.name;
              type.settingDocumentType = loanDocument.settingDocumentTypeDTO;
              type.date = this.datePipe.transform(loanDocument.dateCreation, 'yyyy/MM/dd');
              type.idfile = loanDocument.idDocumentGED;
              type.file = loanDocument.idDocumentGED;
              type.idDocument = loanDocument.idDocument;
              type.documentIndex = loanDocument.documentIndex;
              found = true;
            }
          });
          if (!found) {
            if (loanDocument.settingDocumentTypeDTO.categorie === AcmConstants.TYPE_DOCUMENT_CATEGORIE_CUSTOMER) {
              const obj = {
                settingDocumentType: loanDocument.settingDocumentTypeDTO,
                title: loanDocument.titre,
                name: loanDocument.name,
                date: this.datePipe.transform(loanDocument.dateCreation, 'yyyy/MM/dd'),
                idfile: loanDocument.idDocumentGED,
                file: loanDocument.idDocumentGED,
                idDocument: loanDocument.idDocument,
                documentIndex: loanDocument.documentIndex
              };
              this.costumerDocuments.push(obj);
            }
          }
        });
        this.check();

    });
  }

  /**
   *  check required
   *  if file not emty add to alldocuments
   */
  check() {
    this.allDocuments = [];
    this.costumerDocuments.map((value) => {
      if (typeof value.file === 'string' && (value.file !== '')) {
        this.gedService.getDocument(value.file).subscribe(
          async function(val, result) {
            const file0: File = new File([result], val.name);
            val.file = file0;
            this.allDocuments.push(val);
          }.bind(this, value));
      } else {
        this.allDocuments.push(value);

      }
    });
    this.loanDocuments.map((value) => {
      if ((value.file !== '') && (value.idDocument === null)) {
        this.allDocuments.push(value);
      }
    });
    this.toSaveDocuments.emit(this.allDocuments);
    this.checkRequired();
  }

  /**
   * add document to array according to the category
   * param uploadedDocument
   */
  addDocuments(uploadedDocument) {
    if (uploadedDocument.category === AcmConstants.CUSTOMER) {
      let foundCustomer = false;
      this.costumerDocuments.map((documentTypeEntity) => {
        if ((documentTypeEntity.title === uploadedDocument.document.title) &&
          (documentTypeEntity.documentIndex === uploadedDocument.document.documentIndex)) {
          documentTypeEntity.name = uploadedDocument.document.name;
          documentTypeEntity.date = uploadedDocument.document.date;
          documentTypeEntity.file = uploadedDocument.document.file;
          documentTypeEntity.settingDocumentType = uploadedDocument.document.settingDocumentType;
          documentTypeEntity.mandatory = uploadedDocument.document.mandatory;
          documentTypeEntity.idfile = '';
          documentTypeEntity.idDocument = null;
          documentTypeEntity.exist = false;
          foundCustomer = true;
        }
      });
      if (!foundCustomer) {
        const documentTypeEntity: DocumentTypeEntity = new DocumentTypeEntity();
        documentTypeEntity.title = uploadedDocument.document.title;
        documentTypeEntity.name = uploadedDocument.document.name;
        documentTypeEntity.date = uploadedDocument.document.date;
        documentTypeEntity.file = uploadedDocument.document.file;
        documentTypeEntity.settingDocumentType = uploadedDocument.document.settingDocumentType;
        documentTypeEntity.mandatory = uploadedDocument.document.mandatory;
        documentTypeEntity.documentIndex = uploadedDocument.document.documentIndex;
        documentTypeEntity.idfile = '';
        documentTypeEntity.idDocument = null;
        documentTypeEntity.exist = false;
        this.costumerDocuments.push(documentTypeEntity);
      }
    }
    if (uploadedDocument.category === AcmConstants.LOAN) {
      let foundLoan = false;
      this.loanDocuments.map((value) => {
        if ((value.title === uploadedDocument.document.title) && (value.documentIndex === uploadedDocument.document.documentIndex)) {
          value.name = uploadedDocument.document.name;
          value.date = uploadedDocument.document.date;
          value.file = uploadedDocument.document.file;
          value.settingDocumentType = uploadedDocument.document.settingDocumentType;
          value.mandatory = uploadedDocument.document.mandatory;
          value.idfile = '';
          value.idDocument = null;
          value.exist = false;
          value.updatedBy = uploadedDocument.document.updatedBy;
          foundLoan = true;
        }
      });
      if (!foundLoan) {
        const documentTypeEntity: DocumentTypeEntity = new DocumentTypeEntity();
        documentTypeEntity.title = uploadedDocument.document.title;
        documentTypeEntity.name = uploadedDocument.document.name;
        documentTypeEntity.date = uploadedDocument.document.date;
        documentTypeEntity.file = uploadedDocument.document.file;
        documentTypeEntity.settingDocumentType = uploadedDocument.document.settingDocumentType;
        documentTypeEntity.mandatory = uploadedDocument.document.mandatory;
        documentTypeEntity.documentIndex = uploadedDocument.document.documentIndex;
        documentTypeEntity.idfile = '';
        documentTypeEntity.idDocument = null;
        documentTypeEntity.exist = false;
        this.loanDocuments.push(documentTypeEntity);
      }
    }
    this.check();
  }

  /**
   * delete from array and from database
   * param deletedDocument
   */
  deleteDocument(deletedDocument) {
    const documentTypeEntity = new LoanDocumentEntity();
    documentTypeEntity.file = deletedDocument.document.file;
    documentTypeEntity.name = deletedDocument.document.name;
    documentTypeEntity.idDocument = deletedDocument.document.idDocument;
    if (deletedDocument.category === AcmConstants.CUSTOMER) {
      this.costumerDocuments.map((value, index) => {
        if ((value.title === deletedDocument.document.title) && (value.documentIndex === deletedDocument.document.documentIndex)) {
          if (value.idDocument !== null) {
          // add deleted document to documentToRemoveList
              this.documentsToRemove.push(documentTypeEntity);
          }
          if (deletedDocument.document.documentIndex === 1) {
            value.mandatory = deletedDocument.document.mandatory;
            value.name = '-';
            value.date = '-';
            value.file = '';
            value.idfile = '';
            value.idDocument = null;
          } else {
            this.costumerDocuments.splice(index, 1);
          }
        }
      });
    }
    if (deletedDocument.category === AcmConstants.LOAN) {
      this.loanDocuments.map((value, index) => {
        if ((value.title === deletedDocument.document.title) && (value.documentIndex === deletedDocument.document.documentIndex)) {
          if (value.idDocument !== null) {
                // add deleted document to documentToRemoveList
                this.documentsToRemove.push(documentTypeEntity);
          }
          if (deletedDocument.document.documentIndex === 1) {
            value.mandatory = deletedDocument.document.mandatory;
            value.name = '-';
            value.date = '-';
            value.file = '';
            value.idfile = '';
            value.idDocument = null;
          } else {
            this.loanDocuments.splice(index, 1);
          }
        }
      });
    }
    this.check();
    this.devToolsServices.openToast(2, 'alert.document_deleted_after_save');
  }

  /**
   * methode to open the popup create new
   * param content
   */
  openLarge(content) {
    this.createForm();
    this.modalService.open(content, {
      size: 'lg'
    }).result.then((result) => {

    });
  }

  /**
   * reset when popup closed
   */
  reset() {
    this.createForm();
  }

  /**
   * reset When Changing Selected Value ( loan or customer)
   */
  resetWhenChangingSelectedValue(uploadFile) {
    this.popupForm.controls.title.reset();
    this.popupForm.controls.fileName.reset();
    this.popupForm.controls.file.reset();
    this.popupForm.controls.description.reset();
    uploadFile.clear();
  }

  /**
   * add the new document to alldocuments
   */
  addNewDocument() {
    let i = 0;
    let type: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();
    if (this.popupForm.controls.selectedValue.value === this.categoryCostumer) {
      type = this.settingDocTypeMltipleCustomer.find(value => value.libelle === this.popupForm.controls.title.value);
    } else {
      type = this.settingDocTypeMltipleLoan.find(value => value.libelle === this.popupForm.controls.title.value);
    }
    this.typesDocuments.map((documentType) => {
      if (documentType.settingDocumentType.libelle === type.libelle) {
        i++;
      }
    });
    const document: DocumentTypeEntity = new DocumentTypeEntity();
    if (i === 0) {
      document.title = type.libelle;
    } else {
      document.title = type.libelle + ' ' + i;
    }
    document.description = this.popupForm.controls.description.value;
    document.settingDocumentType = type;
    document.name = this.popupForm.controls.fileName.value;
    document.date = this.datePipe.transform(new Date(), 'yyyy/MM/dd');
    document.file = this.selectedFile;
    document.idfile = '';
    document.idDocument = null;
    document.mandatory = type.mandatory;
    this.typesDocuments.push(document);
    if (this.popupForm.controls.selectedValue.value === this.categoryCostumer) {
      this.costumerDocuments.push(document);
    }
    if (this.popupForm.controls.selectedValue.value === this.categoryLoan) {
      this.loanDocuments.push(document);
    }
    this.check();
    this.reset();
  }

  /**
   * change id saved document
   * @param Document document
   */
  changeIdSavedDocument(document, idDocument) {
    if (document.settingDocumentTypeDTO.categorie === 1) {
      this.costumerDocuments.map((customerDoc) => {
        if ((customerDoc.title === document.titre) && (customerDoc.documentIndex === customerDoc.documentIndex)) {
          customerDoc.idDocument = idDocument;
        }
      });
    } else if (document.settingDocumentTypeDTO.categorie === 0) {
      this.loanDocuments.map((loanDoc) => {
        if ((loanDoc.title === document.titre) && (loanDoc.documentIndex === loanDoc.documentIndex)) {
          loanDoc.idDocument = idDocument;
        }
      });
    }
    this.allDocuments = [];
  }

  /**
   * check required
   */
  checkRequired() {
    let i = 0;
    this.typesDocuments.map((value) => {
      if ((value.idDocument === null) && (value.mandatory === true)) {
        i++;
      }
    });
    this.checkRequiredDoc.emit(i);
  }

  /**
   * methode to get selected file to upload
   * @param Any event
   */
  onUpload(event) {
    if (event.files.length > 0) {
      for (const file of event.files) {
        this.selectedFile = '';
        this.popupForm.controls.fileName.setValue(this.selectedFile.name);
        if (this.loanSharedService.geTypeMimes().includes(file.type)) {
          if (file.size <= this.loanSharedService.getMaxSizeFileUpload()) {
            this.selectedFile = file;
            this.popupForm.controls.fileName.setValue(this.selectedFile.name);
            this.popupForm.controls.file.setValue(this.selectedFile);
          } else {
            this.devToolsServices.openToastForMaxSizeImg(3, 'alert.file_size', this.loanSharedService.getMaxSizeFileUpload());
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
    this.selectedFile = '';
    this.popupForm.controls.fileName.setValue(this.selectedFile.name);
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

}
