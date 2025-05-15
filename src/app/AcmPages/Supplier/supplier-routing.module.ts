import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/auth-guard.service';
import { AddAssetComponent } from './add-asset/add-asset.component';
import { ListAssetComponent } from './list-asset/list-asset.component';
import { SupplierAddComponent } from './supplier-add/supplier-add.component';
import { UpdateAssetComponent } from './update-asset/update-asset.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { Supplier360Component } from './supplier360/supplier360.component';
import { SupplierInformationComponent } from './supplier-information/supplier-information.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'supplier-add',
        canActivate: [AuthGuardService],
        component: SupplierAddComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'add-asset',
        canActivate: [AuthGuardService],
        component: AddAssetComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'list-asset',
        canActivate: [AuthGuardService],
        component: ListAssetComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'update-asset',
        /*canActivate: [AuthGuardService],*/
        component: UpdateAssetComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'supplier-360-details',
        canActivate: [AuthGuardService],
        component: Supplier360Component ,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'supplier-360', component: SupplierListComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'supplier-list',
        canActivate: [AuthGuardService],
        component: SupplierListComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'supplier-information',
        canActivate: [AuthGuardService],
        component: SupplierInformationComponent,
        data: { extraParameter: 'dashboardsMenu' }
      }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule {
}
