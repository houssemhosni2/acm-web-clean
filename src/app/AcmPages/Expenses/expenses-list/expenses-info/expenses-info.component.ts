import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LoanDetailsServices } from 'src/app/AcmPages/Loan-Application/loan-details/loan-details.services';
import { AppComponent } from 'src/app/app.component';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { ExpensesEntity } from 'src/app/shared/Entities/expenses.entity';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ExpensesListService } from '../expenses-list.service';
import {DomSanitizer} from '@angular/platform-browser';
import { LoanDocumentEntity } from 'src/app/shared/Entities/loanDocument.entity';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { GedServiceService } from 'src/app/AcmPages/GED/ged-service.service';

@Component({
  selector: 'app-expenses-info',
  templateUrl: './expenses-info.component.html',
  styleUrls: ['./expenses-info.component.sass']
})
export class ExpensesInfoComponent implements OnInit {
  public rejectForm: FormGroup;
  public confirm = false;
  public confirmReject: boolean;
  public expenses: ExpensesEntity = new ExpensesEntity();
  public expensesStatus : number;
  public reject: boolean;
  public settingMotifReviewEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifReviewEntitys = [];
  public image: any;
  public expensesDocument: LoanDocumentEntity = new LoanDocumentEntity();
  public currentPath = 'expenses-info';
  public decimalPlaces: string;

  /**
   *
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param modalService NgbModal
   * @param router Router
   * @param translate TranslateService
   * @param sharedService SharedService
   * @param expensesListServices ExpensesListService
   * @param acmDevToolsServices AcmDevToolsServices
   * @param loanDetailsServices LoanDetailsServices
   * @param gedService GedServiceService
   */
  constructor(private devToolsServices: AcmDevToolsServices, private formBuilder: FormBuilder,
              private modalService: NgbModal, private router: Router,
              private translate: TranslateService, public sharedService: SharedService,
              private expensesListServices: ExpensesListService, private acmDevToolsServices: AcmDevToolsServices,
              private loanDetailsServices: LoanDetailsServices, private gedService: GedServiceService, private sanitizer: DomSanitizer,
              private authService: AuthentificationService) { }

  ngOnInit() {
    this.reject = false;
    this.expensesStatus = this.sharedService.getExpenses().statut;
    this.expenses =  this.sharedService.getExpenses();
    this.getExpensesDocument(this.expenses);
    this.decimalPlaces = this.devToolsServices.getDecimalPlaces(3);
  }
  /**
   * get expenses document
   * @param expenses ExpensesEntity
   */
    async getExpensesDocument(expenses) {
      const document: LoanDocumentEntity = new LoanDocumentEntity();
      document.expensesId = expenses.id,
      await this.gedService.getDocumentsByExpensesId(document).subscribe((value1) => {
        this.expensesDocument = value1[0];
      });
    }
  /**
   * update expenses status
   * @param value reject/accept
   */
  submitExpenses(value) {
    if (value === AcmConstants.REJECT_CATEGORIE) {
      this.acmDevToolsServices.makeFormAsTouched(this.rejectForm);
      if (this.rejectForm.valid) {
        this.expenses.statut =  -1;
        this.expenses.note = this.rejectForm.controls.reason.value.libelle + ' : ' + this.rejectForm.controls.note.value ;
      } else {
        return;
      }
    } else if (value === AcmConstants.ACCEPT_BUTTON) {
      this.expenses.statut =  1;
    }
    this.expensesListServices.updateExpenses(this.expenses).subscribe(
          (data) => {
            this.router.navigate([AcmConstants.EXPENSES_LIST]);
            this.modalService.dismissAll();
            this.expensesStatus = this.expenses.statut;
          });
  }

  /**
   * create reject form
   */
  createForm() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required],
      note: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }

  /**
   * open reject modal
   * @param rejectModal rejectModal
   */
   async rejectModal(rejectModalContent) {
    this.createForm();

    this.reject = true;
    this.modalService.open(rejectModalContent, {
      size: 'md'
    });
    this.settingMotifReviewEntity.categorie = AcmConstants.REJECT_EXPENSES;
    await this.loanDetailsServices.getReason(this.settingMotifReviewEntity).toPromise().then(
      (data) => {
        this.settingMotifReviewEntitys = data;
      }
    );
  }
  /**
   * exit
   */
  exit() {
    this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.EXPENSES_LIST);
  }
  /**
   * Get Direction
   */
   getDirection() {
    return AppComponent.direction;
  }

  getDocument() {
    const tag = 'EXPENSES_' + this.expenses.id;
    const arrayTags = {
      tags: [tag]
    };
    this.gedService.getDocumentsByTags(arrayTags).subscribe((values) => {
      if (values.length !== 0) {
        const documentType = values[0].mimeType;
        this.gedService.getDocument(values[0].id).subscribe(
          (res: any) => {
            const fileData = [res];
            const blob = new Blob(fileData, {type: documentType});
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
          }
        );
      }
    });
  }
}
