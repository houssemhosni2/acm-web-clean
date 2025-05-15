import { NotificationsEntity } from './notifications.entity';

export class NotificationPaginationEntity {
  pageNumber: number;
  pageSize: number;
  params: NotificationsEntity;
  sortDirection: string;
  resultsNotifications: NotificationsEntity[];
  totalPages: number;
  totalElements: number;
}
