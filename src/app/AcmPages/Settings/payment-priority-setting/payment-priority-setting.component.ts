import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { SettingsService } from '../settings.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { customRequiredValidator } from 'src/app/shared/utils';

@Component({
  selector: 'app-payment-priority-setting',
  templateUrl: './payment-priority-setting.component.html',
  styleUrls: ['./payment-priority-setting.component.sass']
})
export class PaymentPrioritySettingComponent implements OnInit {

  @Input() productEntity: ProductEntity;
  @Input() isEditMode: boolean;
  public paymentPrioritySetting: string;
  public paymentPriotityTab = [
    { i18nKey: 'setting.payment-priority-setting.principal', value: 'principal' },
    { i18nKey: 'setting.payment-priority-setting.interest', value: 'interest' },
    { i18nKey: 'setting.payment-priority-setting.penaltyFee', value: 'penaltyFee' },
    { i18nKey: 'setting.payment-priority-setting.oldFees', value: 'oldFees' }
  ];
  
  form: FormGroup;

  constructor(public settingService: SettingsService, public devToolsServices: AcmDevToolsServices,
    public translate: TranslateService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.form = this.fb.group({
      priorities: this.fb.array(this.initFormArrayWithValues(this.productEntity.paymentPrioritySetting))
    }, { validators: this.paymentPrioritySelectValidator() });

    this.form.valueChanges.subscribe(() => {
      this.updatePaymentPrioritySetting();
    });
  }

  initFormArrayWithValues(existingValues: string): any[] {
    const valuesArray = existingValues?.split(';');
    
    return this.paymentPriotityTab.map((priority, index) => {
      let value = '';
      if(valuesArray){
        value = valuesArray[index] || ''; 
      }
      return this.fb.control(value, customRequiredValidator);
    });
  }

  priorities(): FormArray {
    return this.form?.get('priorities') as FormArray;
  }

  updatePaymentPrioritySetting() {
    const selectedPriorities = this.priorities().value.filter((priority: string) => priority); 
    this.paymentPrioritySetting = selectedPriorities.join(';');
  }

  paymentPrioritySelectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control.get('priorities') as FormArray;
      const selectedPriorities = formArray.value.filter((priority: string) => priority); 

      // Check if there are any duplicates
      const uniqueValues = new Set(selectedPriorities);
      if (uniqueValues.size !== selectedPriorities.length) {
        return { duplicatePriority: true };
      }

      return null; 
    };
  }

  isOptionHidden(option: string, currentIndex: number): boolean {
    const selectedPriorities = this.priorities().value;
    return selectedPriorities.some((selected: string, index: number) => selected === option && index !== currentIndex);
  }

  save() {
    if (this.form.valid) {
      if (this.productEntity !== null && this.productEntity !== undefined) {       
        this.productEntity.paymentPrioritySetting = this.paymentPrioritySetting;
        this.settingService.updateProduct(this.productEntity).subscribe((res)=>{
          this.devToolsServices.openToast(0, 'alert.success');
        });
      }
    }
  }

  resetForm() {
    this.form.reset(); 
    this.paymentPrioritySetting = ''; 
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.productEntity = changes.productEntity.currentValue;
    this.paymentPrioritySetting = this.productEntity.paymentPrioritySetting; 
    this.createForm();
  }

  // Expose local state to the parent
  getUpdatedData() {
    if(this.form.valid) {
      return {
        paymentPrioritySetting: this.paymentPrioritySetting
      };
    } else {
      return false;
    }
  }
}
