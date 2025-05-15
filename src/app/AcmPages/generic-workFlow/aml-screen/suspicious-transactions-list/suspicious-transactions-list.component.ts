import { Component, Input, OnInit } from '@angular/core';
import { AcmDoubtfulTransactionEntity } from 'src/app/shared/Entities/AcmDoubtfulTransaction.entity';

@Component({
  selector: 'app-suspicious-transactions-list',
  templateUrl: './suspicious-transactions-list.component.html',
  styleUrls: ['./suspicious-transactions-list.component.sass']
})
export class SuspiciousTransactionsListComponent implements OnInit {
  @Input() expanded;
  @Input() acmDoubtfulLoanAnalyticsEntity;
  public acmDoubtfulTransactions : AcmDoubtfulTransactionEntity[];
  constructor() { }

  ngOnInit(): void {
    this.acmDoubtfulTransactions = this.acmDoubtfulLoanAnalyticsEntity?.acmDoubtfulTransactionDTOs;
  }
  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }
}
