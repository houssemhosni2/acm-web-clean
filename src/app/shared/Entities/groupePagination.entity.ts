import { GroupeEntity } from './groupe.entity';

export class GroupePaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: GroupeEntity;
  sortDirection: number;
  sortField: string;
  resultsGroupes: GroupeEntity[];
  totalPages: number;
  totalElements: number;
  constructor() {

  }
}
