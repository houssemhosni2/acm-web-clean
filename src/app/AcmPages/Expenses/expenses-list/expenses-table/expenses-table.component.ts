import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmExpensesTypeEntity } from 'src/app/shared/Entities/acmExpensesType.entity';
import { BrancheEntity } from 'src/app/shared/Entities/branche.entity';
import { ExpensesEntity } from 'src/app/shared/Entities/expenses.entity';
import { ExpensesPaginationEntity } from 'src/app/shared/Entities/expensesPaginationEntity.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ExpensesSettingsService } from '../../expenses-settings/expenses-settings.service';
import { ExpensesListService } from '../expenses-list.service';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';

@Component({
  selector: 'app-expenses-table',
  templateUrl: './expenses-table.component.html',
  styleUrls: ['./expenses-table.component.sass']
})
export class ExpensesTableComponent implements OnInit {
  public cols: any[];
  public selectedColumns: any[];
  public expensesPaginationEntity: ExpensesPaginationEntity = new ExpensesPaginationEntity();
  public expensesTypes: AcmExpensesTypeEntity[] = [];
  public branchEntitys: AcmBranches[] = [];
  public userConnected: UserEntity = new UserEntity();
  @Input() public statusTab;
  public decimalPlaces: string;

  /**
   *
   * @param router Router
   * @param expensesListServices ExpensesListService
   */
  constructor(public router: Router, public expensesListServices: ExpensesListService,
              public sharedService: SharedService, public expensesSettingsService: ExpensesSettingsService,
              public settingsService: SettingsService, public devToolsServices: AcmDevToolsServices) { }

  ngOnInit() {
    this.cols = [
      {field: 'id', header: 'expenses.expenses_code' },
      {field: 'expensesTypeLibelle', header: 'expenses.expenses_type' },
      {field: 'branchDescription', header: 'expenses.expenses_branch'},
      { field: 'expensesAmount', header: 'expenses.expenses_amount' },
      { field: 'ownerName', header: 'expenses.expenses_owner' },
      { field: 'tellerName', header: 'expenses.expenses_teller' },
      { field: 'applyDate', header: 'expenses.expenses_creation_date' },

    ];

    // init pagination params
    this.selectedColumns = this.cols;
    const searchEntity = new ExpensesEntity();
    this.getTypeExpenses();
    this.settingsService.findBranches(new AcmBranches()).subscribe(
      (data) => {
        this.branchEntitys = data;
      });

    this.loadExpensesByPaginations(searchEntity, 0, 10);
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(3);
  }
  /**
   * reload table
   */
  reloadTable() {
    const searchExpenses = new ExpensesEntity();
    searchExpenses.statut = 0;
    this.loadExpensesByPaginations(searchExpenses, 0, 10);
  }
  /**
   * load list of expenses by paginations
   * @param searchExpenses ExpensesEntity
   * @param page number
   * @param pageSize number
   */
  async loadExpensesByPaginations(searchExpenses: ExpensesEntity, page: number, pageSize: number) {
    const expensesPaginationEntityParms: ExpensesPaginationEntity = new ExpensesPaginationEntity();
    expensesPaginationEntityParms.params = searchExpenses;
    expensesPaginationEntityParms.pageSize = pageSize;
    expensesPaginationEntityParms.pageNumber = page;
    expensesPaginationEntityParms.params.statut = this.statusTab;
    await this.expensesListServices.loadExpensesyStatusPagination(expensesPaginationEntityParms).subscribe(
      (data) => {
        this.expensesPaginationEntity = data;
      }
    );
  }

  /**
   * reload list of expenses
   * @param event LazyLoadEvent
   */
  async reloadExpensesList(event: LazyLoadEvent) {

    const expensesPaginationEntityParms: ExpensesPaginationEntity = new ExpensesPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    expensesPaginationEntityParms.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      expensesPaginationEntityParms.pageNumber = event.first;
    } else {
      expensesPaginationEntityParms.pageNumber = event.first / event.rows;
    }

    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const expensesParams: ExpensesEntity = new ExpensesEntity();
    expensesParams.statut = this.statusTab;

    if (event.filters !== undefined) {
      expensesParams.idExpensesType = event.filters.expensesTypeLibelle !== undefined ? event.filters.expensesTypeLibelle.value : null;
      expensesParams.idBranch = event.filters.branchDescription !== undefined ? event.filters.branchDescription.value : null;
      expensesParams.expensesAmount = event.filters.expensesAmount !== undefined ? event.filters.expensesAmount.value : null;
      expensesParams.tellerName = event.filters.tellerName !== undefined ? event.filters.tellerName.value : null;
      expensesParams.ownerName = event.filters.ownerName !== undefined ? event.filters.ownerName.value : null;
      expensesParams.applyDate = event.filters.applyDate !== undefined ? event.filters.applyDate.value : null;
      expensesParams.id = event.filters.id !== undefined ? event.filters.id.value : null;
    }
    expensesPaginationEntityParms.params = expensesParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      expensesPaginationEntityParms.sortField = event.multiSortMeta[0].field;
      expensesPaginationEntityParms.sortDirection = event.multiSortMeta[0].order;
    }
    await this.expensesListServices.loadExpensesyStatusPagination(expensesPaginationEntityParms).subscribe(
      (data) => {
        this.expensesPaginationEntity = data;
      }
    );
  }
  /**
   * open expenses details
   * @param expenses ExpensesEntity
   */
  async expensesDetails(expenses: ExpensesEntity) {
    const userGroupFinancial = this.sharedService.getUser().groupes.find(user =>
       user.code === AcmConstants.USER_GROUP_FINANCE_EXPENSES) !== undefined;
    if (userGroupFinancial && (expenses.owner === '' || expenses.owner === null || expenses.owner === undefined) ) {
      await this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.ASSIGN_EXPENSES)
        .afterClosed().subscribe(res => {
          if (res) {
            this.userConnected = this.sharedService.getUser();
            expenses.owner = this.userConnected.login;
            expenses.ownerName = this.userConnected.fullName;
            this.expensesListServices.updateExpenses(expenses).subscribe((data) => {
              this.sharedService.setExpenses(expenses);
              this.router.navigate([AcmConstants.EXPENSES_INFO]);
            });
          }
        });
    } else {
      this.sharedService.setExpenses(expenses);
      this.router.navigate([AcmConstants.EXPENSES_INFO]);
    }

  }
  /**
   * getTypeExpenses
   */
  async getTypeExpenses() {
    await this.expensesSettingsService.getAllExpensesTypes().subscribe(
      (data) => {
        this.expensesTypes = data;
      });
  }
}
