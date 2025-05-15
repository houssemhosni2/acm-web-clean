import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmExpensesTypeEntity } from 'src/app/shared/Entities/acmExpensesType.entity';
import { ExpensesEntity } from 'src/app/shared/Entities/expenses.entity';
import { ExpensesLimitsEntity } from 'src/app/shared/Entities/expensesLimits.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ExpensesSettingsService } from '../expenses-settings/expenses-settings.service';
import { ExpensesListService } from './expenses-list.service';
import { ExpensesTableComponent } from './expenses-table/expenses-table.component';
import { LoanDocumentEntity } from '../../../shared/Entities/loanDocument.entity';
import { GedServiceService } from '../../GED/ged-service.service';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { SettingsService } from '../../Settings/settings.service';
import { ExpensesCountEntity } from 'src/app/shared/Entities/expensesCount.entity';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.sass']
})
export class ExpensesListComponent implements OnInit {
  public cols: any[];
  public selectedColumns: any[];
  public newExpensesForm: FormGroup;
  public userConnected: UserEntity = new UserEntity();
  public expensesTypes: AcmExpensesTypeEntity[] = [];
  public expensesLimitAmount: ExpensesLimitsEntity[] = [];
  public balance = 0;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild(ExpensesTableComponent, { static: true }) expensesTable: ExpensesTableComponent;
  public docType = '';
  public docTitle = '';
  public document = [];
  public currentPath = 'expenses-list';
  public expensesCount: ExpensesCountEntity = new ExpensesCountEntity();
  public decimalPlaces: string;

  /**
   *
   * @param router Router
   * @param translate TranslateService
   * @param modal NgbModal
   * @param formBuilder FormBuilder
   * @param sharedService SharedService
   * @param expensesListService ExpensesListService
   * @param acmDevToolsServices AcmDevToolsServices
   * @param expensesSettingsService ExpensesSettingsService
   * @param gedService GedServiceService
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public router: Router, public translate: TranslateService, public settingsService: SettingsService,
              public modal: NgbModal, public formBuilder: FormBuilder, public sharedService: SharedService,
              public expensesListService: ExpensesListService, public acmDevToolsServices: AcmDevToolsServices,
              public expensesSettingsService: ExpensesSettingsService, public gedService: GedServiceService,
              public devToolsServices: AcmDevToolsServices,public library: FaIconLibrary) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'expensesType', header: 'expenses.expenses_type' },
      { field: 'expensesAmount', header: 'expenses.expenses_amount' },
      { field: 'owner', header: 'expenses.expenses_owner' },
      { field: 'teller', header: 'expenses.expenses_teller' },
      { field: 'applyDate', header: 'expenses.expenses_creation_date' }
    ];
    this.userConnected = this.sharedService.getUser();
    // init pagination params
    this.selectedColumns = this.cols;

    this.expensesListService.loadExpensesCount().subscribe(
      (data) => {
        this.expensesCount = data;
      }
    );
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(3);
  }

  /**
   * open expenses details
   * @param expenses ExpensesEntity
   */
  async expensesDetails(expenses: ExpensesEntity) {
    await this.router.navigate([AcmConstants.EXPENSES_INFO]);
  }

  /**
   * create form add expenses
   */
  createForm() {
    this.newExpensesForm = this.formBuilder.group({
      expensesType: ['', Validators.required],
      description: [''],
      expensesAmount: ['', Validators.min(0)],
      teller: [],
      document: ['', Validators.required]
    });
  }

  /**
   * open modal add expenses
   * @param addExpensesModal modal
   */
  addExpenses(addExpensesModal) {
    this.docType = '-';
    this.docTitle = '-';
    this.findExpensesType();
    this.getBalance();
    this.createForm();
    this.modal.open(addExpensesModal, { size: 'lg' });
  }

  /**
   * submit expenses
   */
  onSubmitNewExpenses() {
    this.acmDevToolsServices.makeFormAsTouched(this.newExpensesForm);
    if (this.newExpensesForm.valid) {
      const expenses = new ExpensesEntity();
      expenses.idExpensesType = this.newExpensesForm.controls.expensesType.value.id;
      expenses.expensesTypeLibelle = this.newExpensesForm.controls.expensesType.value.libel;
      expenses.description = this.newExpensesForm.controls.description.value;
      expenses.expensesAmount = this.newExpensesForm.controls.expensesAmount.value;
      expenses.applyDate = new Date();
      // statut 0 : new expenses
      expenses.statut = 0;
      expenses.balance = 0;
      if (Object.keys(this.sharedService.getUser()).length !== 0) {
        expenses.teller = this.sharedService.getUser().login;
        expenses.tellerName = this.sharedService.getUser().fullName;
        expenses.idBranch = this.sharedService.getUser().branchID;
        expenses.branchDescription = this.sharedService.getUser().branchDescription;
      }
      this.expensesListService.addExpenses(expenses).subscribe((data) => {
        this.save(data.id);
      });
    }
  }
  async findExpensesType(){
    const expensesTypeEntity=new AcmExpensesTypeEntity();
    expensesTypeEntity.enabled=true;
    await this.expensesSettingsService.findExpensesTypes(expensesTypeEntity).subscribe(
      (data) => {
        this.expensesTypes = data;
      });
  }
  changeAmountByType() {
    const expensesLimitsEntity: ExpensesLimitsEntity = new ExpensesLimitsEntity();
    expensesLimitsEntity.idBranch = this.userConnected.branchID;
    expensesLimitsEntity.idExpensesType = this.newExpensesForm.controls.expensesType.value.id;
    this.expensesSettingsService.findExpensesLimits(expensesLimitsEntity).subscribe(
      (data) => {
        this.expensesLimitAmount = data;
        this.newExpensesForm.controls.expensesAmount.setValidators([Validators.required,
        Validators.max(this.expensesLimitAmount[0].restLimit), Validators.min(0)]);
      });

    this.docType = this.newExpensesForm.controls.expensesType.value.documentLibel;
  }
  getBalance() {
    this.balance = 0;
    const expensesLimitsEntity: ExpensesLimitsEntity = new ExpensesLimitsEntity();
    expensesLimitsEntity.idBranch = this.userConnected.branchID;
    this.expensesSettingsService.findExpensesLimits(expensesLimitsEntity).subscribe(
      (data) => {
        this.expensesLimitAmount = data;
        this.expensesLimitAmount.forEach((element) => {
          this.balance += element.limit;
        });
      });
  }

  /**
   * getDirection
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * add document to array according to the category
   * param uploadedDocument
   */
  addDocuments(event) {
    this.document[0] = (event.target.files[0]);
    this.docTitle = (event.target.files[0].name);
  }

  /**
   * save to database and quit
   * check required if true enable next button
   */
  async save(idExpenses: number) {
    const documentList: LoanDocumentEntity[] = [];
    const document: LoanDocumentEntity = new LoanDocumentEntity();
    document.titre = 'EXPENSES_' + idExpenses;
    document.description = 'EXPENSES_DOCUMENT_' + idExpenses;
    document.expensesId = idExpenses;
    document.auteur = AcmConstants.AUTEUR;
    document.name = this.document[0].name;
    document.documentIndex = this.document[0].documentIndex;
    // set setting document type
    const settingDocumentType = new SettingDocumentTypeEntity();
    settingDocumentType.id = this.newExpensesForm.controls.expensesType.value.documentID;
    document.settingDocumentTypeDTO = settingDocumentType;

    document.documentSize = this.document[0].size;
    documentList.push(document);
    this.gedService.saveListDocuments(this.document, documentList).subscribe((value1) => {
      this.expensesTable.reloadTable();
      this.expensesCount.countNew ++;
      this.modal.dismissAll();
      this.devToolsServices.openToast(0, 'alert.success');
    });
  }
  view() {
    if (this.document.length !== 0) {
    const fileData = [this.document[0]];
    const blob = new Blob(fileData, { type: this.document[0].type });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    }
  }
  deleteDocument() {
    this.newExpensesForm.controls.document.reset();
    this.document = [];
    this.docTitle = '-';
  }
}
