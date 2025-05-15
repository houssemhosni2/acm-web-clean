import { GenericWorkFlowObject } from "./GenericWorkFlowObject";

export class AcmAmlListSetting {
    id: number;
    minRejectionRange: number;
    maxRejectionRange: number;
    minAcceptanceRange: number;
    maxAcceptanceRange: number;
    listName: string;
    isBlockingList: boolean;
    listKeywords: string;
    descriptionKeywords: string;
    genericWorkFlowObject: GenericWorkFlowObject;
    enabled: boolean;
    dateInsertion: Date;
    dateLastUpdate: Date;
    acmVersion: number;
    updatedBy: string;
    insertBy: string;
}