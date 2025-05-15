import { IncentiveSettingConstantEntity } from './incentiveSettingConstant.entity';

export class IncentiveBranchProdLevelEntity {
  /** The id. */
  id: number;
  /** productId. */
  productId: number;
  /** frequency. */
  frequency: IncentiveSettingConstantEntity;
  /** The role. */
  role: string;
  /** The customerType. */
  minAmount: number;
  /** The incentiveType. */
  minNumberCustomer: number;
  /** the ordre */
  ordre: number;
  /** the delete */
  delete: boolean;
  /** numbre */
  enabled: number;
}
