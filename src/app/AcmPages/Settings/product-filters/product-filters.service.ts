import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductFiltersEntity } from 'src/app/shared/Entities/ProductFilters.entity';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';


@Injectable({
    providedIn: 'root'
})
export class ProductFiltersService {
   /**
    * constructor
    * @param httpClient HttpClient
    */
    constructor(private httpClient: HttpClient) {
    }

    findProductFilters(productFiltersEntity: ProductFiltersEntity): Observable<ProductFiltersEntity[]> {
        return this.httpClient.post<ProductFiltersEntity[]>(AcmURLConstants.FIND_PRODUCT_FILTERS, productFiltersEntity);
    }
   
    createProductFilters(productFiltersEntity: ProductFiltersEntity): Observable<ProductFiltersEntity> {
        return this.httpClient.post<ProductFiltersEntity>(AcmURLConstants.CREATE_PRODUCT_FILTERS, productFiltersEntity);
    }
    updateProductFilters(productFiltersEntity: ProductFiltersEntity): Observable<ProductFiltersEntity[]> {
        return this.httpClient.put<ProductFiltersEntity[]>(AcmURLConstants.UPDATE_PRODUCT_FILTERS, productFiltersEntity);
    }
}