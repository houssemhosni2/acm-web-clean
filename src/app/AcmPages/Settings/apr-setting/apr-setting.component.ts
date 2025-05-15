import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SettingsService } from '../settings.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmEnvironnementEntity } from 'src/app/shared/Entities/acmEnvironnement.entity';

@Component({
  selector: 'app-apr-setting',
  templateUrl: './apr-setting.component.html',
  styleUrls: ['./apr-setting.component.sass']
})
export class AprSettingComponent implements OnInit {
  public groupForm: FormGroup;
  acmEnvironnement : AcmEnvironnementEntity = new  AcmEnvironnementEntity() ;

  constructor( public translate: TranslateService,  public formBuilder: FormBuilder,
     public devToolsServices: AcmDevToolsServices, public library: FaIconLibrary
     , public settingService  :  SettingsService) {

      }

  ngOnInit(): void {
    this.groupForm = this.formBuilder.group({
      apr: [null ],

  });
    this.settingService.getEnvirementValueByKeys([AcmConstants.APR_KEY]).subscribe(res=>{
      this.acmEnvironnement =  res[0] ;
      this.groupForm.controls.apr.setValue(res.length==0?null:res[0].value) ;



      }) ;
  }

  updateApr(){
    this.acmEnvironnement.value = this.groupForm.controls.apr.value ;
    this.settingService. updateAcmEnvironment(this.acmEnvironnement).subscribe() ;

  }

}
