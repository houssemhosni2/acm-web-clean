import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { SettingsService } from '../../Settings/settings.service';
import { BrancheEntity } from 'src/app/shared/Entities/branche.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { Router } from '@angular/router';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { GenericWorkFlowObject } from 'src/app/shared/Entities/GenericWorkFlowObject';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import {customRequiredValidator} from '../../../shared/utils';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.sass']
})
export class CreateItemComponent implements OnInit {
  public expandedFeatureProduct = true;
  public users: UserEntity[] = [];
  public usersSelected: UserEntity[] = [];
  public  productEntitys: GenericWorkFlowObject[];
  public brancheEntitys: AcmBranches[] = [];
  public item  : ItemEntity = new ItemEntity() ;


  formFeatureProduct : FormGroup ;
  public configUsers = {
    displayKey: 'fullName',
    search: true,
    placeholder: ' ',
    searchOnKey: 'fullName',
    height: '400px'
  };
  public configBranch = {
    displayKey: 'description',
    search: true,
    placeholder: ' ',
    searchOnKey: 'description',
    height: '400px'
  };

  constructor(public devToolsServices :AcmDevToolsServices,public formBuilder: FormBuilder,
    public authenticationService: AuthentificationService,public settingsService: SettingsService,
    public loanManagementService: LoanManagementService ,public router: Router) { }

  ngOnInit(): void {
    this.createFormFeatureProduct() ;
    this.getUsers();
    this.findAllObject() ;
    this.loadBranch() ;

  }


  toggleCollapseFeatureProduct() {
    this.expandedFeatureProduct = !this.expandedFeatureProduct;
  }

  findAllObject() {
    this.settingsService.findWorkFlowObjects().subscribe(
      (data) => {
        this.productEntitys = data;

      }
    );
  }
  exit() {

    this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.DASHBOARD_URL);

}

createFormFeatureProduct() {
  this.formFeatureProduct = this.formBuilder.group({
    workFlow: ['' , customRequiredValidator],
    branch : ['' , customRequiredValidator],

  });
}
idsExtBranch : string = ""  ;

launchWorkFlow() {
  let item  = new ItemEntity() ;
 this.brancheEntitys =  this.formFeatureProduct.controls.branch.value ;
      this.brancheEntitys.forEach(item => this.idsExtBranch =this.idsExtBranch+item.id+"," )
      this.idsExtBranch  = this.idsExtBranch.slice(0, -1);

  item.genericWorkFlowObject = this.formFeatureProduct.controls.workFlow.value ;
  item.branches =  this.idsExtBranch ;
  this.settingsService.createItem(item).subscribe(res=>{
    item= res ;
    this.router.navigate([AcmConstants.DASHBOARD_ITEM_URL]);

  })


  // let currentDate: Date = new Date();
  // let loanEntity :LoanEntity= new LoanEntity();
  // let customerDto: CustomerEntity=new CustomerEntity();
  // let productDto: ProductEntity=new ProductEntity();
  // customerDto.id=6;
  // productDto.id=this.formFeatureProduct.controls.workFlow.value.id;
  // productDto.productIdAbacus=this.formFeatureProduct.controls.workFlow.value.id;
  // loanEntity.applyAmountTotal=30000;
  // loanEntity.approvelAmount=30000;
  // loanEntity.initialPaymentDate=currentDate;
  // loanEntity.repaymentPeriod=3;
  // loanEntity.termPeriod=3;
  // loanEntity.portfolioCode="005005";
  // loanEntity.portfolioId="5";
 // loanEntity.accountNumberExtern=this.formFeatureProduct.controls.customerTarget.value;
  // loanEntity.loanReasonCode="A";
  // loanEntity.productCode=this.formFeatureProduct.controls.workFlow.value.code;
  // loanEntity.productDescription=this.formFeatureProduct.controls.workFlow.value.description;
  // loanEntity.productRate = 0;
//  loanEntity.commentsCustomerDecision=this.formFinancialAspect.controls.taxAccountingImpacts.value;
  // loanEntity.loanReasonDescription="0";

  // loanEntity.effectiveIntRate=0;
  //productDto.maxAccounts=200;
  // loanEntity.productId=this.formFeatureProduct.controls.workFlow.value.id;
  // loanEntity.branchID=12;
  // loanEntity.branchName='Siège BT'
  // loanEntity.productDTO=productDto;
  // loanEntity.customerDTO= customerDto;
  // loanEntity.currencyDecimalPlaces='3';
  // loanEntity.customerType='INDIV';

//    this.loanManagementService.createLoan(loanEntity).toPromise().then(resultEntity => {
//     this.devToolsServices.openToast(0, 'alert.success');
//  //   this.sharedService.setLoader(false);
//     this.router.navigate([AcmConstants.DASHBOARD_URL] ,{ queryParams: { mode: 'RAPPORT' } } );

 // });

}

getUsers() {
  this.authenticationService.loadAllUserList().subscribe(
    (data) => {
      this.users = data;
    });
}

public productEntityWorkflow: ProductEntity;
public productSelected = false ;
public enabled = false ;


selectProductWorkflow() {
  this.productEntityWorkflow =  this.formFeatureProduct.controls.workFlow.value;
  this.productSelected = true;
  this.enabled = this.productEntityWorkflow.enabled;
}

loadBranch(){
this.settingsService.findBranches(new AcmBranches()).subscribe(
  (data) => {
    this.brancheEntitys = data;
  }
);
}

}
