import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/Layout/Components/page-title/page-title.module';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { OnlineApplicationRoutingModule } from './online-application-routing.module';
import { OnlineApplicationTableComponent } from './online-applications/online-application-table/online-application-table.component';
import { OnlineApplicationsInfoComponent } from './online-applications-info/online-applications-info.component';
import { OnlineApplicationsComponent } from './online-applications/online-applications.component';
import { OnlineApplicationAssignComponent } from './online-applications-assign/online-applications-assign.component';
import { NgxLoadingModule } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [
    OnlineApplicationAssignComponent,
    OnlineApplicationsComponent,
    OnlineApplicationsInfoComponent,
    OnlineApplicationTableComponent,
 ],
    imports: [
        CommonModule,
        OnlineApplicationRoutingModule,
        PageTitleModule,
        TableModule,
        NgbModule,
        NgxHijriGregorianDatepickerModule,
        // Material
        MatTabsModule,
        MatRadioModule,
        // Other
        ReactiveFormsModule,
        NgBootstrapFormValidationModule,
        FormsModule,
        JwBootstrapSwitchNg2Module,
        TranslateModule,
        NgxLoadingModule.forRoot({}),
        MatDividerModule,
    ],
  exports: []
})
export class  OnlineApplicationModule { }
