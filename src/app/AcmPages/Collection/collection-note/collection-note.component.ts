import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { Subject } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionNoteEntity } from 'src/app/shared/Entities/CollectionNote.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { CollectionServices } from '../collection.services';
import {checkOfflineMode, customRequiredValidator} from '../../../shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ActivatedRoute } from '@angular/router';

const PrimaryBleu = 'var(--primary)';
 @Component({
  selector: 'app-collection-note',
  templateUrl: './collection-note.component.html',
  styleUrls: ['./collection-note.component.sass']
})
export class CollectionNoteComponent implements OnInit {
  @Input() collectionId;
  @Input() category;
  @Input() showAddButton;
  @Input() expanded;
  source :string;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  public filtersLoaded = new Subject<boolean>();
  public collection: CollectionEntity;
  public popupForm: FormGroup;
  public showNote = false;
  public loading = true;
  public collectionNoteHistoryArray: CollectionNoteEntity[] = [];
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
  constructor(public modalService: NgbModal, public formBuilder: FormBuilder,private dbService: NgxIndexedDBService, private collectionServices: CollectionServices,
    public translate: TranslateService, private sharedService: SharedService, public devToolsServices: AcmDevToolsServices ,public activatedRoute: ActivatedRoute) { }

 async ngOnInit() {
  await this.activatedRoute.queryParams.subscribe((params) => {
    this.source = params.source;
  });
  this.pageSize = 10;
  this.page = 1;
    this.collection = this.sharedService.getCollection();
    if(checkOfflineMode() || this.source ==='preview'){
      const key = 'getCollectionNoteByCollectionId_' + this.collection.id ;
      this.dbService.getByKey('data', key).subscribe((collectionNotes: any) => {
        if (collectionNotes === undefined) {
          this.devToolsServices.openToast(3, 'No collection notes saved for offline use');
        } else {
          this.collectionNoteHistoryArray = collectionNotes.data;
        }
      });
    }
    else {
    const c = new CollectionNoteEntity();
    c.collectionId = this.collectionId;

   await this.collectionServices.getCollectionNotes(c).toPromise().then((data) => {
      this.collectionNoteHistoryArray = data;
    });
  }
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
    this.showNote = false;
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
      comments: ['', customRequiredValidator]

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
      comments: [showNote.comment, customRequiredValidator]
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
    const note: CollectionNoteEntity = new CollectionNoteEntity();
    note.comment = this.popupForm.controls.comments.value;
    note.action = this.collection.pendingCollectionInstance.libelle;
    note.collectionId = this.collection.id;
    note.insertBy = this.sharedService.getUser().login;
    if(!checkOfflineMode()){
    this.collectionServices.createNewCollectionNote(note).subscribe((data) => {
    this.collectionNoteHistoryArray.unshift(data);
    this.modalService.dismissAll();
    });
  }
  else {
    note.dateInsertion = new Date();
    this.collectionNoteHistoryArray.unshift(note);
    this.dbService.update('notes', {elementId : 'collectionNote_' + note.collectionId , elementNote : this.collectionNoteHistoryArray }).toPromise().then(()=>{
      this.modalService.dismissAll();
      this.dbService.update('data', {id:'getCollectionNoteByCollectionId_' + this.collection.id , data : this.collectionNoteHistoryArray}).toPromise();
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
