import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';
import { SettingsService } from '../../Settings/settings.service';
import { BrancheEntity } from 'src/app/shared/Entities/branche.entity';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateType, DateFormatterService } from 'ngx-hijri-gregorian-datepicker';
import { CustomerEntity } from '../../../shared/Entities/customer.entity';
import { UserEntity } from '../../../shared/Entities/user.entity';
import { CustomerManagementService } from './customer-management.service';
import { CustomerLinksRelationshipEntity } from '../../../shared/Entities/CustomerLinksRelationship.entity';
import { CustomerAddressComponent } from '../customer-address/customer-address.component';
import { AcmConstants } from '../../../shared/acm-constants';
import { SharedService } from 'src/app/shared/shared.service';
import { UdfComponent } from '../../Loan-Application/udf/udf.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../../app.component';
import { UserDefinedFieldsEntity } from '../../../shared/Entities/userDefinedFields.entity';
import { UserDefinedFieldGroupEntity } from '../../../shared/Entities/userDefinedFieldGroup.entity';
import { UserDefinedFieldsLinksEntity } from '../../../shared/Entities/userDefinedFieldsLinks.entity';
import { DatePipe } from '@angular/common';
import { RoleEntity } from 'src/app/shared/Entities/Role.entity';
import { RelationshipEntity } from 'src/app/shared/Entities/relationship.entity';
import { IndustryEntity } from '../../../shared/Entities/industry.entity';
import { ScreeningEntity } from 'src/app/shared/Entities/screening.entity';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import * as moment from 'moment';
import { SettingFieldService } from '../../Settings/setting-fields.service';
import { forkJoin, Subject } from 'rxjs';
import { AcmIhmValidatorEntity } from 'src/app/shared/Entities/acmIhmValidator.entity';
import { CustomerDisbursementComponent } from '../customer-disbursement/customer-disbursement.component';
import { UserDefinedFieldListValuesEntity } from 'src/app/shared/Entities/userDefinedFieldListValues.entity';
import { checkOfflineMode, generateRandomNumber, getUdfLinkGroup } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { SupplierService } from '../../Supplier/supplier.service';
import { SupplierPaginationEntity } from 'src/app/shared/Entities/Supplier.pagination.entity';
import {customRequiredValidator,customEmailValidator,customPatternValidator} from '../../../shared/utils';
import { CustomerSettingEntity } from 'src/app/shared/Entities/customerSetting.entity';
import { ProspectionListValueEntity } from 'src/app/shared/Entities/ProspectionListValue.entity';
import { SettingListValuesEntity } from 'src/app/shared/Entities/settingListValues.entity';
import { ScreeningStepService } from '../../Loan-Application/screening-step/screening-step.service';
import { AcmAmlListSetting } from 'src/app/shared/Entities/AcmAmlListSetting.entity';
import { AcmAmlCheckEntity } from 'src/app/shared/Entities/AcmAmlCheck';
import { PortfolioEntity } from 'src/app/shared/Entities/Portfolio.entity';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';
import { SettingListEntity } from 'src/app/shared/Entities/AcmSettingList.entity';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.sass']
})
export class CustomerManagementComponent implements OnInit {

  customerIndivForm: FormGroup;
  customerOrganizartionForm: FormGroup;
  customerGroupForm: FormGroup;
  customerRelationShipForm: FormGroup;
  customerLinkGroupeForm: FormGroup;
  customerLinkOrgForm: FormGroup;
  public brancheEntitys: AcmBranches[] = [];
  public expandedCustomer = true;
  public expandedCustomerGrp = true;
  public expandedCustomerLinkGrp = true;
  public expandedCustomerLink = true;
  public expandedAddress = true;
  public expandedRelationships = true;
  public expandedAddressGrp = true;
  public expandedRelationshipsGrp = true;
  public dateH: NgbDateStruct;
  public dateG: NgbDate;
  public expirydateG: NgbDate;
  public issuedateG: NgbDate;
  public expirydateH: NgbDateStruct;
  public selectedDateTypeH = DateType.Hijri;
  public selectedDateTypeG = DateType.Gregorian;
  public selectedIssueDateTypeG = DateType.Gregorian;
  public customerIndiv: boolean;
  public customerOrganitation: boolean;
  public customerGroup: boolean;
  public customer: CustomerEntity = new CustomerEntity();
  public resident = true;
  public customers: CustomerEntity[] = [];
  public customerLinksRelationshipEntity: CustomerLinksRelationshipEntity[] = [];
  public addRelation = true;
  public addLink = true;
  public updateMode = true;
  public portfolios: UserEntity[] = [];
  public showAccountPortfolio = true;
  public nationalityIdMask;
  public residentIdyMask;
  public telephoneMask;
  public mobileMask;
  public emailMask;
  public roles: RoleEntity[];
  public relationships: RelationshipEntity[];
  public sectors: IndustryEntity[];
  public showKyc = true;
  public customerEntityKyc: CustomerEntity = new CustomerEntity();
  updateId = 0;
  @ViewChild(CustomerAddressComponent, { static: true }) customerAddress: CustomerAddressComponent;
  @ViewChild(UdfComponent, { static: true }) udfComp: UdfComponent;
  @ViewChild(CustomerDisbursementComponent, { static: true }) customerDisbursementComponent: CustomerDisbursementComponent;
  public udfFields: UserDefinedFieldsEntity[] = [];
  public udfLinkNationality: UserDefinedFieldsLinksEntity[] = [];
  public kycForm: FormGroup;
  public validationScreening: ScreeningEntity;
  public confirmationScreening: ScreeningEntity;
  public filteredCustomerSingle: CustomerEntity[] = [];
  public filteredCustomer: CustomerEntity;
  public todayGreg: NgbDate;
  public todayHijri: NgbDateStruct;
  public nombreMembersMax: number;
  public nombreMembersMin: number;
  public relationShipTypeForm: FormGroup;
  public categoryCustomerLinkRelation: string;
  public customerMemberGrpLink: CustomerLinksRelationshipEntity[] = [];
  public customerRelationShip: CustomerLinksRelationshipEntity[] = [];
  public customerMemberOrgLink: CustomerLinksRelationshipEntity[] = [];
  public customerLinkCategoryParam = '';
  public currentUser: UserEntity;
  public empty = false;
  public emptyExpiry = false;
  public maxNationalId: number;
  public mobileMaskLength: number;
  public phoneNumberMaskLength: number;
  public emptyIssueDate = false;
  public modeGuarantor = false;
  public filtersLoaded = new Subject<boolean>();
  public currentPath = 'customer-management';
  public branchIdSelected: number;
  public differencePeriodIssueDate = 0;
  public mezaCardMasks: Map<string, RegExp> = new Map<string, RegExp>();
  public familySituationList: UserDefinedFieldListValuesEntity[] = [];
  public nationalityList: UserDefinedFieldListValuesEntity[] = [];
  public residentRelationStatusList: UserDefinedFieldListValuesEntity[] = [];
  public placeNationalList: UserDefinedFieldListValuesEntity[] = [];
  public guarantors: CustomerEntity[] = [];
  public selectedCustomer = new CustomerEntity();
  public offline: boolean = false;
  public supplier: SupplierEntity = new SupplierEntity();
  public supplierEntitys: SupplierEntity[] = [];
  public supplierPaginationEntity: SupplierPaginationEntity = new SupplierPaginationEntity();
  public supplierCheck = false;
  public generateDateBirthGender : number;
  public showDisbursmentCardInformation : boolean;
  public customerSettingEntitys: CustomerSettingEntity[] = [];
  ProspectionListValues : ProspectionListValueEntity[]= [];
  public amlListSettings: AcmAmlListSetting[] = [];  public listPortfolio : PortfolioEntity[];
  settingList: SettingListEntity[] = [];
  filteredSettings: SettingListEntity[] = [];


  /**
   *
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param router Router
   * @param customerService CustomerServices
   * @param settingsService SettingsService
   * @param dateFormatterService DateFormatterService
   * @param customerInfoServices CustomerServices
   * @param customerManagementService CustomerManagementService
   * @param sharedService SharedService
   * @param modal NgbModal
   * @param translate TranslateService
   * @param datePipe DatePipe
   * @param authService AuthentificationService
   */
  constructor(public devToolsServices: AcmDevToolsServices,
    public formBuilder: FormBuilder,
    public router: Router,
    public customerService: CustomerServices,
    public settingsService: SettingsService,
    public dateFormatterService: DateFormatterService,
    public customerInfoServices: CustomerServices,
    public customerManagementService: CustomerManagementService,
    public sharedService: SharedService,
    public modal: NgbModal,
    public translate: TranslateService,
    public datePipe: DatePipe,
    public authService: AuthentificationService,
    public route: ActivatedRoute,
    public settingFieldService: SettingFieldService,
    public library: FaIconLibrary,
    private dbService: NgxIndexedDBService,
    public screeningStepService: ScreeningStepService,
    public supplierService: SupplierService) {
  }

  async ngOnInit() {
    if(!this.sharedService.getCustomer()?.id && this.sharedService.getCustomer()?.itemId && this.sharedService.getCustomer()?.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL ){
      this.updateMode = false;
    }
    this.route.queryParams.subscribe(params => {
      if (params !== undefined) {
        this.offline = Boolean(params.offline);
      }
    });
    if(!checkOfflineMode()) {
    let settingListValuesEntity: SettingListValuesEntity = new SettingListValuesEntity();
    settingListValuesEntity.listName = AcmConstants.PROSPECTION_LIST;
    await this.settingsService.getSettingListValues(settingListValuesEntity).toPromise().then((res) => {
      if(res){
       this.fillProspectionListValues(res);
      }
    })
  }
  else {
    await this.dbService.getByKey('data','settingListValue_'+AcmConstants.PROSPECTION_LIST).subscribe((values:any)=>{
      if(values){
       this.fillProspectionListValues(values.data);
      }
    })
  }
    const mode = checkOfflineMode() || this.offline ? 2 : 0;
    this.currentUser = this.sharedService.getUser();

    this.customerIndiv = true;
    await this.getCustomerSetting();


    if (checkOfflineMode() || this.offline) {
     await this.dbService.getByKey('data', 'ihm-validators').subscribe((patterns: any) => {
        if (patterns === undefined) {
          this.devToolsServices.openToast(3, 'No validators saved for offline use');
        } else {
          this.ihmValidators(patterns.data);
          this.createIndivForm();
          this.createRelationShipForm();
          this.createLinkGroupForm();
          this.createLinkOrgForm();
        }
      });
    } else {
      // charger les pattern  from the dataBase (table AcmIhmValidators)
      await this.settingFieldService.getIhmValidators(new AcmIhmValidatorEntity()).subscribe((data) => {
        this.ihmValidators(data);
        this.createIndivForm();
        this.createRelationShipForm();
        this.createLinkGroupForm();
        this.createLinkOrgForm();

      });
    }


    await this.sharedService.habilitationIhmFields(AcmConstants.FORM_ADD_CUSTOMER_INDIV, mode).then(
      () => {
        // notifier la page html que le form est pret
        this.filtersLoaded.next(true);
      }
    );
    // find branch / Get UDF Nationality / load members Group / ORG Roles values / load Relationship values
    // load Sector values
    this.forkJoinFunction();

    const today: Date = new Date();
    this.todayGreg = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.todayHijri = this.dateFormatterService.ToHijri(this.todayGreg);
    this.route.queryParams.subscribe(params => {
      // if navigation is add new guarantor
      this.modeGuarantor = params.source === 'add-guarantor';
    });

    const customer = this.sharedService.getCustomer();


    if (customer?.customerType === AcmConstants.CUSTOMER_CATEGORY_PROSPECT ||  (!customer?.id && customer?.itemId)) {
      this.selectedCustomer = customer;
      this.createFormUpdate(this.selectedCustomer);
      this.udfComp.fillUdfForm(AcmConstants.CUSTOMER_CATEGORY_CUSTOMER, customer.id);
    }

    this.settingsService.findAMLListSetting(new AcmAmlListSetting()).toPromise().then((res) => {
      this.amlListSettings = res.map(item => ({ ...item, listName: item.listName.replaceAll("_", " ") }));
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
  }


  getChildren(parentId: number): any[] {
    return this.settingList.filter((item) => item.valueJson?.parentListID === parentId && item.enabled);
  }

 async getCustomerSetting(){
    if(checkOfflineMode()){
    await  this.dbService.getByKey('data','customer_setting').toPromise().then((setting:any)=>{
        if(setting !== undefined){
          this.customerSettingEntitys = setting.data;          
        }
      })
    } else {
    this.settingsService.findAllSettingCustomer().subscribe(
      (data) => {
        this.customerSettingEntitys = data;
      });
    }
  }

  findTypeSetting(type: string ) : boolean{
    if (this.customerSettingEntitys.filter(elm=>elm.type === type && elm.enabled ===true).length>0){
      return true ;
  } else return false ;

  }

  async ihmValidators(patterns) {

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
      this.phoneNumberMaskLength = element ;
    });
    // length phone number
    this.mobileMask.source.match(/\d+/g)?.map(Number).forEach(element => {
      this.mobileMaskLength=element;
    });
    this.nationalityIdMask.source.match(/\d+/g).map(Number).forEach(element => {
      this.maxNationalId = element + 1;
    });
  }



  /**
   * join list of observables
   */
  forkJoinFunction() {
    // get udf list
    for (let i = 0; i < 4; i++) {
      this.udfFields[i] = new UserDefinedFieldsEntity();
      this.udfFields[i].fieldListValuesDTOs = [];
    }
    const userDefinedFieldsEntity: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
    const userDefinedFieldGroupDTO: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
    userDefinedFieldGroupDTO.code = AcmConstants.CUSTOMER_NATIONALITY_CODE;
    userDefinedFieldsEntity.userDefinedFieldGroupDTO = userDefinedFieldGroupDTO;

    if (checkOfflineMode() || this.offline) {
      this.dbService.getByKey('data', 'branches-list').subscribe((branches: any) => {
        if (branches === undefined) {
          this.devToolsServices.openToast(3, 'No bracnhes saved for offline use');
        } else {
          this.branchAndPortfolioOfConnectedUser(branches.data);
        }
      });

      this.dbService.getByKey('data', 'udf-fields-customer').subscribe((udfFields: any) => {
        if (udfFields === undefined) {
          this.devToolsServices.openToast(3, 'No udf fields saved for offline use');
        } else {
          this.udfFieldList(udfFields.data);
        }
      });

      this.dbService.getByKey('data', 'find-role').subscribe((roles: any) => {
        if (roles === undefined) {
          this.devToolsServices.openToast(3, 'No roles saved for offline use');
        } else {
          this.roles = roles.data;
        }
      });

      this.dbService.getByKey('data', 'find-relationship').subscribe((relationships: any) => {
        if (relationships === undefined) {
          this.devToolsServices.openToast(3, 'No relationship saved for offline use');
        } else {
          this.relationships = relationships.data;
        }
      });

      this.dbService.getByKey('data', 'find-sector').subscribe((sectors: any) => {
        if (sectors === undefined) {
          this.devToolsServices.openToast(3, 'No sectors saved for offline use');
        } else {
          this.sectors = sectors.data;
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
      // Environnement
      const acmEnvironmentKeys: string[] = [AcmConstants.MEMBERS_NUMBER_MAX, AcmConstants.MEMBERS_NUMBER_MIN,
      AcmConstants.DIFFERENCE_PERIOD_OF_EXPIRY_DATE_AND_ISSUE_DATE, AcmConstants.GENERATE_DATE_OF_BIRTH_GENDER,AcmConstants.DISBURSMENT_CARD];
      forkJoin([this.settingsService.findBranches(new AcmBranches()),
      this.customerManagementService.getUdfField(userDefinedFieldsEntity),
      this.customerManagementService.findRole(),
      this.customerManagementService.findRelationship(),
      this.customerManagementService.findSector()
      ]).subscribe(result => {
        // branch
        this.branchAndPortfolioOfConnectedUser(result[0]);
        // udf field
        this.udfFieldList(result[1]);
        // role
        this.roles = result[2];
        // relationship
        this.relationships = result[3];
        // sector
        this.sectors = result[4];
        
      });

      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys)
      .subscribe(result => {
        this.nombreMembersMax = Number(result[0].value);
        this.nombreMembersMin = Number(result[1].value);
        this.differencePeriodIssueDate = Number(result[2].value);
        this.generateDateBirthGender = Number(result[3].value);
        this.showDisbursmentCardInformation = result[4].enabled;
      })
    }

  }


  /**
   * find branch and portfolio of connected user
   */
  getBranchPortfolioConnectedUser() {
    this.settingsService.findBranches(new AcmBranches()).subscribe(
      (data) => {
        this.brancheEntitys = data;
        // find branch of connected user
        this.brancheEntitys.forEach((brancheUser) => {
          if (brancheUser.id === this.currentUser.branchID) {
            if (this.customerIndiv) {
              this.sharedService.form.formGroup.controls.branch.setValue(brancheUser);

            } else if (this.customerGroup) {
              this.customerGroupForm.controls.branch.setValue(brancheUser);
            } else if (this.customerOrganitation) {

              this.customerOrganizartionForm.controls.branch.setValue(brancheUser);
            }
            // find portfolio of connected user
            const userEntity: UserEntity = new UserEntity();
            userEntity.branchID = brancheUser.id;
            // set branchIdSelected to send it to customer-disbursement child
            this.branchIdSelected = userEntity.branchID;  
            this.settingsService.findAllAcmPortfolio().subscribe(
              (portfolios) => {
                this.listPortfolio = portfolios;
                this.listPortfolio.forEach((portfolioUser) => {
                  if (portfolioUser.portfolioId.toString() == this.currentUser.accountPortfolioId) {
                    if (this.customerIndiv) {

                      this.sharedService.form.formGroup.controls.loanOfficer.setValue(portfolioUser);
                    } else if (this.customerGroup) {

                      this.customerGroupForm.controls.loanOfficer.setValue(portfolioUser);
                    } else if (this.customerOrganitation) {

                      this.customerOrganizartionForm.controls.loanOfficer.setValue(portfolioUser);
                    }
                  }
                });
              }
            );
          }
        });
      }
    );
  }
  /**
   * get branchAndPortfolioOfConnectedUser
   * @param data brancheEntitys
   */
  branchAndPortfolioOfConnectedUser(data) {
    this.brancheEntitys = data;
    // find branch of connected user
    this.brancheEntitys.forEach((brancheUser) => {
      if (brancheUser.id === this.currentUser.branchID) {
        if (this.customerIndiv) {
          this.sharedService.form.formGroup.controls.branch.setValue(brancheUser);

        } else if (this.customerGroup) {
          this.customerGroupForm.controls.branch.setValue(brancheUser);
        } else if (this.customerOrganitation) {

          this.customerOrganizartionForm.controls.branch.setValue(brancheUser);
        }
        // find portfolio of connected user
        const userEntity: UserEntity = new UserEntity();
        userEntity.branchID = brancheUser.id;
        // set branchIdSelected to send it to customer-disbursement child
        this.branchIdSelected = userEntity.branchID;

        if (checkOfflineMode() || this.offline) {
          this.dbService.getByKey('data', 'find-all-portfolio-' + userEntity.branchID).subscribe((portfolio: any) => {
            if (portfolio === undefined) {
              this.devToolsServices.openToast(3, 'No portfolio saved for offline use');
            } else {
              this.setLoanOfficer(portfolio.data);
            }
          });
        } else {
          this.settingsService.findAllAcmPortfolio().subscribe(
            (portfolios) => {
              this.setLoanOfficer(portfolios);
            }
          );
        }

      }
    });
  }

  setLoanOfficer(portfolios) {
    this.listPortfolio = portfolios;
    this.showAccountPortfolio = false;
    this.listPortfolio.forEach((portfolioUser) => {
      if (portfolioUser.portfolioId.toString() == this.currentUser.accountPortfolioId) {
        if (this.customerIndiv) {

          this.sharedService.form.formGroup.controls.loanOfficer.setValue(portfolioUser);
        } else if (this.customerGroup) {

          this.customerGroupForm.controls.loanOfficer.setValue(portfolioUser);
        } else if (this.customerOrganitation) {

          this.customerOrganizartionForm.controls.loanOfficer.setValue(portfolioUser);
        }
      }
    });
  }

  /**
   * compareBranch
   * @param branch1 branch1
   * @param branch2 branch2
   */
  compareBranch(branch1, branch2) {
    if (branch2 !== null) {
      return branch1.id === branch2.id && branch1.name === branch2.name
        && branch1.description === branch2.description;
    } else {
      return false;

    }
  }

  /**
   * comparePortfolio
   * @param portfolio1 portfolio1
   * @param portfolio2 portfolio2
   */
  comparePortfolio(portfolio1, portfolio2) {
    if (portfolio2 !== null) {

      return portfolio1.accountPortfolioId === portfolio2.accountPortfolioId;
    } else {
      return false;
    }
  }

  /**
   * create Individual form
   */
  createIndivForm() {
    this.customerIndivForm = this.formBuilder.group({
      namePart1: ['', [customRequiredValidator, customPatternValidator(/^[a-zA-Z\u0600-\u06FF ]*$/)]],
      namePart2: [''],
      namePart3: [''],
      namePart4: ['', [customRequiredValidator, customPatternValidator(/^[a-zA-Z\u0600-\u06FF ]*$/)]],
      mobile: ['', [customRequiredValidator, customPatternValidator(this.telephoneMask)]],
      email: ['', [customEmailValidator(this.emailMask)]],
      branch: ['', customRequiredValidator],
      loanOfficer: ['', customRequiredValidator],
      gender: ['', customRequiredValidator],
      mobile2: ['', customPatternValidator(this.mobileMask)],
      mobile3: [''],
      fax: [''],
      nationality: ['', customRequiredValidator],
      national_id: ['', [customRequiredValidator, customPatternValidator(this.nationalityIdMask)]],
      resident_ID: ['', [customRequiredValidator, customPatternValidator(this.residentIdyMask), Validators.maxLength(10)]],
      residentRelationStatus: ['', customRequiredValidator],
      placeNationalId: ['', customRequiredValidator],
      familySituation: ['', customRequiredValidator]
    });
  }
  checkNatioanlIdInput(event){
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  /**
   * create form update
   */
  async createFormUpdate(selectedCustomer: CustomerEntity) {
    const branch: AcmBranches = new AcmBranches();
    branch.id = selectedCustomer.branchId;
    branch.name = selectedCustomer.branchesName;
    branch.description = selectedCustomer.branchesDescription;
    const portfolio: UserEntity = new UserEntity();
    portfolio.accountPortfolioId = selectedCustomer.accountPortfolioID;
    portfolio.login = selectedCustomer.accountPortfolioCode;
    portfolio.simpleName = selectedCustomer.accountPortfolioDescription;
    let accountYearEndValid: string;
    if (selectedCustomer.accountYearEnd != null) {
      accountYearEndValid = new Date(selectedCustomer.accountYearEnd).toISOString().substring(0, 10);
    } else {
      accountYearEndValid = '';
    }
    if (selectedCustomer.customerType === AcmConstants.CUSTOMER_TYPE_INDIVIDUAL
      || selectedCustomer.customerType === AcmConstants.CUSTOMER_CATEGORY_PROSPECT) {
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
      if (this.sharedService.form.formGroup.controls.nationalId !== undefined) {
        this.sharedService.form.formGroup.controls.nationalId.setValue(selectedCustomer.identity);
      }
      if (this.selectedCustomer.dateOfBirth != null) {
        this.selectedCustomer.dateOfBirth = new Date(this.selectedCustomer.dateOfBirth);
        this.dateG = new NgbDate(0, 0, 0);
        this.dateG.day = this.selectedCustomer.dateOfBirth.getDate();
        this.dateG.month = this.selectedCustomer.dateOfBirth.getMonth() + 1;
        this.dateG.year = this.selectedCustomer.dateOfBirth.getFullYear();
        this.convertExpiryDateToHijri()
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
      if (this.sharedService.form.formGroup.controls.supplierRecommandation !== undefined) {
        let supplier = this.supplierEntitys.filter((item) => item.id === selectedCustomer.supplierRecommandation)[0];
        this.sharedService.form.formGroup.controls.supplierRecommandation.setValue(supplier);
      }
      if (this.sharedService.form.formGroup.controls.patentNumber !== undefined) {
        this.sharedService.form.formGroup.controls.patentNumber.setValue(selectedCustomer.registerNumber);
      }
    }
  }

  /**
   * create Organization form
   */
  createOrganizationForm() {
    this.customerOrganizartionForm = this.formBuilder.group({
      mobile: ['', [customRequiredValidator, customPatternValidator(this.telephoneMask)]],
      email: ['', [customEmailValidator(this.emailMask)]],
      branch: ['', customRequiredValidator],
      loanOfficer: ['', customRequiredValidator],
      mobile2: ['', customPatternValidator(this.mobileMask)],
      mobile3: [''],
      organizationName: ['', customRequiredValidator],
      sector: ['', customRequiredValidator],
      registrationNumber: [''],
      fax: [''],
      webSite: [''],
      accountYearEnd: ['', customRequiredValidator]
    });
  }

  /**
   * create Group form
   */
  createGroupForm() {
    this.customerGroupForm = this.formBuilder.group({
      solidarityName: ['', customRequiredValidator],
      branch: ['', customRequiredValidator],
      loanOfficer: ['', customRequiredValidator]
    });
  }

  /**
   * create RelationShip form
   */
  createRelationShipForm() {
    this.customerRelationShipForm = this.formBuilder.group({
      relationshipType: [''],
    });
  }

  /**
   * create RelationShip form
   */
  createLinkGroupForm() {
    this.customerLinkGroupeForm = this.formBuilder.group({
      linkRelationshipType: [''],
    });
  }

  /**
   * create RelationShip form
   */
  createLinkOrgForm() {
    this.customerLinkOrgForm = this.formBuilder.group({
      linkRelationshipType: [''],
      percentageOwned: [''],
    });
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
   * toggle Collapse Relationships
   */
  toggleCollapseRelationships() {
    this.expandedRelationships = !this.expandedRelationships;
  }

  /**
   * toggle Customer GRP Card
   */
  toggleCollapseCustomerGrp() {
    this.expandedCustomerGrp = !this.expandedCustomerGrp;
  }

  /**
   * toggle Address GRP card
   */
  toggleCollapseAddressGrp() {
    this.expandedAddressGrp = !this.expandedAddressGrp;
  }

  /**
   * toggle Customer Link GRP card
   */
  toggleCollapseCustomerLinkGrp() {
    this.expandedCustomerLinkGrp = !this.expandedCustomerLinkGrp;
  }

  /**
   * toggle Collapse Relationships Grp
   */
  toggleCollapseRelationshipsGrp() {
    this.expandedRelationshipsGrp = !this.expandedRelationshipsGrp;
  }

  /**
   * convert Date Hijri To Gregorian
   */
  convertDateToGregorian() {
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
  convertDateToHijri() {
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
  convertExpiryDateToGregorian() {
    this.expirydateG = this.dateFormatterService.ToGregorian(this.expirydateH);
    this.emptyExpiry = false;
  }

  /**
   * convert Expiry Date Gregorian To Hijri
   */
  convertExpiryDateToHijri() {
    this.expirydateH = this.dateFormatterService.ToHijri(this.expirydateG);
    this.emptyExpiry = false;
  }

  /**
   * Change Customer Type
   */
  async changeCustomerType(type: number) {
    if (checkOfflineMode() || this.offline) return;

    this.customer = new CustomerEntity();
    this.sharedService.form.formGroup.reset();
    this.customerLinksRelationshipEntity = [];
    this.portfolios = [];
    this.addLink = true;
    this.addRelation = true;
    this.showAccountPortfolio = true;
    this.customerMemberGrpLink = [];
    this.customerRelationShip = [];
    this.customerMemberOrgLink = [];
    this.udfComp.listUDFGroups = [];
    this.udfComp.udfFields = [];
    switch (type) {
      case 1:
        this.customerIndiv = true;
        this.customerOrganitation = false;
        this.customerGroup = false;
        this.createIndivForm();
        // re-load UDF by type customer
        this.customer.customerType = AcmConstants.CUSTOMER_TYPE_INDIVIDUAL;
        this.sharedService.setCustomer(this.customer);
        this.udfComp.ngOnInit();
        this.customerDisbursementComponent.ngOnInit();
        this.getBranchPortfolioConnectedUser();
        await this.sharedService.habilitationIhmFields(AcmConstants.FORM_ADD_CUSTOMER_INDIV).then(
          () => {
            // notifier la page html que le form est pret
            this.filtersLoaded.next(true);
          }
        );
        break;
      case 2:
        this.customerIndiv = false;
        this.customerOrganitation = true;
        this.customerGroup = false;
        this.createOrganizationForm();
        // re-load UDF by type customer
        this.customer.customerType = AcmConstants.CUSTOMER_TYPE_ORGANISATIONS;
        this.sharedService.setCustomer(this.customer);
        this.udfComp.ngOnInit();
        this.customerDisbursementComponent.ngOnInit();
        this.getBranchPortfolioConnectedUser();
        // load fields of add_customer_org form
        await this.sharedService.habilitationIhmFields(AcmConstants.FORM_ADD_CUSTOMER_ORG).then(
          () => {
            // notifier la page html que le form est pret
            this.filtersLoaded.next(true);
          }
        );
        break;
      case 3:
        this.customerIndiv = false;
        this.customerOrganitation = false;
        this.customerGroup = true;
        this.createGroupForm();
        // re-load UDF by type customer
        this.customer.customerType = AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY;
        this.sharedService.setCustomer(this.customer);
        this.udfComp.ngOnInit();
        this.customerDisbursementComponent.ngOnInit();
        this.getBranchPortfolioConnectedUser();
        // load fields of add_customer_grp form
        await this.sharedService.habilitationIhmFields(AcmConstants.FORM_ADD_CUSTOMER_GRP).then(
          () => {
            // notifier la page html que le form est pret
            this.filtersLoaded.next(true);
          }
        );
        break;
    }
  }

  /**
   * Add Form Customer
   * @param event : only save customer OR save customer and move to add loan page
   */
  async addCustomer(event) {
    
    // Customer Address
    this.customer.listAddress = this.customerAddress.OnSubmit();
    if (this.customer.listAddress === null) {
      return;
    }
    // Customer UDF
    this.customer.userDefinedFieldsLinksDTOs = this.udfComp.onSubmitCustomer(new CustomerEntity());
    this.customerLinksRelationshipEntity = [];
    this.getListLinkRelationShip();
    this.convertDateToHijri();
    if (this.customerIndiv && this.sharedService.form.formGroup.valid) {
      // customer information

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

      this.customer.fields = JSON.stringify(resultList);
      this.customer.customerType = AcmConstants.CUSTOMER_TYPE_INDIVIDUAL;
      this.customer.firstName = (this.sharedService.form.formGroup.controls.namePart1) !== undefined ?
        this.sharedService.form.formGroup.controls.namePart1.value.trim() : null;
      this.customer.secondName = (this.sharedService.form.formGroup.controls.namePart2 && this.sharedService.form.formGroup.controls.namePart2.value) ?
        this.sharedService.form.formGroup.controls.namePart2.value.trim() : null;
      this.customer.middleName = (this.sharedService.form.formGroup.controls.namePart3 && this.sharedService.form.formGroup.controls.namePart3.value) ?
        this.sharedService.form.formGroup.controls.namePart3.value.trim() : null;
      this.customer.lastName = (this.sharedService.form.formGroup.controls.namePart4) !== undefined ?
        this.sharedService.form.formGroup.controls.namePart4.value.trim() : null;
      this.customer.gender = (this.sharedService.form.formGroup.controls.gender) !== undefined ?
        this.sharedService.form.formGroup.controls.gender.value : null;
      this.customer.dateOfBirth = new Date(Date.UTC(this.dateG.year, this.dateG.month - 1, this.dateG.day));
      if (this.dateH ) {
        this.customer.dateOfBirthHijri = this.dateH.year + '-' + this.dateH.month + '-' + this.dateH.day;
    } else {
      this.customer.dateOfBirthHijri = ''
    }
      this.customer.telephone1 = (this.sharedService.form.formGroup.controls.mobile) !== undefined ?
        this.sharedService.form.formGroup.controls.mobile.value : null;
      this.customer.telephone2 = (this.sharedService.form.formGroup.controls.mobile2) !== undefined ?
        this.sharedService.form.formGroup.controls.mobile2.value : null;
      this.customer.email = (this.sharedService.form.formGroup.controls.email) !== undefined &&
        (this.sharedService.form.formGroup.controls.email.value) !== null ?
        this.sharedService.form.formGroup.controls.email.value.toLowerCase() : null;
      this.customer.branchId = (this.sharedService.form.formGroup.controls.branch) !== undefined ?
        this.sharedService.form.formGroup.controls.branch.value.id : null;
      this.customer.branchesName = (this.sharedService.form.formGroup.controls.branch) !== undefined ?
        this.sharedService.form.formGroup.controls.branch.value.name : null;
      this.customer.branchesDescription = (this.sharedService.form.formGroup.controls.branch) !== undefined ?
        this.sharedService.form.formGroup.controls.branch.value.description : null;
      this.customer.accountPortfolioID = (this.sharedService.form.formGroup.controls.loanOfficer) !== undefined ?
        this.sharedService.form.formGroup.controls.loanOfficer.value.portfolioId : null;
      this.customer.accountPortfolioCode = (this.sharedService.form.formGroup.controls.loanOfficer) !== undefined ?
        this.sharedService.form.formGroup.controls.loanOfficer.value.code : null;
      this.customer.accountPortfolioDescription = (this.sharedService.form.formGroup.controls.loanOfficer) !== undefined ?
        this.sharedService.form.formGroup.controls.loanOfficer.value.portfolioName.replace(/\s*\(.*\)/, "").trim() : null;

/*         this.customer.nationalityId = (this.sharedService.form.formGroup.controls.nationality) !== undefined ?
        this.sharedService.form.formGroup.controls.nationality.value : null;

        this.customer.familySituationId = (this.sharedService.form.formGroup.controls.familySituation) !== undefined ?
        this.sharedService.form.formGroup.controls.familySituation.value : null;

        this.customer.placeOfIssueId = (this.sharedService.form.formGroup.controls.placeNationalId) !== undefined ?
        this.sharedService.form.formGroup.controls.placeNationalId.value : null; */



      // Register number ( or patent number )
      let registerNumber = (this.sharedService.form.formGroup.controls.patentNumber) ? this.sharedService.form.formGroup.controls.patentNumber.value?.trim() : null;
      this.customer.registerNumber = registerNumber !== "" ? registerNumber : null;

      this.customer.beneficialEffective = (this.sharedService.form.formGroup.controls.beneficialEffective) !== undefined ?
      this.sharedService.form.formGroup.controls.beneficialEffective.value : null;

      this.customer.prospectionSource = (this.sharedService.form.formGroup.controls.prospectionSource.value) !== undefined ?
      this.sharedService.form.formGroup.controls.prospectionSource.value : null;

      if (this.sharedService.form.formGroup.controls.prospectionSource.value === AcmConstants.FOURNISSEUR) {
        this.customer.supplierRecommandation = this.sharedService.form.formGroup.controls.supplierRecommandation.value.id
      }
      else{
        this.customer.prospectionComment = this.sharedService.form.formGroup.controls.prospectionComment.value
      }

      // customer link relationship
      this.customer.customerLinksRelationshipDTOs = this.customerLinksRelationshipEntity;
      // customer udf Nationality
/*       const nationality: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      nationality.userDefinedFieldsDTO = this.udfFields.filter(value => value.name === AcmConstants.NATIONALITY)[0];
      nationality.udfListValueId = this.udfFields.filter(value => value.name === 'Nationality')[0].idUDFListValue;
      nationality.fieldValue = (this.sharedService.form.formGroup.controls.nationality) !== undefined &&
        this.sharedService.form.formGroup.controls.nationality.value !== null ?
        this.sharedService.form.formGroup.controls.nationality.value.idUDFListValue : null;
      nationality.indexGroup = this.udfComp.listUDFGroups.length;
      this.customer.userDefinedFieldsLinksDTOs.push(nationality); */
      // hijri birth date
     /* const hijriBirthDate: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      hijriBirthDate.userDefinedFieldsDTO = this.udfFields.filter(value => value.name === AcmConstants.HIJRI_BIRTH_DATE)[0];
      const givenHijriBirthDate: Date = new Date(this.dateH.year + '-' + this.dateH.month + '-' + this.dateH.day);
      hijriBirthDate.fieldValue = this.datePipe.transform(givenHijriBirthDate, 'dd/MM/yyyy');
      hijriBirthDate.indexGroup = this.udfComp.listUDFGroups.length;
      this.customer.userDefinedFieldsLinksDTOs.push(hijriBirthDate);*/
      if (this.resident) {
        // nationalId
        this.customer.identity = this.sharedService.form.formGroup.controls.nationalId.value;
        this.customer.nationalId = (this.sharedService.form.formGroup.controls.nationalId) !== undefined ?
        this.sharedService.form.formGroup.controls.nationalId.value : null;
      } else {
        // residentId
        this.customer.identity = this.sharedService.form.formGroup.controls.residentId?.value;
        this.customer.residentId = (this.sharedService.form.formGroup.controls.residentId) !== undefined ?
        this.sharedService.form.formGroup.controls.residentId.value : null;
      /*  // residentRelationStatus
        const residentRelationStatus: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
        residentRelationStatus.userDefinedFieldsDTO = this.udfFields
          .filter(value => value.name === AcmConstants.RESIDENCE_RELATION_STATUS)[0];
        residentRelationStatus.udfListValueId = this.udfFields
          .filter(value => value.name === AcmConstants.RESIDENCE_RELATION_STATUS)[0].idUDFListValue;
        //    residentRelationStatus.fieldValue = (this.sharedService.form.formGroup.controls.residentRelationStatus) !== undefined &&
        //     this.sharedService.form.formGroup.controls.residentRelationStatus.value !== null ?
        //    this.sharedService.form.formGroup.controls.residentRelationStatus.value.idUDFListValue : null;
        residentRelationStatus.indexGroup = this.udfComp.listUDFGroups.length;
        this.customer.userDefinedFieldsLinksDTOs.push(residentRelationStatus);*/
      }


      const givenIssueDate: Date = new Date(this.issuedateG.year + '-' + this.issuedateG.month + '-' + this.issuedateG.day);
      this.customer.issueDate = this.datePipe.transform(givenIssueDate, 'dd/MM/yyyy');

      const givenEexpiryDate: Date = new Date(this.expirydateG.year + '-' + this.expirydateG.month + '-' + this.expirydateG.day);
      this.customer.expiryDate = this.datePipe.transform(givenEexpiryDate, 'dd/MM/yyyy');

      // customer disbursement information
      const disbursementMethod: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      disbursementMethod.userDefinedFieldsDTO = this.customerDisbursementComponent.udfSettingbankInformation
        .filter(value => value.name === AcmConstants.DISBURSEMENT_METHOD)[0];
      disbursementMethod.udfListValueId = this.customerDisbursementComponent.udfSettingbankInformation
        .filter(value => value.name === AcmConstants.DISBURSEMENT_METHOD)[0].idUDFListValue;
      disbursementMethod.fieldValue = this.customerDisbursementComponent.formDisbursement.controls.disbursementMethod.value !== undefined ?
        this.customerDisbursementComponent.formDisbursement.controls.disbursementMethod.value.idUDFListValue : null;
      disbursementMethod.indexGroup = this.udfComp.listUDFGroups.length + 1;
      this.customer.userDefinedFieldsLinksDTOs.push(disbursementMethod);
      if (this.customerDisbursementComponent.formDisbursement.controls.disbursementMethod.value.name === AcmConstants.MEZA_CARD_INTERNAL) {
        this.customer.mezaCardId = this.customerDisbursementComponent.mezaCardId;
        this.customer.mezaCardStatus = AcmConstants.MEZA_STATUS_NEW;
      } else {
        this.customer.mezaCardId = null;
      }
      const bankCode: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      if (this.customerDisbursementComponent.udfSettingbankInformation.filter(value => value.name === AcmConstants.CODE_BANK)[0] !== undefined) {
        bankCode.userDefinedFieldsDTO = this.customerDisbursementComponent.udfSettingbankInformation
          .filter(value => value.name === AcmConstants.CODE_BANK)[0];
        bankCode.udfListValueId = this.customerDisbursementComponent.udfSettingbankInformation
          .filter(value => value.name === AcmConstants.CODE_BANK)[0].idUDFListValue;
        bankCode.fieldValue = (this.customerDisbursementComponent.formDisbursement.controls.bankCode.value !== undefined &&
          this.customerDisbursementComponent.formDisbursement.controls.bankCode.value !== null) ?
          this.customerDisbursementComponent.formDisbursement.controls.bankCode.value.idUDFListValue : null;
        bankCode.indexGroup = this.udfComp.listUDFGroups.length + 1;
        this.customer.userDefinedFieldsLinksDTOs.push(bankCode);
      }
      const branchCode: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      if (this.customerDisbursementComponent.udfSettingbankInformation.filter(value => value.name === AcmConstants.CODE_BRANCH)[0] !== undefined) {
        branchCode.userDefinedFieldsDTO = this.customerDisbursementComponent.udfSettingbankInformation
          .filter(value => value.name === AcmConstants.CODE_BRANCH)[0];
        branchCode.udfListValueId = this.customerDisbursementComponent.udfSettingbankInformation
          .filter(value => value.name === AcmConstants.CODE_BRANCH)[0].idUDFListValue;
        branchCode.fieldValue = (this.customerDisbursementComponent.formDisbursement.controls.branchCode.value !== undefined &&
          this.customerDisbursementComponent.formDisbursement.controls.branchCode.value !== null) ?
          this.customerDisbursementComponent.formDisbursement.controls.branchCode.value.idUDFListValue : null;
        branchCode.indexGroup = this.udfComp.listUDFGroups.length + 1;
        this.customer.userDefinedFieldsLinksDTOs.push(branchCode);
      }


      const accountNumber: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      if (this.customerDisbursementComponent.udfSettingbankInformation.filter(value => value.name === AcmConstants.ACCOUNT_NUMBER)[0] !== undefined) {
        accountNumber.userDefinedFieldsDTO = this.customerDisbursementComponent.udfSettingbankInformation
          .filter(value => value.name === AcmConstants.ACCOUNT_NUMBER)[0];
        accountNumber.fieldValue = this.customerDisbursementComponent.formDisbursement.controls.accountNumber !== undefined
          ? this.customerDisbursementComponent.formDisbursement.controls.accountNumber.value : null;
        accountNumber.indexGroup = this.udfComp.listUDFGroups.length + 1;
        this.customer.userDefinedFieldsLinksDTOs.push(accountNumber);
      }


      
      // issue date national id
   /*    const issuedate: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
      issuedate.userDefinedFieldsDTO = this.udfFields.filter(value => value.name === AcmConstants.ADD_ISSUE_DATE)[0];
      const givenissuedate: Date = new Date(this.issuedateG.year + '-' + this.issuedateG.month + '-' + this.issuedateG.day);
      issuedate.fieldValue = this.datePipe.transform(givenissuedate, 'dd/MM/yyyy');
      issuedate.indexGroup = this.udfComp.listUDFGroups.length;
      this.customer.userDefinedFieldsLinksDTOs.push(issuedate); */


    } else if (this.customerOrganitation && this.customerOrganizartionForm.valid) {
      this.customer.customerType = AcmConstants.CUSTOMER_TYPE_ORGANISATIONS;
      this.customer.customerName = this.customerOrganizartionForm.controls.organizationName.value;
      this.customer.organizationName = this.customerOrganizartionForm.controls.organizationName.value;
      this.customer.sector = this.customerOrganizartionForm.controls.sector.value;
      this.customer.registerNumber = this.customerOrganizartionForm.controls.registrationNumber.value;
      this.customer.telephone1 = this.customerOrganizartionForm.controls.mobile.value;
      this.customer.telephone2 = this.customerOrganizartionForm.controls.mobile2.value;
      this.customer.fax = this.customerOrganizartionForm.controls.fax.value;
      this.customer.webSite = this.customerOrganizartionForm.controls.webSite.value;
      this.customer.email = this.customerOrganizartionForm.controls.email.value.toLowerCase();
      this.customer.accountYearEnd = this.customerOrganizartionForm.controls.accountYearEnd.value;
      this.customer.branchId = this.customerOrganizartionForm.controls.branch.value.id;
      this.customer.branchesName = this.customerOrganizartionForm.controls.branch.value.name;
      this.customer.branchesDescription = this.customerOrganizartionForm.controls.branch.value.description;
      this.customer.accountPortfolioID = this.customerOrganizartionForm.controls.loanOfficer.value.accountPortfolioId;
      this.customer.accountPortfolioCode = this.customerOrganizartionForm.controls.loanOfficer.value.login;
      this.customer.accountPortfolioDescription = this.customerOrganizartionForm.controls.loanOfficer.value.simpleName;
      // customer link relationship
      let sumPercantage = 0;
      this.customerLinksRelationshipEntity.forEach((link) => {
        if (link.category === AcmConstants.MEMBERS) {
          sumPercantage += link.percentageOwned;
        }
      });
      if (sumPercantage > 100) {
        this.devToolsServices.openToast(3, 'alert.total_parts');
        return;
      }
      this.customer.customerLinksRelationshipDTOs = this.customerLinksRelationshipEntity;
      this.customer.userDefinedFieldsLinksDTOs.forEach((value) => {
        if (value.userDefinedFieldsDTO.name === AcmConstants.REGISTRATION_NAME) {
          this.customer.registerNumber = value.fieldValue;
        }
      });
    } else if (this.customerGroup && this.customerGroupForm.valid) {
      this.customer.customerType = AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY;
      this.customer.customerName = this.customerGroupForm.controls.solidarityName.value;
      this.customer.solidarityName = this.customerGroupForm.controls.solidarityName.value;
      this.customer.branchId = this.customerGroupForm.controls.branch.value.id;
      this.customer.branchesName = this.customerGroupForm.controls.branch.value.name;
      this.customer.branchesDescription = this.customerGroupForm.controls.branch.value.description;
      this.customer.accountPortfolioID = this.customerGroupForm.controls.loanOfficer.value.accountPortfolioId;
      this.customer.accountPortfolioCode = this.customerGroupForm.controls.loanOfficer.value.login;
      this.customer.accountPortfolioDescription = this.customerGroupForm.controls.loanOfficer.value.simpleName;
      this.customer.customerLinksRelationshipDTOs = this.customerLinksRelationshipEntity;
      if (!this.checkRole()) {
        return;
      }
    }
    this.sharedService.setLoader(true);

    if (checkOfflineMode()) {
      
      if(this.selectedCustomer.itemId) {
        if(this.selectedCustomer.customerType === AcmConstants.PROSPECT_CATEGORY){
          await this.dbService.delete('prospects' , this.selectedCustomer.itemId).toPromise();
        }
        else {
          await this.dbService.delete('customers' , this.selectedCustomer.itemId).toPromise();
        }
      }

      await this.dbService.getByKey('customers-pagination', 'customers-list').subscribe((customers: any) => {
        this.customer.isCustomer = true;

        if(this.selectedCustomer.itemId){
        const customerList = customers.resultsCustomers.filter(customer => { return !(customer.itemId === this.selectedCustomer.itemId && customer.customerType === this.selectedCustomer.customerType)} )
        customers.resultsCustomers = customerList;
      }
      
        this.dbService
          .add('customers',  this.customer)
          .subscribe((key) => {
            this.customer = key ;
            customers.resultsCustomers.unshift(this.customer)
            this.dbService
          .update('customers-pagination', customers)
          .subscribe(
            () => {
              this.devToolsServices.openToast(0, 'alert.success');
              if (event === AcmConstants.ADD_LOAN) {
                // redirect add loan
                this.sharedService.setCustomer(this.customer);
                this.sharedService.setLoan(null);
                this.router.navigate([AcmConstants.LOAN_MANAGEMENT_ADD_URL]);
              } else {
                if(this.modeGuarantor){
                  key.action = AcmConstants.ACTION_INSERT;
                  this.sharedService.setGuarantor(key);
                  this.sharedService.openLoan(this.sharedService.getLoan(), AcmConstants.CHECK_GUARANTOR_URL);
                } else {
                  this.router.navigate(['/acm/customer-edit-menu'], { queryParams: { mode: 2 } });
                }
              }
            }
          );

          });
      });

    } else {

      if (this.selectedCustomer.customerType === AcmConstants.CUSTOMER_CATEGORY_PROSPECT) {
        this.customer.altName = this.selectedCustomer.altName;
        this.selectedCustomer.enabled = false;
        this.customerManagementService.updateProspect(this.selectedCustomer).subscribe();
      }

      await this.customerManagementService.saveForApplication(this.customer).toPromise().then(resultEntity => {
        this.devToolsServices.openToast(0, 'alert.success');
        if (resultEntity.isSupplier) {
          this.devToolsServices.openToast(2, 'customer.is-supplier-msg');
        }
        this.sharedService.setLoader(false);
        this.resetForm();
        if (event === AcmConstants.ADD_LOAN) {
          // redirect add loan
          this.sharedService.setCustomer(resultEntity);
          this.sharedService.setLoan(null);
          this.router.navigate([AcmConstants.LOAN_MANAGEMENT_ADD_URL]);
        } else {
          if (this.modeGuarantor) {
            resultEntity.action = AcmConstants.ACTION_INSERT;
            this.sharedService.setGuarantor(resultEntity);
            this.sharedService.openLoan(this.sharedService.getLoan(), AcmConstants.CHECK_GUARANTOR_URL);
          } else {
            this.router.navigate([AcmConstants.CUSTOMER_360_URL], { queryParams: { mode: 1 } });
          }
        }
      });
    }
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
        this.convertExpiryDateToHijri();
        this.emptyExpiry = false;
      }
    }
  }
  /**
   * getListLinkRelationShip
   */
  getListLinkRelationShip() {
    if (this.customerRelationShip.length > 0) {
      this.customerRelationShip.forEach((value) => {
        this.customerLinksRelationshipEntity.push(value);
      });
    }
    if (this.customerMemberGrpLink.length > 0) {
      this.customerMemberGrpLink.forEach((value) => {
        this.customerLinksRelationshipEntity.push(value);
      });
    }
    if (this.customerMemberOrgLink.length > 0) {
      this.customerMemberOrgLink.forEach((value) => {
        this.customerLinksRelationshipEntity.push(value);
      });
    }
  }

  /**
   * checkRole()
   */
  checkRole() {
    const role: string[] = [];
    for (let i = 0; i < this.customerLinksRelationshipEntity.length; i++) {
      if (this.customer.customerLinksRelationshipDTOs[i].linkRelationshipType === AcmConstants.HEAD) {
        role.push(this.customer.customerLinksRelationshipDTOs[i].linkRelationshipType);
      }
    }
    if (role.length === 0) {
      this.devToolsServices.openToast(3, 'alert.no_head');
      return false;
    } else if (role.length >= 2) {
      this.devToolsServices.openToast(3, 'alert.more_than_one_head');
      return false;
    } else {
      return true;
    }
  }

  /**
   * Methode to onSubmit save or update customer after validation
   * @param event event : ADD_LOAN (SAVE CUSTOMER AND REDIRECT TO ADD LOAN)
   * event : ADD_CUSTOMER (SAVE CUSTOMER AND REDIRECT TO THE CUSTOMER LIST)
   */
  async submitCustomer(event) {
    this.devToolsServices.makeFormAsTouched(this.customerAddress.addressForm);
    this.devToolsServices.makeFormAsTouched(this.udfComp.udfForm);
    this.devToolsServices.makeFormAsTouched(this.customerRelationShipForm);
    this.devToolsServices.makeFormAsTouched(this.customerDisbursementComponent.formDisbursement);
    if (this.customerIndiv) {
      this.devToolsServices.makeFormAsTouched(this.sharedService.form.formGroup);

      if (this.dateG === null || this.dateG === undefined || this.dateH === null || this.dateH === undefined ) {
        this.empty = true;
      }
      if ((this.expirydateG === null || this.expirydateH === null) ||
        ((this.expirydateG === undefined || this.expirydateH === undefined))) {
        this.emptyExpiry = true;
        this.devToolsServices.openToast(3, 'alert.check-data');
        //this.devToolsServices.backTop();
      }
      else {
        this.sharedService.form.formGroup.controls.nationalIDExpiryDate.setValue(this.expirydateG);
      }
      if (this.issuedateG === null || this.issuedateG === undefined) {
        this.emptyIssueDate = true;
        this.devToolsServices.openToast(3, 'alert.check-data');
        //this.devToolsServices.backTop();

      }
      if (this.sharedService.form.formGroup.valid && (this.customerAddress.addressForm.valid ) &&
        this.udfComp.udfForm.valid &&
        (this.customerDisbursementComponent.formDisbursement.valid || !this.showDisbursmentCardInformation) &&
        this.customerRelationShipForm.valid) {
        this.addCustomer(event);
      } else {
        this.devToolsServices.openToast(3, 'alert.check-data');
        //this.devToolsServices.backTop();
        return;
      }
    } else if (this.customerOrganitation) {
      this.devToolsServices.makeFormAsTouched(this.customerOrganizartionForm);
      if (this.customerOrganizartionForm.valid && this.customerAddress.addressForm.valid && this.udfComp.udfForm.valid
        && this.customerRelationShipForm.valid) {
        this.addCustomer(event);
      } else {
        this.devToolsServices.openToast(3, 'alert.check-data');
        //this.devToolsServices.backTop();
        return;
      }
    } else if (this.customerGroup) {
      if (this.customerAddress.addressForm.valid &&
        this.customerRelationShipForm.valid && this.customerRelationShipForm.valid) {
        this.devToolsServices.makeFormAsTouched(this.customerGroupForm);
        this.devToolsServices.makeFormAsTouched(this.customerLinkGroupeForm);
        if (this.customerMemberGrpLink.length > this.nombreMembersMax || this.customerMemberGrpLink.length < this.nombreMembersMin) {
          this.devToolsServices.openToastWithParameter(3, 'alert.member_number', '[ ' + this.nombreMembersMin + ' , '
            + this.nombreMembersMax + ' ]');
          return;
        } else {
          if (this.customerGroupForm.valid && this.customerRelationShipForm.valid && this.customerLinkGroupeForm.valid) {
            this.addCustomer(event);
          }
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
    if (this.customerIndiv) {
      this.resident = selectedItem?.valueJson?.primary;
    } else if (this.customerOrganitation) {
      this.resident = selectedItem?.valueJson?.primary;
    }
    if (this.resident) {
      if (this.customerIndiv) {
        // Find nationality mask
        let nationalityField = this.sharedService.form.acmIhmFields.filter((item) => item.formControlName === "nationalId")[0];
        let nationalityRegExp = nationalityField.validators.filter((item) => item.typeValidator === AcmConstants.PATTERN_REGEXP)[0];
        this.nationalityIdMask = new RegExp('\\b' + nationalityRegExp.parameter + '\\b');

        this.sharedService.form.formGroup.controls.nationalId.setValidators([customRequiredValidator,
        customPatternValidator(this.nationalityIdMask)]);

        if (this.sharedService.form.formGroup.controls.residentId !== undefined) {
          this.sharedService.form.formGroup.controls.residentId.clearValidators();
          this.sharedService.form.formGroup.controls.residentId.reset();
        }
        if (this.sharedService.form.formGroup.controls.residentRelationStatus !== undefined) {
          this.sharedService.form.formGroup.controls.residentRelationStatus.clearValidators();
          this.sharedService.form.formGroup.controls.residentRelationStatus.reset();
        }
        if (this.sharedService.form.formGroup.controls.nationalIDExpiryDate !== undefined) {
          this.sharedService.form.formGroup.controls.nationalIDExpiryDate.clearValidators();
          this.sharedService.form.formGroup.controls.nationalIDExpiryDate.reset();
        }
        this.showKyc = false;
      } else if (this.customerOrganitation) {
        this.customerOrganizartionForm.controls.national_id.setValidators([customRequiredValidator,
        customPatternValidator(this.nationalityIdMask)]);
        this.customerOrganizartionForm.controls.resident_ID.clearValidators();
        this.customerOrganizartionForm.controls.resident_ID.reset();
        this.customerOrganizartionForm.controls.residentRelationStatus.clearValidators();
        this.customerOrganizartionForm.controls.residentRelationStatus.reset();
      }
    } else {
      if (this.customerIndiv) {
        this.sharedService.form.formGroup.controls.nationalId.clearValidators();
        this.sharedService.form.formGroup.controls.nationalId.reset();
        if (this.sharedService.form.formGroup.controls.residentId !== undefined) {
          // Find resident mask
          let residentField = this.sharedService.form.acmIhmFields.filter((item) => item.formControlName === "residentId")[0];
          let residentRegExp =  residentField.validators.filter((item) => item.typeValidator === AcmConstants.PATTERN_REGEXP)[0];
          this.residentIdyMask = new RegExp('\\b' + residentRegExp.parameter + '\\b');

          this.sharedService.form.formGroup.controls.residentId.setValidators([customRequiredValidator,
            customPatternValidator(this.residentIdyMask)]);
        }
        if (this.sharedService.form.formGroup.controls.residentRelationStatus !== undefined) {
          this.sharedService.form.formGroup.controls.residentRelationStatus.setValidators(customRequiredValidator);
        }
        if (this.sharedService.form.formGroup.controls.nationalIDExpiryDate !== undefined) {
          this.sharedService.form.formGroup.controls.nationalIDExpiryDate.setValidators(customRequiredValidator);
        }
        this.showKyc = false;
      } else if (this.customerOrganitation) {
        this.customerOrganizartionForm.controls.national_id.clearValidators();
        this.customerOrganizartionForm.controls.national_id.reset();
        this.customerOrganizartionForm.controls.resident_ID.setValidators([customRequiredValidator,
          customPatternValidator(this.residentIdyMask)]);
        this.customerOrganizartionForm.controls.residentRelationStatus.setValidators(customRequiredValidator);
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
        this.customerRelationShipForm.addControl('relationshipType' + i, new FormControl('', customRequiredValidator));
      }
    } else if (this.categoryCustomerLinkRelation === AcmConstants.CUSTOMER_TYPE_LINK && this.customerGroup) {
      if (this.customerMemberGrpLink.length > this.nombreMembersMax) {
        this.devToolsServices.openToastWithParameter(3, 'alert.member_number', '[ ' + this.nombreMembersMin + ' , '
          + this.nombreMembersMax + ' ]');
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
        this.customerLinkGroupeForm.addControl('linkRelationshipType' + j, new FormControl('', customRequiredValidator));
      }
    } else if (this.categoryCustomerLinkRelation === AcmConstants.CUSTOMER_TYPE_LINK && this.customerOrganitation) {
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
        this.customerLinkOrgForm.addControl('linkRelationshipType' + j, new FormControl('', customRequiredValidator));
        this.customerLinkOrgForm.addControl('percentageOwned' + j, new FormControl('', customRequiredValidator));
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
    this.customerRelationShipForm.removeControl('relationshipType' + i);
  }

  /**
   * delete Link grp
   * @param i index of Link
   */
  deleteLinkGrp(i: number) {
    this.customerMemberGrpLink.splice(i, 1);
  }

  /**
   * delete Link
   * @param i index of Link
   */
  deleteLinkOrg(i: number) {
    this.customerMemberOrgLink.splice(i, 1);
  }

  /**
   * Method exit
   */
  exit() {
    if (this.modeGuarantor) {
      this.sharedService.openLoan(this.sharedService.getLoan(), AcmConstants.CHECK_GUARANTOR_URL);
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
   * enableKycButton
   */
  enableKycButton(event) {
    if (this.resident) {
      if (this.sharedService.form.formGroup.controls.nationalId.value !== '' ||
        this.sharedService.form.formGroup.controls.nationalId.value !== null) {
        this.showKyc = false;
      }
      if(this.generateDateBirthGender === 1){
        this.setGenderAndDateOfbirthValue(event.target.value);
      }

    } else {
      if (this.sharedService.form.formGroup.controls.residentId !== undefined &&
        (this.sharedService.form.formGroup.controls.residentId.value !== '' ||
          this.sharedService.form.formGroup.controls.residentId.value !== null)) {
        this.showKyc = false;
      }
    }
  }

  /**
   * check KYC
   * @param modalContent TemplateRef<any>
   */
  checkKYC(modalContent: TemplateRef<any>) {
    if (this.resident) {
      // nationalId
      this.customerEntityKyc.identity = this.sharedService.form.formGroup.controls.nationalId.value;
    } else {
      // residentId
      this.customerEntityKyc.identity = this.sharedService.form.formGroup.controls.residentId.value;
    }
    const screeningDTO = new ScreeningEntity();
    screeningDTO.customerDTO = this.customerEntityKyc;
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
      optcode: [customRequiredValidator],
      transactionid: [transactionId, customRequiredValidator],
    });
  }

  /**
   * submitKyc
   */
  submitKyc() {
    const screeningDTO = new ScreeningEntity();
    screeningDTO.customerDTO = this.customerEntityKyc;
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
    if (this.customerIndiv) {
      userEntity.branchID = this.sharedService.form.formGroup.controls.branch.value.branchID;
    } else if (this.customerOrganitation) {
      userEntity.branchID = this.customerOrganizartionForm.controls.branch.value.branchID;
    } else if (this.customerGroup) {
      userEntity.branchID = this.customerGroupForm.controls.branch.value.branchID;
    }
    // set branchIdSelected to send it to customer-disbursement child
    this.branchIdSelected = userEntity.branchID;
    if (userEntity.branchID.toString() !== '') {
      this.settingsService.findAllPortfolio().subscribe(
        (data) => {
          this.listPortfolio = data;
          this.showAccountPortfolio = false;
        }
      );
    } else {
      this.listPortfolio = [];
    }
  }

  udfFieldList(data) {
    this.udfFields = data;
    if (this.udfFields.length > 0) {
      this.familySituationList = this.udfFields
        .filter(value => value.name === AcmConstants.FAMILY_SITUATION)[0].fieldListValuesDTOs;
      this.nationalityList = this.udfFields
        .filter(value => value.name === AcmConstants.NATIONALITY)[0].fieldListValuesDTOs;

      //    this.residentRelationStatusList = this.udfFields
      //    .filter(value => value.name === AcmConstants.RESIDENCE_RELATION_STATUS)[0].fieldListValuesDTOs;
      this.placeNationalList = this.udfFields.filter(value => value.name === AcmConstants.PLACE_OF_ISSUE)[0].fieldListValuesDTOs;
    }
    if(!this.selectedCustomer.id && this.selectedCustomer.firstName){
      const udfLinkGroup = getUdfLinkGroup(this.selectedCustomer.userDefinedFieldsLinksDTOs,[this.udfFields[0].userDefinedFieldGroupDTO],true)


      udfLinkGroup[0].udfGroupeFieldsModels.forEach(
        ((nationality) => {
          switch (nationality.fieldName) {
            case 'National ID':
              this.sharedService.form.formGroup.controls.nationalId.setValue(nationality.value);
              break;
            case 'Resident ID':
              if (this.sharedService.form.formGroup.controls.residentId !== undefined) {
                this.sharedService.form.formGroup.controls.residentId.setValue(nationality.value);
              }
              break;
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
                this.convertExpiryDateToHijri();
              }
              break;
            case 'Add Issue Date':
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
              }

          }
        })
      );




      this.udfFields.forEach(nationalityField => {
        nationalityField.fieldListValuesDTOs.forEach(nationalitySetting => {
          if (udfLinkGroup.length > 0) {
            udfLinkGroup[0].udfGroupeFieldsModels.forEach(
              ((nationality) => {
                if (nationalitySetting.description === nationality.value || nationalitySetting.name === nationality.value || nationalitySetting.idUDFListValue.toString()
                  === nationality.value) {
                  switch (nationality.fieldName) {
                    case 'Nationality':
                      if (this.sharedService.form.formGroup.controls.nationality !== undefined) {
                        this.sharedService.form.formGroup.controls.nationality.setValue(nationalitySetting);
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
          }
        });
      });
    }
  }

  /**
   * methode to get customers (autocomplete)
   * param event
   */
  filterCustomerSingle(event) {
    this.filteredCustomerSingle = [];
    this.customers.forEach(element => {
      element.customerNameNoPipe = this.sharedService.getCustomerName(element);
    });
    this.filteredCustomerSingle = this.customers.filter(c => c.customerNameNoPipe.toLowerCase().startsWith(event.query.toLowerCase()));
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
   * set gender and date of birth value according to national id
   * @param nationalId nationalId
   */
  setGenderAndDateOfbirthValue(nationalId) {
    // set gender
    if (nationalId !== null) {
      const genderIndex = nationalId.charAt(12);
      if ((genderIndex % 2) === 0) {
        // check if field is undefined (  field doesn't exist)
        if (this.sharedService.form.formGroup.controls.gender !== undefined &&
          (this.sharedService.form.formGroup.controls.gender.value === 'M' ||
            this.sharedService.form.formGroup.controls.gender.value === null)) {
          this.sharedService.form.formGroup.controls.gender.setValue('F');
          this.devToolsServices.openToast(2, 'alert.changed_gender');
        }
      } else {
        if (this.sharedService.form.formGroup.controls.gender !== undefined &&
          (this.sharedService.form.formGroup.controls.gender.value === 'F' ||
            this.sharedService.form.formGroup.controls.gender.value === null)) {
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
          if (this.dateG === undefined || this.dateG === null || checkDate.year() !== this.dateG.year ||
            (checkDate.month() + 1) !== this.dateG.month || checkDate.date() !== this.dateG.day) {
            this.dateG = new NgbDate(0, 0, 0);
            this.dateG.day = checkDate.date();
            this.dateG.month = checkDate.month() + 1;
            this.dateG.year = checkDate.year();
            this.devToolsServices.openToast(2, 'alert.changed_date_of_birth');
          }
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
          if (this.dateG === undefined || this.dateG === null || checkDate.year() !== this.dateG.year ||
            (checkDate.month() + 1) !== this.dateG.month || checkDate.date() !== this.dateG.day) {
            this.dateG = new NgbDate(0, 0, 0);
            this.dateG.day = checkDate.date();
            this.dateG.month = checkDate.month() + 1;
            this.dateG.year = checkDate.year();
            this.devToolsServices.openToast(2, 'alert.changed_date_of_birth');
          }
        } else {
          this.dateG = null;
          this.dateH = null;
          this.sharedService.form.formGroup.controls.nationalId.setErrors({ invalid: true });
          this.devToolsServices.openToast(3, 'alert.invalid_national_id');
        }
      } else {
        this.dateG = null;
        this.dateH = null;
        this.sharedService.form.formGroup.controls.nationalId.setValidators([customRequiredValidator,
        customPatternValidator(this.nationalityIdMask)]);
      }
      this.convertDateToHijri();
    }
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }


  async selectSourceProspection(event :any) {
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
        this.convertDateToHijri();
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
  async externalSubmit(event){
    this.validateForm();
    this.submitCustomer(event);

  }
  validateForm() {
    Object.values(this.customerAddress.addressForm.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      control.updateValueAndValidity();
  });
    if (this.customerIndiv) {
        Object.values(this.sharedService.form.formGroup.controls).forEach((control: AbstractControl) => {
            control.markAsTouched();
            control.updateValueAndValidity();
        });
    }
    else if (this.customerOrganitation) {
        Object.values(this.customerOrganizartionForm.controls).forEach((control: AbstractControl) => {
            control.markAsTouched();
            control.updateValueAndValidity();
        });
    }
    else if (this.customerGroup) {
        Object.values(this.customerGroupForm.controls).forEach((control: AbstractControl) => {
            control.markAsTouched();
            control.updateValueAndValidity();
        });
    }
    if (this.customerAddress.addressForm.invalid || this.udfComp.udfForm.invalid || this.customerRelationShipForm.invalid || this.customerDisbursementComponent.formDisbursement.invalid) {
      this.devToolsServices.InvalidControl();
      return;
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
}
