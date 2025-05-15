import { CustomerServices } from './../../Loan-Application/customer/customer.services';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { SupplierService } from '../supplier.service';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-supplier-information',
  templateUrl: './supplier-information.component.html',
  styleUrls: ['./supplier-information.component.sass'],
})
export class SupplierInformationComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };

  public loading = false;
  expandedAddress = true;
  expandedKPI = true;
  addressDataChecker: boolean;
  KPIChecker: boolean;
  @Input() expanded;
  @Input() supplier360;
  public supplier: SupplierEntity = new SupplierEntity();
  public supplierAddress: AddressEntity[];
  public loadedData = false;
  @Input() percentage;
  @Input() sumSupplierBalance;
  objectifCa: number;
  public customer: CustomerEntity;
  public preodicityName  = ""  ;
  public legalCategory ="" ;


  public newPhoto: any = '../../../../assets/images/avatars/user.jpg';

  constructor(
    public sanitizer: DomSanitizer,
    public supplierService: SupplierService,
    public sharedService: SharedService,
    public router: Router,
    public customerManagementService: CustomerManagementService,
    public devToolsServices: AcmDevToolsServices,
    public translate: TranslateService,
    public customerService : CustomerServices
  ) { }

  async ngOnInit() {
    this.supplier = this.sharedService.getSupplier();
    if (AcmConstants.SupplierPriodicity.filter(elem=> this.supplier.periodicity ==elem.id).length>0 ){
       this.preodicityName = AcmConstants.SupplierPriodicity.filter(elem=> this.supplier.periodicity ==elem.id)[0].label
    }
    if (AcmConstants.SupplierLegalCategorys.filter(elem=> this.supplier.legalCatalog ==elem.id).length>0 ){
      this.legalCategory = AcmConstants.SupplierLegalCategorys.filter(elem=> this.supplier.legalCatalog ==elem.id)[0].label
   }

    this.supplierAddress = this.supplier.listAddress;
    this.objectifCa = Number(this.supplier.objectif);
    this.checkersMethod();
    this.loadedData = true;
  }

  checkersMethod() {
    /** Check Address DATA */
    if (this.supplierAddress.length > 0) {
      this.addressDataChecker = true;
    } else this.addressDataChecker = false;

    /** Check KPI DATA */
    if (this.objectifCa > 0) {
      this.KPIChecker = true;
    } else {
      this.KPIChecker = false;
    }

  }

  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }

  toggleCollapseAddress() {
    this.expandedAddress = !this.expandedAddress;
    this.ngOnInit();
  }

  toggleCollapseKPI() {
    this.expandedKPI = !this.expandedKPI;
    this.ngOnInit();
  }

  /**
   * reload from supplier 360
   */
  reload() {
    this.ngOnInit();
  }

  addImage(event) {
    /** API UPDATE SUPPLIER IMAGE */
  }

  /**
   * supplierDetails View supplier 360
   */
  supplierDetails() {
    this.router.navigate([AcmConstants.SUPPLIER_360_DETAILS_URL], {
      queryParams: { source: 'workflow' },
    });
  }

  /**
   * Callback Supplier
   */
  sendCallbackSupplier() {
    this.devToolsServices.openToast(0, this.translate.instant('supplier-360.mail_Sent'));
  }

  async customerDetails(supplier) {
    const customerParam = new CustomerEntity();
    if (supplier.identity) {
      customerParam.identity = supplier.identity;
    }
    if (supplier.registerNumber) {
      customerParam.registerNumber = supplier.registerNumber;
    }
    await this.customerService.findCustomer(customerParam).toPromise().then((data) => {
      if (data.length > 0) {
        this.customer = data[0]
      }
    });
    this.sharedService.setCustomer(this.customer);
    this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'customer-list' } });
  }

}
