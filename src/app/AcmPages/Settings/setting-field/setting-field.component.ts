import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmIhmFieldEntity } from 'src/app/shared/Entities/acmIhmField.entity';
import { AcmIhmFormEntity } from 'src/app/shared/Entities/acmIhmForm.entity';
import { AcmIhmValidatorEntity } from 'src/app/shared/Entities/acmIhmValidator.entity';
import { HabilitationIhmRouteEntity } from 'src/app/shared/Entities/habilitationIhmRoute.entity';
import { SettingFieldService } from '../setting-fields.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {customRequiredValidator} from '../../../shared/utils';
import { SettingListEntity } from 'src/app/shared/Entities/AcmSettingList.entity';
import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-setting-field',
    templateUrl: './setting-field.component.html',
    styleUrls: ['./setting-field.component.sass']
})
export class SettingFieldComponent implements OnInit {
    public habilitationIhmRoutes: HabilitationIhmRouteEntity[];
    public ihmForms: AcmIhmFormEntity[];
    public ihmFields: AcmIhmFieldEntity[];
    public ihmRoutesForm: FormGroup;
    public ihmFormsForm: FormGroup;
    public acmIhmValidatorEntities: AcmIhmValidatorEntity[];
    public acmIhmValidatorEntitiesAll: AcmIhmValidatorEntity[] = [];
    public acmIhmValidatorSelected: AcmIhmValidatorEntity;
    public editIhmFieldForm: FormGroup;
    public code: FormControl = new FormControl('', Validators.required);
    public title: FormControl = new FormControl('', Validators.required);
    public description: FormControl = new FormControl('', Validators.required);
    public defaultValue: FormControl = new FormControl('');
    public type: FormControl = new FormControl('', Validators.required);
    public ordre: FormControl = new FormControl('', Validators.required);
    public validator: FormControl = new FormControl('');
    public placeholder: FormControl = new FormControl('');
    public formControlName: FormControl = new FormControl('', Validators.required);
    public subCodeField: FormControl = new FormControl('');
    public ihmRoute: FormControl = new FormControl('');
    public ihmForm: FormControl = new FormControl('');
    public listId: FormControl = new FormControl('');
    public showTable: boolean;
    public showForms: boolean;
    public selectedIhmField: AcmIhmFieldEntity;
    public typesField: string[] = ['TEXT', 'NUMBER', 'OPTIONS', 'MAIL', 'DATE'];
    public ihmAddForm: FormGroup;
    public idIhmRoute: HabilitationIhmRouteEntity = new HabilitationIhmRouteEntity();
    public ihmFormEntity: AcmIhmFormEntity = new AcmIhmFormEntity();
    public editForm: boolean;
    public editIhmField: boolean;
    public newAcmIhmFieldEntity: AcmIhmFieldEntity[] = [];
    settingList: SettingListEntity[] = [];
    filteredSettings: SettingListEntity[] = [];
    showList: boolean = false;

    constructor(public modal: NgbModal, public devToolsServices: AcmDevToolsServices,public settingsService: SettingsService,
                public settingFieldService: SettingFieldService, public formBuilder: FormBuilder,
                public translate: TranslateService,public library : FaIconLibrary) {
    }

    async ngOnInit() {
        const habilitationIhmRouteEntity = new HabilitationIhmRouteEntity();
        this.createIhmRouteForm();
        this.createIhmFormsForm();
        // get ihm routes
        await this.settingFieldService.getIHMHabilitation(habilitationIhmRouteEntity).subscribe(
            (data) => {
                this.habilitationIhmRoutes = data;
            }
        );
        // do not show fields table
        this.showTable = false;
        // do not show forms list(select input)
        this.showForms = false;

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

    /**
     * create ihm route form
     */
    createIhmRouteForm() {
        this.ihmRoutesForm = this.formBuilder.group({
            ihmRoute: this.ihmRoute,
        });
    }

    /**
     * create ihm forms form
     */
    createIhmFormsForm() {
        this.ihmFormsForm = this.formBuilder.group({
            ihmForm: this.ihmForm,
        });
    }

    /**
     *
     * when select ihm route => get appropriate forms
     * @param item HabilitationIhmRouteEntity
     */
    getFormsByIhmRoute(item: HabilitationIhmRouteEntity) {
        if (item !== undefined) {
            this.idIhmRoute = item;
            const acmIhmFormEntity = new AcmIhmFormEntity();
            acmIhmFormEntity.habilitationIHMRouteDTO = new HabilitationIhmRouteEntity();
            acmIhmFormEntity.habilitationIHMRouteDTO.id = item.id;
            acmIhmFormEntity.habilitationIHMRouteDTO.codeIHMRoute = item.codeIHMRoute;
            acmIhmFormEntity.needFields = false;
            this.settingFieldService.getForm(acmIhmFormEntity).subscribe((data) => {
                this.ihmForms = data;
                this.showForms = true;
                this.showTable = false;

            });
        }
    }

    /**
     *
     * when select form => get appropriate fields and show field table
     * @param item AcmIhmFormEntity
     */
    getFieldsByIhmForm(item: AcmIhmFormEntity) {
        if (item !== undefined) {
            this.newAcmIhmFieldEntity = [];
            const acmIhmFieldEntity = new AcmIhmFieldEntity();
            acmIhmFieldEntity.codeForm = item.codePage;
            this.ihmFormEntity = item;
            this.settingFieldService.getFields(acmIhmFieldEntity).subscribe((data) => {
                this.ihmFields = data.sort((a, b) => (a.ordre < b.ordre ? -1 : 1));
                this.showTable = true;
            });
        }
    }

    /**
     *
     * enable disable a field
     * @param ihmField AcmIhmFieldEntity
     */
    endableDisable(ihmField) {
        this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.disable_environnemet').afterClosed().subscribe(res => {
            if (res) {
                this.settingFieldService.updateField(ihmField).subscribe();
            } else {
                ihmField.enabled = !ihmField.enabled;
            }
        });
    }

    /**
     * create edit field form
     */
    createEditFieldForm() {
        this.editIhmFieldForm = this.formBuilder.group({
            code: this.code,
            title: this.title,
            description: this.description,
            type: this.type,
            validator: this.validator,
            defaultValue: this.defaultValue,
            placeholder: this.placeholder,
            formControlName: this.formControlName,
            subCodeField: this.subCodeField,
            ordre: this.ordre,
            listId: this.listId
        });
    }

    /**
     *
     * edit selected field
     * @param ihmField AcmIhmFieldEntity
     */
    editField(content, ihmField) {
        this.editIhmField = true;
        this.createEditFieldForm();
        this.selectedIhmField = ihmField;
        this.editIhmFieldForm.controls.code.setValue(ihmField.codeField);
        this.editIhmFieldForm.controls.title.setValue(ihmField.titre);
        this.editIhmFieldForm.controls.description.setValue(ihmField.description);
        this.editIhmFieldForm.controls.type.setValue(ihmField.typeField);
        this.editIhmFieldForm.controls.placeholder.setValue(ihmField.placeholder);
        this.editIhmFieldForm.controls.defaultValue.setValue(ihmField.defaultValue);
        this.editIhmFieldForm.controls.formControlName.setValue(ihmField.formControlName);
        this.editIhmFieldForm.controls.subCodeField.setValue(ihmField.subCodeField);
        this.editIhmFieldForm.controls.ordre.setValue(ihmField.ordre);
        this.editIhmFieldForm.controls.listId.setValue(ihmField.listId);

        const acmIhmValidator = new AcmIhmValidatorEntity();
        this.settingFieldService.getIhmValidators(acmIhmValidator).subscribe((data) => {
            this.acmIhmValidatorEntitiesAll = data;
            this.onChangeTypeField(ihmField.typeField);
        });
        this.modal.open(content, {
            size: 'xl'
        });
    }

    /**
     * edit field
     */
    edit() {
        if (this.editIhmField) {
            this.selectedIhmField.codeField = this.editIhmFieldForm.controls.code.value;
            this.selectedIhmField.titre = this.editIhmFieldForm.controls.title.value;
            this.selectedIhmField.description = this.editIhmFieldForm.controls.description.value;
            this.selectedIhmField.defaultValue = this.editIhmFieldForm.controls.defaultValue.value;
            this.selectedIhmField.typeField = this.editIhmFieldForm.controls.type.value;
            this.selectedIhmField.placeholder = this.editIhmFieldForm.controls.placeholder.value;
            this.selectedIhmField.formControlName = this.editIhmFieldForm.controls.formControlName.value;
            this.selectedIhmField.subCodeField = this.editIhmFieldForm.controls.subCodeField.value;
            this.selectedIhmField.ordre = this.editIhmFieldForm.controls.ordre.value;
            this.selectedIhmField.listId = this.editIhmFieldForm.controls.listId?.value ? this.editIhmFieldForm.controls.listId.value : '';
            this.settingFieldService.updateField(this.selectedIhmField).subscribe(() => {
                this.modal.dismissAll();
            });
        } else {
            const acmIhmFieldEntity: AcmIhmFieldEntity = new AcmIhmFieldEntity();
            acmIhmFieldEntity.codeField = this.editIhmFieldForm.controls.code.value;
            acmIhmFieldEntity.titre = this.editIhmFieldForm.controls.title.value;
            acmIhmFieldEntity.description = this.editIhmFieldForm.controls.description.value;
            acmIhmFieldEntity.defaultValue = this.editIhmFieldForm.controls.defaultValue.value;
            acmIhmFieldEntity.typeField = this.editIhmFieldForm.controls.type.value;
            acmIhmFieldEntity.placeholder = this.editIhmFieldForm.controls.placeholder.value;
            acmIhmFieldEntity.validators = this.selectedIhmField.validators;
            acmIhmFieldEntity.acmIhmFormDTO = this.ihmFormEntity;
            acmIhmFieldEntity.enabled = true;
            acmIhmFieldEntity.formControlName = this.editIhmFieldForm.controls.formControlName.value;
            acmIhmFieldEntity.subCodeField = this.editIhmFieldForm.controls.subCodeField.value;
            acmIhmFieldEntity.ordre = this.editIhmFieldForm.controls.ordre.value;
            this.selectedIhmField.listId = this.editIhmFieldForm.controls.listId?.value ? this.editIhmFieldForm.controls.listId.value : '';
            this.newAcmIhmFieldEntity.push(acmIhmFieldEntity);
            this.modal.dismissAll();
        }
    }

    /**
     *
     * when select type field => display the appropriate typa of validators in edit field form
     * @param event string
     */
    onChangeTypeField(event) {
        switch (event) {
            case 'TEXT': {
                this.acmIhmValidatorEntities = this.acmIhmValidatorEntitiesAll.filter(obj => obj.typeValidator !== AcmConstants.MIN &&
                    obj.typeValidator !== AcmConstants.MAX);
                    this.showList = false;

                break;
            }
            case 'MAIL': {
                this.acmIhmValidatorEntities = this.acmIhmValidatorEntitiesAll.filter(obj => obj.typeValidator === AcmConstants.REQUIRED ||
                    obj.typeValidator === AcmConstants.EMAIL);
                    this.showList = false;
                break;
            }
            case 'NUMBER': {
                this.acmIhmValidatorEntities = this.acmIhmValidatorEntitiesAll.filter(obj => obj.typeValidator
                    !== AcmConstants.PATTERN_STRING &&
                    obj.typeValidator !== AcmConstants.PATTERN_REGEXP && obj.typeValidator !== AcmConstants.EMAIL);
                    this.showList = false;
                break;
            }
            case 'OPTIONS': {
                this.showList = true;
                this.acmIhmValidatorEntities = this.acmIhmValidatorEntitiesAll.filter(obj => obj.typeValidator === AcmConstants.REQUIRED);
                break;
            }
            case 'DATE': {
                this.acmIhmValidatorEntities = this.acmIhmValidatorEntitiesAll.filter(obj => obj.typeValidator === AcmConstants.REQUIRED ||
                    obj.typeValidator === AcmConstants.MIN ||
                    obj.typeValidator === AcmConstants.MAX);
                    this.showList = false;
                break;
            }
            default: {
                this.acmIhmValidatorEntities = this.acmIhmValidatorEntitiesAll;
                this.showList = false;
            }
        }
    }

    getDirection() {
        return AppComponent.direction;
    }

    /**
     * add validator
     * @param event any
     */
    onChangeValidator(event) {
        this.selectedIhmField.validators.push(this.editIhmFieldForm.controls.validator.value);
    }

    /**
     *
     * @param type1 string
     * @param type2 string
     * @returns boolean
     */
    compareFieldType(type1, type2) {
        return type1 === type2;
    }

    /**
     *
     * remove validator
     * @param index number
     */
    remove(index) {
        this.selectedIhmField.validators.splice(index, 1);
    }

    /**
     * close modal
     */
    closeModale() {
        this.modal.dismissAll();
    }

    /**
     * add Ihm Form
     * @param modalAddIhmForm Modal
     */
    addIhmForm(modalAddIhmForm) {
        this.createIhmForm();
        this.modal.open(modalAddIhmForm, {
            size: 'xl'
        });
    }

    /**
     * create create Ihm Form
     */
    createIhmForm() {
        this.editForm = false;
        this.ihmAddForm = this.formBuilder.group({
            code: ['', customRequiredValidator],
            description: ['', customRequiredValidator],
            enable: [true, customRequiredValidator],
        });
    }

    /**
     * save new IHM Form
     */
    saveIhmForm() {
        if (this.ihmAddForm.valid) {
            if (this.editForm) {
                this.ihmFormEntity.codePage = this.ihmAddForm.controls.code.value;
                this.ihmFormEntity.description = this.ihmAddForm.controls.description.value;
                this.ihmFormEntity.enabled = this.ihmAddForm.controls.enable.value;
                this.settingFieldService.editIhmForm(this.ihmFormEntity).subscribe(
                    (data) => {
                        for (let i = 0; i++; i < this.ihmForms.length) {
                            if (this.ihmForms[i].id === data.id) {
                                this.ihmForms[i] = data;
                            }
                        }
                        this.modal.dismissAll();
                    }
                );
            } else {
                const acmIhmFormEntity = new AcmIhmFormEntity();
                acmIhmFormEntity.codePage = this.ihmAddForm.controls.code.value;
                acmIhmFormEntity.description = this.ihmAddForm.controls.description.value;
                acmIhmFormEntity.habilitationIHMRouteDTO = new HabilitationIhmRouteEntity();
                acmIhmFormEntity.habilitationIHMRouteDTO = this.idIhmRoute;
                acmIhmFormEntity.enabled = this.ihmAddForm.controls.enable.value;
                this.settingFieldService.addIhmForm(acmIhmFormEntity).subscribe(
                    (data) => {
                        this.ihmForms.push(data);
                        this.modal.dismissAll();
                    }
                );
            }
        }
    }

    /**
     * edit Ihm Form
     * @param modalAddIhmForm Modal
     */
    editIhmForm(modalAddIhmForm) {
        this.editForm = true;
        this.ihmAddForm = this.formBuilder.group({
            code: [this.ihmFormEntity.codePage, Validators.required],
            description: [this.ihmFormEntity.description, Validators.required],
            enable: [this.ihmFormEntity.enabled, Validators.required],
        });
        this.modal.open(modalAddIhmForm, {
            size: 'xl'
        });
    }

    /**
     * add Ihm Fields
     * @param modalContent Modal
     */
    addIhmFields(modalContent) {
        this.editIhmField = false;
        this.editIhmFieldForm = this.formBuilder.group({
            code: [''],
            title: [''],
            formControlName: [''],
            subCodeField: [''],
            description: [''],
            defaultValue: [''],
            type: [''],
            validator: [''],
            placeholder: [''],
            ordre: [''],
            listId: ['']
        });
        this.selectedIhmField = new AcmIhmFieldEntity();
        this.selectedIhmField.validators = [];
        const acmIhmValidator = new AcmIhmValidatorEntity();
        this.settingFieldService.getIhmValidators(acmIhmValidator).subscribe((data) => {
            this.acmIhmValidatorEntitiesAll = data;
            this.modal.open(modalContent, {
                size: 'xl'
            });
        });
    }

    /**
     * save New Fields
     */
    saveNewFields() {
        this.settingFieldService.saveAllFields(this.newAcmIhmFieldEntity).subscribe(
            (data) => {
                this.newAcmIhmFieldEntity = [];
                data.forEach(
                    (field) => {
                        this.ihmFields.push(field);
                    }
                );
            }
        );
    }
}
