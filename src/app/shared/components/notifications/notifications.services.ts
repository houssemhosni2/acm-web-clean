import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AcmURLConstants } from '../../acm-url-constants';
import { NotificationPaginationEntity } from '../../Entities/notificationPagination.entity';
import { NotificationsEntity } from '../../Entities/notifications.entity';

@Injectable({
  providedIn: 'root'
})
export class NotificationsServices {
  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  getNotification(notificationPaginationEntity: NotificationPaginationEntity): Observable<NotificationPaginationEntity> {
    return this.httpClient.post<NotificationPaginationEntity>(AcmURLConstants.NOTIFICATION_FIND, notificationPaginationEntity);
  }

  getNewNotification(): Observable<NotificationsEntity[]> {
    return this.httpClient.get<NotificationsEntity[]>(AcmURLConstants.NOTIFICATION_FIND_NEW);
  }

  updateNofification(notificationsEntity: NotificationsEntity): Observable<NotificationsEntity> {
    return this.httpClient.put<NotificationsEntity>(AcmURLConstants.NOTIFICATION_UPDATE, notificationsEntity);
  }

  /**
   * methode count New Notif for User
   */
  countNotifForUser(): Observable<number> {
    return this.httpClient.get<number>(AcmURLConstants.NOTIFICATION_COUNT_NEW);
  }
}
