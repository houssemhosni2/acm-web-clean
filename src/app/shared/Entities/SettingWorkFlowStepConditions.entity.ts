export class SettingWorkFlowStepConditions {
    id: number;

    /** The id user defined fields. */
    idUserDefinedFields: number;

    /** The id user defined field group. */
    idUserDefinedFieldGroup: number;

    /** The id workflow step. */
    idWorkflowStep: number;

    /** The id collection step. */
    idCollectionStep: number;

    entityName: string;

    fieldName: string;

    /** The operator. */
    operator: string;

    value: string;

    minValue: number;

    maxValue: number;

    enabled: boolean;
    dateInsertion: Date;
    dateLastUpdate: Date;
    acmVersion: number;
    updatedBy: string;
    insertBy: string;
}