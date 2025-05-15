import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AcmConstants } from '../../../shared/acm-constants';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../shared/shared.service';
import { LazyLoadEvent } from 'primeng/api';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { SupplierService } from '../supplier.service';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { SupplierPaginationEntity } from 'src/app/shared/Entities/Supplier.pagination.entity';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { ElementId } from 'src/app/shared/Entities/elementId.entity';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.sass'],
})
export class SupplierListComponent implements OnInit {
  public cols: any[];
  public selectedColumns: any[];
  public page: number;
  public pageSize: number;
  public supplierPaginationEntity: SupplierPaginationEntity = new SupplierPaginationEntity();
  public supplier: SupplierEntity;
  public currentPath = AcmConstants.SUPPLIER_LIST;
  image: any = '../../../../assets/images/avatars/user.jpg';
  public elementId : ElementId = new ElementId() ;


  // Mode 1 : customer 360
  // Mode 2 : Edit customer
  // Mode 3 : Add loan
  public mode;
  public sectors: any[];

  @Input() search;
  @Output() supplierSelected = new EventEmitter<SupplierEntity>();

  constructor(
    public supplierService: SupplierService,
    public router: Router,
    public sharedService: SharedService,
    public activatedRoute: ActivatedRoute,
    public customerManagementService: CustomerManagementService,
    public devToolsServices: AcmDevToolsServices,
    public translate: TranslateService,
    public modalService: NgbModal
  ) {}

  lstSectorName: any = [];
  public decimalPlaces:string;
  public sectorList: string[] = [];

  async ngOnInit() {

    this.activatedRoute.queryParams.subscribe((params) => {
      this.mode = params.mode;
    });

    if (this.mode === 1 ){
      this.cols = [
        { field: 'id', header: 'supplier.number' },
        { field: 'name', header: 'supplier.name' },
        { field: 'activityName', header: 'supplier.ActivityArea' },
        { field: 'status', header: 'supplier.status' },
        { field: 'objectif', header : 'supplier.turnover-objective' },
        { field: 'balanceSupplier', header : 'schedule.balance' },
        { field: 'insertBy', header: 'visit.insert_by' },
        { field: 'dateInsertion', header: 'visit.creation_date' }
      ];
    }else {
      this.cols = [
        { field: 'id', header: 'supplier.number' },
        { field: 'name', header: 'supplier.name' },
        { field: 'activityName', header: 'supplier.ActivityArea' },
        { field: 'status', header: 'supplier.status' },
        { field: 'insertBy', header: 'visit.insert_by' },
        { field: 'dateInsertion', header: 'visit.creation_date' }
      ];
    }

    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
    this.supplierPaginationEntity.params = new SupplierEntity();
    if (this.search === true || this.mode === '1'){
      this.supplierPaginationEntity.params.statusRejected = AcmConstants.SUPPLIER_REJECTED;

    }

    this.supplierService
      .getSupplierPagination(this.supplierPaginationEntity)
      .subscribe((data) => {
        this.supplierPaginationEntity = data;

        this.customerManagementService.findSector().subscribe((res) => {
          this.sectors = res;
          this.sectors.map(
            (item) => this.sectorList.push(item.name)
          )
          this.supplierPaginationEntity.resultsSuppliers.forEach((element) => {
            this.lstSectorName = [];
            if (element.activity !== null && element.activity !== undefined) {
              this.lstSectorName.push(
                this.sectors.find((item) => element.activity === item.industryID)
              );
              element.activityName = this.lstSectorName[0].name;
            }
          });
        });
      });
      this.decimalPlaces = this.devToolsServices.getDecimalPlaces(3);

  }

  async reloadSupplierList(event: LazyLoadEvent) {
    const supplierPaginationEntity: SupplierPaginationEntity =
      new SupplierPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    supplierPaginationEntity.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      supplierPaginationEntity.pageNumber = event.first;
    } else {
      supplierPaginationEntity.pageNumber = event.first / event.rows;
    }
    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const supplierParams: SupplierEntity = new SupplierEntity();
    if (event.filters !== undefined) {
      // supplierParams.type =
      //   event.filters.type !== undefined ? event.filters.type.value : null;
      supplierParams.id =
        event.filters.id !== undefined ? event.filters.id.value : null;
      supplierParams.name =
        event.filters.name !== undefined ? event.filters.name.value : null;
      supplierParams.registerNumber =
        event.filters.registerNumber !== undefined
          ? event.filters.registerNumber.value
          : null;


      supplierParams.activityName =
        event.filters.activityName !== undefined
          ? event.filters.activityName.value
          : null;
          supplierParams.dateInsertion =
        event.filters.dateInsertion !== undefined
          ? event.filters.dateInsertion.value
          : null;
      supplierParams.status =
        event.filters.status !== undefined ? event.filters.status.value : null;
      supplierParams.insertBy =
        event.filters.insertBy !== undefined ? event.filters.insertBy.value : null;
    }
   if (this.search === true){
      supplierParams.statusRejected = AcmConstants.SUPPLIER_REJECTED;

  }
    supplierPaginationEntity.params = supplierParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      supplierPaginationEntity.sortField = event.multiSortMeta[0].field;
      supplierPaginationEntity.sortDirection = event.multiSortMeta[0].order;
    }

    await this.supplierService
      .getSupplierPagination(supplierPaginationEntity)
      .subscribe((data) => {
        this.supplierPaginationEntity = data;
        this.customerManagementService.findSector().subscribe((res) => {
          this.sectors = res;

          this.supplierPaginationEntity.resultsSuppliers.forEach((element) => {
            this.lstSectorName = [];
            if (element.activity !== null && element.activity !== undefined) {
              this.lstSectorName.push(
                this.sectors.find((item) => element.activity === item.industryID)
              );
              element.activityName = this.lstSectorName[0].name;
            }
          });
        });
      });
  }

  /**
   * supplierDetails open supplier 360
   * @param rowData Supplier
   */
      supplierDetails(rowData) {
        try {
          this.supplier = rowData;
          this.sharedService.setSupplier(this.supplier);
          this.elementId.supplierId = this.supplier.id ;
          this.elementId.conventionId = this.supplier.id ;
          this.sharedService.setElementId(this.elementId) ;
          this.router.navigate([AcmConstants.SUPPLIER_360_DETAILS_URL], {
            queryParams: { source: 'supplier-list' },
          });
        } catch (error) {
          this.sharedService.setSupplier(this.supplier);
          this.sharedService.setElementId(this.elementId) ;
          this.elementId.supplierId = this.supplier.id ;
          this.sharedService.setElementId(this.elementId) ;
          this.router.navigate([AcmConstants.SUPPLIER_360_URL], {
            queryParams: { source: 'supplier-list' },
          });
        }
      }

  getDirection() {
    return AppComponent.direction;
  }
  redirectTo(rowData){
    this.sharedService.setSupplier(rowData);
    this.elementId.supplierId = rowData.id ;
    this.elementId.conventionId = rowData.id 
    this.sharedService.setElementId(this.elementId) ;

  this.router.navigate(['/acm/supplier-add'], {queryParams: {idSupplier: rowData.id, editSupplier: 'true' }});
}

addSupplier(supplier) {
  this.supplierSelected.emit(supplier);
}
closeModale(){
  this.modalService.dismissAll();
}
}
