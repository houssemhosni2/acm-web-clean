import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { SettingNotificationsEntity } from '../../../shared/Entities/settingNotifications.entity';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-setting-notification',
  templateUrl: './setting-notification.component.html',
  styleUrls: ['./setting-notification.component.sass']
})
export class SettingNotificationComponent implements OnInit {

  public SettingNotificationsEntitys: SettingNotificationsEntity[] = [];
  public settingNotificationsEntitySelected: SettingNotificationsEntity;
  public showCheckbox = false;
  public isChecked = false;
  public messageDisplayed;
  public value: boolean;

  /**
   * constructor
   * @param settingsService SettingsService SettingsService
   * @param translate TranslateService
   * @param devToolsServices AcmDevToolsServices AcmDevToolsServices
   * @param modal NgbModal
   * @param dialog MatDialog
   */
  constructor(public settingsService: SettingsService, public translate: TranslateService, public devToolsServices: AcmDevToolsServices,
              public modal: NgbModal, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.settingsService.findAllSettingNotification().subscribe(
      (data) => {
        this.SettingNotificationsEntitys = data;
      });
  }

  endableDisable(content, settingNotificationsEntity: SettingNotificationsEntity) {
    if (settingNotificationsEntity.enabled === false) {
      this.showCheckbox = false;
      this.messageDisplayed = 'change_status_all_users';
      this.dialog.open(content, { disableClose: true, });
      this.settingNotificationsEntitySelected = settingNotificationsEntity;
    } else {
      this.showCheckbox = true;
      this.messageDisplayed = 'change_status';
      this.dialog.open(content, { disableClose: true, });
      this.settingNotificationsEntitySelected = settingNotificationsEntity;
    }
  }

  async getAnswer(value: boolean) {
    if (this.showCheckbox === false) { // that means settingNotificationsEntity.enabled === false
      if (value === true) {  // button YES clicked
        this.settingNotificationsEntitySelected.updateUserNotification = true;
        await this.settingsService.updateSettingNotification(this.settingNotificationsEntitySelected).toPromise().then(
          () => this.dialog.closeAll()
        );
      } else { // button NO clicked
        this.settingNotificationsEntitySelected.enabled = !this.settingNotificationsEntitySelected.enabled;
        this.dialog.closeAll();
      }
    } else { // that means settingNotificationsEntity.enabled === true
      if (value === true) {  // button YES clicked
        if (this.isChecked === true) {
          this.settingNotificationsEntitySelected.updateUserNotification = true;
          await this.settingsService.updateSettingNotification(this.settingNotificationsEntitySelected).toPromise().then(
            () => this.dialog.closeAll());
        } else {
          this.settingNotificationsEntitySelected.updateUserNotification = false;
          await this.settingsService.updateSettingNotification(this.settingNotificationsEntitySelected).toPromise().then(
            () => this.dialog.closeAll());
        }
      } else { // button NO clicked
        this.settingNotificationsEntitySelected.enabled = !this.settingNotificationsEntitySelected.enabled;
        this.dialog.closeAll();
      }
    }
  }

  getCheckboxValue(event) {
    this.isChecked = event.checked;
  }

  closeModal() {
    this.dialog.closeAll();
    this.settingNotificationsEntitySelected.enabled = !this.settingNotificationsEntitySelected.enabled;

  }
}
