import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AccountAbacusEntity } from 'src/app/shared/Entities/AccountAbacus.entity';
import { JournalEntity } from 'src/app/shared/Entities/Journal.entity';
import { SettingJournalEnteriesEntity } from 'src/app/shared/Entities/settingJournalEntry.entity';
import { SettingJournalEntryTypeEntity } from 'src/app/shared/Entities/settingJournalEntryType.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanDetailsServices } from '../../Loan-Application/loan-details/loan-details.services';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-journal-entry-type',
  templateUrl: './journal-entry-type.component.html',
  styleUrls: ['./journal-entry-type.component.sass'],
})
export class JournalEntryTypeComponent implements OnInit {

  /**
   * constructor MotifsRejetComponent.
   * @param settingsService SettingsService
   * @param translate TranslateService
   * @param loanDetailsServices LoanDetailsServices
   * @param modal NgbModal
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   * @param library FaIconLibrary
   */
  constructor(
    public settingsService: SettingsService,
    public translate: TranslateService,
    public loanDetailsServices: LoanDetailsServices,
    public sharedService: SharedService,
    public modal: NgbModal,
    public formBuilder: FormBuilder,
    public devToolsServices: AcmDevToolsServices,
    public library: FaIconLibrary,
    public datePipe: DatePipe

  ) { }
  public settingJournalEntryTypeEntitys: SettingJournalEntryTypeEntity[] = [];
  public pageSize: number;
  public page: number;
  public groupForm: FormGroup;
  public settingJournalEntryTypeEntityForCreate: SettingJournalEntryTypeEntity =
    new SettingJournalEntryTypeEntity();
  public action: string;
  public categories: SettingJournalEntryTypeEntity[];
  public isReject: boolean;
  public externalIdsList: SettingJournalEntryTypeEntity[] = [];
  public SettingJournalEntryTypeEntityEntityTypeEntity =
    new SettingJournalEntryTypeEntity();
  public changeCodeForCategory = false;
  listFormJournalEntriesForm: SettingJournalEntryTypeEntity[] = []
  public journalEntrieForm: FormGroup;
  public journalEntriesForms: FormGroup[]=[];
  public journalEntries: SettingJournalEnteriesEntity[] = [];
  listCreditAcount: AccountAbacusEntity[] = [];
  public activationKey = [];
  public today = new Date();

  selectedType: SettingJournalEntryTypeEntity = new SettingJournalEntryTypeEntity();
  journalEnteriesList: SettingJournalEnteriesEntity[] = [];
  journalEntryTypeForUpdate: SettingJournalEntryTypeEntity;
  popuppMode: string;
  public journalEntities: JournalEntity[] = [];
  async ngOnInit() {
    this.activationKey = this.sharedService.getActivationKey().filter(item => item === AcmConstants.JOURNAL_ENTRY_MODULE);
    if (this.activationKey.length !== 0) {
      this.journalEntrieForm = new FormGroup({});
      this.pageSize = 5;
      this.page = 1;
      await this.settingsService
        .findAllSettingJournalEntryType()
        .subscribe((data) => {
          this.settingJournalEntryTypeEntitys = data;
        });
      this.isReject = false;
    }
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Open Modal
   * @param modalContent Modal
   */

  createForm(settingJournalEntryTypeEntityEntity: SettingJournalEntryTypeEntity) {
    const journalEntity = new JournalEntity();
    journalEntity.idExtern = settingJournalEntryTypeEntityEntity.journalId?.toString();
    journalEntity.valueJson = settingJournalEntryTypeEntityEntity.journalDescription;
    this.groupForm = this.formBuilder.group({
      code: [settingJournalEntryTypeEntityEntity.code, Validators.required],
      description: settingJournalEntryTypeEntityEntity.description,
      journal: [journalEntity.idExtern === undefined ? '' : journalEntity, Validators.required]
    });
  }

  addJournalEntryType(modalContent: TemplateRef<any>) {
    this.journalEntryTypeForUpdate = new SettingJournalEntryTypeEntity();
    this.popuppMode = 'ADD';
    this.getJournals();
    this.createForm(new SettingJournalEntryTypeEntity());
    this.modal.open(modalContent);
  }
  updateJournalEntryType(
    modalContent: TemplateRef<any>,
    settingJournalEntryTypeEntityEntity: SettingJournalEntryTypeEntity
  ) {
    this.popuppMode = 'UPDATE';
    this.getJournals();
    this.journalEntryTypeForUpdate = settingJournalEntryTypeEntityEntity;
    this.createForm(settingJournalEntryTypeEntityEntity);
    this.modal.open(modalContent);
  }

  create() {
    if (this.journalEntryTypeForUpdate !== null && this.journalEntryTypeForUpdate !== undefined) {
      this.settingJournalEntryTypeEntityForCreate.id = this.journalEntryTypeForUpdate.id;
    }
    this.settingJournalEntryTypeEntityForCreate.code = this.groupForm.controls.code.value;
    this.settingJournalEntryTypeEntityForCreate.description = this.groupForm.controls.description.value;
    this.settingJournalEntryTypeEntityForCreate.journalId = this.groupForm.controls.journal.value.idExtern;
    this.settingJournalEntryTypeEntityForCreate.journalDescription = this.groupForm.controls.journal.value.valueJson;
    this.settingsService.createSettingJournalEntry(this.settingJournalEntryTypeEntityForCreate).toPromise().then((data) => {
      this.selectedType = data;
      // this.settingJournalEntryTypeEntitys[this.settingJournalEntryTypeEntitys.indexOf(this.settingJournalEntryTypeEntitys.filter(
      //   value => this.settingJournalEntryTypeEntityForCreate.id === value.id)[0])] = data;
      this.settingsService
        .findAllSettingJournalEntryType()
        .subscribe((res) => {
          this.settingJournalEntryTypeEntitys = res;
          this.modal.dismissAll();
          this.devToolsServices.openToast(0, 'alert.success');
        });
    });
  }

  onSubmit() {
    if (this.groupForm.valid) {
      this.create();
    }
  }

  closeModale() {
    this.modal.dismissAll();
  }
  deleteJournalEntry() {
    this.modal.dismissAll();
  }
  deleteSettingJournalEntryType(settingJournalEntryTypeEntity: SettingJournalEntryTypeEntity, i: number) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('Delete journal entry type').afterClosed().subscribe(
      res => {
        if (res) {
          if (settingJournalEntryTypeEntity.settingJournalEnteries === null ||
            settingJournalEntryTypeEntity.settingJournalEnteries === undefined ||
            settingJournalEntryTypeEntity.settingJournalEnteries.length === 0) {
            this.settingsService.deleteSettingJournalEntryCondition(settingJournalEntryTypeEntity.id).subscribe(() => {
              this.devToolsServices.openToast(0, 'alert.success');
              this.settingJournalEntryTypeEntitys.splice(i, 1);
            });
          } else
            this.devToolsServices.openToast(3, 'alert.delete_journal_entry_type');
        }
      }
    );
  }

  endableDisable(settingJournalEntryTypeEntity: SettingJournalEntryTypeEntity) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_journal_entry_type').afterClosed().
      subscribe(res => {
        if (res) {

          this.settingsService.updateSettingJournalEntry(settingJournalEntryTypeEntity).subscribe(
            (res) => { },
            (error) => {
              settingJournalEntryTypeEntity.enabled = !settingJournalEntryTypeEntity.enabled;
            }
          );

        } else {
          settingJournalEntryTypeEntity.enabled = !settingJournalEntryTypeEntity.enabled;
        }
      });
  }
  deleteJournalEntries(index) {
    this.journalEntriesForms.splice(index,1);
    this.journalEntries.splice(index,1);
  }

  addJournalEnteries() {
    if (this.selectedType !== undefined && this.selectedType !== null && this.selectedType.code !== '') {
      this.journalEntriesForms[this.journalEntries.length] = this.formBuilder.group({});
      this.journalEntriesForms[this.journalEntries.length].addControl('label', new FormControl('', Validators.required));
      this.journalEntriesForms[this.journalEntries.length].addControl('code', new FormControl('', Validators.required));
      this.journalEntriesForms[this.journalEntries.length].addControl('description',
        new FormControl('', Validators.required));
      this.journalEntriesForms[this.journalEntries.length].addControl('amount', new FormControl('', Validators.required));
      this.journalEntriesForms[this.journalEntries.length].addControl('percentage',
        new FormControl('100', [Validators.min(1), Validators.required]));
      this.journalEntriesForms[this.journalEntries.length].addControl('debitAcount', new FormControl('', Validators.required));
      this.journalEntriesForms[this.journalEntries.length].addControl('creditAcount', new FormControl('', Validators.required));
      this.journalEntriesForms[this.journalEntries.length].addControl('bySupplier', new FormControl(false));
      this.journalEntriesForms[this.journalEntries.length].controls['bySupplier'].disable()
      this.journalEntries.push(new SettingJournalEnteriesEntity());
    }
  }
  filterCreditAcount(event) {
    // init pagination params
    this.settingsService.findCreditAcountFromAbacus(event.query).subscribe(res => {
      this.listCreditAcount = res;

    })

  }
  onsave() {
    this.journalEnteriesList = [];
    let validEntries = false;
    for (let i = 0; i < this.journalEntries.length; i++) {
      if (this.journalEntriesForms[i].valid) {
        const JournalEnteries = new SettingJournalEnteriesEntity();
        JournalEnteries.id = null;
        JournalEnteries.code = this.journalEntriesForms[i].controls['code'].value;
        JournalEnteries.libelle = this.journalEntriesForms[i].controls['label'].value;
        JournalEnteries.description = this.journalEntriesForms[i].controls['description'].value;
        JournalEnteries.amount = this.journalEntriesForms[i].controls['amount'].value;
        JournalEnteries.bySupplier = this.journalEntriesForms[i].controls['bySupplier'].value;
        JournalEnteries.percentage = this.journalEntriesForms[i].controls['percentage'].value;
        JournalEnteries.debitAccount = this.journalEntriesForms[i].controls['debitAcount'].value.number;
        JournalEnteries.creditAccount = this.journalEntriesForms[i].controls['creditAcount'].value.number;
        JournalEnteries.idDebitAcount = this.journalEntriesForms[i].controls['debitAcount'].value.accountID;
        JournalEnteries.idCreditAccount = this.journalEntriesForms[i].controls['creditAcount'].value.accountID;
        JournalEnteries.idTypeJournalEntry = this.selectedType.id;
        JournalEnteries.settingJournalEntryType = this.selectedType;
        this.journalEnteriesList.push(JournalEnteries);
        validEntries = true;

      }
    }
    if (validEntries) {
      this.settingsService.createJournalEnteries(this.journalEnteriesList, this.selectedType.id).subscribe(res => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.selectedType.settingJournalEnteries = res;

      });
    }
  }
  getJournalEnteries() {
    let debitAccountAbacus: AccountAbacusEntity;
    let creditAccountAbacus: AccountAbacusEntity;
    this.journalEntries = [...this.selectedType.settingJournalEnteries];
    this.journalEntriesForms = [];
    if(this.journalEntries.length){
      for (let i = 0; i < this.journalEntries.length; i++) {
        const item = this.journalEntries[i];
        if (!this.journalEntriesForms[i]) {
          this.journalEntriesForms[i] = this.formBuilder.group({});
        }
        this.journalEntriesForms[i].addControl('code', new FormControl(item.code, Validators.required));
        this.journalEntriesForms[i].addControl('label', new FormControl(item.libelle, Validators.required));
        this.journalEntriesForms[i].addControl('description',
          new FormControl(item.description, Validators.required));
  
        this.journalEntriesForms[i].addControl('amount', new FormControl(item.amount, Validators.required));
        this.journalEntriesForms[i].addControl('percentage', new FormControl(item.percentage, [Validators.min(1), Validators.required]));
        debitAccountAbacus = new AccountAbacusEntity();
        debitAccountAbacus.number = item.debitAccount;
        debitAccountAbacus.accountID = item.idDebitAcount;
        this.journalEntriesForms[i].addControl('debitAcount', new FormControl(debitAccountAbacus, Validators.required));
        creditAccountAbacus = new AccountAbacusEntity();
        creditAccountAbacus.number = item.creditAccount;
        creditAccountAbacus.accountID = item.idCreditAccount;
        this.journalEntriesForms[i].addControl('creditAcount', new FormControl(creditAccountAbacus, Validators.required));
        this.journalEntriesForms[i].addControl('bySupplier', new FormControl(item.bySupplier));
  
        if (item.amount === "Withholding Tax" || item.amount === "Total asset") {
          this.journalEntriesForms[i].controls['bySupplier'].enable()
        } else {
          this.journalEntriesForms[i].controls['bySupplier'].disable()
        }
      }
    }else{
      this.addJournalEnteries();
    }
  }
  getJournals() {
    if (this.journalEntities.length === 0) {
      this.settingsService.findJournals().subscribe((data) => {
        this.journalEntities = data;
      });
    }
  }
  compareJournal(journal1: JournalEntity, journal2: JournalEntity) {
    return journal1.idExtern === journal2.idExtern
  }

  supplierEnable(amount: string, index: number) {

    if (amount === "Withholding Tax" || amount === "Total asset") {
      this.journalEntriesForms[index].controls['bySupplier'].enable()
    } else {
      this.journalEntriesForms[index].controls['bySupplier'].setValue(false);
      this.journalEntriesForms[index].controls['bySupplier'].disable()
    }
  }
}
