import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoanDetailsServices } from './loan-details.services';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/shared.service';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingMotifRejetsEntity } from '../../../shared/Entities/settingMotifRejets.entity';
import { HabilitationEntity } from 'src/app/shared/Entities/habilitation.entity';
import { AppComponent } from '../../../app.component';
import { TranslateService } from '@ngx-translate/core';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import {MatDialog} from '@angular/material/dialog';
import { checkOfflineMode } from 'src/app/shared/utils';

@Component({
  selector: 'app-loan-application',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.sass']
})
export class LoanDetailsComponent implements OnInit , OnDestroy{
  idloan: string;
  public sub: any;
  public loan: LoanEntity = new LoanEntity();
  public loanACM: LoanEntity = new LoanEntity();

  public page: number;
  public pageSize: number;
  public rejectForm: FormGroup;
  public settingMotifRejetsEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifRejetsEntitys = [];
  public confirm = false;
  public currentStatus: number;
  public userHabilitations: HabilitationEntity[] = [];
  public checkButtonHabilitation: boolean;
  public currentPath = 'loan-details';
  public loanProcessEntitys: LoanProcessEntity[] = [];
  public orderProcess: number;
  public loanGroupe: LoanEntity = new LoanEntity();
  public view:string=AcmConstants.VIEW;

  /**
   * constructor
   * @param loanDetailsServices LoanDetailsServices
   * @param route ActivatedRoute
   * @param modalService NgbModal
   * @param router Router
   * @param loanSharedService LoanSharedService
   * @param dialog MatDialog
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   */
  constructor(public loanDetailsServices: LoanDetailsServices, public route: ActivatedRoute,
              public modalService: NgbModal, public router: Router, public loanSharedService: SharedService,
              public dialog: MatDialog, public devToolsServices: AcmDevToolsServices, public formBuilder: FormBuilder,
              public translate: TranslateService) {
  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
  ngOnInit() {
    this.devToolsServices.backTop();
    this.pageSize = 5;
    this.page = 1;
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
  }

  /**
   * rejectModale : open reject modal
   * @param content modal
   */
  public rejectModal(content) {
    this.settingMotifRejetsEntity.categorie = AcmConstants.REJECT_CATEGORIE;
    this.loanDetailsServices.getReason(this.settingMotifRejetsEntity).subscribe(
      (data) => {
        this.settingMotifRejetsEntitys = data;
      }
    );
    this.createForm();
    this.confirm = false;
    this.modalService.open(content, {
      size: 'md'
    });
  }

  /**
   * Methode to next step
   */
  async nextStep() {
    if (this.loan.etapeWorkflow === this.currentStatus) {
      this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT;
      await this.loanDetailsServices.validate(this.loan).toPromise().then(
        (data) => {
          this.loanSharedService.setLoan(data);
          this.router.navigate([AcmConstants.DASHBOARD_URL + '/' + data.ihmRoot]);
        });
    } else {
      this.router.navigate([this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG)]);
    }
  }

  /**
   * Methode reject : Reject loan
   */
  async reject() {
    this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_REJECT;
    await this.loanDetailsServices.validate(this.loan).toPromise().then(
      (data) => {
        this.loanSharedService.setLoan(data);
        this.router.navigate([AcmConstants.DASHBOARD_URL]);
      });
  }

  /**
   * Methode exit
   */
  exit() {
    this.loanSharedService.exitFromLoan(this.loan);
  }

  /**
   * createForm : create Form Reject
   */
  createForm() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required],
      note: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }

  /**
   * onSubmit : submit form
   */
  onSubmit() {
    if (this.rejectForm.valid) {
      this.loan.confirm = this.confirm;
      this.modalService.dismissAll();
      this.loan.note = this.rejectForm.value.reason.libelle;
      this.loan.note = this.loan.note + ' : ' + this.rejectForm.value.note;
      this.loan.codeExternMotifRejet = this.rejectForm.value.reason.codeExternal;
      this.reject();
    }
  }

  changeChecbox($event: Event) {
    if (this.confirm === false) {
      this.confirm = true;
    } else {
      this.confirm = false;
      this.rejectForm.controls.confirm.setValue('');
    }
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
}
