import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AddressEntity } from '../../../shared/Entities/Address.entity';
import { CustomerAddressService } from './customer-address.service';
import { AddressTypeEntity } from '../../../shared/Entities/AddressType.entity';
import { AddressSettingAbacusEntity } from '../../../shared/Entities/AddressSettingAbacus.entity';
import { AddressListEntity } from '../../../shared/Entities/AddressList.entity';
import { AddressSettingEntity } from '../../../shared/Entities/AddressSetting.entity';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { ACMLengthConstants } from 'src/app/shared/acm-length-constants';
import { MapMarkerEntity } from '../../../shared/Entities/mapMarker.entity';
import { MapsAPILoader } from '@agm/core';
import { AcmConstants } from '../../../shared/acm-constants';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { SupplierService } from '../../Supplier/supplier.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {customRequiredValidator} from '../../../shared/utils';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.sass']
})
export class CustomerAddressComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };

  public loading = false;
  @Input() expanded;
  // mode true: update, mode false: insert
  @Input() mode;
  //  mode supplier: false, normal mode true
  @Input() supplier;
  // Address fields are mandatory
  @Input() mandatory;
  public address: AddressEntity[] = [];
  public submitAddress: AddressEntity[] = [];
  addressType: AddressTypeEntity[] = [];
  addressSetting: AddressSettingAbacusEntity[] = [];
  addressListEntity: AddressListEntity[] = [];
  addressList: string[] = [];
  // country/Region/City/District
  addressForm: FormGroup;
  addressIndex = 0;
  addressListValue: AddressListEntity[][] = [[]];
  public selectedLoan: LoanEntity = new LoanEntity();
  public selectedCustomerAddress: AddressEntity[] = [];
  public selectedCustomer: CustomerEntity = new CustomerEntity();
  public selectedSupplier: SupplierEntity = new SupplierEntity();
  public settingAddressAbacusEntities: AddressSettingAbacusEntity[] = [];


  addressListOffline: { [key: number]: AddressListEntity[] } = {};

  // Google Map
  public latitude = 0;
  public longitude = 0;
  public markers: MapMarkerEntity[] = [];
  public zoom = 9;
  public map: google.maps.Map;
  public mapClickListener: google.maps.MapsEventListener;
  public addressMarker: any;
  public useGPS = false;
  public displayMap =false;
  // required
  public requiredAddress1 = false;
  public requiredAddress2 = false;
  public requiredAddress3 = false;
  public requiredCountry = false;
  public requiredDistrict = false;
  public requiredZipCode = false;
  public requiredRegion = false;
  public requiredCity = false;
  @Output() updateAddress = new EventEmitter<boolean>();

  /**
   *
   * @param customerAddressService CustomerAddressService
   * @param formBuilder FormBuilder
   * @param sharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   * @param mapsAPILoader MapsAPILoader
   * @param library FaIconLibrary
   */
  constructor(public customerAddressService: CustomerAddressService, public formBuilder: FormBuilder,
    public sharedService: SharedService, public devToolsServices: AcmDevToolsServices,
    public mapsAPILoader: MapsAPILoader, public library: FaIconLibrary,
    public supplierService: SupplierService,
    private dbService: NgxIndexedDBService) {
  }

  async ngOnInit() {

    if(checkOfflineMode()){
      await this.dbService.getByKey('data', 'address-list').toPromise().then(async(address: any) => {
        if (address === undefined) {
          this.devToolsServices.openToast(3, 'No address list saved for offline use');
        } else {
          this.addressListEntity = address.data;
          for (let i =0; i < this.addressListEntity.length;i++){
            const list = await this.dbService.getByKey('data','address-list-value-'+this.addressListEntity[i].addressListID).toPromise() as any;
               if(list !== undefined){
                 this.addressListOffline[this.addressListEntity[i].addressListID]= list.data;
               }
           }   
           console.log(this.addressListOffline);
        }
      }) 
    }

    // init form
    this.addressForm = this.formBuilder.group({});

    if (!checkOfflineMode()) {
      // get setting address
      await this.customerAddressService.getAddressSetting().toPromise().then((data) => {
        this.settingAddressAbacusEntities = data;
      });

      if (this.useGPS) {
        // GoogleMap
        this.mapsAPILoader.load().then(() => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
              this.latitude = position.coords.latitude;
              this.longitude = position.coords.longitude;
              if (this.selectedCustomer === null || this.selectedCustomer === undefined && !this.mode) {
                this.addressForm.controls.map0.setValue(this.latitude + ', ' + this.longitude);
                const addressMarker: MapMarkerEntity = new MapMarkerEntity();
                addressMarker.draggable = true;
                addressMarker.lat = this.latitude;
                addressMarker.lng = this.longitude;
                this.markers.push(addressMarker);
              }
              this.zoom = 8;
              // this.getAddress(this.latitude, this.longitude);
            }, () => {
              this.customerAddressService.getCurrentPlace().subscribe(
                (data) => {
                  this.latitude = data.lat;
                  this.longitude = data.lon;
                  if (this.selectedCustomer === null || this.selectedCustomer === undefined && !this.mode) {
                    this.addressForm.controls.map0.setValue(this.latitude + ', ' + this.longitude);
                    const addressMarker: MapMarkerEntity = new MapMarkerEntity();
                    addressMarker.draggable = true;
                    addressMarker.lat = this.latitude;
                    addressMarker.lng = this.longitude;
                    this.markers.push(addressMarker);
                  }
                  this.zoom = 8;
                }
              );
            });
          }
        });
      }
  }


    // ACM ADDRESS
    if (!this.supplier) {
      this.selectedLoan = this.sharedService.getLoan();
      this.selectedCustomer = this.sharedService.getCustomer();      
      
      if ((this.selectedCustomer !== null || this.selectedCustomer !== undefined) && this.mode) {

        if (checkOfflineMode()) {
          await this.dbService.getByKey('data', 'address-list').subscribe((result: any) => {
            if (result === undefined) {
              this.devToolsServices.openToast(3, 'No address list saved for offline use');
            } else {
              this.addressListEntity = result.data;
            }
          }).add(() => {
            this.dbService.getByKey('data', 'address-list').subscribe((result: any) => {
              if (result === undefined) {
                this.devToolsServices.openToast(3, 'No address list saved for offline use');
              } else {
                if(this.selectedCustomer?.listAddress?.length > 0){
                  this.selectedCustomerAddress = this.selectedCustomer.listAddress;
                  this.generateFormAddressForUpdate(this.selectedCustomerAddress);
                } else{
                // mode Edit Get Customer Address
                const customerAddress = new AddressEntity();
                customerAddress.customerId = this.selectedCustomer.id;
                this.dbService.getByKey('data', 'getCustomerAddress_' + this.selectedCustomer.id).subscribe((result: any) => {
                  if (result === undefined) {
                    this.devToolsServices.openToast(3, 'No address list value saved for offline use');
                  } else if (result.data.length > 0) {
                    this.selectedCustomerAddress = result.data;
                    this.generateFormAddressForUpdate(this.selectedCustomerAddress);
                  } else {
                    this.addressListEntity = result.data;
                    this.addressListEntity.forEach(list => {
                      // Get Addres List for Parent Id = 0
                      if (list.parentAddressListID === 0) {
                        const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
                        addressSettingEntity.addressListId = list.addressListID;
                        this.dbService.getByKey('data', 'address-list-value-' + addressSettingEntity.addressListId).subscribe((result: any) => {
                          if (result === undefined) {
                            this.devToolsServices.openToast(3, 'No address list value saved for offline use');
                          } else {
                            this.addressListValue[this.addressIndex] = result.data;
                          }
                        });
                      }
                    });
                    this.address.push(new AddressEntity());
                    this.createForm();
                    const addressMarker: MapMarkerEntity = new MapMarkerEntity();
                    addressMarker.isHidden = true;
                    this.addressForm.addControl('map' + this.addressIndex,
                      new FormControl(''));
                    this.markers.push(addressMarker);
                  }
                });
              }
              }
            },
            ).add(() => {
              //
              for (let i = 0; i < this.address.length; i++) {
                this.setValidationAdressForm(i);
              }
            });
          });

        } else {
          // Get Address Setting
          await this.customerAddressService.getAddressList(this.addressList).subscribe((data) => {
            this.addressListEntity = data;
          }).add(() => {
            // mode Edit Get Customer Address
            const customerAddress = new AddressEntity();
            customerAddress.customerId = this.selectedCustomer.id;
            this.customerAddressService.getCustomerAddress(customerAddress).subscribe(
              (Address) => {
                this.selectedCustomerAddress = Address;
                if (this.selectedCustomerAddress.length > 0) {
                  this.generateFormAddressForUpdate(this.selectedCustomerAddress);
                } else {
                  // Get Address Setting
                  this.customerAddressService.getAddressList(this.addressList).subscribe(
                    (data) => {
                      this.addressListEntity = data;
                      this.addressListEntity.forEach(list => {
                        // Get Addres List for Parent Id = 0
                        if (list.parentAddressListID === 0) {
                          const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
                          addressSettingEntity.addressListId = list.addressListID;
                          this.customerAddressService.getAddressListValue(addressSettingEntity).subscribe(
                            (result) => {
                              this.addressListValue[this.addressIndex] = result;
                            });
                        }
                      });
                    });
                  this.address.push(new AddressEntity());
                  this.createForm();
                  const addressMarker: MapMarkerEntity = new MapMarkerEntity();
                  addressMarker.isHidden = true;
                  this.addressForm.addControl('map' + this.addressIndex,
                    new FormControl(''));
                  this.markers.push(addressMarker);
                }
              },
            ).add(() => {
              //
              for (let i = 0; i < this.address.length; i++) {
                this.setValidationAdressForm(i);
              }
            });
          }
          );
        }
      } else {
        // Get Address Setting
        // Add customer
        if (checkOfflineMode()) {
          await this.dbService.getByKey('data', 'address-list').subscribe((address: any) => {
            if (address === undefined) {
              this.devToolsServices.openToast(3, 'No address list saved for offline use');
            } else {
              this.addressListEntity = address.data;
              this.addressListEntity.forEach(list => {
                // Get Addres List for Parent Id = 0
                if (list.parentAddressListID === 0) {
                  const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
                  addressSettingEntity.addressListId = list.addressListID;

                  this.dbService.getByKey('data', 'address-list-value-' + addressSettingEntity.addressListId).subscribe((value: any) => {
                    if (value === undefined) {
                      this.devToolsServices.openToast(3, `No address list value ${addressSettingEntity.addressListId} saved for offline use`);
                    } else {
                      this.addressListValue[this.addressIndex] = value.data;
                    }
                  });
                }
              });
            }
          });
        } else {
          this.customerAddressService.getAddressList(this.addressList).subscribe(
            (data) => {
              this.addressListEntity = data;
              this.addressListEntity.forEach(list => {
                // Get Addres List for Parent Id = 0
                if (list.parentAddressListID === 0) {
                  const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
                  addressSettingEntity.addressListId = list.addressListID;
                  this.customerAddressService.getAddressListValue(addressSettingEntity).subscribe(
                    (result) => {
                      if(result.length > 0){
                      this.addressListValue[this.addressIndex] = result;
                    }
                    });
                }
              });
            });
        }

        this.address.push(new AddressEntity());
        this.createForm();
      }
    } else {// mode Supplier
      this.address = [];
      this.selectedSupplier = this.sharedService.getSupplier();
      if ((this.selectedSupplier !== null || this.selectedSupplier !== undefined) && this.mode) {
        await this.customerAddressService.getAddressList(this.addressList).subscribe((data) => { this.addressListEntity = data; }).add(() => {

          // Get Address Setting
          this.address = this.selectedSupplier.listAddress;
          if (this.address == null)
            this.address = [];
          if (this.address.length > 0) {
            this.generateFormAddressForUpdateSupplier(this.address);
          }
        });
      } else {
        // Get Address Setting
        this.customerAddressService.getAddressList(this.addressList).subscribe(
          (data) => {
            this.addressListEntity = data;
            this.addressListEntity.forEach(list => {
              // Get Addres List for Parent Id = 0
              if (list.parentAddressListID === 0) {
                const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
                addressSettingEntity.addressListId = list.addressListID;
                this.customerAddressService.getAddressListValue(addressSettingEntity).subscribe(
                  (result) => {
                    this.addressListValue[this.addressIndex] = result;
                  });
              }
            });
          });

        this.address.push(new AddressEntity());
        this.createForm();
      }
    }

    // GET ADDRESS TYPE
    if (checkOfflineMode()) {
      await this.dbService.getByKey('data', 'address-type').subscribe((result: any) => {
        if (result === undefined) {
          this.devToolsServices.openToast(3, 'No address type saved for offline use');
        } else {
          this.addressType = result.data;
        }
      });
    } else {
      this.customerAddressService.getAddressType().subscribe(
        (data) => {
          this.addressType = data;
        }
      );
    }
    this.useGPS = false;
  }

  /**
   * Create Address Form
   */
  createForm() {
    if(this.mandatory){
      this.addressForm = this.formBuilder.group({
        addressType0: ['', customRequiredValidator],
        dateMovedIn0: [new Date().toISOString().substring(0, 10), customRequiredValidator],
        dateMoveOut0: [''],
        country0: ['', [customRequiredValidator,Validators.maxLength(ACMLengthConstants.country)]],
        region0: ['', [customRequiredValidator,Validators.maxLength(ACMLengthConstants.state)]],
        city0: ['', [customRequiredValidator,Validators.maxLength(ACMLengthConstants.townCity)]],
        district0: ['', [customRequiredValidator,Validators.maxLength(ACMLengthConstants.county)]],
        street0: ['', Validators.maxLength(ACMLengthConstants.address1)],
        buildingNumber0: ['', Validators.maxLength(ACMLengthConstants.address2)],
        unitNumber0: ['', Validators.maxLength(ACMLengthConstants.address3)],
        zipCode0: ['', [Validators.maxLength(ACMLengthConstants.postalCode)]],
        map0: ['']
      });
    }else{
      this.addressForm = this.formBuilder.group({
        addressType0: ['', customRequiredValidator],
        dateMovedIn0: [new Date().toISOString().substring(0, 10), customRequiredValidator],
        dateMoveOut0: [''],
        country0: ['', Validators.maxLength(ACMLengthConstants.country)],
        region0: ['', Validators.maxLength(ACMLengthConstants.state)],
        city0: ['', Validators.maxLength(ACMLengthConstants.townCity)],
        district0: ['', Validators.maxLength(ACMLengthConstants.county)],
        street0: ['', Validators.maxLength(ACMLengthConstants.address1)],
        buildingNumber0: ['', Validators.maxLength(ACMLengthConstants.address2)],
        unitNumber0: ['', Validators.maxLength(ACMLengthConstants.address3)],
        zipCode0: ['', Validators.maxLength(ACMLengthConstants.postalCode)],
        map0: ['']
      });
      // set validators to AddressForm fields
      this.setValidationAdressForm(0);
    }
  }

  /**
   *
   * @param index index
   */
  async setValidationAdressForm(index) {
    if (this.settingAddressAbacusEntities.length > 0) {
      this.settingAddressAbacusEntities.forEach((element) => {
        switch (element.addressField) {
          case 'Address1':
            if (element.required) {
              this.addressForm.controls['street' + index].setValidators(
                [Validators.required, Validators.maxLength(ACMLengthConstants.address1)]);
              this.requiredAddress1 = true;
            }
            break;
          case 'Address2':
            if (element.required) {
              this.addressForm.controls['buildingNumber' + index].setValidators(
                [Validators.required, Validators.maxLength(ACMLengthConstants.address2)]);
              this.requiredAddress2 = true;
            }
            break;
          case 'Address3':
            if (element.required) {
              this.addressForm.controls['unitNumber' + index].setValidators(
                [Validators.required, Validators.maxLength(ACMLengthConstants.address3)]);
              this.requiredAddress3 = true;
            }
            break;
          case 'Country':
            if (element.required) {
              this.addressForm.controls['country' + index].setValidators(
                [Validators.required, Validators.maxLength(ACMLengthConstants.country)]);
              this.requiredCountry = true;
            }
            break;
          case 'County':
            if (element.required) {
              this.addressForm.controls['district' + index].setValidators(Validators.required);
              this.requiredDistrict = true;
            }
            break;
          case 'PostalCode':
            if (element.required) {
              this.addressForm.controls['zipCode' + index].setValidators(Validators.required);
              this.requiredZipCode = true;
            }
            break;
          case 'State':
            if (element.required) {
              this.addressForm.controls['region' + index].setValidators(Validators.required);
              this.requiredRegion = true;
            }
            break;
          case 'TownCity':
            if (element.required) {
              this.addressForm.controls['city' + index].setValidators(Validators.required);
              this.requiredCity = true;
            }
            break;
          default:
            break;
        }
      });
    }
  }

  /**
   * Toggle Card
   */
  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  /**
   * add Address to From
   */
  addAddress() {
    const newAddress = new AddressEntity();
    newAddress.action = AcmConstants.ACTION_INSERT;
    this.address.push(newAddress);
    this.addressIndex++;
    this.addressForm.addControl('addressType' + (this.address.length - 1), new FormControl('', Validators.required));
    this.addressForm.addControl('dateMovedIn' + (this.address.length - 1), new FormControl(new Date().toISOString().substring(0, 10),
      Validators.required));
    this.addressForm.addControl('dateMoveOut' + (this.address.length - 1), new FormControl(''));
    this.addressForm.addControl('country' + (this.address.length - 1),
      new FormControl('', Validators.maxLength(ACMLengthConstants.country)));
    this.addressForm.addControl('region' + (this.address.length - 1), new FormControl('', Validators.maxLength(ACMLengthConstants.state)));
    this.addressForm.addControl('city' + (this.address.length - 1), new FormControl('', Validators.maxLength(ACMLengthConstants.townCity)));
    this.addressForm.addControl('district' + (this.address.length - 1),
      new FormControl('', Validators.maxLength(ACMLengthConstants.county)));
    this.addressForm.addControl('street' + (this.address.length - 1),
      new FormControl('', Validators.maxLength(ACMLengthConstants.address1)));
    this.addressForm.addControl('buildingNumber' + (this.address.length - 1), new FormControl('',
      Validators.maxLength(ACMLengthConstants.address2)));
    this.addressForm.addControl('unitNumber' + (this.address.length - 1), new FormControl('',
      Validators.maxLength(ACMLengthConstants.address3)));
    this.addressForm.addControl('zipCode' + (this.address.length - 1),
      new FormControl('', Validators.maxLength(ACMLengthConstants.postalCode)));
    this.addressForm.addControl('map' + (this.address.length - 1), new FormControl(this.latitude + ', ' + this.longitude));
    // set validation if exist
    this.setValidationAdressForm(this.addressIndex);
    this.customerAddressService.getAddressList(this.addressList).subscribe(
      (data) => {
        this.addressListEntity = data;
        this.addressListEntity.forEach(list => {
          if (list.parentAddressListID === 0) {
            const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
            addressSettingEntity.addressListId = list.addressListID;
            this.customerAddressService.getAddressListValue(addressSettingEntity).subscribe(
              (result) => {
                this.addressListValue[this.addressIndex] = result;
              }
            );
          }
        });
      });
    const addressMarker: MapMarkerEntity = new MapMarkerEntity();
    addressMarker.draggable = true;
    addressMarker.lat = this.latitude;
    addressMarker.lng = this.longitude;
    this.markers.push(addressMarker);
  }

  /**
   * Delete Address
   * @param i Index
   */
  deleteAddress(i: number) {
    if (this.markers[i])
    this.markers[i].isHidden = true;
    this.address[i].action = AcmConstants.ACTION_DELETE;
    // remove only the validators of the deleted addressFormControls because we need their values in  CustomerAddressComponent.OnSubmit()
    this.addressForm.controls['addressType' + i].clearValidators();
    this.addressForm.controls['dateMovedIn' + i].clearValidators();
    this.addressForm.controls['dateMoveOut' + i].clearValidators();
    this.addressForm.controls['country' + i].clearValidators();
    this.addressForm.controls['region' + i].clearValidators();
    this.addressForm.controls['city' + i].clearValidators();
    this.addressForm.controls['district' + i].clearValidators();
    this.addressForm.controls['street' + i].clearValidators();
    this.addressForm.controls['buildingNumber' + i].clearValidators();
    this.addressForm.controls['unitNumber' + i].clearValidators();
    this.addressForm.controls['zipCode' + i].clearValidators();
    this.addressForm.controls['map' + i].clearValidators();

    this.addressForm.controls['addressType' + i].setErrors(null);
    this.addressForm.controls['dateMovedIn' + i].setErrors(null);
    this.addressForm.controls['dateMoveOut' + i].setErrors(null);
    this.addressForm.controls['country' + i].setErrors(null);
    this.addressForm.controls['region' + i].setErrors(null);
    this.addressForm.controls['city' + i].setErrors(null);
    this.addressForm.controls['district' + i].setErrors(null);
    this.addressForm.controls['street' + i].setErrors(null);
    this.addressForm.controls['buildingNumber' + i].setErrors(null);
    this.addressForm.controls['unitNumber' + i].setErrors(null);
    this.addressForm.controls['zipCode' + i].setErrors(null);
    this.addressForm.controls['map' + i].setErrors(null);
    // if the deleted address is not already saved in DB and won't be sent to Back-End to be deleted
    // then remove it from this.address table
    if (this.address[i].id === null || this.address[i].id === undefined) {
      this.address[i].delete = true;
    }
  }

  /**
   * Load Data From BE
   * @param addressListID number
   * @param i number
   * @param field string
   * @param addressListValueID number
   */
  loadList(addressListID: number, i: number, field: string, addressListValueID: number , initialisation : boolean) {
    this.addressListEntity.forEach(list => {
      if (list.parentAddressListID === addressListID) {
        const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
        addressSettingEntity.addressListId = list.addressListID;
        if (!this.mode) {
          if (field === 'country' ) {
            this.addressForm.controls['region' + i].setValue('');
            this.addressForm.controls['city' + i].setValue('');
            this.addressForm.controls['district' + i].setValue('');
          }
          if (field === 'region' ) {
            this.addressForm.controls['city' + i].setValue('');
            this.addressForm.controls['district' + i].setValue('');
          }
          if (field === 'city' ) {
            this.addressForm.controls['district' + i].setValue('');
          }
        }
        else {
          if (field === 'country' && !this.addressForm.controls['country' + i].value) {
            this.addressForm.controls['region' + i].setValue('');
            this.addressForm.controls['city' + i].setValue('');
            this.addressForm.controls['district' + i].setValue('');
          }
          if (field === 'region' && !this.addressForm.controls['region' + i].value) {
            this.addressForm.controls['city' + i].setValue('');
            this.addressForm.controls['district' + i].setValue('');
          }
          if (field === 'city' && !this.addressForm.controls['city' + i].value) {
            this.addressForm.controls['district' + i].setValue('');
          }

          if (!initialisation) {
            if (field === 'country' ) {
              this.addressForm.controls['region' + i].setValue('');
              this.addressForm.controls['city' + i].setValue('');
              this.addressForm.controls['district' + i].setValue('');
            }
            if (field === 'region' ) {
              this.addressForm.controls['city' + i].setValue('');
              this.addressForm.controls['district' + i].setValue('');
            }
            if (field === 'city' ) {
              this.addressForm.controls['district' + i].setValue('');
            }
          }



        }


        if (addressListValueID === null) {
          addressSettingEntity.parentId = this.addressForm.controls[field + i].value.addressListValueID;
          this.changeAddress(i);
        } else {
          addressSettingEntity.parentId = addressListValueID;
        }

        if (checkOfflineMode()) {
         
          const list  = this.addressListOffline[addressSettingEntity.addressListId] as any;
          const result = list?.filter(address => { return address.parentAddressListValueID === addressSettingEntity.parentId});
          if (addressListValueID === null) {
            this.resetListAddress(addressListID, i);
          }
          result.forEach(value => {
            this.addressListValue[i].push(value);
          });
          if (!this.addressForm.controls['region' + i].value) {
            this.addressListValue[i] = this.addressListValue[i].filter(e=>e.addressListID !== 8);
            }
            if (!this.addressForm.controls['city' + i].value) {
              this.addressListValue[i] = this.addressListValue[i].filter(e=>e.addressListID !== 9);
              }

        } else {
          this.customerAddressService.getAddressListValue(addressSettingEntity).subscribe(
            (result) => {
              if (addressListValueID === null) {
                this.resetListAddress(addressListID, i);
              }
              result.forEach(value => {
                this.addressListValue[i].push(value);
              });
              if (!this.addressForm.controls['region' + i].value) {
                this.addressListValue[i] = this.addressListValue[i].filter(e=>e.addressListID !== 8);
                }
                if (!this.addressForm.controls['city' + i].value) {
                  this.addressListValue[i] = this.addressListValue[i].filter(e=>e.addressListID !== 9);
                  }
            }
          );
        }

      }
    });
  }

  /**
   * Reset List Data
   * @param addressListID number
   * @param index number
   */
  resetListAddress(addressListID: number, index: number) {
    let nextAddressListID = 0;
    const parents: number[] = [];
    while (nextAddressListID !== -1) {
      nextAddressListID = -1;
      for (let i = 0; i < this.addressListEntity.length; i++) {
        if (this.addressListEntity[i].parentAddressListID === addressListID) {
          parents.push(this.addressListEntity[i].addressListID);
          nextAddressListID = this.addressListEntity[i].addressListID;
        }
      }
      addressListID = nextAddressListID;
    }
    for (let i = 0; i < this.addressListValue[index].length; i++) {
      for (let j = 0; j < parents.length; j++) {
        if (this.addressListValue[index][i].addressListID === parents[j]) {
          this.addressListValue[index].splice(i, 1);
          i--;
        }
      }
    }

     if (!this.addressForm.controls['country' + index].value) {
      this.customerAddressService.getAddressList(this.addressList).subscribe(
        (data) => {
          this.addressListEntity = data;
          this.addressListEntity.forEach(list => {
            if (list.parentAddressListID === 0) {
              const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
              addressSettingEntity.addressListId = list.addressListID;
              this.customerAddressService.getAddressListValue(addressSettingEntity).subscribe(
                (result) => {
                  this.addressListValue[index] = result;
                });
            }
          });
        });
      }


  }

  OnSubmit() {
    let primary = 0;
    for (let i = 0; i < this.address.length; i++) {
      this.address[i].address1 = this.addressForm.controls['street' + i].value;
      this.address[i].address2 = this.addressForm.controls['buildingNumber' + i].value;
      this.address[i].address3 = this.addressForm.controls['unitNumber' + i].value;
      this.address[i].country = this.addressForm.controls['country' + i].value.name;
      this.address[i].countryId = this.addressForm.controls['country' + i].value.addressListValueID;
      this.address[i].county = this.addressForm.controls['district' + i].value.name;
      this.address[i].countyId = this.addressForm.controls['district' + i].value.addressListValueID;
      this.address[i].postalCode = this.addressForm.controls['zipCode' + i].value;
      this.address[i].state = this.addressForm.controls['region' + i].value.name;
      this.address[i].stateId = this.addressForm.controls['region' + i].value.addressListValueID;
      this.address[i].townCity = this.addressForm.controls['city' + i].value.name;
      this.address[i].townCityId = this.addressForm.controls['city' + i].value.addressListValueID;
      this.address[i].addressTypeId = this.addressForm.controls['addressType' + i].value.addressTypeID;
      this.address[i].dateMovedIn = this.addressForm.controls['dateMovedIn' + i].value;
      this.address[i].dateMovedOut = this.addressForm.controls['dateMoveOut' + i].value;
      this.address[i].isPrimary = this.addressForm.controls['addressType' + i].value.primaryAddressType;
      const cor: string = this.addressForm.controls['map' + i].value;
      this.address[i].lan = cor.substring(0, cor.indexOf(','));
      this.address[i].lng = cor.substring(cor.indexOf(' '), cor.length);
      if (!this.supplier) {
        if ((this.addressForm.controls['addressType' + i].value.primaryAddressType === 1
          || this.addressForm.controls['addressType' + i].value.primaryAddressType === true)
          && this.address[i].action !== AcmConstants.ACTION_DELETE) {
          primary++;
        }
      }
    }
    if (!this.supplier) {
      if (primary === 0) {
        this.devToolsServices.openToast(3, 'alert.address_no_primary');
        return null;
      } else if (primary > 1) {
        this.devToolsServices.openToast(3, 'alert.address_more_primary');
        return null;
      } else {
        this.submitAddress = [];
        this.submitAddress = this.address.filter(adr => adr.delete !== true);
        return this.submitAddress;
      }
      // Mode Supplier
    } else {
      if (this.addressForm.valid) {
        this.submitAddress = [];
        this.submitAddress = this.address.filter(adr => adr.delete !== true);
        return this.submitAddress;
      }
      else {
        if (primary === 0 || this.address[0].dateMovedIn == null || this.address[0].dateMovedIn == undefined) {
          this.devToolsServices.openToast(3, 'alert.address_no_primary');
          return null;
        }
      }
    }
  }

  /**
   * compare Address List Value
   * @param addressList1 Address List 1
   * @param addressList2 Address List 2
   */
  compareAddressListValue(addressList1, addressList2) {
    if (addressList1 !== undefined && addressList2 !== undefined) {
      return addressList1.name === addressList2.name && addressList1.addressListValueID === addressList2.addressListValueID;

    }
  }

  /**
   * compare Address Type
   * @param addressType1 Address Type 1
   * @param addressType2 Address Type 2
   */
  compareAddressType(addressType1, addressType2) {
    if (addressType1 !== undefined && addressType2 !== undefined) {
      return addressType1.addressTypeID === addressType2.addressTypeID;

    }
  }

  /**
   * detect form changes
   */
  changeFormAddress() {
    this.updateAddress.emit(false);
  }

  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      // Here we can get correct event
      console.log(e.latLng.lat(), e.latLng.lng());
      this.addressMarker.lat = e.latLng.lat();
      this.addressMarker.lng = e.latLng.lng();
      this.addressMarker.label = 'Address';
      this.addressMarker.draggable = true;

    });
  }

  /**
   * Action drage marker map
   * @param i number
   * @param $event google.map.mouseevent
   */
  markerDragEnd(i: number, $event) {
    this.changeAddress(i);
    this.addressForm.controls['map' + i].setValue($event.latLng.lat() + ', ' + $event.latLng.lng());
  }

  /**
   * change GPS Location
   * @param i number
   */
  loadMarkerMap(i: number) {
    this.useGPS = true;
    this.changeAddress(i);
    if (this.markers.length) {
      const cor: string = this.addressForm.controls['map' + i].value;
      const lat = cor.substring(0, cor.indexOf(','));
      const lng = cor.substring(cor.indexOf(' '), cor.length);
      this.markers = [];
      const addressMarker: MapMarkerEntity = new MapMarkerEntity();
      addressMarker.draggable = true;
      addressMarker.lat = this.latitude = +lat;
      addressMarker.lng = this.longitude = +lng;
      this.markers[i] = addressMarker;
      this.zoom = 8;
    }else{
      const addressMarker: MapMarkerEntity = new MapMarkerEntity();
      addressMarker.draggable = true;
      addressMarker.lat = this.latitude;
      addressMarker.lng = this.longitude;
      this.markers[i] = addressMarker;
      this.zoom = 8;
    }
  }

  /**
   * get current place
   * @param i number
   */
  getCurrentPlace(i: number) {
    if(!this.useGPS){
      this.useGPS = true;
      // this.getAddress();
    }
    const addressMarker: MapMarkerEntity = new MapMarkerEntity();
    addressMarker.draggable = true;
    this.mapsAPILoader.load().then(() => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.changeAddress(i);
          addressMarker.lat = this.latitude = position.coords.latitude;
          addressMarker.lng = this.longitude = position.coords.longitude;
          this.zoom = 8;
          this.displayMap = true;
          this.markers = [];
          this.markers[i] = addressMarker;
          this.addressForm.controls['map' + i].setValue(this.latitude + ', ' + this.longitude);
          // this.getAddress(this.latitude, this.longitude);
        })}});

  }
  showMap(i: number){
    if(!this.useGPS){
      this.loadMarkerMap(i)
    }
    this.displayMap = !this.displayMap;
  }

  /**
   * change Action Address
   * @param i number
   */
  changeAddress(i: number) {
    // if there is no address for the customer from the begining,a new addressEntity() will be inserted with action = undefined
    if (this.address[i].action === undefined) {
      this.address[i].action = AcmConstants.ACTION_INSERT;
    }
    // else
    if (this.address[i].action !== AcmConstants.ACTION_INSERT) {
      this.address[i].action = AcmConstants.ACTION_UPDATE;
    }
  }
  /**
   * generate form address (Edit)
   * @param addressList AddressEntity
   */
  generateFormAddressForUpdate(addressList: AddressEntity[]) {
    this.address = [];
    for (let i = 0; i < addressList.length; i++) {
      this.addressIndex = i;
      this.address.push(addressList[i]);
      this.addressListValue[i] = [];
      const addressType: AddressTypeEntity = new AddressTypeEntity();
      addressType.addressTypeID = addressList[i].addressTypeId;
      addressType.primaryAddressType = addressList[i].isPrimary;
      this.addressForm.addControl('addressType' + this.addressIndex, new FormControl(addressType, Validators.required));

      const country: AddressListEntity = new AddressListEntity();
      country.addressListID = this.addressListEntity[0].addressListID;
      country.addressListValueID = addressList[i].countryId;
      country.name = addressList[i].country;
      this.addressForm.addControl('country' + this.addressIndex,
        new FormControl(country, [customRequiredValidator,Validators.maxLength(ACMLengthConstants.country)]));

      const region: AddressListEntity = new AddressListEntity();
      region.addressListID = this.addressListEntity[1].addressListID;
      region.addressListValueID = addressList[i].stateId;
      region.name = addressList[i].state;
      this.addressForm.addControl('region' + this.addressIndex,
        new FormControl(region, [customRequiredValidator,Validators.maxLength(ACMLengthConstants.region)]));

      const city: AddressListEntity = new AddressListEntity();
      city.addressListID = this.addressListEntity[2].addressListID;
      city.addressListValueID = addressList[i].townCityId;
      city.name = addressList[i].townCity;
      this.addressForm.addControl('city' + this.addressIndex,
        new FormControl(city, [customRequiredValidator,Validators.maxLength(ACMLengthConstants.state)]));

      const district: AddressListEntity = new AddressListEntity();
      district.addressListID = this.addressListEntity[3].addressListID;
      district.addressListValueID = addressList[i].countyId;
      district.name = addressList[i].county;
      this.addressForm.addControl('district' + this.addressIndex,
        new FormControl(district, [customRequiredValidator,Validators.maxLength(ACMLengthConstants.townCity)]));
      // Input
      this.addressForm.addControl('street' + this.addressIndex,
        new FormControl(addressList[i].address1,
          Validators.maxLength(ACMLengthConstants.address1)));
      this.addressForm.addControl('buildingNumber' + this.addressIndex,
        new FormControl(addressList[i].address2,
          Validators.maxLength(ACMLengthConstants.address2)));
      this.addressForm.addControl('unitNumber' + this.addressIndex,
        new FormControl(addressList[i].address3,
          Validators.maxLength(ACMLengthConstants.address3)));
      this.addressForm.addControl('zipCode' + this.addressIndex,
        new FormControl(addressList[i].postalCode,
          Validators.maxLength(ACMLengthConstants.postalCode)));
      let dateMovedInValid: string;
      if (addressList[i].dateMovedIn != null) {
        dateMovedInValid = new Date(addressList[i].dateMovedIn).toISOString().substring(0, 10);
      } else {
        dateMovedInValid = '';
      }
      this.addressForm.addControl('dateMovedIn' + this.addressIndex,
        new FormControl(dateMovedInValid,
          Validators.required));

      let dateMovedOutValid: string;
      if (addressList[i].dateMovedOut != null && addressList[i].dateMovedOut !== '' ) {
        dateMovedOutValid = new Date(addressList[i].dateMovedOut).toISOString().substring(0, 10);
      } else {
        dateMovedOutValid = '';
      }
      this.addressForm.addControl('dateMoveOut' + this.addressIndex,
        new FormControl(dateMovedOutValid));

      const addressMarker: MapMarkerEntity = new MapMarkerEntity();
      if (addressList[i].lan !== null && addressList[i].lng) {
        this.addressForm.addControl('map' + this.addressIndex,
          new FormControl(addressList[i].lan + ', ' + addressList[i].lng));
        addressMarker.draggable = true;
        addressMarker.lat = +addressList[i].lan;
        addressMarker.lng = +addressList[i].lng;
      } else {
        addressMarker.isHidden = true;
        this.addressForm.addControl('map' + this.addressIndex,
          new FormControl(''));
      }
      this.markers.push(addressMarker);
      // Reload List Address
      // tslint:disable-next-line:max-line-length
      this.loadList(this.addressListEntity[0].parentAddressListID, i, 'country', this.addressListEntity[0].parentAddressListID, true);
      this.loadList(this.addressListEntity[0].addressListID, i, 'region', addressList[i].countryId, true);
      this.loadList(this.addressListEntity[1].addressListID, i, 'city', addressList[i].stateId, true);
      this.loadList(this.addressListEntity[2].addressListID, i, 'district', addressList[i].townCityId, true);
      // when load address page OR when get the address from the response of  UpdateForApplication => set action of all address to null
      this.address[i].action = null;
    }
  }
  // mode Supplier
  generateFormAddressForUpdateSupplier(addressList: AddressEntity[]) {
    this.address = [];
    for (let i = 0; i < addressList.length; i++) {
      this.addressIndex = i;
      this.address.push(addressList[i]);
      this.addressListValue[i] = [];
      const addressType: AddressTypeEntity = new AddressTypeEntity();
      addressType.addressTypeID = addressList[i].addressTypeId;
      addressType.primaryAddressType = addressList[i].isPrimary;
      this.addressForm.addControl('addressType' + this.addressIndex, new FormControl(addressType, Validators.required));

      const country: AddressListEntity = new AddressListEntity();
      country.addressListID = this.addressListEntity[0].addressListID;
      country.addressListValueID = addressList[i].countryId;
      country.name = addressList[i].country;
      this.addressForm.addControl('country' + this.addressIndex,
        new FormControl(country));

      const region: AddressListEntity = new AddressListEntity();
      region.addressListID = this.addressListEntity[1].addressListID;
      region.addressListValueID = addressList[i].stateId;
      region.name = addressList[i].state;
      this.addressForm.addControl('region' + this.addressIndex,
        new FormControl(region));

      const city: AddressListEntity = new AddressListEntity();
      city.addressListID = this.addressListEntity[2].addressListID;
      city.addressListValueID = addressList[i].townCityId;
      city.name = addressList[i].townCity;
      this.addressForm.addControl('city' + this.addressIndex,
        new FormControl(city));

      const district: AddressListEntity = new AddressListEntity();
      district.addressListID = this.addressListEntity[3].addressListID;
      district.addressListValueID = addressList[i].countyId;
      district.name = addressList[i].county;
      this.addressForm.addControl('district' + this.addressIndex,
        new FormControl(district));
      // Input
      this.addressForm.addControl('street' + this.addressIndex,
        new FormControl(addressList[i].address1,
          Validators.maxLength(ACMLengthConstants.address1)));
      this.addressForm.addControl('buildingNumber' + this.addressIndex,
        new FormControl(addressList[i].address2,
          Validators.maxLength(ACMLengthConstants.address2)));
      this.addressForm.addControl('unitNumber' + this.addressIndex,
        new FormControl(addressList[i].address3,
          Validators.maxLength(ACMLengthConstants.address3)));
      this.addressForm.addControl('zipCode' + this.addressIndex,
        new FormControl(addressList[i].postalCode,
          Validators.maxLength(ACMLengthConstants.postalCode)));
      let dateMovedInValid: string;
      if (addressList[i].dateMovedIn != null) {
        dateMovedInValid = new Date(addressList[i].dateMovedIn).toISOString().substring(0, 10);
      } else {
        dateMovedInValid = '';
      }
      this.addressForm.addControl('dateMovedIn' + this.addressIndex,
        new FormControl(dateMovedInValid,
          Validators.required));

      let dateMovedOutValid: string;
      if (addressList[i].dateMovedOut != null) {
        dateMovedOutValid = new Date(addressList[i].dateMovedOut).toISOString().substring(0, 10);
      } else {
        dateMovedOutValid = '';
      }
      this.addressForm.addControl('dateMoveOut' + this.addressIndex,
        new FormControl(dateMovedOutValid));

      const addressMarker: MapMarkerEntity = new MapMarkerEntity();
      if (addressList[i].lan !== null && addressList[i].lng) {
        this.addressForm.addControl('map' + this.addressIndex,
          new FormControl(addressList[i].lan + ', ' + addressList[i].lng));
        addressMarker.draggable = true;
        addressMarker.lat = +addressList[i].lan;
        addressMarker.lng = +addressList[i].lng;
      } else {
        addressMarker.isHidden = true;
        this.addressForm.addControl('map' + this.addressIndex,
          new FormControl(''));
      }
      this.markers.push(addressMarker);
      // Reload List Address
      // tslint:disable-next-line:max-line-length
      this.loadList(this.addressListEntity[0].parentAddressListID, i, 'country', this.addressListEntity[0].parentAddressListID, true);
      this.loadList(this.addressListEntity[0].addressListID, i, 'region', addressList[i].countryId, true);
      this.loadList(this.addressListEntity[1].addressListID, i, 'city', addressList[i].stateId, true);
      this.loadList(this.addressListEntity[2].addressListID, i, 'district', addressList[i].townCityId, true);
      // when load address page OR when get the address from the response of  UpdateForApplication => set action of all address to null
      this.address[i].action = null;
    }
  }
  setAddress(addressList: AddressEntity[]) {
    this.addressForm = this.formBuilder.group({});
    this.generateFormAddressForUpdate(addressList);
    for (let i = 0; i < this.address.length; i++) {
      this.setValidationAdressForm(i);
    }
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
}
