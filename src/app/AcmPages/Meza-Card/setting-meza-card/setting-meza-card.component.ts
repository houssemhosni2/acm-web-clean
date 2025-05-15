import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingMezaCardService } from './setting-meza-card.service';
import { SettingMezaCardActivateComponent } from '../setting-meza-card-activate/setting-meza-card-activate.component';
import { BrancheEntity } from 'src/app/shared/Entities/branche.entity';
import { SettingsService } from '../../Settings/settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

@Component({
  selector: 'app-setting-meza-card',
  templateUrl: './setting-meza-card.component.html',
  styleUrls: ['./setting-meza-card.component.sass']
})
export class SettingMezaCardComponent implements OnInit {
  public file: any[];
  public branchEntitys: BrancheEntity[];
  public selectedBranch = new BrancheEntity();
  public enabled: boolean;
  public enableBranch: boolean;
  public formSendAll: FormGroup;
  public uploadedFiles: any[];
  public checkFileUploaded = false;
  @ViewChild(SettingMezaCardActivateComponent, { static: true }) childComp: SettingMezaCardActivateComponent;

  /**
   *
   * @param settingMezaCardService SettingMezaCardService
   * @param acmDevToolsServices AcmDevToolsServices
   * @param settingsService SettingsService
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public settingMezaCardService: SettingMezaCardService, public acmDevToolsServices: AcmDevToolsServices,
              public settingsService: SettingsService, public formBuilder: FormBuilder,
              public devToolsServices: AcmDevToolsServices) { }

  ngOnInit() {
    this.enabled = false;
    this.createForm();
    this.settingsService.findBranche().subscribe(
      (data) => {
        this.branchEntitys = data;
      });
  }

  /**
   * methode to get selected file to upload
   * @param Any event
   */
  onUpload(event) {
    this.uploadedFiles = [];
    this.file = event.files;
    this.uploadedFiles.push(event.files[0]);
    this.checkFileUploaded = true;
  }

  /**
   * enable product
   */
  EnableProduct() {
    if (this.enabled) {
      this.formSendAll.controls.branch.setValidators([Validators.required]);
    } else {
      this.formSendAll.controls.branch.clearValidators();
    }
    this.formSendAll.controls.branch.reset();
  }
  /**
   * form send all cards
   */
  createForm() {
    this.formSendAll = this.formBuilder.group({
      branch: ['', Validators.required]
    });
  }
  /**
   * send all cards
   */
  onSubmit(uploadFile) {
    // check if file choosed
    if (!this.checkFileUploaded) {
      this.devToolsServices.openToast(3, 'alert.upload_meza_file');
      this.formSendAll.controls.branch.clearValidators();
      return;
    } else {
      // check if send all card is activated, status : SENT
      if (this.enabled) {
        this.acmDevToolsServices.makeFormAsTouched(this.formSendAll);
        if (this.formSendAll.valid && this.formSendAll.controls.branch.value !== null) {
          this.selectedBranch = this.formSendAll.controls.branch.value;
          this.settingMezaCardService.uploadFile(this.uploadedFiles, this.selectedBranch, this.enabled).subscribe(
            () => {
              this.childComp.ngOnInit();
              this.checkFileUploaded = false;
              this.createForm();
              this.enabled = false;
              uploadFile.clear();
              this.devToolsServices.openToast(0, 'alert.success');
            }
          );
        } else {
          this.devToolsServices.openToast(3, 'alert.select_branch');
          return;
        }
        // upload file with status : UPLOADED
      } else {
        this.formSendAll.controls.branch.clearValidators();
        this.formSendAll.controls.branch.reset();
        this.settingMezaCardService.uploadFile(this.uploadedFiles, new BrancheEntity(), false).subscribe(
          () => {
            this.childComp.ngOnInit();
            this.checkFileUploaded = false;
            uploadFile.clear();
            this.devToolsServices.openToast(0, 'alert.success');
          }
        );
      }}
    }
}
