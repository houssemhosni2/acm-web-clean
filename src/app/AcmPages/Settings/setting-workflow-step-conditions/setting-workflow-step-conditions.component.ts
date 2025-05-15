import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingWorkFlowStepConditions } from 'src/app/shared/Entities/SettingWorkFlowStepConditions.entity';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { UdfService } from '../../Loan-Application/udf/udf.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { getCustomerFields } from 'src/app/shared/utils';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

@Component({
  selector: 'app-setting-workflow-step-conditions',
  templateUrl: './setting-workflow-step-conditions.component.html',
  styleUrls: ['./setting-workflow-step-conditions.component.sass']
})
export class SettingWorkflowStepConditionsComponent implements OnInit {

  @Input() idWorkflowStep;
  @Input() settingWorkflowStepConditions;
  @Input() type; // 1 - Loan and Topup 2- Collection 3- Legal 4- PROSPECTION
  @Input() udfGroups;

  public stepConditionForms: FormGroup[]=[];
  public stepConditions: SettingWorkFlowStepConditions[]=[];
  public udfFields: UserDefinedFieldsEntity[][] = [];
  public entityName : string = AcmConstants.CUSTOMER_ENTITY;
  public customerFields: string[]=[];
  public operators: string[]= ["=","!=","<",">","<=",">=","<>","in"];

  constructor(public formBuilder: FormBuilder, public udfService: UdfService, public library: FaIconLibrary,
    public devToolsServices: AcmDevToolsServices
  ) { }

  ngOnInit(): void {
    this.getStepConditions();
    this.customerFields = getCustomerFields();
  }

  getStepConditions(){
    this.stepConditionForms = [];
    if(this.settingWorkflowStepConditions){
      this.stepConditions = this.settingWorkflowStepConditions;
    }
    if(this.stepConditions.length > 0){
      for (let i = 0; i < this.stepConditions.length; i++) {
        if(!this.stepConditionForms[i]){
          this.stepConditionForms[i] = this.formBuilder.group({});
        }
        //this.stepConditionForms[i].addControl('id', new FormControl(this.stepConditions[i].id));

        if(this.stepConditions[i].idUserDefinedFieldGroup){
          this.stepConditionForms[i].addControl('idGroup', new FormControl(this.stepConditions[i].idUserDefinedFieldGroup, Validators.required));
        }
        else if(this.stepConditions[i].entityName){
          this.stepConditionForms[i].addControl('idGroup', new FormControl(this.stepConditions[i].entityName, Validators.required));
        }
        
        this.getUdfFields(null, i, this.stepConditions[i].idUserDefinedFieldGroup);
        this.stepConditionForms[i].addControl('idField', new FormControl(this.stepConditions[i].idUserDefinedFields, Validators.required));
        this.stepConditionForms[i].addControl('fieldName', new FormControl(this.stepConditions[i].fieldName, Validators.required));
        if(this.stepConditions[i].idUserDefinedFields){       
          this.stepConditionForms[i].controls['fieldName'].disable();
        }
        else if(this.stepConditions[i].fieldName){         
          this.stepConditionForms[i].controls['idField'].disable();
        }
        
        this.stepConditionForms[i].addControl('operator', new FormControl(this.stepConditions[i].operator, Validators.required));
        this.stepConditionForms[i].addControl('value', new FormControl(this.stepConditions[i].value));
        this.stepConditionForms[i].addControl('minValue', new FormControl(this.stepConditions[i].minValue));
        this.stepConditionForms[i].addControl('maxValue', new FormControl(this.stepConditions[i].maxValue));
        
        this.checkOperator(null ,i,this.stepConditions[i].operator);
      }
    }
  }

  async getUdfFields(event, index: number ,id : number){
    let group
     event ? group = event.target.value : group= id;
    if(!group){
      this.udfFields[index] = [];
      return;
    }
    
    if(group === AcmConstants.CUSTOMER_ENTITY){
      this.stepConditionForms[index].controls['idField'].disable();
      this.stepConditionForms[index].controls['idField'].setValue(null);
      this.stepConditionForms[index].controls['fieldName'].enable();
    }
    else{
      const udfField = new UserDefinedFieldsEntity();
      udfField.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
      udfField.userDefinedFieldGroupDTO.id = group;
      this.udfService.getUdfField(udfField).subscribe((data)=>{
        this.udfFields[index] = data; 
      });
      this.stepConditionForms[index].controls['idField'].enable();
      this.stepConditionForms[index].controls['fieldName'].disable();
      this.stepConditionForms[index].controls['fieldName'].setValue(null);
    }
  }


  checkOperator(event, index: number, operators: string){
    let operator;
    event ? operator = event.target.value : operator = operators;
     
    if(operator === "<>"){
      this.stepConditionForms[index].controls['value'].disable();
      this.stepConditionForms[index].controls['value'].setValue(null);
      this.stepConditionForms[index].controls['minValue'].enable();
      this.stepConditionForms[index].controls['maxValue'].enable();
      
    }
    else if(operator === "in"){
      if(event){
        this.devToolsServices.openToast(3, 'setting.step_conditions.in_operator_warning');
      }    
      this.stepConditionForms[index].controls['value'].enable();
      this.stepConditionForms[index].controls['minValue'].disable();
      this.stepConditionForms[index].controls['maxValue'].disable();
      this.stepConditionForms[index].controls['maxValue'].setValue(null);
      this.stepConditionForms[index].controls['minValue'].setValue(null);
    }
    else{
      this.stepConditionForms[index].controls['value'].enable();
      this.stepConditionForms[index].controls['minValue'].disable();
      this.stepConditionForms[index].controls['maxValue'].disable();
      this.stepConditionForms[index].controls['maxValue'].setValue(null);
      this.stepConditionForms[index].controls['minValue'].setValue(null);
    }
  }

  deleteStepCondition(index: number) {
    this.stepConditionForms.splice(index,1);
    this.stepConditions.splice(index,1);
  }

  addStepCondition(){
    this.stepConditionForms[this.stepConditions.length] = this.formBuilder.group({});
    this.stepConditionForms[this.stepConditions.length].addControl('id', new FormControl(null));
    this.stepConditionForms[this.stepConditions.length].addControl('idGroup', new FormControl('', Validators.required));
    this.stepConditionForms[this.stepConditions.length].addControl('idField', new FormControl('', Validators.required));
    this.stepConditionForms[this.stepConditions.length].addControl('operator', new FormControl('', Validators.required));
    this.stepConditionForms[this.stepConditions.length].addControl('value', new FormControl(''));
    this.stepConditionForms[this.stepConditions.length].addControl('minValue', new FormControl(''));
    this.stepConditionForms[this.stepConditions.length].addControl('maxValue', new FormControl(''));
    this.stepConditionForms[this.stepConditions.length].addControl('fieldName', new FormControl(''));
    this.stepConditionForms[this.stepConditions.length].controls['value'].disable();
    this.stepConditionForms[this.stepConditions.length].controls['minValue'].disable();
    this.stepConditionForms[this.stepConditions.length].controls['maxValue'].disable();
    this.stepConditionForms[this.stepConditions.length].controls['fieldName'].disable();
    this.stepConditions.push(new SettingWorkFlowStepConditions()); 
  }

}
