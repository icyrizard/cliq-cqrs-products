import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { AggregateRoot, CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './commands/impl/create-product.command';
import { FindAllProductsQuery } from './queries/impl/find-all-products.query';

@Injectable()
export class ProductsService extends AggregateRoot {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
    super();
  }

  async create(createProductInput: CreateProductInput) {
    return await this.commandBus.execute(
      new CreateProductCommand(createProductInput),
    );
  }

  async findAll() {
    return await this.queryBus.execute(new FindAllProductsQuery());
  }

  async findOne(id: number) {
    return await this.queryBus.execute(new FindAllProductsQuery());
    // return this.productRepository.findOne(id);
  }

  async update(id: number, updateProductInput: UpdateProductInput) {
    // return this.productRepository.update(id, updateProductInput);
  }

  async remove(id: number) {
    // return this.productRepository.remove(id);
  }
}
