import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SettingsService } from '../settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { GroupePaginationEntity } from 'src/app/shared/Entities/groupePagination.entity';
import {MatDialog} from '@angular/material/dialog';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { CustomerAddressService } from '../../Customer/customer-address/customer-address.service';
import { AddressSettingEntity } from 'src/app/shared/Entities/AddressSetting.entity';
import { AddressListEntity } from 'src/app/shared/Entities/AddressList.entity';
import { AddressTypeEntity } from 'src/app/shared/Entities/AddressType.entity';
const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-setting-address',
  templateUrl: './setting-address.component.html',
  styleUrls: ['./setting-address.component.sass']
})
export class SettingAddressComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('modalTypeContent', { static: true }) modalTypeContent: TemplateRef<any>;
  public addressForm: FormGroup;
  public typeForm: FormGroup;

  loading: boolean;
  update: boolean = false;
  public groupePaginationEntity: GroupePaginationEntity = new GroupePaginationEntity();
  public cols: any[];
  public settingValueCols: any[];
  public selectedColumns: any[];
  public settingValueSelectedColumns: any[];
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  addressListEntity: AddressListEntity[] = [];
  addressListValue: AddressListEntity[][] = [[]];
  addressList: string[] = [];
  addressIndex = 0;
  selectedCountry: any;
  selectedRegion: any;
  selectedCity: any;
  selectedDistrict: any;
  selectedLevel: string = '';
  addressType: AddressTypeEntity[] = [];



  /**
   * constructor
   * @param modal NgbModal
   * @param router Router
   * @param dialog MatDialog
   * @param settingsService SettingsService
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService
   * @param library FaIconLibrary
   */
  constructor(public modal: NgbModal, public router: Router, public dialog: MatDialog,private cdr: ChangeDetectorRef,
              public settingsService: SettingsService, public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices,
              public translate: TranslateService,public library: FaIconLibrary,public customerAddressService: CustomerAddressService
              ) {

  }
  ngOnInit() {
    this.cols = [
      { field: 'Country', header: 'setting.Country' },
      { field: 'Region', header: 'setting.Region' },
      { field: 'City', header: 'setting.City' },
      { field: 'District', header: 'setting.District' }

    ];

    this.settingValueCols = [
      { field: 'Type', header: 'setting.Type' },
      { field: 'Primary', header: 'setting.Primary' }
    ];

    // init pagination params
    this.selectedColumns = this.cols;
    this.settingValueSelectedColumns = this.settingValueCols;

    this.customerAddressService.getAddressList(this.addressList).subscribe(
      (data) => {
        this.addressListEntity = data;
        this.addressListEntity.forEach(list => {
          if (list.parentAddressListID === 0) {
            const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
            addressSettingEntity.addressListId = list.addressListID;
            this.customerAddressService.getAddressAllListValue(addressSettingEntity).subscribe(
              (result) => {
                if(result.length > 0){
                this.addressListValue[this.addressIndex] = result;
              }
              });
          }
        });
      });

      this.customerAddressService.getAllAddressType().subscribe(
        (data) => {
          this.addressType = data;
        }
      );
  }
  /**
   * Methode to create form
   */
  createForm() {
    this.addressForm = this.formBuilder.group({
      parentId: [0],
      addressListId: [0],
      tableAbacusName: [''],
      idExtern: [0],
      name: [''],
      valueJson: [''],
      enabled: [true]
    });
  }

  createFormType() {
    this.typeForm = this.formBuilder.group({
      addressTypeID: [0],
      name: [''],
      primaryAddressType: [0],
      enabled: [true]
    });
  }
  /**
   * Methode addGroup
   */
  addAddress(): void {
    this.update = false;
    this.clearForm();
    this.createForm();
    this.modal.open(this.modalContent, { size: 'md' });
  }

  addType(): void {
    this.update = false;
    this.clearFormType();
    this.createFormType();
    this.modal.open(this.modalTypeContent, { size: 'md' });
  }
  onSelectionChange(value: string): void {
    this.selectedLevel = value;
      this.selectedCountry = '';
      this.selectedRegion = '';
      this.selectedCity = '';
      this.selectedDistrict = '';
  }


  onSubmit() {
    if (this.addressForm.valid) {
      const setAddressDetails = (parentId: number, tableAbacusName: string, addressListID: number) => {
        this.addressForm.controls.parentId.setValue(parentId);
        this.addressForm.controls.tableAbacusName.setValue(tableAbacusName);
        this.addressForm.controls.addressListId.setValue(addressListID);
      };
  
      if (!this.update) {
        const addressDetails = {
          Country: () => setAddressDetails(0, 'AddressListValue', this.addressListEntity.find(item => item.name.includes('Country')).addressListID),
          Region: () => setAddressDetails(this.selectedCountry.addressListValueID, 'AddressListValue', this.addressListEntity.find(item => item.name.includes('Region')).addressListID),
          City: () => setAddressDetails(this.selectedRegion.addressListValueID, 'AddressListValue', this.addressListEntity.find(item => item.name.includes('City')).addressListID),
          District: () => setAddressDetails(this.selectedCity.addressListValueID, 'AddressListValue', this.addressListEntity.find(item => item.name.includes('District')).addressListID),
        };
  
        addressDetails[this.selectedLevel]?.();
        this.addressForm.controls.idExtern.setValue(Date.now());
      } else {
        const addressDetails = {
          Country: () => setAddressDetails(0, 'AddressListValue', this.addressListEntity.find(item => item.name.includes('Country')).addressListID),
          Region: () => setAddressDetails(this.selectedCountry.addressListValueID, 'AddressListValue', this.addressListEntity.find(item => item.name.includes('Region')).addressListID),
          City: () => setAddressDetails(this.selectedRegion.addressListValueID, 'AddressListValue', this.addressListEntity.find(item => item.name.includes('City')).addressListID),
          District: () => setAddressDetails(this.selectedCity.addressListValueID, 'AddressListValue', this.addressListEntity.find(item => item.name.includes('District')).addressListID),
        };
  
        addressDetails[this.selectedLevel]?.();
      }
  
      const valueJsonObject = {
        addressListValueID: this.addressForm.controls.idExtern.value,
        name: this.addressForm.controls.name.value,
        addressListID: this.addressForm.controls.addressListId.value,
        parentAddressListValueID: this.addressForm.controls.parentId.value,
        code: '0',
        cUAccountPortfolioId: 0
      };
  
      let valueJsonString = JSON.stringify(valueJsonObject, null, 0);
      this.addressForm.controls.valueJson.setValue(valueJsonString);
  
      const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
      addressSettingEntity.valueJson = this.addressForm.controls.valueJson.value;
      addressSettingEntity.idExtern = this.addressForm.controls.idExtern.value;
      addressSettingEntity.parentId = this.addressForm.controls.parentId.value;
      addressSettingEntity.tableAbacusName = this.addressForm.controls.tableAbacusName.value;
      addressSettingEntity.addressListId = this.addressForm.controls.addressListId.value;
  
      const saveOrUpdate = this.update
        ? this.customerAddressService.updateAdresseSetting(addressSettingEntity)
        : this.customerAddressService.saveAdresseSetting(addressSettingEntity);
  
      saveOrUpdate.subscribe((result) => {
        const selectedLevelKey = this.selectedLevel.toLowerCase();
        this[`selected${this.selectedLevel}`] = result;
        const index = this.addressListValue[0].findIndex(
          (item) => item.addressListValueID === result.addressListValueID
        );
        if (index !== -1) {
          this.addressListValue[0].splice(index, 1);
        }
        this.addressListValue[0].push(result);
        this.loadList(result, this.selectedLevel);
        this.closeModale();
      });
    }
  }
  
  /**
   * Methode editEvent
   * @param groupeEntity GroupeEntity
   */
  editAddress(address: any): void {
    this.update = true;
    this.createForm();
  
    const levels = [
      { level: 'Country', selected: this.selectedCountry, nameKey: 'nameCountry' },
      { level: 'Region', selected: this.selectedRegion, nameKey: 'nameRegion' },
      { level: 'City', selected: this.selectedCity, nameKey: 'nameCity' },
      { level: 'District', selected: this.selectedDistrict, nameKey: 'nameDistrict' },
    ];
  
    for (const { level, selected, nameKey } of levels) {
      if (selected) {
        this.selectedLevel = level;
        this.addressForm.controls.idExtern.setValue(selected.addressListValueID);
        this.addressForm.controls.parentId.setValue(selected.parentAddressListValueID);
        this.addressForm.controls.name.setValue(address[nameKey]);
      }
    }
  
    this.modal.open(this.modalContent, { size: 'md' });
  }
  



  enableDisable() {
    let selection;
    const levels = ['District', 'City', 'Region', 'Country'];
      for (const level of levels) {
      if (this[`selected${level}`]) {
        selection = this[`selected${level}`];
        break;  
      }
    }
  
    if (selection) {
      const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
      addressSettingEntity.idExtern = selection.addressListValueID;
      addressSettingEntity.enabled = selection.enabled;
      this.devToolsServices
        .openConfirmDialogWithoutRedirect('confirmation_dialog.disable_environnemet')
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            this.customerAddressService.deleteAdresseSetting(addressSettingEntity).subscribe();
            const selectedLevel = levels.find(level => this[`selected${level}`] === selection);
  
            if (selectedLevel) {
              const index = this.addressListValue[0].findIndex(
                (item) => item.addressListValueID === selection.addressListValueID
              );
              if (index !== -1) {
                this.addressListValue[0].splice(index, 1);
              }
              selection.enabled = !selection.enabled;
              this.addressListValue[0].push(selection);
              this.loadList(selection, this.selectedLevel);
              
            }
          }
        });
    }
  }
  

  enableDisableType(type: any) {
    

    this.devToolsServices
        .openConfirmDialogWithoutRedirect('confirmation_dialog.disable_environnemet')
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            this.customerAddressService.deleteTypeAdresseSetting(type).subscribe();
          }
        });
  }

  editType(addressType: any): void {
    this.update = true;
    this.createFormType();
        this.typeForm.controls.addressTypeID.setValue(addressType.addressTypeID);
        this.typeForm.controls.primaryAddressType.setValue(addressType.primaryAddressType);
        this.typeForm.controls.name.setValue(addressType.name);
        this.typeForm.controls.enabled.setValue(addressType.enabled);
        this.modal.open(this.modalTypeContent, { size: 'md' });
  }

  /**
   * Methode clearForm
   */
  clearForm() {
    this.addressForm = this.formBuilder.group({
      parentId: [''],
      addressListId: [''],
      tableAbacusName: [''],
      idExtern: [''],
      valueJson: ['']
    });
  }

  clearFormType() {
    this.typeForm = this.formBuilder.group({
      addressTypeID: [0],
      name: [''],
      primaryAddressType: [0],
      enabled: [true]
    });
  }

  closeModale() {
    this.modal.dismissAll();
    this.clearForm();
    this.selectedLevel = '';
  }


  closeModaleType() {
    this.modal.dismissAll();
    this.clearFormType();
  }
 
  reset() {
    this.modal.dismissAll();
    this.clearForm();
    this.selectedCountry = '';
    this.selectedRegion = '';
    this.selectedCity = '';
    this.selectedDistrict = '';
    this.selectedLevel = '';
  }

  resetType() {
    this.modal.dismissAll();
    this.clearFormType();
  }
  

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }




  

  loadList( selectedAddress: AddressListEntity, field: any) {
      if (selectedAddress) {
        if (field === 'Country') {
          this.selectedRegion = null;
          this.selectedCity = null;
          this.selectedDistrict = null;
        }
        if (field === 'Region' ) {
          this.selectedCity = null;
          this.selectedDistrict = null;
        }
        if (field === 'City' ) {
          this.selectedDistrict = null;
        }
        const foundEntity = this.addressListEntity.find(entity => entity.parentAddressListID === selectedAddress.addressListID);
        const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
        addressSettingEntity.addressListId = foundEntity?.addressListID ?? null;
        addressSettingEntity.parentId = selectedAddress.addressListValueID;
          this.customerAddressService.getAddressAllListValue(addressSettingEntity).subscribe(
            (result) => {
              result.forEach(value => {
                if (!this.addressListValue[0].some(existing => existing.addressListValueID === value.addressListValueID)) {
                  this.addressListValue[0].push(value);
                }
              });
            }
          );
    }
  }


  

  getFilteredList() {
    const locationDetails: any = {
      nameCountry: this.selectedCountry?.name || '---',
      nameRegion: this.selectedRegion?.name || '---',
      nameCity: this.selectedCity?.name || '---',
      nameDistrict: this.selectedDistrict?.name || '---'
    };
    if (this.selectedDistrict) {
      locationDetails.isEnabled = this.selectedDistrict.enabled;
    }else if (this.selectedCity) {
      locationDetails.isEnabled = this.selectedCity.enabled;
    }else if (this.selectedRegion) {
      locationDetails.isEnabled = this.selectedRegion.enabled;
    }else if (this.selectedCountry) {
      locationDetails.isEnabled = this.selectedCountry.enabled;
    }
    return this.selectedCountry ? [locationDetails] : [];
  }

  onSubmitType(){
    if (this.typeForm.valid) {
      if (!this.update) {
        this.typeForm.controls.addressTypeID.setValue(Date.now());
      }
    
      const valueJsonObject = {
        addressTypeID: this.typeForm.controls.addressTypeID.value,
        name: this.typeForm.controls.name.value,
        primaryAddressType: this.typeForm.controls.primaryAddressType.value ? 1 : 0,
      };
  
      let valueJsonString = JSON.stringify(valueJsonObject, null, 0);
      const addressSettingEntity: AddressSettingEntity = new AddressSettingEntity();
      addressSettingEntity.valueJson = valueJsonString;
      addressSettingEntity.idExtern = this.typeForm.controls.addressTypeID.value;
      addressSettingEntity.parentId = null;
      addressSettingEntity.tableAbacusName = 'AddressType';
      addressSettingEntity.addressListId = 0;
      const saveOrUpdate = this.update
        ? this.customerAddressService.updateAdresseSetting(addressSettingEntity)
        : this.customerAddressService.saveAdresseSetting(addressSettingEntity);

      saveOrUpdate.subscribe((result) => {
        this.customerAddressService.getAllAddressType().subscribe(
          (data) => {
            this.addressType = data;
            this.closeModaleType();
          }
        );
      });
    }
  }
  
}
