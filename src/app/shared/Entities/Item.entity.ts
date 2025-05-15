import { GenericWorkFlowObject } from "./GenericWorkFlowObject";
import { ItemProcessEntity } from "./Item.process.entity";
import { AcmAmlCheckEntity } from "src/app/shared/Entities/AcmAmlCheck";

export class ItemEntity {
    id:number ;
    genericWorkFlowObject : GenericWorkFlowObject   ;
    branches  : string;
    status : number  ;
    enabled :boolean;
	  /** The date insertion. */
  	dateInsertion:any;
	  /** The date last update. */
	  dateLastUpdate:any;
    /** The updated by. */
	  updatedBy :string;
  	/** The insert by. */
	  insertBy :string;
    itemInstanceDTOs : ItemProcessEntity[] ;
    actualStep : number ;
    actualStepInstance : number ;
    reviewOnlySelectedStep : boolean ;
    owner : string ;
    ownerName : string  ;
    groupOwnerName : string  ;
    groupOwner : string  ;

    reviewFromStep : number ;

    reasonLabel : string  ;

    unassignedItemStatus : number ;
    category :  string ;
    elementId : number ;

    actualStepName : string  ;
	description : string;


    amlStatus : string;
    amlCheck: AcmAmlCheckEntity;

    constructor( ) {

    }

}
