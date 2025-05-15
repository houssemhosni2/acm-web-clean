import { DeferredPeriodTypeEntity } from './DeferredPeriodType.entity';

export class ProductDetailsEntity {

    /** The id. */
    id: number;

    /** The id product. */
    idProduct: number;

    /** The minimum amount. */
    minimumAmount: number;

    /** The maximum amount. */
    maximumAmount: number;

    /** The minimum term. */
    minimumTerm: number;

    /** The maximum term. */
    maximumTerm: number;

    /** The term type. */
    termType: string;

    /** The enabled. */
    enabled: boolean;

    /** The deferredPeriodTypes. */
    deferredPeriodTypes: string;

    /** The deferredPeriodTypeDTOs */
    deferredPeriodTypeDTOs: DeferredPeriodTypeEntity[];

    /** The deferredPeriodTypeDTOs */
    greenRate : number ;

    /** The startOfInterval */
    orangeRate : number ;

    /** The endOfInterval */
    redRate : number ;

    /** The penaltySettingChargeFeeId */
    penaltySettingChargeFeeId : number ;

    /** penaltyGracePeriod */
    penaltyGracePeriod : number ;

    /** The payoutSettingChargeFeeId */
    payoutSettingChargeFeeId : number;

    /** The disbursmentFeesSetting */
    disbursmentFeesSetting: string;
}
