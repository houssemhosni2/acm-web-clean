import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Direction } from '@angular/cdk/bidi';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AcmConstants } from './shared/acm-constants';
import { Subscription } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { TranslocoService } from '@ngneat/transloco';
import { checkOfflineMode } from './shared/utils';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  static direction: Direction;
  title = 'acm-web';
  routerSubscription: Subscription;
  /**
   *
   * @param translate TranslateService
   * @param router Router
   * @param loadingBarService LoadingBarService
   */
  constructor(public translate: TranslateService, router: Router, loadingBarService: LoadingBarService,private transloco: TranslocoService,public loanSharedService: SharedService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.addLangs(['en', 'fr', 'ar']);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    if(checkOfflineMode()){
      const lang = localStorage.getItem('lang');

          this.loanSharedService.setTranslationOffline(lang).then(()=>{
            this.setUpLang();
          });
    }
     else {
      this.setUpLang();
    }


    // routing Config
    this.routerSubscription = router.events
      .pipe(
        // The "events" stream contains all the navigation events. For this demo,
        // though, we only care about the NavigationStart event as it contains
        // information about what initiated the navigation sequence.
        filter(
          (event) => {
            return (event instanceof NavigationStart);
          }
        )
      )
      .subscribe(
        (event: NavigationStart) => {
          if (event.navigationTrigger !== 'imperative') {
            router.navigateByUrl(AcmConstants.DASHBOARD_URL)
              .then(() => {
                router.navigated = false;
                router.navigate([router.url]).then((r) => {
                  if (r) {
                    loadingBarService.complete();
                  }
                });
              });
          }
        }
      );

  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }
  setUpLang(){
    const lang = localStorage.getItem('lang');
    if (lang !== null && lang === 'ar') {
      this.translate.use('ar');
      this.transloco.setActiveLang('ar');
      AppComponent.direction = 'rtl';
    } else if (lang !== null && lang === 'en') {
      this.translate.use('en');
      this.transloco.setActiveLang('en');
      AppComponent.direction = 'ltr';
    } else if (lang !== null && lang === 'fr') {
      this.translate.use('fr');
      this.transloco.setActiveLang('fr');
      AppComponent.direction = 'ltr';
    } else {
      // default language if localstorage is empty
      this.translate.use('ar');
      this.transloco.setActiveLang('ar');
      AppComponent.direction = 'rtl';
    }
  }
}
