import { CollectionServices } from './../collection.services';
import { SharedService } from 'src/app/shared/shared.service';
import { Component, Input, OnInit } from '@angular/core';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { LoanDocumentEntity } from 'src/app/shared/Entities/loanDocument.entity';
import { GedServiceService } from '../../GED/ged-service.service';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { AppComponent } from 'src/app/app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { checkOfflineMode } from 'src/app/shared/utils';

@Component({
  selector: 'app-collections-documents',
  templateUrl: './collections-documents.component.html',
  styleUrls: ['./collections-documents.component.sass'],
})
export class CollectionsDocumentsComponent implements OnInit {
  @Input() expanded;
  @Input() category;
  @Input() idParentCollection;
  public loanDocumentEntitys: LoanDocumentEntity[] = [];
  public collection: CollectionEntity;
  stepName: string;
  public listStep: number[] = [];
  historyDocuments: any = [];
  constructor(
    public gedService: GedServiceService,
    public sharedService: SharedService,
    public collectionService: CollectionServices,
    public modalService: NgbModal,
    public translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.collection = this.sharedService.getCollection();
    // test
    if (this.idParentCollection) {
      const collectionParam = new CollectionEntity();
      collectionParam.id = this.idParentCollection;

      await this.collectionService.getCollection(collectionParam).toPromise().then((data) => {
        this.collection = data[0];
      });
    }
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.settingDocumentTypeDTO = new SettingDocumentTypeEntity();
    this.collection.collectionInstancesDtos.forEach((step) => {
      if (this.collection.idAcmCollectionStep > step.idAcmCollectionStep || this.idParentCollection) {
        document.collectionInstanceId = step.id;
        if(!checkOfflineMode()){
        this.gedService
          .getDocumentsByCollectionStep(document)
          .subscribe((arrayDocuments) => {
            arrayDocuments.forEach((documentParam) => {
              documentParam.collectionStepName = step.stepName;
              this.loanDocumentEntitys.push(documentParam);
            });

            this.loanDocumentEntitys = this.loanDocumentEntitys.filter((doc) => doc.idDocumentGED !== null);
          });
        }
      }
    });
  }
  /**
   * view document selected
   * param file
   * param idDocumentGED
   */
  view(file, idDocumentGED) {
    if (idDocumentGED !== '' && idDocumentGED !== undefined) {
      this.gedService.getDocumentType(idDocumentGED).subscribe((value) => {
        const documentType = value.mimeType;
        this.gedService.getDocument(idDocumentGED).subscribe((res: any) => {
          const fileData = [res];
          const blob = new Blob(fileData, { type: documentType });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        });
      });
    } else {
      const tmppath = URL.createObjectURL(file);
      window.open(tmppath, '_blank');
    }
  }
  /**
   * toggleCollapse
   */
  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  openLarge(content, d) {
    this.modalService.open(content, {
      size: 'lg'
    }).result.then((result) => {
    });

    this.gedService.getHistoryListDocumentByCollectionStep(d.settingDocumentTypeDTO.id, d.collectionInstanceId, d.documentIndex).subscribe((values) => {

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
}
