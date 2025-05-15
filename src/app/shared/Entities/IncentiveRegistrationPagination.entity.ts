
import { IncentiveRegistrationEntity } from './incentiveRegistration.entity';

export class IncentiveRegistrationPaginationEntity {

  /** The page number. */
  pageNumber: number;

  /** The page size. */
  pageSize: number;

  /** The params. */
  params: IncentiveRegistrationEntity;

  /** The sort direction. */
  sortDirection: string;

  /** The sort field. */
  sortField: string;

  /** The results incentive registrations. */
  resultsIncentiveRegistrations: IncentiveRegistrationEntity[];

  /** The total pages. */
  totalPages: number;

  /** The total elements. */
  totalElements: number;
}
