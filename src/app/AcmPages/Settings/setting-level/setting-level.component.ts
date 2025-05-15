import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../settings.service';
import {SettingLevelEntity} from '../../../shared/Entities/settingLevel.entity';
import {TranslateService} from '@ngx-translate/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppComponent} from '../../../app.component';
import {AcmDevToolsServices} from '../../../shared/acm-dev-tools.services';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-setting-level',
  templateUrl: './setting-level.component.html',
  styleUrls: ['./setting-level.component.sass']
})
export class SettingLevelComponent implements OnInit {

  public settingLevels: SettingLevelEntity[] = [];
  public popupForm: FormGroup;
  public updateId = 0;
  public updateOrdre = false;
  cols: any[];

  /**
   *
   * @param settingsService SettingsService
   * @param translate TranslateService
   * @param formBuilder FormBuilder
   * @param modalService NgbModal
   * @param devToolsServices AcmDevToolsServices
   * @param library FaIconLibrary
   */
  constructor(public settingsService: SettingsService,
              public translate: TranslateService,
              public formBuilder: FormBuilder,
              public modalService: NgbModal,
              public devToolsServices: AcmDevToolsServices,
              public library: FaIconLibrary) {
  }

  ngOnInit() {
    this.cols = [
      {field: 'levelOrder', header: ''},
      {field: 'code', header: 'Code'},
      {field: 'title', header: 'Label'},
      {field: 'description', header: 'Description'},
      {field: 'enabled', header: 'Status'}
    ];
    this.settingsService.findAllSettingLevel().subscribe((data) => {
      this.settingLevels = data;
    });
  }

  /**
   * Methode to create form popup
   */
  createForm() {
    this.popupForm = this.formBuilder.group({
      code: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      status: [false],
    });
  }

  /**
   * methode to open the popup add new level
   * param content
   */
  openLarge(content) {
    this.createForm();
    this.changeCode();
    this.modalService.open(content, {
      size: 'md'
    });
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
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
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.add_document_type').afterClosed().subscribe(
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
   * get all values before update level
   * @param any content
   * @param any settingLevel
   */
  editLevel(content, level) {
    this.createForm();
    const settingLevel: SettingLevelEntity = level;
    this.updateId = level.id;
    this.popupForm.controls.code.setValue(settingLevel.code);
    this.popupForm.controls.title.setValue(settingLevel.title);
    this.popupForm.controls.description.setValue(settingLevel.description);
    this.popupForm.controls.status.setValue(settingLevel.enabled);
    this.modalService.open(content, {
      size: 'md'
    });
  }

  /**
   * reset popup
   */
  reset() {
    this.createForm();
    this.updateId = 0;
  }

  /**
   * update level
   */
  async update() {
    await this.settingLevels.map(settingLevel => {
      if (settingLevel.id === this.updateId) {
        settingLevel.code = this.popupForm.controls.code.value;
        settingLevel.title = this.popupForm.controls.title.value;
        settingLevel.description = this.popupForm.controls.description.value;
        settingLevel.enabled = this.popupForm.controls.status.value;
        this.settingsService.updateLevel(settingLevel).subscribe(() => {
          this.devToolsServices.openToast(0, 'alert.success');
        });
      }
    });
  }

  /**
   * create new level
   */
  create() {
     // level order
     const maxOrder = Math.max.apply(Math, this.settingLevels.map((level) => {
      return level.levelOrder;
    }));
     const newOrder = maxOrder + 1;
     const settingLevel: SettingLevelEntity = new SettingLevelEntity();
     settingLevel.code = this.popupForm.controls.code.value;
     settingLevel.title = this.popupForm.controls.title.value;
     settingLevel.description = this.popupForm.controls.description.value;
     settingLevel.enabled = this.popupForm.controls.status.value;
     settingLevel.levelOrder = newOrder;
     this.settingsService.createLevel(settingLevel).subscribe((data) => {
      this.devToolsServices.openToast(0, 'alert.success');
      this.settingLevels.push(data);
    });
  }

  /**
   * methode to generate level code
   */
  changeCode() {
    if (this.updateId === 0) {
      let maxOrder = 0;
      if (this.settingLevels.length !== 0) {
       maxOrder =  maxOrder = Math.max.apply(Math, this.settingLevels.map((level) => {
        return level.levelOrder;
      }));
    }
      if (this.settingLevels.some(settingLevel => settingLevel.title.toUpperCase()
        === this.popupForm.controls.title.value.toUpperCase())) {
        this.popupForm.controls.title.setErrors({incorrect: true});
      } else {
        const newOrder = maxOrder + 1;
        const newCode = 'Approval_l' + newOrder;
        if (this.settingLevels.some(settingLevel => settingLevel.code === newCode)) {
          this.popupForm.controls.code.setErrors({incorrect: true});
        } else {
          this.popupForm.controls.code.setValue(newCode.toUpperCase());
        }
      }
    }
  }

  /**
   * Methode when change order
   * @param index any
   */
  onchange(index) {
    this.updateOrdre = true;
  }

  /**
   * Methode to update the order of levels
   */
  updateOrder() {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.change_order_level').afterClosed().subscribe(
      res => {
        if (res) {
          this.settingsService.updateOrderLevel(this.settingLevels).subscribe((data) => {
            this.devToolsServices.openToast(0, 'alert.success');
            this.updateOrdre = false;
          });
        }
      });
  }

  /**
   * refresh order
   */
  refresh() {
    this.settingsService.findAllSettingLevel().subscribe((data) => {
      this.settingLevels = data;
      this.updateOrdre = false;
    });
  }
}
