import { AcmConstants } from 'src/app/shared/acm-constants';
import { Component,OnInit,OnChanges,SimpleChanges, Input, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SettingDocumentTypeProductEntity } from 'src/app/shared/Entities/settingDocumentTypeProduct.entity';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SettingsService } from '../../settings.service';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { HabilitationIhmRouteEntity } from 'src/app/shared/Entities/habilitationIhmRoute.entity';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { TranslateService } from '@ngx-translate/core';
import { configCollectionParticipants, configDocTopupProd, configScreenComp, screenigComponents, stepTap, userLinks } from '../shared-setting-workflow';
import { AppComponent } from 'src/app/app.component';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { WorkflowStepUdfGroupeEntity } from 'src/app/shared/Entities/WorkflowStepUdfGroupe.entity';
import { UdfStepWorkflowSettingComponent } from '../../udf-step-workflow-setting/udf-step-workflow-setting.component';
import { SettingSMSEntity } from 'src/app/shared/Entities/SettingSMS.entity';

@Component({
  selector: 'app-setting-topup-step',
  templateUrl: './setting-topup-step.component.html',
  styleUrls: ['./setting-topup-step.component.sass']
})
export class SettingTopupStepComponent implements OnInit,OnChanges,OnDestroy {

  @Input() productEntity: ProductEntity;
  @Input() productEntitys: ProductEntity[];
  @Input() groupEntities : GroupeEntity[];
  @Input() optionsGroupUsers: GroupeEntity[] = [];
  @Input() ihmRoot: HabilitationIhmRouteEntity[];

  @ViewChildren(UdfStepWorkflowSettingComponent) udfStepWorkflowSettingComponent: QueryList<UdfStepWorkflowSettingComponent>;

  public selectedScreenComponentsTopup: any[] = [];
  public topupSteps: StepEntity[] = [];
  public settingLoanDocumentsByProduct: SettingDocumentTypeProductEntity[] = [];
  public topupExpands: boolean[] = [];
  public settingSMS: SettingSMSEntity[] = [];
  public readyForDisbCheckedForTopup : Boolean;
  public approvalConditionCheckedForTopup :Boolean = false;
  public comfirmStatus = false;
  public productType: string;
  public duplicateGroup: FormGroup;
  public productEntityForDuplicate = new ProductEntity();
  public topupProcess = AcmConstants.TOPUP;
  public settingSMSFilter :  SettingSMSEntity = new  SettingSMSEntity() ;
  public userLinks = userLinks;
  public screenigComponents = screenigComponents;
  public configScreenComponent = configScreenComp;
  public configCollectionParticipants = configCollectionParticipants;
  public stepTap = stepTap;
  public configDocTopupProd = configDocTopupProd;
  public serviceSMS:Boolean = false;

  public settingDocumentProduct: SettingDocumentTypeProductEntity = new SettingDocumentTypeProductEntity();

  constructor(public settingsService : SettingsService,
              public formBuilder : FormBuilder,
              public modalService: NgbModal,
              public library : FaIconLibrary,
              public devToolsServices: AcmDevToolsServices,
              public translate: TranslateService) { }

 async ngOnInit() {
      const topupStepParam: StepEntity = new StepEntity();
      topupStepParam.productId = this.productEntity.id;
      topupStepParam.process = AcmConstants.TOPUP;
      topupStepParam.enabled = true;
      this.topupStepList(topupStepParam);
      this.getDocuments();
      this.getTemplateSMS();
      const environnementsByKeys: string[] = [AcmConstants.SERVICE_SMS];
      await this.settingsService.getEnvirementValueByKeys(environnementsByKeys).subscribe((environments) => {
        if (environments[0].enabled) {
          this.serviceSMS=true;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.productEntity !== undefined &&
      changes.productEntity.currentValue !== changes.productEntity.previousValue
    ) {
      const topupStepParam: StepEntity = new StepEntity();
      topupStepParam.productId = this.productEntity.id;
      topupStepParam.process = AcmConstants.TOPUP;
      topupStepParam.enabled = true;
      this.topupStepList(topupStepParam);
    }
  }

  getDocuments(){
    this.settingDocumentProduct.productId = this.productEntity.id;
    const settingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentTypeEntity.categorie = 4;
    settingDocumentTypeEntity.enabled = true;

    // get documents Loan by product (USED IN TOPUP STEPS)
    const settingLoanDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingLoanDocumentTypeEntity.enabled = true;
    this.settingDocumentProduct.settingDocumentTypeDTO = settingLoanDocumentTypeEntity;
    this.settingsService.findAllDocumentProduct(this.settingDocumentProduct).subscribe((data) => {
        this.settingLoanDocumentsByProduct = data.filter(
          (val) =>
            val.settingDocumentTypeDTO.categorie === 0
            || val.settingDocumentTypeDTO.categorie === 2
            ||val.settingDocumentTypeDTO.categorie === 1
        );
      });
  }
  getTemplateSMS() {
    this.settingSMSFilter.category=AcmConstants.TOPUP
    this.settingsService.findAllSettingSMS(this.settingSMSFilter).subscribe((data) => {
      this.settingSMS = data;
    });}
  topupStepList(topupStepParam : StepEntity){
    this.settingsService.findWorkFlowSteps(topupStepParam).subscribe((steps) => {
      steps.forEach((step) => {
        if (step.stepType === AcmConstants.GROUP) {
          step.groupSetting = new GroupeEntity();
          step.groupSetting.code = step.groupCode;
          step.groupSetting.libelle = step.userGroup;
        }
        if (step.readyForDisb === true) {
          this.readyForDisbCheckedForTopup = true;
        }
        if (step.approvalConditions === true) {
          this.approvalConditionCheckedForTopup = true;
        }
      });
      this.topupSteps = steps;
      for (let i = 0; i < steps.length; i++) {
        this.topupExpands[i] = false;
        if (this.topupSteps[i].screeningComponent !== null) {
          this.screenigComponents.forEach((value) => {
            if (
              this.topupSteps[i].screeningComponent.includes(
                value.codeScreenigComponent
              )
            ) {
              const objectToAdd: any[] = [];
              objectToAdd.push(value);
              this.selectedScreenComponentsTopup[i] = objectToAdd.concat(
                this.selectedScreenComponentsTopup[i]
              );
            }
          });
          this.selectedScreenComponentsTopup[i]= this.filterAndRemoveDuplicates(this.selectedScreenComponentsTopup[i]);
        } else {
          this.selectedScreenComponentsTopup[i] = [];
        }
      }


    });
  }

  filterAndRemoveDuplicates(list: any[]) {
    const uniqueComponents: any[] = [];

    list.forEach(component => {
      if(component!==undefined)
      {
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

  getListOfScreenTopup(event: any, i: number) {
  let screenComp = '';
  const { value } = event;
  value.forEach((v) => {
    screenComp +=
      (screenComp.length > 0 ? ',' : '') + v.codeScreenigComponent;
  });
  this.topupSteps[i].screeningComponent = screenComp;
  }

  changeApprovalConditions(event, process: string) {
    // disable/enable ready for disbursement checkbox in the other steps =>
    // so that only one step can be checked (ready for disbursement checkbox)
    if (process == AcmConstants.TOPUP)
      this.approvalConditionCheckedForTopup = event.checked;
  }

  changeReadyForDisbursement(event, process: string) {
    // disable/enable ready for disbursement checkbox in the other steps =>
    // so that only one step can be checked (ready for disbursement checkbox)
    if (process == AcmConstants.TOPUP)
    this.readyForDisbCheckedForTopup = event.checked;
  }

  addStep(process: string) {
    const newStep = new StepEntity();
    newStep.productId = this.productEntity.id;
    newStep.enabled = false;
    newStep.amount = 0;
    newStep.minAmount = 0;
    if (process == AcmConstants.TOPUP){
      newStep.order = this.topupSteps.length;
      this.topupSteps.push(newStep);
      this.topupExpands[this.topupSteps.length - 1] = true;
      }
  }

  drop(event: CdkDragDrop<string[]>, process: string) {
    let steps, expands;
    if(process == AcmConstants.TOPUP){
      steps = this.topupSteps;
      expands = this.topupExpands;
    }
    moveItemInArray(steps, event.previousIndex, event.currentIndex);
    for (let i = 0; i < steps.length; i++) {
      steps[i].order = i;
    }
    moveItemInArray(expands, event.previousIndex, event.currentIndex);
    if (event.currentIndex===0 &&(steps[0].previousStep==-1 || steps[0].previousStep==-2))
    steps[0].previousStep = null
  }

  deleteStep(index: number) {
    this.topupSteps.splice(index, 1);
    this.topupExpands.splice(index, 1);
  }

  toggleCollapse(index: number, process: string) {
    if (process == AcmConstants.TOPUP)
      this.topupExpands[index] = !this.topupExpands[index];
  }

  compareGroup(group1, group2) {
    if (group1 && group2) {
      return group1.code === group2.code;
    }
  }

  stepTypeChanged(process: string, i: number) {
    if (process == AcmConstants.TOPUP){
      if (this.topupSteps[i].stepType !== 'group') {
        this.topupSteps[i].groupSetting = null;
      }
    }
  }

  previousSteps(steps: StepEntity[], i: number): StepEntity[] {
    return steps.slice(0, i);
  }

  async saveProcess(process: string) {
    const isEmptyStepNameNewLoanApplication = false;
    let isEmptyStepNameTopup = false;
    let topupStep = false;
    let grp: GroupeEntity;
    let grpTopup: GroupeEntity;

    this.topupSteps.forEach((cls) => {
      if (cls.stepType === AcmConstants.GROUP) {
        if (cls.groupSetting === null || cls.groupSetting === undefined)
          topupStep = true;
        grpTopup = cls.groupSetting;
      } else if (cls.stepType === AcmConstants.LINK) {
        if (cls.previousStep === null || cls.previousStep === undefined)
          topupStep = true;
      }
    });

    const hasEmptyStep = this.topupSteps.some(({
      stepName = '', stepType = '', screen = '', codeStatutLoan = '' }) => {
      if (!stepName || !stepType || !screen || !codeStatutLoan) {
        this.devToolsServices.openToast(3, 'alert.check-data');
        isEmptyStepNameTopup =true;
        return true;
      }
    });

    if (hasEmptyStep || topupStep) {
      return;
    }

    if (isEmptyStepNameTopup === false && isEmptyStepNameNewLoanApplication === false) {
      let amountValid = true;
      let stepTypeValid = true;
      // check amount + step type
      let processToSave: StepEntity[] = [];
      switch (process) {
        case AcmConstants.TOPUP: {
          this.topupSteps.forEach((step) => {
            if (
              step.stepType === AcmConstants.GROUP &&
              step.groupSetting !== undefined &&
              grpTopup !== undefined
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
            this.topupSteps.filter(item => item.idWorkFlowStep === stepUdf.idWorkflowStep)
              .map(item => item.workflowStepUdfGroupe = workflowStepUdfGroups);
          })


          processToSave = this.topupSteps;
          break;
        }
      }
      if (amountValid && stepTypeValid) {
        this.settingsService.saveApprovalSteps(processToSave, this.productEntity.id, process).subscribe((data) => {
            this.devToolsServices.openToast(0, 'alert.success');
          });
      }
    }
  }

  checkBoxCheckers(topupStep : StepEntity){
    if (parseInt(topupStep.codeStatutLoan) !== stepTap[3].tapValue){
      topupStep.approvalConditions = false;
      topupStep.readyForDisb = false;
    }
      this.approvalConditionCheckedForTopup = !!this.topupSteps.find(res => res.approvalConditions === true);
      this.readyForDisbCheckedForTopup = !!this.topupSteps.find(res => res.readyForDisb === true);
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
    this.modalService.open(content, { size: 'md' });
  }

  /*** Get Direction */
  getDirection() {
    return AppComponent.direction;
  }

  /*** get target step for duplication */
  onSubmit() {
    if (this.duplicateGroup.valid) {
    this.approvalConditionCheckedForTopup = false;
    this.readyForDisbCheckedForTopup = false;
      const StepParam: StepEntity = new StepEntity();
      StepParam.productId = this.productEntityForDuplicate.id;
      StepParam.enabled = true;
      if (this.productType === 'TOPUP') {
        StepParam.process = AcmConstants.TOPUP;
        StepParam.productId = this.productEntityForDuplicate.id;
        this.settingsService.findWorkFlowSteps(StepParam).subscribe((steps) => {
          steps.forEach((step) => {
            if (step.stepType === AcmConstants.GROUP) {
              step.groupSetting = new GroupeEntity();
              step.groupSetting.code = step.groupCode;
              step.groupSetting.libelle = step.userGroup;
            }

            if (step.approvalConditions) this.approvalConditionCheckedForTopup = true;
            if (step.readyForDisb) this.readyForDisbCheckedForTopup = true;
          });
          this.topupSteps = steps;
          this.topupSteps.sort((step1, step2) => {
            return step1.order - step2.order;
          });
          for (let i = 0; i < steps.length; i++) {
            this.topupExpands[i] = false;
          }
          this.topupSteps.forEach(
            (item) => (item.productId = this.productEntity.id)
          );
        });
      }
      this.modalService.dismissAll();
    }
  }

  ngOnDestroy(): void {
    // console.log('Topup Steps Component Destroyed')
  }

}
