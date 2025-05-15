import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionPaginationEntity } from 'src/app/shared/Entities/collection.pagination.entity';
import { CollectionServices } from '../../Collection/collection.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
@Component({
  selector: 'app-prospection',
  templateUrl: './prospection.component.html',
  styleUrls: ['./prospection.component.sass']
})
export class ProspectionComponent implements OnInit {
  public products: SelectItem[] = [];
  public branches: SelectItem[] = [];
  public statusList: SelectItem[] = [];

  public collectionPaginationEntity: CollectionPaginationEntity = new CollectionPaginationEntity();
  public type: string=AcmConstants.PROSPECTION;
  constructor(private collectionService: CollectionServices,
    private router: Router) { }

  async ngOnInit() {
    // await this.activatedRoute.queryParams.subscribe(params => {
    //   this.type = params.type;
    // });

    const collectionEntity = new CollectionEntity();
    collectionEntity.status = 0;
    // if (this.type === 'COLLECTION') {
    //   collectionEntity.statutWorkflow = "amicably";
    // }
    collectionEntity.collectionType = this.type;
    this.loadFilterCollectionProduct(collectionEntity);
    this.loadFilterCollectionBranch(collectionEntity);
    this.loadFilterCollectionStatus(collectionEntity);

    this.loadCollectionsByPaginations(collectionEntity, 0, 10);
    // reload the data when navigate to same route
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  async loadCollectionsByPaginations(searchCollection: CollectionEntity, page: number, pageSize: number) {
    const collectionPaginationEntityParms: CollectionPaginationEntity = new CollectionPaginationEntity();
    collectionPaginationEntityParms.params = searchCollection;
    collectionPaginationEntityParms.pageSize = pageSize;
    collectionPaginationEntityParms.pageNumber = page;

    await this.collectionService.loadDashboardByStatusPagination(collectionPaginationEntityParms).subscribe(
      (data) => {
        this.collectionPaginationEntity = data;
      });
  }

  /**
   * find list of branches for collection filter
   * @param searchCollection CollectionEntity
   */
  async loadFilterCollectionBranch(searchCollection: CollectionEntity) {
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

  /**
   * find collections status list
   * @param searchCollection CollectionEntity
   */
  async loadFilterCollectionStatus(searchCollection: CollectionEntity) {
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

  /**
   * find list of product for collection filter
   * @param searchCollection CollectionEntity
   */
  async loadFilterCollectionProduct(searchCollection: CollectionEntity) {
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

  /**
   * changeTabs by status
   * @param event MatTabChangeEvent
   */
  changeTabs(event: MatTabChangeEvent) {
    const searchCollection = new CollectionEntity();
    searchCollection.collectionType = this.type;
    searchCollection.status = 0;
    if (this.type === 'PROSPECTION') {
      // switch (event.index) {
      //   case 0: {
      //     searchCollection.status = 0;
      //     searchCollection.statutWorkflow = "amicably";

      //     break;
      //   }
      //   case 1: {
      //     searchCollection.status = 0;
      //     searchCollection.statutWorkflow = "pre-litigation";
      //     break;
      //   }
      //   case 2: {
      //     searchCollection.status = -1;
      //     break;
      //   }
      //   case 3: {
      //     searchCollection.status = 1;

      //     break;
      //   }
      //   default: {
      //     searchCollection.status = 0;
      //     searchCollection.statutWorkflow = "amicably";

      //     break;
      //   }
      // }
    // } else {
      switch (event.index) {
        case 0: {
          searchCollection.status = 0;
          break;
        }
        case 1: {
          searchCollection.status = 1;
          break;
        }
      }
    }
    this.loadCollectionsByPaginations(searchCollection, 0, 10);
    // load list branch
    this.loadFilterCollectionBranch(searchCollection);
    // load list product
    this.loadFilterCollectionProduct(searchCollection);
    // load list statuts
    this.loadFilterCollectionStatus(searchCollection);
  }

}
