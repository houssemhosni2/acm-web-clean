import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GuarantorEntity} from '../../../../shared/Entities/guarantor.entity';
import {AcmURLConstants} from '../../../../shared/acm-url-constants';
import {CustomerLinksRelationshipEntity} from '../../../../shared/Entities/CustomerLinksRelationship.entity';
import {Observable} from 'rxjs';
import { CustomerActiveAccountEntity } from 'src/app/shared/Entities/customer.active.account.entity';

@Injectable({
  providedIn: 'root'
})
export class GuarantorsDetailsService {
  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * loan_guarantors_byIdLoanExtern by given param
   * @param idLoanExtern string
   */
  loan_guarantors_byIdLoanExtern(idLoanExtern: string) {
    return this.httpClient.get<GuarantorEntity[]>(AcmURLConstants.LOAN_GUARANTOR + idLoanExtern);
  }

  /**
   * findCustomerLinkRelationShip
   */
  findCustomerLinkRelationShip(customerLinksRelationshipEntity: CustomerLinksRelationshipEntity):
    Observable<CustomerLinksRelationshipEntity[]>  {
    return this.httpClient.post<CustomerLinksRelationshipEntity[]>
    (AcmURLConstants.GET_CUSTOMER_LINKS_RELATIONSHIP, customerLinksRelationshipEntity);
  }
  findGuarantorsFromIbAndSaveInAcm(customerLinksRelationshipEntity: CustomerLinksRelationshipEntity): Observable<CustomerLinksRelationshipEntity[]> {
    return this.httpClient.post<CustomerLinksRelationshipEntity[]>(AcmURLConstants.GET_GUARANTOR_FROM_IB_AND_SAVE_IN_ACM, customerLinksRelationshipEntity);
  }
  /**
   * findCustomerActiveGuarantor (Only to get active guarantor, Date fin was null)
   * @param customerLinksRelationshipEntity CustomerLinksRelationshipEntity
   */
  findCustomerActiveGuarantor(customerLinksRelationshipEntity: CustomerLinksRelationshipEntity):
    Observable<CustomerLinksRelationshipEntity[]>  {
    return this.httpClient.post<CustomerLinksRelationshipEntity[]>
    (AcmURLConstants.GET_CUSTOMER_ACTIVE_GUARANTOR, customerLinksRelationshipEntity);
  }
  /**
   * findAllActiveAccountsForCustomer by given param
   * @param idCustomerExtern number
   */
  findAllActiveAccountsForCustomer(idCustomerExtern: number) {
    return this.httpClient.get<CustomerActiveAccountEntity[]>(AcmURLConstants.GET_ALL_ACTIVE_ACCOUNTS_FOR_CUSTOMER + idCustomerExtern);
  }
}
