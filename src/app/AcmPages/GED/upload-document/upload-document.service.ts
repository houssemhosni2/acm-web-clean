import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AcmURLConstants} from '../../../shared/acm-url-constants';
import {LoanEntity} from '../../../shared/Entities/loan.entity';

@Injectable({
  providedIn: 'root'
})
export class UploadDocumentService {

  public loanEntity: LoanEntity = new LoanEntity();

  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  loan(): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.FIND_LOANS, this.loanEntity);
  }
}
