import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { CalendarComponent } from './calendar/calendar.component';
import { TaskComponent } from './task/task.component';
import { ClaimsDashboardComponent } from '../claims/claims-dashboard.component';
import { ClaimDetailsComponent } from '../claims/claim-details/claim-details.component';
import { TaskListComponent } from './task-list/task-list.component';
import { ProspectionComponent } from './prospection/prospection.component';
import { UnassignedCollectionComponent } from '../Collection/unassigned-collection/unassigned-collection.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'task',
                canActivate: [AuthGuardService],
                component: TaskComponent
            },
            {
                path: 'calendar',
                canActivate: [AuthGuardService],
                component: CalendarComponent
            },
            {
              path: 'claims',
              canActivate: [AuthGuardService],
              component: ClaimsDashboardComponent
          },
          {
            path: 'claim-detail',
            canActivate: [AuthGuardService],
            component: ClaimDetailsComponent
          },
          {
            path: 'task-list',
            canActivate: [AuthGuardService],
            component: TaskListComponent
          },
          {
            path: 'prospection',
            canActivate: [AuthGuardService],
            component: ProspectionComponent
          }
          ,
          {
            path: 'unassigned-prospections',
            canActivate: [AuthGuardService],
            component: UnassignedCollectionComponent
          }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CrmRoutingModule {
}
