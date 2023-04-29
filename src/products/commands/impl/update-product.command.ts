import { UpdateProductInput } from '../../dto/update-product.input';

export class UpdateProductCommand {
  constructor(public readonly data: UpdateProductInput) {}
}
