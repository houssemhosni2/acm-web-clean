import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmEnvironnementEntity } from 'src/app/shared/Entities/acmEnvironnement.entity';
import { DocumentTypeEntity } from 'src/app/shared/Entities/documentType.entity';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { SettingsService } from '../settings.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-setting-aml',
  templateUrl: './setting-aml.component.html',
  styleUrls: ['./setting-aml.component.sass']
})
export class SettingAmlComponent implements OnInit {
  public updateSetting: AcmEnvironnementEntity;
  public settingAMLlist: AcmEnvironnementEntity[] = [];
  public groupForm: FormGroup;
  public fileForm: FormGroup;
  uploadedFile: any = AcmConstants.UPLOAD;
  @Input() navigationMode: string;
  settingDocTypes: SettingDocumentTypeEntity[] = [];
  acmDocuments: DocumentTypeEntity[] = [];
  allDocuments = [];
  constructor(public sharedFunction: AcmDevToolsServices, public datePipe: DatePipe,
              public devToolsServices: AcmDevToolsServices, public sharedService: SharedService,
              public translate: TranslateService, public settingsService: SettingsService, public formBuilder: FormBuilder,
              public library : FaIconLibrary, public modal: NgbModal) { }

  ngOnInit() {
    this.settingsService.findSettingIScore().subscribe((data) => {
      this.settingAMLlist = data;
    });
    this.createFileForm();
  }
  createFileForm() {
    this.fileForm = this.formBuilder.group({
      file: ['', Validators.required]
    });
  }
  updateSettingAML(modalContent: TemplateRef<any>, acmEnvironnementEntity: AcmEnvironnementEntity) {
    this.updateSetting = new AcmEnvironnementEntity();
    this.updateSetting = acmEnvironnementEntity;
    this.createForm(acmEnvironnementEntity);
    this.modal.open(modalContent);
  }

  createForm(acmEnvironnementEntity: AcmEnvironnementEntity) {

    this.groupForm = this.formBuilder.group({
      key: [acmEnvironnementEntity.key],
      value: [acmEnvironnementEntity.value],
    });
  }

  onSubmit() {
      this.updateSetting.key = this.groupForm.controls.key.value;
      this.updateSetting.value = this.groupForm.controls.value.value;
      this.settingsService.updateAcmEnvironment(this.updateSetting).subscribe();
      this.modal.dismissAll();
  }
  onUpload(event) {
    if (event.files.length > 0) {
      for (const file of event.files) {
        this.uploadedFile = '';
        if (this.sharedService.geTypeMimesOnlyCSV().includes(file.type)) {
          if (file.size <= this.sharedService.getMaxSizeFileUpload()) {
            this.uploadedFile = file;
            this.allDocuments.push(this.uploadedFile);
          } else {
            this.devToolsServices.openToastForMaxSizeImg(3, 'alert.file_size', this.sharedService.getMaxSizeFileUpload());
          }
        } else {
          this.devToolsServices.openToast(3, 'alert.file_type');
        }
      }
    }
  }

  /**
   * set value null to file variable when remove file from list
   */
  onRemove() {
    this.uploadedFile = '';
   }

  /**
   * Display the confirmation message
   */ 
  onsave() {
    if (this.allDocuments === undefined || this.allDocuments.length === 0 || this.uploadedFile === "") {
      this.sharedFunction.openToast(3, 'alert.no_document_to_save');
    } else {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.upload').afterClosed().subscribe(res => {
        if (res) {
          const arrayFile: any[] = [];
          arrayFile.push(this.uploadedFile);
          this.settingsService.loadAmlData(arrayFile).subscribe(
            () => this.devToolsServices.openToast(0, 'alert.success')
          );
        }
      });
    }
  }

  /**
   * close Modale
   */
  closeModale() {
    this.modal.dismissAll();
  }

}
