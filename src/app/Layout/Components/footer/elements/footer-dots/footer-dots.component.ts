import {Component, OnInit} from '@angular/core';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-footer-dots',
  templateUrl: './footer-dots.component.html'
})
export class FooterDotsComponent implements OnInit {
  /**
   * constructor Footer Dots Component
   * @param library FaIconLibrary
   */
  constructor(public library: FaIconLibrary) {
  }

  ngOnInit() {
  }

}
