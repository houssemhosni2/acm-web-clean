import {Component, OnInit} from '@angular/core';
import {ThemeOptions} from '../../../../../theme-options';
import {AuthentificationService} from '../../../../../shared/authentification/authentification.service';
import {UserEntity} from '../../../../../shared/Entities/user.entity';
import {TranslateService} from '@ngx-translate/core';
import {AcmConstants} from '../../../../../shared/acm-constants';
import {Router} from '@angular/router';
import {AcmDevToolsServices} from '../../../../../shared/acm-dev-tools.services';
import {SharedService} from 'src/app/shared/shared.service';
import {AppComponent} from '../../../../../app.component';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { WebSocketService } from 'src/app/shared/websocket.service';
import { TranslocoService } from '@ngneat/transloco';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { checkOfflineMode } from 'src/app/shared/utils';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {
   user: UserEntity = new UserEntity();

  toggleDrawer() {
    this.globals.toggleDrawer = !this.globals.toggleDrawer;
  }

  constructor(public globals: ThemeOptions, public authentificationService: AuthentificationService,
              public translate: TranslateService, public router: Router,
              public devToolsServices: AcmDevToolsServices, public loanSharedService: SharedService,
              public ngbDropdownMenu: NgbDropdownConfig, public settingsService: SettingsService,
              public webSocketService: WebSocketService,private transloco: TranslocoService,private dbService : NgxIndexedDBService) {
  }

  ngOnInit() {
    this.user.groupes = [];

    this.user = this.loanSharedService.getUser();
    if (this.translate.currentLang === 'en') {
      this.ngbDropdownMenu.placement = 'bottom-right';
    } else if (this.translate.currentLang === 'fr') {
      this.ngbDropdownMenu.placement = 'bottom-right';
    } else if (this.translate.currentLang === 'ar') {
      this.ngbDropdownMenu.placement = 'bottom-left';
    }
  }

 async logout() {
   await this.authentificationService.logout();
    localStorage.clear();
    this.loanSharedService.setHabilitationEntitys([]);
    this.loanSharedService.setUser(new UserEntity());
    this.router.navigate([AcmConstants.LOGIN_URL]);
   // this.webSocketService._disconnect();
  }

  async langFR() {
    if(checkOfflineMode()){
      await this.loanSharedService.setTranslationOffline('fr')
     }
    this.translate.use('fr');
    AppComponent.direction = 'ltr';
    this.ngbDropdownMenu.placement = 'bottom-right';
    localStorage.setItem('lang', 'fr');
    this.user.defaultLang = AcmConstants.FR;
    if(!checkOfflineMode()){
    this.settingsService.updateDefaultLangUser(this.user).subscribe();
    }
    this.transloco.setActiveLang('fr');
  }

  async langEN() {
    if(checkOfflineMode()){
     await this.loanSharedService.setTranslationOffline('en')
    }
    this.translate.use('en');
    AppComponent.direction = 'ltr';
    this.ngbDropdownMenu.placement = 'bottom-right';
    localStorage.setItem('lang', 'en');
    this.user.defaultLang = AcmConstants.EN;
    if(!checkOfflineMode()){
    this.settingsService.updateDefaultLangUser(this.user).subscribe();
    }
    this.transloco.setActiveLang('en');
  }

  async langAR() {
    if(checkOfflineMode()){
      await this.loanSharedService.setTranslationOffline('ar')
     }
    this.translate.use('ar');
    AppComponent.direction = 'rtl';
    this.ngbDropdownMenu.placement = 'bottom-left';
    localStorage.setItem('lang', 'ar');
    this.user.defaultLang = AcmConstants.AR;
    if(!checkOfflineMode()){
    this.settingsService.updateDefaultLangUser(this.user).subscribe();
    }
    this.transloco.setActiveLang('ar');
  }
    /**
     * changePwdComponent
     */
    changePwdComponent() {
      this.router.navigate([AcmConstants.CHANGE_PWD]);
  }
}
