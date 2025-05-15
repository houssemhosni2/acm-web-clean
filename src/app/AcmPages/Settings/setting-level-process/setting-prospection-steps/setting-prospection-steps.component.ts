import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { HabilitationIhmRouteEntity } from 'src/app/shared/Entities/habilitationIhmRoute.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { SettingJournalEntryTypeEntity } from 'src/app/shared/Entities/settingJournalEntryType.entity';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { afterCollection, configCollectionParticipants, configDocProd, configParticipants, stepTap, userLinks } from '../shared-setting-workflow';
import { SettingDocumentTypeProductEntity } from 'src/app/shared/Entities/settingDocumentTypeProduct.entity';
import { SettingsService } from '../../settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AppComponent } from 'src/app/app.component';
import { WorkflowStepUdfGroupeEntity } from 'src/app/shared/Entities/WorkflowStepUdfGroupe.entity';
import { UdfStepWorkflowSettingComponent } from '../../udf-step-workflow-setting/udf-step-workflow-setting.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { SettingSMSEntity } from 'src/app/shared/Entities/SettingSMS.entity';
import { SettingChargeFeeEntity } from 'src/app/shared/Entities/settingChargeFee.entity';


@Component({
  selector: 'app-setting-prospection-steps',
  templateUrl: './setting-prospection-steps.component.html',
  styleUrls: ['./setting-prospection-steps.component.sass']
})
export class SettingProspectionStepsComponent implements OnInit {
  @Input() productEntity: ProductEntity;
  @Input() productEntitys: ProductEntity[];
  @Input() groupEntities : GroupeEntity[];
  @Input() ihmRoot: HabilitationIhmRouteEntity[];
  @Input() journalEntryTypes : SettingJournalEntryTypeEntity[];
  @Input() optionsGroupUsers: GroupeEntity[];

  prospectionSteps: StepEntity[] = [];
  prospectionExpands: boolean[] = [];
  // public selectedParticipantsLegal: any[] = [];
  public productEntityForDuplicate = new ProductEntity();
  public edited : boolean = false;
  public comfirmStatus : boolean;
  public productType: string;
  public duplicateGroup: FormGroup;
  public configDocProd = configDocProd;
  // public configCollectionParticipants = configCollectionParticipants;
  // public stepTap = stepTap;
  public userLinks = userLinks;
  public configParticipants = configParticipants;
  public afterCollection = afterCollection;

  // public settingSMSFilter :  SettingSMSEntity = new  SettingSMSEntity() ;
  // public settingSMS: SettingSMSEntity[] = [];
  // public serviceSMS:Boolean = false;
  // public chargeFees: SettingChargeFeeEntity[] = [];

  // participantsLegal: { nameParticipant: string; participantValue: number }[] = [
  //   {
  //     nameParticipant: this.translate.instant('legal.lawyer'),
  //     participantValue: 1,
  //   },
  //   {
  //     nameParticipant: this.translate.instant('legal.bailiff'),
  //     participantValue: 2,
  //   },
  // ];
  public settingDocumentProduct: SettingDocumentTypeProductEntity = new SettingDocumentTypeProductEntity();
  public settingLegalDocumentsByProduct: SettingDocumentTypeProductEntity[] = [];

  @ViewChildren(UdfStepWorkflowSettingComponent) udfStepWorkflowSettingComponent: QueryList<UdfStepWorkflowSettingComponent>;

  constructor(public settingsService : SettingsService,
              public formBuilder : FormBuilder,
              public modalService: NgbModal,
              public library : FaIconLibrary,
              public devToolsServices: AcmDevToolsServices,
              public translate: TranslateService) { }

  async ngOnInit() {
    const prospectionStepParam: StepEntity = new StepEntity();
    prospectionStepParam.productId = this.productEntity.id;
    prospectionStepParam.process = AcmConstants.PROSPECTION;
    prospectionStepParam.enabled = true;
    this.prospectionStepList(prospectionStepParam);
    this.getDocuments();
    // this.getTemplateSMS();
    // this.getChargeFees();
    const environnementsByKeys: string[] = [AcmConstants.SERVICE_SMS];
    await this.settingsService.getEnvirementValueByKeys(environnementsByKeys).subscribe((environments) => {
      if (environments[0].enabled) {
        // this.serviceSMS=true;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.productEntity !== undefined &&
      changes.productEntity.currentValue !== changes.productEntity.previousValue
    ) {
      const prospectionStepParam: StepEntity = new StepEntity();
      prospectionStepParam.productId = this.productEntity.id;
      prospectionStepParam.process = AcmConstants.PROSPECTION;
      prospectionStepParam.enabled = true;
      this.prospectionStepList(prospectionStepParam);
    }
  }


  // getTemplateSMS() {
  //   this.settingSMSFilter.category = AcmConstants.PROSPECTION;
  //   this.settingsService.findAllSettingSMS( this.settingSMSFilter).subscribe((data) => {
  //     this.settingSMS = data;
  //   });}

  getDocuments(){
    this.settingDocumentProduct.productId = this.productEntity.id;
    const settingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentTypeEntity.categorie =10;
    settingDocumentTypeEntity.enabled = true;

    // get documents Legal collection by product
    // const settingLegalDocumentTypeEntity = new SettingDocumentTypeEntity();
    // settingLegalDocumentTypeEntity.categorie = 5;
    // settingLegalDocumentTypeEntity.enabled = true;

    this.settingDocumentProduct.settingDocumentTypeDTO =
    settingDocumentTypeEntity;
    this.settingsService
      .findAllDocumentProduct(this.settingDocumentProduct)
      .subscribe((data) => {
        this.settingLegalDocumentsByProduct = data;
      });
  }

  prospectionStepList(prospectionStepParam : StepEntity){
    this.settingsService.findCollectionSteps(prospectionStepParam).subscribe((steps) => {
      steps.forEach((step) => {
        if (step.stepType === AcmConstants.GROUP) {
          step.groupSetting = new GroupeEntity();
          step.groupSetting.code = step.groupCode;
          step.groupSetting.libelle = step.userGroup;
        }
      });
      this.prospectionSteps = steps;
      for (let i = 0; i < steps.length; i++) {
        this.prospectionExpands[i] = false;
        if (this.prospectionSteps[i].typeThirdParty !== null) {
          if (this.prospectionSteps[i].typeThirdParty === '1') {
            // this.selectedParticipantsLegal[i] = [
            //   { nameParticipant: 'Lawyer', participantValue: 1 },
            // ];
          } else if (this.prospectionSteps[i].typeThirdParty === '2') {
            // this.selectedParticipantsLegal[i] = [
            //   { nameParticipant: 'Bailiff', participantValue: 2 },
            // ];
          } else if (
            this.prospectionSteps[i].typeThirdParty === '1,2' ||
            this.prospectionSteps[i].typeThirdParty === '2,1'
          ) {
            // this.selectedParticipantsLegal[i] = [
            //   { nameParticipant: 'Bailiff', participantValue: 2 },
            //   { nameParticipant: 'Lawyer', participantValue: 1 },
            // ];
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
      newStep.order = this.prospectionSteps.length;
      if (process == AcmConstants.PROSPECTION){
        this.prospectionSteps.push(newStep);
        this.prospectionExpands[this.prospectionSteps.length - 1] = true;
      }
  }

  drop(event: CdkDragDrop<string[]>, process: string) {
    let steps, expands;
    if(process == AcmConstants.PROSPECTION){
      steps = this.prospectionSteps;
      expands = this.prospectionExpands;
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
    this.prospectionExpands.splice(index, 1);
    this.prospectionSteps.splice(index, 1);
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

  // getChargeFees() {
  //   this.settingsService.findAllSettingChargeFee().subscribe(res => {
  //     this.chargeFees = res;
  //   });
  // }
  
  toggleCollapse(index: number, process: string) {
    if (process == AcmConstants.PROSPECTION)
        this.prospectionExpands[index] =!this.prospectionExpands[index];
  }

  stepTypeChanged(process: string, i: number) {
    if (process == AcmConstants.PROSPECTION){
      if (this.prospectionSteps[i].stepType !== 'group') {
          this.prospectionSteps[i].groupSetting = null;
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

  /*** Methode save Legal Collection */
  async saveProspection(process: string) {
      let isEmptyStepNameProspection = false;
      let furtherStep = false;
      let grp: GroupeEntity;
      this.prospectionSteps.forEach((cls) => {
        if (cls.stepType === AcmConstants.GROUP) {
          if (cls.groupSetting === null || cls.groupSetting === undefined)
            furtherStep = true;
          grp = cls.groupSetting;
        } else if (cls.stepType === AcmConstants.LINK) {
          if (cls.previousStep === null || cls.previousStep === undefined)
            furtherStep = true;
        }
      });

      const hasEmptyStep = this.prospectionSteps.some(({
        stepName = '', stepType = '', screen = '', startDate = null, afterDate = ''}) => {
        if (!stepName || !stepType || !screen || startDate === null || !afterDate ) {
          this.devToolsServices.openToast(3, 'alert.check-data');
          isEmptyStepNameProspection = true;
          return true;
        }
      });

      if (hasEmptyStep || furtherStep) {
        return;
      }

      if (isEmptyStepNameProspection === false) {
        // let amountValid = true;
        let stepTypeValid = true;
        // let UnpaidamountValid = true;
        let remainingInstallmentValid = true;
        let lateDateValid = true;
        // check amount + step type
        let processToSave: StepEntity[] = [];
        switch (process) {
          case AcmConstants.PROSPECTION: {
            this.prospectionSteps.forEach((step) => {
              if (step.stepType === AcmConstants.GROUP && grp !== undefined) {
                step.userGroup = step.groupSetting.libelle;
                step.groupCode = step.groupSetting.code;
              }
              step.process = process;
              // if (
              //   this.prospectionSteps[0].amount === undefined ||
              //   this.prospectionSteps[0].amount === null
              // ) {
              //   this.devToolsServices.openToast(1, 'alert.error_amount');
              //   amountValid = false;
              // }
              // if (
              //   this.prospectionSteps[0].unpaidAmount === undefined ||
              //   this.prospectionSteps[0].unpaidAmount === null
              // ) {
              //   this.devToolsServices.openToast(1, 'alert.check-data');
              //   UnpaidamountValid = false;
              // }
              if (step.stepType === undefined) {
                this.devToolsServices.openToast(1, 'alert.check-data');
                stepTypeValid = false;
              }
              if (
                this.prospectionSteps[0].remainingInstallment === undefined ||
                this.prospectionSteps[0].remainingInstallment === null
              ) {
                this.devToolsServices.openToast(1, 'alert.error_remaining_installment');
                remainingInstallmentValid = false;
              }
              if (
                this.prospectionSteps[0].lateDate === undefined 
              ) {
                this.devToolsServices.openToast(1, 'alert.error_remaining_installment');
                lateDateValid = false;
              }
            });

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
              this.prospectionSteps.filter(item => item.idCollectionStep === stepUdf.idWorkflowStep)
                .map(item => item.workflowStepUdfGroupe = workflowStepUdfGroups);
            })

            processToSave = this.prospectionSteps;
            this.edited = true;
            break;
          }
        }
        if (  stepTypeValid  && remainingInstallmentValid && lateDateValid) {
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

  getListOfThirdParty(event: any, i: number) {
    this.prospectionSteps[i].typeThirdParty = '';
    const { value } = event;
    value.forEach((v) => {
      this.prospectionSteps[i].typeThirdParty +=
        v.participantValue.toString() + ',';
    });
    this.prospectionSteps[i].typeThirdParty = this.prospectionSteps[
      i
    ].typeThirdParty.substring(
      0,
      this.prospectionSteps[i].typeThirdParty.length - 1
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
      if (this.productType === 'PROSPECTION') {
        StepParam.process = AcmConstants.PROSPECTION;
        StepParam.productId = this.productEntityForDuplicate.id;
        this.settingsService.findCollectionSteps(StepParam).subscribe((steps) => {
          steps.forEach((step) => {
            if (step.stepType === AcmConstants.GROUP) {
              step.groupSetting = new GroupeEntity();
              step.groupSetting.code = step.groupCode;
              step.groupSetting.libelle = step.userGroup;
            }
          });
          this.prospectionSteps = steps;
          this.prospectionSteps.sort((step1, step2) => {
            return step1.order - step2.order;
          });
          for (let i = 0; i < steps.length; i++) {
            this.prospectionExpands[i] = false;
            if (this.prospectionSteps[i].typeThirdParty !== null) {
              const arr: any[] =
                this.prospectionSteps[i].typeThirdParty.split(',');

              // this.selectedParticipantsLegal = [];
              // const x: { nameParticipant: string; participantValue: number }[] =
              //   [];

              // this.participantsLegal.forEach((e) => {
              //   if (arr.includes(e.participantValue.toString())) x.push(e);
              // });
              // this.selectedParticipantsLegal[i] = x;
            }
          }
          this.prospectionSteps.forEach(
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
