import { FormGroup } from '@angular/forms';
import { AcmIhmFieldEntity } from './acmIhmField.entity';
import { HabilitationIhmRouteEntity } from './habilitationIhmRoute.entity';

export class AcmIhmFormEntity {
    id: number;
    codePage: string;
    description: string;
    habilitationIHMRouteDTO: HabilitationIhmRouteEntity;
    acmIhmFields: AcmIhmFieldEntity[];
    formGroup: FormGroup;
    enabled: boolean;
    needFields: boolean;
    constructor() {
    }
}
