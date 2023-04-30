import { UpdateProductInput } from '../../dto/update-product.input';

export class ProductUpdatedEvent {
  constructor(public readonly data: UpdateProductInput) {}
}
