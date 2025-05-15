import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { CreditLineAddComponent } from './credit-line-add/credit-line-add.component';
import { CreditLineListComponent } from './credit-line-list/credit-line-list.component';
import { CreditLineAccountComponent } from './credit-line-account/credit-line-account.component';
import { CreditLineReportsComponent } from './credit-line-reports/credit-line-reports.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
      path: 'add-credit-line',
      canActivate: [AuthGuardService],
      component: CreditLineAddComponent,
      data: { extraParameter: 'dashboardsMenu' }
    },
    {
      path: 'list-credit-line',
      canActivate: [AuthGuardService],
      component: CreditLineListComponent,
      data: { extraParameter: 'dashboardsMenu' }
    },
    {
      path: 'credit-line-accounts',
      canActivate: [AuthGuardService],
      component: CreditLineAccountComponent,
      data: { extraParameter: 'dashboardsMenu' }
    },
    {
      path: 'credit-line-reports',
      canActivate: [AuthGuardService],
      component: CreditLineReportsComponent,
      data: { extraParameter: 'dashboardsMenu' }
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditLineRoutingModule { }
