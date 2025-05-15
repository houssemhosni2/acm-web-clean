import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimsEntity } from 'src/app/shared/Entities/claims.entity';
import { ClaimsListEntity } from 'src/app/shared/Entities/claims.list.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { SharedService } from 'src/app/shared/shared.service';
import { SettingsService } from '../../Settings/settings.service';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { CrmService } from '../../CRM/crm.service';
import { CalendarEventsEntity } from 'src/app/shared/Entities/calendarEvents.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

@Component({
  selector: 'app-claim-details',
  templateUrl: './claim-details.component.html',
  styleUrls: ['./claim-details.component.sass']
})
export class ClaimDetailsComponent implements OnInit {


  public claimRecord : ClaimsListEntity ;
  public claim : ClaimsEntity ;
  expanded = true ;
  btnStatus = true ;
  category:string;
  action : boolean =false;

  constructor(private sharedService: SharedService, private router: Router , public loanManagementService :LoanManagementService,
    private crmService :CrmService, private devToolsServices : AcmDevToolsServices) { }

  ngOnInit(): void {
    this.claimRecord = this.sharedService.getClaim();
    this.claim = this.claimRecord.claim;
    this.category = this.claimRecord.category;
    this.action = this.sharedService.getUser().groupes.some(groupe => groupe.libelle === this.claimRecord.claimGroupOwner);    
  }


  actionCompleted() {
    let calendarEventsParam = new CalendarEventsEntity();
    calendarEventsParam.idClaim = this.claim.id;
    this.crmService.find(calendarEventsParam).toPromise().then((res)=>{
      let closeClaim = true;
      if (res){
        closeClaim = !res.some(task => task.statut !=='CLOSED')
      }
      if(closeClaim){
        this.claimRecord.claim.status ='CLOSED';
        // call update service
         this.loanManagementService.updateClaimsInIb(this.claimRecord.claim).subscribe(()=>{
          this.router.navigate(['/crm/claims'], { queryParams: { statut: 'CLOSED' } }).then(()=>{
            window.scrollTo(0, 0);
          });;
        });
      }
      else {
        this.devToolsServices.openToast(3, 'alert.cannot_close_claim');
      }
    })
    



  }

  actionInProgress() {
    this.claimRecord.claim.status ='IN PROGRESS';
    this.loanManagementService.updateClaimsInIb(this.claimRecord.claim).subscribe(()=>{
      this.router.navigate(['/crm/claims'], { queryParams: { statut: 'IN PROGRESS' } }).then(()=>{
        window.scrollTo(0, 0);
      });

  });

    // call update service
  }

  actionReoppen() {
    this.claimRecord.claim.status ='NEW';
    this.loanManagementService.updateClaimsInIb(this.claimRecord.claim).subscribe(()=>{
      this.router.navigate(['/crm/claims'], { queryParams: { statut: 'NEW' } }).then(()=>{
        window.scrollTo(0, 0);
      });;

  });

    // call update service
  }


  exit() {
    this.router.navigate([AcmConstants.DASHBOARD_CLAIM]);
  }

  toggleCollapse() {
    this.expanded = !this.expanded;

  }
}
