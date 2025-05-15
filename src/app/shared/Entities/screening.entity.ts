import { CustomerEntity } from './customer.entity';
import { ThirdPartyHistoriqueEntity } from './thirdPartyHistorique.entity';

export class ScreeningEntity {
    /** The customerEntity. */
    customerDTO: CustomerEntity;
    /** The customer category => CUSTOMER / GUARANTOR. */
    customerCategory: string;
    /** The id loan. */
    idLoan: number;
    decision: string;
    /** status */
    status: string;
    /** The third party historique DTO. */
    thirdPartyHistoriqueDTO: ThirdPartyHistoriqueEntity;
}
