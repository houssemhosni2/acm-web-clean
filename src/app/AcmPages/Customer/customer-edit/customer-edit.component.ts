import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';
import { SettingsService } from '../../Settings/settings.service';
import { DateFormatterService, DateType } from 'ngx-hijri-gregorian-datepicker';
import { CustomerManagementService } from '../customer-management/customer-management.service';
import { SharedService } from '../../../shared/shared.service';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UserEntity } from '../../../shared/Entities/user.entity';
import { CustomerLinksRelationshipEntity } from '../../../shared/Entities/CustomerLinksRelationship.entity';
import { CustomerEntity } from '../../../shared/Entities/customer.entity';
import { BrancheEntity } from '../../../shared/Entities/branche.entity';
import { AcmConstants } from '../../../shared/acm-constants';
import { UserDefinedFieldsLinksEntity } from '../../../shared/Entities/userDefinedFieldsLinks.entity';
import { AppComponent } from '../../../app.component';
import { UserDefinedFieldsEntity } from '../../../shared/Entities/userDefinedFields.entity';
import { UserDefinedFieldGroupEntity } from '../../../shared/Entities/userDefinedFieldGroup.entity';
import { LoanEntity } from '../../../shared/Entities/loan.entity';
import { CustomerAddressComponent } from '../customer-address/customer-address.component';
import { UdfComponent } from '../../Loan-Application/udf/udf.component';
import { DatePipe } from '@angular/common';
import { UDFLinksGroupeFieldsEntity } from 'src/app/shared/Entities/udfLinksGroupeFields.entity';
import { UdfService } from '../../Loan-Application/udf/udf.service';
import { IndustryEntity } from '../../../shared/Entities/industry.entity';
import { RelationshipEntity } from 'src/app/shared/Entities/relationship.entity';
import { RoleEntity } from 'src/app/shared/Entities/Role.entity';
import { ProductEntity } from '../../../shared/Entities/product.entity';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { ScreeningEntity } from 'src/app/shared/Entities/screening.entity';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import * as moment from 'moment';
import { AcmIhmValidatorEntity } from 'src/app/shared/Entities/acmIhmValidator.entity';
import { SettingFieldService } from '../../Settings/setting-fields.service';
import { CustomerDisbursementComponent } from '../customer-disbursement/customer-disbursement.component';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { UserDefinedFieldListValuesEntity } from 'src/app/shared/Entities/userDefinedFieldListValues.entity';
import { CustomerAddressService } from '../customer-address/customer-address.service';
import { AddressEntity } from 'src/app/shared/Entities/Address.entity';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { checkOfflineMode, getUdfLinkGroup } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmIhmFieldEntity } from 'src/app/shared/Entities/acmIhmField.entity';
import { SupplierPaginationEntity } from 'src/app/shared/Entities/Supplier.pagination.entity';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { SupplierService } from '../../Supplier/supplier.service';
import { ProspectionListValueEntity } from 'src/app/shared/Entities/ProspectionListValue.entity';
import { SettingListValuesEntity } from 'src/app/shared/Entities/settingListValues.entity';
import { PortfolioEntity } from 'src/app/shared/Entities/Portfolio.entity';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';
import { SettingListEntity } from 'src/app/shared/Entities/AcmSettingList.entity';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.sass']
})
export class CustomerEditComponent implements OnInit {
  customerIndivForm: FormGroup;
  customerOrganizartionForm: FormGroup;
  customerRelationShipForm: FormGroup;
  customerGroupForm: FormGroup;
  customerLinkGroupeForm: FormGroup;
  customerLinkOrgForm: FormGroup;
  public kycForm: FormGroup;
  public expandedCustomer = true;
  public expandedCustomerLink = true;
  public expandedAddress = true;
  public expandedRelationships = true;
  public expandedCustomerLinkGrp = true;
  public brancheEntitys: AcmBranches[] = [];
  public customers: CustomerEntity[] = [];
  public selectedLoan: LoanEntity;
  public selectedCustomer: CustomerEntity = new CustomerEntity();
  public updateId: number;
  public portfolios: UserEntity[] = [];
  public customerMemberRelationship: CustomerLinksRelationshipEntity[] = [];
  public customerLinksEntity: CustomerLinksRelationshipEntity[] = [];
  public customerIndiv: boolean;
  public customerOrganitation: boolean;
  public customerGroup: boolean;
  udfForm: FormGroup;
  public udfFields: UserDefinedFieldsEntity[][] = [];
  indexFormUdf = 0;
  public listUDFGroups: UserDefinedFieldGroupEntity[] = [];
  public udfGroup: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
  public udfLinks: UserDefinedFieldsLinksEntity[] = [];
  public udfGroups: UserDefinedFieldGroupEntity[] = [];
  public udfFormData: boolean;
  public udfLinkGroup: UDFLinksGroupeFieldsEntity[] = [];
  public udfField: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
  public udfFieldsNationality: UserDefinedFieldsEntity[] = [];
  public selectedGroup: UDFLinksGroupeFieldsEntity;
  public listUDFLinkNationality: UDFLinksGroupeFieldsEntity[] = [];
  public listUDFLinkBankInformation: UDFLinksGroupeFieldsEntity[] = [];
  public udfSettingNationality: UserDefinedFieldsEntity[] = [];
  public resident = true;
  // Date Hejri + gregorien
  public selectedDateTypeH = DateType.Hijri;
  public selectedDateTypeG = DateType.Gregorian;
  public selectedIssueDateTypeG = DateType.Gregorian;
  public dateH: NgbDateStruct;
  public dateG: NgbDate;
  public expirydateG: NgbDate;
  public expirydateH: NgbDateStruct;
  public issuedateG: NgbDate;
  public addRelation = true;
  public addLink = true;
  public expandedUdf = true;
  public sectors: IndustryEntity[];
  // Mask
  public telephoneMask;
  public mobileMask;
  public nationalityIdMask;
  public residentIdyMask;
  public emailMask;
  public relationships: RelationshipEntity[];
  public roles: RoleEntity[];
  public validationScreening: ScreeningEntity;
  public confirmationScreening: ScreeningEntity;
  public customerEntityKyc: CustomerEntity = new CustomerEntity();
  public filteredCustomerSingle: CustomerEntity[] = [];
  public showKyc = false;
  public filteredCustomer: CustomerEntity;
  public check = false;
  @ViewChild(CustomerAddressComponent, { static: true }) customerAddress: CustomerAddressComponent;
  @ViewChild(UdfComponent, { static: true }) udfComp: UdfComponent;
  @ViewChild(CustomerDisbursementComponent, { static: true }) customerDisbursementComponent: CustomerDisbursementComponent;
  @Input() completeLoanData;
  public product: ProductEntity = new ProductEntity();
  public validateAge: boolean;
  public selectedSector: IndustryEntity = new IndustryEntity();
  @Output() updateCutomer = new EventEmitter<boolean>();
  @Output() updateC = new EventEmitter<boolean>();
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loading = true;
  public todayGreg: NgbDate;
  public todayHijri: NgbDateStruct;
  public disableMembergender = false;
  public categoryCustomerLinkRelation: string;
  public customerMemberGrpLink: CustomerLinksRelationshipEntity[] = [];
  public customerRelationShip: CustomerLinksRelationshipEntity[] = [];
  public customerMemberOrgLink: CustomerLinksRelationshipEntity[] = [];
  public customerLinkCategoryParam = '';
  public currentUser: UserEntity;
  public nombreMembersMax: number;
  public nombreMembersMin: number;
  public updateRole: boolean;
  public empty = false;
  public emptyExpiry = false;
  public maxNationalId: number;
  public mobileMaskLength: number;
  public phoneNumberMaskLength: number;
  public emptyIssueDate = false;
  public branchIdSelected: number;
  public itemsUDFLinksGroupeFieldsEntity = new BehaviorSubject<UDFLinksGroupeFieldsEntity[]>([]);
  public modeGuarantor = false;
  public fieldsLoaded = false;
  public filtersLoaded = new Subject<boolean>();
  public patterns: AcmIhmValidatorEntity[] = [];
  @Output() load = new EventEmitter<boolean>();
  public surveysId: number;
  public differencePeriodIssueDate = 0;
  public mezzaCard = '';
  public mezaCardMasks: Map<string, RegExp> = new Map<string, RegExp>();
  public familySituationList: UserDefinedFieldListValuesEntity[] = [];
  public nationalityList: UserDefinedFieldListValuesEntity[] = [];
  public residentRelationStatusList: UserDefinedFieldListValuesEntity[] = [];
  public placeNationalList: UserDefinedFieldListValuesEntity[] = [];
  public nationalityFieldValue: UserDefinedFieldListValuesEntity;
  public nationalIdFieldValue: string;
  public residentIdFieldValue: string;
  public updateCriticalData = false;
  public portfolioCheck = false;
  public supplier: SupplierEntity = new SupplierEntity();
  public supplierEntitys: SupplierEntity[] = [];
  public supplierPaginationEntity: SupplierPaginationEntity = new SupplierPaginationEntity();
  public supplierCheck = false;
  public generateDateBirthGender : number;
  public showDisbursmentCardInformation : boolean;
  ProspectionListValues : ProspectionListValueEntity[]= [];
  public listPortfolio : PortfolioEntity[];
  settingList: SettingListEntity[] = [];
  filteredSettings: SettingListEntity[] = [];

  /**
   *
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param settingFieldService SettingFieldService
   * @param router Router
   * @param customerAddressService CustomerAddressService
   * @param customerService CustomerServices
   * @param settingsService SettingsService
   * @param dateFormatterService DateFormatterService
   * @param customerInfoServices CustomerServices
   * @param customerManagementService CustomerManagementService
   * @param sharedService SharedService
   * @param modal NgbModal
   * @param translate TranslateService
   * @param datePipe DatePipe
   * @param udfService UdfService
   * @param loanManagementService LoanManagementService
   * @param authService AuthentificationService
   * @param route ActivatedRoute
   * @param library FaIconLibrary
   */
  constructor(public devToolsServices: AcmDevToolsServices,
    public formBuilder: FormBuilder,
    public settingFieldService: SettingFieldService,
    public router: Router,
    public customerAddressService: CustomerAddressService,
    public customerService: CustomerServices,
    public settingsService: SettingsService,
    public dateFormatterService: DateFormatterService,
    public customerInfoServices: CustomerServices,
    public customerManagementService: CustomerManagementService,
    public sharedService: SharedService,
    public modal: NgbModal,
    public translate: TranslateService,
    public datePipe: DatePipe,
    public udfService: UdfService,
    public loanManagementService: LoanManagementService,
    public authService: AuthentificationService,
    public route: ActivatedRoute, public library: FaIconLibrary,
    private dbService: NgxIndexedDBService,
    public supplierService: SupplierService) {
  }

  async ngOnInit() {        
    if(!checkOfflineMode()) {
    let settingListValuesEntity: SettingListValuesEntity = new SettingListValuesEntity();
    settingListValuesEntity.listName = AcmConstants.PROSPECTION_LIST;
    await this.settingsService.getSettingListValues(settingListValuesEntity).toPromise().then((res) => {
      if(res){
       this.fillProspectionListValues(res);
      }
    })

        const settingListEntity: SettingListEntity = new SettingListEntity();
                this.settingsService.findListSetting(settingListEntity).subscribe(
                  (data) => {
                    this.settingList = data.map((item) => ({
                      ...item,
                      valueJson: JSON.parse(item.
                        valueJson
                      ),
                    }));
                    this.filteredSettings = this.settingList.filter((item) => item.valueJson?.parentListID === 0);
                  });    
  }else {
    await this.dbService.getByKey('data','settingListValue_'+AcmConstants.PROSPECTION_LIST).subscribe((values:any)=>{
      if(values){
       this.fillProspectionListValues(values.data);
      }
    })
  }
    this.createRelationShipForm();
    this.createLinkGroupForm();
    this.createLinkOrgForm();
    this.udfForm = this.formBuilder.group({});
    const mode = checkOfflineMode() ? 2 : 0;

    // charger les pattern  from the dataBase (table AcmIhmValidators)
    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'ihm-validators').subscribe((patterns: any) => {
        if (patterns === undefined) {
          this.devToolsServices.openToast(3, 'No validators saved for offline use');
        } else {
          this.ihmValidators(patterns.data);
        }
      });

      this.dbService.getByKey('data', 'branches-list').subscribe((branches: any) => {
        if (branches === undefined) {
          this.devToolsServices.openToast(3, 'No bracnhes saved for offline use');
        } else {
          this.brancheEntitys = branches.data;
        }
      });

      this.dbService.getByKey('data', 'envirement-values-by-keys-customer').subscribe((envirement: any) => {
        if (envirement === undefined) {
          this.devToolsServices.openToast(3, 'No envirement customer values saved for offline use');
        } else {
          this.nombreMembersMax = Number(envirement.data[0].value);
          this.nombreMembersMin = Number(envirement.data[1].value);
          this.differencePeriodIssueDate = Number(envirement.data[2].value);
        }
      });

    } else {
      // charger les pattern  from the dataBase (table AcmIhmValidators)
      await this.settingFieldService.getIhmValidators(new AcmIhmValidatorEntity()).subscribe((data) => {
        this.ihmValidators(data);
      });

      // Find Branch
      this.settingsService.findBranches(new AcmBranches()).subscribe(
        (data) => {
          this.brancheEntitys = data;
        }
      );

      const acmEnvironmentKeys: string[] = [AcmConstants.MEMBERS_NUMBER_MAX, AcmConstants.MEMBERS_NUMBER_MIN,
      AcmConstants.DIFFERENCE_PERIOD_OF_EXPIRY_DATE_AND_ISSUE_DATE, AcmConstants.GENERATE_DATE_OF_BIRTH_GENDER,AcmConstants.DISBURSMENT_CARD];
      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys).subscribe((environments) => {
        this.nombreMembersMax = Number(environments[0].value);
        this.nombreMembersMin = Number(environments[1].value);
        this.differencePeriodIssueDate = Number(environments[2].value);
        this.generateDateBirthGender = Number(environments[3].value);
        this.showDisbursmentCardInformation = environments[4].enabled;
      });
    }

    if (this.completeLoanData === undefined) {
      this.completeLoanData = true;
    }
    this.route.queryParams.subscribe(params => {
      // if navigation is add new guarantor
      this.modeGuarantor = false;
      if (params.source === 'edit-guarantor') {
        this.modeGuarantor = true;
      }
    });
    this.getConnectedUser();

    // mode Update
    this.selectedLoan = this.sharedService.getLoan();
    this.selectedCustomer = this.sharedService.getCustomer();    
    
    if (this.selectedCustomer !== null && Object.keys(this.selectedCustomer).length !== 0) {
      this.createForm();
      // Get Product Loan
      if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
        if (!this.completeLoanData) {
          this.getProducts();
        }
        // charger le Edit-Form from database
        await this.sharedService.habilitationIhmFields(AcmConstants.FORM_ADD_CUSTOMER_INDIV, mode).then(
          () => {

            // notifier la page html que le form est pret
            this.filtersLoaded.next(true);
            this.fieldsLoaded = true;

            if (checkOfflineMode()) {
              let result = JSON.parse(sessionStorage.getItem('update-critical-data-allowed-groups'));
              result = result.data;

              if (result !== null && result !== undefined) {
                this.updateCriticalData = result;
                if (this.selectedCustomer.enableCriticalData && !this.updateCriticalData) {
                  this.sharedService.form.formGroup.controls.namePart1.disable();
                  this.sharedService.form.formGroup.controls.namePart2.disable();
                  this.sharedService.form.formGroup.controls.namePart3.disable();
                  this.sharedService.form.formGroup.controls.namePart4.disable();
                }
              }
            } else {
              // check if the connected user is allowed to change critical data
              this.authService.checkIfGroupOfConnectedUserIsAuthorized(AcmConstants.UPDATE_CRITICAL_DATA_ALLOWED_GROUPES)
                .subscribe((result) => {
                  if (result !== null) {
                    this.updateCriticalData = result;
                    if (this.selectedCustomer.enableCriticalData && !this.updateCriticalData) {
                      this.sharedService.form.formGroup.controls.namePart1.disable();
                      this.sharedService.form.formGroup.controls.namePart2.disable();
                      this.sharedService.form.formGroup.controls.namePart3.disable();
                      this.sharedService.form.formGroup.controls.namePart4.disable();
                    }
                  }
                });
            }
          }
        );
      }

      if (checkOfflineMode()) {
        let customer = null;
        this.dbService.getByKey('data', 'getCustomerInformation_' + this.selectedCustomer.id).subscribe(async (result: any) => {
          if (result !== undefined) {
            const itemId = this.selectedCustomer.itemId;
            this.selectedCustomer = result.data;
            if(itemId){
            this.selectedCustomer.itemId = itemId;
            }
          }
          const userEntity: UserEntity = new UserEntity();
          userEntity.branchID = this.selectedCustomer.branchId;
          // set branchIdSelected to send it to customer-disbursement child
          this.branchIdSelected = userEntity.branchID;
          this.dbService.getByKey('data', 'find-all-portfolio-' + userEntity.branchID).subscribe((portfolio: any) => {
            if (portfolio === undefined) {
              this.devToolsServices.openToast(3, 'No portfolio saved for offline use');
            } else {
          this.portfolios = portfolio.data;
          this.dbService.getByKey('data','find-all-portfolio-' +this.selectedCustomer.branchId ).subscribe(
          // this.customerManagementService.findAllPortfolio(userEntity).subscribe(
            (portfolio:any) => {
              this.portfolios = portfolio.data;
              this.portfolios.forEach(value => {
                if (value.accountPortfolioId === this.selectedCustomer.accountPortfolioID) {
                  this.portfolioCheck = true;
                }
              });
              if (!this.portfolioCheck) {
                const accountPorfolioMissed: PortfolioEntity = new PortfolioEntity();
                accountPorfolioMissed.portfolioId = parseInt(this.selectedCustomer.accountPortfolioID);
                // set branchIdSelected to send it to customer-disbursement child
                this.settingsService.getCustomerPortfolio(accountPorfolioMissed).subscribe(
                  (portfolio) => {
                    this.listPortfolio.push(portfolio[0]);
                  })
                }
              })
          }
          });
          if (this.selectedCustomer.dateOfBirth != null) {
            this.selectedCustomer.dateOfBirth = new Date(this.selectedCustomer.dateOfBirth);
            this.dateG = new NgbDate(0, 0, 0);
            this.dateG.day = this.selectedCustomer.dateOfBirth.getDate();
            this.dateG.month = this.selectedCustomer.dateOfBirth.getMonth() + 1;
            this.dateG.year = this.selectedCustomer.dateOfBirth.getFullYear();
          }
          if (this.selectedCustomer.dateOfBirthHijri != null) {
            const hijriDate = new Date(this.selectedCustomer.dateOfBirthHijri);
            this.dateH = {
              day: hijriDate.getDate(),
              month: hijriDate.getMonth() + 1,
              year: hijriDate.getFullYear()
            };
          }
          await this.createFormUpdate(this.selectedCustomer).then(() => {
            this.udfFormData = false;
            this.getUdfCustomerInformation();
          });

        });
      } else {

      await  this.customerManagementService.getCustomerInformation(this.selectedCustomer.id).subscribe(
          async (data) => {
            this.selectedCustomer = data;
            if (this.selectedCustomer.nationalId) {
              this.resident = true;
            }else {
              this.resident = false;
            }
            const userEntity: UserEntity = new UserEntity();
            userEntity.branchID = this.selectedCustomer.branchId;
            // set branchIdSelected to send it to customer-disbursement child
            this.branchIdSelected = userEntity.branchID;
            this.settingsService.findAllAcmPortfolio().subscribe(
              (portfolio) => {
                this.listPortfolio = portfolio;
              }
            );
            if (data.dateOfBirth != null) {
              data.dateOfBirth = new Date(data.dateOfBirth);
              this.dateG = new NgbDate(0, 0, 0);
              this.dateG.day = data.dateOfBirth.getDate();
              this.dateG.month = data.dateOfBirth.getMonth() + 1;
              this.dateG.year = data.dateOfBirth.getFullYear();
            }
            if (data.dateOfBirthHijri != null) {
              const hijriDate = new Date(data.dateOfBirthHijri);
              this.dateH = {
                day: hijriDate.getDate(),
                month: hijriDate.getMonth() + 1,
                year: hijriDate.getFullYear()
              };
            }
            if (data.issueDate !== null) {
              let year = '';
              let month = '';
              let day = '';
              if (data.issueDate.indexOf('/') !== -1) {
                year = data.issueDate.substring(6, 10);
                month = data.issueDate.substring(3, 5);
                day = data.issueDate.substring(0, 2);
              } else if (data.issueDate.indexOf('-') !== -1) {
                year = data.issueDate.substring(0, 4);
                month = data.issueDate.substring(5, 7);
                day = data.issueDate.substring(8, 10);
              }
              const date = new Date(year + '-' + month + '-' + day);
              this.issuedateG = new NgbDate(0, 0, 0);
              this.issuedateG.day = date.getDate();
              this.issuedateG.month = date.getMonth() + 1;
              this.issuedateG.year = date.getFullYear();
            }
            if (data.expiryDate !== null) {
              let year = '';
              let month = '';
              let day = '';
              if (data.expiryDate.indexOf('/') !== -1) {
                year = data.expiryDate.substring(6, 10);
                month = data.expiryDate.substring(3, 5);
                day = data.expiryDate.substring(0, 2);
              } else if (data.expiryDate.indexOf('-') !== -1) {
                year = data.expiryDate.substring(0, 4);
                month = data.expiryDate.substring(5, 7);
                day = data.expiryDate.substring(8, 10);
              }
              const date = new Date(year + '-' + month + '-' + day);
              this.expirydateG = new NgbDate(0, 0, 0);
              this.expirydateG.day = date.getDate();
              this.expirydateG.month = date.getMonth() + 1;
              this.expirydateG.year = date.getFullYear();
              this.convertExpiryDateToHijri(this.check);
            }
            await this.createFormUpdate(this.selectedCustomer).then(() => {
              this.udfFormData = false;
              this.getUdfCustomerInformation();
            });
          }
        );
      }

      const member = new CustomerLinksRelationshipEntity();
      member.customerId = this.selectedCustomer.id;
      let indexGrpLink = 0;
      let indexOrgLink = 0;
      let indexRelationShip = 0;

      if (!checkOfflineMode()) {
        // member.category = AcmConstants.MEMBERS;
        await this.customerManagementService.findCustomerLinkRelationShip(member).subscribe(
          (data) => {
            data.forEach(value => {

              // Complete loan data
              if (this.selectedLoan !== null && Object.keys(this.selectedLoan).length !== 0) {
                if (value.idLoan === this.selectedLoan.loanId && this.selectedLoan.customerType ===
                  AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
                  this.customerMemberGrpLink.push(value);
                  this.customerLinksEntity.push(value);
                  this.customerLinkGroupeForm.addControl('linkRelationshipType' + indexGrpLink,
                    new FormControl(value.linkRelationshipType, Validators.required));
                  indexGrpLink++;
                } else if (this.selectedLoan.customerType === AcmConstants.CUSTOMER_LINK_CATEGORY_ORG
                  && value.category === AcmConstants.MEMBERS) {
                  this.customerMemberOrgLink.push(value);
                  this.customerLinksEntity.push(value);
                  this.customerLinkOrgForm.addControl('linkRelationshipType' + indexOrgLink,
                    new FormControl(value.linkRelationshipType, Validators.required));
                  this.customerLinkOrgForm.addControl('percentageOwned' + indexOrgLink,
                    new FormControl(value.percentageOwned, Validators.required));
                  indexOrgLink++;
                } else if (value.category === AcmConstants.CUSTOMER_TYPE_RELATION) {
                  this.customerRelationShip.push(value);
                  this.customerRelationShipForm.addControl('relationshipType' + indexRelationShip,
                    new FormControl(value.linkRelationshipType, Validators.required));
                  indexRelationShip++;
                }
              } else if (this.selectedCustomer !== null && Object.keys(this.selectedCustomer).length !== 0) {
                if (value.category === AcmConstants.MEMBERS && this.selectedCustomer.customerType ===
                  AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
                  this.customerMemberGrpLink.push(value);
                  this.customerLinkGroupeForm.addControl('linkRelationshipType' + indexGrpLink,
                    new FormControl(value.linkRelationshipType, Validators.required));
                  indexGrpLink++;
                } else if (value.category === AcmConstants.MEMBERS &&
                  this.selectedCustomer.customerType === AcmConstants.CUSTOMER_LINK_CATEGORY_ORG) {
                  this.customerMemberOrgLink.push(value);
                  this.customerLinkOrgForm.addControl('linkRelationshipType' + indexOrgLink,
                    new FormControl(value.linkRelationshipType, Validators.required));
                  this.customerLinkOrgForm.addControl('percentageOwned' + indexOrgLink,
                    new FormControl(value.percentageOwned, Validators.required));
                  indexOrgLink++;
                } else if (value.category === AcmConstants.CUSTOMER_TYPE_RELATION) {
                  this.customerRelationShip.push(value);
                  this.customerRelationShipForm.addControl('relationshipType' + indexRelationShip,
                    new FormControl(value.linkRelationshipType, Validators.required));
                  indexRelationShip++;
                }
              }
            });
          }
        );
      }
    }

    if (!checkOfflineMode()) {
      this.getSectors();
    }

    this.getRelationship();
    this.getRole();
    const today: Date = new Date();
    this.todayGreg = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.todayHijri = this.dateFormatterService.ToHijri(this.todayGreg);

  }


  ihmValidators(patterns) {

    this.telephoneMask = new RegExp(patterns.find(x => x.codeValidator === AcmConstants.TELEPHONE_MASK).parameter);
    this.mobileMask = new RegExp(patterns.find(x => x.codeValidator === AcmConstants.MOBILE_MASK)?.parameter);
    this.nationalityIdMask = new RegExp(patterns.find(x => x.codeValidator === AcmConstants.NATIONAL_ID_MASK).parameter);
    this.residentIdyMask = new RegExp(patterns.find(x => x.codeValidator === AcmConstants.RESIDENT_ID_MASK).parameter);
    this.emailMask = new RegExp(patterns.find(x => x.codeValidator === AcmConstants.EMAIL_MASK).parameter);

    this.mezaCardMasks.set(AcmConstants.MEZA_CARD_INTERNAL,
      patterns.find(x => x.codeValidator === AcmConstants.MEZA_CARD_INTERNAL).parameter !== '' ?
        new RegExp(patterns.find(x => x.codeValidator === AcmConstants.MEZA_CARD_INTERNAL).parameter) : null);
    this.mezaCardMasks.set(AcmConstants.BANK_ACCOUNT,
      patterns.find(x => x.codeValidator === AcmConstants.BANK_ACCOUNT).parameter !== '' ?
        new RegExp(patterns.find(x => x.codeValidator === AcmConstants.BANK_ACCOUNT).parameter) : null);
    this.mezaCardMasks.set(AcmConstants.WALLET,
      patterns.find(x => x.codeValidator === AcmConstants.WALLET).parameter !== '' ?
        new RegExp(patterns.find(x => x.codeValidator === AcmConstants.WALLET).parameter) : null);
    this.mezaCardMasks.set(AcmConstants.MEZA_CARD_EXTERNAL,
      patterns.find(x => x.codeValidator === AcmConstants.MEZA_CARD_EXTERNAL).parameter !== '' ?
        new RegExp(patterns.find(x => x.codeValidator === AcmConstants.MEZA_CARD_EXTERNAL).parameter) : null);
    this.mezaCardMasks.set(AcmConstants.NO_CARD,
      patterns.find(x => x.codeValidator === AcmConstants.NO_CARD).parameter !== '' ?
        new RegExp(patterns.find(x => x.codeValidator === AcmConstants.NO_CARD).parameter) : null);

    // length mobile number4
    this.telephoneMask.source.match(/\d+/g).map(Number).forEach(element => {
      this.phoneNumberMaskLength = element + 2;
    });
    // length phone number
    this.mobileMask.source.match(/\d+/g).map(Number).forEach(element => {
      this.mobileMaskLength = element + 1;
    });
    this.nationalityIdMask.source.match(/\d+/g).map(Number).forEach(element => {
      this.maxNationalId = element + 1;
    });
  }

  /**
   * create form update
   */
  async createFormUpdate(selectedCustomer: CustomerEntity) {
    const branch: AcmBranches = new AcmBranches();
    branch.id = selectedCustomer.branchId;
    branch.name = selectedCustomer.branchesName;
    branch.description = selectedCustomer.branchesDescription;
    const portfolio: PortfolioEntity = new PortfolioEntity();
    portfolio.portfolioId = parseInt(selectedCustomer.accountPortfolioID);
    portfolio.code = selectedCustomer.accountPortfolioCode;
    portfolio.portfolioName = selectedCustomer.accountPortfolioDescription;
    let accountYearEndValid: string;
    if (selectedCustomer.accountYearEnd != null) {
      accountYearEndValid = new Date(selectedCustomer.accountYearEnd).toISOString().substring(0, 10);
    } else {
      accountYearEndValid = '';
    }
    if (selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      if (!this.completeLoanData && this.selectedLoan !== undefined && this.selectedLoan.parentId !== 0) {
        this.disableMembergender = true;
      }

      if (this.sharedService.form.formGroup.controls.namePart1 !== undefined) {
        this.sharedService.form.formGroup.controls.namePart1.setValue(selectedCustomer.firstName);
      }
      if (this.sharedService.form.formGroup.controls.namePart2 !== undefined) {
        this.sharedService.form.formGroup.controls.namePart2.setValue(selectedCustomer.secondName);
      }
      if (this.sharedService.form.formGroup.controls.namePart3 !== undefined) {
        this.sharedService.form.formGroup.controls.namePart3.setValue(selectedCustomer.middleName);
      }
      if (this.sharedService.form.formGroup.controls.namePart4 !== undefined) {
        this.sharedService.form.formGroup.controls.namePart4.setValue(selectedCustomer.lastName);
      }
      if (this.sharedService.form.formGroup.controls.mobile !== undefined) {
        this.sharedService.form.formGroup.controls.mobile.setValue(selectedCustomer.telephone1);
      }
      if (this.sharedService.form.formGroup.controls.email !== undefined) {
        this.sharedService.form.formGroup.controls.email.setValue(selectedCustomer.email);
      }
      if (this.sharedService.form.formGroup.controls.branch !== undefined) {
        this.sharedService.form.formGroup.controls.branch.setValue(branch);
      }
      if (this.sharedService.form.formGroup.controls.loanOfficer !== undefined) {
        this.sharedService.form.formGroup.controls.loanOfficer.setValue(portfolio);
      }
      if (this.sharedService.form.formGroup.controls.gender !== undefined) {
        this.sharedService.form.formGroup.controls.gender.setValue(selectedCustomer.gender);
      }
      if (this.sharedService.form.formGroup.controls.mobile2 !== undefined) {
        this.sharedService.form.formGroup.controls.mobile2.setValue(selectedCustomer.telephone2);
      }
      if (this.sharedService.form.formGroup.controls.mobile3 !== undefined) {
        this.sharedService.form.formGroup.controls.mobile3.setValue(selectedCustomer.telephone3);
      }
      if (this.sharedService.form.formGroup.controls.patentNumber !== undefined) {
        this.sharedService.form.formGroup.controls.patentNumber.setValue(selectedCustomer.registerNumber);
      }
      if (this.sharedService.form.formGroup.controls.beneficialEffective !== undefined) {
        this.sharedService.form.formGroup.controls.beneficialEffective.setValue(selectedCustomer.beneficialEffective);
      }
      if (this.sharedService.form.formGroup.controls.prospectionSource !== undefined) {
        this.sharedService.form.formGroup.controls.prospectionSource.setValue(selectedCustomer.prospectionSource);
        await this.selectSourceProspection(null);
      }
      if (this.sharedService.form.formGroup.controls.prospectionComment !== undefined) {
        this.sharedService.form.formGroup.controls.prospectionComment.setValue(selectedCustomer.prospectionComment);
      }
/*       if (this.sharedService.form.formGroup.controls.nationality !== undefined) {
        this.sharedService.form.formGroup.controls.nationality.setValue(selectedCustomer.nationalityId );
      }
      if (this.sharedService.form.formGroup.controls.placeNationalId !== undefined) {
        this.sharedService.form.formGroup.controls.placeNationalId.setValue(selectedCustomer.placeOfIssueId );
      } 
      if (this.sharedService.form.formGroup.controls.familySituation !== undefined) {
        this.sharedService.form.formGroup.controls.familySituation.setValue(selectedCustomer.familySituationId );
      }*/
      if (this.sharedService.form.formGroup.controls.residentId !== undefined) {
        this.sharedService.form.formGroup.controls.residentId.setValue(selectedCustomer.residentId );
      }
      if (this.sharedService.form.formGroup.controls.nationalId !== undefined) {
        this.sharedService.form.formGroup.controls.nationalId.setValue(selectedCustomer.nationalId);
      }
      if (this.sharedService.form.formGroup.controls.issueDate !== undefined) {
        this.sharedService.form.formGroup.controls.issueDate.setValue(selectedCustomer.issueDate);
      }
      const controls = this.sharedService.form.formGroup.controls;
      const fields = this.sharedService.form.acmIhmFields;
      let filds = []; 
      filds = JSON.parse(selectedCustomer.fields || "[]"); 
      
      Object.keys(controls).forEach(controlName => {
        const matchingFields = fields.filter(field => field.formControlName === controlName && field.typeField === "OPTIONS");
      
        if (matchingFields.length > 0) {
          matchingFields.forEach(field => {
            if (field.formControlName !== 'branch' && field.formControlName !== 'loanOfficer') { 
              const fieldData = filds.find(f => f.formControlName === field.formControlName);
              if (fieldData && controls[controlName]) {
                controls[controlName].setValue(fieldData.value);
              }
            }
          });
        }
      });
      
      if (this.sharedService.form.formGroup.controls.supplierRecommandation !== undefined) {
        let supplier = this.supplierEntitys.filter((item) => item.id === selectedCustomer.supplierRecommandation)[0];
        this.sharedService.form.formGroup.controls.supplierRecommandation.setValue(supplier);
      }

      if (this.selectedCustomer.enableCriticalData) {
        this.sharedService.form.formGroup.controls.namePart1?.disable();
        this.sharedService.form.formGroup.controls.namePart2?.disable();
        this.sharedService.form.formGroup.controls.namePart3?.disable();
        this.sharedService.form.formGroup.controls.namePart4?.disable();
      }

    } else if (selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      this.customerOrganizartionForm = this.formBuilder.group({
        mobile: [selectedCustomer.telephone1, [Validators.pattern(this.telephoneMask), Validators.required]],
        email: [selectedCustomer.email, [Validators.email, Validators.pattern(this.emailMask)]],
        branch: [branch, Validators.required],
        loanOfficer: [portfolio, Validators.required],
        mobile2: [selectedCustomer.telephone2, Validators.pattern(this.mobileMask)],
        mobile3: [selectedCustomer.telephone3],
        organizationName: [selectedCustomer.customerName, Validators.required],
        sector: [selectedCustomer.sector, Validators.required],
        fax: [selectedCustomer.fax],
        webSite: [selectedCustomer.webSite],
        accountYearEnd: [accountYearEndValid, Validators.required],
      });
    } else if (selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.customerGroupForm = this.formBuilder.group({
        solidarityName: [selectedCustomer.customerName, Validators.required],
        branch: [branch, Validators.required],
        loanOfficer: [portfolio, Validators.required]
      });
    }
  }

  /**
   * create form update
   */
  createForm() {
    if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      this.customerIndivForm = this.formBuilder.group({
        namePart1: [''],
        namePart2: [''],
        namePart3: [''],
        namePart4: [''],
        mobile: [''],
        email: ['', [Validators.email, Validators.pattern(this.emailMask)]],
        branch: ['', Validators.required],
        loanOfficer: ['', Validators.required],
        gender: [''],
        mobile2: [''],
        mobile3: [''],
        nationality: ['', Validators.required],
        national_id: [''],
        resident_ID: [''],
        residentRelationStatus: [''],
        placeNationalId: ['', Validators.required],
        familySituation: ['', Validators.required]
      });
    } else if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      this.customerOrganizartionForm = this.formBuilder.group({
        mobile: [''],
        email: ['', [Validators.email, Validators.pattern(this.emailMask)]],
        branch: ['', Validators.required],
        loanOfficer: ['', Validators.required],
        mobile2: [''],
        mobile3: [''],
        organizationName: [''],
        sector: [''],
        fax: [''],
        webSite: [''],
        accountYearEnd: [''],

      });
    } else if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.customerGroupForm = this.formBuilder.group({
        solidarityName: ['', Validators.required],
        branch: ['', Validators.required],
        loanOfficer: ['', Validators.required]
      });
    }
  }

  /**
   * toggle Customer Card
   */
  toggleCollapseCustomer() {
    this.expandedCustomer = !this.expandedCustomer;
  }

  /**
   * toggle Address card
   */
  toggleCollapseAddress() {
    this.expandedAddress = !this.expandedAddress;
  }

  toggleCollapseCustomerLink() {
    this.expandedCustomerLink = !this.expandedCustomerLink;
  }

  /**
   * toggle Customer Link GRP card
   */
  toggleCollapseCustomerLinkGrp() {
    this.expandedCustomerLinkGrp = !this.expandedCustomerLinkGrp;
  }

  /**
   * convert Date Hijri To Gregorian
   */
  convertDateToGregorian(event) {
    this.updateC.emit(false);
    this.dateG = this.dateFormatterService.ToGregorian(this.dateH);
    if (this.dateG.day === null || this.dateG.day === undefined
      || this.dateG.month === null || this.dateG.month === undefined
      || this.dateG.year === null || this.dateG.year === undefined) {
      this.devToolsServices.openToast(3, 'alert.invalide_gregorian_dob');
      this.dateG = null;
      this.empty = true;
    } else {
      this.empty = false;
    }
  }

  /**
   * convert Date Gregorian To Hijri
   */
  convertDateToHijri(event) {
    this.updateC.emit(false);
    this.dateH = this.dateFormatterService.ToHijri(this.dateG);
    if (this.dateH.day === null || this.dateH.day === undefined
      || this.dateH.month === null || this.dateH.month === undefined
      || this.dateH.year === null || this.dateH.year === undefined) {
      // open toast
      this.devToolsServices.openToast(3, 'alert.invalide_hijri_dob');
      this.dateH = null;
      this.empty = true;
    } else {
      this.empty = false;
    }
  }

  /**
   * convert Expiry Date Hijri To Gregorian
   */
  convertExpiryDateToGregorian(check) {
    this.expirydateG = this.dateFormatterService.ToGregorian(this.expirydateH);
    if (check !== false) {
      this.updateC.emit(false);
    }
    this.emptyExpiry = false;
  }

  /**
   * convert Expiry Date Gregorian To Hijri
   */
  convertExpiryDateToHijri(check) {
    this.expirydateH = this.dateFormatterService.ToHijri(this.expirydateG);
    if (this.expirydateH.day === null) {
      this.expirydateG.day += 1;
      this.expirydateH = this.dateFormatterService.ToHijri(this.expirydateG);
      this.expirydateH.day -= 1;
    }
    if (check !== false) {
      this.updateC.emit(false);
    }
    this.emptyExpiry = false;
  }

  /**
   * Methode to onSubmit save or update customer after validation
   */
  async submitCustomer() {
    this.devToolsServices.makeFormAsTouched(this.customerAddress.addressForm);
    this.devToolsServices.makeFormAsTouched(this.udfForm);
    if (this.udfForm.invalid || this.customerAddress.addressForm.invalid || this.sharedService.form.formGroup.invalid) {
      this.devToolsServices.InvalidControl();
      return;
    }
    if(this.showDisbursmentCardInformation){
      this.devToolsServices.makeFormAsTouched(this.customerDisbursementComponent.formDisbursement);
    }
    if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      this.devToolsServices.makeFormAsTouched(this.sharedService.form.formGroup);
      this.devToolsServices.makeFormAsTouched(this.customerRelationShipForm);

      if (this.sharedService.form.formGroup.valid && this.customerAddress.addressForm.valid &&
        this.customerRelationShipForm.valid && this.udfForm.valid &&
        (this.customerDisbursementComponent?.formDisbursement?.valid || !this.showDisbursmentCardInformation )) {
        this.selectedCustomer.userDefinedFieldsLinksDTOs = this.selectedCustomer.userDefinedFieldsLinksDTOs.filter(link => link.id !== null);
   
        this.updateCustomer(this.selectedCustomer).then((data) => {
          if (data) {
            if (this.modeGuarantor) {
              this.openLoan(this.sharedService.getLoan());
            } else {
              this.router.navigate([AcmConstants.EDIT_CUSTOMER_MENU_URL], { queryParams: { mode: 2 } });
            }
            this.devToolsServices.openToast(0, 'alert.success');
          }
        });
      } else {
        this.devToolsServices.openToast(3, 'alert.check-data');
        //this.devToolsServices.backTop();
        return;
      }
    } else if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      this.devToolsServices.makeFormAsTouched(this.customerOrganizartionForm);
      this.devToolsServices.makeFormAsTouched(this.customerRelationShipForm);
      this.devToolsServices.makeFormAsTouched(this.customerLinkOrgForm);
      if (this.customerOrganizartionForm.valid && this.customerAddress.addressForm.valid &&
        this.customerRelationShipForm.valid && this.customerLinkOrgForm.valid && this.udfForm.valid) {
          this.selectedCustomer.userDefinedFieldsLinksDTOs = this.selectedCustomer.userDefinedFieldsLinksDTOs.filter(link => link.id !== null);

        this.updateCustomer(this.selectedCustomer).then((data) => {
          if (data) {
            this.devToolsServices.openToast(0, 'alert.success');
            this.router.navigate([AcmConstants.EDIT_CUSTOMER_MENU_URL], { queryParams: { mode: 2 } });
          }
        });
      } else {
        this.devToolsServices.openToast(3, 'alert.check-data');
        //this.devToolsServices.backTop();
        return;
      }
    } else if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.devToolsServices.makeFormAsTouched(this.customerGroupForm);
      this.devToolsServices.makeFormAsTouched(this.customerRelationShipForm);
      this.devToolsServices.makeFormAsTouched(this.customerLinkGroupeForm);
      if (this.customerGroupForm.valid && this.customerAddress.addressForm.valid &&
        this.customerRelationShipForm.valid && this.customerLinkGroupeForm.valid && this.udfForm.valid) {
        if (this.customerMemberGrpLink.length > this.nombreMembersMax || this.customerMemberGrpLink.length < this.nombreMembersMin) {
          this.devToolsServices.openToastWithParameter(3, 'alert.member_number', '[ ' + this.nombreMembersMin + ' , '
            + this.nombreMembersMax + ' ]');
          return;
        } else {
          this.selectedCustomer.userDefinedFieldsLinksDTOs = this.selectedCustomer.userDefinedFieldsLinksDTOs.filter(link => link.id !== null);

          this.updateCustomer(this.selectedCustomer).then((data) => {
            if (this.updateRole && data) {
              this.devToolsServices.openToast(0, 'alert.success');
              this.router.navigate([AcmConstants.EDIT_CUSTOMER_MENU_URL], { queryParams: { mode: 2 } });
            }
          });
        }
      } else {
        this.devToolsServices.openToast(3, 'alert.check-data');
        //this.devToolsServices.backTop();
        return;
      }
    }
  }

  /**
   * Change Nationality if Saudis
   * @param nationality Nationality Selected
   */
  changeNationality(selectedId: number) {
    const selectedItem = this.settingList.find((item) => item.id === parseInt(selectedId.toString().split(': ')[1], 10));
    if (this.fieldsLoaded === true) {
      if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL &&
        this.sharedService.form.formGroup.controls.nationality.value !== null) {
        this.resident = selectedItem?.valueJson?.primary;
        if (this.resident) {
          this.sharedService.form.formGroup.controls.residentId.setValue('');
          // Find nationality mask
          let nationalityField = this.sharedService.form.acmIhmFields.filter((item) => item.formControlName === "nationalId")[0];
          let nationalityRegExp = nationalityField.validators.filter((item) => item.typeValidator === AcmConstants.PATTERN_REGEXP)[0];
          this.nationalityIdMask = new RegExp('\\b' + nationalityRegExp.parameter + '\\b');

          this.sharedService.form.formGroup.controls.nationalId.setValidators([
            Validators.required, Validators.pattern(this.nationalityIdMask)]);
          if (this.sharedService.form.formGroup.controls.residentId !== undefined) {
            this.sharedService.form.formGroup.controls.residentId.clearValidators();
            this.sharedService.form.formGroup.controls.residentId.setValue('');
            this.sharedService.form.formGroup.controls.residentId.reset();
          }
          if (this.sharedService.form.formGroup.controls.residentRelationStatus !== undefined) {
            this.sharedService.form.formGroup.controls.residentRelationStatus.clearValidators();
            this.sharedService.form.formGroup.controls.residentRelationStatus.reset();
            this.sharedService.form.formGroup.controls.residentRelationStatus.setValue('');
          }
          if (this.sharedService.form.formGroup.controls.nationalIDExpiryDate !== undefined) {
            this.sharedService.form.formGroup.controls.nationalIDExpiryDate.clearValidators();
            this.sharedService.form.formGroup.controls.nationalIDExpiryDate.reset();
          }
        } else {
          // Find resident mask
          let residentField = this.sharedService.form.acmIhmFields.filter((item) => item.formControlName === "residentId")[0];
          let residentRegExp =  residentField.validators.filter((item) => item.typeValidator === AcmConstants.PATTERN_REGEXP)[0];
          this.residentIdyMask = new RegExp('\\b' + residentRegExp.parameter + '\\b');
          this.sharedService.form.formGroup.controls.nationalId.setValue('');
          this.sharedService.form.formGroup.controls.nationalId.clearValidators();
          this.sharedService.form.formGroup.controls.nationalId.reset();
          if (this.sharedService.form.formGroup.controls.residentId !== undefined) {
            this.sharedService.form.formGroup.controls.residentId.setValidators([Validators.required,
            Validators.pattern(this.residentIdyMask)]);
          }
          if (this.sharedService.form.formGroup.controls.residentRelationStatus !== undefined) {
            this.sharedService.form.formGroup.controls.residentRelationStatus.setValidators(Validators.required);
          }
          if (this.sharedService.form.formGroup.controls.nationalIDExpiryDate !== undefined) {
            this.sharedService.form.formGroup.controls.nationalIDExpiryDate.setValidators(Validators.required);
          }
          this.sharedService.form.formGroup.controls.nationalId.setValue('');
        }
      }
    }
    // update the form validity
    if (this.sharedService.form.formGroup.controls.nationalId !== undefined) {
      this.sharedService.form.formGroup.controls.nationalId.updateValueAndValidity();
    }
    if (this.sharedService.form.formGroup.controls.residentId !== undefined) {
      this.sharedService.form.formGroup.controls.residentId.updateValueAndValidity();
    }
    if (this.sharedService.form.formGroup.controls.residentRelationStatus !== undefined) {
      this.sharedService.form.formGroup.controls.residentRelationStatus.updateValueAndValidity();
    }
    this.sharedService.form.formGroup.updateValueAndValidity();
  }
  /**
   * Reset CustomerForm
   */
  resetForm() {
    this.sharedService.form.formGroup.reset();
  }

  /**
   * toggle Collapse Relationships
   */
  toggleCollapseRelationships() {
    this.expandedRelationships = !this.expandedRelationships;
  }

  /**
   * Methode exit
   */
  exit() {
    if (this.modeGuarantor) {
      this.openLoan(this.sharedService.getLoan());
    } else {
      this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.DASHBOARD_URL);
    }
  }

  /**
   * get Direction of current language
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * close Modale
   */
  closeModale() {
    this.modal.dismissAll();
  }

  /**
   * check KYC
   * @param modalContent TemplateRef<any>
   */
  checkKYC(modalContent: TemplateRef<any>) {
    const screeningDTO = new ScreeningEntity();
    if (!this.completeLoanData) {
      screeningDTO.idLoan = this.selectedLoan.loanId;
    }
    screeningDTO.customerDTO = this.selectedCustomer;
    screeningDTO.customerCategory = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
    this.customerManagementService.thirdPartyKycValidate(screeningDTO).subscribe(
      (data) => {
        this.validationScreening = data;
        this.createFormModal(this.validationScreening);
        this.modal.open(modalContent);
      }
    );
  }

  /**
   * create Form Modal
   */
  createFormModal(screening: ScreeningEntity) {
    const transactionId = '';
    this.kycForm = this.formBuilder.group({
      optcode: [Validators.required],
      transactionid: [transactionId, Validators.required],
    });
  }

  /**
   * submitKyc
   */
  submitKyc() {
    const screeningDTO = new ScreeningEntity();
    screeningDTO.customerDTO = this.selectedCustomer;
    if (!this.completeLoanData) {
      screeningDTO.idLoan = this.selectedLoan.loanId;
    }
    screeningDTO.customerCategory = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
    this.customerManagementService.thirdPartyKycConfirm(screeningDTO).subscribe(
      (data) => {
        this.confirmationScreening = data;
      }
    );

  }

  /**
   * find portfolio by branch
   */
  selectBranch() {
    const userEntity: UserEntity = new UserEntity();
    this.sharedService.form.formGroup.controls.loanOfficer.setValue('');
    this.sharedService.form.formGroup.controls.loanOfficer.updateValueAndValidity();
    if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      userEntity.branchID = this.sharedService.form.formGroup.controls.branch.value.branchID;
    } else if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      userEntity.branchID = this.customerOrganizartionForm.controls.branch.value.branchID;
    }
    // set branchIdSelected to send it to customer-disbursement child
    this.branchIdSelected = userEntity.branchID;
    if (userEntity.branchID.toString() !== '') {
      this.settingsService.findAllAcmPortfolio().subscribe(
        (data) => {
          this.listPortfolio = data;
        }
      );
    } else {
      this.listPortfolio = [];
    }
  }

  /**
   * get Relationship Of Group
   */
  getRelationship() {
    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'find-relationship').subscribe((relationships: any) => {
        if (relationships === undefined) {
          this.devToolsServices.openToast(3, 'No relationship saved for offline use');
        } else {
          this.relationships = relationships.data;
        }
      });
    } else {
      this.customerManagementService.findRelationship().subscribe(
        (data) => {
          this.relationships = data;
        }
      );
    }

  }

  /**
   * getSectors of customer org
   */
  getSectors() {
    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'find-sector').subscribe((sectors: any) => {
        if (sectors === undefined) {
          this.devToolsServices.openToast(3, 'No sectors saved for offline use');
        } else {
          this.sectors = sectors.data;
        }
      });
    } else {
      this.customerManagementService.findSector().subscribe(
        (sector) => {
          this.sectors = sector;
        }
      );
    }
  }

  /**
   * get Role Of Group
   */
  getRole() {
    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'find-role').subscribe((roles: any) => {
        if (roles === undefined) {
          this.devToolsServices.openToast(3, 'No roles saved for offline use');
        } else {
          this.roles = roles.data;
        }
      });
    } else {
      this.customerManagementService.findRole().subscribe(
        (data) => {
          this.roles = data;
        }
      );
    }

  }

  /**
   * compareBranch
   * @param branch1 branch 1
   * @param branch2 branch 2
   */
  compareBranch(branch1, branch2) {
    if (branch1 !== null && branch2 !== null) {
      return branch1.branchID === branch2.branchID && branch1.name === branch2.name
        && branch1.description === branch2.description;
    }
  }

  /**
   * comparePortfolio
   * @param portfolio1 portfolio1
   * @param portfolio2 portfolio2
   */
  comparePortfolio(portfolio1, portfolio2) {
    return portfolio1.portfolioId === portfolio2.portfolioId;
  }

  /**
   * compareResidentRelation
   * @param udfFields1 udfFields1
   * @param udfFields2 udfFields2
   */
  compareResidentRelation(udfFields1, udfFields2) {
    return udfFields1.idUDFListValue === udfFields2.idUDFListValue;
  }

  checkGroupExist(code:string){
   return this.udfGroups.some(group => group.code === code);   
  }

  /**
   * getUdfCustomerInformation
   */
  getUdfCustomerInformation() {
    this.udfFields[0] = [];
    // Group UDF
    const udfLink = new UserDefinedFieldsLinksEntity();
    udfLink.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
    udfLink.elementId = this.selectedCustomer.id;
    const userDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
    userDefinedFieldsLinksEntity.elementId = this.selectedCustomer.id;
    userDefinedFieldsLinksEntity.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
    userDefinedFieldsLinksEntity.cutomerType = this.selectedCustomer.customerType;
    this.listUDFLinkBankInformation = [];
    this.listUDFLinkNationality = [];
    if (checkOfflineMode()) {

      this.dbService.getByKey('data', 'getUdfLinkGroupby_' + this.selectedCustomer.id).subscribe((udfLinkGroup: any) => {
        if (udfLinkGroup === undefined) {
          // to do by rmila
          this.devToolsServices.openToast(3, 'No udf link saved for offline use');
        } else {
          this.getUdfAllGroup();
          this.initializeUDFGroups(udfLinkGroup.data);
        }
      });

    } else {
      this.udfService.getUdfLinkGroupby(userDefinedFieldsLinksEntity).subscribe(
        (data) => {
          this.initializeUDFGroups(data);
        });
    }
  }

  async initializeUDFGroups(udfLinkGroup) {
    this.udfLinkGroup = udfLinkGroup;
    if (!checkOfflineMode()) {
      this.getUdfAllGroup();
    }
    let indexGroup = 0;
    udfLinkGroup.forEach((udf) => {
      const groupUDF = new UserDefinedFieldGroupEntity();
      groupUDF.id = udf.userDefinedFieldGroupID;
      groupUDF.enabled = true;
      groupUDF.mondatory = udf.mondatory;
      groupUDF.indexGroup = indexGroup;
      if (udf.userDefinedFieldGroupName === AcmConstants.CUSTOMER_NATIONALITY_CODE) {
        this.listUDFLinkNationality.push(udf);
      } else if (udf.userDefinedFieldGroupName === AcmConstants.BANK_INFORMATION_CODE) {
        this.listUDFLinkBankInformation.push(udf);
      } else {
        this.udfForm.addControl('udfGroup' + this.indexFormUdf, new FormControl(groupUDF, Validators.required));
        this.listUDFGroups.push(groupUDF);
        this.indexFormUdf++;
      }
      indexGroup++;
    });
    if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL && this.listUDFLinkNationality.length > 0) {
      this.listUDFLinkNationality[0].udfGroupeFieldsModels.forEach(
        ((nationality) => {
          switch (nationality.fieldName) {
           /*  case 'National ID':
              this.sharedService.form.formGroup.controls.nationalId.setValue(nationality.value);
              this.nationalIdFieldValue = nationality.value;
              break;
            case 'Resident ID':
              if (this.sharedService.form.formGroup.controls.residentId !== undefined) {
                this.sharedService.form.formGroup.controls.residentId.setValue(nationality.value);
                this.residentIdFieldValue = nationality.value;
              }
              break; */
            case 'Expiry date':
              if (nationality.value !== null) {
                let year = '';
                let month = '';
                let day = '';
                if (nationality.value.indexOf('/') !== -1) {
                  year = nationality.value.substring(6, 10);
                  month = nationality.value.substring(3, 5);
                  day = nationality.value.substring(0, 2);
                } else if (nationality.value.indexOf('-') !== -1) {
                  year = nationality.value.substring(0, 4);
                  month = nationality.value.substring(5, 7);
                  day = nationality.value.substring(8, 10);
                }
                const date = new Date(year + '-' + month + '-' + day);
                this.expirydateG = new NgbDate(0, 0, 0);
                this.expirydateG.day = date.getDate();
                this.expirydateG.month = date.getMonth() + 1;
                this.expirydateG.year = date.getFullYear();
                this.convertExpiryDateToHijri(this.check);
              }
              break;
           /*  case 'Add Issue Date':
              if (nationality.value !== null) {
                let year = '';
                let month = '';
                let day = '';
                if (nationality.value.indexOf('/') !== -1) {
                  year = nationality.value.substring(6, 10);
                  month = nationality.value.substring(3, 5);
                  day = nationality.value.substring(0, 2);
                } else if (nationality.value.indexOf('-') !== -1) {
                  year = nationality.value.substring(0, 4);
                  month = nationality.value.substring(5, 7);
                  day = nationality.value.substring(8, 10);
                }
                const date = new Date(year + '-' + month + '-' + day);
                this.issuedateG = new NgbDate(0, 0, 0);
                this.issuedateG.day = date.getDate();
                this.issuedateG.month = date.getMonth() + 1;
                this.issuedateG.year = date.getFullYear();
              } */

          }
        })
      );
    }
    // if (checkOfflineMode()) {
    //   for (let i = 0; i < this.listUDFGroups.length; i++) {
    //     this.getUdfGroup(i);
    //   }
    // }
    for (let i = 0; i < this.listUDFGroups.length; i++) {
      await this.getUdfGroup(i);
    }
    if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      //this.getUdfFiledListNationality();
    }
    this.udfFormData = true;
    this.itemsUDFLinksGroupeFieldsEntity.next(this.listUDFLinkBankInformation);
   
  }

  /**
   * load user defined group
   */
  async getUdfGroup(indexFormUdf) {
    await this.getUdfFiledList(indexFormUdf, true);
  }

  /**
   * load user defined group all
   */
  async getUdfAllGroup() {
    if(checkOfflineMode()){
    const udfGroups =  await this.dbService.getByKey('data', 'getUdfGroup_CUSTOMER').toPromise() as any;
        if (udfGroups === undefined) {
          this.devToolsServices.openToast(3, 'No udf indiv saved for offline use');
        } else {
          this.udfGroups = udfGroups.data;
        }
    }
    else {
      this.udfGroup = new UserDefinedFieldGroupEntity();
      this.udfGroup.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
      this.udfService.getUdfGroup(this.udfGroup).subscribe(
        (data) => {
          this.udfGroups = data;
          const nationalityToRemove = this.udfGroups.filter(value => value.code === AcmConstants.CUSTOMER_NATIONALITY_CODE ||
            value.id === AcmConstants.UDF_GROUP_BANK_INFORMATION);
          if (nationalityToRemove.length > 0) {
            this.udfGroups.splice(this.udfGroups.indexOf(nationalityToRemove[0]), 1);
            this.udfGroups.splice(this.udfGroups.indexOf(nationalityToRemove[1]), 1);
          }
  
        }
      );
    }
  }


  async changeUDFField(j: number, i: number) {
    const udfselected = this.udfFields[j][i];
    for (let indexUDF = 0; indexUDF < this.udfFields[j].length; indexUDF++) {
      if (this.udfFields[j][indexUDF].idUDFParentField === udfselected.id) {
        if(!checkOfflineMode()){
        const userDefinedFieldListValuesEntity = new UserDefinedFieldListValuesEntity();
        // Make the link between list values based on the ACM id
        userDefinedFieldListValuesEntity.parentUDFListValue = this.udfForm.controls['udfField' + j + i].value.id;
        await this.udfService.getUdfListValue(userDefinedFieldListValuesEntity).toPromise().then(
          (data) => {
            this.udfFields[j][indexUDF].fieldListValuesDTOs = data;
          }
        );
      } else {
        await this.dbService.getByKey('data', 'udf-fields-group-id-' + this.udfFields[j][indexUDF].userDefinedFieldGroupDTO.id).toPromise().then((udfFields: any) => {
          if(udfFields !== undefined){
            const res = udfFields.data?.filter(udfField => udfField.id === this.udfFields[j][indexUDF].id);
            if(res.length > 0){ 
              let resultListValues = res[0].fieldListValuesDTOs;
              resultListValues = resultListValues.filter((listValue)=> listValue.parentUDFListValue === this.udfForm.controls['udfField' + j + i].value.id);
              this.udfFields[j][indexUDF].fieldListValuesDTOs = resultListValues;
            }
          }
          });   
      }
      }
    }
  }

  /**
   * load user defined field
   */
  async getUdfFiledList(j: number, init: boolean) {

    this.udfFormData = false;

    if (!init) {
      for (let i = 0; i < this.udfFields[j].length; i++) {
        this.udfForm.controls['udfField' + j + i].reset();
        this.udfForm.controls['udfField' + j + i].clearValidators();
      }
    }
    this.udfFields[j] = [];
    this.udfField.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
    if (init) {
      this.udfField.userDefinedFieldGroupDTO.id = this.listUDFGroups[j].id;
    } else {
      this.udfField.userDefinedFieldGroupDTO.id = this.udfForm.controls['udfGroup' + j].value.id;
    }
    this.udfField.parentUDFListValue = 0;
    let data :any;
    if(checkOfflineMode()){
      let res = await this.dbService.getByKey('data', 'udf-fields-group-id-' + this.udfField.userDefinedFieldGroupDTO.id).toPromise() as any;
      if(res !== undefined){
        data = res.data;
      }
    } else {
       data = await this.udfService.getUdfField(this.udfField).toPromise();
    }
   
    this.udfFields[j] = data;
    this.udfFields[j].filter((item) => item.idUDFParentField !== 0).map((item) => item.fieldListValuesDTOs = []);
    let fieldExist: boolean;
    this.selectedGroup = new UDFLinksGroupeFieldsEntity();
    this.selectedGroup.udfGroupeFieldsModels = [];
    this.udfGroup = this.listUDFGroups[j];
    this.udfGroup.customerId = 1;
    this.udfGroup.customerTypeLabel = this.selectedCustomer.customerType;
    if (init) {
      this.selectedGroup = this.udfLinkGroup[this.udfGroup.indexGroup];
    } else {
      this.udfLinkGroup.forEach((group) => {
        if (group.userDefinedFieldGroupID === this.udfGroup.id) {
          this.selectedGroup = group;
        }
      });
    }
    // filter hijri
    const hijriDofToRemove = this.udfFields[j].filter(value => value.name === AcmConstants.UDF_FIELD_HIJRI_DOF);
    if (hijriDofToRemove.length > 0) {
      this.udfFields[j].splice(this.udfFields[j].indexOf(hijriDofToRemove[0]), 1);
    }
    for (let i = 0; i < this.udfFields[j].length; i++) {
      fieldExist = false;
      for (const field of this.selectedGroup.udfGroupeFieldsModels) {
        this.surveysId = field.surveysId;
        if (field.fieldName === AcmConstants.OLD_UDF_FIELD_MEZZA_CARD) {
          this.mezzaCard = field.value;
        }
        if (field.udfFieldID === this.udfFields[j][i].id) {
          this.udfFields[j][i].idAbacusUDFLink = field.idAbacusUDFLink;
          this.udfFields[j][i].surveysId = field.surveysId;
          this.udfFields[j][i].idUDFLink = field.id;
          this.udfFields[j][i].delete = false;
          if (this.udfFields[j][i].fieldType === 5) {
            for (const fieldListValuesDTO of this.udfFields[j][i].fieldListValuesDTOs) {
              if (fieldListValuesDTO.description === field.value) {
                if (this.udfFields[j][i].mandatory === true) {
                  this.udfForm.addControl('udfField' + j + i, new FormControl(fieldListValuesDTO,
                    [Validators.required, Validators.pattern(this.udfFields[j][i].fieldMasc)]));
                } else {
                  this.udfForm.addControl('udfField' + j + i, new FormControl(fieldListValuesDTO,
                    Validators.pattern(this.udfFields[j][i].fieldMasc)));
                }
                fieldExist = true;
                await this.changeUDFField(j, i)
              }
            }
          } else {
            if (this.udfFields[j][i].mandatory === true) {
              this.udfForm.addControl('udfField' + j + i, new FormControl(field.value,
                [Validators.required, Validators.pattern(this.udfFields[j][i].fieldMasc)]));
            } else {
              this.udfForm.addControl('udfField' + j + i, new FormControl(field.value,
                Validators.pattern(this.udfFields[j][i].fieldMasc)));
            }
            fieldExist = true;
          }
        }
      }
      if (!fieldExist) {
        if (init) {
          this.udfFields[j][i].surveysId = this.surveysId;
        }
        if (this.udfFields[j][i].mandatory === true) {
          this.udfForm.addControl('udfField' + j + i, new FormControl('',
            [Validators.required, Validators.pattern(this.udfFields[j][i].fieldMasc)]));
        } else {
          this.udfForm.addControl('udfField' + j + i, new FormControl('',
            Validators.pattern(this.udfFields[j][i].fieldMasc)));
        }
      }
    }

    this.udfFormData = true;
  }

  /**
   * toggle Customer analyses
   */
  toggleCollapseCustomerAnalyses() {
    this.expandedUdf = !this.expandedUdf;
  }

  async getUdfFiledListNationality() {
    const groupNationality: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
    groupNationality.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
    groupNationality.userDefinedFieldGroupDTO.code = AcmConstants.CUSTOMER_NATIONALITY_CODE;

    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'udf-fields-customer').subscribe((udfFields: any) => {
        if (udfFields === undefined) {
          this.devToolsServices.openToast(3, 'No udf fields saved for offline use');
        } else {
          this.loeadNationalityFields(udfFields.data);
        }
      });
    } else {
      this.udfService.getUdfField(groupNationality).subscribe(
        (data) => {
          this.loeadNationalityFields(data)
        });

    }
  }

  loeadNationalityFields(udfSettingNationality) {
    this.udfSettingNationality = udfSettingNationality;
    if (this.udfSettingNationality.length > 0) {
      this.familySituationList = this.udfSettingNationality
        .filter(value => value.name === AcmConstants.FAMILY_SITUATION)[0].fieldListValuesDTOs;
      this.nationalityList = this.udfSettingNationality
        .filter(value => value.name === AcmConstants.NATIONALITY)[0].fieldListValuesDTOs;
      //  this.residentRelationStatusList = this.udfSettingNationality
      //   .filter(value => value.name === AcmConstants.RESIDENCE_RELATION_STATUS)[0].fieldListValuesDTOs;
      this.placeNationalList = this.udfSettingNationality
        .filter(value => value.name === AcmConstants.PLACE_OF_ISSUE)[0].fieldListValuesDTOs;
    }
    this.udfSettingNationality.forEach(nationalityField => {
      nationalityField.fieldListValuesDTOs.forEach(nationalitySetting => {
        if (this.listUDFLinkNationality.length > 0) {
          this.listUDFLinkNationality[0].udfGroupeFieldsModels.forEach(
            ((nationality) => {
              if (nationalitySetting.description === nationality.value ||  nationalitySetting.name === nationality.value || nationalitySetting.idUDFListValue.toString()
                === nationality.value) {
                switch (nationality.fieldName) {
                  case 'Nationality':
                    if (this.sharedService.form.formGroup.controls.nationality !== undefined) {
                      this.sharedService.form.formGroup.controls.nationality.setValue(nationalitySetting);
                      this.nationalityFieldValue = nationalitySetting;
                    }
                    break;
                  case 'Resident Relation Status':
                    if (this.sharedService.form.formGroup.controls.residentRelationStatus !== undefined) {
                      this.sharedService.form.formGroup.controls.residentRelationStatus.setValue(nationalitySetting);
                    }
                    break;
                  case 'Place of issue':
                    if (this.sharedService.form.formGroup.controls.placeNationalId !== undefined) {
                      this.sharedService.form.formGroup.controls.placeNationalId.setValue(nationalitySetting);
                    }
                    break;
                  case 'Family situation':
                    if (this.sharedService.form.formGroup.controls.familySituation !== undefined) {
                      this.sharedService.form.formGroup.controls.familySituation.setValue(nationalitySetting);
                    }
                    break;
                }
              }
            }));
          this.loading = false;
          this.load.emit(this.loading);
        }
      });
    });
    //this.changeNationality();
  }

  /**
   * compareFieldUDF
   * @param udf1 udf1
   * @param udf2 udf2
   */
  compareFieldUDF(udf1, udf2) {
    if (udf1 !== null && udf2 !== null && udf1 !== undefined && udf2 !== undefined) {
      return udf1.name === udf2.name;
    }
  }

  /**
   * comparegroup
   * @param group1 group1
   * @param group2 group2
   */
  comparegroup(group1, group2) {
    return group1.id === group2.id;
  }

  /**
   * compareNationality
   * @param nationality1 nationality1
   * @param nationality2 nationality2
   */
  compareNationality(nationality1, nationality2) {
    if (nationality1 !== null && nationality2 !== null) {
      return nationality1.idUDFListValue === nationality2.idUDFListValue;
    }
  }

  /**
   * comparePlaceNationalId
   * @param placeNationalId1 placeNationalId1
   * @param placeNationalId2 placeNationalId2
   */
  comparePlaceNationalId(placeNationalId1, placeNationalId2) {
    if (placeNationalId1 !== null && placeNationalId2 !== null) {
      return placeNationalId1.idUDFListValue === placeNationalId2.idUDFListValue;
    }
  }

  /**
   * compareFamilySituation
   * @param familySituation1 familySituation1
   * @param familySituation2 familySituation2
   */
  compareFamilySituation(familySituation1, familySituation2) {
    if (familySituation1 !== null && familySituation1 !== null) {
      return familySituation1.idUDFListValue === familySituation2.idUDFListValue;
    }
  }

  /**
   * add a new udf group
   */
  addUdf() {
    const groupudf = new UserDefinedFieldGroupEntity();
    groupudf.enabled = true;
    this.listUDFGroups.push(groupudf);
    this.udfFields[this.listUDFGroups.length - 1] = [];
    this.udfForm.addControl('udfGroup' + this.indexFormUdf, new FormControl(''));
    this.indexFormUdf++;
  }

  /**
   * Delete Group
   * @param i Index
   */
  deleteGroup(i: number) {
    this.listUDFGroups[i].enabled = false;
    this.udfFields[i].forEach((udfDeleted) => {
      udfDeleted.delete = true;
    });
  }

  getSelectedSector() {
    this.sectors.forEach((sector) => {
      if (sector.name === this.customerOrganizartionForm.controls.sector.value) {
        this.selectedSector = sector;
      }
    });
  }

  /**
   * update Form Customer
   */
  checkGregrianAndHijri: boolean = false;
  lstCheckGregrianAndHijri: AcmIhmFieldEntity[];
  checkGregrianAndHijriDate() {
    this.lstCheckGregrianAndHijri = this.sharedService.form.acmIhmFields.filter(item => item.formControlName == 'nationalIDExpiryDate' || item.formControlName == 'nationalIDExpiryHijriDate')
    if (this.lstCheckGregrianAndHijri.length !== 0) {
      this.checkGregrianAndHijri = true;
    }
  }
  async updateCustomer(customer: CustomerEntity): Promise<boolean> {
    let result: boolean;
    this.loading = false;
    this.checkGregrianAndHijriDate();
    this.selectedCustomer.id = customer.id;
    this.selectedCustomer.listAddress = this.customerAddress.OnSubmit();
    this.customerMemberRelationship = [];
    this.customerLinksEntity = [] = [];
    this.getListLinkRelationShip();
    if (this.selectedCustomer.listAddress === null) {
      return false;
    }
    // customer udf
    
    if (this.listUDFGroups.length >= 0) {
      this.selectedCustomer.userDefinedFieldsLinksDTOs = [];
      for (let j = 0; j < this.listUDFGroups.length; j++) {
        for (let i = 0; i < this.udfFields[j].length; i++) {
          const udfLink: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
          udfLink.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
          udfLink.elementId = this.selectedCustomer.id;
          // Setting idAbacusUDFLink and surveysId and id
          udfLink.idAbacusUDFLink = this.udfFields[j][i].idAbacusUDFLink;
          udfLink.surveysId = this.udfFields[j][i].surveysId;
          udfLink.id = this.udfFields[j][i].idUDFLink;
          if (this.udfFields[j][i].delete) {
            if (udfLink.idAbacusUDFLink !== undefined && udfLink.surveysId !== undefined) {
              udfLink.fieldValue = '';
            }
          } else if (this.udfFields[j][i].fieldType === 5) {
            udfLink.fieldValue = this.udfForm.controls['udfField' + j + i].value.idUDFListValue;
            udfLink.udfListValueId = this.udfForm.controls['udfField' + j + i].value.idUDFListLink;
          } else {
            udfLink.fieldValue = this.udfForm.controls['udfField' + j + i].value;
          }
          if (this.udfFields[j][i].name === AcmConstants.REGISTRATION_NAME) {
            this.selectedCustomer.registerNumber = this.udfForm.controls['udfField' + j + i].value;
          }
          udfLink.userDefinedFieldsDTO = this.udfFields[j][i];
          udfLink.indexGroup = j;
          this.selectedCustomer.userDefinedFieldsLinksDTOs.push(udfLink);
        }
      }
    }
    if (customer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL) {
      if (this.dateG === null || this.dateG === undefined || this.dateH === null || this.dateH === undefined) {
        this.empty = true;
      }
      if (this.checkGregrianAndHijri) {
        if ((this.expirydateG === null || this.expirydateH === null) ||
          ((this.expirydateG === undefined || this.expirydateH === undefined))) {
          this.emptyExpiry = true;
          this.devToolsServices.openToast(3, 'alert.check-data');
          //this.devToolsServices.backTop();
        }
      }
      if (this.issuedateG === null || this.issuedateG === undefined) {
        this.emptyIssueDate = true;
        this.devToolsServices.openToast(3, 'alert.check-data');
        //this.devToolsServices.backTop();
      }
      if (!this.completeLoanData && !this.checkAgeForProduct()) {
        return;
      }
      if (this.sharedService.form.formGroup.controls.nationalId &&
        this.sharedService.form.formGroup.controls.nationalId.value) {
      this.selectedCustomer.identity = this.sharedService.form.formGroup.controls.nationalId.value;
    } else {
      this.selectedCustomer.identity = this.sharedService.form.formGroup.controls.residentId.value;
    }


       
    
      let indexGroupeFieldModel = 1;
      if (this.listUDFLinkNationality.length > 0) {
        if (this.resident && this.listUDFLinkNationality[0].udfGroupeFieldsModels[2] !== undefined) {
          indexGroupeFieldModel = 2;
        } else if (!this.resident && this.listUDFLinkNationality[0].udfGroupeFieldsModels[3] !== undefined) {
          indexGroupeFieldModel = 3;
        }
      }

/*       if (this.expirydateG !== undefined) {
        const expiryDate: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
        expiryDate.userDefinedFieldsDTO = this.udfSettingNationality.filter(value => value.name === AcmConstants.EXPIRY_DATE)[0];
        const givenEexpiryDate: Date = new Date(this.expirydateG.year + '-' + this.expirydateG.month + '-' + this.expirydateG.day);
        expiryDate.fieldValue = this.datePipe.transform(givenEexpiryDate, 'dd/MM/yyyy');
        if (this.udfSettingNationality.filter(value => value.name === AcmConstants.EXPIRY_DATE)[0] !== undefined
          && this.listUDFLinkNationality.length > 0 && this.listUDFLinkNationality[0].udfGroupeFieldsModels.filter(
            value => value.fieldName === AcmConstants.EXPIRY_DATE)[0] !== undefined) {
          expiryDate.surveysId = this.listUDFLinkNationality[0].udfGroupeFieldsModels.filter(
            value => value.fieldName === AcmConstants.EXPIRY_DATE)[0].surveysId;
          expiryDate.id = this.listUDFLinkNationality[0].udfGroupeFieldsModels.filter(
            value => value.fieldName === AcmConstants.EXPIRY_DATE)[0].id;
          expiryDate.idAbacusUDFLink = this.listUDFLinkNationality[0].udfGroupeFieldsModels.
            filter(value => value.fieldName === AcmConstants.EXPIRY_DATE)[0].idAbacusUDFLink;
        }

      } */


        const controls = this.sharedService.form.formGroup.controls;
        const fields = this.sharedService.form.acmIhmFields;
        const resultList = []; 
        Object.keys(controls).forEach(controlName => {
          const matchingFields = fields.filter(field => field.formControlName === controlName && field.typeField === "OPTIONS");
        
          if (matchingFields.length > 0) {
            matchingFields.forEach(field => {
              if (field.formControlName !== 'branch' && field.formControlName !== 'loanOfficer') {
                resultList.push({
                  formControlName: field.formControlName,
                  value: controls[controlName].value 
                });
              }
            });
          }
        });
  
        this.selectedCustomer.fields = JSON.stringify(resultList);


     
     const givenIssueDate: Date = new Date(this.issuedateG.year + '-' + this.issuedateG.month + '-' + this.issuedateG.day);
     this.selectedCustomer.issueDate = this.datePipe.transform(givenIssueDate, 'dd/MM/yyyy');

     const givenEexpiryDate: Date = new Date(this.expirydateG.year + '-' + this.expirydateG.month + '-' + this.expirydateG.day);
     this.selectedCustomer.expiryDate = this.datePipe.transform(givenEexpiryDate, 'dd/MM/yyyy');

      // customer disbursement information
      const disbursementMethod: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      disbursementMethod.userDefinedFieldsDTO = this.customerDisbursementComponent.udfSettingbankInformation
        .filter(value => value.name === AcmConstants.DISBURSEMENT_METHOD)[0];
      disbursementMethod.udfListValueId = this.customerDisbursementComponent.udfSettingbankInformation
        .filter(value => value.name === AcmConstants.DISBURSEMENT_METHOD)[0].idUDFListValue;
      disbursementMethod.fieldValue = this.customerDisbursementComponent.formDisbursement.controls.disbursementMethod.value !== undefined ?
        this.customerDisbursementComponent.formDisbursement.controls.disbursementMethod.value.idUDFListValue : null;
      if (this.listUDFLinkBankInformation[0] !== undefined && this.listUDFLinkBankInformation.length > 0
        && this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.
          filter(value => value.fieldName === AcmConstants.DISBURSEMENT_METHOD)[0] !== undefined) {
        disbursementMethod.surveysId = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.
          filter(value => value.fieldName === AcmConstants.DISBURSEMENT_METHOD)[0].surveysId;
        disbursementMethod.id = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.
          filter(value => value.fieldName === AcmConstants.DISBURSEMENT_METHOD)[0].id;
        disbursementMethod.idAbacusUDFLink = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.
          filter(value => value.fieldName === AcmConstants.DISBURSEMENT_METHOD)[0].idAbacusUDFLink;
      }
      disbursementMethod.indexGroup = this.listUDFGroups.length + 1;
      this.selectedCustomer.userDefinedFieldsLinksDTOs.push(disbursementMethod);
      this.selectedCustomer.disbursementMethodSelected =
        this.customerDisbursementComponent.formDisbursement.controls.disbursementMethod.value.name;
      // if disbursement method is changed && disbursement method selected != MezaCard =>
      // (BE): update previous Meza Card Status to 'ACTIVATE'
      if (this.customerDisbursementComponent.disburesementMethodSelected === 'updatedToOtherThanMezaCard') {
        this.selectedCustomer.disbursementMethodUpdatedToOtherThanMezaCard = true;
      } else {
        this.selectedCustomer.disbursementMethodUpdatedToOtherThanMezaCard = false;
      }/*
      // account Number
      const accountNumber: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      accountNumber.userDefinedFieldsDTO = this.customerDisbursementComponent.udfSettingbankInformation
        .filter(value => value.name === AcmConstants.ACCOUNT_NUMBER)[0];
      accountNumber.fieldValue = (this.customerDisbursementComponent.formDisbursement.controls.accountNumber !== undefined &&
        this.customerDisbursementComponent.formDisbursement.controls.accountNumber !== null)
        ? this.customerDisbursementComponent.formDisbursement.controls.accountNumber.value : null;
      if (this.listUDFLinkBankInformation[0] !== undefined && this.listUDFLinkBankInformation.length > 0
        && this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.filter(
          value => value.fieldName === AcmConstants.ACCOUNT_NUMBER)[0] !== undefined) {
        accountNumber.surveysId = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.filter(
          value => value.fieldName === AcmConstants.ACCOUNT_NUMBER)[0].surveysId;
        accountNumber.id = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.filter(
          value => value.fieldName === AcmConstants.ACCOUNT_NUMBER)[0].id;
        accountNumber.idAbacusUDFLink = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.
          filter(value => value.fieldName === AcmConstants.ACCOUNT_NUMBER)[0].idAbacusUDFLink;
      }
      if (!accountNumber.surveysId) {
        accountNumber.surveysId = disbursementMethod.surveysId;
      }
      accountNumber.indexGroup = this.listUDFGroups.length + 1;
      this.selectedCustomer.userDefinedFieldsLinksDTOs.push(accountNumber);
*/
      if (this.customerDisbursementComponent.formDisbursement.controls.disbursementMethod.value.name === AcmConstants.MEZA_CARD_INTERNAL) {
        this.selectedCustomer.mezaCardId = this.customerDisbursementComponent.mezaCardId;
        if (this.selectedCustomer.mezaCardStatus === AcmConstants.MEZA_STATUS_NONE) {
          this.selectedCustomer.mezaCardStatus = AcmConstants.MEZA_STATUS_NEW;
        }
      } else {
        this.selectedCustomer.mezaCardId = null;
      }
      /*
      const bankCode: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      bankCode.userDefinedFieldsDTO = this.customerDisbursementComponent.udfSettingbankInformation
        .filter(value => value.name === AcmConstants.CODE_BANK)[0];
      bankCode.udfListValueId = this.customerDisbursementComponent.udfSettingbankInformation
        .filter(value => value.name === AcmConstants.CODE_BANK)[0].idUDFListValue;
      bankCode.fieldValue = (this.customerDisbursementComponent.formDisbursement.controls.bankCode.value !== undefined &&
        this.customerDisbursementComponent.formDisbursement.controls.bankCode.value !== null) ?
        this.customerDisbursementComponent.formDisbursement.controls.bankCode.value.idUDFListValue : null;
      if (this.listUDFLinkBankInformation[0] !== undefined && this.listUDFLinkBankInformation.length > 0
        && this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.filter(
          value => value.fieldName === AcmConstants.CODE_BANK)[0] !== undefined) {
        bankCode.surveysId = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels
          .filter(value => value.fieldName === AcmConstants.CODE_BANK)[0].surveysId;
        bankCode.id = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels
          .filter(value => value.fieldName === AcmConstants.CODE_BANK)[0].id;
        bankCode.idAbacusUDFLink = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.filter
          (value => value.fieldName === AcmConstants.CODE_BANK)[0].idAbacusUDFLink;
      }
      if (!bankCode.surveysId) {
        bankCode.surveysId = disbursementMethod.surveysId;
      }
      bankCode.indexGroup = this.listUDFGroups.length + 1;
      this.selectedCustomer.userDefinedFieldsLinksDTOs.push(bankCode);

      const branchCode: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      branchCode.userDefinedFieldsDTO = this.customerDisbursementComponent.udfSettingbankInformation
        .filter(value => value.name === AcmConstants.CODE_BRANCH)[0];
      branchCode.udfListValueId = this.customerDisbursementComponent.udfSettingbankInformation
        .filter(value => value.name === AcmConstants.CODE_BRANCH)[0].idUDFListValue;
      branchCode.fieldValue = (this.customerDisbursementComponent.formDisbursement.controls.branchCode.value !== undefined &&
        this.customerDisbursementComponent.formDisbursement.controls.branchCode.value !== null) ?
        this.customerDisbursementComponent.formDisbursement.controls.branchCode.value.idUDFListValue : null;
      if (this.listUDFLinkBankInformation[0] !== undefined && this.listUDFLinkBankInformation.length > 0
        && this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.filter(
          value => value.fieldName === AcmConstants.CODE_BRANCH)[0] !== undefined) {
        branchCode.surveysId = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.filter(
          value => value.fieldName === AcmConstants.CODE_BRANCH)[0].surveysId;
        branchCode.id = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.filter(
          value => value.fieldName === AcmConstants.CODE_BRANCH)[0].id;
        bankCode.idAbacusUDFLink = this.listUDFLinkBankInformation[0].udfGroupeFieldsModels.filter
          (value => value.fieldName === AcmConstants.CODE_BRANCH)[0].idAbacusUDFLink;
      }
      if (!branchCode.surveysId) {
        branchCode.surveysId = disbursementMethod.surveysId;
      }
      branchCode.indexGroup = this.listUDFGroups.length + 1;
      this.selectedCustomer.userDefinedFieldsLinksDTOs.push(branchCode);*/
      this.selectedCustomer.customerType = AcmConstants.CUSTOMER_TYPE_INDIVIDUAL;
      if (!this.selectedCustomer.enableCriticalData || this.updateCriticalData) {
        this.selectedCustomer.firstName = this.sharedService.form.formGroup.controls.namePart1.value.trim();
        this.selectedCustomer.secondName = (this.sharedService.form.formGroup.controls.namePart2) ?
        this.sharedService.form.formGroup.controls.namePart2.value.trim() : '';
        this.selectedCustomer.middleName = (this.sharedService.form.formGroup.controls.namePart3) ?
        this.sharedService.form.formGroup.controls.namePart3.value.trim() : '';
        this.selectedCustomer.lastName = this.sharedService.form.formGroup.controls.namePart4.value.trim();
        this.selectedCustomer.lastName = this.sharedService.form.formGroup.controls.namePart4.value.trim();
        this.selectedCustomer.lastName = this.sharedService.form.formGroup.controls.namePart4.value.trim();
        this.selectedCustomer.customerName = this.selectedCustomer.firstName + '|' + this.selectedCustomer.secondName + '|' +
          this.selectedCustomer.middleName + '|' + this.selectedCustomer.lastName;
      }
      this.selectedCustomer.gender = this.sharedService.form.formGroup.controls.gender !== undefined ?
        this.sharedService.form.formGroup.controls.gender.value : null;
      if (this.dateG !== undefined) {
        this.selectedCustomer.dateOfBirth = new Date(Date.UTC(this.dateG.year, this.dateG.month - 1, this.dateG.day));
      }
      if (this.dateH !== undefined) {
        this.selectedCustomer.dateOfBirthHijri = this.dateH.year + '-' + this.dateH.month + '-' + this.dateH.day;
      }
      this.selectedCustomer.telephone1 = this.sharedService.form.formGroup.controls.mobile !== undefined ?
        this.sharedService.form.formGroup.controls.mobile.value : null;
      this.selectedCustomer.telephone2 = this.sharedService.form.formGroup.controls.mobile2 !== undefined ?
        this.sharedService.form.formGroup.controls.mobile2.value : null;
      this.selectedCustomer.email = (this.sharedService.form.formGroup.controls.email !== undefined &&
        this.sharedService.form.formGroup.controls.email.value !== null) ?
        this.sharedService.form.formGroup.controls.email.value.toLowerCase() : null;
      this.selectedCustomer.branchId = this.sharedService.form.formGroup.controls.branch !== undefined ?
        this.sharedService.form.formGroup.controls.branch.value.id : null;
      this.selectedCustomer.branchesName = this.sharedService.form.formGroup.controls.branch !== undefined ?
        this.sharedService.form.formGroup.controls.branch.value.name : null;
      this.selectedCustomer.branchesDescription = this.sharedService.form.formGroup.controls.branch !== undefined ?
        this.sharedService.form.formGroup.controls.branch.value.description : null;
      this.selectedCustomer.accountPortfolioID = this.sharedService.form.formGroup.controls.loanOfficer !== undefined ?
        this.sharedService.form.formGroup.controls.loanOfficer.value.portfolioId : null;
      this.selectedCustomer.accountPortfolioCode = this.sharedService.form.formGroup.controls.loanOfficer !== undefined ?
        this.sharedService.form.formGroup.controls.loanOfficer.value.code : null;
      this.selectedCustomer.accountPortfolioDescription = this.sharedService.form.formGroup.controls.loanOfficer !== undefined ?
        this.sharedService.form.formGroup.controls.loanOfficer.value.portfolioName.replace(/\s*\(.*\)/, "").trim() : null;
      this.selectedCustomer.customerLinksRelationshipDTOs = this.customerMemberRelationship;
      this.selectedCustomer.customerIdExtern = customer.customerIdExtern;
      this.selectedCustomer.beneficialEffective = this.sharedService.form.formGroup.controls.beneficialEffective !== undefined ?
        this.sharedService.form.formGroup.controls.beneficialEffective.value : null;
      this.selectedCustomer.prospectionSource = this.sharedService.form.formGroup.controls.prospectionSource !== undefined ?
        this.sharedService.form.formGroup.controls.prospectionSource.value : null;
      this.selectedCustomer.prospectionComment = this.sharedService.form.formGroup.controls.prospectionComment !== undefined ?
        this.sharedService.form.formGroup.controls.prospectionComment.value : null;
        this.selectedCustomer.residentId = this.sharedService.form.formGroup.controls.residentId !== undefined ?
        this.sharedService.form.formGroup.controls.residentId.value : null;
        this.selectedCustomer.nationalId = this.sharedService.form.formGroup.controls.nationalId !== undefined ?
        this.sharedService.form.formGroup.controls.nationalId.value : null;
      if(this.selectedCustomer.prospectionSource === AcmConstants.FOURNISSEUR){
        this.selectedCustomer.supplierRecommandation = this.sharedService.form.formGroup.controls.supplierRecommandation !== undefined ?
          this.sharedService.form.formGroup.controls.supplierRecommandation.value.id : null;
      }
      else{
        this.selectedCustomer.supplierRecommandation = null;
      }

      let registerNumber = (this.sharedService.form.formGroup.controls.patentNumber) ? this.sharedService.form.formGroup.controls.patentNumber.value?.trim() : null;
      this.selectedCustomer.registerNumber = registerNumber !== "" ? registerNumber : null;

    } else if (customer.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      this.getSelectedSector();
      this.selectedCustomer.customerType = AcmConstants.CUSTOMER_TYPE_ORGANISATIONS;
      this.selectedCustomer.customerName = this.customerOrganizartionForm.controls.organizationName.value;
      this.selectedCustomer.organizationName = this.customerOrganizartionForm.controls.organizationName.value;
      this.selectedCustomer.sector = this.customerOrganizartionForm.controls.sector.value;
      this.selectedCustomer.industryCode = this.selectedSector;
      this.selectedCustomer.telephone1 = this.customerOrganizartionForm.controls.mobile.value;
      this.selectedCustomer.telephone2 = this.customerOrganizartionForm.controls.mobile2.value;
      this.selectedCustomer.fax = this.customerOrganizartionForm.controls.fax.value;
      this.selectedCustomer.webSite = this.customerOrganizartionForm.controls.webSite.value;
      this.selectedCustomer.email = this.customerOrganizartionForm.controls.email.value.toLowerCase();
      this.selectedCustomer.accountYearEnd = this.customerOrganizartionForm.controls.accountYearEnd.value;
      this.selectedCustomer.branchId = this.customerOrganizartionForm.controls.branch.value.id;
      this.selectedCustomer.branchesName = this.customerOrganizartionForm.controls.branch.value.name;
      this.selectedCustomer.branchesDescription = this.customerOrganizartionForm.controls.branch.value.description;
      this.selectedCustomer.accountPortfolioID = this.customerOrganizartionForm.controls.loanOfficer.value.portfolioId;
      this.selectedCustomer.accountPortfolioCode = this.customerOrganizartionForm.controls.loanOfficer.value.code;
      this.selectedCustomer.accountPortfolioDescription = this.customerOrganizartionForm.controls.loanOfficer.value.portfolioName.replace(/\s*\(.*\)/, "").trim();
      this.selectedCustomer.customerIdExtern = customer.customerIdExtern;
      let sumPercantage = 0;
      this.customerMemberRelationship.forEach((link) => {
        if (link.category === AcmConstants.MEMBERS) {
          sumPercantage += link.percentageOwned;
        }
      });
      if (sumPercantage > 100) {
        this.devToolsServices.openToast(3, 'alert.total_parts');
        return;
      }
      this.selectedCustomer.customerLinksRelationshipDTOs = this.customerMemberRelationship;
      this.selectedCustomer.customerLinksDTOs = this.customerLinksEntity;
    } else if (customer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      this.selectedCustomer.customerType = AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY;
      this.selectedCustomer.customerName = this.customerGroupForm.controls.solidarityName.value;
      this.selectedCustomer.solidarityName = this.customerGroupForm.controls.solidarityName.value;
      this.selectedCustomer.branchId = this.customerGroupForm.controls.branch.value.id;
      this.selectedCustomer.branchesName = this.customerGroupForm.controls.branch.value.name;
      this.selectedCustomer.branchesDescription = this.customerGroupForm.controls.branch.value.description;
      this.selectedCustomer.accountPortfolioID = this.customerGroupForm.controls.loanOfficer.value.portfolioId;
      this.selectedCustomer.accountPortfolioCode = this.customerGroupForm.controls.loanOfficer.value.code;
      this.selectedCustomer.accountPortfolioDescription = this.customerGroupForm.controls.loanOfficer.value.portfolioName.replace(/\s*\(.*\)/, "").trim();
      this.selectedCustomer.customerLinksRelationshipDTOs = this.customerMemberRelationship;
      this.selectedCustomer.customerIdExtern = customer.customerIdExtern;
      this.selectedCustomer.customerLinksDTOs = this.customerLinksEntity;
      if (!this.checkRole()) {
        return;
      }
    }
    this.selectedCustomer.updateCustomer = true;
    this.sharedService.setCustomer(this.selectedCustomer);
    this.updateCutomer.emit(true);
    this.sharedService.setLoader(true);
    // set mezaCardStatus = none if mezaCardStatus is null
    if (this.selectedCustomer.mezaCardStatus === null) {
      this.selectedCustomer.mezaCardStatus = AcmConstants.MEZA_STATUS_NONE;
    }
    // to do
    const isFromOfflineSync = sessionStorage.getItem('isFromOfflineSync') === 'true';
    if (checkOfflineMode() && !isFromOfflineSync) {      
      if(this.selectedCustomer?.userDefinedFieldsLinksDTOs.length > 0){
        const check = this.checkGroupExist(AcmConstants.CUSTOMER_NATIONALITY_CODE);
            if(!check){
              const customerNationality = this.selectedCustomer?.userDefinedFieldsLinksDTOs.filter(
                link => link.userDefinedFieldsDTO?.userDefinedFieldGroupDTO?.code === AcmConstants.CUSTOMER_NATIONALITY_CODE)[0]?.userDefinedFieldsDTO?.userDefinedFieldGroupDTO;
                if(customerNationality){
                  this.udfGroups.push(customerNationality);
                }
            }
            let idGroups = [];
            
             this.selectedCustomer.userDefinedFieldsLinksDTOs.forEach((link)=>{
              if(!idGroups.includes(link.userDefinedFieldsDTO?.userDefinedFieldGroupDTO?.id)){
                idGroups.push(link.userDefinedFieldsDTO?.userDefinedFieldGroupDTO?.id);
              }
             })
             this.udfGroups = this.udfGroups.filter(group => {
              const idExistsInGroups = idGroups.some(id => id === group.id);
              const item = this.listUDFGroups.filter(item =>  item.id === group.id)[0];
              const isEnabled = item === undefined || item?.enabled;

              return idExistsInGroups && isEnabled ? group : null;
            });

            const data = getUdfLinkGroup(this.selectedCustomer.userDefinedFieldsLinksDTOs,this.udfGroups,true);
            await this.dbService.update('data', {id :'getUdfLinkGroupby_' + this.selectedCustomer.id , data : data}).toPromise();        
            await this.dbService.update('data', {id :'getCustomerInformation_' + this.selectedCustomer.id , data : this.selectedCustomer}).toPromise();        
          }
      
      if(this.selectedCustomer.itemId){
        await this.dbService.delete('customers' , this.selectedCustomer.itemId).toPromise();
      }
   
      
      result = await this.dbService
        .add('customers', this.selectedCustomer).toPromise().
        then(async (key) => {
          this.selectedCustomer = key;
          result = true;
          this.udfFields = [];
          this.indexFormUdf = 0;
          this.listUDFLinkNationality = [];
          this.listUDFGroups = [];
          this.listUDFLinkNationality = [];
          this.udfFormData = false;
          this.sharedService.setCustomer(this.selectedCustomer);
          this.sharedService.setLoader(false);

          const customers = await this.dbService.getByKey('customers-pagination', 'customers-list').toPromise() as any;
          if(customers !== undefined) {
            const customerList = customers.resultsCustomers.filter(customer => {return customer.id !== this.selectedCustomer.id})
            customerList.unshift(this.selectedCustomer);
            customers.resultsCustomers = customerList;
            await this.dbService
              .update('customers-pagination', customers)
              .toPromise().then(() => {this.devToolsServices.openToast(0, 'alert.success');});
          }
   
          return true;
        },
          // to do
          err => {
            const customerAddress = new AddressEntity();
            customerAddress.customerId = this.selectedCustomer.id;
            // this.customerAddressService.getCustomerAddress(customerAddress).subscribe(
            //   (Address) => {
            //     this.customerAddress.setAddress(Address);
            //   });
            return false;
          });
    } else {      
      result = await this.customerManagementService.updateForApplication(this.selectedCustomer).toPromise().
        then(resultEntity => {
          this.udfForm = this.formBuilder.group({});
          this.udfFields = [];
          this.indexFormUdf = 0;
          this.listUDFLinkNationality = [];
          this.listUDFGroups = [];
          this.listUDFLinkNationality = [];
          this.udfFormData = false;
          // clean acmMezaCardDto in case of change disbursment methode from internal to another methode
          if (resultEntity.mezaCardStatus === AcmConstants.MEZA_STATUS_NONE) {
            this.selectedCustomer.acmMezaCardDTO = null;
            this.selectedCustomer.mezaCardId = null;
            this.customerDisbursementComponent.selectedCustomer.acmMezaCardDTO = null;
            this.customerDisbursementComponent.selectedCustomer.mezaCardId = null;
          }
          this.getUdfCustomerInformation();
          this.selectedCustomer.acmMezaCardDTO = this.customerDisbursementComponent.selectedCustomer.acmMezaCardDTO;
          this.sharedService.setCustomer(this.selectedCustomer);
          // refresh the status(enabled or hidden) of 'Refresh mezaCard number' button
          this.customerDisbursementComponent.setSelectedCustomerMezaCardStatus(resultEntity.mezaCardStatus);
          this.customerDisbursementComponent.enableRefresh();
          // reset the new disbursementMethod
          this.customerDisbursementComponent.resetDisburesementMethodSelected();
          this.customerAddress.setAddress(resultEntity.listAddress);

          if (resultEntity.isSupplier) {
            this.devToolsServices.openToast(2, 'customer.is-supplier-msg');
          }

          this.sharedService.setLoader(false);
          return true;
        },
          err => {
            const customerAddress = new AddressEntity();
            customerAddress.customerId = this.selectedCustomer.id;
            this.customerAddressService.getCustomerAddress(customerAddress).subscribe(
              (Address) => {
                this.customerAddress.setAddress(Address);
              });
            return false;
          });
    }

    return result;
  }

  checkAgeForProduct() {
    if (this.dateG === null || this.dateH === null) {
      this.devToolsServices.openToast(3, 'alert.birth_date_missing');
      return false;
    }
    const today: Date = new Date();
    let age = 0;
    age = today.getFullYear() - this.dateG.year;
    if (this.dateG.month > today.getMonth() + 1) {
      age--;
    } else if (this.dateG.month === today.getMonth() + 1 && this.dateG.day > today.getDate()) {
      age--;
    }
    if (age >= this.product.minimumAge && age <= this.product.maximumAge) {
      return true;
    } else {
      this.devToolsServices.openToast(3, 'alert.age_limit_product');
      return false;
    }
  }

  /**
   * load products
   */
  async getProducts() {

    if (checkOfflineMode()) {
      const data = await this.dbService.getByKey('data', 'get_products').toPromise() as any;
      const products = data.data as ProductEntity[];

      this.product = products.filter(product => product.id === this.selectedLoan.productId)[0];
    } else {
      this.loanManagementService.getProductByIb(this.selectedLoan.productId).subscribe(
        (data) => {
          this.product = data;
        }
      );
    }

  }

  changeFormCustomer() {
    this.updateCutomer.emit(false);
    this.updateC.emit(false);
  }

  /**
   * detect address form changes
   */
  changeFormAddress() {
    this.updateC.emit(false);
  }

  /**
   * detect check box changes
   */
  radioChange() {
    this.updateC.emit(false);
  }

  /**
   * methode to get customers (autocomplete)
   * param event
   */
  filterCustomerSingle(event) {
    this.filteredCustomerSingle = [];
    this.customers.forEach(element => {
      element.customerName = this.sharedService.getCustomerName(element);
    });
    this.filteredCustomerSingle = this.customers.filter(c => c.customerName.toLowerCase().startsWith(event.query.toLowerCase()));
  }

  /**
   * create RelationShip form
   */
  createRelationShipForm() {
    this.customerRelationShipForm = this.formBuilder.group({});
  }

  /**
   * create RelationShip form
   */
  createLinkGroupForm() {
    this.customerLinkGroupeForm = this.formBuilder.group({});
  }

  /**
   * create RelationShip form
   */
  createLinkOrgForm() {
    this.customerLinkOrgForm = this.formBuilder.group({});
  }

  /**
   * methode to open the popup schedule
   * param content
   */
  openLarge(content, category: string, param: string) {
    this.categoryCustomerLinkRelation = category;
    this.customerLinkCategoryParam = param;
    this.modal.open(content, {
      size: 'xl'
    });
  }

  /**
   * Add Customer to Guarantors List
   */
  addCustomerRelationShipLink(event: CustomerEntity[]) {
    if (this.categoryCustomerLinkRelation === AcmConstants.CUSTOMER_TYPE_RELATION) {
      const oldRelationShipNumber = this.customerRelationShip.length;

      event.forEach((data) => {
        const relation: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
        relation.member = data;
        relation.category = AcmConstants.CUSTOMER_TYPE_RELATION;

        const isRelationShipExist = this.customerRelationShip.some(
          (relationShip) => relationShip.member.id === relation.member.id
        );

        if (isRelationShipExist)
          this.devToolsServices.openToastWithCustomerName(3, 'alert.relationship_exist', relation.member.customerName);
        else
          this.customerRelationShip.push(relation);

      });
      this.createRelationShipForm();

      const relationShipNumber = this.customerRelationShip.length;

      for (let i = oldRelationShipNumber; i < relationShipNumber; i++) {
        this.customerRelationShipForm.addControl('relationshipType' + i, new FormControl('', Validators.required));
      }

    } else if (this.categoryCustomerLinkRelation === AcmConstants.CUSTOMER_TYPE_LINK &&
      this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
      if (this.customerMemberGrpLink.length > this.nombreMembersMax) {
        this.devToolsServices.openToast(3, 'alert.member_max');
        return;
      }
      event.forEach((data) => {
        const grpLink: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
        grpLink.member = data;
        let memberExist = false;
        this.customerMemberGrpLink.forEach(
          (member) => {
            if (member.member.id === grpLink.member.id) {
              this.devToolsServices.openToast(3, 'alert.member_already_exist');
              memberExist = true;
              return;
            }
          });
        grpLink.category = AcmConstants.MEMBERS;
        if (!memberExist) {
          this.customerMemberGrpLink.push(grpLink);
        }
      });
      const relationLinkNumber = this.customerMemberGrpLink.length;
      for (let j = 0; j < relationLinkNumber; j++) {
        this.customerLinkGroupeForm.addControl('linkRelationshipType' + j, new FormControl('', Validators.required));
      }
    } else if (this.categoryCustomerLinkRelation === AcmConstants.CUSTOMER_TYPE_LINK &&
      this.selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_ORGANISATIONS) {
      event.forEach((data) => {
        const orglink: CustomerLinksRelationshipEntity = new CustomerLinksRelationshipEntity();
        orglink.member = data;
        let memberExist = false;
        this.customerMemberOrgLink.forEach(
          (member) => {
            if (member.member.id === orglink.member.id) {
              this.devToolsServices.openToast(3, 'alert.member_already_exist');
              memberExist = true;
              return;
            }
          });

        orglink.category = AcmConstants.MEMBERS;
        if (!memberExist) {
          this.customerMemberOrgLink.push(orglink);
        }
      });
      const relationLinkNumber = this.customerMemberOrgLink.length;
      for (let j = 0; j < relationLinkNumber; j++) {
        this.customerLinkOrgForm.addControl('linkRelationshipType' + j, new FormControl('', Validators.required));
        this.customerLinkOrgForm.addControl('percentageOwned' + j, new FormControl('', Validators.required));
      }
    }
  }

  /**
   * getValueLinkGrp
   */
  getValueLinkGrp(i) {
    if (this.customerMemberGrpLink.length > 0) {
      this.customerMemberGrpLink[i].linkRelationshipType = this.customerLinkGroupeForm.controls['linkRelationshipType' + i].value;
    }
    return this.customerMemberGrpLink;
  }

  /**
   * getValueLinkOrg
   */
  getValueLinkOrg(i) {
    if (this.customerMemberOrgLink.length > 0) {
      this.customerMemberOrgLink[i].linkRelationshipType = this.customerLinkOrgForm.controls['linkRelationshipType' + i].value;
    }
    return this.customerMemberOrgLink;
  }

  /**
   * getValueLinkGrp
   */
  getValueRelationShip(i) {
    if (this.customerRelationShip.length > 0) {
      this.customerRelationShip[i].linkRelationshipType = this.customerRelationShipForm.controls['relationshipType' + i].value;
    }
    return this.customerRelationShip;
  }

  /**
   * changePourcentageOwnerData
   */
  changePourcentageOwnerData() {
    if (this.customerMemberOrgLink.length > 0) {
      for (let i = 0; i < this.customerMemberOrgLink.length; i++) {
        this.customerMemberOrgLink[i].percentageOwned = this.customerLinkOrgForm.controls['percentageOwned' + i].value;
      }
    }
    return this.customerMemberOrgLink;
  }

  /**
   * delete relationShip
   * @param i index of Link
   */
  deleteRelationship(i: number) {
    this.customerRelationShip.splice(i, 1);
    this.customerRelationShipForm.controls['relationshipType' + i].clearValidators();
    this.customerRelationShipForm.controls['relationshipType' + i].reset();
  }

  /**
   * delete Link grp
   * @param i index of Link
   */
  deleteLinkGrp(i: number) {
    this.customerMemberGrpLink.splice(i, 1);
    this.customerLinkGroupeForm.controls['linkRelationshipType' + i].clearValidators();
    this.customerLinkGroupeForm.controls['linkRelationshipType' + i].reset();
  }

  /**
   * delete Link
   * @param i index of Link
   */
  deleteLinkOrg(i: number) {
    this.customerMemberOrgLink.splice(i, 1);
    this.customerLinkOrgForm.controls['percentageOwned' + i].clearValidators();
    this.customerLinkOrgForm.controls['percentageOwned' + i].reset();
    this.customerLinkOrgForm.controls['linkRelationshipType' + i].clearValidators();
    this.customerLinkOrgForm.controls['linkRelationshipType' + i].reset();

  }

  /**
   * getListLinkRelationShip
   */
  getListLinkRelationShip() {
    if (this.customerRelationShip.length > 0) {
      this.customerRelationShip.forEach((value) => {
        this.customerMemberRelationship.push(value);
      });
    }
    if (this.customerMemberGrpLink.length > 0) {
      this.customerMemberGrpLink.forEach((value) => {
        this.customerMemberRelationship.push(value);
      });
    }
    if (this.customerMemberOrgLink.length > 0) {
      this.customerMemberOrgLink.forEach((value) => {
        this.customerMemberRelationship.push(value);
      });
    }

  }

  /**
   * getConnectedUser
   */
  async getConnectedUser() {
    this.currentUser = this.sharedService.getUser();
  }

  /**
   * checkRole()
   */
  checkRole() {
    this.updateRole = true;
    const role: string[] = [];
    for (let i = 0; i < this.customerMemberRelationship.length; i++) {
      if (this.selectedCustomer.customerLinksRelationshipDTOs[i].linkRelationshipType === AcmConstants.HEAD) {
        role.push(this.selectedCustomer.customerLinksRelationshipDTOs[i].linkRelationshipType);
      }
    }
    if (role.length === 0) {
      this.devToolsServices.openToast(3, 'alert.no_head');
      this.updateRole = false;
    } else if (role.length >= 2) {
      this.devToolsServices.openToast(3, 'alert.more_than_one_head');
      this.updateRole = false;
    } else {
      this.updateRole = true;
    }
    return this.updateRole;
  }

  /**
   * mascPlacHolder
   * @param fieldMasc string
   */
  mascPlacHolder(fieldMasc) {
    if (fieldMasc !== '') {
      fieldMasc = new RegExp(fieldMasc);
      let lengthMasc = 0;
      fieldMasc.source.match(/\d+/g).map(Number).forEach(element => {
        lengthMasc = element;
      });
      let mask = '';
      for (let i = 1; i <= lengthMasc; i++) {
        mask += 'x';
      }
      return mask;
    }
    return '';
  }

  /**
   *
   * @param event event
   */
  checkMobile(event) {
    if (event.target.value === '') {
      this.sharedService.form.formGroup.controls.mobile.setErrors({ invalid: true });
    } else {
      this.customerManagementService.checkCustomerExistPhoneNumber(event.target.value).subscribe((data) => {
        if (data) {
          this.devToolsServices.openToast(3, 'alert.exist_phone_number');
          this.sharedService.form.formGroup.controls.mobile2.setErrors({ invalid: true });
        }
      });
    }
  }

  /**
   *
   * @param event event
   */
  changeNational(event) {
    // update gender and date of birth if critical data is disabled
    // or the group of user connected is allowed to update
    if (!this.selectedCustomer.enableCriticalData || this.updateCriticalData) {
      const nationalId = event.target.value;
      // set gender
      if(this.generateDateBirthGender === 1){
        if (nationalId !== null) {
          if (this.sharedService.form.formGroup.controls.gender !== undefined) {
            const genderIndex = nationalId.charAt(12);
            if ((genderIndex % 2) === 0) {
              if (this.sharedService.form.formGroup.controls.gender.value === 'M') {
                this.sharedService.form.formGroup.controls.gender.setValue('F');
                this.devToolsServices.openToast(2, 'alert.changed_gender');
              }

            } else {
              if (this.sharedService.form.formGroup.controls.gender.value === 'F') {
                this.sharedService.form.formGroup.controls.gender.setValue('M');
                this.devToolsServices.openToast(2, 'alert.changed_gender');
              }
            }
            // set date of birth
            const dateIndex = nationalId.substr(0, 7);
            // centry 1900
            if (dateIndex.charAt(0) === '2') {
              const year = '19';
              const checkDate = moment(year.concat(dateIndex.substr(1, 2)) + '-' + dateIndex.substr(3, 2) + '-' + dateIndex.substr(5, 2), 'YYYY-MM-DD');
              if (checkDate.isValid()) {
                this.dateG = new NgbDate(0, 0, 0);
                this.dateG.day = checkDate.date();
                this.dateG.month = checkDate.month() + 1;
                this.dateG.year = checkDate.year();

              } else {
                this.dateG = null;
                this.dateH = null;
                this.sharedService.form.formGroup.controls.nationalId.setErrors({ invalid: true });
                this.devToolsServices.openToast(3, 'alert.invalid_national_id');
              }
              // centry 2000
            } else if (dateIndex.charAt(0) === '3') {
              const year = '20';
              const checkDate = moment(year.concat(dateIndex.substr(1, 2)) + '-' + dateIndex.substr(3, 2) + '-' + dateIndex.substr(5, 2), 'YYYY-MM-DD');
              if (checkDate.isValid()) {
                this.dateG = new NgbDate(0, 0, 0);
                this.dateG.day = checkDate.date();
                this.dateG.month = checkDate.month() + 1;
                this.dateG.year = checkDate.year();
              } else {
                this.dateG = null;
                this.dateH = null;
                this.sharedService.form.formGroup.controls.nationalId.setErrors({ invalid: true });
                this.devToolsServices.openToast(3, 'alert.invalid_nationalId');
              }
            } else {
              this.dateG = null;
              this.dateH = null;
              this.sharedService.form.formGroup.controls.nationalId.setValidators([Validators.required,
              Validators.pattern(this.nationalityIdMask)]);
            }
            this.convertDateToHijri(event);
          }
        }
      }
    }
  }

  changeFormBankInformation() {
    this.updateCutomer.emit(false);
    this.updateC.emit(false);
  }
  /**
   * checkIssueDate
   */
  checkIssueDate() {
    if (this.issuedateG !== null || this.issuedateG !== undefined) {
      this.emptyIssueDate = false;
      if (this.issuedateG.year !== null && this.issuedateG.year !== undefined
        && this.issuedateG.month !== null && this.issuedateG.month !== undefined
        && this.issuedateG.day !== null && this.issuedateG.day !== undefined) {
        this.expirydateG = new NgbDate(this.issuedateG.year + this.differencePeriodIssueDate, this.issuedateG.month, this.issuedateG.day);
        // expiry date
        this.expirydateH = this.dateFormatterService.ToHijri(this.expirydateG);
        if (this.expirydateH.day === null) {
          this.expirydateG.day += 1;
          this.expirydateH = this.dateFormatterService.ToHijri(this.expirydateG);
          this.expirydateH.day -= 1;
        }
        this.emptyExpiry = false;
      }
    }
  }
  /**
   * openLoan
   * @param loan LoanEntity
   */
  async openLoan(loan: LoanEntity) {
    this.sharedService.setLoan(loan);
    await this.customerService.getCustomerInformation(loan.customerDTO.id).toPromise().then(
      (data) => {
        this.sharedService.setCustomer(data);
        this.router.navigate(['acm/check-guarantor']);
      });
  }


  async selectSourceProspection(event:any) {
    if(event){
      this.sharedService.form.formGroup.controls.prospectionSource.setValue(event.target.value);
    }
    if (this.sharedService.form.formGroup.controls.prospectionSource.value === AcmConstants.FOURNISSEUR) {
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
        await this.supplierService.getSupplierPagination(this.supplierPaginationEntity).toPromise().then(
          (data) => {
            this.supplierEntitys = data.resultsSuppliers;
          });
      }


    } else {
      this.supplierCheck = false;
    }
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
  onDateInputChange(event: any,type : string) {
    const dateFormatRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    let inputValue = event.target.value;
    const length = inputValue.length;
    if(inputValue && dateFormatRegex.test(inputValue) ) {
      const [dayStr,monthStr, yearStr] = inputValue.split('/');
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      if(type==='dateGr'){
        this.dateG = new NgbDate(year,month, day);  
        this.convertDateToHijri(event);
      }
      else if ( type ==='issueDate'){
        this.issuedateG = new NgbDate(year,month, day);
        this.checkIssueDate();
      }
    }
    if(length==2 && (inputValue.match(/\//g) || []).length < 1 ){
      event.target.value = inputValue + '/';
    } 
    else if (length==5 && (inputValue.match(/\//g) || []).length < 2 ){
      event.target.value = inputValue + '/';
    }
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

  getChildren(parentId: number): any[] {
    return this.settingList.filter((item) => item.valueJson?.parentListID === parentId && item.enabled);
  }
}
