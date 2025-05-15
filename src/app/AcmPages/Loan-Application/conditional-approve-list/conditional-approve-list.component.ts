import { Component, Input, OnInit } from '@angular/core';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { CalendarEventsEntity } from 'src/app/shared/Entities/calendarEvents.entity';
import { ConditionalApproveEntity } from 'src/app/shared/Entities/conditionalApprove.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CrmService } from '../../CRM/crm.service';
import { ConditionnalApproveService } from '../conditional-approve/conditional-approve.service';
import { LoanApprovalService } from '../loan-approval/loan-approval.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-conditional-approve-list',
  templateUrl: './conditional-approve-list.component.html',
  styleUrls: ['./conditional-approve-list.component.sass']
})
export class ConditionalApproveListComponent implements OnInit {

  constructor(public sharedService : SharedService , public conditionnalApproveService : ConditionnalApproveService,private dbService: NgxIndexedDBService,
    public loanService : LoanApprovalService,public crmService:CrmService, public authentificationService :AuthentificationService ) { }
  @Input() expanded: boolean;
  @Input() category: string;

  loan :LoanEntity = new LoanEntity() ;
  conditionalApproveEntitys : ConditionalApproveEntity[] = [] ;
  connectedUser: UserEntity;
  calendarEventsEntity :  CalendarEventsEntity= new CalendarEventsEntity();
  calendarEventsValidator : CalendarEventsEntity ;
  userBoss : UserEntity  = new UserEntity() ;
  calendarEventBoss :CalendarEventsEntity  = new CalendarEventsEntity() ;

  async ngOnInit() {
    this.connectedUser = this.sharedService.getUser();
    if(!checkOfflineMode()){
    const conditionalApproveEntity = new ConditionalApproveEntity ()
    if (this.category !=="ITEM"){
    this.loan = this.sharedService.getLoan() ;
    conditionalApproveEntity.loan = this.loan ;
    }else {
    conditionalApproveEntity.item= this.sharedService.getItem() ;
    }

    this.conditionnalApproveService.find(conditionalApproveEntity).subscribe(data=>{
      this.conditionalApproveEntitys = data ;
    });
  } else {
    const data = await this.dbService.getByKey('data', 'getConditionnalApproveByLoanId_' + this.sharedService.getLoan().loanId).toPromise() as any;
    if(data !== undefined){
      this.conditionalApproveEntitys = data.data ;
    }
  }
  }
  toggleCollapse() {
    this.expanded = !this.expanded;

  }
  async completeTask(conditionalApproveEntity : ConditionalApproveEntity,status: string ){
    if (status===AcmConstants.APPROVAL_CONDITIONS_COMPLETED){
    conditionalApproveEntity.status = AcmConstants.APPROVAL_CONDITIONS_COMPLETED ;
    const  calendarEventsEntityForValidator = new CalendarEventsEntity ()  ;
    // add events in calendar
    calendarEventsEntityForValidator.libelleEvent = 'Conditional approve-'+this.loan.accountNumber ;
    calendarEventsEntityForValidator.category = AcmConstants.LOAN_CATEGORY ;
    calendarEventsEntityForValidator .description =conditionalApproveEntity.description ;
    calendarEventsEntityForValidator.idLoanExtern = Number(this.loan.idLoanExtern) ;
    calendarEventsEntityForValidator.username = conditionalApproveEntity.usernameInsertedBy ;
    const date = new Date ();
    calendarEventsEntityForValidator.dateDebut =this.formatDate(date) + 'T' +'08:00'+ '.000+0000' ;
    calendarEventsEntityForValidator.dateFin =this.formatDate(date) + 'T' +'18:00'+ '.000+0000' ;
    calendarEventsEntityForValidator.typeEvent='task' ;
    calendarEventsEntityForValidator.customerName=this.loan.customerNameNoPipe ;
    if (calendarEventsEntityForValidator.customerName===null){
      calendarEventsEntityForValidator.customerName=this.loan.customerDTO.customerNameNoPipe ;
    }
    calendarEventsEntityForValidator.customerNumber=    this.sharedService.getCustomer().customerNumber;
    await this.authentificationService.getUserByLogin(conditionalApproveEntity.usernameInsertedBy)
    .toPromise().then(  res =>{
      calendarEventsEntityForValidator.userEmail=res.email ;
       this.crmService.create(calendarEventsEntityForValidator).toPromise().then(res=>{
        conditionalApproveEntity.calendarEventApproveValidator = res  ;
        this.updateConditionnalApprove(conditionalApproveEntity,AcmConstants.APPROVAL_CONDITIONS_COMPLETED) ;

      })
    }) ;

  }else {
     conditionalApproveEntity.conditionnalValidation = true  ;
     conditionalApproveEntity.status = AcmConstants.CLOSED;
     this.updateConditionnalApprove(conditionalApproveEntity,AcmConstants.CLOSED) ;
    }

  }
  updateConditionnalApprove(conditionalApproveEntity :ConditionalApproveEntity,status: string){
  this.conditionnalApproveService.update(conditionalApproveEntity).subscribe(data=>{
    if (status===AcmConstants.APPROVAL_CONDITIONS_COMPLETED)
      this.calendarEventsEntity=conditionalApproveEntity.calendarEventApprove ;
    else
    this.calendarEventsEntity=conditionalApproveEntity.calendarEventApproveValidator ;

    if (this.calendarEventsEntity !== null)
     this.crmService.closeTask(this.calendarEventsEntity).subscribe();
   });
  }
  reopenTask(conditionalApproveEntity : ConditionalApproveEntity){
    conditionalApproveEntity.conditionnalValidation = false  ;
    conditionalApproveEntity.status =  'NEW' ;
    const date = new Date ();
    this.conditionnalApproveService.update(conditionalApproveEntity).subscribe(data=>{
      conditionalApproveEntity=data;
      this.calendarEventsEntity=conditionalApproveEntity.calendarEventApprove ;
      this.calendarEventsEntity.dateDebut =this.formatDate(date) + 'T' +'08:00'+ '.000+0000' ;
      this.calendarEventsEntity.dateFin =this.formatDate(date) + 'T' +'18:00'+ '.000+0000' ;
      this.calendarEventsEntity.customerName = this.loan.customerNameNoPipe ;
      if (this.calendarEventsEntity!==null ){
        this.calendarEventsEntity.statut = 'New';
       this.crmService.update(this.calendarEventsEntity).subscribe() ;
       this.crmService.closeTask(conditionalApproveEntity.calendarEventApproveValidator).subscribe();

      }

     });

  }

  formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

}
