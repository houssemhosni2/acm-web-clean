import { PortfolioEntity } from "./Portfolio.entity";

export class PortfolioPaginationEntity {
    pageNumber: number;
    pageSize: number;
    params: PortfolioEntity;
    sortDirection: number;
    sortField: string;
    resultsPortfolio: PortfolioEntity[];
    totalPages: number;
    totalElements: number;
  
    constructor() {
  
    }
  }