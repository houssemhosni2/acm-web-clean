import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SettingsService } from '../settings.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { HabilitationEntity } from 'src/app/shared/Entities/habilitation.entity';
import { HabilitationIhmRouteEntity } from 'src/app/shared/Entities/habilitationIhmRoute.entity';
import { AcmConstants } from '../../../shared/acm-constants';
import { SettingFieldService } from '../setting-fields.service';
import { AcmIhmFormEntity } from 'src/app/shared/Entities/acmIhmForm.entity';
import { AcmIhmFieldEntity } from 'src/app/shared/Entities/acmIhmField.entity';
import { AcmIhmFieldGroupe } from 'src/app/shared/Entities/acmihmFieldGroupe.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import {MatDialog} from '@angular/material/dialog';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-habilitation',
  templateUrl: './habilitation.component.html',
  styleUrls: ['./habilitation.component.sass']
})
export class HabilitationComponent implements OnInit {
  public habilitationForm: FormGroup;
  public groupeEntitys: GroupeEntity[] = [];
  public groupeEntity: GroupeEntity = new GroupeEntity();
  public groups: FormControl = new FormControl('');
  public habilitationEntitys: HabilitationEntity[] = [];
  public habilitationEntity: HabilitationEntity = new HabilitationEntity();
  public habilitationEntityButton: HabilitationEntity = new HabilitationEntity();
  public habilitationEntityButtons: HabilitationEntity[] = [];
  public habilitationEntityToReload: HabilitationEntity = new HabilitationEntity();
  public habilitationIhmRoute: HabilitationIhmRouteEntity = new HabilitationIhmRouteEntity();
  public showTable = false;
  public page: number;
  public pageSize: number;
  selectedIhmHabilitations: Array<any> = [];
  public pageF: number;
  public pageFSize: number;
  public ihmFormSelected = false;
  public ihmForms: AcmIhmFormEntity[];
  public ihmFields: AcmIhmFieldEntity[];
  public selectedGroupeCode: string;
  public selectedGroupeId: number;
  public habilitations: string[] = [];
  public updatedIhmFieldGroupe: AcmIhmFieldGroupe[] = [];
  public userConnected: UserEntity;

  /**
   * constructor
   * @param modal NgbModal
   * @param router Router
   * @param dialog MatDialog
   * @param settingsService SettingsService
   * @param formBuilder FormBuilder
   * @param settingFieldService SettingFieldService
   * @param sharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService TranslateService
   */
  constructor(public modal: NgbModal, public router: Router, public dialog: MatDialog,public library : FaIconLibrary,
              public settingsService: SettingsService, public formBuilder: FormBuilder, public settingFieldService: SettingFieldService,
              public sharedService: SharedService,
              public devToolsServices: AcmDevToolsServices, public translate: TranslateService) {

  }

  ngOnInit() {
    this.habilitations = AcmConstants.HABILITATION_FIELD;
    this.userConnected = this.sharedService.getUser();
    this.pageSize = 20;
    this.page = 1;
    this.pageFSize = 5;
    this.pageF = 1;
    this.settingsService.findGroup(this.groupeEntity).subscribe(
      (data) => {
        this.groupeEntitys = data;
      }
    );
    this.createForm();
  }
  /**
   * Methode to create form
   */
  createForm() {
    this.habilitationForm = this.formBuilder.group({
      groups: this.groups,
    });
  }
  /**
   * Methode to getHabitationByGroup Get Habitation By Group
   * @param item any
   */
   getHabitationByGroup(item: any) {
    if (item !== undefined) {
      this.habilitationForm.get('groups').disable();
      setTimeout(() => {
        this.habilitationForm.get('groups').enable();
      }, 3000);
      this.selectedGroupeCode = item.code;
      this.selectedGroupeId = item.id;
      this.selectedIhmHabilitations = [];
      this.habilitationEntity = new HabilitationEntity();
      this.habilitationEntitys = [];
      this.habilitationEntityButton = new HabilitationEntity();
      this.habilitationEntityButtons = [];
      this.habilitationEntity.idGroupe = item.id;
       this.settingsService.findAllHabilitation(this.habilitationEntity).toPromise().then(
        (data) => {
          data.forEach(element => {
            if (element.value === AcmConstants.IHM) {
              this.habilitationEntitys.push(element);
            } else {
              this.habilitationEntityButtons.push(element);
            }
          });
          if (this.habilitationEntityButtons.length > 0) {
            this.habilitationEntityButtons.forEach(element => {
              if (element.actions === AcmConstants.READ) {
                element.enableButton = false;
              } else if (element.actions === AcmConstants.EXECUTE) {
                element.enableButton = true;
              }
            });
          }
          if (this.habilitationEntitys.length > 0) {
            this.showTable = true;
          } else {
            this.showTable = false;
          }
        }
      );
    }

  }
  /**
   * Methode onChange
   * @param habilitationEntity habilitationEntity
   * @param Number i
   */
  onChange(habilitationEntity) {
    if (habilitationEntity.enableButton) {
      habilitationEntity.actions = AcmConstants.EXECUTE;
      habilitationEntity.enabled = true;
    } else if (!habilitationEntity.enableButton) {
      habilitationEntity.actions = AcmConstants.READ;
      habilitationEntity.enabled = false;
    }
    if (this.selectedIhmHabilitations.indexOf(habilitationEntity) === -1) {
      this.selectedIhmHabilitations.push(habilitationEntity);
    }
  }

  /**
   * Methode onChange
   * @param habilitationEntity habilitationEntity
   * @param Number i
   */
  onChangeCheckBox(habilitationEntity, i, event) {
    if (event.target.checked) {
      habilitationEntity.enabled = true;
    } else if (!event.target.checked) {
      habilitationEntity.enabled = false;
    }
    if (habilitationEntity.enableButton) {
      habilitationEntity.actions = AcmConstants.EXECUTE;
    } else if (!habilitationEntity.enableButton) {
      habilitationEntity.actions = AcmConstants.READ;
    }
    if (this.selectedIhmHabilitations.indexOf(habilitationEntity) === -1) {
      this.selectedIhmHabilitations.push(habilitationEntity);
    } else {
      this.selectedIhmHabilitations.splice(this.selectedIhmHabilitations.indexOf(habilitationEntity), 1);
    }
  }
  /**
   * Methode to update
   */
  async updateHabilitation() {
    await this.settingsService.updateHabilitation(this.selectedIhmHabilitations).toPromise().then(() => {
      this.devToolsServices.openToast(0, 'alert.success');
    });
    this.reloadTable(this.selectedIhmHabilitations[0]);
  }

  /**
   * Methode to reload table
   * @param selectedIhmHabilitations selectedIhmHabilitations
   */
  async reloadTable(selectedIhmHabilitations) {
    this.habilitationEntity = new HabilitationEntity();
    this.habilitationEntitys = [];
    this.habilitationEntityButton = new HabilitationEntity();
    this.habilitationEntityButtons = [];
    this.habilitationEntity.idGroupe = selectedIhmHabilitations.idGroupe;
    await this.settingsService.findAllHabilitation(this.habilitationEntity).toPromise().then(
      (data) => {
        data.forEach(element => {
          if (element.value === AcmConstants.IHM) {
            this.habilitationEntitys.push(element);
          } else {
            this.habilitationEntityButtons.push(element);
          }
        });
      }
    );
    if (this.habilitationEntityButtons.length > 0) {
      this.habilitationEntityButtons.forEach(element => {
        if (element.actions === AcmConstants.READ) {
          element.enableButton = false;
        } else if (element.actions === AcmConstants.EXECUTE) {
          element.enableButton = true;
        }
      });
    }
  }
  /**
   * charger la liste des formulaires qui sera affichée sur la pop-up
   *
   * @param modalContent any
   * @param IhmRouteCode string
   */
  updateIhmFieldHabilitation(modalContent, IhmRouteCode) {
    // charger les forms of selected  ihmRoute
    const acmIhmFormEntity = new AcmIhmFormEntity();
    acmIhmFormEntity.habilitationIHMRouteDTO = new HabilitationIhmRouteEntity();
    acmIhmFormEntity.habilitationIHMRouteDTO.codeIHMRoute = IhmRouteCode;
    acmIhmFormEntity.needFields = false;
    this.settingFieldService.getForm(acmIhmFormEntity).subscribe((data) => {
      this.ihmForms = data;
      // not display the ihmFields table
      this.ihmFormSelected = false;
      this.modal.open(modalContent);
    });

  }
  /**
   * charger les fields lorsque un ihmForm est séléctionné
   *
   * @param event any
   */
  FormChanged(event) {
    // charger les Ihm Fields of the selected IhmForm
    const acmIhmFieldEntity = new AcmIhmFieldEntity();
    acmIhmFieldEntity.codeForm = event.target.value;
    acmIhmFieldEntity.codeUserGroup = this.selectedGroupeCode;
    this.settingFieldService.getFields(acmIhmFieldEntity).subscribe((data) => {
      this.ihmFields = data;
      // display the ihmFields table
      this.ihmFormSelected = true;
    }
    );
  }

  /**
   * changer l'habilitation du field donné
   *
   * @param event any
   * @param ihmField AcmIhmFieldEntity
   */
  changeIhmFieldHabilitation(event, ihmField) {
    const acmIhmFieldGroupe = new AcmIhmFieldGroupe();
    const acmIhmFieldEntity = new AcmIhmFieldEntity();
    acmIhmFieldEntity.codeField = ihmField.codeField;
    acmIhmFieldEntity.id = ihmField.id;
    const groupe = new GroupeEntity();
    groupe.code = this.selectedGroupeCode;
    groupe.idAcmGroup = this.selectedGroupeId;
    acmIhmFieldGroupe.group = groupe;
    acmIhmFieldGroupe.acmIhmField = acmIhmFieldEntity;
    acmIhmFieldGroupe.habilitation = event.target.value;
    // update field habilitation for given group
    this.settingFieldService.updateFieldHabilitation(acmIhmFieldGroupe).subscribe((data) => {
      ihmField.habilitation = data.habilitation;
    });
  }

  closeModal() {
    this.modal.dismissAll();
  }
}
