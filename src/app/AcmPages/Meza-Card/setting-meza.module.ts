import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/Layout/Components/page-title/page-title.module';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { SettingMezaRoutingModule } from './setting-meza-routing.module';
import { SettingMezaCardSendComponent } from './setting-meza-card-send/setting-meza-card-send.component';
import { SettingMezaCardActivateComponent } from './setting-meza-card-activate/setting-meza-card-activate.component';
import { SettingMezaCardComponent } from './setting-meza-card/setting-meza-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import {MatTabsModule} from '@angular/material/tabs';
import {FileUploadModule} from 'primeng/fileupload';

@NgModule({
  declarations: [
    SettingMezaCardComponent,
    SettingMezaCardActivateComponent,
    SettingMezaCardSendComponent,
  ],
  imports: [
    CommonModule,
    SettingMezaRoutingModule,
    PageTitleModule,
    TableModule,
    NgbModule,
    // Material
    MatTabsModule,
    FileUploadModule,
    // Other
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    FormsModule,
    JwBootstrapSwitchNg2Module,
    TranslateModule
  ],
  exports: []
})
export class  SettingMezaModule { }
