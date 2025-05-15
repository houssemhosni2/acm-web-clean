import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { BlacklistItem } from 'src/app/shared/Entities/blacklistItem.entity';
import { BlacklistItemPagination } from 'src/app/shared/Entities/blacklistItemPagination.entity';
import { SettingBalcklistPartyType } from 'src/app/shared/Entities/settingBlacklistPartyType.entity';
import { customRequiredValidator } from 'src/app/shared/utils';
import { SettingsService } from '../../Settings/settings.service';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { LoanDetailsServices } from '../../Loan-Application/loan-details/loan-details.services';
import { BlacklistService } from '../blacklist.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SettingDocumentTypeEntity } from 'src/app/shared/Entities/settingDocumentType.entity';
import { LoanDocumentEntity } from 'src/app/shared/Entities/loanDocument.entity';
import { GedServiceService } from '../../GED/ged-service.service';
import { FileUpload } from 'primeng/fileupload';
import { UserEntity } from 'src/app/shared/Entities/user.entity';

@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.sass']
})
export class BlacklistComponent implements OnInit {

  @ViewChild('uploadFile') uploadFile: FileUpload;

  public pageSize: number;
  public page: number;
  public cols: any[];

  public blacklistItemPagination: BlacklistItemPagination = new BlacklistItemPagination();

  public blacklistItemForm: FormGroup;

  public blacklistItem: BlacklistItem = new BlacklistItem();

  public partyTypeList: SettingBalcklistPartyType[];
  public upgradeReasonList: SettingMotifRejetsEntity[] = [];
  public downgradeReasonList: SettingMotifRejetsEntity[] = [];
  public reasonList: SettingMotifRejetsEntity[];

  public processMode: string;
  public isUpgradeProcess: string = AcmConstants.BLACKLIST_UPGRADE_PROCESS;
  public isDowngradeProcess: string = AcmConstants.BLACKLIST_DOWNGRADE_PROCESS;

  public addManually: boolean = false;
  public bulkAdd: boolean = false;

  public settingDocumentEntity: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();

  public selectedBlacklistItems: BlacklistItem[] = [];
  selectAll: boolean = false;

  public loader = false;
  
  public currentUser: UserEntity = new UserEntity();
  public connectedUserGroups : string = "";

  constructor(private fb: FormBuilder, public modal: NgbModal, public translate: TranslateService,
    public devToolsServices: AcmDevToolsServices, public settingsService: SettingsService,
    public loanDetailsServices: LoanDetailsServices, public blacklistService: BlacklistService,
    public sharedService: SharedService, public gedService: GedServiceService
  ) { }

  ngOnInit(): void {
    this.connectedUserGroups = "";
    this.currentUser = this.sharedService.getUser();
    this.currentUser.groupes.map((item) => this.connectedUserGroups = this.connectedUserGroups+item.code+";")

    this.cols = [
      { field: 'nationalId', header: 'blacklist.nationalId' },
      { field: 'name', header: 'blacklist.name' },
      { field: 'partyType', header: 'blacklist.partyType' },
      { field: 'reasonCode', header: 'blacklist.reasonCode' },
      { field: 'dateInsertion', header: 'blacklist.dateInsertion' },
      { field: 'insertBy', header: 'blacklist.insertBy' },
      { field: 'status', header: 'blacklist.status' },
      { field: 'document', header: 'blacklist.document' },
      { field: 'note', header: 'blacklist.notes' },
    ]

    let settingBalcklistPartyType = new SettingBalcklistPartyType();
    settingBalcklistPartyType.enabled = true;
    settingBalcklistPartyType.modificationGroup = this.connectedUserGroups;
    this.settingsService.findSettingBlacklistPartyType(settingBalcklistPartyType).toPromise().then((res) => {
      this.partyTypeList = res;
    });

    let settingMotifRejetsEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
    settingMotifRejetsEntity.categorie = AcmConstants.BLACKLIST_UPGRADE_REASON_CATEGORY;
    this.loanDetailsServices.getReason(settingMotifRejetsEntity).toPromise().then(
      (data) => {
        this.upgradeReasonList = data;
      }
    );

    settingMotifRejetsEntity.categorie = AcmConstants.BLACKLIST_DOWNGRADE_REASON_CATEGORY;
    this.loanDetailsServices.getReason(settingMotifRejetsEntity).toPromise().then(
      (data) => {
        this.downgradeReasonList = data;
      }
    );

    let settingDocumentEntity: SettingDocumentTypeEntity = new SettingDocumentTypeEntity();
    settingDocumentEntity.code = AcmConstants.BLACKLIST_SETTING_DOC_TYPE_CODE;
    this.gedService.getAllDocumentTypes(settingDocumentEntity).toPromise().then((res) => {
      if (res[0]) {
        this.settingDocumentEntity = res[0]
      }
    });

    this.getBlacklistItems();

    this.loader = true;

  }

  getBlacklistItems() {
    // init pagination params
    this.pageSize = 10;
    this.page = 0;

    this.blacklistItemPagination.params = new BlacklistItem();
    let settingBalcklistPartyType: SettingBalcklistPartyType = new SettingBalcklistPartyType();
    settingBalcklistPartyType.modificationGroup = this.connectedUserGroups;
    this.blacklistItemPagination.params.partyType = settingBalcklistPartyType;

    this.blacklistItemPagination.pageNumber = this.page;
    this.blacklistItemPagination.pageSize = this.pageSize;

    this.blacklistService.findBlacklistItems(this.blacklistItemPagination).toPromise().then((res) => {
      this.blacklistItemPagination = res;
      this.blacklistItemPagination.resultsBlacklistItems.map((item) => {
        if (item.status === this.isUpgradeProcess) {
          item.reasonCode = this.upgradeReasonList?.filter((item1) => item1.code === item.reasonCode)[0]?.libelle;
        }
        if (item.status === this.isDowngradeProcess) {
          item.reasonCode = this.downgradeReasonList?.filter((item1) => item1.code === item.reasonCode)[0]?.libelle;
        }
      })
    });


  }

  async reloadBlacklistItems(event: LazyLoadEvent) {
    this.reasonList = [...this.upgradeReasonList, ...this.downgradeReasonList];

    const blacklistItemPagination: BlacklistItemPagination =
      new BlacklistItemPagination();
    // setting pageSize : event.rows = Number of rows per page
    blacklistItemPagination.pageSize = event.rows;

    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      blacklistItemPagination.pageNumber = event.first;
    } else {
      blacklistItemPagination.pageNumber = event.first / event.rows;
    }

    const blacklistItemParams: BlacklistItem =
      new BlacklistItem();

    if (event.filters !== undefined) {
      let settingBalcklistPartyType: SettingBalcklistPartyType = new SettingBalcklistPartyType();
      settingBalcklistPartyType.code = event.filters.partyType !== undefined
        ? this.partyTypeList.filter((item) => item.label === event.filters.partyType.value)[0]?.code
        : null;

      blacklistItemParams.partyType = settingBalcklistPartyType;

      blacklistItemParams.nationalId =
        event.filters.nationalId !== undefined
          ? event.filters.nationalId.value
          : null;

      blacklistItemParams.name =
        event.filters.name !== undefined
          ? event.filters.name.value
          : null;

      blacklistItemParams.reasonCode =
        event.filters.reasonCode !== undefined
          ? this.reasonList.filter((item) => item.libelle === event.filters.reasonCode.value)[0]?.code
          : null;

      blacklistItemParams.dateInsertion =
        event.filters.dateInsertion !== undefined
          ? event.filters.dateInsertion.value
          : null;
      blacklistItemParams.insertBy =
        event.filters.insertBy !== undefined
          ? event.filters.insertBy.value
          : null;

      blacklistItemParams.status =
        event.filters.status !== undefined
          ? event.filters.status.value
          : null;

      blacklistItemParams.note =
        event.filters.note !== undefined
          ? event.filters.note.value
          : null;

    }

    blacklistItemPagination.params = blacklistItemParams;

    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      blacklistItemPagination.sortField =
        event.multiSortMeta[0].field;
      blacklistItemPagination.sortDirection =
        event.multiSortMeta[0].order;
    }

    this.blacklistService.findBlacklistItems(blacklistItemPagination)
      .subscribe((res) => {
        this.blacklistItemPagination = res;
      })
  }

  closeModal() {
    this.modal.dismissAll();
    this.processMode = null;
    this.addManually = false;
  }

  getDirection() {
    return AppComponent.direction;
  }

  createForm() {
    this.blacklistItemForm = this.fb.group({
      nationalId: [null, [customRequiredValidator]],
      name: [null, [customRequiredValidator]],
      partyType: [null, [customRequiredValidator]],
      reason: [null, [customRequiredValidator]],
      note: [null, [customRequiredValidator]]
    });
  }

  saveManually() {
    this.devToolsServices.makeFormAsTouched(this.blacklistItemForm);
    if (this.blacklistItemForm.valid && this.settingDocumentEntity.file) {

      this.blacklistItem.nationalId = this.blacklistItemForm.controls.nationalId.value;
      this.blacklistItem.name = this.blacklistItemForm.controls.name.value;
      this.blacklistItem.note = this.blacklistItemForm.controls.note.value;
      this.blacklistItem.partyType = this.blacklistItemForm.controls.partyType.value;
      this.blacklistItem.reasonCode = this.blacklistItemForm.controls.reason.value;
      if (this.processMode === this.isUpgradeProcess) {
        this.blacklistItem.status = this.isUpgradeProcess;
      }
      else if (this.processMode === this.isDowngradeProcess) {
        this.blacklistItem.status = this.isDowngradeProcess;
      }

      this.blacklistService.saveBlacklistItem(this.blacklistItem).subscribe((res) => {
        this.saveDocument(res);
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.settingDocumentEntity = new SettingDocumentTypeEntity();
        this.addManually = false;
        this.ngOnInit();
      })
    }

    if (this.settingDocumentEntity.file === undefined) {
      this.devToolsServices.openToast(1, 'error.required_document');
    }
  }

  upgradeOrDowngradeExistingItem() {
    this.devToolsServices.makeFormAsTouched(this.blacklistItemForm);
    this.blacklistItemForm.controls.nationalId.clearValidators();
    this.blacklistItemForm.controls.nationalId.reset();
    this.blacklistItemForm.controls.name.clearValidators();
    this.blacklistItemForm.controls.name.reset();
    this.blacklistItemForm.controls.partyType.clearValidators();
    this.blacklistItemForm.controls.partyType.reset();
    

    if (this.blacklistItemForm.valid && this.settingDocumentEntity.file) {

      this.selectedBlacklistItems.map((item) => {
        item.reasonCode = this.blacklistItemForm.controls.reason.value;
        item.note = this.blacklistItemForm.controls.note.value;
        if (this.processMode === this.isUpgradeProcess) {
          item.status = this.isUpgradeProcess;
        }
        else if (this.processMode === this.isDowngradeProcess) {
          item.status = this.isDowngradeProcess;
        }
      })

      this.blacklistService.saveBlacklistItems(this.selectedBlacklistItems).subscribe((res) => {
        this.saveDocuments(res.filter((item) => item.enabled === true));
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.settingDocumentEntity = new SettingDocumentTypeEntity();
        this.processMode = null;
        this.ngOnInit();
      });
    }

    if (this.settingDocumentEntity.file === undefined) {
      this.devToolsServices.openToast(1, 'error.required_document');
    }
  }

  saveUploadedItems() {
    this.devToolsServices.makeFormAsTouched(this.blacklistItemForm);
    this.blacklistItemForm.controls.nationalId.clearValidators();
    this.blacklistItemForm.controls.nationalId.reset();
    this.blacklistItemForm.controls.name.clearValidators();
    this.blacklistItemForm.controls.name.reset();

    if (this.blacklistItemForm.valid && this.settingDocumentEntity.file) {
      this.selectedBlacklistItems.map((item) => {
        item.note = this.blacklistItemForm.controls.note.value;
        item.partyType = this.blacklistItemForm.controls.partyType.value;
        item.reasonCode = this.blacklistItemForm.controls.reason.value;
        if (this.processMode === this.isUpgradeProcess) {
          item.status = this.isUpgradeProcess;
        }
        else if (this.processMode === this.isDowngradeProcess) {
          item.status = this.isDowngradeProcess;
        }

      });

      this.blacklistService.saveBlacklistItems(this.selectedBlacklistItems).subscribe(async (res) => {
        await this.saveDocuments(res);
        this.devToolsServices.openToast(0, 'alert.success');
        this.modal.dismissAll();
        this.settingDocumentEntity = new SettingDocumentTypeEntity();
        this.processMode = null;
        this.uploadFile.clear();
        this.bulkAdd = false;
        this.selectedBlacklistItems = [];
        this.ngOnInit();
      });
    }
  }

  submit() {
    if (this.addManually) {
      this.saveManually();
    }
    else if (this.bulkAdd) {
      this.saveUploadedItems();
    }
    else {
      this.upgradeOrDowngradeExistingItem();
    }

  }

  onUpload(event) {
    if (this.sharedService.geTypeMimes().includes(event.target.files[0].type)) {
      if (event.target.files[0].size <= this.sharedService.getMaxSizeFileUpload()) {
        if (event.target.files.length > 0) {
          this.settingDocumentEntity.name = event.target.files[0].name;
          this.settingDocumentEntity.file = event.target.files[0];
          this.settingDocumentEntity.dateDebut = new Date();
        }
      } else {
        this.devToolsServices.openToastForMaxSizeImg(3, 'alert.file_size', this.sharedService.getMaxSizeFileUpload());
      }
    } else {
      this.devToolsServices.openToast(3, 'alert.file_type');
    }
  }

  saveDocument(blacklistItem: BlacklistItem) {
    const arrayFile: any[] = [];
    const documents: any[] = [];

    const document: LoanDocumentEntity = new LoanDocumentEntity();
    if (this.settingDocumentEntity.file && this.settingDocumentEntity.file !== '') {
      document.titre = this.settingDocumentEntity.libelle;
      if (document.description) {
        document.description = this.settingDocumentEntity.description;
      }
      document.auteur = AcmConstants.AUTEUR;
      document.settingDocumentTypeDTO = this.settingDocumentEntity;
      document.name = this.settingDocumentEntity.file.name;
      document.documentSize = this.settingDocumentEntity.file.size;
      document.elementId = blacklistItem.id;
      document.category = AcmConstants.BLACKLIST_DOC_TYPE;
      arrayFile.push(this.settingDocumentEntity.file);
      documents.push(document);
      this.gedService.saveListDocuments(arrayFile, documents).toPromise().then((value1) => {
        value1.forEach((doc) => {
          this.devToolsServices.openToast(0, 'alert.success');
        });
        this.ngOnInit();
      });
    }
  }

  async saveDocuments(blacklistItems: BlacklistItem[]) {

    if (this.settingDocumentEntity.file && this.settingDocumentEntity.file !== '') {
      blacklistItems.forEach(async (element) => {
        const arrayFile: any[] = [];
        const documents: any[] = [];

        let document: LoanDocumentEntity = new LoanDocumentEntity();
        document.titre = this.settingDocumentEntity.libelle;
        if (document.description) {
          document.description = this.settingDocumentEntity.description;
        }
        document.auteur = AcmConstants.AUTEUR;
        document.settingDocumentTypeDTO = this.settingDocumentEntity;
        document.name = this.settingDocumentEntity.file.name;
        document.documentSize = this.settingDocumentEntity.file.size;
        document.elementId = element.id;
        document.category = AcmConstants.BLACKLIST_DOC_TYPE;
        arrayFile.push(this.settingDocumentEntity.file);
        documents.push(document);

        await this.gedService.saveListDocuments(arrayFile, documents).toPromise().then((value1) => {
          value1.forEach((doc) => {
            this.devToolsServices.openToast(0, 'alert.success');
          });
        });
      });

    }
  }


  getDocument(item) {
    this.gedService.findhistoryDocumentByCategoryElement(this.settingDocumentEntity.id, item.id, "BLACKLIST").subscribe((doc) => {
      if (doc[0]) {
        this.view(doc[0]?.idDocumentGED);
      }
      else {
        this.devToolsServices.openToast(3, 'alert.file_not_found');
      }
    })
  }

  view(idDocument) {
    if (idDocument !== '' && idDocument !== undefined) {
      this.gedService.getDocumentType(idDocument).subscribe((value) => {
        const documentType = value.mimeType;
        this.gedService.getDocument(idDocument).subscribe(
          (res: any) => {
            const fileData = [res];
            const blob = new Blob(fileData, { type: documentType });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
          }
        );
      }
      );
    }
  }

  onSelectAllChange() {
    this.selectAll = !this.selectAll;
    if (!this.selectAll) {
      this.selectedBlacklistItems = [];
    }
  }

  upgradeProcess(modalContent) {
    if (this.addManually) {
      this.processMode = this.isUpgradeProcess;
      this.createForm();
      this.modal.open(modalContent);
    }
    else if (!this.addManually && !this.bulkAdd) {
      if (this.selectedBlacklistItems.length > 0) {

        // check if all items have the same action
        let res = this.selectedBlacklistItems.filter((item) => item.status !== AcmConstants.BLACKLIST_DOWNGRADE_PROCESS);
        if (res.length === 0) {
          this.processMode = this.isUpgradeProcess;
          this.createForm();
          this.modal.open(modalContent);
        }
        else {
          this.devToolsServices.openToast(3, 'alert.blacklist_items_not_having_same_action');
        }
      }
      else {
        this.devToolsServices.openToast(3, 'alert.select_blacklist_items');
      }
    }
    else if (!this.addManually && this.bulkAdd) {
      if (this.selectedBlacklistItems.length > 0) {
        this.processMode = this.isUpgradeProcess;
        this.createForm();
        this.modal.open(modalContent);
      }
      else {
        this.devToolsServices.openToast(3, 'alert.select_blacklist_items');
      }
    }
  }

  downgradeProcess(modalContent) {
    if (this.addManually) {
      this.processMode = this.isDowngradeProcess;
      this.createForm();
      this.modal.open(modalContent);
    }
    else if (!this.addManually && !this.bulkAdd) {
      if (this.selectedBlacklistItems.length > 0) {
        // check if all items have the same action
        let res = this.selectedBlacklistItems.filter((item) => item.status !== AcmConstants.BLACKLIST_UPGRADE_PROCESS);
        if (res.length === 0) {
          this.processMode = this.isDowngradeProcess;
          this.createForm();
          this.modal.open(modalContent);
        }
        else {
          this.devToolsServices.openToast(3, 'alert.blacklist_items_not_having_same_action');
        }
      }
      else {
        this.devToolsServices.openToast(3, 'alert.select_blacklist_items');
      }
    }
    else if (!this.addManually && this.bulkAdd) {
      if (this.selectedBlacklistItems.length > 0) {
        this.processMode = this.isDowngradeProcess;
        this.createForm();
        this.modal.open(modalContent);
      }
      else {
        this.devToolsServices.openToast(3, 'alert.select_blacklist_items');
      }
    }
  }

  exportDataFromExcel(event) {
    this.blacklistService.uploadBlacklistItemsFile(event.files[0]).subscribe((res) => {
      if(res){
        this.bulkAdd = true;
        this.blacklistItemPagination.resultsBlacklistItems = res;
      }
    })
  }

  exit() {
    this.bulkAdd = false;
    this.uploadFile.clear();
    this.ngOnInit();
  }

}
