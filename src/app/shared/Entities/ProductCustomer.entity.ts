import { CustomerEntity } from "./customer.entity";
import { ProductEntity } from "./product.entity";


export class ProductCustomerEntity {

  constructor(
    public productDTO: ProductEntity,
    public customerDTO: CustomerEntity
  ) { }
} 
