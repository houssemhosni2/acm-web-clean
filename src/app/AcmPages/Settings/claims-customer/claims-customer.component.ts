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
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { SettingClaimsEntity } from 'src/app/shared/Entities/settingClaims.entity';
@Component({
  selector: 'app-claims-customer',
  templateUrl: './claims-customer.component.html',
  styleUrls: ['./claims-customer.component.sass']
})
export class ClaimsCustomerComponent implements OnInit {
  public settingClaimsEntitys: SettingClaimsEntity[] = [];
  public pageSize: number;
  public page: number;
  public groupForm: FormGroup;
  public updateSetting: SettingClaimsEntity;
  public action: string;
  public categories: SettingClaimsEntity[];
  public isReject: boolean;
  public externalIdsList: SettingClaimsEntity[] = [];
  public settingClaimsEntity = new SettingClaimsEntity();
  public  changeCodeForCategory = false;
  public customerType  = [AcmConstants.CUSTOMER_CATEGORY_PROSPECT,AcmConstants.CUSTOMER_CATEGORY_CUSTOMER] ; 
  public prioritys  = ["MINOR","SIMPLE" ,"MAJOR" ,"BLOCKING"] ; 


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
    await this.settingsService.findAllSettingClaims().subscribe(
      (data) => {
        this.settingClaimsEntitys = data;
       
      }
    );
    this.settingsService.findGroup(new GroupeEntity()).subscribe(res=>{
      this.groupEntities = res
    }) ;
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
  updateMotif(modalContent, settingClaimsEntity: SettingClaimsEntity) {
    this.action = 'update';
    this.updateSetting = settingClaimsEntity;

   
    this.createForm(settingClaimsEntity);
    this.modal.open(modalContent);
  }

  createForm(settingClaimsEntity: SettingClaimsEntity) {
    this.groupForm = this.formBuilder.group({
      category: [settingClaimsEntity.category, [Validators.required]],
      subject: [settingClaimsEntity.subject, Validators.required],
      assignement:  [settingClaimsEntity.assignement, Validators.required],
      processingTimeLine: settingClaimsEntity.processingTimeLine,
      pripority : [settingClaimsEntity.pripority, Validators.required],
    });
   
 }

  
  /**
   *
   * @param event event
   */

  checkTypeCustomer : boolean ; 
  public groupEntities: GroupeEntity[];

  onChange(event) {
    if (event.target.value === AcmConstants.CUSTOMER_CATEGORY_PROSPECT) {
      this.checkTypeCustomer  = true ; 
      this.settingsService.findGroup(new GroupeEntity()).subscribe(res=>{
        this.groupEntities = res
      }) ; 

    }

  }
  /**
   * update setting motif de rejet
   */
  save() {
    this.action = 'update';
    this.updateSetting.category = this.groupForm.controls.category.value;
    this.updateSetting.assignement = this.groupForm.controls.assignement.value;
    this.updateSetting.subject = this.groupForm.controls.subject.value;
    this.updateSetting.pripority = this.groupForm.controls.pripority.value;
   
    this.settingsService.updateSettingClaims(this.updateSetting).subscribe();
    this.modal.dismissAll();
  }

  addMotif(modalContent: TemplateRef<any>) {
    this.updateSetting = new SettingClaimsEntity();
    this.action = 'create';
    this.createForm(new SettingClaimsEntity());
    this.modal.open(modalContent);
  }

  create() {
    this.updateSetting.category = this.groupForm.controls.category.value;
    this.updateSetting.assignement = this.groupForm.controls.assignement.value;
    this.updateSetting.subject = this.groupForm.controls.subject.value;
    this.updateSetting.pripority = this.groupForm.controls.pripority.value;
    if (this.groupForm.controls.processingTimeLine.value) {
      this.updateSetting.processingTimeLine = this.groupForm.controls.processingTimeLine.value ; 
    }else {
      this.updateSetting.processingTimeLine = 0;
    }
    this.updateSetting.processingTimeLine = this.groupForm.controls.processingTimeLine.value ; 
   
    this.settingsService.createSettingClaims(this.updateSetting).subscribe(
      (data) => {
        this.settingClaimsEntitys.push(data);
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
   * if category is : !(CANCEL , REJECT, DECLINE)
   * generate automatic code for inserted label
   */
  genreretCodeForLabel() {
    if (!this.changeCodeForCategory) {
    const code = this.groupForm.controls.label.value.replace(/ /g, '_').toUpperCase();
    this.groupForm.controls.code.setValue(code); }
  }

  compareGroup(group1, group2) {
    if (group1 && group2) {
      return group1.code === group2.code;
    }
  }

}
