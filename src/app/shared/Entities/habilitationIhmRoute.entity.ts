import { HabilitationIhmButtonEntity } from './habilitationIhmButton.entity ';

export class HabilitationIhmRouteEntity {
  /** The id. */
  id: number;
  /** The client. */
  client: string;
  /** The code ihm route. */
  codeIHMRoute: string;
  /** The ihm route. */
  ihmRoute: string;
  /** The description. */
  description: string;
  /** The list of habilitationIHMButtons */
  habilitationIHMButtonDTO: HabilitationIhmButtonEntity[];
  /** SETTINGS_WORKFLOW. */
  settingsWorkflow: boolean
}
