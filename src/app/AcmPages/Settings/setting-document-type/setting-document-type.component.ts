import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { SettingDocumentTypeEntity } from '../../../shared/Entities/settingDocumentType.entity';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-setting-document-type',
  templateUrl: './setting-document-type.component.html',
  styleUrls: ['./setting-document-type.component.sass']
})
export class SettingDocumentTypeComponent implements OnInit {

  public settingDocumentTypes: SettingDocumentTypeEntity[];
  public popupForm: FormGroup;
  public documentTypeCategories: any[] = [];
  public updateId = 0;
  public countEnabledDocuments = 0;
  public loading = true;
  public selectedCategeory :string ;


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

  ngOnInit() {
    this.loading = true;
    this.createForm();
    this.settingsService.findAllDocumentTypes().subscribe((data) => {
      this.settingDocumentTypes = data;
      for (let i = 0; i < this.settingDocumentTypes.length; i++) {
        if (this.settingDocumentTypes[i].categorie === 3) {
          this.settingDocumentTypes.splice(i, 1);
          i--;
        }
      }
      this.loading = false;
    });
    this.settingsService.findAllDocumentTypesCategory().subscribe((data) => this.documentTypeCategories = data);

    this.countBackUpDocuments();
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
   * Methode when select add in popup
   */
  onSubmit() {
    if (this.updateId !== 0) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.update_document_type').afterClosed().subscribe(
        res => {
          if (res) {
            this.update().then(() => {
              this.reset();
            });
          } else {
            this.reset();
          }
        });
    } else {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.save_document_type').afterClosed().subscribe(
        res => {
          if (res) {
            this.create();
          } else {
            this.reset();
          }
        });
    }
  }

  /**
   * create new document type
   */
  create() {
    const settingDocumentType: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentType.code = this.popupForm.controls.code.value;
    settingDocumentType.libelle = this.popupForm.controls.libelle.value;
    settingDocumentType.description = this.popupForm.controls.description.value;
    settingDocumentType.uniqueness = this.popupForm.controls.uniqueness.value;
    settingDocumentType.dateDebut = this.popupForm.controls.date_debut.value;
    settingDocumentType.mandatory = this.popupForm.controls.mandatory.value;
    const found = this.documentTypeCategories.find(categorie => categorie.value === this.popupForm.controls.category.value);
    settingDocumentType.categorieLibelle = found.value;
    settingDocumentType.categorie = found.key;
    if (this.selectedCategeory == 'GENERIC_WOKFLOW' ) settingDocumentType.reportName = this.popupForm.controls.reportName.value;

    this.loading = true;
    this.settingsService.createDocumentTypes(settingDocumentType).subscribe((data) => {
      this.devToolsServices.openToast(0, 'alert.success');
      this.settingDocumentTypes.push(data);
      this.loading = false;
    });
  }

  /**
   * update document type
   */
  async update() {
    await this.settingDocumentTypes.map(documentType => {
      if (documentType.id === this.updateId) {
        documentType.code = this.popupForm.controls.code.value;
        documentType.libelle = this.popupForm.controls.libelle.value;
        documentType.description = this.popupForm.controls.description.value;
        documentType.uniqueness = this.popupForm.controls.uniqueness.value;
        documentType.dateDebut = this.popupForm.controls.date_debut.value;
        documentType.mandatory = this.popupForm.controls.mandatory.value;
        const found = this.documentTypeCategories.find(categorie => categorie.value === this.popupForm.controls.category.value);
        documentType.categorieLibelle = found.value;
        documentType.categorie = found.key;
        this.loading = true;
        this.settingsService.updateDocumentTypes(documentType).subscribe(() => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.loading = false;
        });
      }
    });
  }

  /**
   * methode to generate document type code
   */
  changeCode() {
    if (this.updateId === 0) {
      if (this.settingDocumentTypes.some(settingDocumentType => settingDocumentType.libelle.toUpperCase()
        === this.popupForm.controls.libelle.value.toUpperCase())) {
        this.popupForm.controls.libelle.setErrors({ incorrect: true });
      } else {
        const newCode = this.popupForm.controls.libelle.value.replace(/ /g, '_').toUpperCase();
        if (this.settingDocumentTypes.some(settingDocumentType => settingDocumentType.code === newCode)) {
          this.popupForm.controls.code.setErrors({ incorrect: true });
        } else {
          this.popupForm.controls.code.setValue(newCode);
        }
      }
    }
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
   * disable document type
   * @param SettingDocumentTypeEntity documentType
   */
  diableDocumentType(documentType) {
    this.settingDocumentTypes.map((settingDocumentType) => {
      if (settingDocumentType === documentType) {
        this.loading = true;
        this.settingsService.disableDocumentTypes(settingDocumentType).subscribe(() => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.loading = false;
        });
      }
    });
  }

  /**
   * enable document type
   * @param SettingDocumentTypeEntity documentType
   */
  enableDocumentType(documentType) {
    this.settingDocumentTypes.map((settingDocumentType) => {
      this.loading = true;
      if (settingDocumentType === documentType) {
        this.settingsService.enableDocumentTypes(settingDocumentType).subscribe(() => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.loading = false;
        });
      }
    });
  }

  /**
   * onChange button status
   * @param SettingDocumentTypeEntity documentType
   */
  toggleStatus(documentType) {
    if (documentType.enabled === false) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_document_type').afterClosed().subscribe(res => {
        if (res) {
          this.diableDocumentType(documentType);
        } else {
          documentType.enabled = true;
        }
      });
    } else {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.enable_document_type').afterClosed().subscribe(res => {
        if (res) {
          this.enableDocumentType(documentType);
        } else {
          documentType.enabled = false;
        }
      });
    }
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
}
