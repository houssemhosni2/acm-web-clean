import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { AcmConstants } from 'src/app/shared/acm-constants';
import {CustomerEntity} from 'src/app/shared/Entities/customer.entity';
import {LoanDocumentEntity} from 'src/app/shared/Entities/loanDocument.entity';
import { LoansDocumentsEntity } from 'src/app/shared/Entities/loansDocuments.entity';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import {SharedService} from 'src/app/shared/shared.service';
import {GedServiceService} from '../../GED/ged-service.service';
import { AppComponent } from '../../../app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-customer-document',
  templateUrl: './customer-document.component.html',
  styleUrls: ['./customer-document.component.sass']
})
export class CustomerDocumentComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loading = false;
  @Input() expanded;
  expandedDocumentsByLoan = true;
  public customer: CustomerEntity = new CustomerEntity();
  documents: any[] = [];
  public listdocuments: LoansDocumentsEntity[] = [];
  public listloansdocuments: LoanDocumentEntity[] = [];
  public historyDocuments: any = [];
  /**
   *
   * @param loanSharedService loanSharedService
   * @param gedService gedService
   */
  constructor(public loanSharedService: SharedService, public modalService: NgbModal,public devToolsServices: AcmDevToolsServices,
    public gedService: GedServiceService, public translate: TranslateService,private dbService: NgxIndexedDBService) {
  }

  async ngOnInit() {
    this.customer = this.loanSharedService.getCustomer();
    if(checkOfflineMode()){
      const documents = await this.dbService.getByKey('data','getCustomerDocument_' + this.customer.id).toPromise() as any;
    if (documents === undefined) {
      this.devToolsServices.openToast(3, 'No documents saved for offline use');
    } else {
      this.documents = documents.data;
    }
    this.loading = false;
    } else {
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.idCustomer = this.customer.id;
    document.processLoanDocuments = true;
    this.gedService.getDocumentsByLoan(document).subscribe((value) => {
      value.forEach((element) => {
        if (element.settingDocumentTypeDTO.categorie ===  AcmConstants.TYPE_DOCUMENT_CATEGORIE_CUSTOMER) {
          this.documents.push(element);
        }
      });
      this.loading = false;
    });
  }
    this.getListDocuments(this.customer.id);
  }
  async getListDocuments(id) {
    if(!checkOfflineMode()){
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.idCustomer = id;
    const settingDocumentTypeDTO: SettingDocumentTypeEntity = new SettingDocumentTypeEntity ();
    settingDocumentTypeDTO.categorie = AcmConstants.TYPE_DOCUMENT_CATEGORIE_LOAN;
    document.settingDocumentTypeDTO = settingDocumentTypeDTO;
    this.gedService.getDocumentsByCustomer(document).subscribe((element) => {
      // list of loan documents
      this.listdocuments = element;
    });
  } else {
    const loanDocuments = await this.dbService.getByKey('data','getLoanDocumentsByCustomer_' + this.customer.id).toPromise() as any;
    if (loanDocuments === undefined) {
      this.devToolsServices.openToast(3, 'No loan documents saved for offline use');
    } else {
      this.listdocuments = loanDocuments.data;
    }
  }
  }
  /**
   *
   * @param idDocumentGED idDocumentGED
   */
  view(idDocumentGED) {
    this.gedService.getDocumentType(idDocumentGED).subscribe((value) => {
        const documentType = value.mimeType;
        this.gedService.getDocument(idDocumentGED).subscribe(
          (res: any) => {
            const fileData = [res];
            const blob = new Blob(fileData, {type: documentType});
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            this.loading = false;
          }
        );
      }
    );
  }

  /**
   * toggleCollapse
   */
  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  toggleCollapseForDocumentsByLoan(){
    this.expandedDocumentsByLoan = !this.expandedDocumentsByLoan;
  }


  openLargePupupHistoryDoc(content, d, selectObj) {
    this.modalService
      .open(content, {
        size: 'lg',
      })
      .result.then((result) => { });
    if (selectObj=== 'LOAN') {
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


   /**
   * Get Direction
   */
   getDirection() {
    return AppComponent.direction;
  }
}
