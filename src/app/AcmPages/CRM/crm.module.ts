import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmRoutingModule } from './crm-routing.module';
import { TaskComponent } from './task/task.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PageTitleModule } from 'src/app/Layout/Components/page-title/page-title.module';
import { TranslateModule } from '@ngx-translate/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxLoadingModule } from 'ngx-loading';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { faCoffee, fas } from '@fortawesome/free-solid-svg-icons';
import { MatRadioModule } from '@angular/material/radio';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { TaskListComponent } from './task-list/task-list.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { ProspectionComponent } from './prospection/prospection.component';
import { MatTabsModule } from '@angular/material/tabs';
import { GenericModule } from '../generic.module';
import { NgxTvModule } from 'ngx-translation-validation';
import { TranslocoRootModule } from '../../shared/transloco/transloco-root.module';
@NgModule({
  declarations: [TaskComponent, CalendarComponent, TaskListComponent, ProspectionComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    CrmRoutingModule,
    PageTitleModule,
    FontAwesomeModule,
    AutoCompleteModule,
    NgxLoadingModule.forRoot({}),
    NgMultiSelectDropDownModule.forRoot(),
    PerfectScrollbarModule,
    ReactiveFormsModule,
    SelectDropDownModule,
    NgBootstrapFormValidationModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    TranslateModule,
    TableModule,
    AutoCompleteModule,
    DropdownModule,
    MultiSelectModule,
    SliderModule,
    FormsModule,
    MatTabsModule,
    GenericModule,
    TranslocoRootModule,
    NgxTvModule.forRoot({
      type: 'validation',
      invalidClass: 'invalid-input'
    })
  ],
  exports: [CalendarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmModule {

  constructor(public library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faCoffee);
  }
}
