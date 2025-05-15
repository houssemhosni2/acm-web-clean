import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SettingsService } from '../../settings.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { configCollectionParticipants, configDocProd, configJournalEntryType, configScreenComp, screenigComponents, stepTap, userLinks } from '../shared-setting-workflow';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { HabilitationIhmRouteEntity } from 'src/app/shared/Entities/habilitationIhmRoute.entity';
import { SettingJournalEntryTypeEntity } from 'src/app/shared/Entities/settingJournalEntryType.entity';
import { AppComponent } from 'src/app/app.component';
import { SettingDocumentTypeProductEntity } from 'src/app/shared/Entities/settingDocumentTypeProduct.entity';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ApplicationFeeEntity } from 'src/app/shared/Entities/applicationFee.entity';
import { UdfStepWorkflowSettingComponent } from '../../udf-step-workflow-setting/udf-step-workflow-setting.component';
import { WorkflowStepUdfGroupeEntity } from 'src/app/shared/Entities/WorkflowStepUdfGroupe.entity';
import { SettingSMSEntity } from 'src/app/shared/Entities/SettingSMS.entity';
import { SettingChargeFeeEntity } from 'src/app/shared/Entities/settingChargeFee.entity';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UdfService } from 'src/app/AcmPages/Loan-Application/udf/udf.service';
import { SettingWorkflowStepConditionsComponent } from '../../setting-workflow-step-conditions/setting-workflow-step-conditions.component';
import { SettingWorkFlowStepConditions } from 'src/app/shared/Entities/SettingWorkFlowStepConditions.entity';

@Component({
  selector: 'app-setting-loan-steps',
  templateUrl: './setting-loan-steps.component.html',
  styleUrls: ['./setting-loan-steps.component.sass']
})

export class SettingLoanStepsComponent implements OnInit, OnChanges, OnDestroy {


  @Input() productEntity: ProductEntity;
  @Input() productEntitys: ProductEntity[];
  @Input() ihmRoot: HabilitationIhmRouteEntity[];
  @Input() ibIhmRoot: String[];
  @Input() optionsGroupUsers: GroupeEntity[];
  @Input() groupEntities: GroupeEntity[];
  @Input() journalEntryTypes: SettingJournalEntryTypeEntity[] = [];
  @Input() mode : string;

  @ViewChildren(UdfStepWorkflowSettingComponent) udfStepWorkflowSettingComponent: QueryList<UdfStepWorkflowSettingComponent>;
  @ViewChildren(SettingWorkflowStepConditionsComponent) settingWorkflowStepConditionsComponent: QueryList<SettingWorkflowStepConditionsComponent>;

  public selectedScreenComponents: any[] = [];
  public newLoanApplicationSteps: StepEntity[] = [];
  public newLoanApplicationExpands: boolean[] = [];
  public settingLoanDocumentsByProduct: SettingDocumentTypeProductEntity[] = [];
  public settingSMS: SettingSMSEntity[] = [];
  public applicationFeesByProduct: ApplicationFeeEntity[] = [];
  public chargeFees: SettingChargeFeeEntity[] = [];
  public disbFeesList: SettingChargeFeeEntity[] = [];


  public readyForDisbCheckedForLoanApp: Boolean = false;
  public approvalConditionCheckedForLoanApp: Boolean = false;
  public mezaCardCheckedForLoanApp: Boolean = false;
  public feesCheckedForLoanApp: Boolean = false;
  public loanTimerCheckedForLoanApp: Boolean = false;
  public comfirmStatus: boolean;
  public serviceSMS: Boolean = false;
  public productType: string;
  public duplicateGroup: FormGroup;
  public productEntityForDuplicate = new ProductEntity();
  public settingDocumentProduct: SettingDocumentTypeProductEntity = new SettingDocumentTypeProductEntity();
  public settingSMSFilter: SettingSMSEntity = new SettingSMSEntity();
  public userLinks = userLinks;
  public screenigComponents = screenigComponents;
  public configScreenComponent = configScreenComp;
  public configCollectionParticipants = configCollectionParticipants;
  public configDocProd = configDocProd;
  public stepTap = stepTap;
  public configJournalEntryType = configJournalEntryType;
  public activationKey = null;
  public expiryDate = null;
  public today = new Date();
  public testExpiryDate: boolean;
  public newApplicationProcess = AcmConstants.NEW_LOAN_APPLICATION;
  public showInputs = false;
  public cbsApiList : string[]=['Add Customer','Add Loan','Approve Loan','Disburse Loan','Add Guarantor','Add Collateral','Updata Loan', 'Update Customer'];
  public udfGroups: UserDefinedFieldGroupEntity[] = [];
  public providerFields : any[] = [];

  public licenceAutomaticStep: boolean = false;

  constructor(public settingsService: SettingsService,
    public formBuilder: FormBuilder,
    public modalService: NgbModal,
    public library: FaIconLibrary,
    public devToolsServices: AcmDevToolsServices,
    public translate: TranslateService,
    public sharedService: SharedService,
    public udfService: UdfService,
    private settingService : SettingsService
  ) { }

  async ngOnInit() {


    /** Fetch Providers Names */
    let keys = ['PROVIDER_THIRD_PARTY'];
    this.settingService.getEnvirementValueByKeys(keys).subscribe(res => {
      let index = 1;
      res.forEach(provider => {
        let obj = {'id' : index++ , 'name' : provider.value };
        this.providerFields.push(obj);
      })
    })

    this.activationKey = this.sharedService.getActivationKey().filter(item => item === AcmConstants.JOURNAL_ENTRY_MODULE);
    this.expiryDate = this.sharedService.getActivationKey().filter(item => item.includes('EXPIRYDATE'))[0].split(':')[1];
    if (this.expiryDate) {
      this.expiryDate = new Date(this.expiryDate.substring(4), this.expiryDate.substring(2, 4) - 1, this.expiryDate.substring(0, 2))
      this.testExpiryDate = this.expiryDate > this.today;
    }
    const newLoanApplicationStepParam: StepEntity = new StepEntity();
    newLoanApplicationStepParam.productId = this.productEntity.id;

    newLoanApplicationStepParam.process = this.mode === 'TOPUP'
      ? AcmConstants.TOPUP
      : AcmConstants.NEW_LOAN_APPLICATION;
    newLoanApplicationStepParam.enabled = true;
    
    if(this.mode === 'TOPUP'){
      await this.topupStepList(newLoanApplicationStepParam);
    }else {
      await this.newLoanAppStepList(newLoanApplicationStepParam);
    }
    this.getChargeFees();
    this.getDocuments();
    this.getApplicationFees();
    
    this.getTemplateSMS();
    const environnementsByKeys: string[] = ["LICENCE_AUTOMATIC_STEP"]
    await this.settingsService.getEnvirementValueByKeys(environnementsByKeys).subscribe((environments) => {

      if (environments[0].value === 'activated') {
        this.licenceAutomaticStep = true;
      }
    });
    const environnementsByKey: string[] = [AcmConstants.SERVICE_SMS];
    this.settingsService.getEnvirementValueByKeys(environnementsByKey).subscribe((environments) => {

      if (environments[0].enabled) {
        this.serviceSMS = true;
      }
    });

    this.getUdfGroups()
  }

  getApplicationFees() {
    this.settingsService.getApplicationFees().subscribe(res => {
      this.applicationFeesByProduct =
        res.filter((objet, index, self) =>
          index === self.findIndex((o) => o.cufeeID === objet.cufeeID)
        );
    });
  }

  getChargeFees() {
    let chargeFeeParam = new SettingChargeFeeEntity();
    chargeFeeParam.feeTypes = ['normal_fees'];
    this.settingsService.findSettingChargeFee(chargeFeeParam).toPromise().then(res => {
      this.chargeFees = res;
    });
    chargeFeeParam = new SettingChargeFeeEntity();
    chargeFeeParam.feeIds = this.productEntity.productDetailsDTOs[0]?.disbursmentFeesSetting.split(";").map(Number);
    this.settingsService.findSettingChargeFee(chargeFeeParam).toPromise().then(res => {
      this.disbFeesList = res;
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (
      changes.productEntity !== undefined &&
      changes.productEntity.currentValue !== changes.productEntity.previousValue
    ) {
      const newLoanApplicationStepParam: StepEntity = new StepEntity();
      newLoanApplicationStepParam.productId = this.productEntity.id;

      newLoanApplicationStepParam.process = this.mode === 'TOPUP'
      ? AcmConstants.TOPUP
      : AcmConstants.NEW_LOAN_APPLICATION;

      newLoanApplicationStepParam.enabled = true; 
      await this.newLoanAppStepList(newLoanApplicationStepParam);
    }
  }

  getTemplateSMS() {
    this.settingSMSFilter.category = AcmConstants.LOAN
    this.settingsService.findAllSettingSMS(this.settingSMSFilter).subscribe((data) => {
      this.settingSMS = data;
    });
  }

  getDocuments() {
    this.settingDocumentProduct.productId = this.productEntity.id;
    const settingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentTypeEntity.categorie = 4;
    settingDocumentTypeEntity.enabled = true;

    // get documents Loan by product
    const settingLoanDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingLoanDocumentTypeEntity.enabled = true;
    this.settingDocumentProduct.settingDocumentTypeDTO =
      settingLoanDocumentTypeEntity;
    this.settingsService
      .findAllDocumentProduct(this.settingDocumentProduct)
      .subscribe((data) => {
        this.settingLoanDocumentsByProduct = data.filter(
          (val) =>
            // get only document loan, customer and assign document
            val.settingDocumentTypeDTO.categorie === 0 ||
            val.settingDocumentTypeDTO.categorie === 2 ||
            val.settingDocumentTypeDTO.categorie === 1
        );
      });
  }

  async newLoanAppStepList(newLoanApplicationStepParam: StepEntity) {
    await this.settingsService.findWorkFlowSteps(newLoanApplicationStepParam).toPromise().then((steps) => {
      this.newLoanApplicationSteps = steps;
      steps.forEach((step) => {
        if (step.stepType === AcmConstants.GROUP) {
          step.groupSetting = new GroupeEntity();
          step.groupSetting.code = step.groupCode;
          step.groupSetting.libelle = step.userGroup;
        }
        if (step.readyForDisb === true) {
          this.readyForDisbCheckedForLoanApp = true;
        }
        if (step.approvalConditions === true) {
          this.approvalConditionCheckedForLoanApp = true;
        }
        if (step.checkMezaCard === true) {
          this.mezaCardCheckedForLoanApp = true;
        }
        if (step.checkFees === true) {
          this.feesCheckedForLoanApp = true;
        }
        if (step.activeTimerLoan === true) {
          this.loanTimerCheckedForLoanApp = true;
        }
      });
      for (let i = 0; i < steps.length; i++) {
        this.newLoanApplicationExpands[i] = false;

        if (this.newLoanApplicationSteps[i].screeningComponent !== null) {
          this.screenigComponents.forEach((value) => {
            if (
              this.newLoanApplicationSteps[i].screeningComponent.includes(
                value.codeScreenigComponent
              )
            ) {
              const objectToAdd: any[] = [];
              objectToAdd.push(value);
              this.selectedScreenComponents[i] = objectToAdd.concat(
                this.selectedScreenComponents[i]
              );
            }
          });
          this.selectedScreenComponents[i] = this.filterAndRemoveDuplicates(this.selectedScreenComponents[i]);
        } else {
          this.selectedScreenComponents[i] = [];
        }
      }
    });
  }

  async topupStepList(topupStepParam : StepEntity){
    await this.settingsService.findWorkFlowSteps(topupStepParam).toPromise().then((steps) => {
      steps.forEach((step) => {
        if (step.stepType === AcmConstants.GROUP) {
          step.groupSetting = new GroupeEntity();
          step.groupSetting.code = step.groupCode;
          step.groupSetting.libelle = step.userGroup;
        }
        if (step.readyForDisb === true) {
          this.readyForDisbCheckedForLoanApp = true;
        }
        if (step.approvalConditions === true) {
          this.approvalConditionCheckedForLoanApp = true;
        }
      });
      this.newLoanApplicationSteps = steps;
      for (let i = 0; i < steps.length; i++) {
        this.newLoanApplicationExpands[i] = false;
        if (this.newLoanApplicationSteps[i].screeningComponent !== null) {
          this.screenigComponents.forEach((value) => {
            if (
              this.newLoanApplicationSteps[i].screeningComponent.includes(
                value.codeScreenigComponent
              )
            ) {
              const objectToAdd: any[] = [];
              objectToAdd.push(value);
              this.selectedScreenComponents[i] = objectToAdd.concat(
                this.selectedScreenComponents[i]
              );
            }
          });
          this.selectedScreenComponents[i]= this.filterAndRemoveDuplicates(this.selectedScreenComponents[i]);
        } else {
          this.selectedScreenComponents[i] = [];
        }
      }
    });
  }

  filterAndRemoveDuplicates(list: any[]) {
    const uniqueComponents: any[] = [];

    list.forEach(component => {
      if (component !== undefined) {
        const exists = uniqueComponents.some(
          c =>
            c.nameScreenigComponent === component.nameScreenigComponent &&
            c.codeScreenigComponent === component.codeScreenigComponent
        );

        if (!exists) {
          uniqueComponents.push(component);
        }
      }

    });
    return uniqueComponents;
  }

  getListOfScreen(event: any, i: number) {
    let screenComp = '';
    const { value } = event;
    value.forEach((v) => {
      screenComp +=
        (screenComp.length > 0 ? ',' : '') + v.codeScreenigComponent;
    });
    this.newLoanApplicationSteps[i].screeningComponent = screenComp;
  }

  changeReadyForDisbursement(event, process: string) {
    // disable/enable ready for disbursement checkbox in the other steps =>
    // so that only one step can be checked (ready for disbursement checkbox)
    if (process == AcmConstants.NEW_LOAN_APPLICATION)
      this.readyForDisbCheckedForLoanApp = event.checked;
  }


  changeActivatedTimer(event, process: string) {
    // disable/enable activate timer checkbox in the other steps =>
    // so that only one step can be checked ( activate timer)
    if (process == AcmConstants.NEW_LOAN_APPLICATION)
      this.loanTimerCheckedForLoanApp = event.checked;
  }

  changeApprovalConditions(event, process: string) {
    // disable/enable ready for disbursement checkbox in the other steps =>
    // so that only one step can be checked (ready for disbursement checkbox)
    if (process == AcmConstants.NEW_LOAN_APPLICATION)
      this.approvalConditionCheckedForLoanApp = event.checked;

    if (process == AcmConstants.TOPUP)
      this.approvalConditionCheckedForLoanApp = event.checked;
  }

  changeCheckMezaCard(event, process: string) {
    // disable/enable ready for disbursement checkbox in the other steps =>
    // so that only one step can be checked (ready for disbursement checkbox)
    if (process == AcmConstants.NEW_LOAN_APPLICATION)
      this.mezaCardCheckedForLoanApp = event.checked;
  }

  changeCheckFees(event, process: string, newLoanApplicationStep) {
    // disable/enable ready for disbursement checkbox in the other steps =>
    // so that only one step can be checked (ready for disbursement checkbox)
    if (process == AcmConstants.NEW_LOAN_APPLICATION)
      this.feesCheckedForLoanApp = event.checked;
    if (event.checked == false) {
      newLoanApplicationStep.lstFees = [];
      newLoanApplicationStep.lstFeesListValue = [];
    }

  }

  addStep(process: string) {
    const newStep = new StepEntity();
    newStep.productId = this.productEntity.id;
    newStep.enabled = false;
    newStep.amount = 0;
    newStep.minAmount = 0;
    if (process == AcmConstants.NEW_LOAN_APPLICATION || process == AcmConstants.TOPUP ) {
      newStep.order = this.newLoanApplicationSteps.length;
      this.newLoanApplicationSteps.push(newStep);
      this.newLoanApplicationExpands[this.newLoanApplicationSteps.length - 1] = true;
    }
  }

  drop(event: CdkDragDrop<string[]>, process: string) {
    let steps, expands;
    if (process == AcmConstants.NEW_LOAN_APPLICATION || process == AcmConstants.TOPUP) {
      steps = this.newLoanApplicationSteps;
      expands = this.newLoanApplicationExpands;

    }
    moveItemInArray(steps, event.previousIndex, event.currentIndex);
    for (let i = 0; i < steps.length; i++) {
      steps[i].order = i;
    }
    moveItemInArray(expands, event.previousIndex, event.currentIndex);
    if (event.currentIndex === 0 && (steps[0].previousStep == -1 || steps[0].previousStep == -2))
      steps[0].previousStep = null

  }

  deleteStep(index: number) {
    this.newLoanApplicationSteps.splice(index, 1);
    this.newLoanApplicationExpands.splice(index, 1);
  }

  toggleCollapse(index: number, process: string) {
    if (process == AcmConstants.NEW_LOAN_APPLICATION)
      this.newLoanApplicationExpands[index] = !this.newLoanApplicationExpands[index];

    if (process == AcmConstants.TOPUP)
      this.newLoanApplicationExpands[index] = !this.newLoanApplicationExpands[index];
  }

  stepTypeChanged(process: string, i: number) {
    if (process == AcmConstants.NEW_LOAN_APPLICATION) {
      if (this.newLoanApplicationSteps[i].stepType !== 'group') {
        this.newLoanApplicationSteps[i].groupSetting = null;
      }
    }else  if (process == AcmConstants.TOPUP){
      if (this.newLoanApplicationSteps[i].stepType !== 'group') {
        this.newLoanApplicationSteps[i].groupSetting = null;
      }
    }
  }

  compareGroup(group1, group2) {
    if (group1 && group2) {
      return group1.code === group2.code;
    }
  }

  previousSteps(steps: StepEntity[], i: number): StepEntity[] {
    return steps.slice(0, i);
  }

  /*** Methode save Loan Steps Process */
  async saveProcess(process: string) {
    let isEmptyStepNameNewLoanApplication = false;
    let furtherStep = false;
    let grp: GroupeEntity;
    this.newLoanApplicationSteps.forEach((cls) => {
      if (cls.stepType === AcmConstants.GROUP) {
        if (cls.groupSetting === null || cls.groupSetting === undefined)
          furtherStep = true;
        grp = cls.groupSetting;
      } else if (cls.stepType === AcmConstants.LINK) {
        if (cls.previousStep === null || cls.previousStep === undefined)
          furtherStep = true;
      }
      if (cls.rejectionCondition == "null" || cls.rejectionCondition == "undefined") {
        cls.rejectionCondition = null;
      }
      if (cls.acceptationCondition == "null" || cls.acceptationCondition == "undefined") {
        cls.acceptationCondition = null;
      }
    });


    const hasEmptyStep = this.newLoanApplicationSteps.some(({
      stepName = '', stepType = null, screen = null, codeStatutLoan = '' }) => {
      if (!stepName || !stepType || !screen || !codeStatutLoan) {
        this.devToolsServices.openToast(3, 'alert.check-data');
        isEmptyStepNameNewLoanApplication = true;
        return true;
      }
    });

    if (hasEmptyStep || furtherStep) {
      return;
    }

    if (isEmptyStepNameNewLoanApplication === false) {
      let amountValid = true;
      let stepTypeValid = true;
      let conditionValid = true;
      // check amount + step type
      let processToSave: StepEntity[] = [];
      switch (process) {
        case AcmConstants.NEW_LOAN_APPLICATION: {
          this.newLoanApplicationSteps.forEach((step) => {
            step.lstFeesListValue = [];
            step.process = process;
            if (
              step.stepType === AcmConstants.GROUP &&
              step.groupSetting !== undefined &&
              grp !== undefined
            ) {
              step.userGroup = step.groupSetting.libelle;
              step.groupCode = step.groupSetting.code;
            }
            if (step.minAmount === undefined || step.minAmount === null || step.minAmount <= 0) {
              this.devToolsServices.openToast(1, 'alert.error_amount');
              amountValid = false;
            }
            if (step.maxAmount === undefined || step.maxAmount === null || step.maxAmount < step.minAmount || step.maxAmount === 0) {
              this.devToolsServices.openToast(1, 'alert.error_amount');
              amountValid = false;
            }
            if (step.stepType === undefined) {
              this.devToolsServices.openToast(1, 'alert.check-data');
              stepTypeValid = false;
            }

            if(step.disbursmentFeesList?.length > 0){
              step.disbursmentFeesList.map((item) => step.disbursmentFees = step.disbursmentFees + item.id + ";")
            }
            else {
              step.disbursmentFees = null;
            }
            
          });


          this.settingWorkflowStepConditionsComponent.forEach(stepConditions => {

            let settingWorkFlowStepConditions: SettingWorkFlowStepConditions[] = [];
            stepConditions.stepConditionForms.forEach(stepConditionForm =>{
              if(stepConditionForm.valid){
                let settingStepCondition: SettingWorkFlowStepConditions = new SettingWorkFlowStepConditions();
                //settingStepCondition.id = stepConditionForm.controls.id.value;
                settingStepCondition.idWorkflowStep = stepConditions.idWorkflowStep;
                if(stepConditionForm.controls.idGroup.value === AcmConstants.CUSTOMER_ENTITY){
                  settingStepCondition.entityName = stepConditionForm.controls.idGroup.value;
                  settingStepCondition.fieldName= stepConditionForm.controls.fieldName.value;
                  settingStepCondition.idUserDefinedFields = null;
                }
                else {
                  settingStepCondition.idUserDefinedFieldGroup = stepConditionForm.controls.idGroup.value;
                  settingStepCondition.idUserDefinedFields = stepConditionForm.controls.idField.value;
                }
                settingStepCondition.operator = stepConditionForm.controls.operator.value;
                settingStepCondition.value= stepConditionForm.controls.value.value;
                settingStepCondition.minValue= stepConditionForm.controls.minValue.value;
                settingStepCondition.maxValue= stepConditionForm.controls.maxValue.value;

                settingWorkFlowStepConditions.push(settingStepCondition);
              }else{
                 this.devToolsServices.openToast(3, 'alert.check-data');
                conditionValid= false;
              }
            });

            this.newLoanApplicationSteps.filter(item => item.idWorkFlowStep === stepConditions.idWorkflowStep)
              .map(item => item.settingWorkFlowStepConditions = settingWorkFlowStepConditions);

          });



          this.udfStepWorkflowSettingComponent.forEach(stepUdf => {
            let workflowStepUdfGroups: WorkflowStepUdfGroupeEntity[] = [];
            // Add Workflow groups
            stepUdf.udfForm.value.udfGroups.forEach(group => {
              let groupMandatory = false;
              // Add fields of each group
              group.udfFields.forEach(field => {
                if (field.mandatory) {
                  groupMandatory = true
                }
                let workflowStepUdf: WorkflowStepUdfGroupeEntity = {
                  idWorkFlowStepUdfGroup: null,
                  idUserDefinedFieldGroup: parseInt(group.udfGroup),
                  idWorkflowStep: stepUdf.idWorkflowStep,
                  idUserDefinedFields: field.id,
                  idCollectionStep: null,
                  mandatory: field.mandatory,
                  displayInIB : group.displayInIB
                }
                workflowStepUdfGroups.push(workflowStepUdf)
              });
              if(group.udfGroup){
                let workflowStepUdf: WorkflowStepUdfGroupeEntity = {
                  idWorkFlowStepUdfGroup: null,
                  idUserDefinedFieldGroup: parseInt(group.udfGroup),
                  idWorkflowStep: stepUdf.idWorkflowStep,
                  idUserDefinedFields: null,
                  idCollectionStep: null,
                  // set the udf group as required if (group.mandatory = true OR theres is at least one required field in this group)
                  mandatory: groupMandatory || group.udfGroupMandatory,
                  displayInIB : group.displayInIB
                }
                workflowStepUdfGroups.push(workflowStepUdf)
              }
            });

            // Set workflowStepUdfGroupe of each step
            this.newLoanApplicationSteps.filter(item => item.idWorkFlowStep === stepUdf.idWorkflowStep)
              .map(item => item.workflowStepUdfGroupe = workflowStepUdfGroups);
          })

          processToSave = this.newLoanApplicationSteps;

          break;
        };
        case AcmConstants.TOPUP: {
          this.newLoanApplicationSteps.forEach((step) => {
            if (
              step.stepType === AcmConstants.GROUP &&
              step.groupSetting !== undefined &&
              grp !== undefined
            ) {
              step.userGroup = step.groupSetting.libelle;
              step.groupCode = step.groupSetting.code;
            }
            step.process = process;
            if (step.minAmount === undefined || step.minAmount === null || step.minAmount <= 0) {
              this.devToolsServices.openToast(1, 'alert.error_amount');
              amountValid = false;
            }
            if (step.maxAmount === undefined || step.maxAmount === null || step.maxAmount < step.minAmount || step.maxAmount === 0) {
              this.devToolsServices.openToast(1, 'alert.error_amount');
              amountValid = false;
            }
            if (step.stepType === undefined) {
              this.devToolsServices.openToast(1, 'alert.check-data');
              stepTypeValid = false;
            }
            
            if(step.disbursmentFeesList.length > 0){
              step.disbursmentFeesList.map((item) => step.disbursmentFees = step.disbursmentFees + item.id + ";")
            }
            else {
              step.disbursmentFees = null;
            }

          });


          this.udfStepWorkflowSettingComponent.forEach(stepUdf => {
            let workflowStepUdfGroups: WorkflowStepUdfGroupeEntity[] = [];
            // Add Workflow groups
            stepUdf.udfForm.value.udfGroups.forEach(group => {
              let groupMandatory = false;
              // Add fields of each group
              group.udfFields.forEach(field => {
                if (field.mandatory) {
                  groupMandatory = true
                }
                let workflowStepUdf: WorkflowStepUdfGroupeEntity = {
                  idWorkFlowStepUdfGroup: null,
                  idUserDefinedFieldGroup: parseInt(group.udfGroup),
                  idWorkflowStep: stepUdf.idWorkflowStep,
                  idUserDefinedFields: field.id,
                  idCollectionStep: null,
                  mandatory: field.mandatory,
                  displayInIB : null
                }
                workflowStepUdfGroups.push(workflowStepUdf)
              });
              let workflowStepUdf: WorkflowStepUdfGroupeEntity = {
                idWorkFlowStepUdfGroup: null,
                idUserDefinedFieldGroup: parseInt(group.udfGroup),
                idWorkflowStep: stepUdf.idWorkflowStep,
                idUserDefinedFields: null,
                idCollectionStep: null,
                mandatory: groupMandatory || group.udfGroupMandatory,
                displayInIB : null
              }
              workflowStepUdfGroups.push(workflowStepUdf)

            });

            // Set workflowStepUdfGroupe of each step
            this.newLoanApplicationSteps.filter(item => item.idWorkFlowStep === stepUdf.idWorkflowStep)
              .map(item => item.workflowStepUdfGroupe = workflowStepUdfGroups);
          })


          processToSave = this.newLoanApplicationSteps;
          break;
        }
      }
      if (amountValid && stepTypeValid && conditionValid) {
        this.settingsService.saveApprovalSteps(processToSave, this.productEntity.id, process).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
        });
      }
    }
  }

  checkBoxCheckers(newLoanApplicationStep: StepEntity) {
    if (parseInt(newLoanApplicationStep.codeStatutLoan) !== stepTap[3].tapValue) {
      newLoanApplicationStep.approvalConditions = false;
      newLoanApplicationStep.readyForDisb = false;
    }

    if (parseInt(newLoanApplicationStep.codeStatutLoan) !== stepTap[2].tapValue || parseInt(newLoanApplicationStep.codeStatutLoan) !== stepTap[1].tapValue) {
      newLoanApplicationStep.checkMezaCard = false;
    }

    this.approvalConditionCheckedForLoanApp = !!this.newLoanApplicationSteps.find(res => res.approvalConditions === true);
    this.readyForDisbCheckedForLoanApp = !!this.newLoanApplicationSteps.find(res => res.readyForDisb === true);
    this.loanTimerCheckedForLoanApp = !!this.newLoanApplicationSteps.find(res => res.activeTimerLoan === true);
    this.mezaCardCheckedForLoanApp = !!this.newLoanApplicationSteps.find(res => res.checkMezaCard === true);
    this.feesCheckedForLoanApp = !!this.newLoanApplicationSteps.find(res => res.checkFees === true);

  }

  /*** Methode open duplicate step */
  duplicateStep(content, typeProduct: string) {
    this.comfirmStatus = false;
    this.productType = typeProduct;
    this.duplicateGroup = null;
    this.productEntityForDuplicate = null;
    this.duplicateGroup = this.formBuilder.group({
      productValues: new FormControl(this.productEntitys, Validators.required),
      confirm: new FormControl('', Validators.required),
    });
    this.duplicateGroup.reset();
    this.modalService.open(content, {
      size: 'md',
    });
  }

  /**
   * changeChecboxReject
   */
  changeChecboxReject() {
    if (this.comfirmStatus === false) {
      this.comfirmStatus = true;
    } else {
      this.comfirmStatus = false;
      this.duplicateGroup.controls.confirm.setValue('');
    }
  }

  /*** Get Direction */
  getDirection() {
    return AppComponent.direction;
  }

  /*** get target step for duplication */
  onSubmit() {
    if (this.duplicateGroup.valid) {
      this.approvalConditionCheckedForLoanApp = false;
      this.readyForDisbCheckedForLoanApp = false;
      this.loanTimerCheckedForLoanApp = false;
      this.mezaCardCheckedForLoanApp = false;
      this.feesCheckedForLoanApp = false;
      const StepParam: StepEntity = new StepEntity();
      StepParam.productId = this.productEntityForDuplicate.id;
      StepParam.enabled = true;
      if (this.productType === 'NEW_APPLICATION') {
        StepParam.process = AcmConstants.NEW_LOAN_APPLICATION;
        this.settingsService.findWorkFlowSteps(StepParam).subscribe((steps) => {
          steps.forEach((step) => {
            if (step.stepType === AcmConstants.GROUP) {
              step.groupSetting = new GroupeEntity();
              step.groupSetting.code = step.groupCode;
              step.groupSetting.libelle = step.userGroup;
            }

            if (step.approvalConditions) this.approvalConditionCheckedForLoanApp = true;
            if (step.readyForDisb) this.readyForDisbCheckedForLoanApp = true;
            if (step.activeTimerLoan) this.loanTimerCheckedForLoanApp = true;
            if (step.checkMezaCard) this.mezaCardCheckedForLoanApp = true;
            if (step.checkFees) this.feesCheckedForLoanApp = true;

          });
          this.newLoanApplicationSteps = steps;
          this.newLoanApplicationSteps.sort((step1, step2) => {
            return step1.order - step2.order;
          });
          for (let i = 0; i < steps.length; i++) {
            this.newLoanApplicationExpands[i] = false;
          }
          this.newLoanApplicationSteps.forEach(
            (item) => (item.productId = this.productEntity.id)
          );
        });
      }else if (this.productType === 'TOPUP' && this.mode == 'TOPUP') {
        StepParam.process = AcmConstants.TOPUP;
        StepParam.productId = this.productEntityForDuplicate.id;
        this.settingsService.findWorkFlowSteps(StepParam).subscribe((steps) => {
          steps.forEach((step) => {
            if (step.stepType === AcmConstants.GROUP) {
              step.groupSetting = new GroupeEntity();
              step.groupSetting.code = step.groupCode;
              step.groupSetting.libelle = step.userGroup;
            }

            if (step.approvalConditions) this.approvalConditionCheckedForLoanApp = true;
            if (step.readyForDisb) this.readyForDisbCheckedForLoanApp = true;
          });
          this.newLoanApplicationSteps = steps;
          this.newLoanApplicationSteps.sort((step1, step2) => {
            return step1.order - step2.order;
          });
          for (let i = 0; i < steps.length; i++) {
            this.newLoanApplicationExpands[i] = false;
          }
          this.newLoanApplicationSteps.forEach(
            (item) => (item.productId = this.productEntity.id)
          );
        });
      }
      this.modalService.dismissAll();
    }
  }

  ngOnDestroy(): void {
    // console.log('Loan Steps Component Destroyed')
  }

  showInputsMethod(checked: boolean, newLoanApplicationStep: StepEntity) {
    this.showInputs = checked;
    if (!checked) {
      newLoanApplicationStep.acceptationCondition = null;
      newLoanApplicationStep.rejectionCondition = null;
      newLoanApplicationStep.minScoreAccepted = null;
      newLoanApplicationStep.minScoreRejected = null;
      newLoanApplicationStep.maxScoreAccepted = null;
      newLoanApplicationStep.maxScoreRejected = null;

    }
  }

  clearSelection(i: number) {
    if (this.newLoanApplicationSteps[i].ibScreen === '') {
      this.newLoanApplicationSteps[i].ibScreen = null;
    }
  }

  getUdfGroups() {
    const udfGroup = new UserDefinedFieldGroupEntity();
    udfGroup.category = "customer";
    this.udfService.getUdfGroup(udfGroup).toPromise().then(
      (data) => {
        this.udfGroups = data;
      });
  } 
  onChangeCbsApi( stepEntity : StepEntity,event : any){
    if(stepEntity.cbsApi !== null) {
      stepEntity.cbsApi = stepEntity.cbsApi.concat(event.itemValue+',');
    }
    else {
      stepEntity.cbsApi = event.itemValue+',' ;
    }
     
  }
}

