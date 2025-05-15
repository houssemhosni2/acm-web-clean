import { GroupeEntity } from './groupe.entity';

export class UserEntity {
  login: string;
  nom: string;
  prenom: string;
  email: string;
  fullName: string;
  password: string;
  accountPortfolioId: string;
  responsableId: string;
  userExternId: string;
  userProfilId: string;
  enabled: boolean;
  branchID: number;
  branchName: string;
  branchDescription: string;
  groupes: GroupeEntity[];
  accessBranches: string;
  simpleName: string;
  /** The temporary pwd. */
  temporaryPwd: boolean;
  /** The pwd. */
  pwd: string;
  /** The pwd new. */
  pwdNew: string;
  /** The Pwd confirm. */
  pwdConfirm: string;
  /** The Category */
  category: string;
  /** Portfolio name */
  portfolioName: string;
  defaultLang: string;
  oldResponsibleId: string;
  loginAndName: string; // usred in porperties diplayed in ngx-select-dropdown in setting-user
  hiringDate: Date;
  resigningDate: any;
  /** temporaryResponsable */
  temporaryResponsable: boolean;
  /** oldResponsableName */
  oldResponsableName: string;
  /** changeAllResponsible */
  changeAllResponsible: boolean;
  /** employeeId  */
  employeeId: string;
  /** pwdExpiryDate */
  pwdExpiryDate: Date;
  temporaryPassword:string;
}
