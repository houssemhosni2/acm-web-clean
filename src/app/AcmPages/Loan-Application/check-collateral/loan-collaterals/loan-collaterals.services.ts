import { HttpClient } from '@angular/common/http';
import { AcmURLConstants } from '../../../../shared/acm-url-constants';
import { Injectable } from '@angular/core';
import { CollaterolEntity } from '../../../../shared/Entities/collaterol.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { Observable } from 'rxjs';
import { CollateralEntity } from 'src/app/shared/Entities/Collateral.entity';
import { LoanCollateralTypeEntity } from 'src/app/shared/Entities/CollateralType.entity';

@Injectable({
  providedIn: 'root'
})
export class LoanCollateralsServices {
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * loan_collaterals_byIdLoanExtern by given param
   * @param string the idLoanExtern
   */
  loan_collaterals_byIdLoanExtern(idLoanExtern: string) {
    return this.httpClient.get<CollaterolEntity[]>(AcmURLConstants.LOAN_COLLATERAL + idLoanExtern);
  }
/**
 * save collateral
 * @param loan LoanEntity
 * @returns void
 */
  saveCollateral(loan: LoanEntity): Observable<void> {
    return this.httpClient.post<void>(AcmURLConstants.SAVE_COLATERAL, loan);
  }
/**
 * find collateral by loan
 * @param collateralEntity CollateralEntity
 * @returns CollateralEntity[]
 */
  findCollateralByLoan(collateralEntity: CollateralEntity): Observable<CollateralEntity[]> {
    return this.httpClient.post<CollateralEntity[]>(AcmURLConstants.FIND_COLATERAL_BY_LOAN, collateralEntity);
  }
  /**
   * find Collateral Types
   * @param collateralType LoanCollateralTypeEntity
   * @returns LoanCollateralTypeEntity[]
   */
  findCollateralTypes(collateralType: LoanCollateralTypeEntity): Observable<LoanCollateralTypeEntity[]> {
    return this.httpClient.post<LoanCollateralTypeEntity[]>(AcmURLConstants.COLLATERAL_TYPES_FIND, collateralType);
  }
  /**
   * get Active And Inactive Collaterals From Abacus
   * @param idLoanExternList string[]
   * @returns CollateralEntity[]
   */
  getActiveAndInactiveCollateralsFromACM(idLoanExternList: number[]) : Observable<CollateralEntity[]>{
    return this.httpClient.post<CollateralEntity[]>(AcmURLConstants.GET_ALL_LOAN_COLLATERAL , idLoanExternList);
  }
  /**
   * saveUpdateDelete
   * @param collateralEntity CollateralEntity
   * @returns CollateralEntity
   */
  saveUpdateDelete(collateralEntity: CollateralEntity): Observable<CollateralEntity> {
    return this.httpClient.post<CollateralEntity>(AcmURLConstants.SAVE_UPDATE_DELETE_COLLATERAL , collateralEntity);
  }
}
