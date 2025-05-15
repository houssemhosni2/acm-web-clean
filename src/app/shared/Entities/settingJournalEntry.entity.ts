import { SettingJournalEntryTypeEntity } from './settingJournalEntryType.entity';

export class SettingJournalEnteriesEntity {
  /** The id. */
  id: number;
  /** The code. */
  code: string;
  /** The libelle. */
  libelle: string;
  /** The description. */
  description: string;
  /** The code external from abacus. */
  amount: string;
  /** The enable setting. */
  percentage : number ;
  debitAccount : string ;
  idDebitAcount : number ;
  creditAccount : string ;
  idCreditAccount : number ;
  enabled: boolean;
  bySupplier: boolean;
  idTypeJournalEntry : number ;
  settingJournalEntryType : SettingJournalEntryTypeEntity  = new SettingJournalEntryTypeEntity();
  forDelete: boolean ;
  constructor() {
    this.code = '';
    this.libelle = '';
    this.description = '';
  }
}
