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
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from "ngx-loading";
import { ItemEntity } from "src/app/shared/Entities/Item.entity";
import { ItemProcessEntity } from "src/app/shared/Entities/Item.process.entity";
const PrimaryBleu = "var(--primary)";
@Component({
  selector: "app-third-party-hitsory",
  templateUrl: "./third-party-hitsory.component.html",
  styleUrls: ["./third-party-hitsory.component.sass"],
})
export class ThirdPartyHitsoryComponent implements OnInit {
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
  public settingThirdPartyEntity: SettingThirdPartyEntity =
    new SettingThirdPartyEntity();
  public listParticipants: SettingThirdPartyEntity[] = [];
  public collectionInstance: CollectionProcessEntity =
    new CollectionProcessEntity();
  public currentStep: CollectionProcessEntity;
  public currentStepItem: ItemProcessEntity;
  @Output() completeAction = new EventEmitter<string>();
  @Input() originSource: string;
  public process: string = "COLLECTION";
  @Input() source;
  public item: ItemEntity = new ItemEntity();
  
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
    public collectionServices: CollectionServices
  ) {}

  async ngOnInit(source?:string) {
    this.pageSize = 5;
    this.page = 1;
    if (this.source === "GENERIC_WORKFLOW" || source=="GENERIC_WORKFLOW") {
      this.process = "GENERIC_WORKFLOW";
      this.item = this.sharedService.getItem();

      
      this.item.itemInstanceDTOs.forEach((itemInstance) => {

        if(itemInstance.thirdParties.length>0)
        {
          itemInstance.thirdParties.forEach((data) => {
            data = {...data, stepName :itemInstance.libelle};
            this.listParticipants.push(data);
          });
        }
       
      });
    } else { 

      if (this.source === 'Collection') {
        const collectionParams: CollectionEntity = new CollectionEntity();
        collectionParams.collectionType = "COLLECTION";
        collectionParams.accountNumber = this.sharedService.getCollection().accountNumber;
       await this.collectionServices.getCollection(collectionParams).subscribe(
          (data) => {
            data.forEach((collection) => {
              collection.collectionInstancesDtos.forEach((collectionInstance) => {
                this.currentStep = collectionInstance;
                collectionInstance.thirdParties.forEach((res) => {
                  res.stepName = collectionInstance.stepName;
                  this.process = "COLLECTION";
                  this.listParticipants.push(res);
                });
              });
            });
          }
        );
      }
      else {
        this.collection = this.sharedService.getCollection();
        this.collection.collectionInstancesDtos.forEach((collectionInstance) => {
          this.currentStep = collectionInstance;
          collectionInstance.thirdParties.forEach((data) => {
            data.stepName = collectionInstance.stepName;
            this.process = this.collection.collectionType;
            this.listParticipants.push(data);
          });
        });
      }
    }
  } 

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  /**
   * GetDirection
   */
  getDirection() {
    return AppComponent.direction;
  }
}
