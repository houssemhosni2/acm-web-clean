import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcmURLConstants } from '../../shared/acm-url-constants';
import { LoanDocumentEntity } from '../../shared/Entities/loanDocument.entity';
import { LoanEntity } from '../../shared/Entities/loan.entity';
import { SettingDocumentTypeEntity } from '../../shared/Entities/settingDocumentType.entity';
import { AcmDocumentPaginationEntity } from '../../shared/Entities/acmDocumentPagination.entity';
import { SettingDocumentTypeProductEntity } from '../../shared/Entities/settingDocumentTypeProduct.entity';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';
import { LoansDocumentsEntity } from 'src/app/shared/Entities/loansDocuments.entity';
import { GedDocumentEntity } from 'src/app/shared/Entities/gedDocument.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class GedServiceService {

  public loanEntity: LoanEntity = new LoanEntity();
  /**
   * constructor
   * @param httpClient HttpClient
   * @param dialog MatDialog
   */
  constructor(public httpClient: HttpClient,
              public dialog: MatDialog) {
  }

  /**
   * saveListDocuments by given params
   * @param uploadedFiles any[]
   * @param documentsLoanDTO LoanDocumentEntity[]
   */
  saveListDocuments(uploadedFiles: any[], documentsLoanDTO: LoanDocumentEntity[]): Observable<LoanDocumentEntity[]> {
    const formdata = new FormData();
    for (const i of uploadedFiles) {
      formdata.append('uploadedFiles', i);
    }
    formdata.append('documentsLoanDTO', JSON.stringify(documentsLoanDTO));
    return this.httpClient.post<LoanDocumentEntity[]>(AcmURLConstants.SAVE_LIST_DOCUMENT, formdata);
  }

  /**
   * getDocumentsByLoan by given params
   * @param LoanDocumentEntity the loanDocumentEntity
   */
  getDocumentsByLoan(loanDocumentsDTO: LoanDocumentEntity): Observable<LoanDocumentEntity[]> {
    return this.httpClient.post<LoanDocumentEntity[]>(AcmURLConstants.GET_LIST_DOCUMENT_LOAN, loanDocumentsDTO);
  }
/**
 * getDocumentsByLoanFromIB
 * @param loanDocumentsDTO LoanDocumentEntity
 * @returns LoanDocumentEntity[]
 */
  getDocumentsByLoanFromIB(loanDocumentsDTO: LoanDocumentEntity,acmLoanId): Observable<LoanDocumentEntity[]> {
    return this.httpClient.post<LoanDocumentEntity[]>(AcmURLConstants.GET_DOCUMENT_FROM_IB+acmLoanId, loanDocumentsDTO);
  }
  
  /**
   * getDocumentsByLoan by given params
   * @param LoanDocumentEntity the loanDocumentEntity
   */
   getDocumentsByCollectionStep(loanDocumentsDTO: LoanDocumentEntity): Observable<LoanDocumentEntity[]> {
    return this.httpClient.post<LoanDocumentEntity[]>(AcmURLConstants.GET_LIST_DOCUMENT_LOAN, loanDocumentsDTO);
  }

  /**
   * getDocumentsByLoan by given params
   * @param LoanDocumentEntity the loanDocumentEntity
   */
  getDocumentsByCustomer(loanDocumentsDTO: LoanDocumentEntity): Observable<LoansDocumentsEntity[]> {
    return this.httpClient.post<LoansDocumentsEntity[]>(AcmURLConstants.GET_LIST_DOCUMENT_CUSTOMER, loanDocumentsDTO);
  }

  /**
   * deleteDocuments by given params
   * @param LoanDocumentEntity the loanDocumentEntity
   */
  deleteDocuments(documentId: any): Observable<any> {
    return this.httpClient.delete<any>(AcmURLConstants.DELETE_DOCUMENT_LOAN + documentId);
  }

  /**
   * create document by given params
   * @param body LoanDocumentEntity
   */
  createAcmDocument(body: LoanDocumentEntity): Observable<LoanDocumentEntity> {
    return this.httpClient.post<LoanDocumentEntity>(AcmURLConstants.CREATE_DOCUMENT, body);
  }
/**
 * updateAcmDocumentList
 * @param LoanDocumentEntities LoanDocumentEntity[]
 * @returns LoanDocumentEntity[]
 */
  updateAcmDocumentList(LoanDocumentEntities: LoanDocumentEntity[]): Observable<LoanDocumentEntity[]> {
    return this.httpClient.post<LoanDocumentEntity[]>(AcmURLConstants.UPDATE_DOCUMENT, LoanDocumentEntities);
  }

  /**
   * getDocumentsByTags by given params
   * @param any the body
   */
  getDocumentsByTags(body: any): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.FIND_DOCUMENTS_BY_TAGS, body);
  }

  /**
   * getDocument by given params
   * @param string the idDocumentGED
   */
  getDocument(idDocumentGED: string): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.DISPLAY_DOCUMENT + idDocumentGED, { responseType: 'blob' as 'json' });
  }
  getDocumentFromIb(idDocumentGED: string, IdLoan: string): Observable<any> {
    const params = new HttpParams()
      .set('id', idDocumentGED)
      .set('loanId', IdLoan);

    return this.httpClient.get<any>(AcmURLConstants.DISPLAY_DOCUMENT_FROM_IB, { responseType: 'blob' as 'json', params });

  }
  /**
   * List of loan
   */
  findLoan(loanDTO: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.FIND_LOANS, loanDTO);
  }
  /**
   * List of loan by Custumer
   */
  findLoanByCustumerDto(customer: CustomerEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.FIND_LOANS_BY_CUSTOMER , customer);
  }
  /**
   * List of loan
   */
   findLoanbyAccount(loanDTO: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.FIND_LOANS_BY_ACCOUNT, loanDTO);
  }
   /**
    * List of loan by Custumer
    */
  findLoanByCustumer(customerId: number): Observable<LoanEntity[]> {
    return this.httpClient.get<LoanEntity[]>(AcmURLConstants.FIND_LOANS_BY_CUSTOMERID + customerId);
  }
  /**
   * List of loan by customer
   */
  getloanCustomer(loanDTO: LoanEntity): Observable<LoanEntity[]> {
    return this.httpClient.post<LoanEntity[]>(AcmURLConstants.FIND_LOANS, loanDTO);
  }
  /**
   * load Dashboard Loans By Status and paginations
   * @param loanPaginationEntity LoanPaginationEntity
   */
  getloansByCustomer(loanPaginationEntity: LoanPaginationEntity): Observable<LoanPaginationEntity> {
    return this.httpClient.post<LoanPaginationEntity>(AcmURLConstants.FIND_LOANS_PAGINATIONS, loanPaginationEntity);
  }
  /**
   * get document information (typemime,name,...)
   * @param string idDocumentGED
   */
  getDocumentType(idDocumentGED: string): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.GET_DETAIL_DOCUMENT + idDocumentGED);
  }

  /**
   * Get required document
   * @param LoanDocumentEntity loanDocumentsDTO
   */
  getRequiredDocument(loanDTO: LoanEntity): Observable<SettingDocumentTypeEntity[]> {
    return this.httpClient.post<SettingDocumentTypeEntity[]>(AcmURLConstants.GET_REQUIRED_DOCUMENT, loanDTO);
  }

  /**
   * disable document
   * @param LoanDocumentEntity loanDocumentsDTO
   */
  disableDocument(loanDocumentsDTO: LoanDocumentEntity): Observable<any> {
    return this.httpClient.put<any>(AcmURLConstants.DISABLE_DOCUMENT, loanDocumentsDTO);
  }

  /**
   * Get all document types
   * @param Any body
   */
  getAllDocumentTypes(body: any): Observable<any[]> {
    return this.httpClient.post<any[]>(AcmURLConstants.GET_ALL_TYPES_DOCUMENT, body);
  }

  /**
   * Get all document with pagination
   * @param SettingDocumentTypeEntity settingDocumentTypeEntity
   */
  getDocumentPagination(acmDocumentsPagination: AcmDocumentPaginationEntity): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.GET_ALL_TYPES_DOCUMENT_PAGINATION, acmDocumentsPagination);
  }

  /**
   * saveListDocuments by given params
   * @param LoanEntity the loanEntity
   * @param any the file
   */
  saveImageInGED(uploadedFiles: any[], loanDTO: LoanEntity): Observable<any> {
    const formdata = new FormData();
    for (const i of uploadedFiles) {
      formdata.append('uploadedFiles', i);
    }
    formdata.append('documentsLoanDTO', JSON.stringify(loanDTO));
    return this.httpClient.post<any>(AcmURLConstants.SAVE_IMAGE_IN_GED, formdata);
  }
  /**
   * save client image by given params
   * @param uploadedFiles files
   */
  saveImageClientInGED(uploadedFiles: any[]): Observable<any> {
    const formdata = new FormData();
    for (const i of uploadedFiles) {
      formdata.append('uploadedFiles', i);
    }
    return this.httpClient.post<any>(AcmURLConstants.SAVE_CLIENT_IMAGE_IN_GED, formdata);
  }

  /**
   * getFeeRepayment by given param
   * @param IdAccount idAccount
   * @param FeeRepaymentEntity feeRepaymentEntity
   */
  getFeeRepayment(idAccount: number): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.GET_FEE_REPAYMENT + idAccount);
  }

  /**
   * find all document product
   */
  findAllDocumentProduct(body: SettingDocumentTypeProductEntity): Observable<SettingDocumentTypeProductEntity[]> {
    return this.httpClient.post<SettingDocumentTypeProductEntity[]>(AcmURLConstants.FIND_ALL_DOCUMENT_PRODUCT, body);
  }

  findImageForCustomer(tag): Observable<GedDocumentEntity> {
    return this.httpClient.get<GedDocumentEntity>(AcmURLConstants.FIND_IMAGE_FOR_CUSTOMER + tag);
  }

  /**
   * get document by expenses id
   * @param loanDocumentsDTO LoanDocumentEntity
   * @returns expenses document
   */
  getDocumentsByExpensesId(loanDocumentsDTO: LoanDocumentEntity): Observable<LoanDocumentEntity[]> {
    return this.httpClient.post<LoanDocumentEntity[]>(AcmURLConstants.FIND_EXPENSES_DOCUMENT, loanDocumentsDTO);
  }

  getHistoryListDocument(typeDocId: number, loanId:number, documentIndex: number): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.GET_DOCUMENT_HISTORY + typeDocId +'/'+  loanId + '/'+ documentIndex);
  }
  getHistoryListDocumentByCustomer(typeDocId: number, customerId:number, documentIndex: number): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.GET_DOCUMENT_HISTORY_BY_CUSTOMER + typeDocId +'/'+  customerId + '/'+ documentIndex);
  }

  getHistoryListDocumentByCollectionStep(typeDocId: number, collectionInstanceId:number, documentIndex: number): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.GET_DOCUMENT_HISTORY_BY_COLLECTION_STEP + typeDocId +'/'+  collectionInstanceId + '/'+ documentIndex);
  }
  findhistoryDocumentByItemStep(typeDocId: number, itemInstanceStepId:number): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.GET_DOCUMENT_HISTORY_BY_ITEM_STEP + typeDocId +'/'+  itemInstanceStepId );
  }

  findhistoryDocumentByCategoryElement(typeDocId: number, elementId:number,category : string ): Observable<any> {
    return this.httpClient.get<any>(AcmURLConstants.GET_DOCUMENT_HISTORY_BY_ELEMENT + typeDocId +'/'+  elementId+'/'+category );
  }
}
