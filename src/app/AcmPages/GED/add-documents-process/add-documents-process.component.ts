import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { LoanDetailsServices } from '../../Loan-Application/loan-details/loan-details.services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { GedServiceService } from '../ged-service.service';
import { LoanDocumentEntity } from '../../../shared/Entities/loanDocument.entity';
import { MatDialog } from '@angular/material/dialog';
import { SettingDocumentTypeEntity } from '../../../shared/Entities/settingDocumentType.entity';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { DatePipe } from '@angular/common';
import { UploadItemComponent } from '../upload-item/upload-item.component';
import { checkOfflineMode } from 'src/app/shared/utils';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { SettingsService } from '../../Settings/settings.service';
import { UdfStepWorkflowComponent } from '../../Loan-Application/udf-step-workflow/udf-step-workflow.component';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-add-documents-process',
  templateUrl: './add-documents-process.component.html',
  styleUrls: ['./add-documents-process.component.sass']
})
export class AddDocumentsProcessComponent implements OnInit, OnDestroy {

  public loan: LoanEntity = new LoanEntity();
  public sub: any;
  public idloan: string;
  allDocuments = [];
  checkRequiredDocument = false;
  test = false;
  expanded = true;
  public loading = false;
  public checkNext = true;
  public checkSettingDocument = false;
  @ViewChild(UploadDocumentComponent, { static: true }) childcomp: UploadDocumentComponent;
  @ViewChild(UploadDocumentComponent, { static: true }) checkRequired: UploadDocumentComponent;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: PrimaryBleu };
  slideConfig6 = {
    className: 'center',
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    adaptiveHeight: true,
    dots: true,
  };
  public currentStatus: number;
  public currentPath = 'upload-document';
  public loanProcessEntitys: LoanProcessEntity[] = [];
  public orderProcess: number;
  public view: string = AcmConstants.VIEW;
  categoryLoan = 'add documents';
  @ViewChild(UploadItemComponent)
  uploadItemComponent: UploadItemComponent;
  public saveFilesAction = true;
  public originSource: string;
  public lengthDocuments: number;
  public checkNavigate = false;
  public displayButtonExecuteApi:boolean=false;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  /**
   * constructor
   * @param  loanDetailsServices LoanDetailsServices
   * @param   loanSharedService LoanSharedService
   * @param   route ActivatedRoute
   * @param   formBuilder FormBuilder
   * @param   router Router
   * @param   gedService GedServiceService
   * @param   dialog MatDialog
   * @param   devToolsServices ACMDevToolsServices
   * @param   datePipe DatePipe
   */
  constructor(public loanDetailsServices: LoanDetailsServices,
    public loanSharedService: SharedService,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public router: Router,
    public gedService: GedServiceService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public devToolsServices: AcmDevToolsServices,
    public settingService: SettingsService
  ) {

  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }

  /**
   * onInit get loan information
   */
  ngOnInit() {
    this.devToolsServices.backTop();
    this.loan = this.loanSharedService.getLoan();
    this.loanProcessEntitys = this.loan.loanInstancesDtos;
    this.loanProcessEntitys.forEach(element => {
      if (element.code === this.loan.etapeWorkflow) {
        this.orderProcess = element.orderEtapeProcess;
      }
      if (element.ihmRoot === this.currentPath) {
        this.currentStatus = element.code;
      }
    });

    const stepEntity: StepEntity = new StepEntity();
    stepEntity.productId = this.loan.productId;
    stepEntity.idWorkFlowStep = this.loan.etapeWorkflow;
    this.settingService.findWorkFlowSteps(stepEntity).subscribe((dataStep) => {
     if(dataStep[0].automaticStep
      &&
      (dataStep[0].acceptationCondition!== null || dataStep[0].rejectionCondition!== null))
      {
       this.displayButtonExecuteApi=true;
      }
    });
  }

  /**
   * Methode to next step
   */
  nextStep() {
    //save udfs
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
    if (this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.udfStepWorkflowComponent.saveUdfLinks();
    this.checkNavigate = false;
    if (!this.checkRequiredDocument) {
      this.devToolsServices.openToast(3, 'alert.enter_required_documents');
      return;
    }
    else {
      this.checkNavigate = true;
      this.saveDocuments(AcmConstants.COMPLETE_ACTION);
    }
  }

  }

  /**
   * Methode to previous step
   */
  previousStep() {
    if (this.allDocuments.length > 0) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.previous').afterClosed().subscribe(res => {
        if (res) {
          this.loanSharedService.getIhmByAction(AcmConstants.PREVIOUS_FORM_MSG);
        }
      });
    } else {
      this.loanSharedService.getIhmByAction(AcmConstants.PREVIOUS_FORM_MSG);
    }
  }

  /**
   * Methode exit
   */
  exit() {
    this.loanSharedService.exitFromLoan(this.loan);
  }

  /**
   * save to database and quit
   * check required if true enable next button
   */
  async save() {
    // disabled deleted documents
    if (this.childcomp.documentsToRemove.length !== 0) {
      // disable deleted documents
      this.childcomp.documentsToRemove.forEach((value) => {
        this.gedService.disableDocument(value).toPromise().then((res) => {
          this.devToolsServices.openToast(0, 'alert.success');

        });
      });
    }
    // save added documents
    const arrayFile: any[] = [];
    const documents: any[] = [];
    this.loanSharedService.setLoader(true);
    await this.allDocuments.map((value, index) => {
      const document: LoanDocumentEntity = new LoanDocumentEntity();
      let settingDocumentType: SettingDocumentTypeEntity;
      settingDocumentType = value.settingDocumentType;
      if (value.file !== '') {
        document.titre = value.title;
        if (document.description) {
          document.description = value.description;
        } else {
          document.description = value.settingDocumentType.description;
        }
        document.auteur = AcmConstants.AUTEUR;
        document.loanId = this.loan.loanId;
        document.settingDocumentTypeDTO = settingDocumentType;
        document.idCustomer = +this.loan.customerDTO.id;
        document.customerName = this.loanSharedService.getCustomerName(this.loan.customerDTO);
        document.accountNumberExtern = this.loan.accountNumber;
        document.mandatory = value.mandatory;
        document.documentIndex = value.documentIndex;
        document.name = value.file.name;
        document.documentSize = value.file.size;
        document.workFlowStepId=this.loan.etapeWorkflow;

        arrayFile.push(value.file);

        if (value.exist === true) {
          document.idDocumentGED = value.file;
          document.name = value.name;
          this.gedService.createAcmDocument(document).subscribe((data) => {
            this.loading = true;
            // call child function to change id saved document
            this.childcomp.changeIdSavedDocument(document, data.idDocument);
            this.checkRequired.checkRequired();
            this.devToolsServices.openToast(0, 'alert.success');
          });
        } else {
          documents.push(document);
        }
      }
    });
    if (documents.length > 0) {
      await this.gedService.saveListDocuments(arrayFile, documents).subscribe((value1) => {
        this.loading = true;
        this.loanSharedService.setLoader(false);
        // call child function to change id saved document
        value1.forEach((doc) => {
          this.childcomp.changeIdSavedDocument(doc, doc.idDocument);
          this.checkRequired.checkRequired();
          this.devToolsServices.openToast(0, 'alert.success');
        });

      });
    } else {
      this.loanSharedService.setLoader(false);
    }
    this.loading = false;
    this.checkNext = false;
  }

  /**
   * add documents to be saved
   * param allDocuments
   */
  toSave(allDocuments) {
    this.allDocuments = allDocuments;
  }

  /**
   * Display the confirmation message
   */
  onsave() {
    // check if there is changes in documents
    if(this.checkSettingDocument) {
      this.saveDocuments(AcmConstants.COMPLETE_ACTION);
    }
    // save udf
    this.udfStepWorkflowComponent.saveUdfLinks();
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  /**
   * check if setting documents exist
   * if setting documents exist event = true else event = false
   * @param Boolean event
   */
  typeDocumentExistMethode(event) {
    this.checkSettingDocument = event;
  }

  /**
   * check required
   * param event
   */
  checkRequiredDocumentParent(event) {
    if (event === 0) {
      this.checkRequiredDocument = true;
    } else {
      this.checkRequiredDocument = false;
    }
  }

  /**
   * Display the confirmation message
   */
  async saveDocuments(source?: string) {
    // send origin source as 'click on save button' or 'click on complete button'
    this.originSource = source;
    // check if there is changes in documents
    this.saveFilesAction = !this.saveFilesAction;

  }

  receiveLengthDocuments(number: number) {
    this.lengthDocuments = number;
  }

  saveDocumentsDone(event) {
    if (this.checkNavigate === true)
      this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT);
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }

  executeThirdPartyApi() {
    this.loanDetailsServices.automaticStepLoan(this.loan).subscribe();
  }
}
