import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticRoutingModule } from './analytic-routing.module';
import { AnalyticComponent } from './analytic.component';
import { TranslateModule} from '@ngx-translate/core';
import { NgxLoadingModule } from 'ngx-loading';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GaugeModule } from 'angular-gauge';
import { TrendModule } from 'ngx-trend';
import { PageTitleModule } from 'src/app/Layout/Components/page-title/page-title.module';

@NgModule({
  declarations: [AnalyticComponent],
  imports: [
    CommonModule,
    AnalyticRoutingModule,
    RoundProgressModule,
    ChartsModule,
    NgApexchartsModule,
    GaugeModule.forRoot(),
    TrendModule,
    PageTitleModule,
    NgxLoadingModule.forRoot({}),
    TranslateModule.forChild()
  ],
  exports: [TranslateModule]
})
export class AnalyticsModule { }
