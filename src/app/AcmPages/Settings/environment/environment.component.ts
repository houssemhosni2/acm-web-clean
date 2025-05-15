import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { AcmEnvironnementEntity } from '../../../shared/Entities/acmEnvironnement.entity';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import {AcmDevToolsServices} from '../../../shared/acm-dev-tools.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { SharedService } from 'src/app/shared/shared.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { LoanDetailsServices } from '../../Loan-Application/loan-details/loan-details.services';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.sass']
})
export class EnvironmentComponent implements OnInit {
  public acmEnvironnementEntitys: AcmEnvironnementEntity[] = [];
  public acmEnvironnementEntity: AcmEnvironnementEntity = new AcmEnvironnementEntity();
  public updateAcmEnvirement: AcmEnvironnementEntity = new AcmEnvironnementEntity();
  public pageSize: number;
  public page: number;
  public pageSize2: number;
  public page2: number;
  public pageSize3: number;
  public page3: number;
  public groupForm: FormGroup;
  public action: string;
  public checkbox: boolean;
  public technicalAcmEnvironnements: AcmEnvironnementEntity[] = [];
  public functionalAcmEnvironnements: AcmEnvironnementEntity[] = [];
  public reminderAcmEnvironnements: AcmEnvironnementEntity[] = [];
  public settingMotifRejetsEntitys = [];
  public settingMotifRejetsEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public displayListMotifRejet:boolean=false;
  public codeReject:string;
  public valueList: string[] =['Branch_id','object_id','product_id'];
  public value : string;
  configList = { 
    search: true,   
    placeholder: ''
  };
  public userConnected: UserEntity;
  /**
   * Constructor EnvironmentComponent
   * @param settingsService SettingsService
   * @param translate TranslateService
   * @param modal NgbModal
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   * @param sharedService SharedService
   */
  constructor(public settingsService: SettingsService, public translate: TranslateService,
              public modal: NgbModal, public formBuilder: FormBuilder, 	public devToolsServices: AcmDevToolsServices,
              public library : FaIconLibrary, public sharedService: SharedService,public loanDetailsServices: LoanDetailsServices) {
  }

  ngOnInit() {
    this.userConnected = this.sharedService.getUser();
    // params for table Technical settings
    this.pageSize = 5;
    this.page = 1;
    // params for functional settings
    this.pageSize2 = 5;
    this.page2 = 1;
    // params for reminder settings
    this.pageSize3 = 5;
    this.page3 = 1;
    // Technical Settings
    this.settingsService.getEnvirementValueByCatgeory(AcmConstants.TECHNICAL).subscribe((data) => {
      this.technicalAcmEnvironnements = data;
    });
    // Functional Settings
    this.settingsService.getEnvirementValueByCatgeory(AcmConstants.FUNCTIONAL).subscribe((data) => {
      this.functionalAcmEnvironnements = data;
    });
    // Reminder Settings
    this.settingsService.getEnvirementValueByCatgeory(AcmConstants.REMINDER).subscribe((data) => {
      this.reminderAcmEnvironnements = data;
    });
    this.settingMotifRejetsEntity.categorie = AcmConstants.REJECT_CATEGORIE;
    this.loanDetailsServices.getReason(this.settingMotifRejetsEntity).subscribe(
      (data) => {
        this.settingMotifRejetsEntitys = data;
      }
    );
  }

  /**
   * Create Form.
   * @param acmEnvironnementEntity AcmEnvironnementEntity
   */
  createForm(acmEnvironnementEntity: AcmEnvironnementEntity) {
    this.groupForm = this.formBuilder.group({
      key: [acmEnvironnementEntity.key, [Validators.required]],
      value: ['', Validators.required],
      description: [acmEnvironnementEntity.description, Validators.required],
    });
    if(acmEnvironnementEntity.type === 'LISTVALUES') {
      this.groupForm.controls.value.setValue(acmEnvironnementEntity.value.split(','))
    }
    else {
      this.groupForm.controls.value.setValue(acmEnvironnementEntity.value);
    }

  }

  /**
   * Change Status of acmEnvironnementEntity
   * @param acmEnvironnementEntity AcmEnvironnementEntity
   */
  endableDisable(acmEnvironnementEntity: AcmEnvironnementEntity) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_environnemet').afterClosed().subscribe(res => {
      if (res) {
        this.settingsService.updateAcmEnvironment(acmEnvironnementEntity).subscribe();
      } else {
        acmEnvironnementEntity.enabled = !acmEnvironnementEntity.enabled;
      }
    });
    this.displayListMotifRejet=false;
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Close Pop-up
   */
  closeModale() {
    this.modal.dismissAll();
  }

  /**
   * validation form
   */
  onSubmit() {
    if (this.groupForm.valid) {
      this.acmEnvironnementEntity.key = this.groupForm.controls.key.value;
            // set listValue value
            this.value = '';
            if (this.acmEnvironnementEntity.type === 'LISTVALUES') {
                 this.groupForm.controls.value.value.forEach(element => {
                  this.value=this.value+element + ',' ;
              });
              this.acmEnvironnementEntity.value = this.value;
            }
            // set boolean value
     else if (this.groupForm.controls.value.value === false) {
        this.acmEnvironnementEntity.value = '0';
      } else if (this.groupForm.controls.value.value === true) {
        this.acmEnvironnementEntity.value = '1';
      } else {
        // set text value
        this.acmEnvironnementEntity.value = this.groupForm.controls.value.value;
      }
      this.acmEnvironnementEntity.description = this.groupForm.controls.description.value;
      this.save();
    }
  }

  /**
   * save acmEnvironnementEntity
   */
  save() {
    if (this.action === 'update') {
      this.settingsService.updateAcmEnvironment(this.acmEnvironnementEntity).subscribe(
        (data) => {
          if (this.acmEnvironnementEntity.key === AcmConstants.RENEWEL_LOAN_CONDITION) {
            this.sharedService.setRenewalConditionStatus(data.value !== '0');
          }
        }
      );
      this.displayListMotifRejet=false;
    } else if (this.action === 'create') {
      this.settingsService.createAcmEnvironment(this.acmEnvironnementEntity).subscribe(
        (data) => {
          this.acmEnvironnementEntitys.push(data);
        }
      );
    }
    this.modal.dismissAll();
  }

  /**
   * update acmEnvironnementEntity
   * @param modalContent ModalContent
   * @param acmEnvironnementEntity AcmEnvironnementEntity
   */
  updateAcmEnvironment(modalContent, acmEnvironnementEntity: AcmEnvironnementEntity) {
    if (acmEnvironnementEntity.type === 'CHECKBOX') {
      this.checkbox = acmEnvironnementEntity.value !== '0';
    }
    if(acmEnvironnementEntity.key==='MOTIF_TO_REJECT_LOANS_NOT_ISSUED')
    {
      this.displayListMotifRejet=true;
    }
    this.action = 'update';
    this.acmEnvironnementEntity = acmEnvironnementEntity;
    this.createForm(acmEnvironnementEntity);
    this.modal.open(modalContent);
  }

  /**
   * Create acmEnvironnementEntity
   * @param modalContent ModalContent
   */
  createAcmEnvironment(modalContent) {
    this.action = 'create';
    this.createForm(new AcmEnvironnementEntity());
    this.modal.open(modalContent);
  }

  codeMotifReject(event){
    let libelle=event.target.value;
    let motifReject = this.settingMotifRejetsEntitys.filter((motif) =>motif.libelle === libelle);
   this.groupForm.controls.value.setValue(motifReject[0].codeExternal);
  }
}
