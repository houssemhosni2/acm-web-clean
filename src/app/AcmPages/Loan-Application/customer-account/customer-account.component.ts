import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerAccountEntity} from 'src/app/shared/Entities/customer.account.entity';
import {LoanDetailsServices} from '../loan-details/loan-details.services';
import {SharedService} from 'src/app/shared/shared.service';
import {LoanEntity} from 'src/app/shared/Entities/loan.entity';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import {AcmDevToolsServices} from 'src/app/shared/acm-dev-tools.services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from '../../../app.component';
import {TranslateService} from '@ngx-translate/core';
import { CustomerAccount360Service } from '../../Customer/customer-account-360/customer-account-360.service';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.sass']
})
export class CustomerAccountComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };

  public loading = false;
  public page: number;
  public pageSize: number;
  public decimalPlaces: string;
  public customerAccounts: CustomerAccountEntity[] = [];
  public loan: LoanEntity = new LoanEntity();
  @Input() expanded;
  /**
   * constructor
   * @param loanDetailsServices LoanDetailsServices
   * @param loanSharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   * @param modalService NgbModal
   * @param translate TranslateService
   */
  constructor(private loanDetailsServices: LoanDetailsServices,
              private loanSharedService: SharedService,
              private devToolsServices: AcmDevToolsServices,
              private modalService: NgbModal, private translate: TranslateService,
              private customerAccountService: CustomerAccount360Service) {
  }

  ngOnInit() {
    this.customerAccounts = [];
    if (this.expanded) {
    this.customerAccounts = [];
    this.loading = true;
    this.loan = this.loanSharedService.getLoan();
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    this.pageSize = 5;
    this.page = 1;
    this.customerAccountService.getCustomersAccount(this.loan.customerDTO.customerIdExtern).subscribe(
      (customerAccountEntity) => {
        if (customerAccountEntity.length === 0) {
          this.loading = false;
        }
        customerAccountEntity.forEach(element => {
          if (this.loan.idLoanExtern !== element.loanId) {
            // load only the customer account different of the actual account
            this.customerAccounts.push(element);
            this.loading = false;
          } else {
            this.loading = false;
          }
      });
      }
    );
    }
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }

  /**
   * methode to open the popup schedule
   * param content
   */
  openLarge(content) {
    this.modalService.open(content, {
      size: 'xl'
    });
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }
}
