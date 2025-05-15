import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AccountService } from 'src/app/shared/authentification/account.service';
import { AuthServerProvider } from 'src/app/shared/authentification/auth-jwt.service';
import { Account } from 'src/app/shared/Entities/account.model';
import { Login } from 'src/app/shared/Entities/login.model';


@Injectable({ providedIn: 'root' })
export class LoginService {
  // private accountService = inject(AccountService);
  // private authServerProvider = inject(AuthServerProvider);

  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider
  ) {}

  
  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(mergeMap(() => this.accountService.identity(true)));
  }

  logout(): void {
    this.authServerProvider.logout().subscribe({ complete: () => this.accountService.authenticate(null) });
  }
}
