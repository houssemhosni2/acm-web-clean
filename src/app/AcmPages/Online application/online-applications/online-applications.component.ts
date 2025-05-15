import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { LoanStatutEntity } from 'src/app/shared/Entities/loan.statut.entity';
import { LoanIbEntity } from 'src/app/shared/Entities/loanIb.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { OnlineApplicationsService } from '../online-applications.service';
import { CustomerAddressService } from '../../Customer/customer-address/customer-address.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductEntity} from '../../../shared/Entities/product.entity';
const PrimaryBleu = 'var(--primary)';
@Component({
  selector: 'app-online-applications',
  templateUrl: './online-applications.component.html',
  styleUrls: ['./online-applications.component.sass']
})
export class OnlineApplicationsComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  public loansIbStatut: LoanStatutEntity = new LoanStatutEntity();

  loading: boolean;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public products: ProductEntity[];
  /**
   * constructor
   * @param modal NgbModal
   * @param router Router
   * @param dialog MatDialog
   * @param onlineApplicationService OnlineApplicationService
   * @param formBuilder FormBuilder
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService
   * @param loanSharedService SharedService
   * @param customerAddressService CustomerAddressService
   */
  constructor(public modal: NgbModal, public router: Router, public dialog: MatDialog,
              public onlineApplicationService: OnlineApplicationsService, public formBuilder: FormBuilder,
              public devToolsServices: AcmDevToolsServices, public translate: TranslateService,
              public loanSharedService: SharedService, public customerAddressService: CustomerAddressService) {

  }
  ngOnInit() {
    this.onlineApplicationService.countLoanIbByStatut().subscribe(
      (data) => {
        this.loansIbStatut = data;
      }
    );
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * load list of loanIbDetails
   */
  async loanIbDetails(loanIb: LoanIbEntity) {
    this.loanSharedService.openLoanIb(loanIb);
    await this.router.navigate([AcmConstants.LOAN_IB_INFO_URL]);
  }

  }
