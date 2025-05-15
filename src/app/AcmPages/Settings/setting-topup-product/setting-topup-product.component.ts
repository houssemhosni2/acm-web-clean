import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { SettingTopupEntity } from 'src/app/shared/Entities/SettingTopup.entity';
import { SettingTopupService } from '../setting-topup.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-setting-topup-product',
  templateUrl: './setting-topup-product.component.html',
  styleUrls: ['./setting-topup-product.component.sass']
})
export class SettingTopupProductComponent implements OnInit, OnChanges {
  @Input() productEntity: ProductEntity;
  @Input() isEditMode: boolean;
  public settingTopupEntity: SettingTopupEntity = new SettingTopupEntity();
  public topupSettingForm: FormGroup;

  /**
   *
   * @param translate TranslateService
   * @param formBuilder TranslateService
   * @param devToolsServices AcmDevToolsServices
   * @param settingTopupService SettingTopupService
   */
  constructor(public translate: TranslateService, public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices,
              public settingTopupService: SettingTopupService, public settingService: SettingsService) { }
  /**
   * ngOnChanges when product is changed
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.getTopupSettingByProduct();
  }
  /**
   * ng on init
   */
  ngOnInit() {
    this.getTopupSettingByProduct();
  }
  getTopupSettingByProduct() {
    this.createForm();
    const topupSettingParam = new SettingTopupEntity();
    topupSettingParam.productId = this.productEntity.id;
    if (this.productEntity.settingTopup !== null) {
      // set form controls
      this.settingTopupEntity = this.productEntity.settingTopup;
      this.topupSettingForm.controls.minLoanPaymentPercentage.setValue(this.settingTopupEntity.topupMinLoanPaymentPercentage);
      this.topupSettingForm.controls.maxContinuousLateDays.setValue(this.settingTopupEntity.topupMaxContinuousLateDays);
      this.topupSettingForm.controls.maxSeparateLateDays.setValue(this.settingTopupEntity.topupMaxSeparateLateDays);
      this.topupSettingForm.controls.minLoanAmountType.setValue(this.settingTopupEntity.topupMinLoanAmountType);
      this.topupSettingForm.controls.minFixedLoanAmount.setValue(this.settingTopupEntity.topupMinFixedLoanAmount);
      this.topupSettingForm.controls.maxAllowedTopupOnSameLoan.setValue(this.settingTopupEntity.topupMaxAllowedTopups);
      this.topupSettingForm.controls.minPreviouslyIssuedLoansNumber.setValue(this.settingTopupEntity.topupMinPreviouslyIssuedLoansNumber);
    } else {
      this.settingTopupEntity = new SettingTopupEntity();
      this.topupSettingForm.reset();
    }
  }

  /**
   * when click  on submit
   */
  onSubmit() {
    this.settingTopupEntity.productId = this.productEntity.id;
    this.settingTopupEntity.productAbacusId = this.productEntity.productIdAbacus;
    this.settingTopupEntity.topupMinLoanPaymentPercentage = this.topupSettingForm.value.minLoanPaymentPercentage;
    this.settingTopupEntity.topupMaxContinuousLateDays = this.topupSettingForm.value.maxContinuousLateDays;
    this.settingTopupEntity.topupMaxSeparateLateDays = this.topupSettingForm.value.maxSeparateLateDays;
    this.settingTopupEntity.topupMinLoanAmountType = this.topupSettingForm.value.minLoanAmountType;
    this.settingTopupEntity.topupMinFixedLoanAmount = this.topupSettingForm.value.minFixedLoanAmount;
    this.settingTopupEntity.topupMaxAllowedTopups = this.topupSettingForm.value.maxAllowedTopupOnSameLoan;
    this.settingTopupEntity.topupMinPreviouslyIssuedLoansNumber = this.topupSettingForm.value.minPreviouslyIssuedLoansNumber;
    this.productEntity.settingTopup = this.settingTopupEntity;
    if (this.settingTopupEntity.id !== undefined) {
      this.settingService.updateProduct(this.productEntity).subscribe(() => {
        this.devToolsServices.openToast(0, 'alert.success');
      });
    } else {
      this.settingTopupService.createSettingTopup(this.settingTopupEntity).subscribe((data) => {
        this.settingTopupEntity = data;
        this.devToolsServices.openToast(0, 'alert.success');
      });
    }
  }
  /**
   * create topup setting form
   */
  createForm() {
    this.topupSettingForm = this.formBuilder.group({
      minLoanPaymentPercentage: [''],
      maxContinuousLateDays: [''],
      maxSeparateLateDays: [''],
      minLoanAmountType: [''],
      minFixedLoanAmount: [''],
      maxAllowedTopupOnSameLoan: [''],
      minPreviouslyIssuedLoansNumber: ['']
    });
  }

  // Expose local state to the parent
  getUpdatedData() {
    this.settingTopupEntity.productAbacusId = this.productEntity.productIdAbacus;
    this.settingTopupEntity.topupMinLoanPaymentPercentage = this.topupSettingForm.value.minLoanPaymentPercentage;
    this.settingTopupEntity.topupMaxContinuousLateDays = this.topupSettingForm.value.maxContinuousLateDays;
    this.settingTopupEntity.topupMaxSeparateLateDays = this.topupSettingForm.value.maxSeparateLateDays;
    this.settingTopupEntity.topupMinLoanAmountType = this.topupSettingForm.value.minLoanAmountType;
    this.settingTopupEntity.topupMinFixedLoanAmount = this.topupSettingForm.value.minFixedLoanAmount;
    this.settingTopupEntity.topupMaxAllowedTopups = this.topupSettingForm.value.maxAllowedTopupOnSameLoan;
    this.settingTopupEntity.topupMinPreviouslyIssuedLoansNumber = this.topupSettingForm.value.minPreviouslyIssuedLoansNumber;

    if(Object.values(this.settingTopupEntity).some(value => value !== null && value !== undefined)) {
      return {
        settingTopup: this.settingTopupEntity
      };
    }
  }
}
