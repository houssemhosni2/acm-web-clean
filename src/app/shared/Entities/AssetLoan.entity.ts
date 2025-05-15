import { AssetEntity } from './Asset.entity';

export class AssetLoanEntity {
    id: number;
    asset : AssetEntity;
    idLoan : number;
    prixUnitaire : number;
    remiseArticle: number;
    quantiteArticle: number;
    withholdingTax: number;
    enabled: boolean;
}