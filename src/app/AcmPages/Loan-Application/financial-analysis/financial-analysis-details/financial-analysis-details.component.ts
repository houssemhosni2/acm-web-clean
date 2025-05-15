import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FinancialAnalysisDetailsServices} from './financial-analysis-details.services';
import {FinancialAnalysisEntity} from '../../../../shared/Entities/financialAnalysis.entity';
import {LoanEntity} from '../../../../shared/Entities/loan.entity';
import {SharedService} from 'src/app/shared/shared.service';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import {AcmDevToolsServices} from 'src/app/shared/acm-dev-tools.services';
import {TranslateService} from '@ngx-translate/core';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-financial-analysis-details',
  templateUrl: './financial-analysis-details.component.html',
  styleUrls: ['./financial-analysis-details.component.sass']
})
export class FinancialAnalysisDetailsComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loading = true;

  public financialAnalysisEntity: FinancialAnalysisEntity = new FinancialAnalysisEntity();
  public loan: LoanEntity = new LoanEntity();
  public decimalPlaces: string;
  @Input() expanded;
  private loadedData = false;

  /**
   * constructor
   * @param FinancialAnalysisDetailsServices financialAnalysisDetailsServices
   * @param LoanSharedService loanSharedService
   * @param AcmDevToolsServices devToolsServices
   * @param TranslateService translate
   */
  constructor(public financialAnalysisDetailsServices: FinancialAnalysisDetailsServices,
              public loanSharedService: SharedService, public devToolsServices: AcmDevToolsServices, public translate: TranslateService) {
  }

  ngOnInit() {
    if (this.expanded && ! this.loadedData) {
    this.loan = this.loanSharedService.getLoan();
   // this.loan.currencySymbol = "";
    this.decimalPlaces =  this.devToolsServices.getDecimalPlaces("3");

    //this.decimalPlaces =  this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    // this.financialAnalysisDetailsServices.loan_financial_analysis_byIdLoanExtern(this.loan.idLoanExtern).subscribe(
    this.financialAnalysisDetailsServices.loan_financial_analysis_byloan(this.loan).subscribe(
    (data) => {
        this.financialAnalysisEntity = data;
        this.loading = false;
      }
    );
    this.loadedData = true;
  }
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }
}
