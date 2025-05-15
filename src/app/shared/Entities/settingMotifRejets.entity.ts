export class SettingMotifRejetsEntity {
  /** The id. */
  id: number;
  /** The categorie. REJET / REVIEW / AUTRE */
  categorie: string;
  /** The code. */
  code: string;
  /** The libelle. */
  libelle: string;
  /** The description. */
  description: string;
  /** The code external from abacus. */
  codeExternal: number;
  /** The enable setting. */
  enabled: boolean;

  constructor() {
    this.categorie = '';
    this.code = '';
    this.libelle = '';
    this.description = '';
  }
}
