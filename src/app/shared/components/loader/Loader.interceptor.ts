import {inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoaderService} from './loader.service';
import { StateStorageService } from '../../authentification/state-storage.service';
import { ApplicationConfigService } from '../../authentification/application-config.service';


@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  static LoaderNumber = 0;
  public requests: HttpRequest<any>[] = [];

  private stateStorageService = inject(StateStorageService);
  private applicationConfigService = inject(ApplicationConfigService);
  constructor(public loaderService: LoaderService) {
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    this.loaderService.isLoading.next(true);
    LoaderInterceptor.LoaderNumber++;
    return new Observable(observer => {
      const subscription = next.handle(req)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
              LoaderInterceptor.LoaderNumber--;
              if (LoaderInterceptor.LoaderNumber === 0) {
                this.loaderService.isLoading.next(false);
              }
            }
          },
          err => {
            this.removeRequest(req);
            observer.error(err);
            LoaderInterceptor.LoaderNumber--;
            if (LoaderInterceptor.LoaderNumber === 0) {
              this.loaderService.isLoading.next(false);
            }
          },
          () => {
            this.removeRequest(req);
            observer.complete();
            if (LoaderInterceptor.LoaderNumber === 0) {
              this.loaderService.isLoading.next(false);
            }
          });
      // teardown logic in case of cancelled requests
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const serverApiUrl = this.applicationConfigService.getEndpointFor('');
  //   if (!request.url || (request.url.startsWith('http') && !(serverApiUrl && request.url.startsWith(serverApiUrl)))) {
  //     return next.handle(request);
  //   }

  //   const token: string | null = this.stateStorageService.getAuthenticationToken();
  //   if (token) {
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   }
  //   return next.handle(request);
  // }
}
