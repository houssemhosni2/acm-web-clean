import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { AppComponent } from "src/app/app.component";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
import { EchelleEntity } from "src/app/shared/Entities/echelle.entity ";
import { SettingTypeRiskEntity } from "src/app/shared/Entities/settingTypeRisk.entity";
import { SettingsService } from "../settings.service";
import {customRequiredValidator} from '../../../shared/utils';


@Component({
  selector: "app-setting-type-risk",
  templateUrl: "./setting-type-risk.component.html",
  styleUrls: ["./setting-type-risk.component.sass"],
})
export class SettingTypeRiskComponent implements OnInit {
  public settingTypeRisk: SettingTypeRiskEntity[] = [];
  public groupForm: FormGroup;
  public popuppMode: string;

  constructor(
    public settingsService: SettingsService,
    public library: FaIconLibrary,
    public translate: TranslateService,
    public modal: NgbModal,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public devToolsServices: AcmDevToolsServices
  ) {}

  ngOnInit(): void {
    this.settingsService.findAllSettingRiskType().subscribe((data) => {
      this.settingTypeRisk = data;
      this.settingTypeRisk.forEach((item) => {
        item.echelleListString = item.echelleTypeRisks
          .map((obj) => obj.label)
          .join(", ");
      });
    });
  }

  public showCheckbox = false;
  public messageDisplayed;

  endableDisable(settingTypeRiskEntity: SettingTypeRiskEntity) {
    this.settingsService
      .updateSettingRiskType(settingTypeRiskEntity)
      .subscribe((data) => {
        console.log(data);
      });
  }
  addRiskType(modalContent: TemplateRef<any>) {
    // this.getJournals();

    this.createForm(new SettingTypeRiskEntity());
    this.popuppMode = "ADD";

    this.modal.open(modalContent, {
      size: "lg",
    });
  }
  createForm(settingTypeRiskEntity: SettingTypeRiskEntity) {
    if (this.popuppMode === "UPDATE") {
      this.groupForm = this.formBuilder.group({
        label: settingTypeRiskEntity.label,
        description: settingTypeRiskEntity.description,
      });
    } else {
      this.echelleForm = new FormGroup({});
      this.groupForm = this.formBuilder.group({
        label: ["", customRequiredValidator],
        description: "",
      });
    }
  }
  createFormEchelle(echelles: EchelleEntity[]) {
    this.echelleForm = new FormGroup({});
    if (this.popuppMode === "UPDATE") {
      for (var i = 0; i < echelles.length; i++) {
        this.echelleForm.addControl(
          "label" + i,
          new FormControl(echelles[i].label, Validators.required)
        );
        this.echelleForm.addControl(
          "description" + i,
          new FormControl(echelles[i].description, Validators.required)
        );
        this.echelleForm.addControl("forDelete" + i, new FormControl(false));
      }
      this.echelleList = this.settingRiskTypeForUpdate.echelleTypeRisks;
    }
  }
  closeModale() {
    this.modal.dismissAll();
    this.echelleList = [];
    this.echelleForm = new FormGroup({});
  }
  getDirection() {
    return AppComponent.direction;
  }
  onSubmit() {
    this.devToolsServices.makeFormAsTouched(this.groupForm);
    if (this.groupForm.valid) {
      if (this.popuppMode === "UPDATE") {
        this.settingRiskTypeForUpdate.label =
          this.groupForm.controls.label.value;
        this.settingRiskTypeForUpdate.description =
          this.groupForm.controls.description.value;
        for (let i = 0; i < this.echelleList.length; i++) {
          const echelle = new EchelleEntity();
          echelle.description =
            this.echelleForm.controls["description" + i].value;
          echelle.label = this.echelleForm.controls["label" + i].value;
          this.echelleList[i] = echelle;
        }
        this.settingRiskTypeForUpdate.echelleTypeRisks = this.echelleList;
        this.settingsService
          .updateSettingRiskType(this.settingRiskTypeForUpdate)
          .subscribe((data) => {
            console.log(data);
            this.closeModale();
            this.ngOnInit();
          });
      } else {
        const riskType: SettingTypeRiskEntity = new SettingTypeRiskEntity();
        riskType.label = this.groupForm.controls.label.value;
        riskType.description = this.groupForm.controls.description.value;
        for (let i = 0; i < this.echelleList.length; i++) {
          const echelle = new EchelleEntity();
          echelle.description =
            this.echelleForm.controls["description" + i].value;
          echelle.label = this.echelleForm.controls["label" + i].value;
          riskType.echelleTypeRisks.push(echelle);
        }

        this.settingsService.SaveSettingRiskType(riskType).subscribe((data) => {
          console.log(data);
          this.closeModale();
          this.ngOnInit();
        });
      }
    }
  }
  settingRiskTypeForUpdate: SettingTypeRiskEntity;
  updateRiskType(
    modalContent: TemplateRef<any>,
    settingRiskType: SettingTypeRiskEntity
  ) {
    this.settingRiskTypeForUpdate = settingRiskType;
    this.popuppMode = "UPDATE";
    this.createForm(settingRiskType);
    this.createFormEchelle(settingRiskType.echelleTypeRisks);
    this.modal.open(modalContent, {
      size: "lg",
    });
  }

  deleteRiskType(index: SettingTypeRiskEntity) {
    this.devToolsServices
      .openConfirmDialogWithoutRedirect("Delete type risque")
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.settingsService.deleteSettingRiskType(index.id).subscribe(() => {
            this.devToolsServices.openToast(0, "alert.success");
            this.ngOnInit();
          });
        }
      });
  }
  public echelleForm: FormGroup;
  echelleList: EchelleEntity[] = [];
  deleteEchelle(index, echelle) {
    this.echelleForm.removeControl("description" + index);
    this.echelleForm.removeControl("user" + index);
    this.echelleForm.removeControl("approvalConditionDate" + index);
    this.echelleList.splice(index, 1);
    echelle.forDelete = true;
  }

  addEchelle() {
    this.echelleForm.addControl(
      "label" + this.echelleList.length,
      new FormControl("", Validators.required)
    );
    this.echelleForm.addControl(
      "description" + this.echelleList.length,
      new FormControl("", Validators.required)
    );
    this.echelleForm.addControl(
      "forDelete" + this.echelleList.length,
      new FormControl(false)
    );
    this.echelleList.push(new EchelleEntity());
  }
}
