import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { CalendarEventsEntity } from 'src/app/shared/Entities/calendarEvents.entity';
import { ConditionalApproveEntity } from 'src/app/shared/Entities/conditionalApprove.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CrmService } from '../../CRM/crm.service';
import { ConditionnalApproveService } from './conditional-approve.service';
import { PageTitleService } from 'src/app/Layout/Components/page-title/page-title.service';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: "app-conditional-approve",
  templateUrl: "./conditional-approve.component.html",
  styleUrls: ["./conditional-approve.component.sass"],
})
export class ConditionalApproveComponent implements OnInit, OnDestroy {

  constructor(public formBuilder: FormBuilder, public pageTitleService: PageTitleService,private dbService: NgxIndexedDBService,
    public sharedService: SharedService, public conditionnalApproveService: ConditionnalApproveService,
    public crmService: CrmService, public datePipe: DatePipe) { }
  ngOnDestroy(): void {
    this.conditionnalAprroveList = [];
    this.conditionalAproveForm = new FormGroup({});

  }
  public conditionalAproveForm: FormGroup;
  public conditionalAproves: ConditionalApproveEntity[] = [];
  public usersList: UserEntity[];
  public user: UserEntity = new UserEntity();
  public userSelected: UserEntity = new UserEntity();
  loan: LoanEntity;
  public minDate: string;
  @Input() changing: Subject<boolean>;
  @Output() validatorEvent = new EventEmitter<boolean>();

  @Input() category: string;
  conditionnalAprroveList: ConditionalApproveEntity[] = [];
  item: ItemEntity;
  checker: boolean = false;
  public configUsers = {
    displayKey: 'fullName',
    search: true,
    placeholder: ' ',
    searchOnKey: 'fullName'
  };

  ngOnInit(): void {
    const today = new Date();
    this.conditionnalAprroveList = []
    this.item = this.sharedService.getItem()
    this.minDate = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.conditionalAproveForm = new FormGroup({});
    this.loan = this.sharedService.getLoan();
    if(checkOfflineMode()){
      this.dbService.getByKey('data', 'getAllUsers').subscribe((users:any)=>{
        if(users !== undefined){
          this.usersList = users.data;
        }
      })
    } else {
    this.pageTitleService.loadAllUserList().subscribe(data => {
      this.usersList = data;
    });
  }
    this.changing.subscribe(v => {
      if (v === false) {
        /** Initialize Checker each time entering changing event */
        this.checker = true;
        /** Check If Dates are filled ==> if not send event false */
        //let date  =      this.datePipe.transform(today, 'yyyy-MM-dd');

        for (let i = 0; i < this.conditionalAproves.length; i++) {
          let x = "approvalConditionDate" + i;
          let u = "user" + i;
          let fieldDate = this.conditionalAproveForm.controls[x].value;
          let fieldUser = this.conditionalAproveForm.controls[u].value;
          if ((fieldDate == null || fieldDate.toString() == "") || (fieldUser == null || fieldUser == undefined ||fieldUser.toString() == "")){
            this.checker = false;
          }
        }
        if (!this.checker){
          this.validatorEvent.emit(false);
        }else {
          // if(this.conditionalAproves.length > 0){
          //   this.saveConditionnalApprove() ;
          // }
          this.validatorEvent.emit(true);
        }
      }
      if (v === true) {
        this.saveConditionnalApprove();
      }
    });
  }
  deleteActiveCustomer(index) {
    this.conditionalAproveForm.removeControl("description" + index);
    this.conditionalAproveForm.removeControl("user" + index);
    this.conditionalAproveForm.removeControl("approvalConditionDate" + index);
    this.conditionalAproves.splice(index, 1);
  }

  compareDatesWithoutTime(date1: Date, date2: Date): number {
    // Set the time components to 0 for both dates
    const strippedDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const strippedDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

    // Compare the stripped dates
    if (strippedDate1 < strippedDate2) {
      return -1;
    } else if (strippedDate1 > strippedDate2) {
      return 1;
    } else {
      return 0; // Dates are equal
    }
  }



  addConditionalAprove() {
    this.conditionalAproveForm.addControl(
      "description" + this.conditionalAproves.length,
      new FormControl("", Validators.required)
    );
    this.conditionalAproveForm.addControl(
      "user" + this.conditionalAproves.length,
      new FormControl("", Validators.required)
    );
    this.conditionalAproveForm.addControl(
      "approvalConditionDate" + this.conditionalAproves.length,
      new FormControl("", Validators.required)
    );

    this.conditionalAproves.push(new ConditionalApproveEntity());
  }

  formatDate(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  async saveConditionnalApprove() {
    if (this.conditionalAproveForm.valid) {
      const calendarEventsEntity: CalendarEventsEntity =
        new CalendarEventsEntity();        
      for (let i = 0; i < this.conditionalAproves.length; i++) {
        const conditionalApprove = new ConditionalApproveEntity();
        conditionalApprove.description =
          this.conditionalAproveForm.controls["description" + i].value;
        conditionalApprove.user =
          this.conditionalAproveForm.controls["user" + i].value;
        conditionalApprove.approvalConditionDate =
          this.conditionalAproveForm.controls["approvalConditionDate" + i].value;
        conditionalApprove.status = AcmConstants.APPROVAL_CONDITIONS_NEW;
        if (this.category !== "ITEM") {
          conditionalApprove.item = null;
          conditionalApprove.loan = this.loan;
          conditionalApprove.calendarEventApproveValidator = null;
          conditionalApprove.usernameInsertedBy = this.sharedService.user.login;
          // add events in calendar
          calendarEventsEntity.libelleEvent =
            "Conditional approve-" + this.loan.accountNumber;
          calendarEventsEntity.category = AcmConstants.LOAN_CATEGORY;
          calendarEventsEntity.description = conditionalApprove.description;
          calendarEventsEntity.idLoanExtern = Number(this.loan.idLoanExtern);
          calendarEventsEntity.username = conditionalApprove.user.login;
          calendarEventsEntity.dateDebut =
            conditionalApprove.approvalConditionDate + "T" + "08:00" + ".000+0000";
          calendarEventsEntity.dateFin =
            conditionalApprove.approvalConditionDate + "T" + "18:00" + ".000+0000";
          calendarEventsEntity.typeEvent = "task";
          calendarEventsEntity.customerName =
            this.sharedService.getCustomer().customerNameNoPipe;
          calendarEventsEntity.idCustomerExtern =
            this.sharedService.getCustomer().customerIdExtern;
          calendarEventsEntity.userEmail = this.sharedService.getUser().email;
          calendarEventsEntity.customerNumber =
            this.sharedService.getCustomer().customerNumber;
        } else {
          conditionalApprove.loan = null;
          conditionalApprove.item = this.item;
          conditionalApprove.calendarEventApproveValidator = null;
          conditionalApprove.usernameInsertedBy = this.sharedService.user.login;
          // add events in calendar
          calendarEventsEntity.libelleEvent =
            "Conditional approve-" + this.item.id;
          calendarEventsEntity.category = AcmConstants.GENERIC_CATEGORY;
          calendarEventsEntity.description = conditionalApprove.description;
          calendarEventsEntity.username = conditionalApprove.user.login;
          calendarEventsEntity.dateDebut =
            conditionalApprove.approvalConditionDate + "T" + "08:00" + ".000+0000";
          calendarEventsEntity.dateFin =
            conditionalApprove.approvalConditionDate + "T" + "18:00" + ".000+0000";
          calendarEventsEntity.typeEvent = "task";
          calendarEventsEntity.userEmail = this.sharedService.getUser().email;
          calendarEventsEntity.idItem = this.item.id;
        }
        if(!checkOfflineMode()){
        const data = await this.crmService.create(calendarEventsEntity).toPromise();
            conditionalApprove.calendarEventApprove = data;
            this.conditionnalAprroveList.push(conditionalApprove);
        } else {
          const key = 'loanTask_' + this.loan.loanId;
          const oldTasks = await this.dbService.getByKey('tasks', key).toPromise() as any;
            let elementTasks = [];
            if(oldTasks !== undefined){
             elementTasks = oldTasks.elementTasks;
            }
            elementTasks.push(calendarEventsEntity);

          await this.dbService.update('tasks', {elementId : key , elementTasks : elementTasks }).toPromise();
          await this.dbService.update('data',{id:'getLoanTasks_' + this.loan.loanId , data : elementTasks}).toPromise();
           conditionalApprove.calendarEventApprove = calendarEventsEntity;
           this.conditionnalAprroveList.push(conditionalApprove);
        }
      }

      if(!checkOfflineMode()){
        await this.conditionnalApproveService
        .create(this.conditionnalAprroveList).subscribe(()=>{
          this.conditionnalAprroveList = [];
        });
          
      
      } else {
         this.dbService.update('conditionalApproves',{loanId : this.loan.loanId , conditionalApproves:this.conditionnalAprroveList}).subscribe();
        this.conditionnalAprroveList = [];
      }
    }
  }
}
