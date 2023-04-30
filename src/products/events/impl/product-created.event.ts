import { Product } from '../../entities/product.entity';
import { AggregateObject } from '../../entities/AggregateObject';

export class ProductCreatedEvent {
  constructor(public readonly product: AggregateObject<Product>) {}
}
