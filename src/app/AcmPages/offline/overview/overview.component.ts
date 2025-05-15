import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CustomerEntity } from 'src/app/shared/Entities/customer.entity';
import { LoanEntity } from 'src/app/shared/Entities/loan.entity';
import { LoanApprovalService } from '../../Loan-Application/loan-approval/loan-approval.service';
import { LoanManagementService } from '../../Loan-Application/loan-management/loan-management.service';
import { CustomerManagementService } from '../../Customer/customer-management/customer-management.service';
import { GedServiceService } from '../../GED/ged-service.service';
import { AcmDevToolsServices } from 'src/app/shared/acm-dev-tools.services';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerListService } from '../../Customer/customer-list/customer-list.service';
import { AcmConstants } from 'src/app/shared/acm-constants';
import { TranslateService } from '@ngx-translate/core';
import { checkOfflineMode} from 'src/app/shared/utils';
import { CollectionEntity } from 'src/app/shared/Entities/acmCollection.entity';
import { CollectionServices } from '../../Collection/collection.services';
import { UserDefinedFieldsLinksEntity } from 'src/app/shared/Entities/userDefinedFieldsLinks.entity';
import { UdfService } from '../../Loan-Application/udf/udf.service';
import { CollectionNoteEntity } from 'src/app/shared/Entities/CollectionNote.entity';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent implements OnInit {

  elements = [];

  constructor(private dbService: NgxIndexedDBService, private devToolsServices: AcmDevToolsServices,
    private sharedService: SharedService, public translate: TranslateService,
    private collectionServices: CollectionServices,
    private loanApprovalService: LoanApprovalService,public udfService: UdfService, public loanManagementService: LoanManagementService,
    public customerManagementService: CustomerManagementService, public gedService: GedServiceService,) { }

    async ngOnInit(): Promise<void> {

      
      const customers = await this.dbService.getAll('customers').toPromise() as CustomerEntity[];
      this.elements.push({'name': 'Customers','count': customers.length, 'trasnlation':'sidebar.customers', 'index': 'Customers'})

      const prospects = await this.dbService.getAll('prospects').toPromise() as CustomerEntity[];
      this.elements.push({'name': 'Prospects','count': prospects.length, 'trasnlation':'sidebar.liste_prospect', 'index': 'Prospects'})

      let loans = await this.dbService.getAll('loans').toPromise() as LoanEntity[];
      this.elements.push({'name': 'Loans','count': loans.length, 'trasnlation':'sidebar.loan_application', 'index': 'Loans'})

      let collections = await this.dbService.getAll('collections').toPromise() as CollectionEntity[];
      this.elements.push({'name': 'Collections','count': collections.length, 'trasnlation':'sidebar.collections', 'index': 'Collections'})

      // const documentsList = await this.dbService.getAll('documents').toPromise() as any[];
      // this.elements.push({'name': 'Documents','count': documentsList.length, 'trasnlation':'sidebar.loan_application'})
    }

  async syncronize() {
    // let error = false;
    this.synchronizeProspects();

    this.synchronizeCustomers();

    this.synchronizeLoans();

    this.sharedService.synchronizeDocuments(null,null);

    this.synchronizeCollections();
  }

  syncronizeByType(type:string){
    switch (type){
      case 'Customers':
        this.synchronizeCustomers();
        break;
        case 'Loans':
          this.synchronizeLoans();
        break;
        case 'Prospects':
          this.synchronizeProspects();
        break;
        case 'Collections':
          this.synchronizeCollections();
        break;
    }
   }

 async synchronizeProspects(){
  await this.sharedService.synchronizeProspects(null);

  const prospectsIndex = this.elements.findIndex(element => element.index === 'Prospects');
    if (prospectsIndex !== -1) {
      const prospects = await this.dbService.getAll('prospects').toPromise() as CustomerEntity[];
      this.elements[prospectsIndex] = {'name': 'Prospects','count': prospects.length, 'trasnlation':'sidebar.liste_prospect', 'index': 'Prospects'};
    }
 }

async synchronizeCustomers(){
    await this.sharedService.synchronizeCustomers(null);

    const customersIndex = this.elements.findIndex(element => element.index === 'Customers');
    if (customersIndex !== -1) {
      const customers = await this.dbService.getAll('customers').toPromise() as CustomerEntity[];
      this.elements[customersIndex] = {'name': 'Customers','count': customers.length, 'trasnlation':'sidebar.customers', 'index': 'Customers'};
    }
 }

 async synchronizeLoans(){
  let error = false;
  await this.sharedService.synchronizeLoans(null);
  const loansIndex = this.elements.findIndex(element => element.index === 'Loans');
  if (loansIndex !== -1) {
    let loans = await this.dbService.getAll('loans').toPromise() as LoanEntity[];
    for (let i = 0; i < loans.length; i++) {
      let loan: LoanEntity = loans[i];
      try {
        let calclate = await this.dbService.getByKey('calculate-loans', loan.loanId).toPromise() as LoanEntity;

        if (calclate) {
          await this.loanApprovalService.calculateLoanSchedules(calclate).toPromise().then(
            (data) => {
              const schedules = data.loanSchedule;
              let decimal = 1;
              if (loan.productDTO.acmCurrency.decimalPlaces !== null || loan.productDTO.acmCurrency.decimalPlaces !== undefined || loan.productDTO.acmCurrency.decimalPlaces !== 0) {
                decimal = Math.pow(10, loan.productDTO.acmCurrency.decimalPlaces);
              }
              const lastLine = schedules[schedules.length - 1];
              loan.totalInterest = Number(lastLine.interestRepayment);
              const pourcentage = (data.issueAmount
                * loan.productDTO.issueFeePercentage1) / 100;
              const pourcentage2 = (data.issueAmount
                * loan.productDTO.issueFeePercentage2) / 100;
              const feeAmout1 = pourcentage + ((pourcentage
                * loan.productDTO.issueFeeVAT1) / 100) + data.feeAmt1;
              // get application fees amount from API calculate
              loan.feeAmt1 = data.feeAmt1;
              const feeAmout2 = pourcentage2 + ((pourcentage2
                * loan.productDTO.issueFeeVAT2) / 100) + loan.productDTO.issueFeeAmount2;
              switch (loan.productDTO.roundType) {
                case AcmConstants.ROUND_UP:
                  loan.normalPayment = Math.ceil((data.normalPayment + Number.EPSILON) * decimal) / decimal;

                  break;
                case AcmConstants.ROUND_DOWN:
                  loan.normalPayment = Math.floor((data.normalPayment + Number.EPSILON)
                    * decimal) / decimal;
                  break;
                case AcmConstants.ROUND:
                  loan.normalPayment = Math.round((data.normalPayment + Number.EPSILON) * decimal) / decimal;
                  break;
                default:
                  loan.normalPayment = data.normalPayment;
                  break;
              }
              loan.apr = Math.round((data.apr + Number.EPSILON) * 100) / 100;
              loan.issueFeeAmount = feeAmout1 + feeAmout2;
              if (loan.productDTO.flatInterestRate !== 0) {
                loan.productRate = data.interestRate;
              }
            });
        }


        const customer = await this.customerManagementService.getCustomerInformation(Number(loan.customerDTO.id)).toPromise();
        loan.customerDTO = customer;
        this.devToolsServices.openToast(0, `Start saving loan N°${i + 1}/${loans.length}`);

        if (loan.accountNumber && loan.accountNumber.includes('-'))
          await this.loanManagementService.updateLoan(loan).toPromise();
        else
          await this.loanManagementService.createLoan(loan).toPromise();

        this.devToolsServices.openToast(0, `loan N°${i + 1} saved successfully`);
        await this.dbService.delete('loans', loan.loanId).toPromise()
          .then(() => {
            console.log('Document deleted successfully');
          })
          .catch((error) => {
            console.error('Error deleting document:', error);
          });
      } catch (err) {
        error = true;
        console.error(`Error saving loan ${loan.loanId}: `, err);
        this.devToolsServices.openToast(1, `Error saving loan ${loan.loanId}`);
      }
    }



    // sync
    const documentsList = await this.dbService.getAll('documents').toPromise() as any[];

    for (let i = 0; i < documentsList.length; i++) {
      try {
        this.devToolsServices.openToast(0, `Start saving documents N°${i + 1}/${documentsList.length}`);

        await this.gedService.saveListDocuments(documentsList[i].data.uploadedFiles, documentsList[i].data.documentsLoanDTO).toPromise()
          .then((value1) => {
            this.devToolsServices.openToast(0, `document N°${i + 1} saved successfully`);
          })
          .catch((error) => {
            this.devToolsServices.openToast(1, `Error document N°${i + 1} not saved`);
          });

        await this.dbService.delete('documents', documentsList[i].id).toPromise()
          .then(() => {
            console.log('Document deleted successfully');
          })
          .catch((error) => {
            console.error('Error deleting document:', error);
          });
      } catch (err) {
        console.error(`Error saving document ${documentsList[i].id}: `, err);
      }
    
    this.elements[loansIndex] = {'name': 'Loans','count': loans.length, 'trasnlation':'sidebar.loan_application', 'index': 'Loans'};
  }
}
  }
 

 async synchronizeCollections(){
  await this.sharedService.synchronizeCollections(null);
  const collectionsIndex = this.elements.findIndex(element => element.index === 'Collections');
  if (collectionsIndex !== -1) {
    let collections = await this.dbService.getAll('collections').toPromise() as CollectionEntity[];
    this.elements[collectionsIndex] = {'name': 'Collections','count': collections.length, 'trasnlation':'sidebar.collections', 'index': 'Collections'};
      }
 }

  isOfflineModeEnabled() {
    return checkOfflineMode();
  }
}
