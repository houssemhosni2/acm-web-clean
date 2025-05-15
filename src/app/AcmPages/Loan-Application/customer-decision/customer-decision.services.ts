import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AcmURLConstants } from '../../../shared/acm-url-constants';
import { Observable } from 'rxjs';
import { CustomerDecisionEntity } from '../../../shared/Entities/customerDecision.entity';

@Injectable({
  providedIn: 'root'
})
export class CustomerDecisionServices {
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * findCustomerDecision by given params
   * @param CustomerDecisionEntity the customerDecisionEntity
   */
  findCustomerDecision(customerDecisionEntity: CustomerDecisionEntity): Observable<CustomerDecisionEntity[]> {
    return this.httpClient.post<CustomerDecisionEntity[]>(AcmURLConstants.LOAN_CUSTOMER_DECISION_FIND, customerDecisionEntity);
  }
}
