import {Component, OnInit} from '@angular/core';
import {AcmMezaCardPaginationEntity} from '../../../shared/Entities/AcmMezaCardPagination.entity';
import {AcmMezaCardEntity} from '../../../shared/Entities/acmMezaCard.entity';
import {AppComponent} from '../../../app.component';
import {AcmConstants} from '../../../shared/acm-constants';
import {BrancheEntity} from '../../../shared/Entities/branche.entity';
import {SettingMezaCardService} from '../setting-meza-card/setting-meza-card.service';
import {TranslateService} from '@ngx-translate/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SettingsService} from '../../Settings/settings.service';
import {AcmDevToolsServices} from '../../../shared/acm-dev-tools.services';

@Component({
  selector: 'app-setting-meza-card-send',
  templateUrl: './setting-meza-card-send.component.html',
  styleUrls: ['./setting-meza-card-send.component.sass']
})
export class SettingMezaCardSendComponent implements OnInit {

  public mezaCards: AcmMezaCardPaginationEntity = new AcmMezaCardPaginationEntity();
  public pageSize = 5;
  public totalElements: number;
  public pageNumber: number;
  public selectCards: AcmMezaCardEntity[];
  public selectCardsIndex: boolean[];
  public allSelection = false;
  public branchEntitys: BrancheEntity[];
  public selectedBranch: BrancheEntity;

  /**
   * constructor
   * @param settingMezaCardService SettingMezaCardService
   * @param translate TranslateService
   * @param modalService NgbModal
   * @param settingsService SettingsService
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public settingMezaCardService: SettingMezaCardService, public translate: TranslateService,
              public modalService: NgbModal, public settingsService: SettingsService, public devToolsServices: AcmDevToolsServices) {
  }

  ngOnInit() {
    this.mezaCards.resultsAcmMezaCards = [];
    this.selectCards = [];
    this.selectCardsIndex = [];
    const acmMezaCardPaginationEntity = new AcmMezaCardPaginationEntity();
    acmMezaCardPaginationEntity.pageSize = this.pageSize;
    acmMezaCardPaginationEntity.params = new AcmMezaCardEntity();
    acmMezaCardPaginationEntity.params.listStatus = [];
    acmMezaCardPaginationEntity.params.listStatus.push(AcmConstants.MEZA_CARD_STATUS_SENT);
    acmMezaCardPaginationEntity.params.listStatus.push(AcmConstants.MEZA_CARD_STATUS_ACTIVATE);
    acmMezaCardPaginationEntity.params.accessBranch = true;
    this.settingMezaCardService.findPagination(acmMezaCardPaginationEntity).subscribe(
      (data) => {
        this.mezaCards = data;
        this.pageSize = data.pageSize;
        this.totalElements = data.totalElements;
        this.pageNumber = data.pageNumber + 1;
        data.resultsAcmMezaCards.forEach((element) => {
          this.selectCardsIndex.push(false);
        });
      }
    );
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  reloadPage(event: number) {
    const acmMezaCardPaginationEntity = new AcmMezaCardPaginationEntity();
    acmMezaCardPaginationEntity.pageNumber = event - 1;
    acmMezaCardPaginationEntity.pageSize = this.pageSize;
    acmMezaCardPaginationEntity.params = new AcmMezaCardEntity();
    acmMezaCardPaginationEntity.params.listStatus = [];
    acmMezaCardPaginationEntity.params.listStatus.push(AcmConstants.MEZA_CARD_STATUS_SENT);
    acmMezaCardPaginationEntity.params.listStatus.push(AcmConstants.MEZA_CARD_STATUS_ACTIVATE);
    acmMezaCardPaginationEntity.params.accessBranch = true;
    this.settingMezaCardService.findPagination(acmMezaCardPaginationEntity).subscribe(
      (data) => {
        this.mezaCards = data;
        this.pageSize = data.pageSize;
        this.totalElements = data.totalElements;
        this.pageNumber = data.pageNumber + 1;
        this.selectCardsIndex = [];
        this.allSelection = false;
        data.resultsAcmMezaCards.forEach((element) => {
          this.selectCardsIndex.push(false);
        });
        this.selectCards = [];
      }
    );
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

  updateCards() {
    this.selectCards = [];
    for (let i = 0; i < this.selectCardsIndex.length; i++) {
      if (this.selectCardsIndex[i]) {
        const card = this.mezaCards.resultsAcmMezaCards[i];
        card.status = AcmConstants.MEZA_CARD_STATUS_ACTIVATE;
        this.selectCards.push(card);
      }
    }
    if (this.selectCards.length === 0) {
      this.devToolsServices.openToast(3, 'alert.card_select');
    }
    this.settingMezaCardService.save(this.selectCards).subscribe(
      () => {
        this.ngOnInit();
        this.modalService.dismissAll();
      }
    );
  }
}
