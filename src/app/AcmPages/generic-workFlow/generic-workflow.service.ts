import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemNoteEntity } from 'src/app/shared/Entities/ItemNote.entity';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GenericWorkFlowService {

  constructor(public httpClient: HttpClient) {
  }

  getItemNotes(itemNoteEntity: ItemNoteEntity): Observable<ItemNoteEntity[]> {
    return this.httpClient.post<ItemNoteEntity[]>(AcmURLConstants.GET_ITEM_NOTES, itemNoteEntity);

  }
  createItemNotes(itemNoteEntity: ItemNoteEntity): Observable<ItemNoteEntity> {
    return this.httpClient.post<ItemNoteEntity>(AcmURLConstants.CREATE_ITEM_NOTES, itemNoteEntity);

  }
}
