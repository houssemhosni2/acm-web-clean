import { ItemEntity } from "./Item.entity";
import { SettingTypeRiskEntity } from "./settingTypeRisk.entity";
import { StepEntity } from "./step.entity";

export class StepRiskSetting {
  id: number;
  settingTypeRisk : SettingTypeRiskEntity ;
  step : StepEntity ;
  idSelectedEchelle : number
  editable:boolean ;
  item : ItemEntity ;


}
