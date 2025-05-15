import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from '../settings.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserEntity } from '../../../shared/Entities/user.entity';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AppComponent } from '../../../app.component';
import { GroupeEntity } from '../../../shared/Entities/groupe.entity';
import { BrancheEntity } from '../../../shared/Entities/branche.entity';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { UserPaginationEntity } from '../../../shared/Entities/user.pagination.entity';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { PortfolioEntity } from '../../../shared/Entities/Portfolio.entity';
import { UsersNotificationsEntity } from 'src/app/shared/Entities/usersNotifications.entity';
import { SettingNotificationsEntity } from 'src/app/shared/Entities/settingNotifications.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {customRequiredValidator} from '../../../shared/utils';
import { PortfolioPaginationEntity } from 'src/app/shared/Entities/PortfolioPagination.entity';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-setting-users',
  templateUrl: './setting-users.component.html',
  styleUrls: ['./setting-users.component.sass']
})
export class SettingUsersComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public users: UserEntity[] = [];
  public portfolios: PortfolioEntity[] = [];
  public cols: any[];
  public colsPortfolio: any[];
  public teamCols: any[];
  public selectedColumns: any[];
  public selectedPortfolio: any[];
  public teamsSelectedColumns: any[];
  public pageSize: number;
  public page: number;
  public loading = true;
  public action: string;
  public branchesAcces = null;
  public UserforUpdate: UserEntity;
  public groupForm: FormGroup;
  public groupFormPortfolio: FormGroup;
  public teamForm: FormGroup;
  public groupEntitys: GroupeEntity[] = [];
  public brancheEntitys: AcmBranches[] = [];
  public groups: SelectItem[];
  public portfolioSelected: PortfolioEntity = new PortfolioEntity();
  public userSettingNotificationsEntitys: UsersNotificationsEntity[] = [];
  public allSettingNotifEntities: SettingNotificationsEntity[];
  public addedSettingNotif: UsersNotificationsEntity[] = [];
  public userPagination: UserPaginationEntity = new UserPaginationEntity();
  public portfolioPagination: PortfolioPaginationEntity = new PortfolioPaginationEntity();
  public user: UserEntity;
  public portfolio: PortfolioEntity;
  public emailMask = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
  public displayPortfolio = true;
  public enabled: boolean;
  public selectedDateTypeG = DateType.Gregorian;
  public resigningDate: NgbDate;
  public hiringDate: NgbDate;
  public teamsPagination: UserPaginationEntity = new UserPaginationEntity();
  public team: UserEntity[];
  public allTemporary = false;
  public usersChangedResponsible: UserEntity[] = [];
  public selectedResponsible: string;
  public supervisorName: string;
  public listPortfolio : PortfolioEntity[];
  public PortfolioforUpdate: PortfolioEntity;

  configBranches = {
    displayKey: 'description', // if objects array passed which key to be displayed defaults to description
    search: true,
    placeholder: ' '
  };
  branchesArray: AcmBranches[] = [];
  configResponsibles = {
    displayKey: 'loginAndName', // if objects array passed which key to be displayed defaults to login
    search: true,
    placeholder: ' ',
    searchOnKey: 'login'
  };
  public responsibleSelected: UserEntity = new UserEntity();
  public usersFiltered: UserEntity[] = [];
  public responsibleList: UserEntity[] = [];
  public emptyResponsible = false;
  /**
   *
   * @param settingsService SettingsService
   * @param translate TranslateService
   * @param modal NgbModal
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   * @param library FaIconLibrary
   */
  constructor(public settingsService: SettingsService, public translate: TranslateService,
              public modal: NgbModal, public formBuilder: FormBuilder, public devToolsServices: AcmDevToolsServices,
              public library: FaIconLibrary) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'login', header: 'setting.setting_users.login' },
      { field: 'employeeId', header: 'setting.setting_users.employee_id' },
      { field: 'nom', header: 'setting.setting_users.first-name' },
      { field: 'prenom', header: 'setting.setting_users.last-name' },
      { field: 'email', header: 'setting.setting_users.email' },
      { field: 'groupes', header: 'setting.setting_users.group' },
      { field: 'branchDescription', header: 'customer.branch' },
      { field: 'responsableId', header: 'setting.setting_users.responsible' },
      { field: 'portfolioName', header: 'setting.setting_users.portfolio' },
      { field: 'enabled', header: 'setting.status' }
    ];

    this.colsPortfolio = [
      { field: 'portfolioId', header: 'setting.setting_users.portfolioId' },
      { field: 'code', header: 'setting.setting_users.portfolioCode' },
      { field: 'portfolioName', header: 'setting.setting_users.portfolioName' },
    ];

    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
    this.userPagination.params = new UserEntity();
    this.settingsService.findUserPagination(this.userPagination).subscribe(
      (elements) => {
        this.userPagination = elements;
      }
    );

// init pagination params
this.selectedPortfolio = this.colsPortfolio;
this.pageSize = 10;
this.page = 1;
this.portfolioPagination.params = new PortfolioEntity();
this.settingsService.findPortfolioPagination(this.portfolioPagination).subscribe(
  (elements) => {
    this.portfolioPagination = elements;
  }
);  

this.settingsService.findGroup(new GroupeEntity()).subscribe(
  (data) => {
    this.groupEntitys = data;
    this.groups = [];
    this.groupEntitys.forEach(element => {
      this.groups.push({ label: element.idAcmGroup.toString(), value: element.libelle });
    });
    this.loading = false;
  }
);

  }

  /**
   * Add user
   * @param modalContent ModalContent
   */
  addUser(modalContent) {
    this.displayPortfolio = false;
    this.settingsService.findAllAcmPortfolio().subscribe(
      (data) => {
        this.listPortfolio = data;
      }
    );

    this.settingsService.findBranches(new AcmBranches()).subscribe(
      (data) => {
        this.brancheEntitys = data;
      }
    );

    this.branchesArray = [];
    this.responsibleSelected = new UserEntity();
    this.action = 'create';
    this.UserforUpdate = new UserEntity();
    this.responsibleList = [];
    this.createForm(this.UserforUpdate, 'add');
    this.emptyResponsible = false;
    this.modal.open(modalContent);
  }

  /**
   * Update User
   * @param modalContent ModalContent
   * @param user UserEntity
   */
  async updateUser(modalContent, user: UserEntity) {
    this.displayPortfolio = true;
    this.settingsService.findAllAcmPortfolio().subscribe(
      (data) => {
        this.listPortfolio = data;
      }
    );

    this.settingsService.findBranches(new AcmBranches()).subscribe(
      (data) => {
        this.brancheEntitys = data;
        if (user.accessBranches != null) {
          const branchesNumber = (user.accessBranches.match(/,/g) || []).length + 1;
          const branches: any[] = user.accessBranches.split(',', branchesNumber);
          branches.forEach(element => {
            this.brancheEntitys.find(
              obj => {
                if (obj.id === +element) {
                  this.branchesArray.push(obj);
                }
              }
            );
          });
        }
      }
    );

    this.branchesAcces = null;
    this.branchesArray = [];
    this.action = 'update';   
    this.UserforUpdate = user;
    const userParams = new UserEntity();
    userParams.branchID = user.branchID;
    this.settingsService.getResponsible(userParams).subscribe(
      (value) => {
        this.responsibleList = value.filter(val => val.login !== user.login);
        this.responsibleSelected = (this.responsibleList.filter(val => val.login === user.responsableId)[0]);
        this.loading = false;
      }
    );
    this.emptyResponsible = false;
    this.UserforUpdate.oldResponsibleId = this.UserforUpdate.responsableId;
    await this.createForm(user, 'edit');
    this.emptyResponsible = false;
    this.modal.open(modalContent);
  }

  /**
   * change status of user
   * @param user UserEntity
   */
  endableDisable(user: UserEntity) {
    this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_user').afterClosed().subscribe(res => {
      if (res) {
        this.settingsService.updateEnableUser(user).subscribe((data) => {
          this.devToolsServices.openToast(0, 'alert.success');
        });
      } else {
        user.enabled = !user.enabled;
      }
    });
  }
  /**
   *
   * @param notifmodalContent ModalContent
   * @param user UserEntity
   */
  async setMyNotifications(user: UserEntity) {
    const usersNotificationsEntity = new UsersNotificationsEntity();
    const userDTO = new UserEntity();
    userDTO.login = user.login;
    usersNotificationsEntity.userDTO = userDTO;
    usersNotificationsEntity.userDTO.login = userDTO.login;
    usersNotificationsEntity.settingNotificationDTO = new SettingNotificationsEntity();

    await this.settingsService.findAllSettingNotification().toPromise().then((data) => {
      this.allSettingNotifEntities = data;
    });
    await this.settingsService.findAllUsersNotification(usersNotificationsEntity).toPromise().then(
      (data) => {
        this.userSettingNotificationsEntitys = data;
      }
    );
    this.allSettingNotifEntities.forEach(element => {

      if (this.userSettingNotificationsEntitys.find(e => e.settingNotificationDTO.idSettingNotification
        === element.idSettingNotification) === undefined) {
        const newUserNotif = new UsersNotificationsEntity();
        newUserNotif.settingNotificationDTO = element;
        newUserNotif.statut = false;
        newUserNotif.userDTO = user;
        newUserNotif.exist = false;
        this.userSettingNotificationsEntitys.push(newUserNotif);
      }

    });
  }
  /**
   *
   * @param notifmodalContent modal notification user
   * @param user user
   */
  openNotificationModal(notifmodalContent, user: UserEntity) {
    this.userSettingNotificationsEntitys = [];
    this.setMyNotifications(user);
    this.modal.open(notifmodalContent);
  }
  /**
   *
   * @param usersNotificationsEntity UsersNotificationsEntity
   */
  async enableDisableNotif(usersNotificationsEntity: UsersNotificationsEntity) {
    if (usersNotificationsEntity !== null && usersNotificationsEntity !== undefined) {
      if (!usersNotificationsEntity.statut) {
        await this.settingsService.updateEnableUserNotification(usersNotificationsEntity).toPromise().then((value) => {
          this.devToolsServices.openToast(0, 'alert.success');
        });
      } else if (usersNotificationsEntity.statut) {
        if ((usersNotificationsEntity.exist) || (usersNotificationsEntity.exist === undefined)) {
          await this.settingsService.updateEnableUserNotification(usersNotificationsEntity).toPromise().then((value) => {
            this.devToolsServices.openToast(0, 'alert.success');
          });
        } else if (!usersNotificationsEntity.exist) {
          await this.settingsService.createUserNotification(usersNotificationsEntity).toPromise().then((value) => {
            usersNotificationsEntity.idUsersNotification = value.idUsersNotification;
            usersNotificationsEntity.exist = true;
            this.devToolsServices.openToast(0, 'alert.success');
          });
        }
      }
    }
  }
  /**
   *
   */
  closeModale() {
    this.modal.dismissAll();
    this.team = [];
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Close all Modal
   */
  closeModal() {
    this.modal.dismissAll();
  }

  /**
   * submit form
   */
  onSubmit() {
    this.emptyResponsible = false;
    const branchesValues = this.groupForm.get('branches').value;
    if (branchesValues !== null
      && branchesValues.length !== undefined
      && branchesValues.length > 0) {
      this.groupForm.controls.branches.setErrors(null);
    }
    if (this.groupForm.controls.responsible.valid) {
      if (this.groupForm.valid) {
        if (this.branchesAcces !== null && this.branchesAcces !== undefined) {
          this.UserforUpdate.accessBranches = this.branchesAcces.slice(0, -1);
        }
        this.UserforUpdate.changeAllResponsible = false;
        let oldResponsibleId : string = null;
        if (this.groupForm.controls.updateUsersResponsible.value === true) {
          //this.UserforUpdate.oldResponsibleId = this.UserforUpdate.responsableId;
          this.UserforUpdate.changeAllResponsible = true;
          oldResponsibleId = this.UserforUpdate.oldResponsibleId;
        }
        this.UserforUpdate.nom = this.groupForm.controls.firstName.value;
        this.UserforUpdate.employeeId = this.groupForm.controls.employeeId.value;
        this.UserforUpdate.category = this.groupForm.controls.category.value;
        this.UserforUpdate.prenom = this.groupForm.controls.lastName.value;
        this.UserforUpdate.responsableId = this.responsibleSelected.login;
        this.UserforUpdate.accountPortfolioId = this.groupForm.controls.portfolio.value.portfolioId;
        this.UserforUpdate.portfolioName = this.groupForm.controls.portfolio.value.portfolioName.replace(/\s*\(.*\)/, "").trim();
        this.UserforUpdate.email = this.groupForm.controls.email.value.toLowerCase();

        if (this.groupForm.controls.resigningDate.value !== undefined && this.groupForm.controls.resigningDate.value !== null) {
          if (this.groupForm.controls.resigningDate.value !== '') {
            this.UserforUpdate.resigningDate = new Date(this.groupForm.controls.resigningDate.value);
          } else {
            this.UserforUpdate.resigningDate = this.groupForm.controls.resigningDate.value;
          }
        }
        if (this.groupForm.controls.hiringDate.value !== undefined && this.groupForm.controls.hiringDate.value !== null) {
          if (this.groupForm.controls.hiringDate.value !== '') {
            this.UserforUpdate.hiringDate = new Date(this.groupForm.controls.hiringDate.value);
          } else {
            this.UserforUpdate.hiringDate = this.groupForm.controls.hiringDate.value;
          }
        }

        this.brancheEntitys.forEach(branche => {
          if (branche.id === this.groupForm.controls.branche.value) {
            this.UserforUpdate.branchID = branche.id;
            this.UserforUpdate.branchName = branche.name;
            this.UserforUpdate.branchDescription = branche.description;
          }
        });
        this.groupEntitys.forEach(group => {
          if (group.code === this.groupForm.controls.group.value) {
            this.UserforUpdate.groupes = [];
            this.UserforUpdate.groupes.push(group);
          }
        });
        if (this.action === 'update') {
         this.settingsService.getCheckResponsibleLoop(
            this.UserforUpdate.login,
            oldResponsibleId,
            this.UserforUpdate.responsableId)
            .subscribe(
              (result) => {
              console.log(result);
              if (result.startsWith('KO')) {
                this.devToolsServices.openToastWithParameter(1, 'alert.responsible_loop_detected', result.replace('KO', ''));
                return;
              } else {

                this.settingsService.updateUser(this.UserforUpdate).subscribe((user) => {
                  if (this.groupForm.controls.updateUsersResponsible.value === true) {
                    this.userPagination.resultsUsers.filter(u => u.responsableId === this.UserforUpdate.oldResponsibleId).forEach(userParam => {
                      userParam.responsableId = user.responsableId;
                    });
                  }
                  this.devToolsServices.openToast(0, 'alert.success');
                  this.closeModal();
                });
              }
            });
        } else if (this.action === 'create') {
          this.UserforUpdate.login = this.groupForm.controls.login.value;
          this.settingsService.createUser(this.UserforUpdate).subscribe(
            () => {
              this.devToolsServices.openToast(0, 'alert.success');
              this.closeModal();
            }
          );
        }
      }
    } else {
      this.emptyResponsible = true;
    }
  }

/**
 *
 * @param from date hiring
 * @param to date resigning
 */
dateLessThan(from: string, to: string) {
  return (group: FormGroup): {[key: string]: any} => {
   const f = group.controls[from];
   const t = group.controls[to];
   if (f.value != null && t.value != null && new Date(f.value) > new Date(t.value)) {
  //  this.devToolsServices.openToast(3, 'alert.hiringDateError');
    return {
       dates: 'Date from should be less than Date to'
     };
   }
   return {};
  };
}
  /**
   * Create Form
   * @param user UserEntity
   */
  createForm(user: UserEntity, mode: string) {
    let groupCode = '';
    if (mode === 'edit') {
      if (user.groupes[0].libelle !== undefined) {
        groupCode = user.groupes[0].code;
      }
    }
    this.portfolioSelected.portfolioId = parseInt(user.accountPortfolioId, 10);
    this.portfolioSelected.portfolioName = user.portfolioName;
    this.portfolioSelected.enable = true;
    this.groupForm = this.formBuilder.group({
      category: [user.category, [Validators.required]],
      login: [user.login, [Validators.required]],
      employeeId: [user.employeeId, [Validators.required]],
      firstName: [user.nom, [Validators.required]],
      lastName: [user.prenom, Validators.required],
      email: [user.email, [Validators.required, Validators.email, Validators.pattern(this.emailMask)]],
      group: [groupCode, Validators.required],
      branche: [user.branchID, Validators.required],
      branches: [user.accessBranches],
      responsible: [user.responsableId, Validators.required],
      portfolio: [this.portfolioSelected],
      updateUsersResponsible: [false],
      hiringDate: [user.hiringDate, customRequiredValidator],
      resigningDate: [user.resigningDate]
    }, { validator: this.dateLessThan('hiringDate', 'resigningDate') });
    if (groupCode === AcmConstants.LOAN_OFFICER) {
      this.displayPortfolio = false;
    } else {
      // disable portfolio input and set its value to ''
      this.displayPortfolio = true;
      this.groupForm.controls.portfolio.setValue(new PortfolioEntity());
    }

    if (mode === 'edit' && user.hiringDate !== null) {
      const hiringDate = new Date(user.hiringDate);
      this.groupForm.controls.hiringDate.setValue(hiringDate.toISOString().substring(0, 10));
      user.hiringDate = new Date(user.hiringDate);
      this.hiringDate = new NgbDate(0, 0, 0);
      this.hiringDate.day = user.hiringDate.getDate();
      this.hiringDate.month = user.hiringDate.getMonth() + 1;
      this.hiringDate.year = user.hiringDate.getFullYear();
    } else {
      this.hiringDate = new NgbDate(0, 0, 0);
    }

    if (mode === 'edit' && user.resigningDate !== null
        && user.resigningDate.toString() !== '') {
      const resigningdate = new Date(user.resigningDate);
      this.groupForm.controls.resigningDate.setValue(resigningdate.toISOString().substring(0, 10));
      user.resigningDate = new Date(user.resigningDate);
      this.resigningDate = new NgbDate(0, 0, 0);
      this.resigningDate.day = user.resigningDate.getDate();
      this.resigningDate.month = user.resigningDate.getMonth() + 1;
      this.resigningDate.year = user.resigningDate.getFullYear();
    } else {
      this.resigningDate = new NgbDate(0, 0, 0);
    }
  }

  createFormPortfolio(portfolio: PortfolioEntity) { 
    this.groupFormPortfolio = this.formBuilder.group({
      portfolioId: [portfolio.portfolioId],
      portfolioName: [portfolio.portfolioName?.replace(/\s*\(.*\)/, "").trim(), [Validators.required]],
      code: [portfolio.code, [Validators.required]],     
     });
  }
  /**
   * reloadCustomerList
   * @param $event Event
   */
  async reloadUserList(event: LazyLoadEvent) {
    const userPaginationEntity: UserPaginationEntity = new UserPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    userPaginationEntity.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      userPaginationEntity.pageNumber = event.first;
    } else {
      userPaginationEntity.pageNumber = event.first / event.rows;
    }
    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const userParams: UserEntity = new UserEntity();
    if (event.filters !== undefined) {
      userParams.login = event.filters.login !== undefined ? event.filters.login.value : null;
      userParams.employeeId = event.filters.employeeId !== undefined ? event.filters.employeeId.value : null;
      userParams.nom = event.filters.nom !== undefined ? event.filters.nom.value : null;
      userParams.prenom = event.filters.prenom !== undefined ? event.filters.prenom.value : null;
      userParams.email = event.filters.email !== undefined ? event.filters.email.value : null;
      userParams.branchDescription = event.filters.branchDescription !== undefined ? event.filters.branchDescription.value : null;
      userParams.responsableId = event.filters.responsableId !== undefined ? event.filters.responsableId.value : null;
      userParams.portfolioName = event.filters.portfolioName !== undefined ? event.filters.portfolioName.value : null;
      userParams.enabled = event.filters.enabled !== undefined ? event.filters.enabled.value : null;
      if (event.filters.groupes !== undefined) {
        const selectedFilterGroupes: GroupeEntity = new GroupeEntity();
        selectedFilterGroupes.idAcmGroup = event.filters.groupes.value;
        const listFilterGroupes: GroupeEntity[] = [];
        listFilterGroupes.push(selectedFilterGroupes);
        userParams.groupes = listFilterGroupes;
      } else {
        userParams.groupes = null;
      }
    }
    userPaginationEntity.params = userParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      userPaginationEntity.sortField = event.multiSortMeta[0].field;
      userPaginationEntity.sortDirection = event.multiSortMeta[0].order;
    }

    await this.settingsService.findUserPagination(userPaginationEntity).subscribe(
      (data) => {
        this.userPagination = data;
      }
    );
  }

  async reloadPortfolioList(event: LazyLoadEvent) {
    const portfolioPagination: PortfolioPaginationEntity = new PortfolioPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    portfolioPagination.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      portfolioPagination.pageNumber = event.first;
    } else {
      portfolioPagination.pageNumber = event.first / event.rows;
    }
    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const portfolioParams: PortfolioEntity = new PortfolioEntity();
    if (event.filters !== undefined) {
      portfolioParams.portfolioId = event.filters.portfolioId !== undefined ? event.filters.portfolioId.value : null;
      portfolioParams.portfolioName = event.filters.portfolioName !== undefined ? event.filters.portfolioName.value : null;
      portfolioParams.code = event.filters.code !== undefined ? event.filters.code.value : null;
      
      portfolioPagination.params = portfolioParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      portfolioPagination.sortField = event.multiSortMeta[0].field;
      portfolioPagination.sortDirection = event.multiSortMeta[0].order;
    }

    await this.settingsService.findPortfolioPagination(portfolioPagination).subscribe(
      (data) => {
        this.portfolioPagination = data;
        }
      );
    }
  }
  branchMethode() {
    this.branchesAcces = '';
    this.branchesArray.forEach(data => {
      this.branchesAcces = data.id.toString() + ',' + this.branchesAcces;
    });
  }

  /**
   * comparePortfolio
   * @param portfolio1 portfolio1
   * @param portfolio2 portfolio2
   */
  comparePortfolio(portfolio1, portfolio2) {
    if (portfolio1 !== undefined && portfolio2 !== undefined && portfolio1 !== null && portfolio2 !== null) {
      return portfolio1.portfolioId === portfolio2.portfolioId;
    }
  }

  /**
   * disable portfolio if selected group is LOAN_OFFICER
   * @param event groupEntity
   */
  changeGroup(event) {
    const selectedGroupEntity = this.groupEntitys.find(
      groupEntity => groupEntity.code === this.groupForm.controls.group.value
    );
  
    const isLinkedPortfolio = selectedGroupEntity?.linkedPortfolio;
    this.displayPortfolio = !isLinkedPortfolio;
  
    this.groupForm.controls.portfolio.setValue(
      isLinkedPortfolio ? '' : new PortfolioEntity()
    );
  }
  
  /**
   *  when branch is changed : filter responsible list with responsibles of selected branch
   */
  branchChanged() {
    const userParams = new UserEntity();
    userParams.branchID = this.groupForm.controls.branche.value;
    if (this.responsibleSelected !== undefined && this.responsibleSelected !== null) {
      this.responsibleSelected = null;
    }
    this.getListResponsible(userParams).then(() => {
      if (this.groupForm.controls.login.value !== null || this.groupForm.controls.login.value !== undefined) {
        this.responsibleList = this.responsibleList.filter(val => val.login !== this.groupForm.controls.login.value);
        if (this.responsibleSelected !== undefined && this.responsibleSelected !== null) {
          this.responsibleSelected = null;
        }
      }
    });
  }
  dateChanged() {
    if (this.groupForm.controls.hiringDate.value !== null && this.groupForm.controls.resigningDate.value !== null) {
      if (new Date(this.groupForm.controls.hiringDate.value) > new Date(this.groupForm.controls.resigningDate.value)) {
        this.devToolsServices.openToast(3, 'alert.hiringDateError');
      }
    }
  }
  /**
   * get list of responsibles
   * @param user UserEntity
   */
  async getListResponsible(user) {
    await this.settingsService.getResponsible(user).toPromise().then(
      (value) => {
        this.responsibleList = value;
        this.loading = false;
      }
    );
  }
  /**
   * open modal my Teams for supervisors
   * @param myTeams TeamModal
   * @param row user (Supervisor)
   */
  openMyTeam(myTeams, row) {

    const user: UserEntity = new UserEntity();
    const group: GroupeEntity = row.groupes[0];
    user.groupes = [];
    user.groupes.push(group);
    user.branchID = row.branchID;
    this.getListResponsible(user).then(() => {
      this.responsibleList = this.responsibleList.filter(val => val.login !== row.login);
    });
    this.supervisorName = row.fullName;
    this.myTeams(row.login);
    this.emptyResponsible = false;
    this.team = [];
    this.usersChangedResponsible = [];
    this.allTemporary = false;
    this.teamForm = this.formBuilder.group({
      responsible: ['', Validators.required],
      allTemporary: [this.allTemporary]
    });
    this.modal.open(myTeams, { size: 'lg' });
  }
  /**
   * load team by supervisor
   * @param username login
   */
  myTeams(username) {
    this.teamCols = [
      { field: 'login', header: 'setting.setting_users.login' },
      { field: 'nom', header: 'setting.setting_users.first-name' },
      { field: 'prenom', header: 'setting.setting_users.last-name' },
      { field: 'oldResponsableName', header: 'setting.setting_users.old_supervisor_name' },
      { field: 'temporaryResponsable', header: 'setting.setting_users.temporary' }
    ];
    this.teamsSelectedColumns = this.teamCols;
    const param: UserEntity = new UserEntity();
    param.responsableId = username;
    this.teamsPagination.params = param;
    this.selectedResponsible = username;
    this.settingsService.findUserPagination(this.teamsPagination).subscribe(
      (elements) => {
        this.teamsPagination = elements;
      }
    );
  }
  /**
   * change supervisor
   * @param user action on submit change Supervisor for users
   */
  changeSupervisor(selectedUsers) {
    if (selectedUsers === undefined || selectedUsers.length === 0) {
      this.devToolsServices.openToast(2, 'alert.no_users_selected');
    } else {
      this.emptyResponsible = false;
      this.devToolsServices.makeFormAsTouched(this.teamForm);
      if (this.teamForm.valid) {
        this.changeTemp(selectedUsers);
        this.settingsService.updateusersSupervisor(this.usersChangedResponsible).subscribe((data) => {
          this.usersChangedResponsible = [];
          let errorResponsible = false;
          data.forEach((d) => {
            if (d.loginAndName !== undefined && d.loginAndName.startsWith('KO')) {
              this.devToolsServices.openToastWithParameter(1, 'alert.responsible_loop_detected', d.loginAndName.replace('KO', ''));
              errorResponsible = true;
            } else {
              this.userPagination.resultsUsers.filter(u => u.login === d.login).forEach(userParam => {
                userParam.responsableId = d.responsableId;
              });
            }
          });
          if (!errorResponsible) {
            this.devToolsServices.openToast(0, 'alert.success');
            this.modal.dismissAll();
          }
        });
      } else {
        this.emptyResponsible = true;
      }
    }
  }
  /**
   * check all temporary
   * @param selectedUsers team
   */
  changeTemp(selectedUsers) {
    this.usersChangedResponsible = [];
    let temporaryResp = this.teamForm.controls.allTemporary.value === true;
      selectedUsers.forEach((u) => {
        u.temporaryResponsable = this.teamForm.controls.allTemporary.value;
        u.oldResponsibleId = u.responsableId;
        u.responsableId = this.teamForm.controls.responsible.value.login;
        this.usersChangedResponsible.push(u);
    });

  }
  /**
   * relaod table teams
   * @param event LazyLoadEvent
   */
  async reloadUserListTeams(event: LazyLoadEvent) {
    const userPaginationEntity: UserPaginationEntity = new UserPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    userPaginationEntity.pageSize = event.rows;
    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      userPaginationEntity.pageNumber = event.first;
    } else {
      userPaginationEntity.pageNumber = event.first / event.rows;
    }
    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const userParams: UserEntity = new UserEntity();
    userParams.responsableId = this.selectedResponsible;
    if (event.filters !== undefined) {
      userParams.login = event.filters.login !== undefined ? event.filters.login.value : null;
      userParams.nom = event.filters.nom !== undefined ? event.filters.nom.value : null;
      userParams.prenom = event.filters.prenom !== undefined ? event.filters.prenom.value : null;
      userParams.oldResponsableName = event.filters.oldResponsableName !== undefined ? event.filters.oldResponsableName.value : null;
      userParams.temporaryResponsable = event.filters.temporaryResponsable !== undefined ? event.filters.temporaryResponsable.value : null;
    }
    userPaginationEntity.params = userParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      userPaginationEntity.sortField = event.multiSortMeta[0].field;
      userPaginationEntity.sortDirection = event.multiSortMeta[0].order;
    }
    await this.settingsService.findUserPagination(userPaginationEntity).subscribe(
      (data) => {
        this.teamsPagination = data;
      }
    );
  }
  addPortfolio(modalContent) {
    this.action = 'create';
    this.PortfolioforUpdate = new PortfolioEntity();
    this.createFormPortfolio(this.PortfolioforUpdate);
    this.modal.open(modalContent);
  }

  onSubmitPortfolio() {
      if (this.groupFormPortfolio.valid) {
        
        this.PortfolioforUpdate.portfolioId = this.groupFormPortfolio.controls.portfolioId.value;
        this.PortfolioforUpdate.portfolioName = this.groupFormPortfolio.controls.portfolioName.value;
        this.PortfolioforUpdate.code = this.groupFormPortfolio.controls.code.value;
        console.log(this.PortfolioforUpdate);
        this.settingsService.SavePortfolio(this.PortfolioforUpdate).subscribe(
          (data) => {
            this.PortfolioforUpdate = data;
            this.devToolsServices.openToast(0, 'alert.success');
            this.groupFormPortfolio.reset();
            this.closeModal();
            this.settingsService.findPortfolioPagination(this.portfolioPagination).subscribe(
              (elements) => {
                this.portfolioPagination = elements;
              }
            );  
          }
        );
      }
  }

  async updatePortfolio(modalContent, portfolio: PortfolioEntity) {
    this.action ='update';
    this.PortfolioforUpdate = portfolio;
    await this.createFormPortfolio(portfolio);
    this.modal.open(modalContent);
  }
}
