import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppComponent } from 'src/app/app.component';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-supplier-business-contribution',
  templateUrl: './supplier-business-contribution.component.html',
  styleUrls: ['./supplier-business-contribution.component.sass']
})
export class SupplierBusinessContributionComponent implements OnInit {

  public cols: any[];
  public selectedColumns: any[];
  public page: number;
  public pageSize: number;
  public supplier: SupplierEntity;
  public addresses: AddressEntity[] = [];
  public loans: LoanEntity[] = [];
  public totalRecords: number = 0;
  public currentPage: number = 0;
  public filterValues = {};
  public products: SelectItem[];
  public branches: SelectItem[];
  // Mode 2 : Edit supplier
  public mode;
  image: any = '../../../../assets/images/avatars/user.jpg';

  @Input() search;
  @Input() loansBySupplier;

  constructor(public translate: TranslateService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public sharedService: SharedService) { }

  async ngOnInit() {
    this.totalRecords = this.loansBySupplier.length;
    this.supplier = this.sharedService.supplier;
    this.addresses = this.supplier.listAddress;
    this.loans = this.loansBySupplier.forEach(loan => {
      loan.customerNameNoPipe = this.sharedService.getCustomerName(loan.customerDTO);
    });
    this.cols = [
      { field: 'accountNumber', header: 'customer.account' },
      { field: 'productCode', header: 'setting.product' },
      { field: 'customerNameNoPipe', header: 'sidebar.customer' },
      { field: 'branchName', header: 'customer_management.branch' },
      { field: 'applyAmountTotal', header: 'loan.loan_amount' },
      { field: 'quantitySupplier', header: 'supplier-360.nbAsset' },
      { field: 'balanceSupplier', header: 'supplier-360.supplier_turnover' },
      { field: 'customerDTO.supplierRecommandation', header: 'supplier-360.supplier_cooptations' },
    ];
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
    this.loans = this.loansBySupplier.slice(0, 0 + this.pageSize);
    await this.getProducts();
    await this.getBranches();
    this.activatedRoute.queryParams.subscribe(params => {
      this.mode = params.mode;
    });
  }

  getDirection() {
    return AppComponent.direction;
  }

  redirectTo(rowData) {
    this.router.navigateByUrl('/acm/supplier-list');
  }

  reloadLoansList(event?: LazyLoadEvent) {
    const startIndex = event ? event.first : 0;
    const pageSize = event ? event.rows : this.pageSize;

    const filteredLoans = this.loansBySupplier.filter((loan) => {
      // Apply other field filters first
      for (const field in this.filterValues) {
        if (field !== 'customerDTO.supplierRecommandation') {
          const filterValue = this.filterValues[field].toLowerCase();
          const loanValue = loan[field]?.toString().toLowerCase(); // Handle potential null values

          if (loanValue && !loanValue.includes(filterValue)) {
            return false; // Exclude if any other filter fails
          }
        }
      }
      // Apply customerDTO.supplierRecommandation filter afterwards
      const filterValue = this.filterValues['customerDTO.supplierRecommandation'];
      switch (filterValue) {
        case 'yes':
          return loan.customerDTO.supplierRecommandation === this.supplier.id;
        case 'no':
          return loan.customerDTO.supplierRecommandation !== this.supplier.id;
        default:
          break;
      }

      return true; // Only reach here if all filters pass
    });

    const endIndex = startIndex + pageSize;
    this.loans = filteredLoans.slice(startIndex, endIndex);

    this.totalRecords = filteredLoans.length;
  }

  updateFilter(field: string, value: string) {
    if (field === 'customerDTO.supplierRecommandation') {
      if (value === 'Yes') { // "All" selected
        this.filterValues[field] = 'yes';
      } else if (value === 'No') {
        this.filterValues[field] = 'no';
      } else {
        this.filterValues[field] = value; // Other options like "All"
      }
    } else {
      this.filterValues[field] = value;
    }
    console.log(this.filterValues);
    
    this.reloadLoansList();
  }

  async getProducts() {
    let uniqueProductNamesSet = new Set();
    this.products = [];
    this.loansBySupplier.forEach(element => {
      if (!uniqueProductNamesSet.has(element.productCode)) {
        this.products.push({ label: element.productCode, value: element.productCode });
        uniqueProductNamesSet.add(element.productCode);
      }
    });

  }
  async getBranches() {
    let uniqueBranchNamesSet = new Set();
    this.branches = [];
    this.loansBySupplier.forEach(element => {
      if (!uniqueBranchNamesSet.has(element.branchName)) {
        this.branches.push({ label: element.branchName, value: element.branchName });
        uniqueBranchNamesSet.add(element.branchName);
      }
    });
  }
}
