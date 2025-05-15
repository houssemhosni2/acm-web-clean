import { LazyLoadEvent } from 'primeng/api';
import { SettingThirdPartyPaginationEntity } from '../../../shared/Entities/SettingThirdPartyPaginations.entity';
import { SettingThirdPartyEntity } from '../../../shared/Entities/settingThirdParty.entity';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from '../settings.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserEntity } from '../../../shared/Entities/user.entity';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AppComponent } from '../../../app.component';
import { BrancheEntity } from '../../../shared/Entities/branche.entity';
import { AcmDevToolsServices } from '../../../shared/acm-dev-tools.services';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { AcmConstants } from '../../../shared/acm-constants';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-setting-third-party',
  templateUrl: './setting-third-party.component.html',
  styleUrls: ['./setting-third-party.component.sass'],
})
export class SettingThirdPartyComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public cols: any[];
  public thirdParty: SettingThirdPartyEntity[];
  public selectedColumns: any[];
  public teamsSelectedColumns: any[];
  public pageSize: number;
  public page: number;
  public loading = true;
  public branchesAcces = null;
  public thirdPartyforUpdate: SettingThirdPartyEntity;
  public groupForm: FormGroup;
  public brancheEntitys: BrancheEntity[] = [];
  public settingThirdPartyPagination: SettingThirdPartyPaginationEntity =
    new SettingThirdPartyPaginationEntity();
  public user: UserEntity;
  public emailMask = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
  public enabled: boolean;
  public settingThirdPartyEntity: SettingThirdPartyEntity;
  configBranches = {
    displayKey: 'description', // if objects array passed which key to be displayed defaults to description
    search: true,
    placeholder: ' ',
  };
  branchesArray: BrancheEntity[] = [];
  public emptyResponsible = false;

  public currentPath = 'setting-third-party';
  /**
   *
   * @param settingsService SettingsService
   * @param translate TranslateService
   * @param modal NgbModal
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   * @param library FaIconLibrary
   */
  constructor(
    public settingsService: SettingsService,
    public translate: TranslateService,
    public modal: NgbModal,
    public formBuilder: FormBuilder,
    public devToolsServices: AcmDevToolsServices,
    public library: FaIconLibrary,
    public sharedService: SharedService,
    public router: Router
  ) { }

  ngOnInit() {
    this.cols = [
      { field: 'firstName', header: 'setting.setting_users.first-name' },
      { field: 'lastName', header: 'setting.setting_users.last-name' },
      { field: 'email', header: 'customer.email' },
      { field: 'addressParty', header: 'customer.address' },
      { field: 'code_postal', header: 'customer_management.zip_code' },
      { field: 'phoneNumber', header: 'customer.telephone' },
      { field: 'type', header: 'collaterol.type' },
      { field: 'statut', header: 'setting.status' },
      { field: 'numero_rne', header: 'RNE' },
      { field: 'pays', header: 'customer_management.country' },
      { field: 'ville', header: 'customer_management.region' },
      { field: 'enabled', header: 'setting.status' },
    ];

    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;

    this.settingThirdPartyPagination.params = new SettingThirdPartyEntity();

    this.sharedService.resetThirdParty();

    this.settingsService.findSettingThirdPartyPagination(this.settingThirdPartyPagination)
      .subscribe((elements) => {
        this.settingThirdPartyPagination = elements;
      });
  }

  /**
   * reloadThirdPartyList
   * @param $event Event
   */
  async reloadThirdPartyList(event: LazyLoadEvent) {
    const settingThirdPartyPaginationEntity: SettingThirdPartyPaginationEntity =
      new SettingThirdPartyPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    settingThirdPartyPaginationEntity.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      settingThirdPartyPaginationEntity.pageNumber = event.first;
    } else {
      settingThirdPartyPaginationEntity.pageNumber = event.first / event.rows;
    }
    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const thirdPartyParams: SettingThirdPartyEntity =
      new SettingThirdPartyEntity();
    if (event.filters !== undefined) {
      thirdPartyParams.firstName =
        event.filters.firstName !== undefined
          ? event.filters.firstName.value
          : null;
      thirdPartyParams.lastName =
        event.filters.lastName !== undefined
          ? event.filters.lastName.value
          : null;
      thirdPartyParams.email =
        event.filters.email !== undefined ? event.filters.email.value : null;
      thirdPartyParams.addressParty =
        event.filters.addressParty !== undefined
          ? event.filters.addressParty.value
          : null;
      thirdPartyParams.code_postal =
        event.filters.code_postal !== undefined
          ? event.filters.code_postal.value
          : null;
      thirdPartyParams.phoneNumber =
        event.filters.phoneNumber !== undefined
          ? event.filters.phoneNumber.value
          : null;
      thirdPartyParams.type =
        event.filters.type !== undefined
          ? event.filters.type.value
          : null;
      thirdPartyParams.statut =
        event.filters.statut !== undefined
          ? event.filters.statut.value
          : null;
      thirdPartyParams.numero_rne =
        event.filters.numero_rne !== undefined
          ? event.filters.numero_rne.value
          : null;
      thirdPartyParams.pays =
        event.filters.pays !== undefined
          ? event.filters.pays.value
          : null;
      thirdPartyParams.ville =
        event.filters.ville !== undefined
          ? event.filters.ville.value
          : null;
      thirdPartyParams.enabled =
        event.filters.enabled !== undefined
          ? event.filters.enabled.value
          : null;
    }
    settingThirdPartyPaginationEntity.params = thirdPartyParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      settingThirdPartyPaginationEntity.sortField =
        event.multiSortMeta[0].field;
      settingThirdPartyPaginationEntity.sortDirection =
        event.multiSortMeta[0].order;
    }

    await this.settingsService
      .findSettingThirdPartyPagination(
        settingThirdPartyPaginationEntity
      )
      .subscribe((data) => {
        this.settingThirdPartyPagination = data;
      });
  }


  thirdPartyUpdate(rowData) {
    this.sharedService.setThirdParty(rowData);
    this.router.navigate([AcmConstants.EDIT_THIRD_PARTY],  { queryParams: { source: 'EDIT' } });
  }

  /**
   * change status of third party
   * @param SettingThirdPartyEntity SettingThirdPartyEntity
   */
  endableDisable(thirdPartyforUpdate: SettingThirdPartyEntity) {
    this.settingsService
        .updateEnableSettingThirdParty(thirdPartyforUpdate)
        .toPromise().then(() => {
          this.devToolsServices.openToast(0, 'alert.success');
        }).finally(()=> this.ngOnInit());

  }

}
