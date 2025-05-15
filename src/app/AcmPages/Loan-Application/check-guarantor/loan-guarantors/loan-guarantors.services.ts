import {HttpClient} from '@angular/common/http';
import {GuarantorEntity} from '../../../../shared/Entities/guarantor.entity';
import {AcmURLConstants} from '../../../../shared/acm-url-constants';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanGuarantorsServices {
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * loan_guarantors_byIdLoanExtern by given param
   * @param string the idLoanExtern
   * TO DO A REMPLACER PAR ACM
   */
  loan_guarantors_byIdLoanExtern(idLoanExtern: string) {
    return this.httpClient.get<GuarantorEntity[]>(AcmURLConstants.LOAN_GUARANTOR + idLoanExtern);
  }
  /**
   * getApplicationFee by given param
   * @param IdAccount idAccount
   */
  getApplicationFee(idAccount: number): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.GET_APPLICATION_FEE + idAccount);
  }
}
