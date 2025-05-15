import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { CustomerAddressService } from '../../../AcmPages/Customer/customer-address/customer-address.service';
import { AddressTypeEntity } from '../../../shared/Entities/AddressType.entity';
import { CustomerComponent } from '../../Loan-Application/customer/customer.component';
import { CustomerListService } from '../customer-list/customer-list.service';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { UdfService } from '../../Loan-Application/udf/udf.service';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import { LoansUdfEntity } from 'src/app/shared/Entities/loansUdf.entity';
import { ActivatedRoute, Router } from '@angular/router';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { DomSanitizer } from '@angular/platform-browser';
import { MapMarkerEntity } from '../../../shared/Entities/mapMarker.entity';
import { MapsAPILoader } from '@agm/core';
import { Customer360Services } from './customer360.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressHistoriqueEntity } from '../../../shared/Entities/AddressHistorique.entity';
import { AppComponent } from '../../../app.component';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GedServiceService } from '../../GED/ged-service.service';
import { google } from '@google/maps';
import { mergeMap } from 'rxjs/operators';
import { SettingsService } from '../../Settings/settings.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-customer360',
  templateUrl: './customer360.component.html',
  styleUrls: ['./customer360.component.sass']
})
export class Customer360Component implements OnInit {
  @ViewChild(CustomerComponent) childComponent: CustomerComponent;
  public customer: CustomerEntity = new CustomerEntity();
  public customerParent: CustomerEntity;
  public addresses: AddressEntity[] = [];
  public addressTypes: AddressTypeEntity[] = [];
  public informationTab: boolean;
  public otherinformationTab: boolean;
  public accountTab: boolean;
  public documentTab: boolean;
  public relationshipTab: boolean;
  public communicationTab: boolean;
  public collectionTab: boolean;
  public guaranteesTab: boolean;
  public transactionTab: boolean;
  public loans: LoanEntity[] = [];
  public udfLoans: LoansUdfEntity[] = [];
  public navigation;
  public useGPS = false;
  public displayMap = false;
  @Input() expandedAddress = true;
  image: any = '../../../../assets/images/avatars/user.jpg';

  // Google Map
  public latitude = 0;
  public longitude = 0;
  public markers: MapMarkerEntity[] = [];
  public zoom = 9;
  public map: google.maps.Map;
  public mapClickListener: google.maps.MapsEventListener;
  public addressMarker: any;
  public mapLocation: string[] = [];
  public addressHistory: AddressHistoriqueEntity[] = [];
  public addressUpdate: AddressEntity;
  public addressUpdateIndex: number;
  public addressFromReason: FormGroup;
  public transitionsAccountes: any;

  /**
   *
   * @param devToolsServices devToolsServices
   * @param loanSharedService loanSharedService
   * @param customerAddressService customerAddressService
   * @param customerListService CustomerListService
   * @param udfService UdfService
   * @param route ActivatedRoute
   * @param router : Router
   * @param sanitizer DomSanitizer
   * @param mapsAPILoader MapsAPILoader
   * @param customer360Services Customer360Services
   * @param modalService NgbModal
   * @param translate TranslateService
   * @param formBuilder FormBuilder
   */
  constructor(public devToolsServices: AcmDevToolsServices, public loanSharedService: SharedService,
    public customerAddressService: CustomerAddressService, public customerListService: CustomerListService,
    public udfService: UdfService, public route: ActivatedRoute, public router: Router,
    public sanitizer: DomSanitizer, public mapsAPILoader: MapsAPILoader, public customer360Services: Customer360Services,
    public modalService: NgbModal, public translate: TranslateService, public formBuilder: FormBuilder,
    public gedServiceService: GedServiceService, public settingsService: SettingsService,private dbService: NgxIndexedDBService) {
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.navigation = params.source;
    });
    this.informationTab = true;
    this.devToolsServices.backTop();
    this.customer = this.loanSharedService.getCustomer();
    if(checkOfflineMode()){
      const data = await this.dbService.getByKey('data', 'getLoansByCustomer_' + this.customer.id).toPromise() as any;
      if(data === undefined){
        this.devToolsServices.openToast(3, 'No loans saved for offline use');
      } else {
        this.loans = data.data;
      }
    } else {
      this.gedServiceService.findLoanByCustumer(this.loanSharedService.getCustomer().id).subscribe((data) => {
        this.loans = data;
      });
    }
    this.getAddress();
    this.getLoansUDF();
    if(checkOfflineMode()){
    const environments = await  this.dbService.getByKey('data', 'envirement-values-by-keys').toPromise() as any;
    if(environments !== undefined){
       const env = environments.data.filter((env => env.key === AcmConstants.SAVING_ACCOUNT_AUTOMATIC));
       if (env.length > 0){
        this.transitionsAccountes = env[0].enabled;
       }
    }
    } else {
      const acmEnvironmentKeys: string[] = [AcmConstants.SAVING_ACCOUNT_AUTOMATIC]
      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
    if (environments) {
      this.transitionsAccountes = environments[0].enabled;
    }
  });
    }
  }

  /**
   * reload
   * @param event event
   */
  reload(event) {
    this.customerParent = event;
    this.ngOnInit();
    this.childComponent.reload();

  }

  /**
   * Get list of addresses
   */
   async getAddress() {
    if(this.useGPS){
      this.mapsAPILoader.load().then(() => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.zoom = 8;
            // this.getAddress(this.latitude, this.longitude);
          }, () => {
            this.customerAddressService.getCurrentPlace().subscribe(
              (data) => {
                this.latitude = data.lat;
                this.longitude = data.lon;
                this.zoom = 8;
              }
            );
          });
        }
      });
    }
    if(checkOfflineMode()){
    const result = await this.dbService.getByKey('data', 'address-type').toPromise() as any;
        if (result === undefined) {
          this.devToolsServices.openToast(3, 'No address type saved for offline use');
        } else {
          this.addressTypes = result.data;
        }
    const customerAddress = await this.dbService.getByKey('data' , 'getCustomerAddress_' + this.customer.id).toPromise() as any;
    if(customerAddress !== undefined){
      this.addresses = customerAddress.data;
      this.fillMapMarkers(this.addresses)
    }
      }
      else {
    const customerAddress = new AddressEntity();
    customerAddress.customerId = this.customer.id;
    this.customerAddressService.getAddressType().pipe(
      mergeMap(addressTypes => {
        this.addressTypes = addressTypes;
        return this.customerAddressService.getCustomerAddress(customerAddress);
      })
    ).subscribe(addresses => {
      this.addresses = addresses;
      this.fillMapMarkers(addresses);
    });
  }

  }

  fillMapMarkers(addresses){

    addresses.forEach((address) => {
      const addressMarker: MapMarkerEntity = new MapMarkerEntity();
      addressMarker.draggable = true;
      if (address.lan !== null && address.lng !== null) {
        addressMarker.lat = +address.lan;
        addressMarker.lng = +address.lng;
        this.latitude = addressMarker.lat;
        this.longitude = addressMarker.lng;
        this.mapLocation.push(address.lan + ', ' + address.lng);
      } else {
        addressMarker.isHidden = true;
      }
      this.markers = [];
      this.markers.push(addressMarker);
    });
  }


  /**
   * Get type of address
   * @param addressTypeId addressTypeId
   */
  getAdressType(addressTypeId): string {
    let exist = '';
    this.addressTypes.forEach((value) => {
      if (value.addressTypeID === addressTypeId) {
        exist = value.name;
      }
    });
    return exist;
  }

  toggleCollapse() {
    this.expandedAddress = !this.expandedAddress;
  }

  /**
   * refresh from relationship tab
   */
  refresh() {
    this.informationTab = true;
    this.relationshipTab = false
    this.ngOnInit();
    
  }

  /**
   * refresh from guarantees tab
   */
  refreshFromguaranteesTab() {
    this.ngOnInit();
    this.changeTab(1);
  }

  /**
   * Change tab
   */
  changeTab(tab: number) {
    switch (tab) {
      case 1:
        this.informationTab = true;
        this.otherinformationTab = false;
        this.accountTab = false;
        this.documentTab = false;
        this.relationshipTab = false;
        this.communicationTab = false;
        this.collectionTab = false;
        this.guaranteesTab = false;
        this.transactionTab = false;
        break;
      case 2:
        this.informationTab = false;
        this.otherinformationTab = true;
        this.accountTab = false;
        this.documentTab = false;
        this.relationshipTab = false;
        this.communicationTab = false;
        this.collectionTab = false;
        this.guaranteesTab = false;
        this.transactionTab = false;
        break;
      case 3:
        this.informationTab = false;
        this.otherinformationTab = false;
        this.accountTab = true;
        this.documentTab = false;
        this.relationshipTab = false;
        this.communicationTab = false;
        this.collectionTab = false;
        this.guaranteesTab = false;
        this.transactionTab = false;
        break;
      case 4:
        this.informationTab = false;
        this.otherinformationTab = false;
        this.accountTab = false;
        this.documentTab = false;
        this.relationshipTab = false;
        this.communicationTab = false;
        this.collectionTab = false;
        this.guaranteesTab = false;
        this.transactionTab = true;
        break;
      case 5:
        this.informationTab = false;
        this.otherinformationTab = false;
        this.accountTab = false;
        this.documentTab = true;
        this.relationshipTab = false;
        this.communicationTab = false;
        this.collectionTab = false;
        this.guaranteesTab = false;
        this.transactionTab = false;
        break;
      case 6:
        this.informationTab = false;
        this.otherinformationTab = false;
        this.accountTab = false;
        this.documentTab = false;
        this.relationshipTab = true;
        this.communicationTab = false;
        this.collectionTab = false;
        this.guaranteesTab = false;
        this.transactionTab = false;
        break;
      case 7:
        this.informationTab = false;
        this.otherinformationTab = false;
        this.accountTab = false;
        this.documentTab = false;
        this.relationshipTab = false;
        this.communicationTab = true;
        this.collectionTab = false;
        this.guaranteesTab = false;
        this.transactionTab = false;
        break;
      case 8:
        this.informationTab = false;
        this.otherinformationTab = false;
        this.accountTab = false;
        this.documentTab = false;
        this.relationshipTab = false;
        this.communicationTab = false;
        this.collectionTab = false;
        this.guaranteesTab = true;
        this.transactionTab = false;
        break;
      case 9:
        this.informationTab = false;
        this.otherinformationTab = false;
        this.accountTab = false;
        this.documentTab = false;
        this.relationshipTab = false;
        this.communicationTab = false;
        this.collectionTab = true;
        this.guaranteesTab = false;
        this.transactionTab = false;
        break;
    }
  }

  async getLoansUDF() {
    if(checkOfflineMode()){
      const udfLoans = await this.dbService.getByKey('data', 'getLoanUdfByCustomer_' + this.customer.id).toPromise() as any;
      if(udfLoans == undefined){
        this.devToolsServices.openToast(3, 'No loan udf saved for offline use');
      } else {
        this.udfLoans = udfLoans.data;
      }
    } else {
      const udfLink = new UserDefinedFieldsLinksEntity();
      udfLink.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
      udfLink.elementId = this.customer.id;
      this.udfService.getLoansUdfByCustomer(udfLink).subscribe((data) => {
        this.udfLoans = data;
      });
    }
  }

  exit() {
    if (this.navigation === AcmConstants.AML_CHECK || this.navigation === AcmConstants.AML_DOUBTFUL) {
      this.router.navigate(['/acm/generic-wf-screen'], { queryParams: { source: this.navigation } });
    } else {

      if (this.customerParent !== undefined && this.customerParent !== null) {
        this.loanSharedService.setCustomer(this.customerParent);
        this.customerDetails(this.customerParent);
      } else {
        if (this.navigation === 'customer-list') {
          this.router.navigate([AcmConstants.CUSTOMER_360_URL], { queryParams: { mode: 1 } });
        } else if (this.navigation === 'workflow') {
          if (this.loanSharedService.getLoan() !== null && Object.keys(this.loanSharedService.getLoan()).length !== 0) {
            this.loanSharedService.openLoan(this.loanSharedService.getLoan());
            if (!this.loanSharedService.getForExitCustumer360())
              this.router.navigate([AcmConstants.LOAN_MANAGEMENT_ADD_URL]);

          } else {
            this.router.navigate([AcmConstants.LOAN_MANAGEMENT_ADD_URL]);
          }
        }
        else if (this.navigation === 'fromCollection') {
          if (this.loanSharedService.getCollection() !== null && Object.keys(this.loanSharedService.getCollection()).length !== 0) {
            this.loanSharedService.openCollection();
          } else {
            this.router.navigate([AcmConstants.LOAN_MANAGEMENT_ADD_URL]);
          }
        }
        else if (this.navigation === 'exception-request') {
          this.router.navigate([AcmConstants.EXCEPTION_REQUESTS_URL]);
        }
        else if (this.navigation === 'calendar') {
          this.router.navigate([AcmConstants.CALENDAR_URL]);
        }
        else if (this.navigation === 'planning') {
          this.router.navigate([AcmConstants.TASK_URL]);
        }
      }
    }
  }

  /**
   * customerDetails open customer 360
   * @param customer Customer
   */
  customerDetails(customer) {
    this.customer = customer;
    this.loanSharedService.setCustomer(this.customer);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'customer-list' } });
    });
  }

  /**
   * change GPS Location
   * @param i number
   */
  loadMarkerMap(i: number) {
    this.useGPS = true;
    const cor: string = this.mapLocation[i];
    const lat = cor.substring(0, cor.indexOf(','));
    const lng = cor.substring(cor.indexOf(' '), cor.length);
    this.markers[i].lat = +lat;
    this.markers[i].lng = +lng;
    this.addresses[i].lan = lat;
    this.addresses[i].lng = lng;
  }
  showMap(i: number) {
    if (!this.useGPS) {
      this.loadMarkerMap(i)
    }
    this.displayMap = !this.displayMap;
  }

  /**
   * Action drage Marker map
   * @param i number
   * @param $event google.maps.MouseEvent
   */
  markerDragEnd(i: number, $event: google.maps.MouseEvent) {
    this.markers[i].lat = $event.latLng.lat();
    this.markers[i].lng = $event.latLng.lng();
    this.mapLocation[i] = $event.latLng.lat() + ', ' + $event.latLng.lng();
    this.addresses[i].lan = $event.latLng.lat().toString();
    this.addresses[i].lng = $event.latLng.lng().toString();
  }

  /**
   * get current places
   * @param i number
   */
  getCurrentPlace(i: number) {
    if (!this.useGPS) {
      this.useGPS = true;
    }
    const addressMarker: MapMarkerEntity = new MapMarkerEntity();
    addressMarker.draggable = true;
    this.mapsAPILoader.load().then(() => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          addressMarker.lat = this.latitude = position.coords.latitude;
          addressMarker.lng = this.longitude = position.coords.longitude;
          this.zoom = 8;
          this.displayMap = true;
          this.markers = [];
          this.markers[i] = addressMarker;
          this.mapLocation[i] = this.latitude + ', ' + this.longitude;
          this.addresses[i].lan = this.latitude.toString();
          this.addresses[i].lng = this.longitude.toString();
          // this.getAddress(this.latitude, this.longitude);
        })
      }
    });

  }

  /**
   * save Address screen 360
   */
  saveAddress() {
    if (this.addressFromReason.valid) {
      this.addressUpdate.reasonUpdate = this.addressFromReason.controls.addressReason.value;
      this.customer360Services.saveAllAddress(this.addressUpdate).subscribe(
        (data) => {
          this.addresses[this.addressUpdateIndex] = data;
          this.mapLocation[this.addressUpdateIndex] = data.lan + ', ' + data.lng;
          this.modalService.dismissAll();
        }
      );
    }
  }

  /**
   *  get Address History by Address ID
   * @param addressHistoryPop TemplateRef
   * @param addresse AddressEntity
   */
  getAddressHistory(addressHistoryPop: TemplateRef<any>, addresse: AddressEntity) {
    const addressHistoriqueEntity: AddressHistoriqueEntity = new AddressHistoriqueEntity();
    addressHistoriqueEntity.idAddressACM = addresse.id;
    this.customer360Services.getAddressHistorique(addressHistoriqueEntity).subscribe(
      (history) => {
        this.addressHistory = history.reverse();
        this.modalService.open(addressHistoryPop, {
          size: 'xl'
        });
      }
    );
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   *  address Update Reason Pop-up
   * @param updateAddress TemplateRef<any>
   * @param i number
   */
  addressUpdateReason(updateAddress: TemplateRef<any>, i: number) {
    this.addressUpdate = this.addresses[i];
    this.addressUpdateIndex = i;
    this.addressFromReason = this.formBuilder.group({
      addressReason: ['', Validators.required],
    });
    this.modalService.open(updateAddress, {
      size: 'lg'
    });
  }
}
