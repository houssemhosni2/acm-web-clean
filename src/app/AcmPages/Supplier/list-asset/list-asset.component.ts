import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { AssetEntity } from 'src/app/shared/Entities/Asset.entity';
import { AssetPaginationEntity } from 'src/app/shared/Entities/AssetPagination.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { SupplierService } from '../supplier.service';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-list-asset',
  templateUrl: './list-asset.component.html',
  styleUrls: ['./list-asset.component.sass']
})
export class ListAssetComponent implements OnInit {
  @Input() mode;
  public cols: any[];
  public selectedColumns: any[];
  public page: number;
  public supplier: SupplierEntity;
  @Output() selectedAssets = new EventEmitter();
  @Output() newItemEvent = new EventEmitter<AssetEntity>();
  public pageSize: number;
  public assetPaginationEntity: AssetPaginationEntity = new AssetPaginationEntity();
  public asset: AssetEntity[];
  @Input() search = false;
  @Input() fromSupplier360 = false;
  public decimalPlaces: string;
  public currentPath = AcmConstants.ASSET_LIST;
  public editSupplier: string;
  constructor(public sharedService: SharedService, public supplierService: SupplierService, public router: Router,private dbService: NgxIndexedDBService,
    public modal: NgbModal, public devToolsServices: AcmDevToolsServices, public route: ActivatedRoute) { }

  async ngOnInit() {
    this.assetPaginationEntity.params = new AssetEntity();
    this.supplier = this.sharedService.supplier;
    this.route.queryParams.subscribe(params => {
      this.editSupplier = params.editSupplier;
    });
    if (this.fromSupplier360) {
      this.cols = [
        { field: 'codeArticle', header: 'asset.code-asset' },
        { field: 'libelle', header: 'asset.label' },
        { field: 'description', header: 'asset.description' },
        { field: 'prixUnitaire', header: 'asset.unit-price' },
        { field: 'remiseArticle', header: 'asset.discount-asset' },
        { field: 'insertBy', header: 'visit.insert_by' },
        { field: 'dateInsertion', header: 'visit.creation_date' }
      ];

      this.assetPaginationEntity.params.supplier = new SupplierEntity();
      this.assetPaginationEntity.params.supplier.id = this.supplier.id;
   } else {
      this.cols = [
        { field: 'codeArticle', header: 'asset.code-asset' },
        { field: 'libelle', header: 'asset.label' },
        { field: 'description', header: 'asset.description' },
        { field: 'supplierName', header: 'supplier.name' },
        { field: 'prixUnitaire', header: 'asset.unit-price' },
        { field: 'remiseArticle', header: 'asset.discount-asset' },
        { field: 'insertBy', header: 'visit.insert_by' },
        { field: 'dateInsertion', header: 'visit.creation_date' }
      ];
    }

    const colsPopup = [
      { field: 'supplierName', header: 'supplier.name' },
      { field: 'codeArticle', header: 'asset.code-asset' },
      { field: 'libelle', header: 'asset.label' },
      { field: 'description', header: 'asset.description' },
      { field: 'prixUnitaire', header: 'asset.unit-price' },
      { field: 'remiseArticle', header: 'asset.discount-asset' },
      { field: 'typeAsset', header: 'asset.type' },
      { field: 'categoryAsset', header: 'asset.categorie' },
      { field: 'subCategoryAsset', header: 'asset.sous-categorie' }
    ]; 
    // if(checkOfflineMode()){
    //   const assetsList = await this.dbService.getByKey('data', 'asset-pagination').toPromise() as any;
    //   if(assetsList == undefined){
    //     this.devToolsServices.openToast(3, 'No assets saved for offline use');
    //   } else {
    //     this.assetPaginationEntity = assetsList.data;

    //   }
    // }
    // init pagination params
    this.selectedColumns = this.search ? colsPopup : this.cols;
    this.pageSize = 10;
    this.page = 1;
    if (this.mode === 'edit') {
      const param = new AssetEntity();
      const supplierParam = new SupplierEntity();
      supplierParam.status = AcmConstants.SUPPLIER_APPROVED;
      param.supplier = supplierParam;

    }
    if (this.editSupplier == 'true') {
      this.assetPaginationEntity.params.supplier.id = this.supplier.id;
    }
    else if (this.assetPaginationEntity.params.supplier === undefined || this.assetPaginationEntity.params.supplier === null) {
      this.assetPaginationEntity.params.supplier = new SupplierEntity();
      this.assetPaginationEntity.params.supplier.statusRejected = AcmConstants.SUPPLIER_REJECTED;
    }
    else {
      this.assetPaginationEntity.params.supplier.statusRejected = AcmConstants.SUPPLIER_REJECTED;
      this.assetPaginationEntity.params.supplier.statusNotContracted = AcmConstants.SUPPLIER_NON_CONTRACTED;
    }
    if(!checkOfflineMode()){
    await this.supplierService.getAssetsPagination(this.assetPaginationEntity).subscribe(
      (data) => {
        this.assetPaginationEntity = data;        
      });
    }
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(3);
  }
  /**
   * close Modale
   */
  closeModale() {
    this.modal.dismissAll();
  }

  async reloadAssetList(event: LazyLoadEvent) {
    const assetPaginationEntity: AssetPaginationEntity = new AssetPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    assetPaginationEntity.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      assetPaginationEntity.pageNumber = event.first;
    } else {
      assetPaginationEntity.pageNumber = event.first / event.rows;
    }
    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const assetParams: AssetEntity = new AssetEntity();
    if (event.filters !== undefined) {
      assetParams.codeArticle = event.filters.codeArticle !== undefined ? event.filters.codeArticle.value : null;
      assetParams.libelle = event.filters.libelle !== undefined ? event.filters.libelle.value : null;
      assetParams.description = event.filters.description !== undefined ? event.filters.description.value : null;
      assetParams.supplierName = event.filters.supplierName !== undefined ? event.filters.supplierName.value : null;
      assetParams.prixUnitaire = event.filters.prixUnitaire !== undefined ? event.filters.prixUnitaire.value : null;
      assetParams.remiseArticle = event.filters.remiseArticle !== undefined ? event.filters.remiseArticle.value : null;
      assetParams.typeAsset = event.filters.typeAsset !== undefined ? event.filters.typeAsset.value : null;
      assetParams.categoryAsset = event.filters.categoryAsset !== undefined ? event.filters.categoryAsset.value : null;
      assetParams.subCategoryAsset = event.filters.subCategoryAsset !== undefined ? event.filters.subCategoryAsset.value : null;
      assetParams.insertBy = event.filters.insertBy !== undefined ? event.filters.insertBy.value : null;
      assetParams.dateInsertion = event.filters.dateInsertion !== undefined ? event.filters.dateInsertion.value : null;

    }
    assetPaginationEntity.params = assetParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      assetPaginationEntity.sortField = event.multiSortMeta[0].field;
      assetPaginationEntity.sortDirection = event.multiSortMeta[0].order;
    }
    assetPaginationEntity.params.supplier = new SupplierEntity();
    if (this.editSupplier == 'true') {
      assetPaginationEntity.params.supplier.id = this.supplier.id;
    }
    else if (assetPaginationEntity.params.supplier === undefined || assetPaginationEntity.params.supplier === null) {
    // assetPaginationEntity.params.supplier = new SupplierEntity();
      assetPaginationEntity.params.supplier.statusRejected = AcmConstants.SUPPLIER_REJECTED;
    }
    else {
      if (this.supplier) {
        if (this.supplier.id) {
          assetPaginationEntity.params.supplier.id = this.supplier.id;
        }
      }
    }
    await this.supplierService.getAssetsPagination(assetPaginationEntity).subscribe(
      (data) => {
        this.assetPaginationEntity = data;
      }
    );
  }

  updateAsset(rowData, mode) {
    this.sharedService.setAsset(rowData);
    if (mode === 'UPDATE') {
      this.router.navigate(['/acm/update-asset'], { queryParams: { mode: 'update' } });
    } else {
      this.router.navigate(['/acm/update-asset']);
    }
  }

  /**
   * Get Selected Assets
   */
  addSelectedAssets(rowData: any) {
    this.selectedAssets.emit(rowData);
    this.newItemEvent.emit(rowData);
  }

  /**
   * add asset
   * @param asset asset
   */
  addAsset(asset) {
    this.selectedAssets.emit(asset);
    this.modal.dismissAll();
  }
}
