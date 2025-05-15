import {AfterContentInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {AcmConstants} from 'src/app/shared/acm-constants';
import {CustomerEntity} from 'src/app/shared/Entities/customer.entity';
import {CustomerLinksRelationshipEntity} from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import {SharedService} from 'src/app/shared/shared.service';
import {CustomerListService} from '../customer-list/customer-list.service';
import {CustomerManagementService} from '../customer-management/customer-management.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

@Component({
  selector: 'app-guarantees',
  templateUrl: './guarantees.component.html',
  styleUrls: ['./guarantees.component.sass']
})
export class GuaranteesComponent implements OnInit, AfterContentInit {
  public customerLinksRelationshipEntitys: CustomerLinksRelationshipEntity[];
  public listLoaded = new Subject<boolean>();
  public guarantees: CustomerLinksRelationshipEntity[] = [];
  public customer: CustomerEntity = new CustomerEntity();
  @Input() expanded;
  @Output() guarantorEvent = new EventEmitter<string>();

  constructor(public loanSharedService: SharedService, public customerListService: CustomerListService,public devToolsServices: AcmDevToolsServices,
              public customerManagementService: CustomerManagementService,private dbService: NgxIndexedDBService) {
  }

  async ngOnInit() {
    this.customer = this.loanSharedService.getCustomer();
    // get guarantees of customer selected
    if(!checkOfflineMode()){
    const customerLinksRelationshipEntity: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
    customerLinksRelationshipEntity.member = new CustomerEntity();
    customerLinksRelationshipEntity.member.id = this.customer.id;
    customerLinksRelationshipEntity.category = AcmConstants.RELATION_GUARANTOR;
    await this.customerManagementService.getGuarantees(customerLinksRelationshipEntity).subscribe(
      (customerLinksRelationshipEntitysList) => {
        this.customerLinksRelationshipEntitys = customerLinksRelationshipEntitysList;
        this.listLoaded.next(true);
      });
    } else {
      const guarantees = await this.dbService.getByKey('data','getGuarantees_' + this.customer.id).toPromise() as any;
    if (guarantees === undefined) {
      this.devToolsServices.openToast(3, 'No guarantees saved for offline use');
    } else {
      this.customerLinksRelationshipEntitys = guarantees.data;
      this.listLoaded.next(true);
    }
    }
  }

  ngAfterContentInit() {
    this.listLoaded.subscribe(() => {
      this.customerLinksRelationshipEntitys.forEach((guarantor) => {
        const guarantorLinksRelationshipEntity: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
        guarantorLinksRelationshipEntity.loanAccount = guarantor.loanDTO.accountNumber;
        guarantorLinksRelationshipEntity.loanAmount = guarantor.loanDTO.applyAmountTotal;
        guarantorLinksRelationshipEntity.product = guarantor.loanDTO.productDescription;

        if (guarantor.loanDTO.customerDTO.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
          guarantorLinksRelationshipEntity.customer = guarantor.loanDTO.customerDTO.firstName +
            ' ' + guarantor.loanDTO.customerDTO.lastName;
        } else if (guarantor.loanDTO.customerDTO.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
          guarantorLinksRelationshipEntity.customer = guarantor.loanDTO.customerDTO.solidarityName;
        } else {
          guarantorLinksRelationshipEntity.customer = guarantor.loanDTO.customerDTO.organizationName;
        }
        guarantorLinksRelationshipEntity.amountGuarantor = guarantor.amountGuarantor;
        guarantorLinksRelationshipEntity.member = guarantor.loanDTO.customerDTO ;
        this.guarantees.push(guarantorLinksRelationshipEntity);
      });
    });
  }

  /**
   *  toggle Collapse
   */
  toggleCollapse() {
    this.expanded = !this.expanded;
  }
  changeGarantor(guarantor:CustomerEntity) {
    this.loanSharedService.setCustomer(guarantor);
    this.guarantorEvent.emit();
   }
}
