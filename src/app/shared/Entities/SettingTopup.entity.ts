export class SettingTopupEntity {
    /** The Id */
    id: number;
    /** The product id. */
    productId: number;
     productAbacusId: number;
    /** The topupMinLoanPaymentPercentage */
    topupMinLoanPaymentPercentage: number;
    /** The topupMaxContinuousLateDays  */
    topupMaxContinuousLateDays: number;
    /** The topupMaxSeparateLateDays */
    topupMaxSeparateLateDays: number;
    /** The topupMinLoanAmountType */
    topupMinLoanAmountType: number;
    /** The topupMinFixedLoanAmount */
    topupMinFixedLoanAmount: number;
    /**  The topupMaxAllowedTopups */
    topupMaxAllowedTopups: number;
    /**  The topupMinPreviouslyIssuedLoansNumber */
    topupMinPreviouslyIssuedLoansNumber: number;
}
