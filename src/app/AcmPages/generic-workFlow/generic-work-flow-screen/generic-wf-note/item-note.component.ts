import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { Subject } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { SharedService } from 'src/app/shared/shared.service';
import { GenericWorkFlowService } from '../../generic-workflow.service';
import { ItemEntity } from 'src/app/shared/Entities/Item.entity';
import { ItemNoteEntity } from 'src/app/shared/Entities/ItemNote.entity';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';

const PrimaryBleu = 'var(--primary)';
 @Component({
  selector: 'app-item-note',
  templateUrl: './item-note.component.html',
  styleUrls: ['./item-note.component.sass']
})
export class ItemNoteComponent implements OnInit {
  @Input() itemId;
  @Input() expanded;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public filtersLoaded = new Subject<boolean>();
  public item: ItemEntity;
  public popupForm: FormGroup;
  public showNote = false;
  public loading = true;
  public arrayItemNote: ItemNoteEntity[] = [];
  public page: number;
  public pageSize: number;
  public date = new Date();
  configEditor: AngularEditorConfig ={
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    translate: 'no',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };
  public contactDate = new Date();
  constructor(public modalService: NgbModal, public formBuilder: FormBuilder,
    private genericWorkFlowService: GenericWorkFlowService,public acmDevToolsServices :  AcmDevToolsServices ,
    public translate: TranslateService, private sharedService: SharedService) { }

 async ngOnInit() {
  this.pageSize = 10;
  this.page = 1;
    this.item = this.sharedService.getItem();
    const itemWf = new ItemNoteEntity();
    itemWf.itemId = this.item.id;

   await this.genericWorkFlowService.getItemNotes(itemWf).toPromise().then((data) => {
      this.arrayItemNote = data;
    });
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }
  toggleCollapse() {
    this.expanded = !this.expanded;
  }
  /**
   * methode to open the popup create new
   * param content
   */
  openLarge(content) {
    this.configEditor.editable = true;
    this.configEditor.showToolbar = true,
      this.configEditor.height = '15rem',
      this.createForm();
    this.modalService.open(content, {
      size: 'lg'
    }).result.then((result) => {
    });
  }
/**
 * Methode to create form popup
 * @param comments comments
 */
  createForm() {
    this.popupForm = this.formBuilder.group({
      comments: [ '',Validators.required]

    });
  }
/**
 *
 * @param showNote showNote
 * @param content content
 */
  displayNote(showNote, content) {
    this.configEditor.editable = false;
    this.configEditor.showToolbar = false,
      this.configEditor.height = '18rem',
      this.showNote = true;
    this.popupForm = this.formBuilder.group({
      comments: [showNote.comment, Validators.required]
    });
    this.modalService.open(content, {
      size: 'lg'
    }).result.then((result) => {
    });
  }

/**
 * create note
 */
  addNewNote() {
    this.acmDevToolsServices.makeFormAsTouched(this.popupForm) ;
    if (this.popupForm.valid){
    const note: ItemNoteEntity = new ItemNoteEntity();
    note.comment = this.popupForm.controls.comments.value;
    note.action = this.item.itemInstanceDTOs.filter(element=>element.id === this.item.actualStepInstance)[0].libelle;
    note.itemId = this.item.id;
    note.insertBy = this.sharedService.getUser().login;
    this.genericWorkFlowService.createItemNotes(note).subscribe((data) => {
    this.arrayItemNote.unshift(data);
    this.modalService.dismissAll();
    });
  }
  }
/**
 * Methode reset
 */
  reset() {
    this.popupForm.reset();
    this.modalService.dismissAll();
  }

  /** display comment of loanNoteHistory in case of break sentences */
  displayComment(value : string) : string{
    if (value.includes('<div>')){
    return value.substring(0, value.indexOf('<div>')) + ' ...';
    }else  {
      if (value.length>=50){
        return value.substring(0,50) + ' ...'
      }else {return value;}
    }
  }

}
