import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AcmURLConstants} from '../../../../shared/acm-url-constants';
import {ReportVisitEntity} from '../../../../shared/Entities/reportVisit.entity';
import {Observable} from 'rxjs';
import {UserEntity} from 'src/app/shared/Entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class VisitReportServices {
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * saveVisitReport
   * @param ReportVisitEntity reportVisitEntity
   */
  saveVisitReport(reportVisitEntity: ReportVisitEntity): Observable<ReportVisitEntity> {
    return this.httpClient.post<ReportVisitEntity>(AcmURLConstants.CREATE_REPORT_VISIT, reportVisitEntity);
  }

  /**
   * getVisitReport
   * @param ReportVisitEntity reportVisitEntity
   */
  getVisitReport(reportVisitEntity: ReportVisitEntity): Observable<ReportVisitEntity[]> {
    return this.httpClient.post<ReportVisitEntity[]>(AcmURLConstants.GET_REPORT_VISIT, reportVisitEntity);
  }

  /**
   * getUsersVisit
   */
  getUsersVisit(): Observable<UserEntity[]> {
    return this.httpClient.get<UserEntity[]>(AcmURLConstants.LOAD_USERS_ALL_HIERARCHICAL_TYPE);
  }
}
