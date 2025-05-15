import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { CustomerPaginationEntity } from 'src/app/shared/Entities/customer.pagination.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerMezaCardService } from '../customer-meza-card.service';

@Component({
  selector: 'app-customer-meza-card-table',
  templateUrl: './customer-meza-card-table.component.html',
  styleUrls: ['./customer-meza-card-table.component.sass']
})
export class CustomerMezaCardTableComponent implements OnInit {
  @Input() public statusTab;
  @Input() public customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();
  public cols: any[];
  public selectedColumns: any[];
  public page: number;
  public pageSize: number;
  public customer: CustomerEntity;
  public selectedCustomerMezaEntitys: CustomerEntity[] = [];
  public check = true;
  public inputs = [];
/**
 * constructor
 *
 * @param cutomerMezaCardService CustomerMezaCardService
 * @param sharedService SharedService
 * @param devToolsServices AcmDevToolsServices
 */
  constructor(public cutomerMezaCardService: CustomerMezaCardService, public sharedService: SharedService,
              public devToolsServices: AcmDevToolsServices) { }

  ngOnInit() {
    this.cols = [
      { field: 'customerNumber', header: 'customer.customer_number' },
      { field: 'customerNameNoPipe', header: 'customer.customer_name' },
      { field: 'branchesName', header: 'customer.branch' },
      { field: 'identity', header: 'customer.customer_identity' },
      { field: 'acmMezaCardDTO', header: 'meza_card.card_number' },
     ];
    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
   }

  /**
   * reloadCustomerList
   * @param $event Event
   */
  async reloadCustomerList(event: LazyLoadEvent) {
    const customerPaginationEntity: CustomerPaginationEntity = new CustomerPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    customerPaginationEntity.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      customerPaginationEntity.pageNumber = event.first;
    } else {
      customerPaginationEntity.pageNumber = event.first / event.rows;
    }
    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const customerParams: CustomerEntity = new CustomerEntity();
    if (event.filters !== undefined) {
      customerParams.customerNumber = event.filters.customerNumber !== undefined ? event.filters.customerNumber.value : null;
      customerParams.customerName = event.filters.customerNameNoPipe !== undefined ? event.filters.customerNameNoPipe.value : null;
      customerParams.identity = event.filters.identity !== undefined ? event.filters.identity.value : null;
      customerParams.branchesName = event.filters.branchesName !== undefined ? event.filters.branchesName.value : null;
      customerParams.acmMezaCardDTO = event.filters.cardNumber !== undefined ? event.filters.acmMezaCardDTO.value.cardNumber : null;
    }
    customerPaginationEntity.params = customerParams;
    customerParams.mezaCardStatus = this.statusTab;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      customerPaginationEntity.sortField = event.multiSortMeta[0].field;
      customerPaginationEntity.sortDirection = event.multiSortMeta[0].order;
    }

    await this.cutomerMezaCardService.getCustomerForMezaCardPagination(customerPaginationEntity).subscribe(
      (data) => {
        this.customerPaginationEntity = data;
        this.customerPaginationEntity.resultsCustomers.forEach((element) => {
          element.customerNameNoPipe = this.sharedService.getCustomerName(element);
        });
      }
    );
  }
  /**
   * Methode onChange
   * @param id id
   * @param Number number
   */
    onChangeCheckBox(id, i, event) {
      if (this.statusTab === AcmConstants.MEZA_STATUS_SENT) {
        if (this.selectedCustomerMezaEntitys.indexOf(id) === -1) {
          this.selectedCustomerMezaEntitys.push(id);

        } else {
          this.selectedCustomerMezaEntitys.splice(this.selectedCustomerMezaEntitys.indexOf(id), 1);
        }
        if (event.target.checked) { this.inputs.push(id); } else { this.inputs = this.arrayRemove(this.inputs, id); }
        if (this.inputs.length === 0) {
          this.check = true;
        } else if (this.inputs.length > 0) {
          this.check = false;
        }
      }
  }

  /**
   * getCustomerMezaCardSelected()
   * @returns selectedCustomerMezaEntitys
   */
  getCustomerMezaCardSelected() {
    return this.selectedCustomerMezaEntitys;
  }
  /**
   *
   * @param array checked element
   * @param value element
   */
   arrayRemove(array, value) {
    return array.filter((element) => {
      return element !== value;
    });
  }

}
