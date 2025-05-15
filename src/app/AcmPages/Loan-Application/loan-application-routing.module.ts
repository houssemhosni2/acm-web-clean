import { ValidationApprovalComponent } from './validation-approval/validation-approval.component';
import { LoanProviderArticleComponent } from './loan-provider-article/loan-provider-article.component';
import { TopupRefinanceComponent } from './loan-management/topup-refinance/topup-refinance.component';
import { LoanLegalDetailsComponent } from './../Collection/table-collection/loan-legal-details/loan-legal-details.component';
import { CollectionsDocumentsComponent } from './../Collection/collections-documents/collections-documents.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from 'src/app/shared/auth-guard.service';
import {CompleteDataComponent} from './complete-data/complete-data.component';
import {FieldVisitComponent} from './field-visit/field-visit.component';
import {DashbordComponent} from './dashbord/dashbord.component';
import {CheckCollateralComponent} from './check-collateral/check-collateral.component';
import {FinancialAnalysisComponent} from './financial-analysis/financial-analysis.component';
import {CustomerDecisionComponent} from './customer-decision/customer-decision.component';
import {LoanApprovalComponent} from './loan-approval/loan-approval.component';
import {LoanReviewComponent} from './loan-review/loan-review.component';
import {CustomerGroupeComponent} from './customer-groupe/customer-groupe.component';
import {GuarantorsStepComponent} from './guarantors-step/guarantors-step.component';
import {CompleteDataLoanComponent} from './complete-data-loan/complete-data-loan.component';
import {ScreeningStepComponent} from './screening-step/screening-step.component';
import {LoanManagementComponent} from './loan-management/loan-management.component';
import {IssuedLoansComponent} from './dashbord/issued-loans/issued-loans.component';
import {UnassingnedLoansComponent} from './dashbord/unassingned-loans/unassingned-loans.component';
import {ExceptionRequestComponent} from './dashbord/exception-request/exception-request.component';
import {
  CollateralStepDetailsComponent
} from './check-collateral/collateral-step-details/collateral-step-details.component';
import { LoanCollectionDetailsComponent } from '../Collection/table-collection/loan-collection-details/loan-collection-details.component';
import { CollectionComponent } from '../Collection/collection/collection.component';
import { UnassignedCollectionComponent } from '../Collection/unassigned-collection/unassigned-collection.component';
import { LegalParticipantsComponent } from '../Collection/legal-participants/legal-participants.component';
import { ThirdPartySearchComponent } from '../Collection/third-party-search/third-party-search.component';
import { CustomerCollectionHistoryComponent } from '../Collection/customer-collection-history/customer-collection-history.component';
import { ThirdPartyHitsoryComponent } from '../Collection/third-party-hitsory/third-party-hitsory.component';
import { LoanProspectionDetailsComponent } from '../Collection/table-collection/loan-prospection-details/loan-prospection-details.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        canActivate: [AuthGuardService],
        component: DashbordComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {

        path: 'loan-details',
        canActivate: [AuthGuardService],
        component: CompleteDataComponent,
        data: {extraParameter: 'dashboardsMenu'}

      },
      {
        path: 'field-visit',
        canActivate: [AuthGuardService],
        component: FieldVisitComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'check-collateral',
        canActivate: [AuthGuardService],
        component: CheckCollateralComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'financial-analysis',
        canActivate: [AuthGuardService],
        component: FinancialAnalysisComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'customer-decision',
        canActivate: [AuthGuardService],
        component: CustomerDecisionComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'loan-approval',
        canActivate: [AuthGuardService],
        component: LoanApprovalComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'loan-review',
        canActivate: [AuthGuardService],
        component: LoanReviewComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'customer-groupe',
        canActivate: [AuthGuardService],
        component: CustomerGroupeComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'check-guarantor',
        canActivate: [AuthGuardService],
        component: GuarantorsStepComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'guarantors',
        canActivate: [AuthGuardService],
        component: GuarantorsStepComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'complete-loan-details',
        canActivate: [AuthGuardService],
        component: CompleteDataLoanComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'screening',
        canActivate: [AuthGuardService],
        component: ScreeningStepComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'loan-management',
        canActivate: [AuthGuardService],
        component: LoanManagementComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'issued-loans',
        canActivate: [AuthGuardService],
        component: IssuedLoansComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'unassigned-loans',
        canActivate: [AuthGuardService],
        component: UnassingnedLoansComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'exception-request',
        canActivate: [AuthGuardService],
        component: ExceptionRequestComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'collateral-step-details', canActivate: [AuthGuardService], component: CollateralStepDetailsComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
       path: 'collections',  canActivate: [AuthGuardService], component: CollectionComponent,
       data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'legal',  canActivate: [AuthGuardService], component: CollectionComponent,
        data: { extraParameter: 'dashboardsMenu' }
       },
      {
       path: 'loan-collection-details', canActivate: [AuthGuardService],component: LoanCollectionDetailsComponent,
       data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'loan-legal-details', canActivate: [AuthGuardService],component: LoanLegalDetailsComponent,
        data: { extraParameter: 'dashboardsMenu' }
       },
      {
        path: 'unassigned-collections',
        canActivate: [AuthGuardService],
        component: UnassignedCollectionComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'unassigned-legal',
        canActivate: [AuthGuardService],
        component: UnassignedCollectionComponent,
        data: {extraParameter: 'dashboardsMenu'}
      },
      {
        path: 'collections-documents', /*canActivate: [AuthGuardService],*/component: CollectionsDocumentsComponent,
        data: { extraParameter: 'dashboardsMenu' }
       },
       {
        path: 'participants-legal-details', canActivate: [AuthGuardService],component: LegalParticipantsComponent,
        data: { extraParameter: 'dashboardsMenu' }
       },
       {
        path: 'third-party-search', canActivate: [AuthGuardService],component: ThirdPartySearchComponent,
        data: { extraParameter: 'dashboardsMenu' }
       },
       {
         path: 'collection-history', canActivate: [AuthGuardService], component: CustomerCollectionHistoryComponent,
         data: { extraParameter: 'dashboardsMenu' }
       },
       {
        path: 'topup-refinance-loan', canActivate: [AuthGuardService], component: TopupRefinanceComponent,
        data: { extraParameter: 'dashboardsMenu' }
      },
      {
        path: 'validation-approval',
        canActivate: [AuthGuardService],
        component: ValidationApprovalComponent,
        data: {extraParameter: 'dashboardsMenu'}

      },
      {
       path: 'loan-provider-article',canActivate: [AuthGuardService], component: LoanProviderArticleComponent,
       data: { extraParameter: 'dashboardsMenu' }
     },
     {
      path: 'third-party-history', canActivate: [AuthGuardService],component: ThirdPartyHitsoryComponent,
      data: { extraParameter: 'dashboardsMenu' }
     },
     {
       path: 'loan-prospection-details',
        canActivate: [AuthGuardService],
       component: LoanProspectionDetailsComponent,
       data: { extraParameter: 'dashboardsMenu' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanApplicationRoutingModule {
}
