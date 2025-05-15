import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { checkOfflineMode } from 'src/app/shared/utils';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-loan-process',
  templateUrl: './loan-process.component.html',
  styleUrls: ['./loan-process.component.sass']
})
export class LoanProcessComponent implements OnInit {
  public display=false;
  public loan: LoanEntity = new LoanEntity();
  public loanProcessEntitys: LoanProcessEntity[] = [];
  public orderProcess: number;
  @Input() etapeProcess: number;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public loading = true;

  /**
   * constructor
   * @param LoanSharedService loanSharedService
   * @param AcmDevToolsServices devToolsServices
   * @param TranslateService translate
   */
  constructor(public loanSharedService: SharedService,
              public devToolsServices: AcmDevToolsServices,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.loan = this.loanSharedService.getLoan();
    this.loanProcessEntitys = this.loan.loanInstancesDtos;
    if (this.loan.etapeWorkflow !== AcmConstants.STATUT_WORKFLOW_REVIEW) {
      this.loanProcessEntitys.forEach(element => {
        if (element.code === this.loan.etapeWorkflow) {
          this.orderProcess = element.orderEtapeProcess;
        }
      });
    } else if (this.loan.etapeWorkflow === AcmConstants.STATUT_WORKFLOW_REVIEW
      && !(this.loan.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY)) {
      this.loanProcessEntitys.forEach(element => {
        if (element.code === this.etapeProcess) {
          this.orderProcess = element.orderEtapeProcess;
        }
      });
    } else if (this.loan.etapeWorkflow === AcmConstants.STATUT_WORKFLOW_REVIEW
      && this.loan.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.loanProcessEntitys.forEach(element => {
        if (element.code === AcmConstants.STATUT_WORKFLOW_SCREENING || element.code === AcmConstants.STATUT_WORKFLOW_FIELD_VISIT) {
          this.orderProcess = element.orderEtapeProcess;
        }
      });
    }
    this.loading = false;
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
}
