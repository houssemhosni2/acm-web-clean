import { Component, OnInit } from '@angular/core';
import { CustomerManagementService } from 'src/app/AcmPages/Customer/customer-management/customer-management.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { checkOfflineMode } from 'src/app/shared/utils';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  public copyrights = '';
  public isLoaded: boolean;
  constructor(public customerManagementService: CustomerManagementService) {
    this.isLoaded = false;
  }

  ngOnInit() {
    const environnements = AcmConstants.COPYRIGHTS;
    if (!checkOfflineMode()) {
      this.customerManagementService.getEnvirementValueByKey(environnements).subscribe((data) => {
        this.copyrights = data.value;
        this.isLoaded = true;
      });
    }

  }

}
