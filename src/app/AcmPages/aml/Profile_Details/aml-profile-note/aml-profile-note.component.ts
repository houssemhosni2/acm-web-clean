import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-aml-profile-note',
  templateUrl: './aml-profile-note.component.html',
  styleUrls: ['./aml-profile-note.component.sass']
})
export class AmlProfileNoteComponent implements OnInit {

  @Input() profileNotes;
  @Input() expanded;
  @Input() isdPdf;

  constructor() { }

  ngOnInit(): void {
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }
}
