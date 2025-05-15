import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/Layout/Components/page-title/page-title.module';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { ExpensesSettingsComponent } from './expenses-settings/expenses-settings.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpensesInfoComponent } from './expenses-list/expenses-info/expenses-info.component';
import { ExpensesTableComponent } from './expenses-list/expenses-table/expenses-table.component';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import {MatTabsModule} from '@angular/material/tabs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    ExpensesSettingsComponent,
    ExpensesListComponent,
    ExpensesInfoComponent,
    ExpensesTableComponent,
 ],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    PageTitleModule,
    TableModule,
    // Material
    MatTabsModule,
    // Other
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    FormsModule,
    JwBootstrapSwitchNg2Module,
    TranslateModule,
    FontAwesomeModule
  ],
  exports: []
})
export class  ExpensesModule { }
