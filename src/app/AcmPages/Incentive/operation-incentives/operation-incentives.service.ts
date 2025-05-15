import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { IncentiveOperationEntity } from 'src/app/shared/Entities/incentiveOperation.entity';
import { IncentiveOperationPaginationEntity } from 'src/app/shared/Entities/incentiveOperationPagination.entity';

@Injectable({
  providedIn: 'root'
})
export class OperationIncentivesService {
  /**
   *
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) { }
  /**
   * get incentive operation
   * @param incentiveOperationEntity IncentiveOperationEntity
   * @returns list of incentive operation settings per product
   */
  getIncentiveOperations(incentiveOperationEntity: IncentiveOperationEntity): Observable<IncentiveOperationEntity[]> {
    return this.httpClient.post<IncentiveOperationEntity[]>(AcmURLConstants.FIND_INCENTIVE_OPERATION, incentiveOperationEntity);
  }
  /**
   * add new IncentiveOperationEntity
   * @param incentiveOperationEntity IncentiveOperationEntity
   * @returns new IncentiveOperationEntity
   */
  createOperationIncentive(incentiveOperationEntity: IncentiveOperationEntity):
  Observable<IncentiveOperationEntity> {
  return this.httpClient.post<IncentiveOperationEntity>(AcmURLConstants.CREATE_INCENTIVE_OPERATION, incentiveOperationEntity);
  }
  /**
   * update IncentiveOperationEntity
   * @param incentiveOperationEntity IncentiveOperationEntity
   * @returns IncentiveOperationEntity
   */
  updateOperationIncentive(incentiveOperationEntity: IncentiveOperationEntity): Observable<IncentiveOperationEntity> {
    return this.httpClient.put<IncentiveOperationEntity>(AcmURLConstants.UPDATE_INCENTIVE_OPERATION, incentiveOperationEntity);
  }
  /**
   * delete IncentiveOperationEntity
   * @param idIncentiveOperation number
   * @returns IncentiveOperationEntity
   */
  deleteOperationIncentive(idIncentiveOperation: number): Observable<IncentiveOperationEntity> {
    return this.httpClient.delete<IncentiveOperationEntity>(AcmURLConstants.DELETE_INCENTIVE_OPERATION + idIncentiveOperation);
  }
  /**
   * get IncentiveOperationPaginationEntity pagination
   * @param incentiveOperationPaginationEntity IncentiveOperationPaginationEntity
   * @returns list of IncentiveOperationPaginationEntity
   */
  findPagination(incentiveOperationPaginationEntity: IncentiveOperationPaginationEntity):
   Observable<IncentiveOperationPaginationEntity> {
    return this.httpClient.post<IncentiveOperationPaginationEntity>(AcmURLConstants.FIND_PAGINATION_OPERATION,
       incentiveOperationPaginationEntity);
  }
}
