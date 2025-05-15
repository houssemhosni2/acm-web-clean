import { Component, OnInit, Input } from '@angular/core';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { PdfService } from '../pdf.service';
import { AmlProfileDetailsPdfVersionComponent } from '../aml-profile-details-pdf-version/aml-profile-details-pdf-version.component';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
@Component({
  selector: 'app-aml-profile-informtion',
  templateUrl: './aml-profile-informtion.component.html',
  styleUrls: ['./aml-profile-informtion.component.sass']
})
export class AmlProfileInformtionComponent implements OnInit {

  @Input() nameDetails;
  @Input() type;
  @Input() gender;
  @Input() descriptions;
  @Input() dateDetails;
  @Input() images;
  @Input() isdPdf;

  primaryName: any;
  birthDate: any;
  image: any = '../../../../assets/images/avatars/user.jpg';
  color = 'primary';
  modeSpinner = 'indeterminate';
  value = 50000;

  pdfLoad: boolean = false;
  constructor(private pdfService: PdfService, public devToolsServices: AcmDevToolsServices) {

  }


  ngOnInit() {
    if (this.nameDetails) {
      if (this.nameDetails?.Name) {
        this.nameDetails = [this.nameDetails?.Name];
      }
      else {
        this.nameDetails = this.nameDetails?.NameDetails;
      }
      this.primaryName = this.nameDetails?.filter((item) => item.NameType === AcmConstants.AML_PRIMARY_NAME_TYPE)[0];
    }
    if (this.dateDetails) {
      if (this.dateDetails?.Date) {
        this.dateDetails = [this.dateDetails?.Date];

      }
      else {
        this.dateDetails = this.dateDetails?.DateDetails;
      }
      this.birthDate = this.dateDetails?.filter((item) => item.DateType === AcmConstants.AML_BIRTH_DATE_TYPE)[0];
    }
    if(this.images){
      if(this.images?.Images){
        const image = this.images?.Images.find(image => 
          image.URL.trim().endsWith('.jpg') || image.URL.trim().endsWith('.png')
        );
      
        // Return the found image URL, or the first URL if none match the criteria
        this.image = image ? image.URL : this.images[0].URL;
      }
      else {
        if (this.images?.URL) {
          this.image = this.images?.URL;
        }
      }
    }
  
  }

  async generatePDF() {
    this.pdfLoad = true;
    await this.pdfService.generatePDF(AmlProfileDetailsPdfVersionComponent);
    this.pdfLoad = false;
    this.devToolsServices.openToast(0, 'alert.document_uploaded');
  }

}
