import { FinancialCategory } from "./AcmFinancialCategory.entity";

export class AcmFinancialCategoryPagination {
  pageNumber: number;
  pageSize: number;
  params: FinancialCategory;
  sortDirection: number;
  sortField: string;
  results: FinancialCategory[];
  totalPages: number;
  totalElements: number;
}