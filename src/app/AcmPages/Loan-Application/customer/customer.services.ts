import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomerEntity} from '../../../shared/Entities/customer.entity';
import {AcmURLConstants} from '../../../shared/acm-url-constants';
import {Injectable} from '@angular/core';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import {ArrearsEntity} from '../../../shared/Entities/Arrears.entity';
import {UserEntity} from '../../../shared/Entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class CustomerServices {
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * getCustomerByOwner
   */
  getCustomerByOwner(): Observable<CustomerEntity[]> {
    return this.httpClient.get<CustomerEntity[]>(AcmURLConstants.GET_CUSTOMERS);
  }
  /**
   * findCustomers by given params
   * @param CustomerEntity the customerEntity
   */
  findCustomer(customerEntity: CustomerEntity): Observable<CustomerEntity[]> {
    return this.httpClient.post<CustomerEntity[]>(AcmURLConstants.FIND_CUSTOMERS, customerEntity);
  }

  /**
   *
   * @param customerLinksRelationshipEntity customerLinksRelationshipEntity
   */
  findCustomerLinkRelationShip(customerLinksRelationshipEntity: CustomerLinksRelationshipEntity):
  Observable<CustomerLinksRelationshipEntity[]>  {
    return this.httpClient.post<CustomerLinksRelationshipEntity[]>
    (AcmURLConstants.GET_CUSTOMER_LINKS_RELATIONSHIP, customerLinksRelationshipEntity);
  }

  /**
   * getCustomer Pagination
   */
  getCustomerInformation(id: number): Observable<CustomerEntity>  {
    return this.httpClient.get<CustomerEntity>(AcmURLConstants.GET_CUSTOMER_DETAILS_ACM + id);
  }

  /**
   * getCustomerArrears
   * @param idCustomer number
   */
  getCustomerArrears(idCustomer: number): Observable<ArrearsEntity> {
    return this.httpClient.get<ArrearsEntity>(AcmURLConstants.GET_CUSTOMER_ARREARS + idCustomer );
  }

  /**
   * Resend Login to Customer
   * @param customerEntity CustomerEntity
   */
  sendLoginCustomer(customerEntity: CustomerEntity): Observable<UserEntity> {
    return this.httpClient.post<UserEntity>(AcmURLConstants.RESEND_LOGIN, customerEntity );
  }

  /**
   * Update customer
   * @param uploadedFiles photo
   * @param customerEntity CustomerEntity
   */
  updateCustomerPhoto(uploadedFiles: any[], customerEntity: CustomerEntity): Observable<any> {
    const formdata = new FormData();
    for (const i of uploadedFiles) {
      formdata.append('photo', i);
    }
    formdata.append('idCustomer', JSON.stringify(customerEntity.id));
    return this.httpClient.post<any>(AcmURLConstants.UPDATE_PHOTO_CUSTOMER, formdata, {responseType: 'blob' as 'json'});
  }

  /**
   * get Customer Photo
   * @param idCustomer number
   */
  getCustomerPhoto(idCustomer: number): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.GET_PHOTO_CUSTOMER + idCustomer, {responseType: 'blob' as 'json'});
  }

  /**
   * getCustomer idExtrn by
   */
  getCustomerInformationByIdExtrn(idExtrn: number): Observable<CustomerEntity>  {
    return this.httpClient.get<CustomerEntity>(AcmURLConstants.GET_CUSTOMER_DETAILS_ACM_EXTRN_ID + idExtrn);
  }
/**
 * get Customer Information From IB
 *
 * @param idIbCustomer number
 * @returns CustomerEntity[]
 */
  getCustomerInformationFromIB(customer: CustomerEntity) :  Observable<CustomerEntity[]> {
    return this.httpClient.post<CustomerEntity[]>(AcmURLConstants.GET_CUSTOMER_DETAILS_FROM_IB , customer);
  }
/**
 * get All Customer Information From Ib
 *
 * @param customer CustomerEntity
 * @returns CustomerEntity[]
 */
  getAllCustomerInformationFromIb(customer: CustomerEntity): Observable<CustomerEntity[]> {
    return this.httpClient.post<CustomerEntity[]>(AcmURLConstants.GET_ALL_CUSTOMER_INFORMATION_FROM_IB, customer);
  }
}
