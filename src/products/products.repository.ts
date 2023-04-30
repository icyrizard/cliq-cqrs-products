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

    // return await this.prisma.product.create({
    //   data: createProductInput,
    // });
  }

  async findAll() {
    return this.eventStoreService.findMany();
    // return await this.prisma.product.findMany({
    //   where: query,
    // });
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

    // try {
    //   return await this.prisma.product.delete({
    //     where: {
    //       id: id,
    //     },
    //   });
    // } catch (error) {
    //   throw new ApiError(409, 'Unable to remove this product');
    // }
  }

  // async logEvent(id: number, name: string) {
  //   return await this.prisma.eventLog.create({
  //     data: {
  //       name: name,
  //       modelId: id,
  //       modelName: 'Product',
  //     },
  //   });
  // }
}
