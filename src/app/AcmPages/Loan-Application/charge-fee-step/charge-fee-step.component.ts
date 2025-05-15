import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SettingChargeFeeEntity } from 'src/app/shared/Entities/settingChargeFee.entity';
import { SettingsService } from '../../Settings/settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { ChargeFeeEntity } from 'src/app/shared/Entities/ChargeFee.entity';
import { ChargeFeeService } from './charge-fee.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CustomerDecisionEntity } from 'src/app/shared/Entities/customerDecision.entity';
import { CustomerNotesService } from '../loan-approval/customer-notes/customer-notes.service';

@Component({
  selector: 'app-charge-fee-step',
  templateUrl: './charge-fee-step.component.html',
  styleUrls: ['./charge-fee-step.component.sass']
})
export class ChargeFeeStepComponent implements OnInit {
  @Input() expanded: boolean;
  @Input() source: string;
  public chargeFee: SettingChargeFeeEntity;
  public groupForm: FormGroup;
  public currentStep: StepEntity;
  public page: number;
  public pageSize: number;
  public chargeFees: ChargeFeeEntity[] = [];
  public updateChargeFee: ChargeFeeEntity;
  public chargeFeesList: SettingChargeFeeEntity[] = [];
  public connectedUser: UserEntity;
  public loan: LoanEntity;
  public collection: CollectionEntity;
  public display = false;
  public action: string;

  constructor(public modal: NgbModal, public translate: TranslateService, public sharedService: SharedService, public formBuilder: FormBuilder,public customerNotesService: CustomerNotesService,
    public settingsService: SettingsService, public chargeFeeService: ChargeFeeService, public library: FaIconLibrary, private dbService: NgxIndexedDBService,
    public devToolsServices: AcmDevToolsServices) { }

  async ngOnInit() {
    this.connectedUser = this.sharedService.getUser();
    this.pageSize = 5;
    this.page = 1;
    this.loan = this.sharedService.getLoan();

    await this.getCurrentStep();
    await this.getChargeFees();
  }
  toggleCollapse() {
    this.expanded = !this.expanded;
  }
  addFee(modalContent: TemplateRef<any>) {
    this.chargeFee = new SettingChargeFeeEntity();
    this.action = 'create';
    this.createForm();
    this.modal.open(modalContent);
  }

  editFee(modalContent, chargeFee: ChargeFeeEntity) {
    this.action = 'update';
    this.updateChargeFee = chargeFee;
    this.createForm();
    this.modal.open(modalContent)
    const fee = this.groupForm.get('id');
    const amount = this.groupForm.get('amount');
    const selectedChargeFee = this.chargeFeesList.find(item => item.id === chargeFee.settingFee);
    fee.setValue(selectedChargeFee ? selectedChargeFee.id : null);
    amount.setValue(chargeFee.amount);
  }

  getDirection() {
    return AppComponent.direction;
  }

  async createForm() {
    this.groupForm = this.formBuilder.group({
      id: ['', Validators.required],
      amount: ['', [Validators.min(0), Validators.required, this.amountLessThanLoanAmountValidator(this.loan.applyAmountTotal)]]
    });
  }
  
  private amountLessThanLoanAmountValidator(loanAmount: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const amount = control.value;
      if (amount >= loanAmount) {
        return { 'amountInvalid': { value: amount } }; // Invalid
      }
      return null; // Valid
    };
  }

  async getCurrentStep() {
    const step = new StepEntity();
    if (this.source === 'LOAN') {
      if(checkOfflineMode()){
        const data = await this.dbService.getByKey('data','getStepById_' + this.sharedService.getLoan().etapeWorkflow).toPromise() as any;
        if(data !== undefined){
          this.currentStep = data.data[0];
          this.checkChargesFee();
        }
      } else {
      step.idWorkFlowStep = this.sharedService.getLoan().etapeWorkflow;
      await this.settingsService.findWorkFlowSteps(step).subscribe((data) => {
        this.currentStep = data[0];
        this.checkChargesFee();
      })
    }
    }
    else if (this.source === 'LEGAL' || this.source === 'COLLECTION') {
      step.idCollectionStep = this.sharedService.getCollection().idAcmCollectionStep;
      await this.settingsService.getCollectionStepByParms(step).subscribe((data) => {
        this.currentStep = data[0];
        if (this.currentStep.listChargeFees.length > 0) {
          if (this.currentStep.listChargeFees.some((item) => item.value === AcmConstants.MANUAL_ENTRY)) {
            this.chargeFeesList = this.currentStep.listChargeFees.filter((item) => item.value === AcmConstants.MANUAL_ENTRY)
            this.display = true;
          }
        }
      })
    }
  }

  checkChargesFee(){
    if (this.currentStep.listChargeFees.length > 0) {
      if (this.currentStep.listChargeFees.some((item) => item.value === AcmConstants.MANUAL_ENTRY)) {
        this.chargeFeesList = this.currentStep.listChargeFees.filter((item) => item.value === AcmConstants.MANUAL_ENTRY)
        this.display = true;
      }
    }
  }
  async getChargeFees() {
    if(checkOfflineMode()){

      const data  = await this.dbService.getByKey('data', 'getChargesFeeByLoanInstance_' + this.sharedService.getLoan().processInstanceId).toPromise() as any;
      if(data !== undefined){
        this.chargeFee = data.data;
      }
    } else {
    const chargeFeeParam = new ChargeFeeEntity();
    if (this.source === 'LOAN') {
      chargeFeeParam.idLoanInstance = this.sharedService.getLoan().processInstanceId;
    }
    else if (this.source === 'LEGAL' || this.source === 'COLLECTION') {
      chargeFeeParam.idCollectionInstance = this.sharedService.getCollection().pendingCollectionInstance.id;
    }
    chargeFeeParam.charged = false;
    await this.chargeFeeService.find(chargeFeeParam).subscribe((data) => {
      this.chargeFees = data;
    });
  }
}
  getcurrentLang() {
    return this.translate.currentLang;
  }

  onSubmit() {
    if (this.groupForm.valid) {
      if (this.action === 'update') {
        this.update();
      }
      if (this.action === 'create') {
        this.create();
      }
    }
  }

  closeModal() {
    this.modal.dismissAll();
  }

  create() {
    this.chargeFee = this.currentStep.listChargeFees.find(chargeFee =>
      chargeFee.id == this.groupForm.controls.id.value
    );
    this.chargeFee.amount = this.groupForm.controls.amount.value;
    const chargeFee: ChargeFeeEntity = new ChargeFeeEntity();
    chargeFee.cufeeId = this.chargeFee.cufeeId;
    chargeFee.amount = this.chargeFee.amount;
    chargeFee.settingFee = this.chargeFee.id;
    chargeFee.charged = false;
    chargeFee.label = this.chargeFee.label;
    chargeFee.value = this.chargeFee.value;
    chargeFee.code = this.chargeFee.code;
    chargeFee.paid = false;
    chargeFee.paidAmount = 0; 
    chargeFee.acmLoanId = this.sharedService.getLoan().loanId;

    if (this.source === 'LOAN') {
      chargeFee.idLoanInstance = this.sharedService.getLoan().processInstanceId;


    } else if (this.source === 'LEGAL' || this.source === 'COLLECTION') {
      chargeFee.idCollectionInstance = this.sharedService.getCollection().pendingCollectionInstance.id
    }
    this.chargeFeeService.save(chargeFee).subscribe(data => {
      if (this.source === 'LOAN') {
        const customerDecisionEntity: CustomerDecisionEntity = new CustomerDecisionEntity();
        customerDecisionEntity.comments = "CHARGING FEES: " + this.chargeFee.code + "= " + this.chargeFee.amount;
        customerDecisionEntity.statusId = 4;
        customerDecisionEntity.idLoan = this.loan.loanId;
        customerDecisionEntity.amount = this.loan.approvelAmount;
        customerDecisionEntity.insertBy = "SYSTEM";
        customerDecisionEntity.contactDate = new Date();
        this.customerNotesService.saveNote(customerDecisionEntity).toPromise();
      }
      this.chargeFees.push(data);
      this.closeModal(); 
    });
  }

  update() {
    this.chargeFee = this.currentStep.listChargeFees.find(chargeFee =>
      chargeFee.id == this.groupForm.controls.id.value
    );
    this.chargeFee.amount = this.groupForm.controls.amount.value;
    this.updateChargeFee.cufeeId = this.chargeFee.cufeeId;
    this.updateChargeFee.amount = this.chargeFee.amount;
    this.updateChargeFee.settingFee = this.chargeFee.id;
    this.updateChargeFee.charged = false;
    this.updateChargeFee.label = this.chargeFee.label;
    this.updateChargeFee.value = this.chargeFee.value;
    this.updateChargeFee.code = this.chargeFee.code;
    this.chargeFeeService.update(this.updateChargeFee).subscribe(data => {
      this.closeModal();
    });
  }

  deleteFee(fee: SettingChargeFeeEntity) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.delete_charge_fee').afterClosed().subscribe(res => {
      if (res) {
        this.chargeFeeService.delete(fee.id).subscribe(() => {
          this.chargeFees = this.chargeFees.filter(item => item.id !== fee.id);
        });
      }
    });
  }
}
