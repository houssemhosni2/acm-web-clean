import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { GlAccountComponent } from './gl-account/gl-account.component';
import { ReceiptViewComponent } from './receipt-view/receipt-view.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'gl-accounts',
                canActivate: [AuthGuardService],
                component: GlAccountComponent,
                data: { extraParameter: 'dashboardsMenu' }
            },
            {
                path: 'receipt-view',
                canActivate: [AuthGuardService],
                component: ReceiptViewComponent,
                data: { extraParameter: 'dashboardsMenu' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ChartOfAccountsRoutingModule { }