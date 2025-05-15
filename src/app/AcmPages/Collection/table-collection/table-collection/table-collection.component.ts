import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { map, mergeMap } from 'rxjs/operators';
import { Customer360Services } from 'src/app/AcmPages/Customer/customer360/customer360.services';
import { CustomerServices } from 'src/app/AcmPages/Loan-Application/customer/customer.services';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionPaginationEntity } from 'src/app/shared/Entities/collection.pagination.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CollectionServices } from '../../collection.services';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmConstants } from 'src/app/shared/acm-constants';

@Component({
  selector: 'app-table-collection',
  templateUrl: './table-collection.component.html',
  styleUrls: ['./table-collection.component.sass']
})
export class TableCollectionComponent implements OnInit {
  @Input() collectionPaginationEntity: CollectionPaginationEntity = new CollectionPaginationEntity();
  @Input() statusTab;
  @Input() collectionType;
  @Input() products: SelectItem[];
  @Input() branches: SelectItem[];
  @Input() statusList: SelectItem[];
  @Input() statutWorkflow : string ;
  public page: number;
  public pageSize: number;
  public cols: any[];
  public selectedColumns: any[];
  public collection: CollectionEntity;
  public selectedCollections : CollectionEntity[];
  public fromOfflineSetting : boolean;

  constructor( public customer360Services :Customer360Services,private customerServices: CustomerServices,
    private sharedService: SharedService,private collectionServices: CollectionServices,private dbService: NgxIndexedDBService,
    private devToolsServices: AcmDevToolsServices,private router: Router ) { }

  ngOnInit() {
    
    if(this.router.url.includes('offline')){
      this.fromOfflineSetting = true    
    }
    if(this.collectionType!=='PROSPECTION'){
      this.cols = [
        { field: 'typeCustomer', header: 'collections.collection-dashboard.customer_type' },
        { field: 'accountNumber', header: 'collections.collection-dashboard.account_number' },
        { field: 'productDescription', header: 'collections.collection-dashboard.product' },
        { field: 'customerName', header: 'collections.collection-dashboard.customer' },
        { field: 'branchDescription', header: 'collections.collection-dashboard.branch'},
        { field: 'amount', header: 'collections.collection-dashboard.amount' },
        { field: 'loanOfficer', header: 'collections.collection-dashboard.loan_officer' },
        { field: 'ownerName', header: 'dashboard.owner' },
        { field: 'dateInsertion', header: 'collections.collection-dashboard.creation_date' },
        { field: 'firstUnpaidInstallment', header: 'collections.collection-dashboard.first_unpaid_installment' },
        { field: 'unpaidAmount', header: 'collections.collection-dashboard.unpaid_amount' },
        { field: 'lateDays', header: 'collections.collection-dashboard.lateDays' },
        { field: 'numberOfUnpaidInstallment', header: 'collections.collection-dashboard.nb_unpaid_installment' },
        { field: 'statutLibelle', header: 'collections.collection-dashboard.pending_action' } ,
        { field: 'subWorkFlowStatus', header: 'collections.collection-dashboard.statusRecours' }

      ];
    } else {
      this.cols = [
        { field: 'typeCustomer', header: 'collections.collection-dashboard.customer_type' },
        { field: 'accountNumber', header: 'collections.collection-dashboard.account_number' },
        { field: 'productDescription', header: 'collections.collection-dashboard.product' },
        { field: 'customerName', header: 'collections.collection-dashboard.customer' },
        { field: 'branchDescription', header: 'collections.collection-dashboard.branch'},
        { field: 'amount', header: 'collections.collection-dashboard.amount' },
        { field: 'loanOfficer', header: 'collections.collection-dashboard.loan_officer' },
        { field: 'ownerName', header: 'dashboard.owner' },
        { field: 'dateInsertion', header: 'collections.collection-dashboard.creation_date' },
        { field: 'statutLibelle', header: 'collections.collection-dashboard.pending_action' },




      ];
    }


    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
  }
/**
 * open collection details
 * @param collection CollectionEntity
 */
  async collectionDetails(collection: CollectionEntity) {
    if(checkOfflineMode()){
      const loanKey = 'getLoanByIdExtern_' + collection.idLoanExtern ;
     await this.dbService.getByKey('data', loanKey).toPromise().then((loan: any) => {      
        this.sharedService.setLoan(loan.data[0]);
      });
      const customerKey = 'getCustomerInformationByIdExtern_' + collection.customerIdExtern ;
      await this.dbService.getByKey('data', customerKey).toPromise().then((customer: any) => {        
         this.sharedService.setCustomer(customer.data[0]);
       });
    }
    else {
     // get loan by extern loan id
     await this.customer360Services.findLoanByIdExtern(collection.idLoanExtern).pipe(
      map(data => {
        // set loan to sharedService
        this.sharedService.setLoan(data);
        return data;
      }),
      // get customer
      mergeMap(loan => this.customerServices.getCustomerInformation(loan.customerDTO.id))
    ).toPromise().then(data2 => {
      // set customer in sharedService
      this.sharedService.setCustomer(data2);
    });
  }
    // set the collection to sharedService
    this.sharedService.setCollection(collection);
    // redirection to the loan-collection-details route
    this.sharedService.rootingCollectionUrlByStatut('dashboard-collection');
  }
  /**
   *
   * @param event LazyLoadEvent
   */
  async reloadCollectionsList(event: LazyLoadEvent) {

    const collectionPaginationEntityParms: CollectionPaginationEntity = new CollectionPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    collectionPaginationEntityParms.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      collectionPaginationEntityParms.pageNumber = event.first;
    } else {
      collectionPaginationEntityParms.pageNumber = event.first / event.rows;
    }

    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const collectionParams: CollectionEntity = new CollectionEntity();
    collectionParams.collectionType = this.collectionType;
    if (event.filters !== undefined) {
      collectionParams.typeCustomer = event.filters.typeCustomer !== undefined ? event.filters.typeCustomer.value : null;
      collectionParams.accountNumber = event.filters.accountNumber !== undefined ? event.filters.accountNumber.value : null;
      collectionParams.productDescription = event.filters.productDescription !== undefined ? event.filters.productDescription.value : null;
      collectionParams.customerName = event.filters.customerName !== undefined ? event.filters.customerName.value : null;
      collectionParams.branchDescription = event.filters.branchDescription !== undefined ? event.filters.branchDescription.value : null;
      collectionParams.amount = event.filters.amount !== undefined ? event.filters.amount.value : null;
      collectionParams.loanOfficer = event.filters.loanOfficer !== undefined ? event.filters.loanOfficer.value : null;
      collectionParams.ownerName = event.filters.ownerName !== undefined ? event.filters.ownerName.value : null;
      collectionParams.dateInsertion = event.filters.dateInsertion !== undefined ? event.filters.dateInsertion.value : null;
      collectionParams.firstUnpaidInstallment = event.filters.firstUnpaidInstallment !== undefined ?
       event.filters.firstUnpaidInstallment.value : null;
      collectionParams.unpaidAmount = event.filters.unpaidAmount !== undefined ? event.filters.unpaidAmount.value : null;
      collectionParams.lateDays = event.filters.lateDays !== undefined ? event.filters.lateDays.value : null;
      collectionParams.numberOfUnpaidInstallment = event.filters.numberOfUnpaidInstallment !== undefined ?
       event.filters.numberOfUnpaidInstallment.value : null;
      collectionParams.idAcmCollectionStep = event.filters.pendingAction !== undefined ? event.filters.pendingAction.value : null;
      collectionParams.statutLibelle = event.filters.statutLibelle !== undefined ? event.filters.statutLibelle.value : null;

    }
    // if(Object.keys(event.filters).length === 0){
      collectionParams.status = this.statusTab !== undefined ? this.statusTab : null;
      collectionParams.statutWorkflow = this.statutWorkflow !== undefined ? this.statutWorkflow : null;
    // }

    collectionPaginationEntityParms.params = collectionParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      collectionPaginationEntityParms.sortField = event.multiSortMeta[0].field;
      collectionPaginationEntityParms.sortDirection = event.multiSortMeta[0].order;
    }

    await this.collectionServices.loadDashboardByStatusPagination(collectionPaginationEntityParms).subscribe(
      (data) => {
        this.collectionPaginationEntity = data;

      }
    );
  }

  get currentSelection() {
    return this.fromOfflineSetting ? this.selectedCollections : this.collection;
  }

  set currentSelection(value: CollectionEntity | CollectionEntity[]) {
    if (this.fromOfflineSetting) {
      this.selectedCollections =  Array.isArray(value) ? value : [value];;
    } else {
      this.collection = value  as CollectionEntity;
    }
  }
  
  getOfflineCollectionPagination(){
    const offlineCollectionPag = {...this.collectionPaginationEntity};
    offlineCollectionPag.resultsCollections = this.selectedCollections;
    offlineCollectionPag.totalElements = offlineCollectionPag.resultsCollections.length;
    if(this.collectionType === AcmConstants.COLLECTION_CATEGORY){
      this.sharedService.setCollectionPaginationOffline(offlineCollectionPag);
    } else {
      this.sharedService.setLegalPaginationOffline(offlineCollectionPag);
    }
  }
}
