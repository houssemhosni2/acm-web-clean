import { Component, OnInit, Input } from "@angular/core";

import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";

import { SharedService } from "src/app/shared/shared.service";
import { checkOfflineMode } from "src/app/shared/utils";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { UdfService } from "../../Loan-Application/udf/udf.service";
import { GnericWorkflowObjectWorkflow } from "src/app/shared/Entities/GnericWorkflowObjectWorkflow.entity";
import { GenericWorkFlowObject } from "src/app/shared/Entities/GenericWorkFlowObject";
import { SettingsService } from "../settings.service";

@Component({
  selector: "app-generic-wf-setting-workflow",
  templateUrl: "./generic-wf-setting-workflow.component.html",
  styleUrls: ["./generic-wf-setting-workflow.component.sass"],
})
export class GenericWfSettingWorkflowComponent implements OnInit {
  @Input() orderWf;
  @Input() idWorkFlow;
  @Input() type; // 1 - Loan and Topup 2- Collection 3- Legal
  @Input() category;

  public genericObjectWfForm: FormGroup = this.formBuilder.group({});
  public genericObjectWfForms: FormGroup[] = [];

  public gnericWorkflowObjectWorkflows: GnericWorkflowObjectWorkflow[] = [];

  indexFormUdf = 0;
  indexFormUdfField = 0;

  /**
   * constructor
   *
   * @param udfService UdfService
   * @param formBuilder FormBuilder
   * @param sharedService SharedService
   */
  constructor(
    public udfService: UdfService,
    public formBuilder: FormBuilder,
    public library: FaIconLibrary,
    public sharedService: SharedService,
    public devToolsServices: AcmDevToolsServices,
    private dbService: NgxIndexedDBService,
    public settingsService: SettingsService
  ) {}

  async ngOnInit() {
    this.settingsService.findWorkFlowObjects().subscribe((item) => {
      this.genericWorkflowObjects = item;
      this.settingsService
        .findGenericWFByStep(this.category, this.idWorkFlow)
        .subscribe((res) => {
          this.gnericWorkflowObjectWorkflows = res;
          if (this.gnericWorkflowObjectWorkflows) {
            for (const gw of this.gnericWorkflowObjectWorkflows) {
              this.genericObjectWfForms.push(this.updateForm(gw));
            }
          }
        });
    });
  }

  compare(arg1, arg2) {
    return arg1.id == arg2.id;
  }
  //
  updateForm(gw: GnericWorkflowObjectWorkflow): FormGroup {
    return this.formBuilder.group({
      genericWorkFlow: [
        this.genericWorkflowObjects.filter(
          (item) => item.id === gw.idGenericWorkflowObject
        )[0],
        Validators.required,
      ],
      priority: [gw.priority, Validators.required],
      orderStep: [this.orderWf],
      idStep: [gw.idStep],
    });
  }

  /**
   * Create udf Form
   */
  createForm(): FormGroup {
    return this.formBuilder.group({
      genericWorkFlow: ["", Validators.required],
      priority: ["", Validators.required],
      orderStep: [this.orderWf],
    });
  }

  addForm() {
    this.genericObjectWfForms.push(this.createForm());
  }

  /**
   * Delete Group
   * @param i Index
   */
  deleteGroupe(i: number) {
    this.genericObjectWfForms.splice(i, 1);
  }

  /**
   * Methode clearForm
   */
  clearForm() {
    this.genericObjectWfForm.reset();
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
  genericWorkflowObjects: GenericWorkFlowObject[] = [];
  findAllGnericWfObject() {
    this.settingsService.findWorkFlowObjects().subscribe((item) => {
      this.genericWorkflowObjects = item;
    });
  }
}
