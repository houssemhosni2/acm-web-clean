import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { ItemProcessEntity } from 'src/app/shared/Entities/Item.process.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-item-process',
  templateUrl: './item-process.component.html',
  styleUrls: ['./item-process.component.sass']
})
export class ItemProcessComponent implements OnInit {
  public item: ItemEntity = new ItemEntity();
  public itemProcessEntitys: ItemProcessEntity[] = [];
  public orderProcess: number;
  public date = new Date();
  constructor(public sharedService: SharedService, public devToolsServices: AcmDevToolsServices, public translate: TranslateService) { }

  ngOnInit(): void {

    this.item = this.sharedService.getItem();
    this.itemProcessEntitys = this.item.itemInstanceDTOs.sort((p1, p2) => p1.orderEtapeProcess - p2.orderEtapeProcess);
    this.itemProcessEntitys.forEach(element => {
      if (element.id === this.item.actualStepInstance) {
        this.orderProcess = element.orderEtapeProcess;
      }
    });
  }

}
