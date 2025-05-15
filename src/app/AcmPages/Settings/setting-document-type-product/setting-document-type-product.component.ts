import {Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {SettingsService} from '../settings.service';
import {ProductEntity} from '../../../shared/Entities/product.entity';
import {SettingDocumentTypeProductEntity} from '../../../shared/Entities/settingDocumentTypeProduct.entity';
import {AcmDevToolsServices} from '../../../shared/acm-dev-tools.services';
import {NgxLoadingComponent, ngxLoadingAnimationTypes} from 'ngx-loading';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-setting-document-type-product',
  templateUrl: './setting-document-type-product.component.html',
  styleUrls: ['./setting-document-type-product.component.sass']
})
export class SettingDocumentTypeProductComponent implements OnInit, OnChanges {

  public settingDocumentProduct: SettingDocumentTypeProductEntity = new SettingDocumentTypeProductEntity();
  public settingDocumentsByProduct: SettingDocumentTypeProductEntity[] = [];
  public productEntitys: ProductEntity[] = [];
  @Input() productEntity: ProductEntity;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {animationType: ngxLoadingAnimationTypes.none, primaryColour: PrimaryBleu};
  slideConfig6 = {
    className: 'center',
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    adaptiveHeight: true,
    dots: true,
  };
  public loading = true;
  public reportNameForm: FormGroup;

  /**
   * constructor.
   * @param settingsService SettingsService
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public settingsService: SettingsService,
              public devToolsServices: AcmDevToolsServices,
              public formBuilder: FormBuilder) {
  }

  ngOnInit() {

}

  createReportNameFrom() {
    this.reportNameForm = this.formBuilder.group({});
  }

  /**
   * Methode when input property change
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.loading = true;
    this.createReportNameFrom();
    this.productEntity = changes.productEntity.currentValue;
    this.settingDocumentProduct.productId = this.productEntity.id;
    this.settingDocumentProduct.all = true;
    this.settingsService.findAllDocumentProduct(this.settingDocumentProduct).subscribe((data) => {
      this.settingDocumentsByProduct = data;
      data.map(((value, index) => {
        this.reportNameForm.addControl('reportName' + index, new FormControl(value.reportName));
        this.reportNameForm.addControl('updated' + index, new FormControl(false));
      }));
      this.loading = false;
    });
  }

  /**
   * disable document product
   * @param documentProduct SettingDocumentTypeProductEntity
   */
  diableDocumentProduct(documentProduct) {
    this.loading = true;
    this.settingDocumentsByProduct.map((settingDocumentProduct) => {
      if (settingDocumentProduct === documentProduct) {
        this.settingsService.disableDocumentProduct(documentProduct).subscribe(() => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.loading = false;
        });
      }
    });
  }

  /**
   * enable document product
   * @param documentProduct SettingDocumentTypeProductEntity
   */
  enableDocumentProduct(documentProduct) {
    this.loading = true;
    this.settingDocumentsByProduct.map((settingDocumentProduct) => {
      if (settingDocumentProduct === documentProduct) {
        this.settingsService.enableDocumentProduct(documentProduct).subscribe(() => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.loading = false;
        });
      }
    });
  }

  /**
   * onChange button status
   * @param documentProduct SettingDocumentTypeProductEntity
   */
  toggleStatus(documentProduct: SettingDocumentTypeProductEntity) {
    if (documentProduct.enabled === false) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_document_product').afterClosed().subscribe(
        res => {
          if (res) {
            this.diableDocumentProduct(documentProduct);
          } else {
            documentProduct.enabled = true;
          }
        });
    } else {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.enable_document_product').afterClosed().subscribe(
        res => {
          if (res) {
            this.enableDocumentProduct(documentProduct);
          } else {
            documentProduct.enabled = false;
          }
        });
    }
  }

  /**
   * onChange button mandatory
   * @param documentProduct SettingDocumentTypeProductEntity
   */
  toggleMandatory(documentProduct: SettingDocumentTypeProductEntity) {
    if (documentProduct.mandatory === false) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.mandatory_document_product').afterClosed().subscribe(
        res => {
          if (res) {
            this.loading = true;
            documentProduct.mandatory = false;
            this.settingsService.updateDocumentProduct(documentProduct).subscribe(() => {
              this.devToolsServices.openToast(0, 'alert.success');
              this.loading = false;
            });
          } else {
            documentProduct.mandatory = true;
          }
        });
    } else {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.mandatory_document_product').afterClosed().subscribe(
        res => {
          if (res) {
            documentProduct.mandatory = true;
            this.loading = true;
            this.settingsService.updateDocumentProduct(documentProduct).subscribe(() => {
              this.devToolsServices.openToast(0, 'alert.success');
              this.loading = false;
            });
          } else {
            documentProduct.mandatory = false;
          }
        });
    }
  }

  updateReportName(documentType: SettingDocumentTypeProductEntity, i: number) {
    documentType.reportName = this.reportNameForm.controls['reportName' + i].value;
    this.loading = true;
    this.settingsService.updateDocumentProduct(documentType).subscribe(() => {
      this.devToolsServices.openToast(0, 'alert.success');
      this.loading = false;
    });
  }

  changeReportName(i: number) {
    this.reportNameForm.controls['updated' + i].setValue(true);
  }
}
