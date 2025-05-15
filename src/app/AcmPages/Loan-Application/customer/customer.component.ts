import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CustomerServices } from './customer.services';
import { CustomerEntity } from '../../../shared/Entities/customer.entity';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanDocumentEntity } from '../../../shared/Entities/loanDocument.entity';
import { AcmConstants } from '../../../shared/acm-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerAddressService } from '../../../AcmPages/Customer/customer-address/customer-address.service';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { ArrearsEntity } from '../../../shared/Entities/Arrears.entity';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { SupplierPaginationEntity } from 'src/app/shared/Entities/Supplier.pagination.entity';
import { SupplierService } from '../../Supplier/supplier.service';
import { ProspectEntity } from 'src/app/shared/Entities/Prospect.entity';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.sass']
})
export class CustomerComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loan: LoanEntity = new LoanEntity();
  public loanDocumentEntity: LoanDocumentEntity = new LoanDocumentEntity();
  public loading = false;
  public customer: CustomerEntity = new CustomerEntity();
  public arrears: ArrearsEntity = new ArrearsEntity();
  public customerAddress = '';
  public image: any = '../../../../assets/images/avatars/user.jpg';
  public customerGrpOrg: CustomerEntity = new CustomerEntity();
  public isGroup: boolean;
  @Input() expanded;
  @Input() customer360;
  @Input() collection;
  @Input() category;
  public newPhoto: any;
  public showInternetBanking = '0';
  public loadedData = false;
  public supplier : SupplierEntity = new SupplierEntity();
  public source: string;
 
  prospect : ProspectEntity;
  /**
   * constructor
   * @param customerServices CustomerServices
   * @param loanSharedService SharedService
   * @param router Router
   * @param customerAddressService CustomerAddressService
   * @param devToolsServices AcmDevToolsServices
   * @param sanitizer DomSanitizer
   * @param customerManagementService CustomerManagementService
   */
  constructor(public customerServices: CustomerServices,
    public loanSharedService: SharedService,
    public router: Router,
    public customerAddressService: CustomerAddressService,
    public devToolsServices: AcmDevToolsServices,
    public sanitizer: DomSanitizer, public customerManagementService: CustomerManagementService,
    public supplierService: SupplierService,
    public activatedRoute: ActivatedRoute,
    private dbService: NgxIndexedDBService) {
  }

  async ngOnInit() { 
    this.loan = this.loanSharedService.getLoan();
    this.customer = this.loanSharedService.getCustomer();
    this.prospect = this.loanSharedService.getProspect();    
    
    if(!checkOfflineMode() && !this.customer?.id && this.category!==AcmConstants.CUSTOMER_CATEGORY_PROSPECT){
      let customerParam = new CustomerEntity();
      customerParam = this.loan.customerDTO;
      
      this.customerServices.findCustomer(customerParam).subscribe((res)=>{
        this.loanSharedService.setCustomer(res[0]);
        this.customer = res[0];
      })
    }
    if (this.expanded && !this.loadedData) {
      // get customer photo
      if (checkOfflineMode()) {
        this.newPhoto = '../../../../assets/images/avatars/user.jpg';
      } else {
        if(this.category!==AcmConstants.CUSTOMER_CATEGORY_PROSPECT){
          this.customerServices.getCustomerPhoto(this.customer.id).subscribe(
            (photo) => {
              if (photo.size > 0) {
                const fileData = [photo];
                const blob = new Blob(fileData, { type: '' });
                const objectURL = URL.createObjectURL(blob);
                this.newPhoto = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              } else {
                this.newPhoto = '../../../../assets/images/avatars/user.jpg';
              }
            }
          );
        } else {
          this.newPhoto = '../../../../assets/images/avatars/user.jpg';
        }
      }

      // check setting internet banking
      if (checkOfflineMode()) {
        this.dbService.getByKey('data', 'internet-banking').subscribe((data: any) => {
          data = data.data;
          if (data === undefined) {
            this.devToolsServices.openToast(3, 'No keys ib for offline use');
          } else {
            this.showInternetBanking = data.value;
          }
        });
      } else {
        const environnements = AcmConstants.INTERNET_BANKING;
        this.customerManagementService.getEnvirementValueByKey(environnements).subscribe((data) => {
          if (data !== null) {
            this.showInternetBanking = data.value;
          }
        });
        if(this.category!==AcmConstants.CUSTOMER_CATEGORY_PROSPECT && this.loanSharedService.useExternalCBS === '1'){
          this.customerServices.getCustomerArrears(this.customer.customerIdExtern).subscribe((data) => {
            this.arrears = data;
          });
        }
        this.loanDocumentEntity.idCustomer = +this.customer.customerIdExtern;
        const addressEntity: AddressEntity = new AddressEntity();
        addressEntity.customerId = this.customer.id;
        this.customerAddressService.getCustomerAddress(addressEntity).subscribe((value) => {
          if (value.length > 0) {
            if (value[0].townCity !== null) {
              this.customerAddress = value[0].townCity + ' ';
            }
            if (value[0].county !== null) {
              this.customerAddress += value[0].county + ' ';
            }
            if (value[0].state !== null) {
              this.customerAddress += value[0].state;
            }
          }
        });
      }
      this.loadedData = true;
    }
    await this.activatedRoute.queryParams.subscribe((params) => {
      this.source = params.source;
    });
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }

  /**
   * reload from customer 360
   */
  reload() {
    this.ngOnInit();
  }

  /**
   * add image to customer-info
   * @param event file
   */
  addImage(event) {
    const file: any[] = [];
    file.push(event.target.files[0]);
    this.customerServices.updateCustomerPhoto(file, this.customer).subscribe(
      (newPhoto) => {
        const fileData = [newPhoto];
        const blob = new Blob(fileData, { type: '' });
        const objectURL = URL.createObjectURL(blob);
        this.newPhoto = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
    );
  }
  /**
   * clientDetails View Customer 360
   */
  clientDetails() {
    if(this.source === AcmConstants.AML_CHECK || this.source === AcmConstants.AML_DOUBTFUL){
      this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: this.source } });
    }else{
      if (this.collection === 'inCollection') {
        this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'fromCollection' } });
      } else
        this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'workflow' } });
    }

  }


  /**
   * Resend Login to Customer
   */
  sendLogin() {
    this.customerServices.sendLoginCustomer(this.customer).toPromise().then(
      () => {
        this.devToolsServices.openToast(0, 'alert.send_login');
      }
    );
  }

  async supplierDetails(customer) {
    const supplierPaginationEntity = new SupplierPaginationEntity();
    supplierPaginationEntity.params = new SupplierEntity();
    if(customer.identity){
      supplierPaginationEntity.params.identity = customer.identity;
    }
    if(customer.registerNumber){
      supplierPaginationEntity.params.registerNumber = customer.registerNumber;
    }

    await this.supplierService
      .getSupplierPagination(supplierPaginationEntity)
      .toPromise().then((data) => {
        if(data.resultsSuppliers.length === 1 ){
          this.supplier = data.resultsSuppliers[0];
        }
      });
    this.loanSharedService.setSupplier(this.supplier);
    this.router.navigate([AcmConstants.SUPPLIER_360_DETAILS_URL]);
  }


}
