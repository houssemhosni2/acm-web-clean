import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AcmConstants } from '../acm-constants';
import { AcmDevToolsServices } from '../acm-dev-tools.services';
import { SharedService } from '../shared.service';
import { ApplicationConfigService } from './application-config.service';
import { StateStorageService } from './state-storage.service';
import { AcmURLConstants } from '../acm-url-constants';

/**
 * The Authentification interceptor
 */
@Injectable()
export class AuthentificationInterceptor implements HttpInterceptor {
  /**
   * AuthentificationInterceptor ; add Http Header (Taken) + catch error by status
   * @param router Router
   * @param acmDevToolsServices AcmDevToolsServices
   * @param sharedService SharedService
   */
  private stateStorageService = inject(StateStorageService);

  constructor(public router: Router, public acmDevToolsServices: AcmDevToolsServices, 
    public sharedService: SharedService , public applicationConfigService : ApplicationConfigService
 ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Bypass the interceptor for the callback URL
    if (window.location.href.includes('/callback')) {
      return next.handle(req);
    }

    // if (localStorage.getItem('currentUser') != null) {
    //   req = req.clone({
    //     headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('currentUser'))
    //   });
    // } else {
    //   this.router.navigateByUrl('/login');
    //   return next.handle(req.clone());
    // }
    const serverApiUrl = this.applicationConfigService.getEndpointFor('');
    if (!req.url || (req.url.startsWith('http') && !(serverApiUrl && req.url.startsWith(serverApiUrl)))) {
      return next.handle(req);
    }

    const token: string | null = this.stateStorageService.getAuthenticationToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
   // return next.handle(req);
    return next.handle(req).pipe(
      // we can check the status of the exception. And depending on the status,
      // we can decide what we should do.
      catchError((err: HttpErrorResponse) => {
        this.sharedService.setLoader(false);
        switch (err.status) {
          case 401: {
            if(req.url.includes(AcmURLConstants.FIND_KYC_CHECK) || req.url.includes(AcmURLConstants.FIND_SCORE_CHECK)){
              return next.handle(req.clone());
            }
            this.router.navigateByUrl('/login');
            const lang = localStorage.getItem('lang');

            localStorage.clear();
            sessionStorage.clear()

            const status = sessionStorage.getItem('offline');

            localStorage.setItem('lang', lang);
            return next.handle(req.clone());
            break;
          } case 500: {
            if (err.error.message === AcmConstants.USER_EMPLOYE_ID_INVALID) {
              // check if list or error is not empty
              if (err.error.message !== null) {
                this.acmDevToolsServices.openToast(3, 'alert.employe_id_invalid');
              }
              break;
            }
            this.acmDevToolsServices.openToast(1, 'error.ACM-00000');
            return next.handle(req.clone());
            break;
          } case 403: {
            this.router.navigateByUrl('/unauthorized');
            break;
          } case 400: {
             if (err.error.errorMessage === AcmConstants.CODE_API_ABACUS_MSG_NULL ){
              this.acmDevToolsServices.openToast(1, 'error.ACM-00512');
            }
            if (err.error.errorMessage === AcmConstants.API_ABACUS_Cancel_Fee ){
              this.acmDevToolsServices.openToast(1, 'error.ACM-00513');
            }
            else if (err.error.errorCode === AcmConstants.CODE_API_ABACUS_MSG) {
              this.acmDevToolsServices.openToast(1, err.error.errorMessage);
            } else if (err.error.errorCode === AcmConstants.CODE_NATIONAL_ID_NOT_FOUND) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToast(1, 'error.' + err.error.errorCode + '-' + err.error.errors[0]);
              }
            } else if (err.error.errorCode === AcmConstants.CODE_FIELDS_ERRORS_VALIDATION) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(1, 'error.' + err.error.errorCode);
              }
            } else if (err.error.errorCode === AcmConstants.APPROVAL_CONDITION_ERROR) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.ACM-07060');
              }

            }else if (err.error.errorCode === AcmConstants.EXPENSES_LIMIT) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.ACM-07054');
              }

            }else if (err.error.errorCode === AcmConstants.MEZA_CARD_ERROR) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.ACM-07057');
              }

            }else if (err.error.errorMessage === AcmConstants.CHECK_Issue_Date) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(1, 'error.ACM-07073');
              }

            }else if (err.error.errorCode === AcmConstants.MEZA_CARD_ERROR_UNTRUST) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.acm-07058')
              }
            }else if (err.error.errorCode === AcmConstants.MEZA_FEES) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.acm-07059')
              }
            }else if (err.error.errorCode === AcmConstants.JOURNAL_ENTRY_ERROR) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.ACM-07056');
              }
            }
            else if (err.error.errorCode === AcmConstants.JOURNAL_ENTRY_WORKFLOW_STEP){
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(1, 'error.ACM-07066');
              }
            }else if (err.error.errorCode === AcmConstants.SETTING_RISK_TYPE_EXCEPTION){
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.ACM-07068');
              }
            }else if (err.error.errorCode === AcmConstants.SUBWORKFLOW_EXCEPTION){
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.ACM-07071');
              }
            }
            else if (err.error.errorCode === AcmConstants.UPLOAD_CODE_MEZA_CARD_ERROR) {
              // check if list or error is not empty
              if (err.error.errorMessage !== null) {
                this.acmDevToolsServices.openToastWithParameter(1, 'error.upload_meza_card_error', err.error.errorMessage);
              } else {
                this.acmDevToolsServices.openToast(1, 'error.' + err.error.errorCode);
              }
            } else if (err.error.errorCode === AcmConstants.CUSTOMER_INVALID_AGE) {
              // check if list or error is not empty
              if (err.error.errorMessage !== null) {
                this.acmDevToolsServices.openToast(3, 'alert.age_limit_product');
              }
            } else if (err.error.errorCode === AcmConstants.USER_EMPLOYE_ID_INVALID) {
              // check if list or error is not empty
              if (err.error.errorMessage !== null) {
                this.acmDevToolsServices.openToast(3, 'alert.employe_id_invalid');
              }
            }else if (err.error.errorCode === AcmConstants.DR_AND_CR_ACCOUNTS_EMPTY) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.ACM-07069');
              }

            }else if (err.error.errorCode === AcmConstants.LOAN_REVIEW_EXCEPTION) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.ACM-07072');
              }

            }else if (err.error.errorCode === AcmConstants.WORKFLOW_NOT_FOUND) {
              // check if list or error is not empty
              if (err.error.errors !== null) {
                this.acmDevToolsServices.openToastArrayMessages(1, err.error.errors);
              } else {
                this.acmDevToolsServices.openToast(3, 'error.ACM-07053');
              }

            } 
             else {
              if (err.error instanceof Blob) {
                const reader = new FileReader();
                let msg = null;
                reader.onload = (event: Event) => {
                  msg = JSON.parse(reader.result.toString());
                  this.acmDevToolsServices.openToast(1, 'error.' + msg.errorCode);
                };
                reader.readAsText(err.error);
              } else if (err.error.errorCode === AcmConstants.ERROR_NUMBER_PHONE_DUPLICATE) {
                this.acmDevToolsServices.openToast(3, 'error.' + err.error.errorCode);
              } else {
                this.acmDevToolsServices.openToast(1, 'error.' + err.error.errorCode);
              }
            }
            // return next.handle(req);
            break;
          } case 0: {
            this.acmDevToolsServices.openToast(3, 'error.connection-lost');
            this.router.navigateByUrl('/acm');
            break;
          } default: {
            this.router.navigateByUrl('/acm');
            break;
          }
        }
      },
      ),
      // We could check the type of object/error to show
      // in our case to send error from backend to front
      tap((succ) => {
      },
        (err) => {
          if (err.status === 500) {
            return next.handle(req.clone());
          }
        }),
    );
  }
}
