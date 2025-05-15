import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AssetEntity } from 'src/app/shared/Entities/Asset.entity';
import { AssetLoanEntity } from 'src/app/shared/Entities/AssetLoan.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { SupplierService } from '../supplier.service';
import { AssetTypeListDTO } from 'src/app/shared/Entities/AssetTypeListDTO.entity';
import { customRequiredValidator, customPatternValidator, isTodayBetweenDates } from '../../../shared/utils';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@ngneat/transloco';
@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.sass']
})
export class AddAssetComponent implements OnInit {
  @Input() expandedSupplier = true;
  @Input() expandedAsset = true;
  public supplier: SupplierEntity;
  public assetForms: FormGroup[] = [];
  public assetList: AssetEntity[] = [];
  public supplierSelected = new Subject<boolean>();
  public source: string;
  public firstSource : string;
  private productId: number;
  public typeList: AssetTypeListDTO[];
  public categoryList: AssetTypeListDTO[];
  public subCategoryList: AssetTypeListDTO[];

  public categoryListChange: AssetTypeListDTO[][] = [];
  public subCategoryListChange: AssetTypeListDTO[][] = [];
  options: any = {
    Poids: ['Gramme', 'Kilo-gramme', 'Tonne', 'Quintar'],
    Volume: ['Litre', 'Melilitre', 'Mètre cube'],
    Unité: ['Article'],
    Superficie: ['Mètre carré'],
    Longueur: ['Mètre', 'Centimètre', 'Millimètre']
  };
  formGroup: FormGroup;
  mesureOptions : String[];



  constructor(public devToolsServices: AcmDevToolsServices, public modalService: NgbModal, public formBuilder: FormBuilder,
    public sharedService: SharedService, public translate: TranslateService, public library: FaIconLibrary,
    public activatedRoute: ActivatedRoute, public router: Router, public supplierService: SupplierService,
    private http: HttpClient, private translocoService: TranslocoService, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    // this.assetForms[0] = this.formBuilder.group({});
    await this.activatedRoute.queryParams.subscribe(params => {
      this.supplier = null;
      this.source = params.source;
      this.productId = params.productId;
      this.firstSource = params.firstSource;
       
      const supplier = this.sharedService.getSupplier();
      if (supplier !== null && Object.keys(supplier).length !== 0) {
        this.supplier = supplier;
      }

      if (!this.source) {
        if (this.source !== 'MOD_LOAN') {
          this.sharedService.setSupplier(null);
          this.supplier = null;
        }
      } 
      if (this.firstSource) {
        if ( this.firstSource === 'ADD_Supplier') {
          this.sharedService.setSupplier(null);
          this.supplier = null;
        }
       
      }
    });
    if (this.supplier !== undefined && this.supplier !== null) {
      this.supplierSelected.next(true);
    }

    this.supplierService.findAssetTypeList(AcmConstants.ASSET_TYPE).subscribe((data) => {
      this.typeList = data;
    })

    this.supplierService.findAssetTypeList(AcmConstants.ASSET_CATEGORY).subscribe((data) => {
      this.categoryList = data;
    })

    this.supplierService.findAssetTypeList(AcmConstants.ASSET_SUB_CATEGORY).subscribe((data) => {
      this.subCategoryList = data;
    })
    this.formGroup = this.formBuilder.group({
      mesure: [''],
      unite: ['']
    });
  }
  openSupplierList(content) {
    this.modalService.open(content, {
      size: 'xl'
    });
  }
  selectSupplier(event) {
    this.supplier = event;
    this.supplierSelected.next(true);
    this.modalService.dismissAll();
  }
  addSupplier() {
    if (this.source === 'ADD_LOAN') { 
      this.router.navigate(['/acm/supplier-add'], { queryParams: { source: 'ADD_ASSET', firstSource: this.source } });
    }else if (this.source === 'MOD_Topup'){
      this.router.navigate(['/acm/supplier-add'], { queryParams: { source: 'ADD_ASSET', firstSource: this.source } });
    }else if (this.source === 'MOD_LOAN'){
      this.router.navigate(['/acm/supplier-add'], { queryParams: { source: 'ADD_ASSET', firstSource: this.source } });
    }
    else {
      this.router.navigate(['/acm/supplier-add'], { queryParams: { source: 'ADD_ASSET' } });
    }
  }
  onSubmit() {
    
    let loanAssets: AssetLoanEntity;
    let loanEntity = new LoanEntity();
    let loanAssetsDtos: AssetLoanEntity[] = [];
    // this.devToolsServices.makeFormAsTouched(this.assetForm);
    // if (this.assetForm.valid) {
    let validAssets = true;
    for (let i = 0; i < this.assetList.length; i++) {
      this.devToolsServices.makeFormAsTouched(this.assetForms[i]);
      if (this.assetForms[i].valid) {
        const asset = new AssetEntity();
        asset.codeArticle = this.assetForms[i].controls['codeArticle'].value;
        asset.dateDebut = this.assetForms[i].controls['dateDebut'].value;
        asset.dateFin = this.assetForms[i].controls['dateFin'].value;
        asset.libelle = this.assetForms[i].controls['libelle'].value;
        asset.description = this.assetForms[i].controls['description'].value;
        asset.prixUnitaire = parseFloat(this.assetForms[i].controls['prixUnitaire']?.value.replace(',', '.'));
        asset.remiseArticle = this.assetForms[i].controls['remiseArticle'].value;
        asset.reservedStock = this.assetForms[i].controls['reservedStock'].value;
        asset.tva = parseInt(this.assetForms[i].controls['tva'].value);
        asset.promotion = this.assetForms[i].controls['promotion'].value;
        asset.promotionStartDate = this.assetForms[i].controls['promotionStartDate'].value;
        asset.promotionEndDate = this.assetForms[i].controls['promotionEndDate'].value;
        asset.typeAsset = this.assetForms[i].controls['typeAsset'].value?.libelle;
        asset.categoryAsset = this.assetForms[i].controls['categoryAsset'].value?.libelle;
        asset.subCategoryAsset = this.assetForms[i].controls['subCategoryAsset'].value?.libelle;
        asset.mesure = this.assetForms[i].controls['mesure'].value;
        asset.unite = this.assetForms[i].controls['unite'].value;
        asset.supplier = new SupplierEntity();
        asset.supplier.id = this.supplier.id;
        asset.supplierName = this.supplier.name;
        this.assetList[i] = asset;
      }
      else {
        validAssets = false
      }
    }
    if (validAssets) {    
      this.supplierService.createAssets(this.assetList).subscribe((data) => {
        if (this.source === 'ADD_LOAN' || this.source === 'MOD_LOAN'  || this.source === 'MOD_Topup' ) {
          loanEntity = this.sharedService.getLoan();
       
          data.forEach((asset) => {
            loanAssets = new AssetLoanEntity();
            loanAssets.asset = asset
            loanAssets.prixUnitaire = asset.prixUnitaire;
            loanAssets.quantiteArticle = 1;
            loanAssets.withholdingTax = this.supplier.withholdingTax == null || this.supplier.withholdingTax == undefined ? 0 : this.supplier.withholdingTax;
            loanAssets.enabled=true;
            if (isTodayBetweenDates(asset.promotionStartDate, asset.promotionEndDate)) {
              loanAssets.remiseArticle = asset.remiseArticle + asset.promotion;
            } else {
              loanAssets.remiseArticle = asset.remiseArticle;
            }
            loanAssets.idLoan = this.sharedService.getLoan()?.loanId;
 
            loanAssetsDtos.push(loanAssets)
          })  
          if (!Array.isArray(loanEntity.loanAssetsDtos)) {
            loanEntity.loanAssetsDtos = [];
          }     
          loanEntity.loanAssetsDtos.push(...loanAssetsDtos);
          this.sharedService.setLoan(loanEntity);
          const supplier = new SupplierEntity();
          supplier.assets = data;
          this.sharedService.setSupplier(supplier);
           if (this.source === 'MOD_LOAN' ) {
                  this.sharedService.setSupplier(null);
            this.router.navigate([AcmConstants.ROUTE_COMPLETE_LOAN_DETAILS]);
          }
          else if ( this.source === 'MOD_Topup') {
            this.sharedService.setSupplier(null);
            this.router.navigate(["acm/topup-refinance-loan"]);
          } 
          else {
            this.router.navigate([AcmConstants.LOAN_MANAGEMENT_ADD_URL], { queryParams: { source: 'ADD_ASSET', productId: this.productId } });
          } 
        } else {
          this.router.navigate(['/acm/list-asset']);
          this.devToolsServices.openToast(0, 'alert.success');
        }
      });
    }
  }


  externalSubmit() {
    this.validateForm();
    this.onSubmit();
  }

  validateForm() {
    this.assetForms.forEach(formGroup => {
      Object.values(formGroup.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    });
  }

  addAsset() {
    this.assetForms[this.assetList.length] = this.formBuilder.group({});
    this.assetForms[this.assetList.length].addControl('codeArticle', new FormControl('', customRequiredValidator))
    this.assetForms[this.assetList.length].addControl('dateDebut', new FormControl(''))
    this.assetForms[this.assetList.length].addControl('dateFin', new FormControl(''))
    this.assetForms[this.assetList.length].addControl('libelle', new FormControl('', customRequiredValidator))
    this.assetForms[this.assetList.length].addControl('description', new FormControl('', customRequiredValidator))
    this.assetForms[this.assetList.length].addControl('prixUnitaire', new FormControl('', customRequiredValidator))
    this.assetForms[this.assetList.length].addControl('remiseArticle', new FormControl('', customRequiredValidator))
    this.assetForms[this.assetList.length].addControl('reservedStock', new FormControl('', customRequiredValidator))
    this.assetForms[this.assetList.length].addControl('tva', new FormControl(''))
    this.assetForms[this.assetList.length].addControl('promotion', new FormControl('', customPatternValidator(new RegExp("^(?:[1-9][0-9]?|100)$"))))
    this.assetForms[this.assetList.length].addControl('promotionStartDate', new FormControl(''))
    this.assetForms[this.assetList.length].addControl('promotionEndDate', new FormControl(''))
    this.assetForms[this.assetList.length].addControl('typeAsset', new FormControl('', customRequiredValidator))
    this.assetForms[this.assetList.length].addControl('categoryAsset', new FormControl('', customRequiredValidator))
    this.assetForms[this.assetList.length].addControl('subCategoryAsset', new FormControl('', customRequiredValidator))
    this.assetForms[this.assetList.length].addControl('mesure', new FormControl('', customRequiredValidator))
    this.assetForms[this.assetList.length].addControl('unite', new FormControl('', customRequiredValidator))
    this.assetList.push(new AssetEntity());
  }
  toggleCollapseSupplier() {
    this.expandedSupplier = !this.expandedSupplier;
  }
  toggleCollapseAsset() {
    this.expandedAsset = !this.expandedAsset;
  }
  dateChanged(i: number) {
    if ((this.assetForms[i].controls['dateDebut'].value !== '') &&
      (this.assetForms[i].controls['dateFin'].value !== '') &&
      (this.assetForms[i].controls['dateDebut'].value > this.assetForms[i].controls['dateFin'].value)) {
      this.devToolsServices.openToast(3, 'alert.error_date');
    }
    if ((this.assetForms[i].controls['promotionStartDate'].value !== '') &&
      (this.assetForms[i].controls['promotionEndDate'].value !== '') &&
      (this.assetForms[i].controls['promotionStartDate'].value > this.assetForms[i].controls['promotionEndDate'].value)) {
      this.devToolsServices.openToast(3, 'alert.error_date');
    }
  }     

  exit() {
    if (this.source === 'ADD_LOAN') {
      const supplier = new SupplierEntity();
      supplier.assets = this.assetList;
      this.sharedService.setSupplier(supplier);
      this.router.navigate([AcmConstants.LOAN_MANAGEMENT_ADD_URL], { queryParams: { source: 'ADD_ASSET', productId: this.productId } });
    }else if (this.source === 'MOD_Topup' ) {
      this.sharedService.setSupplier(null);
      this.router.navigate(["acm/topup-refinance-loan"]);
  } else if (this.source === 'MOD_LOAN') {
        this.sharedService.setSupplier(null);
        this.router.navigate([AcmConstants.ROUTE_COMPLETE_LOAN_DETAILS]);
    } else {
      this.router.navigate([AcmConstants.DASHBOARD_URL]);
    }
  }

  typeAssetChanged(i: number) {
    if (this.assetForms[i].controls['typeAsset'].value !== '') {
      let type = this.assetForms[i].controls['typeAsset'].value?.id;
      this.categoryListChange[i] = this.categoryList.filter(item => item.id_parent === type)
      this.assetForms[i].controls['subCategoryAsset'].setValue('');
      this.assetForms[i].controls['categoryAsset'].setValue('');
      this.subCategoryListChange[i] = [];
    }
  }

  categoryAssetChanged(i: number) {
    if (this.assetForms[i].controls['categoryAsset'].value !== '') {
      let category = this.assetForms[i].controls['categoryAsset'].value?.id;
      this.subCategoryListChange[i] = this.subCategoryList.filter(item => item.id_parent === category)
    }else {
      this.assetForms[i].controls['subCategoryAsset'].setValue('');
      this.subCategoryListChange[i] = [];
    }
  }

  onMesureChange(event: any,i: number) {
    const selectedMesure = event.target.value;
    this.assetForms[i].get('unite').setValue(null); 

    if (selectedMesure) {
       this.mesureOptions = this.options[selectedMesure];
    }
  }

  validateInput(event: Event,index: number): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9,]/g, '');
    this.assetForms[index].get('prixUnitaire')?.setValue(input.value);
  }

}
