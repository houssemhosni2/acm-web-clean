import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { AuthentificationService } from '../../../shared/authentification/authentification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { SharedService } from 'src/app/shared/shared.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { AppComponent } from '../../../app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { DatePipe } from '@angular/common';
import { checkOfflineMode } from 'src/app/shared/utils';
import { SettingsService } from '../../Settings/settings.service';
 
import { OAuthService } from 'angular-oauth2-oidc';import { LoginService } from './login.service';

 
import { AzureConfigService } from './AzureConfigService';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})

export class LoginComponent implements OnInit {
  @ViewChild('slickModal') slickModal: SlickCarouselComponent;
  slideConfig = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: false
  };
  public loginForm: FormGroup;
  public resetPwdForm: FormGroup;
  public outlookButton: boolean;
  error = '';

  /**
   * constructor
   * @param authService AuthentificationService
   * @param router Router
   * @param formBuilder Router
   * @param translate TranslateService
   * @param devToolsServices AcmDevToolsServices
   * @param loanSharedService SharedService
   * @param modalService NgbModal
   */
  constructor(public authService: AuthentificationService, public router: Router, public formBuilder: FormBuilder,
    public translate: TranslateService, private oauthService: OAuthService, public configService: AzureConfigService,
    public devToolsServices: AcmDevToolsServices, public loanSharedService: SharedService, private azureConfigService: AzureConfigService,
    public modalService: NgbModal, public datePipe: DatePipe, public settingsService: SettingsService,public  loginService : LoginService) {
  }

  /**
   * on init
   */
  ngOnInit() {
    const tenantId = this.azureConfigService.getTenantId();
    const clientId = this.azureConfigService.getClientId();
    this.outlookButton = this.azureConfigService.getEnabled();

    if (tenantId && clientId) {
      // Configure OAuthService with tenantId and clientId
      this.oauthService.configure(this.azureConfigService.getAuthConfig());

      // Load discovery document and try login once globally
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then().catch(error => {
        console.error('Error loading discovery document:', error);
      });
    } else {
      console.error('Missing tenantId or clientId');
    }

    const lang = localStorage.getItem('lang');
    localStorage.setItem('lang', lang);
    this.devToolsServices.backTop();
    this.slideConfig.rtl = this.translate.currentLang === 'ar';
    if (localStorage.getItem('currentUser')) {
      this.authService.logout() ; 
    }
    this.createForm();
  }

  /**
   * create form validators
   */
  createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  @ViewChild('username') username: ElementRef;


 // username = viewChild.required<ElementRef>('username');

  // ngAfterViewInit(): void {
  //   this.username.nativeElement.focus();
  // }

  //private loginService = inject(LoginService);

  login(): void {
    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        //this.authenticationError.set(false);
        if (!this.router.getCurrentNavigation()) {
          // There were no routing during login (eg from navigationToStoredUrl)
          localStorage.setItem('currentUser', sessionStorage.getItem("jhi-authenticationToken"));
        
          const environnements: string[] = [AcmConstants.KEY_LICENCE];
          this.settingsService.getEnvirementValueByKeys(environnements).subscribe((data) => {
            if (data !== null) {
             this.loanSharedService.setActivationKey(data.filter(item=>item.key===AcmConstants.KEY_LICENCE)[0].value.split(','));
              this.loanSharedService.setCreptedKey(data.filter(item=>item.key===AcmConstants.KEY_LICENCE)[0].creptedKey);
              this.loanSharedService.setEnvironnementLicence(data.filter(item=>item.key===AcmConstants.KEY_LICENCE)[0]) ;
           }
          });
          //     localStorage.setItem('expiredIn', dataReceived.expires_in);
          //     localStorage.setItem('refreshToken', dataReceived.refresh_token);
          //     const expireDate = new Date(new Date().getTime() + (1000 * dataReceived.expires_in));
          //     localStorage.setItem('dateExpiration', expireDate.toString());
          this.router.navigate(['']);
        }
      },
      error: () => console.log(this.error)
      ,
    });
  }



  async onSubmit() {
    localStorage.clear();
    if (checkOfflineMode()) {
      const user = JSON.parse(sessionStorage.getItem('currentUser'));
      this.setUser(user);

      if (user === undefined) {
        this.error = 'login.login_msg';
      } else {
        this.getConnectedUser();
        this.getHabilitation();
        // this.checkIfUserIsAuthorized();
        this.loanSharedService.setAuthorized(false);

      };

    } else {
      let _dataReceived;

      // await this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
      //   .toPromise().then((dataReceived: any) => {
      //     /* It's a no-op. */
      //     _dataReceived = dataReceived;
      //     const environnements: string[] = [AcmConstants.KEY_LICENCE];
      //     localStorage.setItem('currentUser', dataReceived.access_token);
      //     localStorage.setItem('expiredIn', dataReceived.expires_in);
      //     localStorage.setItem('refreshToken', dataReceived.refresh_token);
      //     const expireDate = new Date(new Date().getTime() + (1000 * dataReceived.expires_in));
      //     localStorage.setItem('dateExpiration', expireDate.toString());
      //     this.getConnectedUser();
      //     this.getHabilitation();
      //     this.checkIfUserIsAuthorized();
      //     this.settingsService.getEnvirementValueByKeys(environnements).subscribe((data) => {
      //       if (data !== null) {
      //         this.loanSharedService.setActivationKey(data.filter(item=>item.key===AcmConstants.KEY_LICENCE)[0].value.split(','));
      //         this.loanSharedService.setCreptedKey(data.filter(item=>item.key===AcmConstants.KEY_LICENCE)[0].creptedKey);
      //         this.loanSharedService.setEnvironnementLicence(data.filter(item=>item.key===AcmConstants.KEY_LICENCE)[0]) ;
      //       }
      //     });
      //   },
      //     (err: any) => {
      //       if (err.error_description === AcmConstants.INCENTIVE_AUTHENTIFICATION_RESIGNING_DATE) {
      //         this.error = 'login.login_msg_error_resigning_date';
      //       }
      //       if (err.error_description === AcmConstants.INCENTIVE_AUTHENTIFICATION_USER_ENABLED) {
      //         this.error = 'login.login_msg_user_enabled';
      //       }
      //       if (err.error_description === AcmConstants.INCENTIVE_AUTHENTIFICATION_LOGIN
      //         || err.error_description === AcmConstants.INCENTIVE_AUTHENTIFICATION_LOGIN_OR_PASSWORD) {
      //         this.error = 'login.login_msg';
      //       }
      //     });

    }
  }

  langFR() {
    this.translate.use('fr');
    AppComponent.direction = 'ltr';
    this.slickModal.ngOnDestroy();
    localStorage.setItem('lang', 'fr');
  }

  /**
   * change language
   * FR
   */
  langEN() {
    this.translate.use('en');
    AppComponent.direction = 'ltr';
    this.slickModal.ngOnDestroy();
    localStorage.setItem('lang', 'en');
  }

  /**
   * change language AR
   */
  langAR() {
    this.translate.use('ar');
    AppComponent.direction = 'rtl';
    this.slickModal.ngOnDestroy();
    localStorage.setItem('lang', 'ar');
  }

  async getHabilitation() {

    if (checkOfflineMode()) {
      const habilitations = JSON.parse(sessionStorage.getItem('habilitations'))
      this.loanSharedService.setHabilitationEntitys(habilitations);
    } else {
      await this.authService.getUserHabilitation()
        .toPromise().then((data: any) => {
          this.loanSharedService.setHabilitationEntitys(data);
        });
    }

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

  public slickInit(e) {
    this.slideConfig.className = 'center';
    this.slideConfig.centerMode = true;
    this.slideConfig.infinite = true;
    this.slideConfig.centerPadding = '0';
    this.slideConfig.slidesToShow = 1;
    this.slideConfig.slidesToScroll = 1;
    this.slideConfig.speed = 500;
    this.slideConfig.dots = true;
    this.slideConfig.autoplay = true;
    this.slideConfig.autoplaySpeed = 3000;
    if (this.translate.currentLang === 'en') {
      this.slideConfig.rtl = false;
    } else if (this.translate.currentLang === 'fr') {
      this.slideConfig.rtl = false;
    } else if (this.translate.currentLang === 'ar') {
      this.slideConfig.rtl = true;
    }
    this.slickModal.config = this.slideConfig;
  }

  /**
   * Methode to create form Decline
   */
  createFormResetPwd() {
    this.resetPwdForm = this.formBuilder.group({
      resetUsername: ['', Validators.required],
    });
  }
  /**
   * openpopup
   * @param content any
   */
  open(content) {
    this.createFormResetPwd();
    this.modalService.open(content
    );
  }
  /**
   * submitReset
   */
  submitReset() {
    if (this.resetPwdForm.valid) {
      const userDTO = new UserEntity();
      userDTO.login = this.resetPwdForm.value.resetUsername;
      this.modalService.dismissAll();
      this.authService.resetPwd(userDTO)
        .toPromise().then((dataReceived: any) => {
          this.devToolsServices.openToast(0, 'alert.reset_pwd');
          localStorage.clear();
        });
    }
  }
  getDirection() {
    return AppComponent.direction;
  }
 

  /**
   * check if the user connected is authorized to has acces to all buttons
   */
  checkIfUserIsAuthorized() {
    if (checkOfflineMode()) {
      const res = JSON.parse(sessionStorage.getItem('check-if-user-authorized'));
      if (res !== null) {
        this.loanSharedService.setAuthorized(res);
      }
    } else {
      this.authService.checkIfGroupOfConnectedUserIsAuthorized(AcmConstants.AUTHORIZED_GROUPS).subscribe((res) => {
        if (res !== null) {
          this.loanSharedService.setAuthorized(res);
        }
      });
    }

  }
  /**
   * getConnectedUser
   */
  async getConnectedUser() {
    if (checkOfflineMode()) {
      console.log('canActivate - getConnectedUser');
      const user = JSON.parse(sessionStorage.getItem('currentUser'));
      this.setUser(user);

    } else {

      this.authService.curentUser().subscribe((user) => {
        this.setUser(user);
      });

    }
  }
  logWithOutlook() {
    this.oauthService.initLoginFlow();
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
}
