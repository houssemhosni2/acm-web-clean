import {AcmURLConstants} from './acm-url-constants';
import {HttpClient} from '@angular/common/http';
import {NotificationsEntity} from './Entities/notifications.entity';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationServices {
  constructor(public httpClient: HttpClient) {
  }

  getNotification(notificationsEntity: NotificationsEntity) {
    // clear token remove user from local storage to log user out
    return this.httpClient.post<NotificationsEntity>(AcmURLConstants.NOTIFICATION_FIND, notificationsEntity);
  }
}
