import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LoanIbEntity } from 'src/app/shared/Entities/loanIb.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { GedServiceService } from '../../GED/ged-service.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { LoanDetailsServices } from '../../Loan-Application/loan-details/loan-details.services';
import { OnlineApplicationsService } from '../online-applications.service';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UdfService } from 'src/app/AcmPages/Loan-Application/udf/udf.service';
import { CustomerAddressService } from '../../../AcmPages/Customer/customer-address/customer-address.service';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { CustomerLinksRelationshipEntity } from 'src/app/shared/Entities/CustomerLinksRelationship.entity';
import { DatePipe } from '@angular/common';
import { DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { ScheduleEntity } from 'src/app/shared/Entities/schedule.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanApprovalService } from '../../Loan-Application/loan-approval/loan-approval.service';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { UDFLinksGroupeFieldsModelEntity } from 'src/app/shared/Entities/udfLinksGroupeFieldsModel.entity';
import { LoanCalculateEntity } from 'src/app/shared/Entities/LoanCalculate.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-online-applications-info',
  templateUrl: './online-applications-info.component.html',
  styleUrls: ['./online-applications-info.component.sass']
})
export class OnlineApplicationsInfoComponent implements OnInit {

  public loanIb: LoanIbEntity = new LoanIbEntity();
  loading: boolean;
  public settingMotifRejetsEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifRejetsEntitys = [];
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  @Input() expanded;
  @Input() expandedTwo;
  @Input() expandedthree;
  @Input() expandedmembers;
  public decimalPlaces: string;
  public rejectForm: FormGroup;
  public confirm = false;
  public confirmReject: boolean;
  public page: number;
  public pageSize: number;
  public nationality = '';
  public nationalId = '';
  public residentId = '';
  public residentRelationStatus = '';
  public resident = true;
  public customerName;
  public applyDate;
  public customerAddress = '';
  public expiryGregorianDate: NgbDate;
  public dateHijri: NgbDateStruct;
  public expiryHijriDate: NgbDateStruct = new NgbDate(0, 0, 0);
  public customerLinksRelationshipEntity: CustomerLinksRelationshipEntity[] = [];
  public schedules: ScheduleEntity[] = [];
  public normalPayment;
  public apr;
  public assign: string;
  public product: ProductEntity;
  public upfrontfee;
  public upfrontfeeprc: number;
  public registrationNumber;
  public dateOfIssue;
  public dateOfExpiry;
  public lastLine: ScheduleEntity;
  public action :boolean= true;
  /**
   * constructor
   * @param loanSharedService SharedService
   * @param gedService GedServiceService
   * @param devToolsServices AcmDevToolsServices
   * @param loanDetailsServices LoanDetailsServices
   * @param route ActivatedRoute
   * @param modalService NgbModal
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   * @param onlineApplicationService OnlineApplicationsService
   * @param router Router
   * @param udfService UdfService
   * @param customerAddressService CustomerAddressService
   * @param datePipe DatePipe
   * @param dateFormatterService DateFormatterService
   * @param loanApprovalService LoanApprovalService
   */
  constructor(public loanSharedService: SharedService, public gedService: GedServiceService,
              public devToolsServices: AcmDevToolsServices, public loanDetailsServices: LoanDetailsServices,
              public route: ActivatedRoute, public modalService: NgbModal, public formBuilder: FormBuilder,
              public loanApprovalService: LoanApprovalService,public customerService: CustomerServices,
              public translate: TranslateService, public onlineApplicationService: OnlineApplicationsService,
              public router: Router, public udfService: UdfService, public customerAddressService: CustomerAddressService,
              public datePipe: DatePipe, public dateFormatterService: DateFormatterService) { }

 async ngOnInit() {
    this.loanIb = this.loanSharedService.getLoanIb();
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loanIb.currencyDecimalPlaces);
    this.getCustomer(this.loanIb.customerDTO.ibCustomerId);
   // this.getAddress(this.loanIb.customerDTO.ibCustomerId);
   // this.getNationality(this.loanIb.customerDTO);
   // this.getOrganisationData(this.loanIb.customerDTO);
   // this.getMembers(this.loanIb.customerDTO.id);
    this.pageSize = 5;
    this.page = 1;

    /**
     * concat customer name
     */
    this.loanIb.customerNameNoPipe = this.loanSharedService.getCustomerName(this.loanIb.customerDTO);

    /**
     * date
     */
    if (this.loanIb.applyDate !== null) {
      this.applyDate = this.loanIb.applyDate;
    } else if (this.loanIb.dateInsertion !== null) {
      this.applyDate = this.loanIb.dateInsertion;
    }
    await this.loanApprovalService.getProduct(this.loanIb.productId).subscribe(
      (data) => {
        this.product = data;
        this.upfrontfee = this.product.issueFeePercentage1;

      }
    );
    // calculate schedules
    this.calculate(this.loanIb);
   }
  getCustomer(ibCustomerId: number) {
    let customer = new CustomerEntity();
    customer.ibCustomerId = ibCustomerId;
    this.customerService.getAllCustomerInformationFromIb(customer).subscribe((data) => {
      this.loanIb.customerDTO = data[0];
      // set the address
      if (data[0].listAddress.length > 0) {
        if (data[0].listAddress[0].townCity !== null) {
          this.customerAddress = data[0].listAddress[0].townCity + ' ';
        }
        if (data[0].listAddress[0].county !== null) {
          this.customerAddress += data[0].listAddress[0].county + ' ';
        }
        if (data[0].listAddress[0].state !== null) {
          this.customerAddress += data[0].listAddress[0].state;
        }
        // set the udfs
        this.getNationality(customer);
      }
    });
  }
  /**
   * calculate the new schedule with new data
   */
  async calculate(loanIb) {
    const loanEntity: LoanEntity = new LoanEntity();
    loanEntity.productId =  loanIb.productId;
    // default mode REPAYMENT AMOUNT => 0
    loanEntity.loanCalculationMode = 0;
    loanEntity.approvelAmount =  loanIb.applyAmountTotal;
    loanEntity.applyAmountTotal =  loanIb.applyAmountTotal;
    loanEntity.issueDate =  loanIb.issueDate;
    loanEntity.initialPaymentDate =  loanIb.initialPaymentDate;
    loanEntity.termPeriodNum =  loanIb.termPeriodNum;
    loanEntity.termPeriodID = loanIb.termPeriodID;
    loanEntity.periodsDeferred =  loanIb.gracePeriod;
    loanEntity.periodsDeferredType = 5;
    loanEntity.customerDTO = this.loanIb.customerDTO ;
    loanEntity.acceptLoanStep = true;
    await this.loanApprovalService.calculateLoanSchedules(loanEntity).toPromise().then(
      (data) => {
        this.schedules = data.loanSchedule;
        this.lastLine = this.schedules[this.schedules.length - 1];
        this.updateData(data);
        }).catch((error)=>{
          if(error){
            this.action = false;
          }
        })
        ;
    }
    updateData(data: LoanCalculateEntity) {
      const pourcentage = (data.issueAmount
        * this.product.issueFeePercentage1) / 100;
      const pourcentage2 = (data.issueAmount
        * this.product.issueFeePercentage2) / 100;
      const feeAmout1 = pourcentage + ((pourcentage
        * this.product.issueFeeVAT1) / 100) + data.feeAmt1;
      const feeAmout2 = pourcentage2 + ((pourcentage2
        * this.product.issueFeeVAT2) / 100) + this.product.issueFeeAmount2;
      this.normalPayment = data.normalPayment;
      this.apr = Math.round((data.apr + Number.EPSILON) * 100) / 100;
      this.upfrontfeeprc = feeAmout1 + feeAmout2;
  }

  /**
   *
   * Get members of groupe belongs to this loan
   * @param id id
   */
  getMembers(id) {
    const relationShip = new CustomerLinksRelationshipEntity();
    relationShip.customerId = id;
    relationShip.category = AcmConstants.MEMBERS;
    this.onlineApplicationService.findCustomerLinkRelationShip(relationShip).subscribe(
      (data) => {
        this.customerLinksRelationshipEntity = data;
        this.customerLinksRelationshipEntity.forEach((members, index) => {
          const userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
          userDefinedFieldsLinksEntity.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
          userDefinedFieldsLinksEntity.elementId = members.member.id;
          userDefinedFieldsLinksEntity.userDefinedFieldsDTO = new UserDefinedFieldsEntity();
          userDefinedFieldsLinksEntity.userDefinedFieldsDTO.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
          userDefinedFieldsLinksEntity.userDefinedFieldsDTO.userDefinedFieldGroupDTO.code = AcmConstants.CUSTOMER_NATIONALITY_CODE;
          this.udfService.getUdfLinkGroupby(userDefinedFieldsLinksEntity).subscribe((nationality) => {
            members.member.listUDFGroup = [];
            if (nationality.length > 0) {
              nationality[0].udfGroupeFieldsModels.forEach((udfnationality) => {
                switch (udfnationality.fieldName) {
                  case 'Nationality':
                    members.member.listUDFGroup.push(udfnationality);
                    members.member.resident = udfnationality.value === AcmConstants.RESIDENT_COUNTRY;
                    break;
                  case 'National ID':
                    members.member.listUDFGroup.push(udfnationality);
                    break;
                  case 'Resident ID':
                    members.member.listUDFGroup.push(udfnationality);
                    break;
                  case 'Resident Relation Status':
                    members.member.listUDFGroup.push(udfnationality);
                    break;
                    case 'Expiry date':
                    if (udfnationality.value !== null) {
                      const date = new Date(udfnationality.value.substring(6, 10) + '-' + udfnationality.value.substring(3, 5) + '-'
                        + udfnationality.value.substring(0, 2));
                      this.expiryGregorianDate = new NgbDate(0, 0, 0);
                      this.expiryGregorianDate.day = date.getDate();
                      this.expiryGregorianDate.month = date.getMonth() + 1;
                      this.expiryGregorianDate.year = date.getFullYear();
                      this.expiryHijriDate = this.dateFormatterService.ToHijri(this.expiryGregorianDate);
                      members.member.expiryHijryDate = this.expiryHijriDate;
                      members.member.listUDFGroup.push(udfnationality);
                    }
                    break;
                }

              });
            } else {
              members.member.listUDFGroup.push(new UDFLinksGroupeFieldsModelEntity());
              members.member.listUDFGroup.push(new UDFLinksGroupeFieldsModelEntity());
            }
          });
        });
      }
    );
  }

  /**
   *
   * @param customer customer
   */
  getNationality(customer) {
    const userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
    userDefinedFieldsLinksEntity.ibCustomerId = customer.ibCustomerId;
    userDefinedFieldsLinksEntity.userDefinedFieldsDTO = new UserDefinedFieldsEntity();
    userDefinedFieldsLinksEntity.userDefinedFieldsDTO.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
    userDefinedFieldsLinksEntity.userDefinedFieldsDTO.userDefinedFieldGroupDTO.code = AcmConstants.CUSTOMER_NATIONALITY_CODE;
    this.udfService.getUdfLinkGroupbyFromIb(userDefinedFieldsLinksEntity).subscribe((data) => {
      if (data.length > 0) {
        data[0].udfGroupeFieldsModels.forEach((udfnationality) => {
          switch (udfnationality.fieldName) {
            case 'Nationality':
              this.nationality = udfnationality.value;
              this.resident = this.nationality === AcmConstants.RESIDENT_COUNTRY;
              break;
            case 'National ID':
              this.nationalId =  udfnationality.value;
              break;
            case 'Resident ID':
              this.residentId =  udfnationality.value;
              break;
            case 'Resident Relation Status':
              this.residentRelationStatus = udfnationality.value;
              break;
              case 'Expiry date':
              if (udfnationality.value !== null) {
                const date = new Date(udfnationality.value.substring(6, 10) + '-' + udfnationality.value.substring(3, 5) + '-'
                  + udfnationality.value.substring(0, 2));
                this.expiryGregorianDate = new NgbDate(0, 0, 0);
                this.expiryGregorianDate.day = date.getDate();
                this.expiryGregorianDate.month = date.getMonth() + 1;
                this.expiryGregorianDate.year = date.getFullYear();

                this.expiryHijriDate = this.dateFormatterService.ToHijri(this.expiryGregorianDate);
              }
              break;
          }

        });

      }
      });
  }

  /**
   *
   * @param customer customer
   */
  getOrganisationData(customer : CustomerEntity) {
    const userDefinedFieldsLinksEntity: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
    userDefinedFieldsLinksEntity.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
    userDefinedFieldsLinksEntity.elementId =customer.ibCustomerId;
    userDefinedFieldsLinksEntity.userDefinedFieldsDTO = new UserDefinedFieldsEntity();
    userDefinedFieldsLinksEntity.userDefinedFieldsDTO.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
    userDefinedFieldsLinksEntity.userDefinedFieldsDTO.userDefinedFieldGroupDTO.id = AcmConstants.UDF_GROUP_ORGANISATION;
    this.udfService.getUdfLinkGroupbyFromIb(userDefinedFieldsLinksEntity).subscribe((data) => {
      if (data.length > 0) {
        this.registrationNumber = data[0].udfGroupeFieldsModels[0].value;
        this.dateOfIssue = data[0].udfGroupeFieldsModels[1].value;
        this.dateOfExpiry = data[0].udfGroupeFieldsModels[2].value;
      }
    });
  }

  /**
   * getAddress
   * @param id id customer
   */
  getAddress(id) {
    const addressEntity: AddressEntity = new AddressEntity();
    addressEntity.customerId = id;
    this.customerAddressService.getCustomerAddressFromIb(addressEntity).subscribe((value) => {
      if (value.length > 0) {
        if (value[0].townCity !== null) {
          this.customerAddress = value[0].townCity + ' ';
        }
        if (value[0].county !== null) {
          this.customerAddress += value[0].county + ' ';
        }
        if (value[0].state !== null) {
          this.customerAddress += value[0].state;
        }
      }
      // return this.customerAddress;
    });
  }
  toggleCollapse() {
    this.expanded = !this.expanded;
  }
  toggleCollapseTwo() {
    this.expandedTwo = !this.expandedTwo;
  }
  toggleCollapseThree() {
    this.expandedthree = !this.expandedthree;
  }
  toggleCollapseMembers() {
    this.expandedmembers = !this.expandedmembers;
  }

  /**
   * rejectModale : open reject modal
   * @param content modal
   */
  public rejectModal(content) {
    this.loanIb = this.loanSharedService.getLoanIb();
    this.settingMotifRejetsEntity.categorie = AcmConstants.REJECT_CATEGORIE;
    this.loanDetailsServices.getReason(this.settingMotifRejetsEntity).subscribe(
      (data) => {
        this.settingMotifRejetsEntitys = data;
      }
    );
    this.createForm();
    this.confirm = false;
    this.modalService.open(content, {
      size: 'md'
    });
  }

  /**
   * createForm : create Form Reject
   */
  createForm() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required],
      note: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Methode exit
   */
  exit() {
    this.route.queryParams.subscribe(params => {
        this.assign = params.assign;
      }
    );
    if (this.assign === 'true') {
      this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.LOAN_ASSIGN_URL);
    } else {
      this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.LOAN_IB_URL);
    }
  }

  /**
   * Methode reject : Reject loan
   */
  async reject() {
    this.loanIb.statut = AcmConstants.STATUT_IB_REJECT;
    this.route.queryParams.subscribe(params => {
        this.assign = params.assign;
      }
    );
    await this.onlineApplicationService.updateLoanIb(this.loanIb).toPromise().then(
      (data) => {
        this.loanSharedService.setLoanIb(data);
        if (this.assign === 'true') {
          this.router.navigate([AcmConstants.LOAN_ASSIGN_URL]);
        } else {
          this.router.navigate([AcmConstants.LOAN_IB_URL]);
        }
      });
    this.confirmReject = false;
    this.modalService.dismissAll();
  }

  /**
   * Methode onSubmit : onSubmit loan
   */
  onSubmit() {
    this.loanIb.note = this.rejectForm.value.reason.libelle;
    this.loanIb.note = this.loanIb.note + ' : ' + this.rejectForm.value.note;
    if (this.rejectForm.valid) {
      this.loanIb.confirm = this.confirmReject;
      this.reject();
    }
  }

  /**
   * Methode changeCheckBoxReject : change Check Box Reject loan
   */
  changeCheckBoxReject() {
    if (this.confirmReject === false) {
      this.confirmReject = true;
    } else {
      this.confirmReject = false;
      this.rejectForm.controls.confirm.setValue('');
    }
  }

  /**
   * Methode accept : accept loan
   */
  async accept() {
    this.loanIb.statut = AcmConstants.STATUT_IB_ACCEPT;
    this.loanIb.loanSchedules = this.schedules;
    await this.onlineApplicationService.acceptLoanIb(this.loanIb).toPromise().then(
      (data) => {
        this.loanSharedService.setLoanIb(data);
        this.route.queryParams.subscribe(params => {
            this.assign = params.assign;
          }
        );
        if (this.assign === 'true') {
          this.router.navigate([AcmConstants.LOAN_ASSIGN_URL]);
        } else {
          this.router.navigate([AcmConstants.LOAN_IB_URL]);
        }
      });
  }

}
