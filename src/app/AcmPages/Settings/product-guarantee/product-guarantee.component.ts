import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CustomerAddressService } from '../../Customer/customer-address/customer-address.service';
import { SettingsService } from '../settings.service';
import { customRequiredValidator } from 'src/app/shared/utils';
import { SettingProductGuarantee } from 'src/app/shared/Entities/SettingProductGuarantee';
import { SettingProductGuaranteeService } from './product-guarantee.service';
const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-product-guarantee',
  templateUrl: './product-guarantee.component.html',
  styleUrls: ['./product-guarantee.component.sass']
})
export class ProductGuaranteeComponent implements OnInit {
  @Input() productEntity: ProductEntity;
  @Input() isEditMode: boolean;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public settingForm: FormGroup;
  public settingGuarantee: SettingProductGuarantee;
  public loading = true;
  public settingProductGuarantee: SettingProductGuarantee = new SettingProductGuarantee();
  constructor(public translate: TranslateService, public settingsService: SettingsService,
    public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices, public settingProductGuaranteeService: SettingProductGuaranteeService,
    public settingService: SettingsService, public customerAddressService: CustomerAddressService, private cdRef: ChangeDetectorRef) { }


  ngOnChanges(changes: SimpleChanges) {
    this.getproductguarantee();
  }

  ngOnInit(): void {
    console.log(this.productEntity)
    this.createForm();
    this.getproductguarantee();
  }

  getproductguarantee() {
    if (this.productEntity.productGuarantee) {
      this.settingGuarantee = this.productEntity.productGuarantee;
      this.settingForm.controls.minGuaranteeAmount.setValue(this.settingGuarantee.minGuaranteeAmount);
      this.settingForm.controls.minGuaranteePercentage.setValue(this.settingGuarantee.minGuaranteePercentage);
      this.settingForm.controls.minCollateralAmount.setValue(this.settingGuarantee.minCollateralAmount);
      this.settingForm.controls.minCollateralPercentage.setValue(this.settingGuarantee.minCollateralPercentage);
      this.settingForm.controls.minimumAge.setValue(this.productEntity.minimumAge)
      this.settingForm.controls.maximumAge.setValue(this.productEntity.maximumAge)
    } else {
      this.settingGuarantee = new SettingProductGuarantee();
      this.settingForm.reset();
      this.settingForm.markAsPristine();
    }
    this.loading = false;
  }

  onSubmit() {
    this.settingGuarantee.productId = this.productEntity.id;
    this.settingGuarantee.minCollateralAmount = this.settingForm.value.minCollateralAmount
    this.settingGuarantee.minCollateralPercentage = this.settingForm.value.minCollateralPercentage
    this.settingGuarantee.minGuaranteeAmount = this.settingForm.value.minGuaranteeAmount
    this.settingGuarantee.minGuaranteePercentage = this.settingForm.value.minGuaranteePercentage
    this.productEntity.minimumAge = this.settingForm.value.minimumAge
    this.productEntity.maximumAge = this.settingForm.value.maximumAge
    if (this.settingForm.valid) {
      this.productEntity.productGuarantee = this.settingGuarantee;
      if (this.settingGuarantee.id) {
        this.settingService.updateProduct(this.productEntity).subscribe((result) => {
          this.settingGuarantee = result.productGuarantee;
          this.devToolsServices.openToast(0, 'alert.success');
          this.settingForm.markAsPristine();
        });
      } else {
        this.settingProductGuaranteeService.createSettingProductGuarantee(this.settingGuarantee).subscribe((result) => {
          this.settingGuarantee = result;
          this.devToolsServices.openToast(0, 'alert.success');
          this.settingForm.markAsPristine();
        });
      }
    }
  }

  createForm() {
    this.settingForm = this.formBuilder.group({
      minGuaranteeAmount: ['', [customRequiredValidator, Validators.min(0)]],
      minGuaranteePercentage: ['', [customRequiredValidator, Validators.min(0), Validators.max(100)]],
      minCollateralAmount: ['', [customRequiredValidator, Validators.min(0)]],
      minCollateralPercentage: ['', [customRequiredValidator, Validators.min(0), Validators.max(100)]],
      minimumAge: [],
      maximumAge: [],
    });
  }

  // Expose local state to the parent
  getUpdatedData() {
    this.settingProductGuarantee.minCollateralAmount = this.settingForm.value.minCollateralAmount;
    this.settingProductGuarantee.minCollateralPercentage = this.settingForm.value.minCollateralPercentage;
    this.settingProductGuarantee.minGuaranteeAmount = this.settingForm.value.minGuaranteeAmount;
    this.settingProductGuarantee.minGuaranteePercentage = this.settingForm.value.minGuaranteePercentage;
    // this.settingProductGuarantee.minimumAge = this.settingForm.value.minimumAge;
    // this.settingProductGuarantee.maximumAge = this.settingForm.value.maximumAge;
    
    if(Object.values(this.settingProductGuarantee).some(value => value !== null && value !== undefined)) {
      return {
        productGuarantee: this.settingProductGuarantee
      };
    }
  }

}
