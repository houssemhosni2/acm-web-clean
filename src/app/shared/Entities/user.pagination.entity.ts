import { UserEntity } from './user.entity';

export class UserPaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: UserEntity;
  sortDirection: number;
  sortField: string;
  resultsUsers: UserEntity[];
  totalPages: number;
  totalElements: number;

  constructor() {

  }
}
