import { Component, OnInit, ViewChild } from '@angular/core';
import { DashbordServices } from './dashbord.services';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { LoanStatutEntity } from 'src/app/shared/Entities/loan.statut.entity';
import { VisitReportServices } from '../field-visit/filed-visit-details/visit-report.services';
import { SharedService } from 'src/app/shared/shared.service';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { HabilitationEntity } from 'src/app/shared/Entities/habilitation.entity';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';
import { SelectItem } from 'primeng/api';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { StepEntity } from '../../../shared/Entities/step.entity';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { checkOfflineMode } from 'src/app/shared/utils';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.sass']
})
export class DashbordComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loans: LoanEntity[] = [];
  public loanPaginationEntity: LoanPaginationEntity = new LoanPaginationEntity();
  public loansStatut: LoanStatutEntity = new LoanStatutEntity();
  public userHabilitations: HabilitationEntity[] = [];
  public status: SelectItem[];
  public products: SelectItem[];
  public customerType: string;
  users: Array<any> = [];
  public branches: SelectItem[];
  public settingSteps: StepEntity[] = [];

  /**
   * constructor
   * @param dashbordService Dashboard Services
   * @param visitReportServices Visit Report Services
   * @param loanSharedService Shared Service
   * @param devToolsServices Acm DevTools Services
   */
  constructor(public dashbordService: DashbordServices,
    public visitReportServices: VisitReportServices,
    public loanSharedService: SharedService,
    public devToolsServices: AcmDevToolsServices,
    private dbService: NgxIndexedDBService) {
  }

  ngOnInit() {
    const searchLoan = new LoanEntity();
    // 0 : load all my task
    searchLoan.statut = '0';
    searchLoan.parentId = 0;
    this.loadLoansByPaginations(searchLoan, 0, 10);
    this.customerType = AcmConstants.CUSTOMER_TYPE_INDIVIDUAL;

    // load loans count by statut


    // this.loadDashbordTabCount();

    // load list users
    this.getUsers();

    // load list status by statut loan
    this.loadFilterStatusWorkflow(searchLoan);

    // load list product by params
    this.loadFilterProduct(searchLoan);

    // load list branches by params
    this.loadBranch(searchLoan);
  }

  /**
   * load count loans for Dashbord Tab
   */
  loadDashbordTabCount() {
    this.dashbordService.countMyLoans().subscribe((data) => {
      this.loansStatut.myTaskCount = data;
    });
    this.dashbordService.countNewLoans().subscribe((data) => {
      this.loansStatut.status1New = data;
    });
    this.dashbordService.countDraftsLoans().subscribe((data) => {
      this.loansStatut.status2Drafts = data;
    });
    this.dashbordService.countPendingApprovalLoans().subscribe((data) => {
      this.loansStatut.status3AwaitingApproval = data;
    });
    this.dashbordService.countApprovedLoans().subscribe((data) => {
      this.loansStatut.status4Approved = data;
    });
    this.dashbordService.countRejectedLoans().subscribe((data) => {
      this.loansStatut.status5Rejected = data;
    });
    this.dashbordService.countCancelledLoans().subscribe((data) => {
      this.loansStatut.status6Cancelled = data;
    });
    this.dashbordService.countReviewedLoans().subscribe((data) => {
      this.loansStatut.status7Correctifs = data;
    });
  }

  /**
   * load list of loans
   * @param searchLoan searchLoan
   */
  async loadLoans(searchLoan: LoanEntity) {
    await this.dashbordService.loadDashboardByStatus(searchLoan).subscribe(
      (data) => {
        this.loans = data;
      }
    );
  }

  /**
   * load Filter Status Workflow
   * @param searchLoan searchLoan
   */
  async loadFilterStatusWorkflow(searchLoan: LoanEntity) {
    if (!checkOfflineMode()) {
      await this.dashbordService.loadFilterStatusWorkflow(searchLoan).subscribe(
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

  /**
   * load Filter Status Workflow
   * @param searchLoan searchLoan
   */
  async loadFilterProduct(searchLoan: LoanEntity) {
    if (!checkOfflineMode()) {
      // load list product by statut loan
      await this.dashbordService.loadFilterProduct(searchLoan).subscribe(
        (data) => {
          // mapping data
          this.products = [];
          data.forEach(element => {
            this.products.push({ label: element.productDescription, value: element.productDescription });
          });
        });
    }

  }

  /**
   * load list of loans by paginations
   * @param searchLoan searchLoan
   * @param page page
   * @param pageSize pageSize
   */
  async loadLoansByPaginations(searchLoan: LoanEntity, page: number, pageSize: number) {
    const loanPaginationEntityParms: LoanPaginationEntity = new LoanPaginationEntity();
    loanPaginationEntityParms.params = searchLoan;
    loanPaginationEntityParms.pageSize = pageSize;
    loanPaginationEntityParms.pageNumber = page;


    if (checkOfflineMode()) {
      const key = "loans-pagination-status-" + loanPaginationEntityParms.params.statut;

      await this.dbService.getByKey('loans-pagination', key).subscribe((loans: any) => {
        if (loans === undefined) {
          this.devToolsServices.openToast(3, 'No data saved for offline use');
          this.loanPaginationEntity = new LoanPaginationEntity();
        } else {
          delete loans.id;
          this.loanPaginationEntity = loans;
          this.loanPaginationEntity.resultsLoans.forEach((customer) => {
            customer.customerNameNoPipe = this.loanSharedService.getCustomerName(customer.customerDTO);
          });
        }

      });

    } else {
      await this.dashbordService.loadDashboardByStatusPagination(loanPaginationEntityParms).subscribe(
        (data) => {
          this.loanPaginationEntity = data;
          this.loanPaginationEntity.resultsLoans.forEach((customer) => {
            if(customer.statut=='4'|| customer.statut=='8')
              {
                 customer.applyAmountTotal=customer.approvelAmount;
              }
            customer.customerNameNoPipe = this.loanSharedService.getCustomerName(customer.customerDTO);
          });

        });
    }

  }

  /**
   * changeTabs
   * @param event :MatTabChangeEvent for tab index
   */
  changeTabs(event: MatTabChangeEvent) {
    const searchLoan = new LoanEntity();
    searchLoan.parentId = 0;
    switch (event.index) {
      case 0: {
        // statut = '0' : My Tasks
        searchLoan.statut = '0';
        this.loadLoansByPaginations(searchLoan, 0, 10);
        // load list status by statut loan
        this.loadFilterStatusWorkflow(searchLoan);
        // load list product by params
        this.loadFilterProduct(searchLoan);
        // load list branches by params
        this.loadBranch(searchLoan);
        break;
      }
      case 1: {
        // statut = '1' : New
        searchLoan.statut = '1';
        this.loadLoansByPaginations(searchLoan, 0, 10);
        // load list status by statut loan
        this.loadFilterStatusWorkflow(searchLoan);
        // load list product by params
        this.loadFilterProduct(searchLoan);
        // load list branches by params
        this.loadBranch(searchLoan);
        break;
      }
      case 2: {
        // statut = '2' : Draft
        searchLoan.statut = '2';
        this.loadLoansByPaginations(searchLoan, 0, 10);
        // load list status by statut loan
        this.loadFilterStatusWorkflow(searchLoan);
        // load list product by params
        this.loadFilterProduct(searchLoan);
        // load list branches by params
        this.loadBranch(searchLoan);
        break;
      }
      case 3: {
        // statut = '7' : Review
        searchLoan.statut = '7';
        this.loadLoansByPaginations(searchLoan, 0, 10);
        // load list status by statut loan
        this.loadFilterStatusWorkflow(searchLoan);
        // load list product by params
        this.loadFilterProduct(searchLoan);
        // load list branches by params
        this.loadBranch(searchLoan);
        break;
      }
      case 4: {
        // statut = '3' : Pending Approval
        searchLoan.statut = '3';
        this.loadLoansByPaginations(searchLoan, 0, 10);
        // load list status by statut loan
        this.loadFilterStatusWorkflow(searchLoan);
        // load list product by params
        this.loadFilterProduct(searchLoan);
        // load list branches by params
        this.loadBranch(searchLoan);
        break;
      }
      case 5: {
        // statut = '4' : Approved
        searchLoan.statut = '4';
        this.loadLoansByPaginations(searchLoan, 0, 10);
        // load list status by statut loan
        this.loadFilterStatusWorkflow(searchLoan);
        // load list product by params
        this.loadFilterProduct(searchLoan);
        // load list branches by params
        this.loadBranch(searchLoan);
        break;
      }
      case 6: {
        // statut = '5' : Rejected
        searchLoan.statut = '5';
        this.loadLoansByPaginations(searchLoan, 0, 10);
        // load list status by statut loan
        this.loadFilterStatusWorkflow(searchLoan);
        // load list product by params
        this.loadFilterProduct(searchLoan);
        // load list branches by params
        this.loadBranch(searchLoan);
        break;
      }
      case 7: {
        // statut = '6' : Cancelled
        searchLoan.statut = '6';
        this.loadLoansByPaginations(searchLoan, 0, 10);
        // load list status by statut loan
        this.loadFilterStatusWorkflow(searchLoan);
        // load list product by params
        this.loadFilterProduct(searchLoan);
        // load list branches by params
        this.loadBranch(searchLoan);
        break;
      }
      default: {
        // statut = '0' : My Tasks
        searchLoan.statut = '0';
        this.loadLoansByPaginations(searchLoan, 0, 10);
        // load list status by statut loan
        this.loadFilterStatusWorkflow(searchLoan);
        // load list product by params
        this.loadFilterProduct(searchLoan);
        // load list branches by params
        this.loadBranch(searchLoan);
        break;
      }
    }
  }

  /**
   * load users
   */
  getUsers() {
    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'get-users_visit').subscribe((result: any) => {
        if (result === undefined) {
          // this.devToolsServices.openToast(3, 'No address type saved for offline use');
        } else {
          for (let i = 0; i < result.data.length; i++) {
            this.users.push({ item_id: i + 1, item_text: result.data[i].login, item_full_name: result.data[i].simpleName });
          }
          this.loanSharedService.setUsers(this.users);
        }
      });
    } else {
      this.visitReportServices.getUsersVisit().subscribe(
        (data) => {
          for (let i = 0; i < data.length; i++) {
            this.users.push({ item_id: i + 1, item_text: data[i].login, item_full_name: data[i].simpleName });
          }
          this.loanSharedService.setUsers(this.users);
        });
    }
  }

  async loadBranch(searchLoan: LoanEntity) {
    this.branches = [];

    if (!checkOfflineMode()) {
      // load list product by statut loan
      await this.dashbordService.loadFilterBranch(searchLoan).subscribe(
        (data) => {

          // mapping data

          data.forEach(element => {
            this.branches.push({ label: element.branchName, value: element.branchName });
          });

        });
    }
  }


}
