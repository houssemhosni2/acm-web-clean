import { AcmConstants } from 'src/app/shared/acm-constants';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { LoanDocumentEntity } from 'src/app/shared/Entities/loanDocument.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { SettingDocumentTypeProductEntity } from 'src/app/shared/Entities/settingDocumentTypeProduct.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { GedServiceService } from '../../GED/ged-service.service';
import { ReportingService } from '../../GED/reporting.service';
import { SettingsService } from '../settings.service';
import { CollectionProcessEntity } from 'src/app/shared/Entities/CollectionProcess.entity';
import { ReportEntity } from 'src/app/shared/Entities/report.entity';
import { AppComponent } from 'src/app/app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { TranslateService } from '@ngx-translate/core';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-setting-collection-validation',
  templateUrl: './setting-collection-validation.component.html',
  styleUrls: ['./setting-collection-validation.component.sass']
})
export class SettingCollectionValidationComponent implements OnInit, OnChanges {
  public loading = true;
  public productEntitys: ProductEntity[] = [];
  @Input() productEntity: ProductEntity;
  document: any;
  status = true;
  file: any;
  public addDocumentForm: FormGroup;
  public documentForm: FormGroup;
  public loanDocumentEntitys: LoanDocumentEntity[] = [];
  public oldDocs: LoanDocumentEntity[] = [];
  public loanDocumentsRemoved: LoanDocumentEntity[] = [];
  public listDocProd: SettingDocumentTypeProductEntity[] = [];
  @Input() expanded;
  @Input() category;
  public collection: CollectionEntity;
  @Input() saveFilesAction = true;
  public documentListUpdated = false;
  public currentStep: CollectionProcessEntity;
  @Output() completeAction = new EventEmitter<string>();
  @Input() originSource: string;
  historyDocuments: any = [];
  loan: LoanEntity;
  source:string;
  /**
   * constructor
   * @param DatePipe datePipe
   * @param GedServiceService  gedService
   * @param AcmDevToolsServices devToolsServices
   * @param SharedService sharedService
   * @param FormBuilder formBuilder
   */
  constructor(
    public settingsService: SettingsService,
    public datePipe: DatePipe,
    public gedService: GedServiceService,
    public devToolsServices: AcmDevToolsServices,
    public sharedService: SharedService,
    public reportService: ReportingService,
    public formBuilder: FormBuilder,
    public loanSharedService: SharedService,
    public modalService: NgbModal,
    public translate: TranslateService,
    private dbService: NgxIndexedDBService,
    public activatedRoute: ActivatedRoute,
  ) {
  }
 async ngOnInit() {
  await this.activatedRoute.queryParams.subscribe((params) => {
    this.source = params.source;
  });
    this.loan = this.loanSharedService.getLoan();
    this.collection = this.sharedService.getCollection();
    const document: LoanDocumentEntity = new LoanDocumentEntity();

      this.collection.collectionInstancesDtos.forEach(step => {
        if (step.idAcmCollectionStep === this.collection.idAcmCollectionStep)
          this.currentStep = step;
      });
      if (this.currentStep) {
        if(checkOfflineMode() || this.source === 'preview' ){
          const key = 'getDocumentsByCollectionInstance_' + this.currentStep.id;
          await this.dbService.getByKey('data', key).subscribe((arrayDocuments: any) => {
            if (arrayDocuments === undefined) {
              this.devToolsServices.openToast(3, 'No Collection Documents saved for offline use');
            } else {
            this.loanDocumentEntitys = arrayDocuments.data;
            }
          });
        }
        else {
        document.collectionInstanceId = this.currentStep.id;
        document.collectionStepName = this.currentStep.stepName;
        this.gedService.getDocumentsByCollectionStep(document).subscribe((arrayDocuments) => {
          this.loanDocumentEntitys = arrayDocuments;
          this.fillDocument();
        });
      }
    }
  }

  fillDocument() {
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.settingDocumentTypeDTO = new SettingDocumentTypeEntity();
  
    this.collection.collectionInstancesDtos.forEach((step) => {
      if (this.collection.idAcmCollectionStep > step.idAcmCollectionStep) {
        document.collectionInstanceId = step.id;
  
        if (!checkOfflineMode()) {
          this.gedService.getDocumentsByCollectionStep(document).subscribe((arrayDocuments) => {
            arrayDocuments.forEach((documentParam) => {
              documentParam.collectionStepName = step.stepName;
              this.oldDocs.push(documentParam);
            });
  
            this.oldDocs = this.oldDocs.filter((doc) => doc.idDocumentGED !== null);
  
            this.loanDocumentEntitys = this.loanDocumentEntitys.map((loanDocument) => {
              const matchedOldDoc = this.oldDocs.find(
                (oldDoc) => oldDoc.settingDocumentTypeDTO.id === loanDocument.settingDocumentTypeDTO.id
              );
                return matchedOldDoc ? matchedOldDoc : loanDocument;
            });
          });
        }
      }
    });
  }
  

  /**
   * ngOn changes
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.saveFilesAction.currentValue !== changes.saveFilesAction.previousValue &&
      changes.saveFilesAction.previousValue !== undefined) {
      this.save(changes.originSource !== undefined ? changes.originSource.currentValue : null);
    }
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
            documentIndex: selectedDocument.documentIndex
          };
        }
      } else {
        this.devToolsServices.openToastForMaxSizeImg(3, 'alert.file_size', this.sharedService.getMaxSizeFileUpload());
      }
    } else {
      this.devToolsServices.openToast(3, 'alert.file_type');
    }
  }

  /**
   * view document selected
   * param file
   * param idDocumentGED
   */
  view(file, idDocument) {
    if (idDocument !== '' && idDocument !== undefined && idDocument !== null) {
      this.gedService.getDocumentType(idDocument).subscribe((value) => {
        const documentType = value.mimeType;
        this.gedService.getDocument(idDocument).subscribe(
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
   * param i
   * param document
   */
  remove(document: LoanDocumentEntity, i: number) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.delete').afterClosed().subscribe(res => {
      if (res) {
        this.loanDocumentEntitys[i].name = '';
        this.loanDocumentEntitys[i].idDocumentGED = null;
        this.loanDocumentEntitys[i].dateCreation = null;
        this.loanDocumentEntitys[i].file = ''
        this.loanDocumentsRemoved.push(this.loanDocumentEntitys[i]);
        this.documentListUpdated = true;
      }
    });
  }
  /**
   * methode upload document to existing type of document (multiple)
   * @param Any event
   */
  onUpload(event, i: number) {
    if (this.sharedService.geTypeMimes().includes(event.target.files[0].type)) {
      if (event.target.files[0].size <= this.sharedService.getMaxSizeFileUpload()) {
        if (event.target.files.length > 0) {
          this.loanDocumentEntitys[i].name = event.target.files[0].name;
          this.loanDocumentEntitys[i].file = event.target.files[0];
          this.documentListUpdated = true;
        }
      } else {
        this.devToolsServices.openToastForMaxSizeImg(3, 'alert.file_size', this.sharedService.getMaxSizeFileUpload());
      }
    } else {
      this.devToolsServices.openToast(3, 'alert.file_type');
    }
  }
  toggleCollapse() {
    this.expanded = !this.expanded;
  }
  /**
   * Display the confirmation message
   */
  actionSave(source?: string) {
    if (this.documentListUpdated === false) {
      this.devToolsServices.openToast(3, 'alert.no_document_to_save');
    } else {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.upload').afterClosed().subscribe(res => {
        if (res) {
          this.save(source);
        }
      });
    }
  }
  /**
   * save to database and quit
   * check required if true enable next button
   */
  async save(source?: string) {
    const arrayFile: any[] = [];
    const documents: any[] = [];
    this.loanSharedService.setLoader(true);
    await this.loanDocumentEntitys.map((value, index) => {
      const document: LoanDocumentEntity = new LoanDocumentEntity();
      let settingDocumentType: SettingDocumentTypeEntity;
      settingDocumentType = value.settingDocumentTypeDTO;
      if (value.file && value.file !== '') {
        document.titre = value.titre;
        if (document.description) {
          document.description = value.description;
        } else {
          document.description = value.settingDocumentTypeDTO.description;
        }
        document.auteur = AcmConstants.AUTEUR;
        document.settingDocumentTypeDTO = settingDocumentType;
        document.mandatory = value.mandatory;
        if (value.documentIndex!==null){
        document.documentIndex = value.documentIndex;
        }else {
        document.documentIndex = 0  ;
       }
        document.name = value.file.name;
        document.documentSize = value.file.size;
       // document.collectionStepId = value.collectionStepId;
        document.collectionInstanceId = this.currentStep.id;
        document.workFlowStepId=this.loan.etapeWorkflow;
        document.idDocument = value.idDocument;
        document.category = AcmConstants.COLLECTION_CATEGORY;
        document.elementId = this.collection.id;
        arrayFile.push(value.file);
        documents.push(document);

      }
    });
    if(checkOfflineMode()){
      const formdata = new FormData();
      for (const i of arrayFile) {
        formdata.append('uploadedFiles', i);
      }
      formdata.append('documentsLoanDTO', JSON.stringify(documents));
      const data = { 'uploadedFiles': arrayFile, 'documentsLoanDTO': documents }
      await this.dbService.update('documents', { id: 'collectionDocument_' + this.collection.id, 'data': data }).toPromise().then(
        () => {
          this.documentListUpdated = false;
          this.devToolsServices.openToast(0, 'alert.success');
        },
        error => console.error('Error saving data:', error)
      );
      await this.dbService.update('data', { id: 'getDocumentsByCollectionInstance_' + this.currentStep.id , 'data': documents }).toPromise().then(
        () => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.ngOnInit();
        },
        error => console.error('Error saving data:', error)
      );
    }
    else {
    if (this.loanDocumentsRemoved.length !== 0) {
      await this.gedService.updateAcmDocumentList(this.loanDocumentsRemoved).toPromise().then(() => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.loanDocumentsRemoved = [];
        this.documentListUpdated = false;
      });
    }
    if (documents.length > 0) {
      await this.gedService.saveListDocuments(arrayFile, documents).toPromise().then((value1) => {
        this.documentListUpdated = false;
        // call child function to change id saved document
        value1.forEach((doc) => {
          this.devToolsServices.openToast(0, 'alert.success');
        });
        //to refresh list loanDocumentEntitys for getting the new idDocuemnt
       this.ngOnInit();
      });
    }
  }
    // if source is 'complete' button
    if (source === AcmConstants.COMPLETE_ACTION) {
      this.completeAction.emit('1');
    }
  }

  /**
   * downloadTemplate selected
   * param titleSelected
   */
  downloadTemplate(document) {
    if (document.reportName != null) {
      const reportDTO: ReportEntity = new ReportEntity();
      reportDTO.inputFileName = document.reportName;
      // const listLoan: LoanEntity[] = [];
      const listCollections: CollectionEntity[] = [];
      listCollections.push(this.loanSharedService.getCollection());
      // listLoan.push(this.loan);
      reportDTO.entryListAcmCollections = listCollections;
      reportDTO.typeReport = 'COLLECTION';
      let param = new LoanEntity();
      param.loanId = this.loanSharedService.getCollection().id;
      reportDTO.entryList = [param];
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

  }

  openLarge(content, d) {
    this.modalService.open(content, {
      size: 'lg'
    }).result.then((result) => {
    });
    this.ngOnInit();
    this.gedService.getHistoryListDocumentByCollectionStep(d.settingDocumentTypeDTO.id, this.currentStep.id, d.documentIndex).subscribe((values) => {
       this.historyDocuments = values.filter(
        values => values.idDocumentGED !== null);
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
  isOfflineModeEnabled() {
    return checkOfflineMode();
   }
}
