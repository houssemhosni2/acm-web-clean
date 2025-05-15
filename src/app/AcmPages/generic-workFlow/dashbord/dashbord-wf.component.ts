import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxLoadingComponent } from 'ngx-loading';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { ExceptionRequestService } from '../../Loan-Application/dashbord/exception-request/exception-request.service';
import { ItemRequestPagination } from 'src/app/shared/Entities/itemRequestPagination.entity';
import { SettingsService } from '../../Settings/settings.service';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { StepEntity } from 'src/app/shared/Entities/step.entity';
const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-dashbord-wf',
  templateUrl: './dashbord-wf.component.html',
  styleUrls: ['./dashbord-wf.component.sass']
})
export class DashbordWfComponent implements OnInit {

  public itemRequestEntityList: ItemRequestPagination = new ItemRequestPagination();
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public count: ItemRequestPagination = new ItemRequestPagination();
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  sourceParam  :  string  ;
  public stepList: SelectItem[] = [];
  constructor(public exceptionRequestService: ExceptionRequestService,public settingService  : SettingsService ,
   private route: ActivatedRoute  ) { }

  ngOnInit() {
    const itemParam = new ItemEntity();
    itemParam.status = AcmConstants.NEW_STATUT_REQUEST;
    this.getstepList();
    this.loadItemByPagination(itemParam, 0, 10);
  }
  changeTabs(event) {
    const ItemEntityRequest = new ItemEntity();

    switch (event.index) {
      case 0: { //my task
        ItemEntityRequest.status = AcmConstants.NEW_STATUT_REQUEST;

        this.loadItemByPagination(ItemEntityRequest, 0, 10); break;
      }
      case 1: { //draft
        ItemEntityRequest.status = 2;
        this.loadItemByPagination(ItemEntityRequest, 0, 10); break;
      }
      case 2: { //pending Approval
        ItemEntityRequest.status = 3;
        this.loadItemByPagination(ItemEntityRequest, 0, 10); break;
      }
      case 3: { //approved
        ItemEntityRequest.status = 4;
        this.loadItemByPagination(ItemEntityRequest, 0, 10); break;
      }
      case 4: { // closed
        ItemEntityRequest.status =5;
        this.loadItemByPagination(ItemEntityRequest, 0, 10); break;
      }
      case 5: { //review
        ItemEntityRequest.status = -2;
        this.loadItemByPagination(ItemEntityRequest, 0, 10); break;
      }
      case 6: { //rejected
        ItemEntityRequest.status = -1;
        this.loadItemByPagination(ItemEntityRequest, 0, 10); break;
      }
    }
  }

  async loadItemByPagination(itemEntityRequest: ItemEntity, page: number, pageSize: number) {
    const itemRequestPagination: ItemRequestPagination = new ItemRequestPagination();
    this.route.queryParams.subscribe(params => {
      this.sourceParam = params['source'];
      itemEntityRequest.category = this.sourceParam ;

    });
    itemRequestPagination.params = itemEntityRequest;
    itemRequestPagination.pageSize = pageSize;
    itemRequestPagination.pageNumber = page;
    await this.settingService.findItemPagination(itemRequestPagination).subscribe((data) => {
        // Get the current URL

      this.itemRequestEntityList = data;
      if(this.itemRequestEntityList.result.length > 0){
        this.itemRequestEntityList.result.forEach((elment)=>{
          elment.actualStepName = elment.itemInstanceDTOs.filter((instance)=> instance.id === elment.actualStepInstance)[0].libelle
        }); 
      }
    });

  }

  async getstepList(){
    const workFlowStep:StepEntity = new StepEntity();
    workFlowStep.process = AcmConstants.GENERIC_WORKFLOW;
    await this.settingService.getWorkFlowSteps(workFlowStep).subscribe((data)=>{
      data.forEach(element =>{
        this.stepList.push({ label: element.stepName, value: element.idWorkFlowStep });
      }); 
    });
  }


}
