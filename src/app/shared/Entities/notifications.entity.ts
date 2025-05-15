import { LoanEntity } from './loan.entity';

export class NotificationsEntity {

  /** The id notification. */
  idNotification: number;

  /** The username. */
  username: string;

  /** The creaction date. */
  creactionDate: Date;

  /** The category. */
  category: string;

  /** The type motif. */
  typeMotif: string;

  /** The redirect. */
  redirect: boolean;

  /** The status notif. */
  statusNotif: string;

  /** The action. */
  action: string;

  /** The description. */
  description: string;

  /** The id loan. */
  loanDTO: LoanEntity;

  /** The id  collection. */
  idAcmCollection : number;

  /** The id calendar event. */
  idCalendarEvent: number;

  /** The action Statue Notif Button. */
  actionStatueNotif: boolean;

  /** insertedby user */
  insertBy: string;

   /** customer name */
  customerName:string;

  /** target date */
  targetDate:Date;

}
