import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent,
                data: { extraParameter: '' }
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
                data: { extraParameter: '' }
            },
            {
                path: 'change-pwd', component: ChangePwdComponent,
                data: { extraParameter: '' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserPagesRoutingModule {
}
