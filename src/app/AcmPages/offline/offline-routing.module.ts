import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { OverviewComponent } from './overview/overview.component';
import { PreviewComponent } from './preview/preview.component';
import { SettingOfflineComponent } from './setting-offline/setting-offline.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'overview',
       canActivate: [AuthGuardService],
        component: OverviewComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'preview',
       canActivate: [AuthGuardService],
        component: PreviewComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'setting-offline',
       canActivate: [AuthGuardService],
        component: SettingOfflineComponent,
        data: { extraParameter: 'dashboardsMenu' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineRoutingModule {
}
