export class BrancheEntity {
  /** The branch ID. */
  branchID: number;
  /** The name. */
  name: string;
  /** The description. */
  description: string;

  /** The code. */
  code: string;

  /** The sort code. */
  sortCode: string;

  /** The access all. */
  accessAll: boolean;

  /** The allow customers. */
  allowCustomers: boolean;

  /** The back office GL. */
  backOfficeGL: boolean;

  /** The enabled. */
  enabled: boolean;

  /** The address ID. */
  addressID: number;

  /** The branch phone number. */
  branchPhoneNumber: string;

  /** The branch fax number. */
  branchFaxNumber: string;

  /** The branch email. */
  branchEmail: string;

  /** The increment days. */
  incrementDays: number;

  /** The use closed days holidays. */
  useClosedDaysHolidays: number;

  /** The closed days. */
  closedDays: number;

  /** The cheque clearance personal. */
  chequeClearancePersonal: number;

  /** The cheque clearance third party. */
  chequeClearanceThirdParty: number;

  /** The parent branch ID. */
  parentBranchID: number;

  /** The regional manager ID. */
  regionalManagerID: number;

  /** The g L account code. */
  gLAccountCode: string;

}
