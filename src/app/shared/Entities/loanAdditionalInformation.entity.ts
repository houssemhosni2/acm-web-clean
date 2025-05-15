import { ExpensesLiabilitiesEntity } from "./ExpensesLiabilitiesInformation.entity";
import { IncomeDetailsEntity } from "./IncomeDetailsInformation.entity";
import { PersonalInformationEntity } from "./personalInformation.entity";
import { WorkInformationEntity } from "./workInformation.entity";

export class loanAdditionalInformationEntity{
  personalInformation: PersonalInformationEntity;
  workInformation : WorkInformationEntity;
  incomeDetails: IncomeDetailsEntity;
  expensesLiabilities: ExpensesLiabilitiesEntity;

}
