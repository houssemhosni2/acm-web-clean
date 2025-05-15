import { Injectable } from '@angular/core';
import {CustomerContactEntity} from '../../../shared/Entities/CustomerContactEntity';
import {Observable} from 'rxjs';
import {AcmURLConstants} from '../../../shared/acm-url-constants';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerMessageService {

  constructor(public httpClient: HttpClient) { }

  /**
   * Find List Message
   */
  findCustomerContactList(customerContactEntity: CustomerContactEntity): Observable<CustomerContactEntity[]> {
    return this.httpClient.post<CustomerContactEntity[]>(AcmURLConstants.FIND_MAIL_CUSTOMER, customerContactEntity);
  }
  /**
   *
   * @param customerContactEntity CustomerContactEntity
   */
  updateCustomerContact(customerContactEntity: CustomerContactEntity): Observable<CustomerContactEntity> {
    return this.httpClient.put<CustomerContactEntity>(AcmURLConstants.UPDATE_MAIL_CUSTOMER, customerContactEntity);
  }
}
