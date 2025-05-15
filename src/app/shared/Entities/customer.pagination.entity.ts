import { CustomerEntity } from './customer.entity';

export class CustomerPaginationEntity {
  id?: string | number;
  pageNumber: number;
  pageSize: number;
  params: CustomerEntity;
  sortDirection: number;
  sortField: string;
  resultsCustomers: CustomerEntity[];
  totalPages: number;
  totalElements: number;

  constructor() {

  }
}
