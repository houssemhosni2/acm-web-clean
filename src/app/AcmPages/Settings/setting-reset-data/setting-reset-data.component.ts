import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SettingsService } from '../settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxLoadingComponent , ngxLoadingAnimationTypes} from 'ngx-loading';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { HttpErrorResponse } from '@angular/common/http';
const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-setting-reset-data',
  templateUrl: './setting-reset-data.component.html',
  styleUrls: ['./setting-reset-data.component.sass']
})
export class SettingResetDataComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public category: number;
  public response: string;
  public modalForm: FormGroup;
  public checkConfirm1: boolean;
  public checkConfirm2: boolean;
  public loadingReset = false;

  /**
   * constructor SettingResetDataComponent.
   * @param settingsService SettingsService
   * @param translate TranslateService
   * @param modal NgbModal
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param library FaIconLibrary
   */
  constructor(public settingsService: SettingsService, public translate: TranslateService,
              public modal: NgbModal, public devToolsServices: AcmDevToolsServices, public formBuilder: FormBuilder,
               public library: FaIconLibrary) {
  }

  ngOnInit() {

  }

  async onSubmit() {
    if ((this.modalForm.valid) && (this.checkConfirm1) && (this.checkConfirm2)) {
      if (this.category === 1) {
        // 1 : Reset UDF
        this.loadingReset = true;
        await this.settingsService.resetSettingUDF().toPromise().then(data => {
          this.response = data;
          this.loadingReset = false;
          this.devToolsServices.openToast(0, 'alert.success');
          this.modal.dismissAll();
        });
      } else if (this.category === 2) {
        // 2 : Reset List values
        this.loadingReset = true;
        await this.settingsService.resetSettingListValues().toPromise().then(data => {
          this.response = data;
          this.loadingReset = false;
          this.devToolsServices.openToast(0, 'alert.success');
          this.modal.dismissAll();
        });
      } else if (this.category === 3) {
        // 3 : Reset Address
        this.loadingReset = true;
        await this.settingsService.resetSettingAddress().toPromise().then(data => {
          this.response = data;
          this.loadingReset = false;
          this.devToolsServices.openToast(0, 'alert.success');
          this.modal.dismissAll();
        });
      } else if (this.category === 4) {
        // 4 : Reload Product
        this.loadingReset = true;
        await this.settingsService.reloadSettingProduct().toPromise().then(data => {
          this.response = data;
          this.loadingReset = false;
          data.includes('DONE') ? this.devToolsServices.openToast(0, data) : this.devToolsServices.openToast(3, data);
          this.modal.dismissAll();
        },
          (err: HttpErrorResponse) => {
            if (err.status === 400) {
              this.loadingReset = false;
              this.modal.dismissAll();
            }
          });
      }
      else if (this.category === 5) {
        // 5 : Synchronize IB Product and UDF
        this.loadingReset = true;
        await this.settingsService.synchronizeIB().toPromise().then(data => {
          this.response = data;
          this.loadingReset = false;
          data.includes('DONE') ? this.devToolsServices.openToast(0, data) : this.devToolsServices.openToast(3, data);
          this.modal.dismissAll();
        },
          (err: HttpErrorResponse) => {
            if (err.status === 400) {
              this.loadingReset = false;
              this.devToolsServices.openToast(3, "An error occurred in IB")
              this.modal.dismissAll();
            }
          });
      }
    }
  }

  /**
   * Open Modal
   * @param modalContent Modal
   * @param type  type => 1 : UDF / 2 : List values / 3 : Address / 4 : product
   */
  openModal(modalContent, type: number) {
    this.category = type;
    this.modal.open(modalContent);
    this.createForm();
    this.checkConfirm2 = false;
    this.checkConfirm1 = false;
  }

  createForm() {
    this.modalForm = this.formBuilder.group({
      confirm1: ['', Validators.required],
      confirm2: ['', Validators.required]
    });
  }

  /**
   * Close Modale
   */
  closeModale() {
    this.modal.dismissAll();
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  changeCheckboxConfirm1() {
    if (this.checkConfirm1 === false) {
      this.checkConfirm1 = true;
    } else {
      this.checkConfirm1 = false;
      this.modalForm.controls.confirm1.setValue('');
    }
  }

  changeCheckboxConfirm2() {
    if (this.checkConfirm2 === false) {
      this.checkConfirm2 = true;
    } else {
      this.checkConfirm2 = false;
      this.modalForm.controls.confirm2.setValue('');
    }
  }

}
