
import { IncentiveRepaymentEntity } from './incentiveRepayment.entity';

export class IncentiveRepaymentPaginationEntity {

  /** The page number. */
  pageNumber: number;

  /** The page size. */
  pageSize: number;

  /** The params. */
  params: IncentiveRepaymentEntity;

  /** The sort direction. */
  sortDirection: string;

  /** The sort field. */
  sortField: string;

  /** The results incentive regestrations. */
  resultsIncentiveRepayments: IncentiveRepaymentEntity[];

  /** The total pages. */
  totalPages: number;

  /** The total elements. */
  totalElements: number;
}
