import { SettingThirdPartyEntity } from 'src/app/shared/Entities/settingThirdParty.entity';

import { CollectionProcessEntity } from './CollectionProcess.entity';

export class CollectionEntity {
  /** The id. */
  id: number;

  /** The typeCustomer. */
  typeCustomer: string;

  /** The accountNumber. */
  accountNumber: string;

  /** The productDescription. */
  productDescription: string;

  /** productId. */
  productId: number;

  /** The customerName. */
  customerName: string;

  /** The branchDescription. */
  branchDescription: string;

  /** branchId. */
  branchId: number;

  /** currencyDecimalPlaces.  */
  currencyDecimalPlaces: number;

  /** currencySymbol. */
  currencySymbol: string;

  /** The amount. */
  amount: number;

  /** The loanOfficer. */
  loanOfficer: string;

  /** The firstUnpaidInstallment. */
  firstUnpaidInstallment: Date;

  /** The unpaidAmount. */
  unpaidAmount: number;

  /** The lateDays. */
  lateDays: number;

  /** The numberOfUnpaidInstallment. */
  numberOfUnpaidInstallment: number;

  /** The status. */
  status: number;

  /** The idAcmCollectionStep. */
  idAcmCollectionStep: number;

  /** The enabled. */
  enabled: boolean;

  /** The dateInsertion. */
  dateInsertion: Date;

  /** The date of last update */
  dateLastUpdate: Date;

  /** The customer id extern */
  customerIdExtern: number;

  /** The id loan extern */
  idLoanExtern: number;

  /** The collection instances dto */
  collectionInstancesDtos : CollectionProcessEntity[];

  /** The available Date */
  availableDate : Date;

  /** the libelle of the actual step */
  statutLibelle : string;

  /** the libelle of the already done step */
  statutLibelleDone : string;

 /** The owner Name */
  ownerName : string;

  /** The owner */
  owner: string;

  /** The type of collection */
  collectionType: string;

  /** The id parent of collection */
  idParentCollection: number;

  /** The third party collections */
  acmThirdPartyCollections: SettingThirdPartyEntity[];

  acmParticipantsCollections: SettingThirdPartyEntity[];

  /** The pending collection instance */
  pendingCollectionInstance : CollectionProcessEntity;

/** The statut workflow. */
  statutWorkflow: String;

/** The groupOwner. */
  groupOwner : string ;

  /** The groupOwnerName. */
  groupOwnerName :string ;

  subWorkFlowStatus : string  ;

  reviewOnlySelectedStep  : boolean ;

  reviewFrom :number  ;



  constructor(){
  }
}
