import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReportService } from '../report.service';
import { ProductEntity } from '../../../shared/Entities/product.entity';
import { BrancheEntity } from '../../../shared/Entities/branche.entity';
import { UserEntity } from '../../../shared/Entities/user.entity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportingEntity } from '../../../shared/Entities/reporting.entity';
import { AcmConstants } from '../../../shared/acm-constants';
import { Router } from '@angular/router';
import { AcmStatutsEntity } from 'src/app/shared/Entities/acmstatus.entity';
import { LoanSourceOfFundsEntity } from 'src/app/shared/Entities/loanSourceOfFunds.entity';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { SettingsService } from '../../Settings/settings.service';
import { ReportSearchHistoryEntity } from '../../../shared/Entities/reportSearchHistory.entity';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { AcmMezaCardEntity } from 'src/app/shared/Entities/acmMezaCard.entity';
import { SharedService } from '../../../shared/shared.service';
import { IScoreService } from '../../Settings/i-score/i-score.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.sass']
})
export class ReportsListComponent implements OnInit {

  products: Array<ProductEntity> = [];
  productsArray: ProductEntity[] = [];
  branches: Array<AcmBranches> = [];
  branchesArray: AcmBranches[] = [];
  loanOfficers: Array<UserEntity> = [];
  loanOfficersByBranch: Array<UserEntity> = [];
  loanOfficersArray: UserEntity[] = [];
  status: Array<AcmStatutsEntity> = [];
  statusArray: AcmStatutsEntity[] = [];
  statusABACUS: Array<AcmStatutsEntity> = [];
  statusABACUSArray: AcmStatutsEntity[] = [];
  sourceOfFundss: Array<LoanSourceOfFundsEntity> = [];
  sourceOfFundssArray: LoanSourceOfFundsEntity[] = [];
  public brancheEntitys: AcmBranches[] = [];

  configProducts = {
    displayKey: 'code', // if objects array passed which key to be displayed defaults to description
    search: true,
    placeholder: ' ',
    limitTo: 10
  };
  configBranches = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true,
    placeholder: ' ',
    limitTo: 10
  };
  configUsers = {
    displayKey: 'fullName', // if objects array passed which key to be displayed defaults to description
    search: true,
    placeholder: ' ',
    limitTo: 0,
    height: '18rem'

  };
  configStatus = {
    displayKey: 'value', // if objects array passed which key to be displayed defaults to description
    search: true,
    placeholder: ' ',
    limitTo: 10
  };
  configSourceOfFunds = {
    displayKey: 'code', // if objects array passed which key to be displayed defaults to description
    search: true,
    placeholder: ' ',
    limitTo: 10
  };
  public reportForm: FormGroup;
  public reporting: ReportingEntity = new ReportingEntity();
  public showReportCriteria: boolean;
  public reportCode = 0;
  showAccountPortfolio = true;
  public selectedBranch = true;
  portfolios: UserEntity[] = [];
  public reportSearchHistoryEntitys: ReportSearchHistoryEntity[] = [];
  public filterName = '';
  public currentPath = AcmConstants.REPORT_LIST;
  public minDate: string =  '2021-01-01'; 
  @ViewChild('modalSelectDate', { static: true }) modalSelectDate: TemplateRef<any>;
  public eventForm: FormGroup;

  /**
   *
   * @param reportServices ReportService
   * @param formBuilder FormBuilder
   * @param router Router
   * @param settingsService SettingsService
   * @param customerManagementService CustomerManagementService
   * @param devToolsServices AcmDevToolsServices
   * @param sharedService SharedService
   * @param iScoreService IScoreService
   */
  constructor(public reportServices: ReportService, public modal: NgbModal,
    public formBuilder: FormBuilder, public translate: TranslateService,
    public router: Router,
    public customerManagementService: CustomerManagementService,
    public settingsService: SettingsService, public devToolsServices: AcmDevToolsServices,
    public sharedService: SharedService, public iScoreService: IScoreService) {
  }

  ngOnInit() {
    this.currentPath = AcmConstants.REPORT_LIST;
    this.showReportCriteria = false;
    const productEntity: ProductEntity = new ProductEntity();

    this.reportServices.getProducts(productEntity).subscribe((products) => {
      this.products = products;
    });

    this.settingsService.findBranches(new AcmBranches()).subscribe((branches) => {
      const accessBranches = this.sharedService.getUser().accessBranches.split(',');
      branches.forEach((branch) => {
        accessBranches.forEach((branchId) => {
          if (branch.id === +branchId) {
            this.branches.push(branch);
          }
        });
      });
    });

    this.reportServices.loadFilterStatusWorkflow().subscribe((status) => {
      this.status = status;
    });

    this.reportServices.loadFilterStatusABACUS().subscribe((status) => {
      this.statusABACUS = status;
    });

    this.reportServices.getLoanSourceOfFunds().subscribe((data) => {
      this.sourceOfFundss = data;
    });
    this.getBranchPortfolioConnectedUser();
    this.createForm();
  }

  /**
   * lunch when select branch to load list loanOfficers by branch_ID
   */
  async selectionChanged() {
    this.loanOfficersArray = [];
    this.loanOfficersByBranch = [];
    this.loanOfficers = [];
    this.selectedBranch = true;
    if (this.branchesArray.length > 0) {
      this.selectedBranch = false;
    }
    for (let i = 0; i < this.branchesArray.length; i++) {
      const userEntity: UserEntity = new UserEntity();
      userEntity.branchID = this.branchesArray[i].id;
      await this.customerManagementService.findAllPortfolio(userEntity).toPromise().then(
        (data) => {
          data.forEach((element) => {
            this.loanOfficersByBranch.push(element);
          });
        });
    }
    this.loanOfficers = this.loanOfficersByBranch;
  }

  /**
   * create form
   */
  createForm() {
    this.reportForm = this.formBuilder.group({
      products: [''],
      branches: [''],
      sourceOfFundss: [''],
      loanOfficer: [''],
      loanStatus: [''],
      loanAmountMin: [''],
      loanAmountMax: [''],
      loanApplicationDateMin: [''],
      loanApplicationDateMax: [''],
      loanIssueDateMin: [''],
      loanIssueDateMax: [''],
      customerNumber: [''],
      groupNumber: [''],
      instalmentDateMin: [''],
      instalmentDateMax: [''],
      groupBy: ['Product'],
      displayMode: ['Detail'],
    });
  }


  getDirection() {
    return AppComponent.direction;
  }

  /**
   * methode get Branch
   */
  getBranchPortfolioConnectedUser() {
    // Find Branch
    this.settingsService.findBranches(new AcmBranches()).subscribe(
      (data) => {
        this.brancheEntitys = data;
      }
    );
  }

  getFilterList() {
    const reportSearchHistoryEntity: ReportSearchHistoryEntity = new ReportSearchHistoryEntity();
    reportSearchHistoryEntity.reportName = this.reportCode.toString();
    this.reportServices.findListFilter(reportSearchHistoryEntity).subscribe((data) => {
      this.reportSearchHistoryEntitys = data;
    });
  }

  /**
   * methode download report
   */
  submit() {
    this.reporting.brancheDTOs = [];
    this.reporting.brancheDTOs = this.reportForm.controls.branches.value;

    this.reporting.productDTOs = [];
    this.reporting.productDTOs = this.reportForm.controls.products.value;

    this.reporting.userDTOs = [];
    this.reporting.userDTOs = this.reportForm.controls.loanOfficer.value;

    this.reporting.loanStatus = [];
    this.reporting.loanStatus = this.reportForm.controls.loanStatus.value;

    this.reporting.loanSourceOfFundsDTOs = [];
    if (this.reportCode === 2) {
      this.reporting.loanSourceOfFundsDTOs = this.reportForm.controls.sourceOfFundss.value;
    }
    this.reporting.loanAmountMin = this.reportForm.controls.loanAmountMin.value;
    this.reporting.loanAmountMax = this.reportForm.controls.loanAmountMax.value;

    this.reporting.loanCreateDateMin = this.reportForm.controls.loanApplicationDateMin.value;
    this.reporting.loanCreateDateMax = this.reportForm.controls.loanApplicationDateMax.value;

    this.reporting.loanIssueDateMin = this.reportForm.controls.loanIssueDateMin.value;
    this.reporting.loanIssueDateMax = this.reportForm.controls.loanIssueDateMax.value;

    this.reporting.customerNumber = this.reportForm.controls.customerNumber.value;

    if (this.reportCode === 2) {
      this.reporting.groupNumber = this.reportForm.controls.groupNumber.value;
      this.reporting.instalmentDateMin = this.reportForm.controls.instalmentDateMin.value;
      this.reporting.instalmentDateMax = this.reportForm.controls.instalmentDateMax.value;
    }
    switch (this.reportForm.controls.groupBy.value) {
      case 'Product': {
        this.reporting.product = true;
        this.reporting.branch = false;
        this.reporting.loanOfficer = false;
        break;
      }
      case 'Branch': {
        this.reporting.product = false;
        this.reporting.branch = true;
        this.reporting.loanOfficer = false;
        break;
      }
      case 'Loan Officer': {
        this.reporting.product = false;
        this.reporting.branch = false;
        this.reporting.loanOfficer = true;
        break;
      }
      default: {
        break;
      }
    }

    switch (this.reportForm.controls.displayMode.value) {
      case 'Summary': {
        this.reporting.summary = true;
        this.reporting.details = false;
        break;
      }
      case 'Detail': {
        this.reporting.summary = false;
        this.reporting.details = true;
        break;
      }
      default: {
        break;
      }
    }
    const daterun = new Date();
    if (this.reportCode === 1) {
      this.reportServices.reportingLoanApplication(this.reporting).subscribe((res: any) => {
        const fileData = [res];
        const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'Loan_Statut_Report_' + daterun.getFullYear() + '-' + daterun.getMonth() + '-'
          + daterun.getDate() + '_' + daterun.getHours() + '-' + daterun.getMinutes();
        anchor.href = url;
        anchor.click();
      });
    } else if (this.reportCode === 2) {
      this.reportServices.reportingExcelCollectionFollowupReport(this.reporting).subscribe((res: any) => {
        const fileData = [res];
        const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'Collection_Follow_Up_Report_' + daterun.getFullYear() + '-' + daterun.getMonth() + '-'
          + daterun.getDate() + '_' + daterun.getHours() + '-' + daterun.getMinutes();
        anchor.href = url;
        anchor.click();
      });
    }
  }

  /**
   * open card report criteria
   */
  openCriteria(reportNumber: number) {
    this.createForm();
    // Reset data
    this.productsArray = [];
    this.loanOfficersArray = [];
    this.statusArray = [];
    this.statusABACUSArray = [];
    this.sourceOfFundssArray = [];
    if (reportNumber === 1) {
      this.showReportCriteria = true;
      this.reportCode = 1;
    } else if (reportNumber === 2) {
      this.showReportCriteria = true;
      this.reportCode = 2;
    }
    this.getFilterList();
  }

  /**
   * methode change loanAmount
   */
  changeLoanAmount() {
    if (this.reportForm.controls.loanAmountMax.value < this.reportForm.controls.loanAmountMin.value) {
      this.reportForm.controls.loanAmountMax.reset();
    }
    this.reportForm.controls.loanAmountMax.setValidators([
      Validators.min(Math.min(...this.reportForm.controls.loanAmountMin.value))]);
  }

  /**
   * methode when loan application date changed
   */
  changeloanApplicationDateMax() {
    const loanApplicationDateMin: Date = new Date(this.reportForm.controls.loanApplicationDateMin.value);
    loanApplicationDateMin.setHours(0, 0, 0, 0);
    const loanApplicationDateMax: Date = new Date(this.reportForm.controls.loanApplicationDateMax.value);
    loanApplicationDateMax.setHours(0, 0, 0, 0);
    if (loanApplicationDateMin > loanApplicationDateMax) {
      this.reportForm.controls.loanApplicationDateMax.reset();
    }
  }

  /**
   * methode when loan issue date changed
   */
  changeloanIssueDate() {
    return this.reportForm.controls.loanIssueDateMin.value;
  }

  /**
   * methode when instalment Date changed
   */
  changeinstalmentDate() {
    return this.reportForm.controls.instalmentDateMin.value;
  }

  /**
   * methode when loan issue date max changed
   */
  changeloanIssueDateMax() {
    const loanIssueDateMin: Date = new Date(this.reportForm.controls.loanIssueDateMin.value);
    loanIssueDateMin.setHours(0, 0, 0, 0);
    const loanIssueDateMax: Date = new Date(this.reportForm.controls.loanIssueDateMax.value);
    loanIssueDateMax.setHours(0, 0, 0, 0);
    if (loanIssueDateMin > loanIssueDateMax) {
      this.reportForm.controls.loanIssueDateMax.reset();
    }
  }

  /**
   * methode when instalment Date max changed
   */
  changeinstalmentDateMax() {
    const instalmentDateMin: Date = new Date(this.reportForm.controls.instalmentDateMin.value);
    instalmentDateMin.setHours(0, 0, 0, 0);
    const instalmentDateMax: Date = new Date(this.reportForm.controls.instalmentDateMax.value);
    instalmentDateMax.setHours(0, 0, 0, 0);
    if (instalmentDateMin > instalmentDateMax) {
      this.reportForm.controls.instalmentDateMax.reset();
    }
  }

  /**
   * methode when loan application date changed
   */
  changeloanApplicationDate() {
    return this.reportForm.controls.loanApplicationDateMin.value;
  }

  /**
   * methode exit
   */
  exit() {
    this.router.navigate([AcmConstants.DASHBOARD_URL]);
  }

  saveFilter() {
    if (this.filterName === '') {
      this.devToolsServices.openToast(3, 'alter.filter_name');
      return;
    }
    this.reporting.brancheDTOs = [];
    this.reporting.brancheDTOs = this.reportForm.controls.branches.value;

    this.reporting.productDTOs = [];
    this.reporting.productDTOs = this.reportForm.controls.products.value;

    this.reporting.userDTOs = [];
    this.reporting.userDTOs = this.reportForm.controls.loanOfficer.value;

    this.reporting.loanStatus = [];
    this.reporting.loanStatus = this.reportForm.controls.loanStatus.value;

    this.reporting.loanSourceOfFundsDTOs = [];
    if (this.reportCode === 2) {
      this.reporting.loanSourceOfFundsDTOs = this.reportForm.controls.sourceOfFundss.value;
    }
    this.reporting.loanAmountMin = this.reportForm.controls.loanAmountMin.value;
    this.reporting.loanAmountMax = this.reportForm.controls.loanAmountMax.value;

    this.reporting.loanCreateDateMin = this.reportForm.controls.loanApplicationDateMin.value;
    this.reporting.loanCreateDateMax = this.reportForm.controls.loanApplicationDateMax.value;

    this.reporting.loanIssueDateMin = this.reportForm.controls.loanIssueDateMin.value;
    this.reporting.loanIssueDateMax = this.reportForm.controls.loanIssueDateMax.value;

    this.reporting.customerNumber = this.reportForm.controls.customerNumber.value;

    if (this.reportCode === 2) {
      this.reporting.groupNumber = this.reportForm.controls.groupNumber.value;
      this.reporting.instalmentDateMin = this.reportForm.controls.instalmentDateMin.value;
      this.reporting.instalmentDateMax = this.reportForm.controls.instalmentDateMax.value;
    }
    switch (this.reportForm.controls.groupBy.value) {
      case 'Product': {
        this.reporting.product = true;
        this.reporting.branch = false;
        this.reporting.loanOfficer = false;
        break;
      }
      case 'Branch': {
        this.reporting.product = false;
        this.reporting.branch = true;
        this.reporting.loanOfficer = false;
        break;
      }
      case 'Loan Officer': {
        this.reporting.product = false;
        this.reporting.branch = false;
        this.reporting.loanOfficer = true;
        break;
      }
      default: {
        break;
      }
    }

    switch (this.reportForm.controls.displayMode.value) {
      case 'Summary': {
        this.reporting.summary = true;
        this.reporting.details = false;
        break;
      }
      case 'Detail': {
        this.reporting.summary = false;
        this.reporting.details = true;
        break;
      }
      default: {
        break;
      }
    }
    const reportSearchHistoryEntity: ReportSearchHistoryEntity = new ReportSearchHistoryEntity();
    reportSearchHistoryEntity.reportingDTO = this.reporting;
    reportSearchHistoryEntity.labelSearchHistory = this.filterName;
    // 1 = تقرير حالة القرض
    // 2 = تقرير متابعة
    reportSearchHistoryEntity.reportName = this.reportCode.toString();
    this.reportServices.createFilter(reportSearchHistoryEntity).subscribe(() => {
      this.filterName = '';
      this.getFilterList();
    });
  }

  loadFiltre(reportSearchHistoryEntity: ReportSearchHistoryEntity) {
    this.reportForm.reset();
    this.reporting.brancheDTOs = [];
    this.reportForm.controls.branches.setValue(reportSearchHistoryEntity.reportingDTO.brancheDTOs);

    this.reporting.productDTOs = [];
    this.reportForm.controls.products.setValue(reportSearchHistoryEntity.reportingDTO.productDTOs);

    this.reporting.userDTOs = [];
    this.reportForm.controls.loanOfficer.setValue(reportSearchHistoryEntity.reportingDTO.userDTOs);

    this.reporting.loanStatus = [];
    this.reportForm.controls.loanStatus.setValue(reportSearchHistoryEntity.reportingDTO.loanStatus);

    this.reporting.loanSourceOfFundsDTOs = [];
    if (this.reportCode === 2) {
      this.reportForm.controls.sourceOfFundss.setValue(reportSearchHistoryEntity.reportingDTO.loanSourceOfFundsDTOs);
      this.reportForm.controls.groupNumber.setValue(reportSearchHistoryEntity.reportingDTO.groupNumber);
      if (reportSearchHistoryEntity.reportingDTO.instalmentDateMin) {
        this.reportForm.controls.instalmentDateMin.setValue(reportSearchHistoryEntity.reportingDTO.instalmentDateMin.substring(0, 10));
      }
      if (reportSearchHistoryEntity.reportingDTO.instalmentDateMax) {
        this.reportForm.controls.instalmentDateMax.setValue(reportSearchHistoryEntity.reportingDTO.instalmentDateMax.substring(0, 10));
      }
    }

    this.reportForm.controls.loanAmountMin.setValue(reportSearchHistoryEntity.reportingDTO.loanAmountMin);
    this.reportForm.controls.loanAmountMax.setValue(reportSearchHistoryEntity.reportingDTO.loanAmountMax);

    if (reportSearchHistoryEntity.reportingDTO.loanCreateDateMin) {
      this.reportForm.controls.loanApplicationDateMin.setValue(reportSearchHistoryEntity.reportingDTO.loanCreateDateMin.substring(0, 10));
    }
    if (reportSearchHistoryEntity.reportingDTO.loanCreateDateMax) {
      this.reportForm.controls.loanApplicationDateMax.setValue(reportSearchHistoryEntity.reportingDTO.loanCreateDateMax.substring(0, 10));
    }
    if (reportSearchHistoryEntity.reportingDTO.loanIssueDateMin) {
      this.reportForm.controls.loanIssueDateMin.setValue(reportSearchHistoryEntity.reportingDTO.loanIssueDateMin.substring(0, 10));
    }
    if (reportSearchHistoryEntity.reportingDTO.loanIssueDateMax) {
      this.reportForm.controls.loanIssueDateMax.setValue(reportSearchHistoryEntity.reportingDTO.loanIssueDateMax.substring(0, 10));
    }
    this.reportForm.controls.customerNumber.setValue(reportSearchHistoryEntity.reportingDTO.customerNumber);

    if (this.reporting.product) {
      this.reportForm.controls.groupBy.setValue('Product');
    } else if (this.reporting.branch) {
      this.reportForm.controls.groupBy.setValue('Branch');
    } else if (this.reporting.loanOfficer) {
      this.reportForm.controls.groupBy.setValue('Loan Officer');
    }

    if (this.reporting.summary) {
      this.reportForm.controls.displayMode.setValue('Summary');
    } else if (this.reporting.details) {
      this.reportForm.controls.displayMode.setValue('Detail');
    }
  }

  resetForm() {
    this.reportForm.reset();
    this.reportForm.controls.groupBy.setValue('Product');
    this.reportForm.controls.displayMode.setValue('Detail');
  }

  generateMezaCardReport() {
    const daterun = new Date();
    this.reportServices.reportingExcelMezaCard(new AcmMezaCardEntity()).subscribe((res: any) => {
      const fileData = [res];
      const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'Meza_Card_Report_' + daterun.getFullYear() + '-' + daterun.getMonth() + '-'
        + daterun.getDate() + '_' + daterun.getHours() + '-' + daterun.getMinutes();
      anchor.href = url;
      anchor.click();
    });
  }


  createDateForm() {
    this.eventForm = this.formBuilder.group({ 
      startDate: ['', Validators.required],   
      endDate: ['', Validators.required]    
    });
  }

  openDateSelection(){
    this.createDateForm();
    this.modal.open(this.modalSelectDate, { size: 'md' });
  }

  /**
   * generate File i-score
   */
  generateFileIScore() {
    this.reportCode = 3;
    
   if (this.eventForm.valid && this.eventForm.controls.startDate.value !== '' && this.eventForm.controls.endDate.value !== '') {
    let selectedStartDate :string = this.eventForm.controls.startDate.value;
    let selectedEndDate :string = this.eventForm.controls.endDate.value;
    this.modal.dismissAll();
    
    this.iScoreService.generateFile(selectedStartDate, selectedEndDate).subscribe(
      (data) => {
        const fileData = [data];
        const blob = new Blob(fileData, { type: 'application/dlt' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'i-score.dlt';
        anchor.href = url;
        anchor.click();

        this.getRejectFile();
      }
    );
    }else {
      this.devToolsServices.openToast(3, 'alert.no_date_selected');
    }
  }

  getRejectFile() {
    // GET REJECT FILE IF ANY
    this.iScoreService.getRejectFile().subscribe(
      (data) => {
        const fileData = [data];
        const blob = new Blob(fileData, { type: 'application/dlt' });
        if (blob.size > 10) {
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.download = 'i-score.reject.dlt';
          anchor.href = url;
          anchor.click();
        }
      }
    )
  }
}
