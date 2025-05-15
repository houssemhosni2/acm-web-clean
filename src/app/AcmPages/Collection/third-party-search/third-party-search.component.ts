import { CollectionProcessEntity } from "src/app/shared/Entities/CollectionProcess.entity";
import { StepEntity } from "src/app/shared/Entities/step.entity";
import { CollectionEntity } from "src/app/shared/Entities/acmCollection.entity";
import { AppComponent } from "src/app/app.component";
import { AcmConstants } from "src/app/shared/acm-constants";
import { SettingsService } from "src/app/AcmPages/Settings/settings.service";
import { SettingThirdPartyEntity } from "src/app/shared/Entities/settingThirdParty.entity";
import { SharedService } from "src/app/shared/shared.service";
import { DashbordServices } from "./../../Loan-Application/dashbord/dashbord.services";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LazyLoadEvent, SelectItem } from "primeng/api";
import { SettingThirdPartyPaginationEntity } from "../../../shared/Entities/SettingThirdPartyPaginations.entity";
import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ItemEntity } from "src/app/shared/Entities/Item.entity";
import { ItemProcessEntity } from "src/app/shared/Entities/Item.process.entity";
import { findObjectsByConcatenatedValue } from "src/app/shared/utils";

@Component({
  selector: "app-third-party-search",
  templateUrl: "./third-party-search.component.html",
  styleUrls: ["./third-party-search.component.sass"],
})
export class ThirdPartySearchComponent implements OnInit {
  public cols: any[];
  public selectedColumns: any[];
  public page: number;
  public pageSize: number;
  public settingThirdPartyPaginationEntity: SettingThirdPartyPaginationEntity =
    new SettingThirdPartyPaginationEntity();
  public thirdParty: SettingThirdPartyEntity[];
  public listSelected: SettingThirdPartyEntity[] = [];
  public listUnSelected: SettingThirdPartyEntity[] = [];
  checked = false;
  @Output() selectedThirdParty = new EventEmitter();
  @Input() guarantor: boolean;
  @Input() participants: SettingThirdPartyEntity[];
  public listParticpantsSelected: SettingThirdPartyEntity[] = [];
  @Output() newItemEvent = new EventEmitter<SettingThirdPartyEntity>();
  public index = 0;
  public collection: CollectionEntity;
  public currentStep: CollectionProcessEntity;
  public currentStepItem: ItemProcessEntity;
  public listStepCollections: StepEntity[] = [];
  public stepCollection: StepEntity = new StepEntity();
  public stepItem: StepEntity = new StepEntity();
  @Output() listThirdParty = new EventEmitter();
  @Input() source;
  public item: ItemEntity;
  public selectedThirdPartys: SelectItem[];
  public listThirdPartyOptions: SelectItem[];

  /**
   * constructor
   * @param translate TranslateService
   * @param router Router
   * @param sharedService SharedService
   * @param modal Modal
   * @param dashbordService DashbordServices
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(
    public translate: TranslateService,
    public settingService: SettingsService,
    public router: Router,
    public sharedService: SharedService,
    public modal: NgbModal,
    public dashbordService: DashbordServices,
    public devToolsServices: AcmDevToolsServices
  ) {}

  async ngOnInit() {
    this.listThirdPartyOptions = [
      { label: "Insurance companies", value: "Insurance companies" },
      { label: "Financial backers", value: "Financial backers" },
      { label: "Business partners", value: "Business partners" },
      { label: "Technical partners", value: "Technical partners" },
      { label: "Control agency", value: "Control agency" },
      { label: "Individuals", value: "Individuals" },
      { label: "Lawyer", value: "Lawyer" },
      { label: "Bailiff", value: "Bailiff" },
    ];
    this.cols = [
      { field: "type", header: "collaterol.type" },
      { field: "firstName", header: "setting.setting_users.first-name" },
      { field: "lastName", header: "setting.setting_users.last-name" },
      { field: "phoneNumber", header: "customer.telephone" },
      { field: "email", header: "customer.email" },
      { field: "addressParty", header: "customer.address" },
    ];
    // init pagination params
    this.selectedColumns = this.cols;
    this.pageSize = 10;
    this.page = 1;
    if (this.source !== "GENERIC_WORKFLOW") {
      this.settingThirdPartyPaginationEntity.params =
        new SettingThirdPartyEntity();
      this.settingThirdPartyPaginationEntity.params.enabled = true;
      this.collection = this.sharedService.getCollection();

      this.currentStep = this.collection.pendingCollectionInstance;
      if (this.currentStep) {
        this.stepCollection.idCollectionStep =
          this.currentStep.idAcmCollectionStep;
        this.stepCollection.stepName = this.currentStep.stepName;
        // set enabled collection
        this.settingService
          .getCollectionStepByParms(this.stepCollection)
          .subscribe((arrayDocuments) => {
            this.listStepCollections = arrayDocuments;
            this.settingThirdPartyPaginationEntity.params.enabled = true;
            if (this.listStepCollections[0].typeThirdParty === "1") {
              this.settingThirdPartyPaginationEntity.params.type =
                AcmConstants.LAWYER;
            } else if (this.listStepCollections[0].typeThirdParty === "2") {
              this.settingThirdPartyPaginationEntity.params.type =
                AcmConstants.BAILIFF;
            } else if (
              this.listStepCollections[0].typeThirdParty === "1,2" ||
              this.listStepCollections[0].typeThirdParty === "2,1"
            ) {
              this.settingThirdPartyPaginationEntity.params.listTypes = [
                AcmConstants.LAWYER,
                AcmConstants.BAILIFF,
              ];
            }
            this.settingService
              .findSettingThirdPartyPagination(
                this.settingThirdPartyPaginationEntity
              )
              .subscribe((data2) => {
                this.settingThirdPartyPaginationEntity = data2;
              });
          });
      }
      if (this.settingThirdPartyPaginationEntity.resultsThirdParties != null) {
        this.listThirdParty.emit(true);
      }
    } else {
      this.settingThirdPartyPaginationEntity.params =
        new SettingThirdPartyEntity();
      this.settingThirdPartyPaginationEntity.params.enabled = true;
      this.item = this.sharedService.getItem();
      this.currentStepItem = this.item.itemInstanceDTOs[0];
      if (this.currentStepItem) {

        this.stepItem.idWorkFlowStep =
          this.item.actualStep;
        this.stepItem.process=AcmConstants.GENERIC_WORKFLOW;
        const newStepParam: StepEntity = new StepEntity();
        newStepParam.idWorkFlowStep = this.item.actualStep;
        newStepParam.process = AcmConstants.GENERIC_WORKFLOW;
        await this.settingService
          .findWorkFlowSteps(newStepParam)
          .toPromise()
          .then((steps) => {
            if (steps[0].genericWorkFlowParticipants) {
              this.selectedThirdPartys = findObjectsByConcatenatedValue(
                this.listThirdPartyOptions,
                "value",
                steps[0].genericWorkFlowParticipants
              );
         
              this.settingThirdPartyPaginationEntity.params.listTypes = [];
              this.selectedThirdPartys.forEach((data) => {
                this.settingThirdPartyPaginationEntity.params.listTypes.push(
                  data.value
                );
              });
            }

            this.settingService
            .findSettingThirdPartyPagination(
              this.settingThirdPartyPaginationEntity
            )
            .subscribe((data2) => {
              this.settingThirdPartyPaginationEntity = data2;
            });
          });


        
      }
      if (this.settingThirdPartyPaginationEntity.resultsThirdParties != null) {
        this.listThirdParty.emit(true);
      }
    }
  }

  /**
   * reloadThirdPartyList
   * @param $event Event
   */
  async reloadThirdPartyList(event: LazyLoadEvent) {

  
    const settingThirdPartyPaginationEntity: SettingThirdPartyPaginationEntity =
      new SettingThirdPartyPaginationEntity();
    // setting pageSize : event.rows = Number of rows per page
    this.settingThirdPartyPaginationEntity.pageSize = event.rows;
    // setting pageNumber : event.first = First row offset
    if (event.first === 0) {
      this.settingThirdPartyPaginationEntity.pageNumber = event.first;
    } else {
      this.settingThirdPartyPaginationEntity.pageNumber =
        event.first / event.rows;
    }
    // setting Filters object
    // event.filters: Filters object having field as key and filter value, filter matchMode as value
    const thirdPartyParams: SettingThirdPartyEntity =
      new SettingThirdPartyEntity();
    if (event.filters !== undefined) {
      thirdPartyParams.firstName =
        event.filters.firstName !== undefined
          ? event.filters.firstName.value
          : null;
      thirdPartyParams.lastName =
        event.filters.lastName !== undefined
          ? event.filters.lastName.value
          : null;
      thirdPartyParams.phoneNumber =
        event.filters.phoneNumber !== undefined
          ? event.filters.phoneNumber.value
          : null;
      thirdPartyParams.email =
        event.filters.email !== undefined ? event.filters.email.value : null;
      thirdPartyParams.addressParty =
        event.filters.addressParty !== undefined
          ? event.filters.addressParty.value
          : null;
      thirdPartyParams.type =
        event.filters.type !== undefined ? event.filters.type.value : null;
    }
    settingThirdPartyPaginationEntity.params = thirdPartyParams;
    this.settingThirdPartyPaginationEntity.params = thirdPartyParams;

    // setting sort field & direction
    // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
    if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
      this.settingThirdPartyPaginationEntity.sortField =
        event.multiSortMeta[0].field;
      this.settingThirdPartyPaginationEntity.sortDirection =
        event.multiSortMeta[0].order;
    }

    if (this.source !== "GENERIC_WORKFLOW") {
    
      this.settingService
      .getCollectionStepByParms(this.stepCollection)
      .subscribe(async (arrayDocuments) => {
        this.listStepCollections = arrayDocuments;
        this.settingThirdPartyPaginationEntity.params.enabled = true;
        // this.settingThirdPartyPaginationEntity.params.branchID = this.collection.branchId;

        if (this.listStepCollections[0].typeThirdParty === "1") {
          this.settingThirdPartyPaginationEntity.params.type =
            AcmConstants.LAWYER;
        } else if (this.listStepCollections[0].typeThirdParty === "2") {
          this.settingThirdPartyPaginationEntity.params.type =
            AcmConstants.BAILIFF;
        } else if (
          this.listStepCollections[0].typeThirdParty === "1,2" ||
          this.listStepCollections[0].typeThirdParty === "2,1"
        ) {
          this.settingThirdPartyPaginationEntity.params.listTypes = [
            AcmConstants.LAWYER,
            AcmConstants.BAILIFF,
          ];
        }
        await this.settingService
          .findSettingThirdPartyPagination(
            this.settingThirdPartyPaginationEntity
          )
          .subscribe((data2) => {
            this.settingThirdPartyPaginationEntity = data2;
          });
      });
    
    }
    else
    {

      

      await this.settingService
      .findWorkFlowSteps(this.stepItem)
      .toPromise()
      .then((steps) => {
        if (steps[0].genericWorkFlowParticipants) {
          this.selectedThirdPartys = findObjectsByConcatenatedValue(
            this.listThirdPartyOptions,
            "value",
            steps[0].genericWorkFlowParticipants
          );
          this.settingThirdPartyPaginationEntity.params.listTypes = [];
          this.selectedThirdPartys.forEach((data) => {
            this.settingThirdPartyPaginationEntity.params.listTypes.push(
              data.value
            );
          });
        }

        this.settingService
        .findSettingThirdPartyPagination(
          this.settingThirdPartyPaginationEntity
        )
        .subscribe((data2) => {
          this.settingThirdPartyPaginationEntity = data2;
        });
      });
    }

  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * Get Selected Third Party
   */
  addSelectedThirdParty(rowData: any) {
    this.selectedThirdParty.emit(rowData);
    this.newItemEvent.emit(rowData);
  }

  /**
   * add third party
   * @param thirdParty thirdParty
   */
  addThirdParty(thirdParty: SettingThirdPartyEntity[]) {
    this.selectedThirdParty.emit(thirdParty);
    this.modal.dismissAll();
  }

  /**
   * close Modale
   */
  closeModale() {
    this.modal.dismissAll();
  }

  handleSelect(evt) {
    this.listSelected.push(evt.data);
    if (this.listSelected.length > 1) {
      this.devToolsServices.openToast(3, "alert.third_party_selected");
      return;
    }
  }

  handleUnselect(evt) {
    this.listSelected.forEach((v) => {
      if (v.id === evt.data.id) {
        const index: number = this.listSelected.indexOf(v);
        this.listSelected.splice(index, 1);
      }
    });
  }
}
