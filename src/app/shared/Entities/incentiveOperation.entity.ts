import { IncentiveSettingConstantEntity } from './incentiveSettingConstant.entity';

export class IncentiveOperationEntity {
  /** The id. */
  id: number;
  /** productId. */
  productId: number;
  /** frequency. */
  frequency: IncentiveSettingConstantEntity;
  /** The role. */
  role: string;
  /** The incentiveType. */
  incentiveType: IncentiveSettingConstantEntity;
  /** The incentiveValue. */
  incentiveValue: string;
  /** The basedOnId. */
  basedOnId: IncentiveSettingConstantEntity;
  /** the ordre */
  ordre: number;
  /** the delete */
  delete: boolean;
  /** numbre */
  enabled: number;
}
