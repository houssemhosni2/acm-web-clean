import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { AcmGlAccount } from 'src/app/shared/Entities/AcmGlAccount.entity';
import { AcmGlAccountPagination } from 'src/app/shared/Entities/AcmGlAccountPagination.entity';
import { AcmJournalPagination } from 'src/app/shared/Entities/AcmJournalPagination.entity';

@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountsService {

  constructor(public httpClient: HttpClient) { }

  saveGlAccount(acmGlAccount : AcmGlAccount): Observable<AcmGlAccount> {
    return this.httpClient.post<AcmGlAccount>(AcmURLConstants.SAVE_GL_ACCOUNT, acmGlAccount);
  }

  findGlAccount(acmGlAccount : AcmGlAccount): Observable<AcmGlAccount[]> {
    return this.httpClient.post<AcmGlAccount[]>(AcmURLConstants.FIND_GL_ACCOUNT, acmGlAccount);
  }

  findPaginationGlAccount(acmGlAccountPagination : AcmGlAccountPagination): Observable<AcmGlAccountPagination> {
    return this.httpClient.post<AcmGlAccountPagination>(AcmURLConstants.FIND_PAGINATION_GL_ACCOUNT, acmGlAccountPagination);
  }

  findPaginationJournal(acmJournalPagination : AcmJournalPagination) : Observable<AcmJournalPagination>{
    return this.httpClient.post<AcmJournalPagination>(AcmURLConstants.FIND_PAGINATION_ACM_JOURNAL, acmJournalPagination);
  }

  generateJournalExcelReport(acmJournalPagination : AcmJournalPagination): Observable<any> {
      return this.httpClient.post<any>(AcmURLConstants.GENERATE_ACM_JOURNAL_EXCEL_REPORT , acmJournalPagination,
        { responseType: 'blob' as 'json' });
    }
}
