import { CreateProductInput } from './dto/create-product.input';
import { ProductsRepository } from './products.repository';
import { Product } from '@prisma/client';
import { AggregateObject } from './entities/AggregateObject';
import { Injectable } from '@nestjs/common';
import { ProductCreatedEvent } from './events/impl/product-created.event';

@Injectable()
export class ProductFactory {
  constructor(private readonly productRepository: ProductsRepository) {}

  async create(input: CreateProductInput) {
    const newProduct = await this.productRepository.create(input);

    const productAggregate = new AggregateObject<Product>(newProduct);

    productAggregate.apply(new ProductCreatedEvent(productAggregate.data.id));

    console.log('productAggregate', productAggregate);

    return productAggregate;
  }
}
