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
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { ChartOfAccountsService } from '../../chart-of-accounts/chart-of-accounts.service';
import { ReportService } from '../../Reporting/report.service';
@Component({
  selector: 'app-core-reporting-setting',
  templateUrl: './core-reporting-setting.component.html',
  styleUrls: ['./core-reporting-setting.component.sass']
})
export class CoreReportingSettingComponent implements OnInit {


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


  constructor(public translate: TranslateService, public library: FaIconLibrary, private fb: FormBuilder,
    public settingsService: SettingsService, public modal: NgbModal, public devToolsServices: AcmDevToolsServices,
    public reportServices: ReportService, public sharedService: SharedService, public customerManagementService: CustomerManagementService,
    public chartOfAccountsService: ChartOfAccountsService) { }

  ngOnInit(): void {

    this.pageSize = 10;
    this.page = 1;
   
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
      this.reportingSettingList = res.map((item) => {
        return {
          ...item,
          filterItemsValues: this.getFilterItemsValue(item.filterItems),
        };
      });
    })

  }

  getFilterItemsValue(keys: string): string {
    let tab = keys.split(';');
    const values = tab
      .map(key => {
        const foundItem = this.filterItems.find(item =>
          item.key.split(';').includes(key)
        );
        return foundItem ? foundItem.value : "";
      })
      .filter(value => value);

    return values.join(' ; ');
  }

  getFilterItem(keys: string) {
    if (keys) {
      let tab = keys.split(';');
      const values = tab
        .map(key => {
          const foundItem = this.filterItems.find(item =>
            item.key.split(';').includes(key)
          );
          return foundItem ? foundItem : null;
        })
        .filter(value => value);
      return values;
    }
    return null;
  }

  getGroups(groupsCode: string): GroupeEntity[] {
    if (groupsCode) {
      let elements = groupsCode.split(";");
      let resultat: GroupeEntity[] = [];
      elements.forEach((item) => {
        let res = this.groupEntities.filter((entity) => entity.code === item)[0];
        if (res) resultat.push(res);
      })
      return resultat;
    }
    return null;
  }

  createForm(acmCoreReportingSetting: AcmCoreReportingSetting) {
    this.reportingSettingForm = this.fb.group({
      reportName: [acmCoreReportingSetting?.reportName, [customRequiredValidator]],
      sqlProcedureName: [acmCoreReportingSetting?.sqlProcedureName, [customRequiredValidator]],
      filterItems: [this.getFilterItem(acmCoreReportingSetting?.filterItems), [customRequiredValidator]],
      authorizedGroups: [this.getGroups(acmCoreReportingSetting?.authorizedGroups), [customRequiredValidator]],
    })
  }

  addReportingSetting(modalContent: TemplateRef<any>) {
    this.action = "create";
    this.reportingSetting = new AcmCoreReportingSetting();
    this.createForm(new AcmCoreReportingSetting());
    this.modal.open(modalContent);
  }

  updateReportingSetting(modalContent: TemplateRef<any>, acmCoreReportingSetting: AcmCoreReportingSetting) {
    this.action = "update";
    this.reportingSetting = acmCoreReportingSetting;
    this.createForm(this.reportingSetting);
    this.modal.open(modalContent);
  }

  closeModal() {
    this.modal.dismissAll();
  }

  getDirection() {
    return AppComponent.direction;
  }

  saveReportingSetting() {
    this.devToolsServices.makeFormAsTouched(this.reportingSettingForm);

    if (this.reportingSettingForm.valid) {
      this.reportingSetting.reportName = this.reportingSettingForm.controls.reportName.value;
      this.reportingSetting.sqlProcedureName = this.reportingSettingForm.controls.sqlProcedureName.value;

      this.reportingSetting.filterItems = this.reportingSettingForm.controls.filterItems.value.map(item => item.key).join(';');
      this.reportingSetting.authorizedGroups = this.reportingSettingForm.controls.authorizedGroups.value.map(item => item.code).join(';');

      this.reportServices.saveReportingSetting(this.reportingSetting).subscribe((res) => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.ngOnInit();
      })
    }

  }

  disableReportingSetting(acmCoreReportingSetting: AcmCoreReportingSetting) {
    this.reportingSetting = acmCoreReportingSetting;
    this.reportingSetting.enabled = false;
    this.devToolsServices.openConfirmDialogWithoutRedirect('reporting.delete-reporting-setting').afterClosed().subscribe(
      res => {
        if (res) {
          this.reportServices.saveReportingSetting(this.reportingSetting).subscribe((res) => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.ngOnInit();
          });
        }
      }
    );
  }

}
