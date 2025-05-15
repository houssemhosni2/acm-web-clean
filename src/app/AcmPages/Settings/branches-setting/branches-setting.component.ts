import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';
import { SettingsService } from '../settings.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { customRequiredValidator } from 'src/app/shared/utils';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-branches-setting',
  templateUrl: './branches-setting.component.html',
  styleUrls: ['./branches-setting.component.sass']
})
export class BranchesSettingComponent implements OnInit {

  public groupForm: FormGroup;
  public branchSetting: AcmBranches;
  public branchesList: AcmBranches[] = [];

  public pageSize: number;
  public page: number;

  public action: string = "create";

  constructor(public translate: TranslateService, public library: FaIconLibrary, public modal: NgbModal,
    public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices, public settingService: SettingsService) { }

  ngOnInit(): void {

    this.pageSize = 5;
    this.page = 1;

    this.settingService.findBranches(new AcmBranches()).subscribe((res)=>{
      this.branchesList = res;
    }) 
  }

  addBranch(modalContent: TemplateRef<any>) {
    this.action = "create";
    this.branchSetting = new AcmBranches();
    this.branchSetting.isHeadOffice = false;
    this.createForm(this.branchSetting);
    this.modal.open(modalContent);
  }

  editBranch(modalContent: TemplateRef<any>, branchSetting: AcmBranches){
    this.action = "update";
    this.branchSetting = branchSetting;
    this.createForm(branchSetting);
    this.modal.open(modalContent);
  }

  disableBranch(branchSetting: AcmBranches){
    this.branchSetting = branchSetting;
    this.branchSetting.enabled = false;
    this.devToolsServices.openConfirmDialogWithoutRedirect('setting.branches-setting.delete-branches-setting').afterClosed().subscribe(
      res => {
        if (res) {
          this.settingService.saveBranch(this.branchSetting).subscribe((res)=> {
            this.devToolsServices.openToast(0, 'alert.success');
            this.ngOnInit();
          });
        }
      }
    );
  }

  createForm(branchSetting: AcmBranches) {
    this.groupForm = this.formBuilder.group({
      code: [branchSetting.code, [customRequiredValidator]],
      name: [branchSetting.name, [customRequiredValidator]],
      description: [branchSetting.description, [customRequiredValidator]],
      isHeadOffice: [branchSetting.isHeadOffice]
    });
  }

  onSubmit(){
    this.devToolsServices.makeFormAsTouched(this.groupForm);
    if (this.groupForm.valid) {
      this.branchSetting.code = this.groupForm.controls.code.value;
      this.branchSetting.description = this.groupForm.controls.description.value;
      this.branchSetting.name = this.groupForm.controls.name.value;
      this.branchSetting.isHeadOffice = this.groupForm.controls.isHeadOffice.value;
      
      this.settingService.saveBranch(this.branchSetting).subscribe((res)=> {
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.ngOnInit();
      })
      
    }
  }

  closeModale() {
    this.modal.dismissAll();
  }

  getDirection() {
    return AppComponent.direction;
  }
}
