import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { LoanDetailsServices } from '../loan-details/loan-details.services';

@Component({
  selector: 'app-check-guarantor',
  templateUrl: './check-guarantor.component.html',
  styleUrls: ['./check-guarantor.component.sass']
})
export class CheckGuarantorComponent implements OnInit, OnDestroy {

  public loan: LoanEntity = new LoanEntity();
  public checkGuarantor: boolean;
  public currentStatus = AcmConstants.STATUT_WORKFLOW_GUARANTOR;
  public currentPath = 'check-guarantor';
  public view: string = AcmConstants.VIEW;

  /**
   * constructor
   * @param LoanSharedService  loanSharedService
   * @param Router  router
   * @param LoanDetailsServices loanDetailsServices
   * @param AcmDevToolsServices devToolsServices
   */
  constructor(public loanSharedService: SharedService,
    public router: Router,
    public devToolsServices: AcmDevToolsServices,
    public loanDetailsServices: LoanDetailsServices) {
  }

  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }

  ngOnInit() {
    this.devToolsServices.backTop();
    this.loan = this.loanSharedService.getLoan();
    this.loanSharedService.setCustomer(this.loan.customerDTO);
  }

  /**
   * Methode to next Step
   */
  async nextStep() {
    if (!this.checkGuarantor) {
      this.loanSharedService.getIhmByAction(AcmConstants.NEXT_FORM_MSG, AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT)
    }
  }

  /**
   * Methode to next step
   */
  previousStep() {
    this.loanSharedService.getIhmByAction(AcmConstants.PREVIOUS_FORM_MSG);
  }

  /**
   * Methode exit
   */
  exit() {
    this.loanSharedService.exitFromLoan(this.loan);
  }

  checkDisabled(event: boolean) {
    this.checkGuarantor = event;
  }

}
