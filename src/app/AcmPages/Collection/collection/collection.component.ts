import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionPaginationEntity } from 'src/app/shared/Entities/collection.pagination.entity';
import { CollectionServices } from '../collection.services';
import { checkOfflineMode, getCollectionKey } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SharedService } from 'src/app/shared/shared.service';
import { TableCollectionComponent } from '../table-collection/table-collection/table-collection.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.sass']
})
export class CollectionComponent implements OnInit {
  public products: SelectItem[] = [];
  public branches: SelectItem[] = [];
  public statusList: SelectItem[] = [];

  public collectionPaginationEntity: CollectionPaginationEntity = new CollectionPaginationEntity();
  @Input() type: string;
  @ViewChild(TableCollectionComponent)
  tableCollectionComponent: TableCollectionComponent;

  constructor(private collectionService: CollectionServices, public activatedRoute: ActivatedRoute,private sharedService: SharedService,
    private devToolsServices: AcmDevToolsServices, private router: Router,private dbService: NgxIndexedDBService) { }

  async ngOnInit() {
    await this.activatedRoute.queryParams.subscribe(params => {
      if(params?.type)
      this.type = params.type;
    });

    const collectionEntity = new CollectionEntity();
    collectionEntity.status = 0;
    if (this.type === 'COLLECTION') {
      collectionEntity.statutWorkflow = "amicably";
    }
    collectionEntity.collectionType = this.type;

    this.loadCollectionsByPaginations(collectionEntity, 0, 10);

    if(!checkOfflineMode()){
    this.loadFilterCollectionProduct(collectionEntity);
    this.loadFilterCollectionBranch(collectionEntity);
    this.loadFilterCollectionStatus(collectionEntity);
    }
    
    // reload the data when navigate to same route
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

}

  async loadCollectionsByPaginations(searchCollection: CollectionEntity, page: number, pageSize: number) {
    if(checkOfflineMode()){
      const key = 'collections-pagination-' + getCollectionKey(searchCollection);
      this.sharedService.setCollectionsKey(key);
      await this.dbService.getByKey('collections-pagination', key).subscribe((collections: any) => {
        this.collectionPaginationEntity = collections; 
        const collection = new CollectionEntity();
        this.loadFilterCollectionProduct(collection);
        this.loadFilterCollectionBranch(collection);
        this.loadFilterCollectionStatus(collection);
      });
     
    }
    else {
    const collectionPaginationEntityParms: CollectionPaginationEntity = new CollectionPaginationEntity();
    collectionPaginationEntityParms.params = searchCollection;
    collectionPaginationEntityParms.pageSize = pageSize;
    collectionPaginationEntityParms.pageNumber = page;

    await this.collectionService.loadDashboardByStatusPagination(collectionPaginationEntityParms).subscribe(
      (data) => {
        this.collectionPaginationEntity = data;
      });
    }
  }

  /**
   * find list of branches for collection filter
   * @param searchCollection CollectionEntity
   */
  async loadFilterCollectionBranch(searchCollection: CollectionEntity) {
    if(checkOfflineMode()){
      const existingBranches = new Set();
      this.branches = [];
      this.collectionPaginationEntity.resultsCollections.forEach(collection=>{
        const branch = collection.branchDescription;

        if(!existingBranches.has(branch)){
        this.branches.push({ label: collection.branchDescription, value: collection.branchDescription })
        existingBranches.add(collection.branchDescription);
        }
      })
    }
    else{
    // load list branch by statut collection
    await this.collectionService.loadFilterCollectionBranch(searchCollection).subscribe(
      (data) => {
        // mapping data
        this.branches = [];
        data.forEach(element => {
          this.branches.push({ label: element.branchDescription, value: element.branchDescription });
        });
      });
    }
  }

  /**
   * find collections status list
   * @param searchCollection CollectionEntity
   */
  async loadFilterCollectionStatus(searchCollection: CollectionEntity) {
    if(checkOfflineMode()){
      this.statusList = [];
      const listString: string[] = [];
      const existingStatusList = new Set();

      this.collectionPaginationEntity.resultsCollections.forEach(collection=>{     
        if (collection.statutLibelle !== undefined) {
          listString.push(collection.statutLibelle);
        }
        else if (listString.indexOf(collection.statutLibelleDone) === -1) {
          listString.push(collection.statutLibelleDone);
        }
      })
      listString.forEach(statutLib =>{
        if(!existingStatusList.has(statutLib)){
        this.statusList.push({ label: statutLib, value: statutLib })
        existingStatusList.add(statutLib);
        }
    });
    }
    else{
    // load list of statut collection
    await this.collectionService.loadFilterCollectionStatus(searchCollection).subscribe(
      (data) => {
        // mapping data
        this.statusList = [];
        const listString: string[] = [];
        data.forEach(element => {
          if (element.statutLibelle !== undefined) {
            listString.push(element.statutLibelle);
          }
          else if (listString.indexOf(element.statutLibelleDone) === -1) {
            listString.push(element.statutLibelleDone);
          }
        });
        listString.forEach(statutLib =>
          this.statusList.push({ label: statutLib, value: statutLib }));
      });
    }
  }

  /**
   * find list of product for collection filter
   * @param searchCollection CollectionEntity
   */
  async loadFilterCollectionProduct(searchCollection: CollectionEntity) {
  
    if(checkOfflineMode()){

      const existingDescriptions = new Set();
      this.products = [];
      this.collectionPaginationEntity.resultsCollections.forEach(collection=>{
        const description = collection.productDescription;
        if(!existingDescriptions.has(description)){
          this.products.push({ label: collection.productDescription, value: collection.productDescription })
          existingDescriptions.add(collection.productDescription);
        }
      })
    }
    else {
    // load list product by statut collection
    await this.collectionService.loadFilterCollectionProduct(searchCollection).subscribe(
      (data) => {
        // mapping data
        this.products = [];
        data.forEach(element => {
          this.products.push({ label: element.productDescription, value: element.productDescription });
        });
      });
    }
  }

  /**
   * changeTabs by status
   * @param event MatTabChangeEvent
   */
  changeTabs(event: MatTabChangeEvent) {
    const searchCollection = new CollectionEntity();
    searchCollection.collectionType = this.type;
    searchCollection.status = 0;
    if (this.type === 'COLLECTION') {
      switch (event.index) {
        case 0: {
          searchCollection.status = 0;
          searchCollection.statutWorkflow = "amicably";

          break;
        }
        case 1: {
          searchCollection.status = 0;
          searchCollection.statutWorkflow = "pre-litigation";
          break;
        }
        case 2: {
          searchCollection.status = 2;
          searchCollection.statutWorkflow ="review";

          break;
        }
        case 3: {
          searchCollection.status = -1;
          break;
        }
        case 4: {
          searchCollection.status = 1;

          break;
        }

        default: {
          searchCollection.status = 0;
          searchCollection.statutWorkflow = "amicably";

          break;
        }
      }
    } else {
      switch (event.index) {
        case 0: {
          searchCollection.status = 0;
          break;
        }
        case 1: {
          searchCollection.status = 2;
          break;
        }
        case 2: {
          searchCollection.status = 1;
          break;
        }
      }
    }
    this.loadCollectionsByPaginations(searchCollection, 0, 10);
    
    if(!checkOfflineMode()){
    // load list branch
    this.loadFilterCollectionBranch(searchCollection);
    // load list product
    this.loadFilterCollectionProduct(searchCollection);
    // load list statuts
    this.loadFilterCollectionStatus(searchCollection);
  }
  }
  getOfflineCollectionPagination(){
    this.tableCollectionComponent.getOfflineCollectionPagination();
  }
}
