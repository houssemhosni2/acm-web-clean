import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { Customer360Services } from '../../Customer/customer360/customer360.services';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';
import { CollectionServices } from '../collection.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

@Component({
  selector: 'app-customer-collection-history',
  templateUrl: './customer-collection-history.component.html',
  styleUrls: ['./customer-collection-history.component.sass']
})
export class CustomerCollectionHistoryComponent implements OnInit {
  @Input() expanded;
  @Input() activeCollection: number;
  public customerCollections: CollectionEntity[] = [];

  constructor(public collectionServices: CollectionServices,public customerService: CustomerServices,public devToolsServices: AcmDevToolsServices,private dbService: NgxIndexedDBService,
    public customer360Services :Customer360Services,private collectionService: CollectionServices, private sharedService: SharedService)
     { }
  async ngOnInit() {
    if(!checkOfflineMode()){
    // init collection param
    const collectionParam = new CollectionEntity();
    collectionParam.customerIdExtern = this.sharedService.getCustomer().customerIdExtern;
    collectionParam.collectionType = AcmConstants.Collection + "," + AcmConstants.LEGAL
    this.collectionService.getCollection(collectionParam).subscribe((data) => {
      this.customerCollections = data;
    }).add(()=> {
      // filter by collection id s deferent from the input variable
      this.filterCollections();
    });
  } else {
    const collections = await this.dbService.getByKey('data', 'getCustomerCollections_' + this.sharedService.getCustomer().id).toPromise() as any;
    if(collections == undefined){
      this.devToolsServices.openToast(3, 'No collections saved for offline use');
    } else {
      this.customerCollections = collections.data;
      this.filterCollections();
    }
  }
}

filterCollections(){
  if(this.activeCollection !== undefined)
    this.customerCollections = this.customerCollections.filter( coll=>
      coll.id !== this.activeCollection
     );
}
/**
 * toggle Collapse
 */
  toggleCollapse() {
    this.expanded = !this.expanded;
  }
 async collectionDetails(rowData : CollectionEntity){
   // get loan by extern loan id
   await this.customer360Services.findLoanByIdExtern(rowData.idLoanExtern).pipe(
     map(data => {
       // set loan to sharedService
       this.sharedService.setLoan(data);
       return data;
     }),
     // get customer
     mergeMap(loan => {
       const customer = this.customerService.getCustomerInformation(loan.customerDTO.id)
       const acmCollection = new CollectionEntity();
       acmCollection.id = rowData.id;
       const collection = this.collectionServices.getCollection(acmCollection);
       return forkJoin([customer, collection])
     })
   ).subscribe(result => {
     this.sharedService.setCustomer(result[0]);
     // set the collection to sharedService
     this.sharedService.setCollection(result[1][0]);
     // redirection to the loan-collection-details route
     this.sharedService.rootingCollectionUrlByStatut('customer-360');
   });
 }
}
