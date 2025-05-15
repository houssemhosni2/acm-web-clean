export class SettingClaimsEntity {
  /** The id. */
  id: number;

  category: string;

  subject : string;
  /** The description. */
  assignement: string;
  /** The code external from abacus. */
  pripority: string;
  /** The enable setting. */
  processingTimeLine: number;
  enabled : boolean ; 

  constructor() {
    this.category = '';
    this.subject = '';
    this.assignement = '';
  }
}
