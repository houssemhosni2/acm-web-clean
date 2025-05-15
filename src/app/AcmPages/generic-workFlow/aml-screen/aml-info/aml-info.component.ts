import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
@Component({
  selector: 'app-aml-info',
  templateUrl: './aml-info.component.html',
  styleUrls: ['./aml-info.component.sass']
})
export class AmlInfoComponent implements OnInit {
  @Input() expanded;
  @Input() amlData;
  @Input() amlCheck;
  date: Date;
  constructor(public sharedService : SharedService) { }

  ngOnInit(): void {
    this.date = new Date();
    this.sharedService.setAmlDetails(this.amlData);
    
    this.sharedService.setAcmAmlChecksDTOs(null);
  }
  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }
}
