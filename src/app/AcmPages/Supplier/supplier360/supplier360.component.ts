import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router} from '@angular/router';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SupplierEntity } from 'src/app/shared/Entities/Supplier.entity';
import { SupplierService } from '../supplier.service';
import { DatePipe } from '@angular/common';
import { SupplierInformationComponent } from '../supplier-information/supplier-information.component';
import { SharedService } from 'src/app/shared/shared.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { AppComponent } from 'src/app/app.component';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';

@Component({
  selector: 'app-supplier360',
  templateUrl: './supplier360.component.html',
  styleUrls: ['./supplier360.component.sass']
})
export class Supplier360Component implements OnInit {
  @ViewChild(SupplierInformationComponent) childComponent: SupplierInformationComponent;
  public supplier: SupplierEntity = new SupplierEntity();
  public supplierParent: SupplierEntity;
  public loansBySupplier : LoanEntity[];

  public informationTab: boolean;
  public articlesList: boolean;
  public conventions: boolean;
  public cooptations: boolean;
  public contributions: boolean;
  public communications: boolean;
  public history: boolean;
  public sumSupplierBalance : number;
  public percentage : number;
  public navigation;
  image: any = '../../../../assets/images/avatars/user.jpg';
  constructor(public translate: TranslateService,
              public router: Router,
              public devToolsServices: AcmDevToolsServices,
              public supplierService : SupplierService,
              public datepipe: DatePipe,
              public route: ActivatedRoute,
              public sharedService : SharedService,
              public modalService: NgbModal
              ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.navigation = params.source;
    });
    this.informationTab = true;
    this.devToolsServices.backTop();
    this.supplier = this.sharedService.getSupplier();
    this.getLoansBySupplier();
  }

  /**
   * reload
   * @param event event
   */
    reload(event) {
      this.supplierParent = event;
      this.ngOnInit();
      this.childComponent.reload();

    }

  changeTab(tab: number) {
    switch (tab) {
      case 1:
        this.informationTab = true;
        this.articlesList = false;
        this.conventions = false;
        this.cooptations = false;
        this.contributions = false;
        this.communications = false;
        this.history = false;
        break;
      case 2:
        this.informationTab = false;
        this.articlesList = true;
        this.conventions = false;
        this.cooptations = false;
        this.contributions = false;
        this.communications = false;
        this.history = false;
        break;
      case 3:
        this.informationTab = false;
        this.articlesList = false;
        this.conventions = true;
        this.cooptations = false;
        this.contributions = false;
        this.communications = false;
        this.history = false;
        break;
      case 4:
        this.informationTab = false;
        this.articlesList = false;
        this.conventions = false;
        this.cooptations = true;
        this.contributions = false;
        this.communications = false;
        this.history = false;
        break;
      case 5:
        this.informationTab = false;
        this.articlesList = false;
        this.conventions = false;
        this.cooptations = false;
        this.contributions = true;
        this.communications = false;
        this.history = false;
        break;
      case 6:
        this.informationTab = false;
        this.articlesList = false;
        this.conventions = false;
        this.cooptations = false;
        this.contributions = false;
        this.communications = true;
        this.history = false;
        break;
      case 7:
        this.informationTab = false;
        this.articlesList = false;
        this.conventions = false;
        this.cooptations = false;
        this.contributions = false;
        this.communications = false;
        this.history = true;
        break;
    }
  }

  /**
   * refresh from relationship tab
   */
    refresh() {
      this.ngOnInit();
    }

  getLoansBySupplier(){
    this.sumSupplierBalance = 0;
    this.supplierService.findLoansBySupplier(this.supplier.id).subscribe((res) => {
      this.loansBySupplier = [...res]
      this.loansBySupplier.forEach( (loan) => {
        this.sumSupplierBalance = this.sumSupplierBalance + loan.balanceSupplier;
      })
      this.percentage = ( this.sumSupplierBalance / Number(this.supplier.objectif) ) * 100;
    })

  }

  exit() {
    if (this.supplierParent !== undefined && this.supplierParent !== null) {
      this.sharedService.setSupplier(this.supplierParent);
      this.supplierDetails(this.supplierParent);
    } else {
      if (this.navigation === 'supplier-list') {
        this.router.navigate([AcmConstants.SUPPLIER_360_URL], { queryParams: { mode: 1 } });
      } else if (this.navigation === 'exception-request') {
        this.router.navigate([AcmConstants.EXCEPTION_REQUESTS_URL]);
      }
    }
  }

  /**
   * supplierDetails open supplier 360
   * @param supplier Supplier
   */
   supplierDetails(supplier) {
    this.supplier = supplier;
    this.sharedService.setSupplier(this.supplier);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([AcmConstants.SUPPLIER_360_URL], {queryParams: {source: 'supplier-list'}});
    });
  }

  /**
   * Get Direction
   */
    getDirection() {
      return AppComponent.direction;
    }

}
