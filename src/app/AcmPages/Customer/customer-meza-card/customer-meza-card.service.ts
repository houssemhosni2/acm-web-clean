import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerPaginationEntity } from 'src/app/shared/Entities/customer.pagination.entity';
import { CustomerMezaCardStatutEntity } from 'src/app/shared/Entities/customerMezaCardStatut.entity';

@Injectable({
  providedIn: 'root'
})
export class CustomerMezaCardService {

 /**
  * constructor
  * @param httpClient HttpClient
  */
  constructor(public httpClient: HttpClient) {
  }
 /**
  * getCustomerForMezaCard Pagination
  * @param customerPaginationEntity CustomerPaginationEntity
  * @returns customerPaginationEntity CustomerPaginationEntity
  */
  getCustomerForMezaCardPagination(customerPaginationEntity: CustomerPaginationEntity): Observable<CustomerPaginationEntity> {
    return this.httpClient.post<CustomerPaginationEntity>(AcmURLConstants.GET_CUSTOMER_PAGINATION_FOR_MEZA_CARD, customerPaginationEntity);
  }

  /**
   * methode countCustomerMezaCardByStatut
   */
  countCustomerMezaCardByStatut(): Observable<CustomerMezaCardStatutEntity> {
    return this.httpClient.get<CustomerMezaCardStatutEntity>(AcmURLConstants.COUNT_CUSTOMER_MEZA_CARD);
  }
  /**
   * updateAllCustomerMezaCard
   */
  updateAllCustomerMezaCard(customerEntity: CustomerEntity[]) {
    return this.httpClient.put<CustomerEntity[]>(AcmURLConstants.UPDATE_ALL_CUSTOMER_MEZA_CARD, customerEntity);
  }
}
