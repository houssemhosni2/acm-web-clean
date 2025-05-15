import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GedServiceService } from '../ged-service.service';
import { LoanDocumentEntity } from '../../../shared/Entities/loanDocument.entity';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { SharedService } from 'src/app/shared/shared.service';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { Subject } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-list-documents',
  templateUrl: './list-documents.component.html',
  styleUrls: ['./list-documents.component.sass']
})
export class ListDocumentsComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loading = true;
  documents: any[] = [];
  @Output() selectedDocument = new EventEmitter();
  @Output() changedDocument = new EventEmitter();
  @Output() changedName = new EventEmitter<object>();
  @Input() source   ;
  public idloan: number;
  public sub: any;
  @Input() expanded;
  public documentsExist = new Subject<boolean>();
  historyDocuments: any = [];
  loan: LoanEntity;
   public listIndexDocuments :number[] =[];

  /**
   * constructor
   * @param GedServiceService gedService
   * @param DomSanitizer sanitizer
   * @param ActivatedRoute route
   */
  constructor(public gedService: GedServiceService,
    public sanitizer: DomSanitizer,
    public route: ActivatedRoute,
    public loanSharedService: SharedService,
    public devToolsServices: AcmDevToolsServices,
    private dbService: NgxIndexedDBService,
    public translate: TranslateService,
    public modalService: NgbModal) {
  }

  /**
   * Oninit get loan information and display his documents
   */
  async ngOnInit() {
    if (this.source !=="GENERIC-WF"){
    this.loan = this.loanSharedService.getLoan();
    this.sub = this.route.params.subscribe(params => {
      const loan = this.loanSharedService.getLoan();
      this.idloan = loan.loanId;
    });
    await this.getListDocuments(this.idloan);
  }else {
    await this.getListDocuments(this.loanSharedService.getItem().id);
  }

  }
  async getListDocuments(id) {
    if (this.source !=="GENERIC-WF"){
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.loanId = id;
    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'getDocumentsByLoan_' + id)
        .toPromise()
        .then((arrayDocuments: any) => {
          if (arrayDocuments === undefined) {
            this.devToolsServices.openToast(3, 'No required documents for this loan saved for offline use');
          } else {
            // list of loan documents
            this.documents = arrayDocuments.data;
            this.loading = false;
            if (this.documents.length > 0) {
              this.documentsExist.next(true);
            }
          }
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });

    } else {
      if (this.loan.assignCustomer && this.loan.idIbLoan !== null && this.loan.idIbLoan !== undefined) {
        // set loanId = IBLoanId
        document.loanId = this.loan.idIbLoan;
        // get documents from Ib and save them in ACM
        await this.gedService.getDocumentsByLoanFromIB(document, this.loan.loanId).toPromise().then((element) => {
          // list of loan documents
         // this.documents = element;
          this.loading = false;
          this.loanSharedService.ibDocumentsReceived.next(true);
        })
      }
      else {
        this.loanSharedService.ibDocumentsReceived.next(true);
      }
      // set loanId = ACMLoanId
        document.loanId = id;
        await this.gedService.getDocumentsByLoan(document).subscribe((element) => {
          // list of loan documents
          this.documents = element;
          this.loading = false;
          if (element.length > 0) {
            this.documentsExist.next(true);
          }
        });
    }}else {
      const document: LoanDocumentEntity = new LoanDocumentEntity();
      this.loanSharedService.getItem().itemInstanceDTOs.forEach(element=>{
        if (this.loanSharedService.getItem().actualStepInstance>element.id)
        document.itemInstanceIds.push(element.id) ;
      }) ;
      if (document.itemInstanceIds.length>0){

      await this.gedService.getDocumentsByLoan(document).subscribe((element) => {

        this.documents = element;
        this.loading = false;
        if (element.length > 0) {
          this.documentsExist.next(true);
        }
      });
    }
    }
  }
  /**
   * view document (pdf,png...)
   * param idDocumentGED
   */
  view(idDocumentGED,index:number) {
    this.listIndexDocuments.push(index);
    this.gedService.getDocumentType(idDocumentGED).subscribe((value) => {
      const documentType = value.mimeType;
      this.gedService.getDocument(idDocumentGED).subscribe(
        (res: any) => {
          const fileData = [res];
          const blob = new Blob(fileData, { type: documentType });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          this.loading = false;
        }
      );
    }
    );
  }


  viewDocumentHistory(file, idDocumentGED) {
    if (idDocumentGED !== '') {
      this.gedService.getDocumentType(idDocumentGED).subscribe((value) => {
        const documentType = value.mimeType;
        this.gedService.getDocument(idDocumentGED).subscribe(
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

  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }

  openLarge(content, d) {
    console.log("doc", d);
    this.modalService.open(content, {
      size: 'lg'
    }).result.then((result) => {
    });
    if (this.source !=="GENERIC-WF"){
    this.gedService.getHistoryListDocument(d.settingDocumentTypeDTO.id, this.loan.loanId, d.documentIndex).subscribe((values) => {
      this.historyDocuments = values;
    }
    );
  }else {
    this.gedService.findhistoryDocumentByItemStep(d.settingDocumentTypeDTO.id, d.itemInstanceId).subscribe((values) => {
      this.historyDocuments = values.filter(
       values => values.idDocumentGED !== null);
   }
   );
  }

  }

  getDirection() {
    return AppComponent.direction;
  }

  reset() {
    this.historyDocuments = [];
    this.modalService.dismissAll();
  }

  checkIndexDocuments(index:number)
  {
    return this.listIndexDocuments.includes(index);
  }
}
