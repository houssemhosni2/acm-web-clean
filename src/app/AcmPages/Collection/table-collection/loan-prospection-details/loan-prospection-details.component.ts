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
import { UdfStepWorkflowComponent } from 'src/app/AcmPages/Loan-Application/udf-step-workflow/udf-step-workflow.component';

@Component({
  selector: 'app-loan-prospection-details',
  templateUrl: './loan-prospection-details.component.html',
  styleUrls: ['./loan-prospection-details.component.sass']
})
export class LoanProspectionDetailsComponent implements OnInit {
  @ViewChild(SettingCollectionValidationComponent) settingCollectionValidationComponent: SettingCollectionValidationComponent;
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
  public categoryLegal = AcmConstants.PROSPECTION;
  //public categoryCollection = AcmConstants.COLLECTION;
  allDocuments = [];
  public saveFilesAction = true;
  public saveParticipants = true;
  @Output() newCollectionNote = new EventEmitter<CollectionNoteEntity>();
  public source: string;
  public saveActions: string[] = [];
  public originSource: string;
  public view:string=AcmConstants.VIEW;
  // public decimalPlaces: string;
  public isLoan=false;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  constructor(
    public udfService: UdfService,
    public formBuilder: FormBuilder,
    private loanSharedService: SharedService,
    private devToolsServices: AcmDevToolsServices,
    public activatedRoute: ActivatedRoute,
    public customer360Services: Customer360Services,
    private collectionServices: CollectionServices,
    public router: Router
  ) { }
 async ngOnInit() {
  // get loan from shared service
  this.loan = this.loanSharedService.getLoan();
  // this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
  // get collection from sharedService
  this.collection = this.loanSharedService.getCollection();
  this.loanSharedService.setCustomer(this.loan.customerDTO);

  // set complete button to disabled if SysDate < availability date of the collection
  if (this.collection.availableDate > this.date || this.collection.status !== 0 ||
    this.loanSharedService.getUser().login !== this.collection.owner) {
    this.completeButtonDisabled = true;
  }
  // await this.activatedRoute.queryParams.subscribe((params) => {
  //   this.source = params.source;
  // });
  this.source = "PROSPECTION";
  }
  actionCompleted(event?: string) {
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
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
      if (this.settingCollectionValidationComponent.documentListUpdated === true) {
        // save changes
        this.save(AcmConstants.COMPLETE_ACTION);
        return;
      }

      // complete actions
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.complete_task').afterClosed().subscribe(res => {
        if (res) {
          this.collectionServices.collectionActionCompleted(this.collection).subscribe((data) => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.router.navigate(['crm/prospection']);
          });
        }
      });
      //save udfs
      this.udfStepWorkflowComponent.saveUdfLinks();
    }
  }

  exit() {
    // if (this.source === 'calendar') {
    //   this.router.navigate(['crm/calendar']);
    // } else {
      this.router.navigate(['crm/prospection']);
    // }
  }

  /**
   * Display the confirmation message
   */
  save(source?: string) {
    // if source is Complete button then the saveUdfLinks() method is already called
    if (source !== AcmConstants.COMPLETE_ACTION) {
      // save udf
      this.udfStepWorkflowComponent.saveUdfLinks();
    }
    this.originSource = source;
 
    if (this.settingCollectionValidationComponent.documentListUpdated === true) {
      // save changes of documents
      this.saveFilesAction = !this.saveFilesAction;
    } else {
      // there is no changes in add document
      this.saveActions.push('1,');
    }
  }

  closeFile(){
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.CLOSE_PROSPECTION)
        .afterClosed().subscribe(res => {
          if (res) {
            this.collection.idAcmCollectionStep = this.collection.collectionInstancesDtos.sort((instance1, instance2) => instance1.idAcmCollectionStep - instance2.idAcmCollectionStep)[this.collection.collectionInstancesDtos.length - 1].idAcmCollectionStep;
            this.collection.status = 1;
            this.collectionServices.collectionActionCompleted(this.collection).subscribe(() => {
              const note: CollectionNoteEntity = new CollectionNoteEntity();
              note.comment ='Workflow Completed'
              note.action = 'DERNIER RECOURS';
              note.collectionId =this.collection.id;
              note.insertBy = this.loanSharedService.getUser().login;
              this.collectionServices.createNewCollectionNote(note).subscribe((data) => {
              });
              this.devToolsServices.openToast(0, 'alert.success');
              this.router.navigate(['crm/prospection']);
            })
          }
        });
  }
}
