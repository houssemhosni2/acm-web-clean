import { StepEntity } from "src/app/shared/Entities/step.entity";
import { SettingsService } from "src/app/AcmPages/Settings/settings.service";
import { LoanProcessEntity } from "src/app/shared/Entities/loan.process.entity";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from "../../../../app.component";
import { TranslateService } from "@ngx-translate/core";
import { GuarantorsDetailsService } from "../../guarantors-step/guarantors-details/guarantors-details.service";
import { CustomerLinksRelationshipEntity } from "src/app/shared/Entities/CustomerLinksRelationship.entity";
import { AcmConstants } from "src/app/shared/acm-constants";
import { LoanEntity } from "src/app/shared/Entities/loan.entity";
import { SharedService } from "src/app/shared/shared.service";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
import { CustomerEntity } from "src/app/shared/Entities/customer.entity";
import { ScreeningStepService } from "../screening-step.service";
import { ScreeningEntity } from "src/app/shared/Entities/screening.entity";
import { ThirdPartyHistoriqueEntity } from "src/app/shared/Entities/thirdPartyHistorique.entity";
import { ReportService } from "src/app/AcmPages/Reporting/report.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingMotifRejetsEntity } from "../../../../shared/Entities/settingMotifRejets.entity";
import { LoanDetailsServices } from "../../loan-details/loan-details.services";
import { AcmKycCheckEntity } from "src/app/shared/Entities/AcmKycCheck.entity";
import { AcmAmlCheckEntity } from "src/app/shared/Entities/AcmAmlCheck";
import { AcmAmlListSetting } from "src/app/shared/Entities/AcmAmlListSetting.entity";
import { CustomerServices } from "../../customer/customer.services";
import { listNameBadgeEntity } from "src/app/shared/Entities/listNameBadge.entity";
import { AcmAmlDataEntity } from "src/app/shared/Entities/AcmAmlData";
import { AcmScoreCheckEntity } from "src/app/shared/Entities/AcmScoreCheck.entity";
import { checkOfflineMode } from "src/app/shared/utils";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { error } from "console";

@Component({
  selector: "app-screening",
  templateUrl: "./screening.component.html",
  styleUrls: ["./screening.component.sass"],
})
export class ScreeningComponent implements OnInit {
  public loan: LoanEntity = new LoanEntity();
  public decimalPlaces: string;
  public guarantors: CustomerEntity[] = [];
  public responseCustomer: ScreeningEntity = new ScreeningEntity();
  public responseGuarantor: ScreeningEntity = new ScreeningEntity();
  public customer: CustomerEntity = new CustomerEntity();
  public thirdPartyHistoriques: ThirdPartyHistoriqueEntity[] = [];
  public showButtonDownloadISCORE = false;
  public showButtonDownloadAML = false;
  @Input() expandedCustomerScreening;
  @Input() expandedGuanatorsScreening;
  @Input() loanApproval;
  @Output() echec: EventEmitter<any> = new EventEmitter<any>();
  @Output() buttonNextStepCustomerIScore: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() buttonNextStepGuarantorIScore: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() buttonNextStepCustomerAML: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() buttonNextStepGuarantorAML: EventEmitter<any> =
    new EventEmitter<any>();
  public rejectForm: FormGroup;
  public settingMotifRejetsEntity: SettingMotifRejetsEntity =
    new SettingMotifRejetsEntity();
  public settingMotifRejetsEntitys: SettingMotifRejetsEntity[] = [];
  public guarantorsLinksRelationship: CustomerLinksRelationshipEntity[] = [];
  public currentPath = "screening";
  public buttonCustomer = false;
  public buttonGuarantor = false;
  public buttonCustomerAml = false;
  public buttonGuarantorAml = false;
  public rejectCategory: string;
  public currentStep: LoanProcessEntity;
  public maxScore: number;
  public screeningComponent = "CREDIT_C,CREDIT_G,AML_C,AML_G,KYC_C,KYC_G,SCORE_C,SCORE_G";
  public numberOccuranceCustomer = 2;
  public numberOccuranceGuarantor = 2;
  amlCheck: AcmAmlCheckEntity[] = [];
  isScreening : boolean;

  amlCheckDto: AcmAmlCheckEntity = new AcmAmlCheckEntity();
  acmAmlChecksDTOs : AcmAmlCheckEntity[];
  amlData: AcmAmlDataEntity;
  amlDetails: AcmAmlDataEntity;

  public detailsTab: boolean = true;
  public sanctionsListTab: boolean = false;
  public identityTab: Boolean = false;
  public functionsTab: boolean = false;
  public noteTab: boolean = false;
  public sourcesTab: boolean = false;

  /**
   * @param modalService NgbModal
   * @param translate TranslateService
   * @param guarantorsDetailsService GuarantorsDetailsService
   * @param loanSharedService SharedService
   * @param devToolsServices AcmDevToolsServices
   * @param screeningStepService ScreeningStepService
   * @param reportingService ReportService
   * @param router Router
   * @param loanDetailsServices LoanDetailsServices
   * @param formBuilder FormBuilder
   */
  constructor(
    public modalService: NgbModal,
    public translate: TranslateService,
    public guarantorsDetailsService: GuarantorsDetailsService,
    public loanSharedService: SharedService,
    public devToolsServices: AcmDevToolsServices,
    public screeningStepService: ScreeningStepService,
    public reportingService: ReportService,
    public router: Router,
    public loanDetailsServices: LoanDetailsServices,
    public formBuilder: FormBuilder,
    public settingService: SettingsService,
    private dbService: NgxIndexedDBService,
    public customerService: CustomerServices
  ) {}

  async ngOnInit() {
    this.loan = this.loanSharedService.getLoan();
    const stepEntity: StepEntity = new StepEntity();
    let currentIhmRoot = '';
    if(this.loan.ihmRoot !=='' && this.loan.ihmRoot !==null && this.loan.ihmRoot !== undefined){
      currentIhmRoot = this.loan.ihmRoot
    }else{
      const filteredInstances = this.loan.loanInstancesDtos.filter(instance => instance.code === this.loan.etapeWorkflow);
      if (filteredInstances.length > 0) {
        currentIhmRoot = filteredInstances[0].ihmRoot;
      } 
    }
    this.isScreening = AcmConstants.SCREENING_URL.includes(currentIhmRoot);
    
    if (this.loan.etapeWorkflow > 23) {
      if(!checkOfflineMode()){
      stepEntity.productId = this.loan.productId;
      stepEntity.idWorkFlowStep = this.loan.etapeWorkflow;
      await this.settingService
        .findWorkFlowSteps(stepEntity)
        .subscribe((value) => {
          if (value[0] !== undefined && value[0].screeningComponent !== null) {
           this.checkScreening(value[0]);
          }
        });
    } else {
    this.dbService.getByKey('data', 'getStepById_' + this.loan.etapeWorkflow).subscribe((result:any)=>{
      if(result !== undefined && result.data[0] !== undefined && result.data[0].screeningComponent !== null){
        this.checkScreening(result.data[0]);
      }
    });
    }
  }
    this.customer = this.loanSharedService.getCustomer();

    
    if (this.customer.acmAmlChecksDTOs.length > 0) {
      this.customer.existaml = true ;
      if(checkOfflineMode()){
         this.dbService.getByKey('data','findAmlListSetting').subscribe((results:any)=>{
          if(results !== undefined){
            const amlSettings = results.data;
            this.verifyCustomer(amlSettings);
          }
        }) 
      } else {
      const amlListSetting = new AcmAmlListSetting();
      amlListSetting.enabled = true;
      this.settingService
        .findAMLListSetting(amlListSetting)
        .subscribe((amlSettings) => {
         this.verifyCustomer(amlSettings);
        });
      }
    } else {
      this.buttonNextStepCustomerAML.emit(true);
    }

    this.customer.customerNameNoPipe = this.loanSharedService.getCustomerName(
      this.customer
    );
    this.customer.colorCustomerKYC = " ";
    this.customer.colorCustomerSCORE = " ";
    this.customer.colorCustomerAml = " ";
    this.customer.colorCustomerISCORE = " ";
    this.getThirdPartyHistoriqueByCategory(
      this.loan,
      this.customer,
      AcmConstants.CUSTOMER_CATEGORY_CUSTOMER
    );
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(
      this.loan.currencyDecimalPlaces
    );
    if(checkOfflineMode()){
       this.dbService.getByKey('data', 'getLoanGuarantorByLoanId_' + this.loan.loanId).subscribe((data:any)=>{
        const customerLinks = data === undefined ? [] : data.data;
        this.handleGuarantorResult(customerLinks);
       });
    } else {
      const customerLinksRelationshipEntity: CustomerLinksRelationshipEntity =
      new CustomerLinksRelationshipEntity();
    customerLinksRelationshipEntity.idLoan = this.loan.loanId;
    customerLinksRelationshipEntity.category = AcmConstants.RELATION_GUARANTOR;
    this.guarantorsDetailsService
      .findCustomerLinkRelationShip(customerLinksRelationshipEntity)
      .subscribe((data) => {
      this.handleGuarantorResult(data);
      });
    }
      this.customer.listName = this.getListNameWithBadge( this.customer.acmAmlChecksDTOs) ;
      this.customer.colorCustomerAml =this.getColorWithMaxScore(this.customer.acmAmlChecksDTOs) ;

    this.maxScore = this.customer.acmAmlChecksDTOs.reduce(
      (max, obj) => (obj.score > max ? obj.score : max),
      0
    );
  }
  checkScreening(value){
    this.screeningComponent = value.screeningComponent;
    this.numberOccuranceCustomer = this.countOccurrences(
      this.screeningComponent,
      "_C"
    );
    this.numberOccuranceGuarantor = this.countOccurrences(
      this.screeningComponent,
      "_G"
    );
  }

  verifyCustomer(amlSettings){
    let disabled = false;
    for (const setting of amlSettings) {
      if (
        this.customer.acmAmlChecksDTOs.filter(
          (aml) =>
            (aml.amlStatus === AcmConstants.AML_STATUS_FLAGGED ||
              aml.amlStatus === AcmConstants.AML_STATUS_PENDING) &&
            setting.listName == aml.listName &&
            setting.isBlockingList == true
        ).length !== 0
      ) {

        disabled = true;
      }
    }
    this.buttonNextStepCustomerAML.emit(disabled);
  }

  verifyGuarantor(amlSettings,guarantor){
    let disabled = false;
    for (const setting of amlSettings) {
      if (guarantor.member.acmAmlChecksDTOs.filter((aml) =>
        (aml.amlStatus === AcmConstants.AML_STATUS_FLAGGED ||
          aml.amlStatus === AcmConstants.AML_STATUS_PENDING) &&
          setting.listName == aml.listName &&
          setting.isBlockingList == true).length !== 0) {
            disabled = true;
          }
        }
        this.buttonNextStepGuarantorAML.emit(disabled);
  }

  countOccurrences(mainString: string, searchString: string): number {
    let count = 0;
    let position = 0;

    // Utilisez indexOf() pour trouver la première occurrence de la chaîne de recherche
    // à partir de la position actuelle de la recherche.
    while ((position = mainString.indexOf(searchString, position)) !== -1) {
      // Si une occurrence est trouvée, incrémentez le compteur et mettez à jour la position
      count++;
      position += searchString.length;
    }

    return count;
  }

  checkScreeningComponent(key: string) {
    return this.screeningComponent.includes(key);
  }

  /**
   * getThirdPartyHistoriqueByCategory
   * @param customer CustomerEntity
   * @param customerCategory string
   */
  async getThirdPartyHistoriqueByCategory(
    loan: LoanEntity,
    customer: CustomerEntity,
    customerCategory: string
  ) {
    // initialisation customer
    customer.existISCORE = false;
    customer.existaml = false;
    customer.existkyc = false;
    customer.existSCORE = false;

    const thirdPartyHistorique = new ThirdPartyHistoriqueEntity();
    if (customerCategory === AcmConstants.CUSTOMER_CATEGORY_CUSTOMER) {
      thirdPartyHistorique.category = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
      thirdPartyHistorique.identityCustomer = customer.identity;
    } else if (customerCategory === AcmConstants.RELATION_GUARANTOR) {
      thirdPartyHistorique.category = AcmConstants.RELATION_GUARANTOR;
      thirdPartyHistorique.identityCustomerGuarantor = customer.identity;
    }

    if(checkOfflineMode()){
      const key1 = 'getThirdPartyHistoriques_' + customerCategory + '_' + customer.id;
      const thirdPartyHistoriques = await this.dbService.getByKey('data' , key1).toPromise() as any;
      const data = thirdPartyHistoriques === undefined ? [] : thirdPartyHistoriques.data;
      this.handleThirdPartyHistorique(data,customer,customerCategory);
      
      //
      const key2 = 'getKycCheck_' + customerCategory + '_' + customer.id;
      const kycChecks = await this.dbService.getByKey('data',key2).toPromise() as any;
      const res2 = kycChecks === undefined ? null : kycChecks.data; 
      this.handleKycCheck(res2,customer);


      //
      const key3 = 'getScoreCheck_' + customerCategory + '_' + customer.id;
      const scoreChecks =  await this.dbService.getByKey('data',key3).toPromise() as any;
      const res3 = scoreChecks === undefined ? null : scoreChecks.data; 
      this.handleScoreCheck(res3,customer);


    } else {
    this.screeningStepService
      .thirdPartyHistoriqueScreening(thirdPartyHistorique)
      .subscribe((data) => {
        this.handleThirdPartyHistorique(data,customer,customerCategory);
      });

    const acmKycCheckEntity = new AcmKycCheckEntity();
    acmKycCheckEntity.customerId = customer.id;
    acmKycCheckEntity.loandId = loan.loanId;
    acmKycCheckEntity.customerCategory = customerCategory;
    this.screeningStepService.findKycCheck(acmKycCheckEntity)
      .subscribe((res) => {
        this.handleKycCheck(res,customer);
      },(error)=>{
        console.error('Error during findKycCheck');
      });
      const acmScoreCheckEntity = new AcmScoreCheckEntity();
      acmScoreCheckEntity.customerId = customer.id;
      acmScoreCheckEntity.loandId = loan.loanId;
      acmScoreCheckEntity.customerCategory = customerCategory;
      this.screeningStepService
        .findScoreCheck(acmScoreCheckEntity)
        .subscribe((res) => {
          this.handleScoreCheck(res,customer);
        },(error)=>{
          console.error('Error during findScoreCheck');
      });
    }
  }

  /**
   * return color and value
   * @param category ISCORE / KYC / AML
   * @param status FAILED / SUCCESS / ACCEPTED / REFERED / DECLINED / ERROR / REJECTE_GUARANTOR / REJECTED
   * @param customer customer
   */
  getColorValue(category, status, customer: CustomerEntity, score) {
    if (category === AcmConstants.KYC) {
      customer.existkyc = true;
      if (status === AcmConstants.FAILED) {
        // COLOR YELLOW
        customer.colorCustomerKYC = "#f7b924";
        // VALUE 0
        customer.currentCustomerKYC = 0;
      } else if (status === AcmConstants.ACCEPTED) {
        // COLOR GREEN
        customer.colorCustomerKYC = "#16E0BD";
        // VALUE 100
        customer.currentCustomerKYC = 100;
      }
    }
    if (category === AcmConstants.SCORE) {
      customer.existSCORE = true;
      if (status === AcmConstants.FAILED) {
        // COLOR YELLOW
        customer.colorCustomerSCORE = "#f7b924";
        // VALUE 0
        customer.currentCustomerSCORE = 0;
      } else if (status === AcmConstants.ACCEPTED) {
        // COLOR GREEN
        customer.colorCustomerSCORE = "#16E0BD";
        // VALUE 100
        customer.currentCustomerSCORE = 100;
      }
    }
    // if (category === AcmConstants.AML) {
    //   customer.existaml = true;
    //   if (status === AcmConstants.FAILED) {
    //     // COLOR YELLOW
    //     customer.colorCustomerAml = "#f7b924";
    //   } else if (status === AcmConstants.ACCEPTED) {
    //     // COLOR GREEN
    //     customer.colorCustomerAml = "#16E0BD";
    //   } else if (status === AcmConstants.REFERED) {
    //     // COLOR RED
    //     customer.colorCustomerAml = "#d92550";
    //     this.echec.emit(true);
    //     if (
    //       customer.customerCategory === AcmConstants.CUSTOMER_CATEGORY_CUSTOMER
    //     ) {
    //       this.buttonCustomerAml = status === AcmConstants.REFERED;
    //     } else if (
    //       customer.customerCategory === AcmConstants.RELATION_GUARANTOR
    //     ) {
    //       this.buttonGuarantorAml = status === AcmConstants.REFERED;
    //     }
    //   } else if (status === AcmConstants.REVIEW_GUARANTOR) {
    //     customer.colorCustomerAml = "#f7b924";
    //     this.echec.emit(true);
    //     this.buttonGuarantorAml = true;
    //   } else if (status === AcmConstants.REVIEW_CATEGORIE) {
    //     customer.colorCustomerAml = "#f7b924";
    //     this.echec.emit(true);
    //     this.buttonCustomerAml = true;
    //   } else if (status === AcmConstants.DECLINED) {
    //     // COLOR RED
    //     customer.colorCustomerAml = "#d92550";
    //     this.echec.emit(true);
    //   } else if (status === AcmConstants.ERROR) {
    //     // COLOR YELLOW
    //     customer.colorCustomerAml = "#f7b924";
    //   }
    //   customer.currentCustomerAML = score !== null ? score : 999;
    // }
    if (category === AcmConstants.ISCORE) {
      customer.existISCORE = true;
      if (status === AcmConstants.FAILED) {
        // COLOR YELLOW
        customer.colorCustomerISCORE = "#f7b924";
      } else if (status === AcmConstants.ACCEPTED) {
        // COLOR GREEN
        customer.colorCustomerISCORE = "#16E0BD";
      } else if (status === AcmConstants.ERROR) {
        // COLOR YELLOW
        customer.colorCustomerISCORE = "#f7b924";
      } else if (
        status === AcmConstants.REVIEW_CATEGORIE ||
        status === AcmConstants.REVIEW_GUARANTOR
      ) {
        // COLOR YELLOW
        customer.colorCustomerISCORE = "#f7b924";
        this.buttonCustomer = status === AcmConstants.REVIEW_CATEGORIE;
        this.buttonGuarantor = status === AcmConstants.REVIEW_GUARANTOR;
      } else if (status === AcmConstants.REJECTE_GUARANTOR) {
        // COLOR RED
        customer.colorCustomerISCORE = "#d92550";
      }
      customer.currentCustomerISCORE = score !== null ? score : 999;
    }
    // if kyc does not exist
    if (customer.existkyc === false) {
      customer.colorCustomerKYC = "#3f6ad8";
      customer.currentCustomerKYC = 0;
    }
    // if ISCORE does not exist
    if (customer.existISCORE === false) {
      customer.colorCustomerISCORE = "#3f6ad8";
      customer.currentCustomerISCORE = 0;
    }
    // if aml does not exist
    if (customer.existaml === false) {
      customer.colorCustomerAml = "#3f6ad8";
      customer.currentCustomerAML = 0;
    }
     // if score does not exist
     if (customer.existSCORE === false) {
      customer.colorCustomerSCORE = "#3f6ad8";
      customer.currentCustomerSCORE = 0;
    }
  }

  /**
   * detailModal : open detail modal
   * @param content modal
   * @param customer CustomerEntity (Customer or guarantor entity)
   * @param customerCategory String (Customer or guarantor category)
   * @param thridPartyCategory string (KYC/ISCORE/AML)
   */
  async detailModal(
    content,
    customer: CustomerEntity,
    customerCategory: string,
    thridPartyCategory: string
  ) {
    this.showButtonDownloadISCORE = false;
    this.showButtonDownloadAML = false;
    const thirdPartyHistorique = new ThirdPartyHistoriqueEntity();
    switch (thridPartyCategory) {
      case AcmConstants.KYC:
        thirdPartyHistorique.category = AcmConstants.KYC;
        break;
      case AcmConstants.SCORE:
        thirdPartyHistorique.category = AcmConstants.SCORE;
        break;
      case AcmConstants.AML:
        thirdPartyHistorique.category = AcmConstants.AML;
        break;
      case AcmConstants.ISCORE:
        thirdPartyHistorique.category = AcmConstants.ISCORE;
        break;
    }
    if (customerCategory === AcmConstants.CUSTOMER_CATEGORY_CUSTOMER) {
      thirdPartyHistorique.identityCustomer = customer.identity;
    } else if (customerCategory === AcmConstants.RELATION_GUARANTOR) {
      thirdPartyHistorique.identityCustomerGuarantor = customer.identity;
    }
    if(!checkOfflineMode()){
    await this.screeningStepService
      .thirdPartyHistorique(thirdPartyHistorique)
      .subscribe((data) => {
        this.thirdPartyHistoriques = data;
        if (this.thirdPartyHistoriques.length > 0) {
          if (thridPartyCategory === AcmConstants.ISCORE) {
            this.showButtonDownloadISCORE = true;
          }
          if (thridPartyCategory === AcmConstants.AML) {
            this.showButtonDownloadAML = true;
          }
        }
      });
    } else {
      this.dbService.getByKey('data', 'getThirdPartyHistoriques_' + customerCategory + '_' + customer.id).subscribe((results:any)=>{
        if(results == undefined){
          this.devToolsServices.openToast(3, 'No details saved for offline use');
        } else {
          const filteredData = results.data.filter(item => item.category === thridPartyCategory);
          this.thirdPartyHistoriques = filteredData;
        }
      })
    }
    this.modalService.open(content, {
      size: "md",
    });
  }

  getDirection() {
    return AppComponent.direction;
  }

  /**
   * show and hide elements
   */
  toggleCollapseCustomerScreening() {
    this.expandedCustomerScreening = !this.expandedCustomerScreening;
  }

  /**
   * show and hide elements
   */
  toggleCollapseGuanatorsScreening() {
    this.expandedGuanatorsScreening = !this.expandedGuanatorsScreening;
  }

  /**
   * runCustomer
   * @param category String (AML or ISCORE RUN API)
   */
  getListNameWithBadge(scores: AcmAmlCheckEntity[]): any[] {
    let badgeName : listNameBadgeEntity ;
    const  listNames :listNameBadgeEntity [] = []  ;
    scores.forEach(scoreObject => {


        if (scoreObject.amlStatus===AcmConstants.AML_STATUS_FLAGGED ){
          badgeName = new listNameBadgeEntity() ;
          badgeName.name =   scoreObject.listName ;
          badgeName.badge = "badge ACM-badge-notification bg-danger" ;

          listNames.push(badgeName) ;

          }
           if (scoreObject.amlStatus===AcmConstants.AML_STATUS_PENDING){
            badgeName = new listNameBadgeEntity() ;
            badgeName.name =   scoreObject.listName ;
            badgeName.badge = "badge ACM-badge-notification bg-warning" ;

            listNames.push(badgeName) ;

          }
           if (scoreObject.amlStatus===AcmConstants.AML_STATUS_CLEARED){
            badgeName = new listNameBadgeEntity() ;
            badgeName.name =   scoreObject.listName ;
            badgeName.badge = "badge ACM-badge-notification bg-info" ;

            listNames.push(badgeName) ;


          }
    });

    return  listNames ;

}

getColorWithMaxScore(scores: AcmAmlCheckEntity[]): string {
  let maxScore = -Infinity;
  let colorCode = "#d3d3d3";

  for(const scoreObject of scores)  {
      if (scoreObject.score > maxScore && scoreObject.amlStatus==AcmConstants.AML_STATUS_FLAGGED ) {
          maxScore = scoreObject.score;
          colorCode = "#ff0000";
      }else if (scoreObject.score > maxScore && scoreObject.amlStatus==AcmConstants.AML_STATUS_PENDING ) {
        maxScore = scoreObject.score;
        colorCode = "#ED7F10";
    }else  if (scoreObject.score > maxScore && (scoreObject.amlStatus==AcmConstants.AML_STATUS_SAFE || scoreObject.amlStatus==AcmConstants.AML_STATUS_CLEARED ) )  {
      colorCode = "#008000";
    }
  };

  return colorCode;
}
  runCustomer(category: string, customer?: CustomerEntity) {
    const screeningDTO = new ScreeningEntity();
    screeningDTO.customerDTO = this.customer;
    screeningDTO.idLoan = this.loan.loanId;
    screeningDTO.customerCategory = AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
    if (category === AcmConstants.AML) {
      
      this.screeningStepService.checkAmlCustomer(customer).subscribe((data) => {
        this.screeningStepService
          .saveCheckAmlCustomer(data)
          .subscribe((res) => {
            if(res.length > 0){
              this.customer.acmAmlChecksDTOs = res ;
            }
            this.customerService
              .getCustomerInformation(customer.id)
              .subscribe((customerEntity) => {
                this.amlCheck = customerEntity.acmAmlChecksDTOs;
                this.maxScore = this.amlCheck.reduce(
                  (max, obj) => (obj.score > max ? obj.score : max),
                  0
                );

                this.customer.listName = this.getListNameWithBadge(this.amlCheck) ;
                this.customer.colorCustomerAml =  this.getColorWithMaxScore(this.amlCheck) ;

                const amlListSetting = new AcmAmlListSetting();
                amlListSetting.enabled = true;

                if (this.customer.acmAmlChecksDTOs.length > 0) {
                  const amlListSetting = new AcmAmlListSetting();
                  amlListSetting.enabled = true;
                  this.settingService
                    .findAMLListSetting(amlListSetting)
                    .subscribe((amlSettings) => {
                      let disabled = false;
                      for (const setting of amlSettings) {
                        if (
                          this.customer.acmAmlChecksDTOs.filter(
                            (aml) =>
                              (aml.amlStatus ===
                                AcmConstants.AML_STATUS_FLAGGED ||
                                aml.amlStatus ===
                                  AcmConstants.AML_STATUS_PENDING) &&
                              setting.listName == aml.listName &&
                              setting.isBlockingList == true
                          ).length !== 0
                        ) {
                          disabled = true;
                        }
                      }
                      this.buttonNextStepCustomerAML.emit(disabled);
                    });
                } else {
                  this.buttonNextStepCustomerAML.emit(true);
                }
              });
          });
      });
    } else if (category === AcmConstants.ISCORE) {
      // check befor run call API i-score
      this.screeningStepService
        .thirdPartyCheckIscore(screeningDTO)
        .subscribe((data) => {
          this.responseCustomer = data;
          // this.customer.currentCustomerISCORE = this.responseCustomer.thirdPartyHistoriqueDTO.score;
          switch (data.decision) {
            case AcmConstants.ACCEPTED: {
              // toast success
              this.devToolsServices.openToast(0, "screening.success-i-score");
              this.buttonNextStepCustomerIScore.emit(false);
              break;
            }
            case AcmConstants.FAILED: {
              // toast warning
              this.devToolsServices.openToast(3, "screening.failed-i-score");
              this.buttonNextStepCustomerIScore.emit(true);
              break;
            }
            case AcmConstants.ERROR: {
              // toast error
              this.devToolsServices.openToast(1, "screening.error-i-score");
              this.buttonNextStepCustomerIScore.emit(true);
              break;
            }
            case AcmConstants.REJECTED: {
              this.devToolsServices.openConfirmationDialog(
                "reject-i-score",
                "",
                [],
                false
              );
              this.buttonNextStepCustomerIScore.emit(true);
              break;
            }
            case AcmConstants.REVIEW_CATEGORIE: {
              this.devToolsServices.openConfirmationDialog(
                "review-i-score",
                "",
                [],
                false
              );
              this.buttonNextStepCustomerIScore.emit(true);
              break;
            }
          }
          this.getColorValue(
            AcmConstants.ISCORE,
            this.responseCustomer.decision,
            this.customer,
            this.responseCustomer.thirdPartyHistoriqueDTO.score
          );
        });
    } else if (category === AcmConstants.KYC) {
      const acmKycCheckEntity = new AcmKycCheckEntity();
      acmKycCheckEntity.customerId = this.customer.id;
      acmKycCheckEntity.loandId = this.loan.loanId;
      acmKycCheckEntity.customerCategory =
        AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
      this.screeningStepService
        .saveCheckKyc(acmKycCheckEntity)
        .subscribe((data) => {
          this.devToolsServices.openToast(0, "screening.kyc_check");
          this.getThirdPartyHistoriqueByCategory(
            this.loan,
            this.customer,
            AcmConstants.CUSTOMER_CATEGORY_CUSTOMER
          );
        });
    } else if (category === AcmConstants.SCORE) {
      const acmScoreCheckEntity = new AcmScoreCheckEntity();
      acmScoreCheckEntity.customerId = this.customer.id;
      acmScoreCheckEntity.loandId = this.loan.loanId;
      acmScoreCheckEntity.customerCategory =
        AcmConstants.CUSTOMER_CATEGORY_CUSTOMER;
      this.screeningStepService
        .saveCheckScore(acmScoreCheckEntity)
        .subscribe((data) => {
          this.devToolsServices.openToast(0, "screening.Score_check");
          this.getThirdPartyHistoriqueByCategory(
            this.loan,
            this.customer,
            AcmConstants.CUSTOMER_CATEGORY_CUSTOMER
          );
        });
    }
  }


  /**
   * runGuarantor
   * @param guarantor CustomerEntity
   * @param category String (AML or ISCORE RUN API)
   */
  runGuarantor(guarantor: CustomerEntity, category: string, index: number) {
    const screeningDTO = new ScreeningEntity();
    screeningDTO.customerDTO = guarantor;
    screeningDTO.idLoan = this.loan.loanId;
    screeningDTO.customerCategory = AcmConstants.RELATION_GUARANTOR;
    if (category === AcmConstants.AML) {
      this.screeningStepService.checkAmlCustomer(guarantor).subscribe((data) => {
        this.screeningStepService
          .saveCheckAmlCustomer(data)
          .subscribe((res) => {
            this.customerService
              .getCustomerInformation(guarantor.id)
              .subscribe((guarantorEntity) => {
                if(guarantorEntity.acmAmlChecksDTOs.length > 0){
                  this.guarantors[index].acmAmlChecksDTOs = guarantorEntity.acmAmlChecksDTOs ;
                }

                guarantor.acmAmlChecksDTOs = guarantorEntity.acmAmlChecksDTOs ;
                guarantor.currentCustomerAML = guarantor.acmAmlChecksDTOs.reduce(
                  (max, obj) => (obj.score > max ? obj.score : max),
                  0
                );

                guarantor.listName = this.getListNameWithBadge(guarantor.acmAmlChecksDTOs) ;
                guarantor.colorCustomerAml =  this.getColorWithMaxScore(guarantor.acmAmlChecksDTOs) ;

                const amlListSetting = new AcmAmlListSetting();
                amlListSetting.enabled = true;

                if (this.customer.acmAmlChecksDTOs.length > 0) {
                  const amlListSetting = new AcmAmlListSetting();
                  amlListSetting.enabled = true;
                  this.settingService
                    .findAMLListSetting(amlListSetting)
                    .subscribe((amlSettings) => {
                      let disabled = false;
                      for (const setting of amlSettings) {
                        if (
                          guarantor.acmAmlChecksDTOs.filter(
                            (aml) =>
                              (aml.amlStatus ===
                                AcmConstants.AML_STATUS_FLAGGED ||
                                aml.amlStatus ===
                                  AcmConstants.AML_STATUS_PENDING) &&
                              setting.listName == aml.listName &&
                              setting.isBlockingList == true
                          ).length !== 0
                        ) {
                          disabled = true;
                        }
                      }
                      this.buttonNextStepGuarantorAML.emit(disabled);
                      this.guarantors = this.guarantors.filter(guar=>guar.id !== guarantor.id) ;
                      this.guarantors.push(guarantor) ;
                    });
                } else {
                  this.buttonNextStepGuarantorAML.emit(true);
                  this.guarantors = this.guarantors.filter(guar=>guar.id !== guarantor.id) ;
                      this.guarantors.push(guarantor) ;
                }

              });
          });
      });
    } else if (category === AcmConstants.ISCORE) {
      // check befor run call API i-score
      this.screeningStepService
        .thirdPartyCheckIscore(screeningDTO)
        .subscribe((data) => {
          this.responseGuarantor = data;
          switch (data.decision) {
            case AcmConstants.ACCEPTED: {
              // toast success
              this.devToolsServices.openToast(0, "screening.success-i-score");
              this.buttonNextStepGuarantorIScore.emit(false);
              break;
            }
            case AcmConstants.FAILED: {
              // toast warning
              this.devToolsServices.openToast(3, "screening.failed-i-score");
              this.buttonNextStepGuarantorIScore.emit(true);
              break;
            }
            case AcmConstants.ERROR: {
              // toast error
              this.devToolsServices.openToast(1, "screening.error-i-score");
              this.buttonNextStepGuarantorIScore.emit(true);
              break;
            }
            case AcmConstants.REVIEW_GUARANTOR: {
              this.devToolsServices.openConfirmationDialog(
                "review-guarantor-i-score",
                "",
                [],
                false
              );
              this.buttonNextStepGuarantorIScore.emit(true);
              break;
            }
            case AcmConstants.REJECTE_GUARANTOR: {
              this.devToolsServices.openToast(
                1,
                "screening.reject-guarantor-i-score"
              );
              this.buttonNextStepGuarantorIScore.emit(true);
              break;
            }
          }
          this.getColorValue(
            AcmConstants.ISCORE,
            this.responseGuarantor.decision,
            guarantor,
            this.responseGuarantor.thirdPartyHistoriqueDTO.score
          );
        });
    } else if (category === AcmConstants.KYC) {
      const acmKycCheckEntity = new AcmKycCheckEntity();
      acmKycCheckEntity.customerId = guarantor.id;
      acmKycCheckEntity.loandId = this.loan.loanId;
      acmKycCheckEntity.customerCategory = AcmConstants.RELATION_GUARANTOR;
      this.screeningStepService
        .saveCheckKyc(acmKycCheckEntity)
        .subscribe((data) => {
          this.devToolsServices.openToast(0, "screening.kyc_check");
          this.getThirdPartyHistoriqueByCategory(
            this.loan,
            guarantor,
            AcmConstants.RELATION_GUARANTOR
          );
        });
    }  else if (category === AcmConstants.SCORE) {
      const acmKycCheckEntity = new AcmKycCheckEntity();
      acmKycCheckEntity.customerId = guarantor.id;
      acmKycCheckEntity.loandId = this.loan.loanId;
      acmKycCheckEntity.customerCategory = AcmConstants.RELATION_GUARANTOR;
      this.screeningStepService
        .saveCheckScore(acmKycCheckEntity)
        .subscribe((data) => {
          this.devToolsServices.openToast(0, "screening.Score_check");
          this.getThirdPartyHistoriqueByCategory(
            this.loan,
            guarantor,
            AcmConstants.RELATION_GUARANTOR
          );
        });
    }
  }

  /**
   * downloadISCORERapport
   */
  downloadISCORERapport(thirdPartyHistorique: ThirdPartyHistoriqueEntity) {
    // return byte[]
    this.screeningStepService
      .thirdPartyDownloadRepport(thirdPartyHistorique)
      .subscribe((res: any) => {
        const blob = new Blob([res], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      });
  }

  /**
   * downloadAmlRapport
   */
  downloadAmlRapport(thirdPartyHistorique: ThirdPartyHistoriqueEntity) {
    const daterun = new Date();
    this.reportingService
      .reportingAml(thirdPartyHistorique)
      .subscribe((res: any) => {
        const fileData = [res];
        const blob = new Blob(fileData, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.download =
          "Report_AML_" +
          daterun.getFullYear() +
          "-" +
          daterun.getMonth() +
          "-" +
          daterun.getDate() +
          "_" +
          daterun.getHours() +
          "-" +
          daterun.getMinutes();
        anchor.href = url;
        anchor.click();
      });
  }

  recommend(methode: string, customer: CustomerEntity) {
    let thirdPartyHistorique = new ThirdPartyHistoriqueEntity();
    if (methode === AcmConstants.AML) {
      if (customer.thirdPartyHistoriqueAml !== undefined) {
        thirdPartyHistorique = customer.thirdPartyHistoriqueAml;
      } else {
        this.devToolsServices.openToast(3, "screening.aml_no_validation");
        return;
      }
    } else if (methode === AcmConstants.ISCORE) {
      if (customer.thirdPartyHistoriqueISCORE !== undefined) {
        thirdPartyHistorique = customer.thirdPartyHistoriqueISCORE;
      } else {
        this.devToolsServices.openToast(3, "screening.iscore_no_validation");
        return;
      }
    }
    this.screeningStepService
      .thirdPartyValidate(thirdPartyHistorique)
      .subscribe((data) => {
        this.router.navigate([AcmConstants.DASHBOARD_URL]).then(() => {
          if (methode === AcmConstants.AML) {
            this.devToolsServices.openToast(0, "screening.aml_validated");
          } else if (methode === AcmConstants.ISCORE) {
            this.devToolsServices.openToast(0, "screening.iscore_validated");
          }
        });
      });
  }

  async rejectModal(reject: TemplateRef<any>, category: string) {
    this.rejectCategory = category;
    this.modalService.open(reject, {
      size: "md",
    });
    this.createForm();
    this.settingMotifRejetsEntity.categorie = AcmConstants.REJECT_CATEGORIE;
    await this.loanDetailsServices
      .getReason(this.settingMotifRejetsEntity)
      .toPromise()
      .then((data) => {
        this.settingMotifRejetsEntitys = data;
      });
  }

  /**
   * createForm
   */
  createForm() {
    this.rejectForm = this.formBuilder.group({
      reason: ["", Validators.required],
      note: ["", Validators.required],
      confirm: ["", Validators.required],
    });
  }

  /**
   * onSubmit
   */
  onSubmit() {
    this.loan.note = this.rejectForm.value.reason.libelle;
    this.loan.note = this.loan.note + " : " + this.rejectForm.value.note;
    this.loan.codeExternMotifRejet = this.rejectForm.value.reason.codeExternal;
    if (this.rejectForm.valid) {
      this.loan.confirm = false;
      this.reject();
    }
  }

  /**
   * Methode reject : Reject loan without workflow shemas
   */
  async reject() {
    this.modalService.dismissAll();
    await this.loanDetailsServices
      .rejectLoan(this.loan)
      .toPromise()
      .then((data) => {
        this.loanSharedService.setLoan(data);
        this.router.navigate([AcmConstants.DASHBOARD_URL]);
        if (this.rejectCategory === AcmConstants.ISCORE) {
          this.devToolsServices.openToast(1, "screening.reject-i-score");
        } else if (this.rejectCategory === AcmConstants.AML) {
          this.devToolsServices.openToast(1, "screening.reject-aml");
        }
      });
  }

  rejectGuarantor(i: number) {
    this.screeningStepService
      .deleteGuarantor(this.guarantorsLinksRelationship[i])
      .subscribe(() => {
        this.router.navigate([AcmConstants.DASHBOARD_URL]);
        this.devToolsServices.openToast(1, "Guarantor deleted");
      });
  }

  async detailsAmlCustomer(content, amlCheck, rowData) {
    this.loanSharedService.setCustomer(rowData);
    this.loanSharedService.setAcmAmlChecksDTOs(rowData.acmAmlChecksDTOss);
    this.acmAmlChecksDTOs = rowData.acmAmlChecksDTOs;
    this.amlData = new AcmAmlDataEntity();
    this.amlData.id = amlCheck.idAmlData;
    if (amlCheck.idAmlData) {
      await this.settingService.getAmlData(this.amlData).toPromise().then((res) => {
        this.amlData = res[0];
        this.amlDetails = res[0];
        this.loanSharedService.setAmlDetails(this.amlDetails);
        
      });
    }
    this.modalService.open(content, {
      size: "lg",
    });
  }

  async getAmlData(content, customer){
    let amlCheck = customer.acmAmlChecksDTOs.filter((item)=> item.idAmlData !== null )[0];
    
    if(amlCheck){
      await this.detailsAmlCustomer(content, amlCheck, customer);
    }
  }

  isExistAmlDetails(customer){
    let amlCheck = customer.acmAmlChecksDTOs?.filter((item)=> item.idAmlData !== null )[0];
    if(amlCheck) return true;
    else return false;
  }

  changeTab(tab: number) {
    switch (tab) {
      case 1:
        this.detailsTab = true;
        this.sanctionsListTab = false;
        this.identityTab = false;
        this.functionsTab = false;
        this.noteTab = false;
        this.sourcesTab = false;
        break;
      case 2:
        this.detailsTab = false;
        this.sanctionsListTab = true;
        this.identityTab = false;
        this.functionsTab = false;
        this.noteTab = false;
        this.sourcesTab = false;
        break;
      case 3:
        this.detailsTab = false;
        this.sanctionsListTab = false;
        this.identityTab = true;
        this.functionsTab = false;
        this.noteTab = false;
        this.sourcesTab = false;
        break;
      case 4:
        this.detailsTab = false;
        this.sanctionsListTab = false;
        this.identityTab = false;
        this.functionsTab = true;
        this.noteTab = false;
        this.sourcesTab = false;
        break;
      case 5:
        this.detailsTab = false;
        this.sanctionsListTab = false;
        this.identityTab = false;
        this.functionsTab = false;
        this.noteTab = true;
        this.sourcesTab = false;
        break;
      case 6:
        this.detailsTab = false;
        this.sanctionsListTab = false;
        this.identityTab = false;
        this.functionsTab = false;
        this.noteTab = false;
        this.sourcesTab = true;
        break;
    }
  }

  dismissModal(event?: string){
    if(event === "0"){
      this.modalService.dismissAll();
    }
  }
  
  handleScoreCheck(res,customer){
    if (res !== null) {
      customer.existSCORE = true;
      customer.colorCustomerSCORE = res.riskColor;
      customer.currentCustomerSCORE = res.score;
      customer.riskLabelCustomerSCORE = res.riskLabel;
    } else {
      customer.colorCustomerSCORE = "#3f6ad8";
      customer.currentCustomerSCORE = 0;
    }
  }
  handleKycCheck(res,customer){
    if (res !== null) {
      customer.existkyc = true;
      customer.colorCustomerKYC = res.riskColor;
      customer.currentCustomerKYC = res.score;
      customer.riskLabelCustomerKYC = res.riskLabel;
    } else {
      customer.colorCustomerKYC = "#3f6ad8";
      customer.currentCustomerKYC = 0;
    }
  }
  handleThirdPartyHistorique(data,customer,customerCategory){
    this.thirdPartyHistoriques = data;
    let AMl = true;
    let IScore = true;
    let score = null;
    if (this.thirdPartyHistoriques.length > 0) {
      this.thirdPartyHistoriques.forEach((thirdPartyHistoriqueEntity) => {
        if (thirdPartyHistoriqueEntity.category === AcmConstants.KYC) {
          customer.existkyc = true;
          customer.thirdPartyHistoriqueKyc = thirdPartyHistoriqueEntity;
        }else if (thirdPartyHistoriqueEntity.category === AcmConstants.SCORE) {
          customer.existSCORE = true;
          customer.thirdPartyHistoriqueSCORE = thirdPartyHistoriqueEntity;
        } else if (
          thirdPartyHistoriqueEntity.category === AcmConstants.AML
        ) {
          customer.existaml = true;
          customer.thirdPartyHistoriqueAml = thirdPartyHistoriqueEntity;
          score = thirdPartyHistoriqueEntity.amlPourcentage;
          if (thirdPartyHistoriqueEntity.status === AcmConstants.ACCEPTED) {
            AMl = false;
          }
        } else if (
          thirdPartyHistoriqueEntity.category === AcmConstants.ISCORE
        ) {
          customer.existISCORE = true;
          customer.thirdPartyHistoriqueISCORE = thirdPartyHistoriqueEntity;
          score = thirdPartyHistoriqueEntity.score;
          if (thirdPartyHistoriqueEntity.status === AcmConstants.ACCEPTED) {
            IScore = false;
          }
        }
        customer.customerCategory = customerCategory;
        this.getColorValue(
          thirdPartyHistoriqueEntity.category,
          thirdPartyHistoriqueEntity.status,
          customer,
          score
        );
      });
    }

    if (customerCategory === AcmConstants.CUSTOMER_CATEGORY_CUSTOMER) {
      this.buttonNextStepCustomerIScore.emit(
        IScore && this.checkScreeningComponent("CREDIT_C")
      );
      //  this.buttonNextStepCustomerAML.emit(AMl && this.checkScreeningComponent('AML_C'));
    } else if (customerCategory === AcmConstants.RELATION_GUARANTOR) {
      this.buttonNextStepGuarantorIScore.emit(
        IScore && this.checkScreeningComponent("CREDIT_G")
      );
      // this.buttonNextStepGuarantorAML.emit(
      //   AMl && this.checkScreeningComponent("AML_G")
     // );
    }
  }

  handleGuarantorResult(data){
    if (data.length > 0) {
      this.guarantorsLinksRelationship = data;
      data.forEach(async (guarantor) => {
        guarantor.member.colorCustomerKYC = " ";
        guarantor.member.colorCustomerSCORE = " ";
        guarantor.member.colorCustomerAml = " ";
        guarantor.member.colorCustomerISCORE = " ";
        guarantor.member.customerNameNoPipe =
          this.loanSharedService.getCustomerName(guarantor.member);
        guarantor.member.amountGuarantor = guarantor.amountGuarantor;
        this.getThirdPartyHistoriqueByCategory(
          this.loan,
          guarantor.member,
          AcmConstants.RELATION_GUARANTOR
        );

          const amlListSetting = new AcmAmlListSetting();
          amlListSetting.enabled = true;
          guarantor.member.listName = this.getListNameWithBadge(guarantor.member.acmAmlChecksDTOs) ;

          guarantor.member.colorCustomerAml = this.getColorWithMaxScore(guarantor.member.acmAmlChecksDTOs);
          guarantor.member.currentCustomerAML = guarantor.member.acmAmlChecksDTOs.reduce(
            (max, obj) => (obj.score > max ? obj.score : max),
            0
          );
          if(checkOfflineMode()){
            const results = await this.dbService.getByKey('data','findAmlListSetting').toPromise() as any;

            const amlSettings = results === undefined ? [] : results.data;
            this.verifyGuarantor(amlSettings,guarantor);

          } else {
          this.settingService
            .findAMLListSetting(amlListSetting)
            .subscribe((amlSettings) => {
              this.verifyGuarantor(amlSettings,guarantor);
            });
          }

        this.guarantors.push(guarantor.member);
      });
    } else {
      this.buttonNextStepGuarantorIScore.emit(true);
      //this.buttonNextStepGuarantorAML.emit(true);
    }
  }
  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
}
