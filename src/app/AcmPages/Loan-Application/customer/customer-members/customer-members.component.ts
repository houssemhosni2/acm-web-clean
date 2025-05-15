import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerServices } from '../customer.services';
import { SharedService } from 'src/app/shared/shared.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { Router } from '@angular/router';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { CustomerAddressService } from '../../../../AcmPages/Customer/customer-address/customer-address.service';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UdfService } from '../../udf/udf.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
const PrimaryBleu = 'var(--primary)';
@Component({
  selector: 'app-customer-members',
  templateUrl: './customer-members.component.html',
  styleUrls: ['./customer-members.component.sass']
})
export class CustomerMembersComponent implements OnInit {
  @Output() customerEvent = new EventEmitter<CustomerEntity>();
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loading = false;
  public customer: CustomerEntity = new CustomerEntity();
  public customerMembers: CustomerLinksRelationshipEntity[] = [];
  public customerAddress;
  @Input() expanded;

  /**
   *
   * @param customerServices customerServices
   * @param sharedService sharedService
   * @param customerAddressService customerAddressService
   * @param router router
   */
  constructor(public customerServices: CustomerServices,
              public sharedService: SharedService,public devToolsServices: AcmDevToolsServices, public customerAddressService: CustomerAddressService,
              public router: Router, public udfService: UdfService,private dbService: NgxIndexedDBService) {
  }

  async ngOnInit() {
    this.customer = this.sharedService.getCustomer();
    if(!checkOfflineMode()){
    const relationShip = new CustomerLinksRelationshipEntity();
    relationShip.customerId = this.customer.id;
    relationShip.category = AcmConstants.MEMBERS;
    this.customerServices.findCustomerLinkRelationShip(relationShip).subscribe(
      (value) => {
        this.customerMembers = value;
        this.customerMembers.forEach((members) => {
          members.member.listUDFGroup = [];
          const userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
          userDefinedFieldsLinksEntity.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
          userDefinedFieldsLinksEntity.elementId = members.member.id;
          userDefinedFieldsLinksEntity.userDefinedFieldsDTO = new UserDefinedFieldsEntity();
          userDefinedFieldsLinksEntity.userDefinedFieldsDTO.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
          userDefinedFieldsLinksEntity.userDefinedFieldsDTO.userDefinedFieldGroupDTO.id = AcmConstants.UDF_GROUP_NATIONALITY;
          this.udfService.getUdfLinkGroupby(userDefinedFieldsLinksEntity).subscribe((nationality) => {
            if (nationality.length > 0) {
              members.member.listUDFGroup.push(nationality[0].udfGroupeFieldsModels[1]);
            }
          });
        });
        this.customerMembers.forEach(member => {
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
    else {
      const relationship = await this.dbService.getByKey('data', 'getMemberLinkByCustomerId_' + this.customer.id).toPromise() as any;
      if(relationship == undefined){
        this.devToolsServices.openToast(3, 'No customer link relationships saved for offline use');
      } else {
        this.customerMembers = relationship.data;
        this.customerMembers.forEach(async(members) => {
          members.member.listUDFGroup = [];
          const nationality = await this.dbService.getByKey('data', 'udfLinkGroupByMemberId_' + members.member.id).toPromise() as any;
          if(nationality !== undefined){
            members.member.listUDFGroup.push(nationality.data[0].udfGroupeFieldsModels[1]);
          }
        });
        this.customerMembers.forEach(async(link) => {
          if(link.member.listAddress.length > 0){
            this.fillCustomerAddress(link.member.listAddress);
            link.member.customerAddress = this.customerAddress;
          }
        })
      }
    }
  }

  fillCustomerAddress(address){
    if (address[0].townCity !== null) {
      this.customerAddress = address[0].townCity + ' ';
    }
    if (address[0].county !== null) {
      this.customerAddress += address[0].county + ' ';
    }
    if (address[0].state !== null) {
      this.customerAddress += address[0].state;
    }
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }
  customerDetails(customerMember) {
    this.sharedService.setCustomer(customerMember);
    this.customerEvent.emit(this.customer);
    this.ngOnInit();
  }
}
