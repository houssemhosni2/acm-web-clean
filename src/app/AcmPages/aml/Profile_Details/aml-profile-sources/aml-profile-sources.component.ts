import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aml-profile-sources',
  templateUrl: './aml-profile-sources.component.html',
  styleUrls: ['./aml-profile-sources.component.sass']
})
export class AmlProfileSourcesComponent implements OnInit {

  @Input() sourceDescription;
  @Input() expanded;
  @Input() isdPdf;

  sourceDescriptionList: any[];

  constructor() { }

  ngOnInit(): void {

    if (this.sourceDescription) {
      if (!this.sourceDescription?.SourceDescription) {
        this.sourceDescriptionList = [this.sourceDescription]
      }
      else {
        this.sourceDescriptionList = this.sourceDescription?.SourceDescription;
      }
    }
 
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

}
