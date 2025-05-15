import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanEntity } from '../../../../shared/Entities/loan.entity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportVisitEntity } from '../../../../shared/Entities/reportVisit.entity';
import { VisitReportServices } from './visit-report.services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SharedService } from 'src/app/shared/shared.service';
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmDevToolsServices } from '../../../../shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-visit-report',
  templateUrl: './visit-report.component.html',
  styleUrls: ['./visit-report.component.sass']
})
export class VisitReportComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public loading = true;
  public loan: LoanEntity = new LoanEntity();
  public reportForm: FormGroup;
  public reportVisitEntity: ReportVisitEntity = new ReportVisitEntity();
  public reportVisitEntitys: ReportVisitEntity[] = [];
  public htmlContent: string;
  public block = false;
  public page: number;
  public pageSize: number;
  public userToInsert = '';
  public editorContent: string;
  users: Array<any> = [];
  public selectUser: Array<any> = [];
  dropdownSettings: IDropdownSettings = {};
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
  public datePlannedVisit = new Date().toISOString().substring(0, 10);
  @Input() expanded;

  /**
   * constructor
   * @param ActivatedRoute  ActivatedRoute
   * @param FormBuilder formBuilder
   * @param VisitReportServices visitReportServices
   * @param LoanSharedService loanSharedService
   * @param DatePipe datepipe
   * @param AcmDevToolsServices devToolsServices
   * @param TranslateService translate
   */
  constructor(public route: ActivatedRoute, public formBuilder: FormBuilder,
              public visitReportServices: VisitReportServices, public loanSharedService: SharedService,
              public datepipe: DatePipe,
              public devToolsServices: AcmDevToolsServices,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.pageSize = 5;
    this.page = 1;
    this.loan = this.loanSharedService.getLoan();
    this.users = this.loanSharedService.getUsers();
    this.reportVisitEntity.idLoan = this.loan.loanId;
    this.loanSharedService.setCheckPrevious(false);
    this.createForm();
    this.visitReportServices.getVisitReport(this.reportVisitEntity).subscribe(
      (data) => {
        // setting loan details
        if (data.length > 0) {
          this.reportVisitEntitys = data;
          if (this.reportVisitEntitys[this.reportVisitEntitys.length - 1].visitBy !== '') {
            for (let i = 0; i < this.reportVisitEntitys[this.reportVisitEntitys.length - 1].visitBy.split(',').length; i++) {
              if (this.users.findIndex(obj => obj.item_text === this.reportVisitEntitys[this.reportVisitEntitys.length - 1].visitBy
                .split(',')[i]) > -1) {
                this.selectUser.push(this.users[this.users.findIndex(obj => obj.item_text ===
                  this.reportVisitEntitys[this.reportVisitEntitys.length - 1].visitBy.split(',')[i])]);
              }
            }
            this.reportForm.controls.visitBy.setValue(this.selectUser);
          } else {
            this.selectUser = [];
            this.reportForm.controls.visitBy.setValue('');
          }
          this.reportForm.controls.plannedVisit.setValue(this.datePlannedVisit);
          this.reportForm.controls.report.setValue(this.reportVisitEntitys[this.reportVisitEntitys.length - 1].description);
          this.editorContent = this.reportVisitEntitys[this.reportVisitEntitys.length - 1].description;
          this.reportForm.controls.comment.setValue(this.reportVisitEntitys[this.reportVisitEntitys.length - 1].comment);
        } else {
          this.editorContent = '';
        }
        this.loading = false;
      }
    );
    this.dropdownSettings = {
      singleSelection: false,
      defaultOpen: false,
      idField: 'item_id',
      textField: 'item_full_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableCheckAll: true,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  /**
   * Methode to create form
   * @param plannedVisit plannedVisit
   * @param report report
   * @param comment comment
   * @param visitBy visitBy
   */
  createForm() {
    this.reportForm = this.formBuilder.group({
      plannedVisit: ['', Validators.required],
      report: ['', Validators.required],
      comment: [''],
      visitBy: [this.selectUser, Validators.required]
    });
  }

  /**
   * Methode to submit after validation form
   */
  onSubmit() {
    if (this.reportForm.valid) {
      this.devToolsServices.openConfirmDialogWithoutRedirect('confirmation_dialog.field_visit').afterClosed().subscribe(res => {
        if (res) {
          this.save();
        }
      });
      this.loanSharedService.setCheckPrevious(false);
    }
  }

  /**
   * Methode to save
   */
  async save() {
    this.reportVisitEntity.idReportVisit = null;
    this.reportVisitEntity.plannedVisit = this.reportForm.value.plannedVisit;
    this.reportVisitEntity.comment = this.reportForm.value.comment;
    this.reportVisitEntity.description = this.htmlContent;
    this.reportVisitEntity.idLoan = this.loan.loanId;
    this.reportVisitEntity.visitBy = this.userToInsert.substring(0, this.userToInsert.length - 1);
    await this.visitReportServices.saveVisitReport(this.reportVisitEntity).toPromise().then(
      (data) => {
        this.reportVisitEntitys.push(data);
        this.devToolsServices.openToast(0, 'alert.save');
      }
    );
    this.reportForm.reset();

  }

  /**
   * Methode to edit
   */
  edit(reportVisitEntity: ReportVisitEntity) {
    this.configEditor.editable = true;
    this.selectUser = [];
    this.block = false;
    if (reportVisitEntity.visitBy !== '') {
      for (let i = 0; i < reportVisitEntity.visitBy.split(',').length; i++) {
        if (this.users.findIndex(obj => obj.item_text === reportVisitEntity.visitBy.split(',')[i]) > -1) {
          this.selectUser.push(this.users[this.users.findIndex(obj => obj.item_text === reportVisitEntity.visitBy.split(',')[i])]);
        }
      }
    } else {
      this.selectUser = [];
    }
    this.reportForm.controls.visitBy.setValue(this.selectUser);
    this.reportForm.controls.plannedVisit.setValue(reportVisitEntity.plannedVisit.substring(0, 10));
    this.reportForm.controls.report.setValue(reportVisitEntity.description);
    this.reportForm.controls.comment.setValue(reportVisitEntity.comment);
    this.loading = false;
  }

  /**
   * Methode to view
   */
  view(reportVisitEntity: ReportVisitEntity) {
    this.configEditor.editable = false;
    this.selectUser = [];
    this.block = true;
    this.reportForm.get('visitBy').disable();
    if (reportVisitEntity.visitBy !== '') {
      for (let i = 0; i < reportVisitEntity.visitBy.split(',').length; i++) {
        if (this.users.findIndex(obj => obj.item_text === reportVisitEntity.visitBy.split(',')[i]) > -1) {
          this.selectUser.push(this.users[this.users.findIndex(obj => obj.item_text === reportVisitEntity.visitBy.split(',')[i])]);
        }
      }
    } else {
      this.selectUser = [];
    }
    this.reportForm.controls.visitBy.setValue(this.selectUser);
    this.reportForm.controls.plannedVisit.setValue(reportVisitEntity.plannedVisit.substring(0, 10));
    this.reportForm.controls.report.setValue(reportVisitEntity.description);
    this.reportForm.controls.comment.setValue(reportVisitEntity.comment);
    this.loading = false;
  }

  /**
   * Methode to reset
   */
  reset() {
    this.block = false;
    this.configEditor.editable = true;
  }

  /**
   * Methode to onItemSelect user
   */
  onItemSelect(item: any) {
    this.userToInsert = this.userToInsert + item.item_text.concat(',');
    this.onChange(true);
  }

  /**
   * Methode to onItemDeSelect user
   */
  onItemDeSelect(item: any) {
    this.onChange(true);
    try {
      this.userToInsert = this.userToInsert.replace(item.item_text + ',', '');
    } catch (error) {
      this.userToInsert = this.userToInsert.replace(item.item_text, '');
    }
  }

  /**
   * Methode to onSelectAll users
   */
  onSelectAll(items: any) {
    this.onChange(true);
    const selectStr = JSON.stringify(items);
    JSON.parse(selectStr, (key, value) => {
      if (typeof value === 'string') {
        this.userToInsert = this.userToInsert + value.concat(',');
      }
    });
  }

  /**
   * Methode to onSelectAll users
   */
  onDeSelectAll(items: any) {
    this.userToInsert = '';
  }

  /**
   * Methode to onDropDownClose
   */
  onDropDownClose() {
    close();
  }
  /**
   *
   * @param event event
   */
  editorChange(event) {
    if (this.editorContent !== undefined) {
    if (event !== this.editorContent) {
      this.loanSharedService.setCheckPrevious(true);
    } else {
      this.loanSharedService.setCheckPrevious(false);
    }}
  }
  onChange(value) {
    this.loanSharedService.setCheckPrevious(true);
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }
}
