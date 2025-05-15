import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChildren, QueryList, TemplateRef } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SettingsService } from '../settings.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProductEntity } from '../../../shared/Entities/product.entity';
import { HabilitationIhmRouteEntity } from '../../../shared/Entities/habilitationIhmRoute.entity';
import { GroupeEntity } from '../../../shared/Entities/groupe.entity';
import { SettingJournalEntryTypeEntity } from '../../../shared/Entities/settingJournalEntryType.entity';
import { UdfStepWorkflowSettingComponent } from '../udf-step-workflow-setting/udf-step-workflow-setting.component';
import { StepEntity } from '../../../shared/Entities/step.entity';
import { SettingDocumentTypeProductEntity } from '../../../shared/Entities/settingDocumentTypeProduct.entity';
import { ApplicationFeeEntity } from '../../../shared/Entities/applicationFee.entity';
import { AcmConstants } from '../../../shared/acm-constants';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { SharedService } from '../../../shared/shared.service';
import { SettingDocumentTypeEntity } from '../../../shared/Entities/settingDocumentType.entity';
import { WorkflowStepUdfGroupeEntity } from '../../../shared/Entities/WorkflowStepUdfGroupe.entity';
import { AppComponent } from '../../../app.component';
import { configCollectionParticipants, configDocProd, configJournalEntryType, configScreenComp, screenigComponents, stepTap, userLinksGw } from '../setting-level-process/shared-setting-workflow';
import { forkJoin } from 'rxjs';
import { PlaningDto } from 'src/app/shared/Entities/PlaningDto.entity';
import { SettingTypeRiskEntity } from 'src/app/shared/Entities/settingTypeRisk.entity';
import { RiskSettingEntity } from 'src/app/shared/Entities/riskSetting.entity';
import { GenericWorkFlowObject } from 'src/app/shared/Entities/GenericWorkFlowObject';
import { SelectItem } from 'primeng/api';
import {
  findObjectsByConcatenatedValue,
  generateUniqueID,
  concatenateValues,
} from "src/app/shared/utils";

@Component({
  selector: 'app-setting-generic-workflow',
  templateUrl: './app-setting-generic-workflow.component.html',
  styleUrls: ['./app-setting-generic-workflow.component.css']
})
export class AppSettingGenericWorkflowComponent implements OnInit {
  @Input() productEntity: ProductEntity;
  @Input() productEntitys: GenericWorkFlowObject[];
  @Input() ihmRoot: HabilitationIhmRouteEntity[];
  @Input() optionsGroupUsers: GroupeEntity[];
  @Input() groupEntities: GroupeEntity[];

  @ViewChildren(UdfStepWorkflowSettingComponent) udfStepWorkflowSettingComponent: QueryList<UdfStepWorkflowSettingComponent>;

  public selectedScreenComponents: any[] = [];
  public genericWfSteps: StepEntity[] = [];
  public newGenericWfExpands: boolean[] = [];
  public settingDocumentsType: SettingDocumentTypeEntity[] = [];

  public applicationFeesByProduct: ApplicationFeeEntity[] = [];



  public approvalConditionCheckedForLoanApp: Boolean = false;
  public comfirmStatus: boolean;

  public productType: string;
  public duplicateGroup: FormGroup;
  public productEntityForDuplicate = new ProductEntity();
  public settingDocumentProduct: SettingDocumentTypeProductEntity = new SettingDocumentTypeProductEntity();

  public userLinks = userLinksGw;
  public configScreenComponent = configScreenComp;
  public configCollectionParticipants = configCollectionParticipants;
  public configDocProd = configDocProd;
  public stepTap = stepTap;
  public activationKey;
  public expiryDate ;
  public today = new Date();
  testExpiryDate: boolean;
  public newApplicationProcess = AcmConstants.GENERIC_WORKFLOW;
  public showInputs = false;

  public nbrDay = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99] ;
  public  typeOfPlaning : string  ;
   public typePlan = ["JOUR","SEMAINE","MOIS","AN"]  ;
   public numberOfMonth = ["premier","deuxiéme","troisiéme","qutreiéme"] ;
   public days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]
   public listOfMonth = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"] ;
   public periodInMonth  ;
   public planingDto : PlaningDto = new PlaningDto() ;

   public dayOfWeek = []  ;
   public checkMonth : boolean = false ;

   public numberOfDay : string  ;
   indexApplicationStepForPlaning : number ;
   checkFillListDays = false  ;
   checkAn = false ;
   selectedDayLu : boolean  = false  ;
   selectedDayMa : boolean  = false ;
   selectedDayMe : boolean = false  ;
   selectedDayJe : boolean = false  ;
   selectedDayVe : boolean = false  ;
   selectedDaySa : boolean = false ;
   selectedDayDi : boolean  = false ;
   monthForAn : string  ;
   public riskTypeList : SettingTypeRiskEntity[] ;
   selectedTypeRisk : SettingTypeRiskEntity = new SettingTypeRiskEntity() ;
   editable  : boolean =false ;
   listThirdPartyOptions: SelectItem[];
    public licenceAutomaticStep: boolean=false;
    public listIdsWorkFlowSteps: number[] = [];


  constructor(public settingsService: SettingsService,
    public formBuilder: FormBuilder,
    public modalService: NgbModal,
    public library: FaIconLibrary,
    public devToolsServices: AcmDevToolsServices,
    public translate: TranslateService,
    public sharedService: SharedService) { }


  async ngOnInit() {
    this.listThirdPartyOptions = [
      { label: "Insurance companies", value: "Insurance companies" },
      { label: "Financial backers", value: "Financial backers" },
      { label: "Business partners", value: "Business partners" },
      { label: "Technical partners", value: "Technical partners" },
      { label: "Control agency", value: "Control agency" },
      { label: "Individuals", value: "Individuals" },
      { label: "Lawyer", value: "Lawyer" },
      { label: "Bailiff", value: "Bailiff" },
    ];

    this.activationKey = this.sharedService.getActivationKey().filter(item => item === AcmConstants.JOURNAL_ENTRY_MODULE);
    this.expiryDate = this.sharedService.getActivationKey().filter(item => item.includes('EXPIRYDATE'))[0].split(':')[1];
    if (this.expiryDate) {
      this.expiryDate = new Date(this.expiryDate.substring(4), this.expiryDate.substring(2, 4) - 1, this.expiryDate.substring(0, 2))
      this.testExpiryDate = this.expiryDate > this.today;
    }
    const newStepParam: StepEntity = new StepEntity();
    newStepParam.productId = this.productEntity.id;
    newStepParam.process = AcmConstants.GENERIC_WORKFLOW;
    newStepParam.enabled = true;
    await this.newLoanAppStepList(newStepParam);
    this.getDocuments();
    this.loadDatas() ;
    this.getlstRisk()

  }

  getlstRisk(){
    this.settingsService.findAllSettingRiskTypeEnabled().subscribe(data=>{
      this.riskTypeList = data ;
    });

  }

  addRisk(index : number,newLoanApplicationStep : StepEntity){
    let riskSetting:RiskSettingEntity=new RiskSettingEntity();
     riskSetting.idRiskSetting=newLoanApplicationStep.selectedTypeRisk.id;
     riskSetting.labelRisk=newLoanApplicationStep.selectedTypeRisk.label;
     riskSetting.isEditable=newLoanApplicationStep.editable;


     if (this.genericWfSteps[index].listRiskSetting === null){
     this.genericWfSteps[index].listRiskSetting = [];
  }
     this.genericWfSteps[index].listRiskSetting.push(riskSetting);
  }
  deleteRiskType(index : number,k : number)
  {
    this.genericWfSteps[index].listRiskSetting.splice(k,1)
  }
  loadDatas(){
    const habilitationIhmRouteEntity = new HabilitationIhmRouteEntity();
    habilitationIhmRouteEntity.settingsWorkflow = true;
    habilitationIhmRouteEntity.codeIHMRoute = "IHM_GENERIC_WF";

forkJoin([
      //this.settingsService.findSettingJournalEntryBy(settingJournalEntryTypeEntity),
      this.settingsService.findGroup(new GroupeEntity()),
      this.settingsService.findAllHabilitationIhmRoute(habilitationIhmRouteEntity),
      this.settingsService.findAllGroup(),
    ]).subscribe(([ groupEntities, ihmRoot, optionsGroupUsers]) => {
     // this.journalEntryTypes = journalEntryTypes;
      this.groupEntities = groupEntities;
      this.ihmRoot = ihmRoot;
      this.optionsGroupUsers = optionsGroupUsers;
    });
  }
  async ngOnChanges(changes: SimpleChanges) {
    if (
      changes.productEntity !== undefined &&
      changes.productEntity.currentValue !== changes.productEntity.previousValue
    ) {
      const newLoanApplicationStepParam: StepEntity = new StepEntity();
      newLoanApplicationStepParam.productId = this.productEntity.id;
      newLoanApplicationStepParam.process = AcmConstants.GENERIC_WORKFLOW;
      newLoanApplicationStepParam.enabled = true;
      await this.newLoanAppStepList(newLoanApplicationStepParam);
    }
  }

  getDocuments() {
    //this.settingDocumentProduct.productId = this.productEntity.id;
    const settingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentTypeEntity.categorie = 6;
    settingDocumentTypeEntity.enabled = true;

    // get documents Loan by product
    // this.settingDocumentProduct.settingDocumentTypeDTO =settingDocumentTypeEntity ;
    this.settingsService
      .findDocumentTypes(settingDocumentTypeEntity)
      .subscribe((data) => {
        this.settingDocumentsType = data
        // .filter(
        //   (val) =>
        //     // get only document loan, customer and assign document
        //     val.settingDocumentTypeDTO.categorie === 0 ||
        //     val.settingDocumentTypeDTO.categorie === 2 ||
        //     val.settingDocumentTypeDTO.categorie === 1
        // );
      });
  }

  async newLoanAppStepList(newLoanApplicationStepParam: StepEntity) {
    await this.settingsService.findWorkFlowSteps(newLoanApplicationStepParam).toPromise().then((steps) => {
      this.genericWfSteps = steps;
      steps.forEach((step) => {

       step.selectedGenericWorkFlowParticipants = findObjectsByConcatenatedValue(
          this.listThirdPartyOptions,
          "value",
          step.genericWorkFlowParticipants
        );
        if (step.stepType === AcmConstants.GROUP) {
          step.groupSetting = new GroupeEntity();
          step.groupSetting.code = step.groupCode;
          step.groupSetting.libelle = step.userGroup;
        }

        if (step.approvalConditions === true) {
          this.approvalConditionCheckedForLoanApp = true;
        }
      });
      for (let i = 0; i < steps.length; i++) {
        this.newGenericWfExpands[i] = false;
      }
    });
  }



  changeApprovalConditions(event, process: string) {
    // disable/enable ready for disbursement checkbox in the other steps =>
    // so that only one step can be checked (ready for disbursement checkbox)
    if (process == AcmConstants.GENERIC_WORKFLOW)
      this.approvalConditionCheckedForLoanApp = event.checked;
  }





  addStep(process: string) {
    const newStep = new StepEntity();
    newStep.productId = this.productEntity.id;
    newStep.enabled = false;
    newStep.amount = 0;
    newStep.minAmount = 0;
    newStep.idWorkFlowStep = Date.now();
    this.listIdsWorkFlowSteps.push(newStep.idWorkFlowStep);
    if (process == AcmConstants.GENERIC_WORKFLOW) {
      newStep.order = this.genericWfSteps.length;
      this.genericWfSteps.push(newStep);
      this.newGenericWfExpands[this.genericWfSteps.length - 1] = true;
    }
  }

  drop(event: CdkDragDrop<string[]>, process: string) {
    let steps, expands;
    if (process == AcmConstants.GENERIC_WORKFLOW) {
      steps = this.genericWfSteps;
      expands = this.newGenericWfExpands;

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
    this.genericWfSteps.splice(index, 1);
    this.newGenericWfExpands.splice(index, 1);
  }

  toggleCollapse(index: number, process: string) {
    if (process == AcmConstants.GENERIC_WORKFLOW)
      this.newGenericWfExpands[index] = !this.newGenericWfExpands[index];
  }

  stepTypeChanged(process: string, i: number) {
    if (process == AcmConstants.GENERIC_WORKFLOW) {
      if (this.genericWfSteps[i].stepType !== 'group') {
        this.genericWfSteps[i].groupSetting = null;
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
    this.genericWfSteps.forEach((cls) => {
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


    const hasEmptyStep = this.genericWfSteps.some(({
      stepName = '', stepType = null, screen = null , codeStatutLoan=null }) => {
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
      let stepTabValid = true;
      // check amount + step type
      let processToSave: StepEntity[] = [];
      switch (process) {
        case AcmConstants.GENERIC_WORKFLOW: {
          this.genericWfSteps.forEach((step) => {
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
                if(field.mandatory) {
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
                mandatory: groupMandatory,
                displayInIB : null
              }
              workflowStepUdfGroups.push(workflowStepUdf)
            });

            // Set workflowStepUdfGroupe of each step
            this.genericWfSteps.filter(item => item.idWorkFlowStep === stepUdf.idWorkflowStep)
              .map(item => item.workflowStepUdfGroupe = workflowStepUdfGroups);
          })

          processToSave = this.genericWfSteps;

          break;
        }
      }

      if (Array.isArray(this.listIdsWorkFlowSteps) && this.listIdsWorkFlowSteps.length > 0) {
        processToSave.forEach(step => {
          if (this.listIdsWorkFlowSteps.includes(step.idWorkFlowStep)) {
            step.idWorkFlowStep = null;
          }
          if (Array.isArray(step.workflowStepUdfGroupe)) {
            step.workflowStepUdfGroupe.forEach(udfStep => {
              if (this.listIdsWorkFlowSteps.includes(udfStep.idWorkflowStep)) {
                udfStep.idWorkflowStep = null;
              }
            });
          }
        });
      }
      if (amountValid && stepTypeValid&&stepTabValid) {
        this.settingsService.saveApprovalSteps(processToSave, this.productEntity.id, process).subscribe((data) => {
            this.devToolsServices.openToast(0, 'alert.success');
          });
      }
    }
  }

  checkBoxCheckers(genericWfStep: StepEntity) {
    if (parseInt(genericWfStep.codeStatutLoan) !== stepTap[3].tapValue) {
      genericWfStep.approvalConditions = false;
    }
    this.approvalConditionCheckedForLoanApp = !!this.genericWfSteps.find(res => res.approvalConditions === true);
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
      const StepParam: StepEntity = new StepEntity();
      StepParam.productId = this.productEntityForDuplicate.id;
      StepParam.enabled = true;
      if (this.productType ===  AcmConstants.GENERIC_WORKFLOW) {
        StepParam.process = AcmConstants.GENERIC_WORKFLOW;
        this.settingsService.findWorkFlowSteps(StepParam).subscribe((steps) => {
          steps.forEach((step) => {
            if (step.stepType === AcmConstants.GROUP) {
              step.groupSetting = new GroupeEntity();
              step.groupSetting.code = step.groupCode;
              step.groupSetting.libelle = step.userGroup;
            }

            if (step.approvalConditions) this.approvalConditionCheckedForLoanApp = true;
          });

          this.genericWfSteps = steps;
          this.genericWfSteps.sort((step1, step2) => {
            return step1.order - step2.order;
          });
          for (let i = 0; i < steps.length; i++) {
            this.newGenericWfExpands[i] = false;
          }
          this.genericWfSteps.forEach(
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






  openPlaning(content,indexNewLoanApplicationStep,newLoanApplicationStep){
    this.indexApplicationStepForPlaning=indexNewLoanApplicationStep ;
      this.modalService.open(content, {
        size: 'md',
      });
      if (this.checkFillListDays)
        this.planingDto.lstDay = this.dayOfWeek ;
      if (!newLoanApplicationStep.planingDto)
        this.planingDto  = new PlaningDto()  ;
      else{
      this.planingDto =  newLoanApplicationStep.planingDto ;
      if (this.planingDto.category==="MOIS"||this.planingDto.category==="AN"){
        this.checkMonth = true ;
        this.planingDto.lstDay = [] ;
      }
        else{
        this.checkMonth = false  ;
        this.planingDto.dateOfRep = null;
        this.planingDto.beginOrEndMonth = null ;


      }

      if (this.planingDto.category==="AN"){
        this.checkAn = true ;
        this.planingDto.lstDay = [] ;
        if (this.planingDto.beginOrEndMonth!='TR')
          if (!this.monthForAn){
          this.monthForAn =this.planingDto.month ;
          this.planingDto.month = null  ;
        }

      }
        else{
        this.checkAn = false  ;
        this.planingDto.dateOfRep = null;
       // this.planingDto.beginOrEndMonth = null ;


      }

      this.fillDayList(newLoanApplicationStep)
  }



  }





fillDayList(newLoanApplicationStep){
  if(this.planingDto.lstDay.length !=0 ){
    if (newLoanApplicationStep.planingDto.lstDay.filter(item =>item === "LU").length != 0)
      this.selectedDayLu =true;
    else
      this.selectedDayLu =false;
    if (newLoanApplicationStep.planingDto.lstDay.filter(item =>item === "MA").length != 0)
      this.selectedDayMa =true ;
    else
      this.selectedDayMa =false ;

    if (newLoanApplicationStep.planingDto.lstDay.filter(item =>item === "ME").length != 0)
      this.selectedDayMe =true;
    else
      this.selectedDayMe =false ;
    if (newLoanApplicationStep.planingDto.lstDay.filter(item =>item === "JE").length != 0)
      this.selectedDayJe = true ;
    else
        this.selectedDayJe =false ;
    if (newLoanApplicationStep.planingDto.lstDay.filter(item =>item === "VE").length != 0)
       this.selectedDayVe =true ;
       else
       this.selectedDayVe =false ;
    if (newLoanApplicationStep.planingDto.lstDay.filter(item =>item === "SA").length != 0)
       this.selectedDaySa = true ;
    else
       this.selectedDaySa =false ;
    if (newLoanApplicationStep.planingDto.lstDay.filter(item =>item === "DI").length != 0)
      this.selectedDayDi =true ;
    else
      this.selectedDayDi =false ;


  }
}

  confirmPlaning(){
    this.indexApplicationStepForPlaning
    const currentStep = this.genericWfSteps.filter(item=>item.order === this.indexApplicationStepForPlaning) ;
      if (currentStep){
        if (this.monthForAn){
          this.planingDto.month= this.monthForAn ;
        }
        this.genericWfSteps[this.genericWfSteps.indexOf(currentStep[0])].planingDto = this.planingDto ;
      }
        this.modalService.dismissAll() ;
        this.comfirmStatus=false ;

  }
  changeRdio(){
    if (this.planingDto.beginOrEndMonth!='DR'){
      this.planingDto.dateOfMonth = null ;
      this.monthForAn = null  ;
    }
    else {
      this.planingDto.nbrMonth = null ;
      this.planingDto.selectedDay = null ;
      this.planingDto.month = null ;

    }

  }


  changeToMonthValue(event){
    this.typeOfPlaning ;
    if (event==="2: MOIS" || event==="3: AN"){
      this.checkMonth = true ;
    }
      else{
      this.checkMonth = false  ;
    }
    this.planingDto.lstDay = [] ;
    this.planingDto.dateOfRep = null;
    this.planingDto.beginOrEndMonth = null ;
    this.planingDto.dayRep= null;

    this.planingDto.beginOrEndMonth =null ;
    this.planingDto.dateOfMonth=null ;
    this.planingDto.selectedDay   = null ;
    this.planingDto.nbrMonth = null ;

    this.selectedDayLu  = false  ;
    this.selectedDayMa   = false ;
    this.selectedDayMe  = false  ;
    this.selectedDayJe  = false  ;
    this.selectedDayVe = false  ;
    this.selectedDaySa  = false ;
    this.selectedDayDi   = false ;
    if (event==="3: AN"){
      this.checkAn = true ;
    }else
      this.checkAn = false ;
  }

  fillListOfDay(value){
    this.checkFillListDays = true ;
    this.dayOfWeek=this.planingDto.lstDay ;
    const day  = this.dayOfWeek.filter(item=>item===value);
    if (day ==null || day ==undefined || day.length==0 )
      this.dayOfWeek.push(value);
    else{
      this.dayOfWeek.splice(this.dayOfWeek.indexOf(value), 1)
     // this.planingDto.lstDay=[...new Set(this.planingDto.lstDay)];
    }
    this.planingDto.lstDay=this.dayOfWeek;

  }

  getListOfThirdParty(event: any, i: number) {
    this.genericWfSteps[i].genericWorkFlowParticipants = '';
    const { value } = event;
    value.forEach((v) => {
      this.genericWfSteps[i].genericWorkFlowParticipants +=
        v.value.toString() + ',';
    });
    this.genericWfSteps[i].genericWorkFlowParticipants = this.genericWfSteps[
      i
    ].genericWorkFlowParticipants.substring(
      0,
      this.genericWfSteps[i].genericWorkFlowParticipants.length - 1
    );
  }
}
