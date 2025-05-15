import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthentificationService } from '../shared/authentification/authentification.service';
import { AcmConstants } from '../shared/acm-constants';
import { SharedService } from '../shared/shared.service';
import { AppComponent } from '../app.component';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from '../shared/acm-dev-tools.services';
import { DatePipe } from '@angular/common';
import { SettingsService } from '../AcmPages/Settings/settings.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.sass']
})
export class CallbackComponent implements OnInit {
  error = '';
  constructor(
    public authService: AuthentificationService,
    private route: ActivatedRoute,
    private router: Router,
    private loanSharedService: SharedService,
    public translate: TranslateService,
    public devToolsServices: AcmDevToolsServices,
    public datePipe: DatePipe,
    public settingsService: SettingsService,
    private oauthService: OAuthService
  ) { }

   async ngOnInit() {
  //   this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
  //     if (this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken()) {
  //       const idToken = this.oauthService.getIdToken();
  //       this.sendTokenToBackend();
  //     }
  //   });
  // }
  // private sendTokenToBackend() {
  //   const idToken = this.oauthService.getIdToken();
  //   this.authService.logWithOutlook(idToken).subscribe(response => {
  //     console.log('Login successful', response);
  //     this.submit(response.login, response.password);
  //   }, error => {
  //     this.router.navigateByUrl('/login');
  //     console.error('Login failed', error);
  //   });
   }

  // async submit(login: string, password: string) {

  //   let _dataReceived;

  //   await this.authService.login(login, password)
  //     .toPromise().then((dataReceived: any) => {
  //       /* It's a no-op. */
  //       _dataReceived = dataReceived;
  //       const environnements: string[] = [AcmConstants.KEY_LICENCE];
  //       localStorage.setItem('currentUser', dataReceived.access_token);
  //       localStorage.setItem('expiredIn', dataReceived.expires_in);
  //       localStorage.setItem('refreshToken', dataReceived.refresh_token);
  //       const expireDate = new Date(new Date().getTime() + (1000 * dataReceived.expires_in));
  //       localStorage.setItem('dateExpiration', expireDate.toString());
  //       this.getConnectedUser();
  //       this.getHabilitation();
  //       this.checkIfUserIsAuthorized();
  //       this.settingsService.getEnvirementValueByKeys(environnements).subscribe((data) => {
  //         if (data !== null) {
  //           this.loanSharedService.setActivationKey(data.filter(item => item.key === AcmConstants.KEY_LICENCE)[0].value.split(','));
  //           this.loanSharedService.setCreptedKey(data.filter(item => item.key === AcmConstants.KEY_LICENCE)[0].creptedKey);
  //           this.loanSharedService.setEnvironnementLicence(data.filter(item => item.key === AcmConstants.KEY_LICENCE)[0]);
  //         }
  //       });
  //       let currentUrl = window.location.href;
  //       let url = new URL(currentUrl);
  //       url.pathname = '/acm';
  //       window.location.href = url.toString();
  //     },
  //       (err: any) => {
  //         if (err.error_description === AcmConstants.INCENTIVE_AUTHENTIFICATION_RESIGNING_DATE) {
  //           this.error = 'login.login_msg_error_resigning_date';
  //         }
  //         if (err.error_description === AcmConstants.INCENTIVE_AUTHENTIFICATION_USER_ENABLED) {
  //           this.error = 'login.login_msg_user_enabled';
  //         }
  //         if (err.error_description === AcmConstants.INCENTIVE_AUTHENTIFICATION_LOGIN
  //           || err.error_description === AcmConstants.INCENTIVE_AUTHENTIFICATION_LOGIN_OR_PASSWORD) {
  //           this.error = 'login.login_msg';
  //         }
  //       });
  // }
  /**
 * getConnectedUser
 */
  async getConnectedUser() {
    await this.authService.curentUser().toPromise().then((user) => {
      this.setUser(user);
    });

  }
  setUser(user) {
    if (user) {
      this.loanSharedService.setUser(user);
      // Setting language set from User Setting.
      if (user.defaultLang === null) {
        user.defaultLang = 'AR';
      }
      localStorage.setItem('lang', user.defaultLang.toLowerCase());
      if (user.defaultLang === AcmConstants.AR) {
        this.translate.use('ar');
        AppComponent.direction = 'rtl';
      } else if (user.defaultLang === AcmConstants.EN) {
        this.translate.use('en');
        AppComponent.direction = 'ltr';
      } else if (user.defaultLang === AcmConstants.FR) {
        this.translate.use('fr');
        AppComponent.direction = 'ltr';
      }
    }
  }
  async getHabilitation() {
    await this.authService.getUserHabilitation()
      .toPromise().then((data: any) => {
        this.loanSharedService.setHabilitationEntitys(data);
      });
    if (this.loanSharedService.getHabilitationEntitys().length > 0) {
      if (this.loanSharedService.getUser().pwdExpiryDate) {
        const dateExp = new Date(this.loanSharedService.getUser().pwdExpiryDate);
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        if (dateExp < nextWeek) {
          this.devToolsServices.openToastWithParameter(3, 'alert.pwd_expiry_date', this.datePipe.transform(dateExp, 'dd/MM/yyyy'));
        }
      }
      if (this.loanSharedService.getUser().temporaryPwd || this.loanSharedService.getUser().temporaryPassword !== null) {
        await this.router.navigate([AcmConstants.CHANGE_PWD]);
      } else {
        await this.router.navigate([AcmConstants.DASHBOARD_URL]);
      }

    } else {
      console.log('habilitation_msg');

      this.error = 'login.habilitation_msg';
    }
  }
  checkIfUserIsAuthorized() {
    this.authService.checkIfGroupOfConnectedUserIsAuthorized(AcmConstants.AUTHORIZED_GROUPS).subscribe((res) => {
      if (res !== null) {
        this.loanSharedService.setAuthorized(res);
      }
    });


  }
}