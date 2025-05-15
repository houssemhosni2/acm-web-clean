import { EchelleEntity } from "./echelle.entity ";

export class SettingTypeRiskEntity {
  /** The id. */
  id : number;
  label : string ;
  description :  string ;
  enabled : boolean ;
  echelleTypeRisks : EchelleEntity[] = [];
  echelleListString : string  ;


}
