import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { OfflineRoutingModule } from './offline-routing.module';
import { PageTitleModule } from 'src/app/Layout/Components/page-title/page-title.module';
import { TranslateModule } from '@ngx-translate/core';
import { PreviewComponent } from './preview/preview.component';
import { SettingOfflineComponent } from './setting-offline/setting-offline.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GenericModule } from '../generic.module';



@NgModule({
  declarations: [
    OverviewComponent,
    PreviewComponent,
    SettingOfflineComponent
  ],
  imports: [
    CommonModule,
    OfflineRoutingModule,
    PageTitleModule,
    TranslateModule,
    ReactiveFormsModule,
    GenericModule
  ]
})
export class OfflineModule { }
