import { CustomerEntity } from './customer.entity';
import { LoanProcessEntity } from './loan.process.entity';
import { UserDefinedFieldsLinksEntity } from './userDefinedFieldsLinks.entity';
import { ProductEntity } from './product.entity';
import { CollateralEntity } from './Collateral.entity';
import { AssetLoanEntity } from './AssetLoan.entity';
import { AcmCreditLineAccountAssignment } from "./AcmCreditLineAccountAssignment.entity";
import { AcmKycCheckEntity } from './AcmKycCheck.entity';
import { ScheduleEntity } from './schedule.entity';

export class LoanEntity {
  loanId: number;
  applyAmountTotal: number;
  approvelAmount: number;
  applyDate: string;
  cuLoanReFinanceReason: string;
  currencyId: string;
  gracePeriod: string;
  industryCode: number;
  industryCodeDescription: string;
  issueDate: Date;
  loanSourceOffunds: string;
  portfolioId: string;
  productId: number;
  processInstanceId: number;
  idLoanExtern: string;
  statut: string;
  idAccountExtern: number;
  accountNumberExtern: string;
  accountNumber: string;
  creationDate: string;
  termPeriodNum: number;
  paymentPeriod: string;
  paymentFreq: number;
  issueFeeAmount: number;
  productCode: string;
  productDescription: string;
  productRate: number;
  customerId: number;
  loanReasonId: number;
  loanReasonCode: string;
  loanReasonDescription: string;
  portfolioCode: string;
  portfolioDescription: string;
  currencySymbol: string;
  currencyDecimalPlaces: string;
  customerName: string;
  customerNameNoPipe: string;
  owner: string;
  ownerName: string;
  statutLibelle: string;
  statutWorkflow: number;
  etapeWorkflow: number;
  workflowNextAction: string;
  pourcentage: string;
  ihmRoot: string;
  note: string;
  dateLastUpdate: Date;
  contactDateCustomerDecision: Date;
  commentsCustomerDecision: string;
  /* confirm checkbox reject/review/approve : check BE*/
  confirm: boolean;
  normalPayment: any;
  codeExternMotifRejet: number;
  category: string;
  loanCalculationMode: number;
  listMissingData: string[];
  customerDTO: CustomerEntity;
  customerType: string;
  parentId: number;
  approvelAmountGroupe: number;
  childMissingInfo: boolean;
  initialPaymentDate: Date;
  ignoreOddDays: boolean;
  /** The community CU loan ID. */
  communityCULoanID: number;
  /** The guarantor source id. */
  guarantorSourceId: number;
  /** The source of funds ID. */
  sourceOfFundsID: number;
  /** The refinance reason id. */
  refinanceReasonId: number;
  /** The district code id. */
  districtCodeId: number;
  /** The interest freq. */
  interestFreq: number;
  intPayPeriodNum: number;
  termPeriodID: number;
  loanInstancesDtos: LoanProcessEntity[];
  userDefinedFieldsLinksDTOs: UserDefinedFieldsLinksEntity[];
  updateLoan: boolean;
  branchID: number;
  branchDescription: string;
  branchName: string;
  /** The periods deferred. */
  periodsDeferred: number;
  /** The periods deferred type. */
  periodsDeferredType: number;
  assignCustomer: boolean;
  guarantors: CustomerEntity[];
  apr: number;
  effectiveIntRate: number;
  /** The product DTO (USED ONLY in saveToAbacus () method). */
  productDTO: ProductEntity;
  /** Used only update Loan for group. */
  changed: boolean;
  /** group owner */
  groupOwner: string;
  /** group owner name */
  groupOwnerName: string;
  collaterals: CollateralEntity[];
  // application fees based on Renewel condition of customer having loans
  feeAmt1: number;
  /** Update Loan In Abacus */
  updateLoanAbacus: boolean;
  stepName: string;
  workFlowAction: string;
  loanApplicationStatus: string;
  openingBalance: number;
  loanAssetsDtos : AssetLoanEntity[];
  quantitySupplier : number;
  balanceSupplier : number;
  isOwnerOrValidator : boolean;
  reviewFrom: number;
  totalInterest : number ;
  personalContribution : number ;
  workflowCompleted : boolean;
  reviewOnlySelectedStep : boolean;
  idIbLoan : number;
  otherInformations :string;
  customRate  : number ;
  installmentNumber: number ;
  checkMezaCard: boolean; 

  /** From Generic Model */
  dateInsertion : Date;
  enabled : Boolean;
  acmVersion : number;
  updatedBy : string;
  insertBy : string;
  acceptLoanStep : boolean;
  creditLineAssignments: AcmCreditLineAccountAssignment[];
  acmKycChecks: AcmKycCheckEntity[];
  listStatus : number[];
  loanSchedules :ScheduleEntity[];
  acmIssueFees: number;
  drAmount : number;
  crAmount : number;
  issuedStatut: string;
  earlyPaid: boolean;
  constructor() {
  }
}
