import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CollectionServices } from '../../Collection/collection.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { DashbordServices } from '../../Loan-Application/dashbord/dashbord.services';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { animate, style, transition, trigger } from '@angular/animations';
import { OfflineService } from 'src/app/shared/offline.service';
import { CollectionPaginationEntity } from 'src/app/shared/Entities/collection.pagination.entity';
import { AcmAmlCheckEntity } from 'src/app/shared/Entities/AcmAmlCheck';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerPaginationEntity } from 'src/app/shared/Entities/customer.pagination.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { DabshbordTableComponent } from '../../Loan-Application/dashbord/dabshbord-table/dabshbord-table.component';
import { CustomerListComponent } from '../../Customer/customer-list/customer-list.component';
import { CollectionComponent } from '../../Collection/collection/collection.component';

@Component({
  selector: 'app-setting-offline',
  templateUrl: './setting-offline.component.html',
  styleUrls: ['./setting-offline.component.sass'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]  
})
export class SettingOfflineComponent implements OnInit {

  public status: SelectItem[];
  public products: SelectItem[];
  public branches: SelectItem[];
  public advancedLoanSearch: boolean = false;
  public advancedCustomerSearch: boolean = false;
  public advancedCollectionSearch: boolean = false;
  public advancedLegalSearch: boolean = false;
  
  public loanPaginationEntity : LoanPaginationEntity = new LoanPaginationEntity()
  public collectionPaginationEntity : CollectionPaginationEntity = new CollectionPaginationEntity();
  public legalPaginationEntity : CollectionPaginationEntity = new CollectionPaginationEntity();

  amlStatusList: String[] = ['PENDING', 'FLAGGED', 'CLEARED']
  
  public branchesCollection : SelectItem[] = [];
  public statusList: SelectItem[] = [];
  public productsCollection: SelectItem[] = [];

  public statusLegalList: SelectItem[] = [];
  public branchesLegal: SelectItem[] = [];
  public productsLegal: SelectItem[] = [];


  public loanPaginationForm : FormGroup;
  public customerPaginationForm : FormGroup;
  public collectionPaginationForm : FormGroup;
  public legalPaginationForm : FormGroup;

  @ViewChild(DabshbordTableComponent)
  dashboardTableComponent: DabshbordTableComponent;

  @ViewChild(CustomerListComponent)
  customerListComponent: CustomerListComponent;

  @ViewChild(CollectionComponent)
  collectionComponent: CollectionComponent;

  constructor(public formBuilder: FormBuilder,private collectionService: CollectionServices,public translate: TranslateService,public dashbordService: DashbordServices
    ,public loanSharedService: SharedService,private offlineService: OfflineService) { }

  async ngOnInit() {
    this.loanSharedService.setLoanPaginationOffline(null);
    this.loanSharedService.setCustomersPaginationOffline(null);
    this.loanSharedService.setCollectionPaginationOffline(null);
    this.loanSharedService.setLegalPaginationOffline(null);
    await this.loadDataList();
    this.createForms();
  }

  async loadDataList() {

    const searchLoan = new LoanEntity();
    searchLoan.listStatus = [0,1,2,7,3,4]


    await this.dashbordService.loadFilterStatusWorkflow(searchLoan).subscribe(
        (data) => {
            this.status = [];
            data.forEach(element => {
                this.status.push({
                    label: element.statutLibelle,
                    value: element.statutWorkflow
                });
            });
        })
    await this.dashbordService.loadFilterProduct(searchLoan).subscribe(
        (data) => {
            this.products = [];
            data.forEach(element => {
                this.products.push({
                    label: element.productDescription,
                    value: element.productDescription
                });
            });
        });
    this.branches = [];
    await this.dashbordService.loadFilterBranch(searchLoan).subscribe(
        (data) => {
            data.forEach(element => {
                this.branches.push({
                    label: element.branchName,
                    value: element.branchName
                });
            });
        });

    const collectionEntity = new CollectionEntity();
    collectionEntity.collectionType = AcmConstants.COLLECTION_CATEGORY;
    await this.collectionService.loadFilterCollectionBranch(collectionEntity).subscribe(
        (data) => {
            this.branchesCollection = [];
            data.forEach(element => {
                this.branchesCollection.push({
                    label: element.branchDescription,
                    value: element.branchDescription
                });
            });
        });
    await this.collectionService.loadFilterCollectionStatus(collectionEntity).subscribe(
        (data) => {
            this.statusList = [];
            const listString: string[] = [];
            data.forEach(element => {
                if (element.statutLibelle !== undefined) {
                    listString.push(element.statutLibelle);
                } else if (listString.indexOf(element.statutLibelleDone) === -1) {
                    listString.push(element.statutLibelleDone);
                }
            });
            listString.forEach(statutLib =>
                this.statusList.push({
                    label: statutLib,
                    value: statutLib
                }));
        });
    await this.collectionService.loadFilterCollectionProduct(collectionEntity).subscribe(
        (data) => {
            this.productsCollection = [];
            data.forEach(element => {
                this.productsCollection.push({
                    label: element.productDescription,
                    value: element.productDescription
                });
            });
        });

    // legal params
    const LegalCollectionEntity = new CollectionEntity();
    LegalCollectionEntity.collectionType = AcmConstants.LEGAL_CATEGORY;
    await this.collectionService.loadFilterCollectionStatus(LegalCollectionEntity).subscribe(
        (data) => {
            this.statusLegalList = [];
            const listString: string[] = [];
            data.forEach(element => {
                if (element.statutLibelle !== undefined) {
                    listString.push(element.statutLibelle);
                } else if (listString.indexOf(element.statutLibelleDone) === -1) {
                    listString.push(element.statutLibelleDone);
                }
            });
            listString.forEach(statutLib =>
                this.statusLegalList.push({
                    label: statutLib,
                    value: statutLib
                }));
        });
    await this.collectionService.loadFilterCollectionProduct(LegalCollectionEntity).subscribe(
        (data) => {
            this.productsLegal = [];
            data.forEach(element => {
                this.productsLegal.push({
                    label: element.productDescription,
                    value: element.productDescription
                });
            });
        });
    await this.collectionService.loadFilterCollectionBranch(LegalCollectionEntity).subscribe(
        (data) => {
            this.branchesLegal = [];
            data.forEach(element => {
                this.branchesLegal.push({
                    label: element.branchDescription,
                    value: element.branchDescription
                });
            });
        }); 
}
createForms() {
  // Loan Pagination Form
  this.loanPaginationForm = this.formBuilder.group({
    advancedSearch:[false],
    isChecked:[false],
    customerType: [''],                   
    productDescription: [''],            
    customerNameNoPipe: [''],                
    branchName: [''],                  
    etapeWorkflow: ['']                
  });

  // Customer Pagination Form
  this.customerPaginationForm = this.formBuilder.group({
    advancedSearch:[false],
    isChecked:[false],
    customerType2: [''],                     
    identity: [''],                               
    branch: [''],                                 
    accountPortfolioDescription: [''],            
    amlStatus: ['']                           
  });

  // Collection Pagination Form
  this.collectionPaginationForm = this.formBuilder.group({
    advancedSearch:[false],
    isChecked:[false],
    customerType3: [''],                          
    productName: [''],                            
    loanOfficer: [''],                               
    branchCollection: [''],                      
    statutLibelle: ['']               
  });

  // Legal Pagination Form
  this.legalPaginationForm = this.formBuilder.group({
    advancedSearch:[false],
    isChecked:[false],
    customerType3: [''],                          
    productName: [''],                            
    loanOfficer: [''],                               
    branchCollection: [''],                      
    statutLibelle: ['']               
  });
}

submit(){
  this.getLoanPaginationParam();
  this.getCustomerPaginationParam();
  this.getCollectionPaginationParam();
  this.getLegalPaginationParam();

  this.loanSharedService.triggerGoOffline();
  }


  getLoanPaginationParam(){
    if(!this.loanPaginationForm.get('advancedSearch').value){
    if(this.loanPaginationForm.get('isChecked').value){
      const loanPag = new LoanPaginationEntity();
      loanPag.pageSize = 9999;
      const loanParams = new LoanEntity();

      loanParams.productDescription = this.loanPaginationForm.get('productDescription')?.value ? this.loanPaginationForm.get('productDescription').value : null;
      loanParams.customerName = this.loanPaginationForm.get('customerNameNoPipe')?.value ? this.loanPaginationForm.get('customerNameNoPipe').value : null;
      loanParams.statutLibelle = this.loanPaginationForm.get('etapeWorkflow')?.value ? this.loanPaginationForm.get('etapeWorkflow').value : null;
      loanParams.customerType = this.loanPaginationForm.get('customerType')?.value ? this.loanPaginationForm.get('customerType').value : null;
      loanParams.branchName = this.loanPaginationForm.get('branchName')?.value ? this.loanPaginationForm.get('branchName').value : null;
      
      loanPag.params = loanParams;

      this.loanSharedService.setLoanPaginationOffline(loanPag);
    } else {
      this.loanSharedService.setLoanPaginationOffline(null);
    }
  }
  }
  getCustomerPaginationParam(){
    if(!this.customerPaginationForm.get('advancedSearch').value){
    if(this.customerPaginationForm.get('isChecked').value){
      const customerPag = new CustomerPaginationEntity();
      customerPag.pageSize = 99999;
      const param = new CustomerEntity();

      param.customerType = this.customerPaginationForm.get('customerType2')?.value ? this.customerPaginationForm.get('customerType2').value : null;
      param.identity = this.customerPaginationForm.get('identity')?.value ? this.customerPaginationForm.get('identity').value : null;
      param.branchesName = this.customerPaginationForm.get('branch')?.value ? this.customerPaginationForm.get('branch').value : null;
      param.accountPortfolioDescription = this.customerPaginationForm.get('accountPortfolioDescription')?.value ? this.customerPaginationForm.get('accountPortfolioDescription').value : null;
      if(this.customerPaginationForm.get('amlStatus')?.value){
      const amlCheckDto = new AcmAmlCheckEntity();
      amlCheckDto.amlStatus = this.customerPaginationForm.get('amlStatus').value;
      param.acmAmlChecksDTOs = [amlCheckDto];
      }
      customerPag.params = param;

      this.loanSharedService.setCustomersPaginationOffline(customerPag);

    } else {
      this.loanSharedService.setCustomersPaginationOffline(null);
    }
  }
  }
  getCollectionPaginationParam(){
    if(!this.collectionPaginationForm.get('advancedSearch').value){
    if(this.collectionPaginationForm.get('isChecked').value){
      const collectionPag = new CollectionPaginationEntity();
      collectionPag.pageSize = 9999;

      const param = new CollectionEntity();
      param.collectionType = AcmConstants.COLLECTION_CATEGORY;

      param.typeCustomer = this.collectionPaginationForm.get('customerType3')?.value ? this.collectionPaginationForm.get('customerType3').value : null;
      param.productDescription = this.collectionPaginationForm.get('productName')?.value ? this.collectionPaginationForm.get('productName').value : null;
      param.loanOfficer = this.collectionPaginationForm.get('loanOfficer')?.value ? this.collectionPaginationForm.get('loanOfficer').value : null;
      param.branchDescription = this.collectionPaginationForm.get('branchCollection')?.value ? this.collectionPaginationForm.get('branchCollection').value : null;
      param.statutLibelle = this.collectionPaginationForm.get('statutLibelle')?.value ? this.collectionPaginationForm.get('statutLibelle').value : null;

      collectionPag.params = param;

      this.loanSharedService.setCollectionPaginationOffline(collectionPag);

    } else {
      this.loanSharedService.setCollectionPaginationOffline(null);
    }
  }
  }
  getLegalPaginationParam(){
    if(!this.legalPaginationForm.get('advancedSearch').value){
    if(this.legalPaginationForm.get('isChecked').value){
      const legalPag = new CollectionPaginationEntity();
      legalPag.pageSize = 9999;

      const param = new CollectionEntity();
      param.collectionType = AcmConstants.LEGAL_CATEGORY;

      param.typeCustomer = this.legalPaginationForm.get('customerType3')?.value ? this.legalPaginationForm.get('customerType3').value : null;
      param.productDescription = this.legalPaginationForm.get('productName')?.value ? this.legalPaginationForm.get('productName').value : null;
      param.loanOfficer = this.legalPaginationForm.get('loanOfficer')?.value ? this.legalPaginationForm.get('loanOfficer').value : null;
      param.branchDescription = this.legalPaginationForm.get('branchCollection')?.value ? this.legalPaginationForm.get('branchCollection').value : null;
      param.statutLibelle = this.legalPaginationForm.get('statutLibelle')?.value ? this.legalPaginationForm.get('statutLibelle').value : null;

      legalPag.params = param;

      this.loanSharedService.setLegalPaginationOffline(legalPag);
    } else {
      this.loanSharedService.setLegalPaginationOffline(null);
    }
  }
  }

  
  async advancedLoan(){
    const loanPaginationEntityParms: LoanPaginationEntity = new LoanPaginationEntity();
    let searchLoan =  new LoanEntity();
    searchLoan.parentId = 0 ;
    searchLoan.listStatus = [0,1,2,7,3,4]
    loanPaginationEntityParms.params = searchLoan;
    loanPaginationEntityParms.pageSize = 10;
    loanPaginationEntityParms.pageNumber = 0;
    await this.dashbordService.loadDashboardByStatusPagination(loanPaginationEntityParms).subscribe(
      (data) => {
        this.loanPaginationEntity = data;
        this.loanPaginationEntity.resultsLoans.forEach((customer) => {
          if(customer.statut=='4'|| customer.statut=='8')
            {
               customer.applyAmountTotal=customer.approvelAmount;
            }
          customer.customerNameNoPipe = this.loanSharedService.getCustomerName(customer.customerDTO);
        });
        this.advancedLoanSearch = true
      });
  }

  async advancedCustomer(){
    this.advancedCustomerSearch = true
  }

  async advancedCollection(){
    const collectionPaginationEntityParms: CollectionPaginationEntity = new CollectionPaginationEntity();
    let searchCollection : CollectionEntity = new CollectionEntity();
    searchCollection.collectionType = AcmConstants.COLLECTION_CATEGORY;

    collectionPaginationEntityParms.params = searchCollection;
    collectionPaginationEntityParms.pageSize = 10;
    collectionPaginationEntityParms.pageNumber = 0;

    await this.collectionService.loadDashboardByStatusPagination(collectionPaginationEntityParms).subscribe(
      (data) => {
        
        this.collectionPaginationEntity = data;
        this.advancedCollectionSearch = true

      });
  }
  
  async advancedLegal(){
    const collectionPaginationEntityParms: CollectionPaginationEntity = new CollectionPaginationEntity();
    let searchCollection : CollectionEntity = new CollectionEntity();
    searchCollection.collectionType = AcmConstants.LEGAL_CATEGORY;

    collectionPaginationEntityParms.params = searchCollection;
    collectionPaginationEntityParms.pageSize = 10;
    collectionPaginationEntityParms.pageNumber = 0;

    await this.collectionService.loadDashboardByStatusPagination(collectionPaginationEntityParms).subscribe(
      (data) => {
        
        this.legalPaginationEntity = data;
        this.advancedLegalSearch = true
      });
  }

  submitLoanSearch(){
    this.dashboardTableComponent.getOfflineLoanPagination();
    this.advancedLoanSearch = false;
    this.loanPaginationForm.controls['advancedSearch'].setValue(true);
  }
  submitCustomerSearch(){
    this.customerListComponent.getOfflineCustomersPagination();
    this.advancedCustomerSearch = false ;
    this.customerPaginationForm.controls['advancedSearch'].setValue(true);
  }
  submitCollectionSearch(){
    this.collectionComponent.getOfflineCollectionPagination();
    this.advancedCollectionSearch = false;
    this.collectionPaginationForm.controls['advancedSearch'].setValue(true);
    console.log(this.loanSharedService.getCollectionPaginationOffline());
    
  }
  submitLegalSearch(){
    this.collectionComponent.getOfflineCollectionPagination();
    this.advancedLegalSearch = false;
    this.legalPaginationForm.controls['advancedSearch'].setValue(true);
  }
}
