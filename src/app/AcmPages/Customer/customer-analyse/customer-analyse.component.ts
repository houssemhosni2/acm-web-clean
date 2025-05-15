import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from "ngx-loading";
import { CustomerEntity } from "src/app/shared/Entities/customer.entity";
import { UserDefinedFieldsLinksEntity } from "src/app/shared/Entities/userDefinedFieldsLinks.entity";
import { SharedService } from "src/app/shared/shared.service";
import { UdfService } from "../../Loan-Application/udf/udf.service";
import { UDFLinksGroupeFieldsEntity } from "src/app/shared/Entities/udfLinksGroupeFields.entity";
import { LoanEntity } from "../../../shared/Entities/loan.entity";
import { checkOfflineMode } from "src/app/shared/utils";
import { NgxIndexedDBService } from "ngx-indexed-db";

const PrimaryBleu = "var(--primary)";

@Component({
  selector: "app-customer-analyse",
  templateUrl: "./customer-analyse.component.html",
  styleUrls: ["./customer-analyse.component.sass"],
})
export class CustomerAnalyseComponent implements OnInit {
  @ViewChild("ngxLoading") ngxLoadingComponent: NgxLoadingComponent;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryBleu;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
  };

  public loading = false;
  @Input() expanded;
  // 1: Customer 2: Loan  4 : item (generic wf)
  @Input() typeUDF;
  @Input() loanEntity;
  @Input() itemEntity;


  @Input() accountNumberExtern;
  @Input() udfLoans;
  public customer: CustomerEntity = new CustomerEntity();
  public Loan: LoanEntity = new LoanEntity();
  public udfLinksGroups: UDFLinksGroupeFieldsEntity[] = [];
  public loadedData = false;

  /**
   *
   * @param udfService udfService
   * @param loanSharedService loanSharedService
   */
  constructor(
    public udfService: UdfService,
    public loanSharedService: SharedService,private dbService: NgxIndexedDBService
  ) {}

  async ngOnInit() {
    if (this.expanded && !this.loadedData) {
      const udfLink = new UserDefinedFieldsLinksEntity();
      if (this.typeUDF === "1") {
        this.customer = this.loanSharedService.getCustomer();
        if(checkOfflineMode()){
          const data = await this.dbService.getByKey('data','getUdfLinkGroupby_' + this.customer.id).toPromise() as any;
          if(data !== undefined){
            this.udfLinksGroups = data.data;
          }
        } else {
        udfLink.elementId = this.customer.id;
        udfLink.category = "CUSTOMER";
        this.udfService.getUdfLinkGroupby(udfLink).subscribe((data) => {
          this.udfLinksGroups = data;
        });
      }
      } else if (this.typeUDF === "2") {
        if(checkOfflineMode()){
          const data = await this.dbService.getByKey('data','getUdfLinkGroupbyLoan_' + this.loanEntity.loanId).toPromise() as any;
          if(data !== undefined){
            this.udfLinksGroups = data.data;
          }
        } else {
        udfLink.elementId = this.loanEntity.loanId;
        udfLink.category = "LOAN";

        this.udfService.getUdfLinkGroupby(udfLink).subscribe((data) => {
          this.udfLinksGroups = data;
        });
      }
      } else if (this.typeUDF === "3") {
        this.udfLinksGroups = this.udfLoans;
      }else if (this.typeUDF === "4") {
        udfLink.elementId = this.itemEntity.id;
        udfLink.category = "ITEM";
        this.udfService.getUdfLinkGroupby(udfLink).subscribe((data) => {
          this.udfLinksGroups = data;
        });
      }
      this.loadedData = true;
    }
  }

  /**
   * toggleCollapse
   */
  toggleCollapse() {
    this.expanded = !this.expanded;
    this.ngOnInit();
  }
}
