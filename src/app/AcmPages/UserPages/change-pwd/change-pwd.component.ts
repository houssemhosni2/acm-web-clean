import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.sass']
})
export class ChangePwdComponent implements OnInit {
  public changePwdForm: FormGroup;
  public userConnected: UserEntity = new UserEntity();
  public fieldTextTypeOldPwd = false;
  public fieldTextTypeNewPwd = false;
  public fieldTextTypeConfirmPwd = false;
  public error = '';
  /**
   * constructor
   * @param authService AuthentificationService
   * @param router Router
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   * @param devToolsServices AcmDevToolsServices
   * @param loanSharedService SharedService
   * @param modalService NgbModal
   */
  constructor(public authService: AuthentificationService, public router: Router, public formBuilder: FormBuilder,
              public translate: TranslateService,
              public devToolsServices: AcmDevToolsServices, public loanSharedService: SharedService,
              public modalService: NgbModal) {
  }

  ngOnInit() {
    this.userConnected = this.loanSharedService.getUser();
    this.createFormChangePwd();
  }

  /**
   * Methode to create form Decline
   */
  createFormChangePwd() {
    this.changePwdForm = this.formBuilder.group({
      oldPwd: ['', Validators.required],
      newPwd: ['', Validators.required],
      confirmationPwd: ['', Validators.required]
    });
  }

  /**
   * changePwd()
   */
  async changePwd() {
    if (this.changePwdForm.valid) {
      if (this.changePwdForm.value.newPwd !== this.changePwdForm.value.confirmationPwd) {
        this.changePwdForm.controls.confirmationPwd.setValidators([Validators.required]);
        this.devToolsServices.openToast(3, 'alert.pwd_not_confirm');
      } else {
        this.userConnected.pwd = this.changePwdForm.value.oldPwd;
        this.userConnected.pwdNew = this.changePwdForm.value.newPwd;
        this.userConnected.pwdConfirm = this.changePwdForm.value.confirmationPwd;
        try {
              await this.authService.changePwd(this.userConnected).toPromise().then(res => {
              this.loanSharedService.getUser().temporaryPwd = res.temporaryPwd;
              this.loanSharedService.getUser().temporaryPassword=res.temporaryPassword;
              this.devToolsServices.openToast(0, 'alert.success');

               this.router.navigate([AcmConstants.DASHBOARD_URL]);
             });

        } catch (error) {
              this.devToolsServices.openToast(3, 'alert.error');
        }
    }
}
  }

  /**
   * checkPwd old
   */
  checkPwd() {
    if (this.userConnected.password !== this.changePwdForm.value.oldPwd) {
      this.devToolsServices.openToast(3, 'alert.pwd_invalid');
      this.changePwdForm.controls.oldPwd.setValidators([Validators.required]);
      this.changePwdForm.controls.oldPwd.clearValidators();
      this.changePwdForm.controls.oldPwd.reset();
    }
  }

  /**
   * checkPwd old
   */
  checkConfirmPwd() {
    if (this.changePwdForm.value.newPwd !== this.changePwdForm.value.confirmationPwd) {
      this.changePwdForm.controls.pwdConfirm.setValidators([Validators.required]);
      this.changePwdForm.controls.pwdConfirm.clearValidators();
      this.changePwdForm.controls.pwdConfirm.reset();
      return this.devToolsServices.openToast(3, 'alert.pwd_not_confirm');
    }
  }

  /**
   * getConnectedUser
   */
  async getConnectedUser() {
    this.userConnected =  this.loanSharedService.getUser();

  }

  /**
   * toggleFieldTextTypeOldPwd
   */
  toggleFieldTextTypeOldPwd() {
    this.fieldTextTypeOldPwd = !this.fieldTextTypeOldPwd;
  }

  /**
   * toggleFieldTextTypeNewPwd
   */
  toggleFieldTextTypNewPwd() {
    this.fieldTextTypeNewPwd = !this.fieldTextTypeNewPwd;
  }

  /**
   * toggleFieldTextTypeConfirmPwd
   */
  toggleFieldTextTypeConfirmPwd() {
    this.fieldTextTypeConfirmPwd = !this.fieldTextTypeConfirmPwd;
  }
}
