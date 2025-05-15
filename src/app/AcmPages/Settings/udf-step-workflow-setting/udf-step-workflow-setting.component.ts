import { WorkflowStepUdfGroupeEntity } from 'src/app/shared/Entities/WorkflowStepUdfGroupe.entity';

import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { UdfService } from '../../Loan-Application/udf/udf.service';

@Component({
  selector: 'app-udf-step-workflow-setting',
  templateUrl: './udf-step-workflow-setting.component.html',
  styleUrls: ['./udf-step-workflow-setting.component.sass']
})
export class UdfStepWorkflowSettingComponent implements OnInit {

  @Input() idWorkflowStep;
  @Input() workflowStepUdfGroupe;
  @Input() type; // 1 - Loan and Topup 2- Collection 3- Legal 4- PROSPECTION

  udfForm: FormGroup;
  public udfGroup: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
  public udfGroups: UserDefinedFieldGroupEntity[] = [];
  udfFields: UserDefinedFieldsEntity[][] = [];
  public udfField: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
  listUDFGroups: UserDefinedFieldGroupEntity[] = [];

  public udfSettingNationality: UserDefinedFieldsEntity[] = [];

  indexFormUdf = 0;
  indexFormUdfField = 0;


  /**
   * constructor
   *
   * @param udfService UdfService
   * @param formBuilder FormBuilder
   * @param sharedService SharedService
   */
  constructor(public udfService: UdfService, public formBuilder: FormBuilder, public library: FaIconLibrary,
    public sharedService: SharedService, public devToolsServices: AcmDevToolsServices,
    private dbService: NgxIndexedDBService) {
  }

  ngOnInit() {
    this.createForm();
    this.initializeUDFGroup(this.workflowStepUdfGroupe);
  }

  initializeUDFGroup(workflowStepUdfGroup: WorkflowStepUdfGroupeEntity[]) {
    if (this.workflowStepUdfGroupe?.length > 0) {
      this.indexFormUdf = 0;
      this.getUdfGroup(this.indexFormUdf);
      let udfGroupsList = workflowStepUdfGroup.filter(item => item.idUserDefinedFields === null);
      // Get the FormArray controls for udfGroups
      const udfGroupsArray = this.udfForm.get('udfGroups') as FormArray;
      udfGroupsList.map((item) => {
        this.listUDFGroups.push(new UserDefinedFieldGroupEntity());
        // Create a new FormGroup for the UDF group
        const udfGroupControl = this.formBuilder.group({
          udfGroup: new FormControl(item.idUserDefinedFieldGroup),
          udfGroupMandatory: new FormControl(item.mandatory !== null ? item.mandatory : false ),
          udfFields: this.formBuilder.array([]), // Create a FormArray for udfFields
          displayInIB: new FormControl(item.displayInIB !== null ? item.displayInIB : false)
        });
        // Push the new FormGroup into the udfGroups FormArray
        udfGroupsArray.push(udfGroupControl);
        this.getUdfFiledList(this.indexFormUdf, true, item.idUserDefinedFieldGroup);
        this.indexFormUdf++;
      })
    }
    else {
      this.indexFormUdf = 0;
      this.listUDFGroups = [];
      this.udfGroups = [];
      this.udfFields = [];
      this.udfFields.length = 0;
      this.getUdfGroup(this.indexFormUdf);
    }
  }

  /**
   * Create udf Form
   */
  createForm() {
    this.udfForm = this.formBuilder.group({
      udfGroups: this.formBuilder.array([]) // Create an empty FormArray
    });
  }

  /**
   * load user defined group
   */
  getUdfGroup(indexFormUdf) {
    if (indexFormUdf !== '') {
      this.udfGroup = this.listUDFGroups[indexFormUdf];
    }
    if (this.udfGroup === undefined) {
      this.udfGroup = new UserDefinedFieldGroupEntity();
    }


    if(this.type === "1"){
      this.udfGroup.category = "loan"
    }
    else if( this.type === "2"){
      this.udfGroup.category = "collection"
    }
    else if( this.type === "3"){
      this.udfGroup.category = "legal"
    }
    else if (this.type ==='4'){
      this.udfGroup.category = "others"
    }

    this.udfService.getUdfGroup(this.udfGroup).subscribe(
        (data) => {
          this.udfGroups = data;
        });


  }

  /**
  * load user defined field
  */
  async getUdfFiledList(j: number, init: boolean, groupId: number) {
    // if (init) {
    //   this.udfGroups.forEach((udfgroup) => {
    //     if (udfgroup.id === +this.udfForm.get('udfGroups.' + j + '.udfGroup').value) {
    //       this.listUDFGroups[j].mondatory = udfgroup.mondatory;
    //     }
    //   });
    // }

    if (!init) {
      const udfFieldsArray = this.udfForm.get('udfGroups.' + j + '.udfFields') as FormArray;
      udfFieldsArray.clear();
    }

    this.udfFields[j] = [];
    this.udfField.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();

    if (init) {
      this.udfField.userDefinedFieldGroupDTO.id = groupId;
    } else if (this.udfForm.get('udfGroups.' + j + '.udfGroup').value) {
      // check if value NOT : null | undefined | NaN | Empty ("") | 0 | false
      this.udfField.userDefinedFieldGroupDTO.id = this.udfForm.get('udfGroups.' + j + '.udfGroup').value;
    } else {
      this.udfField.userDefinedFieldGroupDTO.id = 0;
    }

    let udfGroupsField = this.workflowStepUdfGroupe.filter(item => item.idUserDefinedFieldGroup === groupId && item.idUserDefinedFields !== null);

    // load udf field
    if (this.udfField.userDefinedFieldGroupDTO.id !== 0) {

      await this.udfService.getUdfField(this.udfField).subscribe(
        (data) => {
          this.udfFields[j] = data;

          this.udfFields[j].map((item) => {
            item.mandatory = udfGroupsField.filter(item1 => item1.idUserDefinedFields === item.id)[0]?.mandatory;
          });

          const udfFieldsArray = this.udfForm.get('udfGroups.' + j + '.udfFields') as FormArray;

          for (let i = 0; i < this.udfFields[j].length; i++) {
            let fieldControl = this.formBuilder.group({
              id: new FormControl(this.udfFields[j][i].id),
              description: new FormControl(this.udfFields[j][i].description),
              mandatory: new FormControl(this.udfFields[j][i].mandatory !== undefined ? this.udfFields[j][i].mandatory : true ),
            });
            udfFieldsArray.push(fieldControl);
          }
        }
      );
    }
  }



  /**
   * add a new udf group
   */
  addUdf() {
    this.listUDFGroups.push(new UserDefinedFieldGroupEntity());
    this.udfFields[this.indexFormUdf] = [];
    const udfGroupControl = this.formBuilder.group({
      udfGroup: new FormControl(),
      udfGroupMandatory: new FormControl(false),
      udfFields: this.formBuilder.array([]), // Create a FormArray for udfFields
      displayInIB : new FormControl(false)
    });
    (this.udfForm.get('udfGroups') as FormArray).push(udfGroupControl);
    this.indexFormUdf++;
  }

  /**
   * Delete Group
   * @param i Index
   */
  deleteGroupe(i: number) {
    (this.udfForm.get('udfGroups') as FormArray).removeAt(i);
    this.listUDFGroups.splice(i, 1);
    this.udfFields.splice(i, 1);
    this.indexFormUdf--;
  }

  /**
   * Methode clearForm
   */
  clearForm() {
    this.udfForm.reset();
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
}
