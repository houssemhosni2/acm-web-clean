import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AssetEntity } from 'src/app/shared/Entities/Asset.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { SupplierService } from '../supplier.service';
import { AssetTypeListDTO } from 'src/app/shared/Entities/AssetTypeListDTO.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { customRequiredValidator } from 'src/app/shared/utils';
@Component({
  selector: 'app-update-asset',
  templateUrl: './update-asset.component.html',
  styleUrls: ['./update-asset.component.sass']
})
export class UpdateAssetComponent implements OnInit {
  public asset: AssetEntity;
  public legalCategorys = [
    { id: 1, label: 'Entreprise individuelle' },
    { id: 2, label: 'Société unipersonnelle à responsabilité limitée (SUARL)' },
    { id: 3, label: 'Société à responsabilité limitée (SARL)' },
    { id: 4, label: 'Société anonyme (SA)' },
    { id: 5, label: 'Société en commandite par actions (SCA)' }
  ];
  public periodicity = [
    { id: 1, label: 'Mensuelle' },
    { id: 2, label: 'Trimestrielle' },
    { id: 3, label: 'Semestrielle' },
    { id: 4, label: 'Annuelle' }
  ];
  public typePer = [
    { id: 1, label: 'Personne physique' },
    { id: 2, label: 'Personne morale' }
  ];
  @Input() expanded = true;
  @Input() mode;
  public assetForm: FormGroup;
  public typeList: AssetTypeListDTO[];
  public categoryList: AssetTypeListDTO[];
  public subCategoryList: AssetTypeListDTO[];

  public categoryListChange: AssetTypeListDTO[];
  public subCategoryListChange: AssetTypeListDTO[];
  valid: boolean = false;
  options: any = {
    Poids: ['Gramme', 'Kilo-gramme', 'Tonne', 'Quintar'],
    Volume: ['Litre', 'Melilitre', 'Mètre cube'],
    Unité: ['Article'],
    Superficie: ['Mètre carré'],
    Longueur: ['Mètre', 'Centimètre', 'Millimètre']
  };
  formGroup: FormGroup;
  mesureOptions : String[];

  constructor(public formBuilder: FormBuilder, public sharedService: SharedService,public devToolsServices: AcmDevToolsServices,
    public library: FaIconLibrary, public supplierService: SupplierService, public router: Router, public activatedRoute: ActivatedRoute) { }

  async ngOnInit() {

    await this.activatedRoute.queryParams.subscribe(params => {
      this.mode = params.mode;
    });

    this.asset = this.sharedService.getAsset();

    await this.supplierService.findAssetTypeList(AcmConstants.ASSET_TYPE).toPromise().then((data) => {
      this.typeList = data;
    })

    await this.supplierService.findAssetTypeList(AcmConstants.ASSET_CATEGORY).toPromise().then((data) => {
      this.categoryList = data;
      let type = this.typeList.filter(item => item.libelle === this.asset.typeAsset)[0]?.id; // get type
      this.categoryListChange = this.categoryList.filter(item => item.id_parent === type);
    })

    await this.supplierService.findAssetTypeList(AcmConstants.ASSET_SUB_CATEGORY).toPromise().then((data) => {
      this.subCategoryList = data;
      let category = this.categoryList.filter(item => item.libelle === this.asset.categoryAsset)[0]?.id; // get category
      this.subCategoryListChange = this.subCategoryList.filter(item => item.id_parent === category);
    })

    let typeAsset = this.typeList.filter(item => item.libelle === this.asset.typeAsset)[0];
    let categoryAsset = this.categoryListChange.filter(item => item.libelle === this.asset.categoryAsset)[0];
    let subCategoryAsset = this.subCategoryListChange.filter(item => item.libelle === this.asset.subCategoryAsset)[0];

    this.assetForm = this.formBuilder.group({});
    this.assetForm.addControl('codeArticle', new FormControl(this.asset.codeArticle, Validators.required))
    this.assetForm.addControl('libelle', new FormControl(this.asset.libelle, Validators.required))
    this.assetForm.addControl('description', new FormControl(this.asset.description, Validators.required))
    this.assetForm.addControl('prixUnitaire', new FormControl(this.asset.prixUnitaire, Validators.required))
    this.assetForm.addControl('remiseArticle', new FormControl(this.asset.remiseArticle, Validators.required))
    this.assetForm.addControl('reservedStock', new FormControl(this.asset.reservedStock, Validators.required))
    this.assetForm.addControl('tva', new FormControl(this.asset.tva))
    this.assetForm.addControl('promotion', new FormControl(this.asset.promotion))
    if (!this.asset.dateDebut) {
      this.assetForm.addControl('dateDebut', new FormControl(''))
    }else {
      this.assetForm.addControl('dateDebut', new FormControl(new Date(this.asset.dateDebut).toISOString().substring(0, 10)))
    }
    if (!this.asset.dateFin) {
      this.assetForm.addControl('dateFin', new FormControl(''))
    }else {
      this.assetForm.addControl('dateFin', new FormControl(new Date(this.asset.dateFin).toISOString().substring(0, 10)))
    }
    if (!this.asset.promotionStartDate) {
      this.assetForm.addControl('promotionStartDate', new FormControl(''))
    }else {
      this.assetForm.addControl('promotionStartDate', new FormControl(new Date(this.asset.promotionStartDate).toISOString().substring(0, 10)))
    }
    if (!this.asset.promotionEndDate) {
      this.assetForm.addControl('promotionEndDate', new FormControl(''))
    }else {
      this.assetForm.addControl('promotionEndDate', new FormControl(new Date(this.asset.promotionEndDate).toISOString().substring(0, 10)))
    }
    this.assetForm.addControl('typeAsset', new FormControl(typeAsset, Validators.required))
    this.assetForm.addControl('categoryAsset', new FormControl(categoryAsset, Validators.required))
    this.assetForm.addControl('subCategoryAsset', new FormControl(subCategoryAsset, Validators.required))
    this.assetForm.addControl('mesure', new FormControl(this.asset.mesure, customRequiredValidator))
    this.assetForm.addControl('unite', new FormControl(this.asset.unite, customRequiredValidator))

    this.valid = true
    this.formGroup = this.formBuilder.group({
      mesure: [this.asset.mesure],
      unite: [this.asset.unite]
    });
    this.mesureOptions = this.options[this.asset.mesure]
  }

  toggleCollapseAsset() {
    this.expanded = !this.expanded;
  }
  submit() {
    this.devToolsServices.makeFormAsTouched(this.assetForm);
    console.log(this.assetForm.controls);
     if (this.assetForm.valid) {
      this.asset.codeArticle = this.assetForm.controls.codeArticle.value;
      this.asset.dateDebut = this.assetForm.controls.dateDebut.value;
      this.asset.dateFin = this.assetForm.controls.dateFin.value;
      this.asset.libelle = this.assetForm.controls.libelle.value;
      this.asset.description = this.assetForm.controls.description.value;
      this.asset.prixUnitaire = parseFloat(this.assetForm.controls['prixUnitaire']?.value.replace(',', '.'));
      this.asset.remiseArticle = this.assetForm.controls.remiseArticle.value;
      this.asset.reservedStock = this.assetForm.controls.reservedStock.value;
      this.asset.tva = this.assetForm.controls.tva.value;
      this.asset.promotion = this.assetForm.controls.promotion.value;
      this.asset.promotionStartDate = this.assetForm.controls.promotionStartDate.value;
      this.asset.promotionEndDate = this.assetForm.controls.promotionEndDate.value;
      this.asset.typeAsset = this.assetForm.controls.typeAsset.value?.libelle;
      this.asset.categoryAsset = this.assetForm.controls.categoryAsset.value?.libelle;
      this.asset.subCategoryAsset = this.assetForm.controls.subCategoryAsset.value?.libelle;
      this.asset.mesure = this.assetForm.controls.mesure.value;
      this.asset.unite = this.assetForm.controls.unite.value;
      this.supplierService.updateAsset(this.asset).subscribe((data) => {
        this.router.navigate(['/acm/list-asset']);
      });
    } 
  }

  exit() {
    this.router.navigate(['acm/list-asset']);
  }

  typeAssetChanged() {
    if (this.assetForm.controls['typeAsset'].value !== '') {
      let type = this.assetForm.controls['typeAsset'].value?.id;
      this.categoryListChange = this.categoryList.filter(item => item.id_parent === type)
      this.assetForm.get('subCategoryAsset').setValue(null)
    }
  }

  categoryAssetChanged() {
    if (this.assetForm.controls['categoryAsset'].value !== '') {
      let category = this.assetForm.controls['categoryAsset'].value?.id;
      this.subCategoryListChange = this.subCategoryList.filter(item => item.id_parent === category)
    }
  }

  onMesureChange(event: any) {
    const selectedMesure = event.target.value;
    this.assetForm.get('unite').setValue(null); 
    if (selectedMesure !== '') {
       this.mesureOptions = this.options[selectedMesure];
    }
  }

  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9,]/g, '');
    this.assetForm.get('prixUnitaire')?.setValue(input.value);
  }

}
