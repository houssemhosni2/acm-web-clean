import { ClaimsListEntity } from "./claims.list.entity";

export class ClaimsPaginationEntity {
    id?: string | number;
    pageNumber: number;
    pageSize: number;
    params: ClaimsListEntity;
    sortDirection: number;
    sortField: string;
    resultsClaims: ClaimsListEntity[];
    totalPages: number;
    totalElements: number;

    constructor() {

    }   
}