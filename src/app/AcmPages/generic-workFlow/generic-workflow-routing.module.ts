import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { CreateItemComponent } from './launch-work-flow-item/create-item.component';
import { DashbordWfComponent } from './dashbord/dashbord-wf.component';
import { GenericWorkFlowScreenComponent } from './generic-work-flow-screen/generic-work-flow-screen.component';
import { UnassignedItemComponent } from './dashbord/unassigned-item/unassigned-item.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'create-item',
        //  canActivate: [AuthGuardService],
          component: CreateItemComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'generic-wf-dashbord',
          canActivate: [AuthGuardService],
          component: DashbordWfComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },

      {
        path: 'generic-wf-screen',
         canActivate: [AuthGuardService],
          component: GenericWorkFlowScreenComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'unassigned-wf',
          canActivate: [AuthGuardService],
          component: UnassignedItemComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenericObjectRoutingModule {
}
