import {Component, OnInit} from '@angular/core';
import {IScoreService} from './i-score.service';

@Component({
  selector: 'app-i-score',
  templateUrl: './i-score.component.html',
  styleUrls: ['./i-score.component.sass']
})
export class IScoreComponent implements OnInit {

  /**
   * constructor
   * @param iScoreService IScoreService
   */
  constructor(public iScoreService: IScoreService) {
  }

  ngOnInit() {
  }

  generateFile() {
    this.iScoreService.generateFile('','').subscribe(
      (data) => {
        const fileData = [data];
        const blob = new Blob(fileData, { type: 'application/dlt' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'i-score.dlt';
        anchor.href = url;
        anchor.click();      }
    );
  }
}
