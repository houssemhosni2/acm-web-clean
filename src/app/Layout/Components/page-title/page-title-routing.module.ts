import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleComponent } from './page-title.component';

const routes: Routes = [
  {
    path: 'PageTitle',
    component: PageTitleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageTitleRoutingModule { }
