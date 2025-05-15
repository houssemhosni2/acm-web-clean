import { IncentiveSettingConstantEntity } from './incentiveSettingConstant.entity';

export class IncentiveSettingRunEntity {
  /** The id. */
  id: number;

  /** The code. */
  code: string;

  /** The description. */
  description: string;

  /** The frequency. */
  frequency: IncentiveSettingConstantEntity;

  /** The role. */
  role: string;

  /** The enabled. */
  enabled: boolean;

  /** The applayDiscountRule. */
  applayDiscountRule: boolean;

  /** The appalyBranchProdLevel. */
  appalyBranchProdLevel: boolean;

}
