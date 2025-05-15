import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerPaginationEntity } from 'src/app/shared/Entities/customer.pagination.entity';
import { CustomerMezaCardStatutEntity } from 'src/app/shared/Entities/customerMezaCardStatut.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerMezaCardTableComponent } from './customer-meza-card-table/customer-meza-card-table.component';
import { CustomerMezaCardService } from './customer-meza-card.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
@Component({
  selector: 'app-customer-meza-card',
  templateUrl: './customer-meza-card.component.html',
  styleUrls: ['./customer-meza-card.component.sass']
})
export class CustomerMezaCardComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild(CustomerMezaCardTableComponent, { static: true }) customerMezaCardTableComponent: CustomerMezaCardTableComponent;

  public customerMezaCardStatut = new CustomerMezaCardStatutEntity();
  public statusSent = true;
  public customerMezaCards: CustomerEntity[] = [];
  public customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();
  public currentPath = AcmConstants.MEZA_CARD_CHECK_PATH;
  /**
   * constructor
   * @param customerMezaCardService CustomerMezaCardService
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService
   */
  constructor(public router: Router,
              public customerMezaCardService: CustomerMezaCardService,
              public devToolsServices: AcmDevToolsServices, public translate: TranslateService,
              public cutomerMezaCardService: CustomerMezaCardService, public sharedService: SharedService) {
  }
  ngOnInit() {
    this.customerMezaCardService.countCustomerMezaCardByStatut().subscribe(
      (data) => {
        this.customerMezaCardStatut = data;
      }
    );
    this.reloadTable(AcmConstants.MEZA_STATUS_SENT);
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }
  /**
   * update customer trust or untrust
   * @param status string
   */
  async update(status: string) {
    this.customerMezaCards = [];
    if (this.customerMezaCardTableComponent.getCustomerMezaCardSelected().length > 0) {
      this.customerMezaCardTableComponent.getCustomerMezaCardSelected().forEach(
        (customerMezaCard) => {
          if (status === AcmConstants.MEZA_STATUS_TRUST) {
            customerMezaCard.mezaCardStatus = AcmConstants.MEZA_STATUS_TRUST;
          } else if (status === AcmConstants.MEZA_STATUS_UNTRUST) {
            customerMezaCard.mezaCardStatus = AcmConstants.MEZA_STATUS_UNTRUST;
          }
          this.customerMezaCards.push(customerMezaCard);
        }
      );
      await this.customerMezaCardService.updateAllCustomerMezaCard(this.customerMezaCards).toPromise().then(
        (data) => {
          this.devToolsServices.openToast(0, 'alert.success');
          this.customerMezaCardTableComponent.getCustomerMezaCardSelected().length = 0;
          this.ngOnInit();
        });
    } else {
      this.devToolsServices.openToast(3, 'alert.select_one_customer');
    }

  }
  /**
   * Change tab
   */
  async changeTabs(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:
        this.statusSent = true;
        await  this.reloadTable(AcmConstants.MEZA_STATUS_SENT);
        this.customerMezaCardTableComponent.getCustomerMezaCardSelected().length = 0;
        break;
      case 1:
        await  this.reloadTable(AcmConstants.MEZA_STATUS_TRUST);
        this.customerMezaCardTableComponent.getCustomerMezaCardSelected().length = 0;
        this.statusSent = false;
        break;
      case 2:
        await this.reloadTable(AcmConstants.MEZA_STATUS_UNTRUST);
        this.customerMezaCardTableComponent.getCustomerMezaCardSelected().length = 0;
        this.statusSent = false;
        break;
    }
  }

  /**
   * load list of customer meza card by paginations
   * @param searchCustomerMezaCard searchLoan
   * @param page page
   * @param pageSize pageSize
   */
   async loadCustomerMezaCardByPaginations(searchCustomerMezaCard: CustomerEntity, page: number, pageSize: number, mode: string) {
    const customerPaginationEntityParms: CustomerPaginationEntity = new CustomerPaginationEntity();
    customerPaginationEntityParms.params = searchCustomerMezaCard;
    customerPaginationEntityParms.pageSize = pageSize;
    customerPaginationEntityParms.pageNumber = page;
    customerPaginationEntityParms.params.mezaCardStatus = mode;
    await this.cutomerMezaCardService.getCustomerForMezaCardPagination(customerPaginationEntityParms).subscribe(
      (data) => {
        this.customerPaginationEntity = data;
        this.customerPaginationEntity.resultsCustomers.forEach((element) => {
          element.customerNameNoPipe = this.sharedService.getCustomerName(element);
        });
      }
    );
  }

/**
 * Methode to reloadTable
 */
reloadTable(mode: string) {
  const searchCustomerMezaCard = new CustomerEntity();
  this.loadCustomerMezaCardByPaginations(searchCustomerMezaCard, 0, 10, mode);
  }
}
