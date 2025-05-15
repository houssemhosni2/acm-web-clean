import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AcmURLConstants} from '../../../shared/acm-url-constants';
import {CustomerAccountEntity} from '../../../shared/Entities/customer.account.entity';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { InformationsPaymentEntity } from 'src/app/shared/Entities/InformationsPayment.entity';
import { AcmTransaction } from 'src/app/shared/Entities/AcmTransaction.entity';

@Injectable({
  providedIn: 'root'
})
export class CustomerAccount360Service {

  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * getCustomers Account
   */
  getCustomersAccount(customer: CustomerEntity): Observable<CustomerAccountEntity[]>  {
    return this.httpClient.post<CustomerAccountEntity[]>(AcmURLConstants.GET_CUSTOMERS_ACCOUNT_BY_CUSTOMER , customer);
  }
  /**
   * getCustomers Payment Allocation
   */
  getCustomersPaymentAllocation(idCustomer: number, accountNumberExtern : string): Observable<ScheduleEntity[]>  {
    return this.httpClient.get<ScheduleEntity[]>(AcmURLConstants.GET_PAYMENT_ALLOCATION_CUSTOMERS_BY_CUSTOMER_ACCOUNT + idCustomer + '/' + accountNumberExtern);
  }
  /**
   * getAcmInformationsPayment
   * @param customerAccountEntity CustomerAccountEntity
   * @returns InformationsPaymentEntity
   */
  getAcmInformationsPayment(customerAccountEntity: CustomerAccountEntity): Observable<InformationsPaymentEntity> {
    return this.httpClient.post<InformationsPaymentEntity>(AcmURLConstants.FIND_ACM_INFORMATIONS_PAYMENT,customerAccountEntity);
  }
  /**
   * pay
   * @param informationsPaymentEntity InformationsPaymentEntity
   * @returns any
   */
  pay(informationsPaymentEntity: InformationsPaymentEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.PAY,informationsPaymentEntity);
  }

  payOut(informationsPaymentEntity: InformationsPaymentEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.PAY_OUT,informationsPaymentEntity);
  }

  findTransaction(acmTransaction: AcmTransaction): Observable<AcmTransaction[]> {
    return this.httpClient.post<AcmTransaction[]>(AcmURLConstants.FIND_ACM_TRANSACTION, acmTransaction);
  }
 
}
