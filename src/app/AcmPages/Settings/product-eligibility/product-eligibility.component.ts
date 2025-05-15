import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SettingsService } from '../settings.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { SettingProductEligibilityEntity } from 'src/app/shared/Entities/SettingProductEligibility.entity';
import { SettingProductEligibilityService } from './product-eligibility.service';
import { CustomerAddressService } from '../../Customer/customer-address/customer-address.service';
import { AddressSettingEntity } from 'src/app/shared/Entities/AddressSetting.entity';
import {customRequiredValidator} from '../../../shared/utils';
const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-product-eligibility',
  templateUrl: './product-eligibility.component.html',
  styleUrls: ['./product-eligibility.component.sass']
})
export class ProductEligibilityComponent implements OnInit {
  @Input() productEntity: ProductEntity;
  @Input() isEditMode: boolean;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public checkChangedValues = false;
  public eligibilityForm: FormGroup;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: PrimaryBleu };
  public loading = true;
  public settingProductEligibility: SettingProductEligibilityEntity = new SettingProductEligibilityEntity();
  public regionList: string[] = [];
  public genders: string[] = [];
  public submitted = false;
  
  

  constructor(public translate: TranslateService, public settingsService: SettingsService,
    public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices, public settingProductEligibilityService: SettingProductEligibilityService,
    public settingService: SettingsService, public customerAddressService: CustomerAddressService, private cdRef: ChangeDetectorRef) { }


  ngOnChanges(changes: SimpleChanges) {
    this.loadRegion();
    this.eligibilityForm.markAsPristine();
  }

  ngOnInit() {
    this.createForm();
    this.loadRegion();
  }

  getProductEligibility() {
    if (this.productEntity.settingProductEligibility) {
      this.settingProductEligibility = this.productEntity.settingProductEligibility;
      this.eligibilityForm.controls.isMale.setValue(this.settingProductEligibility.gender.includes('M'));
      this.eligibilityForm.controls.isFemale.setValue(this.settingProductEligibility.gender.includes('F'));
      this.eligibilityForm.controls.maxContinuousLateDays.setValue(this.settingProductEligibility.maxContinuousLateDays);
      this.eligibilityForm.controls.maxSeparateLateDays.setValue(this.settingProductEligibility.maxSeparateLateDays);
      this.eligibilityForm.controls.minFixedLoanAmount.setValue(this.settingProductEligibility.minFixedLoanAmount);
      this.eligibilityForm.controls.minLoanAmountPercantage.setValue(this.settingProductEligibility.minLoanAmountPercantage);
      this.eligibilityForm.controls.minPreviouslyIssuedLoansNumber.setValue(this.settingProductEligibility.minPreviouslyIssuedLoansNumber);
      let regions: string[] = [];
      if (this.settingProductEligibility.region.includes(',')) {
        regions = this.settingProductEligibility.region.split(',');
      }
      else {
        regions.push(this.settingProductEligibility.region);
      }
      this.eligibilityForm.controls.region.setValue(regions);
    } else {
      this.settingProductEligibility = new SettingProductEligibilityEntity();
      this.eligibilityForm.reset();
      this.eligibilityForm.markAsPristine();
      this.checkChangedValues = false;
    }
    this.loading = false;
  }

  onSubmit() {
    this.submitted = true;
    this.settingProductEligibility.productId = this.productEntity.id;
    this.genders = [];
    this.eligibilityForm.value.isMale ? this.genders.push('M') : null ;
    this.eligibilityForm.value.isFemale ? this.genders.push('F') : null ;
    this.settingProductEligibility.gender = this.genders.join(",");
    this.settingProductEligibility.maxContinuousLateDays = this.eligibilityForm.value.maxContinuousLateDays;
    this.settingProductEligibility.maxSeparateLateDays = this.eligibilityForm.value.maxSeparateLateDays;
    this.settingProductEligibility.minFixedLoanAmount = this.eligibilityForm.value.minFixedLoanAmount;
    this.settingProductEligibility.minLoanAmountPercantage = this.eligibilityForm.value.minLoanAmountPercantage;
    this.settingProductEligibility.minPreviouslyIssuedLoansNumber = this.eligibilityForm.value.minPreviouslyIssuedLoansNumber;
    this.settingProductEligibility.region = this.eligibilityForm.value.region.join(',');
    if (this.eligibilityForm.valid) {
      this.productEntity.settingProductEligibility = this.settingProductEligibility;
      if (this.settingProductEligibility.id) {
        this.settingService.updateProduct(this.productEntity).subscribe(() => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.checkChangedValues = false;
          this.submitted = false;
          this.eligibilityForm.markAsPristine();
        });
      } else {
        this.settingProductEligibilityService.createSettingProductEligibility(this.settingProductEligibility).subscribe((data) => {
          this.settingProductEligibility = data;
          this.devToolsServices.openToast(0, 'alert.success');
          this.checkChangedValues = false;
          this.submitted = false;
          this.eligibilityForm.markAsPristine();
        });
      }
    }
  }
  createForm() {
    this.eligibilityForm = this.formBuilder.group({
      isFemale: [false],
      isMale: [false],
      maxContinuousLateDays: ['', [customRequiredValidator, Validators.min(0)]],
      maxSeparateLateDays: ['', [customRequiredValidator, Validators.min(0)]],
      region: ['', customRequiredValidator],
      minFixedLoanAmount: ['', [customRequiredValidator, Validators.min(0)]],
      minLoanAmountPercantage: ['', [customRequiredValidator, Validators.min(0), Validators.max(100)]],
      minPreviouslyIssuedLoansNumber: ['', [customRequiredValidator, Validators.min(0)]]
    }, { validators: this.requireCheckboxes });
  }

  loadRegion() {
    let pays;
    const addressSettingEntityPays: AddressSettingEntity = new AddressSettingEntity();
    addressSettingEntityPays.addressListId = 1;
    this.customerAddressService.getAddressListValue(addressSettingEntityPays).toPromise().then(
      (result) => {
        pays = result[0];
      });

    const addressSettingEntityRegion: AddressSettingEntity = new AddressSettingEntity();
    addressSettingEntityRegion.addressListId = 2;
    addressSettingEntityRegion.parentId = pays?.addressListValueID;

    this.customerAddressService.getAddressListValue(addressSettingEntityRegion).toPromise().then(
      (result) => {
        this.regionList = [];
        for (const item of result) {
          this.regionList.push(item.name);
        }
        this.getProductEligibility();
    });
  }
  requireCheckboxes(control: AbstractControl): ValidationErrors | null {
    const isFemaleChecked = control.get('isFemale').value;
    const isMaleChecked = control.get('isMale').value;

    // Check if at least one checkbox is checked
    if (!isFemaleChecked && !isMaleChecked) {
      return { requireCheckboxes: true };
    }
    return null;
  }
  enableDisable(field: string) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_filtert').afterClosed().subscribe(res => {
      if (res) {
        this.settingProductEligibilityService.updateSettingProductEligibility(this.settingProductEligibility).subscribe();
      } else {
        this[field] = !this[field];
        this.settingProductEligibility[field] = !this.settingProductEligibility[field];
      }
    });
  }

  // Expose local state to the parent
  getUpdatedData() {
    this.submitted = true;
    this.settingProductEligibility.productId = this.productEntity.id;
    this.genders = [];
    this.eligibilityForm.value.isMale ? this.genders.push('M') : null ;
    this.eligibilityForm.value.isFemale ? this.genders.push('F') : null ;
    this.settingProductEligibility.gender = this.genders.join(",");
    this.settingProductEligibility.maxContinuousLateDays = this.eligibilityForm.value.maxContinuousLateDays;
    this.settingProductEligibility.maxSeparateLateDays = this.eligibilityForm.value.maxSeparateLateDays;
    this.settingProductEligibility.minFixedLoanAmount = this.eligibilityForm.value.minFixedLoanAmount;
    this.settingProductEligibility.minLoanAmountPercantage = this.eligibilityForm.value.minLoanAmountPercantage;
    this.settingProductEligibility.minPreviouslyIssuedLoansNumber = this.eligibilityForm.value.minPreviouslyIssuedLoansNumber;
    this.settingProductEligibility.region = this.eligibilityForm.value.region.join(',');

    if(Object.values(this.settingProductEligibility).some(value => value !== null && value !== undefined && value !== "")) {
      return {
        settingProductEligibility: this.settingProductEligibility
      };
    }
  }
}