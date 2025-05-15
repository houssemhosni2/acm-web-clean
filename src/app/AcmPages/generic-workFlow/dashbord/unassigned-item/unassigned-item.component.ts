import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { ItemRequestPagination } from 'src/app/shared/Entities/itemRequestPagination.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
const PrimaryBleu = 'var(--primary)';


@Component({
  selector: 'app-unassigned-item',
  templateUrl: './unassigned-item.component.html',
  styleUrls: ['./unassigned-item.component.sass']
})
export class UnassignedItemComponent implements OnInit {

  public itemRequestEntityList: ItemRequestPagination = new ItemRequestPagination();
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public count: ItemRequestPagination = new ItemRequestPagination();
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  sourceParam : string ;
  constructor(public settingService  : SettingsService ,public route :ActivatedRoute ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.sourceParam = params['source'];
      const itemParam = new ItemEntity();
      //itemParam.status = 8 ;
      if (this.sourceParam ===AcmConstants.AML_STATUS){
        itemParam.category = AcmConstants.AML_DOUBTFUL+","+AcmConstants.AML_CHECK ;
      this.loadItemByPagination(itemParam, 0, 10);
    }else{
      this.loadItemByPagination(itemParam, 0, 10);

    }

    });


  }


  async loadItemByPagination(itemEntityRequest: ItemEntity, page: number, pageSize: number) {
    const itemRequestPagination: ItemRequestPagination = new ItemRequestPagination();
    itemRequestPagination.params = itemEntityRequest;
    itemRequestPagination.pageSize = pageSize;
    itemRequestPagination.pageNumber = page;
    if (this.sourceParam ===AcmConstants.AML_STATUS){
      itemRequestPagination.params.category =AcmConstants.AML_DOUBTFUL+","+AcmConstants.AML_CHECK ;;
 }
    await this.settingService.findUnassignedItemPagination(itemRequestPagination).subscribe((data) => {
      this.itemRequestEntityList = data;
    });
  }


}
