import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoanDetailsServices} from '../loan-details/loan-details.services';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanEntity} from '../../../shared/Entities/loan.entity';
import {FormBuilder} from '@angular/forms';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {SharedService} from 'src/app/shared/shared.service';
import {AcmDevToolsServices} from '../../../shared/acm-dev-tools.services';
import {AcmConstants} from 'src/app/shared/acm-constants';
import {LoanProcessEntity} from 'src/app/shared/Entities/loan.process.entity';

@Component({
  selector: 'app-field-visit',
  templateUrl: './field-visit.component.html',
  styleUrls: ['./field-visit.component.sass']
})
export class FieldVisitComponent implements OnInit, OnDestroy {
  public loan: LoanEntity = new LoanEntity();
  public htmlContent: string;
  public block = false;
  public blockPrevious: boolean;
  public loanProcessEntitys: LoanProcessEntity[] = [];
  public orderProcess: number;
  public currentPath = 'field-visit';
  public currentStatus: number;
  public view:string=AcmConstants.VIEW;
  public lastDarft: boolean;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };
  public sub: any;
  public idloan: string;

  // tslint:disable-next-line:max-line-length
  /**
   * constructor
   * @param loanDetailsServices LoanDetailsServices
   * @param LoanSharedService loanSharedService
   * @param ActivatedRoute route
   * @param FormBuilder formBuilder
   * @param Router router
   */
  constructor(public loanDetailsServices: LoanDetailsServices, public loanSharedService: SharedService,
              public route: ActivatedRoute, public formBuilder: FormBuilder, public router: Router,
              public devToolsServices: AcmDevToolsServices) {

  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
  ngOnInit() {
    this.devToolsServices.backTop();
    this.loan = this.loanSharedService.getLoan();
    this.loanProcessEntitys = this.loan.loanInstancesDtos;
    this.lastDarft = false;

    for (let i = 0; i < this.loanProcessEntitys.length; i++) {
      if (this.loanProcessEntitys[i].code === this.loan.etapeWorkflow) {
        this.orderProcess = this.loanProcessEntitys[i].orderEtapeProcess;
      }
      if (this.loanProcessEntitys[i].ihmRoot === this.currentPath) {
        this.currentStatus = this.loanProcessEntitys[i].code;
      }
      if (this.loanProcessEntitys[i].code === 7 && this.loanProcessEntitys[i - 1].code === this.currentStatus) {
        this.lastDarft = true;
      }
    }
  }

  /**
   * Methode to next step
   */
  async nextStep() {
    this.loanSharedService.setLoader(true);
    this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT;
    await this.loanDetailsServices.validate(this.loan).toPromise().then(
      (data) => {
        this.loanSharedService.setLoan(data);
        this.loanSharedService.setLoader(false);
        this.router.navigate([AcmConstants.DASHBOARD_URL + '/' + data.ihmRoot]);
      });
  }

  /**
   * Methode to next step
   */
  previousStep() {
    this.blockPrevious = this.loanSharedService.getCheckPrevious();
    if (this.blockPrevious) {
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

}
