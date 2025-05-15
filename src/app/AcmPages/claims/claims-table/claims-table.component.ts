import { Component, Input, OnInit } from '@angular/core';
import { ClaimsEntity } from 'src/app/shared/Entities/claims.entity';
import { ClaimsListEntity } from 'src/app/shared/Entities/claims.list.entity';
import { SettingClaimsEntity } from 'src/app/shared/Entities/settingClaims.entity';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { SettingsService } from '../../Settings/settings.service';
import { LazyLoadEvent } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { ClaimsPaginationEntity } from 'src/app/shared/Entities/claimsPagination.entity';
import { ProspectEntity } from 'src/app/shared/Entities/Prospect.entity';

@Component({
  selector: 'app-claims-table',
  templateUrl: './claims-table.component.html',
  styleUrls: ['./claims-table.component.sass']
})
export class ClaimsTableComponent implements OnInit {
  public cols: any[];
  public selectedColumns: any[];

  claimsEntity = new ClaimsEntity() ;
  public page: number;
  public pageSize: number;
  public  claimsListEntity : ClaimsListEntity ;
  claimsSetting : SettingClaimsEntity  = new SettingClaimsEntity() ;
  claimsPaginationEntity : ClaimsPaginationEntity = new ClaimsPaginationEntity();

  @Input() claimsStatus ;
  @Input() claimsListEntityLst ;

  constructor(public loanManagementService: LoanManagementService, public settingService: SettingsService,
    public customerManagementService: CustomerManagementService, public datePipe: DatePipe, private sharedService: SharedService, public router: Router) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'claim.Reference' },
      { field: 'category', header: 'claim.Category' },
      { field: 'subject', header: 'claim.subject' },
      { field: 'customer', header: 'claim.customer_name' },
      { field: 'dateInsertion', header: 'claim.Created' },
      { field: 'dueDate', header: 'claim.dueDate' },
      { field: 'ownerName', header: 'claim.ownerName' },
      { field: 'priority', header: 'claim.periority' },
      { field: 'claimOwner', header: 'claim.claim_owner' },
      { field: 'claimGroupOwner', header: 'claim.claims_group_owner' },
    ];


    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;

    // this.loadClaimsDataFromIb(this.claimsStatus) ;
    const claimsPaginationEntity : ClaimsPaginationEntity = new ClaimsPaginationEntity();
    claimsPaginationEntity.pageSize = this.pageSize;
      claimsPaginationEntity.pageNumber = 0;

    const claimsParams = new ClaimsListEntity();
 
    const claim = new ClaimsEntity();
    claim.status = this.claimsStatus? this.claimsStatus :null ;
    claimsParams.claim = claim;
    claimsPaginationEntity.params = claimsParams;

    this.loanManagementService.findClaimsPagination(claimsPaginationEntity).subscribe((data)=>{
    /*   let due  ;
      data.resultsClaims.forEach(item => {
        if (item.dateInsertion){
          due = new Date() ;
          due.setDate(new Date (item.dateInsertion).getDate() +  item.estimation);
        }
        item.dueDate= this.datePipe.transform(due, 'dd/MM/yyyy');
      }); */
      this.claimsListEntityLst = data.resultsClaims;
      this.claimsPaginationEntity = data;
    })
  }

  Claims(){
    this.ngOnInit();
  }
 async loadClaimsDataFromIb(status) {
    const claimsEntity =  new ClaimsEntity() ;
    let due  ;
    claimsEntity.status = status ;
    this.claimsListEntityLst=[] ;

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
            this.claimsListEntity.estimation = data.filter(t => t.id == parseInt(item.subject))[0].processingTimeLine;
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
            this.claimsPaginationEntity.resultsClaims = this.claimsListEntityLst ;                
          }) ;
  }) ;    

  }

   claimDetails(claimList: ClaimsListEntity) {

    this.sharedService.setClaim(claimList);

    if (claimList.claim.idCustomer) {
       this.customerManagementService.getCustomerInformationForClaims(claimList.claim.idCustomer).subscribe(custmer => {
        // set customer in sharedService
        this.sharedService.setCustomer(custmer);
        this.sharedService.setProspect(null);
        this.router.navigate([AcmConstants.DETAIL_CLAIM]);
      });
    }
    else {
      const prospectInfo = new ProspectEntity();
      prospectInfo.name = claimList.claim.name;
      prospectInfo.email = claimList.claim.email;
      prospectInfo.phone = claimList.claim.phone;
      this.sharedService.setProspect(prospectInfo)
      this.router.navigate([AcmConstants.DETAIL_CLAIM]);
    }

  }

  /**
   *
   * @param event LazyLoadEvent
   */
  async reloadClaimList(event: LazyLoadEvent) {
    // await this.loadClaimsDataFromIb(this.claimsStatus)
    const claimsPaginationEntity : ClaimsPaginationEntity = new ClaimsPaginationEntity();
    claimsPaginationEntity.pageSize = event.rows;
    if (event.first === 0) {
      claimsPaginationEntity.pageNumber = event.first;
    } else {
      claimsPaginationEntity.pageNumber = event.first / event.rows;
    }
    const claimsParams = new ClaimsListEntity();
    if (event.filters !== undefined) {
      claimsParams.id = event.filters.id !== undefined ? event.filters.id.value : null;
      claimsParams.category = event.filters.category !== undefined ? event.filters.category.value : null;
      claimsParams.subject = event.filters.subject !== undefined ? event.filters.subject.value : null;
      claimsParams.customer = event.filters.customer !== undefined ? event.filters.customer.value : null;
      claimsParams.dateInsertion = event.filters.dateInsertion !== undefined ? event.filters.dateInsertion.value : null;
      claimsParams.dueDate = event.filters.dueDate !== undefined ? event.filters.dueDate.value : null;
      claimsParams.priority = event.filters.priority !== undefined ? event.filters.priority.value : null;
      claimsParams.claimGroupOwner = event.filters.claimGroupOwner !== undefined ? event.filters.claimGroupOwner.value : null;
      claimsParams.ownerName = event.filters.ownerName !== undefined ? event.filters.ownerName.value : null;
    }
    const claim = new ClaimsEntity();
    claim.status = this.claimsStatus? this.claimsStatus :null ;
    claimsParams.claim = claim;
    claimsPaginationEntity.params = claimsParams;
    
    let sortSetting = false;
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      const sortField = event.multiSortMeta[0].field;
      if (sortField === 'category' || sortField === 'dueDate' || sortField === 'ownerName' || sortField === 'priority' || sortField === 'claimGroupOwner') {
          sortSetting = true;
      } else {
          claimsPaginationEntity.sortField = event.multiSortMeta[0].field ==='customer'? 'name' : event.multiSortMeta[0].field;
          claimsPaginationEntity.sortDirection = event.multiSortMeta[0].order;
      }
  }

    this.loanManagementService.findClaimsPagination(claimsPaginationEntity).subscribe((data)=>{
      let due  ;
     /*  data.resultsClaims.forEach(item => {
        if (item.dateInsertion){
          due = new Date() ;
          due.setDate(new Date (item.dateInsertion).getDate() +  item.estimation);
        }
        item.dueDate= this.datePipe.transform(due, 'dd/MM/yyyy');
      }); */

      if (sortSetting) {
        data.resultsClaims.sort((a, b) => {
            if (event.multiSortMeta[0].field === 'category') {
                return a.category.localeCompare(b.category);
            } else if (event.multiSortMeta[0].field === 'dueDate') {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            } else if (event.multiSortMeta[0].field === 'ownerName') {
                return a.ownerName.localeCompare(b.ownerName);
            } else if (event.multiSortMeta[0].field === 'priority') {
                return a.priority.localeCompare(b.priority);
            } else if (event.multiSortMeta[0].field === 'claimGroupOwner') {
                return a.claimGroupOwner.localeCompare(b.claimGroupOwner);
            } else {
                return 0; 
            }
        });
        if (event.multiSortMeta[0].order === -1) {
            data.resultsClaims.reverse();
        }
    }


      this.claimsListEntityLst = data.resultsClaims;
      this.claimsPaginationEntity = data;
    })
  }

}
