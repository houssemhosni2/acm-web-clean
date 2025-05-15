import { DynamicProductEntity } from './DynamicProduct.entity';

export class ProductPaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: DynamicProductEntity;
  sortDirection: number;
  sortField: string;
  resultsDynamicProduct: DynamicProductEntity[];
  totalPages: number;
  totalElements: number;


  constructor() {

  }
}
