export class CustomerContactEntity {
  /** The ID. */
  id: number;

  /** The from. */
  from: string;

  /** The to. */
  to: string;

  /** The subject. */
  subject: string;

  /** The content. */
  content: string;

  /** The link replay. */
  linkReplay: number;

  /** The read. */
  read: boolean;

  /** The priority. */
  priority: number;

  /** The statut. */
  statut: string;

  /** The customer id. */
  customerId: number;

  /** The name. */
  name: string;

  /** The email. */
  email: string;

  /** The phone. */
  phone: string;

  /** The Sender. */
  sentCustomer: boolean;

  /** The date insertion. */
  dateInsertion: Date;

  /** The loan officer. */
  userName: string;

  constructor() {
  }
}
