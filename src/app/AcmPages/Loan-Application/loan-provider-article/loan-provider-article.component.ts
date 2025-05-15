import { SharedService } from './../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxLoadingComponent } from 'ngx-loading';
import { AssetEntity } from 'src/app/shared/Entities/Asset.entity';
import { FormGroup } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { GuarantorEntity } from './../../../shared/Entities/guarantor.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { AssetLoanEntity } from 'src/app/shared/Entities/AssetLoan.entity';
import { SettingsService } from '../../Settings/settings.service';
import { SettingRequiredStepEntity } from 'src/app/shared/Entities/settingRequiredStep.entity';
import { Router } from '@angular/router';
import { isTodayBetweenDates } from '../../../shared/utils';


@Component({
  selector: 'app-loan-provider-article',
  templateUrl: './loan-provider-article.component.html',
  styleUrls: ['./loan-provider-article.component.sass']
})
export class LoanProviderArticleComponent implements OnInit, OnChanges {
  // mode = view || edit
  @Input() mode;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @Input() expanded;
  public guarantorAmount: FormGroup;
  public loading = true;
  public check = false;
  public page: number;
  public pageSize: number;
  public totalAssetAmount = 0;
  public loan: LoanEntity = new LoanEntity();
  public guarantors: CustomerEntity[] = [];
  @Output() totalAmount = new EventEmitter<any>();
  public data: GuarantorEntity[];
  // public listAssets:AssetEntity[]=[];
  public decimalPlaces: string;
  public listAssetsSelected: AssetLoanEntity[] = [];
  public listAssetLoanEntity: AssetLoanEntity[] = [];
  public settingRequiredStepEntity: SettingRequiredStepEntity = new SettingRequiredStepEntity();
  public stateSupplier = false;
  @Input() supplier;
  @Output() selectAssets = new EventEmitter<any>();
  @Output() addNewAsset = new EventEmitter<boolean>();
  @Input() newAssetAdded: AssetLoanEntity[];
  @Output() calculRequired = new EventEmitter<any>(); 
  public withholdingTaxes = [0, 1, 1.5];
  public addedAssetsIds = new Set();
  constructor(public modalService: NgbModal, public library: FaIconLibrary, public router: Router,
    public devToolsServices: AcmDevToolsServices, public translate: TranslateService,
    public sharedService: SharedService, public settingsService: SettingsService,) { }

  ngOnChanges(changes: SimpleChanges): void {
    const searchObjectStr = JSON.stringify(changes);
    const listAssetsSelectedString = this.listAssetsSelected.map(asset => JSON.stringify(asset));

    // Use the includes() method to search for the JSON string in the array of JSON strings
    const foundAssetStr = listAssetsSelectedString.find(assetStr => assetStr === searchObjectStr);
    if (changes.newAssetAdded && changes.newAssetAdded.currentValue !== undefined && changes.newAssetAdded.currentValue !== null
      && changes.newAssetAdded.previousValue !== changes.newAssetAdded.currentValue && changes
      && (foundAssetStr === null || foundAssetStr === '')) {
      this.listAssetsSelected.push(...changes.newAssetAdded.currentValue);
      // calculate total asset amount
      this.calculateTotalAmount()
    }
  }

  ngOnInit(): void {
    this.listAssetsSelected = [];
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    this.pageSize = 5;
    this.page = 1;
    if (this.sharedService.loan !== null && this.sharedService.loan !== undefined) {
      let loanAssetsDtos = this.sharedService.loan.loanAssetsDtos;
      if (!Array.isArray(loanAssetsDtos)) {
        loanAssetsDtos = [];
      }
      if (loanAssetsDtos) {
        loanAssetsDtos.forEach(loanAsset => {
          if(!this.addedAssetsIds.has(loanAsset.asset.id)){
            if (loanAsset.enabled) {
              this.listAssetsSelected.push(loanAsset);
              this.selectAssets.emit(this.listAssetsSelected);
              this.addedAssetsIds.add(loanAsset.asset.id);
            }
          }
        });
      }

    }
    this.calculateTotalAmount();
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  /**
   * methode to open the popup schedule
   * param content
   */
  openLarge(content) {
    this.modalService.open(content, {
      size: 'xl'
    });
  }

  /**
   * GetDirection
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Add Asset List
   */
  addAssets(event: AssetEntity[]) {
    event.forEach((data) => {
      if (!this.addedAssetsIds.has(data.id)) {
        const selectedAsset: AssetLoanEntity = new AssetLoanEntity();
        selectedAsset.asset = data;
        selectedAsset.idLoan = this.loan.loanId;
        selectedAsset.prixUnitaire = data.prixUnitaire;
        selectedAsset.quantiteArticle = 1;
        selectedAsset.withholdingTax = data.supplier.withholdingTax === null || data.supplier.withholdingTax === undefined ? 0 : data.supplier.withholdingTax;
        selectedAsset.enabled = true;
        if (isTodayBetweenDates(data.promotionStartDate, data.promotionEndDate)) {
          selectedAsset.remiseArticle = data.remiseArticle + data.promotion;
        } else {
          selectedAsset.remiseArticle = data.remiseArticle;
        }
        this.listAssetsSelected.push(selectedAsset);
        this.listAssetsSelected.sort((a, b) => (a.enabled === b.enabled) ? 0 : a.enabled ? -1 : 1);
        this.selectAssets.emit(this.listAssetsSelected);
        this.addedAssetsIds.add(data.id);
      }
    });
    //  this.sharedService.setLoanAssets(this.listAssetsSelected);
    this.calculateTotalAmount();
    this.check = true;
  }

  onChange(item: AssetLoanEntity) {

     const index = this.listAssetsSelected.findIndex(asset => asset.asset.id === item.asset.id);
     if (index !== -1) {
         this.listAssetsSelected[index].prixUnitaire = item.prixUnitaire;
         this.listAssetsSelected[index].remiseArticle = item.remiseArticle;
         this.listAssetsSelected[index].quantiteArticle = item.quantiteArticle;
         this.listAssetsSelected[index].withholdingTax = item.withholdingTax;
         this.listAssetsSelected.sort((a, b) => (a.enabled === b.enabled) ? 0 : a.enabled ? -1 : 1);
         this.selectAssets.emit(this.listAssetsSelected);
     }
    this.calculateTotalAmount();
  }
  deleteAsset(item: AssetLoanEntity) {

    const index = this.listAssetsSelected.findIndex(asset => asset.asset.id === item.asset.id);
    if (index !== -1) {
        this.listAssetsSelected[index].enabled = false;
    }

    // const listAssetsModifier = this.listAssetsSelected
    // this.listAssetsSelected = this.listAssetsSelected.filter(asset => asset !== item);
    this.addedAssetsIds.delete(item.asset.id);
    this.calculateTotalAmount();
    //   this.sharedService.setLoanAssets(this.listAssetsSelected);
    this.selectAssets.emit(this.listAssetsSelected);
  }

  calculateTotalAmount() {
    if ((this.listAssetsSelected.length > 0)) {
      this.totalAssetAmount = 0;
      this.listAssetsSelected.forEach((asset) => {
        if (asset.enabled) {
          this.totalAssetAmount = this.totalAssetAmount + (asset.prixUnitaire * (1 - asset.remiseArticle / 100) * asset.quantiteArticle);
        }
      });
      this.calculRequired.emit(false); 
      this.getEnabledAssetsCount();
      this.totalAmount.emit(this.totalAssetAmount);
      this.calculRequired.emit(false); 
    }
  }
  createNewAsset() {
    this.addNewAsset.emit(true);
  }

  getEnabledAssetsCount(): number {
    return this.listAssetsSelected.filter(asset => asset.enabled).length;
}
}
