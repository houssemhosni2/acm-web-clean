import { CollectionProcessEntity } from "src/app/shared/Entities/CollectionProcess.entity";
import { CollectionServices } from "./../collection.services";
import { AppComponent } from "src/app/app.component";
import { Router } from "@angular/router";
import { LoanEntity } from "src/app/shared/Entities/loan.entity";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SettingThirdPartyEntity } from "src/app/shared/Entities/settingThirdParty.entity";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { FormGroup, FormBuilder } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { SettingsService } from "src/app/AcmPages/Settings/settings.service";
import { CollectionEntity } from "src/app/shared/Entities/acmCollection.entity";
import { SharedService } from "src/app/shared/shared.service";
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewChild,
  OnChanges,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { StepEntity } from "src/app/shared/Entities/step.entity";
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from "ngx-loading";
import { AcmConstants } from "src/app/shared/acm-constants";
import { ItemEntity } from "src/app/shared/Entities/Item.entity";
import { checkOfflineMode } from "src/app/shared/utils";
import { NgxIndexedDBService } from "ngx-indexed-db";
const PrimaryBleu = "var(--primary)";
@Component({
  selector: "app-legal-participants",
  templateUrl: "./legal-participants.component.html",
  styleUrls: ["./legal-participants.component.sass"],
})
export class LegalParticipantsComponent implements OnInit, OnChanges , OnDestroy{
  @ViewChild("ngxLoading") ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public editIhmFieldForm: FormGroup;
  public primaryColour = PrimaryBleu;
  public selectedIhmField: SettingThirdPartyEntity;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public loading = true;
  public page: number;
  @Input() saveParticipants = true;
  public pageSize: number;
  public loan: LoanEntity = new LoanEntity();
  public participants: SettingThirdPartyEntity[] = [];
  @Input() expanded;
  @Input() collectionId;
  public check = false;
  public collection: CollectionEntity;
  public listStepCollections: StepEntity[] = [];
  public settingThirdPartyEntity: SettingThirdPartyEntity =
    new SettingThirdPartyEntity();
  public listParticipants: SettingThirdPartyEntity[] = [];
  public listParticipantsSelected: SettingThirdPartyEntity[] = [];
  public collectionInstance: CollectionProcessEntity =
    new CollectionProcessEntity();
  public currentStep: CollectionProcessEntity;
  @Output() completeAction = new EventEmitter<string>();
  @Input() originSource: string;
  public currentStepName: string;
  public showComponent = false;
  @Input() source;
  @Input() itemId;
  public item: ItemEntity;
  public genericWfSteps: StepEntity[] = [];
  @Input() itemInstace;
  public thirdPartiesSaved=false;

  /**
   *
   * @param loanSharedService loanSharedService
   * @param devToolsServices devToolsServices
   * @param modalService modalService
   * @param translate translate
   * @param formBuilder formBuilder
   * @param router router
   * @param library FaIconLibrary
   */
  constructor(
    public sharedService: SharedService,
    public loanSharedService: SharedService,
    public devToolsServices: AcmDevToolsServices,
    public modalService: NgbModal,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    public router: Router,
    public library: FaIconLibrary,
    public settingService: SettingsService,
    public collectionServices: CollectionServices,
    private dbService: NgxIndexedDBService
  ) {}
  ngOnDestroy(): void {
      this.showComponent=false;
  }
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (
      changes?.saveParticipants?.currentValue !==
        changes?.saveParticipants?.previousValue &&
      changes?.saveParticipants?.previousValue !== undefined
    ) {
     await this.save(
        changes?.originSource !== undefined
          ? changes?.originSource?.currentValue
          : null
      );
    }
  }
  async ngOnInit() {

    this.thirdPartiesSaved=false;
    this.showComponent = false;
    this.pageSize = 5;
    this.page = 1;
    if (this.source == "GENERIC_WORKFLOW") {
      this.item = this.sharedService.getItem();
        this.item.itemInstanceDTOs.forEach(async (itemInstanceDto) => {
          if (itemInstanceDto.idWorkFlowStep === this.item.actualStep) {
            const newStepParam: StepEntity = new StepEntity();
            newStepParam.idWorkFlowStep = this.item.actualStep;
            newStepParam.process = AcmConstants.GENERIC_WORKFLOW;
            await this.settingService
              .findWorkFlowSteps(newStepParam)
              .toPromise()
              .then((steps) => {
                this.genericWfSteps = steps;

                if (
                  this.genericWfSteps[0].genericWorkFlowParticipants !== null &&
                  this.genericWfSteps[0].genericWorkFlowParticipants !==
                    undefined &&
                  this.genericWfSteps[0].genericWorkFlowParticipants !== ""
                ) {
                  this.showComponent = true;
                  this.currentStepName = this.genericWfSteps[0].stepName;
                  if (itemInstanceDto.thirdParties.length > 0) {
                    itemInstanceDto.thirdParties.forEach((data) => {
                      data.stepName = itemInstanceDto.stepName;
                      this.listParticipants.push(data);
                    });
                  }
                }
              });
          }
        });
    } else {
      this.collection = this.sharedService.getCollection();
    
      this.collection.collectionInstancesDtos.forEach((collectionInstance) => {
        if (
          collectionInstance.idAcmCollectionStep ===
          this.collection.idAcmCollectionStep
        ) {
          const stepEntity: StepEntity = new StepEntity();
          stepEntity.idCollectionStep = collectionInstance.idAcmCollectionStep;
          stepEntity.productId = this.collection.productId;
          if (this.source == "COLLECTION") {
            stepEntity.process = "COLLECTION";
          } else {
            stepEntity.process = "LEGAL";
          }
         
          const fetchData = () => {
            if(!checkOfflineMode()){
              return this.settingService.getCollectionStepByParms(stepEntity).toPromise();
            } else {
              const key = 'getCollectionStepByCollectionId_' + this.collection.idAcmCollectionStep;
              return this.dbService.getByKey('data', key).toPromise().then((stepEntity :any) => stepEntity?.data);
            }
          };
      
          fetchData().then(value => {
            if (value && value.typeThirdParty) {
              this.showComponent = true;
              this.currentStep = collectionInstance;
              this.currentStepName = collectionInstance.stepName;
              if (collectionInstance.thirdParties.length > 0) {
                collectionInstance.thirdParties.forEach((data) => {
                  data.stepName = collectionInstance.stepName;
                  this.listParticipants.push(data);
                });
              }
            } else if (!value) {
              this.devToolsServices.openToast(3, 'No legal participant saved for offline use');
            }
          })
        }
        
      });
    }
  }

  addSelectedThirdParty(evt: SettingThirdPartyEntity) {
    this.listParticipantsSelected.push(evt);
  }
  /**
   * save to database and quit
   * check required if true enable next button
   */

  async save(source?: string) {
    if (this.source !== "GENERIC_WORKFLOW") {
      await this.collection.collectionInstancesDtos.forEach(
        (collectionInstance) => {
          if (
            this.collection.idAcmCollectionStep ===
            collectionInstance.idAcmCollectionStep
          ) {
            collectionInstance.thirdParties = this.listParticipants;
            this.collectionServices
              .UpdateCollectionInstances(collectionInstance)
              .toPromise()
              .then((value1) => {
                this.devToolsServices.openToast(0, "alert.success");
                this.check = false;
                // if source is 'complete' button
                if (source === AcmConstants.COMPLETE_ACTION) {
                  this.completeAction.emit("2");
                }
              });
          }
        }
      );
    } else {
      await this.item.itemInstanceDTOs.forEach((itemInstanceDTO, index) => {
        if (this.item.actualStep === itemInstanceDTO.idWorkFlowStep) {
          
          itemInstanceDTO.thirdParties = this.listParticipantsSelected;
          this.settingService
            .UpdateItemInstances(itemInstanceDTO)
            .toPromise()
            .then((value1) => {
              this.devToolsServices.openToast(0, "alert.success");
              this.check = false;
              // if source is 'complete' button
            //  if (source === AcmConstants.COMPLETE_ACTION) {
                this.thirdPartiesSaved=true;
                this.completeAction.emit("2");
              //}
             // this.ngOnInit();
             this.listParticipantsSelected=[];
            });
        }
      });
    }
  }

  /**
   * Display the confirmation message
   */

  actionSave(source?: string) {
    if (!this.check) {
      this.devToolsServices.openToast(3, "alert.no_participants_to_save");
    } else {
      this.devToolsServices
        .openConfirmDialogWithoutRedirect(
          "confirmation_dialog.save_participants"
        )
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            this.save(source).then(() => {});
          }
        });
    }
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  /**
   * methode to open the popup schedule
   * param content
   */

  openLarge(content) {
    this.modalService.open(content, {
      size: "xl",
    });
  }

  /**
   * GetDirection
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Add ThirdParty List
   */
  addThirdParty(event: SettingThirdPartyEntity[]) {
    event.forEach((data) => {
      this.listParticipants.forEach((value) => {
        if (data.id === value.id) {
          this.devToolsServices.openToast(3, "alert.same_third_party_selected");
        }
      });
      this.listParticipants.push(data);
      this.listParticipantsSelected.push(data);
    });
    this.check = true;
  }

  /**
   * Delete Selected Third Party
   * @param i i
   */
  deleteThirdParty(i: number) {
    this.check = true;
    this.loanSharedService.setThirdPartyLegal(null);
    this.listParticipants.splice(i, 1);
  }


}
