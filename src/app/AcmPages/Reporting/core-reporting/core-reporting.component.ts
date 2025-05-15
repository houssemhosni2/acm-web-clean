import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TranslateService } from '@ngx-translate/core';
import { AcmCoreReportingSetting } from 'src/app/shared/Entities/AcmCoreReportingSetting.entity';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { customRequiredValidator } from 'src/app/shared/utils';
import { SettingsService } from '../../Settings/settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ReportService } from '../report.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { AcmGlAccount } from 'src/app/shared/Entities/AcmGlAccount.entity';
import { ChartOfAccountsService } from '../../chart-of-accounts/chart-of-accounts.service';

@Component({
  selector: 'app-core-reporting',
  templateUrl: './core-reporting.component.html',
  styleUrls: ['./core-reporting.component.sass']
})
export class CoreReportingComponent implements OnInit {

  public filterItems: any[];
  public reportingSettingForm: FormGroup;
  public groupEntities: GroupeEntity[];
  public reportingSetting: AcmCoreReportingSetting;
  public displayMultiSelect: boolean = false;

  public reportingSettingList: AcmCoreReportingSetting[] = [];

  public action: string = "create";
  public currentUser: UserEntity = new UserEntity();
  public connectedUserGroups: string = "";
  public pageSize: number;
  public page: number;

  public reportDataPageSize: number;
  public reportDatapage: number;
  public reportData: any[] = [];
  public showReportData: boolean = false;

  public showReportCriteria: boolean;
  public reportingCriteriaForm: FormGroup;
  public products: ProductEntity[] = [];
  public branches: AcmBranches[] = [];
  public loanOfficers: UserEntity[] = [];
  public glAccountList: AcmGlAccount[] = [];
  public loanStatus: any[] = [];
  public glAccountCategory: string[] = [];

  public selectedFilter: string[] = [];


  constructor(public translate: TranslateService, public library: FaIconLibrary, private fb: FormBuilder,
    public settingsService: SettingsService, public modal: NgbModal, public devToolsServices: AcmDevToolsServices,
    public reportServices: ReportService, public sharedService: SharedService, public customerManagementService: CustomerManagementService,
    public chartOfAccountsService: ChartOfAccountsService) { }

  ngOnInit(): void {

    this.pageSize = 5;
    this.page = 1;
    this.showReportCriteria = false;

    this.connectedUserGroups = "";
    this.currentUser = this.sharedService.getUser();
    this.currentUser.groupes.map((item) => this.connectedUserGroups = this.connectedUserGroups + item.code + ";")

    this.filterItems = [
      { key: "valueDate", value: "Value Date From / To" },
      { key: "glAccountCategory", value: "GL Account Category" },
      { key: "glAccounts", value: "GL Account" },
      { key: "products", value: "Product" },
      { key: "loanOfficiers", value: "Loan Officer" },
      { key: "issueDate", value: "Issue Date From / To" },
      { key: "customerName", value: "Customer Name" },
      { key: "customerNumber", value: "Customer Number" },
      { key: "accountNumber", value: "Account Number" },
      { key: "loanStatus", value: "Loan Status" },
      { key: "branches", value: "Branches" },
    ]

    this.settingsService.findAllGroup().subscribe((res) => {
      this.groupEntities = res;
    })

    let reportingSettingParam = new AcmCoreReportingSetting();
    reportingSettingParam.authorizedGroups = this.connectedUserGroups;
    this.reportServices.findReportingSetting(reportingSettingParam).subscribe((res) => {
      this.reportingSettingList = res;
    })

    this.reportServices.getProducts(new ProductEntity()).subscribe((products) => {
      this.products = products;
    });

    this.settingsService.findBranches(new AcmBranches()).subscribe((data) => {
      this.branches = data;
    });

    this.customerManagementService.findAllPortfolio(new UserEntity()).subscribe((data) => {
      this.loanOfficers = data;
    });

    this.chartOfAccountsService.findGlAccount(new AcmGlAccount()).toPromise().then((res) => {
      this.glAccountList = res;
    })

    this.loanStatus = [
      { key: "New", value: "1" },
      { key: "Drafts", value: "2" },
      { key: "Awaiting Approval", value: "3" },
      { key: "Approved", value: "4" },
      { key: "Rejected", value: "5" },
      { key: "Cancelled", value: "6" },
      { key: "Review", value: "7" },
      { key: "Issued", value: "8" },
    ];

    this.glAccountCategory = ["Income", "Expense", "Asset", "Liability", "Capital/Reserve"];
  }

  createReportCriteriaForm() {
    this.reportingCriteriaForm = this.fb.group({
      valueDateFrom: [],
      valueDateTo: [],
      glAccountCategory: [],
      glAccounts: [],
      branches: [],
      products: [],
      loanOfficiers: [],
      issueDateFrom: [],
      issueDateTo: [],
      customerName: [],
      customerNumber: [],
      accountNumber: [],
      loanStatus: []
    })
  }

  closeModal() {
    this.modal.dismissAll();
  }

  getDirection() {
    return AppComponent.direction;
  }

  openReportCriteria(acmCoreReportingSetting: AcmCoreReportingSetting) {
    this.reportingSetting = acmCoreReportingSetting;
    this.showReportCriteria = true;
    this.selectedFilter = this.reportingSetting.filterItems.split(";").reduce((acc, item) => {
      if (item === 'valueDate') {
        acc.push('valueDateFrom', 'valueDateTo');
      } else if (item === 'issueDate') {
        acc.push('issueDateFrom', 'issueDateTo');
      } else {
        acc.push(item);
      }
      return acc;
    }, [])
    this.createReportCriteriaForm();
  }

  reset() {
    this.createReportCriteriaForm();
    this.showReportData = false;
    this.reportDataPageSize = 5;
    this.reportDatapage = 1;
    this.reportData = [];
  }

  generateReport(reportFormat: string) {
    const jsonObject = this.selectedFilter.reduce((obj, key) => {
      const value = this.reportingCriteriaForm.get(key)?.value;

      if (key === 'valueDate') {
        obj["valueDateFrom"] = this.reportingCriteriaForm.get("valueDateFrom")?.value || null;
        obj["valueDateTo"] = this.reportingCriteriaForm.get("valueDateTo")?.value || null;
      } else if (key === 'issueDate') {
        obj["issueDateFrom"] = this.reportingCriteriaForm.get("issueDateFrom")?.value || null;
        obj["issueDateTo"] = this.reportingCriteriaForm.get("issueDateTo")?.value || null;
      } else {
        obj[key] = (Array.isArray(value) && value.length === 0) || value === "" ? null : value;
      }
      return obj;
    }, {} as Record<string, any>);

    this.reportingSetting.filterItemValues = JSON.stringify(jsonObject);

    if (reportFormat === 'excel') {
      this.reportServices.generateExcelReport(this.reportingSetting).subscribe((res) => {
        const fileData = [res];
        const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        const formattedDate = new Date().toISOString().slice(0, 10);
        anchor.download = `${this.reportingSetting.reportName}_${formattedDate}`;
        anchor.href = url;
        anchor.click();
        this.devToolsServices.openToast(0, 'alert.document_uploaded');
      })
    }

    if (reportFormat === 'pdf') {
      this.reportServices.generatePdfReport(this.reportingSetting).subscribe((res) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        const formattedDate = new Date().toISOString().slice(0, 10);
        anchor.download = `${this.reportingSetting.reportName}_${formattedDate}`;
        anchor.href = url;
        anchor.click();
        this.devToolsServices.openToast(0, 'alert.document_uploaded');
      })
    }
  }

  findReportData(){
    const jsonObject = this.selectedFilter.reduce((obj, key) => {
      const value = this.reportingCriteriaForm.get(key)?.value;

      if (key === 'valueDate') {
        obj["valueDateFrom"] = this.reportingCriteriaForm.get("valueDateFrom")?.value || null;
        obj["valueDateTo"] = this.reportingCriteriaForm.get("valueDateTo")?.value || null;
      } else if (key === 'issueDate') {
        obj["issueDateFrom"] = this.reportingCriteriaForm.get("issueDateFrom")?.value || null;
        obj["issueDateTo"] = this.reportingCriteriaForm.get("issueDateTo")?.value || null;
      } else {
        obj[key] = (Array.isArray(value) && value.length === 0) || value === "" ? null : value;
      }
      return obj;
    }, {} as Record<string, any>);

    this.reportingSetting.filterItemValues = JSON.stringify(jsonObject);

    this.reportServices.findReportData(this.reportingSetting).subscribe((res) => {
      this.reportData = res;
      this.reportDataPageSize = 5;
      this.reportDatapage = 1;
      this.showReportData = true;
    })
  }

}
