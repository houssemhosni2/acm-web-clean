import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventTableComponent } from './event-table/event-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
@NgModule({
  declarations: [
    EventTableComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SelectDropDownModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgBootstrapFormValidationModule
  ],
  exports: [
    EventTableComponent
  ]
})
export class EventTableModule { }
