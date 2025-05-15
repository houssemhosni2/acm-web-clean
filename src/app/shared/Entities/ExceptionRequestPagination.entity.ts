import { ExceptionRequestEntity } from './ExceptionRequest.entity';

export class ExceptionRequestPaginationEntity {
    pageNumber: number;
    pageSize: number;
    params: ExceptionRequestEntity;
    sortDirection: number;
    sortField: string;
    result: ExceptionRequestEntity[];
    totalPages: number;
    totalElements: number;
    constructor() {
    }
}
