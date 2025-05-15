import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { SettingsService } from '../settings.service';
import { AcmCurrencySetting } from 'src/app/shared/Entities/acmCurrencySetting.entity';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

const PrimaryBleu = 'var(--primary)';
@Component({
  selector: 'app-product-currency-setting',
  templateUrl: './product-currency-setting.component.html',
  styleUrls: ['./product-currency-setting.component.sass']
})
export class ProductCurrencySettingComponent implements OnInit {

  @Input() productEntity: ProductEntity;
  public currencyList: AcmCurrencySetting[];
  public product: ProductEntity;

  public currencyId: number;

  @Input() isEditMode: boolean;

  constructor(public settingService: SettingsService, public translate: TranslateService,public devToolsServices: AcmDevToolsServices) { }

  ngOnInit(): void {
    this.settingService.findCurrencySetting(new AcmCurrencySetting()).subscribe((res) => {
      this.currencyList = res;
    })

    if(this.isEditMode) {
      this.settingService.findProductById(this.productEntity.id).subscribe(
        (data) => {
          this.product = data;
        }
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isEditMode) {
      this.productEntity = changes.productEntity.currentValue;
      this.settingService.findProductById(this.productEntity.id).subscribe(
        (data) => {
          this.product = data;
          this.currencyId = this.product.acmCurrency.id;
        }
      );
    }
  }

  save() {
    if (this.product !== null && this.product !== undefined) {
      this.product.acmCurrency = this.currencyList.filter((item)=> item.id == this.currencyId)[0];     
      this.settingService.updateProduct(this.product).subscribe((res)=>{
        this.devToolsServices.openToast(0, 'alert.success');
      });
    }
  }

  // Expose local state to the parent
  getUpdatedData() {
    if(this.currencyId) {
      return {
        acmCurrency: this.currencyList.filter((item)=> item.id == this.currencyId)[0]
      };
    } else {
      return false;
    }
  }

}
