import { Component, OnInit } from '@angular/core';
import { CreditLinePaginationEntity } from 'src/app/shared/Entities/CreditLinePagination.entity';
import { creditLineEntity } from 'src/app/shared/Entities/AcmCreditLine.entity';
import { CreditLineService } from '../credit-line.service';
import { LazyLoadEvent } from 'primeng/api';
import { SettingThirdPartyEntity } from 'src/app/shared/Entities/settingThirdParty.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

@Component({
  selector: 'app-credit-line-list',
  templateUrl: './credit-line-list.component.html',
  styleUrls: ['./credit-line-list.component.sass']
})
export class CreditLineListComponent implements OnInit {

  public cols: any[];
  public selectedColumns: any[];
  public pageSize: number;
  public page: number;
  public creditLinePaginationEntity: CreditLinePaginationEntity =
    new CreditLinePaginationEntity();
  public creditLineEntity: creditLineEntity;

  public currentPath = 'list-credit-line';

  constructor(public creditLineService: CreditLineService, public sharedService: SharedService,
    public router: Router,public devToolsServices: AcmDevToolsServices) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'thirdParty', header: 'credit-line.party' },
      { field: 'fundName', header: 'credit-line.fund-name' },
      { field: 'description', header: 'credit-line.description' },
      { field: 'balance', header: 'credit-line.balance' },
      { field: 'fundPriority', header: 'credit-line.priority-of-funds' },
      { field: 'issueDate', header: 'credit-line.issue-date' },
      { field: 'expiryDate', header: 'credit-line.expiry-date' },
      { field: 'controlBalance', header: 'credit-line.control-balance' },
    ]

    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 0;

    this.creditLinePaginationEntity.params = new creditLineEntity();
    this.creditLinePaginationEntity.pageNumber = this.page;
    this.creditLinePaginationEntity.pageSize = this.pageSize;

    this.creditLineService.findCreditLinePagination(this.creditLinePaginationEntity)
      .subscribe((res) => {
        this.creditLinePaginationEntity = res;
      })

  }

  async reloadCreditLineList(event: LazyLoadEvent) {
    const creditLinePaginationEntity: CreditLinePaginationEntity =
      new CreditLinePaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    creditLinePaginationEntity.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      creditLinePaginationEntity.pageNumber = event.first;
    } else {
      creditLinePaginationEntity.pageNumber = event.first / event.rows;
    }

    const creditLineParams: creditLineEntity =
      new creditLineEntity();

    if (event.filters !== undefined) {
      let settingThirdPartyEntity = new SettingThirdPartyEntity();

      settingThirdPartyEntity.firstName = event.filters.thirdParty !== undefined
          ?  event.filters.thirdParty.value
          : null;
      creditLineParams.thirdParty = settingThirdPartyEntity;
      creditLineParams.fundName =
        event.filters.fundName !== undefined
          ? event.filters.fundName.value
          : null;
      creditLineParams.description =
        event.filters.description !== undefined
          ? event.filters.description.value
          : null;
      creditLineParams.balance =
        event.filters.balance !== undefined
          ? event.filters.balance.value
          : null;
      creditLineParams.fundPriority =
        event.filters.fundPriority !== undefined
          ? event.filters.fundPriority.value
          : null;
      creditLineParams.issueDate =
        event.filters.issueDate !== undefined
          ? event.filters.issueDate.value
          : null;
      creditLineParams.expiryDate =
        event.filters.expiryDate !== undefined
          ? event.filters.expiryDate.value
          : null;
      creditLineParams.controlBalance =
        event.filters.controlBalance !== undefined
          ? event.filters.controlBalance.value
          : null;
    }
    creditLinePaginationEntity.params = creditLineParams;

    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      creditLinePaginationEntity.sortField =
        event.multiSortMeta[0].field;
      creditLinePaginationEntity.sortDirection =
        event.multiSortMeta[0].order;
    }

    this.creditLineService.findCreditLinePagination(creditLinePaginationEntity)
      .subscribe((res) => {
        this.creditLinePaginationEntity = res;
      })

  }

  creditLineUpdate(rowData) {
    this.sharedService.setCreditLine(rowData);
    this.router.navigate([AcmConstants.EDIT_CREDIT_LINE],  { queryParams: { source: 'EDIT' } });
  }




}
