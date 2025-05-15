
import { IncentiveOperationEntity } from './incentiveOperation.entity';

export class IncentiveOperationPaginationEntity {

  /** The page number. */
  pageNumber: number;

  /** The page size. */
  pageSize: number;

  /** The params. */
  params: IncentiveOperationEntity;

  /** The sort direction. */
  sortDirection: string;

  /** The sort field. */
  sortField: string;

  /** The results incentive operation. */
  resultsIncentiveOperations: IncentiveOperationEntity[];

  /** The total pages. */
  totalPages: number;

  /** The total elements. */
  totalElements: number;
}
