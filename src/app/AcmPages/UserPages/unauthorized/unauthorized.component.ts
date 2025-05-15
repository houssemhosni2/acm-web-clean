import {Component, OnInit} from '@angular/core';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SettingsService } from '../../Settings/settings.service';
import { AcmConstants } from 'src/app/shared/acm-constants';


@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.sass']
})
export class UnauthorizedComponent implements OnInit {
  listOfLicence : string[] ;
  public expiryDate  = null  ;
  testExpiryDate : boolean ;
  testMaxActiveUser : boolean ;
  searchMaxActiveUser : string ;
  simultaniousUser: string ;
  testSimultaniousUser: boolean ;
  testMac : boolean ;
  mac : string ;
  public today = new Date();
  constructor(public sharedService :SharedService ,public authService: AuthentificationService ,public  settingService : SettingsService ) {
  }



  ngOnInit() {
    const environnements: string[] = [AcmConstants.KEY_LICENCE]
    if (this.sharedService.getActivationKey()!=null || this.sharedService.getActivationKey()!=undefined ){
      this.authService.getCountUser().subscribe(res =>{
        this.searchMaxActiveUser = this.sharedService.getActivationKey().filter(item=>item.includes('MAXACTIVEUSER'))[0].split(':')[1] ;
        this.testMaxActiveUser = Number(this.searchMaxActiveUser)   <= res ;
      }) ;
      this.authService.getSimultaniousUser().subscribe(res =>{
        this.simultaniousUser = this.sharedService.getActivationKey().filter(item=>item.includes('SIMULTANIOUSUSER'))[0].split(':')[1] ;
        this.testSimultaniousUser = Number(this.simultaniousUser)<=res ;
      })

      this.settingService.getMacServer().subscribe(res =>{
        this.mac = this.sharedService.getActivationKey().filter(item=>item.includes('MAC'))[0].split(':')[1] ;
        this.testMac = this.mac===res[0] ;
      })

     this.expiryDate =this.sharedService.getActivationKey().filter(item=>item.includes('EXPIRYDATE'))[0].split(':')[1] ;
     if (this.expiryDate){
      this.expiryDate  = new Date(this.expiryDate.substring(4),this.expiryDate.substring(2, 4)-1,this.expiryDate.substring(0, 2)) ;
    this.testExpiryDate =  this.expiryDate > this.today ;

    }
  }else {
    this.settingService.getEnvirementValueByKeys(environnements).subscribe((data) => {
      this.sharedService.setActivationKey(data.filter(item => item.key === AcmConstants.KEY_LICENCE)[0].value.split(','));
      this.sharedService.setCreptedKey(data.filter(item => item.key === AcmConstants.KEY_LICENCE)[0].creptedKey);
      this.sharedService.setEnvironnementLicence(data.filter(item => item.key === AcmConstants.KEY_LICENCE)[0]);
    this.authService.getCountUser().subscribe(res =>{
      this.searchMaxActiveUser = this.sharedService.getActivationKey().filter(item=>item.includes('MAXACTIVEUSER'))[0].split(':')[1] ;
      this.testMaxActiveUser = Number(this.searchMaxActiveUser)   <= res ;
    }) ;
    this.authService.getSimultaniousUser().subscribe(res =>{
      this.simultaniousUser = this.sharedService.getActivationKey().filter(item=>item.includes('SIMULTANIOUSUSER'))[0].split(':')[1] ;
      this.testSimultaniousUser = Number(this.simultaniousUser)<=res ;
    })

    this.settingService.getMacServer().subscribe(res =>{
      this.mac = this.sharedService.getActivationKey().filter(item=>item.includes('MAC'))[0].split(':')[1] ;
      this.testMac = this.mac===res[0] ;
    })

   this.expiryDate =this.sharedService.getActivationKey().filter(item=>item.includes('EXPIRYDATE'))[0].split(':')[1] ;
   if (this.expiryDate){
    this.expiryDate  = new Date(this.expiryDate.substring(4),this.expiryDate.substring(2, 4)-1,this.expiryDate.substring(0, 2)) ;
  this.testExpiryDate =  this.expiryDate > this.today ;

  }
});
}
}





}
