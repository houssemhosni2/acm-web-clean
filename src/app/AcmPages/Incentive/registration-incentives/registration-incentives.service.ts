import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { IncentiveRegistrationEntity } from 'src/app/shared/Entities/incentiveRegistration.entity';
import { IncentiveRegistrationPaginationEntity } from 'src/app/shared/Entities/IncentiveRegistrationPagination.entity';

@Injectable({
  providedIn: 'root'
})
export class RegistrationIncentivesService {

  constructor(public httpClient: HttpClient) { }
  /**
   * get incentive registration
   * @param incetiveRegistrationEntity IncetiveRegistrationEntity
   * @returns list of incentive registration settings per product
   */
   getIncentiveRegistrations(incetiveRegistrationEntity: IncentiveRegistrationEntity): Observable<IncentiveRegistrationEntity[]> {
    return this.httpClient.post<IncentiveRegistrationEntity[]>(AcmURLConstants.FIND_INCENTIVE_REGISTRATION, incetiveRegistrationEntity);
  }
  /**
   * add new IncentiveRegistrationEntity
   * @param incetiveRegistrationEntity IncetiveRegistrationEntity
   * @returns new IncetiveRegistrationEntity
   */
  createRegistrationIncentive(incetiveRegistrationEntity: IncentiveRegistrationEntity):
  Observable<IncentiveRegistrationEntity> {
  return this.httpClient.post<IncentiveRegistrationEntity>(AcmURLConstants.CREATE_INCENTIVE_REGISTRATION, incetiveRegistrationEntity);
  }
  /**
   * update IncentiveRegistrationEntity
   * @param incentiveRegistrationEntity IncentiveRegistrationEntity
   * @returns IncentiveRegistrationEntity
   */
  updateRegistrationIncentive(incentiveRegistrationEntity: IncentiveRegistrationEntity): Observable<IncentiveRegistrationEntity> {
    return this.httpClient.put<IncentiveRegistrationEntity>(AcmURLConstants.UPDATE_INCENTIVE_REGISTRATION, incentiveRegistrationEntity);
  }
  /**
   * delete IncentiveRegistrationEntity
   * @param idIncentiveRegistration number
   * @returns IncentiveRegistrationEntity
   */
  deleteRegistrationIncentive(idIncentiveRegistration: number): Observable<IncentiveRegistrationEntity> {
    return this.httpClient.delete<IncentiveRegistrationEntity>(AcmURLConstants.DELETE_INCENTIVE_REGISTRATION + idIncentiveRegistration);
  }
  /**
   * find pagination
   * @param incentiveRegistrationPaginationEntity IncentiveRegistrationPaginationEntity
   * @returns list of incentive registration settings
   */
  findPagination(incentiveRegistrationPaginationEntity: IncentiveRegistrationPaginationEntity):
   Observable<IncentiveRegistrationPaginationEntity> {
    return this.httpClient.post<IncentiveRegistrationPaginationEntity>(AcmURLConstants.FIND_PAGINATION_REGISTRATION,
       incentiveRegistrationPaginationEntity);
  }
}
