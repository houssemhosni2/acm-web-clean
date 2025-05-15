import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SettingsService } from '../settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { AppComponent } from 'src/app/app.component';
import { SettingDocumentTypeProductEntity } from 'src/app/shared/Entities/settingDocumentTypeProduct.entity';

@Component({
  selector: 'app-setting-document-product-creation',
  templateUrl: './setting-document-product-creation.component.html',
  styleUrls: ['./setting-document-product-creation.component.sass']
})
export class SettingDocumentProductCreationComponent implements OnInit, OnChanges {

  public settingDocumentCreation: any[] = [];
  public popupForm: FormGroup;
  public documentTypeCategories: any[] = [];
  public updateId = 0;
  public countEnabledDocuments = 0;
  public loading = true;
  public selectedCategeory: string;
  public reportNameForm: FormGroup;


  /**
   * constructor
   * @param settingsService SettingsService
   * @param modalService NgbModal
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   * @param devToolsServices AcmDevToolsServices
   * @param library FaIconLibrary
   */
  constructor(public settingsService: SettingsService,
    public modalService: NgbModal,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    public devToolsServices: AcmDevToolsServices,
    public library: FaIconLibrary) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.createForm();
    this.createReportNameFrom();
    this.settingsService.findAllDocumentTypes().subscribe((data) => {
      const settingDocumentProduct : SettingDocumentTypeEntity[] = data;
      for (let i = 0; i < settingDocumentProduct.length; i++) {
        // this.settingDocumentCreation[i].enabled = false;
        this.settingDocumentCreation.push({
          settingDocumentTypeDTO: settingDocumentProduct[i],
          productId: null,
          mandatory: false,
          enabled: false
        });
        this.reportNameForm.addControl('reportName' + i, new FormControl(settingDocumentProduct[i].reportName));
        this.reportNameForm.addControl('updated' + i, new FormControl(false));
        if (settingDocumentProduct[i].categorie === 3) {
          this.settingDocumentCreation.splice(i, 1);
          i--;
        }
      }
      this.loading = false;
    });
    this.settingsService.findAllDocumentTypesCategory().subscribe((data) => this.documentTypeCategories = data);

    this.countBackUpDocuments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loading = true;
    this.createForm();
    this.settingsService.findAllDocumentTypes().subscribe((data) => {
      const settingDocumentProdct = data;
      for (let i = 0; i < this.settingDocumentCreation.length; i++) {
        if (settingDocumentProdct[i].categorie === 3) {
          this.settingDocumentCreation.splice(i, 1);
          i--;
        }
      }
      this.loading = false;
    });
    this.settingsService.findAllDocumentTypesCategory().subscribe((data) => this.documentTypeCategories = data);

    this.countBackUpDocuments();
  }

  createReportNameFrom() {
    this.reportNameForm = this.formBuilder.group({});
  }

  /**
     * Methode to create form popup
     */
    createForm() {
      this.popupForm = this.formBuilder.group({
        code: ['', Validators.required],
        libelle: ['', Validators.required],
        description: [''],
        category: ['', Validators.required],
        uniqueness: [false],
        mandatory: [false],
        date_debut: [''],
        reportName: [''],
      });
    }
  
    /**
     * methode to open the popup add new document type
     * param content
     */
    openLarge(content) {
      this.createForm();
      this.modalService.open(content, {
        size: 'md'
      });
    }
    
      

  
    /**
     * get all values before update document type
     * @param any content
     * @param any documentType
     */
    editDocumentType(content, documentType) {
      this.createForm();
      const settingDocumentType: SettingDocumentTypeEntity = documentType;
      this.updateId = documentType.id;
      this.popupForm.controls.code.setValue(settingDocumentType.code);
      this.popupForm.controls.libelle.setValue(settingDocumentType.libelle);
      this.popupForm.controls.description.setValue(settingDocumentType.description);
      this.popupForm.controls.uniqueness.setValue(settingDocumentType.uniqueness);
      this.popupForm.controls.mandatory.setValue(settingDocumentType.mandatory);
      let dateDebut = new Date(settingDocumentType.dateDebut);
      let formattedDate = dateDebut.toISOString().split('T')[0];
      this.popupForm.controls.date_debut.setValue(formattedDate);
      // this.popupForm.controls.date_debut.setValue(settingDocumentType.dateDebut.toString().substring(0, 10));
      this.popupForm.controls.category.setValue(settingDocumentType.categorieLibelle);
      this.modalService.open(content, {
        size: 'md'
      });
    }
  
    getSelectedCategory(){
      this.selectedCategeory =  this.popupForm.controls.category.value ;
  
    }
  
    /**
     * Get Direction
     */
    getDirection() {
      return AppComponent.direction;
    }
  
    /**
     * reset popup
     */
    reset() {
      this.createForm();
      this.updateId = 0;
      this.modalService.dismissAll();
    }
  
    /**
     * count BackUp Documents
     */
    countBackUpDocuments() {
      this.settingsService.countBackUpDocuments().subscribe((data) => { this.countEnabledDocuments = data; });
    }
  
    /**
     * syncronize documents with Ged
     */
    synchronize() {
      this.settingsService.synchroniseDocuments().subscribe((data) => {
        this.devToolsServices.openToastWithParameter(3, 'alert.document_ged_synchronized', '[ ' + data + ' ]');
        // reset count number
        this.countBackUpDocuments();
      });
    }
    
    changeReportName(i: number) {
      this.reportNameForm.controls['updated' + i].setValue(true);
    }

    // Expose local state to the parent
    getUpdatedData() {
      return {
        settingDocumentProductDTO: this.settingDocumentCreation
      };
    }

}
