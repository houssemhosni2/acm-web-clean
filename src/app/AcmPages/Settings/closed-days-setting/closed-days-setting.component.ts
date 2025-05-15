import { Component, OnInit, TemplateRef } from '@angular/core';
import { BrancheEntity } from 'src/app/shared/Entities/branche.entity';
import { SettingsService } from '../settings.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcmClosedDaysSetting } from 'src/app/shared/Entities/acmClosedDaysSetting.entity';
import { TranslateService } from '@ngx-translate/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AppComponent } from 'src/app/app.component';
import { customRequiredValidator } from 'src/app/shared/utils';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';

@Component({
  selector: 'app-closed-days-setting',
  templateUrl: './closed-days-setting.component.html',
  styleUrls: ['./closed-days-setting.component.sass']
})
export class ClosedDaysSettingComponent implements OnInit {

  public days_of_week: { value: string; header: string }[] = [
    { value: "SUNDAY", header: "DAYS.SUNDAY" },
    { value: "MONDAY", header: "DAYS.MONDAY" },
    { value: "TUESDAY", header: "DAYS.TUESDAY" },
    { value: "WEDNESDAY", header: "DAYS.WEDNESDAY" },
    { value: "THURSDAY", header: "DAYS.THURSDAY" },
    { value: "FRIDAY", header: "DAYS.FRIDAY" },
    { value: "SATURDAY", header: "DAYS.SATURDAY" }
  ];

  public branchEntities: AcmBranches[] = [];

  public groupForm: FormGroup;

  public closedDays: AcmClosedDaysSetting;

  public loadForm: boolean = false;

  public pageSize: number;
  public page: number;
  public closedDaysList: AcmClosedDaysSetting[] = [];
  public action: string = "create";

  constructor(public settingsService: SettingsService, public modal: NgbModal,
    private fb: FormBuilder, public translate: TranslateService, public library: FaIconLibrary
    , public devToolsServices: AcmDevToolsServices) { }

  ngOnInit() {

    this.pageSize = 5;
    this.page = 1;

    this.settingsService.findBranches(new AcmBranches()).toPromise().then((data) => {
      this.branchEntities = data;


      this.settingsService.findClosedDaysSetting(new AcmClosedDaysSetting()).toPromise().then((res) => {

        res.map((item) => {
          const branchIdArray = item.branchIds.split(';');

          const branchNames = branchIdArray.map((id) => {
            const branch = this.branchEntities.find((item1) => item1.id === parseInt(id.trim()));
            return branch ? branch.name : '';
          });
          item.branchNames = branchNames.join(', ');
          item.branchNames = item.branchNames.replace(/^,|, $/g, '');
        });

        this.closedDaysList = res;
        
      })

    })

  }

  createForm(closedDays: AcmClosedDaysSetting) {
    this.loadForm = false;

    const branchs = closedDays?.branchIds?.split(";").filter((item)=> item != "").map((id) => {
      const branch = this.branchEntities.find((item1) => item1.id === parseInt(id.trim()));
      return branch ;
    });

    this.groupForm = this.fb.group({
      branch: [branchs, [customRequiredValidator]],
      days: this.fb.array([])
    });

    const daysFormArray = this.groupForm.get('days') as FormArray;

    const array: string[] = closedDays?.closedDays?.split(";") || [];

    this.days_of_week.forEach(day => {
      let isClosed = array?.includes(day.value);
      daysFormArray.push(new FormControl(isClosed));
    });

    this.loadForm = true;
  }


  addClosedDays(modalContent: TemplateRef<any>) {
    this.action = "create";
    this.closedDays = new AcmClosedDaysSetting();
    this.createForm(new AcmClosedDaysSetting());
    this.modal.open(modalContent);
  }

  editClosedDays(modalContent: TemplateRef<any>, closedDays: AcmClosedDaysSetting) {
    this.action = "update";
    this.closedDays = closedDays;
    this.createForm(this.closedDays);
    this.modal.open(modalContent);
  }

  onSubmit() {
    this.devToolsServices.makeFormAsTouched(this.groupForm);
    if (this.groupForm.valid) {
      this.closedDays.branchIds = this.groupForm.controls.branch.value.map(item => item?.branchID).join(";");
      this.closedDays.branchIds = `;${this.closedDays.branchIds};`;
      this.closedDays.closedDays = this.days_of_week.filter((day, index) => this.groupForm.controls.days.value[index]).map(day => day.value).join(';');

      this.settingsService.saveClosedDaysSetting(this.closedDays).subscribe((res) => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.ngOnInit();
      })
    }

  }

  disableClosedDays(closedDays: AcmClosedDaysSetting) {
    this.closedDays = closedDays;
    this.closedDays.enabled = false;
    this.devToolsServices.openConfirmDialogWithoutRedirect('setting.closed-days-setting.delete-closed-days-setting').afterClosed().subscribe(
      res => {
        if (res) {
          this.settingsService.saveClosedDaysSetting(this.closedDays).subscribe((res) => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.ngOnInit();
          });
        }
      }
    );
  }

  closeModale() {
    this.modal.dismissAll();
  }

  getDirection() {
    return AppComponent.direction;
  }



}
