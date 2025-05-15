import { Component, OnInit, ViewChild } from '@angular/core';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { ExceptionRequestEntity } from 'src/app/shared/Entities/ExceptionRequest.entity';
import { ExceptionRequestCountEntity } from 'src/app/shared/Entities/ExceptionRequestCount.entity';
import { ExceptionRequestPaginationEntity } from 'src/app/shared/Entities/ExceptionRequestPagination.entity';
import { ExceptionRequestService } from './exception-request.service';
const PrimaryBleu = 'var(--primary)';
@Component({
  selector: 'app-exception-request',
  templateUrl: './exception-request.component.html',
  styleUrls: ['./exception-request.component.sass']
})
export class ExceptionRequestComponent implements OnInit {
  public exceptionRequestEntityList: ExceptionRequestPaginationEntity = new ExceptionRequestPaginationEntity();
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public count: ExceptionRequestCountEntity = new ExceptionRequestCountEntity();
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,

  };
  constructor(public exceptionRequestService: ExceptionRequestService) { }

  ngOnInit() {
    const requestExceptionParam = new ExceptionRequestEntity();
    requestExceptionParam.statut = AcmConstants.NEW_STATUT_REQUEST;
    this.loadExceptionRequestByPagination(requestExceptionParam, 0, 10);
    this.loadCount();
  }
  changeTabs(event) {
    const searchExceptionRequest = new ExceptionRequestEntity();

    switch (event.index) {
      case 0: {
        searchExceptionRequest.statut = AcmConstants.NEW_STATUT_REQUEST;
        this.loadExceptionRequestByPagination(searchExceptionRequest, 0, 10); break;
      }
      case 1: {
        searchExceptionRequest.statut = AcmConstants.ACCEPTED_STATUT_REQUEST;
        this.loadExceptionRequestByPagination(searchExceptionRequest, 0, 10); break;
      }
      case 2: {
        searchExceptionRequest.statut = AcmConstants.REJECTED_STATUT_REQUEST;
        this.loadExceptionRequestByPagination(searchExceptionRequest, 0, 10); break;
      }
      case 3: {
        searchExceptionRequest.statut = AcmConstants.CANCELLED_STATUT_REQUEST;
        this.loadExceptionRequestByPagination(searchExceptionRequest, 0, 10); break;
      }
      case 4: {
        searchExceptionRequest.statut = AcmConstants.CLOSED_STATUT_REQUEST;
        this.loadExceptionRequestByPagination(searchExceptionRequest, 0, 10); break;
      }
    }
  }

  async loadExceptionRequestByPagination(searchExceptionRequest: ExceptionRequestEntity, page: number, pageSize: number) {
    const exceptionRequestPaginationEntity: ExceptionRequestPaginationEntity = new ExceptionRequestPaginationEntity();
    exceptionRequestPaginationEntity.params = searchExceptionRequest;
    exceptionRequestPaginationEntity.pageSize = pageSize;
    exceptionRequestPaginationEntity.pageNumber = page;
    await this.exceptionRequestService.findExceptionRequestPagination(exceptionRequestPaginationEntity).subscribe((data) => {
      this.exceptionRequestEntityList = data;
    });
  }
  loadCount() {
    this.exceptionRequestService.loadCount().subscribe((data) => {
      this.count = data;
    });
  }
}
