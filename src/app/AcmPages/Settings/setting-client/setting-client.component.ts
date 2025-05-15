import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { AcmDocumentsGedEntity } from 'src/app/shared/Entities/acmDocumentsGed.entity';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { GedServiceService } from '../../GED/ged-service.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-setting-client',
  templateUrl: './setting-client.component.html',
  styleUrls: ['./setting-client.component.sass']
})
export class SettingClientComponent implements OnInit {
  public customer: CustomerEntity = new CustomerEntity();
  image: any = '../../../../assets/images/avatars/user.jpg';
  public imageClient = '';
  public clientDocument: AcmDocumentsGedEntity = new AcmDocumentsGedEntity();
  public newPhoto: any;
  /**
   *
   * @param loanSharedService SharedService
   * @param gedService GedServiceService
   * @param sanitizer DomSanitizer
   * @param devToolsServices AcmDevToolsServices
   */
  constructor(public settingsService: SettingsService, public loanSharedService: SharedService, public gedService: GedServiceService,
              public sanitizer: DomSanitizer, public devToolsServices: AcmDevToolsServices) { }

  ngOnInit() {

    this.clientDocument.idDocument = 0;
    // get customer photo
    this.settingsService.getClientPhoto(this.clientDocument.idDocument).subscribe(
      (photo) => {
        if (photo.size > 0) {
          const fileData = [photo];
          const blob = new Blob(fileData, { type: '' });
          const objectURL = URL.createObjectURL(blob);
          this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        } else {
          this.image = '../../../../assets/images/avatars/user.jpg';
        }
    });
  }

  /**
   * add the Image Client
   * @param event event
   */
  addImageClient(event) {
    const file: any[] = [];
    file.push(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (e) => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;
          if (width > 150 || height > 150) {
            this.devToolsServices.openToast(3, 'alert.size_image');
            return;
          }
          this.clientDocument.idCustomer = 0;
          this.clientDocument.loanId = 0;
          this.clientDocument.idDocument = 0;
          this.settingsService.updateClientPhoto(file, this.clientDocument).subscribe(
            (newPhoto) => {
              const fileData = [newPhoto];
              const blob = new Blob(fileData, { type: '' });
              const objectURL = URL.createObjectURL(blob);
              this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            }
          );
        };
      };
    }
  }
}
