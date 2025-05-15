import { Injectable } from '@angular/core';
import { LazyMapsAPILoaderConfigLiteral } from '@agm/core';
import { CustomerManagementService } from '../AcmPages/Customer/customer-management/customer-management.service';
import { checkOfflineMode } from './utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmDevToolsServices } from './acm-dev-tools.services';

@Injectable()
export class MapsConfig implements LazyMapsAPILoaderConfigLiteral {
  public apiKey: string;
  public libraries: string[];
  constructor(private customerManagementService: CustomerManagementService, public devToolsServices: AcmDevToolsServices,
    private dbService: NgxIndexedDBService) {
    if (checkOfflineMode()) {
      this.dbService.getByKey('data', 'google-maps-keys').subscribe((key: any) => {
        if (key === undefined) {
          this.devToolsServices.openToast(3, `No google map keys saved for offline use`);
        } else {
          this.apiKey = key.data.value;
        }
      });
    } else {
      this.customerManagementService.getEnvirementValueByKey('GOOGLE_MAPS_KEY').toPromise().then((key) => {
        this.apiKey = key.value;
      });
    }

    this.libraries = ['places'];
  }
}
