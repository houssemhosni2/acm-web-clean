export class UserDefinedFieldGroupEntity {
  /** The id. */
  id: number;

  /** The id UD group abacus. */
  idUDGroupAbacus: number;

  /** The code. */
  code: string;

  /** The description. */
  description: string;

  /** The loan id. */
  loanId: number;

  // The UDF customer type:
  // - 0 : groupe crédit - 1 : Individuel - 4 : Organisation
  // - 8 : Groupe - 5 : Individuel & organisation - 9 : Individuel & groupe
  // - 12 : organisation et groupe - 13 : Tous les types.
  customerType: number;

  /** The customer type label. */
  customerTypeLabel: string;

  /** The customer id. */
  customerId: number;

  /** The product id. */
  productId: number;

  /** The enabled. */
  enabled: boolean;

  /** The mondatory. */
  mondatory: boolean;

  indexGroup: number;

/* The `category` property is a string that represents the category of the user-defined field group.  */
  category: string;
}
