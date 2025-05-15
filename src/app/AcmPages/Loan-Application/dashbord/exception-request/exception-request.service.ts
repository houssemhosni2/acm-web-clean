import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { ExceptionRequestCountEntity } from 'src/app/shared/Entities/ExceptionRequestCount.entity';
import { ExceptionRequestPaginationEntity } from 'src/app/shared/Entities/ExceptionRequestPagination.entity';

@Injectable({
  providedIn: 'root'
})
export class ExceptionRequestService {
  /**
   *
   * @param httpClient HttpClient
   */
  constructor(private httpClient: HttpClient) {
  }
  /**
   *
   * @param exceptionRequestEntity ExceptionRequestEntity
   * @returns ExceptionRequestEntity[]
   */
  public findExceptionRequest(exceptionRequestEntity: ExceptionRequestEntity): Observable<ExceptionRequestEntity[]> {
    return this.httpClient.post<ExceptionRequestEntity[]>(AcmURLConstants.FIND_EXCEPTION_REQUEST, exceptionRequestEntity);
  }
  /**
   *
   * @param exceptionRequestPaginationEntity ExceptionRequestPaginationEntity
   * @returns ExceptionRequestPaginationEntity
   */
  public findExceptionRequestPagination(exceptionRequestPaginationEntity: ExceptionRequestPaginationEntity):
    Observable<ExceptionRequestPaginationEntity> {
    return this.httpClient.post<ExceptionRequestPaginationEntity>(AcmURLConstants.FIND_PAGINATION_EXCEPTION_REQUEST,
      exceptionRequestPaginationEntity);
  }
  /**
   *
   * @param exceptionRequestEntity ExceptionRequestEntity
   * @returns ExceptionRequestEntity
   */
  public createExceptionRequest(exceptionRequestEntity: ExceptionRequestEntity): Observable<ExceptionRequestEntity> {
    return this.httpClient.post<ExceptionRequestEntity>(AcmURLConstants.CREATE_EXCEPTION_REQUEST, exceptionRequestEntity);
  }
  /**
   *
   * @param exceptionRequestEntity ExceptionRequestEntity
   * @returns ExceptionRequestEntity
   */
  public updateExceptionRequest(exceptionRequestEntity: ExceptionRequestEntity): Observable<ExceptionRequestEntity> {
    return this.httpClient.put<ExceptionRequestEntity>(AcmURLConstants.UPDATE_EXCEPTION_REQUEST, exceptionRequestEntity);
  }
  /**
   *
   * @param exceptionRequestEntity ExceptionRequestEntity
   * @returns ExceptionRequestEntity
   */
  public updateStatutExceptionRequest(exceptionRequestEntity: ExceptionRequestEntity): Observable<ExceptionRequestEntity> {
    return this.httpClient.post<ExceptionRequestEntity>(AcmURLConstants.UPDATE_STATUT_EXCEPTION_REQUEST, exceptionRequestEntity);
  }
 /**
  *
  * @returns ExceptionRequestCountEntity
  */
  public loadCount(): Observable<ExceptionRequestCountEntity> {
    return this.httpClient.get<ExceptionRequestCountEntity>(AcmURLConstants.COUNT_EXCEPTION_REQUEST);

  }
}
