import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SettingsService } from '../settings.service';
import { ProductEntity } from '../../../shared/Entities/product.entity';
import { SettingGurantorCollateralEntity } from '../../../shared/Entities/settingGurantorCollateral.entity';
import { AcmConstants } from '../../../shared/acm-constants';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { SettingRequiredStepEntity } from '../../../shared/Entities/settingRequiredStep.entity';
import { AcmEnvironnementEntity } from 'src/app/shared/Entities/acmEnvironnement.entity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-guarantar-collateral',
  templateUrl: './guarantor-collateral.component.html',
  styleUrls: ['./guarantor-collateral.component.sass']
})
export class GuarantorCollateralComponent implements OnInit, OnChanges {
  public productEntitys: ProductEntity[] = [];
  public stateGuarantor = false;
  public stateCollateral = false;
  public disableGuarantor = true;
  public disableCollateral = true;
  public settingGurantorEntity: SettingGurantorCollateralEntity;
  public settingCollateralEntity: SettingGurantorCollateralEntity;
  public product: ProductEntity;
  @Input() productEntity: ProductEntity;
  @Input() isEditMode: boolean;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: PrimaryBleu };
  slideConfig6 = {
    className: 'center',
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    adaptiveHeight: true,
    dots: true,
  };
  public loading = true;
  public settingFieldVisit: SettingRequiredStepEntity;
  public settingAuditReview: SettingRequiredStepEntity;
  public settingRiskReview: SettingRequiredStepEntity;
  public stateFieldVisit = false;
  public stateAuditReview = false;
  public stateRiskReview = false;
  public stateIndiv = false;
  public stateGrp = false;
  public stateOrg = false;
  public stateAdminFees = false;
  public stateApplicationFees = false;
  settingRequiredStepEntity: SettingRequiredStepEntity = new SettingRequiredStepEntity();
  public settingAdminFees: AcmEnvironnementEntity;
  public settingApplicationFees: AcmEnvironnementEntity;
  public renewalLoanPercentageForm: FormGroup;
  public renewalLoanCondition: string;
  public percentageInvalid = false;
  public stateTopup = false;
  public stateRefinance = false;
  public stateFrequency = false;
  public stateSupplier = false;
  public stateDisburse = false;
  public stateDeferredPeriodeFrequency = false;
  /**
   * constructor GuarantorCollateralComponent.
   * @param settingsService SettingsService
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   */
  constructor(private settingsService: SettingsService, private devToolsServices: AcmDevToolsServices, private formBuilder: FormBuilder) {
  }

  ngOnInit() {

  }

  /**
   * Methode when input property change
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.loading = true;
    this.productEntity = changes.productEntity.currentValue;
    this.disableGuarantor = false;
    this.disableCollateral = false;
    this.stateGuarantor = false;
    this.stateCollateral = false;
    this.settingGurantorEntity = null;
    this.settingCollateralEntity = null;
    this.settingFieldVisit = null;
    this.settingAuditReview = null;
    this.settingRiskReview = null;
    this.settingAdminFees = null;
    this.settingApplicationFees = null;
    this.stateFieldVisit = false;
    this.stateAuditReview = false;
    this.stateRiskReview = false;
    this.stateIndiv = false;
    this.stateOrg = false;
    this.stateGrp = false;
    this.stateAdminFees = false;
    this.stateApplicationFees = false;
    this.stateSupplier = false;
    this.stateDeferredPeriodeFrequency = false;
    const acmEnvironmentKeys: string[] = [AcmConstants.APPLICATION_FEE, AcmConstants.ADMIN_FEE, AcmConstants.RENEWEL_LOAN_CONDITION];
    this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
      this.settingApplicationFees = environments[0];
      this.settingAdminFees = environments[1];
      this.renewalLoanCondition = environments[2].value;
      if (environments[0].value === '1') {
        this.stateApplicationFees = true;
      } else {
        this.stateApplicationFees = false;
      }
      if (environments[1].value === '1') {
        this.stateAdminFees = true;
      } else {
        this.stateAdminFees = false;
      }
    });
    this.createPercentageRenewalLoanForm();

    if (this.isEditMode) {
      this.settingsService.findProductById(this.productEntity.id).subscribe(
        (data) => {
          this.product = data;
          this.stateIndiv = this.product.productIndiv;
          this.stateGrp = this.product.productGrp;
          this.stateOrg = this.product.productOrg;
          this.stateTopup = this.product.topup;
          this.stateRefinance = this.product.refinance;
          this.stateSupplier = this.product.supplier;
          this.stateDisburse = this.product.disburse;
          this.stateFrequency = this.product.isFrequency;
          this.renewalLoanPercentageForm.controls.percentage.setValue(this.product.renewalPercentage * 100);
          this.stateDeferredPeriodeFrequency = this.product.isFrequencyWithDeferredPeriode;

        }
      );
    } else {
      this.product = this.productEntity;
      this.stateIndiv = this.product.productIndiv;
      this.stateGrp = this.product.productGrp;
      this.stateOrg = this.product.productOrg;
      this.stateTopup = this.product.topup;
      this.stateRefinance = this.product.refinance;
      this.stateSupplier = this.product.supplier;
      this.stateDisburse = this.product.disburse;
      this.stateFrequency = this.product.isFrequency;
      // this.renewalLoanPercentageForm.controls.percentage.setValue(this.product.renewalPercentage * 100);
      this.stateDeferredPeriodeFrequency = this.product.isFrequencyWithDeferredPeriode;
    }

    const settingGurantorCollateralEntity = new SettingGurantorCollateralEntity();
    settingGurantorCollateralEntity.productId = this.productEntity.id;
    this.settingsService.findSettingGurantorCollateral(settingGurantorCollateralEntity).subscribe(
      (data) => {
        if (data.length === 0) {
          this.stateGuarantor = false;
          this.stateCollateral = false;
        } else {
          data.forEach(setting => {
            if (setting.code === AcmConstants.SETTING_GUARANTOR_COLLATERAL_CODE_GUARANTOR) {
              this.settingGurantorEntity = setting;
              if (setting.mandatory) {
                this.stateGuarantor = true;
              }
            } else if (setting.code === AcmConstants.SETTING_GUARANTOR_COLLATERAL_CODE_COLLATERAL) {
              this.settingCollateralEntity = setting;
              if (setting.mandatory) {
                this.stateCollateral = true;
              }
            }
          });
        }
        this.settingRequiredStepEntity.productId = this.productEntity.id;
        this.settingsService.findSettingRequiredStep(this.settingRequiredStepEntity).subscribe(
          (response) => {
            response.forEach(
              setting => {
                if (setting.code === AcmConstants.SETTING_REQUIRED_STEP_CODE_FIELD_VISIT) {
                  this.settingFieldVisit = setting;
                  if (setting.mandatory) {
                    this.stateFieldVisit = true;
                  }
                } else if (setting.code === AcmConstants.SETTING_REQUIRED_STEP_CODE_AUDIT_REVIEW) {
                  this.settingAuditReview = setting;
                  if (setting.mandatory) {
                    this.stateAuditReview = true;
                  }
                } else if (setting.code === AcmConstants.SETTING_REQUIRED_STEP_CODE_RISK_REVIEW) {
                  this.settingRiskReview = setting;
                  if (setting.mandatory) {
                    this.stateRiskReview = true;
                  }
                }
              }
            );
          }
        );

        this.loading = false;
      }
    );

  }
  updateIndiv() {
    if (this.product !== null && this.product !== undefined && this.product.id !== null) {
      this.product.productIndiv = !this.product.productIndiv;
      this.stateIndiv = this.product.productIndiv;
      this.settingsService.updateProduct(this.product).subscribe();
    }
  }
  updateOrg() {
    if (this.product !== null && this.product !== undefined && this.product.id !== null) {
      this.product.productOrg = !this.product.productOrg;
      this.stateOrg = this.product.productOrg;
      this.settingsService.updateProduct(this.product).subscribe();
    }
  }
  updateGrp() {
    if (this.product !== null && this.product !== undefined && this.product.id !== null) {
      this.product.productGrp = !this.product.productGrp;
      this.stateGrp = this.product.productGrp;
      this.settingsService.updateProduct(this.product).subscribe();
    }
  }
  createPercentageRenewalLoanForm() {
    this.renewalLoanPercentageForm = this.formBuilder.group({
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }
  changePercentage() {
    this.percentageInvalid = false;
    if (this.renewalLoanPercentageForm.controls.percentage.value < 0 || this.renewalLoanPercentageForm.controls.percentage.value > 100) {
      this.percentageInvalid = true;
    }
  }
  updatePercentage() {
    if (this.product !== null && this.product !== undefined && !this.percentageInvalid) {
      this.product.renewalPercentage = this.renewalLoanPercentageForm.controls.percentage.value * 0.01;
      this.settingsService.updateProduct(this.product).subscribe(() => {
        this.devToolsServices.openToast(0, 'alert.success');
      });
    }
  }
  /**
   * Update Guarantor
   */
  updateGuarantor() {
    if (this.settingGurantorEntity !== null && this.settingGurantorEntity !== undefined) {
      this.settingGurantorEntity.mandatory = !this.settingGurantorEntity.mandatory;
      this.stateGuarantor = this.settingGurantorEntity.mandatory;
      this.settingsService.updateSettingGurantorCollateral(this.settingGurantorEntity).subscribe();
    } else {
      this.settingGurantorEntity = new SettingGurantorCollateralEntity();
      this.settingGurantorEntity.productId = this.productEntity.id;
      this.settingGurantorEntity.code = AcmConstants.SETTING_GUARANTOR_COLLATERAL_CODE_GUARANTOR;
      this.settingGurantorEntity.keyAbacus = AcmConstants.SETTING_GUARANTOR_COLLATERAL_KEYABACUS_GUARANTOR;
      this.settingGurantorEntity.description = AcmConstants.SETTING_GUARANTOR_COLLATERAL_DESCRIPTION_GUARANTOR;
      this.settingGurantorEntity.mandatory = this.stateGuarantor;
      this.loading = true;
      this.settingsService.createSettingGurantorCollateral(this.settingGurantorEntity).subscribe(
        (data) => {
          this.settingGurantorEntity = data;
          this.loading = false;
        }
      );
    }
  }

  /**
   * Update Collateral
   */
  updateCollateral() {
    if (this.settingCollateralEntity !== null && this.settingCollateralEntity !== undefined) {
      this.settingCollateralEntity.mandatory = !this.settingCollateralEntity.mandatory;
      this.stateCollateral = this.settingCollateralEntity.mandatory;
      this.settingsService.updateSettingGurantorCollateral(this.settingCollateralEntity).subscribe();
    } else {
      this.settingCollateralEntity = new SettingGurantorCollateralEntity();
      this.settingCollateralEntity.productId = this.productEntity.id;
      this.settingCollateralEntity.code = AcmConstants.SETTING_GUARANTOR_COLLATERAL_CODE_COLLATERAL;
      this.settingCollateralEntity.keyAbacus = AcmConstants.SETTING_GUARANTOR_COLLATERAL_KEYABACUS_COLLATERAL;
      this.settingCollateralEntity.description = AcmConstants.SETTING_GUARANTOR_COLLATERAL_DESCRIPTION_COLLATERAL;
      this.settingCollateralEntity.mandatory = this.stateCollateral;
      this.loading = true;
      this.settingsService.createSettingGurantorCollateral(this.settingCollateralEntity).subscribe(
        (data) => {
          this.settingCollateralEntity = data;
          this.loading = false;
        }
      );
    }
  }

  /**
   * Update Field Visit.
   */
  updateFieldVisit() {
    if (this.settingFieldVisit !== null && this.settingFieldVisit !== undefined) {
      this.settingFieldVisit.mandatory = !this.settingFieldVisit.mandatory;
      this.stateFieldVisit = this.settingFieldVisit.mandatory;
      this.settingsService.updateSettingRequiredStep(this.settingFieldVisit).subscribe();
    } else {
      this.settingFieldVisit = new SettingRequiredStepEntity();
      this.settingFieldVisit.productId = this.productEntity.id;
      this.settingFieldVisit.code = AcmConstants.SETTING_REQUIRED_STEP_CODE_FIELD_VISIT;
      this.settingFieldVisit.description = AcmConstants.SETTING_REQUIRED_STEP_CODE_FIELD_VISIT;
      this.settingFieldVisit.mandatory = this.stateFieldVisit;
      this.loading = true;
      this.settingsService.createSettingRequiredStep(this.settingFieldVisit).subscribe(
        (data) => {
          this.settingFieldVisit = data;
          this.loading = false;
        }
      );
    }
  }

  /**
   * Update Audit Review.
   */
  updateAuditReview() {
    if (this.settingAuditReview !== null && this.settingAuditReview !== undefined) {
      this.settingAuditReview.mandatory = !this.settingAuditReview.mandatory;
      this.stateAuditReview = this.settingAuditReview.mandatory;
      this.settingsService.updateSettingRequiredStep(this.settingAuditReview).subscribe();
    } else {
      this.settingAuditReview = new SettingRequiredStepEntity();
      this.settingAuditReview.productId = this.productEntity.id;
      this.settingAuditReview.code = AcmConstants.SETTING_REQUIRED_STEP_CODE_AUDIT_REVIEW;
      this.settingAuditReview.description = AcmConstants.SETTING_REQUIRED_STEP_CODE_AUDIT_REVIEW;
      this.settingAuditReview.mandatory = this.stateAuditReview;
      this.loading = true;
      this.settingsService.createSettingRequiredStep(this.settingAuditReview).subscribe(
        (data) => {
          this.settingAuditReview = data;
          this.loading = false;
        }
      );
    }
  }

  /**
   * Update Risk Review.
   */
  updateRiskReview() {
    if (this.settingRiskReview !== null && this.settingRiskReview !== undefined) {
      this.settingRiskReview.mandatory = !this.settingRiskReview.mandatory;
      this.stateRiskReview = this.settingRiskReview.mandatory;
      this.settingsService.updateSettingRequiredStep(this.settingRiskReview).subscribe();
    } else {
      this.settingRiskReview = new SettingRequiredStepEntity();
      this.settingRiskReview.productId = this.productEntity.id;
      this.settingRiskReview.code = AcmConstants.SETTING_REQUIRED_STEP_CODE_RISK_REVIEW;
      this.settingRiskReview.description = AcmConstants.SETTING_REQUIRED_STEP_CODE_RISK_REVIEW;
      this.settingRiskReview.mandatory = this.stateRiskReview;
      this.loading = true;
      this.settingsService.createSettingRequiredStep(this.settingRiskReview).subscribe(
        (data) => {
          this.settingRiskReview = data;
          this.loading = false;
        }
      );
    }
  }
  /**
   * Update application fees.
   */
  updateApplicationFees() {
    if (this.settingApplicationFees !== null && this.settingApplicationFees !== undefined) {
      this.loading = true;
      if (this.settingApplicationFees.value === '0') {
        this.settingApplicationFees.value = '1';
        this.stateApplicationFees = true;
      } else {
        this.settingApplicationFees.value = '0';
        this.stateApplicationFees = false;
      }
      this.settingsService.updateAcmEnvironment(this.settingApplicationFees).subscribe(
        (data) => {
          this.loading = false;
        }
      );
    }
  }
  /**
   * Update admin fees.
   */
  updateAdminFees() {
    if (this.settingAdminFees !== null && this.settingAdminFees !== undefined) {
      if (this.settingAdminFees.value === '0') {
        this.settingAdminFees.value = '1';
        this.stateAdminFees = true;
      } else {
        this.settingAdminFees.value = '0';
        this.stateAdminFees = false;
      }
      this.settingsService.updateAcmEnvironment(this.settingAdminFees).subscribe();
    }
  }
  updateTopup() {
    if (this.product !== null && this.product !== undefined && this.product.id !== null) {
      this.product.topup = !this.product.topup;
      this.stateTopup = this.product.topup;
      this.settingsService.updateProduct(this.product).subscribe();
    }
  }
  updateRefinance() {
    if (this.product !== null && this.product !== undefined && this.product.id !== null) {
      this.product.refinance = !this.product.refinance;
      this.stateRefinance = this.product.refinance;
      this.settingsService.updateProduct(this.product).subscribe();
    }
  }
  /**
   * Update Supplier
   */
  updateSupplier() {
    if (this.product !== null && this.product !== undefined && this.product.id !== null) {
      this.product.supplier = !this.product.supplier;
      this.stateSupplier = this.product.supplier;
      this.settingsService.updateProduct(this.product).subscribe();
      this.devToolsServices.openToast(0, 'alert.success');
    }
  }

  updateAutomaticDisburse() {
    if (this.product !== null && this.product !== undefined && this.product.id !== null) {
      this.product.disburse = !this.product.disburse;
      this.stateDisburse = this.product.disburse;
      this.settingsService.updateProduct(this.product).subscribe();
      this.devToolsServices.openToast(0, 'alert.success');
    }
  }
  updateFrequency() {
    if (this.product !== null && this.product !== undefined && this.product.id !== null) {
      this.product.isFrequency = !this.product.isFrequency;
      this.stateFrequency = this.product.isFrequency;
      this.settingsService.updateProduct(this.product).subscribe();
    }
  }
  updateDeferredPeriodeFrequency() {
    if (this.product !== null && this.product !== undefined && this.product.id !== null) {
      this.product.isFrequencyWithDeferredPeriode = !this.product.isFrequencyWithDeferredPeriode
      this.stateDeferredPeriodeFrequency = this.product.isFrequencyWithDeferredPeriode;
      this.settingsService.updateProduct(this.product).subscribe();
    }
  }

  // Expose local state to the parent
  getUpdatedData(): Partial<ProductEntity> {
    return {
      productIndiv: this.stateIndiv,
      productGrp: this.stateGrp,
      productOrg: this.stateOrg,
      topup: this.stateTopup,
      refinance: this.stateRefinance,
      supplier: this.stateSupplier,
      disburse: this.stateDisburse,
      isFrequency: this.stateFrequency,
      isFrequencyWithDeferredPeriode: this.stateDeferredPeriodeFrequency
    };
  }
}
