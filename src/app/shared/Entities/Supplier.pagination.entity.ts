import { SupplierEntity } from './Supplier.entity';

export class SupplierPaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: SupplierEntity;
  sortDirection: number;
  sortField: string;
  resultsSuppliers: SupplierEntity[];
  totalPages: number;
  totalElements: number;

  constructor() {

  }
}
