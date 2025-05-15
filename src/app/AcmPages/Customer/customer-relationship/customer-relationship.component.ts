import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';
import { CustomerAddressService } from '../customer-address/customer-address.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { NgxIndexedDBService } from 'ngx-indexed-db';
const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-customer-relationship',
  templateUrl: './customer-relationship.component.html',
  styleUrls: ['./customer-relationship.component.sass']
})
export class CustomerRelationshipComponent implements OnInit {
  @Input() expanded;
  @Output() customerEvent = new EventEmitter<string>();

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public customer: CustomerEntity = new CustomerEntity();
  public customerRelationships: CustomerLinksRelationshipEntity[] = [];
  public customerAddress;
  /**
   *
   * @param sharedService sharedService
   * @param customerServices customerServices
   * @param customerAddressService customerAddressService
   */
  constructor(public sharedService: SharedService, public customerServices: CustomerServices,
              public customerAddressService: CustomerAddressService,public devToolsServices: AcmDevToolsServices,private dbService: NgxIndexedDBService) { }

 async ngOnInit() {
    this.customer = this.sharedService.getCustomer();
    if(checkOfflineMode()){
      const relationship = await this.dbService.getByKey('data', 'getRelationshipLinkByCustomerId_' + this.customer.id).toPromise() as any;
      if(relationship == undefined){
        this.devToolsServices.openToast(3, 'No customer link relationships saved for offline use');
      } else {
        this.customerRelationships = relationship.data;
        this.customerRelationships.forEach(member=>{
          member.member.customerNameNoPipe = this.sharedService.getCustomerName(member.member);
          const addressList = member.member.listAddress;
          if(addressList.length > 0){
            this.fillCustomerAddress(addressList);
            member.member.customerAddress = this.customerAddress;
          }
        })
      }
    } else {
    const relationShip = new CustomerLinksRelationshipEntity();
    relationShip.customerId = this.customer.id;
    relationShip.category = AcmConstants.CUSTOMER_TYPE_RELATION;
    this.customerServices.findCustomerLinkRelationShip(relationShip).subscribe(
      (value) => {
        this.customerRelationships = value;
        this.customerRelationships.forEach(member => {
          member.member.customerNameNoPipe = this.sharedService.getCustomerName(member.member);
          const addressEntity: AddressEntity = new AddressEntity();
          addressEntity.customerId = member.member.id;
          this.customerAddressService.getCustomerAddress(addressEntity).subscribe((adresse) => {
            if (adresse.length > 0) {
              this.fillCustomerAddress(adresse);
              member.member.customerAddress = this.customerAddress;
            }
          });
        });
      });
    }
  }

  fillCustomerAddress(adresse){
    if (adresse[0].townCity !== null) {
      this.customerAddress = adresse[0].townCity + ' ';
    }
    if (adresse[0].county !== null) {
      this.customerAddress += adresse[0].county + ' ';
    }
    if (adresse[0].state !== null) {
      this.customerAddress += adresse[0].state;
    }
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }
  /**
   * redirect to customer 360 details
   * @param member member
   */
  customerDetails(member) {
    this.sharedService.setCustomer(member);
    this.ngOnInit();
    this.customerEvent.emit();
  }
}
