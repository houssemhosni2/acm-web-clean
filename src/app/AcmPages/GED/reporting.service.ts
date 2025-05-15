import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { Observable } from 'rxjs';
import { ReportEntity } from 'src/app/shared/Entities/report.entity';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(public httpClient: HttpClient) { }

  /**
   * downloadTemplate by given params
   * @param LoanReportEntity loanReportDTO
   */
  downloadTemplate(reportDTO: ReportEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.GENERATE_LOAN_REPORT, reportDTO, { responseType: 'blob' as 'json' });
  }

  /**
   * downloadCustomReport by given params
   * @param LoanReportEntity loanReportDTO
   */
  downloadCustomReport(reportDTO: ReportEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.GENERATE_CUSTOM_REPORT, reportDTO,
      { responseType: 'blob' as 'json' });
  }

}
