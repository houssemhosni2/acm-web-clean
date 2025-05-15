import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TranslateService } from '@ngx-translate/core';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SettingsService } from '../settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingListEntity } from 'src/app/shared/Entities/AcmSettingList.entity';

@Component({
  selector: 'app-setting-list',
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.sass']
})
export class SettingListComponent implements OnInit {

  public cols: any[];
  public selectedColumns: any[];
  settingList: SettingListEntity[] = [];
  filteredSettings: SettingListEntity[] = [];
  updateSettingList: SettingListEntity = null;
  updateChildSettingList: any[] = [];
  update: boolean = false;
  @ViewChild("modalContent", { static: true }) modalContent: TemplateRef<any>;
  settingListForm: FormGroup;

    constructor(public modal: NgbModal, public router: Router, public dialog: MatDialog,private cdr: ChangeDetectorRef,
                public settingsService: SettingsService, public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices,
                public translate: TranslateService,public library: FaIconLibrary,
                ) {
  
    }

  ngOnInit(): void {
    this.cols = [
      { field: 'ListName', header: 'setting.ListName' },
      { field: 'ListValue', header: 'setting.ListValue' },
    ];

    this.selectedColumns = this.cols;
    const settingListEntity: SettingListEntity = new SettingListEntity();
        this.settingsService.findListSetting(settingListEntity).subscribe(
          (data) => {
            this.settingList = data.map((item) => ({
              ...item,
              valueJson: JSON.parse(item.
                valueJson
              ),
            }));
            this.filteredSettings = this.settingList.filter((item) => item.valueJson?.parentListID === 0);
          });
  }

  createForm() {
    this.settingListForm = this.formBuilder.group({
      id: [],
      valueJson: this.formBuilder.group({
        name: ['', Validators.required], 
        parentListID: [0], 
      }),
      enabled: [true],
    });
  }
  

  enableDisableList(List: any) {
  
    this.devToolsServices
        .openConfirmDialogWithoutRedirect('confirmation_dialog.disable_environnemet')
        .afterClosed()
        .subscribe((res) => {
          List.valueJson = JSON.stringify(List.valueJson);
          this.settingsService.saveListSetting(List).subscribe();
          this.ngOnInit();
        });
  }




  addList() {
    this.update=false;
    this.updateChildSettingList=[];
    this.createForm();
    this.settingListForm.patchValue({
      valueJson: {
        name: '',
        parentListID: 0,
      },
      enabled: true
    });
    this.modal.open(this.modalContent, { size: "xl" });
  }

  getChildren(parentId: number): any[] {
    return this.settingList.filter((item) => item.valueJson?.parentListID === parentId && item.enabled);
  }


  editList(ListValueSetting: SettingListEntity) {
    this.update=true;
    this.updateSettingList = ListValueSetting;
    this.updateChildSettingList = this.getChildren(this.updateSettingList.id);
  
    this.createForm();
    this.settingListForm.patchValue({
      id: ListValueSetting.id,
      valueJson: {
        name: ListValueSetting.valueJson?.name,
        parentListID: ListValueSetting.valueJson?.parentListID,
      },
      enabled: ListValueSetting.enabled
    });
    this.modal.open(this.modalContent, { size: "xl" });
  }
  
  disableItem(index: number) {
  
    if (this.updateChildSettingList[index].id) {
      this.updateChildSettingList[index].enabled = false;
    } else {
      this.updateChildSettingList.splice(index, 1);
    }
  }

  addToList() {
    if (this.settingListForm.get('valueJson.name')?.value?.toLowerCase() === 'nationality') {
      this.updateChildSettingList.push({
        valueJson: {
          name: '', 
          parentListID: this.settingListForm.get('id')?.value,
          primary : false
        },
        enabled: true, 
      });
      
    }else {
      this.updateChildSettingList.push({
        valueJson: {
          name: '', 
          parentListID: this.settingListForm.get('id')?.value,
        },
        enabled: true, 
      });
    }
    
  }


 async saveUdfGroup() {
  this.devToolsServices.makeFormAsTouched(this.settingListForm);
  if (this.settingListForm.invalid  ) {
    this.devToolsServices.InvalidControl();
    this.devToolsServices.openToast(3, 'alert.check-data');
    return;
  }

  for (const item of this.updateChildSettingList) {
    if (!item.valueJson.name || item.valueJson.name.trim() === '') {
      this.devToolsServices.openToast(3, "alert.setting_list_value_vide");
      return; 
    }
  }

    if (this.update) {
      this.updateChildSettingList.push(this.settingListForm.value);
    this.updateChildSettingList = this.updateChildSettingList.map(item => {
      return {
        ...item, 
        valueJson: JSON.stringify(item.valueJson), 
      };
    });   
    await this.settingsService.saveAllListSetting(this.updateChildSettingList).toPromise(); 
    }else {
      this.settingListForm.value.valueJson = JSON.stringify(this.settingListForm.value.valueJson);
      const response = await this.settingsService.saveListSetting(this.settingListForm.value).toPromise();
      this.updateChildSettingList = this.updateChildSettingList.map(item => {
        item.valueJson.parentListID = response.id;
        item.valueJson = JSON.stringify(item.valueJson);
        return item;
      });
      await this.settingsService.saveAllListSetting(this.updateChildSettingList).toPromise(); 

    }
    this.devToolsServices.openToast(0, "alert.success");
    this.modal.dismissAll();
    this.updateChildSettingList=[];
    this.settingListForm.reset();
    this.ngOnInit();
  }

  reset() {
    this.updateChildSettingList=[];
    this.settingListForm.reset();
  }

  get hasPrimaryField(): boolean {
    return this.settingListForm.get('valueJson.name')?.value?.toLowerCase() === 'nationality';
  }


  

  primaryItem(index: number): void {
    const item = this.updateChildSettingList[index];
    if (item?.valueJson) {
      item.valueJson.primary = item.valueJson.primary === true ? false : true;
    }
  }
  

}
