import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule
} from '@ngneat/transloco';
import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { checkOfflineMode } from '../utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient,private dbService: NgxIndexedDBService) {}

  getTranslation(lang: string): Observable<Translation> {
    if (!checkOfflineMode()) {    
      // Fetch from server in online mode
      return this.http.get<Translation>(`../../../assets/i18n/${lang}.json`);
    } else {
      // Fetch from IndexedDB in offline mode
      return new Observable<Translation>((observer) => {
        this.dbService.getByKey('data', 'validationTranslation_' + localStorage.getItem('lang')).toPromise()
          .then((res: any) => {
            if (res && res.data) {
              observer.next(res.data);
            } else {
              observer.error('Translation data not found in IndexedDB');
            }
            observer.complete();
          })
          .catch(error => {
            observer.error(error);
            observer.complete();
          });
      });
    }
  }
  
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'fr','ar'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: false
      })
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ]
})
export class TranslocoRootModule {}
