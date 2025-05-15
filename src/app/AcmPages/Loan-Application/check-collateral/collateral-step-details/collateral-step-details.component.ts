import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CollateralEntity } from 'src/app/shared/Entities/Collateral.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { DatePipe } from '@angular/common';
import { AppComponent } from 'src/app/app.component';
import { LoanCollateralsServices } from '../loan-collaterals/loan-collaterals.services';
import { LoanCollateralTypeEntity } from 'src/app/shared/Entities/CollateralType.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import {checkOfflineMode, customRequiredValidator} from '../../../../shared/utils';
import { UdfStepWorkflowComponent } from '../../udf-step-workflow/udf-step-workflow.component';
import { NgxIndexedDBService } from 'ngx-indexed-db';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-collateral-step-details',
  templateUrl: './collateral-step-details.component.html',
  styleUrls: ['./collateral-step-details.component.sass']
})

export class CollateralStepDetailsComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @Output() collateralDisabled = new EventEmitter<boolean>();
  public guarantieCollateral = new CollateralEntity();
  public actionCollateralForm = 'add';
  public indexUpdatedCollateral: number;
  public formCollateral: FormGroup;
  public collateralTypes: LoanCollateralTypeEntity[] = [];
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public loading = true;
  public loan: LoanEntity = new LoanEntity();
  public customer: CustomerEntity = new CustomerEntity();
  public guaranties: CollateralEntity[] = [];
  @Input() expanded = true;
  public guarantieNum = 0;
  public page: number;
  public pageSize: number;
  public getUdfList = false;
  public saveUdf = false;

  @Input() isCollateralStep;
  checkUdf: boolean;



  constructor(public loanSharedService: SharedService, public router: Router, public datepipe: DatePipe,private dbService: NgxIndexedDBService,
              public devToolsServices: AcmDevToolsServices, public modalService: NgbModal, public translate: TranslateService,
              public collateralStepService: LoanCollateralsServices, public formBuilder: FormBuilder, public library: FaIconLibrary) {}
/**
 * ng on init
 */
  ngOnInit() {
    
    this.loan = this.loanSharedService.getLoan();
    this.customer = this.loanSharedService.getCustomer();
    this.pageSize = 5;
    this.page = 1;
    if(!checkOfflineMode()){
    const collateralEntity = new CollateralEntity();
    collateralEntity.loan = this.loan;
    this.collateralStepService.findCollateralByLoan(collateralEntity).subscribe(
      (data) => {
        if (data !== null) {
          this.guaranties = data;
        }
      }
    );
    this.collateralStepService.findCollateralTypes(new LoanCollateralTypeEntity()).subscribe(
      (data) => {
        if (data !== null) {
          this.collateralTypes = data;
          this.collateralTypes = this.collateralTypes.filter(item => item.productIds.includes(this.loan.productId.toString())
           ||item.productIds==="");

        }
      }
    );
  } else {

    this.dbService.getByKey('data','getCollateralByLoanId_' + this.loan.loanId).subscribe((collaterals:any)=>{
      if(collaterals !== undefined){
        this.guaranties = collaterals.data;
      }
    })

    this.dbService.getByKey('data','find_collateral_types').subscribe((results:any) =>{
      if(results === undefined ){
        this.devToolsServices.openToast(3, 'No Collateral Types saved for offline use');
      } else {
        this.collateralTypes = results.data;
        this.collateralTypes = this.collateralTypes.filter(item => item.productIds.includes(this.loan.productId.toString())
         ||item.productIds==="");
      }
    })
  }
    /* if (this.guaranties.length === 0) {
       this.collateralDisabled.emit(true);
     } else {
       this.collateralDisabled.emit(false);
     }*/
  }
  /**
   * create form
   */
  createForm() {
    let loanCollateralTypeEntityParam :LoanCollateralTypeEntity;
    if (this.actionCollateralForm === 'edit') {
      // in EDIT mode : loanCollateralType is defined
        loanCollateralTypeEntityParam = new LoanCollateralTypeEntity();
        loanCollateralTypeEntityParam.idExtern = this.guarantieCollateral.collateralTypeIdExtern;
        loanCollateralTypeEntityParam.description = this.guarantieCollateral.collateralTypeDescription;
    } else {
      // in ADD mode : loanCollateralType is undefined
      loanCollateralTypeEntityParam = null;
    }

    this.formCollateral = this.formBuilder.group({
      reference: [this.guarantieCollateral.reference ],
      description: [this.guarantieCollateral.description ],
      collateralType: [loanCollateralTypeEntityParam  !== null ? loanCollateralTypeEntityParam : '' , customRequiredValidator],
      grossValue: [this.guarantieCollateral.grossValue , customRequiredValidator],
      valueDate: [this.datepipe.transform(this.guarantieCollateral.valueDate, 'yyyy-MM-dd'), customRequiredValidator ],
      realisedValue: [this.guarantieCollateral.realisedValue, customRequiredValidator],
      fixedCost: [this.guarantieCollateral.fixedCost, customRequiredValidator],
      netValue: [this.guarantieCollateral.netValue , customRequiredValidator],
      expiryDate: [this.datepipe.transform(this.guarantieCollateral.expiryDate, 'yyyy-MM-dd') ]
    });
  }
  /**
   * add Guarantie
   * @param content any
   */
  addGuarantie(content) {
    this.guarantieCollateral = new CollateralEntity();
    this.actionCollateralForm = 'add';
    this.createForm();
    this.loanSharedService.setLoan(this.loan);
    this.modalService.open(content, {
      size: 'xl'
    });
  }
  /**
   * edit Guarantie
   * @param index number
   * @param content any
   */
  editGuarantie(index, content) {
    this.indexUpdatedCollateral = index;
    this.actionCollateralForm = 'edit';
    this.guarantieCollateral = this.guaranties[index];
    this.loanSharedService.setCollateral(this.guaranties[index]);
    this.createForm();
    this.modalService.open(content, {
      size: 'xl'
    });
  }
/**
 * on submit
 */
  async onSubmit(udfLink : UserDefinedFieldsLinksEntity[]) {
      if (this.checkUdf) {
        return;
      }
      this.saveUdf = !this.saveUdf;

    this.guarantieCollateral.userDefinedFieldsLinksDTOs = udfLink;
    this.guarantieCollateral.reference = this.formCollateral.controls.reference.value || '';
    this.guarantieCollateral.description = this.formCollateral.controls.description.value || '';
    this.guarantieCollateral.collateralTypeIdExtern = this.formCollateral.controls.collateralType.value.idExtern;
    this.guarantieCollateral.grossValue = this.formCollateral.controls.grossValue.value;
    this.guarantieCollateral.valueDate = this.formCollateral.controls.valueDate.value;
    this.guarantieCollateral.realisedValue = this.formCollateral.controls.realisedValue.value;
    this.guarantieCollateral.fixedCost = this.formCollateral.controls.fixedCost.value;
    this.guarantieCollateral.netValue = this.formCollateral.controls.netValue.value;
    this.guarantieCollateral.expiryDate = this.formCollateral.controls.expiryDate.value || '';
    this.guarantieCollateral.loan = new LoanEntity();
    this.guarantieCollateral.loan.loanId = this.loan.loanId;
    this.guarantieCollateral.collateralTypeDescription = this.formCollateral.controls.collateralType.value.description;
    this.guarantieCollateral.externLoanId = Number(this.loan.idLoanExtern);
    this.guarantieCollateral.customer = new CustomerEntity();
    this.guarantieCollateral.customer.id = this.customer.id;
    this.guarantieCollateral.externCustomerId = this.customer.customerIdExtern;
    this.guarantieCollateral.idAccountExtern = this.loan.idAccountExtern;

    if (this.actionCollateralForm === 'add') {
      this.guarantieCollateral.action = AcmConstants.ACTION_INSERT;

      this.modalService.dismissAll();
    } else if (this.actionCollateralForm === 'edit') {
      this.guarantieCollateral.action = AcmConstants.ACTION_UPDATE
      //this.guaranties[this.indexUpdatedCollateral] = this.guarantieCollateral;
      this.createForm();
      this.modalService.dismissAll();
    }
    if(checkOfflineMode()){
      if (this.actionCollateralForm === 'edit' && !this.guarantieCollateral.idAcmCollateral){
        this.guarantieCollateral.action = AcmConstants.ACTION_INSERT;
      }

      if(this.actionCollateralForm === 'add'){
        this.guaranties.push(this.guarantieCollateral);
      }else if (this.actionCollateralForm === 'edit') {
        this.guaranties[this.indexUpdatedCollateral] =this.guarantieCollateral
      }

        await this.dbService.update('collaterals', {loanId : this.loan.loanId , loanCollateral : this.guaranties }).toPromise().then(()=>{
          
          this.dbService.update('data',{id : 'getCollateralByLoanId_' + this.loan.loanId , data : this.guaranties}).toPromise()
        });

    } else {
      this.collateralStepService.saveUpdateDelete( this.guarantieCollateral).subscribe((data)=>{
        if(this.actionCollateralForm === 'add'){
          this.guaranties.push(data);
        }else if (this.actionCollateralForm === 'edit') {
          this.guaranties[this.indexUpdatedCollateral] =data
        }
      }
       );
    }
    
    this.guarantieCollateral = new CollateralEntity();
    this.indexUpdatedCollateral = null;
    // this.collateralDisabled.emit(false);
  }
  /**
   * toggle collapse
   */
  toggleCollapse() {
    this.expanded = !this.expanded;
  }
  /**
   * compare collateral type
   * @param collateralType1 LoanCollateralTypeEntity
   * @param collateralType2 LoanCollateralTypeEntity
   * @returns boolean
   */
  compareCollateralType(collateralType1, collateralType2) {
    if (collateralType1 !== null && collateralType2 !== null) {
      return collateralType1.idExtern === collateralType2.idExtern;
    }

  }
  /**
   * close modal
   */
  closeModale() {
    this.modalService.dismissAll();
  }
  /**
   * delete Guarantie
   * @param index number
   */
  async deleteGuarantie(index) {
    this.guaranties[index].action =AcmConstants.ACTION_DELETE;
    if(checkOfflineMode()){
      let updatedData = [...this.guaranties]
      if(!this.guaranties[index].idAcmCollateral){
        updatedData.splice(index, 1);
      }
      await this.dbService.update('collaterals', {loanId : this.loan.loanId , loanCollateral : updatedData}).toPromise();

      updatedData = updatedData.filter(collateral => collateral.action !== AcmConstants.ACTION_DELETE);
      await this.dbService.update('data',{id : 'getCollateralByLoanId_' + this.loan.loanId , data : updatedData}).toPromise();

    } else {
      this.collateralStepService.saveUpdateDelete( this.guaranties[index]).subscribe();
    }
    
    this.guaranties.splice(index, 1);
    //this.collateralDisabled.emit(false);
  }
  /**
   *
   * @returns get Guarantie
   */
  getGuaranties() {
    return this.guaranties;
  }
  /**
   * gross value changed
   */
  grossValueChanged() {
   const realisedValue= (this.formCollateral.controls.grossValue.value * this.formCollateral.controls.collateralType.value.collectionPourcentage)/100;
    this.formCollateral.controls.realisedValue.setValue(realisedValue);
    this.fixedCostChanged();
  }
  /**
   * fixed cost changed
   */
  fixedCostChanged() {
    const netValue = this.formCollateral.controls.realisedValue.value - this.formCollateral.controls.fixedCost.value;
    this.formCollateral.controls.netValue.setValue(netValue);
  }
  /** get direction */
  getDirection() {
    return AppComponent.direction;
  }
  /**
   * collateral type changed
   */
  collateralTypeChanged()
  {
    this.formCollateral.controls.fixedCost.setValue(this.formCollateral.controls.collateralType.value.collectionCost);
  }
  save() {
    this.getUdfList = !this.getUdfList
  }
  validationUdf(udfLink : boolean)  {
    this.checkUdf = udfLink
  }
}
