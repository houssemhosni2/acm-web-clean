import { CustomerEntity } from './customer.entity';
import { LoanEntity } from './loan.entity';

export class CustomerLinksRelationshipEntity {
  /** The id. */
  id: number;

  /** The customer. */
  customerId: number;

  /** The member id. */
  member: CustomerEntity;

  /** The link relationship type. */
  linkRelationshipType: string;

  /** The category. */
  category: string;

  /** The date debut. */
  dateDebut: Date;

  /** The date fin. */
  dateFin: Date;

  /** The idloan. */
  idLoan: number;

  /** The Loan Account. */
  loanAccount: string;

  /** The Loan Amountt. */
  loanAmount: number;

  /** The Product. */
  product: string;

  /** The Customer. */
  customer: string;

  /** The amount guarantor. */
  amountGuarantor: number;

  /** the percentage owned. */
  percentageOwned: number;

  /** Test for group */
  checkForGroup: boolean;

  /** page number  */
  page: number;

  /** page size  */
  pageSize: number;

  /** loanDTO  */
  loanDTO: LoanEntity;

  /**  statut Loan */
  statutLoan: number;
}
