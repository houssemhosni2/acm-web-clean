import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { ConditionalApproveEntity } from 'src/app/shared/Entities/conditionalApprove.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
@Injectable({
  providedIn: 'root'
})
export class ConditionnalApproveService {

  constructor(public httpClient: HttpClient) {
  }

  create(conditionalApproveEntitys: ConditionalApproveEntity[]): Observable<ConditionalApproveEntity[]> {
    return this.httpClient.post<ConditionalApproveEntity[]>(AcmURLConstants.CREATE_CONDITONAL_APPROVE, conditionalApproveEntitys);
  }

  find(conditionalApproveEntity: ConditionalApproveEntity): Observable<ConditionalApproveEntity[]> {
    return this.httpClient.post<ConditionalApproveEntity[]>(AcmURLConstants.FIND_CONDITONAL_APPROVE_LOAN_ID, conditionalApproveEntity);
  }
  update(conditionalApproveEntity: ConditionalApproveEntity): Observable<ConditionalApproveEntity> {
    return this.httpClient.post<ConditionalApproveEntity>(AcmURLConstants.UPDATE_CONDITONAL_APPROVE, conditionalApproveEntity);
  }
  countConditionalApproveByLoanId(loan: LoanEntity): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.COUNT_CONDITONAL_APPROVE_LOAN_ID+loan.loanId);
  }

}
