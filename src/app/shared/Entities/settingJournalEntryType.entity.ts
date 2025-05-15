import { SettingJournalEnteriesEntity } from './settingJournalEntry.entity';

export class SettingJournalEntryTypeEntity {
  /** The id. */
  id: number;
  /** The code. */
  code: string;
  /** The description. */
  description: string;
  /** The code external from abacus. */
  codeExternal: number;
  /** The enable setting. */
  enabled: boolean;
  /** The journal description */
  journalDescription : string;
  /** The journal id */
  journalId : number;
  /** The setting Journal Entries */
  settingJournalEnteries : SettingJournalEnteriesEntity[]  = [];

  constructor() {
    this.code = '';
    this.description = '';
  }
}
