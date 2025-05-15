import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { CustomerServices } from 'src/app/AcmPages/Loan-Application/customer/customer.services';
import { ScreeningStepService } from 'src/app/AcmPages/Loan-Application/screening-step/screening-step.service';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AppComponent } from 'src/app/app.component';
import { AcmAmlListSetting } from 'src/app/shared/Entities/AcmAmlListSetting.entity';
import { AcmDoubtfulTransactionSetting } from 'src/app/shared/Entities/AcmDoubtfulTransactionSetting.entity';
import { AcmAmlCheckEntity } from 'src/app/shared/Entities/AcmAmlCheck';
import { AcmDoubtfulLoanAnalyticsEntity } from 'src/app/shared/Entities/AcmDoubtfulLoanAnalytics.entity';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { GenericWorkFlowObject } from 'src/app/shared/Entities/GenericWorkFlowObject';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { ItemRequestPagination } from 'src/app/shared/Entities/itemRequestPagination.entity';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { SharedService } from 'src/app/shared/shared.service';
import { StepEntity } from 'src/app/shared/Entities/step.entity';

@Component({
  selector: 'app-generic-wf-table',
  templateUrl: './generic-wf-table.component.html',
  styleUrls: ['./generic-wf-table.component.sass']
})
export class GenericWfTableComponent implements OnInit {



    public currentPath = AcmConstants.EXCEPTION_REQUESTS_URL;
    @Input() public itemEntityList: ItemRequestPagination;
    @Input() public stepList: SelectItem[];
    @Input() public statut: number;
    @Input() public unassignedItemStatus : number ;
    @Input() public source : string;
    @Output() public update =  new EventEmitter<boolean>();
    public statusList = AcmConstants.STATUT_EXCEPTION_REQUEST_LIST;
    public cols: any[];
    public colsRejectTab: any[];
    public page: number;
    public pageSize: number;
    public selectedColumns: any[];
    public currentUser: UserEntity = new UserEntity();

    public modalForm: FormGroup;
    public exceptionRequest: ExceptionRequestEntity;
    public popupStatut: number;
    public decimalPlaces: string;
    public currencySymbol : string;
    public objects  : GenericWorkFlowObject[] =[];
    public sourceParam : string  ;
    public filredStepList: SelectItem[];
    public changedFilter: any;

    /**
     *
     * @param authService AuthentificationService
     * @param sharedService SharedService
     * @param router Router
     * @param devToolsServices AcmDevToolsServices
     * @param modalService NgbModal
     * @param formBuilder FormBuilder
     * @param translate TranslateService
     */
    constructor(public authService: AuthentificationService, public sharedService: SharedService, public router: Router,
                public devToolsServices: AcmDevToolsServices, public modalService: NgbModal,
               public formBuilder: FormBuilder,private route: ActivatedRoute ,
                public translate: TranslateService ,public settingService  : SettingsService,public customerServices:CustomerServices, public screeningStepService : ScreeningStepService ) { }

    async ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.sourceParam = params['source'];

      });
      await this.getConnectedUser();
      this.cols = [
        { field: 'id', header: 'generic_wf.reference' },
        { field: 'insertBy', header: 'generic_wf.inserted-by' },
        { field: 'genericWorkFlowObject', header:  'generic_wf.object_name' },
        { field: 'dateInsertion', header: 'loan_management.request_exception.inserted_date' },
        { field: 'dateLastUpdate', header: 'loan_management.request_exception.updated_date'},
        { field: 'ownerName', header: 'generic_wf.owner' },
        { field: 'groupOwner', header: 'generic_wf.groupe_owner' },
        { field: 'groupOwnerName', header: 'generic_wf.group_owner_name' },
        { field: 'actualStepName', header: 'collections.collection-dashboard.pending_action' }

      ];
      if (this.sourceParam === AcmConstants.AML_CHECK || this.sourceParam === AcmConstants.AML_DOUBTFUL) {
        this.cols.splice(1, 0, { field: 'description', header: 'customer.customer_name' });
    }
      // add column reject reason
        this.selectedColumns = this.cols;


      this.pageSize = 10;
      this.page = 1;

      if ( this.sourceParam=== AcmConstants.AML_DOUBTFUL){
        this.getObejectsDoubtful() ;
      }
      else if ( this.sourceParam=== AcmConstants.AML_CHECK){
        this.getObejectsAmlCheck() ;
      }else {

      this.getObejects();
    }
    this.filredStepList = this.stepList;
    }
    /**
     * getProducts
     * @returns
     */
    async getObejects(){

   await this.settingService.findWorkFlowObjects().toPromise().then(
        (data) => {
          this.objects = data
        }
      );

    }
    async getObejectsAmlCheck(){
    await this.settingService.findAMLListSetting(new AcmAmlListSetting()).subscribe(
      (data) => {
        data.forEach(elem=>{
          if (!this.objects.some(item=>item.id ===elem.genericWorkFlowObject.id ))
            this.objects.push(elem.genericWorkFlowObject)
        })

      }
    );

  }

  async getObejectsDoubtful(){
    await this.settingService.findDoubtfulTxSetting(new AcmDoubtfulTransactionSetting()).subscribe(
      (data) => {
        data.forEach(elem=>{
          if (!this.objects.some(item=>item.id ===elem.genericWorkFlowObject.id ))
          this.objects.push(elem.genericWorkFlowObject)
        })

      }
    );

  }

    async reloadItemList(event: LazyLoadEvent) {
      const itemPaginationEntity: ItemRequestPagination = new ItemRequestPagination();
      const requestParams: ItemEntity = new ItemEntity();


        requestParams.category = this.sourceParam ;


      // setting pageSize : event.rows = Number of rows per page
      itemPaginationEntity.pageSize = event.rows;

      // setting pageNumber : event.first = First row offset
      if (event.first === 0) {
        itemPaginationEntity.pageNumber = event.first;
      } else {
        itemPaginationEntity.pageNumber = event.first / event.rows;
      }

      // setting Filters object
      // event.filters: Filters object having field as key and filter value, filter matchMode as value

      if (event.filters !== undefined) {
        requestParams.id = event.filters.id !== undefined ? event.filters.id.value : null;
        requestParams.insertBy = event.filters.insertBy !== undefined ? event.filters.insertBy.value : null;
        requestParams.dateInsertion = event.filters.dateInsertion !== undefined ? event.filters.dateInsertion.value : null;
        requestParams.dateLastUpdate = event.filters.dateLastUpdate !== undefined ? event.filters.dateLastUpdate.value : null;
        requestParams.owner = event.filters.owner !== undefined ? event.filters.owner.value : null;
        requestParams.ownerName = event.filters.ownerName !== undefined ? event.filters.ownerName.value : null;
        requestParams.groupOwner = event.filters.groupOwner !== undefined ? event.filters.groupOwner.value : null;
        requestParams.groupOwnerName = event.filters.groupOwnerName !== undefined ? event.filters.groupOwnerName.value : null;
        requestParams.genericWorkFlowObject =  new GenericWorkFlowObject()
        requestParams.genericWorkFlowObject.id = event.filters.genericWorkFlowObject !== undefined ? event.filters.genericWorkFlowObject.value : null;
        requestParams.actualStep = event.filters.actualStepName !== undefined ? event.filters.actualStepName.value : null;
        if(this.sourceParam=== AcmConstants.AML_CHECK || this.sourceParam=== AcmConstants.AML_DOUBTFUL){
          requestParams.description = event.filters.description !== undefined ? event.filters.description.value : null;
        }
        requestParams.status = this.statut;
        requestParams.unassignedItemStatus =this.unassignedItemStatus ;

       // requestParams.actualStep = event.filters.genericWorkFlowObject !== undefined ? event.filters.actualStep.value : null;
      }
      if(this.changedFilter != requestParams.genericWorkFlowObject.id){
        if(requestParams.genericWorkFlowObject.id){
          this.changedFilter = requestParams.genericWorkFlowObject.id;
          const step: StepEntity = new StepEntity();
          step.productId = requestParams.genericWorkFlowObject.id;
          step.process = AcmConstants.GENERIC_WORKFLOW;
          this.filredStepList = [];
          requestParams.actualStep = null;
          this.settingService.findWorkFlowSteps(step).subscribe((data) =>{
            data.forEach(element =>{
              this.filredStepList.push({ label: element.stepName, value: element.idWorkFlowStep });
            });
          });
         }else{
          this.filredStepList = this.stepList;
         }
      }

      itemPaginationEntity.params = requestParams;

      // setting sort field & direction
      // event.multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
      if (event.multiSortMeta !== undefined && event.multiSortMeta.length > 0) {
        itemPaginationEntity.sortField = event.multiSortMeta[0].field;
        itemPaginationEntity.sortDirection = event.multiSortMeta[0].order;
      }

      await this.settingService.findItemPagination(itemPaginationEntity).subscribe((data) => {
        this.itemEntityList = data;
        this.itemEntityList.result.forEach((elment)=>{
          elment.actualStepName = elment.itemInstanceDTOs.filter((instance)=> instance.id === elment.actualStepInstance)[0].libelle
        });
      });
    }


    /**
     * get Connected User
     */
    async getConnectedUser() {
      this.currentUser = this.sharedService.getUser();

    }


    /**
     * form of reject exception request
     */
     createForm() {
      this.modalForm = this.formBuilder.group({
        reason: ['', Validators.required],
        note: ['', Validators.required],
        confirm: ['', Validators.required]
      });
    }
    /**
     * modal of reason
     * @param refModel modal reason
     */
    async modal(refModel, rowData: ExceptionRequestEntity, categorie: string) {
     this.modalService.open(refModel, {
        size: 'md',
      });
      // set the exception request to be rejected
     this.exceptionRequest = rowData;
     // Check if the category was accept or reject to change the statu of the exception request and bring the right list of reject reason


    }
    /**
     * Get direction
     */
    getDirection() {
      return AppComponent.direction;
    }
    close() {
      this.exceptionRequest.statut = 0;
      this.modalService.dismissAll();
    }

    itemDetails(rowData){
      this.sharedService.setItem(rowData) ;
      if(this.source===AcmConstants.AML_CHECK){
        const acmAmlCheck = new AcmAmlCheckEntity();
        acmAmlCheck.id = rowData.elementId;
        this.screeningStepService.findCheckAml(acmAmlCheck).toPromise().then(res=>{
          this.sharedService.setAcmAmlCheck(res[0]);
        this.customerServices.getCustomerInformation(res[0].customerId).subscribe((data)=>{
          this.sharedService.setCustomer(data);
          this.router.navigate(['/acm/generic-wf-screen'],{queryParams:{source:'SCAN'}}) ;
        })
        })
      }
      else if(this.source===AcmConstants.AML_DOUBTFUL){
        const acmDoubtfulLoanAnalyticsEntity = new AcmDoubtfulLoanAnalyticsEntity();
        acmDoubtfulLoanAnalyticsEntity.id = rowData.elementId;

        this.screeningStepService.findDoubtfulLoanTransaction(acmDoubtfulLoanAnalyticsEntity).toPromise().then(res=>{
          if(res){
            this.sharedService.setAcmDoubtfulLoanAnalytics(res[0]);
            this.customerServices.getCustomerInformation(res[0].customerId).subscribe((data)=>{
              this.sharedService.setCustomer(data);
              this.router.navigate(['/acm/generic-wf-screen'],{queryParams:{source:'DOUBTFUL'}}) ;
            })
          }
        })
      }
      else{
        this.router.navigate(['/acm/generic-wf-screen']) ;
      }
    }


  }


