import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from "ngx-loading";
import { GedServiceService } from '../../GED/ged-service.service';
import { SharedService } from 'src/app/shared/shared.service';
import { LoansTransaction } from 'src/app/shared/Entities/LoansTransaction.entity';
import { CustomerAccount360Service } from '../customer-account-360/customer-account-360.service';
import { AcmTransaction } from 'src/app/shared/Entities/AcmTransaction.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
const PrimaryBleu = "var(--primary)";
@Component({
  selector: 'app-customer-transactions',
  templateUrl: './customer-transactions.component.html',
  styleUrls: ['./customer-transactions.component.sass']
})
export class CustomerTransactionsComponent implements OnInit {

  @Input() expanded;
  @ViewChild("ngxLoading") ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public loading = true;
  public loansTransactionsList: LoansTransaction[] = [];
  expandedLoans: boolean[] = [];

  public pageSize: number;
  public page: number;

  constructor(public gedServiceService: GedServiceService,public loanSharedService: SharedService,
    public customerAccount360Service :CustomerAccount360Service, public devToolsServices: AcmDevToolsServices
  ) { }

  ngOnInit(): void {
    this.pageSize = 5;
    this.page = 1;
    
    this.gedServiceService.findLoanByCustumer(this.loanSharedService.getCustomer().id).subscribe((data) => {
      data.forEach((loan)=> {
        let elt : LoansTransaction = new LoansTransaction();
        elt.loanId = loan.loanId;
        elt.transactions = [];
        elt.page = 1;
        elt.pageSize = 5;        
        this.loansTransactionsList.push(elt);
        this.loansTransactionsList.forEach(() => this.expandedLoans.push(false));
        this.loading = false;
      })
    });
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  toggleLoanExpand(index: number, loandId) {
    this.expandedLoans[index] = !this.expandedLoans[index];
    if(this.expandedLoans[index] == true){
      let acmTransaction : AcmTransaction = new AcmTransaction();
      acmTransaction.idAcmLoan = loandId;
      acmTransaction.idAcmCustomer = this.loanSharedService.getCustomer().id;
      this.customerAccount360Service.findTransaction(acmTransaction).subscribe((res)=>{
        this.loansTransactionsList.filter((item)=> item.loanId == loandId).map((item)=> item.transactions = res);
      })
    }    
  }

}
