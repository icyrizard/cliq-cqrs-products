import { Injectable } from '@nestjs/common';
import { CreateProductInputWithId } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { AggregateRoot, CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './commands/impl/create-product.command';
import { FindAllProductsQuery } from './queries/impl/find-all-products.query';
import { FindByIdProductQuery } from './queries/impl/find-by-id-product.query';
import { UpdateProductCommand } from './commands/impl/update-product.command';
import { RemoveProductCommand } from './commands/impl/remove-product.command';

@Injectable()
export class ProductsService extends AggregateRoot {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
    super();
  }

  async create(createProductInput: CreateProductInputWithId) {
    return await this.commandBus.execute(
      new CreateProductCommand(createProductInput),
    );
  }

  async findAll() {
    return await this.queryBus.execute(new FindAllProductsQuery());
  }

  async findOne(id: string) {
    return await this.queryBus.execute(new FindByIdProductQuery(id));
  }

  async update(updateProductInput: UpdateProductInput) {
    return await this.commandBus.execute(
      new UpdateProductCommand(updateProductInput),
    );
  }

  async remove(id: string) {
    return await this.commandBus.execute(new RemoveProductCommand(id));
  }
}
