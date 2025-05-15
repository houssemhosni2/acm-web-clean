import { Component, OnInit } from '@angular/core';
import { AcmAmlListSetting } from 'src/app/shared/Entities/AcmAmlListSetting.entity';
import { SettingsService } from '../settings.service';
import { FormGroup, FormBuilder, FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { customRequiredValidator } from '../../../shared/utils';
import { GenericWorkFlowObject } from "src/app/shared/Entities/GenericWorkFlowObject";
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmDoubtfulTransactionSetting } from 'src/app/shared/Entities/AcmDoubtfulTransactionSetting.entity';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-setting-aml-check-and-doubtful-tx',
  templateUrl: './setting-aml-check-and-doubtful-tx.component.html',
  styleUrls: ['./setting-aml-check-and-doubtful-tx.component.sass']
})
export class SettingAmlCheckAndDoutfulTxComponent implements OnInit {

  public amlListSettings: AcmAmlListSetting[] = [];
  public amlListSettingForm: FormGroup[] = [];
  public amlListSettingExpands: boolean[] = [];
  public genericWorkflowObjects: GenericWorkFlowObject[] = [];

  public doubtfulTransactionSettings: AcmDoubtfulTransactionSetting[] = [];
  public doubtfulTransactionSettingsForm: FormGroup[] = [];
  public doubtfulTransactionSettingsExpands: boolean[] = [];

  constructor(public settingsService: SettingsService, public formBuilder: FormBuilder,
    public translate: TranslateService, public devToolsServices: AcmDevToolsServices,
    public library: FaIconLibrary) { }

  ngOnInit(): void {

    this.findAmlListSetting();

    this.findDoubtfulTxSetting();

    this.settingsService.findWorkFlowObjects().subscribe((item) => {
      this.genericWorkflowObjects = item;
    });

  }

  findAmlListSetting() {
    let acmAmlListSetting = new AcmAmlListSetting();
    this.settingsService.findAMLListSetting(acmAmlListSetting).toPromise().then((res) => {
      this.amlListSettings = res.map(item => ({ ...item, listName: item.listName.replaceAll("_", " ") }));
      for (let index = 0; index < this.amlListSettings.length; index++) {
        this.addAmlList(index)
      }

    })
  }

  findDoubtfulTxSetting() {
    let acmDoubtfulTransactionSetting = new AcmDoubtfulTransactionSetting();
    this.settingsService.findDoubtfulTxSetting(acmDoubtfulTransactionSetting).toPromise().then((res) => {
      this.doubtfulTransactionSettings = res;
      this.doubtfulTransactionSettings.sort((item1, item2)=> item1.minRiskScore - item2.minRiskScore);
      for (let index = 0; index < this.doubtfulTransactionSettings.length; index++) {
        this.addDoubtfulTxScenario(index);
      }

    })
  }

  addAmlList(index) {
    this.amlListSettingForm[index] = this.formBuilder.group({});
    this.amlListSettingForm[index].addControl('minRejectionRange', new FormControl(this.amlListSettings[index].minRejectionRange, customRequiredValidator));
    this.amlListSettingForm[index].addControl('maxRejectionRange', new FormControl(this.amlListSettings[index].maxRejectionRange, customRequiredValidator));
    this.amlListSettingForm[index].addControl('minAcceptanceRange', new FormControl(this.amlListSettings[index].minAcceptanceRange, customRequiredValidator));
    this.amlListSettingForm[index].addControl('maxAcceptanceRange', new FormControl(this.amlListSettings[index].maxAcceptanceRange, customRequiredValidator));
    this.amlListSettingForm[index].addControl('isBlockingList', new FormControl(this.amlListSettings[index].isBlockingList));
    this.amlListSettingForm[index].addControl('listKeywords', new FormControl(this.amlListSettings[index].listKeywords, customRequiredValidator));
    this.amlListSettingForm[index].addControl('descriptionKeywords', new FormControl(this.amlListSettings[index].descriptionKeywords, customRequiredValidator));
    this.amlListSettingForm[index].addControl('genericWorkFlowObject', new FormControl(this.amlListSettings[index]?.genericWorkFlowObject?.id, customRequiredValidator));
  }

  toggleCollapseAmlListSetting(index: number) {
    this.amlListSettingExpands[index] = !this.amlListSettingExpands[index];
  }

  toggleCollapseDoubtfulTxSetting(index: number) {
    this.doubtfulTransactionSettingsExpands[index] = !this.doubtfulTransactionSettingsExpands[index];
  }

  saveAmlList(index: number) {
       if (this.amlListSettingForm[index].valid) {
        let acmAmlListSetting: AcmAmlListSetting = { ...this.amlListSettings[index] };
        acmAmlListSetting.listName = acmAmlListSetting.listName.replaceAll(" ", "_");
        acmAmlListSetting.minRejectionRange = this.amlListSettingForm[index].controls['minRejectionRange'].value;
        acmAmlListSetting.maxRejectionRange = this.amlListSettingForm[index].controls['maxRejectionRange'].value;
        acmAmlListSetting.minAcceptanceRange = this.amlListSettingForm[index].controls['minAcceptanceRange'].value;
        acmAmlListSetting.maxAcceptanceRange = this.amlListSettingForm[index].controls['maxAcceptanceRange'].value;
        acmAmlListSetting.isBlockingList = this.amlListSettingForm[index].controls['isBlockingList'].value;
        acmAmlListSetting.listKeywords = this.amlListSettingForm[index].controls['listKeywords'].value;
        acmAmlListSetting.descriptionKeywords = this.amlListSettingForm[index].controls['descriptionKeywords'].value;
        let genericWorkflow = this.genericWorkflowObjects.find((item) => item.id === this.amlListSettingForm[index].controls['genericWorkFlowObject'].value);
        acmAmlListSetting.genericWorkFlowObject = genericWorkflow;
        this.settingsService.saveAMLListSetting(acmAmlListSetting).subscribe(() => {
          this.findAmlListSetting();
          this.devToolsServices.openToast(0, 'alert.success');
        });
      }
    }

  addDoubtfulTxScenario(index: number) {
    this.doubtfulTransactionSettingsForm[index] = this.formBuilder.group({});
    this.doubtfulTransactionSettingsForm[index].addControl('minRiskScore', new FormControl(this.doubtfulTransactionSettings[index]?.minRiskScore, [customRequiredValidator]));
    this.doubtfulTransactionSettingsForm[index].addControl('maxRiskScore', new FormControl(this.doubtfulTransactionSettings[index]?.maxRiskScore, customRequiredValidator));
    this.doubtfulTransactionSettingsForm[index].addControl('cumultativeAmount', new FormControl(this.doubtfulTransactionSettings[index]?.cumultativeAmount, customRequiredValidator));
    this.doubtfulTransactionSettingsForm[index].addControl('cumultativeAmountPeriod', new FormControl(this.doubtfulTransactionSettings[index]?.cumultativeAmountPeriod, customRequiredValidator));
    this.doubtfulTransactionSettingsForm[index].addControl('maxInstalmentsNumberPaid', new FormControl(this.doubtfulTransactionSettings[index]?.maxInstalmentsNumberPaid, customRequiredValidator));
    this.doubtfulTransactionSettingsForm[index].addControl('maxInstalmentsAmountPaid', new FormControl(this.doubtfulTransactionSettings[index]?.maxInstalmentsAmountPaid, customRequiredValidator));
    this.doubtfulTransactionSettingsForm[index].addControl('maxEarlyRepaymentNumber', new FormControl(this.doubtfulTransactionSettings[index]?.maxEarlyRepaymentNumber, customRequiredValidator));
    this.doubtfulTransactionSettingsForm[index].addControl('maxEarlyRepaymentAmount', new FormControl(this.doubtfulTransactionSettings[index]?.maxEarlyRepaymentAmount, customRequiredValidator));
    this.doubtfulTransactionSettingsForm[index].addControl('genericWorkFlowObject', new FormControl(this.doubtfulTransactionSettings[index]?.genericWorkFlowObject?.id, customRequiredValidator));
    this.doubtfulTransactionSettingsForm[index].setValidators(this.riskScoreValidator(this.doubtfulTransactionSettingsForm));
    this.doubtfulTransactionSettingsForm[index].updateValueAndValidity();
    this.doubtfulTransactionSettingsForm[index].valueChanges.subscribe(() => {
      this.riskScoreValidator(this.doubtfulTransactionSettingsForm);
    });
  }

  addNewDoubtfulTxScenario() {
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length] = this.formBuilder.group({});
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].addControl('minRiskScore', new FormControl('', [customRequiredValidator]));
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].addControl('maxRiskScore', new FormControl('', customRequiredValidator));
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].addControl('cumultativeAmount', new FormControl('', customRequiredValidator));
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].addControl('cumultativeAmountPeriod', new FormControl('', customRequiredValidator));
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].addControl('maxInstalmentsNumberPaid', new FormControl('', customRequiredValidator));
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].addControl('maxInstalmentsAmountPaid', new FormControl('', customRequiredValidator));
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].addControl('maxEarlyRepaymentNumber', new FormControl('', customRequiredValidator));
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].addControl('maxEarlyRepaymentAmount', new FormControl('', customRequiredValidator));
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].addControl('genericWorkFlowObject', new FormControl('', customRequiredValidator));
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].setValidators(this.riskScoreValidator(this.doubtfulTransactionSettingsForm));
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].updateValueAndValidity();
    this.doubtfulTransactionSettingsForm[this.doubtfulTransactionSettings.length].valueChanges.subscribe(() => {
      this.riskScoreValidator(this.doubtfulTransactionSettingsForm);
    });
    let acmDoubtfulTransactionSetting = new AcmDoubtfulTransactionSetting();
    acmDoubtfulTransactionSetting.id = null;
    this.doubtfulTransactionSettings.push(acmDoubtfulTransactionSetting);
  }

  disableDoubtfulTxScenario(index : number){
    
    if(this.doubtfulTransactionSettings[index].id !== null){
      this.settingsService.disableDoubtfulTxSetting(this.doubtfulTransactionSettings[index]).subscribe((res) => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.findDoubtfulTxSetting();
      })
    }
    this.doubtfulTransactionSettings.splice(index, 1);
    this.doubtfulTransactionSettingsForm.splice(index, 1);
    this.doubtfulTransactionSettingsExpands.splice(index, 1);
  }


  saveDoubtfulTxScenario(index: number){
    if (this.doubtfulTransactionSettingsForm[index].valid) {
      this.doubtfulTransactionSettings[index].minRiskScore = this.doubtfulTransactionSettingsForm[index].controls['minRiskScore'].value;
      this.doubtfulTransactionSettings[index].maxRiskScore = this.doubtfulTransactionSettingsForm[index].controls['maxRiskScore'].value;
      this.doubtfulTransactionSettings[index].cumultativeAmount = this.doubtfulTransactionSettingsForm[index].controls['cumultativeAmount'].value;
      this.doubtfulTransactionSettings[index].cumultativeAmountPeriod = this.doubtfulTransactionSettingsForm[index].controls['cumultativeAmountPeriod'].value;
      this.doubtfulTransactionSettings[index].maxInstalmentsNumberPaid = this.doubtfulTransactionSettingsForm[index].controls['maxInstalmentsNumberPaid'].value;
      this.doubtfulTransactionSettings[index].maxInstalmentsAmountPaid = this.doubtfulTransactionSettingsForm[index].controls['maxInstalmentsAmountPaid'].value;
      this.doubtfulTransactionSettings[index].maxEarlyRepaymentNumber = this.doubtfulTransactionSettingsForm[index].controls['maxEarlyRepaymentNumber'].value;
      this.doubtfulTransactionSettings[index].maxEarlyRepaymentAmount = this.doubtfulTransactionSettingsForm[index].controls['maxEarlyRepaymentAmount'].value;
      let genericWorkflow = this.genericWorkflowObjects.filter((item) => item.id === this.doubtfulTransactionSettingsForm[index].controls['genericWorkFlowObject'].value)[0];
      this.doubtfulTransactionSettings[index].genericWorkFlowObject = genericWorkflow;

      this.settingsService.saveDoubtfulTxSetting(this.doubtfulTransactionSettings[index]).subscribe((res)=>{
        this.findDoubtfulTxSetting();
        this.devToolsServices.openToast(0, 'alert.success');
      })

    }
    
  }

  riskScoreValidator(formArray: FormGroup[]): ValidatorFn {
    return (): ValidationErrors | null => {
      for (let i = 0; i < formArray.length; i++) {
        const currentForm = formArray[i];
        const minRiskScore = currentForm.get('minRiskScore').value;
        const maxRiskScore = currentForm.get('maxRiskScore').value;
  
        for (let j = 0; j < formArray.length; j++) {
          if (i !== j) {
            const otherForm = formArray[j];
            const otherMinRiskScore = otherForm.get('minRiskScore').value;
            const otherMaxRiskScore = otherForm.get('maxRiskScore').value;
  
            if (minRiskScore < otherMaxRiskScore && maxRiskScore > otherMinRiskScore) {
              currentForm.get('minRiskScore').setErrors({ 'riskScoreError': true });
              currentForm.get('maxRiskScore').setErrors({ 'riskScoreError': true });
              return { 'riskScoreError': true };
            }
            else{
              currentForm.get('minRiskScore').setErrors(null);
              currentForm.get('maxRiskScore').setErrors(null);
            }
          }
        }
      }
  
      return null;
    };
  }

  riskScoreMinMaxValidator(i: number) {
    if ((this.doubtfulTransactionSettingsForm[i].controls['minRiskScore' ].value !== '') &&
      (this.doubtfulTransactionSettingsForm[i].controls['maxRiskScore' ].value !== '') &&
      (this.doubtfulTransactionSettingsForm[i].controls['minRiskScore' ].value > this.doubtfulTransactionSettingsForm[i].controls['maxRiskScore' ].value)) {
      this.devToolsServices.openToast(3, 'alert.doubtful_tx_risk_score_min_greater_than_max');
    }
  }

  amlListRejectionMinMaxValidator(i: number) {
    if ((this.amlListSettingForm[i].controls['minRejectionRange' ].value !== '') &&
      (this.amlListSettingForm[i].controls['maxRejectionRange' ].value !== '') &&
      (this.amlListSettingForm[i].controls['minRejectionRange' ].value > this.amlListSettingForm[i].controls['maxRejectionRange' ].value)) {
      this.devToolsServices.openToast(3, 'alert.aml_list_rejection_range_control');
    }
  }

  amlListAcceptanceMinMaxValidator(i: number) {
    if ((this.amlListSettingForm[i].controls['minAcceptanceRange' ].value !== '') &&
      (this.amlListSettingForm[i].controls['maxAcceptanceRange' ].value !== '') &&
      (this.amlListSettingForm[i].controls['minAcceptanceRange' ].value > this.amlListSettingForm[i].controls['maxAcceptanceRange' ].value)) {
      this.devToolsServices.openToast(3, 'alert.aml_list_acceptance_range_control');
    }
  }

  
  addParametrageAML(){
    this.amlListSettingForm[this.amlListSettings.length] = this.formBuilder.group({});
    this.amlListSettingForm[this.amlListSettings.length].addControl('listName', new FormControl('', customRequiredValidator));
    this.amlListSettingForm[this.amlListSettings.length].addControl('minRejectionRange', new FormControl('', customRequiredValidator));
    this.amlListSettingForm[this.amlListSettings.length].addControl('maxRejectionRange', new FormControl('', customRequiredValidator));
    this.amlListSettingForm[this.amlListSettings.length].addControl('minAcceptanceRange', new FormControl('', customRequiredValidator));
    this.amlListSettingForm[this.amlListSettings.length].addControl('maxAcceptanceRange', new FormControl('', customRequiredValidator));
    this.amlListSettingForm[this.amlListSettings.length].addControl('isBlockingList', new FormControl(false));
    this.amlListSettingForm[this.amlListSettings.length].addControl('listKeywords', new FormControl('', customRequiredValidator));
    this.amlListSettingForm[this.amlListSettings.length].addControl('descriptionKeywords', new FormControl('', customRequiredValidator));
    this.amlListSettingForm[this.amlListSettings.length].addControl('genericWorkFlowObject', new FormControl('' , customRequiredValidator));
    let acmAmlListSetting = new AcmAmlListSetting();
    acmAmlListSetting.id = null;
    acmAmlListSetting.listName = '';
    acmAmlListSetting.enabled = true;
    this.amlListSettings.push(acmAmlListSetting);
  }
  saveListNameAML(i: number) {
    const listNameValue = this.amlListSettingForm[i].controls['listName'].value;
    this.amlListSettings[i].listName = listNameValue;
  }


  disableParametrageAML(index : number){
    if(this.amlListSettings[index].id !== null){
      this.amlListSettings[index].enabled = false;
     this.saveAmlList(index);
    }
   this.amlListSettingForm.splice(index, 1);
   this.amlListSettings.splice(index, 1);
  }

}
