import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CalendarEventsEntity } from 'src/app/shared/Entities/calendarEvents.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CrmService } from '../../crm.service';
import { ClaimsListEntity } from 'src/app/shared/Entities/claims.list.entity';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { checkOfflineMode } from 'src/app/shared/utils';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.sass']
})
export class EventTableComponent implements OnInit {
  @Input() expanded: boolean;
  public users: UserEntity[] = [];
  public page: number;
  public pageSize: number;
  public eventList: CalendarEventsEntity[] = [];
  public loan: LoanEntity;
  public collection: CollectionEntity;
  public claim : ClaimsListEntity;
  @Input() source: string;
  public eventForm: FormGroup;
  public usersSelected: UserEntity[] = [];
  public item  :ItemEntity ;
  public configUsers = {
    displayKey: 'fullName',
    search: true,
    placeholder: ' ',
    searchOnKey: 'fullName',
    height: '400px'
  };
  editData: any = {};
  public connectedUser: UserEntity;
  public fullNameParticipants: string;
  public participantSelectedList = '';
  public minDate: string;
  constructor(public authenticationService: AuthentificationService, public formBuilder: FormBuilder, public translate: TranslateService,private dbService: NgxIndexedDBService,
    public route: ActivatedRoute, public devToolsService: AcmDevToolsServices, public crmService: CrmService, public datePipe: DatePipe,
    public sharedService: SharedService, public modalService: NgbModal) { }
  /**
   * ng On Init
   */
  async ngOnInit() {
    this.connectedUser = this.sharedService.getUser();
    this.pageSize = 5;
    this.page = 1;
    const calendarEventsEntityParam = new CalendarEventsEntity();
    calendarEventsEntityParam.category = this.source;
    calendarEventsEntityParam.typeEvent = AcmConstants.EVENT_TYPE_STEP_TASK;
    if (this.source === 'LOAN') {
      this.loan = this.sharedService.getLoan();
      calendarEventsEntityParam.idLoanExtern = Number(this.loan.idLoanExtern);
    }
    else if (this.source === 'LEGAL' || this.source === 'COLLECTION' || this.source === 'PROSPECTION') {
      this.collection = this.sharedService.getCollection();
      calendarEventsEntityParam.idCollection = Number(this.collection.id);
    } else if (this.source === 'CLAIM' ) {
      this.claim = this.sharedService.getClaim();
      calendarEventsEntityParam.idClaim = this.claim.id;
    }    else if (this.source === 'GENERIC') {
      this.item = this.sharedService.getItem();
      calendarEventsEntityParam.idItem = Number(this.item.id);
    }

    if(!checkOfflineMode()){
    await this.crmService.find(calendarEventsEntityParam).subscribe((data) => {
      this.eventList = data;
    });
  } else {
    const dataKey = this.source === AcmConstants.LOAN_CATEGORY ? 'getLoanTasks_' + this.loan.loanId : 'getCollectionTask_' + this.collection.id;
    this.dbService.getByKey('data', dataKey).subscribe((results:any)=>{
      if(results !== undefined){
        this.eventList = results.data;
      }
    })
  }
  }
  /**
   * get users list
   */
  getUsers() {
    if(checkOfflineMode()){
      this.dbService.getByKey('data', 'getAllUsers').subscribe((users:any)=>{
        if(users !== undefined){
          this.users = users.data;
        }
      })
    } else {
    this.authenticationService.loadAllUserList().subscribe(
      (data) => {
        this.users = data;
      });
    }
  }
  /**
   *
   * @param content any
   */
  openLarge(content) {
    this.getUsers();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.createEventForm();
    this.modalService.open(content, {
      size: 'md'
    });
  }
  /**
   *
   */
  createEventForm() {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      user: ['', Validators.required],
      startDate: ['', Validators.required],
      startHour: ['',Validators.required],
      endDate: ['', Validators.required],
      endHour: ['',Validators.required],
      description: [''],
      participant: [''],
    });
  }
  /**
   *
   */
  toggleCollapse() {
    this.expanded = !this.expanded;
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'UTC');
  }
  async onSubmit() {
    if (this.eventForm.valid) {

      if (((this.eventForm.controls.startDate.value !== '') &&
      (this.eventForm.controls.endDate.value !== '') &&
      (this.eventForm.controls.startDate.value > this.eventForm.controls.endDate.value)) ||
      ((this.eventForm.controls.startHour.value !== '') &&
        (this.eventForm.controls.endHour.value !== '') &&
        (this.eventForm.controls.startDate.value == this.eventForm.controls.endDate.value) &&
        (this.eventForm.controls.startHour.value > this.eventForm.controls.endHour.value))) {
      this.devToolsService.openToast(3, 'alert.error_date');
    }else{
      const event = new CalendarEventsEntity();
      event.libelleEvent = this.eventForm.controls.title.value;
      event.username = this.eventForm.controls.user.value.login;
      event.userFullName = this.eventForm.controls.user.value.fullName;
      event.userEmail = this.eventForm.controls.user.value.email;
      if (this.eventForm.value.startHour !== '') {
        event.dateDebut = this.formatDate(this.eventForm.value.startDate + 'T' + this.eventForm.value.startHour);
      } else {
        event.dateDebut = this.formatDate(this.eventForm.value.startDate + 'T08:00');
      }
      if (this.eventForm.value.endHour !== '') {
        event.dateFin = this.formatDate(this.eventForm.value.endDate + 'T' + this.eventForm.value.endHour);
      } else {
        event.dateFin = this.formatDate(this.eventForm.value.endDate + 'T18:00');

      }
      // event.dateFin = this.datePipe.transform(  event.dateFin, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'UTC');
      event.description = this.eventForm.controls.description.value;
      event.typeEvent = AcmConstants.EVENT_TYPE_STEP_TASK;
      event.category = this.source;
      if (this.source === 'LOAN' && this.loan !== undefined) {
        event.idLoanExtern = Number(this.loan.idLoanExtern);
        event.idCustomerExtern = this.loan.customerDTO.customerIdExtern;
        event.customerName = this.loan.customerDTO.customerNameNoPipe;
        event.customerNumber = this.loan.customerDTO.customerNumber;
        event.stepName = this.loan.statutLibelle;
      }
      else if ((this.source === 'LEGAL' || this.source === 'COLLECTION' || this.source === 'PROSPECTION') && this.collection !== undefined) {
        event.idCollection = this.collection.id;
        event.idLoanExtern = this.collection.idLoanExtern;
        event.idCustomerExtern = this.collection.customerIdExtern;
        event.customerName = this.collection.customerName;
        event.customerNumber = this.formatNumber(this.collection.customerIdExtern);
        event.stepName = this.collection.pendingCollectionInstance.libelle;
      }  else if (this.source === 'GENERIC' && this.item !== undefined) {
        event.idItem = Number(this.item.id);
        event.stepName = this.item.itemInstanceDTOs.filter(element=>element.id === this.item.actualStepInstance)[0].libelle;
      }
      else if ((this.source === 'CLAIM') && this.claim !== undefined ){
        event.idClaim = this.claim.id ;
        event.customerName = this.claim.customer;
        event.idCustomerExtern = this.claim.claim.idCustomer;
      }
      if (this.eventForm.value.participant !== '') {
        event.participant = this.participantSelectedList.slice(0, -1);;
        event.fullNameParticipants = this.fullNameParticipants.substring(1);
      }
      if(checkOfflineMode()){
      const key = this.source === AcmConstants.LOAN_CATEGORY ? 'loanTask_' + this.loan.loanId : 'collectionTask_' + this.collection.id;
      let oldTasks = await this.dbService.getByKey('tasks', key).toPromise() as any;
       let elementTasks = [];
       if(oldTasks !== undefined){
        elementTasks = oldTasks.elementTasks;
       }
       elementTasks.push(event);
       await this.dbService.update('tasks', {elementId : key , elementTasks : elementTasks }).subscribe(()=>{
        this.eventList.push(event);
        const dataKey = this.source === AcmConstants.LOAN_CATEGORY ? 'getLoanTasks_' + this.loan.loanId : 'getCollectionTask_' + this.collection.id;
        this.dbService.update('data',{id:dataKey , data : this.eventList}).toPromise();
        this.modalService.dismissAll();
       })
      } else {
      await this.crmService.create(event).toPromise().then(data => {
        this.devToolsService.openToast(0, 'alert.success-task');
        this.eventList.push(data);
        this.modalService.dismissAll();
      });
    }
    }
    }
  }
  reset() {
    this.eventForm.reset();
    this.modalService.dismissAll();
  }
  async completeEvent(event: CalendarEventsEntity) {
    event.statut = AcmConstants.CLOSED;
    await this.crmService.update(event).toPromise().then(result => {
      event = result;
    });
  }
  dateChanged() {
    if ((this.eventForm.controls.startDate.value !== '') &&
      (this.eventForm.controls.endDate.value !== '') &&
      (this.eventForm.controls.startDate.value > this.eventForm.controls.endDate.value)) {
      this.devToolsService.openToast(3, 'alert.error_date');
    }
  }
  /**
   * formatNumber
   *
   * Function that accepts a number and returns a string with a leading zero if the number has fewer than 5 digits
   * @param num number
   * @returns string
   */
  formatNumber(num: number): string {
    const str = num.toString();
    if (str.length >= 6) {
      return str;
    } else {
      return '0'.repeat(5 - str.length) + str;
    }
  }
  /**
   * participantMethod
   */
  participantMethod() {
    this.fullNameParticipants = ''
    this.participantSelectedList = '';
    this.eventForm.controls.participant.value.forEach(data => {
      this.participantSelectedList = data.login + ',' + this.participantSelectedList;
      this.fullNameParticipants = this.fullNameParticipants + ',' + data.fullName

    });
    if (this.fullNameParticipants !== undefined && this.fullNameParticipants !== '')
      this.fullNameParticipants = this.fullNameParticipants.substring(1);
  }

  /**
   *
   * @param event event
   * @param content content
   */
  displayDetailsDescription(event, content) {
    this.editData = Object.assign(event);
    this.modalService.open(content, {
      size: 'lg'
    }).result.then((result) => {
    });
  }

  /**
   * close popup
   */
  closePopup() {
    this.modalService.dismissAll();
  }

  /**
   * display Description table
   */
  displayDescription(value: string): string {
    if (value.length > 10) {
      return value.substring(0, 10) + ' ...';
    }
    else { return value; }
  }
}
