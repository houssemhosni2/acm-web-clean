import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GroupeEntity } from 'src/app/shared/Entities/groupe.entity';
import { SettingsService } from '../settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { GroupePaginationEntity } from 'src/app/shared/Entities/groupePagination.entity';
import { LazyLoadEvent } from 'primeng/api';
import {MatDialog} from '@angular/material/dialog';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
const PrimaryBleu = 'var(--primary)';
@Component({
  selector: 'app-groupe',
  templateUrl: './groupe.component.html',
  styleUrls: ['./groupe.component.sass']
})
export class GroupeComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  public groupForm: FormGroup;
  public groupeEntitys: GroupeEntity[] = [];
  public groupeEntity: GroupeEntity = new GroupeEntity();
  public groupeReloadEntity: GroupeEntity = new GroupeEntity();
  public groupeEntityToDisable: GroupeEntity = new GroupeEntity();
  public page: number;
  public pageSize: number;
  public code: FormControl = new FormControl('', Validators.required);
  public label: FormControl = new FormControl('', Validators.required);
  public description: FormControl = new FormControl('', Validators.required);
  public codeUpdate: string;
  public enabled: boolean;
  public linkedPortfolio: boolean;
  loading: boolean;
  updateId = 0;
  public groupePaginationEntity: GroupePaginationEntity = new GroupePaginationEntity();
  public cols: any[];
  public selectedColumns: any[];
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  /**
   * constructor
   * @param modal NgbModal
   * @param router Router
   * @param dialog MatDialog
   * @param settingsService SettingsService
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService
   * @param library FaIconLibrary
   */
  constructor(public modal: NgbModal, public router: Router, public dialog: MatDialog,
              public settingsService: SettingsService, public formBuilder: FormBuilder,
              public devToolsServices: AcmDevToolsServices, public translate: TranslateService,
              public library: FaIconLibrary
              ) {

  }
  ngOnInit() {
    this.cols = [
      { field: 'code', header: 'setting.code' },
      { field: 'libelle', header: 'setting.label' },
      { field: 'description', header: 'setting.description' },
      { field: 'enabled', header: 'setting.status' },
      { field: 'linkedPortfolio', header: 'setting.LinkedToPortfolio' }

    ];

    // init pagination params
    this.selectedColumns = this.cols;
    const searchLoan = new GroupeEntity();
    this.loadGroupesByPaginations(searchLoan, 0, 10);

  }
  /**
   * Methode to create form
   */
  createForm() {
    this.groupForm = this.formBuilder.group({
      code: this.code,
      label: this.label,
      description: this.description,
    });
  }
  /**
   * Methode addGroup
   */
  addGroup(): void {
    this.updateId = 0;
    this.clearForm();
    this.createForm();
    this.modal.open(this.modalContent, { size: 'md' });
  }

  /**
   * Methode editEvent
   * @param groupeEntity GroupeEntity
   */
  editGroup(groupeEntity: GroupeEntity) {
    this.createForm();
    this.updateId = groupeEntity.idAcmGroup;
    this.codeUpdate = groupeEntity.code;
    this.enabled = groupeEntity.enabled;
    this.linkedPortfolio = groupeEntity.linkedPortfolio;
    this.groupForm.controls.code.setValue(groupeEntity.code);
    this.groupForm.controls.label.setValue(groupeEntity.libelle);
    this.groupForm.controls.description.setValue(groupeEntity.description);
    this.modal.open(this.modalContent, { size: 'md' });
  }

  /**
   * Methode reset
   */
  reset() {
    this.groupForm.reset();
    this.modal.dismissAll();
  }

  /**
   * Methode clearForm
   */
  clearForm() {
    this.code = new FormControl('', Validators.required);
    this.label = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
  }

  /**
   * Methode to onSubmit save or update group after validation
   */
  onSubmit() {
    if (this.groupForm.valid) {
      // update
      if (this.updateId !== 0) {
        this.update().then(() => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.loading = false;
        });
      } else {
        this.save().then(() => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.loading = false;
        });
      }
    }
  }

  /**
   * Methode to save
   */
  async save() {
    this.loading = true;
    const groupeEntity = new GroupeEntity();
    groupeEntity.code = this.groupForm.value.code;
    groupeEntity.libelle = this.groupForm.value.label;
    groupeEntity.description = this.groupForm.value.description;
    groupeEntity.linkedPortfolio = false;
    this.modal.dismissAll();
    await this.settingsService.createGroup(groupeEntity).toPromise().then(resultEntity => {
      this.reloadTable();
      this.clearForm();
    });
  }

  /**
   * Methode to update
   */
  async update() {
    this.loading = true;
    this.groupeEntity.idAcmGroup = this.updateId;
    this.groupeEntity.libelle = this.groupForm.value.label;
    this.groupeEntity.description = this.groupForm.value.description;
    this.modal.dismissAll();
    await this.settingsService.updateGroup(this.groupeEntity).toPromise().then(resultEntity => {
      this.reloadTable();
      this.clearForm();
      this.updateId = 0;
    });
  }

  /**
   * Methode openDialog
   * @param GroupeEntity groupeEntity
   */
  async openDialog(groupeEntity: GroupeEntity) {
    if (!groupeEntity.enabled) {
      this.groupeEntityToDisable.idAcmGroup = groupeEntity.idAcmGroup;
      this.groupeEntityToDisable.enabled = false;
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        panelClass: 'confirm-dialog-container',
        disableClose: true,
        data: {
          message: 'confirmation_dialog.disable_group'
        }
      });
      await dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.settingsService.updateGroupEnabled(this.groupeEntityToDisable).toPromise().then(resultEntity => {
            this.devToolsServices.openToast(0, 'alert.success');

            this.reloadTable();
          });
        }
      });
    } else {
      this.groupeEntityToDisable.idAcmGroup = groupeEntity.idAcmGroup;
      this.groupeEntityToDisable.enabled = true;
      await this.settingsService.updateGroupEnabled(this.groupeEntityToDisable).toPromise().then(resultEntity => {
        this.devToolsServices.openToast(0, 'alert.success');
      }
      );
    }
    this.reloadTable();
  }

  async openDialogLinkedPortfolio(groupeEntity: GroupeEntity) {
    if (!groupeEntity.linkedPortfolio) {
      this.groupeEntityToDisable.idAcmGroup = groupeEntity.idAcmGroup;
      this.groupeEntityToDisable.linkedPortfolio = false;
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        panelClass: 'confirm-dialog-container',
        disableClose: true,
        data: {
          message: 'confirmation_dialog.disable_Linked'
        }
      });
      await dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.settingsService.updateGroupLinkedPortfolio(this.groupeEntityToDisable).toPromise().then(resultEntity => {
            this.devToolsServices.openToast(0, 'alert.success');

            this.reloadTable();
          });
        }
      });
    } else {
      this.groupeEntityToDisable.idAcmGroup = groupeEntity.idAcmGroup;
      this.groupeEntityToDisable.linkedPortfolio = true;
      await this.settingsService.updateGroupLinkedPortfolio(this.groupeEntityToDisable).toPromise().then(resultEntity => {
        this.devToolsServices.openToast(0, 'alert.success');
      }
      );
    }
    this.reloadTable();
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * load list of loans by paginations
   * @param searchLoan searchLoan
   * @param page page
   * @param pageSize pageSize
   */
  async loadGroupesByPaginations(searchLoan: GroupeEntity, page: number, pageSize: number) {
    const groupePaginationEntityParms: GroupePaginationEntity = new GroupePaginationEntity();
    groupePaginationEntityParms.params = searchLoan;
    groupePaginationEntityParms.pageSize = pageSize;
    groupePaginationEntityParms.pageNumber = page;
    await this.settingsService.loadGroupeIbByStatusPagination(groupePaginationEntityParms).subscribe(
      (data) => {
        this.groupePaginationEntity = data;

      }

    );
  }
  /**
   * Methode to reloadTable
   */
  reloadTable() {
    const searchLoan = new GroupeEntity();
    this.loadGroupesByPaginations(searchLoan, this.groupePaginationEntity.pageNumber, 10);
  }

  /**
   * method used by pagination table to reload list by given filter / sort
   * @param event event
   */
  async reloadGroupesList(event: LazyLoadEvent) {

    const groupePaginationEntityParms: GroupePaginationEntity = new GroupePaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    groupePaginationEntityParms.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      groupePaginationEntityParms.pageNumber = event.first;
    } else {
      groupePaginationEntityParms.pageNumber = event.first / event.rows;
    }

    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const loanParams: GroupeEntity = new GroupeEntity();
    if (event.filters !== undefined) {
      loanParams.code = event.filters.code !== undefined ? event.filters.code.value : null;
      loanParams.description = event.filters.description !== undefined ? event.filters.description.value : null;
      loanParams.libelle = event.filters.libelle !== undefined ? event.filters.libelle.value : null;
      loanParams.enabled = event.filters.enabled !== undefined ? event.filters.enabled.value : null;
      loanParams.linkedPortfolio = event.filters.linkedPortfolio !== undefined ? event.filters.linkedPortfolio.value : null;
    }
    groupePaginationEntityParms.params = loanParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      groupePaginationEntityParms.sortField = event.multiSortMeta[0].field;
      groupePaginationEntityParms.sortDirection = event.multiSortMeta[0].order;
    }

    await this.settingsService.loadGroupeIbByStatusPagination(groupePaginationEntityParms).subscribe(
      (data) => {
        this.groupePaginationEntity = data;

      });

  }

}
