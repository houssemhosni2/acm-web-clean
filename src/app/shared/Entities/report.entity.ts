import { CollectionEntity } from './acmCollection.entity';
import { LoanEntity } from './loan.entity';

export class ReportEntity {
  /** The inputFileName. */
  inputFileName: string;

  /** The params. */
  params: Map<string, object>;

  /** The path where the report will be uploaded to in the GED. */
  path: string;

  /** The entryList. */
  entryList: LoanEntity[];

   /** The entryList of collection. */
   entryListAcmCollections: CollectionEntity[];

    /** The typeReport. */
    typeReport: string;

  constructor() {

  }

}
