import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { afterCollection, configCollectionParticipants, configDocProd, configParticipants, stepTap, userLinks } from '../shared-setting-workflow';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { HabilitationIhmRouteEntity } from 'src/app/shared/Entities/habilitationIhmRoute.entity';
import { SettingsService } from '../../settings.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AppComponent } from 'src/app/app.component';
import { SettingJournalEntryTypeEntity } from 'src/app/shared/Entities/settingJournalEntryType.entity';
import { SettingDocumentTypeProductEntity } from 'src/app/shared/Entities/settingDocumentTypeProduct.entity';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { UdfStepWorkflowSettingComponent } from '../../udf-step-workflow-setting/udf-step-workflow-setting.component';
import { WorkflowStepUdfGroupeEntity } from 'src/app/shared/Entities/WorkflowStepUdfGroupe.entity';
import { SettingSMSEntity } from 'src/app/shared/Entities/SettingSMS.entity';
import { SettingChargeFeeEntity } from 'src/app/shared/Entities/settingChargeFee.entity';
import { GenericWfSettingWorkflowComponent } from '../../generic-wf-setting-workflow/generic-wf-setting-workflow.component';
import { GnericWorkflowObjectWorkflow } from 'src/app/shared/Entities/GnericWorkflowObjectWorkflow.entity';

@Component({
  selector: 'app-setting-legal-collection-steps',
  templateUrl: './setting-legal-collection-steps.component.html',
  styleUrls: ['./setting-legal-collection-steps.component.sass']
})
export class SettingLegalCollectionStepsComponent implements OnInit,OnChanges,OnDestroy {

  @Input() productEntity: ProductEntity;
  @Input() productEntitys: ProductEntity[];
  @Input() groupEntities : GroupeEntity[];
  @Input() ihmRoot: HabilitationIhmRouteEntity[];
  @Input() journalEntryTypes : SettingJournalEntryTypeEntity[];
  @Input() optionsGroupUsers: GroupeEntity[];

  @ViewChildren(UdfStepWorkflowSettingComponent) udfStepWorkflowSettingComponent: QueryList<UdfStepWorkflowSettingComponent>;
  @ViewChildren(GenericWfSettingWorkflowComponent) genericWfSettingWorkflowComponent: QueryList<GenericWfSettingWorkflowComponent>;



  collectionLegalSteps: StepEntity[] = [];
  collectionLegalExpands: boolean[] = [];
  public selectedParticipantsLegal: any[] = [];
  public productEntityForDuplicate = new ProductEntity();
  public edited : boolean = false;
  public settingSMSFilter :  SettingSMSEntity = new  SettingSMSEntity() ;
  public comfirmStatus : boolean;
  public productType: string;
  public duplicateGroup: FormGroup;
  public settingSMS: SettingSMSEntity[] = [];
  public configDocProd = configDocProd;
  public configCollectionParticipants = configCollectionParticipants;
  public stepTap = stepTap;
  public userLinks = userLinks;
  public configParticipants = configParticipants;
  public afterCollection = afterCollection;
  public serviceSMS:Boolean = false;
  public chargeFees: SettingChargeFeeEntity[] = [];

  participantsLegal: { nameParticipant: string; participantValue: number }[] = [
    {
      nameParticipant: this.translate.instant('legal.lawyer'),
      participantValue: 1,
    },
    {
      nameParticipant: this.translate.instant('legal.bailiff'),
      participantValue: 2,
    },
  ];

  public settingDocumentProduct: SettingDocumentTypeProductEntity = new SettingDocumentTypeProductEntity();
  public settingLegalDocumentsByProduct: SettingDocumentTypeProductEntity[] = [];

  constructor(public settingsService : SettingsService,
              public formBuilder : FormBuilder,
              public modalService: NgbModal,
              public library : FaIconLibrary,
              public devToolsServices: AcmDevToolsServices,
              public translate: TranslateService) { }

  async ngOnInit() {
    const collectionLeagalStepParam: StepEntity = new StepEntity();
    collectionLeagalStepParam.productId = this.productEntity.id;
    collectionLeagalStepParam.process = AcmConstants.LEGAL;
    collectionLeagalStepParam.enabled = true;
    this.collectionLegalStepList(collectionLeagalStepParam);
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
      const collectionLeagalStepParam: StepEntity = new StepEntity();
      collectionLeagalStepParam.productId = this.productEntity.id;
      collectionLeagalStepParam.process = AcmConstants.LEGAL;
      collectionLeagalStepParam.enabled = true;
      this.collectionLegalStepList(collectionLeagalStepParam);
    }
  }


  getTemplateSMS() {
    this.settingSMSFilter.category = AcmConstants.LEGAL;
    this.settingsService.findAllSettingSMS( this.settingSMSFilter).subscribe((data) => {
      this.settingSMS = data;
    });}

  getDocuments(){
    this.settingDocumentProduct.productId = this.productEntity.id;
    const settingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentTypeEntity.categorie = 4;
    settingDocumentTypeEntity.enabled = true;

    // get documents Legal collection by product
    const settingLegalDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingLegalDocumentTypeEntity.categorie = 5;
    settingLegalDocumentTypeEntity.enabled = true;

    this.settingDocumentProduct.settingDocumentTypeDTO =
      settingLegalDocumentTypeEntity;
    this.settingsService
      .findAllDocumentProduct(this.settingDocumentProduct)
      .subscribe((data) => {
        this.settingLegalDocumentsByProduct = data;
      });
  }

  collectionLegalStepList(collectionLeagalStepParam : StepEntity){
    this.settingsService.findCollectionSteps(collectionLeagalStepParam).subscribe((steps) => {
      steps.forEach((step) => {
        if (step.stepType === AcmConstants.GROUP) {
          step.groupSetting = new GroupeEntity();
          step.groupSetting.code = step.groupCode;
          step.groupSetting.libelle = step.userGroup;
        }
      });
      this.collectionLegalSteps = steps;
      for (let i = 0; i < steps.length; i++) {
        this.collectionLegalExpands[i] = false;
        if (this.collectionLegalSteps[i].typeThirdParty !== null) {
          if (this.collectionLegalSteps[i].typeThirdParty === '1') {
            this.selectedParticipantsLegal[i] = [
              { nameParticipant: 'Lawyer', participantValue: 1 },
            ];
          } else if (this.collectionLegalSteps[i].typeThirdParty === '2') {
            this.selectedParticipantsLegal[i] = [
              { nameParticipant: 'Bailiff', participantValue: 2 },
            ];
          } else if (
            this.collectionLegalSteps[i].typeThirdParty === '1,2' ||
            this.collectionLegalSteps[i].typeThirdParty === '2,1'
          ) {
            this.selectedParticipantsLegal[i] = [
              { nameParticipant: 'Bailiff', participantValue: 2 },
              { nameParticipant: 'Lawyer', participantValue: 1 },
            ];
          }
        }
      }
    });
  }

  addStep(process: string) {
      const newStep = new StepEntity();
      newStep.productId = this.productEntity.id;
      newStep.enabled = false;
      newStep.amount = 0;
      newStep.minAmount = 0;
      newStep.order = this.collectionLegalSteps.length;
      if (process == AcmConstants.LEGAL){
        this.collectionLegalSteps.push(newStep);
        this.collectionLegalExpands[this.collectionLegalSteps.length - 1] = true;
      }
  }

  drop(event: CdkDragDrop<string[]>, process: string) {
    let steps, expands;
    if(process == AcmConstants.LEGAL){
      steps = this.collectionLegalSteps;
      expands = this.collectionLegalExpands;
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
    this.collectionLegalExpands.splice(index, 1);
    this.collectionLegalSteps.splice(index, 1);
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
    this.modalService.open(content, {
      size: 'md',
    });
  }

  getChargeFees() {
    this.settingsService.findAllSettingChargeFee().subscribe(res => {
      this.chargeFees = res;
    });
  }

  toggleCollapse(index: number, process: string) {
    if (process == AcmConstants.LEGAL)
        this.collectionLegalExpands[index] =!this.collectionLegalExpands[index];
  }

  stepTypeChanged(process: string, i: number) {
    if (process == AcmConstants.LEGAL){
      if (this.collectionLegalSteps[i].stepType !== 'group') {
          this.collectionLegalSteps[i].groupSetting = null;
          this.collectionLegalSteps[i].forceStepDelay = null;

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
  public genericObjectWfForms :  FormGroup[]  = [] ;

  /*** Methode save Legal Collection */
  async saveLegalCollection(process: string) {
      let isEmptyStepNameLegal = false;
      let furtherStep = false;
      let grp: GroupeEntity;
      let subWfrequiredData = true ;
      this.collectionLegalSteps.forEach((cls) => {
        if (cls.stepType === AcmConstants.GROUP) {
          if (cls.groupSetting === null || cls.groupSetting === undefined)
            furtherStep = true;
          grp = cls.groupSetting;
        } else if (cls.stepType === AcmConstants.LINK) {
          if (cls.previousStep === null || cls.previousStep === undefined)
            furtherStep = true;
        }
      });

      const hasEmptyStep = this.collectionLegalSteps.some(({
        stepName = '', stepType = '', screen = '', startDate = null, afterDate = '' }) => {
        if (!stepName || !stepType || !screen || startDate === null || !afterDate) {
          this.devToolsServices.openToast(3, 'alert.check-data');
          isEmptyStepNameLegal = true;
          return true;
        }
      });

      if (hasEmptyStep || furtherStep) {
        return;
      }

      if (isEmptyStepNameLegal === false) {
        let amountValid = true;
        let stepTypeValid = true;
        let UnpaidamountValid = true;
        // check amount + step type
        let processToSave: StepEntity[] = [];
        switch (process) {
          case AcmConstants.LEGAL: {
            this.collectionLegalSteps.forEach((step) => {
              if (step.stepType === AcmConstants.GROUP && grp !== undefined) {
                step.userGroup = step.groupSetting.libelle;
                step.groupCode = step.groupSetting.code;
              }
              step.process = process;
              if (
                this.collectionLegalSteps[0].amount === undefined ||
                this.collectionLegalSteps[0].amount === null
              ) {
                this.devToolsServices.openToast(1, 'alert.error_amount');
                amountValid = false;
              }
              if (
                this.collectionLegalSteps[0].unpaidAmount === undefined ||
                this.collectionLegalSteps[0].unpaidAmount === null
              ) {
                this.devToolsServices.openToast(1, 'alert.check-data');
                UnpaidamountValid = false;
              }
              if (step.stepType === undefined) {
                this.devToolsServices.openToast(1, 'alert.check-data');
                stepTypeValid = false;
              }




            });

          //for saving generic WF in the step
            for(const step of this.collectionLegalSteps) {

                step.gnericWorkflowObjectWorkflows = [] ;

            if (this.genericWfSettingWorkflowComponent.length>0){
              for(const item of this.genericWfSettingWorkflowComponent){
               this.genericObjectWfForms =  item.genericObjectWfForms?.filter(gfForm=>
                 gfForm.controls?.orderStep?.value ===step.order) ;
                 this.genericObjectWfForms.forEach(genericForm=>{
                  if (genericForm.valid){
                  const gnericWorkflowObjectWorkflow= new GnericWorkflowObjectWorkflow() ;
                  gnericWorkflowObjectWorkflow.idGenericWorkflowObject = genericForm.controls.genericWorkFlow.value.id ;
                  gnericWorkflowObjectWorkflow.priority = genericForm.controls.priority.value ;
                  gnericWorkflowObjectWorkflow.stepOrder = genericForm.controls.orderStep.value ;
                  gnericWorkflowObjectWorkflow.category  = AcmConstants.LEGAL ;
                  step.gnericWorkflowObjectWorkflows?.push(gnericWorkflowObjectWorkflow) ;
                  }else {
                    this.devToolsServices.openToast(3, 'alert.check-data');
                     subWfrequiredData = false ;
                    return ;
                  }
                 });
             }
           }


          }

            this.udfStepWorkflowSettingComponent.forEach(stepUdf => {
              let workflowStepUdfGroups: WorkflowStepUdfGroupeEntity[] = [];
              // Add Workflow groups
              stepUdf.udfForm.value.udfGroups.forEach(group => {
                let groupMandatory = false;
                 // Add fields of each group
                 group.udfFields.forEach(field => {
                  if(field.mandatory) {
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
              this.collectionLegalSteps.filter(item => item.idCollectionStep === stepUdf.idWorkflowStep)
                .map(item => item.workflowStepUdfGroupe = workflowStepUdfGroups);
            })


            processToSave = this.collectionLegalSteps;
            this.edited = true;
            break;
          }
        }
        if (amountValid && stepTypeValid && UnpaidamountValid&& subWfrequiredData) {

          this.settingsService
            .saveCollectionSteps(processToSave, this.productEntity.id, process)
            .subscribe((data) => {

            //   data.foreach(item=>{
            //       let settingWf =this.genericWfSettingWorkflowComponent .filter(element=> element.order===item.order)[0] ;

            // }) ;
              this.devToolsServices.openToast(0, 'alert.success');
            });
        }
      }
  }



   /*** Get Direction */
  getDirection() {
    return AppComponent.direction;
  }

  getListOfThirdParty(event: any, i: number) {
    this.collectionLegalSteps[i].typeThirdParty = '';
    const { value } = event;
    value.forEach((v) => {
      this.collectionLegalSteps[i].typeThirdParty +=
        v.participantValue.toString() + ',';
    });
    this.collectionLegalSteps[i].typeThirdParty = this.collectionLegalSteps[
      i
    ].typeThirdParty.substring(
      0,
      this.collectionLegalSteps[i].typeThirdParty.length - 1
    );
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

  /**
  * get target step for duplication
  */
  onSubmit() {
    if (this.duplicateGroup.valid) {
      const StepParam: StepEntity = new StepEntity();
      StepParam.productId = this.productEntityForDuplicate.id;
      StepParam.enabled = true;
      if (this.productType === 'LEGAL') {
        StepParam.process = AcmConstants.LEGAL;
        StepParam.productId = this.productEntityForDuplicate.id;
        this.settingsService.findCollectionSteps(StepParam).subscribe((steps) => {
          steps.forEach((step) => {
            if (step.stepType === AcmConstants.GROUP) {
              step.groupSetting = new GroupeEntity();
              step.groupSetting.code = step.groupCode;
              step.groupSetting.libelle = step.userGroup;
            }
          });
          this.collectionLegalSteps = steps;
          this.collectionLegalSteps.sort((step1, step2) => {
            return step1.order - step2.order;
          });
          for (let i = 0; i < steps.length; i++) {
            this.collectionLegalExpands[i] = false;
            if (this.collectionLegalSteps[i].typeThirdParty !== null) {
              const arr: any[] =
                this.collectionLegalSteps[i].typeThirdParty.split(',');

              this.selectedParticipantsLegal = [];
              const x: { nameParticipant: string; participantValue: number }[] =
                [];

              this.participantsLegal.forEach((e) => {
                if (arr.includes(e.participantValue.toString())) x.push(e);
              });
              this.selectedParticipantsLegal[i] = x;
            }
          }
          this.collectionLegalSteps.forEach(
            (item) => (item.productId = this.productEntity.id)
          );
        });
      }
      this.modalService.dismissAll();
    }
  }

  ngOnDestroy(): void {
    // console.log('Legal Collection Steps Component Destroyed')
  }

}
