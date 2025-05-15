import { Component, OnInit } from '@angular/core';
import { SettingCollectionValidationComponent } from './../../../Settings/setting-collection-validation/setting-collection-validation.component';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { LegalParticipantsComponent } from '../../legal-participants/legal-participants.component';
import { UdfStepWorkflowComponent } from 'src/app/AcmPages/Loan-Application/udf-step-workflow/udf-step-workflow.component';
import { CollectionProcessEntity } from 'src/app/shared/Entities/CollectionProcess.entity';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { customRequiredValidator } from 'src/app/shared/utils';
import { LoanDetailsServices } from 'src/app/AcmPages/Loan-Application/loan-details/loan-details.services';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';

@Component({
  selector: 'app-loan-legal-details',
  templateUrl: './loan-legal-details.component.html',
  styleUrls: ['./loan-legal-details.component.sass']
})
export class LoanLegalDetailsComponent implements OnInit {
  @ViewChild(SettingCollectionValidationComponent) settingCollectionValidationComponent: SettingCollectionValidationComponent;
  @ViewChild(LegalParticipantsComponent) legalParticipantsComponent: LegalParticipantsComponent;
  public loan: LoanEntity = new LoanEntity();
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
  public categoryLegal = AcmConstants.LEGAL;
  public categoryCollection = AcmConstants.COLLECTION;
  allDocuments = [];
  public saveFilesAction = true;
  public saveParticipants = true;
  @Output() newCollectionNote = new EventEmitter<CollectionNoteEntity>();
  public source: string;
  public saveActions: string[] = [];
  public originSource: string;
  public view:string=AcmConstants.VIEW;
  public decimalPlaces: string;
  public isLoan=false;
  public modalForm: FormGroup;
  public settingMotifReviewEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifReviewEntitys = [];
  currentPath = 'loan-legal-details' ;


  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  constructor(
    public udfService: UdfService,
    public formBuilder: FormBuilder,
    public  loanSharedService: SharedService,
    private devToolsServices: AcmDevToolsServices,
    public activatedRoute: ActivatedRoute,
    public customer360Services: Customer360Services,
    private collectionServices: CollectionServices,
    public router: Router,
    public modalService: NgbModal,
    public loanDetailsServices: LoanDetailsServices,
    public translate: TranslateService,
    public authentificationService : AuthentificationService




  ) { }

  async ngOnInit() {
    // get loan from shared service
    this.loan = this.loanSharedService.getLoan();
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    // get collection from sharedService
    this.collection = this.loanSharedService.getCollection();

    // set complete button to disabled if SysDate < availability date of the collection
    if (this.collection.availableDate > this.date || (this.collection.status !== 0&& this.collection.status !== 2) ||
      this.loanSharedService.getUser().login !== this.collection.owner) {
      this.completeButtonDisabled = true;
    }
    await this.activatedRoute.queryParams.subscribe((params) => {
      this.source = params.source;
    });
     
  }

  /**
   * action completed
   */
  actionCompleted(event?: string) {
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.invalid) {
      this.devToolsServices.InvalidControl();
    }
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      if (event !== null && event !== undefined) {
        this.saveActions.push(event + ',');
        // if documents or third parties are not saved
        if (!this.saveActions.includes('2,') || !this.saveActions.includes('1,')) {
          // return
          return;
        }
      }
      // check if there is changes in third parties or documents
      if (this.legalParticipantsComponent.check === true ||
        this.settingCollectionValidationComponent.documentListUpdated === true) {
        // save changes
        this.save(AcmConstants.COMPLETE_ACTION);
        return;
      }

      // complete actions
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.complete_task').afterClosed().subscribe(res => {
        if (res) {
          this.collectionServices.collectionActionCompleted(this.collection).subscribe((data) => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.router.navigate(['acm/collections'], { queryParams: { type: 'LEGAL' } });
          });
        }
      });
      //save udfs
      this.udfStepWorkflowComponent.saveUdfLinks();
    }
  }

  exit() {
    if (this.source === 'calendar') {
      this.router.navigate(['crm/calendar']);
    } else {
      this.router.navigate(['acm/collections'], { queryParams: { type: 'LEGAL' } });
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
      // save udf
      this.udfStepWorkflowComponent.saveUdfLinks();
    }
    this.originSource = source;
    if (this.legalParticipantsComponent.check === true) {
      // save changes of third parties
      this.saveParticipants = !this.saveParticipants;
    } else {
      // there is no changes is third parties
      this.saveActions.push('2,');
    }
    if (this.settingCollectionValidationComponent.documentListUpdated === true) {
      // save changes of documents
      this.saveFilesAction = !this.saveFilesAction;
    } else {
      // there is no changes in add document
      this.saveActions.push('1,');
    }
  }

  reviewSteps(): CollectionProcessEntity[] {
    return this.collection.collectionInstancesDtos.filter(step => step.idAcmCollectionStep < this.collection.idAcmCollectionStep);
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
      oldCollection.ownerName = res.fullName;
    });
    oldCollection.status =AcmConstants.STATUS_REVIEW_COLLECTION;
    await this.collectionServices.UpdateCollection(oldCollection).subscribe(
      (data) => {
        const note: CollectionNoteEntity = new CollectionNoteEntity();
        note.comment =this.modalForm.value.note
        note.action = "REVIEW";
        note.collectionId = this.collection.id;
        note.insertBy = this.loanSharedService.getUser().login;
        this.modalService.dismissAll();
        this.collectionServices.createNewCollectionNote(note).subscribe((data) => {
        });
          this.loanSharedService.setCollection(data);
          this.router.navigate(['/acm/legal'], { queryParams: { type: 'LEGAL' } }).then(()=>{
            window.scrollTo(0, 0);
          });
          //this.router.navigate([AcmConstants.COLLECTION_LIST]);
        }
      );
  }

  getDirection() {
    return AppComponent.direction;
  }

  

}
