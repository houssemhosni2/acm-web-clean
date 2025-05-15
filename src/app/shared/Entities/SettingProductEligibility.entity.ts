export class SettingProductEligibilityEntity {
    id: number;
    productId: number;
    gender: string;
    region: string;
    minPreviouslyIssuedLoansNumber: number;
    // Min Personal Contribution
    minFixedLoanAmount: number;
    minLoanAmountPercantage: number;
    // Risk Indicators
    maxContinuousLateDays: number;
    maxSeparateLateDays: number;
    // switch buttons 
    genderStatus: boolean;
	regionStatus: boolean;
	riskIndicatorsStatus: boolean;
	personalContributionStatus: boolean;
	loansNumberStatus: boolean;
}