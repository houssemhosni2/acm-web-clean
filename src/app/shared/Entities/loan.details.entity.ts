import { LoanEntity } from './loan.entity';
import { ScheduleEntity } from './schedule.entity';
import { CustomerAccountEntity } from './customer.account.entity';

export class LoanDetailsEntity {
  loanDTO: LoanEntity;
  scheduleDTOs: ScheduleEntity[];
  customerAccountDTOs: CustomerAccountEntity[];

  constructor() {

  }
}
