export class SettingGurantorCollateralEntity {

  /** The id. */
  id: number;

  /** The product id. */
  productId: number;

  /** The code. -- GUARANTOR || -- COLLATERAL. */
  code: string;

  /** The key abacus. -- cuLoanGuarantor || -- cuLoanCollateral. */
  keyAbacus: string;

  /** The description. */
  description: string;

  /** The mandatory. */
  mandatory: boolean;

  /** The date debut. */
  dateDebut: Date;

  /** The date fin. */
  dateFin: Date;
}
