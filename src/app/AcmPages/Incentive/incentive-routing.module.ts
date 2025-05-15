import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { IssuanceRepaymentIncentivesComponent } from './issuance-repayment-incentives/issuance-repayment-incentives.component';
import { OperationIncentivesComponent } from './operation-incentives/operation-incentives.component';
import { RegistrationIncentivesComponent } from './registration-incentives/registration-incentives.component';
import { RunIncentiveComponent } from './run-incentive/run-incentive.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'run-incentive', canActivate: [AuthGuardService], component: RunIncentiveComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'issuance-repayment-incentives', canActivate: [AuthGuardService], component: IssuanceRepaymentIncentivesComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'registration-incentive', canActivate: [AuthGuardService], component: RegistrationIncentivesComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'operations-incentives', canActivate: [AuthGuardService], component: OperationIncentivesComponent,
        data: { extraParameter: 'dashboardsMenu' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncentiveRoutingModule {
}
