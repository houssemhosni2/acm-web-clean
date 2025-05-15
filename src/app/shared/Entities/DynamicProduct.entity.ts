
export class DynamicProductEntity {
  id : number ;
  name : string  ;
  description : string  ;
  interet : number ;
  implementationScheduleDate : Date;
  customerTarget  : string ;
  investisementBudget  : number
  profitability  : number ;
  taxAccountingImpacts  : string ;
  dateLastUpdate : string ;
  insertBy: string ;
  branchName : string ;
  branchId : number ;
  status : string  ;
  stepProductId : number ;
  process: string ;
  stapeName :String ;
  DynamicInstancesDtos : DynamicProductEntity[];




    constructor( ) {

    }

}
