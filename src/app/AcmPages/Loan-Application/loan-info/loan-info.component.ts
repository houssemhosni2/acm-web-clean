import {Component, Input, OnInit} from '@angular/core';
import {LoanEntity} from '../../../shared/Entities/loan.entity';
import {SharedService} from 'src/app/shared/shared.service';
import {AcmDevToolsServices} from 'src/app/shared/acm-dev-tools.services';
import { LoanApprovalService } from '../loan-approval/loan-approval.service';
import { LoanDetailsInformationsResponseEntity } from 'src/app/shared/Entities/LoanDetailsInformationsResponse.entity';
import { SettingsService } from '../../Settings/settings.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CustomerAccount360Service } from '../../Customer/customer-account-360/customer-account-360.service';
import { CustomerAccountEntity } from 'src/app/shared/Entities/customer.account.entity';
import { ScheduleService } from '../loan-schedule/schedule.service';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';

@Component({
  selector: 'app-loan-info',
  templateUrl: './loan-info.component.html',
  styleUrls: ['./loan-info.component.sass']
})
export class LoanInfoComponent implements OnInit {
  public sub: any;
  public decimalPlaces: string;
  public loan: LoanEntity;
  public paymentFreqDescription: string;
  public amountVat: number;
  public vat: number ;
  @Input() expanded;
  private loadedData = false;
  public detailsInformationsLoan: LoanDetailsInformationsResponseEntity=new LoanDetailsInformationsResponseEntity();
  loanReason: string;
  public lastLine: ScheduleEntity;
  /**
   * constructor
   * @param loanDetailsServices LoanDetailsServices
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public loanSharedService: SharedService, public devToolsServices: AcmDevToolsServices,private dbService: NgxIndexedDBService,
              public loanApprovalService: LoanApprovalService, public settingService: SettingsService, private customerAccount360Service: CustomerAccount360Service,
              public scheduleService: ScheduleService) {
  }

  ngOnInit() {
    this.loan = this.loanSharedService.getLoan();
    if (this.loan.statut && this.loan.statut == '8') {
      if (this.loan.earlyPaid === true) {
        this.loan.issuedStatut = 'Early Paid';
      } else if (this.loan.drAmount > this.loan.crAmount) {
        this.loan.issuedStatut = 'Issued';
      } else {
        this.loan.issuedStatut = 'Paid';
      }
    }
    if (this.expanded && !this.loadedData) {
      this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
      this.getPaymentFreqDescription();
      this.loadedData = true;
    }
    if (!checkOfflineMode()) {
      if (this.loanSharedService.useExternalCBS === '1') {
        //find details informations of loan from abacus
        this.settingService.getDetailsInformationsLoanFromAbacus(Number(this.loan.idLoanExtern)).subscribe(dataLoan => {
          this.detailsInformationsLoan = dataLoan[0];
          this.getloanReasonDescription();
        })
      }
      else {
        this.scheduleService.loanSchedules(this.loan).toPromise().then(
        (schedules) => {
            this.lastLine = schedules[schedules.length - 1];
        });
      }
    }
    else {
      this.dbService.getByKey('data', 'getLoanDetailsFromAbacus_' + this.loan.loanId).subscribe((loanDetails: any) => {
        if (loanDetails !== undefined) {
          this.detailsInformationsLoan = loanDetails.data[0];
          this.getloanReasonDescription();
        }
      })
    }

  }
  /**
   * getCalculationInformation (GET VAT ONLY FOR MURABAHA LOANS)
   */
  async getCalculationInformation() {
    if (this.loan.productCode === 'Murabaha Loans') {
      await this.loanApprovalService.calculateLoanSchedules(this.loan).toPromise().then(
        (data) => {
          this.vat = data.insurancePremium;
          this.amountVat = this.loan.applyAmountTotal + this.vat;
        });
    } else {
      this.amountVat = this.loan.applyAmountTotal;
    }

  }

  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }
  /**
   * getPaymentFreqDescription
   */
  getPaymentFreqDescription() {
    switch (this.loan.termPeriodID) {
      case 1:
        this.paymentFreqDescription = 'Daily';
        break;
      case 2:
        this.paymentFreqDescription = 'Weekly';
        break;
      case 3:
        this.paymentFreqDescription = 'Monthly';
        break;
        case 5:
        this.paymentFreqDescription = 'Years';
        break;
    }
  }

  getloanReasonDescription() {
    switch (this.detailsInformationsLoan.loanReason) {
      case 'Holiday':
        this.loanReason = 'Holiday';
        break;
        default:
          this.loanReason = this.detailsInformationsLoan.loanReason;
        break;
    }
  }

}
