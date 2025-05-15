import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { UserPagesRoutingModule } from './user-pages-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ChangePwdComponent
 ],
  imports: [
    CommonModule,
    UserPagesRoutingModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    FormsModule,
    TranslateModule,
    NgxLoadingModule.forRoot({}),
  ],
  exports: []
})
export class  UserPagesModule { }
