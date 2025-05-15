import { SupplierEntity } from './Supplier.entity';

export class AssetEntity {
    id: number;
    supplier : SupplierEntity;
    supplierName : string;
    codeArticle : string;
    dateDebut : Date;
    dateFin: Date;
    libelle : string;
    description : string;
    prixUnitaire : number;
    remiseArticle: number;
    insertBy : string;
    dateInsertion :Date;
    reservedStock: string;
    promotion: number;
    promotionStartDate: Date;
    promotionEndDate: Date;
    tva: number;
    typeAsset: string;
    categoryAsset: string;
    subCategoryAsset: string;
    mesure: string;
    unite: string;
}
