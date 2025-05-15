import { Component,OnInit,Input } from '@angular/core';
import { SettingsService } from '../settings.service';
import { ProductEntity } from '../../../shared/Entities/product.entity';
import { TranslateService } from '@ngx-translate/core';
import { GroupeEntity } from '../../../shared/Entities/groupe.entity';
import { HabilitationIhmRouteEntity } from '../../../shared/Entities/habilitationIhmRoute.entity';
import { GedServiceService } from '../../GED/ged-service.service';
import { FormGroup } from '@angular/forms';
import { SettingJournalEntryTypeEntity } from 'src/app/shared/Entities/settingJournalEntryType.entity';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { forkJoin } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { SettingListValuesEntity } from 'src/app/shared/Entities/settingListValues.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';

@Component({
  selector: 'app-setting-level-process',
  templateUrl: './setting-level-process.component.html',
  styleUrls: ['./setting-level-process.component.sass'],
})
export class SettingLevelProcessComponent implements OnInit {

  @Input() productEntity: ProductEntity;
  @Input() productEntitys: ProductEntity[];
  public optionsGroupUsers: GroupeEntity[] = [];
  public duplicateGroup: FormGroup;
  public productSelected = false;
  public groupEntities: GroupeEntity[];
  public ihmRoot: HabilitationIhmRouteEntity[] = [];

  public ibIhmRoot : String[]= [];
  participantsLegal: { nameParticipant: string; participantValue: number }[] = [
    {
      nameParticipant: this.translate.instant('legal.lawyer'),
      participantValue: 1,
    },
    {
      nameParticipant: this.translate.instant('legal.bailiff'),
      participantValue: 2,
    },
  ];

  public journalEntryTypes : SettingJournalEntryTypeEntity[] = [] ;

  public expandedLoanSteps : Boolean = true; // First Displayed
  public expandedTopupSteps : Boolean = false;
  public expandedCollectionSteps : Boolean = false;
  public expandedLegalCollectionSteps : Boolean = false;
  public expandedProspectionSteps : Boolean = false;
 
  /**
   *
   * @param settingsService SettingsService
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService
   * @param gedService GedServiceService
   */
  constructor(public settingsService: SettingsService,
              public translate: TranslateService,
              public gedService: GedServiceService,
              public library: FaIconLibrary,
              public sharedService : SharedService) { }

  ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.participantsLegal = [
        {
          nameParticipant: this.getTranslationOption('lawyer'),
          participantValue: 1,
        },
        {
          nameParticipant: this.getTranslationOption('bailiff'),
          participantValue: 2,
        },
      ];
    });
    this.loadDatas();
  }

  // Load Data
  loadDatas(){
    const settingListValues = new SettingListValuesEntity();
    settingListValues.listName = AcmConstants.IB_SCREEN_STEPS;
    const habilitationIhmRouteEntity = new HabilitationIhmRouteEntity();
    habilitationIhmRouteEntity.settingsWorkflow = true;
    const settingJournalEntryTypeEntity = new SettingJournalEntryTypeEntity() ;
forkJoin([
      this.settingsService.findSettingJournalEntryBy(settingJournalEntryTypeEntity),
      this.settingsService.findGroup(new GroupeEntity()),
      this.settingsService.findAllHabilitationIhmRoute(habilitationIhmRouteEntity),
      this.settingsService.findAllGroup(),
      this.settingsService.getSettingListValues(settingListValues),
    ]).subscribe(([journalEntryTypes, groupEntities, ihmRoot, optionsGroupUsers,ibIhmRoot]) => {
      this.journalEntryTypes = journalEntryTypes;
      this.groupEntities = groupEntities;
      this.ihmRoot = ihmRoot;
      this.optionsGroupUsers = optionsGroupUsers;
      ibIhmRoot.forEach(item=>{
        this.ibIhmRoot.push(item.valueJson)
      });
    });
  }

  getTranslationOption(translationOption: string) {
    this.translate.get('legal.' + translationOption).subscribe((value) => {
      translationOption = value;
    });
    return translationOption;
  }

 /** Toggle Accordion Methods */
  toggleCollapseLoanSteps() {
    this.expandedLoanSteps = !this.expandedLoanSteps;
    this.expandedTopupSteps = false;
    this.expandedCollectionSteps = false;
    this.expandedLegalCollectionSteps = false;
    this.expandedProspectionSteps = false;
    // this.ngOnInit();
  }

  toggleCollapseTopupSteps() {
    this.expandedTopupSteps = !this.expandedTopupSteps;
    this.expandedLoanSteps = false;
    this.expandedCollectionSteps = false;
    this.expandedLegalCollectionSteps = false;
    this.expandedProspectionSteps = false;
    // this.ngOnInit();
  }

  toggleCollapseCollectionSteps(){
    this.expandedCollectionSteps = !this.expandedCollectionSteps;
    this.expandedLoanSteps = false;
    this.expandedTopupSteps = false;
    this.expandedLegalCollectionSteps = false;
    this.expandedProspectionSteps = false;
    // this.ngOnInit();
  }

  toggleCollapseLegalCollectionSteps(){
    this.expandedLegalCollectionSteps = !this.expandedLegalCollectionSteps;
    this.expandedLoanSteps = false;
    this.expandedTopupSteps = false;
    this.expandedCollectionSteps = false;
    this.expandedProspectionSteps = false;
    // this.ngOnInit();
  }
  toggleCollapseProspectionSteps(){
    this.expandedProspectionSteps = !this.expandedProspectionSteps;
    this.expandedLoanSteps = false;
    this.expandedTopupSteps = false;
    this.expandedCollectionSteps = false;
    this.expandedLegalCollectionSteps = false;
  }
}
