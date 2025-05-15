import { IncentiveSettingConstantEntity } from './incentiveSettingConstant.entity';

export class IncentiveRepaymentEntity {
  /** The id. */
  id: number;
  /** productId. */
  productId: number;
  /** frequency. */
  frequency: IncentiveSettingConstantEntity;
  /** The role. */
  role: string;
  /** The customerType. */
  customerType: IncentiveSettingConstantEntity;
  /** The incentiveType. */
  incentiveType: IncentiveSettingConstantEntity;
  /** The incentiveValue. */
  incentiveValue: string;
  /** The basedOnId. */
  basedOnId: IncentiveSettingConstantEntity;
  /** The active customer id. */
  activeCustomerId: number;
  /** The productivity id. */
  productivityId: number;
  /** The risk level id. */
  riskLevelId: number;
  /** the ordre. */
  ordre: number;
  /** the delete. */
  delete: boolean;
  /** numbre. */
  enabled: number;
}
