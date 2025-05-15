import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { BlacklistItem } from 'src/app/shared/Entities/blacklistItem.entity';
import { BlacklistItemPagination } from 'src/app/shared/Entities/blacklistItemPagination.entity';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {

  constructor(public httpClient: HttpClient) { }

  saveBlacklistItem(blacklistItem: BlacklistItem) : Observable<BlacklistItem> {
    return this.httpClient.post<BlacklistItem>(AcmURLConstants.SAVE_BLACKLIST_ITEM, blacklistItem);
  }

  findBlacklistItems(blacklistItemPagination: BlacklistItemPagination) : Observable<BlacklistItemPagination> {
    return this.httpClient.post<BlacklistItemPagination>(AcmURLConstants.FIND_BLACKLIST_ITEMS, blacklistItemPagination);
  }

  saveBlacklistItems(blacklistItems: BlacklistItem[]) : Observable<BlacklistItem[]> {
    return this.httpClient.post<BlacklistItem[]>(AcmURLConstants.SAVE_BLACKLIST_ITEMS, blacklistItems);
  }

  uploadBlacklistItemsFile(uploadedFile: any) : Observable<BlacklistItem[]>{
    const formData = new FormData();
    formData.append('uploadedFile', uploadedFile);
    return this.httpClient.post<BlacklistItem[]>(AcmURLConstants.UPLOAD_BLACKLIST_ITEMS_FILE, formData);
  }
}
