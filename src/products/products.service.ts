import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { AggregateRoot, CommandBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './commands/logic/create-product.command';

@Injectable()
export class ProductsService extends AggregateRoot {
  constructor(private commandBus: CommandBus) {
    super();
  }

  async create(createProductInput: CreateProductInput) {
    const result = await this.commandBus.execute(
      new CreateProductCommand(createProductInput),
    );

    return result.model;
  }

  async findAll() {
    // return this.productRepository.findAll();
  }

  async findOne(id: number) {
    // return this.productRepository.findOne(id);
  }

  async update(id: number, updateProductInput: UpdateProductInput) {
    // return this.productRepository.update(id, updateProductInput);
  }

  async remove(id: number) {
    // return this.productRepository.remove(id);
  }
}
