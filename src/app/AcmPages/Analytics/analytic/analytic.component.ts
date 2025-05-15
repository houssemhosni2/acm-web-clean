import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries,
  ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis
} from 'ng-apexcharts';
import { AnalyticService } from './analytic.service';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Subject } from 'rxjs';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
const PrimaryBleu = 'var(--primary)';

export interface ChartOptionsDonut {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: any;
}

export interface ChartOptionsBar {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
}

export interface ChartOptionsArea {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
}

export interface ChartOptionsBarLoan {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
}

@Component({
  selector: 'app-analytic',
  templateUrl: './analytic.component.html',
  styleUrls: ['./analytic.component.sass']
})
export class AnalyticComponent implements OnInit {
  dataLoadedDonut = new Subject<boolean>();
  dataLoadedBar = new Subject<boolean>();
  dataLoadedArea = new Subject<boolean>();
  dataLoadedBarLoan = new Subject<boolean>();

  public chartOptionsDonut: Partial<ChartOptionsDonut>;
  public chartOptionsBar: Partial<ChartOptionsBar>;
  public chartOptionsArea: Partial<ChartOptionsArea>;
  public chartOptionsBarLoan: Partial<ChartOptionsBarLoan>;

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };

  decimalPlaces = '0.2';
  totalAppliedLoans = 0;
  pourcentageAppliedLoans = 0;
  totalApprovedLoans = 0;
  pourcentageApprovedLoans = 0;
  totalCanceledRejectedLoans = 0;
  pourcentageCanceledRejectedLoans = 0;
  totalLoansAmount = 0;
  currency: string;
  totalCustomers = 0;
  totalActiveCustomers = 0;
  pourcentageTotalCustomers = 0;
  pourcentageTotalActiveCustomers = 0;
  public loadingTotalAppliedLoans = true;
  public loadingTotalApprovedLoans = true;
  public loadingTotalLoansAmount = true;
  public loadingTotalCanceledRejectedLoans = true;
  public loadingLoanProduct = true;
  public loadingChartBar = true;
  public loadingTotalCustomers = true;
  public loadingTotalActiveCustomers = true;
  public kibanaDashboardUrl: SafeResourceUrl;

  constructor(public analyticService: AnalyticService, public translate: TranslateService, public environment:CustomerManagementService,public sanitizer:DomSanitizer) {

  }

  ngOnInit() {

    this.getKibanaDashboardUrl() 
    // MERGE
    /*forkJoin([
      this.analyticService.totalAppliedLoans(),
      this.analyticService.totalApprovedLoans(),
      this.analyticService.totalLoansAmount(),
      this.analyticService.totalCanceledRejectedLoans(),
      this.analyticService.countLoansByProducts(),
      this.analyticService.loansStatByMonths(),
      this.analyticService.totalCustomers(),
      this.analyticService.totalActiveCustomers(),
      this.analyticService.customersStatByMonths(),
      this.analyticService.loansAmountStatByMonths(),
    ])
      .subscribe((res) => {
        this.totalAppliedLoans = res[0].total;
        this.pourcentageAppliedLoans = res[0].pourcentage;
        this.loadingTotalAppliedLoans = false;
        //
        this.totalApprovedLoans = res[1].total;
        this.pourcentageApprovedLoans = res[1].pourcentage;
        this.loadingTotalApprovedLoans = false;
        //
        this.totalLoansAmount = res[2].total;
        this.currency = res[2].currency;
        this.loadingTotalLoansAmount = false;
        //
        this.totalCanceledRejectedLoans = res[3].total;
        this.pourcentageCanceledRejectedLoans = res[3].pourcentage;
        this.loadingTotalCanceledRejectedLoans = false;
        // init chartOptionsDonut by Product
        this.chartOptionsDonut = {
          series: res[4].loanNumberByProduct,
          labels: res[4].labelsProducts,
          chart: {
            type: 'donut'
          },
        };
        this.loadingLoanProduct = false;
        this.dataLoadedDonut.next(true);
        //
        // chart Bar
        this.chartOptionsBar = {
          series: [
            {
              name: 'Applied Loans',
              data: res[5].seriesAppliedLoans
            },
            {
              name: 'Approved Loans',
              data: res[5].seriesApprovedLoans
            },
            {
              name: 'Canceled/Rejected Loans',
              data: res[5].seriesCanceledRejectedLoans
            }
          ],
          chart: {
            type: 'bar',
            height: 300
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%'
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: res[5].xaxisCategories
          },
          yaxis: {
            title: {
              text: 'Loans Number'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter(val) {
                return '[' + val + ']';
              }
            }
          }
        };
        this.translate.get('analytics.applied_loans').subscribe((value) => {
          this.chartOptionsBar.series[0].name = value;
        });
        this.translate.get('analytics.approved_loans').subscribe((value) => {
          this.chartOptionsBar.series[1].name = value;
        });
        this.translate.get('analytics.canceled/rejected_loans').subscribe((value) => {
          this.chartOptionsBar.series[2].name = value;
        });
        this.translate.get('analytics.loans_number').subscribe((value) => {
          if (this.translate.currentLang === 'ar') {
            this.chartOptionsBar.yaxis.title.offsetX = -25;
            this.chartOptionsBar.yaxis.title.offsetY = 0;
          }
          this.chartOptionsBar.yaxis.title.text = value;

        });
        this.loadingChartBar = false;
        this.dataLoadedBar.next(true);

        //
        this.totalCustomers = res[6].totalCustomers;
        this.pourcentageTotalCustomers = res[6].pourcentage;
        this.loadingTotalCustomers = false;
        //
        this.totalActiveCustomers = res[7].totalActivesCustomers;
        this.pourcentageTotalActiveCustomers = res[7].pourcentage;
        this.loadingTotalActiveCustomers = false;
        //
        // area chart for customers analytics  per month
        this.chartOptionsArea = {
          series: [
            {
              name: 'Total customers',
              data: res[8].seriesTotalCustomers
            },
            {
              name: 'Total active customers',
              data: res[8].seriesTotalActiveCustomers
            }
          ],
          chart: {
            height: 350,
            type: 'area'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            categories: res[8].xaxisCategories
          },
          tooltip: {
            x: {
              format: '0.2'
            }
          }
        };
        this.dataLoadedArea.next(true);
        //
        // Bar chart for loan amount per month

        // Bar chart for loan amount per month
        this.chartOptionsBarLoan = {
          series: [
            {
              name: 'Amount (EGP)',
              data: res[9].seriesAmountLoans
            }
          ],
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: res[9].xaxisCategories
          }
        };
        this.dataLoadedBarLoan.next(true);
      });*/
  }




  getKibanaDashboardUrl() {
     this.environment.getEnvirementValueByKey('ACM_KIBANA_DASHBOARD_URL').subscribe((url: any) => 
      { 
        const kibanaUrl = url.value.replace('localhost', '172.16.4.39');
         this.kibanaDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(kibanaUrl); 
        }); }
}
