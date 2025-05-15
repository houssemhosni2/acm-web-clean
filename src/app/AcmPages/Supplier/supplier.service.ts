import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcmURLConstants } from 'src/app/shared/acm-url-constants';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { AssetEntity } from 'src/app/shared/Entities/Asset.entity';
import { AssetPaginationEntity } from 'src/app/shared/Entities/AssetPagination.entity';
import { ConventionEntity } from 'src/app/shared/Entities/Convention.entity';
import { SupplierPaginationEntity } from 'src/app/shared/Entities/Supplier.pagination.entity';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { AssetTypeListDTO } from 'src/app/shared/Entities/AssetTypeListDTO.entity';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  /**
   * constructor
   * @param HttpClient httpClient
   */
  constructor(public httpClient: HttpClient) {
  }

  /**
   * create SupplierEntity
   * @param SupplierEntity SupplierEntity
   */
  createSupplier(supplier: SupplierEntity): Observable<SupplierEntity> {
    return this.httpClient.post<SupplierEntity>(AcmURLConstants.CREATE_SUPPLIER, supplier);
  }
  /**
   *
   * @param asset AssetEntity
   * @returns AssetEntity[]
   */
  findAsset(asset: AssetEntity): Observable<AssetEntity[]> {
    return this.httpClient.post<AssetEntity[]>(AcmURLConstants.CREATE_ASSET, asset);
  }
  /**
   *
   * @param assets AssetEntity[]
   * @returns AssetEntity[]
   */
  createAssets(assets: AssetEntity[]): Observable<AssetEntity[]> {
    return this.httpClient.post<AssetEntity[]>(AcmURLConstants.CREATE_ASSET, assets);
  }
  /**
   *
   * @param asset AssetEntity
   * @returns AssetEntity
   */
  updateAsset(asset: AssetEntity): Observable<AssetEntity> {
    return this.httpClient.put<AssetEntity>(AcmURLConstants.UPDATE_ASSET, asset);
  }
  /**
   *
   * @param assetPaginationEntity AssetPaginationEntity
   * @returns AssetPaginationEntity
   */
  getAssetsPagination(assetPaginationEntity: AssetPaginationEntity): Observable<AssetPaginationEntity> {
    return this.httpClient.post<AssetPaginationEntity>(AcmURLConstants.FIND_ASSET_PAGINATION, assetPaginationEntity);
  }
  /**
   * create SupplierEntity
   * @param SupplierEntity SupplierEntity
   */
  createConvention(convention: ConventionEntity[]): Observable<ConventionEntity[]> {
    return this.httpClient.post<ConventionEntity[]>(AcmURLConstants.CREATE_CONVENTION, convention);
  }

  /**
   * getCustomer Pagination
   */
  getSupplierPagination(supplierPaginationEntity: SupplierPaginationEntity): Observable<SupplierPaginationEntity> {
    return this.httpClient.post<SupplierPaginationEntity>(AcmURLConstants.GET_SUPPLIER_PAGINATION, supplierPaginationEntity);
  }

  findSupplierById(id: number): Observable<SupplierEntity> {
    return this.httpClient.get<SupplierEntity>(AcmURLConstants.GET_SUPPLIER_BY_ID + id);

  }
  createAddress(address: AddressEntity[]): Observable<AddressEntity[]> {
    return this.httpClient.post<AddressEntity[]>(AcmURLConstants.CREATE_ADDRESS, address);
  }

  findConventionByIdSupplier(idSupplier: number): Observable<ConventionEntity[]> {
    return this.httpClient.get<ConventionEntity[]>(AcmURLConstants.FIND_CONVENTION_BY_ID_SUPPLIER + idSupplier);

  }

  findLoansBySupplier(idSupplier: number): Observable<LoanEntity[]> {
    return this.httpClient.get<LoanEntity[]>(AcmURLConstants.GET_LOANS_BY_SUPPLIER_ID + idSupplier);
  }

  findAssetTypeList(listName : String): Observable<AssetTypeListDTO[]> {
    return this.httpClient.get<AssetTypeListDTO[]>(AcmURLConstants.FIND_ASSET_TYPE_LIST + listName);
  }

}
