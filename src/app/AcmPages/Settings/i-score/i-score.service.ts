import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AcmURLConstants} from '../../../shared/acm-url-constants';

@Injectable({
  providedIn: 'root'
})

export class IScoreService {
  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * generate File I-SCORE
   */
  generateFile(reportStartDate :string, reportEndDate :string): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.GENERATE_FILE+ reportStartDate+"/"+reportEndDate , { responseType: 'blob' as 'json' });
  }
  getRejectFile(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.GET_REJECT_FILE , { responseType: 'blob' as 'json' });
  }
}
