import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { CustomerNotesService } from './customer-notes.service';
import { CustomerDecisionEntity } from '../../../../shared/Entities/customerDecision.entity';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanNoteHistory } from 'src/app/shared/Entities/loan.note.history';
import {TranslateService} from '@ngx-translate/core';
import {AppComponent} from '../../../../app.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ClaimNoteEntity } from 'src/app/shared/Entities/ClaimNote.entity';
import { ClaimsEntity } from 'src/app/shared/Entities/claims.entity';
import { SettingsService } from 'src/app/AcmPages/Settings/settings.service';
const PrimaryBleu = 'var(--primary)';
const { htmlToText } = require('html-to-text');
import {checkOfflineMode, customRequiredValidator} from '../../../../shared/utils';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-customer-notes',
  templateUrl: './customer-notes.component.html',
  styleUrls: ['./customer-notes.component.sass']
})
export class CustomerNotesComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  loanNoteHistoryArray: LoanNoteHistory[] = [];
  public loading = true;
  decimalPlaces: string;
  loan: LoanEntity = new LoanEntity();
  public customerDecisionDTO: CustomerDecisionEntity = new CustomerDecisionEntity();
  public popupForm: FormGroup;
  public contactDate = new Date();
  public page: number;
  public pageSize: number;
  public claim : ClaimsEntity ;
  public claimNotesList : ClaimNoteEntity[] = [];
  customerName : string ;
  @Input() expanded;
  @Input() source;
  public res: string;
  public showNote = false;
  public points = '';
  configEditor: AngularEditorConfig = {
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
  private loadedData = false;
  /**
   * constructor
   * @param loanSharedService loanSharedService
   * @param customerNotesService  customerNotesService
   * @param modalService modalService
   * @param devToolsServices devToolsServices
   * @param formBuilder formBuilder
   * @param translate TranslateService
   */
  constructor(public loanSharedService: SharedService,
              public customerNotesService: CustomerNotesService,
              public modalService: NgbModal,private dbService: NgxIndexedDBService,
              public devToolsServices: AcmDevToolsServices,
              public formBuilder: FormBuilder, public translate: TranslateService,public settingService: SettingsService) {
  }

 async ngOnInit() {
     if (this.source==='CLAIM'){
      this.customerName =  this.loanSharedService.getClaim().customer;
      this.pageSize = 5;
      this.page = 1;
      this.claim = this.loanSharedService.getClaim().claim;
      const claimNoteEntity = new ClaimNoteEntity();
      claimNoteEntity.claimId = this.claim.id ;
     await this.settingService.getNotesByClaimId(claimNoteEntity).toPromise().then((data)=>{
       this.claimNotesList = data ;
      });
      this.loading = false;
     }
    else {
    if (this.expanded && !this.loadedData) {
    this.pageSize = 5;
    this.page = 1;
    this.loan = this.loanSharedService.getLoan();
    if (this.loan !== undefined){
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(this.loan.currencyDecimalPlaces);
    if(!checkOfflineMode()){
    const loanNoteHistory: LoanNoteHistory = new LoanNoteHistory();
    loanNoteHistory.loanDTO = this.loan;
    this.customerNotesService.getLoanHistoriqueNotesNotes(loanNoteHistory).subscribe(data => {
      this.fillNotes(data);
    });
  } else {
    this.dbService.getByKey('data', 'getLoanNotes_' + this.loan.loanId).subscribe((result:any)=>{
      if(result !== undefined){
        this.fillNotes(result.data)
      }
    })
  }
  }
    this.loadedData = true;
  }
}
  }

  fillNotes(data){
    this.loanNoteHistoryArray = data;
    this.loanNoteHistoryArray.forEach((element) => {
      const text = htmlToText(element.comments, {
        wordwrap: 130
      });
      element.convertedComments = text;
    });
    this.loading = false;
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
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
      comments: ['',customRequiredValidator],
      visibility : [false]
    });
  }

  /**
   * reset when popup closed
   */
  reset() {
    this.createForm();
    this.modalService.dismissAll();
  }

  /**
   * create note
   */
  async addNewNote() {
    if (this.source==='CLAIM'){
    const claimNoteEntity : ClaimNoteEntity = new ClaimNoteEntity();
    const text = htmlToText(this.popupForm.controls.comments.value, {
      wordwrap: 130
    });
    claimNoteEntity.comment = text;
    claimNoteEntity.visibility = this.popupForm.controls.visibility.value ? 'public' : 'private';
    claimNoteEntity.claimId = this.claim.id ;
    claimNoteEntity.insertBy = this.loanSharedService.getUser().login;
    this.settingService.createClaimNote(claimNoteEntity,this.loanSharedService.getClaim().category).subscribe((data)=>{
      this.modalService.dismissAll();
      this.ngOnInit();
    });
    }
    else{
    const customerDecisionEntity: CustomerDecisionEntity = new CustomerDecisionEntity();
    customerDecisionEntity.comments = this.popupForm.controls.comments.value;
    customerDecisionEntity.statusId = 4;
    customerDecisionEntity.idLoan = this.loan.loanId;
    customerDecisionEntity.amount = this.loan.approvelAmount;
    customerDecisionEntity.contactDate = this.contactDate;
    if(!checkOfflineMode()){
      this.customerNotesService.saveNote(customerDecisionEntity).subscribe((data) => {
       this.addSavedNote(data);
      });
    } else {
      const key =  'loanNote_' + this.loan.loanId;
      let oldNotes = await this.dbService.getByKey('notes' , key).toPromise() as any ;
      let elementNotes = [];
      if(oldNotes !== undefined){
        elementNotes = oldNotes.elementNote;
      }
      elementNotes.push(customerDecisionEntity);
      await this.dbService.update('notes', {elementId : key , elementNote : elementNotes }).subscribe(()=>{
        customerDecisionEntity.statusLibelle = 'NOTE';
        customerDecisionEntity.insertBy = this.loanSharedService.getUser().fullName;
        this.addSavedNote(customerDecisionEntity);
        this.dbService.update('data', {id:'getLoanNotes_' + this.loan.loanId , data : this.loanNoteHistoryArray}).toPromise();
        this.loading = false;
      })
    }
  }
  }

  addSavedNote(data){
    const loanNoteHistory: LoanNoteHistory = new LoanNoteHistory();
    loanNoteHistory.comments = data.comments;
    loanNoteHistory.actionDate = data.contactDate;
    loanNoteHistory.contactMethod = data.contactMethod;
    loanNoteHistory.statusId = data.statusId;
    loanNoteHistory.statusLibelle = data.statusLibelle;
    loanNoteHistory.insertBy = data.insertBy;
    loanNoteHistory.typeNote = 'NOTE';
    const text = htmlToText(loanNoteHistory.comments, {
      wordwrap: 130
    });
    loanNoteHistory.convertedComments = text;
    this.loanNoteHistoryArray.unshift(loanNoteHistory);
    this.modalService.dismissAll();
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
      comments: [showNote.comments, Validators.required]
    });
    this.modalService.open(content, {
          size: 'lg'
        }).result.then((result) => {
        });
  }
  displayClaimNote(showNote, content) {

    this.configEditor.editable = false;
    this.configEditor.showToolbar = false,
    this.configEditor.height = '18rem',
    this.showNote = true;
    this.popupForm = this.formBuilder.group({
      comments: [showNote.comment, Validators.required],
      visibility: [showNote.visibility==='public']
    });
    this.modalService.open(content, {
          size: 'lg'
        }).result.then((result) => {
        });
  }
  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }
}
