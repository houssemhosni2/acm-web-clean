import { Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AppComponent } from "src/app/app.component";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
import { AcmDocumentsGedEntity } from "src/app/shared/Entities/acmDocumentsGed.entity";
import { UserEntity } from "src/app/shared/Entities/user.entity";
import { SharedService } from "src/app/shared/shared.service";
import { ProductEntity } from "../../../shared/Entities/product.entity";
import { SettingsService } from "../settings.service";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { AcmConstants } from "src/app/shared/acm-constants";
import { ReadCsvFileEntity } from "src/app/shared/Entities/ReadCsvFile.entity";
import { GenericWorkFlowObject } from "src/app/shared/Entities/GenericWorkFlowObject";
import { AppSettingGenericWorkflowComponent } from "../setting-generic-workflow/app-setting-generic-workflow.component";
import {customRequiredValidator} from '../../../shared/utils';

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.sass"],
})
export class SettingComponent implements OnInit {
  currentJustify2 = "justified";
  selectedFile: File | undefined;
  @ViewChild('fileInput') fileInput!: ElementRef;
  csvData: any[] | null = null;

  @ViewChildren('generalConfig, productConfig, productGuarantar, productTopup, productEligibility, productGuarantee, productIscore, productDocumentCreation, productFilters, productCurrency, productPriority') children: QueryList<any>;

  public productEntitys: ProductEntity[] = [];
  public productEntity: ProductEntity;
  public productEntityWorkflow: ProductEntity;
  public productSelected = false;
  public enabled: boolean;
  public acmDocumentsGedEntity: AcmDocumentsGedEntity[] = [];
  public document: AcmDocumentsGedEntity;
  public countEnabledDocuments = 0;
  public navigationMode = "setting";
  public userConnected: UserEntity;
  public nbOfSyncLoans: number;
  public syncIssuedLoans: number;
  public syncCancelledLoans: number;
  public syncLoanForm: FormGroup;
  public productForm: FormGroup;
  public productWorkflowForm: FormGroup;
  public active = 1;
  public isEditMode: boolean = true;

  /** Tab Load Checkers */
  public settingSystemLoading = false;
  public settingDMSLoading = false;
  public settingUserLoading = false;
  public settingGroupLoading = false;
  public settingAccessLoading = false;
  public settingIscoreLoading = false;
  public settingUDFLoading = false;
  public settingFieldLoading = false;
  public settingWorkFlowLoading = false;
  public settingAMLLoading = false;
  public settingBlacklistLoading = false;
  public settinggGenericWorkflow = false;
  public settingBranches = false;
  public settingFinancialCategory = false;
  public settingAddress = false;
  public settingList = false;
  public settingReporting = false;

  dtoList: ReadCsvFileEntity[] = [];
  showUploadModal = false;
  @ViewChild(AppSettingGenericWorkflowComponent)
  appSettingGenericWorkflowComponent: AppSettingGenericWorkflowComponent;

  /**
   *
   * @param settingsService SettingsService
   * @param devToolsServices AcmDevToolsServices
   * @param sharedService SharedService
   * @param formBuilder FormBuilder
   * @param modalService NgbModal
   * @param translate TranslateService
   * @param library FaIconLibrary
   */
  constructor(
    public settingsService: SettingsService,
    public devToolsServices: AcmDevToolsServices,
    public sharedService: SharedService,
    public formBuilder: FormBuilder,
    public modalService: NgbModal,
    public translate: TranslateService,
    public library: FaIconLibrary,
  ) {}
  expiryDate: any;
  testExpiryDate: boolean = false;
  public today = new Date();
  public mac: string;
  public testMac: boolean = false;
  public expandedSettingSMS:boolean = true;
  ngOnInit() {
     this.settingsService.getMacServer().subscribe((res) => {
      if (
        this.sharedService.getActivationKey() != null ||
        this.sharedService.getActivationKey() != undefined
      ) {
        this.mac = this.sharedService
          .getActivationKey()
          .filter((item) => item.includes("MAC"))[0]
          .split(":")[1];
        this.testMac = this.mac === res[0];
        this.expiryDate = this.sharedService
          .getActivationKey()
          .filter((item) => item.includes("EXPIRYDATE"))[0]
          .split(":")[1];
        if (this.expiryDate) {
          this.expiryDate = new Date(
            this.expiryDate.substring(4),
            this.expiryDate.substring(2, 4) - 1,
            this.expiryDate.substring(0, 2)
          );
          this.testExpiryDate = this.expiryDate > this.today;
        }
        if (!this.testExpiryDate)
          this.settingSystemLoading = false;
        else this.settingSystemLoading = true;
      } else {
        const environnements: string[] = [AcmConstants.KEY_LICENCE];
        this.settingsService
          .getEnvirementValueByKeys(environnements)
          .subscribe((data) => {
            if (data !== null) {
              this.sharedService.setActivationKey(
                data
                  .filter((item) => item.key === AcmConstants.KEY_LICENCE)[0]
                  .value.split(",")
              );
              this.sharedService.setCreptedKey(
                data.filter((item) => item.key === AcmConstants.KEY_LICENCE)[0]
                  .creptedKey
              );
              this.sharedService.setEnvironnementLicence(
                data.filter((item) => item.key === AcmConstants.KEY_LICENCE)[0]
              );
              this.mac = this.sharedService
                .getActivationKey()
                .filter((item) => item.includes("MAC"))[0]
                .split(":")[1];
              //this.testMac = this.mac === res[0];
              this.expiryDate = this.sharedService
                .getActivationKey()
                .filter((item) => item.includes("EXPIRYDATE"))[0]
                .split(":")[1];
              if (this.expiryDate) {
                this.expiryDate = new Date(
                  this.expiryDate.substring(4),
                  this.expiryDate.substring(2, 4) - 1,
                  this.expiryDate.substring(0, 2)
                );
                this.testExpiryDate = this.expiryDate > this.today;
              }
              if (!this.testExpiryDate )
                this.settingSystemLoading = false;
              else
                this.settingSystemLoading = true;
            }
          });
      }
      this.createFormProduct();
      this.productSelected = false;
      this.userConnected = this.sharedService.getUser();
      this.settingsService.getRefreshSettingConfiguration().subscribe((ref) => {
        this.findAllProducts();
        this.findAllGnericWfObject() ;
      });
      this.createForm();
      this.createFormWorkflow();

    });

  }

  findAllProducts() {
    this.settingsService.findAllProduct().subscribe((data) => {
      this.productEntitys = data;
    });
  }



  createFormProduct() {
    this.productForm = this.formBuilder.group({
      selectedProduct: ["", Validators.required],
    });
  }
  createForm() {
    this.syncLoanForm = this.formBuilder.group({
      accountNumber: ["", Validators.required],
    });
  }

  createFormWorkflow() {
    this.productWorkflowForm = this.formBuilder.group({
      selectedProductWorkflow: ["", customRequiredValidator],
    });
  }
  /**
   * Methode when product is selected
   * @param selectedValue ProductEntity
   */
  selectProduct() {
    this.productEntity = this.productForm.controls.selectedProduct.value;
    this.productSelected = true;
    this.enabled = this.productEntity.enabled;
  }

  selectProductWorkflow() {
    if (this.productWorkflowForm.controls.selectedProductWorkflow.value){
    this.productEntityWorkflow = this.productWorkflowForm.controls.selectedProductWorkflow.value;
    this.productSelected = true;
    this.enabled = this.productEntityWorkflow.enabled;
  }else {
    this.productEntityWorkflow = null
  }
  }

  toggleCollapseSMSSetting() {
    this.expandedSettingSMS = !this.expandedSettingSMS;
  }

  /**
   * reset when change tab
   */
  reset() {
    this.productEntity = null;
    this.productSelected = false;
  }
  /**
   * Enable / disable product
   */
  EnableProduct() {
    if (this.productEntity !== null && this.productEntity !== undefined) {
      this.productEntity.enabled = !this.productEntity.enabled;
      this.settingsService.updateProduct(this.productEntity).subscribe();
    }
  }
  /**
   * synchroniseLoans
   */
  synchroniseLoans() {
    this.settingsService.synchroniseLoans().subscribe((data) => {
      if (data !== null) {
        this.nbOfSyncLoans = data;
        this.devToolsServices.openToastArrayMessagesWithParameterInMiddle(
          0,
          ["", "synchronized_loans"],
          String(this.nbOfSyncLoans)
        );
      }
    });
  }
  /**
   * refreshIssuedLoans
   */
  refreshIssuedLoans() {
    this.settingsService.synchroniseIssuedLoans().subscribe((data) => {
      if (data !== null) {
        this.syncIssuedLoans = data;
        this.devToolsServices.openToastArrayMessagesWithParameterInMiddle(
          0,
          ["", "loan_synchronized"],
          String(this.syncIssuedLoans)
        );
      }
    });
  }
  /**
   * refreshCancelledLoans
   */
  refreshCancelledLoans() {
    this.settingsService.synchroniseCancelledLoans().subscribe((data) => {
      if (data !== null) {
        this.syncCancelledLoans = data;
        this.devToolsServices.openToastArrayMessagesWithParameterInMiddle(
          0,
          ["", "loan_synchronized"],
          String(this.syncCancelledLoans)
        );
      }
    });
  }
  /**
   *
   * @param modal rejectModalContent
   */
  async synchronizeModal(modal) {
    this.createForm();
    this.modalService.open(modal, {
      size: "md",
    });
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }
  /**
   * synchronizeLoan
   */
  synchronizeLoan() {
    if (this.syncLoanForm.valid) {
      this.settingsService.synchroniseLoanAccountNumber(this.syncLoanForm.controls.accountNumber.value).subscribe((data) => {
        if (data === null) {
          this.devToolsServices.openToast(3, 'alert.no_loan_founded');
        } else {
          this.modalService.dismissAll();
          this.devToolsServices.openToast(0, 'alert.success');
        }

      });
    }
  }
  /**
   * synchCustomers
   */
  synchCustomers() {
    this.settingsService.synchroniseCustomers().subscribe((data) => {
      if (data !== null) {
        this.devToolsServices.openToast(0, "alert.success");
      }
    });
  }
  /**
   * synchronize Portfolio
   */
  synchPortfolio() {
    this.settingsService.synchronisePortfolio().subscribe((data) => {
      if (data !== null) {
        this.devToolsServices.openToast(0, "alert.success");
      }
    });
  }
  /**
   * synchronize CustomerBranches
   */
  synchCustomerBranches() {
    this.settingsService.synchroniseCustomerBranches().subscribe((data) => {
      if (data !== null) {
        this.devToolsServices.openToast(0, "alert.success");
      }
    });
  }

  /**
   * synchronize Collections
   */
  synchCollections() {
    this.settingsService.synchroniseCollections().subscribe((data) => {
      if (data !== null) {
        this.devToolsServices.openToast(0, "alert.success");
      }
    });
  }

  /** events when tab is changed */
  onTabChanged(event) {
    switch (event.index) {
      case 0:
        if (!this.testExpiryDate )
          this.settingSystemLoading = true;
        else this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 1:
        this.settingSystemLoading = !this.settingSystemLoading;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 2:
        this.settingDMSLoading = !this.settingDMSLoading;
        this.settingSystemLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 3:
        this.settingUserLoading = !this.settingUserLoading;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 4:
        this.settingGroupLoading = !this.settingGroupLoading;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 5:
        this.settingAccessLoading = !this.settingAccessLoading;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 6:
        this.settingAccessLoading = false;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = !this.settingBranches;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 7:
        this.settingAccessLoading = false;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = !this.settingFinancialCategory;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 8:
        this.settingAMLLoading = !this.settingAMLLoading;
        this.settingAccessLoading = false;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 9:
        this.settingBlacklistLoading = !this.settingBlacklistLoading;
        this.settingAccessLoading = false;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 10:
        this.settingIscoreLoading = !this.settingIscoreLoading;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 11:
        this.settingFieldLoading = !this.settingFieldLoading;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 12:
        // deselect products in Setting workflow setting tab
        this.createFormWorkflow();
        this.productEntityWorkflow = null;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingFieldLoading = false;
        this.settingUDFLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 13:
        this.settingFieldLoading = false;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingAMLLoading = false;
        this.settingUDFLoading = false;
        this.settingBlacklistLoading = false;
        this.settinggGenericWorkflow = !this.settinggGenericWorkflow;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 14:
        this.settingFieldLoading = false;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settingUDFLoading = !this.settingUDFLoading;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 15:
        this.settingFieldLoading = false;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settingUDFLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = !this.settingAddress;
        this.settingList = false;
        this.settingReporting = false;
        break;
      case 16:
        this.settingFieldLoading = false;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settingUDFLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = !this.settingList;
        this.settingReporting = false;
        break;
      case 17:
        this.settingFieldLoading = false;
        this.settingSystemLoading = false;
        this.settingDMSLoading = false;
        this.settingUserLoading = false;
        this.settingGroupLoading = false;
        this.settingAccessLoading = false;
        this.settingIscoreLoading = false;
        this.settingAMLLoading = false;
        this.settingBlacklistLoading = false;
        this.settingUDFLoading = false;
        this.settinggGenericWorkflow = false;
        this.settingBranches = false;
        this.settingFinancialCategory = false;
        this.settingAddress = false;
        this.settingList = false;
        this.settingReporting = !this.settingReporting;
        break;
  
    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.parseCSV(this.selectedFile);
  }

  uploadFile() {

    if (!this.selectedFile) {
      return;
    }

    if(this.dtoList.length<=5000)
    {
      this.settingsService.sendDataCsvFileChargeOff(this.dtoList).subscribe(
        (response) => {
          this.devToolsServices.openToast(0, 'file_uploaded_successfully');
        },
        (error) => {
          this.devToolsServices.openToast(1, 'error_uploading_file');
        }
      );
    }
    else
    {
      this.devToolsServices.openToast(3, 'maximum_records');
    }


  }

  parseCSV(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      const csvText = reader.result as string;

      // Split the CSV text into lines
      const lines = csvText.split('\n');

      // Assuming the first line is the header, split it into column names
      const headers = lines[0].trim().split('\t');

      // Process the data rows starting from the second line
      for (let i = 1; i < lines.length; i++) {
        const data = lines[i].trim().split('\t');

        if (data.length === headers.length) {
          // Split the input string using the ';' delimiter
          const parts = lines[i].split(';');

          // Create an instance of the DTO and assign values
          const dto: ReadCsvFileEntity = {
            cuAccountId: +parts[0],
            orginalProductId: +parts[1],
            chargeOffProductId: +parts[2],
          };

          // Only add valid DTOs to the list
          if (!isNaN(dto.cuAccountId) && !isNaN(dto.orginalProductId) && !isNaN(dto.chargeOffProductId)) {
            this.dtoList.push(dto);
          }
        }
      }

    };

    reader.readAsText(file);
  }

  openFileUploadModal() {
    this.showUploadModal = true;
  }

  closeFileUploadModal() {
    this.showUploadModal = false;
  }

   /**
   *
   * @param modal rejectModalContent
   */
   async openchargeOffModal(chargeOffModal) {
    this.dtoList=[];
    this.modalService.open(chargeOffModal, {
      size: 'md'
    });

  }

 ///product modal
   // modal add configuration product
   public productDetailsForm: FormGroup;
   public  genericWorkflowObjectForEdit   = new  GenericWorkFlowObject() ;
   public operationType : string  ;

   addConfiguration(modalContent: TemplateRef<any> , type  : string ) {
    this.createFormModalGenericWorkFlow();
    this.operationType = type ;
    if (type=="UPDATE") {
      this.productDetailsForm.controls.name.setValue(this.productWorkflowForm.controls.selectedProductWorkflow.value.name) ;
      this.genericWorkflowObjectForEdit = this.productWorkflowForm.controls.selectedProductWorkflow.value ;
    }
    this.modalService.open(modalContent);
  }





  createFormModalGenericWorkFlow() {
    if (this.productWorkflowForm){ ///add  edit  in product popup
    this.productDetailsForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
    }
  }

  closeModale() {
    this.modalService.dismissAll();
  }


  onSubmit(){
    this.devToolsServices.makeFormAsTouched(this.productDetailsForm) ;
    if (this.productDetailsForm.valid){
      let genericWorkflowObject   = new  GenericWorkFlowObject() ;
    if  (this.operationType==="UPDATE"){
      genericWorkflowObject =this.genericWorkflowObjectForEdit
      genericWorkflowObject.name = this.productDetailsForm.controls.name.value  ;
      this.productEntityWorkflow = null ;
      this.appSettingGenericWorkflowComponent.ngOnInit() ;

    }else {
      genericWorkflowObject.name = this.productDetailsForm.controls.name.value  ;
    }

    this.settingsService.saveWorkFlowObject(genericWorkflowObject).subscribe(item =>{
      //console.log(item) ;
      this.findAllGnericWfObject() ;
      //this.genericWorkflowObjects.push(item) ;
      this.closeModale() ;
    })
  }
  }
  genericWorkflowObjects : GenericWorkFlowObject [] = [] ;
  findAllGnericWfObject(){
    this.settingsService.findWorkFlowObjects().subscribe(item =>{
      this.genericWorkflowObjects = item ;
    }) ;
  }

  runAML(){
    this.settingsService.runAML().subscribe((data) => {
      if (data !== null) {
        this.devToolsServices.openToast(0, "alert.success");
      }
    });
  }
  runDoubtfulLoan(){
    this.settingsService.runDoubtfulLoan().subscribe((data) => {
      if (data !== null) {
        this.devToolsServices.openToast(0, "alert.success");
      }
    });
  }

  // function to toggle between product action mode
  toggleIsEditMode() {
    if(this.isEditMode) {
      this.initializeProductEntity();
      this.productForm.controls.selectedProduct.setValue("");
      this.isEditMode = false;
    }
    else {
      this.productEntity = null;
      this.isEditMode = true;
    }
  }

  private initializeProductEntity(): void {
    this.productEntity = new ProductEntity();
    this.productEntity.code = '';
    this.productEntity.description = '';
    this.productEntity.minimumTerm = 0;
    this.productEntity.productIndiv = true;
    this.productEntity.productGrp = false;
    this.productEntity.productOrg = true;
    this.productEntity.refinance = true;
    this.productEntity.supplier = false;
    this.productEntity.disburse = false;
    this.productEntity.isFrequency = true;
    this.productEntity.isFrequencyWithDeferredPeriode = true;
    this.productEntity.rate = 0;
    this.productEntity.minimumBalance = 0;
    this.productEntity.minimumAge = 0;
    this.productEntity.minimumDeferredPeriod = 0;
    this.productEntity.enabled = false;
    this.productEntity.roundType = '';
    this.productEntity.topup = false;
    this.productEntity.settingTopup = null;
    this.productEntity.productDetailsDTOs = [];
  }

  createProduct() {
    let wrongEntries=0;
    // loop though all the child components and get the data
    const product = this.children.toArray().reduce((acc, child) => {
      // check validity of entries
      if(child.getUpdatedData() === false) 
        wrongEntries+=1;

      return { ...acc, ...child.getUpdatedData() };
    }, {});

    if(wrongEntries>0) {
      console.log('problem with entries');
    } else {
      this.settingsService.createProduct(product).subscribe((data) => {
        this.productEntity = data;
        this.toggleIsEditMode();
        this.devToolsServices.openToast(0, 'alert.success');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.findAllProducts();
      })
      // console.log('entries: ', product);
    }
  }
}
