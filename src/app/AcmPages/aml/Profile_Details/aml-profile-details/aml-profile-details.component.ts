import { Component, OnInit, Input } from '@angular/core';
import { SettingListValuesEntity } from 'src/app/shared/Entities/settingListValues.entity';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
@Component({
  selector: 'app-aml-profile-details',
  templateUrl: './aml-profile-details.component.html',
  styleUrls: ['./aml-profile-details.component.sass']
})
export class AmlProfileDetailsComponent implements OnInit {

  @Input() expanded;
  @Input() descriptions;
  @Input() isdPdf;
  descriptionTree: any;

  listDescription1: SettingListValuesEntity[];
  listDescription2: SettingListValuesEntity[];
  listDescription3: SettingListValuesEntity[];

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

    settingListValuesEntity.listName = AcmConstants.AML_DESCRIPTION_3_LIST_NAME;
    await this.settingsService.getSettingListValues(settingListValuesEntity).toPromise().then((res) => {
      this.listDescription3 = res;
    })


    if (this.descriptions) {
      if (!this.descriptions?.Descriptions) {
        this.descriptions = [this.descriptions];
      }
      else {
        this.descriptions = this.descriptions?.Descriptions;
      }


      const descriptionTreeMap = new Map<string, any>();


      for (const description of this.descriptions) {
        if (description?.Description1) {
          let description1: string = await this.getDescriptionItem(description.Description1, AcmConstants.AML_DESCRIPTION_1_LIST_NAME);
          if (description1) {
            let parent = descriptionTreeMap.get(description1);

            if (!parent) {
              parent = { name: description1, children: [] };
              descriptionTreeMap.set(description1, parent);
            }

            if (description?.Description2) {
              let description2: string = await this.getDescriptionItem(description.Description2, AcmConstants.AML_DESCRIPTION_2_LIST_NAME);
              if (description2) {
                let child = parent.children.find((x: any) => x.name === description2);

                if (!child) {
                  child = { name: description2, children: [] };
                  parent.children.push(child);
                }

                if (description?.Description3) {
                  let description3: string = await this.getDescriptionItem(description.Description3, AcmConstants.AML_DESCRIPTION_3_LIST_NAME);
                  if (description3) {
                    child.children.push({ name: description3 });
                  }
                }
              }
            }
          }
        }
      }

      this.descriptionTree = Array.from(descriptionTreeMap.values())
    }
  }


  async getDescriptionItem(descriptionId, listName) {
    let descriptionRes = null;
    if (listName === AcmConstants.AML_DESCRIPTION_1_LIST_NAME) {
      let res = this.listDescription1.filter((item) => item.idExtern === descriptionId);
      if (res.length > 0) {
        descriptionRes = JSON.parse(res[0].valueJson).name;
      }
    }
    else if (listName === AcmConstants.AML_DESCRIPTION_2_LIST_NAME) {
      let res = this.listDescription2.filter((item) => item.idExtern === descriptionId);
      if (res.length > 0) {
        descriptionRes = JSON.parse(res[0].valueJson).name;
      }
    }
    else if (listName === AcmConstants.AML_DESCRIPTION_3_LIST_NAME) {
      let res = this.listDescription3.filter((item) => item.idExtern === descriptionId);
      if (res.length > 0) {
        descriptionRes = JSON.parse(res[0].valueJson).name;
      }
    }
    return descriptionRes;
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

}
