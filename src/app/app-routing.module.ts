import { OfflineModule } from './AcmPages/offline/offline.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulationLoanRoutingModule } from './AcmPages/Simulation/simulation-loan/simulation-loan-routing.module';
import { BaseLayoutComponent } from './Layout/base-layout/base-layout.component';
import { PagesLayoutComponent } from './Layout/pages-layout/pages-layout.component';
import { AppsLayoutComponent } from './Layout/apps-layout/apps-layout.component';
// AcmPages

import { NotFoundComponent } from './AcmPages/UserPages/not-found/not-found.component';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';
import { AuthGuardService } from './shared/auth-guard.service';
import { UnauthorizedComponent } from './AcmPages/UserPages/unauthorized/unauthorized.component';
import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
     {path: '', redirectTo: 'acm', pathMatch: 'full'},
      // module : Loan application / Customer / GED (Workflow)
      {
        path: 'acm',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/generic.module').then(m => m.GenericModule)
      },
      // Module : Analytics
      {
        path: 'analytics',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/Analytics/analytic/analytic.module').then(m => m.AnalyticsModule)
      },
      // Module : CRM
      {
        path: 'crm',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/CRM/crm.module').then(m => m.CrmModule)
      },
      // Module : Settings
      {
        path: 'settings',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/Settings/setting.module').then(m => m.SettingModule)
      },
      // Module : Expenses
      {
        path: 'expenses',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/Expenses/expenses.module').then(m => m.ExpensesModule)
      },
      // Module : Incentive
      {
        path: 'incentives',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/Incentive/incentive.module').then(m => m.IncentiveModule)
      },
      // Module : Online Applications
      {
        path: 'online-applications',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/Online application/online-application.module').then(m => m.OnlineApplicationModule)
      },
      // Module : Setting Meza
      {
        path: 'setting-meza',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/Meza-Card/setting-meza.module').then(m => m.SettingMezaModule)
      },
      {
        path: 'offline',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/offline/offline.module').then(m => m.OfflineModule)
      },
      {
        path: 'simulation-loan',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/Simulation/simulation-loan/simulation-loan-routing.module').then(m => m.SimulationLoanRoutingModule)
      },
      // Common Pages
      {
        path: 'not-found', component: NotFoundComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'unauthorized', component: UnauthorizedComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'notification', canActivate: [AuthGuardService], component: NotificationsComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },

    ]
  },
  {
    path: '',
    component: PagesLayoutComponent,
    children: [
      {
        path: '',
        data: { extraParameter: 'dashboardsMenu' },
        loadChildren: () => import('./AcmPages/UserPages/user-pages.module').then(m => m.UserPagesModule)
      }
    ]
  },
  {
    path: '',
    component: AppsLayoutComponent,
    children: [
    ]
  },
  { path: 'callback', component: CallbackComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
