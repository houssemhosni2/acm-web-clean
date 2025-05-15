import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserDefinedFieldGroupEntity } from 'src/app/shared/Entities/userDefinedFieldGroup.entity';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import { UdfService } from '../udf/udf.service';
import { UserDefinedFieldsEntity } from 'src/app/shared/Entities/userDefinedFields.entity';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { SharedService } from 'src/app/shared/shared.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { UDFLinksGroupeFieldsEntity } from 'src/app/shared/Entities/udfLinksGroupeFields.entity';
import { UserDefinedFieldListValuesEntity } from 'src/app/shared/Entities/userDefinedFieldListValues.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { WorkflowStepUdfGroupeEntity } from 'src/app/shared/Entities/WorkflowStepUdfGroupe.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services'
import { checkOfflineMode, getUdfLinkGroup } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UDFLinksGroupeFieldsModelEntity } from 'src/app/shared/Entities/udfLinksGroupeFieldsModel.entity';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-udf-step-workflow',
  templateUrl: './udf-step-workflow.component.html',
  styleUrls: ['./udf-step-workflow.component.sass']
})
export class UdfStepWorkflowComponent implements OnInit,OnChanges {
  public expandedUdf = true;
  @Input() expanded;
  @Input() category;
  @Input() source; // workflow || add || edit
  public udfGroups: UserDefinedFieldGroupEntity[] = [];
  public udfGroupsSelected: UserDefinedFieldGroupEntity[] = []; // in html file , we are looping on this list "udfGroupsSelected" to display the udf form
  public maxIndexGroup = 0;


  public show = new Subject<boolean>();
  public surveysId: number;
  public udfGroupLoan: UserDefinedFieldGroupEntity = new UserDefinedFieldGroupEntity();
  public udfLinkGroupLoan: UDFLinksGroupeFieldsEntity[] = [];
  public udfLinks: UserDefinedFieldsLinksEntity[] = [];
  public udfLoanForm: FormGroup;
  public udfFieldsLoan: UserDefinedFieldsEntity[][] = []; // each item in 'udfGroupsSelected list' has its fields in this list(exp: udfGroupsSelected[0] has its fields in udfFieldsLoan[0][])
  public indexFormUdfLoan = 0; // contains the length of the list udfGroupsSelected
  public loan: LoanEntity = new LoanEntity();
  @Input() getUdfList: boolean;
  @Input() saveUdf: boolean;
  @Output() udfList = new EventEmitter<UserDefinedFieldsLinksEntity[]>();
  @Output() validationUdfEmitter = new EventEmitter<boolean>();

  public udfFormData: boolean = false;
  mode:string;
  isCollection : boolean;

  constructor(public devToolsServices: AcmDevToolsServices,public activatedRoute: ActivatedRoute,public formBuilder: FormBuilder, public sharedService: SharedService,private dbService: NgxIndexedDBService, public udfService: UdfService, public library: FaIconLibrary) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.getUdfList?.currentValue !== changes?.getUdfList?.previousValue && changes?.getUdfList?.previousValue !== undefined) {
      this.udfList.next(this.onSubmitElement());
    }
    if (changes?.saveUdf?.currentValue !== changes?.saveUdf?.previousValue && changes?.saveUdf?.previousValue !== undefined) {
      this.saveUdfLinks();
    }
  }
  async ngOnInit() {
    await this.activatedRoute.queryParams.subscribe((params) => {
      this.mode = params.source;
    });
    this.isCollection = this.category === AcmConstants.COLLECTION_CATEGORY ;
    // INIT UDF FORM
    this.udfLoanForm = null
    this.udfGroupsSelected = [];
    this.udfGroups = [];
    this.maxIndexGroup = 0;
    this.indexFormUdfLoan = 0;
    this.udfLoanForm = this.formBuilder.group({});
    this.maxIndexGroup = 0;
    this.loan = this.sharedService.getLoan();
    
    // get udf groups list
    await this.getUdfAllGroupLoan();
    if (this.source != 'add') {
      // if source in ('edit || 'workflow') then get udf links of the element(loan || customer || ...)
      await this.getUdfLoanInformation();
    }
    //display mondatory udf groups if exist
    for (let i = 0; i < this.udfGroups.length; i++) {
      if (this.udfGroups[i].mondatory === true) {
        if (this.udfGroupsSelected.find(udfG => udfG.id === this.udfGroups[i].id) === undefined) {
          this.udfGroupsSelected.push(this.udfGroups[i]);
          this.udfLoanForm.addControl('udfGroup' + this.indexFormUdfLoan, new FormControl('', Validators.required));
          this.udfLoanForm.controls['udfGroup' + this.indexFormUdfLoan].setValue(this.udfGroups[i]);
          // get the udf fields of the udfGroup[i]
          await this.getUdfFiledListLoan(this.indexFormUdfLoan, true);
          this.indexFormUdfLoan++;
        }
        else {
          // case : if a mandatory udf group exists in udf links and its formControl is already created in the method getUdfLoanInformation()
          // then set its formControl as mandatory
          let index = this.devToolsServices.findFormControlWithValue(this.udfGroups[i].code, this.udfLoanForm);
          this.udfGroupsSelected[index].mondatory = true;
        }
      }

    }
  }
  /**
   * get udf links by elementId and category + find max indexGroup of the actual element (loan || customer || ...)
   * + create formControls of the udf links
   * getUdfLoanInformation
   */
  async getUdfLoanInformation() {
    // reset udfFields list ( to be reviewed correct or not)
    this.udfFieldsLoan[0] = [];
    // init udfLink param
    const userDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
    userDefinedFieldsLinksEntity.category = this.category;
    if (this.category === AcmConstants.CUSTOMER_CATEGORY_CUSTOMER) {
      userDefinedFieldsLinksEntity.elementId = this.sharedService.getCustomer()?.id
    }
    if (this.category === AcmConstants.COLLATERAL_CATEGORY) {
      userDefinedFieldsLinksEntity.elementId = this.sharedService.getCollateral()?.idAcmCollateral
    }
    if (this.category === AcmConstants.LOAN_CATEGORY) {
      userDefinedFieldsLinksEntity.elementId = this.loan.loanId;
    }
    else if (this.category === AcmConstants.COLLECTION_CATEGORY) {
      userDefinedFieldsLinksEntity.elementId = this.sharedService.getCollection().id;
    }
    else if (this.category === AcmConstants.SUPPLIER_CATEGORY) {
      userDefinedFieldsLinksEntity.elementId = this.sharedService.getSupplier().id;
    }
    else if (this.category === AcmConstants.PARTY_CATEGORY) {
      userDefinedFieldsLinksEntity.elementId = this.sharedService.getThirdParty().id;
    } else if (this.category === AcmConstants.ITEM_CATEGORY) {
      userDefinedFieldsLinksEntity.elementId = this.sharedService.getItem().id;
    } else if (this.category === AcmConstants.PROSPECT_CATEGORY) {
      userDefinedFieldsLinksEntity.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
      userDefinedFieldsLinksEntity.elementId = this.sharedService.getCustomer().id;
    }
    // get only the udf links related to the udf groups
    userDefinedFieldsLinksEntity.udfGroupIds = this.udfGroups.map(udfG => udfG.id);

    if(checkOfflineMode() || this.mode ==='preview'){
      const key = this.isCollection ? 'getUdfLinkGroupLoanByCollectionId_' + this.sharedService.getCollection().id :
      this.category === AcmConstants.LOAN_CATEGORY ? 'getUdfLinkGroupLoanByLoanId_' + this.loan.loanId : 'getUdfLinkGroupLoanByCollateralId_' + this.sharedService.getCollateral()?.idAcmCollateral;
    await this.dbService.getByKey('data', key).toPromise().then((udfLinkGroupLoan: any) => {
        if (udfLinkGroupLoan === undefined || udfLinkGroupLoan?.data?.length == 0) {
           if(this.sharedService.getCollateral()?.userDefinedFieldsLinksDTOs){
            let idGroups = [];          
            this.sharedService.getCollateral()?.userDefinedFieldsLinksDTOs.forEach((link)=>{
             if(!idGroups.includes(link.userDefinedFieldsDTO.userDefinedFieldGroupDTO.id)){
               idGroups.push(link.userDefinedFieldsDTO.userDefinedFieldGroupDTO.id);
             }
            })
            let list = [...this.udfGroups];
            list = list.filter(group => {
             const idExistsInGroups = idGroups.some(id => id === group.id);
             return idExistsInGroups ? group : null;
           });
             const data = getUdfLinkGroup(this.sharedService.getCollateral()?.userDefinedFieldsLinksDTOs,list,null);
             this.udfLinkGroupLoan = data;
           } else {
            this.devToolsServices.openToast(3, 'No Udf Link Group Loan saved for offline use');
           }
        } else {
          this.udfLinkGroupLoan = udfLinkGroupLoan.data;
        }
      });
    }
    else {
    await this.udfService.getUdfLinkGroupby(userDefinedFieldsLinksEntity).toPromise().then((data) =>
      this.udfLinkGroupLoan = data
    );
    }

    this.udfLinkGroupLoan.forEach(udfG => {
      udfG.udfGroupeFieldsModels.forEach((udfF)=> {

        if( udfF.indexGroup>=this.maxIndexGroup) {
          this.maxIndexGroup = udfF.indexGroup+1
        }
      })
    })
    // get max index group of all udfLink of the actual element
    if(checkOfflineMode() || this.mode ==='preview'){
      const key = this.isCollection ? 'getMaxIndexGroupByCollectionId_' + this.sharedService.getCollection().id : this.category === AcmConstants.LOAN_CATEGORY ? 'getMaxIndexGroupByLoanId_' + this.loan.loanId :
      'getMaxIndexGroupByCollateralId_' + this.sharedService.getCollateral()?.idAcmCollateral ;
     await this.dbService.getByKey('data', key).toPromise().then((maxIndexGroup: any) => {
        if (maxIndexGroup) {
          this.maxIndexGroup = maxIndexGroup.data + 1;
        }
      });
    }
    else {
    await this.udfService.findMaxIndexGroup(userDefinedFieldsLinksEntity.elementId,userDefinedFieldsLinksEntity.category).toPromise().then((data)=> {
      this.maxIndexGroup = data + 1;      
    })
  }
    let indexGroup = 0;
    this.udfLinkGroupLoan.forEach((udf) => {
      // if the list udfGroups contains the udf group of the udf link iterator (iterator name = 'udf') then create formControls for udf.udfGroup and formControls for udf.udfGroup.udfFields
      if (this.udfGroups.find(udfG => udfG.id === udf.userDefinedFieldGroupID) !== undefined) {
        // init udf group
        const groupUDF = new UserDefinedFieldGroupEntity();
        groupUDF.id = udf.userDefinedFieldGroupID;
        groupUDF.enabled = true;
        groupUDF.indexGroup = indexGroup;
        groupUDF.code = udf.userDefinedFieldGroupName;
        this.udfLoanForm.addControl('udfGroup' + this.indexFormUdfLoan, new FormControl(groupUDF));
        this.udfGroupsSelected.push(groupUDF);
        // increment indexFormUdfLoan
        this.indexFormUdfLoan++;
        indexGroup++;
      }
    });

    for (let i = 0; i < this.udfGroupsSelected.length; i++) {
      // foreach udfGroupsSelected's item load its fields
      await this.getUdfGroupLoan(i);
    }
  }
  /**
   * get udf groups
   * getUdfAllGroupLoan
   */
  async getUdfAllGroupLoan() {
    let workflowStepUdfGroupeEntity = new WorkflowStepUdfGroupeEntity();
    if (this.source === 'workflow') {
      if(checkOfflineMode() || this.mode ==='preview'){
        const key = this.isCollection ? 'getUdfGroupsByIdCollectionStep_' + this.sharedService.getCollection().idAcmCollectionStep :
        'getUdfGroupsByLoanWorkflowStep_' + this.sharedService.currentStatus;
        await this.dbService.getByKey('data', key).toPromise().then((udfGroups: any) => {
          if (udfGroups === undefined) {
            this.devToolsServices.openToast(3, 'No Udf Groups saved for offline use');
          } else {
            this.udfGroups = udfGroups.data;
          }
        });
      }
      else {
      if (this.category === AcmConstants.LOAN_CATEGORY) {
        workflowStepUdfGroupeEntity.idWorkflowStep = this.sharedService.currentStatus;
      }
      else if (this.category === AcmConstants.COLLECTION_CATEGORY) {
        workflowStepUdfGroupeEntity.idCollectionStep = this.sharedService.getCollection().idAcmCollectionStep;
    } else if (this.category === AcmConstants.ITEM_CATEGORY) {
      workflowStepUdfGroupeEntity.idWorkflowStep = this.sharedService.getItem().actualStep;
      }
      await this.udfService.findUdfGroupsByStepId(workflowStepUdfGroupeEntity).toPromise().then((data) => {
        this.udfGroups = data;
      });
    }
  }
    else if (this.source === 'add' || this.source === 'edit') {
      if(checkOfflineMode()){
        await this.dbService.getByKey('data', 'getUdfGroup_' + this.category ).toPromise().then((udfGroups: any) => {
          if (udfGroups !== undefined) {
            this.udfGroups = udfGroups.data
          }
        });
      } else {
      let udfGroupParam = new UserDefinedFieldGroupEntity();
      udfGroupParam.category = this.category;
      await this.udfService.getUdfGroup(udfGroupParam).toPromise().then(
        (data) => {
          this.udfGroups = data;
        });
    }
  }
  }

  async getUdfGroupLoan(indexFormUdf) {
    await this.getUdfFiledListLoan(indexFormUdf, true);
  }


  async getUdfFiledListLoan(j: number, init: boolean) {

    this.udfFormData = false;

    if (!init) {
      for (let i = 0; i < this.udfFieldsLoan[j].length; i++) {
        this.udfLoanForm.controls['udfField' + j + i].reset();
        this.udfLoanForm.controls['udfField' + j + i].clearValidators();
      }
    }
    // init udfFieldsLoan[j]
    this.udfFieldsLoan[j] = [];
    let udfGroupId: number;

    if (init) {
      udfGroupId = this.udfGroupsSelected[j].id;
    } else {
      udfGroupId = this.udfLoanForm.controls['udfGroup' + j].value.id;
    }
    // find udf fields of udfGroupId
    if (this.source === 'workflow') {
      if(checkOfflineMode() || this.mode ==='preview'){
        const key = this.isCollection ? 'getUdfFieldsByIdCollectionStep_' + this.sharedService.getCollection().idAcmCollectionStep : 'getUdfFieldsByIdLoanStep_' + this.sharedService.currentStatus;
       await this.dbService.getByKey('data', key).toPromise().then((udfFieldsLoan: any) => {
          if (udfFieldsLoan === undefined) {
            this.devToolsServices.openToast(3, 'No Udf Fields Loan saved for offline use');
          } else {
            this.udfFieldsLoan[j] = udfFieldsLoan.data;
          }
        });
      }
      else {
      let workflowStepUdfGroupeEntity = new WorkflowStepUdfGroupeEntity();
      if (this.category === AcmConstants.LOAN_CATEGORY) {
        workflowStepUdfGroupeEntity.idWorkflowStep = this.sharedService.currentStatus;
      }
      else if (this.category === AcmConstants.COLLECTION_CATEGORY) {
        workflowStepUdfGroupeEntity.idCollectionStep = this.sharedService.getCollection().idAcmCollectionStep;
      } else if (this.category === AcmConstants.ITEM_CATEGORY) {
        workflowStepUdfGroupeEntity.idWorkflowStep = this.sharedService.getItem().actualStep;
      }
      const data = await this.udfService.findUdfFieldsByStepId(workflowStepUdfGroupeEntity, udfGroupId).toPromise();
      // set udf fields of udfGroupId in udfFieldsLoan[j]
      this.udfFieldsLoan[j] = data;
    }
  }
    else if (this.source === 'add' || this.source === 'edit') {
      if(checkOfflineMode()){
        await this.dbService.getByKey('data', 'udf-fields-group-id-'+udfGroupId).toPromise().then((udfFields: any) => {
        if(udfFields !== undefined){
          this.udfFieldsLoan[j] = udfFields.data;
        }
        });
      } else {
      let udfFieldParam = new UserDefinedFieldsEntity();
      udfFieldParam.userDefinedFieldGroupDTO = new UserDefinedFieldGroupEntity();
      udfFieldParam.userDefinedFieldGroupDTO.id = udfGroupId;
      const data = await this.udfService.getUdfField(udfFieldParam).toPromise();
      // set udf fields of udfGroupId in udfFieldsLoan[j]
      this.udfFieldsLoan[j] = data;
      }
    }
    this.udfFieldsLoan[j].filter((item) => item.idUDFParentField !== 0).map((item) => item.fieldListValuesDTOs = []);

    if (this.source === 'add') {
      // foreach udfField, create an empty formControl
      for (let i = 0; i < this.udfFieldsLoan[j].length; i++) {
        if (this.udfFieldsLoan[j][i].mandatory === true) {
          this.udfLoanForm.addControl('udfField' + j + i, new FormControl('',
            [Validators.required, Validators.pattern(this.udfFieldsLoan[j][i].fieldMasc)]));
        } else if (this.udfFieldsLoan[j][i].mandatory === false) {
          this.udfLoanForm.addControl('udfField' + j + i, new FormControl('',
            Validators.pattern(this.udfFieldsLoan[j][i].fieldMasc)));
        }
      }
    }
    else if (this.source === 'edit' || this.source === 'workflow') {
      // foreach udfField, create a formControl with its value got from the list 'this.udfLinkGroupLoan'
      this.udfGroupLoan = this.udfGroupsSelected[j];

      let fieldExist: boolean;
      // init the uDFLinksGroupeFieldsEntity entity(which englobe one udfGroup and its udfFields with their values)
      let selectedGroupLoan = new UDFLinksGroupeFieldsEntity();
      selectedGroupLoan.udfGroupeFieldsModels = [];
      
      // get the actual iterator of uDFLinksGroupeFieldsEntity of the list : 'this.udfLinkGroupLoan'
      if (init) {
        if (this.udfGroupLoan.indexGroup !== undefined && this.udfGroupLoan.indexGroup !== null) {
          selectedGroupLoan = this.udfLinkGroupLoan[this.udfGroupLoan.indexGroup];
        }
      } else {
        this.udfLinkGroupLoan.forEach((group) => {
          if (group.userDefinedFieldGroupID === this.udfGroupLoan.id) {
            selectedGroupLoan = group;
          }
        });
      }
      // fill in the form with formControls of udf fields
      for (let i = 0; i < this.udfFieldsLoan[j].length; i++) {
        fieldExist = false;
        for (const field of selectedGroupLoan.udfGroupeFieldsModels) {
          this.surveysId = field.surveysId;
          // find udf from udf Links saved compare with udf settings
          if (field.udfFieldID === this.udfFieldsLoan[j][i].id) {
            this.udfFieldsLoan[j][i].idAbacusUDFLink = field.idAbacusUDFLink;
            this.udfFieldsLoan[j][i].surveysId = field.surveysId;
            this.udfFieldsLoan[j][i].idUDFLink = field.id;
            this.udfFieldsLoan[j][i].delete = false;
            if (this.udfFieldsLoan[j][i].fieldType === 5) {
              for (const fieldListValuesDTO of this.udfFieldsLoan[j][i].fieldListValuesDTOs) {
                if (fieldListValuesDTO.description.toUpperCase() === field.value.toUpperCase()) {
                  if (this.udfFieldsLoan[j][i].mandatory === true) {
                    this.udfLoanForm.addControl('udfField' + j + i, new FormControl(fieldListValuesDTO, Validators.required));
                  } else {
                    this.udfLoanForm.addControl('udfField' + j + i, new FormControl(fieldListValuesDTO));
                  }
                  fieldExist = true;
                  await this.changeUDFField(j, i)
                }
              }
            } else {
              if (this.udfFieldsLoan[j][i].mandatory === true) {
                this.udfLoanForm.addControl('udfField' + j + i, new FormControl(field.value,
                  [Validators.required, Validators.pattern(this.udfFieldsLoan[j][i].fieldMasc)]));
              } else {
                this.udfLoanForm.addControl('udfField' + j + i, new FormControl(field.value,
                  Validators.pattern(this.udfFieldsLoan[j][i].fieldMasc)));
              }
              fieldExist = true;
            }
          }
        }
        // udf no exist in udf field links
        if (!fieldExist) {
          if (init) {
            this.udfFieldsLoan[j][i].surveysId = this.surveysId;
          }
          if (this.udfFieldsLoan[j][i].mandatory === true) {
            this.udfLoanForm.addControl('udfField' + j + i, new FormControl('',
              [Validators.required, Validators.pattern(this.udfFieldsLoan[j][i].fieldMasc)]));
          } else {
            this.udfLoanForm.addControl('udfField' + j + i, new FormControl('',
              Validators.pattern(this.udfFieldsLoan[j][i].fieldMasc)));
          }

        }
      }
    }
    this.udfFormData = true;
  }
  /**
   * add new udf group formControl to the form + push new and empty udfGroup to the list 'this.udfGroupsSelected'
   * addUdfLoan
   */
  addUdfLoan() {
    const groupUDF = new UserDefinedFieldGroupEntity();
    groupUDF.enabled = true;
    groupUDF.code = null;
    this.udfGroupsSelected.push(groupUDF);
    this.udfFieldsLoan[this.udfGroupsSelected.length - 1] = [];
    this.udfLoanForm.addControl('udfGroup' + this.indexFormUdfLoan, new FormControl(''));
    this.indexFormUdfLoan++;
  }
  /**
   * toggleCollapseCustomerAnalyses
   */
  toggleCollapseCustomerAnalyses() {
    this.expandedUdf = !this.expandedUdf;
  }
  /**
   * prepare udfLinks from the udf form + save udf links
   * saveUdfLinks
   */
  public async saveUdfLinks() {
    
    this.onSubmitElement();
    // update /save udf links
      if (this.udfLoanForm.invalid) {
      this.validationUdfEmitter.emit(true);
      this.devToolsServices.InvalidControl();
      return;
    }else {
      this.validationUdfEmitter.emit(false);
    }
    if (this.udfLinks.length > 0) {
      if(checkOfflineMode()){
        if(this.category === AcmConstants.COLLECTION_CATEGORY){
       await this.dbService.update('udfLinks', { elementId : this.udfLinks[0].elementId , 'udfLink': this.udfLinks }).toPromise().then(()=>{
          this.devToolsServices.openToast(0, 'alert.success');
        })
      }
        this.udfGroups.forEach(async group=>{
          let udfGroupeFields : UDFLinksGroupeFieldsModelEntity[]=[];
          
          this.udfLinks.filter(link => { return link.userDefinedFieldsDTO.userDefinedFieldGroupDTO.id === group.id }).forEach(link=>{
            let udfGroupeField = new UDFLinksGroupeFieldsModelEntity();
            udfGroupeField.value = link.fieldValue;
            udfGroupeField.indexGroup = link.indexGroup;
            udfGroupeField.fieldName = link.userDefinedFieldsDTO.name;
            udfGroupeField.udfFieldID = link.userDefinedFieldsDTO.id;
            udfGroupeField.mandatory = link.userDefinedFieldsDTO.mandatory;
            udfGroupeField.mask = link.userDefinedFieldsDTO.fieldMasc;
            if(link.userDefinedFieldsDTO.fieldType===5){
            const listValue = link.userDefinedFieldsDTO.fieldListValuesDTOs.filter(list => {
              return list.idUDFListValue.toString() === link.fieldValue.toString();
            });
  
            if(listValue.length > 0){
              udfGroupeField.value =  listValue[0].name;
            }
          }
            udfGroupeFields.push(udfGroupeField);
          })
          
         this.udfLinkGroupLoan.filter(grp =>{return grp.userDefinedFieldGroupID === group.id})[0].udfGroupeFieldsModels = udfGroupeFields;
        })
        
        const key = this.getKey();
         this.dbService.update('data', { id: key , 'data': this.udfLinkGroupLoan }).toPromise().then(
          () => {
            this.devToolsServices.openToast(0, 'alert.success');
          },
          error => console.error('Error saving data:', error)
        );
      }
      else {
      this.udfService.updateUdfLinksByElementId(this.udfLinks, this.udfLinks[0].elementId).subscribe(() => {
        //this.udfLinks = res ;
        this.devToolsServices.backTop();
        this.devToolsServices.openToast(0, 'alert.success');
        this.ngOnInit();
      });
    }
  }
  }
  /**
   * prepare udfLinks from the udf form
   * onSubmitElement
   * @returns UserDefinedFieldsLinksEntity[]
   */
  public onSubmitElement(): UserDefinedFieldsLinksEntity[] {
    this.devToolsServices.makeFormAsTouched(this.udfLoanForm);
    if (this.udfLoanForm.invalid) {
      this.validationUdfEmitter.emit(true);
      this.devToolsServices.InvalidControl();
    }else {
      this.validationUdfEmitter.emit(false);
    }
    this.udfLinks = [];
    if (this.udfGroupsSelected.length >= 0) {
      // this.loanEntity.industryCodeDescription = '';
      for (let j = 0; j < this.udfGroupsSelected.length; j++) {
        for (let i = 0; i < this.udfFieldsLoan[j].length; i++) {
          const udfLink: UserDefinedFieldsLinksEntity = new UserDefinedFieldsLinksEntity();
          if (this.category === AcmConstants.LOAN_CATEGORY) {
            udfLink.elementId = this.loan.loanId;
          }
          else if (this.category === AcmConstants.COLLECTION_CATEGORY) {
            udfLink.elementId = this.sharedService.getCollection().id;
            }else if (this.category === AcmConstants.ITEM_CATEGORY) {
              udfLink.elementId = this.sharedService.getItem().id;
          }
          udfLink.category = this.category !== AcmConstants.PROSPECT_CATEGORY ? this.category : AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
          // Setting idAbacusUDFLink and surveysId and id
          udfLink.idAbacusUDFLink = this.udfFieldsLoan[j][i].idAbacusUDFLink;
          udfLink.surveysId = this.udfFieldsLoan[j][i].surveysId;
          udfLink.id = this.udfFieldsLoan[j][i].idUDFLink;
          if (this.udfFieldsLoan[j][i].delete) {
            if (udfLink.idAbacusUDFLink !== undefined && udfLink.surveysId !== undefined) {
              udfLink.fieldValue = '';
            }
          } else if (this.udfFieldsLoan[j][i].fieldType === 5) {
            udfLink.fieldValue = this.udfLoanForm.controls['udfField' + j + i].value?.idUDFListValue;
            udfLink.udfListValueId = this.udfLoanForm.controls['udfField' + j + i].value?.idUDFListLink;
          } else {
            udfLink.fieldValue = this.udfLoanForm.controls['udfField' + j + i].value;
          }
          // save Idustry Code in Loan Entity
          if (this.udfFieldsLoan[j][i].userDefinedFieldGroupDTO.id === 8) {
            this.udfFieldsLoan[j][i].fieldListValuesDTOs.forEach((idustryCode) => {
              if (idustryCode.idUDFListValue.toString() === this.udfLoanForm.controls['udfField' + j + i].value.toString()) {
                //   this.loanEntity.industryCodeDescription += idustryCode.description + '| ';
                // TODO CHANGE TYPE COLUMN INDUSTRY CODE
              }
            });
          }

          udfLink.userDefinedFieldsDTO = this.udfFieldsLoan[j][i];
          udfLink.indexGroup = this.maxIndexGroup;
          this.udfLinks.push(udfLink);
        }
        this.maxIndexGroup++;
      }
    }
    
    return this.udfLinks;
  }

  getKey(){
    switch (this.category){
      case AcmConstants.COLLECTION_CATEGORY:
        return 'getUdfLinkGroupLoanByCollectionId_' + this.sharedService.getCollection().id;
        
      case AcmConstants.COLLATERAL_CATEGORY:
        return 'getUdfLinkGroupLoanByCollateralId_' + this.sharedService.getCollateral()?.idAcmCollateral;
      
    }
  }
  /**
   * mascPlacHolder
   * @param fieldMasc any
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
  /**
   * comparegroup
   *
   */
  comparegroup(group1, group2) {
    if (group1 !== undefined && group2 !== undefined) {
      return group1.id === group2.id;
    }
  }
  /**
   * deleteGroupLoan
   * @param i number
   */
  deleteGroupLoan(i: number) {
    this.udfGroupsSelected[i].enabled = false;
    this.udfFieldsLoan[i].forEach((udfDeleted) => {
      udfDeleted.delete = true;
    });
  }
  /**
   * changeUDFField
   * @param j number
   * @param i number
   */
  async changeUDFField(j: number, i: number) {

    const udfselected = this.udfFieldsLoan[j][i];
    for (let indexUDF = 0; indexUDF < this.udfFieldsLoan[j].length; indexUDF++) {
      if (this.udfFieldsLoan[j][indexUDF].idUDFParentField === udfselected.id) {
        if(!checkOfflineMode()){
        const userDefinedFieldListValuesEntity = new UserDefinedFieldListValuesEntity();
        // Make the link between list values based on the ACM id
        userDefinedFieldListValuesEntity.parentUDFListValue = this.udfLoanForm.controls['udfField' + j + i].value.id;
        await this.udfService.getUdfListValue(userDefinedFieldListValuesEntity).toPromise().then(
          (data) => {
            this.udfFieldsLoan[j][indexUDF].fieldListValuesDTOs = data;
          }
        );
      } else {
        await this.dbService.getByKey('data', 'udf-fields-group-id-' + this.udfFieldsLoan[j][indexUDF].userDefinedFieldGroupDTO.id).toPromise().then((udfFields: any) => {
          if(udfFields !== undefined){
            const res = udfFields.data?.filter(udfField => udfField.id === this.udfFieldsLoan[j][indexUDF].id);
            if(res.length > 0){
              
              let resultListValues = res[0].fieldListValuesDTOs;
              resultListValues = resultListValues.filter((listValue)=> listValue.parentUDFListValue === this.udfLoanForm.controls['udfField' + j + i].value.id);
              this.udfFieldsLoan[j][indexUDF].fieldListValuesDTOs = resultListValues;
            }
          }
          });     
      }
      }
    }

  }
  /**
   * compareFieldUDF
   */
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
