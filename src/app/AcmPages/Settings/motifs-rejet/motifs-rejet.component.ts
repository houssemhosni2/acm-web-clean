import { Component, OnInit, TemplateRef } from '@angular/core';
import { SettingsService } from '../settings.service';
import { SettingMotifRejetsEntity } from '../../../shared/Entities/settingMotifRejets.entity';
import { AppComponent } from '../../../app.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { LoanDetailsServices } from '../../Loan-Application/loan-details/loan-details.services';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {customRequiredValidator,customPatternValidator} from '../../../shared/utils';

@Component({
  selector: 'app-motifs-rejet',
  templateUrl: './motifs-rejet.component.html',
  styleUrls: ['./motifs-rejet.component.sass']
})
export class MotifsRejetComponent implements OnInit {
  public settingMotifRejetsEntitys: SettingMotifRejetsEntity[] = [];
  public pageSize: number;
  public page: number;
  public groupForm: FormGroup;
  public updateSetting: SettingMotifRejetsEntity;
  public action: string;
  public categories: SettingMotifRejetsEntity[];
  public isReject: boolean;
  public externalIdsList: SettingMotifRejetsEntity[] = [];
  public settingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public  changeCodeForCategory = false;

  /**
   * constructor MotifsRejetComponent.
   * @param settingsService SettingsService
   * @param translate TranslateService
   * @param loanDetailsServices LoanDetailsServices
   * @param modal NgbModal
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   * @param library FaIconLibrary
   */
  constructor(public settingsService: SettingsService, public translate: TranslateService,
              public loanDetailsServices: LoanDetailsServices, public modal: NgbModal,
              public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices, public library: FaIconLibrary) {
  }

 async ngOnInit() {
    this.pageSize = 5;
    this.page = 1;
    await this.settingsService.findAllSettingMotifRejects().subscribe(
      (data) => {
        this.settingMotifRejetsEntitys = data;
        this.categories = this.settingMotifRejetsEntitys.filter
        ((item, i, arr) => arr.findIndex((t) => t.categorie === item.categorie) === i);
      }
    );
    this.isReject = false;
  }

  /**
   * change enable of setting motifs reject
   * @param settingMotifRejetsEntity SettingMotifRejetsEntity
   */
  endableDisable(settingMotifRejetsEntity: SettingMotifRejetsEntity) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_motifs_Reject').afterClosed().subscribe(res => {
      if (res) {
        this.settingsService.updateSettingMotifRejects(settingMotifRejetsEntity).subscribe();
      } else {
        settingMotifRejetsEntity.enabled = !settingMotifRejetsEntity.enabled;
      }
    });
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Open Modal
   * @param modalContent Modal
   */
  updateMotif(modalContent, settingMotifRejetsEntity: SettingMotifRejetsEntity) {
    this.action = 'update';
    this.updateSetting = settingMotifRejetsEntity;

    if ((this.updateSetting.categorie === AcmConstants.REJECT_CATEGORIE) ||
      (this.updateSetting.categorie === AcmConstants.CANCEL_CATEGORIE) ||
      (this.updateSetting.categorie === AcmConstants.DECLINE_CATEGORIE)) {
      if (this.externalIdsList.length === 0) {
        this.settingsService.getAllMotifRejectsIdsABACUS().subscribe(
          (data) => {
            this.externalIdsList = data;
          }
        );
      }
      this.isReject = true;
    } else {
      this.isReject = false;
    }
    this.createForm(settingMotifRejetsEntity);
    this.modal.open(modalContent);
  }

  createForm(settingMotifRejetsEntity: SettingMotifRejetsEntity) {
    let codeExternalId = null;
    if (settingMotifRejetsEntity.codeExternal !== 0) {
      codeExternalId = settingMotifRejetsEntity.codeExternal;
    }
    this.groupForm = this.formBuilder.group({
      category: [settingMotifRejetsEntity.categorie, [Validators.required]],
      code: [settingMotifRejetsEntity.code, customRequiredValidator],
      label: [settingMotifRejetsEntity.libelle, customRequiredValidator],
      idExterne: codeExternalId,
      description: settingMotifRejetsEntity.description,
    });
    if (this.isReject === true) {
      this.groupForm.controls.idExterne.setValidators([Validators.required]);
    } else if (this.isReject === false) {
      this.groupForm.controls.idExterne.clearValidators();
 }

  }
  /**
   *
   * @param event event
   */
  onChange(event) {
    if ((event.target.value === AcmConstants.REJECT_CATEGORIE) ||
    (event.target.value === AcmConstants.CANCEL_CATEGORIE) || (event.target.value === AcmConstants.DECLINE_CATEGORIE)) {
      this.settingsService.getAllMotifRejectsIdsABACUS().subscribe(
        (data) => {
          this.externalIdsList = data;
        }
      );
      this.groupForm.controls.idExterne.setValidators([Validators.required]);
      this.isReject = true;
    } else {
      this.groupForm.controls.idExterne.clearValidators();
      this.isReject = false;
    }

    if ((event.target.value === AcmConstants.REJECT_CATEGORIE) ||
    (event.target.value === AcmConstants.CANCEL_CATEGORIE) ||
     (event.target.value === AcmConstants.DECLINE_CATEGORIE) ||
     (event.target.value === AcmConstants.RECOMMEND_CATEGORIE)
    || (event.target.value === AcmConstants.REVIEW_CATEGORIE) ||
    (event.target.value === AcmConstants.SUBJECT_IB) ||
     (event.target.value === AcmConstants.REVIEW_AGREEMENTS_CATEGORIE)
     || (event.target.value === AcmConstants.REJECT_EXPENSES) ) {
        this.changeCodeForCategory = true;
        this.genreretCodeForCategory();
    } else {
      this.changeCodeForCategory = false;
    }
  }
  /**
   * update setting motif de rejet
   */
  save() {
    this.action = 'update';
    this.updateSetting.categorie = this.groupForm.controls.category.value;
    this.updateSetting.code = this.groupForm.controls.code.value;
    this.updateSetting.libelle = this.groupForm.controls.label.value;
    this.updateSetting.description = this.groupForm.controls.description.value;
    if (this.isReject === true) {
      this.updateSetting.codeExternal = this.groupForm.controls.idExterne.value;
    }
    this.settingsService.updateSettingMotifRejects(this.updateSetting).subscribe();
    this.modal.dismissAll();
  }

  addMotif(modalContent: TemplateRef<any>) {
    this.updateSetting = new SettingMotifRejetsEntity();
    this.action = 'create';
    this.createForm(new SettingMotifRejetsEntity());
    this.modal.open(modalContent);
  }

  create() {
    this.updateSetting.categorie = this.groupForm.controls.category.value;
    this.updateSetting.code = this.groupForm.controls.code.value;
    this.updateSetting.libelle = this.groupForm.controls.label.value;
    this.updateSetting.description = this.groupForm.controls.description.value;
    if (this.isReject === true) {
      this.updateSetting.codeExternal = this.groupForm.controls.idExterne.value;
    }
    this.settingsService.createSettingMotifRejects(this.updateSetting).subscribe(
      (data) => {
        this.settingMotifRejetsEntitys.push(data);
        this.modal.dismissAll();
      }
    );
  }

  onSubmit() {
    if (this.groupForm.valid) {
      if (this.action === 'update') {
        this.save();
      } else if (this.action === 'create') {
        this.create();
      }
    }
  }

  closeModale() {
    this.modal.dismissAll();
  }
  /**
   * if category is : (CANCEL , REJECT, DECLINE)
   * generate automatic code
   */
  genreretCodeForCategory() {
    let length = 0;
    this.settingMotifRejetsEntity.categorie = this.groupForm.controls.category.value;

    this.settingsService.findAllEnabledDisabledSettingMotifRejects(this.settingMotifRejetsEntity).toPromise().then(
      (data) => {
        length = data.length + 1;
        this.groupForm.controls.code.setValue(this.settingMotifRejetsEntity.categorie + '_' + AcmConstants.REASON + '_' + length);
      }
    );
  }
  /**
   * if category is : !(CANCEL , REJECT, DECLINE)
   * generate automatic code for inserted label
   */
  genreretCodeForLabel() {
    if (!this.changeCodeForCategory) {
    const code = this.groupForm.controls.label.value.replace(/ /g, '_').toUpperCase();
    this.groupForm.controls.code.setValue(code); }
  }
}
