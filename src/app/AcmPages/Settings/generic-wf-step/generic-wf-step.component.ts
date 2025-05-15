import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { SettingsService } from '../settings.service';
import { GnericWorkflowObjectWorkflow } from 'src/app/shared/Entities/GnericWorkflowObjectWorkflow.entity';
import { GenericWorkFlowObject } from 'src/app/shared/Entities/GenericWorkFlowObject';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { Router } from '@angular/router';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

@Component({
  selector: 'app-generic-wf-step',
  templateUrl: './generic-wf-step.component.html',
  styleUrls: ['./generic-wf-step.component.sass']
})
export class GenericWfStepComponent implements OnInit {
  @Input() expanded;
  @Input() category ;
  public popupForm: FormGroup;
  public legal  :  CollectionEntity ;
  public genericWorkFlowObjects: GenericWorkFlowObject[] = [];
  public itemEntity = new ItemEntity() ;
  public itemEntitys : ItemEntity[] = [] ;


  constructor(public modalService: NgbModal , public formBuilder: FormBuilder,public translate: TranslateService,public  sharedSecrvice  :  SharedService,
    public settingService  : SettingsService ,public router: Router,public devToolsServices : AcmDevToolsServices  ) { }

  ngOnInit(): void {

    if (this.category ===  AcmConstants.LEGAL){
      this.legal =  this.sharedSecrvice.getCollection() ;
      this.itemEntity.elementId = this.legal.id ;
      this.itemEntity.category =  AcmConstants.LEGAL ;
      this.settingService.findItems(this.itemEntity).subscribe(res=>{
        res.forEach(element =>{
          element.actualStepName  = element.itemInstanceDTOs.filter(itemInstance=> itemInstance.id === element.actualStepInstance)[0].libelle
        })  ;
        this.itemEntitys = res ;
      }) ;

      let legalInstances = this.legal.collectionInstancesDtos.filter(element=>element.idAcmCollectionStep===this.legal.idAcmCollectionStep)[0] ;
      this.settingService.findWorkFlowObjects().subscribe((item) => {
      this.settingService.findGenericWFByStep(this.category, legalInstances.idAcmCollectionStep).subscribe((res) => {
        this.genericWorkFlowObjects = item.filter(objet1 =>res.some(objet2 => objet2.idGenericWorkflowObject === objet1.id));

      });
    });

    }

  }

  compareObject(d1, d2) {
    return d1.id === d2.id;
  }
  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  openLarge(content) {
    this.createForm() ;
    this.modalService.open(content, {
      size: 'lg'
    })
  }

  addGenericWorkFlow(){

    if (this.category === AcmConstants.LEGAL){
      if (this.popupForm.valid){
      this.itemEntity.elementId = this.legal.id ;
      this.itemEntity.category =  AcmConstants.LEGAL ;
      this.itemEntity.branches = this.legal.branchId.toString() ;
      this.itemEntity.genericWorkFlowObject = this.popupForm.controls.genericWorkflow.value ;

      this.settingService.createItem(this.itemEntity).subscribe(res=>{
         res.actualStepName = res.itemInstanceDTOs.filter(itemInstance=> itemInstance.id === res.actualStepInstance)[0].libelle
        this.itemEntitys.push(res);


            this.modalService.dismissAll() ;





      }) ;
    }
    }

  }

  createForm() {
    this.popupForm = this.formBuilder.group({
      genericWorkflow: [ '' , Validators.required]

    });
  }

  getDirection() {
    return AppComponent.direction;
  }

  reset() {
    this.modalService.dismissAll();
  }

  async assignItem(rowData) {
    await this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.ASSIGN_ITEM)
      .afterClosed().subscribe(res => {
        if (res) {
          this.settingService.assignItem(rowData).subscribe((data) => {
            rowData.owner = data.owner;
            rowData.ownerName = data.ownerName;
            this.devToolsServices.openToast(0, 'alert.generic_wf_assigned_successfully');
            this.sharedSecrvice.setItem(data);
            //this.router.navigate(['/acm/generic-wf-screen']) ;

          });
        }
      });
    }

  openGenericWorkflow(item: ItemEntity){
    this.settingService.finItemById(item.id).subscribe(ele=>{
      this.sharedSecrvice.setItem(ele) ;
      this.router.navigate(['/acm/generic-wf-screen']) ;


    });

  }

}
