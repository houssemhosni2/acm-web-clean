import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { SettingsService } from '../../Settings/settings.service';
import { CrmService } from '../crm.service';
import { LazyLoadEvent } from 'primeng/api';
import { CalendarEventsEntity } from 'src/app/shared/Entities/calendarEvents.entity';
import { CalendarEventsPaginationEntity } from 'src/app/shared/Entities/calendarEventsPagination.entity';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AppComponent } from 'src/app/app.component';
import { CustomerPaginationEntity } from 'src/app/shared/Entities/customer.pagination.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerListService } from '../../Customer/customer-list/customer-list.service';
import { map, mergeMap } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionServices } from '../../Collection/collection.services';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';
import { Router } from '@angular/router';
import { Customer360Services } from '../../Customer/customer360/customer360.services';
import { VisitReportServices } from '../../Loan-Application/field-visit/filed-visit-details/visit-report.services';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.sass']
})
export class TaskListComponent implements OnInit {
  public cols: any[];
  public selectedColumns: any[];

  public selectedTasks: Array<any> = [];
  public participants: UserEntity[] = [];

  public eventsEntity: CalendarEventsEntity = new CalendarEventsEntity();

  public teamOptionSelected = false; // False: display user events | True: display user's team events

  public eventsPaginationEntity: CalendarEventsPaginationEntity = new CalendarEventsPaginationEntity();
  public refresh: Subject<any> = new Subject();

  public page: number;
  public pageSize: number;
  public users: Array<any> = [];

  public teamUsers: UserEntity[] = [];
  public userConnectedLogin: string;
  public userNames: string;
  //Modal
  public eventForm: FormGroup;
  public minDate: string;
  public formUpdated = false;
  public emptyUser = false;
  public participantSelectedList = '';
  public fullNameParticipants: string;
  public collectionCategory = AcmConstants.COLLECTION_CATEGORY;
  public legalCategory = AcmConstants.LEGAL_CATEGORY;
  public loanCategory = AcmConstants.LOAN_CATEGORY;
  public taskType = AcmConstants.EVENT_TYPE_TASK;
  public appointmentType = AcmConstants.EVENT_TYPE_APPOINTEMENT;
  public workflowCategory = AcmConstants.GENERIC_WF_CATEGORY;
  public genericWorkflowCategory= AcmConstants.GENERIC_CATEGORY;



  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  public customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();

  public configParticipants = {
    displayKey: 'fullName',
    search: true,
    placeholder: ' ',
    searchOnKey: 'fullName'
  }
  public configTeams = {
    search: true,
    displayKey: 'loginAndName',
    searchOnKey: 'login',
    placeholder: ' '
  };


  constructor(public settingsService: SettingsService, public formBuilder: FormBuilder, public modal: NgbModal,
    public crmService: CrmService, public library: FaIconLibrary, public translate: TranslateService, public datePipe: DatePipe,
    public devToolsServices: AcmDevToolsServices, public customerListService: CustomerListService,
    public sharedService: SharedService, public customerService: CustomerServices, public router: Router, public customer360Services: Customer360Services,
    public visitReportServices: VisitReportServices, public collectionServices: CollectionServices) { }

  async ngOnInit() {
    this.cols = [
      { field: 'customerName', header: 'task.customer' },
      { field: 'category', header: 'task.category' },
      { field: 'libelleEvent', header: 'task.title' },
      { field: 'userFullName', header: 'task.user_full_name' },
      { field: 'dateDebut', header: 'task.start_date' },
      { field: 'dateFin', header: 'task.end_date' },
      { field: 'statut', header: 'task.status' },
    ];

    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;

    // get team of connected user
    const userParam = new UserEntity();
    userParam.responsableId = this.sharedService.getUser().login;
    this.settingsService.getUsers(userParam).toPromise().then(
      (data) => {
        this.teamUsers = data;
      }
    );
    this.userConnectedLogin = this.sharedService.getUser().login;
    this.eventsPaginationEntity.params = new CalendarEventsEntity();
    // set default option : User's Tasks displayed
    this.eventsPaginationEntity.params.allTeamsTasks = false;
    // get only evants of connected user
    this.eventsPaginationEntity.params.username = this.userConnectedLogin;
    this.getEvents();
    this.getParticipants();
  }
  async getEvents() {
    this.crmService.findPagination(this.eventsPaginationEntity).subscribe(
      (data) => {
        this.eventsPaginationEntity = data;
      }
    );
  }

  async reloadEventsList(event: LazyLoadEvent) {
    const calendarEventsPaginationEntity: CalendarEventsPaginationEntity = new CalendarEventsPaginationEntity();
    calendarEventsPaginationEntity.pageSize = event.rows;
    if (event.first === 0) {
      calendarEventsPaginationEntity.pageNumber = event.first;
    } else {
      calendarEventsPaginationEntity.pageNumber = event.first / event.rows;
    }
    const eventParams = new CalendarEventsEntity();
    if (event.filters !== undefined) {
      eventParams.dateDebut = event.filters.dateDebut !== undefined ? event.filters.dateDebut.value : null;
      eventParams.dateFin = event.filters.dateFin !== undefined ? event.filters.dateFin.value : null;
      eventParams.customerName = event.filters.customerName !== undefined ? event.filters.customerName.value : null;
      eventParams.category = event.filters.category !== undefined ? event.filters.category.value : null;
      eventParams.libelleEvent = event.filters.libelleEvent !== undefined ? event.filters.libelleEvent.value : null;
      eventParams.userFullName = event.filters.userFullName !== undefined ? event.filters.userFullName.value : null;
      eventParams.statut = event.filters.statut !== undefined ? event.filters.statut.value : null;
    }
    this.teamOptionSelected ? eventParams.allTeamsTasks = true : eventParams.allTeamsTasks = false
    if (this.teamOptionSelected && this.userNames) {
      eventParams.username = this.userNames;
      eventParams.teamFilter = true;
    } else {
      eventParams.username = this.userConnectedLogin;
    }

    calendarEventsPaginationEntity.params = eventParams;
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      calendarEventsPaginationEntity.sortField = event.multiSortMeta[0].field;
      calendarEventsPaginationEntity.sortDirection = event.multiSortMeta[0].order;
    }
    this.crmService.findPagination(calendarEventsPaginationEntity).subscribe(
      (data) => {
        this.eventsPaginationEntity = data;
      }
    );

  }

  teamMemberChanged(event) {
    const calendarEventsPaginationEntity: CalendarEventsPaginationEntity = new CalendarEventsPaginationEntity();
    const eventParams = new CalendarEventsEntity();
    eventParams.username = this.userNames = event.value.map(user => user.login).join(',');
    this.userNames ? eventParams.teamFilter = true : null;
    eventParams.allTeamsTasks = true;
    calendarEventsPaginationEntity.params = eventParams;
    this.crmService.findPagination(calendarEventsPaginationEntity).subscribe(
      (data) => {
        this.eventsPaginationEntity = data;
      }
    );
  }
  optionChange(event) {
    const calendarEventsPaginationEntity: CalendarEventsPaginationEntity = new CalendarEventsPaginationEntity();
    const eventParams = new CalendarEventsEntity();
    if (event.value === '2') {
      this.teamOptionSelected = true;
      eventParams.allTeamsTasks = true;
    }
    if (event.value === '1') {
      this.userNames=null;
      this.teamOptionSelected = false
      eventParams.allTeamsTasks = false;
      eventParams.username = this.userConnectedLogin;
    }
    this.resetFilters();
    calendarEventsPaginationEntity.params = eventParams;
    this.crmService.findPagination(calendarEventsPaginationEntity).subscribe((data) => {
      this.eventsPaginationEntity = data;
    });
  }

  resetFilters() {
    document.querySelectorAll('.form-control').forEach((input: HTMLInputElement) => {
      if (input.type === 'text' || input.type === 'date') {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    document.querySelectorAll('.form-control').forEach((select: HTMLSelectElement) => {
      if (select.tagName === 'SELECT') {
        select.selectedIndex = 0;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }
  /**
   * Methode addEvent
   */
  addEvent(): void {
    this.eventsEntity = new CalendarEventsEntity();
    this.eventsEntity.typeEvent = AcmConstants.EVENT_TYPE_APPOINTEMENT;
    this.createForm();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    this.formUpdated = false;
    this.modal.open(this.modalContent, { size: 'md' });
  }
  /**
 * Methode editEvent
 */
  updateEvent(eventsEntity: CalendarEventsEntity) {
    this.eventsEntity = eventsEntity;
    const dateDebut = new Date(eventsEntity.dateDebut).toISOString().substring(0, 10);
    const hourDebut = new Date(eventsEntity.dateDebut).toISOString().substring(11, 16);
    const dateFin = new Date(eventsEntity.dateFin).toISOString().substring(0, 10);
    const hourFin = new Date(eventsEntity.dateFin).toISOString().substring(11, 16);
    const selectedParticipants: UserEntity[] = [];
    if (eventsEntity.participant != null) {
      // init participants
      const participantsNumber = (eventsEntity.participant.match(/,/g) || []).length + 1;
      const participantList: any[] = eventsEntity.participant.split(',', participantsNumber);
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
    const user = this.userConnectedLogin !== this.eventsEntity.username
      ? this.teamUsers.find(u => u.login === this.eventsEntity.username) : this.sharedService.getUser();

    this.createForm();
    // set form
    this.eventForm.controls.title.setValue(this.eventsEntity.libelleEvent);
    this.eventForm.controls.hourDate.setValue(hourDebut);
    this.eventForm.controls.startDate.setValue(dateDebut);
    this.eventForm.controls.description.setValue(this.eventsEntity.description);
    this.eventForm.controls.category.setValue(this.eventsEntity.category);
    this.eventForm.controls.typeEvent.setValue(this.eventsEntity.typeEvent);
    const c = new CustomerEntity();
    c.customerIdExtern = this.eventsEntity.idCustomerExtern;
    c.customerNameNoPipe = this.eventsEntity.customerName;
    this.eventForm.controls.customer.setValue(c);
    this.eventForm.controls.endDate.setValue(dateFin);
    this.eventForm.controls.hourEndDate.setValue(hourFin);
    this.eventForm.controls.location.setValue(this.eventsEntity.place);
    this.eventForm.controls.user.setValue(user);
    this.eventForm.controls.participant.setValue(selectedParticipants);
    this.participantMethod();
    this.formUpdated = false;
    this.modal.open(this.modalContent);
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
    });
  }

  changeForm() {
    this.formUpdated = true;
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

  hourChanged() {
    if ((this.eventForm.controls.hourDate.value !== '') &&
      (this.eventForm.controls.hourEndDate.value !== '') &&
      (this.eventForm.controls.startDate.value == this.eventForm.controls.endDate.value) &&
      (this.eventForm.controls.hourDate.value > this.eventForm.controls.hourEndDate.value)) {
      this.devToolsServices.openToast(3, 'alert.error_date');
    }
  }
  /**
  * Get Direction
  */
  getDirection() {
    return AppComponent.direction;
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
  *  reset method
  */
  reset() {
    this.clearForm();
    this.modal.dismissAll();
  }
  /**
  * clearForm method
  */
  clearForm() {
    this.selectedTasks = [];
    this.eventForm.reset();
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'UTC');
  }
  /**
 * save event method
 */
  async save() {
    this.eventsEntity.typeEvent = this.eventForm.value.typeEvent;
    this.eventsEntity.libelleEvent = this.eventForm.value.title;
    this.eventsEntity.description = this.eventForm.value.description;
    if (this.teamOptionSelected && this.eventForm.controls.user.value === '') {
      this.emptyUser = true;
      return;
    }
    if (this.eventForm.value.user !== '') {
      this.eventsEntity.username = this.eventForm.value.user.login;
      this.eventsEntity.userFullName = this.eventForm.value.user.fullName;
      this.eventsEntity.userEmail = this.eventForm.value.user.email;
    }
    else {
      this.eventsEntity.username = this.sharedService.getUser().login;
      this.eventsEntity.userFullName = this.sharedService.getUser().fullName;
      this.eventsEntity.userEmail = this.sharedService.getUser().email;
    }
    this.eventsEntity.category = AcmConstants.PROSPECT_CATEGORY;
    if (this.eventForm.value.customer !== null) {
      this.eventsEntity.idCustomerExtern = this.eventForm.value.customer.customerIdExtern;
      this.eventsEntity.customerName = this.eventForm.value.customer.customerNameNoPipe;
      this.eventsEntity.customerNumber = this.eventForm.value.customer.customerNumber;
    }
    if (this.eventForm.value.hourDate !== '') {
      this.eventsEntity.dateDebut = this.formatDate(this.eventForm.value.startDate + 'T' + this.eventForm.value.hourDate);
    }
    if (this.eventForm.value.hourEndDate !== '') {
      this.eventsEntity.dateFin = this.formatDate(this.eventForm.value.endDate + 'T' + this.eventForm.value.hourEndDate);
    }
    this.eventsEntity.place = this.eventForm.value.location;
    if (this.eventForm.value.participant !== '') {
      this.eventsEntity.participant = this.participantSelectedList.slice(0, -1);;
      this.eventsEntity.fullNameParticipants = this.fullNameParticipants.substring(1);
    }
    await this.crmService.create(this.eventsEntity).toPromise().then(() => {
      this.formUpdated = false;
      this.modal.dismissAll();
      this.getEvents();
    });
  }

  /**
 * update event method
 */
  async update() {
    this.eventsEntity.typeEvent = this.eventForm.value.typeEvent;
    this.eventsEntity.libelleEvent = this.eventForm.value.title;
    this.eventsEntity.description = this.eventForm.value.description;
    if (this.eventForm.value.customer !== null) {
      this.eventsEntity.idCustomerExtern = this.eventForm.value.customer.customerIdExtern;
      this.eventsEntity.customerName = this.eventForm.value.customer.customerNameNoPipe;
    }
    if (this.eventForm.value.hourDate !== '') {
      this.eventsEntity.dateDebut = this.eventForm.value.startDate + 'T' + this.eventForm.value.hourDate + '.000+0000';
    } else {
      this.eventsEntity.dateDebut = this.eventForm.value.startDate;
    }
    if (this.eventForm.value.hourEndDate !== '') {
      this.eventsEntity.dateFin = this.eventForm.value.endDate + 'T' + this.eventForm.value.hourEndDate + '.000+0000';
    } else {
      this.eventsEntity.dateFin = this.eventForm.value.endDate;
    }
    this.eventsEntity.place = this.eventForm.value.location;
    if (this.eventForm.value.participant !== '') {
      this.eventsEntity.participant = this.participantSelectedList.slice(0, -1);
    }
    if (this.eventForm.value.user !== '' && this.teamOptionSelected) {
      this.eventsEntity.username = this.eventForm.value.user.login;
      this.eventsEntity.userFullName = this.eventForm.value.user.fullName;
      this.eventsEntity.userEmail = this.eventForm.value.user.email;
    }
    await this.crmService.update(this.eventsEntity).toPromise().then(() => {
      this.formUpdated = false;
      this.modal.dismissAll();
      this.getEvents();
    });
  }
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
        if (this.eventsEntity.id !== null && this.eventsEntity.id !== undefined) {
          this.update();
        } else {
          this.save().then(() => {
            if (this.emptyUser === false) {
              this.devToolsServices.openToast(0, 'alert.success');
            }
          });
        }
      }
    }
  }
  /**
   * open collection details
   */
  async collectionDetails() {
    // get loan by extern loan id
    await this.customer360Services.findLoanByIdExtern(this.eventsEntity.idLoanExtern).pipe(
      map(data => {
        // set loan to sharedService
        this.sharedService.setLoan(data);
        return data;
      }),
      // get customer
      mergeMap(loan => {
        const customer = this.customerService.getCustomerInformation(loan.customerDTO.id)
        const acmCollection = new CollectionEntity();
        acmCollection.id = this.eventsEntity.idCollection;
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

  async loanDetails() {
    await this.customer360Services.findLoanByIdExtern(this.eventsEntity.idLoanExtern).subscribe((loan) => {
      this.settingsService.findProductById(loan.productId).subscribe(((product => {
        loan.productDTO = product;
        this.sharedService.openLoan(loan, 'calendar');
        this.modal.dismissAll();
      })))

    })
  }
  /**
 * clientDetails View Customer 360
 */
  async clientDetails() {
    if (this.formUpdated === true) {
      this.devToolsServices.openToast(3, 'alert.save_before_exit');
      return;
    }
    else if (this.eventsEntity.idLoanExtern) {
      this.customer360Services.findLoanByIdExtern(this.eventsEntity.idLoanExtern).subscribe((loan) => {
        this.sharedService.setCustomer(loan.customerDTO);
        this.modal.dismissAll();
        this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'calendar' } });
      });
    }
    else {
      const customerParam = new CustomerEntity();
      customerParam.customerIdExtern = this.eventsEntity.idCustomerExtern;
      this.customerService.findCustomer(customerParam).subscribe((data) => {
        this.sharedService.setCustomer(data[0]);
        this.modal.dismissAll();
        this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'calendar' } });
      });

    }
  }
  getParticipants() {
    this.visitReportServices.getUsersVisit().subscribe(
      (data) => {
        this.participants = data;
        for (let i = 0; i < data.length; i++) {
          this.users.push({ item_id: data[i].login, item_text: data[i].simpleName });
        }
        this.sharedService.setUsers(this.users);
      });
  }

  async itemDetails() {


    await this.settingsService.finItemById(this.eventsEntity.idItem).subscribe((item) => {
      this.sharedService.setItem(item);
      this.modal.dismissAll();
      this.router.navigate([AcmConstants.GENERIC_WORKFLOW_SCREEN_URL]);



    })
  }
}
