import { Component, OnInit, Input } from '@angular/core';
import { SettingListValuesEntity } from 'src/app/shared/Entities/settingListValues.entity';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmAmlDataEntity } from "src/app/shared/Entities/AcmAmlData";

@Component({
  selector: 'app-aml-profile-descriptions',
  templateUrl: './aml-profile-descriptions.component.html',
  styleUrls: ['./aml-profile-descriptions.component.sass']
})
export class AmlProfileDescriptionsComponent implements OnInit {

  @Input() descriptions;
  @Input() acmAmlChecksDTOs;
  description1List: string[] = [];
  description2List: string[] = [];

  listDescription1: SettingListValuesEntity[];
  listDescription2: SettingListValuesEntity[];

  constructor(public settingsService: SettingsService) { }

  async ngOnInit() {

    let settingListValuesEntity: SettingListValuesEntity = new SettingListValuesEntity();
    settingListValuesEntity.listName = AcmConstants.AML_DESCRIPTION_1_LIST_NAME;

    await this.settingsService.getSettingListValues(settingListValuesEntity).toPromise().then((res) => {
      this.listDescription1 = res;
    })

    settingListValuesEntity.listName = AcmConstants.AML_DESCRIPTION_2_LIST_NAME;
    await this.settingsService.getSettingListValues(settingListValuesEntity).toPromise().then((res) => {
      this.listDescription2 = res;
    })

    if (this.descriptions) {
      if (!this.descriptions?.Descriptions) {
        this.descriptions = [this.descriptions];
      }
      else {
        this.descriptions = this.descriptions?.Descriptions;
      }
    }

    if (this.acmAmlChecksDTOs && this.acmAmlChecksDTOs?.length > 0) {
      let amlCheck = this.acmAmlChecksDTOs.filter((item) => item.idAmlData !== null)[0];

      if (amlCheck) {
        let amlData = new AcmAmlDataEntity();
        amlData.id = amlCheck.idAmlData;

        let descriptionRes;
        await this.settingsService.getAmlData(amlData).toPromise().then((res) => {
          if (res.length > 0) {
            descriptionRes = res[0]?.mapRecord?.Descriptions;
            if (!descriptionRes?.Descriptions) {
              descriptionRes = [descriptionRes];
            }
            else {
              descriptionRes = descriptionRes?.Descriptions;
            }
          }
        })
        this.descriptions = descriptionRes;
      }
    }
  
    if (this.descriptions) {
      if (this.descriptions.length > 0) {
        this.descriptions?.forEach(description => {
          if (description?.Description1) {

            let res = this.listDescription1.filter((item) => item.idExtern === description?.Description1)
           
            if (res.length > 0) {
              this.description1List.push(JSON.parse(res[0].valueJson).name);
            }
            this.description1List = [... new Set(this.description1List)];

          }
          if (description?.Description2) {
            let res = this.listDescription2.filter((item) => item.idExtern === description?.Description2)
            if (res.length > 0) {
              this.description2List.push(JSON.parse(res[0].valueJson).name)
            }
            this.description2List = [... new Set(this.description2List)];
          }
        });
      }
    }
  }

}
