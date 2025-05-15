import { ProductDetailsEntity } from './productDetails.entity';
import { SettingProductEligibilityEntity } from './SettingProductEligibility.entity';
import { SettingTopupEntity } from './SettingTopup.entity';
import { ProductFiltersEntity } from './ProductFilters.entity';
import { SettingProductGuarantee } from './SettingProductGuarantee';
import { AcmCurrencySetting } from './acmCurrencySetting.entity';

export class ProductEntity {
  /** The id. */
  id: number;
  /** The code. */
  code: string;
  /** The description. */
  description: string;
  /** The maximum balance. */
  maximumBalance: number;
  /** The minimum term. */
  minimumTerm: number;
  /** The maximum term. */
  maximumTerm: number;
  /** The id product abacus. */
  productIdAbacus: number;
  /** The product individual. */
  productIndiv: boolean;
  /** The product group. */
  productGrp: boolean;
  /** The product organization. */
  productOrg: boolean;
  /** The rate start date. */
  rateStartDate: Date;
  /** The rate end date. */
  rateEndDate: Date;
  /** The rate. */
  rate: number;
  productDetailsDTOs: ProductDetailsEntity[];
  issueFeePercentage1: number;
  issueFeePercentage2: number;
  minimumBalance: number;
  /** The use schedule interest. */
  public useScheduleInterest: boolean;
  /** The maximum age. */
  maximumAge: number;
  /** The minimum age. */
  minimumAge: number;
  /** The max accounts. */
  maxAccounts: number;
  /** The maximum deferred period. */
  maximumDeferredPeriod: number;
  /** The minimum deferred period. */
  minimumDeferredPeriod: number;

  cuInsuranceID: number;
  issueFeeVAT1: number;
  issueFeeVAT2: number;
  /** enable product */
  enabled: boolean;
  /** roundType (UP/DOWN) */
  roundType: string;
  issueFeeAmount1: number;
  issueFeeAmount2: number;
  flatInterestRate: number;
  renewalPercentage: number;
  maxNumDaysExpiry: number;
  maxScore: number;
  maxActiveLoans: number;
  maxNumDaysDue: number;
  amlCheckPourcentage: number;
  minActiveLoans: number;
  minNumDaysDue: number;
  minScore: number;
  /** topup setting flag */
  topup: boolean;
  /** Refinance setting flag */
  refinance: boolean;
  /** settingTopup */
  settingTopup: SettingTopupEntity;
  /** SettingProductEligibilityEntity */
  settingProductEligibility: SettingProductEligibilityEntity;
  /** The product filter. */
  productFilter: ProductFiltersEntity;
  /** product guarantee */
  productGuarantee: SettingProductGuarantee;
  /** supplier setting flag */
  supplier: boolean;
  /** isFrequency */
  isFrequency: boolean;
  /** isDeferredPeriodeWithFrequency */
  isFrequencyWithDeferredPeriode: boolean;
  /** disburse */
  disburse: boolean;
  /** Day Count */
  dayCount: number;

  acmCurrency: AcmCurrencySetting;
  paymentPrioritySetting: string;
}
