import { SettingThirdPartyEntity } from 'src/app/shared/Entities/settingThirdParty.entity';
import { ProductEntity } from "./product.entity";
import { toppedUpHistoryEntity } from "./AcmToppedUpHistory.entity";

export class creditLineEntity {
  id: number;
  fundName: string;
  description: string;
  balance: number;
  controlBalance: boolean;
  fundPriority: number;
  issueDate: any;
  expiryDate: any;
  thirdParty: SettingThirdPartyEntity;
  products: ProductEntity[];
  enabled: boolean;
  toppedUpHistories: toppedUpHistoryEntity[];
  remainingBalance: number;
}
