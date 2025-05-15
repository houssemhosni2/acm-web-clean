import { AcmIhmFieldEntity } from './acmIhmField.entity';
import { GroupeEntity } from './groupe.entity';

export class AcmIhmFieldGroupe {
    habilitation: string;
    acmIhmField: AcmIhmFieldEntity;
    group: GroupeEntity;

    constructor() {
    }
}
