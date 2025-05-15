import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from 'src/app/shared/auth-guard.service';
import {AddDocumentGedComponent} from './add-document-ged/add-document-ged.component';
import {AddDocumentsProcessComponent} from './add-documents-process/add-documents-process.component';
import {FindDocumentComponent} from './find-document/find-document.component';
import {UploadSignedAgreementComponent} from './upload-signed-agreement/upload-signed-agreement.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'upload-document',
        canActivate: [AuthGuardService],
        component: AddDocumentsProcessComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'upload-signed-agreement',
        canActivate: [AuthGuardService],
        component: UploadSignedAgreementComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'add-document',
        canActivate: [AuthGuardService],
        component: AddDocumentGedComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'find-document',
        canActivate: [AuthGuardService],
        component: FindDocumentComponent,
        data: {extraParameter: 'dashboardsMenu'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GedRoutingModule {
}
