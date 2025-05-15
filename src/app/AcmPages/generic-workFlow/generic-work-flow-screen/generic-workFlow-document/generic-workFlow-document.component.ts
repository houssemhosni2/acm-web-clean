import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { LoanDocumentEntity } from 'src/app/shared/Entities/loanDocument.entity';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { AppComponent } from 'src/app/app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { GedServiceService } from 'src/app/AcmPages/GED/ged-service.service';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ReportingService } from 'src/app/AcmPages/GED/reporting.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SettingDocumentTypeProductEntity } from 'src/app/shared/Entities/settingDocumentTypeProduct.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { ReportEntity } from 'src/app/shared/Entities/report.entity';
import { ItemProcessEntity } from 'src/app/shared/Entities/Item.process.entity';
import { LoanManagementService } from 'src/app/AcmPages/Loan-Application/loan-management/loan-management.service';

@Component({
  selector: 'app-generic-workFlow-document',
  templateUrl: './generic-workFlow-document.component.html',
  styleUrls: ['./generic-workFlow-document.component.sass']
})
export class GenericWorkFlowDocumentComponent implements OnInit {

  public loading = true;
  public productEntitys: ProductEntity[] = [];
  @Input() productEntity: ProductEntity;
  document: any;
  status = true;
  file: any;
  public addDocumentForm: FormGroup;
  public documentForm: FormGroup;
  public loanDocumentEntitys: LoanDocumentEntity[] = [];
  public loanDocumentsRemoved: LoanDocumentEntity[] = [];
  public listDocProd: SettingDocumentTypeProductEntity[] = [];
  @Input() expanded;
  @Input() category;
  @Input() elementId;
  public item: ItemEntity;
  public documentListUpdated = false;
  public currentStep: ItemProcessEntity;
  @Output() completeAction = new EventEmitter<string>();
  @Output() requiredDocument = new EventEmitter<boolean>();

  @Input() originSource: string;
  historyDocuments: any = [];
  settingDocumentTypes : SettingDocumentTypeEntity[] = [] ;
  loan: LoanEntity;
  labelDocument : string  ;
  checkCalledSave = false ;


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
    public modalService: NgbModal,
    public translate: TranslateService,
    public loanMangement: LoanManagementService
  ) {
  }
  ngOnInit() {
    if (this.category=="GENERIC-WF"){
    this.item = this.sharedService.getItem();
    const document: LoanDocumentEntity = new LoanDocumentEntity();

      this.item.itemInstanceDTOs.forEach(step => {
        if (step.id === this.item.actualStepInstance){
          this.currentStep = step;
          this.labelDocument = this.currentStep.libelle ;
        }
      });
      if (this.currentStep) {
        document.itemInstanceId = this.currentStep.id;
        document.workFlowStepId = this.currentStep.idWorkFlowStep ;
        this.settingsService.getDocumentTypeByStep(this.currentStep.idWorkFlowStep,this.currentStep.id).subscribe((arrayDocuments) => {
          this.settingDocumentTypes = arrayDocuments;
          for (const value of  this.settingDocumentTypes){
            if (!value.idDocumentGED && value.mandatory==true){
              this.requiredDocument.emit(true) ;
              return ;
            }


          }
        });
      }
    }else if (this.category==AcmConstants.SUPPLIER_CATEGORY ){
      this.labelDocument = "generic-document.supplier" ;
      this.settingsService.getDocumentTypeByCategory(this.category,this.sharedService.getElementId().supplierId).subscribe((documentTypes) => {
          this.settingDocumentTypes = documentTypes;
          for (const value of  this.settingDocumentTypes){
            if (!value.idDocumentGED && value.mandatory==true){
              this.requiredDocument.emit(true) ;
              return ;
            }


          }
      });
      //category list of document
    }else if (this.category==AcmConstants.THIRD_PARTY_CATEGORY ){
      this.labelDocument = "generic-document.partner" ;
      this.settingsService.getDocumentTypeByCategory(this.category,this.sharedService.getElementId().thirdPartyId).subscribe((documentTypes) => {
          this.settingDocumentTypes = documentTypes;
          for (const value of  this.settingDocumentTypes){
            if (!value.idDocumentGED && value.mandatory==true){
              this.requiredDocument.emit(true) ;
              return ;
            }


          }
      });
      //category list of document
    }else if (this.category==AcmConstants.CONVENTION_CATEGORY){
      this.labelDocument = "generic-document.convention" ;
      this.settingsService.getDocumentTypeByCategory(this.category ,this.sharedService.getElementId().conventionId).subscribe((documentTypes) => {
        this.settingDocumentTypes = documentTypes;
        for (const value of  this.settingDocumentTypes){
          if (!value.idDocumentGED && value.mandatory==true){
            this.requiredDocument.emit(true) ;
            return ;
          }


        }

      });

    }
  }



  initConvComponent( settingDocumentTypes : SettingDocumentTypeEntity[]) {
        this.settingDocumentTypes = settingDocumentTypes;
  }


  getDocumentType(){
    return  this.settingDocumentTypes ;

  }



  /**
   * ngOn changes
   * @param changes SimpleChanges
   */
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.saveFilesAction.currentValue !== changes.saveFilesAction.previousValue &&
  //     changes.saveFilesAction.previousValue !== undefined) {
  //     this.save(changes.originSource !== undefined ? changes.originSource.currentValue : null);
  //   }
  // }
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
    if (idDocument !== '' && idDocument !== undefined) {
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

  @Output() documentTypechild = new EventEmitter<SettingDocumentTypeEntity>();

  onUpload(event, i: number) {

    if (this.sharedService.geTypeMimes().includes(event.target.files[0].type)) {
      if (event.target.files[0].size <= this.sharedService.getMaxSizeFileUpload()) {
        if (event.target.files.length > 0) {
          this.settingDocumentTypes[i].name = event.target.files[0].name;
          this.settingDocumentTypes[i].file = event.target.files[0];
          this.settingDocumentTypes[i].dateDebut  = new Date() ;
          this.documentListUpdated = true;
          if (AcmConstants.CONVENTION_CATEGORY){
            this.documentTypechild.emit (this.settingDocumentTypes[i]);
          }

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
  actionSave() {
    if (this.documentListUpdated === false) {
      this.devToolsServices.openToast(3, 'alert.no_document_to_save');
    } else {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.upload').afterClosed().subscribe(res => {
        if (res) {
          this.save();
        }
      });
    }
  }


  checkRequiredDocument() : boolean{
    for( const elem of this.settingDocumentTypes){
      if (elem.mandatory&& (!elem.file && !elem.idDocumentGED)){
        return false  ;
      }
    }
    return true
  }
  /**
   * save to database and quit
   * check required if true enable next button
   */
  async save() {

    const arrayFile: any[] = [];
    const documents: any[] = [];
    this.sharedService.setLoader(true);


    await this.settingDocumentTypes.map((value, index) => {
      const document: LoanDocumentEntity = new LoanDocumentEntity();
      let settingDocumentType: SettingDocumentTypeEntity;
      settingDocumentType = value;
      if (value.file && value.file !== '') {
        document.titre = value.libelle;
        if (document.description) {
          document.description = value.description;
        }
        document.auteur = AcmConstants.AUTEUR;
        document.settingDocumentTypeDTO = settingDocumentType;
        document.mandatory = value.mandatory;
        //document.documentIndex = value.documentIndex;
        document.name = value.file.name;
        document.documentSize = value.file.size;
       // document.collectionStepId = value.collectionStepId;
       if (this.currentStep){
        document.itemInstanceId = this.currentStep.id;
      }else {
        document.category = this.category ;
        if (this.category===AcmConstants.SUPPLIER_CATEGORY){
        document.elementId = this.sharedService.getElementId().supplierId ;
        }
        if (this.category===AcmConstants.CONVENTION_CATEGORY)
        document.elementId = this.sharedService.getElementId().conventionId ;
        if (this.category===AcmConstants.THIRD_PARTY_CATEGORY)
        document.elementId = this.sharedService.getElementId().thirdPartyId ;

        }

        arrayFile.push(value.file);
        documents.push(document);

      }
    });
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
        this.requiredDocument.emit(false) ;
        //to refresh list loanDocumentEntitys for getting the new idDocuemnt
       this.ngOnInit();


      });
    }else {
      for (const value of  this.settingDocumentTypes){
        if (!value.idDocumentGED && value.mandatory==true){
          this.requiredDocument.emit(true) ;
          return ;
        }


      }

    }


  }



  async saveConvention( settingDocumentTypesConvention : SettingDocumentTypeEntity[],idConvention) {
    const arrayFile: any[] = [];
    const documents: any[] = [];
    this.sharedService.setLoader(true);

    await settingDocumentTypesConvention.map((value, index) => {
      const document: LoanDocumentEntity = new LoanDocumentEntity();
      let settingDocumentType: SettingDocumentTypeEntity;
      settingDocumentType = value;
      if (value.file && value.file !== '') {
        document.titre = value.libelle;
        if (document.description) {
          document.description = value.description;
        }
        document.auteur = AcmConstants.AUTEUR;
        document.settingDocumentTypeDTO = settingDocumentType;
        document.mandatory = value.mandatory;
        //document.documentIndex = value.documentIndex;
        document.name = value.file.name;
        document.documentSize = value.file.size;
       // document.collectionStepId = value.collectionStepId;

        document.category = AcmConstants.CONVENTION_CATEGORY ;
        document.elementId =idConvention ;

        arrayFile.push(value.file);
        documents.push(document);

      }
    });
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

  /**
   * downloadTemplate selected
   * param titleSelected
   */
 async downloadTemplate(document) {
    if (document.reportName != null) {
      const reportDTO: ReportEntity = new ReportEntity();
      reportDTO.inputFileName = document.reportName;
      // const listLoan: LoanEntity[] = [];
      const listCollections: CollectionEntity[] = [];
      listCollections.push(this.sharedService.getCollection());
      // listLoan.push(this.loan);
      if(document.reportName=="Clearance_Loan")
      {
    await this.loanMangement.findLoanByIdIB(this.item.elementId).toPromise().then(data=>{
          const listLoans: LoanEntity[]=[];
          listLoans.push(data[0]);
          reportDTO.entryList=listLoans;
        });

      }
      else
      {
        reportDTO.entryListAcmCollections = listCollections;
        let param = new LoanEntity();
        param.loanId =  this.sharedService.getItem().id;
        reportDTO.entryList = [param]
      }

      reportDTO.typeReport = this.category == "GENERIC-WF" ? 'GENERIC WORKFLOW' : 'COLLECTION';
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
   // this.ngOnInit();
    if (this.category==AcmConstants.GENERIC_WF_CATEGORY){
    this.gedService.findhistoryDocumentByItemStep(d.id, this.currentStep.id).subscribe((values) => {
       this.historyDocuments = values.filter(
        values => values.idDocumentGED !== null);
    }
    );
  }else {
    if (this.category===AcmConstants.SUPPLIER_CATEGORY){
    this.gedService.findhistoryDocumentByCategoryElement(d.id, this.sharedService.getElementId().supplierId,this.category ).subscribe((values) => {
      this.historyDocuments = values.filter(
       values => values.idDocumentGED !== null);
   }
   );
  }else if (this.category===AcmConstants.CONVENTION_CATEGORY){
    this.gedService.findhistoryDocumentByCategoryElement(d.id, this.sharedService.getElementId().conventionId,this.category ).subscribe((values) => {
      this.historyDocuments = values.filter(
       values => values.idDocumentGED !== null);
   }
   );
  }else if (this.category===AcmConstants.THIRD_PARTY_CATEGORY){
    this.gedService.findhistoryDocumentByCategoryElement(d.id, this.sharedService.getElementId().thirdPartyId,this.category ).subscribe((values) => {
      this.historyDocuments = values.filter(
       values => values.idDocumentGED !== null);
   }
   );
  }


  }

  }
  reset() {
    this.historyDocuments = [];
    this.modalService.dismissAll();
  }
  getDirection() {
    return AppComponent.direction;
  }

}
