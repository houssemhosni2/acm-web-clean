import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionPaginationEntity } from 'src/app/shared/Entities/collection.pagination.entity';
import { CollectionServices } from '../collection.services';

@Component({
  selector: 'app-unassigned-collection',
  templateUrl: './unassigned-collection.component.html',
  styleUrls: ['./unassigned-collection.component.sass']
})
export class UnassignedCollectionComponent implements OnInit {
  public collectionPaginationEntity: CollectionPaginationEntity = new CollectionPaginationEntity();
  public products: SelectItem[] = [];
  public branches: SelectItem[] = [];
  public statusList: SelectItem[] = [];
  public type:string;
  constructor(private collectionService: CollectionServices,public activatedRoute: ActivatedRoute,
    private router:Router) { }

  async ngOnInit(): Promise<void> {
    await this.activatedRoute.queryParams.subscribe(params => {
      this.type = params.type;
      });
    const collectionEntity = new CollectionEntity();
    collectionEntity.status = 0;
    collectionEntity.collectionType=this.type;
    collectionEntity.owner='UNASSIGNED';
    this.loadFilterCollectionProduct(collectionEntity);
    this.loadFilterCollectionBranch(collectionEntity);
    this.loadFilterCollectionStatus(collectionEntity);
    this.loadCollectionsByPaginations(collectionEntity, 0, 10);
    // reload the data when navigate to same route
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  /**
   *
   * @param searchCollection CollectionEntity
   * @param page CollectionEntity
   * @param pageSize number
   */
  async loadCollectionsByPaginations(searchCollection: CollectionEntity, page: number, pageSize: number) {
    const collectionPaginationEntityParms: CollectionPaginationEntity = new CollectionPaginationEntity();
    collectionPaginationEntityParms.params = searchCollection;
    collectionPaginationEntityParms.pageSize = pageSize;
    collectionPaginationEntityParms.pageNumber = page;
    // call service to load unassigned collections : we could use
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
    // load list of  statut collection
    await this.collectionService.loadFilterCollectionStatus(searchCollection).subscribe(
      (data) => {
        // mapping data
        this.statusList = [];
        const listString : string[] = [];
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

}
