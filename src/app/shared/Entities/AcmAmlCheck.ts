import { ItemEntity } from "src/app/shared/Entities/Item.entity";
export class AcmAmlCheckEntity {
   	/** The id. */
	  id  : number;

	/** The customer id. */
	customerId : number;
	/** The id generic work flow. */
	 idGenericWorkFlow : number;

	/** The score. */
	 score  : number;

	/** The list name. */
	 listName : string ;

	/** The aml status. */
	 amlStatus : string ;

	/** The id aml data. */
	 idAmlData : string ;
     dateInsertion  : Date ;

    constructor( ) {

    }

}
