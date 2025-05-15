import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';

@Injectable({
  providedIn: 'root'
})
export class TopupRefinanceService {

  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(private httpClient: HttpClient) {
  }

  /**
   * get open balance for topuping / refinancing loan
   * @param idLoanExtern id loan extern
   */
  getOpenBalance(idLoanExtern: number): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.CLOSE_BALANCE_ISSUED_LOAN + idLoanExtern);
  }
}
