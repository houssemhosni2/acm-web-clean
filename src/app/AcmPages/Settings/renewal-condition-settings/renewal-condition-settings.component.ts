import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { RenewalConditionEntity } from 'src/app/shared/Entities/renewalCondition.entity';
import { SettingsService } from '../settings.service';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-renewal-condition-settings',
  templateUrl: './renewal-condition-settings.component.html',
  styleUrls: ['./renewal-condition-settings.component.sass']
})
export class RenewalConditionSettingsComponent implements OnInit {
 public renewalConditionSettings: RenewalConditionEntity[] = [];
 public renewalConditionSettingForm: FormGroup;
 public yearSelected = true;
 public modeEdit: boolean;
 public yearValue: number;
 public renewalCondition = new RenewalConditionEntity();
 public action: string;
 public ordre = 0;

  /**
   * Constructor Renewal Condition Settings Component
   * @param settingsService SettingsService
   * @param formBuilder FormBuilder
   * @param modalService NgbModal
   * @param translate TranslateService
   * @param devToolsServices AcmDevToolsServices
   * @param library FaIconLibrary
   */

  constructor(public settingsService: SettingsService, public formBuilder: FormBuilder,
              public modalService: NgbModal, public translate: TranslateService,
              public devToolsServices: AcmDevToolsServices, public library: FaIconLibrary) { }

  ngOnInit() {
    const renewalConditionSettings = new RenewalConditionEntity();
    this.settingsService.getRenewalConditionSettings(renewalConditionSettings).subscribe((data) => {
      this.renewalConditionSettings = data;
    });
  }
  /**
   * add/edit new renewal condition Form
   */
  createForm(renewal) {
    this.yearValue = renewal.year;
    this.renewalConditionSettingForm = this.formBuilder.group({
      year: [renewal.year, Validators.required],
      minAmount: [renewal.minAmount, Validators.required],
      maxAmount: [renewal.maxAmount, Validators.required],
      percentage: [renewal.pourcentage, Validators.required]
    });
  }
  /**
   * open modal Create Renewal Condition
   */
  async addRenewalConditionModal(renewalModalContent) {
    this.modeEdit = false;
    this.yearSelected = true;
    this.action = 'CREATE';
    this.renewalCondition = new RenewalConditionEntity();
    this.createForm(this.renewalCondition);
    this.modalService.open(renewalModalContent, {
      size: 'md'
    });
  }
  /**
   * open modal Update Renewal Condition
   */
  async editRenewalConditionModal(renewalModalContent, renewal: RenewalConditionEntity) {
    this.modeEdit = true;
    this.action = 'UPDATE';
    this.renewalCondition = renewal;
    this.createForm(this.renewalCondition);
    this.updateBornValidators();
    this.modalService.open(renewalModalContent, {
      size: 'md'
    });
  }
  /**
   * add / edit renewal condition setting
   */
  onSubmit() {
      this.devToolsServices.makeFormAsTouched(this.renewalConditionSettingForm);
      if (this.renewalConditionSettingForm.valid) {
        this.renewalCondition.year = this.renewalConditionSettingForm.controls.year.value;
        this.renewalCondition.minAmount = this.renewalConditionSettingForm.controls.minAmount.value;
        this.renewalCondition.maxAmount = this.renewalConditionSettingForm.controls.maxAmount.value;
        this.renewalCondition.pourcentage = this.renewalConditionSettingForm.controls.percentage.value;
        if (this.action === 'CREATE') {
        this.settingsService.createRenewalConditionSetting(this.renewalCondition).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.renewalConditionSettings.push(data);
          this.renewalConditionSettings.sort((a, b) => a.year - b.year);
          this.modalService.dismissAll();
        });
        }
        if (this.action === 'UPDATE') {
          this.settingsService.updateRenewalConditionSetting(this.renewalCondition).subscribe(() => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.modalService.dismissAll();
          });
        }
    }
  }
  /**
   * onChangeMinAmount
   */
  onChangeMinAmount() {
    if (this.action === 'UPDATE') {
      if (this.renewalConditionSettingForm.controls.minAmount.value !== null &&
        this.renewalConditionSettingForm.controls.minAmount.value !== undefined) {
          if (this.getMaxOrdre() === this.renewalCondition.ordre) {
            this.renewalConditionSettingForm.controls.maxAmount.setValidators(
              [Validators.min(this.renewalConditionSettingForm.controls.minAmount.value + 1), Validators.required]);
          } else {
            const newMaxAmount = this.renewalConditionSettings
            .filter(r => r.year === this.yearValue && r.ordre === this.renewalCondition.ordre + 1)[0].minAmount;
                // set validator for the max amount ===> should be greater  than min amount
            this.renewalConditionSettingForm.controls.maxAmount.setValidators(
                [Validators.min(this.renewalConditionSettingForm.controls.minAmount.value + 1),
                   Validators.max(newMaxAmount - 1), Validators.required]);
          }
          // get max amount validator ===> min amount of RCS[ordre + 1]

          this.renewalConditionSettingForm.get('maxAmount').updateValueAndValidity();
          this.renewalConditionSettingForm.updateValueAndValidity();
          this.devToolsServices.makeFormAsTouched(this.renewalConditionSettingForm);
      }
    } else if (this.action === 'CREATE') {
      if (this.renewalConditionSettingForm.controls.minAmount.value !== null &&
        this.renewalConditionSettingForm.controls.minAmount.value !== undefined) {
          // set validator for the max amount ===> should be greater  than min amount
        this.renewalConditionSettingForm.controls.maxAmount.setValidators(
          [Validators.min(this.renewalConditionSettingForm.controls.minAmount.value + 1), Validators.required]);
        this.renewalConditionSettingForm.get('maxAmount').updateValueAndValidity();
        this.renewalConditionSettingForm.updateValueAndValidity();
      }
    }

  }
  /**
   * enable / disable min max amount and percentage fields based on year
   */
  changeYear() {
    if (this.renewalConditionSettingForm.controls.year.value !== null &&
       this.renewalConditionSettingForm.controls.year.value !== undefined) {
        this.yearSelected = false;
       // create
       // generate new ordre
        let maxOrder = 0;
        if (this.renewalConditionSettings.filter(r => r.year === this.yearValue).length > 0) {
        maxOrder = this.getMaxOrdre();
      }
      // set new ordre
        this.renewalCondition.ordre = maxOrder + 1;
        if (this.renewalCondition.ordre !== 1) {
        const newMinAmount = this.renewalConditionSettings
       .filter(r => r.year === this.yearValue && r.ordre === this.renewalCondition.ordre - 1 )[0].maxAmount;
         // clear validators
        this.renewalConditionSettingForm.controls.minAmount.clearValidators();
        this.renewalConditionSettingForm.controls.maxAmount.clearValidators();
        this.renewalConditionSettingForm.controls.maxAmount.reset();
        this.renewalConditionSettingForm.controls.minAmount.setValidators([Validators.min(newMinAmount + 1), Validators.required]);
       }} else {
         this.yearSelected = true;
       }
  }
  /**
   * getminOrdre
   */
  getminOrdre() {
   const minOrdre = Math.min.apply(Math, this.renewalConditionSettings.filter(r => r.year === this.yearValue).map((setting) => {
      return setting.ordre;
    }));
   return minOrdre;
  }
  /**
   * getMaxOrdre
   */
  getMaxOrdre() {
    const maxOrdre = Math.max.apply(Math, this.renewalConditionSettings.filter(r => r.year === this.yearValue).map((setting) => {
       return setting.ordre;
     }));
    return maxOrdre;
   }
   /**
    * updateBornValidators
    */
  updateBornValidators() {
    if (this.renewalConditionSettingForm.controls.year.value !== null &&
      this.renewalConditionSettingForm.controls.year.value !== undefined) {
      this.yearSelected = false;
      if (this.renewalConditionSettings
        .filter(r => r.year === this.yearValue).length === 1) {
        this.renewalConditionSettingForm.controls.maxAmount.clearValidators();
        this.renewalConditionSettingForm.controls.maxAmount.setValidators(
          [Validators.min(this.renewalCondition.minAmount + 1), Validators.required]);
      } else {
        if (this.getminOrdre() === this.renewalCondition.ordre) {
          // get max amount validator ===> min amount of RCS[ordre + 1]
          const newMaxAmount = this.renewalConditionSettings
            .filter(r => r.year === this.yearValue && r.ordre === this.renewalCondition.ordre + 1)[0].minAmount;
          this.renewalConditionSettingForm.controls.minAmount.clearValidators();
          this.renewalConditionSettingForm.controls.maxAmount.clearValidators();
          // set min amount validator
          this.renewalConditionSettingForm.controls.minAmount.setValidators([Validators.max(newMaxAmount - 1),
             Validators.required]);
          // set max amount validator
          this.renewalConditionSettingForm.controls.maxAmount.setValidators([Validators.max(newMaxAmount - 1),
             Validators.min(this.renewalCondition.minAmount + 1), Validators.required]);
        } else if (this.getMaxOrdre() === this.renewalCondition.ordre) {
          // get min amount validator === > max amount of RCS[ordre - 1]
          const newMinAmount = this.renewalConditionSettings
            .filter(r => r.year === this.yearValue && r.ordre === this.renewalCondition.ordre - 1)[0].maxAmount;
          this.renewalConditionSettingForm.controls.minAmount.clearValidators();
          this.renewalConditionSettingForm.controls.maxAmount.clearValidators();
          // set min amount validator
          this.renewalConditionSettingForm.controls.minAmount.setValidators([Validators.min(newMinAmount + 1),
             Validators.required]);
          // set max amount validator
          this.renewalConditionSettingForm.controls.maxAmount.setValidators([
            Validators.min(this.renewalCondition.minAmount + 1), Validators.required]);
        } else {
          // get min amount validator === > max amount of RCS[ordre - 1]
          const newMinAmount = this.renewalConditionSettings
            .filter(r => r.year === this.yearValue && r.ordre === this.renewalCondition.ordre - 1)[0].maxAmount;
          // get max amount validator ===> min amount of RCS[ordre + 1]
          const newMaxAmount = this.renewalConditionSettings
            .filter(r => r.year === this.yearValue && r.ordre === this.renewalCondition.ordre + 1)[0].minAmount;
          this.renewalConditionSettingForm.controls.minAmount.clearValidators();
          this.renewalConditionSettingForm.controls.maxAmount.clearValidators();
          // set min amount validator
          this.renewalConditionSettingForm.controls.minAmount.setValidators(
            [Validators.min(newMinAmount + 1), Validators.max(newMaxAmount - 1), Validators.required]);
          // set max amount validator
          this.renewalConditionSettingForm.controls.maxAmount.setValidators(
            [Validators.max(newMaxAmount - 1), Validators.min(this.renewalCondition.minAmount + 1), Validators.required]);
        }
      }
    } else {
      this.yearSelected = true;
    }
  }
  /**
   * delete renewal condition setting
   * @param renewalCondition RenewalConditionEntity
   * @param i index
   */
  deleteRenewalCondition(renewalCondition: RenewalConditionEntity, i: number) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('delete renewal condition').afterClosed().subscribe(
      res => {
        if (res) {
          this.settingsService.deleteRenewalConditionSetting(renewalCondition.id).subscribe(() => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.renewalConditionSettings.splice(i, 1);
          });
        }
      }
    );
  }
  /**
   * Get Direction
   */
    getDirection() {
      return AppComponent.direction;
    }
}
