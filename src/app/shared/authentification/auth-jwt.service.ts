import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StateStorageService } from './state-storage.service';
import { Login } from '../Entities/login.model';
import { ApplicationConfigService } from './application-config.service';
import { environment } from 'src/environments/environment';

type JwtToken = {
  id_token: string;
};

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  private http = inject(HttpClient);
  private stateStorageService = inject(StateStorageService);
  private applicationConfigService = inject(ApplicationConfigService);

  getToken(): string {
    return this.stateStorageService.getAuthenticationToken() ?? '';
  }

  login(credentials: Login): Observable<void> {
    this.applicationConfigService.setEndpointPrefix(environment.apiUrl) ; 
    return this.http
      .post<JwtToken>(this.applicationConfigService.getEndpointFor('api/authenticate'), credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.stateStorageService.clearAuthenticationToken();
      observer.complete();
    });
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    this.stateStorageService.storeAuthenticationToken(response.id_token, rememberMe);
  }
}
