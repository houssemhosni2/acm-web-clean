import { SettingThirdPartyComponent } from './setting-third-party/setting-third-party.component';
import { UploadItemComponent } from './../GED/upload-item/upload-item.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { SettingAmlComponent } from './setting-aml/setting-aml.component';
import { SettingComponent } from './setting/setting.component';
import { AddSettingThirdPartyComponent } from './setting-third-party/add-setting-third-party/add-setting-third-party.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'setting',
        canActivate: [AuthGuardService],
        component: SettingComponent,
        data: { extraParameter: 'dashboardsMenu' }
      }
      ,
      {
        path: 'setting-aml',
        canActivate: [AuthGuardService], component: SettingAmlComponent,
        data: { extraParameter: 'dashboardsMenu' }
      }

      ,
      {
        path: 'upload',
      /*  canActivate: [AuthGuardService],*/ component: UploadItemComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'setting-third-party',
        canActivate: [AuthGuardService], component: SettingThirdPartyComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'add-setting-third-party',
        canActivate: [AuthGuardService], component: AddSettingThirdPartyComponent,
        data: { extraParameter: 'dashboardsMenu' }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule {
}
