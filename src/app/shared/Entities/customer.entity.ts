import { CustomerLinksRelationshipEntity } from './CustomerLinksRelationship.entity';
import { AddressEntity } from './Address.entity';
import { UserDefinedFieldsLinksEntity } from './userDefinedFieldsLinks.entity';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UDFLinksGroupeFieldsModelEntity } from './udfLinksGroupeFieldsModel.entity';
import { IndustryEntity } from './industry.entity';
import { ThirdPartyHistoriqueEntity } from './thirdPartyHistorique.entity';
import { AcmMezaCardEntity } from './acmMezaCard.entity';
import { UDFLinksGroupeFieldsEntity } from './udfLinksGroupeFields.entity';
import { AcmAmlCheckEntity } from './AcmAmlCheck';
import { AcmKycCheckEntity } from './AcmKycCheck.entity';
import { listNameBadgeEntity } from './listNameBadge.entity';
export class CustomerEntity {
  id: number;
  customerIdExtern: number;
  customerNumber: string;
  customerName: string;
  customerNameNoPipe: string;
  firstName: string;
  secondName: string;
  middleName: string;
  lastName: string;
  customerOpenDate: string;
  dateOfBirth: Date;
  dateOfBirthHijri: string;
  accountPortfolioID: string;
  accountPortfolioCode: string;
  accountPortfolioDescription: string;
  altName: string;
  customerAddress: string;
  branchId: number;
  branchesName: string;
  branchesDescription: string;
  age: number;
  arrearDay: number;
  arrearSchedule: number;
  telephone1: string;
  telephone2: string;
  telephone3: string;
  customerType: string;
  customerCategory: string;
  organisationId: number;
  groupeId: number;
  telephone: string;
  fax: string;
  registerNumber: string;
  webSite: string;
  sector: string;
  organisationIdExtern: string;
  email: string;
  gender: string;
  organizationName: string;
  accountYearEnd: Date;
  customerLinksRelationshipDTOs: CustomerLinksRelationshipEntity[];
  // Only links
  customerLinksDTOs: CustomerLinksRelationshipEntity[];
  solidarityName: string;
  listAddress: AddressEntity[];
  updateCustomer: boolean;
  isCustomer: boolean;
  userDefinedFieldsLinksDTOs: UserDefinedFieldsLinksEntity[];
  amountGuarantor: number;
  listUDF: UserDefinedFieldsLinksEntity[];
  guarantors: CustomerEntity[];
  listUDFGroup: UDFLinksGroupeFieldsModelEntity[];
  /** expiry hijry date */
  expiryHijryDate: NgbDateStruct;
  identity: string;
  industryCode: IndustryEntity;
  resident: boolean;
  /** Customer screening */
  // KYC variables
  colorCustomerKYC: string;
  riskLabelCustomerKYC: string;
  currentCustomerKYC: number;
  existkyc: boolean;
  thirdPartyHistoriqueKyc: ThirdPartyHistoriqueEntity;
    // Score variables
    colorCustomerSCORE: string;
    riskLabelCustomerSCORE: string;
    currentCustomerSCORE: number;
    existSCORE: boolean;
    thirdPartyHistoriqueSCORE: ThirdPartyHistoriqueEntity;
  // AML variables
  currentCustomerAML: number;
  colorCustomerAml: string;
  existaml: boolean;
  thirdPartyHistoriqueAml: ThirdPartyHistoriqueEntity;
  // ISCORE variables
  currentCustomerISCORE: number;
  colorCustomerISCORE: string;
  existISCORE: boolean;
  thirdPartyHistoriqueISCORE: ThirdPartyHistoriqueEntity;
  customerLinkCategory: string;
  maritalStatus: string;
  imageGrpOrg: any;
  photo: any;
  mezaCardId: number;
  disbursementMethodUpdatedToOtherThanMezaCard: boolean;
  // NONE / NEW / SENT / TRUST / UNTRUST
  mezaCardStatus: string;
  acmMezaCardDTO: AcmMezaCardEntity;
  disbursementMethodSelected: string;
  dateInsertion: Date;
  action: string; // 'D' ; 'I' ; 'U'
  // flag to disable critical data
  enableCriticalData: boolean;
  enabled: boolean;
  ibCustomerId : number;
  udfLinksGroupeFieldsDTOs :UDFLinksGroupeFieldsEntity[] ;

  isSupplier: boolean;
  beneficialEffective: string;
  prospectionSource: string;
  prospectionComment: string;
  supplierRecommandation: number;
  acmAmlChecksDTOs : AcmAmlCheckEntity[] ;

  acmKycChecks: AcmKycCheckEntity[];
  listName : listNameBadgeEntity[]  ;
  itemId : number;
  balanceAbacus : number;
  balanceTotal : number;
  residentId: number;
  nationalId: number;
  issueDate: any;
  expiryDate: any;
  hijiriBirthDate: any;
  fields: any;
  constructor() {
  }
}
