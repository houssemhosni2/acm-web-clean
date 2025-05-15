import { LoanDocumentEntity } from './loanDocument.entity';

export class AcmDocumentPaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: LoanDocumentEntity;
  sortDirection: string;
  resultsAcmDocuments: LoanDocumentEntity[];
  totalPages: number;
  totalElements: number;

  constructor() {
  }
}
