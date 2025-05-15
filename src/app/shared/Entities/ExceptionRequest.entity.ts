export class ExceptionRequestEntity {
      id: number;
      makerName: string;
      makerUsername: string;
      customerId: number;
      customerName: string;
      productName: string;
      productId: number;
      productLimit: number;
      allowedAmount: number;
      requestedAmount: number;
      /** 0 : NEW ; 1 : ACCEPTED ; -1 : REJECTED ; -2 :CANCELLED ; 2 : CLOSED */
      statut: number;
      groupOwnerCode: string;
      ownerName: string;
      ownerUsername: string;
      note: string;
      dateInsertion: Date;
      listStatut: number[];
      dateLastUpdate: Date;
      rejectNote: string;
      branchId: number;
    constructor() {
    }
}
