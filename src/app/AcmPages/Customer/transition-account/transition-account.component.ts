import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from "ngx-loading";
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SharedService } from 'src/app/shared/shared.service';
import { SettingsService } from '../../Settings/settings.service';
import { TransitionAccountEntity } from 'src/app/shared/Entities/transition.account.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { AppComponent } from 'src/app/app.component';
import { TransitionAccountService } from './transition-account.service';
import { CustomerAccountEntity } from 'src/app/shared/Entities/customer.account.entity';
import { paymentAbacusRequestEntity } from 'src/app/shared/Entities/paymentAbacusRequest.entity';
import { error } from 'console';
import { checkOfflineMode, customPatternValidator, customRequiredValidator } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';



const PrimaryBleu = "var(--primary)";

@Component({
  selector: 'app-transition-account',
  templateUrl: './transition-account.component.html',
  styleUrls: ['./transition-account.component.scss']
})
export class TransitionAccountComponent implements OnInit {

  @ViewChild("ngxLoading") ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public currentPath = "topup-refinance-loan";
  public loading = false;
  public page: number;
  public pageSize: number;
  public decimalPlaces: string;
  public transitionAccounts: TransitionAccountEntity[] = [];
  @Input() expanded;
  @Input() fromCustomer360;
  public today = new Date();
  public customer: CustomerEntity;
  public currentPathPayment = "customer-360-details";
  public errorCheck: boolean = false;
  public selectedPayment: TransitionAccountEntity = new TransitionAccountEntity();
  public notePayment: string;
  public amountPayment: number;
  public depositForm: FormGroup;
  public nonZeroNumberPattern = /^(?!0$)\d+$/

  /**
   *
   * @param loanSharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   * @param modalService NgbModal
   * @param translate TranslateService
   * @param router Router
   */

  constructor(
    public acmDevToolsServices: AcmDevToolsServices,
    public loanSharedService: SharedService,
    public devToolsServices: AcmDevToolsServices,
    public modalService: NgbModal,
    public translate: TranslateService,
    public router: Router,
    public settingService: SettingsService,
    public sharedService: SharedService,
    public transitionAccountService: TransitionAccountService,
    private dbService: NgxIndexedDBService,
    public formBuilder: FormBuilder

  ) { }

  async ngOnInit() {
    this.customer = this.loanSharedService.getCustomer();
    // TO DO DECIMAL CURRENCY
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(3);
    this.pageSize = 5;
    this.page = 1;
    if(checkOfflineMode()){
    const data = await this.dbService.getByKey('data','getTransactionAccounts_' + this.customer.id).toPromise() as any;
    if (data === undefined) {
      this.devToolsServices.openToast(3, 'No transaction account saved for offline use');
    } else {
      this.transitionAccounts = data.data;
    }
    this.loading = false;
  } else {    if (this.sharedService.useExternalCBS === '1') {
      this.transitionAccountService.getTransitionsAccount(this.customer.customerIdExtern)
        .subscribe((transitionAccountEntity) => {
          if (transitionAccountEntity.length === 0) {
            this.loading = false;
          } else {
            this.transitionAccounts = transitionAccountEntity;
          }
        }, (error) => {
          console.error("Error fetching transition accounts:", error);
        }, () => {
          this.loading = false;
        });
    }
    }
  }



  /**
 * toggleCollapse
 */
  toggleCollapse() {
    this.expanded = !this.expanded;
  }


  async openLargePayment(content, item: TransitionAccountEntity) {
    this.createForm();
    this.selectedPayment = item;
    this.modalService.open(content, {
      size: "s",
      backdrop: "static",
      keyboard: false,
    });

  }
  createForm(){
    this.depositForm = this.formBuilder.group({
      amountPayment: ['', [customRequiredValidator,customPatternValidator(this.nonZeroNumberPattern)]],
      notePayment: ['', customRequiredValidator],
    });
  }


payment(notePayment,amountPayment, item: TransitionAccountEntity) {

  this.validateForm()
  if(this.depositForm.valid){
  const paymentAbacusRequest: paymentAbacusRequestEntity =
  new paymentAbacusRequestEntity();
paymentAbacusRequest.accountNumber = item.accountNumber;
paymentAbacusRequest.amount = this.depositForm.value.amountPayment;
paymentAbacusRequest.notes = this.depositForm.value.notePayment;
paymentAbacusRequest.payFee = true;
  this.settingService
  .savingDeposit(
    paymentAbacusRequest,
    this.sharedService.getUser().login,
    "ZTM"
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
}

validateForm() {
  Object.values(this.depositForm.controls).forEach((control: AbstractControl) => {
    control.markAsTouched();
    control.updateValueAndValidity();
   });
  }
   /**
   * Get Direction
   */
   getDirection() {
    return AppComponent.direction;
  }


  closeModal() {
    this.resetInputValues();
    this.modalService.dismissAll();
  }

  resetInputValues() {
    this.depositForm.reset({
      amountPayment: 0,
      notePayment: null,
    });
}
}
