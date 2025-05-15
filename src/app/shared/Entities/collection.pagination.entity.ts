import { CollectionEntity } from './acmCollection.entity';

export class CollectionPaginationEntity {
  id? :any;
  pageNumber: number;
  pageSize: number;
  params: CollectionEntity;
  sortDirection: number;
  sortField: string;
  resultsCollections: CollectionEntity[];
  totalElements: number;

  constructor() {

  }
}
