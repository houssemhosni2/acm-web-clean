import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AcmURLConstants } from '../acm-url-constants';
import { UserEntity } from '../Entities/user.entity';
import { HabilitationEntity } from '../Entities/habilitation.entity';
import { environment } from 'src/environments/environment';
import { checkOfflineMode } from '../utils';
import { LoginEntity } from '../Entities/Login.entity';
import { Login } from '../Entities/login.model';
import { Account } from '../Entities/account.model';
import { AccountService } from './account.service';
import { AuthServerProvider } from './auth-jwt.service';

/**
 * The Authentification service
 */
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  public storedToken: string;
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {

    // set token if saved in local storage
    this.storedToken = localStorage.getItem('currentUser');
  }

  /**
   * login
   * @param username the username
   * @param password the password
   */
   /*    login(username: string, password: string) {

    const data = 'grant_type=password&username=' + username + '&password=' + password;
    let reqHeader = new HttpHeaders();
    reqHeader = reqHeader.append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic ' + btoa('talysclient:appclient@123'));
    return this.httpClient.post(AcmURLConstants.AUTHENTICATION_URL_API + data, {}, {headers: reqHeader})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error.error);
        }),
      );
  }  */   

  //     login(username: string, password: string) {

  //   const data = {
  //     login: username,
  //     password: password
  //   };
  
  //   let reqHeader = new HttpHeaders();
  //   reqHeader = reqHeader.append('Content-Type', 'application/json');
  //   return this.httpClient.post<any>(AcmURLConstants.AUTHENTICATION_LOGIN_API, data)
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         return throwError(error.error);
  //       }),
  //     );
  // }   

  

  /**
   * Logout
   */
  // logout() {
  //   // clear token remove user from local storage to log user out
  //   return this.httpClient.get(AcmURLConstants.AUTHENTICATION_SERVICE + 'users/logOut');
  // }

//with jhipster
private accountService = inject(AccountService);
  private authServerProvider = inject(AuthServerProvider);

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(mergeMap(() => this.accountService.identity(true)));
  }

  logout(): void {
    this.authServerProvider.logout().subscribe({ complete: () => this.accountService.authenticate(null) });
  }

  /**
   * get curentUser
   */
  curentUser() {
    return this.httpClient.get<UserEntity>(AcmURLConstants.USER_PARAMETRAGE);
  }
  /**
   * check if group of connected user is authorized (update critical data / access all buttons)
   * @param groupOfConnectedUser ACMEnvironnementKey
   * @returns true / false
   */
  checkIfGroupOfConnectedUserIsAuthorized(groupOfConnectedUser: string) {
    return this.httpClient.get<boolean>(AcmURLConstants.GROUP_OF_CONNECTED_USER_IN_SETTING + groupOfConnectedUser);
  }
  /**
   * get user habilitation
   */
  getUserHabilitation() {
    return this.httpClient.get<HabilitationEntity[]>(AcmURLConstants.GET_HABILITATION_USER);
  }
  /**
   * resetPwd
   * @param userDTO UserEntity
   */
  resetPwd(userDTO: UserEntity): Observable<UserEntity> {
    return this.httpClient.post<UserEntity>(AcmURLConstants.RESET_PWD, userDTO);
  }
  /**
   * The client authentication method
   */
  clientAuthentication() {
    const data = 'grant_type=client_credentials';
    const url = AcmURLConstants.AUTHENTICATION_URL_API + data;
    let reqHeader = new HttpHeaders();
    reqHeader = reqHeader.append('Authorization', 'Basic '
      + btoa(environment.authentificationUserName + ':' + environment.authentificationPassword));
    return this.httpClient.post(url, {}, { headers: reqHeader });
  }
  /**
   * changePwd
   * @param userDTO UserEntity
   */
  changePwd(userDTO: UserEntity): Observable<UserEntity> {
    return this.httpClient.post<UserEntity>(AcmURLConstants.UPDATE_PWD, userDTO);
  }
  /**
   * find users
   * @param userDTO UserEntity
   * @returns UserEntity
   */
  findUsers(userDTO: UserEntity): Observable<UserEntity[]> {
    return this.httpClient.post<UserEntity[]>(AcmURLConstants.FIND_USERS, userDTO);
  }
  /**
   * Find list user (ALL {@link UserHierarchicalType}) for connected user && if FullList=True add
   * list of user with {@link UserCategory}=MANAGMENT for his branch.
   */
  loadAllUserList(): Observable<UserEntity[]> {
    return this.httpClient.get<UserEntity[]>(AcmURLConstants.LOAD_FULL_USERS_LIST);
  }
  getUserByLogin(login : string) :Observable<UserEntity>{
    return this.httpClient.get<UserEntity>(AcmURLConstants.FIND_USERS+login);
  }

  getCountUser():Observable<number>{
    return this.httpClient.get<number>(AcmURLConstants.FIND_COUNT_USERS);
  }
  getSimultaniousUser():Observable<number>{
    return this.httpClient.get<number>(AcmURLConstants.FIND_SIMULTANIOUS_USERS);
  }
  logWithOutlook(token: string):Observable<LoginEntity>{
    return this.httpClient.post<LoginEntity>(AcmURLConstants.AUTHENTICATION_LOGIN_OUTLOOK, token);
  }
  


}
