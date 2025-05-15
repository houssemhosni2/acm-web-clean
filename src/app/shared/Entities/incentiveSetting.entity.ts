import { IncentiveSettingConstantEntity } from './incentiveSettingConstant.entity';

export class IncentiveSettingEntity {
  /** The id. */
  id: number;
  /** productId. */
  productId: number;
  /** frequency. */
  frequency: IncentiveSettingConstantEntity;
  /** The role. */
  category: string;
  /** The from. */
  from: number;
  /** The to. */
  to: number;
  /** The discount. */
  discount: number;
  /** the ordre. */
  ordre: number;
  /** the delete */
  delete: boolean;
}
