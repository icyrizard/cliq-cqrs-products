import { CreateProductInputWithId } from '../../dto/create-product.input';

export class ProductCreatedEvent {
  constructor(public readonly data: CreateProductInputWithId) {}
}
