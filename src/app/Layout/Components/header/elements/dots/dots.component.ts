import { Component, OnInit } from '@angular/core';
import { NotificationsServices } from '../../../../../shared/components/notifications/notifications.services';
import { NotificationsEntity } from '../../../../../shared/Entities/notifications.entity';
import { SharedService } from '../../../../../shared/shared.service';
import { AcmDevToolsServices } from '../../../../../shared/acm-dev-tools.services';
import { CustomerServices } from '../../../../../AcmPages/Loan-Application/customer/customer.services';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/shared/websocket.service';
import { Subject, Subscription } from 'rxjs';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { LoanManagementService } from 'src/app/AcmPages/Loan-Application/loan-management/loan-management.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { ConfigActions } from 'src/app/ThemeOptions/store/config.actions';
import { CustomerManagementService } from 'src/app/AcmPages/Customer/customer-management/customer-management.service';
import { OfflineService } from 'src/app/shared/offline.service';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionServices } from 'src/app/AcmPages/Collection/collection.services';
import { ExpensesListService } from 'src/app/AcmPages/Expenses/expenses-list/expenses-list.service';
import { GedServiceService } from 'src/app/AcmPages/GED/ged-service.service';
import { ExpensesEntity } from 'src/app/shared/Entities/expenses.entity';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { DashbordServices } from 'src/app/AcmPages/Loan-Application/dashbord/dashbord.services';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-dots',
  templateUrl: './dots.component.html',
})
export class DotsComponent implements OnInit {
  public notifications: NotificationsEntity[] = [];
  public totalElements = 0;
  subscription: Subscription;
  public count = 0;
  public oldCount: any;
  public userConnected: UserEntity;
  public offline = checkOfflineMode();
  public notifChecker: Boolean = false;
  progress: number = 0;
  isLoading: Subject<boolean> = this.loaderService.isLoading;

  /**
   *
   *
   * @param notificationsServices NotificationsServices
   * @param loanSharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   * @param customerServices CustomerServices
   * @param router Router
   * @param loanManagementService LoanManagementService
   * @param webSocketService WebSocketService
   * @param authentificationService AuthentificationService
   */
  constructor(public notificationsServices: NotificationsServices, public loanSharedService: SharedService,public formBuilder: FormBuilder,
    public devToolsServices: AcmDevToolsServices, public settingService: SettingsService,public modalService: NgbModal,
    public customerServices: CustomerServices, public loanManagementService: LoanManagementService,private collectionService: CollectionServices,
    public router: Router, public webSocketService: WebSocketService, public expensesService: ExpensesListService,
    public authentificationService: AuthentificationService, public loaderService: LoaderService,public dashbordService: DashbordServices,
    public collectionServices: CollectionServices, public configActions: ConfigActions,public translate: TranslateService,
    public customerManagementService: CustomerManagementService, public gedService: GedServiceService,private dbService: NgxIndexedDBService,
    private offlineService: OfflineService) {

  }

  ngOnInit() {

    // this.webSocketService._connect();
    // get first 10 new notif

    this.getModuleFromKey() ;
    if (!checkOfflineMode()) {
      this.loadNewNotif();
      this.loadTotalNumber();
    }
    // find total new notif
    // get notification number (WebSocket)
    this.userConnected = this.loanSharedService.getUser();

    this.loanSharedService.actionTriggered$.subscribe(() => {
      this.submit();
    });
  }


  listActivationKey : string[] ;
  module : string  ;
  sizeModule = 0  ;

  async getModuleFromKey() {
    if (this.loanSharedService.getActivationKey()!=undefined){
      this.listActivationKey =  this.loanSharedService.getActivationKey().filter(item=>item.includes("OFFLINE")) ;
      this.sizeModule = this.listActivationKey.length ;
    }else{
      if(checkOfflineMode()){
       const environments = await this.dbService.getByKey('data', 'envirement-values-by-keys').toPromise() as any;
       if(environments !== undefined){
        const env = environments.data.filter(item => item.key === AcmConstants.KEY_LICENCE);
        if(env.length > 0){
          this.listActivationKey = env[0].value.split(',').filter(item=>item.includes("OFFLINE"));
          this.sizeModule = this.listActivationKey.length ;
        }
       }
      } else {
      const environnements: string[] = [AcmConstants.ASSIGN_CUSTOMER, AcmConstants.INTERNET_BANKING, AcmConstants.MAX_SIZE_FILE_UPLOAD, AcmConstants.KEY_LICENCE];
      this.settingService.getEnvirementValueByKeys(environnements).subscribe((data) => {
        if (data !== null) {
          this.listActivationKey =  data.filter(item => item.key === AcmConstants.KEY_LICENCE)[0].value.split(',').filter(item=>item.includes("OFFLINE")) ;
          this.sizeModule = this.listActivationKey.length ;
          
        }
      });
    }
  }


  }
  /**
   * send request (WebSocket) : get count notification
   */
  send() {
    const username = this.userConnected.login;
    this.webSocketService._send('send', username);
    this.count = this.webSocketService.getCount();
    if (this.totalElements < this.count) {
      // toast
      for (let i = 0; i < (this.count - this.totalElements); i++) {
        this.devToolsServices.openToast(2, 'you have new notification');
      }
      this.totalElements = this.count;
    }
    if (Object.keys(this.loanSharedService.getUser()).length === 0) {
      this.subscription.unsubscribe();
    }
  }
  loadNewNotif() {
    this.notificationsServices.getNewNotification().subscribe(
      (data) => {
        this.loanSharedService.setNotifications(data);
        this.loanSharedService.getNotification().forEach((customer) => {
          if (customer.loanDTO != null) {
            customer.loanDTO.customerNameNoPipe = this.loanSharedService.getCustomerName(customer.loanDTO.customerDTO);
          }
        });
      });
  }

  async loadTotalNumber() {
    await this.notificationsServices.countNotifForUser().subscribe(
      (data) => {
        this.loanSharedService.countNotifications = data;
        if (data > 0)
          this.notifChecker = true;
      });
  }

  async loanDetails(notification: NotificationsEntity, i) {
    if (notification.loanDTO !== null && notification.loanDTO !== undefined) {
      // if loan assigned to group of user
      if (notification.loanDTO.owner === null && notification.loanDTO.ownerName === null &&
        notification.loanDTO.groupOwner !== null && notification.loanDTO.groupOwnerName !== null) {

        await this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.ASSIGN_LOAN)
          .afterClosed().toPromise().then(res => {
            if (res) {
              this.loanManagementService.assignLoan(notification.loanDTO).toPromise().then((data) => {
                this.devToolsServices.openToast(0, 'alert.success');
                notification.statusNotif = AcmConstants.NOTIF_STATUT_READ;
                this.notificationsServices.updateNofification(notification).subscribe(() => {
                  // get first 10 new notif
                  this.loadNewNotif();
                  // find total new notif
                  this.loadTotalNumber();
                  // redirect
                  this.loanSharedService.openLoan(data);
                });
              });
            }
          });
      } else {
        notification.statusNotif = AcmConstants.NOTIF_STATUT_READ;
        this.notificationsServices.updateNofification(notification).subscribe(() => {
          // get first 10 new notif
          this.loadNewNotif();
          // find total new notif
          this.loadTotalNumber();
          this.loanSharedService.openLoan(notification.loanDTO);
        });
      }
    } else {
      // update status notif selected in DB
      notification.statusNotif = AcmConstants.NOTIF_STATUT_READ;
      this.notificationsServices.updateNofification(notification).subscribe(() => {
        // get first 10 new notif
        this.loadNewNotif();
        // find total new notif
        this.loadTotalNumber();
      });

      // routing
      if (notification.category === AcmConstants.NOTIF_CATEGORY_LOAN_IB) {
        this.router.navigate([AcmConstants.LOAN_IB_URL]);
      } else if (notification.category === AcmConstants.NOTIF_CATEGORY_MESSAGE_IB) {
        this.router.navigate([AcmConstants.MESSAGE_URL]);
      } else if (notification.category === AcmConstants.NOTIF_CATEGORY_EXPENSES) {
        let expenses = new ExpensesEntity();
        /** We're setting idExpense in idAcmCollection Field temporary in backEnd before changing the notifiation structure  */
        this.expensesService.getExpensesById(notification.idAcmCollection).subscribe((res) => {
          expenses = res;
          this.loanSharedService.setExpenses(expenses);
          this.router.navigate([AcmConstants.EXPENSES_INFO]);
          if (notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW)
            this.updateStatusNotif(notification);
        })
      } else if (notification.category === AcmConstants.NOTIF_CATEGORY_EXCEPTION_REQUEST) {
        this.router.navigate([AcmConstants.EXCEPTION_REQUESTS_URL]);
      }
      else if (notification.category === AcmConstants.COLLECTION_CATEGORY || notification.category === AcmConstants.REMINDER_COLLECTION_CATEGORY || notification.category === AcmConstants.REMINDER_SUP_COLLECTION_CATEGORY) {
        let collection = new CollectionEntity();
        collection.id = notification.idAcmCollection;
        this.collectionServices.getCollection(collection).subscribe(res => {
          const collections: any[] = res;
          if (res.length == 1) {
            collection = collections[0];
            this.loanSharedService.goToCollection(collection);
          }
          if (notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW)
            this.updateStatusNotif(notification);
        });
      }
      else if (notification.category === AcmConstants.LOAN_CATEGORY) {
        if (notification.loanDTO != null) {
          let loan = new LoanEntity();
          loan = notification.loanDTO;
          this.settingService.findProductById(loan.productId).subscribe((product) => {
            loan.productDTO = product;
            this.loanSharedService.openLoan(loan);
            if (notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW)
              this.updateStatusNotif(notification);
          })
        }
        if (notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW)
          this.updateStatusNotif(notification);
      }
      else if (notification.category === AcmConstants.LOAN_CATEGORY) {
        if (notification.loanDTO != null) {
          let loan = new LoanEntity();
          loan = notification.loanDTO;
          this.loanSharedService.openLoan(loan);
          if (notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW)
            this.updateStatusNotif(notification);
        }
        if (notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW)
          this.updateStatusNotif(notification);
      }
      else if (notification.category === AcmConstants.LOAN_CATEGORY) {
        if (notification.loanDTO != null) {
          let loan = new LoanEntity();
          loan = notification.loanDTO;
          this.loanSharedService.openLoan(loan);
          if (notification.statusNotif === AcmConstants.NOTIF_STATUT_NEW)
            this.updateStatusNotif(notification);
        }
      }
      else if (notification.category === AcmConstants.COLLECTION_CATEGORY) {
        let collection = new CollectionEntity();
        collection.id = notification.idAcmCollection;
        this.collectionServices.getCollection(collection).subscribe(res => {
          const collections: any[] = res;
          if (res.length == 1) {
            collection = collections[0];
            this.loanSharedService.goToCollection(collection);
          }
        });
      }
    }
  }


  async changeStatus() {

    if (!this.offline) {
        this.router.navigate([AcmConstants.SETTING_OFFLINE])

    } else {
      this.authentificationService.logout();
      this.configActions.updateConfig({ headerTheme: 'bg-vicious-stance text-lighter' });
      this.offline = !this.offline;
      sessionStorage.setItem('offline', JSON.stringify(this.offline));
    }
  }


  submit(){

    this.offlineService.goOffline().subscribe(
        () => {
          this.loanSharedService.loadDataOffline = true;
          this.progress += 100 / 49; // Increment the progress by the percentage completed by each subfunction
        },
        (error) => {
          console.error('Error:', error);
        },
        () => {
          // All subfunctions completed
          this.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
        }
      );

      this.configActions.updateConfig({ headerTheme: 'bg-danger text-lighter' });
      this.offline = !this.offline;
      sessionStorage.setItem('offline', JSON.stringify(this.offline));


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

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
  getDirection() {
    return AppComponent.direction;
  }
}
