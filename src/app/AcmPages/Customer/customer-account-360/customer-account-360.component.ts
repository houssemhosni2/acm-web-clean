import { SettingsService } from "src/app/AcmPages/Settings/settings.service";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { CustomerAccountEntity } from "src/app/shared/Entities/customer.account.entity";
import { SharedService } from "src/app/shared/shared.service";
import { LoanEntity } from "src/app/shared/Entities/loan.entity";
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from "ngx-loading";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AppComponent } from "../../../app.component";
import { CustomerAccount360Service } from "./customer-account-360.service";
import { CustomerEntity } from "../../../shared/Entities/customer.entity";
import { LoanScheduleEntity } from "src/app/shared/Entities/loanSchedule.entity";
import { LoanApprovalService } from "../../Loan-Application/loan-approval/loan-approval.service";
import { Customer360Services } from "../customer360/customer360.services";
import { Router } from "@angular/router";
import { ProductEntity } from "src/app/shared/Entities/product.entity";
import { InformationsPaymentEntity } from "src/app/shared/Entities/InformationsPayment.entity";
import { paymentAbacusRequestEntity } from "src/app/shared/Entities/paymentAbacusRequest.entity";
import { requestPaymentAbacusApiEntity } from "src/app/shared/Entities/requestPaymentAbacusApi.entity";
import { SettingDocumentTypeProductEntity } from "src/app/shared/Entities/settingDocumentTypeProduct.entity";
import { GedServiceService } from "../../GED/ged-service.service";
import { ReportEntity } from "src/app/shared/Entities/report.entity";
import { ReportingService } from "../../GED/reporting.service";
import { SettingDocumentTypeEntity } from "src/app/shared/Entities/settingDocumentType.entity";
import { TransitionAccountEntity } from "src/app/shared/Entities/transition.account.entity";
import { checkOfflineMode } from "src/app/shared/utils";
import { NgxIndexedDBService } from "ngx-indexed-db";

const PrimaryBleu = "var(--primary)";

@Component({
  selector: "app-customer-account-360",
  templateUrl: "./customer-account-360.component.html",
  styleUrls: ["./customer-account-360.component.scss"],
})
export class CustomerAccount360Component implements OnInit {
  @ViewChild("ngxLoading") ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public currentPath = "topup-refinance-loan";
  public loading = true;
  public page: number;
  public pageSize: number;
  public decimalPlaces: string;
  public customerAccounts: CustomerAccountEntity[] = [];
  @Input() expanded;
  @Input() fromCustomer360;
  public customer: CustomerEntity;
  public today = new Date();
  public informationPayment: InformationsPaymentEntity;
  public notePayment: string;
  public amountPayment: number;
  public currentPathPayment = "customer-360-details";
  public errorCheck: boolean = false;
  @Input() transitionsAccountes;
  checkDisplay: boolean = false;
  public loan: LoanEntity = new LoanEntity();
  listDocuments: SettingDocumentTypeProductEntity[];
  LoanTemp: LoanEntity;
  public payedAmount: number;

  public isPayOut: boolean = false;
  /**
   *
   * @param customerAccountService CustomerAccount360Service
   * @param loanApprovalService LoanApprovalService
   * @param loanSharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   * @param modalService NgbModal
   * @param translate TranslateService
   * @param customer360Services Customer360Services
   * @param router Router
   */

  constructor(
    public customerAccountService: CustomerAccount360Service,
    public acmDevToolsServices: AcmDevToolsServices,
    public loanApprovalService: LoanApprovalService,
    public loanSharedService: SharedService,
    public devToolsServices: AcmDevToolsServices,
    public modalService: NgbModal,
    public translate: TranslateService,
    public customer360Services: Customer360Services,
    public router: Router,
    public settingService: SettingsService,
    public customer360Service: Customer360Services,
    public reportService: ReportingService,
    public gedService: GedServiceService,
    private dbService: NgxIndexedDBService
  ) {}

  ngOnInit() {
    this.customerAccounts = [];
    this.customer = this.loanSharedService.getCustomer();
    // TO DO DECIMAL CURRENCY
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(3);
    this.pageSize = 5;
    this.page = 1;
    let customerParam = new CustomerEntity();
    customerParam.customerIdExtern = this.customer.customerIdExtern;
    customerParam.id = this.customer.id;
    if(checkOfflineMode()){
      const key = 'getCustomerAccountsById_' + this.customer.id ;
      this.dbService.getByKey('data', key).subscribe((customerAccounts: any) => {
        if (customerAccounts === undefined) {
          this.devToolsServices.openToast(3, 'No customer Accounts saved for offline use');
        } else {
          this.customerAccounts = customerAccounts.data;
        }
        this.loading = false;
      });
    }
    else {
    this.customerAccountService.getCustomersAccount(customerParam).subscribe(
      (customerAccountEntity) => {
        if (customerAccountEntity.length === 0) {
          this.loading = false;
        }
        if (!this.fromCustomer360) {
          this.loan = this.loanSharedService.getLoan();
          customerAccountEntity.forEach(element => {
            if (this.loan.idLoanExtern !== element.loanId) {
              // load only the customer account different of the actual account
              this.customerAccounts.push(element);
              this.loading = false;
            } else {
              this.loading = false;
            }
          });
        }
        else {
          this.customerAccounts = customerAccountEntity;
          this.loading = false;
        }
      });
  }
  }

  /**
   * toggleCollapse
   */
  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  /**
   * methode to open the popup schedule
   * param content
   */
  async openLarge(content, item: CustomerAccountEntity) {
    this.modalService.open(content, {
      size: "xl",
    });
    if (item.statutId == "4") {
      let accountNumberExtern = item.accountNumberExtern;
      await this.customerAccountService
        .getCustomersPaymentAllocation(
          this.customer.customerIdExtern,
          accountNumberExtern
        )
        .subscribe((data) => {
          // load customer account
          item.scheduleDTOs = data;
        });
    }
  }
  /**
   * addTopupRefinanceLoan
   * @param item item
   */
  async addTopupRefinanceLoan(item) {
    const errorMessage: string[] = [];
    const loanEntity = new LoanEntity();
    loanEntity.idLoanExtern = item.loanId;
    loanEntity.customerId = item.customerId;
    loanEntity.idAccountExtern = item.cuAccountId;
    loanEntity.productDTO = new ProductEntity();
    loanEntity.productDTO.productIdAbacus = item.productIdAbacus;
    await this.customer360Services
      .checkSettingTopupValidityByLoan(loanEntity)
      .toPromise()
      .then((data) => {
        if (!data.maxAllowedTopupsValidity) {
          errorMessage.push("max_Allowed_topups_is_reached");
        }
        if (data.maxContinuousLateDaysOrMaxSeparateLateDaysValidity > 0) {
          errorMessage.push(
            "max_Continuous_Late_Days_Or_Max_Separate_Late_Days_reached"
          );
        }
        if (!data.minLoanPaymentPercentageValidity) {
          errorMessage.push("min_Loan_Payment_Percentage_not_reached");
        }
        if (!data.minPreviouslyIssuedLoansNumberValidity) {
          errorMessage.push("min_Previously_Issued_Loans_Number_not_reached");
        }
      });
    if (errorMessage.length !== 0) {
      this.acmDevToolsServices.openToastArrayMessages(1, errorMessage);
      return;
    }
    this.customer360Services
      .findLoanByIdExtern(item.loanId)
      .subscribe((data) => {
        data.openingBalance = item.balance;
        data.termPeriodNum = 0;
        data.paymentFreq = 1;
        let loan: LoanEntity = data;
        loan.productId = 1;
        loan.loanAssetsDtos = [];
        this.loanSharedService.setLoan(loan);
        this.loanSharedService.setCustomerAccount(item);
        this.router.navigate(["acm/topup-refinance-loan"]);
      });
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * DownLoad schedule
   */
  downloadSchedule(item: CustomerAccountEntity) {
    const loanScheduleEntity = new LoanScheduleEntity();
    const daterun = new Date();
    loanScheduleEntity.scheduleDTOs = item.scheduleDTOs;
    const loan = new LoanEntity();
    loan.accountNumber = item.account;
    loan.applyAmountTotal = Number(item.issueAmount);
    loan.customerNameNoPipe = this.customer.customerNameNoPipe;
    const customerEntity = new CustomerEntity();
    customerEntity.customerNumber = this.customer.customerNumber;
    loan.customerDTO = customerEntity;
    loan.loanId = item.acmLoanId;
    loanScheduleEntity.loanDTO = loan;
    this.loanApprovalService
      .reportingSchedule(loanScheduleEntity)
      .subscribe((res: any) => {
        const fileData = [res];
        const blob = new Blob(fileData, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.download =
          "schedule_" +
          daterun.getFullYear() +
          "-" +
          daterun.getMonth() +
          "-" +
          daterun.getDate() +
          "_" +
          daterun.getHours() +
          "-" +
          daterun.getMinutes();
        anchor.href = url;
        anchor.click();
      });
  }
  compareWithTodayDate(date: string): boolean {
    if (date.indexOf("/") !== -1) {
      const day = date.substring(0, 2);
      const month = date.substring(3, 5);
      const year = date.substring(6, 10);
      return this.today < new Date(year + "-" + month + "-" + Number(day));
    }
  }

  async openLargePayment(content, item: CustomerAccountEntity, isPayOut: boolean) {
    this.payedAmount = 0;
    this.checkDisplay = false;
    this.isPayOut = isPayOut;
    if (Number(item.statutId) == 4) {
      this.checkDisplay = true;
    }

    this.modalService.open(content, {
      size: "xl",
      backdrop: "static",
      keyboard: false,
    });

    this.errorCheck = false;
    if (this.loanSharedService.useExternalCBS === '1') {
      this.settingService.getInformationsPayment(Number(item.cuAccountId)).subscribe((res) => {
        this.informationPayment = res;
        this.amountPayment =
          this.informationPayment?.principalDue +
          this.informationPayment?.interestDue +
          this.informationPayment?.penaltyDue +
          this.informationPayment?.feesDue;

      });
    }
    else {
      if (isPayOut === true) {
        item.calculatePayOutFee = isPayOut;
      }
      this.customerAccountService.getAcmInformationsPayment(item).subscribe((res) => {
        this.informationPayment = res;
        this.informationPayment.scheduleDTOs = item.scheduleDTOs;
      });
    }
  }

  async openDocuments(content, item: CustomerAccountEntity) {
    const settingDocumentTypeProductEntity: SettingDocumentTypeProductEntity = new SettingDocumentTypeProductEntity();
    const settingDocumentTypeEntity: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentTypeEntity.categorie = 11;
    settingDocumentTypeProductEntity.settingDocumentTypeDTO = settingDocumentTypeEntity;

    await this.customer360Service
      .findLoanByIdExtern(Number(item.loanId))
      .toPromise()
      .then((data) => {
        this.LoanTemp = data;
        settingDocumentTypeProductEntity.productId = data.productId;
        this.gedService.findAllDocumentProduct(settingDocumentTypeProductEntity).subscribe((settingDocumentTypeProductEntities) => {
          this.listDocuments = settingDocumentTypeProductEntities;
        });
      }
      );


    this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
    });

  }

  async payment(
    notePayment: string,
    amountPayment: number,
    item: CustomerAccountEntity
  ) {
    await this.customer360Service
      .findLoanByIdExtern(Number(item.loanId))
      .toPromise()
      .then((data) => {
        if (data) {
          const paymentAbacusRequest: paymentAbacusRequestEntity =
            new paymentAbacusRequestEntity();
          paymentAbacusRequest.accountNumber = data.accountNumber;
          paymentAbacusRequest.amount = amountPayment;
          paymentAbacusRequest.notes = notePayment;
          paymentAbacusRequest.payFee = true;
          //case not issued
          if (Number(item.statutId) != 4) {
            const request2ndApiPayment: requestPaymentAbacusApiEntity =
              new requestPaymentAbacusApiEntity();
            request2ndApiPayment.paymentFrom = "ZTM";
            request2ndApiPayment.username = this.loanSharedService.getUser().login;
            request2ndApiPayment.notes = notePayment ? notePayment : "PaymentACM";
            request2ndApiPayment.cuAccountId = Number(item.cuAccountId);

            if (request2ndApiPayment.notes) {
              this.errorCheck = false;
              this.settingService;
              this.settingService
                .paymentApiAbacusLoanNotIssued(request2ndApiPayment)
                .subscribe((dataPayment) => {
                  if (dataPayment) {
                    this.devToolsServices.openToast(0, "alert.sucess_payment");
                    this.closeModal();
                  } else {
                    this.devToolsServices.openToast(3, "alert.error_payment");
                  }
                });
            } else {
              this.errorCheck = true;
              this.devToolsServices.openToast(3, "alert.check-data");
            }
          }
        }
      });
  }

  closeModal() {
    this.resetInputValues();
    this.modalService.dismissAll();
  }

  resetInputValues() {
    this.notePayment = null;
    this.amountPayment = 0;
  }

  async downloadTemplate(item) {
    if (item != null) {
      const reportDTO: ReportEntity = new ReportEntity();
      reportDTO.inputFileName = item.reportName;
      const listLoan: LoanEntity[] = [];
      listLoan.push(this.LoanTemp);
      reportDTO.entryList = listLoan;
      reportDTO.typeReport = 'CASE_CLOSURE_DOCUMENTS';
      this.reportService.downloadCustomReport(reportDTO).subscribe(
        (res: any) => {
          const fileData = [res];
          const blob = new Blob(fileData, { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        }
      );
    } else {
      this.devToolsServices.openToast(1, 'alert.file_type');
    }

  }


  deposit(notePayment, amountPayment, item: TransitionAccountEntity) {
    const parts = item.account.split(' - ');
    const accountNumb = parts[0];
    const paymentAbacusRequest: paymentAbacusRequestEntity =
      new paymentAbacusRequestEntity();
    paymentAbacusRequest.accountNumber = accountNumb;
    paymentAbacusRequest.amount = amountPayment;
    paymentAbacusRequest.notes = notePayment;
    paymentAbacusRequest.payFee = true;
    this.settingService
      .paymentAcmToAbacus(
        paymentAbacusRequest,
        this.loanSharedService.getUser().login,
        "ZTM", ''
      )
      .toPromise().then((data) => {
        if (data) {
          this.devToolsServices.openToast(0, "alert.sucess_payment");
          this.closeModal();
          this.ngOnInit();
        } else {
          this.devToolsServices.openToast(3, "alert.error_payment");
        }
      }
      ).catch((error) => {
        this.closeModal();
      });
  }
  /**
   * 
   * @param item 
   * @param paymentInformation 
   */
  pay(paymentInformation: InformationsPaymentEntity) {
    this.customerAccountService.pay(paymentInformation).subscribe((res)=>{
      this.devToolsServices.openToast(0, 'alert.success');
      this.modalService.dismissAll();
      this.ngOnInit();
    });
  }

  payOut(paymentInformation: InformationsPaymentEntity){
    this.customerAccountService.payOut(paymentInformation).subscribe((res)=>{
      this.devToolsServices.openToast(0, 'alert.success');
      this.modalService.dismissAll();
      this.ngOnInit();
    });
  }
 isOfflineModeEnabled() {
  return checkOfflineMode();
}
}
