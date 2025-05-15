import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LoanEntity } from '../../../../shared/Entities/loan.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { GuarantorEntity } from '../../../../shared/Entities/guarantor.entity';
import { LoanGuarantorsServices } from './loan-guarantors.services';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CustomerLinksRelationshipEntity } from '../../../../shared/Entities/CustomerLinksRelationship.entity';
import { AcmConstants } from '../../../../shared/acm-constants';
import { GuarantorsDetailsService } from '../../guarantors-step/guarantors-details/guarantors-details.service';
import { AddressEntity } from '../../../../shared/Entities/Address.entity';
import { CustomerAddressService } from '../../../Customer/customer-address/customer-address.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-loan-guarantors',
  templateUrl: './loan-guarantors.component.html',
  styleUrls: ['./loan-guarantors.component.sass']
})
export class LoanGuarantorsComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loading = true;
  public loan: LoanEntity = new LoanEntity();
  public guarantors: CustomerLinksRelationshipEntity[] = [];
  public data: GuarantorEntity[];
  public decimalPlaces: string;
  arrayExpanded = [];
  @Input() expanded;
  @Output() guarantorDisabled = new EventEmitter<boolean>();
  private loadedData = false;
  /**
   * constructor
   * @param LoanSharedService loanSharedService
   * @param LoanGuarantorsServices loanGuarantorsServices
   * @param Router router
   * @param AcmDevToolsServices devToolsServices
   */
  constructor(public loanSharedService: SharedService, public loanGuarantorsServices: LoanGuarantorsServices,
              public router: Router, public devToolsServices: AcmDevToolsServices,private dbService: NgxIndexedDBService,
              public guarantorsDetailsService: GuarantorsDetailsService,
              public customerAddressService: CustomerAddressService) {
  }

  async ngOnInit() {
    if (this.expanded && !this.loadedData) {
    this.loan = this.loanSharedService.getLoan();
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    const customerLinksRelationshipEntity: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
    customerLinksRelationshipEntity.idLoan = this.loan.loanId;
    customerLinksRelationshipEntity.category = AcmConstants.RELATION_GUARANTOR;
    customerLinksRelationshipEntity.statutLoan = this.loan.statutWorkflow;

    if(checkOfflineMode()){
      const key = 'getLoanGuarantorByLoanId_' + this.loan.loanId ;
      this.dbService.getByKey('data', key).subscribe((guarantors: any) => {
        if (guarantors === undefined) {
          this.devToolsServices.openToast(3, 'No guarantors saved for offline use');
        } else {
          this.guarantors = guarantors.data;
        }
        this.loading = false;
      });
    }
    else {
    await this.guarantorsDetailsService.findCustomerLinkRelationShip(customerLinksRelationshipEntity).toPromise().then(
      (data) => {
        data.forEach(elements => {
          const address: AddressEntity = new AddressEntity();
          address.customerId = elements.member.id;
          address.isPrimary = true;
          this.customerAddressService.getCustomerAddress(address).subscribe(value => {
            elements.member.listAddress = value;
          });
          this.guarantors = data;
          this.loading = false;
        });
      }
    );
  }

    this.guarantors.map((value) => {
      this.arrayExpanded.push(this.expanded);
    });
    if (this.guarantors.length === 0) {
      this.guarantorDisabled.emit(true);
    } else {
      this.guarantorDisabled.emit(false);
    }
    this.loadedData = true;
  }
  }
  toggleCollapse(i) {
    this.arrayExpanded[i] = !this.arrayExpanded[i];
  }

  toggleCollapseEmpty() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }

  /**
   * open guarantor details
   * @param guarantor guarantor
   */
  customerDetails(guarantor) {
    this.loanSharedService.setCustomer(guarantor.member);
    this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'workflow' } });
  }
}
