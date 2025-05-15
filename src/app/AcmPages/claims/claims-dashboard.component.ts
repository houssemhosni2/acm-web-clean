import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ClaimsTableComponent } from './claims-table/claims-table.component';
import { ClaimsEntity } from 'src/app/shared/Entities/claims.entity';
import { ClaimsListEntity } from 'src/app/shared/Entities/claims.list.entity';
import { SettingClaimsEntity } from 'src/app/shared/Entities/settingClaims.entity';
import { LoanManagementService } from '../Loan-Application/loan-management/loan-management.service';
import { SettingsService } from '../Settings/settings.service';
import { CustomerManagementService } from '../Customer/customer-management/customer-management.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AcmConstants } from 'src/app/shared/acm-constants';


@Component({
  selector: 'app-claims-dashboard',
  templateUrl: './claims-dashboard.component.html',
  styleUrls: ['./claims-dashboard.component.sass']
})
export class ClaimsDashboardComponent implements OnInit {
  @ViewChild('refreshTable', {static: false}) refreshTable: ClaimsTableComponent;
  public  claimsListEntityLst : ClaimsListEntity[]=[] ;
  public  claimsListEntity : ClaimsListEntity ;
  lstClaimsSetting : SettingClaimsEntity[]   = [] ;
  claimsSetting : SettingClaimsEntity  = new SettingClaimsEntity() ;
  status : string =AcmConstants.NEW;
  selectedTabIndex :number=0;
  constructor(public loanManagementService : LoanManagementService,public settingService : SettingsService ,
    public  customerManagementService : CustomerManagementService,public datePipe: DatePipe
    , public activatedRoute: ActivatedRoute ) {

    }
 async  ngOnInit() {
  // this.loadClaimsDataFromIb('NEW')
  await this.activatedRoute.queryParams.subscribe(params => {
    const statut = params['statut'];
    if(statut){
      switch(statut) {
        case AcmConstants.NEW :
        this.status = AcmConstants.NEW;
        this.selectedTabIndex = 0;
        break;
        case AcmConstants.IN_PROGRESS :
        this.status = AcmConstants.IN_PROGRESS;
        this.selectedTabIndex = 1;
        break;
        case AcmConstants.CLOSED :
        this.status = AcmConstants.CLOSED;
        this.selectedTabIndex = 2;
        break;
      }
    }
 });
  }

  async refreshParentComponent() {
    this.refreshTable.Claims();
  }
  changeTabs(event: MatTabChangeEvent) {
   // const searchCollection = new CollectionEntity();
    switch (event.index) {
      case 0: {
           // this.loadClaimsDataFromIb('NEW')
           this.status = AcmConstants.NEW;
        break;
      }
      case 1: {
        // this.loadClaimsDataFromIb('IN PROGRESS') ;
        this.status = AcmConstants.IN_PROGRESS;
        break;
      }
      case 2: {
        // this.loadClaimsDataFromIb('CLOSED') ;
        this.status = AcmConstants.CLOSED;
        break;
      }
      default: {
        this.loadClaimsDataFromIb(AcmConstants.NEW) ;
        break;
      }
    }
  }
 async loadClaimsDataFromIb(status) {
    const claimsEntity =  new ClaimsEntity() ;
    claimsEntity.status = status ;
    this.claimsListEntityLst=[] ;
    let due  ;
   await this.settingService.findsettingClaimsById( this.claimsSetting).toPromise().then(data=>{
   this.loanManagementService.findClaimsBystatus(claimsEntity).subscribe(res=>{
        res.forEach(item=>{
          if (item.subject){
            this.claimsListEntity = new ClaimsListEntity () ;
          this.claimsListEntity.id=item.id
          this.claimsListEntity.claim = item;
          this.claimsListEntity.ownerName = data.filter(t=> t.id == parseInt(item.subject))[0].assignement ;
          this.claimsListEntity.claimGroupOwner = data.filter(t=> t.id == parseInt(item.subject))[0].assignement;
          this.claimsListEntity.dateInsertion=item.dateInsertion ;
          this.claimsListEntity.customer = item.name ;
          /* if (item.dateInsertion){
            due = new Date() ;

            due.setDate(new Date (item.dateInsertion).getDate() +  data.filter(t=> t.id == parseInt(item.subject))[0].processingTimeLine)   ;
          } */
          this.claimsListEntity.dueDate= item.dueDate;
                this.claimsListEntity.priority=data.filter(t=> t.id == parseInt(item.subject))[0].pripority;

             this.claimsListEntity.category  = data.filter(t=> t.id == parseInt(item.subject))[0].category ;
              this.claimsListEntity.subject=data.filter(t => t.id == parseInt(item.subject))[0].subject;
            }
           this.claimsListEntityLst.push(this.claimsListEntity) ;
          }) ;

        }) ;
        }) ;

      }
    }
