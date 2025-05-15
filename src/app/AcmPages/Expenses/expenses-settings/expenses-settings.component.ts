import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { AcmExpensesTypeEntity } from '../../../shared/Entities/acmExpensesType.entity';
import { ExpensesSettingsService } from './expenses-settings.service';
import { BrancheEntity } from '../../../shared/Entities/branche.entity';
import { SettingsService } from '../../Settings/settings.service';
import { ExpensesLimitsEntity } from '../../../shared/Entities/expensesLimits.entity';
import { SettingDocumentTypeEntity } from '../../../shared/Entities/settingDocumentType.entity';
import { AcmConstants } from '../../../shared/acm-constants';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { AcmEnvironnementEntity } from '../../../shared/Entities/acmEnvironnement.entity';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { LoanDetailsServices } from '../../Loan-Application/loan-details/loan-details.services';
import { forkJoin } from 'rxjs';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';

@Component({
  selector: 'app-expenses-settings',
  templateUrl: './expenses-settings.component.html',
  styleUrls: ['./expenses-settings.component.sass']
})
export class ExpensesSettingsComponent implements OnInit {
  public expandedExpensesTypes = true;
  public expandedBranchLimits = true;
  public expandedExpensesDoc = true;
  public refreshFrequency = true;
  public expensesTypes: AcmExpensesTypeEntity[] = [];
  public addExpensesForm: FormGroup;
  public mode = '';
  public updateIndex: number;
  public branchEntitys: AcmBranches[] = [];
  public selectedBranch = null;
  public limitsFrom: FormGroup;
  public loadLimit = false;
  public settingDocumentTypes: SettingDocumentTypeEntity[] = [];
  public popupForm: FormGroup;
  public updateId = 0;
  public updateDocumentIndex: number;
  public currency: string;
  public cronExpressionExpenses: AcmEnvironnementEntity = new AcmEnvironnementEntity();
  public addRejectReasonForm: FormGroup;
  public updateReasonIndex: number;
  public settingMotifReviewEntitys: SettingMotifRejetsEntity[] = [];
  public settingMotifReviewEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public expandedRejectReason = true;
  public accounts = [];
  public dateLastUpdateExpenseLimit = new Date();

  /**
   * constructor
   * @param translate TranslateService
   * @param modalService NgbModal
   * @param formBuilder FormBuilder
   * @param acmDevToolsServices AcmDevToolsServices
   * @param expensesSettingsService ExpensesSettingsService
   * @param settingsService SettingsService
   * @param devToolsServices AcmDevToolsServices
   * @param customerManagementService CustomerManagementService
   */
  constructor(public translate: TranslateService, public modalService: NgbModal, public formBuilder: FormBuilder,
              public acmDevToolsServices: AcmDevToolsServices, public expensesSettingsService: ExpensesSettingsService,
              public settingsService: SettingsService, public devToolsServices: AcmDevToolsServices,
              public customerManagementService: CustomerManagementService, public loanDetailsServices: LoanDetailsServices,
              public library : FaIconLibrary) {
  }

  ngOnInit() {
    const settingDocumentTypeEntity: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentTypeEntity.categorie = 3;
    const acmEnvironmentKeys: string[] = [AcmConstants.CURRENCY, AcmConstants.CRON_EXPRESSION_EXPENSES, 'DATE_LAST_UPDATE_REFRESH_LIMIT_EXPENSES'];
    this.settingMotifReviewEntity.categorie = AcmConstants.REJECT_EXPENSES;
    forkJoin([this.expensesSettingsService.getAllExpensesTypes()
      , this.settingsService.findBranches(new AcmBranches()),
      this.loanDetailsServices.getReason(this.settingMotifReviewEntity),
      this.settingsService.findDocumentTypes(settingDocumentTypeEntity),
      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys),
    ])
    .subscribe((res) => {
      this.expensesTypes = res[0],
      this.branchEntitys = res[1],
      this.settingMotifReviewEntitys = res[2];
      this.settingDocumentTypes = res[3];
      this.currency = res[4][0].value;
      this.cronExpressionExpenses = res[4][1];
      this.dateLastUpdateExpenseLimit = res[4][2].dateLastUpdate;
    });
  }

  /**
   * toggle Collapse Expenses Types
   */
  toggleCollapseExpensesTypes() {
    this.expandedExpensesTypes = !this.expandedExpensesTypes;
  }

  /**
   * toggle Collapse Branch Limits
   */
  toggleCollapseBranchLimits() {
    this.expandedBranchLimits = !this.expandedBranchLimits;
  }

  /**
   * toggle Collapse Expenses document
   */
  toggleCollapseExpensesDoc() {
    this.expandedExpensesDoc = !this.expandedExpensesDoc;
  }
  /**
   * toggle Collapse Reject Reason
   */
  toggleCollapseRejectReason() {
    this.expandedRejectReason = !this.expandedRejectReason;
  }

  /**
   * toggle Collapse Refresh Frequency
   */
  toggleRefreshFrequency() {
    this.refreshFrequency = !this.refreshFrequency;
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * open Modal Expenses
   * @param expensesType ExpensesType
   */
  openModalExpenses(expensesType) {
    this.toggleCollapseExpensesTypes();
    this.createExpensesForm();
    this.mode = 'I';
    this.modalService.open(expensesType, {
      size: 'lg'
    });
  }

  /**
   * create Expenses Form for Add
   */
  createExpensesForm() {
    this.addExpensesForm = this.formBuilder.group({
      code: ['', Validators.required],
      libel: ['', Validators.required],
      description: ['', Validators.required],
      enable: [true, Validators.required],
      document: [null, Validators.required]
    });
  }

  /**
   * add new Expenses
   */
  addExpenses() {
    this.acmDevToolsServices.makeFormAsTouched(this.addExpensesForm);
    if (this.addExpensesForm.valid) {
      const expenseType = new AcmExpensesTypeEntity();
      expenseType.code = this.addExpensesForm.controls.code.value;
      expenseType.libel = this.addExpensesForm.controls.libel.value;
      expenseType.description = this.addExpensesForm.controls.description.value;
      expenseType.enabled = this.addExpensesForm.controls.enable.value;
      expenseType.documentID = this.addExpensesForm.controls.document.value.id;
      expenseType.documentLibel = this.addExpensesForm.controls.document.value.libelle;

      this.expensesSettingsService.addExpensesTypes(expenseType).subscribe(
        (data) => {
          this.expensesTypes.push(data);
          this.modalService.dismissAll();
          if (this.selectedBranch != null) {
            this.limitsFrom.addControl('limit' + (this.expensesTypes.length - 1), new FormControl(0));
          }
          this.devToolsServices.openToast(0, 'alert.save_success');
        }
      );
    }
  }

  /**
   * Update new Expenses
   */
  updateExpenses() {
    this.acmDevToolsServices.makeFormAsTouched(this.addExpensesForm);
    if (this.addExpensesForm.valid) {
      const expenseType = new AcmExpensesTypeEntity();
      expenseType.code = this.addExpensesForm.controls.code.value;
      expenseType.libel = this.addExpensesForm.controls.libel.value;
      expenseType.description = this.addExpensesForm.controls.description.value;
      expenseType.enabled = this.addExpensesForm.controls.enable.value;
      expenseType.id = this.expensesTypes[this.updateIndex].id;
      expenseType.documentID = this.addExpensesForm.controls.document.value.id;
      expenseType.documentLibel = this.addExpensesForm.controls.document.value.libelle;
      this.expensesSettingsService.updateExpensesTypes(expenseType).subscribe(
        (data) => {
          this.expensesTypes[this.updateIndex] = data;
          this.modalService.dismissAll();
          this.devToolsServices.openToast(0, 'alert.success');
        }
      );
    }
  }

  /**
   * delete Expenses
   * @param i number
   */
  deleteExpenses(i: number) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.delete_expense_type').afterClosed().subscribe(res => {
      if (res) {
        this.expensesSettingsService.deleteExpensesTypes(this.expensesTypes[i].id).subscribe(
          () => {
            this.expensesTypes.splice(i, 1);
            this.devToolsServices.openToast(0, 'alert.delete');
          }
        );
      }
    });
  }
/**
 * disable Expenses
 * @param i number
 */
  disableExpenses(documentType: SettingDocumentTypeEntity, i: number) {

    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.delete').afterClosed().subscribe(res => {
      if (res) {
        this.settingDocumentTypes.splice(i, 1);
        documentType.enabled = false;
        this.settingsService.updateDocumentTypes(documentType).subscribe(
          () => {

            this.devToolsServices.openToast(0, 'alert.delete');
          }
        );
      }
    });

  }

  /**
   *
   * @param expensesTypes Modal
   * @param i index of expenses Types
   */
  editExpenses(expensesType, i: number) {
    this.mode = 'U';
    this.updateIndex = i;
    this.createExpensesFormUpdate(this.expensesTypes[i]);
    this.modalService.open(expensesType, {
      size: 'lg'
    });
  }

  /**
   * create Expenses Form for update
   */
  createExpensesFormUpdate(expenseType: AcmExpensesTypeEntity) {
    const settingDocumentTypeEntity: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentTypeEntity.id = expenseType.documentID;
    settingDocumentTypeEntity.libelle = expenseType.documentLibel;
    this.addExpensesForm = this.formBuilder.group({
      code: [expenseType.code, Validators.required],
      libel: [expenseType.libel, Validators.required],
      description: [expenseType.description, Validators.required],
      enable: [expenseType.enabled, Validators.required],
      document: [settingDocumentTypeEntity, Validators.required]
    });
  }

  loadSettingLimits() {
    this.loadLimit = false;
    if (this.selectedBranch != null) {
      const expensesLimitsEntity: ExpensesLimitsEntity = new ExpensesLimitsEntity();
      expensesLimitsEntity.idBranch = this.selectedBranch.id;
      this.expensesSettingsService.findExpensesLimits(expensesLimitsEntity).subscribe(
        (data) => {
          this.limitsFrom = this.formBuilder.group({});
          for (let i = 0; i < this.expensesTypes.length; i++) {
            let find = false;
            data.forEach(
              (expensesTypes) => {
                if (expensesTypes.idExpensesType === this.expensesTypes[i].id) {
                  find = true;
                  this.limitsFrom.addControl('limit' + i, new FormControl(expensesTypes.limit, [Validators.required, Validators.min(0)]));
                  this.limitsFrom.addControl('cr' + i, new FormControl(expensesTypes.cr, Validators.required));
                  this.limitsFrom.addControl('dr' + i, new FormControl(expensesTypes.dr, Validators.required));
                }
              }
            );
            if (!find) {
              this.limitsFrom.addControl('limit' + i, new FormControl(0, [Validators.required, Validators.min(0)]));
              this.limitsFrom.addControl('cr' + i, new FormControl(null, Validators.required));
              this.limitsFrom.addControl('dr' + i, new FormControl(null, Validators.required));
            }
          }
          this.loadLimit = true;
        });
      this.expensesSettingsService.getAccountGl(this.selectedBranch.id).subscribe(
        (accounts) => {
          this.accounts = accounts;
        }
      );
    }
  }

  saveLimits() {
    this.devToolsServices.makeFormAsTouched(this.limitsFrom);
    const expensesLimitsEntitys: ExpensesLimitsEntity[] = [];
    for (let i = 0; i < this.expensesTypes.length; i++) {
      const expensesLimitsEntity: ExpensesLimitsEntity = new ExpensesLimitsEntity();
      expensesLimitsEntity.idBranch = this.selectedBranch.id;
      expensesLimitsEntity.idExpensesType = this.expensesTypes[i].id;
      expensesLimitsEntity.limit = this.limitsFrom.controls['limit' + i].value;
      expensesLimitsEntity.restLimit = this.limitsFrom.controls['limit' + i].value;
      expensesLimitsEntity.cr = this.limitsFrom.controls['cr' + i].value;
      expensesLimitsEntity.dr = this.limitsFrom.controls['dr' + i].value;
      expensesLimitsEntitys.push(expensesLimitsEntity);
    }
    if (this.limitsFrom.valid) {
      this.expensesSettingsService.saveExpensesLimits(expensesLimitsEntitys).subscribe(
        () => {
          this.devToolsServices.openToast(0, 'done');
        }
      );
    }
  }

  /**
   * methode to open the popup add new document type
   * param content
   */
  openLarge(content) {
    this.toggleCollapseExpensesDoc();
    this.createAddDocumentForm();
    this.modalService.open(content, {
      size: 'md'
    });
  }

  /**
   * Methode to create form popup
   */
  createAddDocumentForm() {
    this.updateId = 0;
    this.popupForm = this.formBuilder.group({
      code: ['', Validators.required],
      libelle: ['', Validators.required],
      description: ['']
    });
  }

  /**
   * methode to generate document type code
   */
  changeCode() {
    if (this.updateId === 0) {
      let maxOrder = 0;
      if (this.settingDocumentTypes.length !== 0) {
        maxOrder = maxOrder = Math.max.apply(Math, this.settingDocumentTypes.map((doc) => {
          return doc.id;
        }));
      }
      if (this.settingDocumentTypes.some(settingDoc => settingDoc.libelle.toUpperCase()
        === this.popupForm.controls.libelle.value.toUpperCase())) {
        this.popupForm.controls.libelle.setErrors({ incorrect: true });
      } else {
        const newOrder = maxOrder + 1;
        const newCode = 'EXP_' + newOrder;
        if (this.settingDocumentTypes.some(settingDoc => settingDoc.code === newCode)) {
          this.popupForm.controls.code.setErrors({ incorrect: true });
        } else {
          this.popupForm.controls.code.setValue(newCode.toUpperCase());
        }
      }
    }
  }
  /**
   * create new document type
   */
  createDocument() {
    const settingDocumentType: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentType.code = this.popupForm.controls.code.value;
    settingDocumentType.libelle = this.popupForm.controls.libelle.value;
    settingDocumentType.description = this.popupForm.controls.description.value;
    settingDocumentType.uniqueness = true;
    settingDocumentType.dateDebut = new Date();
    settingDocumentType.categorieLibelle = 'EXPENSES';
    settingDocumentType.categorie = 3;
    this.settingsService.createDocumentTypes(settingDocumentType).subscribe((data) => {
      this.devToolsServices.openToast(0, 'alert.success');
      this.settingDocumentTypes.push(data);
      this.modalService.dismissAll();
    });
  }

  /**
   * update Document Modal
   * @param addDocument modal
   * @param i number
   */
  updateDocumentModal(addDocument, i: number) {
    this.updateId = this.settingDocumentTypes[i].id;
    this.updateDocumentIndex = i;
    this.createUpdateDocumentForm(this.settingDocumentTypes[i]);
    this.modalService.open(addDocument, {
      size: 'md'
    });
  }

  /**
   * create Update Document Form
   * @param settingDocumentTypeEntity SettingDocumentTypeEntity
   */
  createUpdateDocumentForm(settingDocumentTypeEntity: SettingDocumentTypeEntity) {
    this.popupForm = this.formBuilder.group({
      code: [settingDocumentTypeEntity.code, Validators.required],
      libelle: [settingDocumentTypeEntity.libelle, Validators.required],
      description: [settingDocumentTypeEntity.description]
    });
  }

  /**
   * create new document type
   */
  updateDocument() {
    this.settingDocumentTypes[this.updateDocumentIndex].code = this.popupForm.controls.code.value;
    this.settingDocumentTypes[this.updateDocumentIndex].libelle = this.popupForm.controls.libelle.value;
    this.settingDocumentTypes[this.updateDocumentIndex].description = this.popupForm.controls.description.value;
    this.settingsService.updateDocumentTypes(this.settingDocumentTypes[this.updateDocumentIndex])
      .subscribe((data) => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.settingDocumentTypes[this.updateDocumentIndex] = (data);
        this.modalService.dismissAll();
      });
  }

  /**
   * compare Document
   * @param document1 document
   * @param document2 document
   */
  compareDocument(document1, document2) {
    if (document1 !== null && document2 !== null) {
      return document1.id === document2.id;
    }
  }

  saveRefreshFrequency() {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.SYSTEM_RESTART_REQUIRED)
      .afterClosed().subscribe(res => {
        if (res) {
          this.settingsService.updateAcmEnvironment(this.cronExpressionExpenses).subscribe((data) => {
            this.devToolsServices.openToast(0, 'alert.success');
          });
        }
      });
  }

  /**
   * add new Reject Reason
   */
  addRejectReason() {
    this.acmDevToolsServices.makeFormAsTouched(this.addRejectReasonForm);
    if (this.addRejectReasonForm.valid) {
      const settingMotifReviewEntity = new SettingMotifRejetsEntity();
      settingMotifReviewEntity.code = this.addRejectReasonForm.controls.code.value;
      settingMotifReviewEntity.libelle = this.addRejectReasonForm.controls.libel.value;
      settingMotifReviewEntity.description = this.addRejectReasonForm.controls.description.value;
      settingMotifReviewEntity.categorie = AcmConstants.REJECT_EXPENSES;
      this.expensesSettingsService.addReason(settingMotifReviewEntity).subscribe(
        (data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.settingMotifReviewEntitys.push(data);
          this.modalService.dismissAll();
        }
      );
    }
  }
  /**
   * update reject reason
   */
  updateRejectReason() {
    this.settingMotifReviewEntitys[this.updateReasonIndex].code = this.addRejectReasonForm.controls.code.value;
    this.settingMotifReviewEntitys[this.updateReasonIndex].libelle = this.addRejectReasonForm.controls.libel.value;
    this.settingMotifReviewEntitys[this.updateReasonIndex].description = this.addRejectReasonForm.controls.description.value;
    this.expensesSettingsService.updateReason(this.settingMotifReviewEntitys[this.updateReasonIndex])
      .subscribe((data) => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.settingMotifReviewEntitys[this.updateReasonIndex] = (data);
        this.modalService.dismissAll();
      });
  }

  /**
   * open Modal add reject reason
   * @param rejectReason RejectReason
   */
  openModalRejectReason(rejectReason) {
    this.toggleCollapseRejectReason();
    this.createRejectReason();
    this.modalService.open(rejectReason, {
      size: 'lg'
    });
  }
  /**
   * create add new Reject Reason Form
   */
  createRejectReason() {
    this.updateId = 0;
    this.addRejectReasonForm = this.formBuilder.group({
      code: ['', Validators.required],
      libel: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  /**
   * open update reject reason Modal
   * @param reason settingMotifReviewEntity
   * @param i number
   */
  editReason(rejectReason, i: number) {
    this.updateId = this.settingMotifReviewEntitys[i].id;
    this.updateReasonIndex = i;
    this.updateRejectReasonForm(this.settingMotifReviewEntitys[i]);
    this.modalService.open(rejectReason, {
      size: 'lg'
    });
  }
  /**
   * create update reject reason form
   * @param settingMotifReviewEntity SettingMotifRejetsEntity
   */
  updateRejectReasonForm(settingMotifReviewEntity: SettingMotifRejetsEntity) {
    this.addRejectReasonForm = this.formBuilder.group({
      code: [settingMotifReviewEntity.code, Validators.required],
      libel: [settingMotifReviewEntity.libelle, Validators.required],
      description: [settingMotifReviewEntity.description]
    });
  }

  /**
   * change Code for reject reason
   */
  changeCodeReason() {
    if (this.updateId === 0) {
      if (this.settingMotifReviewEntitys.some(settingMotifReviewEntity => settingMotifReviewEntity.libelle.toUpperCase()
        === this.addRejectReasonForm.controls.libel.value.toUpperCase())) {
        this.addRejectReasonForm.controls.libel.setErrors({ incorrect: true });
      } else {
        const newCode = this.addRejectReasonForm.controls.libel.value.replace(/ /g, '_').toUpperCase();
        if (this.settingMotifReviewEntitys.some(settingMotifReviewEntity => settingMotifReviewEntity.code === newCode)) {
          this.addRejectReasonForm.controls.code.setErrors({ incorrect: true });
        } else {
          this.addRejectReasonForm.controls.code.setValue(newCode);
        }
      }
    }
  }
  /**
   * delete rejet reason
   * @param i number
   */
  deleteReason(i: number) {

    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.delete_reject_reasons').afterClosed().subscribe(res => {
      if (res) {
        this.expensesSettingsService.deleteReason(this.settingMotifReviewEntitys[i].id).subscribe(
          () => {
            this.settingMotifReviewEntitys.splice(i, 1);
            this.devToolsServices.openToast(0, 'alert.success');
          }
        );
      }
    });
  }
  /**
   * refresh limit expenses
   */
  refreshLimitExpenses() {
    this.expensesSettingsService.refreshExpensesLimits(AcmConstants.DATE_LAST_UPDATE_REFRESH_LIMIT_EXPENSES).subscribe((data) => {
      if (data !== null) {
        this.dateLastUpdateExpenseLimit = data;
        this.devToolsServices.openToast(0, 'alert.success');
      }
    });
  }
}
