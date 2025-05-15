import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/Layout/Components/page-title/page-title.module';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { IncentiveRoutingModule } from './incentive-routing.module';
import { RunIncentiveComponent } from './run-incentive/run-incentive.component';
import { IssuanceRepaymentIncentivesComponent } from './issuance-repayment-incentives/issuance-repayment-incentives.component';
import { RegistrationIncentivesComponent } from './registration-incentives/registration-incentives.component';
import { OperationIncentivesComponent } from './operation-incentives/operation-incentives.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';

@NgModule({
  declarations: [
    RunIncentiveComponent,
    IssuanceRepaymentIncentivesComponent,
    RegistrationIncentivesComponent,
    OperationIncentivesComponent
 ],
  imports: [
    CommonModule,
    IncentiveRoutingModule,
    PageTitleModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    FormsModule,
    JwBootstrapSwitchNg2Module,
    TranslateModule
  ],
  exports: []
})
export class  IncentiveModule { }
