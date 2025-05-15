import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { CustomerReceiptsEntity } from 'src/app/shared/Entities/CustomerReceipts.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { TransitionAccountService } from '../transition-account/transition-account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { checkOfflineMode, customRequiredValidator } from 'src/app/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { ReportEntity } from 'src/app/shared/Entities/report.entity';
import { ReportingService } from '../../GED/reporting.service';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmTransaction } from 'src/app/shared/Entities/AcmTransaction.entity';
import { CustomerAccount360Service } from '../customer-account-360/customer-account-360.service';
const PrimaryBleu = "var(--primary)";

@Component({
  selector: 'app-customer-receipts',
  templateUrl: './customer-receipts.component.html',
  styleUrls: ['./customer-receipts.component.sass']
})
export class CustomerReceiptsComponent implements OnInit {

  @ViewChild("ngxLoading") ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public page: number;
  public pageSize: number;
  public loading = true;
  public customer: CustomerEntity;
  public customerReceipts: CustomerReceiptsEntity[] = [];
  public modalForm: FormGroup;
  public useExternalCBS;

  public transactions: AcmTransaction[] = [];

  @Input() expanded;

  constructor(public sharedService: SharedService, public transitionAccountService: TransitionAccountService, public modalService: NgbModal, public formBuilder: FormBuilder,
    public translate: TranslateService, public reportService: ReportingService, public devToolsServices: AcmDevToolsServices,private dbService: NgxIndexedDBService,
    public loanSharedService: SharedService,
    public customerAccount360Service: CustomerAccount360Service
  ) { }

  async ngOnInit() {
    this.customer = this.sharedService.getCustomer();
    this.pageSize = 5;
    this.page = 1;
    if(checkOfflineMode()){
      const data = await this.dbService.getByKey('data','getCustomerReceipts_' + this.customer.id).toPromise() as any;
      if (data === undefined) {
        this.devToolsServices.openToast(3, 'No customer receipts saved for offline use');
      } else {
        this.customerReceipts = data.data;
      }
      this.loading = false;
    } else {
    this.useExternalCBS = this.sharedService.useExternalCBS;
    if (this.useExternalCBS === '1') {
      this.transitionAccountService.getCustomerReceipts(this.customer.customerIdExtern).subscribe(res => {
        if (res.length > 0) {
          this.customerReceipts = res;
        }
        this.loading = false;
      })
    }
    else {
      this.transitionAccountService.findAcmCustomerReceipts(this.customer.id).subscribe(res => {
        if (res.length > 0) {
          this.customerReceipts = res;
        }
        this.loading = false;
    })
  }
  }
}
  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  getDirection() {
    return AppComponent.direction;
  }


  closeModal() {
    this.modalService.dismissAll();
  }
  async openLarge(content, item) {
    this.modalForm = this.formBuilder.group({
      item: [item, customRequiredValidator],
      confirm: ["", customRequiredValidator]
    });

    this.modalService.open(content, {
      size: "md",
    });

  }
  printReceipt() {
    if (this.modalForm.valid) {
      const item = this.modalForm.controls['item'].value;

      const reportDTO: ReportEntity = new ReportEntity();
      reportDTO.inputFileName = AcmConstants.CUSTOMER_RECEIPT_DOCUMENT;
      const listLoan: LoanEntity[] = [];
      const loan = new LoanEntity();
      loan.loanId = item.receiptNo;
      listLoan.push(loan);
      reportDTO.entryList = listLoan;
      this.reportService.downloadCustomReport(reportDTO).subscribe(
        (res: any) => {
          const fileData = [res];
          const blob = new Blob(fileData, { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          this.modalService.dismissAll();
        }
      );
    }
  }


  openTransactionDetails(content, item) {
    let acmTransaction: AcmTransaction = new AcmTransaction();
    acmTransaction.receiptNumber = item.receiptNo;
    acmTransaction.idAcmCustomer = this.customer.id;
    acmTransaction.transactionType = "paiement;Loan issue"
    this.customerAccount360Service.findTransaction(acmTransaction).subscribe((res) => {
      this.transactions = res;
    })
    this.modalService.open(content, {
      size: "lg",
    });
  }

}
