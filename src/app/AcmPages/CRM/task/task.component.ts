import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEventsEntity } from '../../../shared/Entities/calendarEvents.entity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';
import { SharedService } from 'src/app/shared/shared.service';
import { VisitReportServices } from '../../Loan-Application/field-visit/filed-visit-details/visit-report.services';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { CrmService } from '../crm.service';
import { AcmConstants } from '../../../shared/acm-constants';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { AppComponent } from '../../../app.component';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CustomerPaginationEntity } from 'src/app/shared/Entities/customer.pagination.entity';
import { CustomerListService } from '../../Customer/customer-list/customer-list.service';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { Customer360Services } from '../../Customer/customer360/customer360.services';
import { map, mergeMap } from 'rxjs/operators';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionServices } from '../../Collection/collection.services';
import { forkJoin } from 'rxjs';
import { SettingsService } from '../../Settings/settings.service';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.sass']
})

export class TaskComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: PrimaryBleu };
  public loading = true;
  public tasks: CalendarEventsEntity[] = [];
  public data: CalendarEventsEntity[];
  public calendarEventsEntity = new CalendarEventsEntity();
  public calendarEventsEntityToReload: CalendarEventsEntity = new CalendarEventsEntity();
  public eventForm: FormGroup;
  selectedTasks: Array<any> = [];
  users: Array<any> = [];
  public selectCustomer: Array<any> = [];
  public block = true;
  public iconButton = true;
  visibleIndices = new Set<number>();
  public minDate: string;
  public task_category = AcmConstants.EVENT_TYPE_TASK;
  public loan_category = AcmConstants.LOAN_CATEGORY;
  public legal_category = AcmConstants.LEGAL_CATEGORY;
  public collection_category = AcmConstants.COLLECTION_CATEGORY;
  public prospect_category = AcmConstants.PROSPECT_CATEGORY;
  public claim_category = AcmConstants.CLAIM;
  public customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();
  public configParticipants = {
    displayKey: 'fullName',
    search: true,
    placeholder: ' ',
    searchOnKey: 'fullName'
  }
  public participants: UserEntity[] = [];
  public participantSelectedList = '';
  public collectionCategory = AcmConstants.COLLECTION_CATEGORY;
  public legalCategory = AcmConstants.LEGAL_CATEGORY;
  public loanCategory = AcmConstants.LOAN_CATEGORY;
  public genericWorkflowCategory= AcmConstants.GENERIC_CATEGORY;

  public formUpdated = false;
  public fullNameParticipants : string ;

  /**
   * constructor
   * @param modal NgbModal
   * @param router Router
   * @param dialog MatDialog
   * @param crmService CrmService
   * @param loanSharedService LoanSharedService
   * @param visitReportServices VisitReportServices
   * @param formBuilder FormBuilder
   * @param customerService CustomerServices
   * @param datePipe DatePipe
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService
   * @param sharedService SharedService
   * @param library FaIconLibrary
   */
  constructor(public modal: NgbModal, public router: Router, public dialog: MatDialog, public settingService: SettingsService,
    public crmService: CrmService, public loanSharedService: SharedService, public collectionServices: CollectionServices,
    public visitReportServices: VisitReportServices, public formBuilder: FormBuilder,
    public customerService: CustomerServices, public datePipe: DatePipe, public customer360Services: Customer360Services,
    public devToolsServices: AcmDevToolsServices, public translate: TranslateService, public customerListService: CustomerListService,
    public sharedService: SharedService, public library: FaIconLibrary) {
  }
  customers: Array<any> = [];
  filteredCustomerSingle: any[] = [];

  ngOnInit() {
    this.calendarEventsEntity.sortedByDate = true;
    this.calendarEventsEntity.username = this.sharedService.getUser().login;
    this.crmService.find(this.calendarEventsEntity).subscribe(
      (data) => {
        this.tasks = data;
        this.loading = false;
      }
    );
    this.visitReportServices.getUsersVisit().subscribe(
      (data) => {
        this.participants = data;
        for (let i = 0; i < data.length; i++) {
          this.users.push({ item_id: data[i].login, item_text: data[i].simpleName });
        }
        this.loanSharedService.setUsers(this.users);
      }
    );

  }

  /**
   * Methode addEvent
   */
  addEvent(): void {
    this.calendarEventsEntity = new CalendarEventsEntity();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = this.datePipe.transform(today.setDate(today.getDate()), 'yyyy-MM-dd');
    if (this.eventForm !== undefined) {
      this.clearForm();
    }
    this.createForm();
    this.formUpdated = false;
    this.modal.open(this.modalContent, { size: 'md' });
  }

  /**
   * Methode editEvent
   * @param CalendarEventsEntity task
   */
  editEvent(task: CalendarEventsEntity) {
    this.createForm();
    this.formUpdated = false;
    this.calendarEventsEntity = task;
    this.eventForm.controls.startDate.setValue(task.dateDebut.substring(0, 10));
    this.eventForm.controls.hourDate.setValue(task.dateDebut.substring(11, 16));
    this.eventForm.controls.endDate.setValue(task.dateFin.substring(0, 10));
    this.eventForm.controls.hourEndDate.setValue(task.dateFin.substring(11, 16));
    this.eventForm.controls.title.setValue(task.libelleEvent);
    this.eventForm.controls.description.setValue(task.description);
    this.eventForm.controls.location.setValue(task.place);
    this.eventForm.controls.startDate.setValue(task.dateDebut.substring(0, 10));
    this.eventForm.controls.hourDate.setValue(task.dateDebut.substring(11, 16));
    this.eventForm.controls.title.setValue(task.libelleEvent);
    this.eventForm.controls.description.setValue(task.description);
    // set selected participants
    const selectedParticipants: UserEntity[] = [];
    if (task.participant != null) {
      // init participants
      const participantsNumber = (task.participant.match(/,/g) || []).length + 1;
      const participantList: any[] = task.participant.split(',', participantsNumber);
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
    this.eventForm.controls.participant.setValue(selectedParticipants);
    this.participantMethod();
    // set selected customer
    const c = new CustomerEntity();
    c.customerIdExtern = task.idCustomerExtern;
    c.customerNameNoPipe = task.customerName;
    this.eventForm.controls.customer.setValue(c);
    // open edit pop up
    this.modal.open(this.modalContent, { size: 'md' });
  }

  /**
   * Methode to create form
   */
  createForm() {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      hourDate: [''],
      endDate: ['', Validators.required],
      hourEndDate: [''],
      customer: [''],
      location: [''],
      description: [''],
      participant: ['']
    });
  }

  /**
   * Methode to doneTask
   */
  async doneTask() {
    for (let i = 0; i < this.selectedTasks.length; i++) {
      this.calendarEventsEntity = this.selectedTasks[i];
      this.calendarEventsEntity.statut = AcmConstants.CLOSED;
      await this.crmService.update(this.calendarEventsEntity).toPromise().then(resultEntity => {
        this.reloadTable();
      });
    }
  }

  /**
   * Methode to cancelTask
   */
  async cancelTask() {
    for (let i = 0; i < this.selectedTasks.length; i++) {
      this.calendarEventsEntity.id = this.selectedTasks[i].id;
      this.calendarEventsEntity.statut = AcmConstants.TASK_STATUS_CANCELED;
      await this.crmService.update(this.calendarEventsEntity).toPromise().then(resultEntity => {
        this.reloadTable();
      });
    }
  }

  /**
   * Methode to onSubmit save or update event after validation
   */
  onSubmit() {
    if (this.eventForm.valid) {
      if ((this.eventForm.controls.startDate.value !== '') &&
        (this.eventForm.controls.endDate.value !== '') &&
        (this.eventForm.controls.startDate.value > this.eventForm.controls.endDate.value)) {
        this.devToolsServices.openToast(3, 'alert.error_date');
      } else {
        if (this.calendarEventsEntity.id !== undefined) {
          this.update();
        } else {
          this.save().then(() => {
            this.devToolsServices.openToast(0, 'alert.success');
          });
        }
      }
    }
  }

  /**
   * Methode to save
   */
  async save() {
    this.calendarEventsEntity.libelleEvent = this.eventForm.value.title;
    this.calendarEventsEntity.description = this.eventForm.value.description;
    this.calendarEventsEntity.username = this.sharedService.getUser().login;
    this.calendarEventsEntity.userFullName = this.sharedService.getUser().fullName;
    this.calendarEventsEntity.category = AcmConstants.PROSPECT_CATEGORY;
    if (this.eventForm.value.customer !== null) {
      this.calendarEventsEntity.idCustomerExtern = this.eventForm.value.customer.customerIdExtern;
      this.calendarEventsEntity.customerName = this.eventForm.value.customer.customerNameNoPipe;
    }
    if (this.eventForm.value.hourDate !== '') {
      this.calendarEventsEntity.dateDebut = this.eventForm.value.startDate + 'T' + this.eventForm.value.hourDate;
    } else {
      this.calendarEventsEntity.dateDebut = this.eventForm.value.startDate;
    }
    if (this.eventForm.value.hourEndDate !== '') {
      this.calendarEventsEntity.dateFin = this.eventForm.value.endDate + 'T' + this.eventForm.value.hourEndDate + '.000+0000';
    } else {
      this.calendarEventsEntity.dateFin = this.eventForm.value.endDate;
    }
    if (this.eventForm.value.participant !== '') {
      this.calendarEventsEntity.participant = this.participantSelectedList.slice(0, -1);
      this.calendarEventsEntity.fullNameParticipants= this.fullNameParticipants;
    }
    this.calendarEventsEntity.typeEvent = AcmConstants.EVENT_TYPE_TASK;
    this.calendarEventsEntity.enabled = true;
    this.calendarEventsEntity.userEmail=this.sharedService.getUser().email ;
    this.calendarEventsEntity.customerNumber= this.eventForm.value.customer.customerNumber;
    await this.crmService.create(this.calendarEventsEntity).toPromise().then(resultEntity => {
      this.formUpdated = false;
      this.reloadTable();
      this.clearForm();
      this.visibleIndices.clear();
      this.modal.dismissAll();
    });

  }

  /**
   * Methode to update
   */
  async update() {
    this.calendarEventsEntity.libelleEvent = this.eventForm.value.title;
    this.calendarEventsEntity.description = this.eventForm.value.description;
    if (this.eventForm.value.customer !== null) {
      this.calendarEventsEntity.idCustomerExtern = this.eventForm.value.customer.customerIdExtern;
      this.calendarEventsEntity.customerName = this.eventForm.value.customer.customerNameNoPipe;
    }
    if (this.eventForm.value.hourDate !== '' && this.eventForm.value.hourDate !== null) {
      this.calendarEventsEntity.dateDebut = this.eventForm.value.startDate + 'T' + this.eventForm.value.hourDate + '.000+0000';
    } else {
      this.calendarEventsEntity.dateDebut = this.eventForm.value.startDate;
    }
    if (this.eventForm.value.hourEndDate !== '' && this.eventForm.value.hourEndDate !== null) {
      this.calendarEventsEntity.dateFin = this.eventForm.value.endDate + 'T' + this.eventForm.value.hourEndDate + '.000+0000';
    } else {
      this.calendarEventsEntity.dateFin = this.eventForm.value.endDate;
    }
    this.calendarEventsEntity.place = this.eventForm.value.location;
    if (this.eventForm.value.participant !== '') {
      this.calendarEventsEntity.participant = this.participantSelectedList.slice(0, -1);;
    }
    await this.crmService.update(this.calendarEventsEntity).toPromise().then(resultEntity => {
      this.formUpdated = false;
      this.reloadTable();
      this.modal.dismissAll();
      this.clearForm();
      this.visibleIndices.clear();
    });
  }
  participantMethod() {
    this.participantSelectedList = '';
    this.fullNameParticipants= ''
    this.eventForm.controls.participant.value.forEach(data => {
      this.participantSelectedList = data.login + ',' + this.participantSelectedList;
      this.fullNameParticipants = this.fullNameParticipants +','+data.fullName

    });
    if (this.fullNameParticipants!==undefined&&this.fullNameParticipants!=='')
    this.fullNameParticipants=this.fullNameParticipants.substring(1);

  }
  /**
   * Methode clearForm
   */
  clearForm() {
    this.selectedTasks = [];
    this.eventForm.reset();
  }

  /**
   * Methode to filterCustomerSingle
   */
  filterCustomerSingle(event) {
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
   * Methode onChange
   * @param CalendarEventsEntity task
   * @param Number i
   */
  onChange(task, i) {
    if (this.selectedTasks.indexOf(task) === -1) {
      this.selectedTasks.push(task);
    } else {
      this.selectedTasks.splice(this.selectedTasks.indexOf(task), 1);
    }
    if (this.selectedTasks.length > 0) {
      this.block = false;
    } else {
      this.block = true;
    }
    if (!this.visibleIndices.delete(i)) {
      this.visibleIndices.add(i);
    }
    if (this.selectedTasks.length > 1 || this.selectedTasks.length === 0) {
      this.iconButton = true;
    } else {
      this.iconButton = false;
    }
  }

  /**
   * Methode reset
   */
  reset() {
    this.eventForm.reset();
    this.modal.dismissAll();
  }

  /**
   * Methode openDialog
   * @param String id
   */
  openDialog(id) {
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
        this.crmService.delete(id).subscribe(resultEntity => {
          this.reloadTable();
          this.selectedTasks = [];
          this.selectedTasks.splice(this.selectedTasks.indexOf(id), 1);
          this.devToolsServices.openToast(0, 'alert.success');
        }
        );
      }
    });
  }

  reloadTable() {
    this.calendarEventsEntityToReload.sortedByDate = true;
    this.calendarEventsEntityToReload.username = this.sharedService.getUser().login;
    this.loading = true;
    this.crmService.find(this.calendarEventsEntityToReload).subscribe(
      (data) => {
        this.tasks = data;
        this.selectedTasks = [];
        this.loading = false;
      });
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }
  dateChanged() {
    if ((this.eventForm.controls.startDate.value !== '') &&
      (this.eventForm.controls.endDate.value !== '') &&
      (this.eventForm.controls.startDate.value > this.eventForm.controls.endDate.value)) {
      this.devToolsServices.openToast(3, 'alert.error_date');
    }
  }

  getTranslationOption(translationOption: string) {
    this.translate.get('customer.' + translationOption).subscribe((value) => {
      translationOption = value;
    });
    return translationOption;
  }
  /**
   * open collection details
   */
  async collectionDetails() {
    // get loan by extern loan id
    await this.customer360Services.findLoanByIdExtern(this.calendarEventsEntity.idLoanExtern).pipe(
      map(data => {
        // set loan to sharedService
        this.sharedService.setLoan(data);
        return data;
      }),
      // get customer
      mergeMap(loan => {
        const customer = this.customerService.getCustomerInformation(loan.customerDTO.id)
        const acmCollection = new CollectionEntity();
        acmCollection.id = this.calendarEventsEntity.idCollection;
        const collection = this.collectionServices.getCollection(acmCollection);
        return forkJoin([customer, collection])
      })
    ).subscribe(result => {
      this.modal.dismissAll();
      this.sharedService.setCustomer(result[0]);
      // set the collection to sharedService
      this.sharedService.setCollection(result[1][0]);
      // redirection to the loan-collection-details route
      this.sharedService.rootingCollectionUrlByStatut('planning');
    });
  }
  async loanDetails() {
    await this.customer360Services.findLoanByIdExtern(this.calendarEventsEntity.idLoanExtern).subscribe((loan) => {
      this.settingService.findProductById(loan.productId).subscribe(((product => {
        loan.productDTO = product;
        this.loanSharedService.openLoan(loan,'planning');
        this.modal.dismissAll();
      })))

    })
  }
  async clientDetails() {
    if (this.formUpdated === true) {
      this.devToolsServices.openToast(3, 'alert.save_before_exit');
      return;
    }
    else {
      const customerParam = new CustomerEntity();
      customerParam.customerIdExtern = this.calendarEventsEntity.idCustomerExtern;
      this.customerService.findCustomer(customerParam).subscribe((data) => {
        this.sharedService.setCustomer(data[0]);
        this.modal.dismissAll();
        this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'planning' } });
      });

    }
  }
  changeForm() {
    this.formUpdated = true;
  }

  async itemDetails() {


    await this.settingService.finItemById(this.calendarEventsEntity.idItem).subscribe((item) => {
      this.sharedService.setItem(item);
      this.modal.dismissAll();
      this.router.navigate([AcmConstants.GENERIC_WORKFLOW_SCREEN_URL]);



    })
  }
}
