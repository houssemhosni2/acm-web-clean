import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { AcmAmlCheckEntity } from 'src/app/shared/Entities/AcmAmlCheck';
import { AcmAmlDataEntity } from 'src/app/shared/Entities/AcmAmlData';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-aml-profile-details-pdf-version',
  templateUrl: './aml-profile-details-pdf-version.component.html',
  styleUrls: ['./aml-profile-details-pdf-version.component.sass']
})
export class AmlProfileDetailsPdfVersionComponent implements OnInit {

  public amlDetails: AcmAmlDataEntity;
  public acmAmlChecksDTOs : AcmAmlCheckEntity[];

  constructor(public elementRef: ElementRef, public sharedService: SharedService) { }

  ngOnInit(): void {

    this.amlDetails = this.sharedService.getAmlDetails();
    this.acmAmlChecksDTOs = this.sharedService.getAcmAmlChecksDTOs();

  }

}
