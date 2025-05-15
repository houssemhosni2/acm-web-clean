import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { LoanApprovalService } from '../loan-approval/loan-approval.service';
import { LoanScheduleEntity } from 'src/app/shared/Entities/loanSchedule.entity';
import { ScheduleService } from './schedule.service';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.sass']
})
export class ScheduleComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loading = true;
  public page: number;
  public pageSize: number;
  public schedules: ScheduleEntity[] = [];
  public loan: LoanEntity = new LoanEntity();
  public decimalPlaces: string;
  @Input() expanded;
  public lastLine: ScheduleEntity;
  public loadedData = false;
  public customer: CustomerEntity;
  /**
   * constructor
   * @param loanApprovalService LoanApprovalService
   * @param loanSharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   * @param scheduleService ScheduleService
   */
  constructor(public loanApprovalService: LoanApprovalService,
              public loanSharedService: SharedService, public devToolsServices: AcmDevToolsServices,private dbService: NgxIndexedDBService,
              public scheduleService: ScheduleService) {
  }

  async ngOnInit() {
    if (this.expanded && !this.loadedData) {
      this.loan = this.loanSharedService.getLoan();
      this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
      this.pageSize = 5;
      this.page = 1;
      if(!checkOfflineMode()){
      await this.scheduleService.loanSchedules(this.loan).toPromise().then(
      (schedules) => {
        this.schedules = schedules;
        this.loading = false;
        this.lastLine = this.schedules[this.schedules.length - 1];
      });
    } else {
      await this.dbService.getByKey('data','loanSchedules_' + this.loan.loanId).subscribe((resultat:any)=>{
        if(resultat !== undefined){
          this.schedules = resultat.data;
          this.loading = false;
          this.lastLine = this.schedules[this.schedules.length - 1];
        }
      })
    }
      this.loadedData = true;
    }
    this.customer = this.loanSharedService.getCustomer();
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }

  /**
   * DownLoad schedule
   */
  downloadSchedule() {
    const loanScheduleEntity = new LoanScheduleEntity();
    loanScheduleEntity.scheduleDTOs = this.schedules;
    this.loan.customerNameNoPipe=this.customer.customerNameNoPipe;
    loanScheduleEntity.loanDTO = this.loan;
    const daterun = new Date();
    this.loanApprovalService.reportingSchedule(loanScheduleEntity).subscribe(
      (res: any) => {
        const fileData = [res];
        const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'schedule_' + daterun.getFullYear() + '-' + daterun.getMonth() + '-'
          + daterun.getDate() + '_' + daterun.getHours() + '-' + daterun.getMinutes();
        anchor.href = url;
        anchor.click();
      }
    );
  }
}
