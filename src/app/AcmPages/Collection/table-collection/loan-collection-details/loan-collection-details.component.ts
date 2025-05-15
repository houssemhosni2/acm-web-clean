import { SettingCollectionValidationComponent } from './../../../Settings/setting-collection-validation/setting-collection-validation.component';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer360Services } from 'src/app/AcmPages/Customer/customer360/customer360.services';
import { UdfService } from 'src/app/AcmPages/Loan-Application/udf/udf.service';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionNoteEntity } from 'src/app/shared/Entities/CollectionNote.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { UDFLinksGroupeFieldsEntity } from 'src/app/shared/Entities/udfLinksGroupeFields.entity';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CollectionServices } from '../../collection.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { UdfStepWorkflowComponent } from 'src/app/AcmPages/Loan-Application/udf-step-workflow/udf-step-workflow.component';
import { LegalParticipantsComponent } from '../../legal-participants/legal-participants.component';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { LoanDetailsServices } from 'src/app/AcmPages/Loan-Application/loan-details/loan-details.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CollectionProcessEntity } from 'src/app/shared/Entities/CollectionProcess.entity';
import { PageTitleService } from 'src/app/Layout/Components/page-title/page-title.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { map, mergeMap } from 'rxjs/operators';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { checkOfflineMode, customRequiredValidator } from 'src/app/shared/utils';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
@Component({
  selector: 'app-loan-collection-details',
  templateUrl: './loan-collection-details.component.html',
  styleUrls: ['./loan-collection-details.component.sass'],
})
export class LoanCollectionDetailsComponent implements OnInit {
  @ViewChild(SettingCollectionValidationComponent)
  settingCollectionValidationComponent: SettingCollectionValidationComponent;
  public loan: LoanEntity = new LoanEntity();
  public categoryCollection = AcmConstants.COLLECTION;
  public idLoanExtern: number;
  public udfGroupsLoan: UserDefinedFieldGroupEntity[] = [];
  public udfLinkGroupLoan: UDFLinksGroupeFieldsEntity[] = [];
  public listUDFGroupsLoan: UserDefinedFieldGroupEntity[] = [];
  public indexFormUdfLoan = 0;
  public selectedGroupLoan: UDFLinksGroupeFieldsEntity;
  public udfFieldLoan: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
  public surveysId: number;
  public collection: CollectionEntity = new CollectionEntity();
  public completeButtonDisabled = false;
  public udfLoanForm: FormGroup;
  public udfFieldsLoan: UserDefinedFieldsEntity[][] = [];
  public udfGroupLoan: UserDefinedFieldGroupEntity =
    new UserDefinedFieldGroupEntity();
  public date = new Date();
  allDocuments = [];
  public saveFilesAction = true;
  @Output() newCollectionNote = new EventEmitter<CollectionNoteEntity>();
  public source: string;
  public originSource: string;
  public view: string = AcmConstants.VIEW;
  public decimalPlaces: string;
  public isLoan = false;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  public saveParticipants = true;
  public saveActions: string[] = [];
  @ViewChild(LegalParticipantsComponent) legalParticipantsComponent: LegalParticipantsComponent;
  public users: UserEntity[] = [];
  public modalForm: FormGroup;
  public confirmSkip: boolean;
  public collectionId : number  ;
  public configUsers = {
    displayKey: 'libelle',
    search: true,
    placeholder: ' ',
    searchOnKey: 'libelle'
  };
  public currentPath = 'loan-collection-details';

  public settingMotifReviewEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifReviewEntitys = [];


  public groupeEntitys: GroupeEntity[] = [];
  public groupeEntity: GroupeEntity = new GroupeEntity();

  constructor(
    public modalService: NgbModal,
    public loanDetailsServices: LoanDetailsServices,
    public translate: TranslateService,
    public pageTitleService: PageTitleService,
    public udfService: UdfService,
    public formBuilder: FormBuilder,
    public loanSharedService: SharedService,
    private devToolsServices: AcmDevToolsServices,
    public activatedRoute: ActivatedRoute,
    public customer360Services: Customer360Services,
    private collectionServices: CollectionServices,
    private settingService : SettingsService ,
    public router: Router,
    public authentificationService : AuthentificationService,
    private dbService: NgxIndexedDBService
  ) { }

  async ngOnInit() {
    // get loan from shared service
    this.loan = this.loanSharedService.getLoan();
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    // get collection from sharedService
    this.collection = this.loanSharedService.getCollection();
    this.collectionId = this.loanSharedService.getCollection().id ;
    // set complete button to disabled if SysDate < availability date of the collection

    if (this.collection.availableDate > this.date || (this.collection.status !== 0&&this.collection.status !== 2) ||
      this.loanSharedService.getUser().login !== this.collection.owner) {
      this.completeButtonDisabled = true;
    }

    await this.activatedRoute.queryParams.subscribe((params) => {
      this.source = params.source;
    });
  }

  async actionCompleted(event?: string) {
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.invalid) {
      this.devToolsServices.InvalidControl();
    }
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      if (event !== null && event !== undefined) {
        this.saveActions.push(event + ',');
        // if documents or third parties are not saved
        if (!this.saveActions.includes('2,') || !this.saveActions.includes('1,')) {
          return;
        }
      }
      // check if there is changes in third parties or documents
      if (this.legalParticipantsComponent.check === true ||
        this.settingCollectionValidationComponent.documentListUpdated === true) {
        // save changes
        this.save(AcmConstants.COMPLETE_ACTION);
      }
      else {
        await this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.complete_task').afterClosed().subscribe(res => {
          if (res) {
            if(!checkOfflineMode()){
            this.collectionServices.collectionActionCompleted(this.collection).subscribe((data) => {
              this.devToolsServices.openToast(0, 'alert.success');
              this.router.navigate(['acm/collections'], { queryParams: { type: 'COLLECTION' } });
            });
          }
          else{
            this.dbService.update('collections', this.collection).toPromise().then(()=>{
               this.dbService.getByKey('collections-pagination', this.loanSharedService.getCollectionsKey()).toPromise().then((collectionPagination: any) => {

                let updatedCollection = this.collection;
                const sortedInstances = this.collection.collectionInstancesDtos.sort((a, b) => a.orderEtapeProcess - b.orderEtapeProcess);
                const currentIndex = sortedInstances.findIndex(instance => instance.idAcmCollectionStep === this.collection.idAcmCollectionStep);
                const nextInstance = sortedInstances[currentIndex + 1];
                updatedCollection.idAcmCollectionStep = nextInstance.idAcmCollectionStep;
                updatedCollection.statutLibelle = nextInstance.libelle;
                updatedCollection.statutLibelleDone = sortedInstances[currentIndex].libelle;

                const indexToUpdate = collectionPagination.resultsCollections.findIndex(collection => collection.id === this.collection.id);

                if (indexToUpdate !== -1) {
                  collectionPagination.resultsCollections[indexToUpdate] = updatedCollection;
                  this.dbService.update('collections-pagination', collectionPagination).toPromise().then(() => {
                    this.router.navigate(['acm/collections'], { queryParams: { type: 'COLLECTION' } });
                  }).catch(error => {
                    console.error('Error updating collection pagination:', error);
                  });
                }
              });
            });
          }
          }
        });
      }
        // save udf collection
        this.udfStepWorkflowComponent.saveUdfLinks();
    }
  }

  exit() {
    if (this.source === 'calendar') {
      this.router.navigate(['crm/calendar']);
    } else if (this.source === 'dashboard-collection') {
      this.router.navigate(['acm/collections'], { queryParams: { type: 'COLLECTION' } });
    }
    else if (this.source === 'customer-360') {
      this.router.navigate(['acm/customer-360-details']);
    } else if (this.source === 'planning') {
      this.router.navigate([AcmConstants.TASK_URL]);
    }
  }

  /**
   * Display the confirmation message
   */
  save(source?: string) {
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.invalid) {
      this.devToolsServices.InvalidControl();
      return;
    }
    // if source is Complete button then the saveUdfLinks() method is already called
    if (source !== AcmConstants.COMPLETE_ACTION) {
      // save udf collection
      this.udfStepWorkflowComponent.saveUdfLinks();
    }

    // send origin source as 'click on save button' or 'click on complete button'
    this.originSource = source;
    if (this.legalParticipantsComponent.check === true) {
      // save changes of third parties
      this.saveParticipants = !this.saveParticipants;
    } else {
      // there is no changes is third parties
      this.saveActions.push('2,');
    }
    // check if there is changes in documents
    if (this.settingCollectionValidationComponent.documentListUpdated === true) {
      this.saveFilesAction = !this.saveFilesAction;
    }
    else {
      // there is no changes in add document
      this.saveActions.push('1,');
    }

  }
  async skipModal(content) {
    this.createForm();
    this.getUsers();
    this.confirmSkip = false;
    this.modalService.open(content, {
      size: 'md'
    });
  }
  createForm() {
    this.modalForm = this.formBuilder.group({
      confirm: ['', Validators.required],
      step: ['', Validators.required],
      user: ['', Validators.required]
    });
  }
  skipSteps(): CollectionProcessEntity[] {
    let a = this.collection.collectionInstancesDtos.filter(step => step.idAcmCollectionStep > this.collection.idAcmCollectionStep);
    return a;
  }
  getUsers() {
    // this.pageTitleService.loadAllUserList().subscribe(
    //   (data) => {
    //     this.users = data;
    //   });


      this.settingService.findGroup(this.groupeEntity).subscribe(
        (data) => {
          this.groupeEntitys = data;
        }
      );
  }
  changeConfirmChecbox() {
    if (this.confirmSkip === false) {
      this.confirmSkip = true;
    } else {
      this.confirmSkip = false;
      this.modalForm.controls.confirm.setValue('');
    }
  }
  getDirection() {
    return AppComponent.direction;
  }

  skip() {

    if (this.modalForm.valid) {
      this.modalService.dismissAll();

      if (this.legalParticipantsComponent.check === true ||
        this.settingCollectionValidationComponent.documentListUpdated === true) {
        // save changes
        this.save();
      }

      let actualStep : number =  this.collection.idAcmCollectionStep ;
      this.collection.idAcmCollectionStep = this.modalForm.controls.step.value.idAcmCollectionStep;

      this.collection.owner = null;
      this.collection.ownerName =null;
      this.collection.groupOwner = this.modalForm.controls.user.value.code  ;
      this.collection.groupOwnerName = this.modalForm.controls.user.value.libelle ;

      this.collection.statutLibelle = this.modalForm.controls.step.value.stepName ;
      this.collection.statutLibelleDone = null ;
      //add note  to any step skipped
      let  lstSkippedStep =  this.collection.collectionInstancesDtos.filter(step => step.idAcmCollectionStep < this.collection.idAcmCollectionStep && step.idAcmCollectionStep >= actualStep);
      lstSkippedStep.forEach(item =>{

        const note: CollectionNoteEntity = new CollectionNoteEntity();
        note.comment ='Step has been skipped'
        note.action = item.stepName;
        note.collectionId = this.collection.id;
        note.insertBy = this.loanSharedService.getUser().login;
        this.collectionServices.createNewCollectionNote(note).subscribe((data) => {
        });

        // set  step action user 
        item.actionUser = this.loanSharedService.getUser().login;
        this.collectionServices.UpdateCollectionInstances(item).subscribe((data) => {
        });

      }) ;
      const stepEntity : StepEntity = new StepEntity()  ;
      stepEntity.idCollectionStep =    this.modalForm.controls.step.value.idAcmCollectionStep      ;
      this.settingService.findCollectionSteps(stepEntity ).subscribe(res =>{
        this.collection.statutWorkflow = res[0].stepTab;
        this.collectionServices.UpdateCollection(this.collection).subscribe(
          () => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.router.navigate(['acm/collections'], { queryParams: { type: 'COLLECTION' } });
          });

        });
    }
  }
  createLegal() {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.CLOSE_COLLECTION_MSG)
      .afterClosed().subscribe(res => {
        if (res) {
          this.collection.idAcmCollectionStep = this.collection.collectionInstancesDtos.sort((instance1, instance2) => instance1.idAcmCollectionStep - instance2.idAcmCollectionStep)[this.collection.collectionInstancesDtos.length - 1].idAcmCollectionStep;
          this.collection.status = 1;
          this.collectionServices.collectionActionCompleted(this.collection).pipe(
            map(() => {
              // create new legal case
              let legal: CollectionEntity = this.collection;
              legal.idParentCollection = this.collection.id;
              legal.id = null;
              legal.collectionType = AcmConstants.LEGAL_CATEGORY;
              legal.status = 0;
              legal.enabled = true;
              let collections: CollectionEntity[] = [];
              collections.push(legal);
              return collections;
            }),
            mergeMap((collections) => {
              return this.collectionServices.saveAllCollections(collections, AcmConstants.LEGAL);
            })
          ).subscribe(() => {
            const note: CollectionNoteEntity = new CollectionNoteEntity();
            note.comment ='Passed to legal case'
            note.action = 'Close and open legal case';
            note.collectionId =this.collectionId;
            note.insertBy = this.loanSharedService.getUser().login;
            this.collectionServices.createNewCollectionNote(note).subscribe((data) => {
            });
            this.devToolsServices.openToast(0, 'alert.success');
            this.router.navigate(['acm/collections'], { queryParams: { type: 'COLLECTION' } });
          })
        }
      });
  }

  reviewSteps(): CollectionProcessEntity[] {  
    return this.collection.collectionInstancesDtos.filter(step => step.idAcmCollectionStep < this.collection.idAcmCollectionStep);
  }
  createFormReview() {

      this.modalForm = this.formBuilder.group({
        reason: ['', customRequiredValidator],
        step: ['', customRequiredValidator],
        note: ['', customRequiredValidator],
        confirm: ['', customRequiredValidator],
        reviewAllPreviousSteps: [false]
      });



  }


  onSubmit() {
    this.loan.note = this.modalForm.value.reason.libelle;
    this.loan.note = this.loan.note + ' : ' + this.modalForm.value.note;
    this.loan.codeExternMotifRejet = this.modalForm.value.reason.codeExternal;
    if (this.modalForm.valid) {
          this.review();
    }
  }

  async review() {
    const oldCollection = Object.assign({}, this.collection);

    // if checkBox is not checked , set reviewOnlySelectedStep as true
    oldCollection.reviewOnlySelectedStep = !this.modalForm.controls.reviewAllPreviousSteps.value;
    if (!this.modalForm.controls.reviewAllPreviousSteps.value){
      oldCollection.reviewFrom = this.collection.idAcmCollectionStep;
    }
    oldCollection.idAcmCollectionStep = this.modalForm.controls.step.value.idAcmCollectionStep;
    oldCollection.statutWorkflow = AcmConstants.WORKFLOW_STATUS_REVIEW_COLLECTION;
    oldCollection.statutLibelle = this.modalForm.controls.step.value.libelle;
    oldCollection.owner = this.modalForm.controls.step.value.actionUser;
    // get full name by username to display it in loanOwnerName
    await this.authentificationService.getUserByLogin(this.modalForm.controls.step.value.actionUser)
    .toPromise().then(res => {
      console.log(res);
      
      oldCollection.ownerName = res.fullName;
    });
    oldCollection.status =AcmConstants.STATUS_REVIEW_COLLECTION;
    await this.collectionServices.UpdateCollection(oldCollection).subscribe(
      (data) => {


          this.loanSharedService.setCollection(data);
          this.router.navigate(['/acm/collections'], { queryParams: { type: 'COLLECTION' } }).then(()=>{
            const note: CollectionNoteEntity = new CollectionNoteEntity();
            note.comment =this.modalForm.value.note
            note.action = "REVIEW";
            note.collectionId = this.collection.id;
            note.insertBy = this.loanSharedService.getUser().login;
            this.modalService.dismissAll();
            this.collectionServices.createNewCollectionNote(note).subscribe((data) => {
            });
            window.scrollTo(0, 0);
          });
          //this.router.navigate([AcmConstants.COLLECTION_LIST]);
        }
      );
  }


  async reviewModal(content, categories) {

    this.modalService.open(content, {
      size: 'md'
    });
    this.loan = this.loanSharedService.getLoan();
    this.createFormReview();
    if (categories === AcmConstants.REVIEW_CATEGORIE) {
      this.settingMotifReviewEntity.categorie = AcmConstants.REVIEW_CATEGORIE;
    } else if (categories === AcmConstants.REVIEW_AGREEMENTS_CATEGORIE) {
      this.settingMotifReviewEntity.categorie = AcmConstants.REVIEW_AGREEMENTS_CATEGORIE;
    }
    await this.loanDetailsServices.getReason(this.settingMotifReviewEntity).toPromise().then(
      (data) => {
        this.settingMotifReviewEntitys = data;
      }
    );
  }
  isOfflineModeEnabled() {
    return checkOfflineMode();
   }
  
  
}
