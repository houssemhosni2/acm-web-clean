import { CreditLineAccount } from "./acmCreditLineAccount.entity";

export class CreditLineAccountPaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: CreditLineAccount;
  sortDirection: number;
  sortField: string;
  resultsCreditLineAccounts: CreditLineAccount[];
  totalPages: number;
  totalElements: number;

  constructor() {

  }
}
