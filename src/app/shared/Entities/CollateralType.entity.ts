
import { ProductEntity } from './product.entity';
export class LoanCollateralTypeEntity {
    /** id */
    id: number;
    /** code */
    code: string;
    /** description */
    description: string;
    /** collectionPourcentage */
    collectionPourcentage: number;
    /** collectionCost */
    collectionCost: number;
    /** overrideCollectionData */
    overrideCollectionData: boolean;
    /** products */
    products: ProductEntity[];
    /** enabled */
    enabled: boolean;
    /** default */
    default: boolean;
    /** linkToAccount */
    linkToAccount: boolean;
    /** idExtern */
    idExtern: number;
     /** productIds */
    productIds: string;
    constructor() {
    }
}
