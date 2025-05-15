import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionProcessEntity } from 'src/app/shared/Entities/CollectionProcess.entity';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-collection-process',
  templateUrl: './collection-process.component.html',
  styleUrls: ['./collection-process.component.sass']
})
export class CollectionProcessComponent implements OnInit {
  public collection: CollectionEntity = new CollectionEntity();
  public collectionProcessEntitys: CollectionProcessEntity[] = [];
  public orderProcess: number;
  public date = new Date();
  @Input() type;


  constructor(public sharedService: SharedService, public devToolsServices: AcmDevToolsServices, public translate: TranslateService) { }

  /**
   * ng OnInit
   */
  ngOnInit(): void {
    this.collection = this.sharedService.getCollection();
    this.collectionProcessEntitys = this.collection.collectionInstancesDtos.sort((p1, p2) => p1.orderEtapeProcess - p2.orderEtapeProcess);
    this.collectionProcessEntitys.forEach(element => {
      if (element.idAcmCollectionStep === this.collection.idAcmCollectionStep) {
        this.orderProcess = element.orderEtapeProcess;
      }
    });
  }

}
