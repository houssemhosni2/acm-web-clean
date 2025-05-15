import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { StepRiskSetting } from 'src/app/shared/Entities/StepRiskSetting.entity';
import { RiskSettingEntity } from 'src/app/shared/Entities/riskSetting.entity';
import { SettingTypeRiskEntity } from 'src/app/shared/Entities/settingTypeRisk.entity';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-risk-level-component',
  templateUrl: './risk-level-component.component.html',
  styleUrls: ['./risk-level-component.component.sass']
})
export class RiskLevelComponentComponent implements OnInit {
  expanded = true ;
  lstRisk = [];
  listStepRiskSetting  : StepRiskSetting[] =[];
  item:ItemEntity = new ItemEntity() ;
  riskTypeList : SettingTypeRiskEntity[] = [];
  constructor(public settingService : SettingsService , public sharedService : SharedService) { }

  ngOnInit() {
    this.item = this.sharedService.getItem() ;
     this.getlstRisk() ;



  }
  toggleCollapse() {
    this.expanded = !this.expanded;
  }


  async getListItemWfRisk() {
    await this.settingService.findItemRisk( this.item).toPromise().then((steps) => {
      this.listStepRiskSetting = steps;

    });
  }
  getlstRisk(){
    this.settingService.findAllSettingRiskType().subscribe(data=>{
      this.riskTypeList = data ;
      this.getListItemWfRisk() ;

    });
  }

  saveLstItemRisk(){
    this.settingService.saveInstanceSettingRisk(this.listStepRiskSetting).subscribe(data=>{
    });
  }
}
