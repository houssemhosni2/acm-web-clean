import { ClaimsEntity } from "./claims.entity";

export class ClaimsListEntity {
  id: number;
  subject : string;
  category :string ;
  customer : string ;
  dueDate : Date  ;
  dateInsertion : Date ;
  ownerName :string ;
  estimation : number;
  priority :string ;
  claimOwner :string ;
  claimGroupOwner : string  ;
  claim : ClaimsEntity  ;
}
