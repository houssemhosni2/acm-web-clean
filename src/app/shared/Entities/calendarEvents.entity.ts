import { CustomerEntity } from './customer.entity';
import { UserEntity } from './user.entity';

export class CalendarEventsEntity {
  id: number;
  dateDebut: string;
  dateFin: string;
  dateInsertion: string;
  typeEvent: string;
  libelleEvent: string;
  description: string;
  username: string;
  userFullName : string;
  customerName: string;
  phoneNumber: string;
  place: string;
  statut: string;
  participant: string;
  sortedByDate: boolean;
  category: string;
  idCollection : number;
  idLoanExtern : number;
  idClaim : number;
  allTeamsTasks : boolean;
  stepName : string;
  insertBy : string;
  idCustomerExtern : number;
  customer : CustomerEntity;
  user : UserEntity;
  startHour : string;
  endHour : string;
  participantList : UserEntity[];
  enabled : boolean;
  userEmail  : string   ;
  fullNameParticipants : string;
  customerNumber :string;
  idItem : number ;
  teamFilter: boolean;
}
