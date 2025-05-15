import { IncomeDetailsEntity } from './../../../shared/Entities/IncomeDetailsInformation.entity';
import { Component, Input, OnInit } from '@angular/core';
import { ExpensesLiabilitiesEntity } from 'src/app/shared/Entities/ExpensesLiabilitiesInformation.entity';

import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { loanAdditionalInformationEntity } from 'src/app/shared/Entities/loanAdditionalInformation.entity';
import { PersonalInformationEntity } from 'src/app/shared/Entities/personalInformation.entity';
import { WorkInformationEntity } from 'src/app/shared/Entities/workInformation.entity';
import { SharedService } from 'src/app/shared/shared.service';
import { ScreeningStepService } from '../screening-step/screening-step.service';
import { ThirdPartyHistoriqueEntity } from 'src/app/shared/Entities/thirdPartyHistorique.entity';
import { AcmConstants } from 'src/app/shared/acm-constants';

@Component({
  selector: 'app-other-information-loan',
  templateUrl: './other-information-loan.component.html',
  styleUrls: ['./other-information-loan.component.sass']
})
export class OtherInformationLoanComponent implements OnInit {
  public loanApplicationData: loanAdditionalInformationEntity = new loanAdditionalInformationEntity();
  public personalInformation: PersonalInformationEntity = new PersonalInformationEntity();
  public workInformation : WorkInformationEntity = new WorkInformationEntity;
  public incomeDetails: IncomeDetailsEntity = new IncomeDetailsEntity();
  public expensesLiabilities: ExpensesLiabilitiesEntity = new ExpensesLiabilitiesEntity();
  @Input() expanded;
  public loan: LoanEntity;
  public thirdPartyHistoriques: ThirdPartyHistoriqueEntity[] = [];
  public jsonDataDakhli:any;
  public jsonDataMofeed:any;
  public isInformationMofeed:boolean=true;
  public kycScore:number=0;


  constructor(public sharedService: SharedService,public screeningStepService: ScreeningStepService) { }

  ngOnInit(): void {
    this.loan = this.sharedService.getLoan();
    this.loanApplicationData = JSON.parse(this.loan.otherInformations);
  if (this.loanApplicationData){
  this.personalInformation = this.loanApplicationData.personalInformation;
  this.workInformation = this.loanApplicationData.workInformation;
  this.incomeDetails = this.loanApplicationData.incomeDetails;
  this.expensesLiabilities = this.loanApplicationData.expensesLiabilities;
}


const thirdPartyHistorique = new ThirdPartyHistoriqueEntity();
    thirdPartyHistorique.categoryList=[AcmConstants.MOFEED_THIRDPARTY, AcmConstants.DAKHLI_THIRDPARTY, AcmConstants.KYC_SCORE];
    thirdPartyHistorique.idLoan=this.loan.loanId
    thirdPartyHistorique.status ='200'
     this.screeningStepService.thirdPartyHistorique(thirdPartyHistorique).subscribe(
      (data) => {
        this.thirdPartyHistoriques = data;
        if (this.thirdPartyHistoriques.length > 0) {

          if(this.thirdPartyHistoriques[0].category==AcmConstants.KYC_SCORE)
            {
             this.kycScore=this.thirdPartyHistoriques[0].score;
            }

          if(this.thirdPartyHistoriques[0].category==AcmConstants.DAKHLI_THIRDPARTY)
          {
            this.isInformationMofeed=false;
            // Parse the JSON string
           this.jsonDataDakhli = JSON.parse(this.thirdPartyHistoriques[0].responseValue);
          }
          else
          {
          this.jsonDataMofeed=JSON.parse(this.thirdPartyHistoriques[0].responseValue);
          }

        }
      });

  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }
}
