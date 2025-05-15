import { Component, Input, OnInit } from '@angular/core';
import { CustomerContactEntity } from '../../../shared/Entities/CustomerContactEntity';
import { CustomerMessageService } from './customer-message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../../app.component';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { PageTitleService } from 'src/app/Layout/Components/page-title/page-title.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { SettingsService } from '../../Settings/settings.service';
import { checkOfflineMode } from 'src/app/shared/utils';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-customer-message',
  templateUrl: './customer-message.component.html',
  styleUrls: ['./customer-message.component.sass']
})
export class CustomerMessageComponent implements OnInit {
  public expanded = true;

  public messageForm: FormGroup;
  public page: number;
  public pageSize: number;
  public contacts: CustomerContactEntity[] = [];
  public contact: CustomerContactEntity;
  public contactCustomerForm: FormGroup;
  public customer: CustomerEntity = new CustomerEntity();
  public linkReply: number = null;
  public listRepyLinkList: CustomerContactEntity[] = [];
  public customerContactReply = new CustomerContactEntity();
  @Input() Type: string
  /**
   *
   * @param customerMessageService customerMessageService
   * @param modalService modalService
   * @param translate translate
   * @param formBuilder formBuilder
   * @param sharedService sharedService
   */
  constructor(public customerMessageService: CustomerMessageService,
              public modalService: NgbModal,
              public settingService: SettingsService,
              public pageTitleService: PageTitleService,
              public translate: TranslateService,
              public formBuilder: FormBuilder,
              public sharedService: SharedService,public devToolsServices: AcmDevToolsServices,private dbService: NgxIndexedDBService ) { }

 async ngOnInit() {
    this.pageSize = 5;
    this.page = 1;
    this.customer = this.sharedService.getCustomer();
    if(checkOfflineMode()){
      const contacts = await this.dbService.getByKey('data','getCustomerContacts_' + this.customer.id).toPromise() as any;
      if (contacts === undefined) {
        this.devToolsServices.openToast(3, 'No contacts saved for offline use');
      } else {
        this.contacts = contacts.data;
      }
    } else {
    const contact = new CustomerContactEntity();
    contact.customerId = this.customer.id;
    contact.linkReplay = 0;
    this.customerMessageService.findCustomerContactList(contact).subscribe(
      (data) => {
        this.contacts = data;
      }
    );
  }
  }

  /**
   * methode to open the popup message
   * param content
   */
  openLarge(content, contact: CustomerContactEntity) {
    this.modalService.open(content, {
      size: 'xl'
    });
    this.contact = contact;
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * toggleCollapse
   */
  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  createFormContact() {
    this.contactCustomerForm = this.formBuilder.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  answer(content) {
    this.createFormContact();
    this.linkReply = 0;
    this.modalService.open(content, {
      size: 'ml'
    });
  }

  /**
   *
   */
  send() {
    this.customer = this.sharedService.getCustomer();
    const customerContactEntity: CustomerContactEntity = new CustomerContactEntity();
    customerContactEntity.email = this.customer.email;
    customerContactEntity.to = this.customer.email;
    customerContactEntity.subject = this.contactCustomerForm.controls.subject.value;
    customerContactEntity.content = this.contactCustomerForm.controls.message.value;
    customerContactEntity.customerId = this.customer.id;
    customerContactEntity.sentCustomer = false;
    if (this.linkReply !== null) {
      customerContactEntity.linkReplay = this.linkReply;
    }
    this.pageTitleService.sendMail(customerContactEntity).toPromise().then(
      () => this.ngOnInit()
    );
  }

  updateStatusMsg(contact: CustomerContactEntity) {
    if (contact.statut === AcmConstants.NOTIF_STATUT_NEW) {
      contact.statut = AcmConstants.NOTIF_STATUT_READ;
      contact.read = true;
    } else {
      contact.statut = AcmConstants.NOTIF_STATUT_NEW;
      contact.read = true;
    }
    this.customerMessageService.updateCustomerContact(contact).subscribe();
  }

  reply(content8, contact1: CustomerContactEntity) {
    this.createFormContact();
    this.modalService.open(content8, {
      size: 'ml'
    });
    this.linkReply = contact1.id;
  }
  chargerReponses(content, contact1: CustomerContactEntity) {
    this.customerContactReply.linkReplay = contact1.id;
    this.customerMessageService.findCustomerContactList(this.customerContactReply).subscribe(
      (data) => {
        this.listRepyLinkList = data;
      });
    this.linkReply = contact1.id;
    this.modalService.open(content, {
      size: 'xl'
    });
  }
  replyandClose(content8, contentReply) {
    this.modalService.dismissAll(contentReply);
    this.createFormContact();
    this.modalService.open(content8, {
      size: 'ml'
    });
  }
}
