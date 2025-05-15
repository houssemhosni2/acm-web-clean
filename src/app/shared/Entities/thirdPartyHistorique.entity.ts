export class ThirdPartyHistoriqueEntity {
  /** The id. */
  id: number;
  /** The id loan. */
  idLoan: number;
  /** The id customer. */
  idCustomer: number;
  /** The id customer guarantor. */
  idCustomerGuarantor: number;
  /** The identity customer. */
  identityCustomer: string;
  /** The identity customer guarantor. */
  identityCustomerGuarantor: string;
  /** The category => AML - ISCORE - KYC. */
  category: string;
  /** The status. */
  status: string;
  /** The request value. */
  requestValue: string;
  /** The response value. */
  responseValue: string;
  /** The date insertion. */
  dateInsertion: Date;
  /** The insert by. */
  insertBy: string;
  /** The reportTag. */
  reportTag: string;
  /** The score I-Score. */
  score: number;
  /** The score AML. */
  amlPourcentage: number;
  /** The risk level Color from reis. */
  riskLevel :  string ;
 /** The search Query Id from reis. */
  searchQueryId ;
  /** list category. */
  categoryList: string[];
}
