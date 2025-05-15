import { AddressEntity } from './Address.entity';

export class AddressHistoriqueEntity {
  /** The id. */
  id: number;

  /** The id address ACM. */
  idAddressACM: number;

  /** The old address. */
  oldAddressDTO: AddressEntity;

  /** The new address. */
  newAddressDTO: AddressEntity;

  /** The date insertion. */
  dateInsertion: Date;

  /** The insert by. */
  insertBy: string;

  /** the reason Update. */
  reasonUpdate: string;
}
