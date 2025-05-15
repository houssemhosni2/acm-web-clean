import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GuarantorsDetailsService } from './guarantors-details.service';
import { GuarantorEntity } from '../../../../shared/Entities/guarantor.entity';
import { LoanEntity } from '../../../../shared/Entities/loan.entity';
import { SharedService } from '../../../../shared/shared.service';
import { AcmDevToolsServices } from '../../../../shared/acm-dev-tools.services';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../../../app.component';
import { TranslateService } from '@ngx-translate/core';
import { CustomerEntity } from '../../../../shared/Entities/customer.entity';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerLinksRelationshipEntity } from '../../../../shared/Entities/CustomerLinksRelationship.entity';
import { AcmConstants } from '../../../../shared/acm-constants';
import { Router } from '@angular/router';
import { CustomerManagementService } from 'src/app/AcmPages/Customer/customer-management/customer-management.service';
import { LoanGuarantorsServices } from '../../check-guarantor/loan-guarantors/loan-guarantors.services';
import { CustomerAddressService } from 'src/app/AcmPages/Customer/customer-address/customer-address.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-guarantors-details',
  templateUrl: './guarantors-details.component.html',
  styleUrls: ['./guarantors-details.component.sass']
})
export class GuarantorsDetailsComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public loading = true;
  public page: number;
  public pageSize: number;
  public loan: LoanEntity = new LoanEntity();
  public guarantors: CustomerEntity[] = [];
  public data: GuarantorEntity[];
  public decimalPlaces: string;
  @Input() expanded;
  @Output() guarantorDisabled = new EventEmitter<boolean>();
  public guarantorAmount: FormGroup;
  public guarantorNum = 0;
  public check = false;
  public customerLinkCategoryParam = '';
  @Output() isApplicationFee = new EventEmitter();
  @Output() applicationFee = new EventEmitter();
  public applicationFees = 0;
  public isApplicationFeeChild = false;
  public addGuarantor: CustomerEntity;
  public saveGuarantor : boolean = true;
  /**
   *
   * @param loanSharedService loanSharedService
   * @param guarantorsDetailsService guarantorsDetailsService
   * @param devToolsServices devToolsServices
   * @param modalService modalService
   * @param translate translate
   * @param formBuilder formBuilder
   * @param router router
   * @param customerManagementService CustomerManagementService
   * @param loanGuarantorsServices LoanGuarantorsServices
   * @param customerAddressService CustomerAddressService
   * @param library FaIconLibrary
   */
  constructor(public loanSharedService: SharedService, public guarantorsDetailsService: GuarantorsDetailsService,
    public devToolsServices: AcmDevToolsServices, public modalService: NgbModal, public translate: TranslateService,private dbService: NgxIndexedDBService,
    public formBuilder: FormBuilder, public router: Router, public customerManagementService: CustomerManagementService,
    public loanGuarantorsServices: LoanGuarantorsServices, public customerAddressService: CustomerAddressService,
    public library: FaIconLibrary) {
  }

  async ngOnInit() {
    this.applicationFee.emit(0);
    this.isApplicationFee.emit(false);
    this.loan = this.loanSharedService.getLoan();
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    this.pageSize = 5;
    this.page = 1;
    this.CreateGuarantorAmountFrom();
    const customerLinksRelationshipEntity: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
    customerLinksRelationshipEntity.idLoan = this.loan.loanId;
    customerLinksRelationshipEntity.category = AcmConstants.RELATION_GUARANTOR;

    //to do
    if (checkOfflineMode()) {
      const loanGuarantors = await this.dbService.getByKey('data', 'getLoanGuarantorByLoanId_' + this.loan.loanId).toPromise() as any;
      if(loanGuarantors !== undefined){
        loanGuarantors.data?.forEach(
        (guarantor) => {
          this.guarantorAmount.addControl('amount' + this.guarantorNum, new FormControl(guarantor.amountGuarantor, Validators.required));
          guarantor.member.customerNameNoPipe = this.loanSharedService.getCustomerName(guarantor.member);
          this.guarantors.push(guarantor.member);
          this.guarantorNum++;
        }
      );
    }
    } else {
      if(this.loan.assignCustomer && this.loan.idIbLoan !== null && this.loan.idIbLoan !== undefined){
        const customerLinksRelationshipIbEntity: CustomerLinksRelationshipEntity = customerLinksRelationshipEntity;
        customerLinksRelationshipIbEntity.idLoan = this.loan.idIbLoan;
        this.guarantorsDetailsService.findGuarantorsFromIbAndSaveInAcm(customerLinksRelationshipIbEntity).subscribe((data)=> {
          data.forEach(
            (guarantor) => {
              this.guarantorAmount.addControl('amount' + this.guarantorNum, new FormControl(guarantor.amountGuarantor, Validators.required));
              guarantor.member.customerNameNoPipe = this.loanSharedService.getCustomerName(guarantor.member);
              this.guarantors.push(guarantor.member);
              this.guarantorNum++;
            }
          );
        })
      }
      else {
        this.guarantorsDetailsService.findCustomerLinkRelationShip(customerLinksRelationshipEntity).subscribe(
          (data) => {
            data.forEach(
              (guarantor) => {
                this.guarantorAmount.addControl('amount' + this.guarantorNum, new FormControl(guarantor.amountGuarantor, Validators.required));
                guarantor.member.customerNameNoPipe = this.loanSharedService.getCustomerName(guarantor.member);
                this.guarantors.push(guarantor.member);
                this.guarantorNum++;
              }
            );
          }
        );
      }
    }

    this.addGuarantorNew();

    // to do
    if (!checkOfflineMode()) {
      this.customerManagementService.getEnvirementValueByKey(AcmConstants.APPLICATION_FEE).toPromise().then((environnement) => {
        if (environnement.value === '1') {
          this.loanGuarantorsServices.getApplicationFee(this.loan.idAccountExtern).subscribe(
            (data) => {
              this.applicationFee.emit(data);
              this.isApplicationFee.emit(true);
              this.applicationFees = data;
              this.isApplicationFeeChild = true;
            }
          );
        } else {
          this.isApplicationFee.emit(false);
          this.isApplicationFeeChild = false;
        }
      });
    }

  }
  /**
   * add new guarantor
   */
  addGuarantorNew() {
    if (this.loanSharedService.getGuarantor() !== null) {
      if (Object.keys(this.loanSharedService.getGuarantor()).length !== 0) {
        this.addGuarantor = this.loanSharedService.getGuarantor();
        this.addGuarantor.customerNameNoPipe = this.loanSharedService.getCustomerName(this.addGuarantor);
        this.guarantors.push(this.addGuarantor);
        this.loanSharedService.setGuarantor(null);
        this.guarantorNum = this.guarantors.length;
        for (let i = 0; i < this.guarantorNum; i++) {
          this.guarantorAmount.addControl('amount' + i, new FormControl('0', Validators.required));
        }
        this.check = true;
        this.saveGuarantor = false;
      }
    }
  }
  /**
   * check change amount guarantor
   */
  changedAmountGuarantor(i: number) {
    if (this.guarantors[i].action !== AcmConstants.ACTION_INSERT) {
      this.guarantors[i].action = AcmConstants.ACTION_UPDATE;
    }
    this.check = true;
  }
  CreateGuarantorAmountFrom() {
    this.guarantorAmount = this.formBuilder.group({});
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  /**
   * methode to open the popup schedule
   * param content
   */
  openLarge(content) {
    this.loanSharedService.setCustomer(this.loan.customerDTO);
    this.customerLinkCategoryParam = AcmConstants.CUSTOMER_LINK_CATEGORY_GUARANTOR;
    this.modalService.open(content, {
      size: 'xl'
    });
  }

  /**
   * methode to redirect customer to customer 360 details
   * @param guarantor Guarantor
   */
  GuarantorDetails(guarantor) {
    if (this.check) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.PREVIOUS_FORM_MSG)
        .afterClosed().subscribe((result) => {
          if (result) {
            this.loanSharedService.setCustomer(guarantor);
            this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'workflow' } });
          }
        });
    } else {
      this.router.navigate([AcmConstants.CUSTOMER_360_DETAILS_URL], { queryParams: { source: 'workflow' } });
    }
  }

  /**
   * GetDirection
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Add Customer to Guarantors List
   */
  addCustomer(event: CustomerEntity[]) {
    event.forEach((data) => {
      data.customerNameNoPipe = this.loanSharedService.getCustomerName(data);
      data.action = AcmConstants.ACTION_INSERT;
      this.guarantors.push(data);
    });
    this.guarantorNum = this.guarantors.length;
    for (let i = 0; i < this.guarantorNum; i++) {
      this.guarantorAmount.addControl('amount' + i, new FormControl('0', Validators.required));
    }
    this.check = true;
  }

  /**
   * Delete Selected Guarantor
   * @param i i
   */
  deleteGuarantor(i: number) {
    this.guarantors[i].action = AcmConstants.ACTION_DELETE;
    this.check = true;
    this.loanSharedService.setGuarantor(null);
  }
  setListGuarantors(guarantorsList: CustomerEntity[]) {
    this.guarantors = guarantorsList;
  }
  getListGuarantors() {
    if (this.guarantors.length > 0) {
      for (let i = 0; i < this.guarantors.length; i++) {
        if (this.guarantors[i].action !== AcmConstants.ACTION_DELETE) {
          this.guarantors[i].amountGuarantor = this.guarantorAmount.controls['amount' + i].value;
        } else {
          this.guarantors[i].amountGuarantor = -1;
        }
      }
    }
    return this.guarantors;
  }
  /**
   * add new guarantor
   */
  addNewGuarantor(content3) {
    if(!this.saveGuarantor){
      this.modalService.open(content3, {
        size: 'md'
      });
    }
    else if (this.check) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.PREVIOUS_FORM_MSG)
        .afterClosed().subscribe((result) => {
          if (result) {
            this.loanSharedService.setCustomer(null);
            this.loanSharedService.setGuarantor(null);
            this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT], { queryParams: { source: 'add-guarantor' } });
          }
        });
    } else {
      this.loanSharedService.setCustomer(null);
      this.loanSharedService.setGuarantor(null);
      this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT], { queryParams: { source: 'add-guarantor' } });
    }
  }
  /**
   *
   * @param item guarantor
   */
  async guarantorUpdate(item) {
    if (this.check) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.PREVIOUS_FORM_MSG)
        .afterClosed().subscribe((result) => {
          if (result) {
            this.loanSharedService.setCustomer(item);
            this.router.navigate([AcmConstants.EDIT_CUSTOMER], { queryParams: { source: 'edit-guarantor' } });
          }
        });
    } else {
      this.loanSharedService.setCustomer(item);
      this.router.navigate([AcmConstants.EDIT_CUSTOMER], { queryParams: { source: 'edit-guarantor' } });
    }
  }
}
