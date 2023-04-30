import { CreateProductInputWithId } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { EventStoreService } from '../event-store.service';

@Injectable()
export class ProductsRepository {
  constructor(private eventStoreService: EventStoreService) {}

  async create(createProductInput: CreateProductInputWithId) {
    const product = new Product();

    product.setData(createProductInput);
    product.create();

    return product;
  }

  async findAll() {
    return this.eventStoreService.findMany();
  }

  async findOne(id: string) {
    return await this.eventStoreService.findByIdOrThrow(id);
  }

  async update(id: string, updateProductInput: UpdateProductInput) {
    const product = new Product();

    product.setData(updateProductInput);
    product.update();

    return product;
  }

  async remove(id: string) {
    const product = new Product();

    product.id = id;
    product.remove();

    return product;
  }
}
