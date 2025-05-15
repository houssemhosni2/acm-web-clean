import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { LoanIbEntity } from 'src/app/shared/Entities/loanIb.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { LoanIbPaginationEntity } from 'src/app/shared/Entities/loanIbPaginationEntity.entity';
import { LoanStatutEntity } from 'src/app/shared/Entities/loan.statut.entity';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';

@Injectable({
  providedIn: 'root'
})
export class OnlineApplicationsService {

  constructor(public httpClient: HttpClient) {
  }

  /**
   * find by given params
   * @param loanIbEntity the loanIbEntity
   */
  find(loanIbEntity: LoanIbEntity): Observable<LoanIbEntity[]> {
    return this.httpClient.post<LoanIbEntity[]>(AcmURLConstants.LOAD_LOAN_IB, loanIbEntity);
  }

  /**
   * getUsersBranch
   */
  getUsersBranch(): Observable<UserEntity[]> {
    return this.httpClient.get<UserEntity[]>(AcmURLConstants.GET_USERS_BRANCH);
  }

  /**
   * assign loan
   * @param loanIbEntity loanIbEntity
   */
  assignLoanIb(loanIbEntitys: LoanIbEntity[]) {
    return this.httpClient.put<LoanIbEntity>(AcmURLConstants.ASSIGN_LOAN_IB, loanIbEntitys);
  }

  /**
   * update loanIb
   * @param loanIbEntity loanIbEntity
   */
  updateLoanIb(loanIbEntitys: LoanIbEntity) {
    return this.httpClient.put<LoanIbEntity>(AcmURLConstants.UPDATE_LOAN_IB, loanIbEntitys);
  }

  /**
   * load Loans Ib By Status and paginations
   * @param LoanIbPaginationEntity LoanIbPaginationEntity
   */
  loadLoanIbByStatusPagination(loanIbPaginationEntity: LoanIbPaginationEntity): Observable<LoanIbPaginationEntity> {
    return this.httpClient.post<LoanIbPaginationEntity>(AcmURLConstants.FIND_LOANS_IB_PAGINATIONS, loanIbPaginationEntity);
  }

  /**
   * load Filter list Product By Status
   * @param loanEntity loanEntity
   */
  loadFilterProductIb(loanIbEntity: LoanIbEntity): Observable<LoanIbEntity[]> {
    return this.httpClient.post<LoanIbEntity[]>(AcmURLConstants.LOAD_FILTER_PRODUCT_IB, loanIbEntity);
  }
  /**
   * accept loanIb
   * @param loanIbEntity loanIbEntity
   */
  acceptLoanIb(loanIbEntitys: LoanIbEntity) {
    return this.httpClient.put<LoanIbEntity>(AcmURLConstants.ACCEPT_LOAN_IB, loanIbEntitys);
  }

  /**
   * methode countLoanIbByStatut
   */
  countLoanIbByStatut(): Observable<LoanStatutEntity> {
    return this.httpClient.get<LoanStatutEntity>(AcmURLConstants.COUNT_LOANS_IB);
  }

  /**
   * findCustomerLinkRelationShip
   */
  findCustomerLinkRelationShip(customerLinksRelationshipEntity: CustomerLinksRelationshipEntity):
    Observable<CustomerLinksRelationshipEntity[]> {
    return this.httpClient.post<CustomerLinksRelationshipEntity[]>
      (AcmURLConstants.GET_CUSTOMER_LINKS_RELATIONSHIP, customerLinksRelationshipEntity);
  }
  /**
   * Get Product details by Id
   * @param productId productId
   */
  getProduct(productId: number): Observable<ProductEntity> {
    return this.httpClient.get<ProductEntity>(AcmURLConstants.PRODUCT_DETAILS + productId);
  }
}
