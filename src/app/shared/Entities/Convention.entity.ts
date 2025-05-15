import { SupplierEntity } from './Supplier.entity';
import { SettingDocumentTypeEntity } from './settingDocumentType.entity';

export class ConventionEntity {
  /** The id supplier. */
  id: number;

  /** The name Supplier */
  discountRate : number;

  /** The start Date Convention . */
  startDateConvention: any;

  /** The  end Date Convention. */
  endDateConvention: any;

  /** The rebate. */
  rebate: number;

  /** The turnover. */
  ca: number ;

  /** The turnover. */
  supplier: SupplierEntity ;

  applyRate =false  ;

  file :File ;
  fileName :string ;

  forRemove =false;

  objectiveTurnoverVolume: number;
  objectiveFileNumber: number;

  listDocsType : SettingDocumentTypeEntity[]  =[] ;

}
