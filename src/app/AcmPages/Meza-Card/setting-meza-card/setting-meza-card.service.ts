import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoanDocumentEntity} from '../../../shared/Entities/loanDocument.entity';
import {Observable} from 'rxjs';
import {AcmURLConstants} from '../../../shared/acm-url-constants';
import {AcmMezaCardEntity} from '../../../shared/Entities/acmMezaCard.entity';
import {AcmMezaCardPaginationEntity} from '../../../shared/Entities/AcmMezaCardPagination.entity';
import { BrancheEntity } from 'src/app/shared/Entities/branche.entity';

@Injectable({
  providedIn: 'root'
})

export class SettingMezaCardService {
  /**
   * constructor
   * @param httpClient HttpClient
   */
  constructor(public httpClient: HttpClient) {

  }

  /**
   * upload meza card file
   * @param uploadedFiles file
   * @param branch BrancheEntity
   * @param activate boolean
   */
  uploadFile(uploadedFiles: any[], branch: BrancheEntity, activate: boolean): Observable<LoanDocumentEntity> {
    const formData = new FormData();
    for (const i of uploadedFiles) {
      formData.append('uploadedFiles', i);
    }
    formData.append('branchDTO', JSON.stringify(branch));
    formData.append('activate', JSON.stringify(activate));
    return this.httpClient.post<LoanDocumentEntity>(AcmURLConstants.UPLOAD_FILE, formData, {responseType: 'blob' as 'json'});
  }
  /**
   * find Pagination
   * @param acmMezaCardPaginationEntity AcmMezaCardPaginationEntity
   */
  findPagination(acmMezaCardPaginationEntity: AcmMezaCardPaginationEntity): Observable<AcmMezaCardPaginationEntity> {
    return this.httpClient.post<AcmMezaCardPaginationEntity>(AcmURLConstants.FIND_PAGINATION, acmMezaCardPaginationEntity);
  }

  save(AcmMezaCardEntitys: AcmMezaCardEntity[]): Observable<AcmMezaCardEntity[]> {
    return this.httpClient.post<AcmMezaCardEntity[]>(AcmURLConstants.SAVE_CARDS, AcmMezaCardEntitys);
  }

}
