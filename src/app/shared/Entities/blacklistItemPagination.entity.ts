import { BlacklistItem } from "./blacklistItem.entity";

export class BlacklistItemPagination {
  pageNumber: number;
  pageSize: number;
  params: BlacklistItem;
  sortDirection: number;
  sortField: string;
  resultsBlacklistItems: BlacklistItem[];
  totalPages: number;
  totalElements: number;
}