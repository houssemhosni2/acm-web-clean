import { AcmGlAccount } from "./AcmGlAccount.entity";

export class AcmGlAccountPagination {
    pageNumber: number;
    pageSize: number;
    params: AcmGlAccount;
    sortDirection: number;
    sortField: string;
    results: AcmGlAccount[];
    totalPages: number;
    totalElements: number;
  }