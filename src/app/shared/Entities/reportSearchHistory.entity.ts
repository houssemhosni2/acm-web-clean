import { ReportingEntity } from './reporting.entity';

export class ReportSearchHistoryEntity {
  /** The id. */
  id: number;

  /** The username. */
  username: string;

  /** The search data json. */
  searchDataJson: string;

  /** The label search history. */
  labelSearchHistory: string;

  /** The report name. */
  reportName: string;

  /** The enabled. */
  enabled: boolean;

  /** The date insertion. */
  dateInsertion: string;

  /** The reporting DTO. */
  reportingDTO: ReportingEntity;
}
