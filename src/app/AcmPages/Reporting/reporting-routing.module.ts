import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from 'src/app/shared/auth-guard.service';
import {ReportsListComponent} from './reports-list/reports-list.component';
import { CoreReportingComponent } from './core-reporting/core-reporting.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reports-list', canActivate: [AuthGuardService], component: ReportsListComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'reporting', canActivate: [AuthGuardService], component: CoreReportingComponent,
        data: {extraParameter: 'dashboardsMenu'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule {
}
