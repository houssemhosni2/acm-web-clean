import {Component, OnInit} from '@angular/core';
import {SettingMezaCardService} from '../setting-meza-card/setting-meza-card.service';
import {AcmMezaCardPaginationEntity} from '../../../shared/Entities/AcmMezaCardPagination.entity';
import {AcmMezaCardEntity} from '../../../shared/Entities/acmMezaCard.entity';
import {AppComponent} from '../../../app.component';
import {TranslateService} from '@ngx-translate/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SettingsService} from '../../Settings/settings.service';
import {BrancheEntity} from '../../../shared/Entities/branche.entity';
import {AcmConstants} from '../../../shared/acm-constants';
import {AcmDevToolsServices} from '../../../shared/acm-dev-tools.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AcmBranches } from 'src/app/shared/Entities/AcmBranches.entity';

@Component({
  selector: 'app-setting-meza-card-activate',
  templateUrl: './setting-meza-card-activate.component.html',
  styleUrls: ['./setting-meza-card-activate.component.sass']
})
export class SettingMezaCardActivateComponent implements OnInit {
  public mezaCards: AcmMezaCardPaginationEntity = new AcmMezaCardPaginationEntity();
  public pageSize = 5;
  public totalElements: number;
  public pageNumber: number;
  public selectCards: AcmMezaCardEntity[];
  public selectCardsIndex: boolean[];
  public allSelection = false;
  public branchEntitys: AcmBranches[];
  public selectedBranch: AcmBranches;
  public mezaFilterForm: FormGroup;
  public searchMezaCard: AcmMezaCardEntity = new AcmMezaCardEntity();

  /**
   * constructor
   * @param settingMezaCardService SettingMezaCardService
   * @param translate TranslateService
   * @param modalService NgbModal
   * @param settingsService SettingsService
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public settingMezaCardService: SettingMezaCardService, public translate: TranslateService,
              public modalService: NgbModal, public settingsService: SettingsService,
              public devToolsServices: AcmDevToolsServices, public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getMezaCardsPaginations();
    // LOAD BRANCH LIST FILTER
    this.settingsService.findBranches(new AcmBranches()).subscribe(
      (data) => {
        this.branchEntitys = data;
      });
    // CREATE FORM FILTER
    this.createFilterForm();
  }
  getMezaCardsPaginations() {
    this.mezaCards.resultsAcmMezaCards = [];
    this.selectCards = [];
    this.selectCardsIndex = [];
    const acmMezaCardPaginationEntity = new AcmMezaCardPaginationEntity();
    acmMezaCardPaginationEntity.pageSize = this.pageSize;
    acmMezaCardPaginationEntity.params = new AcmMezaCardEntity();
    acmMezaCardPaginationEntity.params.listStatus = [];
    acmMezaCardPaginationEntity.params.listStatus.push(AcmConstants.MEZA_CARD_STATUS_UPLOAD);
    acmMezaCardPaginationEntity.params.listStatus.push(AcmConstants.MEZA_CARD_STATUS_SENT);
    this.settingMezaCardService.findPagination(acmMezaCardPaginationEntity).subscribe(
      (data) => {
        this.mezaCards = data;
        this.pageSize = data.pageSize;
        this.totalElements = data.totalElements;
        this.pageNumber = data.pageNumber + 1;
        this.selectCardsIndex = [];
        data.resultsAcmMezaCards.forEach((element) => {
          this.selectCardsIndex.push(false);
        });
      }
    );
  }
  /**
   * form filter
   */
  createFilterForm() {
    this.mezaFilterForm = this.formBuilder.group({
      marchant: [''],
      cardType: [''],
      cardNumber: [''],
      account: [''],
      expiryDate: [''],
      activityDate: [''],
      embossed: [''],
      status: [''],
      branch: [''],
    });
  }
  /**
   * submit for filtring meza cards
   */
  onSubmit() {
    this.searchMezaCard = new AcmMezaCardEntity ();
    if (this.mezaFilterForm.controls.marchant.value) {
      this.searchMezaCard.merchantID = this.mezaFilterForm.controls.marchant.value;
    }
    if (this.mezaFilterForm.controls.cardType.value) {
      this.searchMezaCard.cardType = this.mezaFilterForm.controls.cardType.value;
    }
    if (this.mezaFilterForm.controls.cardNumber.value) {
      this.searchMezaCard.cardNumber = this.mezaFilterForm.controls.cardNumber.value;
    }
    if (this.mezaFilterForm.controls.account.value) {
      this.searchMezaCard.account = this.mezaFilterForm.controls.account.value;
    }
    if (this.mezaFilterForm.controls.expiryDate.value) {
      this.searchMezaCard.expirtyDate = this.mezaFilterForm.controls.expiryDate.value;
    }
    if (this.mezaFilterForm.controls.activityDate.value) {
      this.searchMezaCard.activityDate = this.mezaFilterForm.controls.activityDate.value;
    }
    if (this.mezaFilterForm.controls.embossed.value) {
      this.searchMezaCard.embossedName = this.mezaFilterForm.controls.embossed.value;
    }
    if (this.mezaFilterForm.controls.status.value) {
      this.searchMezaCard.listStatus = [];
      this.searchMezaCard.listStatus.push(this.mezaFilterForm.controls.status.value);
    } else {
      this.searchMezaCard.listStatus = [];
      this.searchMezaCard.listStatus.push(AcmConstants.MEZA_CARD_STATUS_UPLOAD);
      this.searchMezaCard.listStatus.push(AcmConstants.MEZA_CARD_STATUS_SENT);
    }
    if (this.mezaFilterForm.controls.branch.value) {
      // to verify search with branch id or name
      this.searchMezaCard.branchID = this.mezaFilterForm.controls.branch.value.branchID;
    }
    this.reloadFilter(1);
  }
  reset() {
    this.getMezaCardsPaginations();
    this.createFilterForm();
  }
  reloadFilter(event: number) {
    this.mezaCards.resultsAcmMezaCards = [];
    this.selectCards = [];
    this.selectCardsIndex = [];
    const acmMezaCardPaginationEntity = new AcmMezaCardPaginationEntity();
    acmMezaCardPaginationEntity.pageNumber = event - 1;
    acmMezaCardPaginationEntity.pageSize = this.pageSize;
    acmMezaCardPaginationEntity.params = this.searchMezaCard;
    if (Object.keys(this.searchMezaCard).length === 0) {
      acmMezaCardPaginationEntity.params.listStatus = [];
      acmMezaCardPaginationEntity.params.listStatus.push(AcmConstants.MEZA_CARD_STATUS_UPLOAD);
      acmMezaCardPaginationEntity.params.listStatus.push(AcmConstants.MEZA_CARD_STATUS_SENT);
    }
    this.settingMezaCardService.findPagination(acmMezaCardPaginationEntity).subscribe(
      (data) => {
        this.mezaCards = data;
        this.pageSize = data.pageSize;
        this.totalElements = data.totalElements;
        this.pageNumber = data.pageNumber + 1;
        this.selectCardsIndex = [];
        data.resultsAcmMezaCards.forEach((element) => {
          this.selectCardsIndex.push(false);
        });
        this.selectCards = [];
      }
    );
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  selectAll() {
    if (this.allSelection) {
      for (let i = 0; i < this.selectCardsIndex.length; i++) {
        this.selectCardsIndex[i] = true;
      }
    } else {
      for (let i = 0; i < this.selectCardsIndex.length; i++) {
        this.selectCardsIndex[i] = false;
      }
    }
  }

  openModal(modalAssignBranch) {
    this.selectCards = [];
    for (let i = 0; i < this.selectCardsIndex.length; i++) {
      if (this.selectCardsIndex[i]) {
        const card = this.mezaCards.resultsAcmMezaCards[i];
        this.selectCards.push(card);
      }
    }
    if (this.selectCards.length === 0) {
      this.devToolsServices.openToast(3, 'alert.card_select');
      return ;
    }
    this.modalService.open(modalAssignBranch, {
      size: 'lg'
    });
  }

  assignBranch() {
    this.selectCards = [];
    for (let i = 0; i < this.selectCardsIndex.length; i++) {
        if (this.selectCardsIndex[i]) {
          const card = this.mezaCards.resultsAcmMezaCards[i];
          card.branchID = this.selectedBranch.id;
          card.branchName = this.selectedBranch.description;
          card.status = AcmConstants.MEZA_CARD_STATUS_SENT;
          this.selectCards.push(card);
        }
      }
    this.settingMezaCardService.save(this.selectCards).subscribe(
        () => {
          this.ngOnInit();
          this.modalService.dismissAll();
        }
      );
  }
}
