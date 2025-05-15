import { Component, Input, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SettingsService } from '../settings.service';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { ProductFiltersEntity } from 'src/app/shared/Entities/ProductFilters.entity';
import { ProductFiltersService } from './product-filters.service';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AssetTypeListDTO } from 'src/app/shared/Entities/AssetTypeListDTO.entity';
import { ProductTypeListDTO } from 'src/app/shared/Entities/ProductTypeListDTO.entity';
const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.sass']
})
export class ProductFiltersComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: PrimaryBleu };
  public loading = true;
  @Input() productEntity: ProductEntity;
  @Input() isEditMode: boolean;
  public productFiltersForm: FormGroup;
  public productFiltersList: ProductFiltersEntity[] = [];
  public productFilter: ProductFiltersEntity;
  public pageSize: number;
  public page: number;
  public action: string; // add or update
  public instrumentList: AssetTypeListDTO[] = [];
  public typeList: ProductTypeListDTO[] = [];
  public filtredTypeList: ProductTypeListDTO[] = [];
  public activityList: ProductTypeListDTO[] = [];
  public filtredActivityList: ProductTypeListDTO[] = [];
  public natureList: ProductTypeListDTO[] = [];
  public filtredNatureList: ProductTypeListDTO[] = [];

  dropdownConfig = {
    displayKey: 'libelle', // Display the libelle in the dropdown
    search: true,          // Enable search feature
    height: 'auto',        // Adjust the height of the dropdown
    moreText: 'more', // Text for showing more items
    noResultsFound: 'No results found!', // Text when no results found
    searchOnKey: 'libelle', // Field to search on
    clearOnSelection: false, // Clear the search input upon selection
  };

  constructor(public modal: NgbModal, public formBuilder: FormBuilder, public translate: TranslateService,
    public productFiltersService: ProductFiltersService, public settingsService: SettingsService,
    public devToolsServices: AcmDevToolsServices, public library: FaIconLibrary) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.pageSize = 5;
    this.page = 1;
    this.productFiltersList = [];
    if (this.productEntity.productFilter) {
      this.productFiltersList.push(this.productEntity.productFilter);
    }
  }
  ngOnInit() {
    this.initListValues();
    this.pageSize = 5;
    this.page = 1;
    this.productFiltersList = [];
    if (this.productEntity.productFilter) {
      this.productFiltersList.push(this.productEntity.productFilter);
    }
  }

  createForm(productFilter: ProductFiltersEntity) {
    this.productFiltersForm = this.formBuilder.group({
      instrument: [this.mapIdsToObjects(this.productFilter.instrument, this.instrumentList)],
      productType: [this.mapIdsToObjects(this.productFilter.productType, this.typeList)],
      nature: [this.mapIdsToObjects(this.productFilter.nature, this.natureList)],
      activity: [this.mapIdsToObjects(this.productFilter.activity, this.activityList)]
    })
  }
  mapIdsToObjects(ids: string, list: any[]): any[] {
    if (!ids) {
      return [];
    }
    const idArray = ids.split(',').map(id => +id);
    return list.filter(item => idArray.includes(item.id));
  }

  addFilter(modalContent: TemplateRef<any>) {
    this.productFilter = new ProductFiltersEntity();
    this.action = 'create';
    this.createForm(this.productFilter);
    this.modal.open(modalContent);
  }

  editFilter(modalContent, productFilter: ProductFiltersEntity) {
    this.action = 'update';
    this.productFilter = productFilter;
    this.createForm(productFilter);
    const instrumentControl = this.productFiltersForm.get('instrument').value;
    this.onInstrumentChange(instrumentControl,false);
    const productTypeControl = this.productFiltersForm.get('productType').value;
    this.onProductChange(productTypeControl,false);
    const activityControl = this.productFiltersForm.get('activity').value
    this.onActivityChange(activityControl, false);
    this.modal.open(modalContent);
  }

  onSubmit() {
    if (this.productFiltersForm.valid) {
      if (this.action === 'update') {
        this.update();
      }
      if (this.action === 'create') {
        this.save();
      }
    }
  }

  save() {
    this.productFilter.productId = this.productEntity.id;

    const getIdValues = (controlName: string) => {
      const controlValue = this.productFiltersForm.controls[controlName].value;
      if (Array.isArray(controlValue)) {
        return controlValue.map(item => item.id).join(',');
      }
      return '';
    };

    this.productFilter.instrument = getIdValues('instrument');
    this.productFilter.productType = getIdValues('productType');
    this.productFilter.nature = getIdValues('nature');
    this.productFilter.activity = getIdValues('activity');
    this.productFilter.enabled = true;

    if(this.isEditMode) {
      this.productFiltersService.createProductFilters(this.productFilter).subscribe((data) => {
        this.productFilter = data;
        this.modal.dismissAll();
        this.devToolsServices.openToast(0, 'alert.success');
        this.productFiltersList.push(this.productFilter);
      });
    } else {
      this.productFiltersList.push(this.productFilter);
      this.modal.dismissAll();
    }
  }

  update() {

    const getIdValues = (controlName: string) => {
      const controlValue = this.productFiltersForm.controls[controlName].value;
      if (Array.isArray(controlValue)) {
        return controlValue.map(item => item.id).join(',');
      }
      return '';
    };

    this.productFilter.instrument = getIdValues('instrument');
    this.productFilter.productType = getIdValues('productType');
    this.productFilter.nature = getIdValues('nature');
    this.productFilter.activity = getIdValues('activity');

    if(this.isEditMode) {
      this.productEntity.productFilter = this.productFilter;
      this.settingsService.updateProduct(this.productEntity).subscribe(() => {
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
      });
    } else {
      this.modal.dismissAll();
    }
  }

  onInstrumentChange(event: any, action: boolean) {
    const selectedIds = event.map((item: AssetTypeListDTO) => item.id);
    const uniqueIds = new Set<number>();

    this.filtredTypeList = this.typeList.filter(item => {
      const hasMatchingParent = item.id_parent.some(parentId => selectedIds.includes(parentId));
      if (hasMatchingParent && !uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
      }
      return false;
    });
    if(action){
      this.productFiltersForm.get('productType').setValue(null);
      this.productFiltersForm.get('activity').setValue(null);
      this.productFiltersForm.get('nature').setValue(null);
    }
  }


  onProductChange(event: any, action: boolean) {
    const selectedIds = event.map((item: ProductTypeListDTO) => item.id);
    const uniqueIds = new Set<number>();

    this.filtredActivityList = this.activityList.filter(item => {
      const hasMatchingParent = item.id_parent.some(parentId => selectedIds.includes(parentId));
      if (hasMatchingParent && !uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
      }
      return false;
    });
    if(action){
      this.productFiltersForm.get('activity').setValue(null);
      this.productFiltersForm.get('nature').setValue(null);
    }
  }

  onActivityChange(event: any, action: boolean) {
    const selectedIds = event.map((item: ProductTypeListDTO) => item.id);
    const uniqueIds = new Set<number>();

    this.filtredNatureList = this.natureList.filter(item => {
      const hasMatchingParent = item.id_parent.some(parentId => selectedIds.includes(parentId));
      if (hasMatchingParent && !uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
      }
      return false;
    });
    if(action){
      this.productFiltersForm.get('nature').setValue(null);
    }
  }

  enableDisable(productFilter: ProductFiltersEntity) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_filtert').afterClosed().subscribe(res => {
      if (res) {
        this.productFiltersService.updateProductFilters(productFilter).subscribe();
      } else {
        productFilter.enabled = !productFilter.enabled;
      }
    });
  }

  getDirection() {
    return AppComponent.direction;
  }

  closeModale() {
    this.modal.dismissAll();
  }

  getcurrentLang() {
    return this.translate.currentLang;
  }

  initListValues() {
    this.settingsService.findProductFinanceList(AcmConstants.PRODUCT_INSTRUMENT).subscribe((data) => {
      this.instrumentList = data;
    });
    this.settingsService.findProductFilterList(AcmConstants.PRODUCT_TYPE).subscribe((data) => {
      this.typeList = data;
    });
    this.settingsService.findProductFilterList(AcmConstants.PRODUCT_ACTIVITY).subscribe((data) => {
      this.activityList = data;
    });
    this.settingsService.findProductFilterList(AcmConstants.PRODUCT_NATURE).subscribe((data) => {
      this.natureList = data;
    });
  }

  getLibelleById(id: number, list: any[]): string {
    const item = list.find(item => item.id === id);
    return item ? item.libelle : '';
  }

  getLibelleArrayByIds(ids: string, list: any[]): string {
    if (!ids) {
      return '';
    }
    const idArray = ids.split(',').map(id => +id);
    return idArray.map(id => this.getLibelleById(id, list)).join(', ');
  }

  // Expose local state to the parent
  getUpdatedData() {
      return {
        productFilter: this.productFilter
      };
  }
}
