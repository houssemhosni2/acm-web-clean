import { AcmMezaCardEntity } from './acmMezaCard.entity';

export class AcmMezaCardPaginationEntity {

  /** The page number. */
  pageNumber: number;

  /** The page size. */
  pageSize: number;

  /** The params. */
  params: AcmMezaCardEntity;

  /** The sort direction. */
  sortDirection: string;

  /** The sort field. */
  sortField: string;

  /** The results ACM MEZA cards. */
  resultsAcmMezaCards: AcmMezaCardEntity[];

  /** The total pages. */
  totalPages: number;

  /** The total elements. */
  totalElements: number;
}
