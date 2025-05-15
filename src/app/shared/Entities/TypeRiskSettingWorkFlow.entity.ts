import { EchelleEntity } from "./echelle.entity ";
import { SettingTypeRiskEntity } from "./settingTypeRisk.entity";

export class TypeRiskSettingWorkFlow {
    id : number ;
    label : string ;
    description :  string ;
    enabled : boolean ;
    echelleTypeRisks : EchelleEntity[] = [];
    echelleListString : string  ;
    settingTyperisk : SettingTypeRiskEntity = new SettingTypeRiskEntity() ;
    editable  : boolean =null ;
    constructor( ) {

    }

}
