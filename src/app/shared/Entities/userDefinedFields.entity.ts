import { UserDefinedFieldGroupEntity } from './userDefinedFieldGroup.entity';
import { UserDefinedFieldListValuesEntity } from './userDefinedFieldListValues.entity';

export class UserDefinedFieldsEntity {
  /** The id. */
  id: number;

  /** The user defined field group. */
  userDefinedFieldGroupDTO: UserDefinedFieldGroupEntity;

  /** The id UDF field. */
  idUDFField: number;

  /** The id UDF parent field. */
  idUDFParentField: number;

  /** The udf parent field value. */
  udfParentFieldValue: string;

  /** The field masc. */
  fieldMasc: string;

  /** The name. */
  name: string;

  /** The description. */
  description: string;

  /** The mandatory. */
  mandatory: boolean;

  // The 1 = Texte
  // The 2 = Numerique
  // The 4 = Date
  // The 5 = liste
  fieldType: number;

  /** The field type label. */
  fieldTypeLabel: string;

  /** The id UDF list value. */
  idUDFListValue: number;

  /** The enabled. */
  enabled: boolean;

  fieldListValuesDTOs: UserDefinedFieldListValuesEntity[];

  fieldValue: string;

  /** The parent UDF list value. */
  parentUDFListValue: number;

  /** The id abacus UDF link . */
  idAbacusUDFLink: number;
  /** The surveys id idUDFLink. */
  surveysId: number;
  /** The idUDFLink. */
  idUDFLink: number;

  /** The Delete flag for BackEnd. */
  delete: boolean;
  /** The uniqueField */
  uniqueField: boolean;

  /** The order. */
  ordre: number;

  names: string[] = [];
}
