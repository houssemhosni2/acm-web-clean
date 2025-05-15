import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { CustomerMessageComponent } from './customer-message/customer-message.component';
import { CustomerMezaCardComponent } from './customer-meza-card/customer-meza-card.component';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { Customer360Component } from './customer360/customer360.component';
import { ProspectManagementComponent } from './prospect-management/prospect-management.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'customer-edit',
        canActivate: [AuthGuardService],
        component: CustomerEditComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'customer-management',
        canActivate: [AuthGuardService],
        component: CustomerManagementComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'search',
        canActivate: [AuthGuardService],
        component: CustomerSearchComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'customer-360-details',
        canActivate: [AuthGuardService],
        component: Customer360Component,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'customer-message',
        canActivate: [AuthGuardService],
        component: CustomerMessageComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'customer-360', canActivate: [AuthGuardService], component: CustomerListComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'customer-edit-menu', canActivate: [AuthGuardService], component: CustomerListComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'customer-list', canActivate: [AuthGuardService], component: CustomerListComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },

      {
        path: 'customer-aml-check', canActivate: [AuthGuardService], component: CustomerListComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'meza-card-check', canActivate: [AuthGuardService], component: CustomerMezaCardComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'prospect-management', canActivate: [AuthGuardService],component: ProspectManagementComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'list-prospect', canActivate: [AuthGuardService], component: CustomerListComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
