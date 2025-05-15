import { creditLineEntity } from "./AcmCreditLine.entity";

export class CreditLinePaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: creditLineEntity;
  sortDirection: number;
  sortField: string;
  resultsCreditLine: creditLineEntity[];
  totalPages: number;
  totalElements: number;

  constructor() {

  }
}
