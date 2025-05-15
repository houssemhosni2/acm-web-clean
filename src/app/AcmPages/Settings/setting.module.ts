import { SettingTopupProductComponent } from './setting-topup-product/setting-topup-product.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting/setting.component';
import { SettingProductConfigurationComponent } from './setting-product-configuration/setting-product-configuration.component';
import { GuarantorCollateralComponent } from './guarantor-collateral/guarantor-collateral.component';
import { SettingIscoreAmlComponent } from './setting-iscore-aml/setting-iscore-aml.component';
import { SettingLevelProcessComponent } from './setting-level-process/setting-level-process.component';
import { SettingDocumentTypeProductComponent } from './setting-document-type-product/setting-document-type-product.component';
import { SettingNotificationComponent } from './setting-notification/setting-notification.component';
import { MotifsRejetComponent } from './motifs-rejet/motifs-rejet.component';
import { EnvironmentComponent } from './environment/environment.component';
import { SettingLevelComponent } from './setting-level/setting-level.component';
import { SettingResetDataComponent } from './setting-reset-data/setting-reset-data.component';
import { SettingClientComponent } from './setting-client/setting-client.component';
import { RenewalConditionSettingsComponent } from './renewal-condition-settings/renewal-condition-settings.component';
import { SettingFieldComponent } from './setting-field/setting-field.component';
import { SettingAmlComponent } from './setting-aml/setting-aml.component';
import { SettingDocumentTypeComponent } from './setting-document-type/setting-document-type.component';
import { SettingUsersComponent } from './setting-users/setting-users.component';
import { HabilitationComponent } from './habilitation/habilitation.component';
import { GroupeComponent } from './groupe/groupe.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { IScoreComponent } from './i-score/i-score.component';
import { PageTitleModule } from 'src/app/Layout/Components/page-title/page-title.module';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import {FileUploadModule} from 'primeng/fileupload';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SettingThirdPartyComponent } from './setting-third-party/setting-third-party.component';
import { JournalEntryTypeComponent } from './journal-entry-type/journal-entry-type.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SettingTopupStepComponent } from './setting-level-process/setting-topup-step/setting-topup-step.component';
import { SettingLoanStepsComponent } from './setting-level-process/setting-loan-steps/setting-loan-steps.component';
import { SettingCollectionStepsComponent } from './setting-level-process/setting-collection-steps/setting-collection-steps.component';
import { SettingLegalCollectionStepsComponent } from './setting-level-process/setting-legal-collection-steps/setting-legal-collection-steps.component';
import { SettingSystemLicenceComponent } from './setting-system-license/setting-system-licence.component';
import { AddSettingThirdPartyComponent } from './setting-third-party/add-setting-third-party/add-setting-third-party.component';
import { SettingSynchronizeCalendarComponent } from './setting-synchronize-calendar/setting-synchronize-calendar.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { SettingUdfComponent } from './setting-udf/setting-udf.component';
import { AccordionModule } from 'primeng/accordion';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { UdfStepWorkflowSettingComponent } from './udf-step-workflow-setting/udf-step-workflow-setting.component';
import { AppSettingGenericWorkflowComponent } from './setting-generic-workflow/app-setting-generic-workflow.component';
import { SettingTypeRiskComponent } from './setting-type-risk/setting-type-risk.component';
import { ClaimsCustomerComponent } from './claims-customer/claims-customer.component';
import { SettingSMSComponent } from './setting-sms/setting-sms.component';
import { ProductFiltersComponent } from './product-filters/product-filters.component';
import { ChargeFeeComponent } from './charge-fee/charge-fee.component';
import { ProductEligibilityComponent } from './product-eligibility/product-eligibility.component';
import { NgxTvModule } from 'ngx-translation-validation';
import { TranslocoRootModule } from '../../shared/transloco/transloco-root.module';
import { GenericWfSettingWorkflowComponent } from './generic-wf-setting-workflow/generic-wf-setting-workflow.component';
import { SettingProspectionStepsComponent } from './setting-level-process/setting-prospection-steps/setting-prospection-steps.component';
import { CustomerSettingComponent } from './customer-setting/customer-setting.component';
import { AprSettingComponent } from './apr-setting/apr-setting.component';
import { SettingAmlCheckAndDoutfulTxComponent } from './setting-aml-check-and-doubtful-tx/setting-aml-check-and-doubtful-tx.component';
import { ProductGuaranteeComponent } from './product-guarantee/product-guarantee.component';
import { SettingWorkflowStepConditionsComponent } from './setting-workflow-step-conditions/setting-workflow-step-conditions.component';
import { SettingBlacklistComponent } from './setting-blacklist/setting-blacklist.component';
import { CurrencySettingComponent } from './currency-setting/currency-setting.component';
import { ClosedDaysSettingComponent } from './closed-days-setting/closed-days-setting.component';
import { HolidaysSettingComponent } from './holidays-setting/holidays-setting.component';
import { CalendarModule } from 'primeng/calendar';
import { ProductCurrencySettingComponent } from './product-currency-setting/product-currency-setting.component';
import { BranchesSettingComponent } from './branches-setting/branches-setting.component';
import { FinancialCategorySettingComponent } from './financial-category-setting/financial-category-setting.component';
import { PaymentPrioritySettingComponent } from './payment-priority-setting/payment-priority-setting.component';
import { SettingAddressComponent } from './setting-address/setting-address.component';
import { SettingProductGeneralConfigComponent } from './setting-product-general-configuration/setting-product-general-configuration.component';
import { SettingDocumentProductCreationComponent } from './setting-document-product-creation/setting-document-product-creation.component';
import { SettingListComponent } from './setting-list/setting-list.component';
import { CoreReportingSettingComponent } from './core-reporting-setting/core-reporting-setting.component';
@NgModule({
  declarations: [
    SettingComponent,
    SettingAmlComponent,
    SettingProductConfigurationComponent,
    GuarantorCollateralComponent,
    SettingIscoreAmlComponent,
    SettingLevelProcessComponent,
    SettingDocumentTypeProductComponent,
    SettingNotificationComponent,
    MotifsRejetComponent,
    EnvironmentComponent,
    SettingLevelComponent,
    SettingResetDataComponent,
    SettingClientComponent,
    RenewalConditionSettingsComponent,
    SettingFieldComponent,
    SettingDocumentTypeComponent,
    HabilitationComponent,
    SettingUsersComponent,
    GroupeComponent,
    IScoreComponent,
    SettingThirdPartyComponent,
    SettingTopupProductComponent,
    JournalEntryTypeComponent,
    SettingTopupStepComponent,
    SettingLoanStepsComponent,
    SettingCollectionStepsComponent,
    SettingLegalCollectionStepsComponent,
    SettingSystemLicenceComponent,
    AddSettingThirdPartyComponent,
    SettingSynchronizeCalendarComponent,
    SettingUdfComponent,
    UdfStepWorkflowSettingComponent,
    AppSettingGenericWorkflowComponent,
    SettingTypeRiskComponent,
    ClaimsCustomerComponent,
    SettingSMSComponent,
    ProductFiltersComponent,
    ChargeFeeComponent,
    ProductEligibilityComponent,
    GenericWfSettingWorkflowComponent,
    SettingProspectionStepsComponent,
    SettingAmlCheckAndDoutfulTxComponent,
    CustomerSettingComponent,
    AprSettingComponent,
    ProductGuaranteeComponent,
    SettingWorkflowStepConditionsComponent,
    SettingBlacklistComponent,
    CurrencySettingComponent,
    ClosedDaysSettingComponent,
    HolidaysSettingComponent,
    ProductCurrencySettingComponent,
    BranchesSettingComponent,
    FinancialCategorySettingComponent,
    PaymentPrioritySettingComponent,
    SettingAddressComponent,
    SettingListComponent,
    CoreReportingSettingComponent,
    SettingProductGeneralConfigComponent,
    SettingDocumentProductCreationComponent
 ],
    imports: [
        CommonModule,
        SettingRoutingModule,
        PageTitleModule,
        TableModule,
        NgbModule,
        SharedModule,
        // Material
        MatTabsModule,
        MatRadioModule,
        MatCheckboxModule,
        // Primeng
        FileUploadModule,
        // Other
        ReactiveFormsModule,
        NgBootstrapFormValidationModule,
        FontAwesomeModule,
        JwBootstrapSwitchNg2Module,
        FormsModule,
        AutoCompleteModule,
        PerfectScrollbarModule,
        SelectDropDownModule,
        NgxLoadingModule.forRoot({}),
        TranslateModule,
        DragDropModule,
        MultiSelectModule,
        AccordionModule,
        DropdownModule,
        ToggleButtonModule,
        TranslocoRootModule,
        NgxTvModule.forRoot({
          type: 'validation',
          invalidClass: 'invalid-input'
        }),
        CalendarModule
    ],
  exports: [SettingComponent]
})
export class  SettingModule { }
