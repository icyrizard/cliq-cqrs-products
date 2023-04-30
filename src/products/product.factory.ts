import { CreateProductInput } from './dto/create-product.input';
import { ProductsRepository } from './products.repository';
import { Product } from '@prisma/client';
import { AggregateObject } from './entities/AggregateObject';

export class ProductFactory {
  constructor(private readonly productRepository: ProductsRepository) {}

  async create(input: CreateProductInput) {
    const newProduct = await this.productRepository.create(input);

    const productAggregate = new AggregateObject<Product>(newProduct);

    return productAggregate;
  }
}
