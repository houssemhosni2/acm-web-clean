import { SettingLevelEntity } from './settingLevel.entity';

export class SettingLevelProcessEntity {

  id: number;
  idProduct: number;
  amount: number;
  description: string;
  settingLevelDTO: SettingLevelEntity;
  /** enable product */
  enabled: boolean;
  status = false;
  constructor() {
  }
}
