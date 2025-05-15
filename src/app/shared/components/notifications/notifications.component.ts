import { Component, OnInit } from '@angular/core';
import { NotificationsServices } from './notifications.services';
import { NotificationPaginationEntity } from '../../Entities/notificationPagination.entity';
import { NotificationsEntity } from '../../Entities/notifications.entity';
import { SharedService } from '../../shared.service';
import { AcmConstants } from '../../acm-constants';
import { Router } from '@angular/router';
import { LoanManagementService } from 'src/app/AcmPages/Loan-Application/loan-management/loan-management.service';
import { AcmDevToolsServices } from '../../acm-dev-tools.services';
import { LoanEntity } from '../../Entities/loan.entity';
import { CollectionServices } from 'src/app/AcmPages/Collection/collection.services';
import { CollectionEntity } from '../../Entities/acmCollection.entity';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { ExpensesListService } from 'src/app/AcmPages/Expenses/expenses-list/expenses-list.service';
import { ExpensesEntity } from '../../Entities/expenses.entity';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.sass']
})
export class NotificationsComponent implements OnInit {

  public notifications: NotificationPaginationEntity;
  // Pagination
  public totalElements: number;
  public page: number;
  public pageSize: number;
  public totalPages: number;

  /**
   *
   * @param notificationsServices NotificationsServices
   * @param loanSharedService SharedService
   * @param router Router
   * @param devToolsServices AcmDevToolsServices
   * @param loanManagementService LoanManagementService
   */
  constructor(public notificationsServices: NotificationsServices, public loanSharedService: SharedService,
              public router: Router, public devToolsServices: AcmDevToolsServices,public collectionServices : CollectionServices,public settingService : SettingsService,
              public expensesService : ExpensesListService,
              public loanManagementService: LoanManagementService) {
  }

  ngOnInit() {
    const notificationPaginationEntity = new NotificationPaginationEntity();
    this.notificationsServices.getNotification(notificationPaginationEntity).subscribe(
      (data) => {
        this.notifications = data;
        this.notifications.resultsNotifications.forEach((notif) => {
          if (notif.loanDTO != null) {
            notif.loanDTO.customerNameNoPipe = this.loanSharedService.getCustomerName(notif.loanDTO.customerDTO);
          }
        });
        this.totalElements = data.totalElements;
        this.page = 1;
        this.pageSize = 10;
      }
    );
  }

  /**
   * Get Notifications by paginations
   *
   * @param event event
   */
  changePagination(event) {
    const notificationPaginationEntity = new NotificationPaginationEntity();
    notificationPaginationEntity.pageNumber = event - 1;
    notificationPaginationEntity.pageSize = this.pageSize;
    this.notificationsServices.getNotification(notificationPaginationEntity).subscribe(
      (data) => {
        this.notifications = data;
        this.notifications.resultsNotifications.forEach((notif) => {
          if (notif.loanDTO != null) {
            notif.loanDTO.customerNameNoPipe = this.loanSharedService.getCustomerName(notif.loanDTO.customerDTO);
          }
        });
      }
    );
  }

  /**
   * load loan information with shared
   *
   * @param notification NotificationsEntity
   */
  async loanDetails(notification: NotificationsEntity) {
    /** REQUEST_EXCEPTION Category */
    if (notification.category === AcmConstants.NOTIF_CATEGORY_EXCEPTION_REQUEST) {
        this.router.navigate([AcmConstants.EXCEPTION_REQUESTS_URL]);
    }
    /** MESSAGE_IB Category */
    else if (notification.category === AcmConstants.NOTIF_CATEGORY_MESSAGE_IB) {
        this.router.navigate([AcmConstants.MESSAGE_URL]);
    }
    /** EXPENSES Category */
    else if (notification.category === AcmConstants.NOTIF_CATEGORY_EXPENSES) {
        /** We're setting idExpense in idAcmCollection Field temporary in backEnd before changing the notifiation structure  */
        let expenses = new ExpensesEntity();
        this.expensesService.getExpensesById(notification.idAcmCollection).subscribe((res)=> {
          expenses = res ;
          this.loanSharedService.setExpenses(expenses);
          this.router.navigate([AcmConstants.EXPENSES_INFO]);
          if(notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW)
            this.updateStatusNotif(notification);
        })
    }
    /** LOAN_IB Category */
    else if (notification.category === AcmConstants.NOTIF_CATEGORY_LOAN_IB) {
        this.router.navigate([AcmConstants.LOAN_IB_URL]);
    }
    /** Collection Category REMINDER_COLLECTION or REMINDER_SUP_COLLECTION Category */
    else if (notification.category === AcmConstants.COLLECTION_CATEGORY || notification.category === AcmConstants.REMINDER_COLLECTION_CATEGORY || notification.category === AcmConstants.REMINDER_SUP_COLLECTION_CATEGORY){
      let collection = new CollectionEntity();
      collection.id = notification.idAcmCollection;
      this.collectionServices.getCollection(collection).subscribe(res => {
        const collections : any[] = res;
        if (res.length == 1){
          collection = collections[0];
          this.loanSharedService.goToCollection(collection);
        }
        if(notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW)
        this.updateStatusNotif(notification);
      });
    }
    /** Loan Category */
    else if (notification.category === AcmConstants.LOAN_CATEGORY){
    if(notification.loanDTO != null){
      let loan = new LoanEntity();
      loan = notification.loanDTO;
      this.settingService.findProductById(loan.productId).subscribe((product)=> {
        loan.productDTO = product;
        this.loanSharedService.openLoan(loan);
        if(notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW)
          this.updateStatusNotif(notification);
      })
    }
    }
    /** Other Category */
    else {
    // console.log('Notif in case Rest Category')
    if (notification.loanDTO !== null && notification.loanDTO !== undefined) {
      if (notification.loanDTO.owner === null && notification.loanDTO.ownerName === null &&
        notification.loanDTO.groupOwner !== null && notification.loanDTO.groupOwnerName !== null) {
        await this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.ASSIGN_LOAN)
          .afterClosed().toPromise().then(res => {
            if (res) {
              this.loanManagementService.assignLoan(notification.loanDTO).toPromise().then((data) => {
                this.devToolsServices.openToast(0, 'alert.success');
                this.notificationsServices.updateNofification(notification).subscribe();
                this.loanSharedService.openLoan(data);
              });
            }
          });
      } else {
        this.notificationsServices.updateNofification(notification).subscribe();
        this.loanSharedService.openLoan(notification.loanDTO);
      }
    }
    }
  }

  /**
   * change status notification READ/NEW
   *
   * @param notification NotificationsEntity
   */
  updateStatusNotif(notification: NotificationsEntity) {
    if (notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW) {
      notification.statusNotif = AcmConstants.NOTIF_STATUT_READ;
    } else {
      notification.statusNotif = AcmConstants.NOTIF_STATUT_NEW;
    }
    notification.actionStatueNotif = true;
    this.notificationsServices.updateNofification(notification).subscribe();
  }
}
