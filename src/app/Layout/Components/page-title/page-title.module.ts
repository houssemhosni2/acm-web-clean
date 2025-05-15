import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from './page-title.component';
import { PageTitleRoutingModule } from './page-title-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { TranslateModule } from '@ngx-translate/core';
import {DropdownModule} from 'primeng/dropdown';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TranslocoRootModule } from 'src/app/shared/transloco/transloco-root.module';
import { NgxTvModule } from 'ngx-translation-validation';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    PageTitleRoutingModule,
    DropdownModule,
    NgbModule,
    TranslateModule,
    AutoCompleteModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    SelectDropDownModule,
    TranslocoRootModule,
    NgxTvModule.forRoot({
      type: 'validation',
      invalidClass: 'invalid-input'
    })
  ],
  declarations: [PageTitleComponent],
  exports: [PageTitleComponent]
})
export class PageTitleModule { }
