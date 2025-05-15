import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs';
import { HabilitationEntity } from './Entities/habilitation.entity';
import { AcmConstants } from '../shared/acm-constants';
import { AuthentificationService } from './authentification/authentification.service';
import { checkOfflineMode } from './utils';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  public userHabilitations: HabilitationEntity[] = [];

  /**
   * constructor
   * @param AuthentificationService authService
   * @param Router router
   * @param SharedService loanSharedService
   */
  constructor(public loanSharedService: SharedService, public router: Router, public authService: AuthentificationService) {
  }

  /**
   *  canActivate we check list of habilitation from user connected.
   *  to URL or switch for case 403.
   * @param route the Router.
   */
  canActivate(
    route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const path: string = route.routeConfig.path;
    const routes: string[] = [];
    const keys = this.loanSharedService.getUser() ? Object.keys(this.loanSharedService.getUser()) : [];

    if (keys.length === 0) {
      if (checkOfflineMode()) {
        console.log('canActivate -curentUser')
        const user = JSON.parse(sessionStorage.getItem('currentUser'))
        this.loanSharedService.setUser(user);
      } else {
        this.authService.curentUser().subscribe(
          (user) => {
            this.loanSharedService.setUser(user);
          }
        );
      }

    }
    this.userHabilitations = this.loanSharedService.getHabilitationEntitys();
    if (this.loanSharedService.getHabilitationEntitys().length > 0) {
      this.userHabilitations.forEach(element => routes.push(element.acmWebRoute));
      if (routes.includes(path) && !this.loanSharedService.getUser().temporaryPwd && this.loanSharedService.getUser().temporaryPassword==null) {
        return true;
      } else if (!routes.includes(path)) {
        // path does not exisit
        this.getHabilitation().then(() => {
          this.router.navigate([AcmConstants.UNAUTHORIZED]);
        }
        );
       } else if (this.loanSharedService.getUser().temporaryPwd || this.loanSharedService.getUser().temporaryPassword!==null) {
        this.router.navigate([AcmConstants.CHANGE_PWD]);
      }
    } else {
      // if habilitation is empty ==> reload habilitation from shared
      this.getHabilitation().then(() => {
        this.router.navigate([AcmConstants.DASHBOARD_URL]);
      }
      );
    }

    // set GroupOfConnectedUserIsAuthorized when page refresh to maintain habilitation

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
   *  getHabilitation methode
   *  get all habilitation from user connected
   */
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
  }

}
