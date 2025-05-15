import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SimulationLoanComponent } from './simulation-loan.component';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'simulation-loan',
        component : SimulationLoanComponent,
         canActivate: [AuthGuardService],
        data: { extraParameter: 'dashboardsMenu' }
       }  ]
      }
    ];


      @NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
      })
export class SimulationLoanRoutingModule { }
