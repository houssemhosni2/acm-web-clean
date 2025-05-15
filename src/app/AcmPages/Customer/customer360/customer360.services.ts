import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AcmURLConstants} from '../../../shared/acm-url-constants';
import {AddressEntity} from '../../../shared/Entities/Address.entity';
import {AddressHistoriqueEntity} from '../../../shared/Entities/AddressHistorique.entity';
import {LoanEntity} from '../../../shared/Entities/loan.entity';
import { SettingTopupValidityEntity } from 'src/app/shared/Entities/SettingTopupValidity.entity';

@Injectable({
  providedIn: 'root'
})
export class Customer360Services {
  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * save All Address via 360
   */
  saveAllAddress(addressEntity: AddressEntity): Observable<AddressEntity> {
    return this.httpClient.put<AddressEntity>(AcmURLConstants.SAVE_ALL_CUSTOMER_ADDRESS, addressEntity);
  }

  /**
   * get Address Historique
   */
  getAddressHistorique(addressEntity: AddressHistoriqueEntity): Observable<AddressHistoriqueEntity[]> {
    return this.httpClient.post<AddressHistoriqueEntity[]>(AcmURLConstants.GET_ADDRESS_HISTORQUE, addressEntity);
  }

  /**
   * List of loan
   */
  findLoan(loanDTO: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.FIND_LOANS, loanDTO);
  }
  /**
   * get loan by id extern
   * @param idLoanExtern number
   * @returns LoanEntity
   */
  findLoanByIdExtern(idLoanExtern: number): Observable<LoanEntity> {
    return this.httpClient.get<LoanEntity>(AcmURLConstants.FIND_LOAN_BY_EXTERNALID + idLoanExtern);
  }
  /**
   * check if the loan in parameter is valid to create a topup
   * @param loanDTO LoanEntity
   * @returns CanTopupValidityEntity
   */
  checkSettingTopupValidityByLoan(loanDTO: LoanEntity): Observable<SettingTopupValidityEntity> {
    return this.httpClient.post<SettingTopupValidityEntity>(AcmURLConstants.CHECK_SETTING_TOPUP_VALIDITY_BY_LOAN, loanDTO);

  }
}
