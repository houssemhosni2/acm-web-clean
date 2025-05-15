import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingMotifRejetsEntity } from 'src/app/shared/Entities/settingMotifRejets.entity';
import { HabilitationEntity } from 'src/app/shared/Entities/habilitation.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { LoanProcessEntity } from 'src/app/shared/Entities/loan.process.entity';
import { LoanDetailsServices } from '../loan-details/loan-details.services';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/shared.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { LoanPaginationEntity } from 'src/app/shared/Entities/loan.pagination.entity';
import { LoanStatutEntity } from 'src/app/shared/Entities/loan.statut.entity';
import { SelectItem } from 'primeng/api';
import { DashbordServices } from '../dashbord/dashbord.services';
import { LoanApprovalService } from '../loan-approval/loan-approval.service';
import { ProductEntity } from 'src/app/shared/Entities/product.entity';
import { LoanProcessComponent } from '../loan-process/loan-process.component';
import { AuthentificationService } from 'src/app/shared/authentification/authentification.service';
import { UserEntity } from 'src/app/shared/Entities/user.entity';
import { CustomerNotesComponent } from '../loan-approval/customer-notes/customer-notes.component';
import { GedServiceService } from '../../GED/ged-service.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-customer-groupe',
  templateUrl: './customer-groupe.component.html',
  styleUrls: ['./customer-groupe.component.sass']
})
export class CustomerGroupeComponent implements OnInit {

  idloan: string;
  public sub: any;
  public loan: LoanEntity = new LoanEntity();
  public loanACM: LoanEntity = new LoanEntity();
  public page: number;
  public pageSize: number;
  public rejectForm: FormGroup;
  public reviewForm: FormGroup;
  public recommandForm: FormGroup;
  public declineForm: FormGroup;
  public agreeForm: FormGroup;
  public approveForm: FormGroup;
  public settingMotifRejetsEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifReviewEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifRecommendEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifDeclineEntity: SettingMotifRejetsEntity = new SettingMotifRejetsEntity();
  public settingMotifRejetsEntitys = [];
  public settingMotifReviewEntitys = [];
  public settingMotifRecommendEntitys = [];
  public settingMotifDeclineEntitys = [];
  public confirm = false;
  public currentStatus: number;
  public userHabilitations: HabilitationEntity[] = [];
  public checkButtonHabilitation: boolean;
  public currentPath = AcmConstants.CUSTOMER_GROUPE_URL;
  public loanProcessEntitys: LoanProcessEntity[] = [];
  public orderProcess: number;
  public toBeReviewForm: FormGroup;
  public contactDate = new Date();
  public loanPaginationEntity: LoanPaginationEntity = new LoanPaginationEntity();
  public loansStatut: LoanStatutEntity = new LoanStatutEntity();
  public status: SelectItem[];
  public products: SelectItem[];
  public customerType: string;
  public checkModalReject: boolean;
  public checkModalRecommend: boolean;
  public checkModalDecline: boolean;
  public confirmDecline: boolean;
  public confirmReject: boolean;
  public confirmReview: boolean;
  public confirmRecommend: boolean;
  public product: ProductEntity;
  public loans = [];
  public requiredDoc: boolean;
  public fieldVisitCheck = false;
  public screeningCheck = false;
  public userConnected: UserEntity;
  public feeRepayment = true;
  public loanChilds: LoanEntity[] = [];
  public completeLoanDataNext = true;
  @ViewChild(LoanProcessComponent, { static: true }) processComponent: LoanProcessComponent;
  @ViewChild(CustomerNotesComponent, { static: true }) noteComponent: CustomerNotesComponent;

  /**
   * constructor
   * @param loanDetailsServices LoanDetailsServices
   * @param route ActivatedRoute
   * @param modalService NgbModal
   * @param router Router
   * @param loanSharedService LoanSharedService
   * @param dialog MatDialog
   * @param devToolsServices AcmDevToolsServices
   * @param formBuilder FormBuilder
   * @param translate TranslateService
   * @param dashbordService DashbordServices
   * @param loanApprovalService LoanApprovalService
   * @param acmDevToolsServices AcmDevToolsServices
   * @param gedService GedServiceService
   */
  constructor(public loanDetailsServices: LoanDetailsServices, public route: ActivatedRoute,
              public modalService: NgbModal, public router: Router, public loanSharedService: SharedService,
              public dialog: MatDialog, public devToolsServices: AcmDevToolsServices, public formBuilder: FormBuilder,
              public translate: TranslateService, public dashbordService: DashbordServices,
              public loanApprovalService: LoanApprovalService,
              public acmDevToolsServices: AcmDevToolsServices, public authentificationService: AuthentificationService,
              public gedService: GedServiceService) {
  }

  async ngOnInit() {
    this.devToolsServices.backTop();
    this.pageSize = 5;
    this.page = 1;
    this.loan = this.loanSharedService.getLoan();
    this.loanProcessEntitys = this.loan.loanInstancesDtos;
    this.loanProcessEntitys.forEach(element => {
      if (element.code === this.loan.etapeWorkflow) {
        this.orderProcess = element.orderEtapeProcess;
      }
      if (element.ihmRoot === this.loan.ihmRoot) {
        this.currentStatus = element.code;
      }
      if (element.code === AcmConstants.STATUT_WORKFLOW_FIELD_VISIT) {
        this.fieldVisitCheck = true;
      }
      if (element.code === AcmConstants.STATUT_WORKFLOW_SCREENING) {
        this.screeningCheck = true;
      }
    });
    const searchLoan = new LoanEntity();
    // 0 : load all my task
    searchLoan.statut = this.loan.statut;
    searchLoan.parentId = +this.loan.loanId;
    this.loadLoansByPaginations(searchLoan, 0, 10);

    // load loans count by statut
    this.loadDashbordTabCount();

    // load list status by statut loan
    this.loadFilterStatusWorkflow(searchLoan);

    // load list product by params
    this.loadFilterProduct(searchLoan);
    this.userConnected = this.loanSharedService.getUser();
  }

  /**
   * load count loans for Dashbord Tab
   */
   loadDashbordTabCount() {
    this.dashbordService.countMyLoans().subscribe((data) => { this.loansStatut.myTaskCount = data; });
    this.dashbordService.countNewLoans().subscribe((data) => { this.loansStatut.status1New = data; });
    this.dashbordService.countDraftsLoans().subscribe((data) => { this.loansStatut.status2Drafts = data; });
    this.dashbordService.countPendingApprovalLoans().subscribe((data) => { this.loansStatut.status3AwaitingApproval = data; });
    this.dashbordService.countApprovedLoans().subscribe((data) => { this.loansStatut.status4Approved = data; });
    this.dashbordService.countRejectedLoans().subscribe((data) => { this.loansStatut.status5Rejected = data; });
    this.dashbordService.countCancelledLoans().subscribe((data) => { this.loansStatut.status6Cancelled = data; });
    this.dashbordService.countReviewedLoans().subscribe((data) => { this.loansStatut.status7Correctifs = data; });
  }

  /**
   * load list of loans by paginations
   * @param searchLoan searchLoan
   * @param page page
   * @param pageSize pageSize
   */
  async loadLoansByPaginations(searchLoan: LoanEntity, page: number, pageSize: number) {
    this.loans = [];
    const loanPaginationEntityParms: LoanPaginationEntity = new LoanPaginationEntity();
    loanPaginationEntityParms.params = searchLoan;
    loanPaginationEntityParms.pageSize = pageSize;
    loanPaginationEntityParms.pageNumber = page;
    const loanChild: LoanEntity[] = [];
    await this.dashbordService.loadDashboardByStatusPagination(loanPaginationEntityParms).subscribe(
      (data) => {
        this.loanPaginationEntity = data;
        this.loans.push(this.loan);
        this.loanPaginationEntity.resultsLoans.forEach(element => {
          element.customerNameNoPipe = this.loanSharedService.getCustomerName(element.customerDTO);
          this.loans.push(element);
          loanChild.push(element);
        });
        this.loans.forEach(element => {
          element.approvelAmountGroupe = this.loan.approvelAmount;
        });
        // disable button finish in upload signed agreement if admin fee not payed from one of loan child
        loanChild.forEach(child => {
          this.gedService.getFeeRepayment(child.idAccountExtern).subscribe(
            (feeRepayement) => {
              if (feeRepayement === null) {
                return this.feeRepayment = false;
              }
            }
          );
          // disable button next in complete loan data
          if (this.loan.etapeWorkflow === AcmConstants.STATUT_WORKFLOW_UPDATE_LOAN_DATA) {
            if (!child.updateLoan || !child.customerDTO.updateCustomer) {
              this.completeLoanDataNext = false;
            }
          }
        });

        loanChild.push(this.loanSharedService.getLoanGroupe());
        this.loanSharedService.setLoanChild(loanChild);
      }
    );
  }

  /**
   * load Filter Status Workflow
   * @param searchLoan searchLoan
   */
  async loadFilterStatusWorkflow(searchLoan: LoanEntity) {
    await this.dashbordService.loadFilterStatusWorkflow(searchLoan).subscribe(
      (data) => {
        // mapping data
        this.status = [
          { label: 'All', value: null },
        ];
        data.forEach(element => {
          this.status.push({ label: element.statutLibelle, value: element.statutWorkflow });
        });
      }
    );
  }

  /**
   * load Filter Status Workflow
   * @param searchLoan searchLoan
   */
  async loadFilterProduct(searchLoan: LoanEntity) {
    // load list product by statut loan
    await this.dashbordService.loadFilterProduct(searchLoan).subscribe(
      (data) => {
        // mapping data
        this.products = [
          { label: 'All', value: null },
        ];
        data.forEach(element => {
          this.products.push({ label: element.productDescription, value: element.productDescription });
        });
      }
    );
  }

  /**
   * rejectModale : open reject modal
   * @param contentReject modal
   */
  public rejectModal(contentReject) {
    this.settingMotifRejetsEntity.categorie = AcmConstants.REJECT_CATEGORIE;
    this.loanDetailsServices.getReason(this.settingMotifRejetsEntity).subscribe(
      (data) => {
        this.settingMotifRejetsEntitys = data;
      }
    );
    this.createFormReject();
    this.confirm = false;
    this.modalService.open(contentReject, {
      size: 'md'
    });
  }

  /**
   * Methode to next step
   */
  async nextStep() {
    const etapeAddDocument = this.loanSharedService.getLoan().statutWorkflow;
    if ((this.loan.statutWorkflow === AcmConstants.STATUT_WORKFLOW_ADD_DOCUMENTS)
      || (this.loan.statutWorkflow === AcmConstants.STATUT_WORKFLOW_SCREENING)) {
      this.finish().then(() => {
        if ((etapeAddDocument === this.loanSharedService.getLoan().statutWorkflow) &&
          (etapeAddDocument === AcmConstants.STATUT_WORKFLOW_ADD_DOCUMENTS)) {
          this.devToolsServices.openToast(3, 'waring.required_document');
        }
      });
    } else {
      this.loans.forEach(element => {
        element.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT;
      });
      await this.loanDetailsServices.validateAll(this.loans).toPromise().then(
        (data) => {
          data.forEach(element => {
            if (element.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
              this.loanSharedService.setLoanGroupe(element);
              this.loanSharedService.setLoan(element);
              this.ngOnInit();
              this.processComponent.ngOnInit();
              this.router.navigate([AcmConstants.CUSTOMER_GROUPE_URL]);
            }
          }
          );
        });
    }
  }

  /**
   * submitStep for screening and field visit
   */
  async submitStep() {
    if (this.loan.statutWorkflow === AcmConstants.STATUT_WORKFLOW_SCREENING) {
      this.loans.forEach(element => {
        this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE;
      });
      await this.loanDetailsServices.validate(this.loan).toPromise().then(
        (data) => {
          this.loanSharedService.setLoan(data);
          this.loanSharedService.setLoanGroupe(data);
          this.router.navigate([AcmConstants.DASHBOARD_URL]);
        });
    } else if (this.loan.statutWorkflow === AcmConstants.STATUT_WORKFLOW_REVIEW) {
      await this.loanDetailsServices.validateAll(this.loans).toPromise().then(
        (data) => {
          data.forEach(element => {
            if (element.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
              this.loanSharedService.setLoan(element);
              this.loanSharedService.setLoanGroupe(element);
              this.router.navigate([AcmConstants.DASHBOARD_URL]);
            }
          });
        });
    } else {
      this.loans.forEach(element => {
        element.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT;
      });
      await this.loanDetailsServices.validateAll(this.loans).toPromise().then(
        (data) => {
          data.forEach(element => {
            if (element.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
              this.loanSharedService.setLoan(element);
              this.loanSharedService.setLoanGroupe(element);
              this.router.navigate([AcmConstants.DASHBOARD_URL]);
            }
          });
        });
    }
  }

  /**
   * Methode reject : Reject loan
   */
  async reject() {
    this.loans.forEach(element => {
      element.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_REJECT;
    });
    await this.loanDetailsServices.validateAll(this.loans).toPromise().then(
      (data) => {
        data.forEach(element => {
          if (element.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
            this.loanSharedService.setLoan(element);
            this.loanSharedService.setLoanGroupe(element);
            this.router.navigate([AcmConstants.DASHBOARD_URL]);
          }
        });
      });
  }

  /**
   * Methode review : review loan
   */
  async review() {
    this.loans.forEach(element => {
      element.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_REVIEW;
      element.confirm = this.confirmReview;
    });
    this.modalService.dismissAll();
    await this.loanDetailsServices.validateAll(this.loans).toPromise().then(
      (data) => {
        data.forEach(element => {
          if (element.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
            this.loanSharedService.setLoan(element);
            this.loanSharedService.setLoanGroupe(element);
            this.router.navigate([AcmConstants.DASHBOARD_URL]);
          }
        });
      });
  }

  /**
   * Methode exit
   */
  exit() {
    this.devToolsServices.openConfirmationDialog(AcmConstants.EXIT_FORM_MSG, AcmConstants.DASHBOARD_URL);
  }

  /**
   * createForm : create Form Reject
   */
  createFormReject() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required],
      note: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }

  /**
   * createForm : create Form Review
   */
  createFormReview() {
    this.reviewForm = this.formBuilder.group({
      reason: ['', Validators.required],
      note: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }

  /**
   * Methode to create form to be reviewed
   * @param comments comments
   */
  createFormToBeReview() {
    this.toBeReviewForm = this.formBuilder.group({
      comments: ['', Validators.required]
    });
  }

  /**
   * Methode create Form recommand
   */
  createFormRecommand() {
    this.recommandForm = this.formBuilder.group({
      reason: ['', Validators.required],
      note: ['', Validators.required],
      confirm: ['', Validators.required]
    });
  }

  /**
   * Methode to create form Decline
   */
  createFormDecline() {
    this.declineForm = this.formBuilder.group({
      reason: ['', Validators.required],
      confirm: ['', Validators.required],
      note: ['', Validators.required],
    });
  }

  /**
   * Methode to create form agree
   * @param comments comments
   */
  createFormAgree() {
    this.agreeForm = this.formBuilder.group({
      comments: ['', Validators.required]
    });
  }

  /**
   * Methode to create form approve
   * @param comments comments
   */
  createFormApprove() {
    this.approveForm = this.formBuilder.group({
      comments: ['', Validators.required]
    });
  }

  /**
   * onSubmitReject : submit form reject
   */
  onSubmitReject() {
    if (this.rejectForm.valid) {
      this.loan.confirm = this.confirm;
      this.loan.note = this.rejectForm.value.reason.libelle;
      this.loan.note = this.loan.note + ' : ' + this.rejectForm.value.note;
      this.loan.codeExternMotifRejet = this.rejectForm.value.reason.codeExternal;
      this.reject();
      this.modalService.dismissAll();
    }
  }

  /**
   * onSubmitReview : submit form review
   */
  onSubmitReview() {
    this.loan.note = this.reviewForm.value.reason.libelle;
    this.loan.note = this.loan.note + ' : ' + this.reviewForm.value.note;
    this.loan.codeExternMotifRejet = this.reviewForm.value.reason.codeExternal;
    if (this.reviewForm.valid) {
      this.loan.confirm = this.confirmReview;
      this.modalService.dismissAll();
      this.review();
    }
  }

  /**
   * Methode createForm recommand
   */
  onSubmitRecommand() {
    this.loan.note = this.recommandForm.value.reason.libelle;
    this.loan.note = this.loan.note + ' : ' + this.recommandForm.value.note;
    this.loan.codeExternMotifRejet = this.recommandForm.value.reason.codeExternal;
    if ((this.recommandForm.valid) && (this.checkModalRecommend)) {
      this.loan.confirm = this.confirmRecommend;
      this.recommand();
    }
  }

  /**
   * Methode onSubmitDecline : Decline loan
   */
  onSubmitDecline() {
    this.loan.note = this.declineForm.value.reason;
    this.loan.note = this.loan.note + ' : ' + this.declineForm.value.note;
    this.loan.codeExternMotifRejet = this.declineForm.value.reason.codeExternal;
    if (this.declineForm.valid && this.confirmDecline) {
      this.loan.confirm = this.confirmDecline;
      this.decline();
    }
  }

  /**
   * Methode changeChecboxReject
   */
  changeChecboxReject($event: Event) {
    if (this.confirm === false) {
      this.confirm = true;
    } else {
      this.confirm = false;
      this.rejectForm.controls.confirm.setValue('');
    }
  }

  /**
   * Methode changeChecboxRecommand
   */
  changeChecboxRecommand() {
    if (this.confirmRecommend === false) {
      this.confirmRecommend = true;
    } else {
      this.confirmRecommend = false;
      this.recommandForm.controls.confirm.setValue('');
    }
  }

  /**
   * Methode changeChecboxReview
   */
  changeChecboxReview() {
    if (this.confirmReview === false) {
      this.confirmReview = true;
    } else {
      this.confirmReview = false;
      this.reviewForm.controls.confirm.setValue('');
    }
  }

  /**
   * Methode changeChecboxDecline
   */
  changeChecboxDecline($event: Event) {
    if (this.confirmDecline === false) {
      this.confirmDecline = true;
    } else {
      this.confirmDecline = false;
      this.declineForm.controls.confirm.setValue('');
    }
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }

  /**
   * methode to open the popup create new
   * param content
   */
  toBeReviewModel(contentToBeReview) {
    this.createFormToBeReview();
    this.modalService.open(contentToBeReview, {
      size: 'md'
    }).result.then((result) => {
    });
  }

  /**
   * methode to open the popup create new
   * param content
   */
  agreeModel(contentToBeReview) {
    this.createFormAgree();
    this.modalService.open(contentToBeReview, {
      size: 'md'
    }).result.then((result) => {
    });
  }

  /**
   * methode to open the popup create new
   * param content
   */
  approveModel(contentApprove) {
    this.createFormApprove();
    this.loanApprovalService.getProduct(this.loan.productId).subscribe(
      (data) => {
        this.product = data;
      });
    this.modalService.open(contentApprove, {
      size: 'md'
    }).result.then((result) => {
    });
  }

  /**
   * Methode toBeReview : toBeReview loan
   */
  async toBeReview() {
    if (this.toBeReviewForm.valid) {
      this.loan.contactDateCustomerDecision = this.contactDate;
      this.loan.commentsCustomerDecision = this.toBeReviewForm.value.comments;
      this.loans.forEach(element => {
        element.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_ASK_FOR_REVIEW;
      });
      this.modalService.dismissAll();
      await this.loanDetailsServices.validateAll(this.loans).toPromise().then(
        (data) => {
          data.forEach(element => {
            if (element.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
              this.loanSharedService.setLoan(element);
              this.loanSharedService.setLoanGroupe(element);
              this.router.navigate([AcmConstants.DASHBOARD_URL]);
            }
          });
        });
    }
  }

  /**
   * reviewModal : open Review modal
   * @param contentReview modal
   */
  async reviewModal(contentReview) {
    this.modalService.open(contentReview, {
      size: 'md'
    });
    this.createFormReview();
    this.confirmReview = false;
    this.settingMotifReviewEntity.categorie = AcmConstants.REVIEW_CATEGORIE;
    await this.loanDetailsServices.getReason(this.settingMotifReviewEntity).toPromise().then(
      (data) => {
        this.settingMotifReviewEntitys = data;
      }
    );
  }

  /**
   * recommendModel : open recommend modal
   * @param content modal
   */
  async recommendModel(contentRecommend) {
    this.modalService.open(contentRecommend, {
      size: 'md'
    });
    this.createFormRecommand();
    this.confirmRecommend = false;
    this.settingMotifRecommendEntity.categorie = AcmConstants.RECOMMEND_CATEGORIE;
    await this.loanDetailsServices.getReason(this.settingMotifRecommendEntity).toPromise().then(
      (data) => {
        this.settingMotifRecommendEntitys = data;
      }
    );
    this.checkModalRecommend = true;
  }

  /**
   * Methode to next step
   */
  async recommand() {
    this.modalService.dismissAll();
    this.loans.forEach(element => {
      element.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_NEXT;
    });
    await this.loanDetailsServices.validateAll(this.loans).toPromise().then(
      (data) => {
        data.forEach(element => {
          if (element.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
            this.loanSharedService.setLoan(element);
            this.loanSharedService.setLoanGroupe(element);
          }
          this.router.navigate([AcmConstants.DASHBOARD_URL]);
        });
      });
  }

  /**
   * Open model decline modal.
   * @param content modal input
   */
  async declineModel(contentDecline) {
    this.createFormDecline();
    this.modalService.open(contentDecline, {
      size: 'md'
    });
    this.confirmDecline = false;
    this.settingMotifDeclineEntity.categorie = AcmConstants.DECLINE_CATEGORIE;
    await this.loanDetailsServices.getReason(this.settingMotifDeclineEntity).toPromise().then(
      (data) => {
        this.settingMotifDeclineEntitys = data;
      });
  }

  /**
   * Methode decline : decline loan
   */
  async decline() {
    if (this.declineForm.valid) {
      this.loan.contactDateCustomerDecision = this.contactDate;
      this.loan.commentsCustomerDecision = this.declineForm.value.comments;
      this.loans.forEach(element => {
        element.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_DECLINED;
      });
      this.modalService.dismissAll();
      await this.loanDetailsServices.validateAll(this.loans).toPromise().then(
        (data) => {
          data.forEach(element => {
            if (element.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
              this.loanSharedService.setLoan(element);
              this.loanSharedService.setLoanGroupe(element);
              this.router.navigate([AcmConstants.DASHBOARD_URL]);
            }
          });
        });
    }
  }

  /**
   * Methode agree : agree loan
   */
  async agree() {
    if (this.agreeForm.valid) {
      this.loans.forEach(element => {
        element.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_AGREED;
        element.contactDateCustomerDecision = this.contactDate;
        element.commentsCustomerDecision = this.agreeForm.value.comments;
      });
      this.modalService.dismissAll();
      await this.loanDetailsServices.validateAll(this.loans).toPromise().then(
        (data) => {
          data.forEach(element => {
            if (element.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
              if (element.listMissingData !== [''] && element.listMissingData !== null) {
                this.devToolsServices.openToast(2, 'alert.review-msg');
                this.router.navigate([AcmConstants.DASHBOARD_URL]);
              } else {
                this.loanSharedService.setLoan(element);
                this.loanSharedService.setLoanGroupe(element);
                this.router.navigate([AcmConstants.DASHBOARD_URL]);
              }
            }
          });
        });
    }
  }

  /**
   * Methode to next step
   */
  async approve() {
    if (this.approveForm.valid) {
      this.loan.contactDateCustomerDecision = this.contactDate;
      this.loan.commentsCustomerDecision = this.approveForm.value.comments;
      this.loans.forEach(element => {
        element.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE;
        element.approvelAmountGroupe = this.loan.approvelAmount;
        element.confirm = true;
      });
      this.modalService.dismissAll();
      await this.loanDetailsServices.validateAll(this.loans).toPromise().then(
        (data) => {
          data.forEach(element => {
            if (element.customerType === AcmConstants.CUSTOMER_TYPE_COMMUNITY_SOLIDARITY) {
              this.loanSharedService.setLoan(element);
              this.loanSharedService.setLoanGroupe(element);
              this.router.navigate([AcmConstants.DASHBOARD_URL]);
            }
          });
        });
    } else {
      this.acmDevToolsServices.openToast(1, 'error.ACM-00009');
      this.modalService.dismissAll();
    }
  }

  /**
   * Methode to next step
   */
  async finish() {
    this.loans.forEach(element => {
      this.loan.workflowNextAction = AcmConstants.WORKFLOW_REQUEST_ACTION_APPROVE;
    });
    await this.loanDetailsServices.validate(this.loan).toPromise().then(
      (data) => {
        this.loanSharedService.setLoan(data);
        this.loanSharedService.setLoanGroupe(data);
        this.ngOnInit();
        this.processComponent.ngOnInit();
        this.noteComponent.ngOnInit();
        this.router.navigate([AcmConstants.CUSTOMER_GROUPE_URL]);
      });
  }

  /**
   * reset when popup closed
   */
  reset() {
    this.createFormApprove();
  }

}
