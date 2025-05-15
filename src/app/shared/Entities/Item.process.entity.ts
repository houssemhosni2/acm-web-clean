import { SettingThirdPartyEntity } from "./settingThirdParty.entity";

export class ItemProcessEntity {
  public  id : number;
	/** The item DTO. */
	public  idItem : number;
	/** The code. */
	public idWorkFlowStep :  number ;
	/** The libelle. */
	public  libelle : string;
	/** The description. */
	public  description : string;
	/** The code statut loan. */
	public  codeStatutItem : number ;
	/** The statut loan. */
	public  statutItem : string;
	/** The statut loan. */
	public  ihmRoot : string;
	/** The orderEtapeProcess. */
	public  orderEtapeProcess : number;

  	public stepName : string  ;

  	public thirdParties: SettingThirdPartyEntity[];

  	public enabled : boolean ;

  	/** The automaticStep. */
  	public automaticStep : boolean;

	actionUser: string;

  constructor() {

  }
}
