import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChargeFeeEntity } from 'src/app/shared/Entities/ChargeFee.entity';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';


@Injectable({
  providedIn: 'root'
})
export class ChargeFeeService {

  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }
  save(chargeFee: ChargeFeeEntity): Observable<ChargeFeeEntity> {
    return this.httpClient.post<ChargeFeeEntity>(AcmURLConstants.CREATE_CHARGE_FEE, chargeFee);
  }
  find(chargeFee: ChargeFeeEntity): Observable<ChargeFeeEntity[]> {
    return this.httpClient.post<ChargeFeeEntity[]>(AcmURLConstants.FIND_CHARGE_FEE, chargeFee);
  }
  update(chargeFee: ChargeFeeEntity): Observable<ChargeFeeEntity> {
    return this.httpClient.put<ChargeFeeEntity>(AcmURLConstants.UPDATE_CHARGE_FEE, chargeFee);
  }
  delete(chargeFeeId: any): Observable<any> {
    return this.httpClient.delete<any>(AcmURLConstants.DELETE_CHARGE_FEE + chargeFeeId);
  }
}