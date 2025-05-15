import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { SelectItem } from 'primeng/api';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';
import { LoanStatutEntity } from 'src/app/shared/Entities/loan.statut.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { DashbordServices } from '../dashbord.services';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-unassingned-loans',
  templateUrl: './unassingned-loans.component.html',
  styleUrls: ['./unassingned-loans.component.sass']
})
export class UnassingnedLoansComponent implements OnInit {
  public loanPaginationEntity: LoanPaginationEntity = new LoanPaginationEntity();
  public loansStatut: LoanStatutEntity = new LoanStatutEntity();
  public products: SelectItem[];
  public status: SelectItem[];
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  /**
   *
   * @param dashbordService DashbordServices
   * @param loanSharedService SharedService
   */
  constructor(public dashbordService: DashbordServices,
              public loanSharedService: SharedService) { }

  ngOnInit() {
    const searchLoan = new LoanEntity();
    // 0 : load all my task
    // searchLoan.statut = '8';
    searchLoan.parentId = 0;
    // load list of loans unassigned by group of connected user
    this.loadLoansByPaginations(searchLoan, 0, 10);
    // load list product
    this.loadFilterProduct(searchLoan);
    this.loadFilterStatusWorkflow(searchLoan);
    this.countUnassignedLoans();
  }

  /**
   * count unassigned loans
   */
  countUnassignedLoans() {
    this.dashbordService.countUnassignedLoans().subscribe((data) => {
      this.loansStatut.unassignedLoans = data;
    });
  }
  /**
   * load un assigned loans
   *
   * @param searchLoan LoanEntity
   * @param page number
   * @param pageSize number
   */
  async loadLoansByPaginations(searchLoan: LoanEntity, page: number, pageSize: number) {
    const loanPaginationEntityParms: LoanPaginationEntity = new LoanPaginationEntity();
    loanPaginationEntityParms.params = searchLoan;
    loanPaginationEntityParms.pageSize = pageSize;
    loanPaginationEntityParms.pageNumber = page;
    await this.dashbordService.loadUnassignedLoans(loanPaginationEntityParms).subscribe(
      (data) => {
        this.loanPaginationEntity = data;
        this.loanPaginationEntity.resultsLoans.forEach((customer) => {
          customer.customerNameNoPipe = this.loanSharedService.getCustomerName(customer.customerDTO);
        });
      });
  }
  /**
   * load filter of product
   * @param searchLoan LoanEntity
   */
  async loadFilterProduct(searchLoan: LoanEntity) {
    // load list product by statut loan
    await this.dashbordService.loadFilterProductUnassignedLoans(searchLoan).subscribe(
      (data) => {
        // mapping data
        this.products = [];
        data.forEach(element => {
          this.products.push({ label: element.productDescription, value: element.productDescription });
        });
      });
  }

  /**
   * load filter status
   *
   * @param searchLoan LoanEntity
   */
  async loadFilterStatusWorkflow(searchLoan: LoanEntity) {
    await this.dashbordService.loadFilterStatusUnassignedLoans(searchLoan).subscribe(
      (data) => {
        // mapping data
        this.status = [];
        data.forEach(element => {
          this.status.push({ label: element.statutLibelle, value: element.statutWorkflow });
        });
      }
    );
  }
}
