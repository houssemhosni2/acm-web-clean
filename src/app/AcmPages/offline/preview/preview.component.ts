import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerListService } from '../../Customer/customer-list/customer-list.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { GedServiceService } from '../../GED/ged-service.service';
import { LoanApprovalService } from '../../Loan-Application/loan-approval/loan-approval.service';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { map, mergeMap } from 'rxjs/operators';
import { Customer360Services } from '../../Customer/customer360/customer360.services';
import { CustomerServices } from '../../Loan-Application/customer/customer.services';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.sass']
})
export class PreviewComponent implements OnInit {
  type: string;
  title: string;
  data: any[] = [];
  currentUser: UserEntity;
  sync: boolean = false;

  constructor(private route: ActivatedRoute, private sharedService: SharedService,
    private dbService: NgxIndexedDBService, public router: Router,
    public loanManagementService: LoanManagementService,
    public customerManagementService: CustomerManagementService, public gedService: GedServiceService,
    private loanSharedService: SharedService,public customer360Services :Customer360Services,private customerServices: CustomerServices) { }

  ngOnInit() {
    
    this.route.queryParams
      .subscribe(params => {
        this.type = String(params.type).toLowerCase();
        this.title = params.title;
      }
      );

    this.getAll();

    this.currentUser = this.sharedService.getUser();
  }

  getFullName(customer: CustomerEntity): String {
    return this.sharedService.getCustomerName(customer);
  }

  getAll() {
    this.dbService.getAll(this.type).subscribe(data => {
      this.data = data;
    });
  }

  async customerUpdate(rowData, action: string) {
    const queryParams = { offline: '1' };
    sessionStorage.setItem('isFromOfflineSync', 'true');


    this.sharedService.setCustomer(rowData);
    this.sharedService.setLoan(null);
    this.router.navigate([AcmConstants.EDIT_CUSTOMER], { queryParams });

    ///////////////////////////////////////
    if (action === AcmConstants.UPDATE) {
    
          this.sharedService.setCustomer(rowData);
          this.sharedService.setLoan(null);
          if(rowData.id){
            this.router.navigate([AcmConstants.EDIT_CUSTOMER]);
            } else {
              this.router.navigate([AcmConstants.CUSTOMER_URL]);
            }

    } else if (action === AcmConstants.UPDATE_ALL) {
      this.sharedService.setCustomer(rowData);
      this.sharedService.setLoan(null);
      this.router.navigate([AcmConstants.CUSTOMER_MANAGEMENT], { queryParams });
    }
  }

 async collectionUpdate(collection){
    await this.customer360Services.findLoanByIdExtern(collection.idLoanExtern).pipe(
      map(data => {
        this.sharedService.setLoan(data);
        return data;
      }),
      mergeMap(loan => this.customerServices.getCustomerInformation(loan.customerDTO.id))
    ).toPromise().then(data2 => {

      this.sharedService.setCustomer(data2);
    });
    this.sharedService.setCollection(collection);
    sessionStorage.setItem('isFromOfflineSync', 'true');
    this.sharedService.rootingCollectionUrlByStatut('preview');
  }

  /**
 * load list of loanDetails
 */
  loanDetails(loan: LoanEntity) {
    if (loan.stepName === 'Complete Loan Data' || loan.stepName === 'Add Documents' || loan.stepName === 'Guarantor')
      sessionStorage.setItem('isFromOfflineSync', 'true');

    this.loanSharedService.openLoan(loan);
  }



  delete(index, key) {
    this.dbService.delete(index, key).toPromise();
    if(index==='collections'){
      this.dbService.delete('documents',key).toPromise();
      this.dbService.delete('udfLinks',key).toPromise();
      this.dbService.delete('notes', 'collectionNote_' + key).toPromise();
      this.dbService.delete('tasks', 'collectionTask_' + key).toPromise();
    }
    else if(index === 'loans'){
      this.dbService.delete('calculate-loans',key).toPromise();
      this.dbService.delete('notes', 'loanNote_' + key).toPromise();
      this.dbService.delete('collaterals', key).toPromise();
      this.dbService.delete('conditionalApproves', key).toPromise();
      this.dbService.delete('guarantors', key).toPromise();
      this.dbService.delete('tasks', 'loanTask_' + key).toPromise();
    }
    this.getAll();
  }

 async syncronizeElement(element,type,index){
  let error;
    switch (type){
      case 'customers':
        error = await this.sharedService.synchronizeCustomers([element]);
      break;
        case 'loans':
        error = await this.sharedService.synchronizeLoans([element]);
        break;
        case 'prospects':
        error = await this.sharedService.synchronizeProspects([element]);
        break;
        case 'collections':
        error =  await this.sharedService.synchronizeCollections([element]);
        break;
    }
    if(!error){
      this.data.splice(index,1);
    }
  }

}
