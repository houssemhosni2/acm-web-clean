import { TranslateService } from '@ngx-translate/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AcmLoanInstanceAcmGroupeApprovalEntity } from '../../../shared/Entities/acmLoanInstanceAcmGroupeApproval.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faTh } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { LoanApprovalService } from '../loan-approval/loan-approval.service';

const PrimaryBleu = 'var(--primary)';
@Component({
  selector: 'app-validation-approval',
  templateUrl: './validation-approval.component.html',
  styleUrls: ['./validation-approval.component.sass']
})
export class ValidationApprovalComponent implements OnInit {
  faAngleDown = faAngleDown;
  faTh = faTh;
  faCalendarAlt = faCalendarAlt;
  faTrash = faTrash;
  faCheck = faCheck;
  public listValidators: AcmLoanInstanceAcmGroupeApprovalEntity[] = [];
  public loan: LoanEntity;
  public currentStep: LoanProcessEntity;

  public listWorkFlowSteps: StepEntity[] = [];
  public listGroups: GroupeEntity[] = [];
  public listGroupsApproved: GroupeEntity[] = [];
  public index = 0;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: this.ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public loading = true;

  @Input() expanded;
  @Input() saveParticipants = true;
  public IsTaskRunning = false;
  public listIndex: number[];
  @Input() display;

  constructor(public sharedService: SharedService,
    public settingsService: SettingsService, public devToolsServices: AcmDevToolsServices,
    public loanApprovalService: LoanApprovalService, public translate: TranslateService,) {

  }

  async ngOnInit() {
    this.loan = this.sharedService.getLoan();

    this.loan.loanInstancesDtos.forEach(step => {
      if (step.code === this.loan.etapeWorkflow)
        this.currentStep = step;
    });
    if (this.currentStep) {

      const loanIn: AcmLoanInstanceAcmGroupeApprovalEntity = new AcmLoanInstanceAcmGroupeApprovalEntity();
      const loanIns: LoanProcessEntity = new LoanProcessEntity();
      loanIns.id = this.currentStep.id;
      loanIn.loanInstance = loanIns;
      this.loanApprovalService.getListValidatorsLoanInstance(loanIn).subscribe((value) => {
        this.listValidators = value ; // .filter(item => this.currentStep.id === item.LoanInsID);
        if (this.listValidators.length > 0) {
          this.display = true;
        }

      })

    }
  }
  toggleCollapse() {
    this.expanded = !this.expanded;
  }
}
