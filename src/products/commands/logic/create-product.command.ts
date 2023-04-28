import { CreateProductInput } from '../../dto/create-product.input';

export class CreateProductCommand {
  constructor(public readonly data: CreateProductInput) {}
}
