import { TopupRefinanceComponent } from './Loan-Application/loan-management/topup-refinance/topup-refinance.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { SelectDropDownModule } from 'ngx-select-dropdown';

// loan application
import { LoanApplicationRoutingModule } from './Loan-Application/loan-application-routing.module';
import { DashbordComponent } from './Loan-Application/dashbord/dashbord.component';
import { DabshbordTableComponent } from './Loan-Application/dashbord/dabshbord-table/dabshbord-table.component';
import { CompleteDataComponent } from './Loan-Application/complete-data/complete-data.component';
import { CustomerNotesComponent } from './Loan-Application/loan-approval/customer-notes/customer-notes.component';
import { LoanDetailsComponent } from './Loan-Application/loan-details/loan-details.component';
import { FieldVisitComponent } from './Loan-Application/field-visit/field-visit.component';
import { CheckCollateralComponent } from './Loan-Application/check-collateral/check-collateral.component';
import { FinancialAnalysisComponent } from './Loan-Application/financial-analysis/financial-analysis.component';
import { CheckGuarantorComponent } from './Loan-Application/check-guarantor/check-guarantor.component';
import { CustomerDecisionComponent } from './Loan-Application/customer-decision/customer-decision.component';
import { LoanApprovalComponent } from './Loan-Application/loan-approval/loan-approval.component';
import { LoanReviewComponent } from './Loan-Application/loan-review/loan-review.component';
import { GuarantorsStepComponent } from './Loan-Application/guarantors-step/guarantors-step.component';
import { CompleteDataLoanComponent } from './Loan-Application/complete-data-loan/complete-data-loan.component';
import { LoanProcessComponent } from './Loan-Application/loan-process/loan-process.component';
import { ScreeningStepComponent } from './Loan-Application/screening-step/screening-step.component';
import { GuarantorsDetailsComponent } from './Loan-Application/guarantors-step/guarantors-details/guarantors-details.component';
import { VisitReportComponent } from './Loan-Application/field-visit/filed-visit-details/visit-report.component';
import { ApprovalFieldVisitComponent } from './Loan-Application/loan-approval/approval-field-visit/approval-field-visit.component';
import { CustomerComponent } from './Loan-Application/customer/customer.component';
import { LoanManagementComponent } from './Loan-Application/loan-management/loan-management.component';
import { EditLoanComponent } from './Loan-Application/loan-management/edit-loan/edit-loan.component';
import { CustomerMembersComponent } from './Loan-Application/customer/customer-members/customer-members.component';
import { LoanInfoComponent } from './Loan-Application/loan-info/loan-info.component';
import { ScheduleComponent } from './Loan-Application/loan-schedule/schedule.component';
import { LoanCollateralsComponent } from './Loan-Application/check-collateral/loan-collaterals/loan-collaterals.component';
import { FinancialAnalysisDetailsComponent } from './Loan-Application/financial-analysis/financial-analysis-details/financial-analysis-details.component';
import { LoanGuarantorsComponent } from './Loan-Application/check-guarantor/loan-guarantors/loan-guarantors.component';
import { ScreeningComponent } from './Loan-Application/screening-step/screening/screening.component';
import { CustomerGroupeDashbordComponent } from './Loan-Application/customer-groupe/customer-groupe-dashbord/customer-groupe-dashbord.component';
import { UdfComponent } from './Loan-Application/udf/udf.component';
import { CustomerGroupeComponent } from './Loan-Application/customer-groupe/customer-groupe.component';
import { IssuedLoansComponent } from './Loan-Application/dashbord/issued-loans/issued-loans.component';
import { UnassingnedLoansComponent } from './Loan-Application/dashbord/unassingned-loans/unassingned-loans.component';
import { ExceptionRequestComponent } from './Loan-Application/dashbord/exception-request/exception-request.component';
import { ExceptionRequestTableComponent } from './Loan-Application/dashbord/exception-request/exception-request-table/exception-request-table.component';
import { UnassignedTableComponent } from './Loan-Application/dashbord/unassingned-loans/unassigned-table/unassigned-table.component';
// customer
import { CustomerEditComponent } from './Customer/customer-edit/customer-edit.component';
import { CustomerRoutingModule } from './Customer/customer-routing.module';
import { CustomerManagementComponent } from './Customer/customer-management/customer-management.component';
import { CustomerDisbursementComponent } from './Customer/customer-disbursement/customer-disbursement.component';
import { CustomerAddressComponent } from './Customer/customer-address/customer-address.component';
import { CustomerSearchComponent } from './Customer/customer-search/customer-search.component';
import { Customer360Component } from './Customer/customer360/customer360.component';
import { CustomerAccount360Component } from './Customer/customer-account-360/customer-account-360.component';
import { GuaranteesComponent } from './Customer/guarantees/guarantees.component';
import { MyLoanGuarantorsComponent } from './Customer/my-loan-guarantors/my-loan-guarantors.component';
import { CustomerDocumentComponent } from './Customer/customer-document/customer-document.component';
import { CustomerRelationshipComponent } from './Customer/customer-relationship/customer-relationship.component';
import { CustomerMessageComponent } from './Customer/customer-message/customer-message.component';
import { CustomerAnalyseComponent } from './Customer/customer-analyse/customer-analyse.component';
import { CustomerListComponent } from './Customer/customer-list/customer-list.component';
// ged
import { AddDocumentsProcessComponent } from './GED/add-documents-process/add-documents-process.component';
import { GedRoutingModule } from './GED/ged-routing.module';
import { UploadSignedAgreementComponent } from './GED/upload-signed-agreement/upload-signed-agreement.component';
import { ListDocumentsComponent } from './GED/list-documents/list-documents.component';
import { UploadDocumentComponent } from './GED/upload-document/upload-document.component';
import { AddDocumentGedComponent } from './GED/add-document-ged/add-document-ged.component';
import { FindDocumentComponent } from './GED/find-document/find-document.component';
// reporting
import { ReportingRoutingModule } from './Reporting/reporting-routing.module';
import { ReportsListComponent } from './Reporting/reports-list/reports-list.component';
// common
import { SharedModule } from 'src/app/shared/shared.module';
import { PageTitleModule } from 'src/app/Layout/Components/page-title/page-title.module';
import { CustomerMezaCardComponent } from './Customer/customer-meza-card/customer-meza-card.component';
import { CustomerMezaCardTableComponent } from './Customer/customer-meza-card/customer-meza-card-table/customer-meza-card-table.component';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MapsConfig } from '../shared/maps-config.service';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  CollateralStepDetailsComponent
} from './Loan-Application/check-collateral/collateral-step-details/collateral-step-details.component';
import { CalculatorComponent } from './Loan-Application/loan-management/calculator/calculator.component';
import { LoanCollectionDetailsComponent } from './Collection/table-collection/loan-collection-details/loan-collection-details.component';
import { CollectionComponent } from './Collection/collection/collection.component';
import { TableCollectionComponent } from './Collection/table-collection/table-collection/table-collection.component';
import { CollectionNoteComponent } from './Collection/collection-note/collection-note.component';
import { CollectionProcessComponent } from './Collection/collection-process/collection-process.component';
import { CustomerCollectionHistoryComponent } from './Collection/customer-collection-history/customer-collection-history.component';
import { SettingCollectionValidationComponent } from './Settings/setting-collection-validation/setting-collection-validation.component';
import { UnassignedCollectionComponent } from './Collection/unassigned-collection/unassigned-collection.component';
import { TableUnassignedCollectionsComponent } from './Collection/unassigned-collection/table-unassigned-collections/table-unassigned-collections.component';
import { CollectionsDocumentsComponent } from './Collection/collections-documents/collections-documents.component';
import { LoanLegalDetailsComponent } from './Collection/table-collection/loan-legal-details/loan-legal-details.component';
import { LegalParticipantsComponent } from './Collection/legal-participants/legal-participants.component';
import { ThirdPartySearchComponent } from './Collection/third-party-search/third-party-search.component';
import { ValidationApprovalComponent } from './Loan-Application/validation-approval/validation-approval.component';
import { EventTableModule } from './CRM/event-table/event-table.module';
import { SupplierAddComponent } from './Supplier/supplier-add/supplier-add.component';
import { AddAssetComponent } from './Supplier/add-asset/add-asset.component';
import { ListAssetComponent } from './Supplier/list-asset/list-asset.component';
import { UpdateAssetComponent } from './Supplier/update-asset/update-asset.component';
import { SupplierListComponent } from './Supplier/supplier-list/supplier-list.component';
import { SupplierInformationComponent } from './Supplier/supplier-information/supplier-information.component';
import { Supplier360Component } from './Supplier/supplier360/supplier360.component';
import { SupplierBusinessContributionComponent } from './Supplier/supplier-business-contribution/supplier-business-contribution.component';
import { ListConventionsComponent } from './Supplier/list-conventions/list-conventions.component';
import { ProspectManagementComponent } from './Customer/prospect-management/prospect-management.component';
import { LoanProviderArticleComponent } from './Loan-Application/loan-provider-article/loan-provider-article.component';
import { SupplierRoutingModule } from './Supplier/supplier-routing.module';

import { ConditionalApproveComponent } from './Loan-Application/conditional-approve/conditional-approve.component';
import { ConditionalApproveListComponent } from './Loan-Application/conditional-approve-list/conditional-approve-list.component';
import { ThirdPartyHitsoryComponent } from './Collection/third-party-hitsory/third-party-hitsory.component';
import { OtherInformationLoanComponent } from './Loan-Application/other-information-loan/other-information-loan.component';
import { SimulationLoanComponent } from './Simulation/simulation-loan/simulation-loan.component';
import { SimulationLoanRoutingModule } from './Simulation/simulation-loan/simulation-loan-routing.module';
import { ClaimsDashboardComponent } from './claims/claims-dashboard.component';
import { ClaimsTableComponent } from './claims/claims-table/claims-table.component';
import { ClaimDetailsComponent } from './claims/claim-details/claim-details.component';
import { CreditLineAddComponent } from './CreditLine/credit-line-add/credit-line-add.component';
import { CreditLineListComponent } from './CreditLine/credit-line-list/credit-line-list.component';
import { CreditLineRoutingModule } from './CreditLine/credit-line-routing.module';import { ChargeFeeStepComponent } from './Loan-Application/charge-fee-step/charge-fee-step.component';


import { CreateItemComponent } from './generic-workFlow/launch-work-flow-item/create-item.component';
import { GenericObjectRoutingModule } from './generic-workFlow/generic-workflow-routing.module';
import { GenericWfTableComponent } from './generic-workFlow/dashbord/generic-wf-table/generic-wf-table.component';
import { DashbordWfComponent } from './generic-workFlow/dashbord/dashbord-wf.component';
import { GenericWorkFlowScreenComponent } from './generic-workFlow/generic-work-flow-screen/generic-work-flow-screen.component';
import { ItemNoteComponent } from './generic-workFlow/generic-work-flow-screen/generic-wf-note/item-note.component';
import { ItemProcessComponent } from './generic-workFlow/item-process/item-process.component';
import { RiskLevelComponentComponent } from './generic-workFlow/generic-work-flow-screen/risk-level-component/risk-level-component.component';
import { UnassignedItemComponent } from './generic-workFlow/dashbord/unassigned-item/unassigned-item.component';
import { GenericWfUnassignedTableComponent } from './generic-workFlow/dashbord/unassigned-item/generic-wf-unassigned-table/generic-wf-unassigned-table.component';
import { CreditLineAccountComponent } from './CreditLine/credit-line-account/credit-line-account.component';
import { CreditLineReportsComponent } from './CreditLine/credit-line-reports/credit-line-reports.component';
import { NgxTvModule } from 'ngx-translation-validation';
import { TranslocoRootModule } from '../shared/transloco/transloco-root.module';;
import { LoanProspectionDetailsComponent } from './Collection/table-collection/loan-prospection-details/loan-prospection-details.component'
import { GenericWfStepComponent } from './Settings/generic-wf-step/generic-wf-step.component';
import { AmlInfoComponent } from './generic-workFlow/aml-screen/aml-info/aml-info.component';
import { SuspiciousTransactionsListComponent } from './generic-workFlow/aml-screen/suspicious-transactions-list/suspicious-transactions-list.component';
import { TransitionAccountComponent } from './Customer/transition-account/transition-account.component';

import { AmlProfileInformtionComponent } from './aml/Profile_Details/aml-profile-informtion/aml-profile-informtion.component';
import { AmlProfileDetailsComponent } from './aml/Profile_Details/aml-profile-details/aml-profile-details.component';
import { AmlProfileSanctionsReferencesComponent } from './aml/Profile_Details/aml-profile-sanctions-references/aml-profile-sanctions-references.component';
import { AmlProfileIdentityComponent } from './aml/Profile_Details/aml-profile-identity/aml-profile-identity.component';
import { AmlProfileFunctionComponent } from './aml/Profile_Details/aml-profile-function/aml-profile-function.component';
import { AmlProfileNoteComponent } from './aml/Profile_Details/aml-profile-note/aml-profile-note.component';
import { AmlProfileSourcesComponent } from './aml/Profile_Details/aml-profile-sources/aml-profile-sources.component';
import { AmlProfileDescriptionsComponent } from './aml/Profile_Details/aml-profile-descriptions/aml-profile-descriptions.component';
import { AmlWorkflowDetailsComponent } from './aml/Profile_Details/aml-workflow-details/aml-workflow-details.component';
import { AmlProfileDetailsPdfVersionComponent } from './aml/Profile_Details/aml-profile-details-pdf-version/aml-profile-details-pdf-version.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerReceiptsComponent } from './Customer/customer-receipts/customer-receipts.component';
import { BlacklistComponent } from './Blacklist/blacklist/blacklist.component';
import { BlacklistRoutingModule } from './Blacklist/blacklist-routing.module';
import { GlAccountComponent } from './chart-of-accounts/gl-account/gl-account.component';
import { ChartOfAccountsRoutingModule } from './chart-of-accounts/chart-of-accounts-routing.module';
import { CustomerTransactionsComponent } from './Customer/customer-transactions/customer-transactions.component';
import { ReceiptViewComponent } from './chart-of-accounts/receipt-view/receipt-view.component';
import { CoreReportingComponent } from './Reporting/core-reporting/core-reporting.component';
@NgModule({
  declarations: [
    DashbordComponent,
    DabshbordTableComponent,
    CompleteDataComponent,
    CustomerEditComponent,
    CustomerNotesComponent,
    LoanDetailsComponent,
    FieldVisitComponent,
    CheckCollateralComponent,
    FinancialAnalysisComponent,
    CheckGuarantorComponent,
    CustomerDecisionComponent,
    AddDocumentsProcessComponent,
    LoanApprovalComponent,
    UploadSignedAgreementComponent,
    LoanReviewComponent,
    CustomerGroupeComponent,
    GuarantorsStepComponent,
    CompleteDataLoanComponent,
    LoanProcessComponent,
    ScreeningStepComponent,
    CustomerManagementComponent,
    CustomerDisbursementComponent,
    CustomerAddressComponent,
    CustomerSearchComponent,
    GuarantorsDetailsComponent,
    VisitReportComponent,
    ApprovalFieldVisitComponent,
    CustomerComponent,
    LoanManagementComponent,
    Customer360Component,
    EditLoanComponent,
    TopupRefinanceComponent,
    CustomerMembersComponent,
    LoanInfoComponent,
    ScheduleComponent,
    LoanCollateralsComponent,
    FinancialAnalysisDetailsComponent,
    LoanGuarantorsComponent,
    ListDocumentsComponent,
    ScreeningComponent,
    UploadDocumentComponent,
    CustomerAnalyseComponent,
    CustomerGroupeDashbordComponent,
    UdfComponent,
    CustomerAccount360Component,
    GuaranteesComponent,
    MyLoanGuarantorsComponent,
    CustomerDocumentComponent,
    CustomerRelationshipComponent,
    CustomerMessageComponent,
    CustomerListComponent,
    AddDocumentGedComponent,
    FindDocumentComponent,
    ReportsListComponent,
    IssuedLoansComponent,
    UnassingnedLoansComponent,
    ExceptionRequestComponent,
    ExceptionRequestTableComponent,
    UnassignedTableComponent,
    CustomerMezaCardComponent,
    CustomerMezaCardTableComponent,
    CollateralStepDetailsComponent,
    CheckCollateralComponent,
    CalculatorComponent,
    LoanCollectionDetailsComponent,
    CollectionComponent,
    TableCollectionComponent,
    CollectionNoteComponent,
    CollectionProcessComponent,
    CustomerCollectionHistoryComponent,
    SettingCollectionValidationComponent,
    UnassignedCollectionComponent,
    TableUnassignedCollectionsComponent,
    CollectionsDocumentsComponent,
    LoanLegalDetailsComponent,
    LegalParticipantsComponent,
    ThirdPartySearchComponent,
    ValidationApprovalComponent,
    ProspectManagementComponent,
    LoanProviderArticleComponent,
    SupplierAddComponent,
    AddAssetComponent,
    ListAssetComponent,
    UpdateAssetComponent,
    SupplierListComponent,
    SupplierInformationComponent,
    Supplier360Component,
    SupplierBusinessContributionComponent,
    ListConventionsComponent,
    ConditionalApproveComponent,
    ConditionalApproveListComponent,
    ThirdPartyHitsoryComponent,
    OtherInformationLoanComponent,
    SimulationLoanComponent,
    CreateItemComponent,
    GenericWfTableComponent,
    DashbordWfComponent,
    GenericWorkFlowScreenComponent,
    ItemNoteComponent,
    ItemProcessComponent,
    RiskLevelComponentComponent,
    ClaimsDashboardComponent,
    ClaimsTableComponent,
    ClaimDetailsComponent,
    ChargeFeeStepComponent,
    CreditLineAddComponent,
    CreditLineListComponent,
    UnassignedItemComponent,
    GenericWfUnassignedTableComponent,
    CreditLineAccountComponent,
    LoanProspectionDetailsComponent,
    LoanProspectionDetailsComponent,
    CreditLineReportsComponent,
    GenericWfStepComponent,
    AmlInfoComponent,
    SuspiciousTransactionsListComponent,
    TransitionAccountComponent,
    AmlProfileInformtionComponent,
    AmlProfileDetailsComponent,
    AmlProfileSanctionsReferencesComponent,
    AmlProfileIdentityComponent,
    AmlProfileFunctionComponent,
    AmlProfileNoteComponent,
    AmlProfileSourcesComponent,
    AmlProfileDescriptionsComponent,
    AmlWorkflowDetailsComponent,
    AmlProfileDetailsPdfVersionComponent,
    CustomerReceiptsComponent,
    BlacklistComponent,
    GlAccountComponent,
    CustomerTransactionsComponent,
    ReceiptViewComponent,
    CoreReportingComponent
    ],
  imports: [
    MatProgressSpinnerModule , 
    CommonModule,
    SharedModule,
    PageTitleModule,
    TableModule,
    NgbModule,
    TranslateModule,
    LoanApplicationRoutingModule,
    SupplierRoutingModule,
    CreditLineRoutingModule,
    BlacklistRoutingModule,
    CustomerRoutingModule,
    ChartOfAccountsRoutingModule,
    GedRoutingModule,
    ReportingRoutingModule,
    // Material
    MatTabsModule,
    MatRadioModule,
    MatCheckboxModule,
    // Primeng
    AutoCompleteModule,
    DropdownModule,
    FileUploadModule,
    MultiSelectModule,
    SliderModule,
    // Other
    FontAwesomeModule,
    NgxHijriGregorianDatepickerModule,
    AngularEditorModule,
    PerfectScrollbarModule,
    RoundProgressModule,
    JwBootstrapSwitchNg2Module,
    SelectDropDownModule,
    SimulationLoanRoutingModule,
    GenericObjectRoutingModule,
    NgBootstrapFormValidationModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDuyRgJOBYn1vQtD1aVK_bGlgOFaxQb974',
      libraries: ['places']
    }),
    MatGridListModule,
    EventTableModule,
    TranslocoRootModule,
    NgxTvModule.forRoot({
      type: 'validation',
      invalidClass: 'invalid-input'
    })
  ],
  providers: [
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: MapsConfig
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports:[
    TableCollectionComponent,
    DabshbordTableComponent,
    CustomerListComponent,
    CollectionComponent
  ]
})
export class GenericModule { }
