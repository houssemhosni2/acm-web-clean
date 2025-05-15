import { ExceptionRequestEntity } from './ExceptionRequest.entity';
import { ItemEntity } from './Item.entity';

export class ItemRequestPagination {
    pageNumber: number;
    pageSize: number;
    params: ItemEntity;
    sortDirection: number;
    sortField: string;
    result: ItemEntity[];
    totalPages: number;
    totalElements: number;
    constructor() {
    }
}
