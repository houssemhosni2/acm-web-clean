import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import {ReportVisitEntity} from '../../../../shared/Entities/reportVisit.entity';
import {VisitReportServices} from '../../field-visit/filed-visit-details/visit-report.services';
import {LoanEntity} from '../../../../shared/Entities/loan.entity';
import {SharedService} from 'src/app/shared/shared.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {IDropdownSettings} from 'ng-multiselect-dropdown/multiselect.model';
import {AcmDevToolsServices} from '../../../../shared/acm-dev-tools.services';
import { TranslateService } from '@ngx-translate/core';
import {AppComponent} from '../../../../app.component';

const PrimaryBleu = 'var(--primary)';

@Component({
  selector: 'app-approval-field-visit',
  templateUrl: './approval-field-visit.component.html',
  styleUrls: ['./approval-field-visit.component.sass']
})
export class ApprovalFieldVisitComponent implements OnInit {
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };
  public reportVisitEntitys: ReportVisitEntity[] = [];
  public reportVisitEntity: ReportVisitEntity = new ReportVisitEntity();
  public page: number;
  public pageSize: number;
  public loan: LoanEntity = new LoanEntity();
  public loading = false;
  public selectedReportVisitEntity: ReportVisitEntity;
  configEditor: AngularEditorConfig = {
    editable: false,
    spellcheck: false,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
  };
  public htmlContent: string;
  public users: Array<any>;
  public dropdownSettings: IDropdownSettings = {};
  public datePlannedVisit = new Date().toISOString().substring(0, 10);
  @Input() expanded;
  private loadedData = false;
  /**
   * constructor
   * @param visitReportServices VisitReportServices
   * @param loanSharedService SharedService
   * @param modalService NgbModal
   * @param devToolsServices AcmDevToolsServices
   * @param translate TranslateService
   */
  constructor(public visitReportServices: VisitReportServices,
              public loanSharedService: SharedService,
              public modalService: NgbModal,
              public devToolsServices: AcmDevToolsServices,
              public translate: TranslateService) {
  }

  ngOnInit() {
    if (this.expanded && !this.loadedData) {
      this.loading = true;
      this.translate.get('visit.visit_report').subscribe((text) => { this.configEditor.placeholder = text; });
      this.dropdownSettings.enableCheckAll = false;
      this.pageSize = 5;
      this.page = 1;
      this.loan = this.loanSharedService.getLoan();
      this.reportVisitEntity.idLoan = this.loan.loanId;
      this.visitReportServices.getVisitReport(this.reportVisitEntity).subscribe(
      (data) => {
        // setting loan details
        if (data.length > 0) {
          this.reportVisitEntitys = data;
        }
        this.loading = false;
      });
      this.loadedData = true;
    }
  }

  /**
   * Open model report visit modal.
   * @param content Modal contenet
   * @param reportVisitEntity report visit to display
   */
  openLarge(content, reportVisitEntity: ReportVisitEntity) {
    this.modalService.open(content, {
      size: 'lg'
    });
    this.selectedReportVisitEntity = reportVisitEntity;
    this.htmlContent = this.selectedReportVisitEntity.description;
    this.users = this.loanSharedService.getUsers();
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }

  /**
   * Get Direction
   */
  getDirection() {
    return AppComponent.direction;
  }
}
