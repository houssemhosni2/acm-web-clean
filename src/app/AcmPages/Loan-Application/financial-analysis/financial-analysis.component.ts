import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoanEntity} from '../../../shared/Entities/loan.entity';
import {SharedService} from 'src/app/shared/shared.service';
import {AcmDevToolsServices} from '../../../shared/acm-dev-tools.services';
import {AcmConstants} from 'src/app/shared/acm-constants';
import {LoanDetailsServices} from '../loan-details/loan-details.services';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';

@Component({
  selector: 'app-financial-analysis',
  templateUrl: './financial-analysis.component.html',
  styleUrls: ['./financial-analysis.component.sass']
})
export class FinancialAnalysisComponent implements OnInit , OnDestroy {
  public loan: LoanEntity;
  public currentStatus = AcmConstants.STATUT_WORKFLOW_FINANCIAL_ANALYSIS;
  public currentPath = 'financial-analysis';
  public loanProcessEntitys: LoanProcessEntity[] = [];
  public orderProcess: number;
  public view:string=AcmConstants.VIEW;
  /**
   * constructor
   * @param LoanSharedService loanSharedService
   * @param AcmDevToolsServices devToolsServices
   * @param LoanDetailsServices loanDetailsServices
   * @param router Router
   * @param modalService NgbModal
   */
  constructor(public loanSharedService: SharedService, public devToolsServices: AcmDevToolsServices,
              public loanDetailsServices: LoanDetailsServices, public router: Router,
              public modalService: NgbModal) {
  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
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
  }

  /**
   * Methode to next step
   */
  previousStep() {
    this.router.navigate([AcmConstants.UPLOAD_DOCUMENT_URL]);
  }

  /**
   * Methode exit
   */
  exit() {
    this.loanSharedService.exitFromLoan(this.loan);
  }

  /**
   * Methode submit
   */
  async onSubmit() {
    if ((this.loan.etapeWorkflow === this.currentStatus) || (this.loan.etapeWorkflow === AcmConstants.STATUT_WORKFLOW_REVIEW)) {
      this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT;
      await this.loanDetailsServices.validate(this.loan).toPromise().then(
        (data) => {
          this.loanSharedService.setLoan(data);
          this.router.navigate([AcmConstants.DASHBOARD_URL + '/' + data.ihmRoot]);
        });
    } else {
      this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_PASS;
      this.router.navigate([this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG)]);
    }
  }

  /**
   * submitModel
   */
  submitModel() {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.agree').afterClosed().subscribe(res => {
      if (res) {
        this.onSubmit();
      }
    });
  }
}
