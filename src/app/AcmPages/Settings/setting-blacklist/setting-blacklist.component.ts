import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { TranslateService } from "@ngx-translate/core";
import { SettingBalcklistPartyType } from 'src/app/shared/Entities/settingBlacklistPartyType.entity';
import { SettingsService } from '../settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { customRequiredValidator } from 'src/app/shared/utils';
import { AppComponent } from 'src/app/app.component';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

@Component({
  selector: 'app-setting-blacklist',
  templateUrl: './setting-blacklist.component.html',
  styleUrls: ['./setting-blacklist.component.sass']
})
export class SettingBlacklistComponent implements OnInit {

  public blacklistTypeList : SettingBalcklistPartyType[] = [];

  public partyType : SettingBalcklistPartyType = new SettingBalcklistPartyType(); 

  public updatePartyType : SettingBalcklistPartyType = null;
  public groupEntities: GroupeEntity[];
  public displayMultiSelect: boolean = false;

  public partyTypeForm: FormGroup;

  constructor(public translate: TranslateService,public modal: NgbModal,
    public library: FaIconLibrary, public settingsService: SettingsService,
    private fb: FormBuilder, public devToolsServices: AcmDevToolsServices) { }

  ngOnInit(): void {

    this.getBlackListPartyType();

    this.settingsService.findAllGroup().subscribe((res)=> {
      this.groupEntities = res ;
    })
  }

  addPartyType(modalContent){
    this.createForm();
    this.modal.open(modalContent);
  }

  editPartType(modalContent, item){
    this.updatePartyType = item;
    this.createForm();
    this.modal.open(modalContent);
  }

  getBlackListPartyType(){
    this.settingsService.findSettingBlacklistPartyType(new SettingBalcklistPartyType()).subscribe((res) => {
      this.blacklistTypeList = res;
    });
  }

  multiSelectRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value && value.length > 0 ? null : { customError: 'This field is required.' };
    };
  }

  createForm(){
    
    this.partyTypeForm = this.fb.group({
      code: [this.updatePartyType?.code, [customRequiredValidator]],
      label: [this.updatePartyType?.label, [customRequiredValidator]],
      modificationGroup : [ this.getGroups(this.updatePartyType?.modificationGroup) || null, [this.multiSelectRequiredValidator()]],
      notificationGroup : [ this.getGroups(this.updatePartyType?.notificationGroup) || null, [this.multiSelectRequiredValidator()]]
    })
  }



  savePartyType(){
    this.devToolsServices.makeFormAsTouched(this.partyTypeForm);
    
    if(this.partyTypeForm.valid){
      if(this.updatePartyType){
        this.partyType= this.updatePartyType;
      }

      this.partyType.code = this.partyTypeForm.controls.code.value;
      this.partyType.label = this.partyTypeForm.controls.label.value;
      this.partyType.modificationGroup = this.getGroupsCode(this.partyTypeForm.controls.modificationGroup.value);
      this.partyType.notificationGroup = this.getGroupsCode(this.partyTypeForm.controls.notificationGroup.value);

      this.settingsService.saveSettingBlacklistPartyType(this.partyType).subscribe((res)=>{
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.getBlackListPartyType();
      })
    }

    this.updatePartyType = null;
  }

  getGroupsCode(groups : GroupeEntity[]): string {   
    let groupsCode: string = "";
    groups.forEach((item)=>{
      groupsCode = groupsCode.concat(item.code + ";");
    })
    return groupsCode;
  }

  getGroups(groupsCode : string): GroupeEntity[] {
    if(groupsCode){
      let elements = groupsCode.split(";");
      let resultat : GroupeEntity[] = [];
      elements.forEach((item)=>{
        let res = this.groupEntities.filter((entity) => entity.code === item)[0];
        if(res) resultat.push(res);
      })
      return resultat;
    }
    return null;
  }

  enableDisable(item) {
    this.settingsService.saveSettingBlacklistPartyType(item)
        .toPromise().then(() => {
          this.devToolsServices.openToast(0, 'alert.success');
        }).finally(()=> this.ngOnInit());

  }

  closeModal() {
    this.modal.dismissAll();
    this.updatePartyType = null;
  }

  getDirection() {
    return AppComponent.direction;
  }
}
