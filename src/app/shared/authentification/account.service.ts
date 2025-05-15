import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

import { ApplicationConfigService } from './application-config.service';
import { Account } from '../Entities/account.model';
import { StateStorageService } from './state-storage.service';

@Injectable({ providedIn: 'root' })
export class AccountService {

  
  
  // private userIdentity = signal<Account | null>(null);
  // private authenticationState = new ReplaySubject<Account | null>(1);
  // private accountCache$?: Observable<Account> | null;

  private userIdentity = new BehaviorSubject<Account | null>(null);
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account> | null;

  private http = inject(HttpClient);
  private stateStorageService = inject(StateStorageService);
  private router = inject(Router);
  private applicationConfigService = inject(ApplicationConfigService);

  save(account: Account): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/account'), account);
  }

  authenticate(identity: Account | null): void {
    this.userIdentity.next(identity);
    this.authenticationState.next(identity);
    if (!identity) {
      this.accountCache$ = null;
    }
  }
  trackCurrentAccount(): Observable<Account | null> {
    return this.userIdentity.asObservable();
  }

  // hasAnyAuthority(authorities: string[] | string): boolean {
  //   const userIdentity = this.userIdentity;
  //   if (!userIdentity) {
  //     return false;
  //   }
  //   if (!Array.isArray(authorities)) {
  //     authorities = [authorities];
  //   }
  //   return userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  // }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetch().pipe(
        tap((account: Account) => {
          this.authenticate(account);

          this.navigateToStoredUrl();
        }),
        shareReplay(),
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
  }
  private fetch(): Observable<Account> {
    return this.http.get<Account>(this.applicationConfigService.getEndpointFor('services/parametrageservice/api/account'));
  }
  // isAuthenticated(): boolean {
  //   return this.userIdentity() !== null;
  // }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

 

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
