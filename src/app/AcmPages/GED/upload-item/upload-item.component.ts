import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GedServiceService } from '../ged-service.service';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { SharedService } from '../../../shared/shared.service';
import { ReportingService } from '../reporting.service';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SettingDocumentTypeProductEntity } from '../../../shared/Entities/settingDocumentTypeProduct.entity';
import { ReportEntity } from 'src/app/shared/Entities/report.entity';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { LoanDocumentEntity } from 'src/app/shared/Entities/loanDocument.entity';
import { DocumentTypeEntity } from 'src/app/shared/Entities/documentType.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { SettingsService } from '../../Settings/settings.service';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { Route, Router } from '@angular/router';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DataList } from 'src/app/shared/Entities/data.entity';
@Component({
  selector: 'app-upload-item',
  templateUrl: './upload-item.component.html',
  styleUrls: ['./upload-item.component.sass']
})
export class UploadItemComponent implements OnInit {
  @Input() documentsUpload = [];
  @Input() category: string;
  documents: any = [];
  @Input() statusWorkflow;
  @Input() source;
  uploadedDocument: any = [];
  @Input() saveFilesAction = true;
  public documentListUpdated = false;
  @Output() deletedDocument = new EventEmitter<object>();
  @Output() checkRequiredDoc = new EventEmitter();
  @Output() saveDone = new EventEmitter();
  document: any;
  historyDocuments: any = [];
  status = true;
  file: any;
  loan: LoanEntity;
  public addDocumentForm: FormGroup;
  public documentForm: FormGroup;
  allDocuments = [];
  loanDTO: LoanEntity = new LoanEntity();
  public feeRepayment = 0;
  checkRequiredDocument = false;
  public settingMotifReviewEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public product: ProductEntity = new ProductEntity();
  public isAdminFee = false;
  public page: number;
  public pageSize: number;
  public issued = false;
  public settingMotifRejetsEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifRejetsEntitys = [];
  public checkModalReject: boolean;
  public userConnected: UserEntity = new UserEntity();
  public renewelLoanCondition = false;
  minIssueDatevalue: string;
  public documentsToRemove: LoanDocumentEntity[] = [];
  public currentAmount = 0;
  public apportPersonnel = 0;
  @Input() originSource: string;
  @Output() lengthDocuments = new EventEmitter<number>();
  @Input() expanded: boolean;
  @Output() typeDocumentExist = new EventEmitter();
  @Input() loanDto;
  @Input() repaymentFee;
  @Input() adminFee;
  public statutDocumentLoan = '';

  /**
   * constructor
   * @param DatePipe datePipe
   * @param GedServiceService  gedService
   * @param AcmDevToolsServices devToolsServices
   * @param SharedService sharedService
   * @param FormBuilder formBuilder
   */
  constructor(public datePipe: DatePipe,
    public gedService: GedServiceService,
    public devToolsServices: AcmDevToolsServices,
    public sharedService: SharedService,
    public reportService: ReportingService,
    public formBuilder: FormBuilder,
    public loanSharedService: SharedService,
    public modalService: NgbModal,
    public translate: TranslateService,
    public settingsService: SettingsService, public router: Router,
    private dbService: NgxIndexedDBService
  ) {
  }

  async ngOnInit() {
    this.loan = this.loanSharedService.getLoan();
    let filteredLoan = this.loan.loanInstancesDtos.filter((loan) => loan.code === this.loan.etapeWorkflow);

if (filteredLoan.length > 0) {
  this.statutDocumentLoan  = filteredLoan[0].libelle;
} else {
  this.statutDocumentLoan = '';
}
    this.loanSharedService.setCustomer(this.loan.customerDTO);
    if (this.category == 'check-collateral') {
      this.loan.productId = this.loanDto.productId;
      this.loan.statutWorkflow = this.loanDto.statutWorkflow;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minIssueDatevalue = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.apportPersonnel = this.loan.personalContribution;
    this.currentAmount = this.loan.approvelAmount + this.apportPersonnel;

    this.pageSize = 5;
    this.page = 1;
    this.userConnected = this.loanSharedService.getUser();
    // in case of review step get all document by the reviewed step
    if (this.loan.statutWorkflow === AcmConstants.STATUT_WORKFLOW_REVIEW) {
      this.loan.statutWorkflow = this.loan.etapeWorkflow;
    }
    // in case of previsou step get all document by previous step

    let currentRoute = this.router.url;

    let previousStep = this.loan.loanInstancesDtos.filter((loan) => '/acm' + loan.ihmRoot === currentRoute || '/acm/' + loan.ihmRoot === currentRoute)[0];

    if (this.sharedService.getPreviousStep() && previousStep !== undefined) {
      if (this.loan.etapeWorkflow>23){
      this.loan.statutWorkflow = previousStep.code;
      this.statutDocumentLoan = previousStep.libelle;
    } else {
      this.loan.etapeWorkflow = previousStep.code;
      this.statutDocumentLoan = previousStep.libelle;
    }
  }
    const acmEnvironmentKeys: string[] = [AcmConstants.ADMIN_FEE, AcmConstants.RENEWEL_LOAN_CONDITION, AcmConstants.DEFERRED_PERIODE_TYPES];

    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'getRequiredDocumentByStep_' + this.loan.etapeWorkflow).subscribe((settingDocumentTypes: any) => {
        if (settingDocumentTypes === undefined) {
          this.devToolsServices.openToast(3, 'No required documents saved for offline use');
        } else {
          settingDocumentTypes.data.map((value) => {
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
            documentType.reportName = value.reportName;

            this.documents.push(documentType);
          });
          this.checkRequired();
          if (this.documents.length !== 0) {
            this.typeDocumentExist.emit(true);

          }
          this.fillDocument();
        }
      });

      this.dbService.getByKey('data', 'envirement-values-by-keys-upload').subscribe((environments: any) => {
        if (environments === undefined) {
          this.devToolsServices.openToast(3, 'No env values by keys upload fields saved for offline use');
        } else {
          // to do
          // if (environments[0].value === '1') {
          //   this.gedService.getFeeRepayment(this.loan.idAccountExtern).subscribe(
          //     (data) => {
          //       this.isAdminFee = true;
          //       this.feeRepayment = data;
          //     }
          //   );
          // }
          // if (environments[1].value === '1') {
          //   this.renewelLoanCondition = true;
          // }
        }
      })

    } else {
      this.gedService.getRequiredDocument(this.loan).subscribe((settingDocumentTypes) => {
        settingDocumentTypes.map((value) => {
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
          documentType.reportName = value.reportName;
          this.documents.push(documentType);
          this.lengthDocuments.emit(1);
        });
        this.checkRequired();
        if (this.documents.length !== 0) {
          this.typeDocumentExist.emit(true);
        }
        if(this.loan.assignCustomer && this.loan.idIbLoan){
          this.sharedService.ibDocumentsReceived.subscribe((data)=> {
            if(data){
              this.fillDocument();
            }
          })
        }
        else {
          this.fillDocument();
        }
      });

      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
        if (environments[0].value === '1') {
          if (this.loanSharedService.useExternalCBS === '1') {
          this.gedService.getFeeRepayment(this.loan.idAccountExtern).subscribe(
            (data) => {
              this.isAdminFee = true;
              this.feeRepayment = data;
            }
          );
        }
      }
        if (environments[1].value === '1') {
          this.renewelLoanCondition = true;
        }
      });
    }



    this.loan = this.sharedService.getLoan();
    this.createForm();
    this.documentForm = this.formBuilder.group({});
    for (let i = 0; i < this.documents.length; i++) {
      this.documentForm.addControl('documentInput' + i, new FormControl(''));
    }

  }
  /**
   * ngOn changes
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.save();
  }

  /**
   * Methode to create form
   */
  createForm() {
    this.addDocumentForm = this.formBuilder.group({
      fileInput: [''],
    });
  }
  /**
   * select file to upload
   * param event
   * param selectedDocument
   * param c
   */
  onFileSelected(event, selectedDocument, c) {
    if (this.sharedService.geTypeMimes().includes(event.target.files[0].type)) {
      if (event.target.files[0].size <= this.sharedService.getMaxSizeFileUpload()) {
        if (event.target.files.length > 0) {
          this.document = {
            name: event.target.files[0].name,
            settingDocumentType: selectedDocument.settingDocumentType,
            title: '' + selectedDocument.title,
            date: this.datePipe.transform(Date.now(), 'yyyy/MM/dd'),
            file: event.target.files[0],
            mandatory: selectedDocument.mandatory,
            updatedBy: this.sharedService.user.fullName,
            documentIndex: selectedDocument.documentIndex,

          };
          this.uploadedDocument = { document: this.document, category: c };
          this.addDocuments(this.uploadedDocument);

        }
      } else {
        this.devToolsServices.openToastForMaxSizeImg(3, 'alert.file_size', this.sharedService.getMaxSizeFileUpload());
      }
    } else {
      this.devToolsServices.openToast(3, 'alert.file_type');
    }
  }
  getMimeType(fileExtension: string) {
    switch (fileExtension) {

        case 'pdf':
            return this.sharedService.typeMimes[0];
        case 'docx':
            return this.sharedService.typeMimes[7];
        case 'doc':
            return this.sharedService.typeMimes[1];
        case 'xlsx':
            return this.sharedService.typeMimes[8];
        case 'xls':
            return this.sharedService.typeMimes[2];
        case 'pptx':
            return this.sharedService.typeMimes[5];
        case 'ppt':
            return this.sharedService.typeMimes[6];
        case "jpeg":
            return this.sharedService.typeMimes[3];
        case "jpg":
            return this.sharedService.typeMimes[3];
        case "png":
            return this.sharedService.typeMimes[4];
        default:
            return '';
    }
  }
  /**
   * view document selected
   * param file
   * param idDocumentGED
   */
  view(file, idDocumentGED1 ) {
    if (idDocumentGED1 !== ''  && idDocumentGED1 !== undefined && idDocumentGED1 !== null) {
      this.gedService.getDocumentType(idDocumentGED1).subscribe((value) => {
        const documentType = value.mimeType;
        this.gedService.getDocument(idDocumentGED1).subscribe(
          (res: any) => {
            const fileData = [res];
            const blob = new Blob(fileData, { type: documentType });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
          }
        );
      }
      );
    } else {
      const tmppath = URL.createObjectURL(file);
      window.open(tmppath, '_blank');
    }
  }

  /**
   * delete document selected
   * param d
   * param c
   */
  remove(d, c, i) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.delete').afterClosed().subscribe(res => {
      if (res) {
        this.deletedDocument.emit({ document: d, category: c });
        this.documentForm.controls['documentInput' + i].reset();
      }
    });
  }

  /**
   * downloadTemplate selected
   * param titleSelected
   */
  downloadTemplate(document) {
    const settingDocumentTypeProductEntity: SettingDocumentTypeProductEntity = new SettingDocumentTypeProductEntity();
    settingDocumentTypeProductEntity.settingDocumentTypeDTO = document.settingDocumentType;
    settingDocumentTypeProductEntity.productId = this.loan.productId;
    this.gedService.findAllDocumentProduct(settingDocumentTypeProductEntity).subscribe((settingDocumentTypeProductEntities) => {
      if (settingDocumentTypeProductEntities[0].reportName != null) {
        const reportDTO: ReportEntity = new ReportEntity();
        reportDTO.inputFileName = settingDocumentTypeProductEntities[0].reportName;
        const listLoan: LoanEntity[] = [];
        listLoan.push(this.loan);
        reportDTO.entryList = listLoan;
        reportDTO.typeReport = 'AGREEMENT';
        this.reportService.downloadCustomReport(reportDTO).subscribe(
          (res: any) => {
            const fileData = [res];
            const blob = new Blob(fileData, { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
          }
        );
      } else {
        this.devToolsServices.openToast(1, 'alert.file_type');
      }
    });
  }

  /**
   * methode upload document to existing type of document (multiple)
   * @param Any event
   */
  onUpload(event, selectedDocument, c) {
    this.documentForm.addControl('documentInput' + this.documents.length, new FormControl(''));
    const maxIndex = Math.max.apply(Math, this.documents.map((document) => {
      return document.documentIndex;
    }));
    if (this.sharedService.geTypeMimes().includes(event.target.files[0].type)) {
      if (event.target.files[0].size <= this.sharedService.getMaxSizeFileUpload()) {
        if (event.target.files.length > 0) {
          this.document = {
            name: event.target.files[0].name,
            settingDocumentType: selectedDocument.settingDocumentType,
            title: '' + selectedDocument.title,
            date: this.datePipe.transform(Date.now(), 'yyyy/MM/dd'),
            file: event.target.files[0],
            mandatory: false,
            documentIndex: maxIndex + 1,
            updatedBy: this.sharedService.user.fullName,

          };
          this.uploadedDocument = { document: this.document, category: c };

          this.addDoc(this.uploadedDocument);
          this.addDocumentForm.controls.fileInput.reset();
        }
      } else {
        this.devToolsServices.openToastForMaxSizeImg(3, 'alert.file_size', this.sharedService.getMaxSizeFileUpload());
      }
    } else {
      this.devToolsServices.openToast(3, 'alert.file_type');
    }
  }
  openLarge(content, d) {
    this.modalService.open(content, {
      size: 'lg'
    }).result.then((result) => {
    });
    this.gedService.getHistoryListDocument(d.settingDocumentType.id, this.loan.loanId, d.documentIndex).subscribe((values) => {
      this.historyDocuments = values;
    }
    );

  }
  reset() {
    this.historyDocuments = [];
    this.modalService.dismissAll();
  }
  getDirection() {
    return AppComponent.direction;
  }
  /**
   * Display the confirmation message
   */
  onsave() {
    if ((this.allDocuments === undefined || this.allDocuments.length === 0) && this.documentsToRemove.length === 0) {
      this.devToolsServices.openToast(3, 'alert.no_document_to_save');
    } else {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.upload').afterClosed().subscribe(res => {
        if (res) {
          this.save().then(() => {
            this.allDocuments = [];
            this.documentsToRemove = [];
          });
        }
      });
    }
  }
  /**
   * save to database
   */
  async save() {
    // Disable deleted documents
    if (this.documentsToRemove.length !== 0) {
      for (const value of this.documentsToRemove) {
        await this.gedService.disableDocument(value).toPromise();
        this.devToolsServices.openToast(0, 'alert.success');
      }
    }

    // Save added documents
    let arrayFile: any[] = [];
    let documents: any[] = [];

    
    
    if (this.allDocuments.length !== 0) {
      for (const value of this.allDocuments) {
        let document: LoanDocumentEntity = new LoanDocumentEntity();
        let settingDocumentType: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();
        settingDocumentType = value.settingDocumentType;
        if (value.file !== '') {
          document.titre = value.title;
          document.description = value.settingDocumentType.description;
          document.auteur = AcmConstants.AUTEUR;
          document.loanId = this.loan.loanId;
          document.settingDocumentTypeDTO = settingDocumentType;
          document.idCustomer = +this.loan.customerDTO.id;
          document.customerName = this.loanSharedService.getCustomerName(this.loan.customerDTO);
          document.accountNumberExtern = this.loan.accountNumber;
          document.mandatory = value.mandatory;
          document.name = value.file.name;
          document.documentIndex = value.documentIndex;
          document.documentSize = value.file.size;
          document.workFlowStepId=this.loan.etapeWorkflow;


          documents.push(document);
          arrayFile.push(value.file);
        }
      }

      if (checkOfflineMode()) {
        // to do
        // to review
        this.dbService.getByKey('data', 'getDocumentsByLoan_' + this.loan.loanId).subscribe((arrayDocuments: any) => {
          if (arrayDocuments === undefined) {
            this.devToolsServices.openToast(3, 'No required documents for this loan saved for offline use');
          } else {
            
           }
        });

        let oldDOcs = [];
        let oldFiles = [];
        const key = 'loanDocument_' + this.loan.loanId;
        const savedDocs = await this.dbService.getByKey('documents', key).toPromise() as any;
          if (savedDocs !== undefined) {
          
            oldDOcs = savedDocs.data.documentsLoanDTO.filter(doc => 
              !documents.some(otherDoc => 
                doc.titre.toLowerCase() === otherDoc.titre.toLowerCase()
              ));
            oldFiles = savedDocs.data.uploadedFiles.filter(file =>
              oldDOcs.some(doc=> doc.name === file.name)
            )
          }
          // add old saved docs and files 
          for ( const j of oldDOcs){
            documents.push(j)
          }

        const formdata = new FormData();

        for(const i of oldFiles){
          formdata.append('uploadedFiles', i);
          arrayFile.push(i)
        }

        for (const i of arrayFile) {
          formdata.append('uploadedFiles', i);
        }
        
        formdata.append('documentsLoanDTO', JSON.stringify(documents));
        const data = { 'uploadedFiles': arrayFile, 'documentsLoanDTO': documents }
        this.dbService.update('documents', { id: key, 'data': data }).subscribe(
          () => {
            this.devToolsServices.openToast(0, 'alert.success');
          },
          error => console.error('Error saving data:', error)
        );
        this.dbService.update('data', { id: 'getDocumentsByLoan_' + this.loan.loanId, 'data': documents }).subscribe(
          () => {
            this.devToolsServices.openToast(0, 'alert.success');
          },
          error => console.error('Error saving data:', error)
        );
        }
      else {
        for (let i = 0; i < arrayFile.length; i++) {
          const doc = await this.gedService.saveListDocuments([arrayFile[i]], [documents[i]]).toPromise();
          this.changeIdSavedDocument(doc[0], doc[0].idDocument);
          this.checkRequired();
          this.devToolsServices.openToast(0, 'alert.documents_saved');
        }
      }

    }

    this.saveDone.emit('done');
    this.allDocuments = [];
  }

  /**
   * change id saved document
   * @param Document document
   */
  changeIdSavedDocument(document, idDocument) {
    this.documents.map((customerDoc) => {
      if ((customerDoc.title === document.titre) && (customerDoc.documentIndex === customerDoc.documentIndex)) {
        customerDoc.idDocument = idDocument;
      }
    });
  }
  /**
   * fill costumer documents and loan documents from database
   */
  async fillDocument() {
    let fillDocuments: any[] = [];
    let findDocument: boolean = false;
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.loanId = this.loan.loanId;

    if (checkOfflineMode()) {
      const key = 'loanDocument_' + this.loan.loanId;
      const savedDocs = await this.dbService.getByKey('documents',key).toPromise() as any;

      
      this.dbService.getByKey('data', 'getDocumentsByLoan_' + this.loan.loanId).subscribe((arrayDocuments: any) => {
        if (arrayDocuments === undefined) {
          this.devToolsServices.openToast(3, 'No required documents for this loan saved for offline use');
        } else {
          this.documents.map((typed) => {
            findDocument = false;
            arrayDocuments.data.map((loanDocument) => {

              if (loanDocument.titre === typed.settingDocumentType.libelle) {
                const type: DocumentTypeEntity = new DocumentTypeEntity();
                type.name = loanDocument.name,
                type.settingDocumentType = loanDocument.settingDocumentTypeDTO,
                type.date = this.datePipe.transform(loanDocument.dateCreation, 'yyyy/MM/dd');
                type.idfile = loanDocument.idDocumentGED;
                type.file = loanDocument.idDocumentGED;              

                if(savedDocs !== undefined){
                 const loanDoc = savedDocs?.data?.documentsLoanDTO.filter(loanDoc =>{ return loanDoc.titre === loanDocument.titre });
                 if(loanDoc){
                 const file = savedDocs.data.uploadedFiles.filter(file =>{return file.name === loanDoc[0].name})
                 if(file){
                  type.file = file[0]
                 }
                }}          

                type.idDocument = loanDocument.idDocument;
                type.mandatory = loanDocument.mandatory;
                type.documentIndex = loanDocument.documentIndex;
                type.updatedBy = loanDocument.updatedBy;
                type.title = typed.title;
                type.reportName = typed.reportName;
                fillDocuments.push(type);
                findDocument = true;
                //this.lengthDocuments.emit(0);
              }
            });
            if (findDocument === false) {
              fillDocuments.push(typed);
            }
          });
          if (fillDocuments.length !== 0) {
            this.documents = fillDocuments;
          }
          this.checkRequired();
        }
      });
    }   else {
      // get documents from acm
      this.gedService.getDocumentsByLoan(document).subscribe((arrayDocuments) => {
        this.documents.map((typed) => {
          findDocument = false;
          arrayDocuments.map((loanDocument) => {
            if (loanDocument.titre === typed.settingDocumentType.libelle) {
              const type: DocumentTypeEntity = new DocumentTypeEntity();
              type.name = loanDocument.name,
                type.settingDocumentType = loanDocument.settingDocumentTypeDTO,
                type.date = this.datePipe.transform(loanDocument.dateCreation, 'yyyy/MM/dd');
              type.idfile = loanDocument.idDocumentGED;
              type.file = loanDocument.idDocumentGED;
              type.idDocument = loanDocument.idDocument;
              type.mandatory = loanDocument.mandatory;
              type.documentIndex = loanDocument.documentIndex;
              type.updatedBy = loanDocument.updatedBy;
              type.title = typed.title;
              type.reportName = typed.reportName;
              fillDocuments.push(type);
              findDocument = true;
              //this.lengthDocuments.emit(1);
            }
          });
          if (findDocument === false) {
            fillDocuments.push(typed);
          }
        });
        if (fillDocuments.length !== 0) {
          this.documents = fillDocuments;
        }
        this.checkRequired();
      });
    }

  }

  /**
   * check required
   */
  checkRequired() {
    let i = 0;
    this.documents.map((value) => {
      if ((value.file === '') && (value.mandatory === true)) {
        i++;
      }
    });
    this.checkRequiredDocument = i === 0;
    this.checkRequiredDoc.emit(i);
  }

  /**
   * add document
   * @param any uploadedDocument
   */
  addDocuments(uploadedDocument) {
    this.documents.map((documentTypeEntity) => {
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
        this.allDocuments.push(documentTypeEntity);
        this.documentListUpdated = true;
      }
    });
    this.checkRequired();
  }

  addDoc(uploadedDocument) {
    // this.documents.map((value) => {
    //   if (value.title === uploadedDocument.document.title) {
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
        this.allDocuments.push(documentTypeEntity);
        this.documents.push(documentTypeEntity);
        this.documentListUpdated = true;
    //     return;
    //   }
    // });

  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

}
