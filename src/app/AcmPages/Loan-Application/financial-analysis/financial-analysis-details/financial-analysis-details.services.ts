import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AcmURLConstants} from '../../../../shared/acm-url-constants';
import {Injectable} from '@angular/core';
import {FinancialAnalysisEntity} from '../../../../shared/Entities/financialAnalysis.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';

@Injectable({
  providedIn: 'root'
})
export class FinancialAnalysisDetailsServices {
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * loan_financial_analysis_byIdLoanExtern by given param
   * @param string the idLoanExtern
   */
  loan_financial_analysis_byIdLoanExtern(idLoanExtern: string): Observable<FinancialAnalysisEntity[]> {
    return this.httpClient.get<FinancialAnalysisEntity[]>(AcmURLConstants.LOAN_FINANCIAL_ANALYSIS + idLoanExtern);
  }

  loan_financial_analysis_byloan(loan: LoanEntity): Observable<FinancialAnalysisEntity> {
    return this.httpClient.post<FinancialAnalysisEntity>(AcmURLConstants.LOAN_FINANCIAL_ANALYSIS_NEW, loan);
  }
}
