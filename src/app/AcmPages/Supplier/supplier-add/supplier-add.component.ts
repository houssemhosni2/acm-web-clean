import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { CustomerServices } from "../../Loan-Application/customer/customer.services";
import { SettingsService } from "../../Settings/settings.service";
import { NgbDate, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { DateType, DateFormatterService } from "ngx-hijri-gregorian-datepicker";
import { CustomerEntity } from "../../../shared/Entities/customer.entity";
import { UserEntity } from "../../../shared/Entities/user.entity";
import { CustomerManagementService } from "../../Customer/customer-management/customer-management.service";
import { CustomerAddressComponent } from "../../Customer/customer-address/customer-address.component";
import { AcmConstants } from "../../../shared/acm-constants";
import { SharedService } from "src/app/shared/shared.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AppComponent } from "../../../app.component";
import { UserDefinedFieldsEntity } from "../../../shared/Entities/userDefinedFields.entity";
import { UserDefinedFieldGroupEntity } from "../../../shared/Entities/userDefinedFieldGroup.entity";
import { DatePipe } from "@angular/common";
import { RoleEntity } from "src/app/shared/Entities/Role.entity";
import { RelationshipEntity } from "src/app/shared/Entities/relationship.entity";
import { IndustryEntity } from "../../../shared/Entities/industry.entity";
import { SettingFieldService } from "../../Settings/setting-fields.service";
import { forkJoin, Subject, Subscription } from "rxjs";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { ConventionEntity } from "src/app/shared/Entities/Convention.entity";
import { SupplierService } from "../supplier.service";
import { SupplierEntity } from "src/app/shared/Entities/Supplier.entity";
import { MapMarkerEntity } from "src/app/shared/Entities/mapMarker.entity";
import { AddressEntity } from "src/app/shared/Entities/Address.entity";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { UdfStepWorkflowComponent } from "../../Loan-Application/udf-step-workflow/udf-step-workflow.component";
import { GenericWorkFlowDocumentComponent } from "../../generic-workFlow/generic-work-flow-screen/generic-workFlow-document/generic-workFlow-document.component";
import { ElementId } from "src/app/shared/Entities/elementId.entity";
import { SettingDocumentTypeEntity } from "src/app/shared/Entities/settingDocumentType.entity";
import { LoanDocumentEntity } from "src/app/shared/Entities/loanDocument.entity";
import { customRequiredValidator, customEmailValidator, customPatternValidator } from '../../../shared/utils';
import { AcmBranches } from "src/app/shared/Entities/AcmBranches.entity";

@Component({
  selector: "app-supplier-add",
  templateUrl: "./supplier-add.component.html",
  styleUrls: ["./supplier-add.component.sass"],
})
export class SupplierAddComponent implements OnInit, OnDestroy {
  constructor(
    public devToolsServices: AcmDevToolsServices,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public customerService: CustomerServices,
    public settingsService: SettingsService,
    public dateFormatterService: DateFormatterService,
    public customerManagementService: CustomerManagementService,
    public sharedService: SharedService,
    public modal: NgbModal,
    public translate: TranslateService,
    public datePipe: DatePipe,
    public route: ActivatedRoute,
    public settingFieldService: SettingFieldService,
    public library: FaIconLibrary,
    public supplierService: SupplierService,
    private fb: FormBuilder
  ) { }


  public expandedConvention = true;
  public expandedArticles = true;
  public expandedCustomer = true;
  public expandedAddress = true;
  public expandedAddressGrp = true;
  public dateH: NgbDateStruct;
  public dateG: NgbDate;
  public expirydateG: NgbDate;
  public issuedateG: NgbDate;
  public expirydateH: NgbDateStruct;
  public selectedDateTypeH = DateType.Hijri;
  public selectedDateTypeG = DateType.Gregorian;
  public selectedIssueDateTypeG = DateType.Gregorian;
  public customer: CustomerEntity = new CustomerEntity();
  public customers: CustomerEntity[] = [];
  public updateMode = false;
  public emailMask;
  public roles: RoleEntity[];
  public relationships: RelationshipEntity[];
  public sectors: IndustryEntity[];
  // @ViewChild(CustomerAddressComponent, { static: true })
  // supplierAddress: CustomerAddressComponent;
  @ViewChild(CustomerAddressComponent)
  supplierAddress: CustomerAddressComponent;
  public elementId: ElementId = new ElementId();
  // @ViewChild(GenericWorkFlowDocumentComponent, { static: true }) genericWorkFlowDocumentComponent: GenericWorkFlowDocumentComponent;
  // @ViewChild(GenericWorkFlowDocumentComponent, { static: true }) genericWorkFlowDocumentComponent: GenericWorkFlowDocumentComponent;

  @ViewChild("supplierDocumentComponenet")
  supplierDocumentComponent!: GenericWorkFlowDocumentComponent;
  @ViewChild("conventionDocumentComponent")
  conventionDocumentComponent!: GenericWorkFlowDocumentComponent;
  public nombreMembersMax: number;
  public nombreMembersMin: number;
  public categoryCustomerLinkRelation: string;
  public customerLinkCategoryParam = "";
  public currentUser: UserEntity;
  public empty = false;
  public emptyExpiry = false;
  public modeGuarantor = false;
  public filtersLoaded = new Subject<boolean>();
  public differencePeriodIssueDate = 0;
  public supplierStatus = AcmConstants.SUPPLIER_POTENTIEL;
  public supplier: SupplierEntity;
  public conventionLst: ConventionEntity[] = [];
  public conventionLstOld: ConventionEntity[] = [];

  public addressLst: AddressEntity[] = [];
  requiredDocuments = false  ;


  public convention = new ConventionEntity();
  public expanded = true;
  public supplierMode: boolean;
  public editConv = false;
  lstSectorName: any = [];
  public activityNamee = "";
  formSupplier: FormGroup;
  formConvention: FormGroup;
  public legalCategorys = AcmConstants.SupplierLegalCategorys ;
  public periodicity = AcmConstants.SupplierPriodicity ;
  public typePer = [
    { id: 1, label: "Personne physique" },
    { id: 2, label: "Personne morale" },
  ];
  public withholdingTaxes = [0, 1, 1.5];
  @ViewChild(UdfStepWorkflowComponent)
  udfStepWorkflowComponent: UdfStepWorkflowComponent;
  public source: string;
  idSupplier: number;
  // Google Map
  public latitude = 0;
  public longitude = 0;
  public markers: MapMarkerEntity[] = [];
  public zoom = 9;
  public map: google.maps.Map;
  public mapClickListener: google.maps.MapsEventListener;
  public addressMarker: any;
  //   getConvention(){
  //     this.supplierService.findConventionByIdSupplier(this.idSupplier).subscribe(result => {
  //       this.conventionLst = result ;

  //   }) ;
  // }

  mode = false;
  tbl = [];
  addressEntity: AddressEntity = new AddressEntity();
  document: any;
  @Output() uploadedDocument = new EventEmitter<object>();
  public fileName: string;
  public firstSource: string;
  private navigationSubscription: Subscription;

  patentOrNationalIdValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const registerNumber = control.get("registerNumber")?.value;
    const nationalId = control.get("national_id")?.value;

    if (!registerNumber && !nationalId) {
      return { atLeastOneRequired: true };
    } else if (registerNumber?.trim() === "" && nationalId?.trim() === "") {
      return { atLeastOneRequired: true };
    } else {
      return null;
    }
  }

  async ngOnInit() {
    this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ResetForm();
      }
    });
    this.formSupplier = this.fb.group({
      name: ["", [customRequiredValidator]],
      acronyme: ["", [customRequiredValidator]],
      legalCatalog: ["", [customRequiredValidator]],
      activity: [""],
      activityStartDate: ["", [customRequiredValidator]],
      periodicity: ["", [customRequiredValidator]],
      webSite: [""],
      telephone2: ["", customPatternValidator(/^\d{8}$/)],
      telephone: ["", [customPatternValidator(/^\d{8}$/),customRequiredValidator]],
      registerNumber: [null],
      objectif: [""],
      email: ["",  customPatternValidator(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ) ],
      national_id: [null],
      withholdingTax: ["", [customRequiredValidator]],
      isApproved : [false]
    });

    this.formConvention = this.fb.group({
      discountRate: [""],
      startDateConvention: [""],
      endDateConvention: [""],
      rebate: [""],
      ca: [""],
      applyRate: [""],
      objectiveTurnoverVolume: [],
      objectiveFileNumber: [],
    });

    await this.activatedRoute.queryParams.subscribe((params) => {
      this.source = params.source;
      this.firstSource = params.firstSource;
      this.idSupplier = params.idSupplier;
    });

    this.supplier = new SupplierEntity();

    if (this.idSupplier) {
      this.updateMode = true;
      this.supplierService
        .findSupplierById(this.idSupplier)
        .subscribe((result) => {
          if (result.activityStartDate) {
            result.activityStartDate = new Date(result.activityStartDate)
              .toISOString()
              .split("T")[0];
          }

          // this.updateMode = false ;
          this.supplier = result;
          this.elementId.supplierId = this.supplier.id;
          this.elementId.conventionId = this.supplier.id;
          this.sharedService.setElementId(this.elementId);
          this.conventionLst = result.conventions;
          this.addressLst = result.listAddress;
          this.conventionLst.map((item) => (item.forRemove = false));
          let supplierPeriodocity = this.periodicity.filter(
            (item) => item.id === this.supplier.periodicity
          )[0];

          this.formSupplier = this.fb.group({
            name: [this.supplier.name, [customRequiredValidator]],
            acronyme: [this.supplier.acronyme, [customRequiredValidator]],
            legalCatalog: [this.supplier.legalCatalog, [customRequiredValidator]],
            activity: [this.supplier.activity, [customRequiredValidator]],
            activityStartDate: [
              this.supplier.activityStartDate,
              [customRequiredValidator],
            ],
            periodicity: [supplierPeriodocity, [customRequiredValidator]],
            webSite: [this.supplier.webSite],
            telephone2: [
              this.supplier.telephone2,
              customPatternValidator(/^\d{8}$/),
            ],
            telephone: [this.supplier.telephone, customPatternValidator(/^\d{8}$/)],
            registerNumber: [this.supplier.registerNumber],
            objectif: [this.supplier.objectif],
            email: [
              this.supplier.email,
              [customEmailValidator],
            ],
            national_id: [this.supplier.identity],
            withholdingTax: [this.supplier.withholdingTax, [Validators.required]],
            isApproved : [this.supplier.isApproved]
          });
          // this.addressLst.map(item => item.forRemove = false);

          if (
            this.supplier.status !== null &&
            this.supplier.status !== undefined
          )
            this.supplierStatus = this.supplier.status;
          else this.supplierDetails(this.supplier);
        });
    } else {
      this.updateMode = false;
      this.elementId.supplierId = 0;
      this.elementId.conventionId = 0;
      this.sharedService.setElementId(this.elementId);
    }


    this.getConnectedUser();
    await this.sharedService
      .habilitationIhmFields(AcmConstants.FORM_ADD_CUSTOMER_INDIV)
      .then(() => {
        // notifier la page html que le form est pret
        this.filtersLoaded.next(true);
      });
    // find branch / Get UDF Nationality / load members Group / ORG Roles values / load Relationship values
    // load Sector values
    if (!this.updateMode) {
      this.elementId.supplierId = 0;
      this.elementId.conventionId = 0;
      this.sharedService.setElementId(this.elementId);
      this.supplierDocumentComponent.ngOnInit();
      this.conventionDocumentComponent.ngOnInit();
      
    }
    this.forkJoinFunction();
    await this.supplierAddress.ngOnInit();
  }
  private ResetForm(): void {
   this.ngOnInit();
   this.elementId.supplierId = 0;
   this.elementId.conventionId = 0;
   this.sharedService.setElementId(this.elementId);
   this.supplierDocumentComponent.ngOnInit();
   this.supplierAddress.ngOnInit();
   this.udfStepWorkflowComponent.ngOnInit();
   this.conventionDocumentComponent.ngOnInit();
  } 
  ngOnDestroy(): void {
    this.elementId.conventionId = 0;
    this.sharedService.setElementId(this.elementId);
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  changePath() {
    this.convention.fileName = this.convention.file.name;
  }

  /**
   * join list of observables
   */

  addConvention() {
    this.devToolsServices.makeFormAsTouched(this.formConvention);
    this.conventionDocumentComponent.checkRequiredDocument() ;
    if (this.formConvention.valid && this.conventionDocumentComponent.checkRequiredDocument() ) {
      if (this.isElementInArray(this.conventionLst, this.convention.id)) {
        this.deleteElementById(this.convention.id);
        this.convention.discountRate =
          this.formConvention.controls.discountRate.value;
        this.convention.startDateConvention =
          this.formConvention.controls.startDateConvention.value;
        this.convention.endDateConvention =
          this.formConvention.controls.endDateConvention.value;
        this.convention.rebate = this.formConvention.controls.rebate.value;
        this.convention.ca = this.formConvention.controls.ca.value;
        this.convention.applyRate =
          this.formConvention.controls.applyRate.value;
        this.convention.objectiveTurnoverVolume =
          this.formConvention.controls.objectiveTurnoverVolume.value;
        this.convention.objectiveFileNumber =
          this.formConvention.controls.objectiveFileNumber.value;
        this.conventionLst.push(this.convention);
        // this.formConvention = this.fb.group({
        //   discountRate: [''],
        //   startDateConvention: [''],
        //   endDateConvention: [''],
        //   rebate: [''],
        //   ca: [''],
        //   applyRate: [''],
        //   objectiveTurnoverVolume: [],
        //   objectiveFileNumber:[]
        // });
        this.convention = new ConventionEntity();
        this.editConv = false;
      } else {
        this.convention.discountRate =
          this.formConvention.controls.discountRate.value;
        this.convention.startDateConvention =
          this.formConvention.controls.startDateConvention.value;
        this.convention.endDateConvention =
          this.formConvention.controls.endDateConvention.value;
        this.convention.rebate = this.formConvention.controls.rebate.value;
        this.convention.ca = this.formConvention.controls.ca.value;
        this.convention.applyRate =
          this.formConvention.controls.applyRate.value;
        this.convention.objectiveTurnoverVolume =
          this.formConvention.controls.objectiveTurnoverVolume.value;
        this.convention.objectiveFileNumber =
          this.formConvention.controls.objectiveFileNumber.value;
        this.convention.listDocsType =
          this.conventionDocumentComponent.settingDocumentTypes;
        this.conventionLst.push(this.convention);
        this.convention = new ConventionEntity();
      }
      this.formConvention.reset();
      this.elementId.conventionId = 0;
      this.sharedService.setElementId(this.elementId);
      this.conventionDocumentComponent.ngOnInit();
    }else {
      this.devToolsServices.openToast(3, 'alert.check-data');

    }


  }
  reciveDocFomchild(settingDocumentTypeEntity: SettingDocumentTypeEntity) {
    this.convention.listDocsType.push(settingDocumentTypeEntity);
  }

  deleteElementById(targetId: number): void {
    const index = this.conventionLst.findIndex((item) => item.id === targetId);

    if (index !== -1) {
      // Use splice to remove the element at the found index
      this.conventionLst.splice(index, 1);
    }
  }

  isElementInArray(array: ConventionEntity[], targetId: number): boolean {
    return array.some((item) => item.id === targetId);
  }
  addAddress() {
    if (this.addressLst.includes(this.addressEntity, 0)) {
      this.addressEntity = new AddressEntity();
    } else {
      this.addressLst.push(this.addressEntity);
      this.addressEntity = new AddressEntity();
    }
  }
  deleteAddress(index: number) {
    this.addressLst[index].forRemove = true;

    this.addressEntity = new AddressEntity();
  }
  deleteConvention(index: number) {
    this.conventionLst[index].forRemove = true;

    this.convention = new ConventionEntity();
  }
  editConvention(conv: ConventionEntity) {
    // conv.endDateConvention=this.convertDate(conv.endDateConvention);
    if (conv.endDateConvention)
      conv.endDateConvention = new Date(conv.endDateConvention)
        .toISOString()
        .split("T")[0];
    if (conv.startDateConvention)
      conv.startDateConvention = new Date(conv.startDateConvention)
        .toISOString()
        .split("T")[0];
    this.convention = conv;
    this.editConv = true;

    this.formConvention.controls.discountRate.setValue(
      this.convention.discountRate
    );
    this.formConvention.controls.startDateConvention.setValue(
      this.convention.startDateConvention
    );
    this.formConvention.controls.endDateConvention.setValue(
      this.convention.endDateConvention
    );
    this.formConvention.controls.applyRate.setValue(this.convention.applyRate);
    this.formConvention.controls.rebate.setValue(this.convention.rebate);
    this.formConvention.controls.ca.setValue(this.convention.ca);
    this.formConvention.controls.objectiveTurnoverVolume.setValue(
      this.convention.objectiveTurnoverVolume
    );
    this.formConvention.controls.objectiveFileNumber.setValue(
      this.convention.objectiveFileNumber
    );

    if (conv.id) {
      this.elementId.conventionId = conv.id;
      this.sharedService.setElementId(this.elementId);
      this.conventionDocumentComponent.ngOnInit();
      this.convention.listDocsType =
        this.conventionDocumentComponent.getDocumentType();
    } else {
      this.conventionDocumentComponent.initConvComponent(conv.listDocsType);
    }
  }
  editAddress(adr: AddressEntity) {
    if (adr.dateMovedIn)
      adr.dateMovedIn = new Date(adr.dateMovedIn).toISOString().split("T")[0];
    if (adr.dateMovedOut)
      adr.dateMovedOut = new Date(adr.dateMovedOut).toISOString().split("T")[0];
    this.addressEntity = adr;
  }

  forkJoinFunction() {
    // get udf list

    const userDefinedFieldsEntity: UserDefinedFieldsEntity =
      new UserDefinedFieldsEntity();
    const userDefinedFieldGroupDTO: UserDefinedFieldGroupEntity =
      new UserDefinedFieldGroupEntity();
    userDefinedFieldGroupDTO.code = AcmConstants.CUSTOMER_NATIONALITY_CODE;
    userDefinedFieldsEntity.userDefinedFieldGroupDTO = userDefinedFieldGroupDTO;
    // Environnement
    const acmEnvironmentKeys: string[] = [
      AcmConstants.MEMBERS_NUMBER_MAX,
      AcmConstants.MEMBERS_NUMBER_MIN,
      AcmConstants.DIFFERENCE_PERIOD_OF_EXPIRY_DATE_AND_ISSUE_DATE,
    ];
    forkJoin([
      this.settingsService.findBranches(new AcmBranches()),
      this.customerManagementService.getUdfField(userDefinedFieldsEntity),
      this.customerManagementService.findRole(),
      this.customerManagementService.findRelationship(),
      this.customerManagementService.findSector(),
      this.settingsService.getEnvirementValueByKeys(acmEnvironmentKeys),
    ]).subscribe((result) => {
      this.roles = result[2];
      // relationship
      this.relationships = result[3];
      // sector

      this.sectors = result[4];
      // environnement
      this.nombreMembersMax = Number(result[5][0].value);
      this.nombreMembersMin = Number(result[5][1].value);
      this.differencePeriodIssueDate = Number(result[5][2].value);
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

  async submitSupplier(status: string) {
    this.devToolsServices.makeFormAsTouched(this.formSupplier);
    this.devToolsServices.makeFormAsTouched(this.formConvention);
    this.devToolsServices.makeFormAsTouched(
      this.udfStepWorkflowComponent.udfLoanForm
    );
    this.formSupplier.setValidators(this.patentOrNationalIdValidator);
    this.formSupplier.updateValueAndValidity();
    if (!this.formSupplier.valid || !this.formConvention.valid || !this.udfStepWorkflowComponent.udfLoanForm.valid ||
        !this.supplierDocumentComponent.checkRequiredDocument()) {
      this.devToolsServices.openToast(3, 'alert.check-data');
      //this.devToolsServices.backTop();
      //this.devToolsServices.backTop();
    } else if (
      this.formSupplier.valid &&
      this.formConvention.valid &&
      this.udfStepWorkflowComponent.udfLoanForm.valid
    ) {
      let registerNumber = this.formSupplier.controls.registerNumber.value
        ? this.formSupplier.controls.registerNumber.value.trim()
        : null;
      this.supplier.registerNumber =
        registerNumber !== "" ? registerNumber : null;

      let identity = this.formSupplier.controls.national_id.value
        ? this.formSupplier.controls.national_id.value.trim()
        : null;
      this.supplier.identity = identity !== "" ? identity : null;

      await this.customerManagementService
        .findSector()
        .toPromise()
        .then((res) => {
          this.supplier.activity = this.formSupplier.controls.activity.value;
          this.activityNamee = res.find(
            (item) => this.supplier.activity === item.industryID
          ).name;
        });
      this.supplier.activityName = this.activityNamee;
      if (status !== undefined && status !== null)
        this.supplier.status = status;
      if (this.firstSource === "ADD_LOAN") {
        this.supplierStatus = AcmConstants.SUPPLIER_NON_CONTRACTED; // NON CONTRACTED
        this.supplier.status = this.supplierStatus;
      }

      if (this.idSupplier === null || this.idSupplier === undefined) {
        this.supplier.insertBy = this.currentUser.fullName;
        this.supplier.dateInsertion = new Date();
      }
      this.supplier.conventions = this.conventionLst;
      this.supplier.listAddress = this.supplierAddress.OnSubmit();
      if (this.supplier.listAddress === null) {
        return;
      }

      this.supplier.telephone2 = this.formSupplier.controls.telephone2.value;
      this.supplier.webSite = this.formSupplier.controls.webSite.value;
      this.supplier.acronyme = this.formSupplier.controls.acronyme.value;
      this.supplier.periodicity =
        this.formSupplier.controls.periodicity.value?.id;
      this.supplier.registerNumber =
        this.formSupplier.controls.registerNumber.value;
      this.supplier.name = this.formSupplier.controls.name.value;
      this.supplier.activityStartDate =
        this.formSupplier.controls.activityStartDate.value;
      this.supplier.telephone = this.formSupplier.controls.telephone.value;
      this.supplier.activity = this.formSupplier.controls.activity.value;
      this.supplier.legalCatalog =
        this.formSupplier.controls.legalCatalog.value;
      this.supplier.objectif = this.formSupplier.controls.objectif.value;
      this.supplier.email = this.formSupplier.controls.email.value;
      this.supplier.withholdingTax = this.formSupplier.controls.withholdingTax.value;

      this.supplier.userDefinedFieldsLinksDTOs =
        this.udfStepWorkflowComponent.onSubmitElement();
      this.supplier.isApproved = this.formSupplier.controls.isApproved.value;

      await this.supplierService
        .createSupplier(this.supplier)
        .subscribe(async (data) => {
          this.supplier = data;
          this.elementId.supplierId = this.supplier.id;
          this.sharedService.setElementId(this.elementId);
          await this.supplierDocumentComponent.save();
          this.elementId.supplierId = 0;
          this.sharedService.setElementId(this.elementId);

          // Save the customer as a supplier
          if (this.supplier.isCustomer) {
            this.devToolsServices.openToast(2, "supplier.is-customer-msg");
          }

          this.conventionLst.forEach((item) => {
            if (item.forRemove === false) item.supplier = this.supplier;
            else item.supplier = null;
          });

          this.supplierService
            .createConvention(this.conventionLst)
            .subscribe(async (data) => {
              //  data.filter(item=>item.listDocsType.filter(elem=>{

              //  }))
              this.elementId.conventionId = this.supplier.id;
              this.sharedService.setElementId(this.elementId);
              await this.conventionDocumentComponent.save();
              this.elementId.conventionId = 0;
              this.sharedService.setElementId(this.elementId);
              for (const convention of data) {
                for (const oldConvention of this.conventionLst) {
                  const matchingInnerArray = convention.listDocsType.filter(
                    (innerConvention) =>
                      oldConvention.listDocsType.some((innerOldConvention) => {
                        if (innerOldConvention.name === innerConvention.name)
                          convention.listDocsType = oldConvention.listDocsType;
                      })
                  );
                }
              }
              this.conventionLst = data;
              for (let convention of this.conventionLst) {
                await this.conventionDocumentComponent.saveConvention(
                  convention.listDocsType,
                  convention.id
                );
              }

              this.redirectTo();
            });
        });
    }
  }
  onSubmit(status: string) {
    this.validateForm();
    this.submitSupplier(status);
  }
  validateForm() {
    Object.values(this.formSupplier.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    if (this.formSupplier.invalid || this.udfStepWorkflowComponent.udfLoanForm.invalid || this.formConvention.invalid  ) {
      this.devToolsServices.InvalidControl();
      return;
    }

    if (!this.supplierDocumentComponent.checkRequiredDocument()) {
    this.devToolsServices.openToast(3, 'alert.enter_required_documents');
    this.devToolsServices.backTop();
  }


    if (this.formSupplier.invalid || this.udfStepWorkflowComponent.udfLoanForm.invalid || this.formConvention.invalid  ) {
      this.devToolsServices.InvalidControl();
      return;
    }

    if (!this.supplierDocumentComponent.checkRequiredDocument()) {
    this.devToolsServices.openToast(3, 'alert.enter_required_documents');
    this.devToolsServices.backTop();
  }

  }

  redirectTo() {
    this.idSupplier = null;
    if (this.source === "ADD_ASSET" && this.firstSource == "ADD_LOAN") {
      this.sharedService.setSupplier(this.supplier);
      this.router.navigate(["/acm/add-asset"], {
        queryParams: { source: "ADD_LOAN"  },
      });
      return;
    }
    if (this.source === "ADD_ASSET" && this.firstSource == "MOD_LOAN") {
      this.sharedService.setSupplier(this.supplier);
      this.router.navigate(["/acm/add-asset"], {
        queryParams: { source: "MOD_LOAN"  },
      });
      return;
    }
    if (this.source === "ADD_ASSET" && this.firstSource == "MOD_Topup") {
      this.sharedService.setSupplier(this.supplier);
      this.router.navigate(["/acm/add-asset"], {
        queryParams: { source: 'MOD_Topup' },
      });
      return;
    }
    if (this.source === "ADD_ASSET") {
      this.sharedService.setSupplier(this.supplier);
      this.router.navigate(["/acm/add-asset"], {
        queryParams: { source: "ADD_SUPPLIER" },
      });
      return;
    }

    this.router.navigate(["/acm/supplier-list"], { queryParams: { mode: 2 } });
  }
  resetForm() {
    this.sharedService.form.formGroup.reset();
  }

  addLatLan(cityObject: any) {
    this.addressEntity.lan = cityObject.lat;
    this.addressEntity.lng = cityObject.lng;
  }

  /**
   * Method exit
   */
  exit() {
    if (this.modeGuarantor) {
      this.sharedService.openLoan(this.sharedService.getLoan());
    } else if (this.source === "ADD_ASSET" && this.firstSource == "ADD_LOAN") {
      this.sharedService.setSupplier(null);
      this.devToolsServices.openConfirmationDialog(
        AcmConstants.EXIT_FORM_MSG,
        AcmConstants.ADD_ASSET_URL,
        ["source", "ADD_LOAN"]
      );
    }else if (this.source === "ADD_ASSET" && this.firstSource == "MOD_LOAN"){
      this.sharedService.setSupplier(null);
      this.devToolsServices.openConfirmationDialog(
        AcmConstants.EXIT_FORM_MSG,
        AcmConstants.ADD_ASSET_URL,
        ["source", "MOD_LOAN"]
      );
    }else if (this.source === "ADD_ASSET" && this.firstSource == "MOD_Topup"){
      this.sharedService.setSupplier(null);
      this.devToolsServices.openConfirmationDialog(
        AcmConstants.EXIT_FORM_MSG,
        AcmConstants.ADD_ASSET_URL,
        ["source", "MOD_Topup"]
      );
    } else if (this.source === "ADD_ASSET") {
      this.devToolsServices.openConfirmationDialog(
        AcmConstants.EXIT_FORM_MSG,
        AcmConstants.ADD_ASSET_URL
      );
    } else {
      this.devToolsServices.openConfirmationDialog(
        AcmConstants.EXIT_FORM_MSG,
        "/acm/supplier-list"
      );
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

  public getRole() {
    this.customerManagementService.findRole().subscribe((data) => {
      this.roles = data;
    });
  }

  openLarge(content, category: string, param: string) {
    this.categoryCustomerLinkRelation = category;
    this.customerLinkCategoryParam = param;
    this.modal.open(content, {
      size: "xl",
    });
  }

  /**
   * getConnectedUser
   */
  async getConnectedUser() {
    this.currentUser = this.sharedService.getUser();
  }

  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener(
      "click",
      (e: google.maps.MouseEvent) => {
        // Here we can get correct event
        console.log(e.latLng.lat(), e.latLng.lng());
        this.addressMarker.lat = e.latLng.lat();
        this.addressMarker.lng = e.latLng.lng();
        this.addressMarker.label = "Address";
        this.addressMarker.draggable = true;
      }
    );
  }

  /**
   * supplierDetails
   * @param supplier Supplier
   */
  supplierDetails(supplier) {
    this.supplier = supplier;
    this.sharedService.setSupplier(this.supplier);
  }

  toggleCollapseConvention() {
    this.expandedConvention = !this.expandedConvention;
  }
  toggleCollapseArticle() {
    this.expandedArticles = !this.expandedArticles;
  }

  compareGroup(group1, group2) {
    if (group1 && group2) {
      return group1.id === group2.id;
    }
  }

  compareGroup2(group1, group2) {
    if (group1 && group2) {
      return group1.id === group2.id;
    }
  }
  compareGroup3(group1, group2) {
    if (group1 && group2) {
      return group1.id === group2.id;
    }
  }

  requiredDocument(event?: boolean){
    this.requiredDocuments =  event ;
  }

  

}


