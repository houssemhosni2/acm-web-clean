import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { GuarantorsDetailsService } from '../../Loan-Application/guarantors-step/guarantors-details/guarantors-details.service';
import { CustomerManagementService } from '../customer-management/customer-management.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

@Component({
  selector: 'app-my-loan-guarantors',
  templateUrl: './my-loan-guarantors.component.html',
  styleUrls: ['./my-loan-guarantors.component.sass']
})
export class MyLoanGuarantorsComponent implements OnInit {
  public guarantors: CustomerLinksRelationshipEntity[] = [];
  public loan: LoanEntity = new LoanEntity();
  public customer: CustomerEntity = new CustomerEntity();
  @Input() expanded;
  @Output() myLoanGuarantorEvent = new EventEmitter<string>();
  public loans: LoanEntity[];
  constructor(public loanSharedService: SharedService, public customerManagementService: CustomerManagementService,
    public guarantorsDetailsService: GuarantorsDetailsService, public router: Router,public devToolsServices: AcmDevToolsServices,private dbService: NgxIndexedDBService) { }

  async ngOnInit() {
    this.customer = this.loanSharedService.getCustomer();
    // get list of all loan guarantors of the customer
    if(!checkOfflineMode()){
      const customerLinksRelationshipEntity: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
      customerLinksRelationshipEntity.customerId = this.customer.id;
      this.customerManagementService.getAllLoanGuarantors(customerLinksRelationshipEntity).subscribe((data) => {
        this.fillGuarantorList(data);
      });
    } else {
      const data = await this.dbService.getByKey('data','getLoanGuarantors_' + this.customer.id).toPromise() as any;
    if (data === undefined) {
      this.devToolsServices.openToast(3, 'No loan guarantors saved for offline use');
    } else {
     this.fillGuarantorList(data.data);
    }
    }
  }

  fillGuarantorList(data){
    data.forEach((guarantor) => {
      const customerLinksRelationship: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
      customerLinksRelationship.amountGuarantor = guarantor.amountGuarantor;
      customerLinksRelationship.member = new CustomerEntity();
      customerLinksRelationship.member = guarantor.member;
      customerLinksRelationship.member.customerNameNoPipe = this.loanSharedService.getCustomerName(guarantor.member);
      customerLinksRelationship.loanAmount = guarantor.loanDTO.applyAmountTotal;
      customerLinksRelationship.product = guarantor.loanDTO.productDescription;
      customerLinksRelationship.loanAccount = guarantor.loanDTO.accountNumber;
      this.guarantors.push(customerLinksRelationship);
    });
  }
  /**
   * Toggle Card
   */
  toggleCollapseEmpty() {
    this.expanded = !this.expanded;
  }
  /**
   * customerDetails open customer 360
   * @param rowData Customer
   */
   changeGarantor(guarantor:CustomerEntity) {
      this.loanSharedService.setCustomer(guarantor);
      this.myLoanGuarantorEvent.emit();
     }

}
