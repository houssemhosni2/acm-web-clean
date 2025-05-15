import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerSettingEntity } from 'src/app/shared/Entities/customerSetting.entity';

@Component({
  selector: 'app-customer-setting',
  templateUrl: './customer-setting.component.html',
  styleUrls: ['./customer-setting.component.sass']
})
export class CustomerSettingComponent implements OnInit {

  public customerSettingEntitys: CustomerSettingEntity[] = [];
  public customerSettingEntitySelected: CustomerSettingEntity;
  public showCheckbox = false;
  public isChecked = false;
  public messageDisplayed;
  public value: boolean;
  constructor(public settingsService: SettingsService, public translate: TranslateService, public devToolsServices: AcmDevToolsServices,
    public modal: NgbModal, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.settingsService.findAllSettingCustomer().subscribe(
      (data) => {
        this.customerSettingEntitys = data;
      });
  }


  async endableDisable(customerSettingEntity : CustomerSettingEntity ) {


        await this.settingsService.updateSettingCustomer(customerSettingEntity).toPromise().then();

  }

  getCheckboxValue(event) {
    this.isChecked = event.checked;
  }

  closeModal() {
    this.dialog.closeAll();
    this.customerSettingEntitySelected.enabled = !this.customerSettingEntitySelected.enabled;

  }


}
