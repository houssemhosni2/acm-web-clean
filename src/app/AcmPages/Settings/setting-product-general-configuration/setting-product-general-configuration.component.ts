import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-setting-product-general-configuration',
  templateUrl: './setting-product-general-configuration.component.html',
  styleUrls: ['./setting-product-general-configuration.component.sass']
})
export class SettingProductGeneralConfigComponent implements OnInit, OnChanges {
  @Input() productEntity: ProductEntity;
  @Input() isEditMode: boolean;
  public product: ProductEntity;
  public generalSettingForm: FormGroup;
  public enabled: boolean = true;


  /**
   *
   * @param translate TranslateService
   * @param formBuilder TranslateService
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public translate: TranslateService, public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices,
    public settingService: SettingsService) { }
  /**
   * ngOnChanges when product is changed
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.productEntity = changes.productEntity.currentValue;
    this.getGeneralSettingProduct();
  }
  /**
   * ng on init
   */
  ngOnInit() {
    this.getGeneralSettingProduct();
  }
  getGeneralSettingProduct() {
    this.product = this.productEntity;
    this.createForm();

    // set form controls
    this.generalSettingForm.controls.code.setValue(this.productEntity.code);
    this.generalSettingForm.controls.description.setValue(this.productEntity.description);
    this.generalSettingForm.controls.maximumAge.setValue(this.productEntity.maximumAge);
    this.generalSettingForm.controls.minimumAge.setValue(this.productEntity.minimumAge);
    this.generalSettingForm.controls.maxAccounts.setValue(this.productEntity.maxAccounts);
    this.generalSettingForm.controls.maximumTerm.setValue(this.productEntity.maximumTerm);
    this.generalSettingForm.controls.minimumTerm.setValue(this.productEntity.minimumTerm);
    this.generalSettingForm.controls.maximumDeferredPeriod.setValue(this.productEntity.maximumDeferredPeriod);
    this.generalSettingForm.controls.minimumDeferredPeriod.setValue(this.productEntity.minimumDeferredPeriod);

    if (this.productEntity.rate != 0) {
      this.enabled = false;
      this.generalSettingForm.controls.rateValue.setValue(this.productEntity.rate);
    } else {
      this.enabled = true;
      this.generalSettingForm.controls.rateValue.setValue(this.productEntity.flatInterestRate);
    }

  }

  enableFlatInterestRate() {
    if (this.enabled) {
      this.generalSettingForm.controls.rateValue.setValue(this.productEntity.flatInterestRate);
    } else {
      this.generalSettingForm.controls.rateValue.setValue(this.productEntity.rate);
    }
  }

  /**
   * when click  on submit
   */
  onSubmit() {
    this.product.code = this.generalSettingForm.value.code;
    this.product.description = this.generalSettingForm.value.description;
    this.product.maximumAge = this.generalSettingForm.value.maximumAge;
    this.product.minimumAge = this.generalSettingForm.value.minimumAge;
    this.product.maxAccounts = this.generalSettingForm.value.maxAccounts;
    this.product.maximumTerm = this.generalSettingForm.value.maximumTerm;
    this.product.minimumTerm = this.generalSettingForm.value.minimumTerm;
    this.product.maximumDeferredPeriod = this.generalSettingForm.value.maximumDeferredPeriod;
    this.product.minimumDeferredPeriod = this.generalSettingForm.value.minimumDeferredPeriod;
    if (this.enabled) {
      this.product.flatInterestRate = this.generalSettingForm.value.rateValue;
      this.product.rate = 0;
    } else {
      this.product.rate = this.generalSettingForm.value.rateValue;
      this.product.flatInterestRate = 0;
    }

    if(this.generalSettingForm.valid) {
      this.settingService.updateProduct(this.product).subscribe(() => {
        this.devToolsServices.openToast(0, 'alert.success');
      });
    }

  }
  /**
   * create topup setting form
   */
  createForm() {
    this.generalSettingForm = this.formBuilder.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      minimumAge: ['', Validators.required],
      maximumAge: ['', Validators.required],
      maxAccounts: ['', Validators.required],
      minimumTerm: ['', Validators.required],
      maximumTerm: ['', Validators.required],
      minimumDeferredPeriod: ['', Validators.required],
      maximumDeferredPeriod: ['', Validators.required],
      rateValue: ['0', Validators.required]
    },
    {
      validators: [this.ageRangeValidator, this.termRangeValidator, this.deferredageRangeValidator],
    }
  );
  }

  ageRangeValidator(formGroup: AbstractControl): ValidationErrors | null {
    const minAge = formGroup.get('minimumAge')?.value;
    const maxAge = formGroup.get('maximumAge')?.value;

    if (minAge !== null && maxAge !== null && maxAge <= minAge) {
      return { ageRangeInvalid: true }; // Error key
    }
    return null;
  }

  termRangeValidator(formGroup: AbstractControl): ValidationErrors | null {
    const minTerm = formGroup.get('minimumTerm')?.value;
    const maxTerm = formGroup.get('maximumTerm')?.value;

    if (minTerm !== null && maxTerm !== null && maxTerm <= minTerm) {
      return { termRangeInvalid: true }; // Error key
    }
    return null;
  }

  deferredageRangeValidator(formGroup: AbstractControl): ValidationErrors | null {
    const minDeferred = formGroup.get('minimumDeferredPeriod')?.value;
    const maxDeferred = formGroup.get('maximumDeferredPeriod')?.value;

    if (minDeferred !== null && maxDeferred !== null && maxDeferred <= minDeferred) {
      return { deferredRangeInvalid: true }; // Error key
    }
    return null;
  }

  // Expose local state to the parent
  getUpdatedData() {
    this.product.code = this.generalSettingForm.value.code;
    this.product.description = this.generalSettingForm.value.description;
    this.product.maximumAge = this.generalSettingForm.value.maximumAge;
    this.product.minimumAge = this.generalSettingForm.value.minimumAge;
    this.product.maxAccounts = this.generalSettingForm.value.maxAccounts;
    this.product.maximumTerm = this.generalSettingForm.value.maximumTerm;
    this.product.minimumTerm = this.generalSettingForm.value.minimumTerm;
    this.product.maximumDeferredPeriod = this.generalSettingForm.value.maximumDeferredPeriod;
    this.product.minimumDeferredPeriod = this.generalSettingForm.value.minimumDeferredPeriod;
    if (this.enabled) {
      this.product.flatInterestRate = this.generalSettingForm.value.rateValue;
      this.product.rate = 0;
    } else {
      this.product.rate = this.generalSettingForm.value.rateValue;
      this.product.flatInterestRate = 0;
    }

    if(this.generalSettingForm.valid) {
      return this.product;
    } else {
      return false;
    }
  }
}
