import { CollectionProcessEntity } from 'src/app/shared/Entities/CollectionProcess.entity';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionPaginationEntity } from 'src/app/shared/Entities/collection.pagination.entity';
import { CollectionNoteEntity } from 'src/app/shared/Entities/CollectionNote.entity';

@Injectable({
  providedIn: 'root'
})
export class CollectionServices {
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(private httpClient: HttpClient) {
  }

  /**
   * load collections by status : ACTIVATED / COMPLETED / CLOSED
   * @param collectionPaginationEntity CollectionPaginationEntity
   * @returns CollectionPaginationEntity
   */
  loadDashboardByStatusPagination(collectionPaginationEntity: CollectionPaginationEntity): Observable<CollectionPaginationEntity> {
    return this.httpClient.post<CollectionPaginationEntity>(AcmURLConstants.FIND_COLLECTIONS_PAGINATIONS, collectionPaginationEntity);
  }
  /**
   *
   * @param collectionEntity CollectionEntity
   * @returns list of branches
   */
  loadFilterCollectionBranch(collectionEntity: CollectionEntity): Observable<CollectionEntity[]> {
    return this.httpClient.post<CollectionEntity[]>(AcmURLConstants.LOAD_FILTER_COLLECTION_BRANCH, collectionEntity);
  }

  /**
   *
   * @param collectionEntity CollectionEntity
   * @returns list of Status
   */
    loadFilterCollectionStatus(collectionEntity: CollectionEntity): Observable<CollectionEntity[]> {
      return this.httpClient.post<CollectionEntity[]>(AcmURLConstants.LOAD_FILTER_COLLECTION_STATUS, collectionEntity);
    }
  /**
   *
   * @param collectionEntity CollectionEntity
   * @returns list of products
   */
  loadFilterCollectionProduct(collectionEntity: CollectionEntity): Observable<CollectionEntity[]> {
    return this.httpClient.post<CollectionEntity[]>(AcmURLConstants.LOAD_FILTER_COLLECTION_PRODUCT, collectionEntity);
  }
  /**
   *
   * @param acmCollection CollectionEntity
   * @returns CollectionEntity[]
   */
  getCollection(acmCollection: CollectionEntity): Observable<CollectionEntity[]> {
    return this.httpClient.post<CollectionEntity[]>(AcmURLConstants.FIND_COLLECTIONS, acmCollection);
  }
/**
 * get collection notes
 * @param collectionNoteEntity CollectionNoteEntity
 * @returns CollectionNoteEntity[]
 */
  getCollectionNotes(collectionNoteEntity : CollectionNoteEntity): Observable<CollectionNoteEntity[]>  {
    return this.httpClient.post<CollectionNoteEntity[]>(AcmURLConstants.GET_COLLECTION_NOTES , collectionNoteEntity);

  }
  /**
   * create New CollectionNote
   * @param collectionNoteEntity CollectionNoteEntity
   * @returns CollectionNoteEntity
   */
  createNewCollectionNote(collectionNoteEntity : CollectionNoteEntity): Observable<CollectionNoteEntity>  {
    return this.httpClient.post<CollectionNoteEntity>(AcmURLConstants.CREATE_COLLECTION_NOTE , collectionNoteEntity);

  }
  /**
   * collection Action Completed
   * @param acmCollection CollectionEntity
   * @returns CollectionEntity
   */
  collectionActionCompleted(acmCollection: CollectionEntity) : Observable<CollectionEntity>{
    return this.httpClient.post<CollectionEntity>(AcmURLConstants.ACTION_COLLECTION_COMPLETED , acmCollection);

  }

  /**
   *
   * @param acmCollection CollectionEntity
   */
  assignCollection(acmCollection: CollectionEntity): Observable<CollectionEntity> {
    return this.httpClient.put<CollectionEntity>(AcmURLConstants.ASSIGN_COLLECTION, acmCollection);
  }

  UpdateCollection(acmCollection: CollectionEntity): Observable<CollectionEntity> {
    return this.httpClient.put<CollectionEntity>(AcmURLConstants.UPDATE_COLLECTIONS, acmCollection);
  }

  UpdateCollectionInstances(acmCollection: CollectionProcessEntity): Observable<CollectionProcessEntity[]> {
    return this.httpClient.put<CollectionProcessEntity[]>(AcmURLConstants.UPDATE_COLLECTIONS_INSTANCES,
      acmCollection);
  }

  saveAllCollections(acmCollections: CollectionEntity[],process : string): Observable<any> {
    return this.httpClient.post<any>(AcmURLConstants.SAVE_ALL_COLLECTIONS + process, acmCollections);
  }


  collectionReview(collection: CollectionEntity): Observable<CollectionEntity> {
    return this.httpClient.post<CollectionEntity>(AcmURLConstants.COLLECTION_REVIEWS, collection);
  }
}
