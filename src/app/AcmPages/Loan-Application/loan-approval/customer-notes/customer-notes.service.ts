import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcmURLConstants } from '../../../../shared/acm-url-constants';
import { CustomerDecisionEntity } from '../../../../shared/Entities/customerDecision.entity';
import { LoanNoteHistory } from 'src/app/shared/Entities/loan.note.history';

@Injectable({
  providedIn: 'root'
})
export class CustomerNotesService {

  constructor(public httpClient: HttpClient) {
  }

  /**
   * get customer notes
   * @param customerDecisionEntity the customerDecisionEntity
   */
  getCustomerNotes(customerDecisionEntity: CustomerDecisionEntity): Observable<CustomerDecisionEntity[]> {
    return this.httpClient.post<CustomerDecisionEntity[]>(AcmURLConstants.GET_CUSTOMER_NOTE, customerDecisionEntity);
  }

  /**
   * save Note
   * @param customerDecisionEntity the customerDecisionEntity
   */
  saveNote(customerDecisionEntity: CustomerDecisionEntity): Observable<CustomerDecisionEntity> {
    return this.httpClient.post<CustomerDecisionEntity>(AcmURLConstants.LOAN_CUSTOMER_DECISION_CREATE, customerDecisionEntity);
  }

  /**
   * get Loan Historique Notes
   * @param loanNoteHistory loanNoteHistory
   */
  getLoanHistoriqueNotesNotes(loanNoteHistory: LoanNoteHistory): Observable<LoanNoteHistory[]> {
    return this.httpClient.post<LoanNoteHistory[]>(AcmURLConstants.GET_LOAN_HISTORIQUE_NOTES, loanNoteHistory);
  }
}
