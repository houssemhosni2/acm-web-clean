import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { LoanGuarantorSourceEntity } from 'src/app/shared/Entities/loanGuarantorSource.entity';
import { LoanRefinanceReasonEntity } from 'src/app/shared/Entities/loanRefinanceReason.entity';
import { LoanSourceOfFundsEntity } from 'src/app/shared/Entities/loanSourceOfFunds.entity';
import { ProductLoanReasonEntity } from 'src/app/shared/Entities/productLoanReason.entity';
import { ClaimsEntity } from 'src/app/shared/Entities/claims.entity';
import { ProductCustomerEntity } from 'src/app/shared/Entities/ProductCustomer.entity';
import { ClaimsPaginationEntity } from 'src/app/shared/Entities/claimsPagination.entity';

@Injectable({
  providedIn: 'root'
})
export class LoanManagementService {

  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * create loan to abacus
   * @param loanEntity LoanEntity
   */
  createLoan(loanEntity: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.CREATE_LOAN, loanEntity);
  }
  /**
   * topup or refinance loan
   * @param loanEntity LoanEntity
   */
  createTopUpRefinanceLoan(loanEntity: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.put<LoanEntity[]>(AcmURLConstants.CREATE_TOPUP_REFINANCE_LOAN, loanEntity);
  }
  /**
   * getUsersBranch
   */
  getUsersBranch(): Observable<UserEntity[]> {
    return this.httpClient.get<UserEntity[]>(AcmURLConstants.GET_USERS_BRANCH);
  }

  /**
   * Get all Product
   */
  getProducts(productEntity: ProductEntity): Observable<ProductEntity[]> {
    return this.httpClient.post<ProductEntity[]>(AcmURLConstants.PRODUCT_DETAILS, productEntity);
  }

  /**
   * Get Eligible products
   */
  getEligibleProducts(wrapper: ProductCustomerEntity): Observable<ProductEntity[]> {
    return this.httpClient.post<ProductEntity[]>(AcmURLConstants.ELIGIBLE_PRODUCTS, wrapper);
  }

  getProductByIb(productId: number): Observable<ProductEntity> {
    return this.httpClient.get<ProductEntity>(AcmURLConstants.PRODUCT_DETAILS + productId);
  }

  /**
   * Get all loan guarantor source
   */
  getLoanGuarantorSource(): Observable<LoanGuarantorSourceEntity[]> {
    return this.httpClient.get<LoanGuarantorSourceEntity[]>(AcmURLConstants.LOAD_GUARANTOR_SOURCE);
  }

  /**
   * Get all loan refinance reason
   */
  getLoanRefinanceReason(): Observable<LoanRefinanceReasonEntity[]> {
    return this.httpClient.get<LoanRefinanceReasonEntity[]>(AcmURLConstants.LOAD_REFINANCE_REASON);
  }

  /**
   * Get all loan source of funds
   */
  getLoanSourceOfFunds(): Observable<LoanSourceOfFundsEntity[]> {
    return this.httpClient.get<LoanSourceOfFundsEntity[]>(AcmURLConstants.LOAD_SOURCE_OF_FUNDS);
  }

  /**
   * Get all loan refinance reason
   */
  getProductLoanReason(): Observable<ProductLoanReasonEntity[]> {
    return this.httpClient.get<ProductLoanReasonEntity[]>(AcmURLConstants.LOAD_PRODUCT_LOAN_REASON);
  }

  /**
   * update loan to abacus
   * @param loanEntity LoanEntity
   */
  updateLoan(loanEntity: LoanEntity): Observable<LoanEntity> {
    return this.httpClient.put<LoanEntity>(AcmURLConstants.UPDATE_LOAN, loanEntity);
  }

  /**
   * create loan group to abacus
   * @param loanEntitys LoanEntity[]
   */
  createLoanGroup(loanEntitys: LoanEntity[]): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.CREATE_LOAN_GROUP, loanEntitys);
  }
  /**
   * Find all portfolio
   */
  findAllPortfolio(userEntity: UserEntity): Observable<UserEntity[]> {
    return this.httpClient.post<UserEntity[]>(AcmURLConstants.FIND_PORTFOLIO, userEntity);
  }

  /**
   * update loan Group to abacus
   * @param loansEntity LoanEntity[]
   */
  updateLoanForGroup(loansEntity: LoanEntity[]): Observable<LoanEntity[]> {
    return this.httpClient.put<LoanEntity[]>(AcmURLConstants.UPDATE_LOAN_GROUP, loansEntity);
  }

  /**
   * getCustomerActiveAccount
   * @param idCustomer number
   * @param idProduct number
   */
  getCustomerActiveAccount(idCustomer: number, idProduct: number): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.GET_CUSTOMER_ACTIVE_ACCOUNT + idCustomer + '/' + idProduct);
  }

  /**
   * getCustomerPaidAccount
   * @param idCustomer number
   * @param idProduct number
   * @returns number
   */
  getCustomerPaidAccount(idCustomer: number, idProduct: number): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.GET_CUSTOMER_PAID_ACCOUNT + idCustomer + '/' + idProduct);
  }
  /**
   * assign loan to the connected user
   * @param loanEntity LoanEntity
   * @returns loan assigned
   */
  assignLoan(loanEntity: LoanEntity): Observable<LoanEntity> {
    return this.httpClient.put<LoanEntity>(AcmURLConstants.ASSIGN_LOAN, loanEntity);
  }



  findClaimsBystatus(claimsEntity: ClaimsEntity) {
    return this.httpClient.post<ClaimsEntity[]>(AcmURLConstants.FIND_CLAIMS_FROM_IB, claimsEntity);

  }
  updateClaimsInIb(claimsEntity: ClaimsEntity) {
    return this.httpClient.post<ClaimsEntity>(AcmURLConstants.UPDATE_CLAIMS_IN_IB, claimsEntity);

  }
      /**
   * find pagination by given params
   * @param claimsListEntity the claimsListEntity
   */
      findClaimsPagination(claimsPaginationEntity: ClaimsPaginationEntity): Observable<ClaimsPaginationEntity> {
        return this.httpClient.post<ClaimsPaginationEntity>(AcmURLConstants.CLAIMS_FIND_PAGINATION, claimsPaginationEntity);
      }

  /**
   * get loan by id ib Loan
   * @param idIbLoan
   * @returns LoanEntity
   */
  findLoanByIdIB(idIbLoan: number): Observable<LoanEntity[]> {
    return this.httpClient.get<LoanEntity[]>(AcmURLConstants.FIND_LOAN_BY_IB_ID + idIbLoan);
  }

  findCustomerBalance(idAcmCustome: number): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.FIND_CUSTOMER_BALANCE_FROM_ACM + idAcmCustome);
  }
}
