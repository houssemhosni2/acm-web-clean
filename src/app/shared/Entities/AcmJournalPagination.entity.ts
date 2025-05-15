import { AcmJournal } from "./AcmJournal.entity";

export class AcmJournalPagination {
  pageNumber: number;
  pageSize: number;
  params: AcmJournal;
  sortDirection: number;
  sortField: string;
  results: AcmJournal[];
  totalPages: number;
  totalElements: number;
}