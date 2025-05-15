import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

/**
 * constructor
 * @param httpClient HttpClient
 */

 constructor(public httpClient: HttpClient) {
 }

 /**
  * Get required document
  * @param loanDTO LoanEntity
  */
 loanSchedules(loanDTO: LoanEntity): Observable<ScheduleEntity[]> {
   return this.httpClient.get<ScheduleEntity[]>(AcmURLConstants.LOAN_SCHEDULES + loanDTO.idLoanExtern + '/' + loanDTO.loanId);
 }
}
