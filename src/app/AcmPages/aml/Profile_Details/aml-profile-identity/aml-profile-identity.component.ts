import { Component, OnInit, Input } from '@angular/core';
import { AcmConstants } from 'src/app/shared/acm-constants';

@Component({
  selector: 'app-aml-profile-identity',
  templateUrl: './aml-profile-identity.component.html',
  styleUrls: ['./aml-profile-identity.component.sass']
})
export class AmlProfileIdentityComponent implements OnInit {

  @Input() iDNumberTypes;
  @Input() expanded;
  @Input() isdPdf;

  iDNumberTypesList: any[];

  constructor() { }

  ngOnInit(): void {
    
    if(this.iDNumberTypes){
      if(!this.iDNumberTypes?.IDNumberTypes){
        this.iDNumberTypesList = [this.iDNumberTypes?.ID]
      }
      else {
        this.iDNumberTypesList = this.iDNumberTypes?.IDNumberTypes;
      }
    }

    if(this.iDNumberTypesList){
      this.iDNumberTypesList = this.iDNumberTypesList.filter((item) => item?.IDType === AcmConstants.AML_NATIONAL_ID_TYPE_NAME || item?.IDType === AcmConstants.AML_PASSPORT_NO_TYPE_NAME);
    }
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

}
