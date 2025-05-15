import { Component, OnInit } from '@angular/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { IncentiveSettingRunEntity } from 'src/app/shared/Entities/incentiveSettingRun.entity';
import { RunIncentiveService } from './run-incentive.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AcmStatutsEntity} from '../../../shared/Entities/acmstatus.entity';
import {IncentiveHistoryEntity} from '../../../shared/Entities/incentiveHistory.entity';
import {SharedService} from '../../../shared/shared.service';
import {AcmConstants} from '../../../shared/acm-constants';

@Component({
  selector: 'app-run-incentive',
  templateUrl: './run-incentive.component.html',
  styleUrls: ['./run-incentive.component.sass']
})
export class RunIncentiveComponent implements OnInit {

  public incentiveSettingRuns: IncentiveSettingRunEntity[] = [];
  public response: string;
  public selectedReport = false;
  public incentiveHistoryForm: FormGroup;
  public incentiveHistoryYears: AcmStatutsEntity[] = [];
  public incentiveHistoryMonth: AcmStatutsEntity[] = [];
  public currentPath = AcmConstants.RUN_INCENTIVE_URL;

  /**
   * constructor Run Incentive Component
   * @param runIncentiveService RunIncentiveService
   * @param devToolsServices devToolsServices
   * @param formBuilder FormBuilder
   * @param loanSharedService SharedService
   */
  constructor(public runIncentiveService: RunIncentiveService, public devToolsServices: AcmDevToolsServices,
              public formBuilder: FormBuilder, public loanSharedService: SharedService) {

  }

  ngOnInit() {
    this.runIncentiveService.findIncentiveSettingsRun(new IncentiveSettingRunEntity()).subscribe(data => {
      this.incentiveSettingRuns = data;
    });
    this.createIncentiveHistoryForm();
  }

  /**
   * generate Report
   * @param type type of incentive
   * @param mode value/history
   */
  async generateReport(type: string, mode: string) {
    const incentiveHistoryEntity: IncentiveHistoryEntity = new IncentiveHistoryEntity();
    if (mode === 'history') {
      type = this.incentiveHistoryForm.controls.incentiveReport.value.code;
      incentiveHistoryEntity.year = this.incentiveHistoryForm.controls.year.value;
      incentiveHistoryEntity.month = this.incentiveHistoryForm.controls.month.value;
    }
    const daterun = new Date();
    switch (type) {
      case 'ACM_INCENTIVE_REPAYMENT': {
        await this.runIncentiveService.reportingIncentiveRepayment(incentiveHistoryEntity).subscribe(
          (res: any) => {
            const fileData = [res];
            const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.download = 'incentive_repayment_' + daterun.getFullYear() + '-' + daterun.getMonth() + '-'
            + daterun.getDate() + '_' + daterun.getHours() + '-' + daterun.getMinutes();
            anchor.href = url;
            anchor.click();
          });
        break;
      } case 'ACM_INCENTIVE_REGESTRATION': {
        await this.runIncentiveService.reportingIncentiveRegistration(incentiveHistoryEntity).subscribe(
          (res: any) => {
            const fileData = [res];
            const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.download = 'incentive_registration_' + daterun.getFullYear() + '-' + daterun.getMonth() + '-'
            + daterun.getDate() + '_' + daterun.getHours() + '-' + daterun.getMinutes();
            anchor.href = url;
            anchor.click();
          });
        break;
      } case 'ACM_INCENTIVE_OPERATION': {
        await this.runIncentiveService.reportingIncentiveOperation(incentiveHistoryEntity).subscribe(
          (res: any) => {
            const fileData = [res];
            const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.download = 'incentive_operation_' + daterun.getFullYear() + '-' + daterun.getMonth() + '-'
            + daterun.getDate() + '_' + daterun.getHours() + '-' + daterun.getMinutes();
            anchor.href = url;
            anchor.click();
          });
        break;
      } case 'ACM_INCENTIVE_LEGAL': {
        // TODO
        break;
      } default: {
        // TODO add toast : non type
        break;
      }
    }
  }

  /**
   * Calculate incentive
   */
  async calculate(type: string) {
    switch (type) {
      case 'ACM_INCENTIVE_REPAYMENT': {
        await this.runIncentiveService.runCalculateIncentiveRepayment().toPromise().then(data => {
          this.response = data;
          this.devToolsServices.openToast(0, 'alert.success');
        });
        break;
      } case 'ACM_INCENTIVE_REGESTRATION': {
        await this.runIncentiveService.runCalculateIncentiveRegistration().toPromise().then(data => {
          this.response = data;
          this.devToolsServices.openToast(0, 'alert.success');
        });
        break;
      } case 'ACM_INCENTIVE_OPERATION': {
        await this.runIncentiveService.runCalculateIncentiveOperation().toPromise().then(data => {
          this.response = data;
          this.devToolsServices.openToast(0, 'alert.success');
        });
        break;
      } case 'ACM_INCENTIVE_LEGAL': {
        // TODO
        break;
      } default: {
        // TODO add toast : non type
        break;
      }
    }
  }

  /**
   * create Incentive History Form
   */
  createIncentiveHistoryForm() {
    this.incentiveHistoryForm = this.formBuilder.group({
      incentiveReport: [null, Validators.required],
      year: ['', Validators.required],
      month: ['', Validators.required]
    });
  }

  loadYearMonth() {
    this.incentiveHistoryMonth = [];
    this.incentiveHistoryYears = [];
    if (this.incentiveHistoryForm.controls.incentiveReport.value !== null) {
      this.selectedReport = true;
      switch (this.incentiveHistoryForm.controls.incentiveReport.value.code) {
        case 'ACM_INCENTIVE_REPAYMENT': {
          this.runIncentiveService.incentiveLoanRunYearRepayment().subscribe(
            (data) => {
              this.incentiveHistoryYears = data;
            }
          );
          this.runIncentiveService.incentiveLoanRunMonthRepayment().subscribe(
            (data) => {
              this.incentiveHistoryMonth = data;
            }
          );
          break;
        }
        case 'ACM_INCENTIVE_REGESTRATION': {
          this.runIncentiveService.incentiveLoanRunYearRegistration().subscribe(
            (data) => {
              this.incentiveHistoryYears = data;
            }
          );
          this.runIncentiveService.incentiveLoanRunMonthRegistration().subscribe(
            (data) => {
              this.incentiveHistoryMonth = data;
            }
          );
          break;
        }
        case 'ACM_INCENTIVE_OPERATION': {
          this.runIncentiveService.incentiveLoanRunYearOperation().subscribe(
            (data) => {
              this.incentiveHistoryYears = data;
            }
          );
          this.runIncentiveService.incentiveLoanRunMonthOperation().subscribe(
            (data) => {
              this.incentiveHistoryMonth = data;
            }
          );
          break;
        }
        case 'ACM_INCENTIVE_LEGAL': {
          // TODO
          break;
        }
        default: {
          // TODO add toast : non type
          break;
        }
      }
      this.incentiveHistoryForm.controls.year.setValue(null);
      this.incentiveHistoryForm.controls.month.setValue(null);
    } else {
      this.selectedReport = false;
      this.incentiveHistoryYears = [];
      this.incentiveHistoryMonth = [];
    }
  }

  checkHabilitation(incentive: IncentiveSettingRunEntity): boolean {
    switch (incentive.code) {
      case 'ACM_INCENTIVE_REPAYMENT': {
        return this.loanSharedService.habilitationButton(AcmConstants.ISSUANCE_REPAYEMENT, this.currentPath);
        break;
      } case 'ACM_INCENTIVE_REGESTRATION': {
        return this.loanSharedService.habilitationButton(AcmConstants.REGISTRATION, this.currentPath);
        break;
      } case 'ACM_INCENTIVE_OPERATION': {
        return this.loanSharedService.habilitationButton(AcmConstants.OPERATION, this.currentPath);
        break;
      } case 'ACM_INCENTIVE_LEGAL': {
        return this.loanSharedService.habilitationButton(AcmConstants.LEGEL, this.currentPath);
        break;
      } default: {
        return true;
        break;
      }
    }
  }
}
