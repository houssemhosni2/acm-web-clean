import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { map, mergeMap } from 'rxjs/operators';
import { Customer360Services } from 'src/app/AcmPages/Customer/customer360/customer360.services';
import { CustomerServices } from 'src/app/AcmPages/Loan-Application/customer/customer.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionPaginationEntity } from 'src/app/shared/Entities/collection.pagination.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CollectionServices } from '../../collection.services';

@Component({
  selector: 'app-table-unassigned-collections',
  templateUrl: './table-unassigned-collections.component.html',
  styleUrls: ['./table-unassigned-collections.component.sass']
})
export class TableUnassignedCollectionsComponent implements OnInit {
  @Input() collectionPaginationEntity: CollectionPaginationEntity = new CollectionPaginationEntity();
  @Input() statusTab= 0;
  @Input() products: SelectItem[];
  @Input() branches: SelectItem[];
  @Input() statusList: SelectItem[];
  @Input() collectionType;
  public page: number;
  public pageSize: number;
  public cols: any[];
  public selectedColumns: any[];
  public collection: CollectionEntity;

  constructor(private collectionServices: CollectionServices,private devToolsServices: AcmDevToolsServices,
              public sharedService: SharedService,public customer360Services :Customer360Services,
              private customerServices: CustomerServices) { }

  ngOnInit() {
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
      { field: 'statutLibelle', header: 'collections.collection-dashboard.pending_action' }
    ];

    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
  }
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
    collectionParams.status = this.statusTab;
    collectionParams.collectionType = this.collectionType;
    collectionParams.owner='UNASSIGNED';
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
    collectionPaginationEntityParms.params = collectionParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      collectionPaginationEntityParms.sortField = event.multiSortMeta[0].field;
      collectionPaginationEntityParms.sortDirection = event.multiSortMeta[0].order;
    }
    // TODO : change service to unassigned collections
    await this.collectionServices.loadDashboardByStatusPagination(collectionPaginationEntityParms).subscribe(
      (data) => {
        this.collectionPaginationEntity = data;

      }
    );
  }
  getStepName(collection: CollectionEntity): string {
    if (collection.collectionInstancesDtos.length > 0) {
    const  date =  new Date()
    if (String(collection.availableDate).indexOf('-') !== -1) {
      const year = String(collection.availableDate).substring(0, 4);
      const month = String(collection.availableDate).substring(5, 7);
      const day = String(collection.availableDate).substring(8, 10);
      collection.availableDate = new Date(year + '-' + month + '-' + (Number(day)));
    }
      if(date >= collection.availableDate) {

        return collection.collectionInstancesDtos.find(
          step => step.idAcmCollectionStep === collection.idAcmCollectionStep
        ).libelle;
      }
      else {
        collection.collectionInstancesDtos.sort((a, b) => a.idAcmCollectionStep - b.idAcmCollectionStep);
        if (collection.collectionInstancesDtos[0].idAcmCollectionStep === collection.idAcmCollectionStep) {
          return collection.collectionInstancesDtos[0].libelle
        } else {
          return collection.collectionInstancesDtos.find(
            step => step.idAcmCollectionStep === collection.idAcmCollectionStep - 1
          ).libelle;
        }
      }
    }
  }
  /**
   * assignCollection
   */
  async assignCollection(rowData) {
    await this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.ASSIGN_LOAN)
      .afterClosed().subscribe(res => {
        if (res) {
          this.collectionServices.assignCollection(rowData).pipe(map(data => {
            rowData.owner = data.owner;
            rowData.ownerName = data.ownerName;
          }),
            mergeMap(res1 => {
              return this.customer360Services.findLoanByIdExtern(rowData.idLoanExtern)
            }),
            mergeMap(loan => {
              this.sharedService.setLoan(loan);
              return this.customerServices.getCustomerInformation(loan.customerDTO.id);
            })).toPromise().then(customer => {
              // set customer in sharedService
              this.sharedService.setCustomer(customer);
              // set the collection to sharedService
              this.sharedService.setCollection(rowData);
              // redirection to the loan-collection-details route
              this.sharedService.rootingCollectionUrlByStatut('dashboard-collection');
            });
        }
      });
  }
}
