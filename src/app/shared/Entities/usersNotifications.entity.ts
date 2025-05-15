import { SettingNotificationsEntity } from './settingNotifications.entity';
import { UserEntity } from './user.entity';

export class UsersNotificationsEntity {
  idUsersNotification: number;
  statut: boolean;
  insertBy: string;
  userDTO: UserEntity;
  exist: boolean;
  settingNotificationDTO: SettingNotificationsEntity;
}
