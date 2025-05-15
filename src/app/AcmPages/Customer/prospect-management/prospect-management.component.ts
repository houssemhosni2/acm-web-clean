import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmIhmValidatorEntity } from 'src/app/shared/Entities/acmIhmValidator.entity';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { BrancheEntity } from 'src/app/shared/Entities/branche.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { SupplierPaginationEntity } from 'src/app/shared/Entities/Supplier.pagination.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { UserDefinedFieldListValuesEntity } from 'src/app/shared/Entities/userDefinedFieldListValues.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { SettingFieldService } from '../../Settings/setting-fields.service';
import { checkOfflineMode, generateUniqueID } from 'src/app/shared/utils';
import { SettingsService } from '../../Settings/settings.service';
import { SupplierService } from '../../Supplier/supplier.service';
import { CustomerAddressComponent } from '../customer-address/customer-address.component';
import { CustomerManagementService } from '../customer-management/customer-management.service';
import { UdfStepWorkflowComponent } from '../../Loan-Application/udf-step-workflow/udf-step-workflow.component';
import {customRequiredValidator,customEmailValidator,customPatternValidator,isTodayGt} from '../../../shared/utils';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { SettingListValuesEntity } from 'src/app/shared/Entities/settingListValues.entity';
import { ProspectionListValueEntity } from 'src/app/shared/Entities/ProspectionListValue.entity';
import { DatePipe } from '@angular/common';
import { AcmAmlListSetting } from 'src/app/shared/Entities/AcmAmlListSetting.entity';
import { ScreeningStepService } from '../../Loan-Application/screening-step/screening-step.service';
@Component({
  selector: 'app-prospect-management',
  templateUrl: './prospect-management.component.html',
  styleUrls: ['./prospect-management.component.sass']
})
export class ProspectManagementComponent implements OnInit {
  public addProspectForm: FormGroup;
  public brancheEntitys: BrancheEntity[];
  public supplierEntity: SupplierEntity[];
  // public udfFields: UserDefinedFieldsEntity[] = [];
  public emailMask = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
  public nationalityList: UserDefinedFieldListValuesEntity[] = [];
  public supplierCheck = false;
  public customer = new CustomerEntity();
  public branchManager: UserEntity;
  public ListAddress: AddressEntity[] = [];
  public updateMode = '';
  public currentUser = new UserEntity();
  public supplierEntitys: SupplierEntity[] = [];
  public supplierPaginationEntity: SupplierPaginationEntity = new SupplierPaginationEntity();
  maxNationalId: number;
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  @ViewChild(CustomerAddressComponent, { static: true }) customerAddress: CustomerAddressComponent;
  nationalityIdMask;
  telephoneMask;
  public phoneNumberMaskLength: number;
  ProspectionListValues : ProspectionListValueEntity[]= [];
  public amlListSettings: AcmAmlListSetting[] = [];

  constructor(public formBuilder: FormBuilder, public settingsService: SettingsService, public screeningStepService: ScreeningStepService,
    public customerManagementService: CustomerManagementService,    public dateFormatterService: DateFormatterService,
    public devToolsServices: AcmDevToolsServices, public router: Router,public route: ActivatedRoute,private datePipe: DatePipe,
    public sharedService: SharedService, private supplierService: SupplierService, public settingFieldService: SettingFieldService,
    private dbService: NgxIndexedDBService) { }



 async ngOnInit() {
  this.createProspectForm();
  this.route.queryParams.subscribe(params => {
    if (params !== undefined) {
      if (params.source === 'add') {
       this.updateMode = 'add' ;
      }else{
        this.updateMode =  'edit';
      }
    }
  });
  if(checkOfflineMode()){
   await this.dbService.getByKey('data','settingListValue_'+AcmConstants.PROSPECTION_LIST).subscribe((values:any)=>{
    if(values){
      this.fillProspectionListValues(values.data);
     }
   })
    
  } else {
    let settingListValuesEntity: SettingListValuesEntity = new SettingListValuesEntity();
    settingListValuesEntity.listName = AcmConstants.PROSPECTION_LIST;

    await this.settingsService.getSettingListValues(settingListValuesEntity).toPromise().then((res) => {
      if(res){
      this.fillProspectionListValues(res);
      }
    })
    await this.settingsService.findAMLListSetting(new AcmAmlListSetting()).toPromise().then((res) => {
      this.amlListSettings = res.map(item => ({ ...item, listName: item.listName.replaceAll("_", " ") }));
    })
  }
   
    // this.forkJoinFunction();
    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'branches-list').subscribe((branches: any) => {
        if (branches === undefined) {
          this.devToolsServices.openToast(3, 'No bracnhes saved for offline use');
        } else {
          this.brancheEntitys = branches.data;
        }
      });

      this.dbService.getByKey('data', 'ihm-validators').subscribe((patterns: any) => {
        if (patterns === undefined) {
          this.devToolsServices.openToast(3, 'No validators saved for offline use');
        } else {
          this.ihmValidators(patterns.data);
          this.createProspectForm();
          this.getConnectedUser();
        }
      });
    } else {
      // Find Branch
    await  this.settingFieldService.getIhmValidators(new AcmIhmValidatorEntity()).subscribe((patterns) => {
        this.ihmValidators(patterns);
         this.settingsService.findBranche().subscribe(
          (data) => {
            this.brancheEntitys = data; 
            if (this.updateMode === 'edit') {
              this.updateProspectForm()
            }else {
              this.createProspectForm();
            }
          }
        );
        this.getConnectedUser();
      });
    }
    }



  /**
   * The function sets regular expression patterns for telephone numbers, national IDs, and email
   * addresses, and calculates the maximum length for national IDs and phone numbers.
   * @param patterns - an array of objects containing different regular expression patterns for
   * validating different types of input fields such as telephone numbers, national IDs, and email
   * addresses.
   */
  ihmValidators(patterns) {
    this.telephoneMask = new RegExp(patterns.find(x => x.codeValidator === AcmConstants.TELEPHONE_MASK).parameter);
    this.nationalityIdMask = new RegExp(patterns.find(x => x.codeValidator === AcmConstants.NATIONAL_ID_MASK).parameter);
    this.emailMask = new RegExp(patterns.find(x => x.codeValidator === AcmConstants.EMAIL_MASK).parameter);

    // length mobile number4
    this.telephoneMask.source.match(/\d+/g).map(Number).forEach(element => {
      this.phoneNumberMaskLength = element ;
    });

    this.nationalityIdMask.source.match(/\d+/g).map(Number).forEach(element => {
      this.maxNationalId = element ;
    });
  }

  /**
   * getConnectedUser
   */
  async getConnectedUser() {
    this.currentUser = this.sharedService.getUser();
  }

  /**
   * create Individual form
   */
  createProspectForm() {
    this.addProspectForm = this.formBuilder.group({
      sourceProspection: ['', [customRequiredValidator]],
      namePart1: ['', [customRequiredValidator, customPatternValidator(/^[a-zA-Z\u0600-\u06FF ]*$/)]],
      namePart2: ['', [customPatternValidator(/^[a-zA-Z\u0600-\u06FF ]*$/)]],
      namePart3: ['', [customPatternValidator(/^[a-zA-Z\u0600-\u06FF ]*$/)]],
      namePart4: ['', [customRequiredValidator, customPatternValidator(/^[a-zA-Z\u0600-\u06FF ]*$/)]],
      mobile: ['', [customRequiredValidator, customPatternValidator(this.telephoneMask)]],
      email: ['', [customEmailValidator(this.emailMask)]],
      branch: ['', customRequiredValidator],
      gender: ['', customRequiredValidator],
      national_id: ['', [customPatternValidator(this.nationalityIdMask)]],
      birthday: [''],
      supplier: [''],
      prospectionComment: ['']
    }, {
      validators: (group: FormGroup) => {
        const sourceProspectionValue = group.get('sourceProspection').value;
        const supplierValue = group.get('supplier').value;
        if (sourceProspectionValue === AcmConstants.FOURNISSEUR && !supplierValue) {
          return { supplierRequired: true };
        }
        return null;
      }
    });
  }

  selectSourceProspection(event :any) {
    this.addProspectForm.controls.sourceProspection.setValue(event.target.value);
    if (this.addProspectForm.controls.sourceProspection.value === AcmConstants.FOURNISSEUR) {
      this.supplierCheck = true;
      this.supplierPaginationEntity.params = new SupplierEntity();
      this.supplierPaginationEntity.params.statusNotContracted = AcmConstants.SUPPLIER_NON_CONTRACTED;
      this.supplierPaginationEntity.params.statusRejected = AcmConstants.SUPPLIER_REJECTED;
      this.supplierPaginationEntity.pageSize = 50;

      if (checkOfflineMode()) {
        this.dbService.getByKey('data', 'supplier-pagination').subscribe((suppliers: any) => {
          if (suppliers === undefined) {
            this.devToolsServices.openToast(3, 'No suppliers saved for offline use');
          } else {
            this.supplierEntitys = suppliers.data.resultsSuppliers;
          }
        });
      } else {
        this.supplierService.getSupplierPagination(this.supplierPaginationEntity).subscribe(
          (data) => {
            this.supplierEntitys = data.resultsSuppliers;
          });
      }


    } else {
      this.supplierCheck = false;
    }
  }

  /**
   * join list of observables
   */
  // forkJoinFunction() {
  //   // get udf list
  //   for (let i = 0; i < 4; i++) {
  //     this.udfFields[i] = new UserDefinedFieldsEntity();
  //     this.udfFields[i].fieldListValuesDTOs = [];
  //   }
  //   const userDefinedFieldsEntity: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
  //   const userDefinedFieldGroupDTO: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
  //   userDefinedFieldGroupDTO.code = AcmConstants.CUSTOMER_NATIONALITY_CODE;
  //   userDefinedFieldsEntity.userDefinedFieldGroupDTO = userDefinedFieldGroupDTO;
  //   forkJoin([
  //     this.customerManagementService.getUdfField(userDefinedFieldsEntity)
  //   ]).subscribe(result => {
  //     // udf field
  //     this.udfFieldList(result[0]);
  //   });
  // }

  // udfFieldList(data) {
  //   this.udfFields = data;
  //   if (this.udfFields.length > 0) {
  //     this.nationalityList = this.udfFields
  //       .filter(value => value.name === AcmConstants.NATIONALITY)[0].fieldListValuesDTOs;
  //   }
  // }

  exit() {
    this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.DASHBOARD_URL);
  }
  public dateG: NgbDate;
  public issuedateG: NgbDate;
  public emptyIssueDate = false;
  public expirydateG: NgbDate;
  public differencePeriodIssueDate = 0;
  public emptyExpiry = false;
  public expirydateH: NgbDateStruct;


  convertExpiryDateToHijri() {
    this.expirydateH = this.dateFormatterService.ToHijri(this.expirydateG);
    this.emptyExpiry = false;
  }


  async onSubmit() {

    
    this.devToolsServices.makeFormAsTouched(this.addProspectForm);
    this.devToolsServices.makeFormAsTouched(this.udfStepWorkflowComponent.udfLoanForm);
     if (!this.addProspectForm.valid || !this.udfStepWorkflowComponent.udfLoanForm.valid) {
      this.devToolsServices.openToast(3, 'alert.check-data');
      //this.devToolsServices.backTop();
      this.devToolsServices.InvalidControl();
    } else {
      this.customer.prospectionSource = this.addProspectForm.controls.sourceProspection.value;
      if (this.addProspectForm.controls.sourceProspection.value === AcmConstants.FOURNISSEUR) {
        this.customer.supplierRecommandation = this.addProspectForm.controls.supplier.value.id
      }
      else{
        this.customer.prospectionComment = this.addProspectForm.controls.prospectionComment.value
      }
      this.customer.userDefinedFieldsLinksDTOs =this.udfStepWorkflowComponent.onSubmitElement();
      this.customer.firstName = this.addProspectForm.controls.namePart1.value;
      this.customer.secondName = this.addProspectForm.controls.namePart2.value;
      this.customer.middleName = this.addProspectForm.controls.namePart3.value
      this.customer.lastName = this.addProspectForm.controls.namePart4.value;
      this.customer.customerName = this.addProspectForm.controls.namePart1.value + '|' + this.addProspectForm.controls.namePart2.value
        + '|' + this.addProspectForm.controls.namePart3.value + '|' + this.addProspectForm.controls.namePart4.value;
      this.customer.branchId = this.addProspectForm.controls.branch.value.id;
      this.customer.branchesName = this.addProspectForm.controls.branch.value.name;
      this.customer.branchesDescription = this.addProspectForm.controls.branch.value.description;
      this.customer.telephone = this.addProspectForm.controls.mobile.value;
      this.customer.telephone1 = this.addProspectForm.controls.mobile.value;
      this.customer.gender = this.addProspectForm.controls.gender.value;
      this.customer.identity = this.addProspectForm.controls.national_id.value
      this.customer.email = this.addProspectForm.controls.email.value;
      this.customer.accountPortfolioID = this.currentUser.accountPortfolioId;
      this.customer.accountPortfolioDescription = this.currentUser.fullName;
      this.customer.accountPortfolioCode = this.currentUser.login;
      this.customer.dateOfBirth = this.addProspectForm.controls.birthday.value;
      this.customer.customerIdExtern = 0;
      if (this.updateMode === 'edit') {
        this.customer.id = this.sharedService.getCustomer().id;
      }
      // const nationality: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      // nationality.userDefinedFieldsDTO = this.udfFields.filter(value => value.name === AcmConstants.NATIONALITY)[0];
      // nationality.udfListValueId = this.udfFields.filter(value => value.name === 'Nationality')[0].idUDFListValue;
      // nationality.fieldValue = (this.addProspectForm.controls.nationality) !== undefined &&
      //   this.addProspectForm.controls.nationality.value !== null ?
      //   this.addProspectForm.controls.nationality.value.idUDFListValue : null;
      // nationality.indexGroup = 1;
      // this.customer.userDefinedFieldsLinksDTOs.push(nationality);

      this.customer.customerType = AcmConstants.CUSTOMER_CATEGORY_PROSPECT;

      if (checkOfflineMode()) {

      const newProspect =  await this.dbService.add('prospects', this.customer).toPromise();


      const prospects =  await this.dbService.getByKey('customers-pagination', 'customers-list').toPromise() as any;

        prospects.resultsCustomers.unshift(newProspect);

        await this.dbService.update('customers-pagination', prospects).toPromise();
        
        this.router.navigate([AcmConstants.PROSPECT_LIST_URL], { queryParams: { mode: 5 } });

      } else {

        await this.customerManagementService.saveProspect(this.customer).toPromise().then(resultEntity => {
          this.devToolsServices.openToast(0, 'alert.success');
          // this.router.navigate([AcmConstants.DASHBOARD_URL]);
          this.router.navigate([AcmConstants.PROSPECT_LIST_URL], { queryParams: { mode: 5 } });
        });
        this.router.navigate([AcmConstants.PROSPECT_LIST_URL], { queryParams: { mode: 5 } });

      }
    }

  
  }
  checkMobileNumberInput(){
    const inputValue = this.addProspectForm.controls.mobile.value.replace(/[^0-9]/g, '');
    this.addProspectForm.controls.mobile.setValue(inputValue)
  }
  checkNatioanlIdInput(){
    const inputValue = this.addProspectForm.controls.national_id.value.replace(/[^0-9]/g, '');
    this.addProspectForm.controls.national_id.setValue(inputValue)
  }
  externalSubmit(){    
    this.validateForm();
    this.onSubmit();
  }
  validateForm() {
      Object.values(this.addProspectForm.controls).forEach((control: AbstractControl) => {
          control.markAsTouched();
          control.updateValueAndValidity();
      });
  }

  fillProspectionListValues(listSetting){
    listSetting.forEach(setting=>{
      let prospectionListValue = new ProspectionListValueEntity();
      const valueJson = JSON.parse(setting.valueJson);
      prospectionListValue.description = valueJson.description;
      prospectionListValue.value = valueJson.value;
      this.ProspectionListValues.push(prospectionListValue);
    })
  }

   updateProspectForm() {
    const customer = this.sharedService.getCustomer();
    const selectedBranch = this.brancheEntitys.find(b => b.branchID === customer.branchId);
    const selectedProspection = this.ProspectionListValues.find(b => b.value === customer.prospectionSource) || { value: '', description: '' };
  
    this.addProspectForm = this.formBuilder.group({
      sourceProspection: [selectedProspection.value || '', [customRequiredValidator]],
      namePart1: [customer.firstName || '', [customRequiredValidator, customPatternValidator(/^[a-zA-Z\u0600-\u06FF ]*$/)]],
      namePart2: [customer.secondName || '', [customPatternValidator(/^[a-zA-Z\u0600-\u06FF ]*$/)]],
      namePart3: [customer.middleName || '', [customPatternValidator(/^[a-zA-Z\u0600-\u06FF ]*$/)]],
      namePart4: [customer.lastName || '', [customRequiredValidator, customPatternValidator(/^[a-zA-Z\u0600-\u06FF ]*$/)]],
      mobile: [customer.telephone1 || '', [customRequiredValidator, customPatternValidator(this.telephoneMask)]],
      email: [customer.email || '', [customEmailValidator(this.emailMask)]],
      branch: [selectedBranch || '', customRequiredValidator],
      gender: [customer.gender || '', customRequiredValidator],
      national_id: [customer.identity || '', [customPatternValidator(this.nationalityIdMask)]],
      birthday: [this.datePipe.transform(customer.dateOfBirth, 'yyyy-MM-dd') || ''],
      supplier: [''],
      prospectionComment: [customer.prospectionComment]
    }, {
      validators: (group: FormGroup) => {
        const sourceProspectionValue = group.get('sourceProspection').value;
        const supplierValue = group.get('supplier').value;
        if (sourceProspectionValue === AcmConstants.FOURNISSEUR && !supplierValue) {
          return { supplierRequired: true };
        }
        return null;
      }
      
    });

  }
  
    async customerUpdate() {
      const acmEnvironmentKeys: string[] = [AcmConstants.CONVERTIR_PROSPECT_AML];
      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
        let ConvertirProspectAml = environments[0].enabled;
        if (ConvertirProspectAml) { 
         if (environments[0].value === '1') {
          let disabled = false;
          let customer: CustomerEntity = new CustomerEntity();
          customer = this.sharedService.getCustomer();
          customer.customerNameNoPipe = '';
          if (this.addProspectForm.controls.namePart1 !== undefined) {
            customer.customerNameNoPipe +=this.addProspectForm.controls.namePart1.value ;
          }
          if (this.addProspectForm.controls.namePart2 !== undefined) {
            customer.customerNameNoPipe +=" "+  this.addProspectForm.controls.namePart2.value ;
          }
          if (this.addProspectForm.controls.namePart3 !== undefined) {
            customer.customerNameNoPipe +=" "+  this.addProspectForm.controls.namePart3.value ;
          }
          if (this.addProspectForm.controls.namePart4 !== undefined) {
            customer.customerNameNoPipe +=" "+  this.addProspectForm.controls.namePart4.value ;
          }

        if (this.sharedService.getCustomer().acmAmlChecksDTOs.length > 0) {
          for (const setting of this.amlListSettings) {
            if (
              this.sharedService.getCustomer().acmAmlChecksDTOs.filter(
                (aml) =>
                  (aml.amlStatus ===
                    AcmConstants.AML_STATUS_FLAGGED ||
                    aml.amlStatus ===
                      AcmConstants.AML_STATUS_PENDING) &&
                  setting.listName == aml.listName &&
                  setting.isBlockingList == true
              ).length !== 0
            ) {
              disabled = true;
            }
          }
          if (disabled ) {
            this.devToolsServices.openToast(1, 'alert.error-customer');
          } else {
            this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT]); 
          } 
          }else {
            this.screeningStepService.checkAmlCustomer(customer).subscribe((data) => {
              const dataWithCustomerId = data.map((item) => ({
                ...item,
                customerId: this.sharedService.getCustomer().id, 
              }));
              this.screeningStepService.saveCheckAmlCustomer(dataWithCustomerId).subscribe((amlCheck) => {
                if (data.length > 0) {
                  for (const setting of this.amlListSettings) {
                    if (
                      data.filter(
                        (aml) =>
                          (aml.amlStatus ===
                            AcmConstants.AML_STATUS_FLAGGED ||
                            aml.amlStatus ===
                              AcmConstants.AML_STATUS_PENDING) &&
                          setting.listName == aml.listName &&
                          setting.isBlockingList == true
                      ).length !== 0
                    ) {
                      disabled = true;
                    }
                   }
                  }
                  if (disabled ) {
                    this.devToolsServices.openToast(1, 'alert.error-customer');
                  } else {
                    this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT]); 
                  } 
              });
            }); 
          }
         }else{
          this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT]); 
         }
        }else {
          this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT]); 
        }
      }); 

    }
}
