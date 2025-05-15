import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanDetailsServices } from '../loan-details/loan-details.services';
import { CustomerEditComponent } from '../../Customer/customer-edit/customer-edit.component';
import { LoanProcessComponent } from '../loan-process/loan-process.component';
import { DashbordServices } from '../dashbord/dashbord.services';
import { MatDialog } from '@angular/material/dialog';
import { SettingCollectionValidationComponent } from '../../Settings/setting-collection-validation/setting-collection-validation.component';
import { UploadItemComponent } from '../../GED/upload-item/upload-item.component';
import { checkOfflineMode } from 'src/app/shared/utils';
import { SettingsService } from '../../Settings/settings.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-complete-data',
  templateUrl: './complete-data.component.html',
  styleUrls: ['./complete-data.component.sass'],
})
export class CompleteDataComponent implements OnInit, OnDestroy {
  currentJustify2 = 'justified';
  public loan: LoanEntity = new LoanEntity();
  public currentPath = 'loan-details';
  public loanProcessEntitys: LoanProcessEntity[] = [];
  public orderProcess: number;
  public currentStatus: number;
  public changeCustomer = false;
  public changeLoan = false;
  public customer: CustomerEntity = new CustomerEntity();
  @ViewChild(CustomerEditComponent) customerEditComponent: CustomerEditComponent;
  @ViewChild(LoanProcessComponent, { static: true }) loanProcess: LoanProcessComponent;
  public load = true;
  @ViewChild(SettingCollectionValidationComponent)
  settingCollectionValidationComponent: SettingCollectionValidationComponent;
  public source: string;
  public isLoan = true;
  categoryLoan = 'complete data';
  @ViewChild(UploadItemComponent)
  uploadItemComponent: UploadItemComponent;
  public saveFilesAction = true;
  public originSource: string;
  public lengthDocuments: number;
  expanded = true;
  checkRequiredDocument = false;
  checkNavigate = false;
  fromNextButton: boolean = false;
  offline = false;
  public showDisbursmentCardInformation : boolean;
  //expand: Boolean = false;

  /**
   * constructor
   * @param loanDetailsServices LoanDetailsServices
   * @param route ActivatedRoute
   * @param modalService NgbModal
   * @param router Router
   * @param loanSharedService LoanSharedService
   * @param dialog MatDialog
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   * @param dashbordService DashbordServices
   */
  constructor(public loanDetailsServices: LoanDetailsServices, public route: ActivatedRoute,
    public modalService: NgbModal, public router: Router, public loanSharedService: SharedService,
    public dialog: MatDialog, public devToolsServices: AcmDevToolsServices, public formBuilder: FormBuilder,private dbService: NgxIndexedDBService,
    public translate: TranslateService, public dashbordService: DashbordServices, public activatedRoute: ActivatedRoute,public settingsService: SettingsService,) {
  }
  ngOnDestroy(): void {
    this.loanSharedService.screenSource = null;
  }
  async ngOnInit() {
    this.loan = this.loanSharedService.getLoan();
    this.customer = this.loanSharedService.getCustomer();
    this.loanProcessEntitys = this.loan.loanInstancesDtos;
    this.loanProcessEntitys.forEach(element => {
      if (element.code === this.loan.etapeWorkflow) {
        this.orderProcess = element.orderEtapeProcess;
      }
      if (element.ihmRoot === this.currentPath) {
        this.currentStatus = element.code;
      }
    });
    await this.activatedRoute.queryParams.subscribe((params) => {
      this.source = params.source;
      this.offline = params.offline;
    });
    if(checkOfflineMode()){
      const environments = await this.dbService.getByKey('data','envirement-values-by-keys').toPromise() as any;
      if(environments !== undefined){
        const env = environments.data.filter(item => item.key === AcmConstants.DISBURSMENT_CARD);
        if(env.length > 0){
          this.showDisbursmentCardInformation = env[0].enabled;
        }
      }
    } else {
    const acmEnvironmentKeys: string[] = [AcmConstants.DISBURSMENT_CARD]
    this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
      this.showDisbursmentCardInformation = environments[0].enabled;
    });
  }
  }

  /**
   * Methode to next step
   */
  nextStep() {
    this.checkNavigate = false;

    if (!this.checkRequiredDocument && this.loan.etapeWorkflow > 23) {
      this.devToolsServices.openToast(3, 'alert.enter_required_documents');
      return;
    }
    else {
      this.fromNextButton = true;
      this.submitCustomer();
    }

  }

  /**
   * Methode exit
   */
  exit() {
    this.loanSharedService.exitFromLoan(this.loan);
  }

  /**
   * SubmitCustomer
   */
  submitCustomer() {


    if (this.loanSharedService.form.formGroup.invalid || this.customerEditComponent.customerAddress.addressForm.invalid ||
      this.customerEditComponent.customerRelationShipForm.invalid || this.customerEditComponent.udfForm.invalid  ) {
        this.devToolsServices.InvalidControl();
      return;
    }
    if (!this.checkRequiredDocument ) {
      this.devToolsServices.openToast(3, 'alert.enter_required_documents');
      return;
    }



    if (this.loanSharedService.form.formGroup.invalid || this.customerEditComponent.customerAddress.addressForm.invalid ||
      this.customerEditComponent.customerRelationShipForm.invalid || this.customerEditComponent.udfForm.invalid  ) {
        this.devToolsServices.InvalidControl();
      return;
    }
    if (!this.checkRequiredDocument ) {
      this.devToolsServices.openToast(3, 'alert.enter_required_documents');
      return;
    }

    this.devToolsServices.makeFormAsTouched(this.customerEditComponent.udfForm);
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      this.devToolsServices.makeFormAsTouched(this.loanSharedService.form.formGroup);
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerAddress.addressForm);
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerRelationShipForm);
      if(this.showDisbursmentCardInformation){
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerDisbursementComponent.formDisbursement);
      }
      if (this.loanSharedService.form.formGroup.valid && this.customerEditComponent.customerAddress.addressForm.valid &&
        this.customerEditComponent.customerRelationShipForm.valid && this.customerEditComponent.udfForm.valid &&
       ( this.customerEditComponent.customerDisbursementComponent.formDisbursement.valid || !this.showDisbursmentCardInformation)) {
        this.customerEditComponent.updateCustomer(this.loan.customerDTO).then((data) => {
          if (data) {
            this.devToolsServices.openToast(0, 'alert.success');

            if (this.checkRequiredDocument && this.fromNextButton) {
              this.nextScreen();
              this.fromNextButton = false;
            }
          }
        });
      } else {
        this.devToolsServices.openToast(3, 'alert.check-data');
        this.devToolsServices.backTop();
        return;
      }
    } else if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerOrganizartionForm);
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerAddress.addressForm);
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerRelationShipForm);
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerLinkOrgForm);
      if (this.customerEditComponent.customerOrganizartionForm.valid && this.customerEditComponent.customerAddress.addressForm.valid
        && this.customerEditComponent.customerLinkOrgForm.valid && this.customerEditComponent.customerRelationShipForm.valid
        && this.customerEditComponent.udfForm.valid) {
        this.customerEditComponent.updateCustomer(this.loan.customerDTO).then((data) => {
          if (data) {
            this.devToolsServices.openToast(0, 'alert.success');
            if (this.checkRequiredDocument && this.fromNextButton) {
              this.nextScreen();
              this.fromNextButton = false;
            }
          }
        });
      } else {
        this.devToolsServices.openToast(3, 'alert.check-data');
        this.devToolsServices.backTop();
        return;
      }
    }

    this.changeCustomer = false;
        
      this.save();
    

  }
  nextScreen() {
    this.changeCustomer = false;
    this.devToolsServices.makeFormAsTouched(this.customerEditComponent.udfForm);
    if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      this.devToolsServices.makeFormAsTouched(this.loanSharedService.form.formGroup);
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerAddress.addressForm);
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerRelationShipForm);
      if (this.loanSharedService.form.formGroup.valid && this.customerEditComponent.customerAddress.addressForm.valid &&
        this.customerEditComponent.customerRelationShipForm.valid && this.customerEditComponent.udfForm.valid) {
        this.checkNavigate=true;
        this.router.navigate([AcmConstants.ROUTE_COMPLETE_LOAN_DETAILS]);
      }
    } else if (this.customer.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerOrganizartionForm);
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerAddress.addressForm);
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerRelationShipForm);
      this.devToolsServices.makeFormAsTouched(this.customerEditComponent.customerLinkOrgForm);
      if (this.customerEditComponent.customerOrganizartionForm.valid && this.customerEditComponent.customerAddress.addressForm.valid
        && this.customerEditComponent.customerLinkOrgForm.valid && this.customerEditComponent.customerRelationShipForm.valid
        && this.customerEditComponent.udfForm.valid) {
        this.checkNavigate = true;
      }
    }
    // save documents
    this.save();
  }
  /**
   * check Customer if changed
   * @param event boolean
   */
  checkCustomer(event: boolean) {
    this.customer.updateCustomer = event;
  }

  /**
   * check if any forms of customer changed
   * @param event boolean
   */
  changeFormsCustomer(event: boolean) {
    this.changeCustomer = true;
  }

  /**
   * check if any forms of loan changed
   * @param event boolean
   */
  changeFormsLoan(event: boolean) {
    this.changeLoan = true;
  }

  /**
   * check Loading
   * @param $event boolean
   */
  checkLoading($event: boolean) {
    this.load = $event;

  }
  /**
   * Display the confirmation message
   */
  save(source?: string) {
    // send origin source as 'click on save button' or 'click on complete button'
    this.originSource = source;
    this.saveFilesAction = !this.saveFilesAction;
  }

  receiveLengthDocuments(number: number) {
    this.lengthDocuments = number;
    /* if (number > 0 ) {
      this.expand = true;
    } */
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }
  /**
   * check required
   * param event
   */
  checkRequiredDocumentParent(event) {
    if (event === 0) {
      this.checkRequiredDocument = true;
    } else {
      this.checkRequiredDocument = false;
    }
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }

  saveDocumentsDone(event) {
    if (this.checkNavigate === true)
      this.router.navigate([AcmConstants.ROUTE_COMPLETE_LOAN_DETAILS]);
  }

  
}
