import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LoanCollateralsServices} from './loan-collaterals.services';
import {LoanEntity} from '../../../../shared/Entities/loan.entity';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import {AcmDevToolsServices} from 'src/app/shared/acm-dev-tools.services';
import {SharedService} from 'src/app/shared/shared.service';
import {CollateralEntity} from '../../../../shared/Entities/Collateral.entity';
import { checkOfflineMode } from 'src/app/shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-loan-collaterals',
  templateUrl: './loan-collaterals.component.html',
  styleUrls: ['./loan-collaterals.component.sass']
})
export class LoanCollateralsComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public loading = true;
  public collaterolEntitys: CollateralEntity[] = [];
  public loan: LoanEntity = new LoanEntity();
  public decimalPlaces: string;
  @Input() expanded;
  @Input() customer;

  arrayExpanded = [];
  @Output() collateralDisabled = new EventEmitter<boolean>();
  private loadedData = false;

  @Input() loans: LoanEntity[];
  /**
   * constructor
   * @param LoanCollateralsServices loanCollateralsServices
   * @param LoanSharedService loanSharedService
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public loanCollateralsServices: LoanCollateralsServices, public loanSharedService: SharedService,
              public devToolsServices: AcmDevToolsServices,private dbService: NgxIndexedDBService) {
  }

  async ngOnInit() {
    if (this.expanded && !this.loadedData) {
    this.loan = this.loanSharedService.getLoan();
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    if(!checkOfflineMode()){
    const idLoanList: number[] = [];
    for (let i = 0; i < this.loans.length; i++) {
      idLoanList.push(this.loans[i].loanId);
    }
    await this.loanCollateralsServices.getActiveAndInactiveCollateralsFromACM(idLoanList).toPromise().then(
      (data) => {
        this.collaterolEntitys = data;
        // set the account number associated to each collateralEntity
        this.setAccountNumber();
        this.loading = false;
      }
    );
  } else {
    if(this.customer){
    const data = await this.dbService.getByKey('data','getLoanCollateral_' + this.customer.id ).toPromise() as any;
    if (data === undefined) {
      this.devToolsServices.openToast(3, 'No loans collateral saved for offline use');
    } else {
      this.collaterolEntitys = data.data;
      this.setAccountNumber();
    }
    this.loading = false;
  }
  else {
    this.loading = false;
  }
  }
    this.collaterolEntitys.map((value) => {
      this.arrayExpanded.push(this.expanded);
    });
    if (this.collaterolEntitys.length === 0) {
      this.collateralDisabled.emit(true);
    } else {
      this.collateralDisabled.emit(false);
    }
    this.loadedData = true;
  }
  }

  setAccountNumber(){
    for (let i = 0; i < this.collaterolEntitys.length; i++) {
      // find the loan related to collaterolEntitys[i]
      const loan: LoanEntity = this.loans.find(e =>  Number(e.loanId) === Number(this.collaterolEntitys[i].loan.loanId));
      if (loan !== undefined) {
        this.collaterolEntitys[i].accountNumber = loan.accountNumber;
      }
    }
  }

  toggleCollapse(i) {
    this.arrayExpanded[i] = !this.arrayExpanded[i];
  }

  toggleCollapseEmpty() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }
}
