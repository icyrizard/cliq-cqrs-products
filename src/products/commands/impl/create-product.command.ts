import { CreateProductInputWithId } from '../../dto/create-product.input';

export class CreateProductCommand {
  constructor(public readonly data: CreateProductInputWithId) {}
}
