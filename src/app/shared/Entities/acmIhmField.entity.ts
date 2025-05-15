
import { AcmIhmFormEntity } from './acmIhmForm.entity';
import { AcmIhmValidatorEntity } from './acmIhmValidator.entity';

export class AcmIhmFieldEntity {
  id: number;
  codeField: string;
  typeField: string;
  formControlName: string;
  defaultValue: string;
  titre: string;
  description: string;
  placeholder: string;
  required: boolean;
  ordre: number;
  singleSelect: boolean;
  validators: AcmIhmValidatorEntity[];
  habilitation: string;
  max: number;
  codeForm: string;
  enabled: boolean;
  enableHabilitation: boolean;
  hiddenHabilitation: boolean;
  codeUserGroup: string;
  acmIhmFormDTO: AcmIhmFormEntity;
  subCodeField: string;
  listId: number;
  constructor() {
  }
}
