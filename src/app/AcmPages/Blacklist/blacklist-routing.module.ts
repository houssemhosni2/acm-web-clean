import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { BlacklistComponent } from './blacklist/blacklist.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'blacklist',
        canActivate: [AuthGuardService],
        component: BlacklistComponent,
        data: { extraParameter: 'dashboardsMenu' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlacklistRoutingModule { }
