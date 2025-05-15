import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { isSameDay, isSameMonth } from 'date-fns';
import { forkJoin, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEventsEntity } from 'src/app/shared/Entities/calendarEvents.entity';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';
import { SharedService } from 'src/app/shared/shared.service';
import { VisitReportServices } from '../../Loan-Application/field-visit/filed-visit-details/visit-report.services';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';
import { CrmService } from '../crm.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { AppComponent } from '../../../app.component';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import localeAr from '@angular/common/locales/ar';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Customer360Services } from '../../Customer/customer360/customer360.services';
import { map, mergeMap } from 'rxjs/operators';
import { CollectionServices } from '../../Collection/collection.services';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SettingsService } from '../../Settings/settings.service';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerPaginationEntity } from 'src/app/shared/Entities/customer.pagination.entity';
import { CustomerListService } from '../../Customer/customer-list/customer-list.service';
import { GenericWorkFlowService } from '../../generic-workFlow/generic-workflow.service';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { CollectionProcessEntity } from 'src/app/shared/Entities/CollectionProcess.entity';
import { ClaimsPaginationEntity } from 'src/app/shared/Entities/claimsPagination.entity';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { ClaimsEntity } from 'src/app/shared/Entities/claims.entity';
import { ClaimsListEntity } from 'src/app/shared/Entities/claims.list.entity';
import { ProspectEntity } from 'src/app/shared/Entities/Prospect.entity';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
registerLocaleData(localeFr);
registerLocaleData(localeEn);
registerLocaleData(localeAr);
const colors: any = {
  rose: {
    primary: '#ff93b4',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#a4ddf1',
    secondary: '#D1E8FF'
  },
  grey: {
    primary: ' #9E9E9E'
  },
  green: {
    primary: '#b0e5b8',
  },
  red: {
    primary: '#001aff5e',
  },
  orange: {
    primary: 'rgba(255,184,163,0.76)',
  },
  teal: {
    primary: '#80BCBD',
  }
};
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  public activeDayIsOpen = true;
  public calendarEventsEntity: CalendarEventsEntity = new CalendarEventsEntity();
  public eventForm: FormGroup;
  public selectedTasks: Array<any> = [];
  public users: Array<any> = [];
  public selectUser: Array<any> = [];
  public selectCustomer: Array<any> = [];
  public dropdownSettings: IDropdownSettings = {};
  public userToInsert = '';
  public selectedTask: CalendarEventsEntity = new CalendarEventsEntity();

  public userSelected: string;
  public weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  public weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
  public minDate: string;
  public userConnectedLogin: string; // login of connected user
  public teamOptionSelected = false;
  public eventLimit = 3;
  public configTeams = {
    search: true,
    displayKey: 'loginAndName',
    searchOnKey: 'login',
    placeholder: ' '
  };
  public teamUsers: UserEntity[] = []; // team of connected user
  public teamUsersSelected: UserEntity[] = [];
  public groupForm: FormGroup;
  public customers: Array<any> = [];
  public filteredCustomerSingle: any[] = [];
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  @ViewChild('modalContentConsult', { static: true }) modalContentConsult: TemplateRef<any>;
  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public modalData: {
    action: string;
    event: CalendarEvent;
  };
  public actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.editEvent(event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.openDialog(event);
      }
    }
  ];
  public refresh: Subject<any> = new Subject();
  public events: CalendarEvent[] = []; // list of events that will be displayed it the calendar screen
  public userEvents: CalendarEvent[] = []; // list of connected user events
  public teamEvents: CalendarEvent[] = []; // list of connected user 's team evens
  public moreEvents: CalendarEvent[] = []; // list of one day's events
  public asyncP: Subject<boolean> = new Subject();
  public top: string;
  public left: string;
  public collectionCategory = AcmConstants.COLLECTION_CATEGORY;
  public legalCategory = AcmConstants.LEGAL_CATEGORY;
  public loanCategory = AcmConstants.LOAN_CATEGORY;
  public prospectionCategory = AcmConstants.PROSPECTION;
  public claimCategory = AcmConstants.CLAIM;
  public genericCategory = AcmConstants.GENERIC_CATEGORY;




  public taskType = AcmConstants.EVENT_TYPE_TASK;
  public appointmentType = AcmConstants.EVENT_TYPE_APPOINTEMENT;
  public customersSelected: CustomerEntity[] = [];
  public customersList: CustomerEntity[] = [];
  public configCustomers = {
    displayKey: 'customerNameNoPipe',
    search: true,
    placeholder: ' ',
    searchOnKey: 'customerNameNoPipe'
  };
  public usersSelected: UserEntity[] = [];
  public configUsers = {
    displayKey: 'fullName',
    search: true,
    placeholder: ' ',
    searchOnKey: 'fullName'
  };
  public configParticipants = {
    displayKey: 'fullName',
    search: true,
    placeholder: ' ',
    searchOnKey: 'fullName'
  }
  public userList: UserEntity[] = [];
  public collaborators: UserEntity[] = null;
  public customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();
  public eventSelected = new CalendarEventsEntity();
  public participants: UserEntity[] = [];
  public formUpdated = false;
  public participantSelectedList = '';
  public fullNameParticipants : string ;
  public emptyUser = false;

  /**
   *
   * @param modal NgbModal
   * @param router Router
   * @param dialog MatDialog
   * @param crmService CrmService
   * @param loanSharedService SharedService
   * @param settingsService SettingsService
   * @param visitReportServices VisitReportServices
   * @param formBuilder FormBuilder
   * @param customerService CustomerServices
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService
   * @param sharedService SharedService
   * @param datePipe DatePipe
   * @param library FaIconLibrary
   * @param customer360Services Customer360Services
   * @param collectionServices CollectionServices
   * @param customerListService CustomerListService
   */
  constructor(public modal: NgbModal, public router: Router, public dialog: MatDialog, public crmService: CrmService,
    public settingsService: SettingsService, public visitReportServices: VisitReportServices, public formBuilder: FormBuilder,
    public customerService: CustomerServices, public devToolsServices: AcmDevToolsServices,
    public translate: TranslateService, public sharedService: SharedService, public datePipe: DatePipe,
    public library: FaIconLibrary, public customer360Services: Customer360Services, public loanSharedService: SharedService,
    public collectionServices: CollectionServices, public customerListService: CustomerListService,
    public genericWorkService : GenericWorkFlowService ,
     public settingService: SettingsService,
     public loanManagementService: LoanManagementService,public customerManagementService: CustomerManagementService
    ) {
  }
  /**
   * ng on init
   */
  async ngOnInit() {
    // get team of connected user
    const userParam = new UserEntity();
    userParam.responsableId = this.sharedService.getUser().login;
    await this.settingsService.getUsers(userParam).toPromise().then(
      (data) => {
        this.teamUsers = data;
        // display the select list of the team
        this.asyncP.next(true);
      }
    );
    // set login of connected user
    this.userConnectedLogin = this.sharedService.getUser().login;
    // set default option : User's Tasks displayed
    this.calendarEventsEntity.allTeamsTasks = false;
    // get only evants of connected user
    this.calendarEventsEntity.username = this.userConnectedLogin;
    // find tasks of connected user
    this.crmService.find(this.calendarEventsEntity).subscribe(
      (data) => {
        let color;
        for (let i = 0; i < data.length; i++) {
          // set collection events with orange color
          if (data[i].category === AcmConstants.COLLECTION_CATEGORY) {
            color = colors.orange;
          }
          // set legal events with rose color
          else if (data[i].category === AcmConstants.LEGAL_CATEGORY) {
            color = colors.rose;
          }
          // set loan vents with blue color
          else if (data[i].category === AcmConstants.LOAN_CATEGORY) {
            color = colors.blue;
          }
          else if (data[i].category === AcmConstants.PROSPECTION) {
            color = colors.green;
          }
          else if (data[i].category === AcmConstants.GENERIC_CATEGORY) {
            color = colors.red;
          }
          else if (data[i].category === AcmConstants.CLAIM){
            color = colors.teal;
          }
          else {
            // set other events with grey color
            color = colors.grey;
          }
          // if the event is closed then set the event title with a line-through decoration
          let cssClass = ''
          if (data[i].statut === AcmConstants.CLOSED) {
            cssClass = 'calendar-closed-task'
          }
          // init obj to add to events
          const obj = {
            id: data[i].id,
            start: new Date(data[i].dateDebut),
            end: new Date(data[i].dateFin),
            title: data[i].libelleEvent,
            color,
            actions: this.actions,
            typeEvent: data[i].typeEvent,
            participant: data[i].participant,
            place: data[i].place,
            description: data[i].description,
            customer: data[i].customerName,
            meta: [{ username: data[i].username }],
            statut: data[i].statut,
            cssClass,
            idLoanExtern: data[i].idLoanExtern,
            idCollection: data[i].idCollection,
            category: data[i].category,
            calendarEvent: data[i]
          };
          // add the event to user events list
          this.userEvents.push(obj);
        }
        // refresh calendar components
        this.refresh.next();
      }
    );
    // set events list to be displayed in the screen with the connected user's events
    this.events = this.userEvents;
    this.visitReportServices.getUsersVisit().subscribe(
      (data) => {
        this.participants = data;
        for (let i = 0; i < data.length; i++) {
          this.users.push({ item_id: data[i].login, item_text: data[i].simpleName });
        }
        this.loanSharedService.setUsers(this.users);
      });
    this.dropdownSettings = {
      singleSelection: false,
      defaultOpen: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  /**
   * Methode dayClicked
   * @param Date date
   * @param CalendarEvent events
   */
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  /**
   * Methode eventTimesChanged
   * @param CalendarEventTimesChangedEvent calendarEventTimesChangedEvent
   */
  eventTimesChanged({
    event, newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  /**
   * Methode handleEvent
   * @param string action
   * @param CalendarEvent event
   */
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.editEvent(event);
  }

  /**
   * Methode setView
   * @param CalendarView view
   */
  setView(view: CalendarView) {
    this.view = view;
  }

  /**
   * Methode closeOpenMonthViewDay
   */
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  /**
   * Methode addEvent
   */
  addEvent(): void {
    this.eventSelected = new CalendarEventsEntity();
    this.eventSelected.typeEvent = AcmConstants.EVENT_TYPE_APPOINTEMENT;
    this.createForm();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.formUpdated = false;
    this.modal.open(this.modalContent, { size: 'md' });
  }

  /**
   * Methode editEvent to open edit event modal
   * @param CalendarEventsEntity event
   */

  editEvent(event) {
    const date = new Date(); // Replace this with your date object
    //const timeZone = 'UTC+2'; // Replace this with your desired time zone
    event.start = this.datePipe.transform(event.start, 'yyyy-MM-dd HH:mm:ss');
    event.end = this.datePipe.transform(event.end, 'yyyy-MM-dd HH:mm:ss');

    this.eventSelected = event.calendarEvent;
    const dateDebut = new Date(event.start).toISOString().substring(0, 10);
    const hourDebut = new Date(event.start).toISOString().substring(11, 16);
    const dateFin = new Date(event.end).toISOString().substring(0, 10);
    const hourFin = new Date(event.end).toISOString().substring(11, 16);
    const selectedParticipants: UserEntity[] = [];
    if (event.participant != null) {
      // init participants
      const participantsNumber = (event.participant.match(/,/g) || []).length + 1;
      const participantList: any[] = event.participant.split(',', participantsNumber);
      participantList.forEach(element => {
        this.participants.find(
          obj => {
            if (obj.login === element) {
              selectedParticipants.push(obj);
            }
          }
        );
      });
    }
    // init user owner of the task
    const user = this.userConnectedLogin !== this.eventSelected.username
      ? this.teamUsers.find(u => u.login === this.eventSelected.username) : this.sharedService.getUser();
    if (!this.teamOptionSelected) {
      this.createForm();
      // set form
      this.eventForm.controls.title.setValue(this.eventSelected.libelleEvent);
      this.eventForm.controls.hourDate.setValue(hourDebut);
      this.eventForm.controls.startDate.setValue(dateDebut);
      this.eventForm.controls.description.setValue(this.eventSelected.description);
      this.eventForm.controls.category.setValue(this.eventSelected.category);
      this.eventForm.controls.typeEvent.setValue(this.eventSelected.typeEvent);
      const c = new CustomerEntity();
      c.customerIdExtern = this.eventSelected.idCustomerExtern;
      c.customerNameNoPipe = this.eventSelected.customerName;
      this.eventForm.controls.customer.setValue(c);
      this.eventForm.controls.endDate.setValue(dateFin);
      this.eventForm.controls.hourEndDate.setValue(hourFin);
      this.eventForm.controls.location.setValue(this.eventSelected.place);
      this.eventForm.controls.user.setValue(user);
      this.eventForm.controls.participant.setValue(selectedParticipants);
      this.participantMethod();
      this.formUpdated = false;
      this.modal.open(this.modalContent, { size: 'md' });
    }
    else {
      this.eventSelected.dateDebut = dateDebut;
      this.eventSelected.startHour = hourDebut;
      this.eventSelected.dateFin = dateFin;
      this.eventSelected.endHour = hourFin;
      this.eventSelected.participantList = selectedParticipants;
      this.eventSelected.user = user;
      this.modal.open(this.modalContentConsult, { size: 'md' });
    }
  }

  /**
   * Methode create form
   */
  createForm() {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: [''],
      startDate: ['', Validators.required],
      hourDate: ['', Validators.required],
      endDate: ['', Validators.required],
      hourEndDate: ['', Validators.required],
      customer: [''],
      user: [''],
      location: [''],
      description: [''],
      participant: [''],
      typeEvent: [AcmConstants.EVENT_TYPE_TASK]
    },
    { validators: this.timeValidation() });
  }

  /**
   * submit event method
   */
  onSubmit() {
    if (this.eventForm.valid) {
      if (((this.eventForm.controls.startDate.value !== '') &&
        (this.eventForm.controls.endDate.value !== '') &&
        (this.eventForm.controls.startDate.value > this.eventForm.controls.endDate.value)) ||
        ((this.eventForm.controls.hourDate.value !== '') &&
          (this.eventForm.controls.hourEndDate.value !== '') &&
          (this.eventForm.controls.startDate.value == this.eventForm.controls.endDate.value) &&
          (this.eventForm.controls.hourDate.value > this.eventForm.controls.hourEndDate.value))) {
        this.devToolsServices.openToast(3, 'alert.error_date');
      } else {
        this.emptyUser = false;
        if (this.eventSelected.id !== null && this.eventSelected.id !== undefined) {
          this.update();
        } else {
          this.save().then(() => {
            if(this.emptyUser === false){
              this.devToolsServices.openToast(0, 'alert.success');
            }
          });
        }
      }
    }
  }

  /**
   * save event method
   */
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS');
  }
  async save() {
    this.eventSelected.typeEvent = this.eventForm.value.typeEvent;
    this.eventSelected.libelleEvent = this.eventForm.value.title;
    this.eventSelected.description = this.eventForm.value.description;
    if(this.teamOptionSelected && this.eventForm.controls.user.value === ''){
      this.emptyUser = true;
      return;
    }
    if (this.eventForm.value.user !== '') {
      this.eventSelected.username = this.eventForm.value.user.login;
      this.eventSelected.userFullName = this.eventForm.value.user.userFullName;
      this.eventSelected.userEmail=this.eventForm.value.user.email;
    }
    else {
      this.eventSelected.username = this.sharedService.getUser().login;
      this.eventSelected.userFullName = this.sharedService.getUser().fullName;
      this.eventSelected.userEmail = this.sharedService.getUser().email;
    }
    this.eventSelected.category = AcmConstants.PROSPECT_CATEGORY;
    if (this.eventForm.value.customer !== null) {
      this.eventSelected.idCustomerExtern = this.eventForm.value.customer.customerIdExtern;
      this.eventSelected.customerName = this.eventForm.value.customer.customerNameNoPipe;
      this.eventSelected.customerNumber = this.eventForm.value.customer.customerNumber;
    }
    if (this.eventForm.value.hourDate !== '') {
      this.eventSelected.dateDebut = this.formatDate(this.eventForm.value.startDate + 'T' + this.eventForm.value.hourDate);
    } else {
      this.eventSelected.dateDebut = this.formatDate(this.eventForm.value.startDate + 'T08:00');
        }
    if (this.eventForm.value.hourEndDate !== '') {
      this.eventSelected.dateFin = this.formatDate(this.eventForm.value.endDate + 'T' + this.eventForm.value.hourEndDate);

    } else {
      this.eventSelected.dateFin = this.formatDate(this.eventForm.value.endDate+'T18:00');
    }
    this.eventSelected.place = this.eventForm.value.location;
    if (this.eventForm.value.participant !== '') {
      this.eventSelected.participant = this.participantSelectedList.slice(0, -1);;
      this.eventSelected.fullNameParticipants=this.fullNameParticipants.substring(1);
    }
    await this.crmService.create(this.eventSelected).toPromise().then(resultEntity => {
      this.formUpdated = false;
      this.modal.dismissAll();
      let color;
      if (resultEntity.typeEvent === AcmConstants.EVENT_TYPE_TASK) {
        color = colors.green;
      } else {
        color = colors.rose;
      }
      const obj = {
        id: resultEntity.id,
        start: new Date(resultEntity.dateDebut),
        end: new Date(resultEntity.dateFin),
        title: resultEntity.libelleEvent,
        color,
        actions: this.actions,
        typeEvent: resultEntity.typeEvent,
        participant: resultEntity.participant,
        place: resultEntity.place,
        description: resultEntity.description,
        customer: resultEntity.customerName,
        username: resultEntity.username,
        statut: resultEntity.statut,
        idLoanExtern: resultEntity.idLoanExtern,
        idCollection: resultEntity.idCollection,
        category: resultEntity.category,
        calendarEvent: resultEntity
      };
      if (resultEntity.username === this.userConnectedLogin) {
        this.userEvents.push(obj);
      } else {
        this.teamEvents.push(obj)
      }
      this.refresh.next();
    });
  }

  /**
   * update event method
   */
  async update() {
    this.eventSelected.typeEvent = this.eventForm.value.typeEvent;
    this.eventSelected.libelleEvent = this.eventForm.value.title;
    this.eventSelected.description = this.eventForm.value.description;
    if (this.eventForm.value.customer !== null) {
      this.eventSelected.idCustomerExtern = this.eventForm.value.customer.customerIdExtern;
      this.eventSelected.customerName = this.eventForm.value.customer.customerNameNoPipe;
    }
    if (this.eventForm.value.hourDate !== '') {
      this.eventSelected.dateDebut = this.eventForm.value.startDate + 'T' + this.eventForm.value.hourDate + '.000+0000';
    } else {
      this.eventSelected.dateDebut = this.eventForm.value.startDate;
    }
    if (this.eventForm.value.hourEndDate !== '') {
      this.eventSelected.dateFin = this.eventForm.value.endDate + 'T' + this.eventForm.value.hourEndDate + '.000+0000';
    } else {
      this.eventSelected.dateFin = this.eventForm.value.endDate;
    }
    this.eventSelected.place = this.eventForm.value.location;
    if (this.eventForm.value.participant !== '') {
      this.eventSelected.participant = this.participantSelectedList.slice(0, -1);
    }
    await this.crmService.update(this.eventSelected).toPromise().then(resultEntity => {
      this.formUpdated = false;
      this.modal.dismissAll();
      const index1 = this.events.findIndex(event => event.id === resultEntity.id);
      let color;
      if (resultEntity.category === AcmConstants.COLLECTION) {
        color = colors.orange;
      } else {
        if (resultEntity.typeEvent === AcmConstants.EVENT_TYPE_TASK) {
          color = colors.green;
        } else {
          color = colors.blue;
        }
      }
      const obj = {
        id: resultEntity.id,
        start: new Date(resultEntity.dateDebut),
        end: new Date(resultEntity.dateFin),
        title: resultEntity.libelleEvent,
        color,
        actions: this.actions,
        typeEvent: resultEntity.typeEvent,
        participant: resultEntity.participant,
        place: resultEntity.place,
        description: resultEntity.description,
        customer: resultEntity.customerName,
        username: resultEntity.username,
        statut: resultEntity.statut,
        idLoanExtern: resultEntity.idLoanExtern,
        idCollection: resultEntity.idCollection,
        category: resultEntity.category,
        calendarEvent: resultEntity
      };
      this.events[index1] = obj;
      this.refresh.next();
    });
  }
  participantMethod() {
    this.fullNameParticipants= ''
    this.participantSelectedList = '';
    this.eventForm.controls.participant.value.forEach(data => {
      this.participantSelectedList = data.login + ',' + this.participantSelectedList;
      this.fullNameParticipants = this.fullNameParticipants +','+data.fullName

    });
    if (this.fullNameParticipants!==undefined&&this.fullNameParticipants!=='')
    this.fullNameParticipants=this.fullNameParticipants.substring(1);
  }
  /**
   *  get Customers method
   */
  getCustomers() {
    this.customerService.getCustomerByOwner().subscribe(
      (data) => {
        data.forEach(element => {
          element.customerNameNoPipe = this.sharedService.getCustomerName(element);
        });
        this.customers = data;
      });
  }

  /**
   * clearForm method
   */
  clearForm() {
    this.selectedTasks = [];
    this.eventForm.reset();
  }

  /**
   * filterCustomerSingle method
   */
  filterCustomerSingle(event) {
    this.filteredCustomerSingle = [];
    for (let i = 0; i < this.customers.length; i++) {
      const customer = this.customers[i];
      if (customer.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredCustomerSingle.push({ name: customer, code: i });
      }
    }
  }

  /**
   *  reset method
   */
  reset() {
    this.clearForm();
    this.modal.dismissAll();
  }

  /**
   * onItemSelect user method
   */
  onItemSelect(item: any) {
    this.userToInsert = this.userToInsert + item.item_id.concat(',');
  }

  /**
   * onItemDeSelect user method
   */
  onItemDeSelect(item: any) {
    try {
      this.userToInsert = this.userToInsert.replace(item.item_id + ',', '');
    } catch (error) {
      this.userToInsert = this.userToInsert.replace(item.item_id, '');
    }
  }

  /**
   * onSelectAll user method
   */
  onSelectAll(items: any) {
    const selectStr = JSON.stringify(items);
    JSON.parse(selectStr, (key, value) => {
      if (typeof value === 'string') {
        this.userToInsert = this.userToInsert + value.concat(',');
      }
    });
  }

  /**
   * onDeSelectAll user method
   */
  onDeSelectAll(items: any) {
    this.userToInsert = '';
  }

  /**
   * onDropDownClose method
   */
  onDropDownClose() {
    close();
  }

  /**
   * openDialog method
   * @param String id
   */
  openDialog(eventToDelete): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message: 'confirmation_dialog.delete_task'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crmService.delete(eventToDelete.id).subscribe(resultEntity => {
          this.events = this.events.filter(iEvent => iEvent !== eventToDelete);
          this.selectedTasks = [];
          this.selectedTasks.splice(this.selectedTasks.indexOf(eventToDelete.id), 1);
          this.devToolsServices.openToast(0, 'alert.success');
        }
        );
      }
    });
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Get current lang
   */
  getLang() {
    return this.translate.currentLang;
  }
  dateChanged() {
    if ((this.eventForm.controls.startDate.value !== '') &&
      (this.eventForm.controls.endDate.value !== '') &&
      (this.eventForm.controls.startDate.value > this.eventForm.controls.endDate.value)) {
      this.devToolsServices.openToast(3, 'alert.error_date');
    }
  }
  /**
   * open collection details
   */
  async collectionDetails() {
    // get loan by extern loan id
    await this.customer360Services.findLoanByIdExtern(this.eventSelected.idLoanExtern).pipe(
      map(data => {
        // set loan to sharedService
        this.sharedService.setLoan(data);
        return data;
      }),
      // get customer
      mergeMap(loan => {
        const customer = this.customerService.getCustomerInformation(loan.customerDTO.id)
        const acmCollection = new CollectionEntity();
        acmCollection.id = this.eventSelected.idCollection;
        const collection = this.collectionServices.getCollection(acmCollection);
        return forkJoin([customer, collection])
      })
    ).subscribe(result => {
      this.modal.dismissAll();
      this.sharedService.setCustomer(result[0]);
      // set the collection to sharedService
      this.sharedService.setCollection(result[1][0]);
      // redirection to the loan-collection-details route
      this.sharedService.rootingCollectionUrlByStatut('calendar');
    });
  }

  /**
   * clientDetails View Customer 360
   */
  async clientDetails() {
    if (this.formUpdated === true) {
      this.devToolsServices.openToast(3, 'alert.save_before_exit');
      return;
    }
    else if (this.eventSelected.idLoanExtern) {
       this.customer360Services.findLoanByIdExtern(this.eventSelected.idLoanExtern).subscribe((loan) => {
        this.sharedService.setCustomer(loan.customerDTO);
        this.modal.dismissAll();
        this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'calendar' } });
       });
    }
    else
    {
      const customerParam = new CustomerEntity();
      customerParam.customerIdExtern = this.eventSelected.idCustomerExtern;
      this.customerService.findCustomer(customerParam).subscribe((data) => {
        this.sharedService.setCustomer(data[0]);
        this.modal.dismissAll();
        this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'calendar' } });
      });

    }
  }
  /**
   * change checkbox : display connected user's events || display team's events
   * @param event any
   */
  optionChange(event) {
    if (event.value === '2') {
      // display team's event list
      // if the team's event list is not filled then get it from backend api
      if (this.teamEvents.length === 0) {
        this.calendarEventsEntity.allTeamsTasks = true;
        this.crmService.find(this.calendarEventsEntity).subscribe((data) => {
          let color;
          for (let i = 0; i < data.length; i++) {
            if (data[i].category === AcmConstants.COLLECTION_CATEGORY) {
              color = colors.orange;
            }
            else if (data[i].category === AcmConstants.LEGAL_CATEGORY) {
              color = colors.rose;
            }
            else {
              if (data[i].typeEvent === AcmConstants.EVENT_TYPE_TASK) {
                color = colors.green;
              } else {
                color = colors.blue;
              }
            }
            let cssClass = ''
            if (data[i].statut === AcmConstants.CLOSED) {
              cssClass = 'calendar-closed-task'
            }
            const teamUserFullName = this.teamUsers.find(user => user.login === data[i].username) !== undefined ?
              ' (' + this.teamUsers.find(user => user.login === data[i].username).fullName + ')' : '';
            const obj = {
              id: data[i].id,
              start: new Date(data[i].dateDebut),
              end: new Date(data[i].dateFin),
              title: data[i].libelleEvent + teamUserFullName,
              color,
              actions: this.actions,
              typeEvent: data[i].typeEvent,
              participant: data[i].participant,
              place: data[i].place,
              description: data[i].description,
              customer: data[i].customerName,
              meta: [{ username: data[i].username }],
              statut: data[i].statut,
              cssClass,
              idLoanExtern: data[i].idLoanExtern,
              idCollection: data[i].idCollection,
              category: data[i].category,
              calendarEvent: data[i]
            };
            this.teamEvents.push(obj);
          }
          this.refresh.next();
        })
      }
      // if the team's event list is already filled then display it
      this.events = this.teamEvents;
      this.teamOptionSelected = true;
    }
    else if (event.value === '1') {
      // display list of connected user's
      this.events = this.userEvents;
      // hide dropdown list
      this.teamOptionSelected = false;

    }
  }
  /**
   * team Member Changed
   * @param event any
   */
  teamMemberChanged(event) {
    // if no user selected then display all team's events
    if (event.value.length === 0) {
      this.events = this.teamEvents
    }
    else {
      // display only tasks of selected users (case of "My team's tasks" option)
      this.events = this.teamEvents.filter(e => event.value.find(param => param.login === e.meta[0].username));
    }

  }
  async loanDetails() {
    await this.customer360Services.findLoanByIdExtern(this.eventSelected.idLoanExtern).subscribe((loan) => {
      this.settingService.findProductById(loan.productId).subscribe(((product => {
        loan.productDTO = product;
        this.loanSharedService.openLoan(loan,'calendar');
        this.modal.dismissAll();
      })))

    })
  }
  async itemDetails() {
    if(this.eventSelected.category === this.genericCategory){
      await this.settingService.finItemById(this.eventSelected.idItem).subscribe((item) => {
        this.sharedService.setItem(item) ;
        this.modal.dismissAll();
        this.router.navigate([AcmConstants.GENERIC_WORKFLOW_SCREEN_URL]);
    })
    }
    else if (this.eventSelected.category === this.prospectionCategory){
      this.customer360Services.findLoanByIdExtern(this.eventSelected.idLoanExtern).toPromise().then(data=>{
        const collectionParam = new CollectionEntity();
        collectionParam.id = this.eventSelected.idCollection;
        this.collectionServices.getCollection(collectionParam).subscribe((res)=>{
          if (res[0].pendingCollectionInstance === undefined) {
            this.getPendingCollectionInstance(res[0]);
          }
          this.sharedService.setLoan(data);
          this.sharedService.setCollection(res[0]);
          this.modal.dismissAll();
          this.router.navigate(['acm/' + res[0].pendingCollectionInstance.ihmRoot ], { queryParams: { source: 'dashboard-collection' } });
        })

      })
    }

  }
  getPendingCollectionInstance(collection: CollectionEntity) {
    if (collection.collectionInstancesDtos.length > 0) {
      const date = new Date()
      if (String(collection.availableDate).indexOf('-') !== -1) {
        const year = String(collection.availableDate).substring(0, 4);
        const month = String(collection.availableDate).substring(5, 7);
        const day = String(collection.availableDate).substring(8, 10);
        collection.availableDate = new Date(year + '-' + month + '-' + (Number(day)));
      }
      if (date >= collection.availableDate) {
        collection.pendingCollectionInstance = collection.collectionInstancesDtos.find(
          step => step.idAcmCollectionStep === collection.idAcmCollectionStep
        );
      }
      else {
        collection.collectionInstancesDtos.sort((a, b) => a.idAcmCollectionStep - b.idAcmCollectionStep);
        if (collection.collectionInstancesDtos[0].idAcmCollectionStep === collection.idAcmCollectionStep) {
          collection.pendingCollectionInstance = collection.collectionInstancesDtos[0];
        } else {
          const waitingProcess: CollectionProcessEntity = collection.collectionInstancesDtos.find(
            step => step.idAcmCollectionStep === collection.idAcmCollectionStep
          );
          collection.pendingCollectionInstance = collection.collectionInstancesDtos.find(
            step => step.orderEtapeProcess === waitingProcess.orderEtapeProcess - 1
          );
        }
      }
      // set actual step libelle (to be used in complete action => save collection note)
      // collection.actualStepLibelle = collection.pendingCollectionInstance.libelle;
    }
    return collection;
  }
  async getCollaborators() {
    if (this.collaborators === null || this.collaborators === undefined) {
      const userParam = new UserEntity();
      userParam.responsableId = this.sharedService.getUser().responsableId;
      await this.settingsService.getUsers(userParam).toPromise().then(
        (data) => {
          this.collaborators = data;
        }
      );
    }
  }
  /**
   * filter customer name
   * @param event any
   */
  filterCustomerName(event) {
    // init pagination params
    this.customerPaginationEntity.pageSize = 25;
    this.customerPaginationEntity.pageNumber = 0;
    this.customerPaginationEntity.params = new CustomerEntity();
    this.customerPaginationEntity.params.customerName = event.query;
    this.customerListService.getCustomersPagination(this.customerPaginationEntity).subscribe(
      (data) => {
        this.customerPaginationEntity = data;
        this.customerPaginationEntity.resultsCustomers.forEach((element) => {
          element.customerNameNoPipe = this.sharedService.getCustomerName(element);
        });
      }
    );
  }
  /**
   * compare category
   * @param category1 string
   * @param category2 string
   * @returns boolean
   */
  compareCategory(category1: string, category2: string) {
    return category1 === category2
  }
  changeForm() {
    this.formUpdated = true;
  }
  claimDetails(){
    const claimsPaginationEntity : ClaimsPaginationEntity = new ClaimsPaginationEntity();
    claimsPaginationEntity.id = this.eventSelected.idClaim;
    claimsPaginationEntity.pageSize = 1;
    claimsPaginationEntity.pageNumber = 0;
    const claimsParams = new ClaimsListEntity();
    const claim = new ClaimsEntity();
    claim.id = this.eventSelected.idClaim ;
    claimsParams.claim = claim;
    claimsPaginationEntity.params = claimsParams;
    this.loanManagementService.findClaimsPagination(claimsPaginationEntity).subscribe((data)=>{
      this.sharedService.setClaim(data.resultsClaims[0]);
    if (data.resultsClaims[0].claim.idCustomer) {
       this.customerManagementService.getCustomerInformationForClaims(data.resultsClaims[0].claim.idCustomer).subscribe(custmer => {
        // set customer in sharedService
        this.sharedService.setCustomer(custmer);
        this.sharedService.setProspect(null);
        this.router.navigate([AcmConstants.DETAIL_CLAIM]);
      });
    }
    else {
      const prospectInfo = new ProspectEntity();
      prospectInfo.name = data.resultsClaims[0].claim.name;
      prospectInfo.email = data.resultsClaims[0].claim.email;
      prospectInfo.phone = data.resultsClaims[0].claim.phone;
      this.sharedService.setProspect(prospectInfo)
      this.router.navigate([AcmConstants.DETAIL_CLAIM]);
    } 
    this.reset();
    });

    

  }

   timeValidation(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const startDate = formGroup.get('startDate')?.value;
      const hourDate = formGroup.get('hourDate')?.value;
      const endDate = formGroup.get('endDate')?.value;
      const hourEndDate = formGroup.get('hourEndDate')?.value;
  
      const now = new Date();
      const todayString = now.toISOString().split('T')[0];
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
      if (startDate === todayString && hourDate && hourDate < currentTime) {
        return { invalidStartTime: true }; 
      }
  
      if (startDate && hourDate && endDate && hourEndDate) {
        const start = new Date(`${startDate}T${hourDate}`);
        const end = new Date(`${endDate}T${hourEndDate}`);
  
        if (end <= start) {
          return { invalidTimeRange: true }; 
        }
      }
  
      return null; 
    };
  }
}
