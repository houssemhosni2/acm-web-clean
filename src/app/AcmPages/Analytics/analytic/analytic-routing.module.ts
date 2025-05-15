import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { AnalyticComponent } from './analytic.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuardService],
        component: AnalyticComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnalyticRoutingModule {
}
