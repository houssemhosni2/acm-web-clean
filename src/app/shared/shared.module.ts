import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { BaseLayoutComponent } from '../Layout/base-layout/base-layout.component';
import { HeaderComponent } from '../Layout/Components/header/header.component';
import { SidebarComponent } from '../Layout/Components/sidebar/sidebar.component';
import { FooterComponent } from '../Layout/Components/footer/footer.component';
import { DotsComponent } from '../Layout/Components/header/elements/dots/dots.component';
import { UserBoxComponent } from '../Layout/Components/header/elements/user-box/user-box.component';
import { AppsLayoutComponent } from '../Layout/apps-layout/apps-layout.component';
import { OptionsDrawerComponent } from '../ThemeOptions/options-drawer/options-drawer.component';
import { DrawerComponent } from '../Layout/Components/header/elements/drawer/drawer.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UploadItemComponent } from '../AcmPages/GED/upload-item/upload-item.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { UdfStepWorkflowComponent } from '../AcmPages/Loan-Application/udf-step-workflow/udf-step-workflow.component';
import { GenericWorkFlowDocumentComponent } from '../AcmPages/generic-workFlow/generic-work-flow-screen/generic-workFlow-document/generic-workFlow-document.component';

@NgModule({
  declarations: [
    LoaderComponent,
    BaseLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DotsComponent,
    UserBoxComponent,
    AppsLayoutComponent,
    OptionsDrawerComponent,
    DrawerComponent,
    ConfirmationDialogComponent,
    UploadItemComponent,
    UdfStepWorkflowComponent,
    GenericWorkFlowDocumentComponent
  ],
    imports: [
        CommonModule,
        TranslateModule,
        HttpClientModule,
        NgCircleProgressModule.forRoot({
          // set defaults here
          radius: 100,
          outerStrokeWidth: 16,
          innerStrokeWidth: 8,
          outerStrokeColor: "#2fb9a1",
          innerStrokeColor: "#2fb9a1",
          animationDuration: 300,
        }),
        FormsModule,
        ReactiveFormsModule,
        NgBootstrapFormValidationModule,
        // Material
        MatCheckboxModule,
        MatDialogModule,
        LoadingBarRouterModule,
        FontAwesomeModule,
        PerfectScrollbarModule,
        NgbModule,
        MatProgressSpinnerModule,
        MatProgressBarModule
    ],
  entryComponents: [
    ConfirmationDialogComponent,
    UploadItemComponent
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    UploadItemComponent,
    UdfStepWorkflowComponent,
    GenericWorkFlowDocumentComponent
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = message;
  }
}

export const isValidDate = (c: FormControl): ValidationErrors | null => {
  const today = new Date();
  const dateCheckout = new Date(c.value);
  if (dateCheckout > today) {
    return new ValidationError('futurDate');
  }
  return null;
};
