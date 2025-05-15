import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { OnlineApplicationAssignComponent } from './online-applications-assign/online-applications-assign.component';
import { OnlineApplicationsInfoComponent } from './online-applications-info/online-applications-info.component';
import { OnlineApplicationsComponent } from './online-applications/online-applications.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'loan-assign', canActivate: [AuthGuardService], component: OnlineApplicationAssignComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'online-application', canActivate: [AuthGuardService], component: OnlineApplicationsComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'online-application-info', canActivate: [AuthGuardService], component: OnlineApplicationsInfoComponent,
        data: { extraParameter: 'dashboardsMenu' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineApplicationRoutingModule {
}
