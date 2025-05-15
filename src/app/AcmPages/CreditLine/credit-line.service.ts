import { toppedUpHistoryEntity } from 'src/app/shared/Entities/AcmToppedUpHistory.entity';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { creditLineEntity } from 'src/app/shared/Entities/AcmCreditLine.entity';
import { Observable } from 'rxjs';
import { CreditLinePaginationEntity } from 'src/app/shared/Entities/CreditLinePagination.entity';
import { CreditLineAccountPaginationEntity } from 'src/app/shared/Entities/CreditLineAccountPagination.entity';
import { CreditLineAccount } from 'src/app/shared/Entities/acmCreditLineAccount.entity';
import { CreditLineAssignmentProcessResponse } from 'src/app/shared/Entities/CreditLineAssignmentProcessResponse.entity';
import { AcmCreditLineAssignmentHistory } from 'src/app/shared/Entities/AcmCreditLineAssignmentHistory.entity';

@Injectable({
  providedIn: 'root'
})
export class CreditLineService {

  constructor(public httpClient: HttpClient) { }

  createCreditLine(creditLine: creditLineEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.CREATE_CREDIT_LINE, creditLine);
  }

  findCreditLinePagination(creditLinePaginationEntity:
    CreditLinePaginationEntity): Observable<CreditLinePaginationEntity> {
    return this.httpClient.post<CreditLinePaginationEntity>(
      AcmURLConstants.CREDIT_LINE_PAGINATION, creditLinePaginationEntity);
  }

  deleteToppedUpHistory(toppedUpHistories: toppedUpHistoryEntity[]): Observable<void> {
    return this.httpClient.post<void>(
      AcmURLConstants.DELETE_TOPPED_UP_HISTORY, toppedUpHistories);
  }

  syncCreditLineAccounts(): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.SYNC_CREDIT_LINE_ACCOUNTS);
  }

  findCreditLineAccountPagination(creditLineAccountPaginationEntity:
    CreditLineAccountPaginationEntity): Observable<CreditLineAccountPaginationEntity> {
    return this.httpClient.post<CreditLineAccountPaginationEntity>(
      AcmURLConstants.CREDIT_LINE_ACCOUNT_PAGINATION, creditLineAccountPaginationEntity);
  }

  exportExcel(creditLineAccountPaginationEntity:
    CreditLineAccountPaginationEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.CREDIT_LINE_ACCOUNT_REPORT_EXCEL, creditLineAccountPaginationEntity,
      { responseType: 'blob' as 'json' });
  }

  findAll(): Observable<creditLineEntity[]> {
    return this.httpClient.get<creditLineEntity[]>(AcmURLConstants.CREDIT_LINE_FIND_ALL);
  }

  assignProcess(acmCreditLineAccount: CreditLineAccount[]){
    return this.httpClient.post<CreditLineAssignmentProcessResponse>(
      AcmURLConstants.CREDIT_LINE_ASSIGNMENT_PROCESS, acmCreditLineAccount);
  }

  unAssignProcess(acmCreditLineAccount: CreditLineAccount[]){
    return this.httpClient.post<CreditLineAssignmentProcessResponse>(
      AcmURLConstants.CREDIT_LINE_UNASSIGNMENT_PROCESS, acmCreditLineAccount);
  }

  uploadBulkAssignmentFile(uploadedFile: any) : Observable<CreditLineAccount[]>{
    const formData = new FormData();
    formData.append('uploadedFile', uploadedFile);
    return this.httpClient.post<CreditLineAccount[]>(AcmURLConstants.CREDIT_LINE_UPLOAD_ASSIGNMENT_FILE, formData);
  }

  generateCreditLineHistoryExcelReport(acmCreditLineAssignmentHistory:
    AcmCreditLineAssignmentHistory): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.CREDIT_LINE_HISTORY_REPORT_EXCEL, acmCreditLineAssignmentHistory,
      { responseType: 'blob' as 'json' });
  }

  generateCreditLineSummaryExcelReport() : Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.CREDIT_LINE_SUMMARY_REPORT_EXCEL, null,
      { responseType: 'blob' as 'json' });
  }

  generateCreditLineSummaryPdfReport() : Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.CREDIT_LINE_SUMMARY_REPORT_PDF, null,
      { responseType: 'blob' as 'json' });
  }

  generateCreditLineHistoryPdfReport(acmCreditLineAssignmentHistory:
    AcmCreditLineAssignmentHistory): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.CREDIT_LINE_HISTORY_REPORT_PDF, acmCreditLineAssignmentHistory,
      { responseType: 'blob' as 'json' });
  }
}
