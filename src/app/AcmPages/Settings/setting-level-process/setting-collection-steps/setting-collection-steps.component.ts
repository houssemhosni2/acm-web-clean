import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { HabilitationIhmRouteEntity } from 'src/app/shared/Entities/habilitationIhmRoute.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { SettingsService } from '../../settings.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { afterCollection, configCollectionParticipants, configDocProd, configParticipants, stepTap, userLinks } from '../shared-setting-workflow';
import { SettingJournalEntryTypeEntity } from 'src/app/shared/Entities/settingJournalEntryType.entity';
import { SettingDocumentTypeProductEntity } from 'src/app/shared/Entities/settingDocumentTypeProduct.entity';
import { AppComponent } from 'src/app/app.component';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { UdfStepWorkflowSettingComponent } from '../../udf-step-workflow-setting/udf-step-workflow-setting.component';
import { WorkflowStepUdfGroupeEntity } from 'src/app/shared/Entities/WorkflowStepUdfGroupe.entity';
import { SettingSMSEntity } from 'src/app/shared/Entities/SettingSMS.entity';
import { SettingChargeFeeEntity } from 'src/app/shared/Entities/settingChargeFee.entity';


@Component({
  selector: 'app-setting-collection-steps',
  templateUrl: './setting-collection-steps.component.html',
  styleUrls: ['./setting-collection-steps.component.sass']
})
export class SettingCollectionStepsComponent implements OnInit,OnChanges,OnDestroy {

  @Input() productEntity: ProductEntity;
  @Input() productEntitys: ProductEntity[];
  @Input() optionsGroupUsers: GroupeEntity[];
  @Input() groupEntities : GroupeEntity[];
  @Input() ihmRoot: HabilitationIhmRouteEntity[];
  @Input() journalEntryTypes : SettingJournalEntryTypeEntity[];

  @ViewChildren(UdfStepWorkflowSettingComponent) udfStepWorkflowSettingComponent: QueryList<UdfStepWorkflowSettingComponent>;


  public collectionSteps: StepEntity[] = [];
  public collectionExpands: boolean[] = [];
  public settingDocumentsByProduct: SettingDocumentTypeProductEntity[] = [];
  public chargeFees: SettingChargeFeeEntity[] = [];
  public settingSMS: SettingSMSEntity[] = [];
  public comfirmStatus : boolean;
  public productType: string;
  public duplicateGroup: FormGroup;
  public productEntityForDuplicate = new ProductEntity();
  public settingDocumentProduct: SettingDocumentTypeProductEntity = new SettingDocumentTypeProductEntity();
   public settingSMSFilter :  SettingSMSEntity = new  SettingSMSEntity() ;

  public edited : Boolean = false;

  public configDocProd = configDocProd;
  public configCollectionParticipants = configCollectionParticipants;
  public stepTap = stepTap;
  public userLinks = userLinks;
  public afterCollection = afterCollection;
  public serviceSMS:Boolean = false;
  public selectedParticipantsCollection: any[] = [];
  public configParticipants = configParticipants;


  participantsCollection: { nameParticipant: string; participantValue: number }[] = [
{
nameParticipant: this.translate.instant('legal.lawyer'),
participantValue: 1,
},
{
nameParticipant: this.translate.instant('legal.bailiff'),
participantValue: 2,
},
];


  constructor(public settingsService : SettingsService,
              public formBuilder : FormBuilder,
              public modalService: NgbModal,
              public library : FaIconLibrary,
              public devToolsServices: AcmDevToolsServices,
              public translate: TranslateService) { }

  async ngOnInit() {
    const collectionStepParam: StepEntity = new StepEntity();
      collectionStepParam.productId = this.productEntity.id;
      collectionStepParam.process = AcmConstants.COLLECTION;
      collectionStepParam.enabled = true;
      this.collectionStepList(collectionStepParam);
      this.getDocuments();
      this.getTemplateSMS();
      this.getChargeFees();
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
      const collectionStepParam: StepEntity = new StepEntity();
      collectionStepParam.productId = this.productEntity.id;
      collectionStepParam.process = AcmConstants.COLLECTION;
      collectionStepParam.enabled = true;
      this.collectionStepList(collectionStepParam);
       this.getDocuments();
      this.getTemplateSMS();
      this.getChargeFees();
    }
  }


  getTemplateSMS() {
    this.settingSMSFilter.category = AcmConstants.COLLECTION ;
    this.settingsService.findAllSettingSMS(this.settingSMSFilter).subscribe((data) => {
      this.settingSMS = data;
    });}

  getDocuments(){
    this.settingDocumentProduct.productId = this.productEntity.id;
    const settingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentTypeEntity.categorie = 4;
    settingDocumentTypeEntity.enabled = true;

    this.settingDocumentProduct.settingDocumentTypeDTO =
      settingDocumentTypeEntity;
    this.settingsService.findAllDocumentProduct(this.settingDocumentProduct).subscribe((data) => {
        this.settingDocumentsByProduct = data;
      });
  }

  collectionStepList(collectionStepParam : StepEntity){
    this.settingsService.findCollectionSteps(collectionStepParam).subscribe((steps) => {
      steps.forEach((step) => {
        if (step.stepType === AcmConstants.GROUP) {
          step.groupSetting = new GroupeEntity();
          step.groupSetting.code = step.groupCode;
          step.groupSetting.libelle = step.userGroup;
        }
      });
      this.collectionSteps = steps;
      for (let i = 0; i < steps.length; i++) {
        this.collectionExpands[i] = false;
        if (this.collectionSteps[i].typeThirdParty !== null) {
          if (this.collectionSteps[i].typeThirdParty === '1') {
            this.selectedParticipantsCollection[i] = [
              { nameParticipant: 'Lawyer', participantValue: 1 },
            ];
          } else if (this.collectionSteps[i].typeThirdParty === '2') {
            this.selectedParticipantsCollection[i] = [
              { nameParticipant: 'Bailiff', participantValue: 2 },
            ];
          } else if (
            this.collectionSteps[i].typeThirdParty === '1,2' ||
            this.collectionSteps[i].typeThirdParty === '2,1'
          ) {
            this.selectedParticipantsCollection[i] = [
              { nameParticipant: 'Bailiff', participantValue: 2 },
              { nameParticipant: 'Lawyer', participantValue: 1 },
            ];
          }
        }
      }
    });
  }

  /*** Methode add Step */
  addStep(process: string) {
    const newStep = new StepEntity();
    newStep.productId = this.productEntity.id;
    newStep.enabled = false;
    newStep.amount = 0;
    newStep.minAmount = 0;
    newStep.order = this.collectionSteps.length;
    if (process == AcmConstants.COLLECTION){
      this.collectionSteps.push(newStep);
      this.collectionExpands[this.collectionSteps.length - 1] = true;
    }
  }

  drop(event: CdkDragDrop<string[]>, process: string) {
    let steps, expands;
    if(process == AcmConstants.COLLECTION){
      steps = this.collectionSteps;
      expands = this.collectionExpands;
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
    this.collectionSteps.splice(index, 1);
    this.collectionExpands.splice(index, 1);
  }

  duplicateStep(content, typeProduct: string) {
    this.comfirmStatus = false;
    this.productType = typeProduct;
    this.duplicateGroup = null;
    this.productEntityForDuplicate = null;
    this.duplicateGroup = this.formBuilder.group({
      productValues: new FormControl(this.productEntitys,Validators.required),
      confirm: new FormControl('',Validators.required),
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

  toggleCollapse(index: number, process: string) {
    if (process == AcmConstants.COLLECTION)
    this.collectionExpands[index] = !this.collectionExpands[index];
  }

  stepTypeChanged(process: string, i: number) {
      if (process == AcmConstants.COLLECTION){
        if (this.collectionSteps[i].stepType !== 'group') {
          this.collectionSteps[i].groupSetting = null;
          this.collectionSteps[i].forceStepDelay = null;
        }
      }
  }

  compareGroup(group1, group2) {
    if (group1 && group2) {
      return group1.code === group2.code;
    }
  }

  getChargeFees() {
    this.settingsService.findAllSettingChargeFee().subscribe(res => {
      this.chargeFees = res;
    });
  }
  
  previousSteps(steps: StepEntity[], i: number): StepEntity[] {
    return steps.slice(0, i);
  }

  /*** Methode save Collection */
  async saveCollection(process: string) {
      let isEmptyStepNameCollection = false;
      let furtherStep = false;
      this.collectionSteps.forEach((cls) => {
        if (cls.stepType === AcmConstants.GROUP) {
          if (cls.groupSetting === null || cls.groupSetting === undefined)
            furtherStep = true;
        } else if (cls.stepType === AcmConstants.LINK) {
          if (cls.previousStep === null || cls.previousStep === undefined)
            furtherStep = true;
        }
      });

      const hasEmptyStep = this.collectionSteps.some(({
        stepName = '', stepType = '', screen = '', startDate = null, afterDate = '', stepTab= '' }) => {
        if (!stepName || !stepType || !screen || startDate === null || !afterDate || !stepTab) {
          this.devToolsServices.openToast(3, 'alert.check-data');
          isEmptyStepNameCollection = true;
          return true;
        }
      });

      if (hasEmptyStep || furtherStep) {
        return;
      }

      if (isEmptyStepNameCollection === false) {
        let UnpaidamountValid = true;
        let amountValid = true;
        let stepTypeValid = true;
        // check amount + step type
        let processToSave: StepEntity[] = [];
        switch (process) {
          case AcmConstants.COLLECTION: {
            this.collectionSteps.forEach((step) => {
              if (
                step.stepType === AcmConstants.GROUP &&
                step.groupSetting !== undefined
              ) {
                step.userGroup = step.groupSetting.libelle;
                step.groupCode = step.groupSetting.code;
              }
              step.process = process;
              if (
                this.collectionSteps[0].amount === undefined ||
                this.collectionSteps[0].amount === null
              ) {
                this.devToolsServices.openToast(1, 'alert.error_amount');
                amountValid = false;
              }

              if (
                this.collectionSteps[0].unpaidAmount === undefined ||
                this.collectionSteps[0].unpaidAmount === null
              ) {
                this.devToolsServices.openToast(1, 'alert.check-data');
                UnpaidamountValid = false;
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
                    idWorkflowStep: null,
                    idUserDefinedFields: field.id,
                    idCollectionStep: stepUdf.idWorkflowStep,
                    mandatory: field.mandatory,
                    displayInIB : null
                  }
                  workflowStepUdfGroups.push(workflowStepUdf)
                });
                let workflowStepUdf: WorkflowStepUdfGroupeEntity = {
                  idWorkFlowStepUdfGroup: null,
                  idUserDefinedFieldGroup: parseInt(group.udfGroup),
                  idWorkflowStep: null,
                  idUserDefinedFields: null,
                  idCollectionStep: stepUdf.idWorkflowStep,
                  mandatory: groupMandatory || group.udfGroupMandatory,
                  displayInIB : null
                }
                workflowStepUdfGroups.push(workflowStepUdf)

              });

              // Set workflowStepUdfGroupe of each step
              this.collectionSteps.filter(item => item.idCollectionStep === stepUdf.idWorkflowStep)
                .map(item => item.workflowStepUdfGroupe = workflowStepUdfGroups);
            })

            processToSave = this.collectionSteps;
            this.edited = true;
            break;
          }
        }

        if (amountValid && stepTypeValid && UnpaidamountValid) {
          this.settingsService
            .saveCollectionSteps(processToSave, this.productEntity.id, process)
            .subscribe((data) => {
              this.devToolsServices.openToast(0, 'alert.success');
            });
        }
      }
  }

  /*** Get Direction */
  getDirection() {
    return AppComponent.direction;
  }

  onSubmit() {
    if (this.duplicateGroup.valid) {
    const StepParam: StepEntity = new StepEntity();
    StepParam.productId = this.productEntityForDuplicate.id;
    StepParam.enabled = true;

    if (this.productType === 'COLLECTION') {
      StepParam.process = AcmConstants.COLLECTION;
      StepParam.productId = this.productEntityForDuplicate.id;
      this.settingsService.findCollectionSteps(StepParam).subscribe((steps) => {
        steps.forEach((step) => {
          if (step.stepType === AcmConstants.GROUP) {
            step.groupSetting = new GroupeEntity();
            step.groupSetting.code = step.groupCode;
            step.groupSetting.libelle = step.userGroup;
          }
          step.documents = [];
        });
        this.collectionSteps = steps;
        this.collectionSteps.sort((step1, step2) => {
          return step1.order - step2.order;
        });
        for (let i = 0; i < steps.length; i++) {
          this.collectionExpands[i] = false;
        }
        this.collectionSteps.forEach(
          (item) => (item.productId = this.productEntity.id)
        );
      });
    }

    this.modalService.dismissAll();
  }
  }

  ngOnDestroy(): void {
    // console.log('Collection Steps Component Destroyed')
  }
  getListOfThirdParty(event: any, i: number) {
    this.collectionSteps[i].typeThirdParty = '';
    const { value } = event;
    value.forEach((v) => {
      this.collectionSteps[i].typeThirdParty +=
        v.participantValue.toString() + ',';
    });
    this.collectionSteps[i].typeThirdParty = this.collectionSteps[
      i
    ].typeThirdParty.substring(
      0,
      this.collectionSteps[i].typeThirdParty.length - 1
    );
  }
}
