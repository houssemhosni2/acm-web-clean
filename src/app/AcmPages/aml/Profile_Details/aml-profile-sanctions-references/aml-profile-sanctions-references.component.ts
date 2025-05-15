import { Component, OnInit, Input } from '@angular/core';
import { SettingListValuesEntity } from 'src/app/shared/Entities/settingListValues.entity';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AcmConstants } from 'src/app/shared/acm-constants';

@Component({
  selector: 'app-aml-profile-sanctions-references',
  templateUrl: './aml-profile-sanctions-references.component.html',
  styleUrls: ['./aml-profile-sanctions-references.component.sass']
})
export class AmlProfileSanctionsReferencesComponent implements OnInit {

  @Input() sanctionsReferences;
  @Input() expanded;
  @Input() isdPdf;

  sanctionsReferencesList: any[];

  constructor(public settingsService: SettingsService) { }

  async ngOnInit() {
    
    if(this.sanctionsReferences){
      if(this.sanctionsReferences?.Reference){
        this.sanctionsReferencesList = [this.sanctionsReferences?.Reference]
      }
      else{
        this.sanctionsReferencesList = this.sanctionsReferences?.SanctionsReferences;
      }
    }
    
    if(this.sanctionsReferencesList){
      this.sanctionsReferencesList.map(async (refrence) =>{
        refrence.name = await this.getSanctionReference(refrence?.value)
      })
    }

  }

  async getSanctionReference(code) {
    let settingListValuesEntity: SettingListValuesEntity = new SettingListValuesEntity();
    settingListValuesEntity.listName = AcmConstants.AML_SANCTIONS_REFERENCES_LIST_NAME;
    settingListValuesEntity.idExtern = code;

    let ref = "";
    await this.settingsService.getSettingListValues(settingListValuesEntity).toPromise().then((res) => {

      if (res.length > 0) {
        ref = JSON.parse(res[0].valueJson).name;
      }
    })
    return ref;
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }
}
