import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SharedService } from 'src/app/shared/shared.service';
import { SettingsService } from '../settings.service';
import { Router } from '@angular/router';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmEnvironnementEntity } from 'src/app/shared/Entities/acmEnvironnement.entity';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-setting-system-licence',
  templateUrl: './setting-system-licence.component.html',
  styleUrls: ['./setting-system-licence.component.sass']
})
export class SettingSystemLicenceComponent implements OnInit {

  constructor(public sharedService: SharedService,public library: FaIconLibrary,
    public settingsService : SettingsService,public router: Router,public datePipe: DatePipe
    ) { }

  activationKey = [];
  creptedKey ;
  public expiryDate :any  ;
  testExpiryDate : boolean ;
  public today = new Date();
  modifyValue = true;
  acmEnvironnementEntity :  AcmEnvironnementEntity
  listActivationKey =  [] ;
  module = '' ;
  acmEnvironnements=[] ;
  environnementCronMailing : AcmEnvironnementEntity  ;
  date :   Date ;

  ngOnInit(): void {
    const environnements: string[] = [AcmConstants.KEY_LICENCE,AcmConstants.CRON_MAILING_LICENCE,AcmConstants.MAIL_PERIODE_LICENCE];
    this.settingsService.getEnvirementValueByKeys(environnements).subscribe((data) => {
      if (data !== null) {
        this.acmEnvironnements = data ;
        this.sharedService.setActivationKey(data.filter(item=>item.key===AcmConstants.KEY_LICENCE)[0].value.split(','));
        this.sharedService.setCreptedKey(data.filter(item=>item.key===AcmConstants.KEY_LICENCE)[0].creptedKey);
        this.sharedService.setEnvironnementLicence(data.filter(item=>item.key===AcmConstants.KEY_LICENCE)[0]) ;
        this.expiryDate =this.sharedService.getActivationKey().filter(item=>item.includes('EXPIRYDATE'))[0].split(':')[1] ;
        this.creptedKey = this.sharedService.getCreptedKey();
        if (this.expiryDate){
         this.expiryDate  = new Date(this.expiryDate.substring(4),this.expiryDate.substring(2, 4)-1,this.expiryDate.substring(0, 2))
         this.testExpiryDate =  this.expiryDate> this.today ;
       }
      }
    });
    this.getModuleFromKey() ;

  }
  getModuleFromKey() {
    this.listActivationKey = this.sharedService.getActivationKey() ;
    this.listActivationKey =  this.listActivationKey.filter(item=>!item.includes(":")) ;
    for (let i = 0; i < this.listActivationKey.length; i++) {
      this.module+=this.listActivationKey[i]+', ' ;
    }
    this.module= this.module.substring(0,this.module.length-2) ;
  }

  enabledTextKey(){
    this.modifyValue =false ;
  }
  disabledTextKey(){
    this.modifyValue =true ;
    this.acmEnvironnementEntity =   this.sharedService.getEnvironnementLicence() ;
    this.acmEnvironnementEntity.value =this.creptedKey ;
    this.sharedService.setEnvironnementLicence(this.acmEnvironnementEntity) ;
    this.environnementCronMailing =  this.acmEnvironnements.filter(item=>item.key===AcmConstants.CRON_MAILING_LICENCE)[0]
    // tronsform date to cron expression
    this.settingsService.updateAcmEnvironment(this.environnementCronMailing).subscribe(data=>{
    this.settingsService.updateAcmEnvironment(this.acmEnvironnementEntity).subscribe(data=>{
      window.location.reload() ;
    });
  });
  }
 //modify cron expression Configure sending email before the licence expires

}
