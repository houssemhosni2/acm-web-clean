import { UDFLinksGroupeFieldsModelEntity } from './udfLinksGroupeFieldsModel.entity';

export class UDFLinksGroupeFieldsEntity {

  /** The user defined field group ID. */
  userDefinedFieldGroupID: number;

  /** The user defined field group name. */
  userDefinedFieldGroupName: string;

  /** The udf groupe fields models. */
  udfGroupeFieldsModels: UDFLinksGroupeFieldsModelEntity[];

  /** The mondatory. */
  mondatory: boolean;
}
