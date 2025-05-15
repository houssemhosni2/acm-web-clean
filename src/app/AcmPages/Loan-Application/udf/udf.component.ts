import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { UdfService } from './udf.service';
import { AcmConstants } from '../../../shared/acm-constants';
import { UDFLinksGroupeFieldsEntity } from 'src/app/shared/Entities/udfLinksGroupeFields.entity';
import { UserDefinedFieldListValuesEntity } from '../../../shared/Entities/userDefinedFieldListValues.entity';
import { checkOfflineMode, getUdfLinkGroup } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { BehaviorSubject, Subject } from 'rxjs';
import { UDFLinksGroupeFieldsModelEntity } from 'src/app/shared/Entities/udfLinksGroupeFieldsModel.entity';

@Component({
  selector: 'app-udf',
  templateUrl: './udf.component.html',
  styleUrls: ['./udf.component.sass']
})
export class UdfComponent implements OnInit {
  @Input() expanded;
  @Input() typeUdfLoan;
  @Input() typeUdfCustomer;
  @Input() productId;
  @Input() show: boolean;
  @Output() udfLinksNationality = new EventEmitter<UserDefinedFieldsLinksEntity[]>();
  udfForm: FormGroup;
  public udfGroup: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
  public udfGroups: UserDefinedFieldGroupEntity[] = [];
  udfFields: UserDefinedFieldsEntity[][] = [];
  public udfField: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
  public udfLink: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
  public udfLinks: UserDefinedFieldsLinksEntity[] = [];
  listUDFGroups: UserDefinedFieldGroupEntity[] = [];
  public selectedLoan: LoanEntity = new LoanEntity();
  public selectedCustomer: CustomerEntity = new CustomerEntity();
  public listUDFLinkNationality: UDFLinksGroupeFieldsEntity[] = [];
  public udfSettingNationality: UserDefinedFieldsEntity[] = [];
  public udfLinkGroup: UDFLinksGroupeFieldsEntity[] = [];
  indexFormUdf = 0;
  indexFormUdfField = 0;
  public udfGroupsFound = new BehaviorSubject<boolean>(false) ;
  /**
   * constructor
   *
   * @param udfService UdfService
   * @param formBuilder FormBuilder
   * @param sharedService SharedService
   */
  constructor(public udfService: UdfService, public formBuilder: FormBuilder, public library : FaIconLibrary,
    public sharedService: SharedService, public devToolsServices: AcmDevToolsServices,
    private dbService: NgxIndexedDBService) {
  }

  ngOnInit() {
    this.indexFormUdf = 0;
    this.listUDFGroups = [];
    this.udfGroups = [];
    this.udfFields = [];
    this.udfFields.length = 0;
    const udfGroupParam: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
    if (this.typeUdfLoan) {
      this.createForm();
      this.udfForm.addControl('udfGroup' + this.indexFormUdf, new FormControl(''));
      if (this.sharedService.getLoan() !== null && this.sharedService.getLoan() !== undefined) {
        udfGroupParam.productId = this.sharedService.getLoan().productId;
      }
    } else if (this.typeUdfCustomer) {
      this.createForm();
      this.udfForm.addControl('udfGroup' + this.indexFormUdf, new FormControl(''));
      if (this.sharedService.getCustomer() !== null && this.sharedService.getCustomer() !== undefined) {
        udfGroupParam.customerTypeLabel = this.sharedService.getCustomer().customerType;
      } else {
        udfGroupParam.customerTypeLabel = AcmConstants.CUSTOMER_TYPE_INDIVIDUAL;
      }
    }
    this.getUdfGroup(this.indexFormUdf, udfGroupParam);
  }

  /**
   * Create udf Form
   */
  createForm() {
    this.udfForm = this.formBuilder.group({});
  }

  /**
   * update udf Form
   */
  updateForm() {
    this.udfForm = this.formBuilder.group({});
  }

  /**
   * load user defined group
   */
  getUdfGroup(indexFormUdf, udfGroupEntity: UserDefinedFieldGroupEntity) {
    let udfGroup: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
    if (indexFormUdf !== '') {
      udfGroup = this.listUDFGroups[indexFormUdf];
    }
    if (udfGroup === undefined) {
      udfGroup = new UserDefinedFieldGroupEntity();
    }
    if (this.typeUdfLoan ) {
      this.udfGroup.category = AcmConstants.LOAN_PRODUCTS_CATEGORY;
      if(this.productId){
        this.udfGroup.productId = this.productId;  
      }else{
        this.udfGroup.productId = (udfGroup === undefined || udfGroup === null) ? 0 : udfGroup.productId;
      }
    } else if (this.typeUdfCustomer) {
      this.udfGroup.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
    }

    if (checkOfflineMode()) {

      this.dbService.getByKey('data', 'getUdfGroup_' + this.udfGroup.category).subscribe((udfGroup: any) => {
        if (udfGroup === undefined) {
          this.devToolsServices.openToast(3, 'No udf indiv saved for offline use');
        } else {
          this.initializeUDFGroups(udfGroup.data);
        }
      });
    } else {
      this.udfService.getUdfGroup(this.udfGroup).subscribe(
        (data) => {
          this.initializeUDFGroups(data);
        });
    }

  }

  initializeUDFGroups(data) {
    this.udfGroups = data;
    if (this.typeUdfCustomer) {
      const nationalityToRemove = this.udfGroups.filter(value => value.code === AcmConstants.CUSTOMER_NATIONALITY_CODE ||
        value.code === AcmConstants.BANK_INFORMATION_CODE);
      if (nationalityToRemove.length > 0) {
        this.udfGroups.splice(this.udfGroups.indexOf(nationalityToRemove[0]), 1);
        this.udfGroups.splice(this.udfGroups.indexOf(nationalityToRemove[1]), 1);
      }
    } else if (this.typeUdfLoan) {
      const approvalUdfGrpToRemove = this.udfGroups.filter(value => value.code === AcmConstants.L1_APPROVAL ||
        value.code === AcmConstants.SOURCE_OF_INVESTIGATION);
      if (approvalUdfGrpToRemove.length > 0) {
        this.udfGroups.splice(this.udfGroups.indexOf(approvalUdfGrpToRemove[0]), 1);
        this.udfGroups.splice(this.udfGroups.indexOf(approvalUdfGrpToRemove[1]), 1);
      }
    }
    for (let i = 0; i < this.udfGroups.length; i++) {
      if (data[i].mondatory === true) {
        this.listUDFGroups.push(new UserDefinedFieldGroupEntity());
        this.udfForm.addControl('udfGroup' + this.indexFormUdf, new FormControl('', Validators.required));
        this.udfForm.controls['udfGroup' + this.indexFormUdf].setValue(this.udfGroups[i].id);
        this.getUdfFiledList(this.indexFormUdf, true, this.udfGroups[i].id);
        this.indexFormUdf++;
      }
    }
    this.udfGroupsFound.next(true);
  }

  /**
   * load user defined field
   */
  async getUdfFiledList(j: number, init: boolean, groupId: number) {
    if (init) {
      this.udfGroups.forEach((udfgroup) => {
        if (udfgroup.id === +this.udfForm.controls['udfGroup' + j].value) {
          this.listUDFGroups[j].id = udfgroup.id;
          this.listUDFGroups[j].mondatory = udfgroup.mondatory;
        }
      });
    }
    if (!init) {
      for (let i = 0; i < this.udfFields[j].length; i++) {
        this.udfForm.controls['udfField' + j + i].reset();
        this.udfForm.controls['udfField' + j + i].clearValidators();
      }
    }
    this.udfFields[j] = [];
    this.udfField.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
    if (init) {
      this.udfField.userDefinedFieldGroupDTO.id = groupId;
    } else if (this.udfForm.controls['udfGroup' + j].value) {
      // check if value NOT : null | undefined | NaN | Empty ("") | 0 | false
      this.udfField.userDefinedFieldGroupDTO.id = this.udfForm.controls['udfGroup' + j].value;
    } else {
      this.udfField.userDefinedFieldGroupDTO.id = 0;
    }
    // load udf field
    if (this.udfField.userDefinedFieldGroupDTO.id !== 0) {
      if(!checkOfflineMode()){
      await this.udfService.getUdfField(this.udfField).subscribe(
        (data) => {
          this.setUdfForm(data,j);
        });
      } else {
        await this.dbService.getByKey('data','udf-fields-group-id-' + this.udfField.userDefinedFieldGroupDTO.id).toPromise().then((udfFields:any)=>{
          if(udfFields !== undefined){
            this.setUdfForm(udfFields.data,j);
      }
      })
      }
    }
  }

  setUdfForm(data,j){
    this.udfFields[j] = data;
    this.udfFields[j].filter((item)=> item.idUDFParentField !== 0).map((item) => item.fieldListValuesDTOs = []);
    const hijriDofToRemove = this.udfFields[j].filter(value => value.name === AcmConstants.UDF_FIELD_HIJRI_DOF);
    if (hijriDofToRemove.length > 0) {
      this.udfFields[j].splice(this.udfFields[j].indexOf(hijriDofToRemove[0]), 1);
    }
    for (let i = 0; i < this.udfFields[j].length; i++) {
      if (this.udfFields[j][i].mandatory === true) {
        this.udfForm.addControl('udfField' + j + i, new FormControl('',
          [Validators.required, Validators.pattern(this.udfFields[j][i].fieldMasc)]));
      } else if (this.udfFields[j][i].mandatory === false) {
        this.udfForm.addControl('udfField' + j + i, new FormControl('',
          Validators.pattern(this.udfFields[j][i].fieldMasc)));
      }
    }
  }

  /**
   * add a new udf group
   */
  addUdf() {
    this.listUDFGroups.push(new UserDefinedFieldGroupEntity());
    this.udfFields[this.indexFormUdf] = [];
    this.udfForm.addControl('udfGroup' + this.indexFormUdf, new FormControl(''));
    this.indexFormUdf++;
  }

  /**
   * toggle Loan Details analyses
   */
  toggleCollapseLoanAnalyses() {
    this.expanded = !this.expanded;
  }

  /**
   * Delete Group
   * @param i Index
   */
  deleteGroupe(i: number) {
    this.listUDFGroups.splice(i, 1);
    this.udfFields.splice(i, 1);
    this.indexFormUdf--;
  }
  /**
   * onSubmitLoan
   * @param loanEntity LoanEntity
   */
  onSubmitLoan(loanEntity: LoanEntity) {
    if (this.listUDFGroups.length >= 0) {
      this.udfLinks = [];
      for (let j = 0; j < this.listUDFGroups.length; j++) {
        for (let i = 0; i < this.udfFields[j].length; i++) {
          const udfLink: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
          if (loanEntity.loanId !== null) {
            udfLink.category = AcmConstants.LOAN_CATEGORY;
            udfLink.elementId = loanEntity.loanId;
          }
          if (this.udfFields[j][i].fieldType === 5) {
            udfLink.fieldValue = this.udfForm.controls['udfField' + j + i].value.idUDFListValue;
            udfLink.udfListValueId = this.udfForm.controls['udfField' + j + i].value.idUDFListLink;
          } else {
            udfLink.fieldValue = this.udfForm.controls['udfField' + j + i].value;
          }
          udfLink.userDefinedFieldsDTO = this.udfFields[j][i];
          udfLink.indexGroup = j;
          this.udfLinks.push(udfLink);
        }
      }
    }
    return this.udfLinks;
  }

  /**
   * onSubmitCustomer
   * @param customerEntity CustomerEntity
   */
  onSubmitCustomer(customerEntity: CustomerEntity) {
    if (this.listUDFGroups.length >= 0) {
      this.udfLinks = [];
      for (let j = 0; j < this.listUDFGroups.length; j++) {
        for (let i = 0; i < this.udfFields[j].length; i++) {
          const udfLink: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
          udfLink.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
          udfLink.elementId = customerEntity.id
          if (this.udfFields[j][i].fieldType === 5) {
            udfLink.fieldValue = this.udfForm.controls['udfField' + j + i].value.idUDFListValue;
            udfLink.udfListValueId = this.udfForm.controls['udfField' + j + i].value.idUDFListLink;
          } else {
            udfLink.fieldValue = this.udfForm.controls['udfField' + j + i].value;
          }
          udfLink.userDefinedFieldsDTO = this.udfFields[j][i];
          udfLink.indexGroup = j;
          this.udfLinks.push(udfLink);
        }
      }
    }
    return this.udfLinks;
  }

  /**
   * Methode clearForm
   */
  clearForm() {
    this.udfForm.reset();
  }

  async getUdfFiledListNationality() {
    const groupNationality: UserDefinedFieldsEntity = new UserDefinedFieldsEntity();
    groupNationality.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
    groupNationality.userDefinedFieldGroupDTO.code = AcmConstants.CUSTOMER_NATIONALITY_CODE;
    this.udfService.getUdfField(groupNationality).subscribe(
      (data) => {
        this.udfSettingNationality = data;
      }
    );
  }

 async changeUDFField(j: number, i: number) {
    const udfselected = this.udfFields[j][i];
    for (let indexUDF = 0; indexUDF < this.udfFields[j].length; indexUDF++) {
      if (this.udfFields[j][indexUDF].idUDFParentField === udfselected.id) {
        if(!checkOfflineMode()){
        const userDefinedFieldListValuesEntity = new UserDefinedFieldListValuesEntity();
        // Make the link between list values based on the ACM id
        userDefinedFieldListValuesEntity.parentUDFListValue = this.udfForm.controls['udfField' + j + i].value.id;
        this.udfService.getUdfListValue(userDefinedFieldListValuesEntity).subscribe(
          (data) => {
            this.udfFields[j][indexUDF].fieldListValuesDTOs = data;
          }
        );
      } else {
        await this.dbService.getByKey('data', 'udf-fields-group-id-' + this.udfFields[j][indexUDF].userDefinedFieldGroupDTO.id).toPromise().then((udfFields: any) => {
          if(udfFields !== undefined){
            const res = udfFields.data?.filter(udfField => udfField.id === this.udfFields[j][indexUDF].id);
            if(res.length > 0){ 
              let resultListValues = res[0].fieldListValuesDTOs;
              resultListValues = resultListValues.filter((listValue)=> listValue.parentUDFListValue === this.udfForm.controls['udfField' + j + i].value.id);
              this.udfFields[j][indexUDF].fieldListValuesDTOs = resultListValues;
            }
          }
          });   
      }
    }
    }
  }

  /**
   * mascPlacHolder
   * @param fieldMasc string
   */
  mascPlacHolder(fieldMasc) {
    if (fieldMasc !== '') {
      fieldMasc = new RegExp(fieldMasc);
      let lengthMasc = 0;
      fieldMasc.source.match(/\d+/g).map(Number).forEach(element => {
        lengthMasc = element;
      });
      let mask = '';
      for (let i = 1; i <= lengthMasc; i++) {
        mask += 'x';
      }
      return mask;
    }
    return '';
  }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
 async fillUdfForm(category : string,elementId: number ) {
    await this.udfGroupsFound.subscribe(async (result) => {
    if (result === true) {
    // get udfLinks
    
    let udfLinkGroupLoan :  UDFLinksGroupeFieldsEntity[] = [];
    const userDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
    userDefinedFieldsLinksEntity.category = category;
    userDefinedFieldsLinksEntity.elementId = elementId;
    if(checkOfflineMode() && category===AcmConstants.CUSTOMER_CATEGORY_CUSTOMER){
      if(this.sharedService.getCustomer().userDefinedFieldsLinksDTOs){

        let idGroups = [];
            
        this.sharedService.getCustomer().userDefinedFieldsLinksDTOs.forEach((link)=>{
         if(!idGroups.includes(link.userDefinedFieldsDTO.userDefinedFieldGroupDTO.id)){
           idGroups.push(link.userDefinedFieldsDTO.userDefinedFieldGroupDTO.id);
         }
        })

        const list = this.udfGroups.filter((group)=>{ 
              const idExistsInGroups = idGroups.some(id => id === group.id);
              return idExistsInGroups ? group : null;
         })
      udfLinkGroupLoan =  getUdfLinkGroup(this.sharedService.getCustomer().userDefinedFieldsLinksDTOs,list,null);
    }
    else {
      await this.dbService.getByKey('data', 'getUdfLinkGroupby_' + elementId).toPromise().then((udfLinkGroup:any)=>{
        if(udfLinkGroup !== undefined){
          udfLinkGroupLoan = udfLinkGroup.data;
        }
      })
    }
  }
    else {
      await this.udfService.getUdfLinkGroupby(userDefinedFieldsLinksEntity).toPromise().then((data) =>
        udfLinkGroupLoan = data
      );
    }
    // fill udf form
    udfLinkGroupLoan.forEach((udf) => {
      if(this.udfGroups.find(udfG => udfG.id === udf.userDefinedFieldGroupID) !== undefined && this.listUDFGroups.find(udfL => udfL.id === udf.userDefinedFieldGroupID) === undefined){
        const groupUDF = new UserDefinedFieldGroupEntity();
        groupUDF.id = udf.userDefinedFieldGroupID;
        groupUDF.enabled = true;
        groupUDF.mondatory = udf.mondatory;
        groupUDF.indexGroup = this.indexFormUdf;
        groupUDF.code = udf.userDefinedFieldGroupName;
        this.udfForm.addControl('udfGroup' + this.indexFormUdf, new FormControl('', Validators.required));
        this.udfForm.controls['udfGroup' + this.indexFormUdf].setValue(udf.userDefinedFieldGroupID);
        this.listUDFGroups.push(groupUDF);
        this.indexFormUdf++;
      }
    });
    for (let i = 0; i < this.listUDFGroups.length; i++) {
      this.getUdfFieldLoanValues(udfLinkGroupLoan,i, false, this.listUDFGroups[i].id);
    }
     }
   })
 }



  async getUdfFieldLoanValues(udfLinkGroupLoan :  UDFLinksGroupeFieldsEntity[],j: number, init: boolean,udfGroupId :number) {
    if (!init) {
      // for (let i = 0; i < this.udfFields[j].length; i++) {
      //   this.udfForm.controls['udfField' + j + i].reset();
      //   this.udfForm.controls['udfField' + j + i].clearValidators();
      // }
    }
    this.udfFields[j] = [];

    if(checkOfflineMode()){
      await this.dbService.getByKey('data','udf-fields-group-id-' + udfGroupId).toPromise().then((udfFields:any)=>{
        if(udfFields !== undefined){
          this.udfFields[j] = udfFields.data;
    }
    })
    }
    else {
      let udfFieldParam = new UserDefinedFieldsEntity();
      udfFieldParam.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
      udfFieldParam.userDefinedFieldGroupDTO.id = udfGroupId;
      await this.udfService.getUdfField(udfFieldParam).toPromise().then((data)=>{
        this.udfFields[j] = data;
      });
    }

        this.udfGroup = this.listUDFGroups[j];
        let fieldExist: boolean;
        let selectedGroupLoan = new UDFLinksGroupeFieldsEntity();
        selectedGroupLoan.udfGroupeFieldsModels = [];
        if (init) {
          selectedGroupLoan = udfLinkGroupLoan[this.udfGroup.indexGroup];
        } else {
          udfLinkGroupLoan.forEach((group) => {
            if (group.userDefinedFieldGroupID === this.udfGroup.id) {
              selectedGroupLoan = group;
            }
          });
        }
        for (let i = 0; i < this.udfFields[j].length; i++) {
          fieldExist = false;
          selectedGroupLoan.udfGroupeFieldsModels.forEach((field) => {
            // this.surveysId = field.surveysId;
            // find udf from udf Links saved compare with udf settings
            if (field.udfFieldID === this.udfFields[j][i].id) {
              this.udfFields[j][i].idAbacusUDFLink = field.idAbacusUDFLink;
              this.udfFields[j][i].surveysId = field.surveysId;
              this.udfFields[j][i].idUDFLink = field.id;
              this.udfFields[j][i].delete = false;
              // udf has a parent
              if (this.udfFields[j][i].idUDFParentField !== 0) {
                fieldExist = true;
                this.udfForm.addControl('udfField' + j + i, new FormControl('', Validators.required));
                // find parent from udf link
                selectedGroupLoan.udfGroupeFieldsModels.forEach((parentField) => {
                  if (parentField.udfFieldID === this.udfFields[j][i].idUDFParentField) {
                    const userDefinedFieldListValuesEntity = new UserDefinedFieldListValuesEntity();
                    userDefinedFieldListValuesEntity.parentUDFListValue = this.udfForm.controls['udfField' + j + i].value.id;
                    // get field list values of child
                    this.udfService.getUdfListValue(userDefinedFieldListValuesEntity).subscribe(
                      (udfs) => {
                        this.udfFields[j][i].fieldListValuesDTOs = udfs;
                        // find udf field Value from udf field value Links saved compare with udf field value settings
                        udfs.forEach(
                          (fieldListValuesDTO => {
                            if (fieldListValuesDTO.idUDFListValue === field.fieldValueId) {
                              this.udfForm.controls['udfField' + j + i].setValue(fieldListValuesDTO);
                            }
                          }));
                      });
                  }
                });
                // udf no parent type list
              } else if (this.udfFields[j][i].fieldType === 5) {
                this.udfFields[j][i].fieldListValuesDTOs.forEach(
                  (fieldListValuesDTO => {
                    if (fieldListValuesDTO.idUDFListValue=== field.fieldValueId) {
                      if (this.udfForm.contains('udfField' + j + i)) {
                        this.udfForm.controls['udfField' + j + i].setValue(fieldListValuesDTO)
                      }
                      else {
                        if (this.udfFields[j][i].mandatory === true) {
                          this.udfForm.addControl('udfField' + j + i, new FormControl(fieldListValuesDTO, Validators.required));
                        } else {
                          this.udfForm.addControl('udfField' + j + i, new FormControl(fieldListValuesDTO));
                        }
                      }
                      fieldExist = true;
                    }

                  }));
                // udf no parent type no list (text, date, number ....)
              } else {
                if(this.udfForm.contains('udfField' + j + i)){
                  this.udfForm.controls['udfField' + j + i].setValue(field.value);
                }
                else if (this.udfFields[j][i].mandatory === true) {
                  this.udfForm.addControl('udfField' + j + i, new FormControl(field.value,
                    [Validators.required, Validators.pattern(this.udfFields[j][i].fieldMasc)]));
                } else {
                  this.udfForm.addControl('udfField' + j + i, new FormControl(field.value,
                    Validators.pattern(this.udfFields[j][i].fieldMasc)));
                }
                fieldExist = true;
              }
            }
          });
          // udf no exist in udf field links
          if (!fieldExist) {
            // if (init) {
            //   this.udfFields[j][i].surveysId = this.surveysId;
            // }
            if (this.udfFields[j][i].mandatory === true) {
              this.udfForm.addControl('udfField' + j + i, new FormControl('',
                [Validators.required, Validators.pattern(this.udfFields[j][i].fieldMasc)]));
            } else {
              this.udfForm.addControl('udfField' + j + i, new FormControl('',
                Validators.pattern(this.udfFields[j][i].fieldMasc)));
            }

          }
        }
  }
  compareGroup(id1, id2) {
    return id1 === id2;
  }
  compareFieldUDF(udf1, udf2) {
    if ((udf2 !== undefined && udf1 !== undefined) && (udf2 !== null && udf1 !== null)) {
      if ((udf2.idUDFListValue !== undefined && udf1.idUDFListValue !== undefined)
        && (udf2.idUDFListValue !== null && udf1.idUDFListValue !== null)) {
        return udf1.idUDFListValue === udf2.idUDFListValue;
      }
    }
    return false;

  }
}
