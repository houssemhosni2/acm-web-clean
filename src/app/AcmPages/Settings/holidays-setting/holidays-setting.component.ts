import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AcmHolidaySetting } from 'src/app/shared/Entities/acmHolidaySetting.entity';
import { customRequiredValidator } from 'src/app/shared/utils';
import { SettingsService } from '../settings.service';
import { BrancheEntity } from 'src/app/shared/Entities/branche.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';

@Component({
  selector: 'app-holidays-setting',
  templateUrl: './holidays-setting.component.html',
  styleUrls: ['./holidays-setting.component.sass']
})
export class HolidaysSettingComponent implements OnInit {

  public calendarMode: boolean = true;
  public holiday: AcmHolidaySetting;
  public holidayList: AcmHolidaySetting[];

  public closedDates: string[] = [];

  public groupForm: FormGroup;

  public branchEntities: AcmBranches[] = [];

  public pageSize: number;
  public page: number;

  public action: string = "create";

  constructor(public translate: TranslateService, public library: FaIconLibrary, public formBuilder: FormBuilder,
    public modal: NgbModal, public settingsService: SettingsService, public devToolsServices: AcmDevToolsServices,
  ) { }

  ngOnInit() {

    this.pageSize = 5;
    this.page = 1;

    this.settingsService.findBranches(new AcmBranches()).toPromise().then((data) => {
      this.branchEntities = data;


      this.settingsService.findHolidaysSetting(new AcmHolidaySetting()).toPromise().then((res) => {

        res.map((item) => {
          const branchIdArray = item.branchIds.split(';');

          const branchNames = branchIdArray.map((id) => {
            const branch = this.branchEntities.find((item1) => item1.id === parseInt(id.trim()));
            return branch ? branch.name : '';
          });

          item.branchNames = branchNames.join(', ');
          item.branchNames = item.branchNames.replace(/^,|, $/g, '');


        })

        this.holidayList = res;

        this.holidayList.forEach((item) => this.closedDates.push(new Date(item.holidayDate).toISOString().split('T')[0]));

      })

    })



  }

  isClosedDate(date: any): boolean {
    const dateString = `${date.year}-${('0' + (date.month + 1)).slice(-2)}-${('0' + date.day).slice(-2)}`;
    return this.closedDates.includes(dateString);
  }

  addHoliday(modalContent: TemplateRef<any>) {
    this.action = "create";
    this.holiday = new AcmHolidaySetting();
    this.holiday.isRecurring = false;
    this.createForm(this.holiday);
    this.modal.open(modalContent);
  }

  editHoliday(modalContent: TemplateRef<any>, holiday: AcmHolidaySetting) {
    this.action = "update";
    this.holiday = holiday;
    this.createForm(holiday);
    this.modal.open(modalContent);
  }

  disableHoliday(holiday: AcmHolidaySetting) {
    this.holiday = holiday;
    this.holiday.enabled = false;
    this.devToolsServices.openConfirmDialogWithoutRedirect('setting.holiday-setting.delete-holiday-setting').afterClosed().subscribe(
      res => {
        if (res) {
          this.settingsService.saveHolidaysSetting(this.holiday).subscribe((res) => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.ngOnInit();
          })
        }
      }
    );
  }

  createForm(holiday: AcmHolidaySetting) {
    const branchs = holiday?.branchIds?.split(";").filter((item) => item != "").map((id) => {
      const branch = this.branchEntities.find((item1) => item1.id === parseInt(id.trim()));
      return branch;
    });

    this.groupForm = this.formBuilder.group({
      holidayDate: [holiday.holidayDate ? new Date(holiday.holidayDate).toISOString().split('T')[0] : '', [customRequiredValidator]],
      branch: [branchs, [customRequiredValidator]],
      holidayType: [holiday.holidayType, [customRequiredValidator]],
      isRecurring: [holiday.isRecurring],
    });
  }

  onSubmit() {
    this.devToolsServices.makeFormAsTouched(this.groupForm);
    if (this.groupForm.valid) {
      this.holiday.holidayDate = this.groupForm.controls.holidayDate.value;
      this.holiday.holidayType = this.groupForm.controls.holidayType.value;
      this.holiday.isRecurring = this.groupForm.controls.isRecurring.value;
      this.holiday.branchIds = this.groupForm.controls.branch.value.map(item => item.id).join(";");
      this.holiday.branchIds = `;${this.holiday.branchIds};`;

      this.settingsService.saveHolidaysSetting(this.holiday).subscribe((res) => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.ngOnInit();
      })
    }

  }

  setCalendarMode() {
    this.calendarMode = true;
  }

  setListMode() {
    this.calendarMode = false;
  }

  closeModale() {
    this.modal.dismissAll();
  }

  getDirection() {
    return AppComponent.direction;
  }

  getHolidayType(date): string {

    let res = this.holidayList.find((item) =>
      (new Date(item.holidayDate).toISOString().split('T')[0] === `${date.year}-${('0' + (date.month + 1)).slice(-2)}-${('0' + date.day).slice(-2)}`)
    );

    if (res) return res.holidayType;
    else null
  }

}
