import { AssetEntity } from './Asset.entity';

export class AssetPaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: AssetEntity;
  sortDirection: number;
  sortField: string;
  resultsAssets: AssetEntity[];
  totalPages: number;
  totalElements: number;

  constructor() {

  }
}
