import { CreditLineService } from './../../../AcmPages/CreditLine/credit-line.service';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleService } from './page-title.service';
import { SharedService } from '../../../shared/shared.service';
import { LoanHistorique } from '../../../shared/Entities/loan.historique';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';
import { CustomerContactEntity } from '../../../shared/Entities/CustomerContactEntity';
import { CustomerEntity } from '../../../shared/Entities/customer.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { LoanDetailsServices } from 'src/app/AcmPages/Loan-Application/loan-details/loan-details.services';
import { GedServiceService } from 'src/app/AcmPages/GED/ged-service.service';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { HabilitationEntity } from 'src/app/shared/Entities/habilitation.entity';
import { checkOfflineMode, customEmailValidator, customPatternValidator, customRequiredValidator } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CustomerPaginationEntity } from 'src/app/shared/Entities/customer.pagination.entity';
import { CustomerListService } from 'src/app/AcmPages/Customer/customer-list/customer-list.service';
import { SettingClaimsEntity } from 'src/app/shared/Entities/settingClaims.entity';
import { LoanManagementService } from 'src/app/AcmPages/Loan-Application/loan-management/loan-management.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CustomerManagementService } from 'src/app/AcmPages/Customer/customer-management/customer-management.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent implements OnInit {

  @Input() heading;
  @Input() subheading;
  @Input() icon;
  @Input() account;
  @Input() status;
  @Input() collectionStatut;
  @Input() claimStatut;
  @Input() loanApplicationStatus;
  @Input() supplierStatus;
  @Input() syncCreditLineAccounts;
  @Input() workflowStepName;
  @Input() addClaims;
  @Output() refreshParentEvent = new EventEmitter<void>();
  selectedCategory: string;
  public date = new Date();
  loanHistoriques: LoanHistorique[] = [];
  public users: UserEntity[] = [];
  public participantSelected: UserEntity[] = [];
  public reassignForm: FormGroup;
  public contactCustomerForm: FormGroup;
  public assignToCustomerForm: FormGroup;
  public confirm = false;
  public loan: LoanEntity = new LoanEntity();
  public dateVisited: string;
  public customer = new CustomerEntity();
  public modalForm: FormGroup;
  public modalFormClaims: FormGroup;
  public settingMotifDeclineEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifDeclineEntitys = [];
  public confirmDecline = false;
  public loans = [];
  public assignCustomer = '0';
  public showInternetBanking = '0';
  public habilitationEntitys: HabilitationEntity[] = [];
  public actionsHabilitation = false;
  public statusSupplier = 1;
  public CategoryClaims = [];
  public SettingClaims = [];
  public configParticipants = {
    displayKey: 'fullName',
    search: true,
    placeholder: ' ',
    searchOnKey: 'fullName'
  };
  public loadingSynchronizeCLAccounts = false;
  public credit_line_accounts_path = "credit-line-accounts";
  public customerPaginationEntity: CustomerPaginationEntity =
  new CustomerPaginationEntity();
  @ViewChild('content2', { static: true }) modalContent: TemplateRef<any>;
  public settingClaimsEntitys: SettingClaimsEntity[] = [];
  formError: boolean = false;
  
  /**
   *
   * @param datepipe DatePipe
   * @param modalService NgbModal
   * @param pageTitleService NgbModal
   * @param sharedService SharedService
   * @param translate TranslateService
   * @param formBuilder FormBuilder
   * @param router Router
   * @param devToolsServices AcmDevToolsServices
   * @param loanDetailsServices LoanDetailsServices
   * @param gedService GedServiceService
   */
  constructor(public datepipe: DatePipe,
    public modalService: NgbModal,
    public pageTitleService: PageTitleService,
    public sharedService: SharedService,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    public router: Router,
    public devToolsServices: AcmDevToolsServices,
    public loanDetailsServices: LoanDetailsServices,
    public gedService: GedServiceService,
    public settingsService: SettingsService,
    private dbService: NgxIndexedDBService,
    private creditLineService: CreditLineService,
    public customerListService: CustomerListService,
    public loanManagementService :LoanManagementService,
    public library: FaIconLibrary,
    public customerManagementService: CustomerManagementService) {
      
  }

  ngOnInit(): void {
    this.loan = this.sharedService.getLoan();
    // get setting ASSIGN_CUSTOMER / INTERNET_BANKING

    if (checkOfflineMode()) {
      const urlTree = this.router.parseUrl(this.router.url);
      const urlWithoutParams = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
      const isFromOfflineSync = sessionStorage.getItem('isFromOfflineSync') === 'true';
      const syncUrl = ["acm/customer-management",'acm/upload-document','acm/loan-details','acm/check-guarantor', 'acm/customer-edit'].includes(urlWithoutParams);
      if (isFromOfflineSync && !syncUrl)
        sessionStorage.removeItem('isFromOfflineSync')

      this.dbService.getByKey('data', 'envirement-values-by-keys').subscribe((data: any) => {
        data = data?.data;
        if (data === undefined) {
          this.devToolsServices.openToast(3, 'No keys saved for offline use');
        } else {
          this.assignCustomer = data[1].value;
          this.showInternetBanking = data[2].value;
          this.sharedService.setMaxSizeFileUpload(+data[0].value);
        }
      });
    } else {
      const environnements: string[] = [AcmConstants.ASSIGN_CUSTOMER, AcmConstants.INTERNET_BANKING, AcmConstants.MAX_SIZE_FILE_UPLOAD, AcmConstants.KEY_LICENCE, AcmConstants.USE_EXTERNAL_CBS];
      this.settingsService.getEnvirementValueByKeys(environnements).subscribe((data) => {
        if (data !== null) {
          this.assignCustomer = data[1].value;
          this.showInternetBanking = data[2].value;
          this.sharedService.setMaxSizeFileUpload(+data[0].value);
          this.sharedService.setActivationKey(data.filter(item => item.key === AcmConstants.KEY_LICENCE)[0].value.split(','));
          this.sharedService.setCreptedKey(data.filter(item => item.key === AcmConstants.KEY_LICENCE)[0].creptedKey);
          this.sharedService.setEnvironnementLicence(data.filter(item => item.key === AcmConstants.KEY_LICENCE)[0]);
          this.sharedService.useExternalCBS = data.filter(item => item.key === AcmConstants.USE_EXTERNAL_CBS)[0].value;
        }
      });
    }

    // check actions button habilitation
    this.habilitationEntitys = this.sharedService.getHabilitationEntitys();
    this.habilitationEntitys.forEach((element) => {
      if (element.acmHabilitation === AcmConstants.IHM_ACTIONS && element.value === AcmConstants.IHM) {
        this.actionsHabilitation = true;
      }
    });
  }

  /**
   * methode to open the popup create new
   * param content
   */
  async openLarge(content) {
    const loanHistorique: LoanHistorique = new LoanHistorique();
    loanHistorique.loanDTO = this.sharedService.getLoan();
    await this.pageTitleService.getLoanHistorique(loanHistorique).subscribe((loanHistoriques) => {
      this.loanHistoriques = loanHistoriques;
      this.modalService.open(content, {
        size: 'lg'
      });
      this.loanHistoriques.forEach(element => {
        if (element.action === AcmConstants.SAVE_REPORT_VISIT) {
          this.dateVisited = element.description.substring(element.description.length - 10, element.description.length);
        }
        if (element.action === AcmConstants.REASSIGN_LOAN) {
          const indexOfFirst = element.description.indexOf('To');
          element.assignedTo = element.description.slice(indexOfFirst + 2);
        }
        // ACM 2245 : Hide the "issued action" from Activity
        if (element.action === AcmConstants.ACTION_ISSUED) {
          this.loanHistoriques.splice(this.loanHistoriques.indexOf(element), 1);
        }
      });
    });
  }

  /**
   * methode to open the popup create new
   * param content
   */
  openReassign(content) {
    this.getUsers();
    this.createForm();
    this.loan = this.sharedService.getLoan();
    this.confirm = false;
    this.modalService.open(content, {
      size: 'ml'
    });
  }

  /**
   * createForm : create Form reassign
   */
  createForm() {
    this.reassignForm = this.formBuilder.group({
      participants: ['', Validators.required],
      note: [''],
      confirm: ['', Validators.required]
    });
  }

  /**
   * createForm : create Form contact customer
   */
  createFormContact() {
    this.contactCustomerForm = this.formBuilder.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  /**
   * createForm : create Form assign to customer
   */
  createFormAssignToCustomer() {
    this.assignToCustomerForm = this.formBuilder.group({
      reason: ['', Validators.required],
      note: ['', Validators.required],
    });
  }

  changeChecbox($event: Event) {
    if (this.confirm === false) {
      this.confirm = true;
    } else {
      this.confirm = false;
      this.reassignForm.controls.confirm.setValue('');
    }
  }

  /**
   * methode to open the popup contact customer
   * param content
   */
  openContactCustomer(content) {
    this.createFormContact();
    this.modalService.open(content, {
      size: 'ml'
    });
  }

  /**
   * methode to open the popup assign to customer
   * param content
   */
  openAssignToCustomer(content) {
    if (this.loan.assignCustomer === false) {
      this.createFormAssignToCustomer();
      this.modalService.open(content, {
        size: 'ml'
      });
    } else {
      this.updateAssignCustomer();
    }
  }

  /**
   * load users
   */
  getUsers() {
    this.pageTitleService.loadAllUserList().subscribe(
      (data) => {
        this.users = data;
      });
  }

  /**
   * Methode to reassign
   */
  async reassign() {
    await this.pageTitleService.reassignLoan(this.loan).toPromise().then(
      (data) => {
        this.router.navigate([AcmConstants.DASHBOARD_URL]);
      });
  }

  /**
   * onSubmit : submit form
   */
  onSubmit() {
    if (this.reassignForm.valid) {
      this.loan.confirm = this.confirm;
      this.modalService.dismissAll();
      this.loan.owner = this.reassignForm.value.participants.login;
      this.loan.ownerName = this.reassignForm.value.participants.fullName;
      if (this.reassignForm.value.note !== '') {
        this.loan.note = this.reassignForm.value.note;
      } else {
        this.loan.note = 'reassigned to' + ' : ' + this.reassignForm.value.participants.fullName;
      }
      this.reassign();
    }
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Methode to send message to customer
   */
  send() {
    this.customer = this.sharedService.getCustomer();
    const customerContactEntity: CustomerContactEntity = new CustomerContactEntity();
    customerContactEntity.email = this.customer.email;
    customerContactEntity.to = this.customer.email;
    customerContactEntity.subject = this.contactCustomerForm.controls.subject.value;
    customerContactEntity.content = this.contactCustomerForm.controls.message.value;
    customerContactEntity.customerId = this.customer.id;
    customerContactEntity.sentCustomer = false;
    this.pageTitleService.sendMail(customerContactEntity).subscribe();
  }

  /**
   * get all loans
   */
  getLoans() {
    const loanGrp: LoanEntity = new LoanEntity();
    loanGrp.parentId = this.sharedService.getLoan().loanId;
    this.gedService.getloanCustomer(loanGrp).subscribe(async (data) => {
      this.loans = data;
      this.loans.forEach(element => {
        element.assignCustomer = true;
        this.pageTitleService.updateAssignCustomer(element).subscribe();
      });
    });
  }

  /**
   * Methode to change assign to customer to true
   */
  updateAssignCustomer() {
    const loanEntity: LoanEntity = new LoanEntity();
    loanEntity.loanId = this.sharedService.getLoan().loanId;
    loanEntity.idIbLoan =  this.sharedService.getLoan().idIbLoan;
    loanEntity.assignCustomer = !this.loan.assignCustomer;
    loanEntity.customerDTO = new CustomerEntity();
    loanEntity.customerDTO.email = this.loan.customerDTO.email;
    loanEntity.customerDTO.id = this.loan.customerDTO.id;
    loanEntity.customerDTO.customerNumber = this.loan.customerDTO.customerNumber;

    if (this.loan.statutWorkflow !== null) {
      loanEntity.statutWorkflow = this.loan.statutWorkflow;
      loanEntity.statutWorkflow = this.loan.statutWorkflow;
    }
    if (this.loan.approvelAmountGroupe !== null) { loanEntity.approvelAmount = this.loan.approvelAmountGroupe; }
    if (this.loan.applyAmountTotal !== null) { loanEntity.approvelAmount = this.loan.applyAmountTotal; }
    if (this.loan.approvelAmount !== null) { loanEntity.approvelAmount = this.loan.approvelAmount; }

    this.loan.assignCustomer = !this.loan.assignCustomer;
    if (this.loan.statutWorkflow !== null) {
      loanEntity.statutWorkflow = this.loan.statutWorkflow;
    }
    if (this.loan.approvelAmountGroupe !== null) { loanEntity.approvelAmount = this.loan.approvelAmountGroupe; }
    if (this.loan.applyAmountTotal !== null) { loanEntity.approvelAmount = this.loan.applyAmountTotal; }
    if (this.loan.approvelAmount !== null) { loanEntity.approvelAmount = this.loan.approvelAmount; }

    if (loanEntity.assignCustomer) { loanEntity.note = 'assigned to cutomer '; } else { loanEntity.note = 'cancel assigned to customer'; }

    this.translate.get('assign_customer.reason').subscribe((value) => {
      loanEntity.note = ' ' + value + ': ' + this.assignToCustomerForm.controls.reason.value +
        ', ' + this.assignToCustomerForm.controls.note.value;
    });
    if (this.loan.assignCustomer) {
      this.devToolsServices.openToast(0, 'alert.customer_assigned');
    } else {
      this.devToolsServices.openToast(0, 'alert.cancel_assignment');
    }
    this.pageTitleService.updateAssignCustomer(loanEntity).subscribe();
    if (this.sharedService.getLoan().customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.getLoans();
    }
  }

  /**
   * Open model decline modal
   * @param content modal input
   */
  async declineModel(content) {
    this.modalService.open(content, {
      size: 'md'
    });
    this.createFormDecline();
    this.confirmDecline = false;
    this.settingMotifDeclineEntity.categorie = AcmConstants.CANCEL_CATEGORIE;
    await this.loanDetailsServices.getReason(this.settingMotifDeclineEntity).toPromise().then(
      (data) => {
        this.settingMotifDeclineEntitys = data;
      });
  }

  /**
   * Open model decline modal
   * @param content modal input
   */
  async ClaimsModel(content) {
    this.createFormClaims();
    this.CategoryClaims=["Customer","Prospect"]
    await this.settingsService.findAllSettingClaims().subscribe(
      (data) => {
        this.settingClaimsEntitys = data;
      }
    );
    this.modalService.open(this.modalContent, { size: 'md' });
  }
  /**
   * Methode to create form Decline
   */
  createFormClaims() {
    this.modalFormClaims = this.formBuilder.group({
      subject: ['', customRequiredValidator],
      body: ['', customRequiredValidator ],
      idCustomer: [''],
      status: ['NEW'],
      dateInsertion: [new Date().toISOString().slice(0, 10)],
      name: [{ value: '', disabled: true }, customRequiredValidator], 
      email: [{ value: '', disabled: true }, [customPatternValidator(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ),customRequiredValidator]], 
      phone: [{ value: '', disabled: true }, [customPatternValidator(/^\d{8}$/),customRequiredValidator]],  
      dueDate : ['']
    });
  }

  onCategoryChange(category: string) {
    this.formError = false;
    this.selectedCategory = category;
    const nameControl = this.modalFormClaims.get('name');
    const emailControl = this.modalFormClaims.get('email');
    const phoneControl = this.modalFormClaims.get('phone');
    if (category === 'Customer') {
      nameControl.enable(); 
      emailControl.disable(); 
      phoneControl.disable(); 
      this.SettingClaims= this.settingClaimsEntitys.filter(e=>  e.category === 'CUSTOMER' )
    } else if (category === 'Prospect') {
      nameControl.enable(); 
      emailControl.enable(); 
      phoneControl.enable(); 
      this.SettingClaims= this.settingClaimsEntitys.filter(e=> e.category === 'PROSPECT')
      }
  }

  filterCustomerName(event) {
        // init pagination params
        this.customerPaginationEntity.pageSize = 25;
        this.customerPaginationEntity.pageNumber = 0;
        this.customerPaginationEntity.params = new CustomerEntity();
        this.customerPaginationEntity.params.customerName = event.query;
    if (this.selectedCategory === 'Prospect') {
      this.customerPaginationEntity.params.customerType = AcmConstants.CUSTOMER_CATEGORY_PROSPECT
      this.customerListService.getCustomersPagination(this.customerPaginationEntity).subscribe(
        (data) => {
          this.customerPaginationEntity = data;
          this.customerPaginationEntity.resultsCustomers = this.customerPaginationEntity.resultsCustomers.map(element => {
            element.customerNameNoPipe = this.sharedService.getCustomerName(element);
            return element;
          });
        }
      );
    }else {
      this.customerListService.getCustomersPagination(this.customerPaginationEntity).subscribe(
        (data) => {
          this.customerPaginationEntity = data;
          this.customerPaginationEntity.resultsCustomers = this.customerPaginationEntity.resultsCustomers.filter(element => {
            return element.customerType !== 'PROSPECT';
          }).map(element => {
            element.customerNameNoPipe = this.sharedService.getCustomerName(element);
            return element;
          });
        }
      );
    }
  }


  async onSubmitClaims() {
   
   if (this.modalFormClaims.valid) {

    this.SettingClaims = this.settingClaimsEntitys.filter(e => e.id === this.modalFormClaims.controls['subject'].value);
    let dueDate;
    const currentDate = new Date();
    if (this.SettingClaims.length > 0) {
    const processingTimeLine = this.SettingClaims[0].processingTimeLine;
    if (processingTimeLine) {
        dueDate = new Date(currentDate);
        dueDate.setDate(currentDate.getDate() + processingTimeLine);
    } else {
        dueDate = new Date(currentDate);
    }
    this.modalFormClaims.controls.dueDate.setValue(dueDate.toISOString().split('T')[0]);
    } else {
     dueDate = new Date(currentDate);
      this.modalFormClaims.controls.dueDate.setValue(dueDate.toISOString().split('T')[0]);
    }
    

     if (!this.modalFormClaims.controls['name'].value.ibCustomerId && this.selectedCategory === 'Customer') {
      if (this.modalFormClaims.controls['name'].value.email) {
      await this.customerListService.saveCUSTOMERIB(this.modalFormClaims.controls['name'].value).subscribe((data)=>{
      this.customerManagementService.updateProspect(data).subscribe((res)=>{
      this.modalFormClaims.controls['idCustomer'].setValue(data.ibCustomerId);
      this.modalFormClaims.controls['name'].setValue(this.modalFormClaims.controls['name'].value.customerNameNoPipe);
      this.updateAndResetForm();
     });
    });
      }else {
        this.devToolsServices.openToast(1, 'alert.customer_mail');
        return
      }
    }else if (this.modalFormClaims.controls['name'].value.ibCustomerId && this.selectedCategory === 'Customer' ) {
      this.modalFormClaims.controls['idCustomer'].setValue(this.modalFormClaims.controls['name'].value.ibCustomerId);
      this.modalFormClaims.controls['name'].setValue(this.modalFormClaims.controls['name'].value.customerNameNoPipe);
      this.updateAndResetForm();
    }else {
      this.modalFormClaims.controls['name'].setValue(this.modalFormClaims.controls['name'].value.customerNameNoPipe);
      this.updateAndResetForm();
    }
  }else {
       if (!this.selectedCategory) {
         this.formError = true;
       }
    }   
  

}

  updateAndResetForm(){
    this.loanManagementService.updateClaimsInIb(this.modalFormClaims.value).subscribe(()=>{
      this.modalFormClaims.reset();
      this.selectedCategory = null;
      this.modalService.dismissAll();
      this.refreshParentEvent.emit();
      }); 
  }
  
  onClose(){
    this.formError = false;
    this.modalFormClaims.reset();
    this.selectedCategory = null;
    this.modalService.dismissAll();
  }
   validateForm() {
      Object.values(this.modalFormClaims.controls).forEach((control: AbstractControl) => {
          control.markAsTouched();
          control.updateValueAndValidity();
      });
  }
  /**
   * Methode to create form Decline
   */
  createFormDecline() {
    this.modalForm = this.formBuilder.group({
      reason: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }

  changeChecboxDecline($event: Event) {
    if (this.confirmDecline === false) {
      this.confirmDecline = true;
    } else {
      this.confirmDecline = false;
      this.modalForm.controls.confirm.setValue('');
    }
  }

  /**
   * Methode onSubmitDecline : Decline loan
   */
  onSubmitDecline() {
    this.loan = this.sharedService.getLoan();
    this.loan.note = this.modalForm.value.reason;
    this.loan.note = 'Canceled via ACM';
    this.loan.codeExternMotifRejet = this.modalForm.value.reason.codeExternal;
    if (this.modalForm.valid) {
      this.loan.confirm = this.confirmDecline;
      this.cancelLoan();
    }
  }

  /**
   * cancelLoan
   */
  cancelLoan() {
    this.pageTitleService.cancelLoan(this.loan).toPromise().then(resultEntity => {
      this.modalService.dismissAll();
      this.router.navigate([AcmConstants.DASHBOARD_URL]);
      this.devToolsServices.openToast(0, 'alert.loan_cancelled');
    });
  }
  openTopupRefinance() {
    this.router.navigate(['topup-refinance-loan']);
  }

  syncCreditLineAccount(){
    this.creditLineService.syncCreditLineAccounts().subscribe((data) => {
      if (data !== null) {
        this.devToolsServices.openToastArrayMessagesWithParameterInMiddle(
          0,
          ["", "accounts_synchronized"],
          String(data)
        );
      }
    });
  }

}
