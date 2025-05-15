import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UdfStepWorkflowComponent } from '../../Loan-Application/udf-step-workflow/udf-step-workflow.component';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { SharedService } from 'src/app/shared/shared.service';
import { RiskLevelComponentComponent } from './risk-level-component/risk-level-component.component';
import { GenericWorkFlowDocumentComponent } from './generic-workFlow-document/generic-workFlow-document.component';
import { SettingsService } from '../../Settings/settings.service';
import { ItemProcessComponent } from '../item-process/item-process.component';
import { ConditionalApproveComponent } from '../../Loan-Application/conditional-approve/conditional-approve.component';
import { ConditionalApproveListComponent } from '../../Loan-Application/conditional-approve-list/conditional-approve-list.component';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { LoanDetailsServices } from '../../Loan-Application/loan-details/loan-details.services';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemProcessEntity } from 'src/app/shared/Entities/Item.process.entity';
import { ListDocumentsComponent } from '../../GED/list-documents/list-documents.component';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { customRequiredValidator } from '../../../shared/utils';
import { LegalParticipantsComponent } from '../../Collection/legal-participants/legal-participants.component';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { GenericWorkFlowService } from '../generic-workflow.service';
import { ItemNoteEntity } from 'src/app/shared/Entities/ItemNote.entity';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { ThirdPartyHitsoryComponent } from '../../Collection/third-party-hitsory/third-party-hitsory.component';
import { CustomerAnalyseComponent } from '../../Customer/customer-analyse/customer-analyse.component';
import { AcmAmlCheckEntity } from 'src/app/shared/Entities/AcmAmlCheck';
import { AcmAmlDataEntity } from 'src/app/shared/Entities/AcmAmlData';
import { AcmDoubtfulLoanAnalyticsEntity } from 'src/app/shared/Entities/AcmDoubtfulLoanAnalytics.entity';
import { ScreeningStepService } from '../../Loan-Application/screening-step/screening-step.service';

@Component({
  selector: "app-generic-work-flow-screen",
  templateUrl: "./generic-work-flow-screen.component.html",
  styleUrls: ["./generic-work-flow-screen.component.sass"],
})
export class GenericWorkFlowScreenComponent implements OnInit {
  public approveForm: FormGroup;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  @ViewChild(RiskLevelComponentComponent)
  riskLevelComponentComponent: RiskLevelComponentComponent;
  @ViewChild(GenericWorkFlowDocumentComponent)
  genericWorkFlowDocumentComponent: GenericWorkFlowDocumentComponent;
  @ViewChild(ItemProcessComponent)
  itemProcessComponent: ItemProcessComponent;
  @ViewChild(ConditionalApproveListComponent)
  conditionalApproveListComponent: ConditionalApproveListComponent;
  @ViewChild(ListDocumentsComponent)
  listDocumentsComponent: ListDocumentsComponent;
  validatorCheck: boolean = false;
  @ViewChild(CustomerAnalyseComponent)
  customerAnalyseComponent: CustomerAnalyseComponent;



  changingValue: Subject<boolean> = new Subject();
  public confirmApprove: boolean;
  checkNavigate: boolean;
  public modalForm: FormGroup;
  public settingMotifRejetsEntity: SettingMotifRejetsEntity =
    new SettingMotifRejetsEntity();
  public settingMotifRejetsEntitys = [];
  public checkModalReject: boolean;
  public confirmReject: boolean;
  public item: ItemEntity;
  public user: UserEntity;
  public saveActions: string[] = [];
  @ViewChild(LegalParticipantsComponent)
  public legalParticipantsComponent: LegalParticipantsComponent;
  public saveParticipants = true;
  public groupeEntitys: GroupeEntity[] = [];
  public groupeEntity: GroupeEntity = new GroupeEntity();
  public confirmSkip: boolean;
  public confirmAml: boolean;
  public clearAml: boolean;
  public modalSkipForm: FormGroup;
  public modalAmlConfirmForm: FormGroup;
  public modalAmlClearForm: FormGroup;
  public lengthDocuments: number;
  public saveFilesAction = true;
  public originSource: string;
  checkRequiredDocument = false;
  requiredDocuments = false;
  categoryLoan = "loan approval";
  public confirmReview: boolean;
  public settingMotifReviewEntity: SettingMotifRejetsEntity =
    new SettingMotifRejetsEntity();
  public settingMotifReviewEntitys = [];
  public checkModalReview: boolean;
  public configUsers = {
    displayKey: "libelle",
    search: true,
    placeholder: " ",
    searchOnKey: "libelle",
  };
  public source: string;
  public amlCheck: AcmAmlCheckEntity;
  public amlData: AcmAmlDataEntity;
  public acmDoubtfulLoanAnalyticsEntity: AcmDoubtfulLoanAnalyticsEntity;
  public currentPath = AcmConstants.GENERIC_WORKFLOW_SCREEN;

  @ViewChild(ThirdPartyHitsoryComponent)
  thirdPartyHitsoryComponent: ThirdPartyHitsoryComponent;
  constructor(
    public modalService: NgbModal,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    public sharedService: SharedService,
    public settingService: SettingsService,
    public loanDetailsServices: LoanDetailsServices,
    public router: Router,
    public authentificationService: AuthentificationService,
    public devToolsServices: AcmDevToolsServices,
    public genericWorkService: GenericWorkFlowService,
    public activatedRoute: ActivatedRoute,
    public screeningStepService: ScreeningStepService

  ) { }

  async ngOnInit() {
    this.devToolsServices.backTop();
    await this.activatedRoute.queryParams.subscribe((params) => {
      this.source = params.source;
    });
    if (this.source === AcmConstants.AML_CHECK) {
      this.amlCheck = this.sharedService.getAcmAmlCheck();

      const acmAmlDataParam = new AcmAmlDataEntity();
      acmAmlDataParam.id = Number(this.amlCheck.idAmlData);

      await this.settingService.getAmlData(acmAmlDataParam).toPromise().then((res) => {
        this.amlData = res[0];
      })
    }
    if (this.source === AcmConstants.AML_DOUBTFUL) {
      this.acmDoubtfulLoanAnalyticsEntity = this.sharedService.getAcmDoubtfulLoanAnalytics();
    }
    this.item = this.sharedService.getItem();
    this.user = this.sharedService.getUser();
    if(this.legalParticipantsComponent){
      this.legalParticipantsComponent.ngOnInit();
    }
  }
  requiredDocument(event?: boolean) {
    this.requiredDocuments = event;
  }
  changeChecboxApprove() {
    if (this.confirmApprove === false) {
      this.confirmApprove = true;
    } else {
      this.confirmApprove = false;
      this.approveForm.controls.confirm.setValue("");
    }
  }
  createApproveForm() {
    this.approveForm = this.formBuilder.group({
      confirm: ['', customRequiredValidator]
    });
  }

  async approveModel(content) {
    if (!this.udfStepWorkflowComponent) {
      this.createApproveForm();

      this.modalService.open(content, {
        size: "xl",
      });
    } else {
      this.devToolsServices.makeFormAsTouched(
        this.udfStepWorkflowComponent.udfLoanForm
      );

      if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
        this.createApproveForm();

        this.modalService.open(content, {
          size: "xl",
        });
      }
    }



  }

  getDirection() {
    return AppComponent.direction;
  }

  createForm() {
    this.modalForm = this.formBuilder.group({
      reason: ['', customRequiredValidator],
      step: ['', customRequiredValidator],
      note: ['', customRequiredValidator],
      confirm: ['', customRequiredValidator],
      reviewAllPreviousSteps: [false]
    });
  }
  async rejectModal(content) {
    this.createForm();
    this.confirmReject = false;
    this.settingMotifRejetsEntity.categorie = AcmConstants.REJECT_GNERIRIC_WF_CATEGORIE;
    await this.loanDetailsServices.getReason(this.settingMotifRejetsEntity).toPromise().then(
      (data) => {
        this.settingMotifRejetsEntitys = data;
      }
    );
    this.checkModalReject = true;
    this.modalService.open(content, {
      size: 'md'
    });
  }

  exit() {
    if(this.source == AcmConstants.AML_DOUBTFUL || this.source == AcmConstants.AML_CHECK){
      this.router.navigate([AcmConstants.DASHBOARD_ITEM_URL],{queryParams:{source:this.source}}) ;
    }else{
      this.router.navigate([AcmConstants.DASHBOARD_ITEM_URL]);
    }
  }

  reject() {
    this.modalForm.controls.step.setValidators([]);
    this.modalForm.controls.step.updateValueAndValidity();
    if (this.modalForm.valid) {
      this.item.reasonLabel = this.modalForm.controls.reason.value.libelle;
      this.item.status = this.modalForm.controls.step.value.libelle;
      //this.item.owner = this.modalForm.controls.step.value.actionUser;

      this.settingService
        .rejectItem(this.sharedService.getItem())
        .subscribe((data) => {
          this.sharedService.setItem(data);
          this.modalService.dismissAll();
          this.router.navigate([AcmConstants.DASHBOARD_ITEM_URL]);
        });
      this.checkModalReject = false;
    }
  }

  changeChecboxReject() {
    if (this.confirmReject === false) {
      this.confirmReject = true;
    } else {
      this.confirmReject = false;
      this.modalForm.controls.confirm.setValue("");
    }
  }

  async nextStep() {
    await this.callSaveAllDataComponent();
    this.devToolsServices.makeFormAsTouched(this.approveForm);
    this.changingValue.next(false);
    if (this.approveForm.valid && this.validatorCheck && !this.requiredDocuments) {
      this.changingValue.next(true);
      await this.settingService
        .nextStep(this.sharedService.getItem())
        .toPromise().then(async (res) => {
          this.sharedService.setItem(res);
          this.item = res;
          setTimeout(() => {
            this.callOninitComponent();
          }, 1000);
          this.modalService.dismissAll();
          this.ngOnInit();
        });
    } else {
      if (this.requiredDocuments)
        this.devToolsServices.openToast(3, 'alert.enter_required_documents');
      else this.devToolsServices.openToast(3, 'alert.check_data');
      this.requiredDocuments = false;
    }
  }

  saveDocumentsDone(event) {
    if (this.checkNavigate === true)
      this.sharedService.getIhmByAction(
        AcmConstants.NEXT_FORM_MSG,
        AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE
      );
  }

  receiveLengthDocuments(number: number) {
    this.lengthDocuments = number;
  }
  checkRequiredDocumentParent(event) {
    if (event === 0) {
      this.checkRequiredDocument = true;
    } else {
      this.checkRequiredDocument = false;
    }
  }
  async callSaveAllDataComponent() {

    await this.genericWorkFlowDocumentComponent.save();
    await this.save();
    await this.udfStepWorkflowComponent.saveUdfLinks();
    await this.riskLevelComponentComponent.saveLstItemRisk();
    //await this.udfStepWorkflowComponent.ngOnInit();



  }


  async callOninitComponent() {
    await this.riskLevelComponentComponent.ngOnInit();
    await this.genericWorkFlowDocumentComponent.ngOnInit();
    await this.itemProcessComponent.ngOnInit();
    await this.listDocumentsComponent.ngOnInit();
    await this.conditionalApproveListComponent.ngOnInit();
    await this.customerAnalyseComponent.ngOnInit();

  }
  reviewSteps(): ItemProcessEntity[] {
    return this.sharedService
      .getItem()
      .itemInstanceDTOs.filter(
        (step) => step.id < this.sharedService.getItem().actualStepInstance
      );
  }
  validatorHandler(event: boolean) {
    this.validatorCheck = event;
  }
  async reviewModal(content) {
    this.modalService.open(content, {
      size: "md",
    });

    this.createForm();
    this.confirmReview = false;
    this.settingMotifReviewEntity.categorie = AcmConstants.REVIEW_GNERIRIC_WF_CATEGORIE;
    await this.loanDetailsServices
      .getReason(this.settingMotifReviewEntity)
      .toPromise()
      .then((data) => {
        this.settingMotifReviewEntitys = data;
      });
    this.checkModalReject = false;
    this.checkModalReview = true;
  }


  changeChecboxReview() {
    if (this.confirmReview === false) {
      this.confirmReview = true;
    } else {
      this.confirmReview = false;
      this.modalForm.controls.confirm.setValue('');
    }
  }
  async review() {
    // if checkBox is not checked , set reviewOnlySelectedStep as true
    this.devToolsServices.makeFormAsTouched(this.modalForm);
    if (this.modalForm.valid) {
      if (!this.modalForm.value.reviewAllPreviousSteps) {
        this.item.reviewOnlySelectedStep = true;
        this.item.reviewFromStep = this.item.actualStep;
      }
      this.item.actualStep = this.modalForm.controls.step.value.idWorkFlowStep;
      this.item.actualStepInstance = this.modalForm.controls.step.value.id
      this.item.reasonLabel = this.modalForm.controls.reason.value.libelle
      this.item.status = this.modalForm.controls.step.value.libelle;
      this.item.owner = this.modalForm.controls.step.value.actionUser;
      this.modalService.dismissAll();
      //this.item.etapeWorkflow = this.modalForm.controls.step.value.code;
      //this.item.status = this.modalForm.controls.step.value.code;

      // get full name by username to display it in loanOwnerName
      await this.authentificationService.getUserByLogin(this.modalForm.controls.step.value.actionUser)
        .toPromise().then(res => {
          //this.item.ownerName = res.fullName;
        });
      this.item.status = -2;
      await this.settingService.itemReview(this.item).subscribe(
        (data) => {
          this.sharedService.setItem(data);
          this.router.navigate([AcmConstants.DASHBOARD_ITEM_URL]);
        });
      this.checkModalReview = false;
    }
  }

  async actionCompleted(event?: string) {
    if (event !== null && event !== undefined) {
      // if third parties is not saved
      if (event == "2") {

        await this.thirdPartyHitsoryComponent.ngOnInit("GENERIC_WORKFLOW");
      }
    }

  }

  /**
   * Display the confirmation message
   */
  async save(source?: string): Promise<void> {
    // send origin source as 'click on save button' or 'click on complete button'
    this.originSource = source;
    if (this.legalParticipantsComponent!==undefined && this.legalParticipantsComponent!==null&& this.legalParticipantsComponent.check === true) {
      // save changes of third parties
      this.saveParticipants = !this.saveParticipants;
    } else {
      // there is no changes is third parties
      this.saveActions.push("2,");
    }
  }

  skipSteps(): ItemProcessEntity[] {
    let a = this.item.itemInstanceDTOs.filter(
      (step) => step.idWorkFlowStep > this.item.actualStep
    );
    return a;
  }

  getUsers() {
    this.settingService.findGroup(this.groupeEntity).subscribe((data) => {
      this.groupeEntitys = data;
    });
  }

  createFormSkip() {
    this.modalSkipForm = this.formBuilder.group({
      confirm: ["", customRequiredValidator],
      step: ["", customRequiredValidator],
      user: ["", customRequiredValidator],
    });
  }
  async skipModal(content) {
    this.createFormSkip();
    this.getUsers();
    this.confirmSkip = false;
    this.modalService.open(content, {
      size: "md",
    });
  }

  changeConfirmChecbox() {
    if (this.confirmSkip === false) {
      this.confirmSkip = true;
    } else {
      this.confirmSkip = false;
      this.modalForm.controls.confirm.setValue("");
    }
  }

  skip() {
    if (this.modalSkipForm.valid) {
      this.modalService.dismissAll();
      let actualStep: number = this.item.actualStep;
      this.item.actualStep =
        this.modalSkipForm.controls.step.value.idWorkFlowStep;

      this.item.itemInstanceDTOs.forEach(instance => {
        if (instance.idWorkFlowStep === this.item.actualStep) {
          this.item.actualStepInstance = instance.id

        }
      })

      this.item.owner = null;
      this.item.ownerName = null;
      this.item.groupOwner = this.modalSkipForm.controls.user.value.code;
      this.item.groupOwnerName = this.modalSkipForm.controls.user.value.libelle;
      // this.item.status=8;

      //add note  to any step skipped
      let lstSkippedStep = this.item.itemInstanceDTOs.filter(
        (step) =>
          step.idWorkFlowStep < this.item.actualStep &&
          step.idWorkFlowStep >= actualStep
      );
      lstSkippedStep.forEach(async (item) => {
        const note: ItemNoteEntity = new ItemNoteEntity();

        const newStepParam: StepEntity = new StepEntity();
        newStepParam.idWorkFlowStep = this.item.actualStep;
        newStepParam.process = AcmConstants.GENERIC_WORKFLOW;
        await this.settingService
          .findWorkFlowSteps(newStepParam)
          .toPromise()
          .then((dataStep) => {
            //item note
            note.comment =
              "Step: " +
              dataStep[0].stepName +
              "has been skipped by " +
              this.sharedService.getUser().login;
            note.action = dataStep[0].stepName;
            note.itemId = this.item.id;
            note.insertBy = this.sharedService.getUser().login;
            this.genericWorkService
              .createItemNotes(note)
              .subscribe((data) => { });
          });

        item.actionUser = this.sharedService.getUser().login;
        this.settingService.UpdateItemInstances(item).subscribe((res)=>{})

      });

      const stepEntity: StepEntity = new StepEntity();
      stepEntity.idWorkFlowStep =
        this.modalSkipForm.controls.step.value.idWorkFlowStep;
      this.settingService.UpdateItem(this.item).subscribe(() => {
        this.devToolsServices.openToast(0, "alert.success");
        this.router.navigate(["acm/generic-wf-dashbord"]);
      });
    }
  }
  changeStatusAml(status: string) {
    if ((status==='FLAGGED' && this.modalAmlConfirmForm.valid) || (status==='CLEARED' && this.modalAmlClearForm.valid) ) {
      this.modalService.dismissAll();

      this.amlCheck.amlStatus = status;
    this.screeningStepService.UpdateAmlCheck(this.amlCheck).subscribe((res) => {
      this.devToolsServices.openToast(0, "alert.success");
      this.router.navigate(['/acm/generic-wf-dashbord'], { queryParams: { source: 'SCAN' } });
    })
    }
  }

 async changeStatusConfirmModal(content){
    this.modalAmlConfirmForm = this.formBuilder.group({
      confirm: ["", customRequiredValidator]
    });
    this.confirmAml = false;
    this.modalService.open(content, {
      size: "md",
    });

  }
//confirm modal
  changeConfirmChecboxConfirm() {
    if (this.confirmAml === false) {
      this.confirmAml = true;
    } else {
      this.confirmAml = false;
      this.modalAmlConfirmForm.controls.confirm.setValue("");
    }
  }
 //clear modal
  async changeStatusClearModal(content){
    this.modalAmlClearForm = this.formBuilder.group({
      confirm: ["", customRequiredValidator]
    });
    this.clearAml = false;
    this.modalService.open(content, {
      size: "md",
    });

  }

  changeConfirmChecboxClear() {
    if (this.clearAml === false) {
      this.clearAml = true;
    } else {
      this.clearAml = false;
      this.modalAmlClearForm.controls.confirm.setValue("");
    }
  }

}
