import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { SettingsService } from '../settings.service';
const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-setting-iscore-aml',
  templateUrl: './setting-iscore-aml.component.html',
  styleUrls: ['./setting-iscore-aml.component.sass']
})

export class SettingIscoreAmlComponent implements OnInit, OnChanges {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: PrimaryBleu };
  public loading = true;
  @Input() productEntity: ProductEntity;
  @Input() isEditMode: boolean;
  public product: ProductEntity;
  public iScoreAmlForm: FormGroup;
  public checkChangedValues = false;

  /**
   *
   * @param translate TranslateService
   * @param settingsService SettingsService
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public translate: TranslateService, public settingsService: SettingsService,
              public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createIScoreAmlForm();
    this.checkChangedValues = false;
    this.loading = true;
    this.productEntity = changes.productEntity.currentValue;
    // set form values
    if (this.productEntity !== null || this.productEntity !== undefined) {
      this.iScoreAmlForm.controls.iscoreExpiryDays.setValue(this.productEntity.maxNumDaysExpiry);
      this.iScoreAmlForm.controls.iscoreMaxScore.setValue(this.productEntity.maxScore);
      this.iScoreAmlForm.controls.iscoreMaxActiveLoans.setValue(this.productEntity.maxActiveLoans);
      this.iScoreAmlForm.controls.iscoreMaxDueDays.setValue(this.productEntity.maxNumDaysDue);
      this.iScoreAmlForm.controls.iscoreMinActiveLoans.setValue(this.productEntity.minActiveLoans);
      this.iScoreAmlForm.controls.iscoreMinDueDays.setValue(this.productEntity.minNumDaysDue);
      this.iScoreAmlForm.controls.iscoreMinScore.setValue(this.productEntity.minScore);
      this.iScoreAmlForm.controls.amlCheckPourcentage.setValue(this.productEntity.amlCheckPourcentage);
      this.loading = false;
    }
  }

  /**
   * createIScoreAmlForm create Form
   */
  createIScoreAmlForm() {
    this.iScoreAmlForm = this.formBuilder.group({
      iscoreExpiryDays: ['', Validators.required],
      iscoreMaxScore: ['', Validators.required],
      iscoreMaxActiveLoans: ['', Validators.required],
      iscoreMaxDueDays: ['', Validators.required],
      iscoreMinActiveLoans: ['', Validators.required],
      iscoreMinDueDays: ['', Validators.required],
      iscoreMinScore: ['', Validators.required],
      amlCheckPourcentage: ['', Validators.required]
    });
  }
  /**
   * check if value changed
   */
  changeValue() {
    if ((this.productEntity.maxNumDaysExpiry !== this.iScoreAmlForm.controls.iscoreExpiryDays.value) ||
      (this.productEntity.maxScore !== this.iScoreAmlForm.controls.iscoreMaxScore.value) ||
      (this.productEntity.maxActiveLoans !== this.iScoreAmlForm.controls.iscoreMaxActiveLoans.value) ||
      (this.productEntity.maxNumDaysDue !== this.iScoreAmlForm.controls.iscoreMaxDueDays.value) ||
      (this.productEntity.minActiveLoans !== this.iScoreAmlForm.controls.iscoreMinActiveLoans.value) ||
      (this.productEntity.minNumDaysDue !== this.iScoreAmlForm.controls.iscoreMinDueDays.value) ||
      (this.productEntity.minScore !== this.iScoreAmlForm.controls.iscoreMinScore.value) ||
      (this.productEntity.amlCheckPourcentage !== this.iScoreAmlForm.controls.amlCheckPourcentage.value)) {
      this.checkChangedValues = true;
    } else {
      this.checkChangedValues = false;
    }
  }
  /**
   * update iscore && aml values
   */
  onSubmit() {
    if (this.productEntity !== null && this.productEntity !== undefined) {
      this.productEntity.maxNumDaysExpiry = this.iScoreAmlForm.controls.iscoreExpiryDays.value;
      this.productEntity.maxScore = this.iScoreAmlForm.controls.iscoreMaxScore.value;
      this.productEntity.maxActiveLoans = this.iScoreAmlForm.controls.iscoreMaxActiveLoans.value;
      this.productEntity.maxNumDaysDue = this.iScoreAmlForm.controls.iscoreMaxDueDays.value;
      this.productEntity.minActiveLoans = this.iScoreAmlForm.controls.iscoreMinActiveLoans.value;
      this.productEntity.minNumDaysDue = this.iScoreAmlForm.controls.iscoreMinDueDays.value;
      this.productEntity.minScore = this.iScoreAmlForm.controls.iscoreMinScore.value;
      this.productEntity.amlCheckPourcentage = this.iScoreAmlForm.controls.amlCheckPourcentage.value;
      this.settingsService.updateProduct(this.productEntity).subscribe((data) => {
        this.checkChangedValues = false;
        this.devToolsServices.openToast(0, 'alert.success');
      });
    }
  }

  // Expose local state to the parent
  getUpdatedData() {
    return {
      maxNumDaysExpiry: this.iScoreAmlForm.controls.iscoreExpiryDays.value,
      maxScore: this.iScoreAmlForm.controls.iscoreMaxScore.value,
      maxActiveLoans: this.iScoreAmlForm.controls.iscoreMaxActiveLoans.value,
      maxNumDaysDue: this.iScoreAmlForm.controls.iscoreMaxDueDays.value,
      minActiveLoans: this.iScoreAmlForm.controls.iscoreMinActiveLoans.value,
      minNumDaysDue: this.iScoreAmlForm.controls.iscoreMinDueDays.value,
      minScore: this.iScoreAmlForm.controls.iscoreMinScore.value,
      amlCheckPourcentage: this.iScoreAmlForm.controls.amlCheckPourcentage.value
    }
  }
}
