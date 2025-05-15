import { SettingThirdPartyEntity } from 'src/app/shared/Entities/settingThirdParty.entity';
export class CollectionProcessEntity {
    id: number;
    idAcmCollectionStep: number;
    libelle: string;
    description: string;
    codeStatutCollection: string;
    statutCollection: string;
    idCollection: number;
    ihmRoot: string;
    orderEtapeProcess: number;
    stepName: string;
    thirdParties: SettingThirdPartyEntity[];
    actionUser: string;

    constructor() {

    }
  }
