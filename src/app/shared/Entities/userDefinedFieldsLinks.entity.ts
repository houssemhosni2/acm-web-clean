import { UserDefinedFieldsEntity } from './userDefinedFields.entity';

export class UserDefinedFieldsLinksEntity {
  /** The id. */
  id: number;

  /** The user defined fields. */
  userDefinedFieldsDTO: UserDefinedFieldsEntity;



  /** The udf list value id. */
  udfListValueId: number;

  /** The field value. */
  fieldValue: string;

  /** The id abacus UDF link. */
  idAbacusUDFLink: number;

  /** The surveys id. */
  surveysId: number;

  /** The index group. */
  indexGroup: number;

  cutomerType: string;

  productId: number;

  ibLoanId : number;
	ibCustomerId: number;

  category: string;

  elementId: number;

  udfGroupIds:number[];

}
