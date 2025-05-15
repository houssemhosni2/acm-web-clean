import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { ConventionEntity } from 'src/app/shared/Entities/Convention.entity';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { SupplierService } from '../supplier.service';

@Component({
  selector: 'app-list-conventions',
  templateUrl: './list-conventions.component.html',
  styleUrls: ['./list-conventions.component.sass'],
})
export class ListConventionsComponent implements OnInit {
  public cols: any[];
  public selectedColumns: any[];
  public page: number;
  public pageSize: number;

  public supplier: SupplierEntity;
  public conventions: ConventionEntity[] = [];

  @Input() search;

  constructor(
    public translate: TranslateService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public sharedService: SharedService,
    public supplierService : SupplierService
  ) {}

  ngOnInit() {
    this.supplier = this.sharedService.supplier;
    this.conventions = this.supplier.conventions;
    this.cols = [
      { field: 'discountRate', header: 'supplier.discount-rate' },
      { field: 'rebate', header: 'supplier.rebate' },
      { field: 'ca', header: 'supplier.turnover-objective' },
      { field: 'startDateConvention', header: 'task.start_date' },
      { field: 'endDateConvention', header: 'task.end_date' },
      { field: 'objectiveTurnoverVolume', header: 'supplier.objective-turnover-volume' },
      { field: 'objectiveFileNumber', header: 'supplier.objective-file-number' },
    ];

    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
  }

  getDirection() {
    return AppComponent.direction;
  }

  redirectTo(rowData) {
    this.router.navigateByUrl('/acm/supplier-list');
  }
}
