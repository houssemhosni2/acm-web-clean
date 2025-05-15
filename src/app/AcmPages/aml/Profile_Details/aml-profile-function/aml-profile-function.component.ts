import { Component, OnInit, Input } from '@angular/core';
import { SettingListValuesEntity } from 'src/app/shared/Entities/settingListValues.entity';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
@Component({
  selector: 'app-aml-profile-function',
  templateUrl: './aml-profile-function.component.html',
  styleUrls: ['./aml-profile-function.component.sass']
})
export class AmlProfileFunctionComponent implements OnInit {

  @Input() roleDetail;
  @Input() expanded;
  @Input() isdPdf;

  primaryFunctionItem :any[]=[];
  previousRoleItem :any[]=[];
  
  primaryFunctions: any[] = [];
  previousRoles: any[] = [];

  constructor(public settingsService: SettingsService) { }

  ngOnInit(): void {

    if(this.roleDetail){
      if (this.roleDetail?.Roles) {
        this.roleDetail = [this.roleDetail?.Roles];
      }
      else {
        this.roleDetail = this.roleDetail?.RoleDetail;
      }
    }

    if(this.roleDetail){

      this.roleDetail.map(async (occupation) => {

        if(occupation?.Roles){
          occupation?.Roles?.map( async (role) => {
            role.category = await this.getOccupationCategory(role?.OccCat);
          })
        }
        else {
          occupation.OccTitle.category = await this.getOccupationCategory(occupation?.OccTitle?.OccCat);
        }
        
      });
      

      this.primaryFunctionItem = this.roleDetail.filter((item) => item.RoleType === AcmConstants.AML_PRIMARY_OCCUPATION_CATEGORY || item.RoleType === AcmConstants.AML_OTHER_ROLES_OCCUPATION_CATEGORY);
      this.previousRoleItem = this.roleDetail.filter((item) => item.RoleType === AcmConstants.AML_PREVIOUS_ROLES_OCCUPATION_CATEGORY);

      if(this.primaryFunctionItem[0]?.Roles){
        this.primaryFunctions = this.primaryFunctionItem[0]?.Roles;
      }
      else if(this.primaryFunctionItem[0]?.OccTitle) {
        this.primaryFunctions.push(this.primaryFunctionItem[0]?.OccTitle);
      }
      
      if(this.previousRoleItem[0]?.Roles){
        this.previousRoles = this.previousRoleItem[0]?.Roles;     
      }
      else if(this.previousRoleItem[0]?.OccTitle){
        this.previousRoles.push(this.previousRoleItem[0]?.OccTitle);
      }
      
    }
  }

  async getOccupationCategory(code) {
    let settingListValuesEntity: SettingListValuesEntity = new SettingListValuesEntity();
    settingListValuesEntity.listName = AcmConstants.AML_OCCUPATION_LIST_NAME;
    settingListValuesEntity.idExtern = code;

    let occupationRes = null;
    await this.settingsService.getSettingListValues(settingListValuesEntity).toPromise().then((res) => {

      if (res.length > 0) {
        occupationRes = JSON.parse(res[0].valueJson).name;
      }
    })
    return occupationRes;
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

}
