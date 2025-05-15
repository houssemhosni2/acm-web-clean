import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingChargeFeeEntity } from 'src/app/shared/Entities/settingChargeFee.entity';
import { SettingsService } from '../settings.service';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { customRequiredValidator, customPatternValidator } from '../../../shared/utils';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-charge-fee',
  templateUrl: './charge-fee.component.html',
  styleUrls: ['./charge-fee.component.sass']
})
export class ChargeFeeComponent implements OnInit {

  public settingChargeFeeEntity: SettingChargeFeeEntity = new SettingChargeFeeEntity();
  public settingChargeFeeEntitys: SettingChargeFeeEntity[] = [];
  public listFees: { id: number, code: string }[] = []; // list of fees from abacus
  public listValues = [];
  public listValuesNormalFees = [
    { key: AcmConstants.LOAN_AMOUNT, value: 'setting.charge_fee.values.loan_amount' },
    { key: AcmConstants.PERSONAL_CONTRIBUTION, value: "setting.charge_fee.values.personal_contribution" },
    { key: AcmConstants.MANUAL_ENTRY, value: "setting.charge_fee.values.manual_entry" },
    { key: AcmConstants.FIXED_AMOUNT, value: "setting.charge_fee.values.fixed_amount" }
  ];
  public listValuesPayoutFees = [
    { key: AcmConstants.BALANCE_POURCENTAGE, value: 'setting.charge_fee.values.balance_pourcentage' },
    { key: AcmConstants.MINIMUM_BALANCE, value: "setting.charge_fee.values.minimum_balance" },
    { key: AcmConstants.NEXT_INSTALLEMENT_INTEREST, value: "setting.charge_fee.values.next_installement_interest" },
    { key: AcmConstants.BALANCE_INTEREST_POURCENTAGE, value: "setting.charge_fee.values.balance_interest_pourcentage" }
  ];
  public listValuePenaltyFees = [
    { key: AcmConstants.BALANCE_AMOUNT, value: 'setting.charge_fee.values.balance_amount' },
    { key: AcmConstants.IMPAYED_AMOUNT, value: "setting.charge_fee.values.impayed_amount" },
    { key: AcmConstants.IMPAYED_PRINCIPAL, value: "setting.charge_fee.values.impayed_principal" },
    { key: AcmConstants.FIXED_AMOUNT_PER_TERM, value: "setting.charge_fee.values.fixed_amount" },
    { key: AcmConstants.FIXED_AMOUNT_PER_DAY, value: "setting.charge_fee.values.fixed_amount_per_day" }

  ];
  public feeTypeList = [
    { key: AcmConstants.NORMAL_FEES , value: 'Normal Fees' },
    { key: AcmConstants.PENALTY_FEES , value: "Penalty Fees" },
    { key: AcmConstants.PAYOUT_FEES , value: "Loan Payout Fees" }
  ];
  public percentageValues = [AcmConstants.IMPAYED_PRINCIPAL,AcmConstants.IMPAYED_AMOUNT,AcmConstants.BALANCE_AMOUNT,AcmConstants.LOAN_AMOUNT, AcmConstants.PERSONAL_CONTRIBUTION, AcmConstants.BALANCE_POURCENTAGE
    , AcmConstants.MINIMUM_BALANCE, AcmConstants.BALANCE_INTEREST_POURCENTAGE
  ];
  public amountValues = [AcmConstants.FIXED_AMOUNT,AcmConstants.FIXED_AMOUNT_PER_DAY,AcmConstants.FIXED_AMOUNT_PER_TERM];

  public pageSize: number;
  public page: number;
  public groupForm: FormGroup;

  public updateSetting: SettingChargeFeeEntity;
  public action: string; // add or update

  constructor(public settingsService: SettingsService, public formBuilder: FormBuilder,
    public translate: TranslateService, public modal: NgbModal, public devToolsServices: AcmDevToolsServices,
    public library: FaIconLibrary, public sharedService: SharedService) {

  }

  async ngOnInit() {
    this.pageSize = 5;
    this.page = 1;
    await this.settingsService.findAllSettingChargeFee().subscribe(
      (data) => {
        this.settingChargeFeeEntitys = data;
      }
    );
    this.getFeesFromListValues();
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  addFee(modalContent: TemplateRef<any>) {
    this.updateSetting = new SettingChargeFeeEntity();
    this.action = 'create';
    this.createForm(new SettingChargeFeeEntity());
    this.listValues = [];
    this.modal.open(modalContent);
  }

  async createForm(settingChargeFeeEntity: SettingChargeFeeEntity) {
    
    this.groupForm = this.formBuilder.group({
      label: [settingChargeFeeEntity.label, [customRequiredValidator]],
      cufeeID: [settingChargeFeeEntity.cufeeId],
      value: [settingChargeFeeEntity.value, Validators.required],
      feeType: [settingChargeFeeEntity.feeType],
      percentage: [
        { value: settingChargeFeeEntity.percentage, disabled: true },
        customPatternValidator(new RegExp("^(?:[1-9][0-9]?|100)$"))
      ],
      amount: [{ value: settingChargeFeeEntity.amount, disabled: true }, [customPatternValidator(new RegExp("^[1-9][0-9]*$"))]],
      nextInstallementInterestNumber: [{value: settingChargeFeeEntity.nextInstallementInterestNumber, disabled: true },]
    });
    this.groupForm.get('value').setValue(settingChargeFeeEntity.value);
  }

  onSubmit() {
    if (this.groupForm.valid) {
      if (this.action === 'update') {
        this.update();
      } else if (this.action === 'create') {
        this.create();
      }
    }
  }
  /**
 *
 * @param event event
 */
  onChange(event) {
    const percentageControl = this.groupForm.get('percentage');
    const amountControl = this.groupForm.get('amount');
    const nextInstallementInterestNumberControl = this.groupForm.get('nextInstallementInterestNumber');
    
    if (this.percentageValues.find(value => value == event.target.value)) {
      percentageControl.enable();
      percentageControl.setValue(0);
    } else {
      percentageControl.disable();
      percentageControl.setValue(null);
    }
    if (this.amountValues.find(value => value == event.target.value)) {
      amountControl.enable();
      amountControl.setValue(0);
    } else {
      amountControl.disable();
      amountControl.setValue(null);
    }
    if(event.target.value == AcmConstants.NEXT_INSTALLEMENT_INTEREST){
      nextInstallementInterestNumberControl.enable();
      nextInstallementInterestNumberControl.setValue(0);
    } else {
      nextInstallementInterestNumberControl.disable();
      nextInstallementInterestNumberControl.setValue(null);
    }
  }

  closeModale() {
    this.modal.dismissAll();
  }

  create() {
    this.updateSetting.label = this.groupForm.controls.label.value;
    this.updateSetting.value = this.groupForm.controls.value.value;
    this.updateSetting.percentage = this.groupForm.controls.percentage.value;
    this.updateSetting.amount = this.groupForm.controls.amount.value;
    this.updateSetting.cufeeId = this.groupForm.controls.cufeeID.value;
    this.updateSetting.code = (this.listFees.find((item) => item.id == this.updateSetting.cufeeId))?.code;
    this.updateSetting.feeType = this.groupForm.controls.feeType.value;
    this.settingsService.createSettingChargeFee(this.updateSetting).subscribe(
      (data) => {
        this.settingChargeFeeEntitys.push(data);
        this.modal.dismissAll();
      }
    );
  }

  async updateFee(modalContent, settingChargeFeeEntity: SettingChargeFeeEntity) {
    this.action = 'update';
    this.updateSetting = settingChargeFeeEntity;
    await this.createForm(settingChargeFeeEntity);
    this.feeTypeChanged(settingChargeFeeEntity.feeType);
    this.modal.open(modalContent);

    const percentageControl = this.groupForm.get('percentage');
    const amountControl = this.groupForm.get('amount');
    const valueCheck = this.groupForm.get('value');
    const nextInstallementInterestNumberControl = this.groupForm.get('nextInstallementInterestNumber');
    if (this.percentageValues.find(value => value == valueCheck.value)) {
      percentageControl.enable();
      percentageControl.setValue(settingChargeFeeEntity.percentage);
    } else {
      percentageControl.disable();
      percentageControl.setValue(null);
    }
    if (this.amountValues.find(value => value == valueCheck.value)) {
      amountControl.enable();
      amountControl.setValue(settingChargeFeeEntity.amount);
    } else {
      amountControl.disable();
      amountControl.setValue(null);
    }
    if(settingChargeFeeEntity.nextInstallementInterestNumber != null){
      nextInstallementInterestNumberControl.enable();
      nextInstallementInterestNumberControl.setValue(settingChargeFeeEntity.nextInstallementInterestNumber);
    } else {
      nextInstallementInterestNumberControl.disable();
      nextInstallementInterestNumberControl.setValue(null);
    }
  }

  update() {
    this.action = 'update';
    this.updateSetting.label = this.groupForm.controls.label.value;
    this.updateSetting.value = this.groupForm.controls.value.value;
    this.updateSetting.percentage = this.groupForm.controls.percentage.value;
    this.updateSetting.amount = this.groupForm.controls.amount.value;
    this.updateSetting.cufeeId = this.groupForm.controls.cufeeID.value;
    this.updateSetting.code = (this.listFees.find((item) => item.id == this.updateSetting.cufeeId))?.code;
    this.updateSetting.feeType = this.groupForm.controls.feeType.value;
    this.updateSetting.nextInstallementInterestNumber = this.groupForm.controls.nextInstallementInterestNumber.value;
    this.settingsService.updateSettingChargeFee(this.updateSetting).subscribe();
    this.modal.dismissAll();

  }

  async getFeesFromListValues() {
    await this.settingsService.getApplicationFees().subscribe(
      (data) => {
        this.listFees = [];
        const uniqueFees: Set<number> = new Set();
        data.forEach(element => {
          if (!uniqueFees.has(element.cufeeID)) {
            uniqueFees.add(element.cufeeID);
            this.listFees.push({ id: element.cufeeID, code: element.code })
          }
        })
      }
    );
  }
  feeTypeChanged(feeType : string) {     
    switch(feeType) {
      case AcmConstants.NORMAL_FEES:
        this.listValues = this.listValuesNormalFees;
      break;
      case AcmConstants.PENALTY_FEES:
        this.listValues = this.listValuePenaltyFees;
      break;
      case AcmConstants.PAYOUT_FEES:
        this.listValues = this.listValuesPayoutFees;
      break;
    }
    if (this.listValues.length > 0) {
      const valueCheck = this.groupForm.get('value');
      const percentageControl = this.groupForm.get('percentage');
      const amountControl = this.groupForm.get('amount');
      if ((valueCheck.value === AcmConstants.LOAN_AMOUNT) || (valueCheck.value === AcmConstants.PERSONAL_CONTRIBUTION)) {
        percentageControl.enable();
        percentageControl.setValue(0);
      } else {
        percentageControl.disable();
        percentageControl.setValue(null);
      }
      if ((valueCheck.value === AcmConstants.FIXED_AMOUNT)) {
        amountControl.enable();
        amountControl.setValue(0);
      } else {
        amountControl.disable();
        amountControl.setValue(null);
      }
    }
  }
}