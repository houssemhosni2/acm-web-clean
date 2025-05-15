import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AcmCreditLineAssignmentHistory } from 'src/app/shared/Entities/AcmCreditLineAssignmentHistory.entity';
import { CreditLineService } from '../credit-line.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-credit-line-reports',
  templateUrl: './credit-line-reports.component.html',
  styleUrls: ['./credit-line-reports.component.sass']
})
export class CreditLineReportsComponent implements OnInit {

  public reportType: string;
  findCreditLineHistoryForm: FormGroup;

  constructor(public creditLineService: CreditLineService, public devToolsServices: AcmDevToolsServices,
    public modalService: NgbModal, private fb: FormBuilder, public translate: TranslateService) { }

  ngOnInit(): void {
    this.findCreditLineHistoryForm = this.fb.group({
      accountNumber: [],
      historyDate: []
    })
  }


  generateCreditLineSummaryPdfReport(){
    this.creditLineService.generateCreditLineSummaryPdfReport().subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      const formattedDate = new Date().toISOString().slice(0, 10);
      anchor.download = `CREDIT_LINE_SUMMARY_${formattedDate}`;
      anchor.href = url;
      anchor.click();
      this.devToolsServices.openToast(0, 'alert.document_uploaded');
    });
  }

  generateCreditLineSummaryExcelReport(){
    this.creditLineService.generateCreditLineSummaryExcelReport().subscribe((res: any) => {
      const fileData = [res];
      const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      const formattedDate = new Date().toISOString().slice(0, 10);
      anchor.download = `CREDIT_LINE_SUMMARY_${formattedDate}`;
      anchor.href = url;
      anchor.click();
      this.devToolsServices.openToast(0, 'alert.document_uploaded');
    });
  }

  openReportModal(content, type) {
    this.reportType = type;
    this.modalService.open(content, {
      size: 'md'
    });
  }

  generateCreditLineHistoryReport(){
    const accountNumber = this.findCreditLineHistoryForm.controls.accountNumber.value;
    const historyDate = this.findCreditLineHistoryForm.controls.historyDate.value;

    if(!accountNumber && !historyDate){
      this.devToolsServices.openToast(3, 'alert.find_credit_line_history_report');
    }
    else {
      let acmCreditLineAssignmentHistory = new AcmCreditLineAssignmentHistory();
      if(accountNumber){
        acmCreditLineAssignmentHistory.accountNumber = accountNumber;
      }
      if(historyDate) {
        acmCreditLineAssignmentHistory.dateInsertion = historyDate;
      }

      if(this.reportType === "excel"){
        this.creditLineService.generateCreditLineHistoryExcelReport(acmCreditLineAssignmentHistory).subscribe((res: any) => {
          const fileData = [res];
          const blob = new Blob(fileData, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          const formattedDate = new Date().toISOString().slice(0, 10);
          anchor.download = `CREDIT_LINE_HISTORY_${formattedDate}`;
          anchor.href = url;
          anchor.click();
          this.modalService.dismissAll();
          this.findCreditLineHistoryForm.reset();
          this.devToolsServices.openToast(0, 'alert.document_uploaded');
        });
      }
      else if(this.reportType === "pdf"){
        this.creditLineService.generateCreditLineHistoryPdfReport(acmCreditLineAssignmentHistory).subscribe((res: any) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          const formattedDate = new Date().toISOString().slice(0, 10);
          anchor.download = `CREDIT_LINE_HISTORY_${formattedDate}`;
          anchor.href = url;
          anchor.click();
          this.modalService.dismissAll();
          this.findCreditLineHistoryForm.reset();
          this.devToolsServices.openToast(0, 'alert.document_uploaded');
        })
      }

    }
  }

  closeReportModal() {
    this.findCreditLineHistoryForm.reset();
    this.modalService.dismissAll();
  }


  getDirection() {
    return AppComponent.direction;
  }



}
