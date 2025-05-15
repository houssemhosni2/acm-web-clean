import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';

import { ExpensesInfoComponent } from './expenses-list/expenses-info/expenses-info.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpensesSettingsComponent } from './expenses-settings/expenses-settings.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'expenses-settings',
        canActivate: [AuthGuardService],
        component: ExpensesSettingsComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'expenses-list',
        canActivate: [AuthGuardService],
        component: ExpensesListComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'expenses-info',
        canActivate: [AuthGuardService],
        component: ExpensesInfoComponent,
        data: { extraParameter: 'dashboardsMenu' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule {
}
