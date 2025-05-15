import { Component, OnInit, ViewChild, TemplateRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { AppComponent } from '../../../app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { ProductDetailsEntity } from 'src/app/shared/Entities/productDetails.entity';
import { SettingsService } from '../settings.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { DeferredPeriodTypeEntity } from 'src/app/shared/Entities/DeferredPeriodType.entity';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { SettingChargeFeeEntity } from 'src/app/shared/Entities/settingChargeFee.entity';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-setting-product-configuration',
  templateUrl: './setting-product-configuration.component.html',
  styleUrls: ['./setting-product-configuration.component.sass']
})
export class SettingProductConfigurationComponent implements OnInit, OnChanges {

  /**
   * constructor SettingProductConfigurationComponent
   * @param modal NgbModal
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   * @param settingsService SettingsService
   * @param devToolsServices AcmDevToolsServices
   * @param library FaIconLibrary
   */
  constructor(public modal: NgbModal, public formBuilder: FormBuilder, public translate: TranslateService,
              public settingsService: SettingsService, public devToolsServices: AcmDevToolsServices, public library: FaIconLibrary) { }

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: PrimaryBleu };
  slideConfig6 = {
    className: 'center',
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    adaptiveHeight: true,
    dots: true,
  };
  public loading = true;
  public productDetailsForm: FormGroup;
  @Input() productEntity: ProductEntity;
  @Input() isEditMode: boolean;
  public selectedIndex: number;
  public productDetailsEntitys: ProductDetailsEntity[] = [];
  public updateId = 0;
  public enabled = false;
  public deferredPeriodTypeList: string;
  public allDeferredPeriodTypeEntities: DeferredPeriodTypeEntity[] = [];
  configDeferredPeriodType  = {
    displayKey: 'code',
    search: true,
    placeholder: ' '
  };
  configChargeFee  = {
    displayKey: 'id',
    valueKey: 'value.id',
    search: true,
    placeholder: ' '
  };
  public penaltyChargeFees : SettingChargeFeeEntity[];
  public payoutChargeFees : SettingChargeFeeEntity[];
  public normalChargeFees : SettingChargeFeeEntity[];
  ngOnInit() {
    this.productDetailsEntitys = this.productEntity.productDetailsDTOs;
    this.getDeferredPeriodTypes();
    // find penalty , payout and normal charge fees 
    let settingChargeFee = new SettingChargeFeeEntity();
    settingChargeFee.feeTypes = [AcmConstants.PENALTY_FEES,  AcmConstants.PAYOUT_FEES,AcmConstants.NORMAL_FEES];
    this.settingsService.findSettingChargeFee(settingChargeFee).subscribe((data) => {
      this.penaltyChargeFees = data.filter((fee => fee.feeType === AcmConstants.PENALTY_FEES));
      this.payoutChargeFees = data.filter((fee => fee.feeType ===  AcmConstants.PAYOUT_FEES));
      this.normalChargeFees = data.filter((fee => fee.feeType === AcmConstants.NORMAL_FEES));
    });
  }

  /**
   * Methode when input property change
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.productEntity = changes.productEntity.currentValue;
    this.productDetailsEntitys = this.productEntity.productDetailsDTOs;
    this.loading = false;
  }

  getDirection() {
    return AppComponent.direction;

  }

  closeModale() {
    this.modal.dismissAll();
  }
  // modal add configuration product
  addConfiguration(modalContent: TemplateRef<any>) {
    this.updateId = 0;
    this.createForm();
    this.modal.open(modalContent);
  }

 /**
  * get all values before update product detail
  * @param any content
  * @param any documentType
  */
  async updateConfiguration(modalContent, productDetailsEntity: ProductDetailsEntity) {
    this.createForm();
   await this.settingsService.findProduct(productDetailsEntity.idProduct).toPromise().then((element) => {
      productDetailsEntity = element.productDetailsDTOs[0];
    });
    this.updateId = productDetailsEntity.id;
    this.enabled = productDetailsEntity.enabled;
    this.productDetailsForm.controls.amountMin.setValue(productDetailsEntity.minimumAmount);
    this.productDetailsForm.controls.amountMax.setValue(productDetailsEntity.maximumAmount);
    this.productDetailsForm.controls.termMin.setValue(productDetailsEntity.minimumTerm);
    this.productDetailsForm.controls.termMax.setValue(productDetailsEntity.maximumTerm);
    this.productDetailsForm.controls.termType.setValue(productDetailsEntity.termType);
    this.productDetailsForm.controls.greenRate.setValue(productDetailsEntity.greenRate);
    this.productDetailsForm.controls.orangeRate.setValue(productDetailsEntity.orangeRate);
    this.productDetailsForm.controls.redRate.setValue(productDetailsEntity.redRate);
    this.productDetailsForm.controls.panaltyFee.setValue(productDetailsEntity.penaltySettingChargeFeeId);
    this.productDetailsForm.controls.penaltyGracePeriod.setValue(productDetailsEntity.penaltyGracePeriod);
    this.productDetailsForm.controls.payoutFee.setValue(productDetailsEntity.payoutSettingChargeFeeId);
    // set disbursment fees 
    if(productDetailsEntity.disbursmentFeesSetting != null){
      let disbursmentFeesIdsTab = productDetailsEntity.disbursmentFeesSetting.split(";").map(id => Number(id));
      this.productDetailsForm.controls.disbursementFees.setValue(this.normalChargeFees.filter(item => disbursmentFeesIdsTab.includes(item.id)));
    }
    // set types
    if (productDetailsEntity.deferredPeriodTypes !== null && productDetailsEntity.deferredPeriodTypes !== undefined
       && productDetailsEntity.deferredPeriodTypes !== '') {
      const branchesNumber = (productDetailsEntity.deferredPeriodTypes.match(/,/g) || []).length + 1;
      const branches: any[] = productDetailsEntity.deferredPeriodTypes.split(',', branchesNumber);
      branches.forEach(element => {
        this.allDeferredPeriodTypeEntities.find(
          obj => {
            if (obj.deferredPeriodTypeId === +element) {
              this.productDetailsForm.controls.deferredPeriodTypes.value.push(obj);
            }
          }
        );
      });
    } else {
      this.productDetailsForm.controls.deferredPeriodTypes.setValue([]);
    }
    this.modal.open(modalContent, {
      size: 'md'
    });
  }
  /**
   * create form
   */
  createForm() {
    this.productDetailsForm = this.formBuilder.group({
      amountMin: ['', Validators.required],
      amountMax: ['', Validators.required],
      termMin: ['', Validators.required],
      termMax: ['', Validators.required],
      termType: ['', Validators.required],
      greenRate:  ['', Validators.required] ,
      orangeRate: ['', Validators.required] ,
      redRate: ['', Validators.required],
      panaltyFee: [''],
      penaltyGracePeriod: [0],
      payoutFee: [''],
      deferredPeriodTypes: [[], Validators.required],
      disbursementFees: [[]]
    });
  }
  /**
   * create new new productDetails
   */
  create() {
    this.modal.dismissAll();
    const productDetails: ProductDetailsEntity = new ProductDetailsEntity();
    productDetails.minimumAmount = this.productDetailsForm.controls.amountMin.value;
    productDetails.maximumAmount = this.productDetailsForm.controls.amountMax.value;
    productDetails.minimumTerm = this.productDetailsForm.controls.termMin.value;
    productDetails.maximumTerm = this.productDetailsForm.controls.termMax.value;
    productDetails.termType = AcmConstants.TERM_TYPE_MONTH;
    productDetails.idProduct = this.productEntity.id;
    productDetails.enabled = false;
    productDetails.greenRate = this.productDetailsForm.controls.greenRate.value;
    productDetails.orangeRate = this.productDetailsForm.controls.orangeRate.value;
    productDetails.redRate = this.productDetailsForm.controls.redRate.value;
    productDetails.penaltySettingChargeFeeId = this.productDetailsForm.controls.panaltyFee.value?.id;
    productDetails.penaltyGracePeriod = this.productDetailsForm.controls.penaltyGracePeriod.value;
    productDetails.payoutSettingChargeFeeId = this.productDetailsForm.controls.payoutFee.value?.id;
    if (this.deferredPeriodTypeList !== null && this.deferredPeriodTypeList !== undefined) {
      productDetails.deferredPeriodTypes = this.deferredPeriodTypeList.slice(0, -1);
    }
    if(this.isEditMode) {
      this.settingsService.createProductDetails(productDetails).subscribe((data) => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.productDetailsEntitys.push(data);
      });
    } else {
      productDetails.id = this.productDetailsEntitys.length+1;
      this.productDetailsEntitys.push(productDetails);
    }
  }

 /**
  * update document type
  */
  async update() {
    this.modal.dismissAll();
    const productDetails: ProductDetailsEntity = new ProductDetailsEntity();
    productDetails.id = this.updateId;
    productDetails.minimumAmount = this.productDetailsForm.controls.amountMin.value;
    productDetails.maximumAmount = this.productDetailsForm.controls.amountMax.value;
    productDetails.minimumTerm = this.productDetailsForm.controls.termMin.value;
    productDetails.maximumTerm = this.productDetailsForm.controls.termMax.value;
    productDetails.greenRate = this.productDetailsForm.controls.greenRate.value;
    productDetails.orangeRate = this.productDetailsForm.controls.orangeRate.value;
    productDetails.redRate = this.productDetailsForm.controls.redRate.value;
    productDetails.penaltyGracePeriod = this.productDetailsForm.controls.penaltyGracePeriod.value;
    productDetails.termType = AcmConstants.TERM_TYPE_MONTH;
    productDetails.idProduct = this.productEntity.id;
    productDetails.enabled = this.enabled;
    productDetails.penaltySettingChargeFeeId = this.productDetailsForm.controls.panaltyFee.value;
    productDetails.payoutSettingChargeFeeId = this.productDetailsForm.controls.payoutFee.value;
    productDetails.disbursmentFeesSetting = this.productDetailsForm.controls.disbursementFees.value.map(item => item.id).join(';');
    this.deferredPeriodTypeMethode();
    if (this.deferredPeriodTypeList !== null && this.deferredPeriodTypeList !== undefined) {
      productDetails.deferredPeriodTypes = this.deferredPeriodTypeList.slice(0, -1);
    }
    if(this.isEditMode) {
      this.settingsService.updateProductDetails(productDetails).subscribe(() => {

        this.settingsService.findProduct(productDetails.idProduct).subscribe((element) => {
          this.productDetailsEntitys = element.productDetailsDTOs;
          this.devToolsServices.openToast(0, 'alert.success');
        });
      });
    } else {
      this.productDetailsEntitys[this.selectedIndex] = productDetails;
    }
    //to refresh updated setting configuration
    this.ngOnInit();
  }

  /**
   * Methode when select add in popup
   */
  onSubmit() {
    if (this.updateId !== 0) {
      this.update();
    } else {
      this.create();
    }
  }
  /**
   * Methode remove productDetails
   */
  remove(productDetailsEntity: ProductDetailsEntity, i: number) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_product_detail').afterClosed().subscribe(
      res => {
        if (res) {
          this.settingsService.deleteProductDetails(productDetailsEntity.id).subscribe(() => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.productDetailsEntitys.splice(i, 1);
          });
        }
      }
    );
  }
  deferredPeriodTypeMethode() {
    this.deferredPeriodTypeList = '';
    this.productDetailsForm.controls.deferredPeriodTypes.value.forEach(data => {
      this.deferredPeriodTypeList =   data.deferredPeriodTypeId.toString() + ',' + this.deferredPeriodTypeList;
    });
  }
  getDeferredPeriodTypes() {
    this.settingsService.getDeferredPeriodTypes().subscribe((data) => {
      this.allDeferredPeriodTypeEntities = data;
    }); }

  switchUpdateMode(modalContent, index: number) {
    this.updateId = -1;
    this.selectedIndex = index;
    this.modal.open(modalContent, {
      size: 'md'
    });
  }

  // Expose local state to the parent
  getUpdatedData() {
    if(this.productDetailsEntitys.length != 0) {
      return {
        productDetailsDTOs: this.productDetailsEntitys
      };
    } else {
      return false;
    }
  }
}
