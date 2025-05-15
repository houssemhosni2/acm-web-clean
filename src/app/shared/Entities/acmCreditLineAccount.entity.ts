
import { AdvancedSearchDTO } from "./AdvancedSearchDTO.entity";
import { AcmCreditLineAccountAssignment } from "./AcmCreditLineAccountAssignment.entity";

export class CreditLineAccount {
  id: number;
  accountNumber: string;
  accountStatus: string;
  active: boolean;
  adjustment: boolean;
  customerId: number;
  fullName: string;
  age: number;
  geographicArea: string;
  issueDate: Date;
  issueAmount: number;
  loanTenure: number;
  outstanding: number;
  product: string;
  branchName: string;
  nationalId: string;
  gender: string;
  educationLevel: string;
  socialStatus: string;
  sector: string;
  rating: string;
  lastPaymentDueDate: Date;
  remainingInstallments: number;
  delinquentDays: number;
  issuedInterest: number;
  outstandingInterest: number;
  assignmentStatus: string;
  enabled: boolean;
  dateInsertion: Date;
  dateLastUpdate: Date;
  acmVersion: number;
  updatedBy: string;
  insertBy: string;

  // advanced search
  advancedSearchDTO: AdvancedSearchDTO[];
  // Filter
  accountNumberFilter: string;
  creditLineAssignments: AcmCreditLineAccountAssignment[];

  constructor() {
    // Initialize default values or perform other setup if needed
  }
}
