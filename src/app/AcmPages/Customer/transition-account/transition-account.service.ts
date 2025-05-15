import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerReceiptsEntity } from 'src/app/shared/Entities/CustomerReceipts.entity';
import { TransitionAccountEntity } from 'src/app/shared/Entities/transition.account.entity';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';

@Injectable({
  providedIn: 'root'
})
export class TransitionAccountService {

  /**
    * constructor
    * @param httpClient HttpClient
    */
  constructor(public httpClient: HttpClient) {
  }


  /**
     * getTransitions Account
     */
  getTransitionsAccount(idCustomer: number): Observable<TransitionAccountEntity[]> {
    return this.httpClient.get<TransitionAccountEntity[]>(AcmURLConstants.FIND_Transition_ACCOUNT_FROM_ABACUS + idCustomer);
  }
  getCustomerReceipts(idCustomer: number): Observable<CustomerReceiptsEntity[]> {
    return this.httpClient.get<CustomerReceiptsEntity[]>(AcmURLConstants.FIND_CUSTOMER_RECEIPTS_FROM_ABACUS + idCustomer);
  }

  findAcmCustomerReceipts(idCustomer: number): Observable<CustomerReceiptsEntity[]> {
    return this.httpClient.get<CustomerReceiptsEntity[]>(AcmURLConstants.FIND_CUSTOMER_RECEIPTS_FROM_ACM + idCustomer);
  }

}
