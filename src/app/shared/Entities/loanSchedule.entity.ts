import { LoanEntity } from './loan.entity';
import { ScheduleEntity } from './schedule.entity';

export class LoanScheduleEntity {
  // loanEntity
  loanDTO: LoanEntity;
  // scheduleEntity
  scheduleDTOs: ScheduleEntity[];
  constructor() {
  }
}
