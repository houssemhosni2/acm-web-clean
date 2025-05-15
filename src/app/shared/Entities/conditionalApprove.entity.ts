import { ItemEntity } from './Item.entity';
import { CalendarEventsEntity } from './calendarEvents.entity';
import { LoanEntity } from './loan.entity';
import { UserEntity } from './user.entity';

export class ConditionalApproveEntity {
  id: number;
  description: string;
  user: UserEntity = new UserEntity();
  loan: LoanEntity = new LoanEntity() ;
  status : string ;
  insertBy : string;
  enabled :boolean ;
  calendarEventApprove : CalendarEventsEntity = new CalendarEventsEntity()  ;
  calendarEventApproveValidator : CalendarEventsEntity = new CalendarEventsEntity();
  conditionnalValidation: boolean;
  usernameInsertedBy : string  ;
  approvalConditionDate : Date ;
  item : ItemEntity ;

  constructor() {

  }
}
