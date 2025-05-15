import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { SettingMezaCardSendComponent } from './setting-meza-card-send/setting-meza-card-send.component';
import { SettingMezaCardComponent } from './setting-meza-card/setting-meza-card.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'setting-meza-card',
        canActivate: [AuthGuardService],
        component: SettingMezaCardComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'activate-meza-card',
        canActivate: [AuthGuardService],
        component: SettingMezaCardSendComponent,
        data: { extraParameter: 'dashboardsMenu' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingMezaRoutingModule {
}
