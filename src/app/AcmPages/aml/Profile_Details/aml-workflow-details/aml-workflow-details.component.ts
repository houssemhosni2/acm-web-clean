import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemEntity } from "src/app/shared/Entities/Item.entity";
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AcmDevToolsServices } from "src/app/shared/acm-dev-tools.services";
@Component({
  selector: 'app-aml-workflow-details',
  templateUrl: './aml-workflow-details.component.html',
  styleUrls: ['./aml-workflow-details.component.sass']
})
export class AmlWorkflowDetailsComponent implements OnInit {

  @Input() acmAmlChecksDTOs;
  @Input() isdPdf;
  @Output() dismissModal = new EventEmitter<string>();
  items: ItemEntity[] = [];

  constructor(public settingsService: SettingsService, public sharedService: SharedService,
    public router: Router, public modalService: NgbModal, public devToolsServices: AcmDevToolsServices
  ) { }

  ngOnInit(): void {

    if (this.acmAmlChecksDTOs) {

      this.acmAmlChecksDTOs = this.acmAmlChecksDTOs.filter((item) => item.idAmlData !== null)

      this.acmAmlChecksDTOs.forEach(async (amlCheck) => {
        const item = new ItemEntity();
        item.elementId = amlCheck.id;
        item.category = AcmConstants.AML_CHECK;
        await this.settingsService.findItems(item).subscribe((res) => {
          for (const elem of res) {
            elem.actualStepName = elem.itemInstanceDTOs.filter(itemInstance => elem.actualStep == itemInstance.idWorkFlowStep)[0].libelle;
            if (amlCheck.amlStatus === 'CLEARED') {
              elem.amlStatus = "Not " + amlCheck.listName;
            }
            else if (amlCheck.amlStatus === 'FLAGGED') {
              elem.amlStatus = "Confirmed " + amlCheck.listName;
            }
            else if (amlCheck.amlStatus === 'PENDING') {
              elem.amlStatus = "Pending " + amlCheck.listName;
            }
            elem.amlCheck = amlCheck;

            this.items.push(elem);

          }
        });
      })
    }
  }


  itemDetails(item) {
    this.sharedService.setAcmAmlCheck(item.amlCheck);
    this.sharedService.setItem(item);
    this.router.navigate(['/acm/generic-wf-screen'], { queryParams: { source: 'SCAN' } });
    this.dismissModal.emit("0");
  }


  async assignItem(rowData) {
    this.dismissModal.emit("0");
    await this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.' + AcmConstants.ASSIGN_ITEM)
      .afterClosed().subscribe(res => {
        if (res) {
          this.settingsService.assignItem(rowData).subscribe((data) => {
            rowData.owner = data.owner;
            rowData.ownerName = data.ownerName;
            this.devToolsServices.openToast(0, 'alert.generic_wf_assigned_successfully');
            this.sharedService.setItem(data);
            this.router.navigate(['/acm/generic-wf-screen'], { queryParams: { source: 'SCAN' } });

          });
        }
      });
  }

}
